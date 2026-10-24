from app.db.session import Base
from app.models.user import User, StudentProfile, FacultyProfile
from app.models.academic import Subject, SubjectMarks, TimetableSlotModel
from app.models.attendance import SubjectAttendance, AttendanceHistoryRecord
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.resource import StudyResource, PYQItem, TopicAnalysis
from app.models.planner import StudyPlan, StudyPlanSlot
from app.models.notification import Notification
from app.models.copilot import AIChatMessage

__all__ = [
    "Base",
    "User",
    "StudentProfile",
    "FacultyProfile",
    "Subject",
    "SubjectMarks",
    "TimetableSlotModel",
    "SubjectAttendance",
    "AttendanceHistoryRecord",
    "Assignment",
    "AssignmentSubmission",
    "StudyResource",
    "PYQItem",
    "TopicAnalysis",
    "StudyPlan",
    "StudyPlanSlot",
    "Notification",
    "AIChatMessage",
]
