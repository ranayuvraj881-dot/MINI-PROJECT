from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class SubjectOverviewResponse(BaseModel):
    code: str
    name: str
    shortName: Optional[str] = None
    credits: int
    type: str
    department: str
    semester: str
    syllabus: List[str] = []
    facultyName: Optional[str] = None
    colorCode: Optional[str] = "#2563eb"
    description: Optional[str] = None


class ScoredMax(BaseModel):
    scored: float
    max: float


class SubjectMarksResponse(BaseModel):
    subjectCode: str
    subjectName: str
    credits: int
    facultyName: str
    internalSessional1: ScoredMax
    internalSessional2: ScoredMax
    quizzes: ScoredMax
    assignments: ScoredMax
    practicals: Optional[ScoredMax] = None
    currentTotalPercentage: float
    gradeProjected: str
    trend: str
    changePercentage: float
    sessional1: Optional[float] = None
    sessional2: Optional[float] = None
    quizzesScore: Optional[float] = None
    assignmentScore: Optional[float] = None
    labPractical: Optional[float] = None


class TimetableSlotResponse(BaseModel):
    id: str
    day: str
    time: str
    startTime: str
    endTime: str
    subjectCode: str
    subjectName: str
    facultyName: str
    room: str
    type: str
    attendanceStatus: Optional[str] = None


class TimetableDayScheduleResponse(BaseModel):
    day: str
    slots: List[TimetableSlotResponse]


class SemesterTrendItem(BaseModel):
    semester: str
    sgpa: float
    percentage: float


class PerformanceInsightItem(BaseModel):
    id: str
    title: str
    message: str


class MarksPerformanceResponse(BaseModel):
    subjectMarks: List[SubjectMarksResponse]
    semesterTrends: List[SemesterTrendItem]
    insights: List[PerformanceInsightItem]
