from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_student
from app.models.user import User, StudentProfile
from app.api.v1.auth import _build_profile_response
from app.api.v1.attendance import get_attendance_summary, get_subject_attendances
from app.api.v1.timetable import get_today_classes
from app.api.v1.marks import get_marks_performance
from app.api.v1.analytics import get_academic_risk_report

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
@router.get("/summary")
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Retrieve unified dashboard payload containing student stats, timetable, attendance, marks, and risk."""
    user_profile = _build_profile_response(current_user)
    att_summary = get_attendance_summary(current_student=current_student, db=db)
    subject_att = get_subject_attendances(current_student=current_student, db=db)
    today_tt = get_today_classes(db=db)
    marks_perf = get_marks_performance(current_student=current_student, db=db)
    risk_rep = get_academic_risk_report(current_student=current_student, db=db)

    return {
        "user": user_profile,
        "attendanceSummary": att_summary,
        "subjectAttendance": subject_att,
        "todayClasses": today_tt,
        "subjectMarks": marks_perf.subjectMarks,
        "marksInsights": marks_perf.insights,
        "academicRiskReport": risk_rep,
    }
