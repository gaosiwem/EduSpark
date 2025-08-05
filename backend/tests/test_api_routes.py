import io
import pytest
from fastapi import status, FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.routes import router

# Create a test app and include the router
app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_process_video_success(tmp_path):
    file_content = b"dummy video content"
    file_path = tmp_path / "test.mp4"
    file_path.write_bytes(file_content)
    with patch("api.routes.qa_system.process_video", return_value={"result": "video processed"}):
        with open(file_path, "rb") as f:
            response = client.post(
                "/process-video/",  # Make sure this matches your actual route
                files={"file": ("test.mp4", f, "video/mp4")}
            )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"result": "video processed"}

def test_process_video_failure(tmp_path):
    file_content = b"dummy"
    file_path = tmp_path / "fail.mp4"
    file_path.write_bytes(file_content)
    with patch("api.routes.qa_system.process_video", side_effect=Exception("processing error")):
        with open(file_path, "rb") as f:
            response = client.post(
                "/process-video/",  # Make sure this matches your actual route
                files={"file": ("fail.mp4", f, "video/mp4")}
            )
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json()["detail"] == "processing error"

def test_ask_question_success():
    with patch("api.routes.qa_system.answer_question", return_value={"answer": "mocked answer"}):
        response = client.post(
            "/ask",
            data={"question": "What is AI?"}
        )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"answer": "mocked answer"}