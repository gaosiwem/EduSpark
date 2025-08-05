import datetime
from hashlib import sha256
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy import Text, desc, select
from gamification.experience_points.game import add_xp, save_quiz_attempt
from services import llm_client
from services import file_processing
from schema_models.schema import ChatMessageResponse, ChatsConversationResponse, QuizResponseSchema, QuizResultPayload, UploadedFileSchema
from database.models import ChatMessage, Conversation, UploadedFile, VideoTranscript, XPQuiz, XPQuizQuestions, XPQuizQuestionsOptions
from database.db import get_async_session
from services.transcribe import transcribe_audio
from services.extract_frames import extract_frames
from services.ocr import run_ocr
from pathlib import Path 
import os
from fastapi import Query
from fastapi.responses import JSONResponse
from services.embedding import vector_store
from api.auth_routes import router as auth_router
from payments.routes import router as payments_router
from services.qa_engine import load_video_knowledge
from services.video_qa_system import VideoQASystem
from sqlalchemy.ext.asyncio import AsyncSession
import tempfile
import shutil
import uuid
import cv2
import numpy as np
from PyPDF2 import PdfReader
import docx
import pandas as pd
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

router = APIRouter()

router.include_router(auth_router)
router.include_router(payments_router, prefix="/api/stripe", tags=["Stripe"])

qa_system = VideoQASystem()
video_store = {}

user_id_tobe_changed = os.getenv("USER_ID")

@router.post("/api/upload-file/")
async def upload_file(file: UploadFile = File(...), session: AsyncSession = Depends(get_async_session)):
    results = await file_processing.process_document(user_id_tobe_changed, file, session)
    
    return results
        

@router.get("/api/user-files/{user_id}", response_model=List[UploadedFileSchema])
async def get_user_files(user_id: int, session: AsyncSession = Depends(get_async_session)):
    query = ( 
             select(UploadedFile)
            .where(UploadedFile.user_id == user_id_tobe_changed)
            .order_by(desc(UploadedFile.uploaded_at))
            )
    result = await session.execute(query)
    return result.scalars().all()

@router.post("/api/process-video/")
async def process_video(files: list[UploadFile] = File(...), session: AsyncSession = Depends(get_async_session)):
    #save uploaded file to a temp location
    results = []
    
    for file in files:
        try:
            suffix = os.path.splitext(file.filename)[-1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(file.file, tmp)                                         
                tmp_path = tmp.name
                
            result = qa_system.process_video(tmp_path)
            os.unlink(tmp_path)
            video_id = str(uuid.uuid4())
            video_store[video_id] = {
                "transcript": qa_system.transcript,
                "frames": qa_system.frames,
                "frame_timestamps": qa_system.frame_timestamps
            }
            results.append({"transcript": qa_system.transcript, "video_id": video_id, "frames_count": result["frames_count"], "frame_timestamps": result["frame_timestamps"]})
           
            # Save the video to the database
            await upload_file(1, file, session)    
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    
    return results    

# @router.post("/api/process-documents/")
# async def process_documents(file: UploadFile = File(...), session: AsyncSession = Depends(get_async_session)):
    
#     results = []
#     try:
        
#         suffix = Path(file.filename).suffix.lower()
#         content = ""
#         data = await file.read()
        
#         if suffix == ".txt":
#             content = data.decode("utf-8")
#         elif suffix == ".pdf":
#             with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
#                 tmp.write(data)
#                 tmp_path = tmp.name
#             reader = PdfReader(tmp_path)
#             content = "\n".join([page.extract_text() or "" for page in reader.pages])
#             os.remove(tmp_path)
#         elif suffix == ".docx":
#             with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
#                 tmp.write(data)
#                 tmp_path = tmp.name
#             doc = docx.Document(tmp_path)
#             content = "\n".join([p.text for p in doc.paragraphs])
#             os.remove(tmp_path)
#         elif suffix in [".csv", ".xlsx"]:
#             with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#                 tmp.write(data)
#                 tmp_path = tmp.name
#             if suffix == ".csv":
#                 df = pd.read_csv(tmp_path)
#             else:
#                 df = pd.read_excel(tmp_path)
#             content = df.to_string(index=False)
#             os.remove(tmp_path)
#         else:
#             raise ValueError("Unsupported file format")
        
#         qa_system.transcript = content
#         results.append({"transcript": content})     
        
#         await file_processing.upload(user_id=1, file=file, transcript=content, session=session)    
    
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)

#     return JSONResponse({"transcript": content})

@router.post("/api/ask_question")
async def ask_question(question: str = Form(...), session: AsyncSession = Depends(get_async_session)):
    response = qa_system.answer_question(question)
    return JSONResponse(content=response)

@router.get("/api/summarize/")
async def summarize(file_path: str = Query(...), session: AsyncSession = Depends(get_async_session)):
    
    print("called summarize")
    query = (
        select(VideoTranscript.transcript) # Select only the transcript directly
        .join(UploadedFile, UploadedFile.filename == VideoTranscript.filename) # INNER JOIN on the common column
        .where(UploadedFile.file_path == file_path) # Filter by the file_path
    )

    result = await session.execute(query)
    transcript_value = result.scalars().first() # Get the single scalar value (the transcript string)

    if transcript_value:
        summary = llm_client.summarize(transcript_value)
        print('summary from ChatGPT')
        return summary
    else:
        print(f"Error: No transcript found for file_path: {file_path}")
        return None

@router.post("/api/send_chat", response_model=ChatMessageResponse)
async def send_chat(data: dict, session: AsyncSession = Depends(get_async_session)):
    user_id = data.get("user_id")
    message = data.get("message")
    conversation_id = data.get("conversation_id")
    
    if not conversation_id:
        # Create a new conversation
        new_convo = Conversation(user_id=user_id)
        new_convo.title = llm_client.create_title(message)
        session.add(new_convo)
        await session.flush()
        conversation_id = new_convo.id
        title = new_convo.title
    else:
        # Fetch existing conversation
        query = select(Conversation).where(Conversation.id == conversation_id)
        conversation_result = await session.execute(query)
        existing_convo = conversation_result.scalars().first()

        if not existing_convo:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        title = existing_convo.title

    # Save user message
    user_message = ChatMessage(
        content=message,
        role="user",
        conversation_id=conversation_id
    )
    session.add(user_message)

    # Generate AI response
    ai_content = llm_client.generate_answer(message)
    ai_message = ChatMessage(
        content=ai_content,
        role="assistant",
        conversation_id=conversation_id
    )
    session.add(ai_message)

    await session.commit()
    await session.refresh(ai_message, attribute_names=["conversation"])

    return ChatMessageResponse(
        role=ai_message.role,
        content=ai_message.content,
        conversation_id=ai_message.conversation_id,
        conversation_title=title,
        timestamp=ai_message.timestamp,
    )

@router.get("/api/get_chats/{user_id}",  response_model=ChatsConversationResponse )
async def get_chats(user_id: int, session: AsyncSession = Depends(get_async_session)):
    
    query = (
        select(ChatMessage)
        .join(Conversation, ChatMessage.conversation_id == Conversation.id)
        .where(Conversation.user_id == user_id_tobe_changed)
        .order_by(desc(ChatMessage.timestamp))
        .options(selectinload(ChatMessage.conversation))
    )

    chat_results = await session.execute(query)
    messages = chat_results.scalars().all()

    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this user")

    validated_msgs = [
        ChatMessageResponse.model_validate({
            "role": msg.role,
            "content": msg.content,
            "conversation_id": msg.conversation_id,
            "conversation_title": msg.conversation.title or "",
            "timestamp": msg.timestamp,
        })
        for msg in messages if msg.conversation is not None
    ]

    return ChatsConversationResponse(chats=validated_msgs)


@router.get("/api/get_conversations/{conversation_id}",  response_model=ChatsConversationResponse)
async def get_conversations(conversation_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    query = (
        select(ChatMessage)
        .join(Conversation, ChatMessage.conversation_id == Conversation.id)
        .where(Conversation.id == conversation_id)
        .options(selectinload(ChatMessage.conversation))
    )

    chat_results = await session.execute(query)
    messages = chat_results.scalars().all()

    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this user")

    validated_msgs = [
        ChatMessageResponse.model_validate({
            "role": msg.role,
            "content": msg.content,
            "conversation_id": msg.conversation_id,
            "conversation_title": msg.conversation.title or "",
            "timestamp": msg.timestamp,
        })
        for msg in messages if msg.conversation is not None
    ]

    return ChatsConversationResponse(chats=validated_msgs)
    

@router.post('/api/xp/{user_id}')
async def award_xp(user_id: uuid.UUID, xp: int = Query(..., ge=1), session: AsyncSession = Depends(get_async_session)):
    return await add_xp(user_id, xp, session)


@router.post("/api/submit_quiz_results")
async def submit_quiz_results(data: QuizResultPayload, session: AsyncSession = Depends(get_async_session)):
    return await save_quiz_attempt(data.user_id, data.model_dump(), session)

@router.post('/api/create_quiz')
async def create_quiz(data: dict, session: AsyncSession = Depends(get_async_session)):
    
    user_id = data.get("user_id")
    subject = data.get("subject")
    grade = data.get("grade")
    fileName = data.get("fileName")
    manual_quiz = data.get("quiz")
    # print(user_id)
    # print(fileName)
    # results = await getTranscript(fileName, session)
    # if not results:
    #     raise HTTPException(status_code=404, detail="You have to add a document to create a quiz")
    # numberOfQuestions = 5
    
    # quiz_data = llm_client.create_quiz(results.transcript, grade, subject, numberOfQuestions)
    
    # quiz_questions = []
    # quiz_option = []
    
    # ## Create a quiz
    
    # title = llm_client.create_title(results.transcript)    
    title = llm_client.create_title(manual_quiz)    
    quiz = XPQuiz(user_id = user_id, title = title, grade = grade, subject = subject)
    session.add(quiz)
    
    await session.commit()
    await session.refresh(quiz)
    
    ## Add quiz questions to a database
    for i, item in enumerate(manual_quiz, 1):
        quiz_question = XPQuizQuestions(quiz_id = quiz.id, question= item['question'])
        session.add(quiz_question)
        await session.commit() 
        await session.refresh(quiz_question)
        
        for key, value in item['options'].items():
            correct = False
            if key == item['correct']:
                correct = True
            
            options = XPQuizQuestionsOptions(question_id=quiz_question.id, 
                                             text = f"  {key}. {value}", 
                                             is_correct = correct)
            session.add(options)
            await session.commit()
            await session.refresh(options)
        # print(f"Question {i}: {item['question']}")
    return quiz
    
    ## Add quiz questions to a database
    
    ## Add quiz options to database
    
    ## Add correct answer and explanation to the database
    
    
    # for data in quiz_data:

        
        
    
    
    # for data in quiz_data:
        
    #     quiz = XPQuiz(
    #         user_id = user_id,
    #         title =llm_client.create_title(transcript),
    #         grade = grade,
    #         subject = subject
    #     )
    #     quiz_objects.append(quiz)
    #     session.add_all(quiz_objects)
        
    # return quiz_objects


@router.get("/api/get_quizzes/{user_id}")
async def get_quizzes(user_id: str, session: AsyncSession = Depends(get_async_session)):
    
    quizzes = await session.scalar(
        select(XPQuiz).where(XPQuiz.user_id == user_id)
    )
    return quizzes

@router.get("/api/get_quiz/{quiz_id}", response_model=QuizResponseSchema)
async def get_quiz(quiz_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    # Get all questions for the quiz
    query = select(XPQuizQuestions).where(XPQuizQuestions.quiz_id == quiz_id)
    results = await session.execute(query)
    quiz_questions = results.scalars().all()

    if not quiz_questions:
        raise HTTPException(status_code=404, detail="No quiz questions found.")

    response = []

    for question in quiz_questions:
        # Get all options for each question
        query_options = (
            select(XPQuizQuestionsOptions)
            .where(XPQuizQuestionsOptions.question_id == question.id)
        )
        results_options = await session.execute(query_options)
        options = results_options.scalars().all()

        # Build the response structure
        question_data = {
            "id": str(question.id),
            "question": question.question,
            "options": [
                {
                    "id": str(option.id),
                    "text": option.text,
                    "is_correct": option.is_correct,
                }
                for option in options
            ],
        }
        response.append(question_data)

    return {"quiz_id": str(quiz_id), "questions": response}
    

async def getTranscript(fileName: str, session: AsyncSession):
    
    transcript = await session.scalar(
        select(VideoTranscript).where(VideoTranscript.filename == fileName)
    )
    return transcript
    
# @router.post("/upload-video/")
# async def upload_video(file: UploadFile = File(...)):
#     """ Endpoint to upload a video file and process it.
#     """
    
#     file_extension = Path(file.filename).suffix.lower()
#     base_filename = Path(file.filename).stem
    
#     print(f"Received file: {file.filename} with extension {file_extension}")
    
#     file_path = f"uploads/{file.filename}"
#     os.makedirs("uploads", exist_ok=True)
#     print(f"Saving uploaded file to {file_path}")
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
        
#     transcript = transcribe_audio(file_path)
#     frames = extract_frames(file_path)
#     ocr_results = [run_ocr(f"frames/{frame}") for frame in frames]
#     load_video_knowledge(transcript, ocr_results)
    
#     return {
#         "transcription": transcript
#     }
    
# @router.post("/add-chunk/")
# async def add_chunk(chunks: list[str]):
#     """ Endpoint to add a chunk of text to the transcription."""
#     # This is a placeholder for the actual implementation.
#     # In a real application, you would save the chunk to a database or file.
#     vector_store.add_text(chunks)
#     return {"message": f"Added {len(chunks)} chunks."}

# @router.get("/query/")
# async def query_ai(query: str = Query(..., description="Question to ask the AI")):
    # """ Endpoint to query the vector store with a search string."""
    # results = vector_store.query(query)
    # return {"results": results}