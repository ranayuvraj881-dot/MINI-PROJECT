from typing import List, Optional
from pydantic import BaseModel


class StudyPlanSlotResponse(BaseModel):
    id: str
    timeSlot: str
    subjectName: str
    subjectCode: str
    topic: str
    taskType: str
    completed: bool


class DayStudyPlanResponse(BaseModel):
    day: str
    date: str
    focusArea: str
    targetHours: float
    slots: List[StudyPlanSlotResponse]


class GenerateStudyPlanRequest(BaseModel):
    examDates: Optional[str] = None
    targetDate: Optional[str] = None
    subjects: List[str] = []
    availableStudyHours: Optional[float] = None
    hoursPerDay: Optional[float] = None
    weakSubjects: Optional[List[str]] = None
    focusWeakAreas: Optional[List[str]] = None
    preferredStudyTime: Optional[str] = None
    timePreference: Optional[str] = None
