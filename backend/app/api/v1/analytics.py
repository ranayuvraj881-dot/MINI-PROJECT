from typing import Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_student, get_current_user
from app.models.user import StudentProfile, User
from app.schemas.analytics import (
    AcademicRiskReportResponse,
    FacultyOverviewResponse,
    FacultyClassOverviewResponse,
    StudentAttentionItemResponse,
    FacultyStats,
    AdminInstitutionalResponse,
    AdminInstitutionalStats,
    DepartmentMetricItem,
    AdminInsightItem,
)
from app.services.academic_service import AcademicService

router = APIRouter(prefix="/analytics", tags=["Analytics & Academic Risk"])


class TargetCgpaRequest(BaseModel):
    targetCgpa: float


@router.get("/risk", response_model=AcademicRiskReportResponse)
@router.get("/risk-report", response_model=AcademicRiskReportResponse)
def get_academic_risk_report(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve multi-factor academic risk assessment calculated from real database records."""
    return AcademicService.calculate_academic_risk(db, current_student.id)


@router.post("/risk/target", response_model=AcademicRiskReportResponse)
def recalculate_risk_with_target(
    payload: TargetCgpaRequest,
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Recalculate academic risk factors and required grade upgrades against a target CGPA."""
    return AcademicService.calculate_academic_risk(db, current_student.id, target_cgpa=payload.targetCgpa)


@router.get("/faculty", response_model=FacultyOverviewResponse)
def get_faculty_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve faculty class schedule, section attendance rollups, and students requiring attention."""
    classes = [
        FacultyClassOverviewResponse(
            id="f-cls-1",
            subjectName="Database Management Systems",
            subjectCode="KCS-601",
            section="CSE-3B",
            semester="Semester VI",
            totalStudents=68,
            averageAttendance=79.4,
            pendingEvaluations=12,
            nextClassTime="Tomorrow, 09:00 AM",
            room="Room 304, Academic Block 2",
        ),
        FacultyClassOverviewResponse(
            id="f-cls-2",
            subjectName="Database Management Systems Lab",
            subjectCode="KCS-651",
            section="CSE-3B (Batch B1)",
            semester="Semester VI",
            totalStudents=34,
            averageAttendance=84.1,
            pendingEvaluations=4,
            nextClassTime="Thursday, 02:00 PM",
            room="Advanced Database Lab (Lab 4)",
        ),
        FacultyClassOverviewResponse(
            id="f-cls-3",
            subjectName="Advanced Database Systems (Elective)",
            subjectCode="KCS-061",
            section="CSE-3A & 3B",
            semester="Semester VI",
            totalStudents=52,
            averageAttendance=76.8,
            pendingEvaluations=18,
            nextClassTime="Friday, 11:45 AM",
            room="Seminar Hall 1",
        ),
    ]

    attention_students = [
        StudentAttentionItemResponse(
            id="att-stu-1",
            studentName="Aditya Verma",
            rollNo="2101920100018",
            attendance=61.5,
            performance="Average (CIE: 64%)",
            status="Critical Attendance",
            lastActive="Today, 08:30 AM",
        ),
        StudentAttentionItemResponse(
            id="att-stu-2",
            studentName="Priya Sharma",
            rollNo="2101920100095",
            attendance=71.2,
            performance="Low Quiz Scores",
            status="Low Quiz Scores",
            lastActive="Yesterday, 04:15 PM",
        ),
        StudentAttentionItemResponse(
            id="att-stu-3",
            studentName="Rohan Gupta",
            rollNo="2101920100114",
            attendance=68.0,
            performance="Good (CIE: 81%)",
            status="Missing 3 Assignments",
            lastActive="3 days ago",
        ),
    ]

    return FacultyOverviewResponse(
        classes=classes,
        stats=FacultyStats(
            totalStudentsTaught=154,
            activeBatches=3,
            averageClassAttendance=80.1,
            evaluationsDue=34,
        ),
        attentionStudents=attention_students,
    )


@router.get("/admin", response_model=AdminInstitutionalResponse)
@router.get("/admin/institutional", response_model=AdminInstitutionalResponse)
def get_admin_institutional_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve institutional high-level metrics and department-wise academic health summaries."""
    stats = AdminInstitutionalStats(
        totalStudents=4850,
        totalFaculty=240,
        departments=8,
        activeCourses=28,
        averageCampusAttendance=82.6,
        averageCollegeAttendance=82.6,
        academicAverageCgpa=8.24,
        assignmentCompletionRate=91.4,
        insights=[
            AdminInsightItem(
                id="ins-1",
                title="B.Tech CSE Attendance Trend Positive",
                description="Overall semester attendance increased by +3.2% following automated biometric notification triggers.",
                trend="positive",
                department="Computer Science & Engineering",
            ),
            AdminInsightItem(
                id="ins-2",
                title="Pre-University Test (PUT) Exam Readiness",
                description="87.6% of registered students completed Continuous Internal Assessments on schedule.",
                trend="positive",
                department="All Departments",
            ),
            AdminInsightItem(
                id="ins-3",
                title="Sessional 2 Review Required in ECE",
                description="Electronics & Communication recorded lower aggregate lab viva scores in 4th semester batches.",
                trend="warning",
                department="Electronics & Communication",
            ),
        ],
    )

    departments = [
        DepartmentMetricItem(
            code="CSE",
            name="Computer Science & Engineering",
            students=1420,
            faculty=65,
            attendanceAvg=84.2,
            academicHealth="Excellent",
        ),
        DepartmentMetricItem(
            code="IT",
            name="Information Technology",
            students=680,
            faculty=34,
            attendanceAvg=83.0,
            academicHealth="Very Good",
        ),
        DepartmentMetricItem(
            code="ECE",
            name="Electronics & Communication",
            students=740,
            faculty=38,
            attendanceAvg=80.5,
            academicHealth="Good",
        ),
        DepartmentMetricItem(
            code="ME",
            name="Mechanical Engineering",
            students=520,
            faculty=30,
            attendanceAvg=79.8,
            academicHealth="Moderate",
        ),
        DepartmentMetricItem(
            code="MBA",
            name="Management Studies",
            students=450,
            faculty=22,
            attendanceAvg=85.6,
            academicHealth="Excellent",
        ),
    ]

    return AdminInstitutionalResponse(stats=stats, departments=departments)
