from typing import List, Optional, Union
from pydantic import BaseModel



class StudyResourceResponse(BaseModel):
    id: str
    title: str
    subjectCode: str
    subjectName: str
    unit: str
    topic: str
    type: str
    fileSize: Optional[str] = None
    uploadedDate: str
    facultyName: str
    uploadedBy: Optional[str] = None
    downloadUrl: Optional[str] = None
    summary: Optional[str] = None


class PYQItemResponse(BaseModel):
    id: str
    question: str
    subjectCode: str
    subjectName: str
    semester: str
    year: int
    unit: str
    examType: str
    difficulty: str
    frequency: int
    topic: str
    marksWeightage: int


class TopicAnalysisResponse(BaseModel):
    topic: str
    subjectCode: str
    subjectName: str
    frequency: int
    importance: str
    unit: str
    averageMarks: float
    lastAskedYear: int


class PYQStrategyResponse(BaseModel):
    strategyTitle: str
    keyTakeaway: str
    focusUnits: List[int]
    recommendedHours: int
    steps: List[str]


class CreateStudyResourceRequest(BaseModel):
    title: str
    subjectCode: str
    unit: str = "Unit 1"
    topic: str
    type: Optional[str] = "PDF"
    fileSize: Optional[str] = "3.2 MB"
    downloadUrl: Optional[str] = None
    summary: Optional[str] = None


class CreatePYQRequest(BaseModel):
    question: str
    subjectCode: str
    subjectName: Optional[str] = None
    semester: Optional[str] = "Semester VI"
    year: Union[int, str] = 2024
    unit: str = "Unit 1"
    examType: Optional[str] = "End-Sem"
    difficulty: Optional[str] = "Medium"
    frequency: Optional[int] = 1
    topic: str
    marksWeightage: Optional[int] = 10



