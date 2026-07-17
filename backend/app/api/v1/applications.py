import os
import shutil
import logging
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings
from app.models.application import Application, Document
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate, DocumentOut
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()
logger = logging.getLogger(__name__)

def simulate_email_notification(to_email: str, subject: str, message: str):
    """Simulates sending an email by logging the transaction."""
    logger.info(f"--- SIMULATED EMAIL SENT ---")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Message: {message}")
    logger.info(f"----------------------------")

@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    application_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new admission application for the active student"""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit applications."
        )

    # Check if student already applied for this course
    existing = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.course_id == application_in.course_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted an application for this course."
        )
        
    application = Application(
        student_id=current_user.id,
        course_id=application_in.course_id,
        gpa=application_in.gpa,
        statement_of_purpose=application_in.statement_of_purpose,
        status="submitted"
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Simulate email to student
    simulate_email_notification(
        to_email=current_user.email,
        subject="Admission Application Submitted Successfully",
        message=f"Dear {current_user.full_name},\n\nYour application for Course ID {application.course_id} has been submitted successfully. We will review it shortly.\n\nBest regards,\nAdmissions Team"
    )
    
    return application

@router.get("/", response_model=List[ApplicationOut])
def get_applications(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List applications. Admins see all applications (with status filter). Students see only their own."""
    query = db.query(Application)
    
    if current_user.role == "admin":
        if status_filter:
            query = query.filter(Application.status == status_filter)
    else:
        query = query.filter(Application.student_id == current_user.id)
        
    return query.order_by(Application.submitted_at.desc()).all()

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve detailed application by ID (Owner student or Admin only)"""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
        
    if current_user.role != "admin" and application.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this application"
        )
        
    return application

@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update admission application status and add reviewer comments (Admin only)"""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
        
    valid_statuses = ["submitted", "under_review", "accepted", "rejected"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of {valid_statuses}"
        )
        
    application.status = status_update.status
    application.reviewer_notes = status_update.reviewer_notes
    application.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    
    # Notify student of status update
    student = application.student
    simulate_email_notification(
        to_email=student.email,
        subject=f"Update on your Admission Application - {application.status.upper()}",
        message=f"Dear {student.full_name},\n\nYour application status has been updated to '{application.status}'.\nReviewer Comments: {application.reviewer_notes or 'None'}\n\nBest regards,\nAdmissions Team"
    )
    
    return application

@router.post("/{application_id}/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def upload_application_document(
    application_id: int,
    file_type: str, # transcript, id_proof, recommendation
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload documents (transcripts, proof of ID) associated with an application (Owner student only)"""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
        
    if current_user.role != "admin" and application.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to upload documents for this application."
        )

    valid_types = ["transcript", "id_proof", "recommendation"]
    if file_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid document type. Must be one of {valid_types}"
        )

    # Define upload path
    app_upload_dir = os.path.join(settings.UPLOAD_DIR, str(application_id))
    os.makedirs(app_upload_dir, exist_ok=True)
    
    # Clean filename
    safe_filename = f"{file_type}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file_path = os.path.join(app_upload_dir, safe_filename)
    
    # Save file locally
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
        
    # Register document in DB
    document = Document(
        application_id=application_id,
        filename=file.filename,
        file_type=file_type,
        file_path=file_path
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return document
