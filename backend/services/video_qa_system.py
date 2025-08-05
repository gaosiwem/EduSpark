import cv2
import speech_recognition as sr
import tempfile
import os
import numpy as np
import subprocess
from openai import OpenAI
import torch
from dotenv import load_dotenv

load_dotenv()

if torch.cuda.is_available():
    torch.cuda.empty_cache()
    print("CUDA cache emptied at start.")
    
try:
    import moviepy.editor as mp
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    
class VideoQASystem:
    def __init__(self):
        self.video_path = None
        self.transcript = ""
        self.frames = []
        self.frame_timestamps = []
        
        # Initialize OpenAI client ---
        try:
            self.openai_client = OpenAI() # Will pick up API key from OPENAI_API_KEY env var
            self.qa_model_name = "gpt-4o-mini" # Or "gpt-4o", "gpt-3.5-turbo", etc.
            print(f"Initialized OpenAI client with model: {self.qa_model_name}")
        except Exception as e:
            self.openai_client = None
            print(f"Error initializing OpenAI client: {e}. QA functionality will be unavailable.")

        # Initialize Whisper for speech recognition
        if WHISPER_AVAILABLE:
            try:
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                    print("CUDA cache emptied before Whisper model load.")
                
                self.whisper_model = whisper.load_model("base") # "tiny", "base.en", etc.
                print(f"Loaded Whisper model on: {self.whisper_model.device}")

            except Exception as e:
                print(f"Warning: Could not load Whisper model on GPU: {e}. Attempting CPU fallback.")
                try:
                    self.whisper_model = whisper.load_model("base", device="cpu")
                    print("Loaded Whisper model on CPU.")
                except Exception as cpu_e:
                    print(f"Failed to load Whisper on CPU as well: {cpu_e}. Falling back to Google Speech Recognition.")
                    self.whisper_model = None
        else:
            self.whisper_model = None

    def check_ffmpeg_available(self):
        try:
            result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
            return result.returncode == 0
        except Exception:
            return False

    def extract_audio_ffmpeg(self, video_path):
        if not self.check_ffmpeg_available():
            raise RuntimeError("FFmpeg is not installed or not found in system PATH.")
        try:
            audio_path = tempfile.mktemp(suffix=".wav")
            cmd = [
                'ffmpeg', '-i', video_path,
                '-vn', '-acodec', 'pcm_s16le',
                '-ar', '16000', '-ac', '1',
                audio_path, '-y'
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                return audio_path
            else:
                raise RuntimeError(f"FFmpeg error: {result.stderr}")
        except Exception as e:
            raise RuntimeError(f"Error with ffmpeg: {str(e)}")

    def extract_audio_and_transcript(self, video_path):
        try:
            audio_path = None
            # Try MoviePy first
            if MOVIEPY_AVAILABLE:
                try:
                    video = mp.VideoFileClip(video_path)
                    audio_path = tempfile.mktemp(suffix=".wav")
                    video.audio.write_audiofile(audio_path, verbose=False, logger=None)
                    video.close()
                except Exception:
                    audio_path = self.extract_audio_ffmpeg(video_path)
            else:
                audio_path = self.extract_audio_ffmpeg(video_path)

            if not audio_path or not os.path.exists(audio_path):
                raise RuntimeError("Could not extract audio from video. Please install MoviePy or FFmpeg.")

            # Transcribe audio
            if self.whisper_model:
                result = self.whisper_model.transcribe(audio_path)
                transcript = result["text"]
            else:
                r = sr.Recognizer()
                try:
                    with sr.AudioFile(audio_path) as source:
                        audio_data = r.record(source)
                        transcript = r.recognize_google(audio_data)
                except sr.UnknownValueError:
                    transcript = "Could not understand audio"
                except sr.RequestError as e:
                    transcript = f"Error with speech recognition service: {e}"
                except Exception as e:
                    transcript = f"Error processing audio: {str(e)}"

            if audio_path and os.path.exists(audio_path):
                os.unlink(audio_path)

            return transcript

        except Exception as e:
            raise RuntimeError(f"Error extracting audio: {str(e)}")

    def extract_key_frames(self, video_path, max_frames=10):
        try:
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_indices = np.linspace(0, total_frames - 1, max_frames, dtype=int)
            frames = []
            timestamps = []
            for frame_idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if ret:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    frames.append(frame_rgb)
                    timestamp = frame_idx / fps if fps > 0 else 0
                    timestamps.append(timestamp)
            cap.release()
            return frames, timestamps
        except Exception as e:
            raise RuntimeError(f"Error extracting frames: {str(e)}")

    def process_video(self, video_path):
        self.video_path = video_path
        self.transcript = self.extract_audio_and_transcript(video_path)
        self.frames, self.frame_timestamps = self.extract_key_frames(video_path)
        return {
            "transcript": self.transcript,
            "frames_count": len(self.frames),
            "frame_timestamps": self.frame_timestamps
        }

    def answer_question(self, question):
        
        if not self.transcript:
            return {"error": "No transcript available."}
        
        if not self.openai_client:
            return {"error": "OpenAI client not initialized. Check API key and internet connection."}

        try:
            
            messages = [
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided transcript."},
                {"role": "user", "content": f"Here is the transcript: {self.transcript}\n\nQuestion: {question}"}
            ]
            
            response = self.openai_client.chat.completions.create(
                model=self.qa_model_name,
                messages=messages,
                max_tokens=500, # Limit the response length to save costs and avoid overly verbose answers
                temperature=0.7 # Adjust for creativity (0.0 for factual, 1.0 for creative)
            )
            
            answer = response.choices[0].message.content.strip()
            
            return {
                "answer": answer
            }
        except Exception as e:
            return {"error": f"Error answering question: {str(e)}"}