from typing import List, Optional
from pydantic import BaseModel


class RiskFactorItem(BaseModel):
    id: str
    factor: str
    status: str  # Safe, Warning, Critical
    value: str
    impactScore: float
    detail: str


class RecommendedActionItem(BaseModel):
    id: str
    action: str
    priority: str  # Immediate, Important, Recommended
    subject: Optional[str] = None


class AcademicRiskReportResponse(BaseModel):
    overallRisk: str  # SAFE, MEDIUM, HIGH
    score: int
    title: str
    whyExplanation: str
    factors: List[RiskFactorItem]
    recommendedActions: List[RecommendedActionItem]


class FacultyClassOverviewResponse(BaseModel):
    id: str
    subjectName: str
    subjectCode: str
    section: str
    semester: str
    totalStudents: int
    averageAttendance: float
    pendingEvaluations: int
    nextClassTime: str
    room: str


class StudentAttentionItemResponse(BaseModel):
    id: str
    studentName: str
    rollNo: str
    attendance: float
    performance: str
    status: str
    lastActive: str


class FacultyStats(BaseModel):
    totalStudentsTaught: int
    activeBatches: int
    averageClassAttendance: float
    evaluationsDue: int


class FacultyOverviewResponse(BaseModel):
    classes: List[FacultyClassOverviewResponse]
    stats: FacultyStats
    attentionStudents: List[StudentAttentionItemResponse]


class DepartmentMetricItem(BaseModel):
    code: str
    name: str
    students: int
    faculty: int
    attendanceAvg: float
    academicHealth: str


class AdminInsightItem(BaseModel):
    id: str
    title: str
    description: str
    trend: str
    department: str


class AcademicRiskDistribution(BaseModel):
    safe: int = 3700
    medium: int = 860
    high: int = 290


class AdminInstitutionalStats(BaseModel):
    totalStudents: int
    totalFaculty: int
    departments: int
    activeCourses: int
    averageCampusAttendance: float = 82.6
    averageCollegeAttendance: float = 82.6
    academicAverageCgpa: float = 8.24
    assignmentCompletionRate: float = 91.4
    academicRiskDistribution: AcademicRiskDistribution = AcademicRiskDistribution(safe=3700, medium=860, high=290)
    insights: List[AdminInsightItem]


class AdminInstitutionalResponse(BaseModel):
    stats: AdminInstitutionalStats
    departments: List[DepartmentMetricItem]

