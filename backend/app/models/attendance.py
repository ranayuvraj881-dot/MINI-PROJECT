import math
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class SubjectAttendance(Base):
    __tablename__ = "subject_attendances"

    id = Column(String(64), primary_key=True, index=True)
    student_id = Column(String(64), ForeignKey("student_profiles.id"), nullable=False, index=True)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(128), nullable=False)
    faculty_name = Column(String(128), nullable=True)
    total_classes = Column(Integer, default=0)
    attended_classes = Column(Integer, default=0)
    min_required = Column(Float, default=75.0)

    student = relationship("StudentProfile", back_populates="subject_attendances")
    history = relationship("AttendanceHistoryRecord", back_populates="subject_attendance", cascade="all, delete-orphan")

    @property
    def percentage(self) -> float:
        if self.total_classes <= 0:
            return 100.0
        return round((self.attended_classes / self.total_classes) * 100.0, 1)

    @property
    def status(self) -> str:
        pct = self.percentage
        if pct >= self.min_required:
            return "Safe"
        elif pct >= 65.0:
            return "At Risk"
        else:
            return "Critical"

    @property
    def classes_needed_to_safe(self) -> int:
        pct = self.percentage
        if pct >= self.min_required:
            return 0
        req = self.min_required / 100.0
        # (A + x) / (T + x) >= req => x >= (req * T - A) / (1 - req)
        val = (req * self.total_classes - self.attended_classes) / (1.0 - req)
        return max(0, math.ceil(val))

    @property
    def classes_can_afford_to_miss(self) -> int:
        pct = self.percentage
        if pct < self.min_required:
            return 0
        req = self.min_required / 100.0
        # A / (T + y) >= req => y <= (A / req) - T
        val = (self.attended_classes / req) - self.total_classes
        return max(0, math.floor(val))


class AttendanceHistoryRecord(Base):
    __tablename__ = "attendance_history"

    id = Column(String(64), primary_key=True, index=True)
    subject_attendance_id = Column(String(64), ForeignKey("subject_attendances.id"), nullable=False, index=True)
    date = Column(String(32), nullable=False)
    status = Column(String(16), nullable=False)  # Present, Absent, Late

    subject_attendance = relationship("SubjectAttendance", back_populates="history")
