from typing import Optional
from pydantic import BaseModel


class AssignmentResponse(BaseModel):
    id: str
    subjectCode: str
    subjectName: str
    title: str
    description: Optional[str] = None
    facultyName: str
    assignedDate: str
    dueDate: str
    status: str
    priority: str
    submittedDate: Optional[str] = None
    marksObtained: Optional[float] = None
    maxMarks: int
    fileAttachment: Optional[str] = None


class SubmitAssignmentRequest(BaseModel):
    fileName: Optional[str] = "Submitted_Report_GLBITM.pdf"
