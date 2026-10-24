from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(64), primary_key=True, index=True)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(128), nullable=False)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    faculty_name = Column(String(128), nullable=False)
    assigned_date = Column(String(32), nullable=False)
    due_date = Column(String(32), nullable=False)
    priority = Column(String(32), default="NORMAL")  # HIGH PRIORITY, MEDIUM PRIORITY, NORMAL
    max_marks = Column(Integer, default=10)

    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(String(64), primary_key=True, index=True)
    assignment_id = Column(String(64), ForeignKey("assignments.id"), nullable=False, index=True)
    student_id = Column(String(64), ForeignKey("student_profiles.id"), nullable=False, index=True)
    status = Column(String(32), default="Pending")  # Pending, Submitted, Evaluated, Overdue
    submitted_date = Column(String(32), nullable=True)
    marks_obtained = Column(Float, nullable=True)
    file_attachment = Column(String(256), nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("StudentProfile", back_populates="assignment_submissions")
