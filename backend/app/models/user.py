from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    college_id = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), default="student", nullable=False)  # student, faculty, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    faculty_profile = relationship("FacultyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("AIChatMessage", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    enrollment_no = Column(String(64), index=True, nullable=False)
    roll_number = Column(String(64), nullable=True)
    college_id = Column(String(64), index=True, nullable=False)
    email = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    department = Column(String(128), nullable=False)
    course = Column(String(64), default="B.Tech")
    branch = Column(String(64), default="CSE")
    semester = Column(String(64), default="Semester VI")
    section = Column(String(32), default="CSE-3B")
    batch = Column(String(64), default="2022 - 2026")
    mentor_name = Column(String(128), nullable=True)
    blood_group = Column(String(16), nullable=True)
    cgpa = Column(Float, default=8.72)
    total_credits = Column(Integer, default=124)
    achievements_json = Column(Text, nullable=True)

    user = relationship("User", back_populates="student_profile")
    subject_attendances = relationship("SubjectAttendance", back_populates="student", cascade="all, delete-orphan")
    subject_marks = relationship("SubjectMarks", back_populates="student", cascade="all, delete-orphan")
    assignment_submissions = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")

    @property
    def achievements(self):
        if not self.achievements_json:
            return []
        try:
            return json.loads(self.achievements_json)
        except Exception:
            return []

    @achievements.setter
    def achievements(self, value):
        self.achievements_json = json.dumps(value) if value else "[]"


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    enrollment_no = Column(String(64), nullable=False)
    college_id = Column(String(64), nullable=False)
    email = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=True)
    department = Column(String(128), nullable=False)
    course = Column(String(64), default="B.Tech")
    branch = Column(String(64), default="CSE")
    semester = Column(String(64), default="Faculty Portal")
    section = Column(String(32), default="Senior Faculty")
    batch = Column(String(64), default="Academic Year 2025-26")

    user = relationship("User", back_populates="faculty_profile")
