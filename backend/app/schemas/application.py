from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from app.schemas.user import UserOut
from app.schemas.course import CourseOut

class DocumentOut(BaseModel):
    id: int
    application_id: int
    filename: str
    file_type: str # transcript, id_proof, recommendation
    file_path: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ApplicationBase(BaseModel):
    course_id: int
    gpa: float = Field(..., ge=0.0, le=4.0) # GPA check
    statement_of_purpose: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    course_id: Optional[int] = None
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    statement_of_purpose: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str # submitted, under_review, accepted, rejected
    reviewer_notes: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    student_id: int
    course_id: Optional[int] = None
    status: str
    gpa: float
    statement_of_purpose: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    student: Optional[UserOut] = None
    course: Optional[CourseOut] = None
    documents: List[DocumentOut] = []

    model_config = ConfigDict(from_attributes=True)
