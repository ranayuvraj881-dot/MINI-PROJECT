from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    college_id: Optional[str] = None
    roll_number: Optional[str] = None
    name: Optional[str] = None
    identifier: Optional[str] = None
    password: Optional[str] = "password123"
    role: Optional[str] = "student"


class StudentRosterItem(BaseModel):
    id: str
    name: str
    rollNumber: str
    collegeId: str
    branch: str
    semester: str
    section: str

    class Config:
        from_attributes = True


class RoleSwitchDemoRequest(BaseModel):
    role: str = "student"


class AchievementItem(BaseModel):
    title: str
    date: str
    category: str
    organization: str


class UserProfileResponse(BaseModel):
    id: str
    name: str
    enrollmentNo: str
    enrollmentNumber: Optional[str] = None
    rollNumber: Optional[str] = None
    collegeId: str
    email: str
    phone: Optional[str] = None
    role: str
    avatarUrl: Optional[str] = None
    department: str
    course: str
    branch: str
    semester: str
    section: str
    batch: str
    mentorName: Optional[str] = None
    bloodGroup: Optional[str] = None
    cgpa: Optional[float] = None
    totalCredits: Optional[int] = None
    achievements: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: UserProfileResponse


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    avatarUrl: Optional[str] = None
