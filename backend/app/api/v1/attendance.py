from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_student
from app.models.user import StudentProfile
from app.models.attendance import SubjectAttendance, AttendanceHistoryRecord
from app.schemas.attendance import (
    AttendanceSummaryResponse,
    SubjectAttendanceResponse,
    AttendanceHistoryItem,
    AttendanceSimulationRequest,
    AttendanceSimulationResultResponse,
)
from app.services.academic_service import AcademicService

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.get("/summary", response_model=AttendanceSummaryResponse)
def get_attendance_summary(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve overall attendance statistics calculated dynamically from student records."""
    return AcademicService.get_attendance_summary(db, current_student.id)


@router.get("/subjects", response_model=List[SubjectAttendanceResponse])
def get_subject_attendances(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve subject-wise attendance and past attendance history for the authenticated student."""
    records = (
        db.query(SubjectAttendance)
        .filter(SubjectAttendance.student_id == current_student.id)
        .all()
    )

    result = []
    for r in records:
        history_items = [
            AttendanceHistoryItem(date=h.date, status=h.status)
            for h in r.history
        ]
        result.append(
            SubjectAttendanceResponse(
                subjectCode=r.subject_code,
                subjectName=r.subject_name,
                facultyName=r.faculty_name or "Faculty Incharge",
                totalClasses=r.total_classes,
                attendedClasses=r.attended_classes,
                percentage=r.percentage,
                status=r.status,
                minRequired=r.min_required,
                classesNeededToSafe=r.classes_needed_to_safe,
                classesCanAffordToMiss=r.classes_can_afford_to_miss,
                history=history_items,
            )
        )
    return result


@router.post("/simulate", response_model=AttendanceSimulationResultResponse)
def simulate_attendance(payload: AttendanceSimulationRequest):
    """Calculate prospective attendance percentage and eligibility thresholds based on what-if scenarios."""
    return AcademicService.simulate_attendance(
        current_attended=payload.currentAttended,
        current_total=payload.currentTotal,
        upcoming_classes=payload.upcomingClasses,
        planned_to_attend=payload.plannedToAttend,
    )
