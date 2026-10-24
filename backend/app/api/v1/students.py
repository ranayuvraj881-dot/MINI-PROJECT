from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_student
from app.models.user import User, StudentProfile
from app.schemas.auth import UserProfileResponse, UpdateProfileRequest
from app.api.v1.auth import _build_profile_response

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/me", response_model=UserProfileResponse)
def get_student_profile(
    current_student: StudentProfile = Depends(get_current_student),
    current_user: User = Depends(get_current_user)
):
    """Retrieve full profile of the currently authenticated student."""
    return _build_profile_response(current_user)


@router.put("/me", response_model=UserProfileResponse)
def update_student_profile(
    payload: UpdateProfileRequest,
    current_student: StudentProfile = Depends(get_current_student),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update permitted student profile contact details and persist to PostgreSQL/database."""
    if payload.name:
        current_student.name = payload.name
    if payload.phone:
        current_student.phone = payload.phone
    if payload.email:
        current_student.email = payload.email
        current_user.email = payload.email
    if payload.avatarUrl:
        current_student.avatar_url = payload.avatarUrl

    db.commit()
    db.refresh(current_student)
    db.refresh(current_user)

    return _build_profile_response(current_user)
