# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.session import Base
from app.models import (
    User,
    StudentProfile,
    FacultyProfile,
    Subject,
    SubjectMarks,
    TimetableSlotModel,
    SubjectAttendance,
    AttendanceHistoryRecord,
    Assignment,
    AssignmentSubmission,
    StudyResource,
    PYQItem,
    TopicAnalysis,
    StudyPlan,
    StudyPlanSlot,
    Notification,
    AIChatMessage,
)
