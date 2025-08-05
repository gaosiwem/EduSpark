from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from enum import Enum
from typing import List, Optional

from uuid import UUID

class UserRole(str, Enum):
    STUDENT = "student"
    TUTOR = "tutor"
    ADMIN = "admin"
    
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_str: str = "bearer"
    
class EmailVerification(BaseModel):
    email: EmailStr
    code: str

class TranscriptResponse(BaseModel):
    transcript: str
    frames: List[str]
    ocr: List[str]
   
class SubscriptionStatus(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    
class UploadedFileSchema(BaseModel):
    id: UUID
    user_id: UUID
    file_path: str
    filename: str
    file_type: str
    uploaded_at: datetime

    class Config:
        orm_mode = True
        
   
class ChatMessageResponse(BaseModel):
    role: str
    content: str
    conversation_id: UUID
    conversation_title: Optional[str]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
        
class ChatsConversationResponse(BaseModel):
    chats: List[ChatMessageResponse]
    
class QuizResultPayload(BaseModel):
    user_id: int
    grade: int
    subject: str
    score: int
    total_questions: int
    correct_answers: int
    questions: list
    
class XPQuizOptionSchema(BaseModel):
    id: UUID
    text: str
    is_correct: bool

    class Config:
        orm_mode = True

class XPQuizQuestionSchema(BaseModel):
    id: UUID
    question: str
    options: List[XPQuizOptionSchema]

    class Config:
        orm_mode = True

class QuizResponseSchema(BaseModel):
    quiz_id: UUID
    questions: List[XPQuizQuestionSchema]