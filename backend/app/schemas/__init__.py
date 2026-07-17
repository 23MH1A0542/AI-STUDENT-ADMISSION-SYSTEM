from app.schemas.user import UserCreate, UserUpdate, UserOut, UserLogin
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationStatusUpdate, ApplicationOut, DocumentOut
from app.schemas.chat import ChatCreate, ChatOut
from app.schemas.token import Token, TokenPayload

# Expose schemas
__all__ = [
    "UserCreate", "UserUpdate", "UserOut", "UserLogin",
    "CourseCreate", "CourseUpdate", "CourseOut",
    "ApplicationCreate", "ApplicationUpdate", "ApplicationStatusUpdate", "ApplicationOut", "DocumentOut",
    "ChatCreate", "ChatOut",
    "Token", "TokenPayload"
]
