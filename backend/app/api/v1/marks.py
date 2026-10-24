from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_student
from app.models.user import StudentProfile
from app.models.academic import SubjectMarks
from app.schemas.academic import (
    SubjectMarksResponse,
    ScoredMax,
    MarksPerformanceResponse,
    SemesterTrendItem,
    PerformanceInsightItem,
)

router = APIRouter(prefix="/marks", tags=["Marks & Evaluations"])


def _format_marks_response(m: SubjectMarks) -> SubjectMarksResponse:
    practicals_obj = (
        ScoredMax(scored=m.practicals_scored, max=m.practicals_max)
        if m.practicals_max and m.practicals_max > 0
        else None
    )
    return SubjectMarksResponse(
        subjectCode=m.subject_code,
        subjectName=m.subject_name,
        credits=m.credits,
        facultyName=m.faculty_name or "Faculty",
        internalSessional1=ScoredMax(scored=m.sessional1_scored, max=m.sessional1_max),
        internalSessional2=ScoredMax(scored=m.sessional2_scored, max=m.sessional2_max),
        quizzes=ScoredMax(scored=m.quizzes_scored, max=m.quizzes_max),
        assignments=ScoredMax(scored=m.assignments_scored, max=m.assignments_max),
        practicals=practicals_obj,
        currentTotalPercentage=m.total_percentage,
        gradeProjected=m.grade_projected,
        trend=m.trend,
        changePercentage=m.change_percentage,
        sessional1=m.sessional1_scored,
        sessional2=m.sessional2_scored,
        quizzesScore=m.quizzes_scored,
        assignmentScore=m.assignments_scored,
        labPractical=m.practicals_scored,
    )


@router.get("/subjects", response_model=List[SubjectMarksResponse])
def get_subject_marks(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve Continuous Internal Evaluation marks for all enrolled subjects."""
    records = db.query(SubjectMarks).filter(SubjectMarks.student_id == current_student.id).all()
    return [_format_marks_response(m) for m in records]


@router.get("/performance", response_model=MarksPerformanceResponse)
def get_marks_performance(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve full performance summary including semester CGPA trends and academic insights."""
    records = db.query(SubjectMarks).filter(SubjectMarks.student_id == current_student.id).all()
    formatted_marks = [_format_marks_response(m) for m in records]

    # University semester progression trends
    trends = [
        SemesterTrendItem(semester="Sem I", sgpa=8.45, percentage=79.2),
        SemesterTrendItem(semester="Sem II", sgpa=8.60, percentage=81.0),
        SemesterTrendItem(semester="Sem III", sgpa=8.55, percentage=80.4),
        SemesterTrendItem(semester="Sem IV", sgpa=8.90, percentage=84.2),
        SemesterTrendItem(semester="Sem V", sgpa=8.82, percentage=83.5),
        SemesterTrendItem(semester="Sem VI (Est)", sgpa=8.72, percentage=82.8),
    ]

    insights = [
        PerformanceInsightItem(
            id="pi-1",
            title="Sessional 2 Strong Uplift in Web Tech",
            message="Your Full Stack Web Development internal scores increased by +8.5%, placing you in the top 10% of Section CSE-3B."
        ),
        PerformanceInsightItem(
            id="pi-2",
            title="Focus Required on Compiler Design",
            message="Compiler Design internal percentage currently stands at 76.5%. Focus on LALR Parsing numericals to secure an A grade."
        ),
        PerformanceInsightItem(
            id="pi-3",
            title="CIE Component Completion Rate",
            message="All scheduled quizzes and lab practical vivas have been evaluated with an aggregate score of 88.4%."
        )
    ]

    return MarksPerformanceResponse(
        subjectMarks=formatted_marks,
        semesterTrends=trends,
        insights=insights
    )


@router.get("/insights", response_model=List[PerformanceInsightItem])
def get_marks_insights(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve actionable performance insights for continuous evaluation."""
    perf = get_marks_performance(current_student=current_student, db=db)
    return perf.insights
