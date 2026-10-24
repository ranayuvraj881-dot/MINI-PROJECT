from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.academic import TimetableSlotModel
from app.schemas.academic import TimetableSlotResponse, TimetableDayScheduleResponse

router = APIRouter(prefix="/timetable", tags=["Timetable"])


@router.get("/weekly", response_model=List[TimetableDayScheduleResponse])
def get_weekly_timetable(db: Session = Depends(get_db)):
    """Retrieve full weekly academic schedule grouped by day."""
    slots = db.query(TimetableSlotModel).all()
    days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    day_map: Dict[str, List[TimetableSlotResponse]] = {day: [] for day in days_order}

    for s in slots:
        slot_resp = TimetableSlotResponse(
            id=s.id,
            day=s.day,
            time=s.time,
            startTime=s.start_time,
            endTime=s.end_time,
            subjectCode=s.subject_code,
            subjectName=s.subject_name,
            facultyName=s.faculty_name,
            room=s.room,
            type=s.type,
            attendanceStatus="Upcoming"
        )
        if s.day in day_map:
            day_map[s.day].append(slot_resp)

    return [
        TimetableDayScheduleResponse(day=day, slots=day_map[day])
        for day in days_order
        if day_map[day]
    ]


@router.get("/today", response_model=List[TimetableSlotResponse])
def get_today_classes(db: Session = Depends(get_db)):
    """Retrieve today's active schedule slots."""
    # Defaults to Monday slots for reliable academic demonstration
    slots = (
        db.query(TimetableSlotModel)
        .filter(TimetableSlotModel.day == "Monday")
        .all()
    )
    return [
        TimetableSlotResponse(
            id=s.id,
            day=s.day,
            time=s.time,
            startTime=s.start_time,
            endTime=s.end_time,
            subjectCode=s.subject_code,
            subjectName=s.subject_name,
            facultyName=s.faculty_name,
            room=s.room,
            type=s.type,
            attendanceStatus="Upcoming"
        )
        for s in slots
    ]
