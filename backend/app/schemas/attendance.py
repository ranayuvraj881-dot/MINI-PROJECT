from typing import List, Optional
from pydantic import BaseModel


class AttendanceHistoryItem(BaseModel):
    date: str
    status: str  # Present, Absent, Late


class SubjectAttendanceResponse(BaseModel):
    subjectCode: str
    subjectName: str
    facultyName: str
    totalClasses: int
    attendedClasses: int
    percentage: float
    status: str  # Safe, At Risk, Critical
    minRequired: float
    classesNeededToSafe: int
    classesCanAffordToMiss: int
    history: List[AttendanceHistoryItem] = []


class AttendanceInsight(BaseModel):
    subject: str
    currentPercentage: float
    classesNeeded: int
    message: str


class AttendanceSummaryResponse(BaseModel):
    overallPercentage: float
    totalClasses: int
    classesAttended: int
    classesMissed: int
    subjectsAtRiskCount: int
    targetRequirement: float
    insight: AttendanceInsight


class AttendanceSimulationRequest(BaseModel):
    currentAttended: int
    currentTotal: int
    upcomingClasses: int
    plannedToAttend: int


class AttendanceSimulationResultResponse(BaseModel):
    projectedAttended: int
    projectedTotal: int
    projectedPercentage: float
    isSafe: bool
    statusChange: str
    classesNeededFor75: int
    summaryMessage: str
