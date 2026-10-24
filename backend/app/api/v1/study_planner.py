from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_student
from app.models.user import StudentProfile
from app.models.planner import StudyPlan, StudyPlanSlot
from app.schemas.planner import (
    DayStudyPlanResponse,
    StudyPlanSlotResponse,
    GenerateStudyPlanRequest,
)
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/study-planner", tags=["AI Study Planner"])


def _format_day_plan(plan: StudyPlan) -> DayStudyPlanResponse:
    return DayStudyPlanResponse(
        day=plan.day,
        date=plan.date,
        focusArea=plan.focus_area,
        targetHours=plan.target_hours,
        slots=[
            StudyPlanSlotResponse(
                id=s.id,
                timeSlot=s.time_slot,
                subjectName=s.subject_name,
                subjectCode=s.subject_code,
                topic=s.topic,
                taskType=s.task_type,
                completed=s.completed,
            )
            for s in plan.slots
        ],
    )


@router.get("", response_model=List[DayStudyPlanResponse])
def get_study_plan(
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Retrieve the active persisted AI study plan for the authenticated student."""
    plans = (
        db.query(StudyPlan)
        .filter(StudyPlan.student_id == current_student.id)
        .order_by(StudyPlan.order_index)
        .all()
    )
    return [_format_day_plan(p) for p in plans]


@router.post("/generate", response_model=List[DayStudyPlanResponse])
async def generate_study_plan(
    payload: GenerateStudyPlanRequest,
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Calibrate and generate a structured study schedule via Gemini AI and persist to the database."""
    config_dict = payload.model_dump()
    generated_days = await GeminiService.generate_structured_study_plan(
        db=db,
        student_id=current_student.id,
        config=config_dict,
    )

    # Remove existing plans for clean replacement
    db.query(StudyPlan).filter(StudyPlan.student_id == current_student.id).delete()
    db.flush()

    saved_plans = []
    for idx, day_data in enumerate(generated_days):
        plan_id = f"plan-{current_student.id}-{idx}"
        plan_obj = StudyPlan(
            id=plan_id,
            student_id=current_student.id,
            day=day_data["day"],
            date=day_data["date"],
            focus_area=day_data["focusArea"],
            target_hours=day_data["targetHours"],
            order_index=idx,
        )
        db.add(plan_obj)
        db.flush()

        for s_idx, slot in enumerate(day_data["slots"]):
            slot_obj = StudyPlanSlot(
                id=f"slot-{plan_id}-{s_idx}",
                plan_id=plan_id,
                time_slot=slot["timeSlot"],
                subject_name=slot["subjectName"],
                subject_code=slot["subjectCode"],
                topic=slot["topic"],
                task_type=slot["taskType"],
                completed=slot.get("completed", False),
                order_index=s_idx,
            )
            db.add(slot_obj)

        saved_plans.append(plan_obj)

    db.commit()

    # Re-query saved plans with slots
    refreshed = (
        db.query(StudyPlan)
        .filter(StudyPlan.student_id == current_student.id)
        .order_by(StudyPlan.order_index)
        .all()
    )
    return [_format_day_plan(p) for p in refreshed]


@router.post("/slot/{slot_id}/toggle", response_model=List[DayStudyPlanResponse])
def toggle_slot_completion(
    slot_id: str,
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Toggle completion status of a study session slot and persist to database."""
    slot = db.query(StudyPlanSlot).filter(StudyPlanSlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Study plan slot not found")

    slot.completed = not slot.completed
    db.commit()

    refreshed = (
        db.query(StudyPlan)
        .filter(StudyPlan.student_id == current_student.id)
        .order_by(StudyPlan.order_index)
        .all()
    )
    return [_format_day_plan(p) for p in refreshed]
