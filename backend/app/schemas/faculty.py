from typing import Optional, List
from pydantic import BaseModel


class FacultyStudentItemResponse(BaseModel):
    id: str
    name: str
    rollNumber: str
    enrollmentNo: str
    collegeId: str
    email: str
    phone: Optional[str] = None
    department: str
    course: str
    branch: str
    semester: str
    section: str
    cgpa: float
    attendancePercentage: float
    attendanceStatus: str
    cieAverage: float
    totalClasses: int
    attendedClasses: int
    avatarUrl: Optional[str] = None

    class Config:
        from_attributes = True


class CreateStudentRequest(BaseModel):
    name: str
    rollNumber: str
    enrollmentNo: Optional[str] = None
    collegeId: Optional[str] = None
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = "B.Tech"
    branch: Optional[str] = "CSE"
    semester: Optional[str] = "Semester VI"
    section: Optional[str] = "CSE-3B"
    cgpa: Optional[float] = 8.0


class UpdateStudentRequest(BaseModel):
    name: Optional[str] = None
    rollNumber: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    branch: Optional[str] = None
    section: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[float] = None


class AttendanceRecordEntry(BaseModel):
    studentId: str
    status: str  # "Present" or "Absent" or "Late"


class MarkAttendanceRequest(BaseModel):
    subjectCode: str
    section: Optional[str] = "CSE-3B"
    date: str
    records: List[AttendanceRecordEntry]


class RecordMarksRequest(BaseModel):
    studentId: Optional[str] = None
    rollNumber: Optional[str] = None
    subjectCode: str
    sessional1: Optional[float] = None
    sessional2: Optional[float] = None
    quizzes: Optional[float] = None
    assignments: Optional[float] = None
    practicals: Optional[float] = None


class BulkRecordMarksRequest(BaseModel):
    subjectCode: str
    records: List[RecordMarksRequest]


class StudentStrengthDiagnosisItem(BaseModel):
    studentId: str
    name: str
    rollNumber: str
    enrollmentNo: Optional[str] = None
    email: Optional[str] = None
    section: str
    semester: str
    branch: Optional[str] = None
    subjectCode: str
    subjectName: str
    sessional1: Optional[float] = None
    sessional1Max: float = 30.0
    sessional2: Optional[float] = None
    sessional2Max: float = 30.0
    quizzes: Optional[float] = None
    quizzesMax: float = 10.0
    assignments: Optional[float] = None
    assignmentsMax: float = 10.0
    practicals: Optional[float] = None
    practicalsMax: float = 20.0
    totalScored: float
    totalMax: float
    totalPercentage: float
    gradeProjected: str
    strengthStatus: str  # "STRONG" | "MODERATE" | "WEAK"
    strongComponents: List[str]
    weakComponents: List[str]
    recommendation: str


class ClassMarksAnalyticsResponse(BaseModel):
    subjectCode: str
    subjectName: str
    section: Optional[str] = None
    semester: Optional[str] = None
    totalEnrolled: int
    evaluatedCount: int
    strongCount: int
    moderateCount: int
    weakCount: int
    strongPercentage: float
    moderatePercentage: float
    weakPercentage: float
    averageSessional1: float
    averageSessional2: float
    averageQuizzes: float
    averageAssignments: float
    averagePracticals: float
    classAveragePercentage: float
    overallHealth: str
    students: List[StudentStrengthDiagnosisItem]


class AtRiskStudentDiagnosis(BaseModel):
    rollNumber: str
    name: str
    section: str
    totalPercentage: float
    weakAreas: List[str]
    suggestedAction: str


class MarksAiDiagnosisRequest(BaseModel):
    subjectCode: str
    section: Optional[str] = None


class MarksAiDiagnosisResponse(BaseModel):
    subjectCode: str
    subjectName: str
    executiveSummary: str
    classStrengths: List[str]
    criticalWeaknesses: List[str]
    atRiskStudents: List[AtRiskStudentDiagnosis]
    remedialActionPlan: List[str]
    examReadinessForecast: str



class CreateAssignmentRequest(BaseModel):
    title: str
    subjectCode: str
    dueDate: str
    maxMarks: int
    description: Optional[str] = None
    section: Optional[str] = "CSE-3B"


class CreateResourceRequest(BaseModel):
    title: str
    subjectCode: str
    unitNumber: int
    topic: str
    resourceType: str = "Lecture Notes"
    description: Optional[str] = None
    downloadUrl: Optional[str] = None


class SendStudentAlertRequest(BaseModel):
    studentId: str
    title: str
    message: str
    type: Optional[str] = "warning"  # warning, info, urgent


class FacultyDashboardStatsResponse(BaseModel):
    totalStudents: int
    averageAttendance: float
    studentsAtRisk: int
    pendingSubmissionsToGrade: int
    activeClasses: int
