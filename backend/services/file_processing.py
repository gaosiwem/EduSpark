
from hashlib import sha256
import os
import shutil
import tempfile
import uuid
from fastapi import HTTPException, Path, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import Text, select
from sqlalchemy.ext.asyncio import AsyncSession
from PyPDF2 import PdfReader
import docx
import pandas as pd
from services.video_qa_system import VideoQASystem
from urllib.parse import unquote

from database.models import UploadedFile, VideoTranscript

UPLOAD_DIR = "uploads"

async def generate_file_hash(file: UploadFile) -> str:
    content = await file.read()
    file.file.seek(0)
    return sha256(content).hexdigest()

async def upload(user_id: int,file: UploadFile,transcript: str, session: AsyncSession) -> str:
    """
    Save the uploaded file to disk and a DB row; return file_path.
    """
    # rewind in case upstream already read the stream    
    
    try:
        
        # ── rewind & hash ────
        
        await file.seek(0)
        file_hash = await generate_file_hash(file)
        
        # ── duplicate? ───
        
        existing_tx = await session.scalar(
            select(VideoTranscript).where(VideoTranscript.file_hash == file_hash)
        )
        
        if existing_tx:
            existing_file = await session.scalar(
                select(UploadedFile).where(
                    UploadedFile.user_id == user_id,
                    UploadedFile.filename == file.filename,
                )
            )
            return {
                "transcript": existing_tx.transcript,
                "fileName":  unquote(existing_file.filename) if existing_file else unquote(file.filename),
                "filePath":  existing_file.file_path if existing_file else "",
            }
            
        # ── save new file ──
        
        await file.seek(0)
        decoded_name = unquote(file.filename) 
        filename  = f"{uuid.uuid4()}_{decoded_name}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # ── insert rows ──
        new_file = UploadedFile(
            user_id   = user_id,
            filename  = decoded_name,
            file_type = file.content_type,
            file_path = file_path,
        )
        new_tx = VideoTranscript(
            filename   = decoded_name,
            file_hash  = file_hash,
            transcript = transcript,
        )
        
        session.add_all([new_file, new_tx])
        await session.commit()
        
        return {
            "transcript": new_tx.transcript,
            "fileName":  unquote(new_file.filename),
            "filePath":  new_file.file_path,
        }
        
    except Exception as e:
        import traceback, sys
        traceback.print_exc(file=sys.stderr)     # full stack trace
        raise HTTPException(status_code=500, detail=str(e))
        
async def process_document(user_id: int, file: UploadFile, session: AsyncSession):
    
    try:
        suffix = file.filename.split('.')[-1].lower()
        suffix = f".{suffix}"
        content = ""
        data = await file.read()
        
        print(suffix)
        
        if suffix == ".txt":
            content = data.decode("utf-8")
        elif suffix == ".pdf":
            print("inside pdf")
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(data)
                tmp_path = tmp.name
            reader = PdfReader(tmp_path)
            content = "\n".join([page.extract_text() or "" for page in reader.pages])
            os.remove(tmp_path)
            print("outside pdf")
        elif suffix == ".docx":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                tmp.write(data)
                tmp_path = tmp.name
            doc = docx.Document(tmp_path)
            content = "\n".join([p.text for p in doc.paragraphs])
            os.remove(tmp_path)
        elif suffix in [".csv", ".xlsx"]:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(data)
                tmp_path = tmp.name
            if suffix == ".csv":
                df = pd.read_csv(tmp_path)
            else:
                df = pd.read_excel(tmp_path)
            content = df.to_string(index=False)
            os.remove(tmp_path)
        else:
            raise ValueError("Unsupported file format")
                
        return await upload(user_id=user_id, file=file, transcript=content, session=session)    
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

