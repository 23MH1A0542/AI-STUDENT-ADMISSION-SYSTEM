from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List, Any

from app.core.database import get_db
from app.models.application import Application
from app.models.course import Course
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/stats", response_model=Dict[str, Any])
def get_stats(
    admin: Any = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve top-level enrollment and admission metrics (Admin only)"""
    total_apps = db.query(Application).count()
    accepted_apps = db.query(Application).filter(Application.status == "accepted").count()
    rejected_apps = db.query(Application).filter(Application.status == "rejected").count()
    under_review_apps = db.query(Application).filter(Application.status == "under_review").count()
    submitted_apps = db.query(Application).filter(Application.status == "submitted").count()
    
    total_courses = db.query(Course).count()
    active_courses = db.query(Course).filter(Course.is_active == True).count()
    
    return {
        "total_applications": total_apps,
        "accepted": accepted_apps,
        "rejected": rejected_apps,
        "under_review": under_review_apps,
        "submitted": submitted_apps,
        "total_courses": total_courses,
        "active_courses": active_courses
    }

@router.get("/charts/status", response_model=List[Dict[str, Any]])
def get_status_chart_data(
    admin: Any = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve application status distributions for charting (Admin only)"""
    # Group by status
    results = db.query(
        Application.status, 
        func.count(Application.id).label("count")
    ).group_by(Application.status).all()
    
    chart_data = [{"status": r.status, "count": r.count} for r in results]
    
    # Fill in empty statuses to keep charting consistent
    existing_statuses = [r["status"] for r in chart_data]
    for status in ["submitted", "under_review", "accepted", "rejected"]:
        if status not in existing_statuses:
            chart_data.append({"status": status, "count": 0})
            
    return chart_data

@router.get("/charts/department", response_model=List[Dict[str, Any]])
def get_department_chart_data(
    admin: Any = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve application counts grouped by course department (Admin only)"""
    results = db.query(
        Course.department,
        func.count(Application.id).label("count")
    ).join(Application, Course.id == Application.course_id)\
     .group_by(Course.department).all()
     
    return [{"department": r.department, "count": r.count} for r in results]
