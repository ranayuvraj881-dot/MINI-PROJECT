import uuid
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.resource import StudyResource, PYQItem, TopicAnalysis
from app.models.academic import Subject
from app.models.user import StudentProfile
from app.models.notification import Notification
from app.services.supabase_service import SupabaseService
from app.schemas.resource import (
    StudyResourceResponse,
    PYQItemResponse,
    TopicAnalysisResponse,
    PYQStrategyResponse,
    CreateStudyResourceRequest,
    CreatePYQRequest,
)
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/resources", tags=["Study Resources & PYQs"])



@router.get("/notes", response_model=List[StudyResourceResponse])
def get_notes(
    subject_code: Optional[str] = Query(None, alias="subjectCode"),
    semester: Optional[str] = None,
    unit: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve study resources/notes with flexible filtering by subject, semester, unit, type, and keyword search."""
    query = db.query(StudyResource)

    if subject_code and subject_code != "All":
        query = query.filter(StudyResource.subject_code == subject_code)
    if semester and semester != "All":
        from app.models.academic import Subject
        sub_codes = [s[0] for s in db.query(Subject.code).filter(Subject.semester == semester).all()]
        if sub_codes:
            query = query.filter(StudyResource.subject_code.in_(sub_codes))
    if unit and unit != "All":
        query = query.filter(StudyResource.unit == unit)
    if type and type != "All":
        query = query.filter(StudyResource.type == type)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            StudyResource.title.ilike(s) |
            StudyResource.topic.ilike(s) |
            StudyResource.subject_name.ilike(s)
        )

    records = query.all()
    return [
        StudyResourceResponse(
            id=r.id,
            title=r.title,
            subjectCode=r.subject_code,
            subjectName=r.subject_name,
            unit=r.unit,
            topic=r.topic,
            type=r.type,
            fileSize=r.file_size,
            uploadedDate=r.uploaded_date,
            facultyName=r.faculty_name,
            uploadedBy=r.uploaded_by or r.faculty_name,
            downloadUrl=r.download_url,
            summary=r.summary,
        )
        for r in records
    ]


@router.get("/pyqs", response_model=List[PYQItemResponse])
def get_pyqs(
    subject_code: Optional[str] = Query(None, alias="subjectCode"),
    semester: Optional[str] = None,
    unit: Optional[str] = None,
    year: Optional[int] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve AKTU Previous-Year Questions with filters for semester, unit, year, difficulty, and query."""
    query = db.query(PYQItem)

    if subject_code and subject_code != "All":
        query = query.filter(PYQItem.subject_code == subject_code)
    if semester and semester != "All":
        query = query.filter(PYQItem.semester == semester)
    if unit and unit != "All":
        query = query.filter(PYQItem.unit == unit)
    if year and year > 0:
        query = query.filter(PYQItem.year == year)
    if difficulty and difficulty != "All":
        query = query.filter(PYQItem.difficulty == difficulty)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            PYQItem.question.ilike(s) |
            PYQItem.topic.ilike(s) |
            PYQItem.subject_name.ilike(s)
        )

    records = query.all()
    return [
        PYQItemResponse(
            id=r.id,
            question=r.question,
            subjectCode=r.subject_code,
            subjectName=r.subject_name,
            semester=r.semester,
            year=r.year,
            unit=r.unit,
            examType=r.exam_type,
            difficulty=r.difficulty,
            frequency=r.frequency,
            topic=r.topic,
            marksWeightage=r.marks_weightage,
        )
        for r in records
    ]


@router.get("/pyqs/topics", response_model=List[TopicAnalysisResponse])
def get_topic_analyses(
    subject: Optional[str] = None,
    subject_code: Optional[str] = Query(None, alias="subjectCode"),
    db: Session = Depends(get_db)
):
    """Retrieve AKTU PYQ topic frequency, importance grading, and marks weightage."""
    query = db.query(TopicAnalysis)
    target = subject_code or subject
    if target and target != "All":
        query = query.filter(
            (TopicAnalysis.subject_code == target) |
            (TopicAnalysis.subject_name.ilike(f"%{target}%"))
        )

    records = query.all()
    return [
        TopicAnalysisResponse(
            topic=r.topic,
            subjectCode=r.subject_code,
            subjectName=r.subject_name,
            frequency=r.frequency,
            importance=r.importance,
            unit=r.unit,
            averageMarks=r.average_marks,
            lastAskedYear=r.last_asked_year,
        )
        for r in records
    ]


@router.get("/pyqs/strategy", response_model=PYQStrategyResponse)
async def get_pyq_strategy(
    subject_code: str = Query("KCS-601", alias="subjectCode"),
    db: Session = Depends(get_db)
):
    """Generate high-yield AKTU preparation strategy grounded in verified question patterns."""
    return await GeminiService.generate_pyq_strategy(db, subject_code)


@router.post("/notes", response_model=StudyResourceResponse, status_code=status.HTTP_201_CREATED)
def create_study_resource(
    payload: CreateStudyResourceRequest,
    db: Session = Depends(get_db)
):
    """Teacher uploads a study resource / lecture notes into the database."""
    subject = db.query(Subject).filter(Subject.code == payload.subjectCode).first()
    sub_name = subject.name if subject else "Course Subject"

    unit_val = payload.unit if payload.unit.startswith("Unit") else f"Unit {payload.unit}"

    resource = StudyResource(
        id=f"note-{str(uuid.uuid4())[:8]}",
        title=payload.title,
        subject_code=payload.subjectCode,
        subject_name=sub_name,
        unit=unit_val,
        topic=payload.topic,
        type=payload.type or "PDF",
        file_size=payload.fileSize or "3.4 MB",
        uploaded_date=str(date.today()),
        faculty_name="Dr. Sanjeev Kumar Sharma",
        uploaded_by="Dr. Sanjeev Kumar Sharma",
        download_url=payload.downloadUrl or "https://notesgallery.com/aktu-notes/",
        summary=payload.summary or f"Official lecture resource for {payload.topic} in {sub_name}.",
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    # Broadcast notification to enrolled students
    students = db.query(StudentProfile).limit(10).all()
    for st in students:
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=st.user_id,
            title=f"New Lecture Notes: {payload.title}",
            message=f"Dr. Sanjeev Kumar Sharma uploaded notes for {sub_name} ({unit_val}).",
            category="Academics",
            timestamp_str="Just now",
            read=False,
            action_url="/notes",
        )
        db.add(notif)
    db.commit()

    # Sync to Supabase
    SupabaseService.sync_resource({
        "id": resource.id,
        "title": resource.title,
        "subject_code": resource.subject_code,
        "subject_name": resource.subject_name,
        "unit": resource.unit,
        "topic": resource.topic,
        "type": resource.type,
    })

    return StudyResourceResponse(
        id=resource.id,
        title=resource.title,
        subjectCode=resource.subject_code,
        subjectName=resource.subject_name,
        unit=resource.unit,
        topic=resource.topic,
        type=resource.type,
        fileSize=resource.file_size,
        uploadedDate=resource.uploaded_date,
        facultyName=resource.faculty_name,
        uploadedBy=resource.uploaded_by,
        downloadUrl=resource.download_url,
        summary=resource.summary,
    )


@router.delete("/notes/{note_id}")
def delete_study_resource(
    note_id: str,
    db: Session = Depends(get_db)
):
    """Teacher deletes an uploaded note/resource from the database."""
    resource = db.query(StudyResource).filter(StudyResource.id == note_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return {"success": True, "message": "Resource deleted successfully"}


@router.post("/pyqs", response_model=PYQItemResponse, status_code=status.HTTP_201_CREATED)
def create_pyq(
    payload: CreatePYQRequest,
    db: Session = Depends(get_db)
):
    """Teacher uploads an AKTU Previous-Year Question (PYQ) into the database."""
    subject = db.query(Subject).filter(Subject.code == payload.subjectCode).first()
    sub_name = payload.subjectName or (subject.name if subject else "Course Subject")
    unit_val = payload.unit if payload.unit.startswith("Unit") else f"Unit {payload.unit}"

    year_val = 2024
    if isinstance(payload.year, int):
        year_val = payload.year
    elif isinstance(payload.year, str):
        digits = "".join(c for c in payload.year if c.isdigit())
        if len(digits) >= 4:
            year_val = int(digits[:4])

    pyq = PYQItem(
        id=f"pyq-{str(uuid.uuid4())[:8]}",
        question=payload.question,
        subject_code=payload.subjectCode,
        subject_name=sub_name,
        semester=payload.semester or "Semester VI",
        year=year_val,
        unit=unit_val,
        exam_type=payload.examType or "End-Sem",
        difficulty=payload.difficulty or "Medium",
        frequency=payload.frequency or 1,
        topic=payload.topic,
        marks_weightage=payload.marksWeightage or 10,
    )
    db.add(pyq)
    db.commit()
    db.refresh(pyq)


    # Broadcast notification to enrolled students
    students = db.query(StudentProfile).limit(10).all()
    for st in students:
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=st.user_id,
            title=f"New AKTU PYQ Added: {payload.subjectCode} ({payload.year})",
            message=f"New {payload.marksWeightage}M question on '{payload.topic}' added to the question bank.",
            category="Academics",
            timestamp_str="Just now",
            read=False,
            action_url="/pyqs",
        )
        db.add(notif)
    db.commit()

    return PYQItemResponse(
        id=pyq.id,
        question=pyq.question,
        subjectCode=pyq.subject_code,
        subjectName=pyq.subject_name,
        semester=pyq.semester,
        year=pyq.year,
        unit=pyq.unit,
        examType=pyq.exam_type,
        difficulty=pyq.difficulty,
        frequency=pyq.frequency,
        topic=pyq.topic,
        marksWeightage=pyq.marks_weightage,
    )


@router.delete("/pyqs/{pyq_id}")
def delete_pyq(
    pyq_id: str,
    db: Session = Depends(get_db)
):
    """Teacher deletes a PYQ item from the database."""
    item = db.query(PYQItem).filter(PYQItem.id == pyq_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="PYQ item not found")
    db.delete(item)
    db.commit()
    return {"success": True, "message": "PYQ question deleted successfully"}

