import streamlit as st
import requests

st.title("📽️ Follow the Tutor")

uploaded_file = st.file_uploader("Upload a tutorial video (MP4)", type=["mp4"])
if uploaded_file:
    with st.spinner("Processing your video (transcription + frame OCR)..."):
        
        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
        
        response = requests.post("http://localhost:8000/upload-video/", files=files)
        result = response.json()

        st.success("Done!")
        st.subheader("📜 Transcript")
        st.markdown(result.get("transcript", "No transcript found."))

        st.subheader("🖼️ OCR from Key Frames")
        for frame, ocr_text in zip(result.get("frames", []), result.get("ocr", [])):
            st.markdown(f"**{frame}**: {ocr_text}")