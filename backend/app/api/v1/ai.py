from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from jose import jwt, JWTError

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.course import Course
from app.models.chat import ChatHistory
from app.schemas.chat import ChatCreate, ChatOut
from app.schemas.token import TokenPayload
from app.services.gemini import generate_chatbot_response, generate_course_recommendations, is_ai_configured

router = APIRouter()

class RecommendationRequest(BaseModel):
    gpa: float = Field(..., ge=0.0, le=4.0)
    interests: str
    background: Optional[str] = ""

class RecommendationResponse(BaseModel):
    recommendations: str
    is_mock: bool

def get_optional_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Decodes authorization header if it exists and yields User, else returns None"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            return None
        return db.query(User).filter(User.id == int(token_data.sub)).first()
    except (JWTError, ValueError):
        return None

@router.post("/chat", response_model=ChatOut)
def chat_with_assistant(
    chat_in: ChatCreate,
    request: Request,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Interact with admissions assistant. Logs messages and retrieves conversation 
    history if the user is authenticated.
    """
    history_logs = []
    
    if user:
        # Retrieve last 10 messages of conversation history
        chats = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
                  .order_by(ChatHistory.timestamp.asc())\
                  .limit(10).all()
        for c in chats:
            history_logs.append({"sender": c.sender, "message": c.message})
            
    # Generate bot response
    bot_reply = generate_chatbot_response(prompt=chat_in.message, history=history_logs)
    
    # Save dialog if user is authenticated
    if user:
        user_msg = ChatHistory(user_id=user.id, message=chat_in.message, sender="user")
        bot_msg = ChatHistory(user_id=user.id, message=bot_reply, sender="bot")
        db.add(user_msg)
        db.add(bot_msg)
        db.commit()
        db.refresh(bot_msg)
        return bot_msg
    else:
        # Non-persistent return for guest users
        import datetime
        guest_response = ChatHistory(
            id=-1,
            user_id=None,
            message=bot_reply,
            sender="bot",
            timestamp=datetime.datetime.utcnow()
        )
        return guest_response

@router.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(
    req: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Recommend courses using Gemini based on GPA, interest tags, and academic background"""
    # Fetch all active courses from DB
    courses = db.query(Course).filter(Course.is_active == True).all()
    courses_data = [
        {
            "id": c.id,
            "code": c.code,
            "name": c.name,
            "department": c.department,
            "credits": c.credits,
            "description": c.description
        }
        for c in courses
    ]
    
    student_profile = {
        "gpa": req.gpa,
        "interests": req.interests,
        "background": req.background
    }
    
    recommendation_text = generate_course_recommendations(student_profile, courses_data)
    
    return {
        "recommendations": recommendation_text,
        "is_mock": not is_ai_configured()
    }
