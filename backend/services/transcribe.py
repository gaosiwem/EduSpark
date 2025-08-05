import whisper

def transcribe_audio(video_path):
    """Transcribe audio from a video file using Whisper.

    Args:
        video_path (str): Path to the video file.      
        """
    model = whisper.load_model("base")
    result = model.transcribe(video_path, language="en")
    return result.get("text", "")