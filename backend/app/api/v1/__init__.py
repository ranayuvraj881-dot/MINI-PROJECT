from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.students import router as students_router
from app.api.v1.academics import router as academics_router
from app.api.v1.attendance import router as attendance_router
from app.api.v1.marks import router as marks_router
from app.api.v1.assignments import router as assignments_router
from app.api.v1.timetable import router as timetable_router
from app.api.v1.resources import router as resources_router
from app.api.v1.study_planner import router as study_planner_router
from app.api.v1.copilot import router as copilot_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.faculty import router as faculty_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(students_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(academics_router)
api_v1_router.include_router(attendance_router)
api_v1_router.include_router(marks_router)
api_v1_router.include_router(assignments_router)
api_v1_router.include_router(timetable_router)
api_v1_router.include_router(resources_router)
api_v1_router.include_router(study_planner_router)
api_v1_router.include_router(copilot_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(faculty_router)

__all__ = ["api_v1_router"]
