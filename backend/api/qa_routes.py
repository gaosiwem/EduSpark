from fastapi import APIRouter
from models.chat_history import ChatHistory
from pydrantic import BaseModel
from services.rag import query_knowledge_base
from services.qa_engine import query_context
from openai import OpenAI  # Can be replaced with open-source model if needed
from auth.auth_service import get_user_by_email

router = APIRouter(prefix="/qa", tags=["qa"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class QuestionRequest(BaseModel):
    question: str
    
class AnswerResponse(BaseModel):
    answer: str
    
@router.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """Endpoint to ask a question and get an answer from the knowledge base."""
    
    email = "dummy@email.com"
    user = get_user_by_email(email)
    
    answer = query_knowledge_base(request.question)
    
    # // TODO add chat history
    # chat = ChatHistory(user_id=user.id, video_id=data.video_id, question=data.question, answer=answer)
    # db.add(chat)
    # db.commit()
        
    return {"answer": answer }