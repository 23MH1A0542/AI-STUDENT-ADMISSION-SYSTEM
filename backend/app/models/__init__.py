from app.core.database import Base
from app.models.user import User
from app.models.course import Course
from app.models.application import Application, Document
from app.models.chat import ChatHistory

# Expose models
__all__ = ["Base", "User", "Course", "Application", "Document", "ChatHistory"]
