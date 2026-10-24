from app.schemas.auth import (
    LoginRequest,
    RoleSwitchDemoRequest,
    TokenResponse,
    UserProfileResponse,
    UpdateProfileRequest,
)
from app.schemas.academic import (
    SubjectOverviewResponse,
    SubjectMarksResponse,
    TimetableSlotResponse,
    TimetableDayScheduleResponse,
    MarksPerformanceResponse,
)
from app.schemas.attendance import (
    SubjectAttendanceResponse,
    AttendanceSummaryResponse,
    AttendanceSimulationRequest,
    AttendanceSimulationResultResponse,
)
from app.schemas.assignment import (
    AssignmentResponse,
    SubmitAssignmentRequest,
)
from app.schemas.resource import (
    StudyResourceResponse,
    PYQItemResponse,
    TopicAnalysisResponse,
    PYQStrategyResponse,
)
from app.schemas.planner import (
    StudyPlanSlotResponse,
    DayStudyPlanResponse,
    GenerateStudyPlanRequest,
)
from app.schemas.notification import AppNotificationResponse
from app.schemas.copilot import (
    ChatMessageResponse,
    SendMessageRequest,
    ContextOptionResponse,
)
from app.schemas.analytics import (
    AcademicRiskReportResponse,
    FacultyOverviewResponse,
    AdminInstitutionalResponse,
)
