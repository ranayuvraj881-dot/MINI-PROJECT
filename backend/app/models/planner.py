from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(String(64), primary_key=True, index=True)
    student_id = Column(String(64), ForeignKey("student_profiles.id"), nullable=False, index=True)
    day = Column(String(32), nullable=False)        # Monday, Tuesday, ...
    date = Column(String(64), nullable=False)       # "Upcoming Weekday" or YYYY-MM-DD
    focus_area = Column(String(256), nullable=False)
    target_hours = Column(Float, default=3.0)
    order_index = Column(Integer, default=0)

    student = relationship("StudentProfile", back_populates="study_plans")
    slots = relationship("StudyPlanSlot", back_populates="plan", cascade="all, delete-orphan", order_by="StudyPlanSlot.order_index")


class StudyPlanSlot(Base):
    __tablename__ = "study_plan_slots"

    id = Column(String(64), primary_key=True, index=True)
    plan_id = Column(String(64), ForeignKey("study_plans.id"), nullable=False, index=True)
    time_slot = Column(String(64), nullable=False)     # "06:00 PM – 07:00 PM"
    subject_name = Column(String(128), nullable=False)
    subject_code = Column(String(32), nullable=False)
    topic = Column(String(256), nullable=False)
    task_type = Column(String(32), default="Revision") # Revision, PYQ Practice, Problem Solving, Lab Exercise
    completed = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    plan = relationship("StudyPlan", back_populates="slots")
