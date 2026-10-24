from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.academic import Subject
from app.schemas.academic import SubjectOverviewResponse

router = APIRouter(prefix="/academics", tags=["Academics"])


@router.get("/subjects", response_model=List[SubjectOverviewResponse])
def get_subjects(db: Session = Depends(get_db)):
    """Retrieve all enrolled curriculum subjects for the active semester."""
    subjects = db.query(Subject).all()
    return [
        SubjectOverviewResponse(
            code=s.code,
            name=s.name,
            shortName=s.short_name,
            credits=s.credits,
            type=s.type,
            department=s.department,
            semester=s.semester,
            syllabus=s.syllabus,
            facultyName=s.faculty_name,
            colorCode=s.color_code,
            description=s.description,
        )
        for s in subjects
    ]


@router.get("/subjects/{code}", response_model=SubjectOverviewResponse)
def get_subject_by_code(code: str, db: Session = Depends(get_db)):
    """Retrieve detailed subject information and syllabus units by subject code."""
    subject = db.query(Subject).filter(Subject.code.ilike(code)).first()
    if not subject:
        raise HTTPException(status_code=404, detail=f"Subject with code {code} not found")
    return SubjectOverviewResponse(
        code=subject.code,
        name=subject.name,
        shortName=subject.short_name,
        credits=subject.credits,
        type=subject.type,
        department=subject.department,
        semester=subject.semester,
        syllabus=subject.syllabus,
        facultyName=subject.faculty_name,
        colorCode=subject.color_code,
        description=subject.description,
    )
