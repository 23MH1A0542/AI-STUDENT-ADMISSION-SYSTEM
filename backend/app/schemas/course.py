from pydantic import BaseModel, ConfigDict
from typing import Optional

class CourseBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    department: str
    credits: int = 3
    capacity: int = 50
    is_active: bool = True

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    department: Optional[str] = None
    credits: Optional[int] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None

class CourseOut(CourseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
