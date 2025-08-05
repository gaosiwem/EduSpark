AI-powered tutor that sees and hears your educational videos.

## Features
- Upload MP4 videos
- Transcribe audio using Whisper
- Extract keyframes using ffmpeg
- OCR on video content (EasyOCR)
- Streamlit-based Q&A interface (MVP)

## Run Locally
```bash
git clone https://github.com/yourname/follow-the-tutor.git
cd follow-the-tutor
pip install -r requirements.txt
uvicorn backend.main:app --reload
streamlit run frontend/streamlit_app.py
```

## Docker (optional)
```bash
docker build -t follow-tutor .
docker run -p 8000:8000 follow-tutor
```