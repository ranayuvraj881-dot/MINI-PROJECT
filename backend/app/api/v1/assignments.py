from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_student
from app.models.user import StudentProfile
from app.models.assignment import Assignment, AssignmentSubmission
from app.schemas.assignment import AssignmentResponse, SubmitAssignmentRequest

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.get("", response_model=List[AssignmentResponse])
def get_assignments(
    status_filter: Optional[str] = None,
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve all assignments with student submission status and optional status filtering."""
    assignments = db.query(Assignment).all()
    results = []

    for a in assignments:
        # Check if student has a submission record
        sub = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.assignment_id == a.id,
                AssignmentSubmission.student_id == current_student.id
            )
            .first()
        )

        item_status = sub.status if sub else "Pending"
        submitted_date = sub.submitted_date if sub else None
        marks_obtained = sub.marks_obtained if sub else None
        file_attachment = sub.file_attachment if sub else None

        if status_filter and status_filter.lower() != "all":
            if item_status.lower() != status_filter.lower():
                continue

        results.append(
            AssignmentResponse(
                id=a.id,
                subjectCode=a.subject_code,
                subjectName=a.subject_name,
                title=a.title,
                description=a.description,
                facultyName=a.faculty_name,
                assignedDate=a.assigned_date,
                dueDate=a.due_date,
                status=item_status,
                priority=a.priority,
                submittedDate=submitted_date,
                marksObtained=marks_obtained,
                maxMarks=a.max_marks,
                fileAttachment=file_attachment,
            )
        )

    return results


@router.post("/{assignment_id}/submit", response_model=AssignmentResponse)
def submit_assignment(
    assignment_id: str,
    payload: SubmitAssignmentRequest,
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Submit an assignment and persist submission record into database."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    submission = (
        db.query(AssignmentSubmission)
        .filter(
            AssignmentSubmission.assignment_id == assignment_id,
            AssignmentSubmission.student_id == current_student.id
        )
        .first()
    )

    now_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if not submission:
        submission = AssignmentSubmission(
            id=f"sub-{assignment_id}-{current_student.id}",
            assignment_id=assignment_id,
            student_id=current_student.id,
            status="Submitted",
            submitted_date=now_date,
            file_attachment=payload.fileName or "Submitted_Report_GLBITM.pdf"
        )
        db.add(submission)
    else:
        submission.status = "Submitted"
        submission.submitted_date = now_date
        submission.file_attachment = payload.fileName or "Submitted_Report_GLBITM.pdf"

    db.commit()
    db.refresh(submission)

    return AssignmentResponse(
        id=assignment.id,
        subjectCode=assignment.subject_code,
        subjectName=assignment.subject_name,
        title=assignment.title,
        description=assignment.description,
        facultyName=assignment.faculty_name,
        assignedDate=assignment.assigned_date,
        dueDate=assignment.due_date,
        status="Submitted",
        priority=assignment.priority,
        submittedDate=now_date,
        marksObtained=submission.marks_obtained,
        maxMarks=assignment.max_marks,
        fileAttachment=submission.file_attachment,
    )
