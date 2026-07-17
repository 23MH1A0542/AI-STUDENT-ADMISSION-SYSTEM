from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()

@router.get("/", response_model=List[CourseOut])
def get_courses(
    department: Optional[str] = None,
    search: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Retrieve courses catalog. Supports filtering by department, active state, and textual search."""
    query = db.query(Course)
    
    if active_only:
        query = query.filter(Course.is_active == True)
        
    if department:
        query = query.filter(Course.department.ilike(f"%{department}%"))
        
    if search:
        query = query.filter(
            Course.name.ilike(f"%{search}%") | 
            Course.code.ilike(f"%{search}%") |
            Course.description.ilike(f"%{search}%")
        )
        
    return query.all()

@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific course by ID"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    admin: User = Depends(get_current_admin), # requires admin role
    db: Session = Depends(get_db)
):
    """Create a new course record (Admin only)"""
    db_course = db.query(Course).filter(Course.code == course_in.code).first()
    if db_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Course with code {course_in.code} already exists."
        )
    
    course = Course(**course_in.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    course_in: CourseUpdate,
    admin: User = Depends(get_current_admin), # requires admin role
    db: Session = Depends(get_db)
):
    """Update an existing course record (Admin only)"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
        
    update_data = course_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)
        
    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    admin: User = Depends(get_current_admin), # requires admin role
    db: Session = Depends(get_db)
):
    """Delete a course record (Admin only)"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    db.delete(course)
    db.commit()
    return
