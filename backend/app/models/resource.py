from sqlalchemy import Column, String, Integer, Float, Text
from app.db.session import Base


class StudyResource(Base):
    __tablename__ = "study_resources"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(128), nullable=False)
    unit = Column(String(32), nullable=False)
    topic = Column(String(256), nullable=False)
    type = Column(String(32), default="PDF")  # PDF, PPT, DOC, VIDEO, LINK
    file_size = Column(String(32), default="2.4 MB")
    uploaded_date = Column(String(32), nullable=False)
    faculty_name = Column(String(128), nullable=False)
    uploaded_by = Column(String(128), nullable=True)
    download_url = Column(String(512), nullable=True)
    summary = Column(Text, nullable=True)


class PYQItem(Base):
    __tablename__ = "pyq_items"

    id = Column(String(64), primary_key=True, index=True)
    question = Column(Text, nullable=False)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(128), nullable=False)
    semester = Column(String(32), default="Semester VI")
    year = Column(Integer, nullable=False, index=True)
    unit = Column(String(32), nullable=False)
    exam_type = Column(String(64), default="End-Sem")  # Mid-Sem, End-Sem, Pre-University Test
    difficulty = Column(String(32), default="Medium")   # Easy, Medium, Hard
    frequency = Column(Integer, default=1)
    topic = Column(String(256), nullable=False)
    marks_weightage = Column(Integer, default=10)


class TopicAnalysis(Base):
    __tablename__ = "topic_analyses"

    id = Column(String(64), primary_key=True, index=True)
    topic = Column(String(256), nullable=False)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(128), nullable=False)
    frequency = Column(Integer, default=1)
    importance = Column(String(32), default="HIGH IMPORTANCE")  # HIGH IMPORTANCE, MEDIUM/HIGH, MODERATE
    unit = Column(String(32), nullable=False)
    average_marks = Column(Float, default=10.0)
    last_asked_year = Column(Integer, default=2024)
