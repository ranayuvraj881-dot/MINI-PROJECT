import math
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.academic import Subject, SubjectMarks, TimetableSlotModel
from app.models.attendance import SubjectAttendance, AttendanceHistoryRecord
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.user import StudentProfile, FacultyProfile


class AcademicService:
    @staticmethod
    def get_attendance_summary(db: Session, student_id: str) -> Dict[str, Any]:
        """Calculate overall attendance and risk insights from real student attendance records."""
        attendances = db.query(SubjectAttendance).filter(SubjectAttendance.student_id == student_id).all()
        if not attendances:
            return {
                "overallPercentage": 0.0,
                "totalClasses": 0,
                "classesAttended": 0,
                "classesMissed": 0,
                "subjectsAtRiskCount": 0,
                "targetRequirement": 75.0,
                "insight": {
                    "subject": "None",
                    "currentPercentage": 0.0,
                    "classesNeeded": 0,
                    "message": "No attendance records found.",
                },
            }

        total_classes = sum(a.total_classes for a in attendances)
        classes_attended = sum(a.attended_classes for a in attendances)
        classes_missed = max(0, total_classes - classes_attended)
        overall_pct = round((classes_attended / total_classes * 100.0), 1) if total_classes > 0 else 0.0

        at_risk_list = [a for a in attendances if a.percentage < a.min_required]
        subjects_at_risk_count = len(at_risk_list)

        # Most critical subject for insight
        if at_risk_list:
            most_critical = min(at_risk_list, key=lambda a: a.percentage)
            needed = most_critical.classes_needed_to_safe
            insight = {
                "subject": most_critical.subject_name,
                "currentPercentage": most_critical.percentage,
                "classesNeeded": needed,
                "message": (
                    f"{most_critical.subject_name} ({most_critical.subject_code}) is at {most_critical.percentage}%, "
                    f"which is below the mandatory {most_critical.min_required}% threshold. "
                    f"You must attend the next {needed} consecutive classes without absence to regain safe status."
                ),
            }
        else:
            insight = {
                "subject": "All Subjects Safe",
                "currentPercentage": overall_pct,
                "classesNeeded": 0,
                "message": f"Your overall attendance is {overall_pct}%. All subjects are above the 75% university eligibility requirement.",
            }

        return {
            "overallPercentage": overall_pct,
            "totalClasses": total_classes,
            "classesAttended": classes_attended,
            "classesMissed": classes_missed,
            "subjectsAtRiskCount": subjects_at_risk_count,
            "targetRequirement": 75.0,
            "insight": insight,
        }

    @staticmethod
    def simulate_attendance(
        current_attended: int,
        current_total: int,
        upcoming_classes: int,
        planned_to_attend: int
    ) -> Dict[str, Any]:
        """Calculate future attendance outcome based on planned attendance."""
        projected_attended = max(0, current_attended + planned_to_attend)
        projected_total = max(1, current_total + upcoming_classes)
        projected_pct = round((projected_attended / projected_total) * 100.0, 1)
        current_pct = round((current_attended / max(1, current_total)) * 100.0, 1)

        is_safe = projected_pct >= 75.0
        status_change = "Unchanged"
        if projected_pct > current_pct:
            status_change = "Improved"
        elif projected_pct < current_pct:
            status_change = "Declined"

        classes_needed = 0
        if projected_pct < 75.0:
            # (A + x) / (T + x) >= 0.75 => 0.25*x >= 0.75*T - A
            classes_needed = max(0, math.ceil((0.75 * projected_total - projected_attended) / 0.25))

        msg = f"Current: {current_pct}%. If you attend {planned_to_attend} of next {upcoming_classes} classes: {projected_pct}%."
        if is_safe:
            msg += " You will maintain safe eligibility for university examinations."
        else:
            msg += f" You will need to attend at least {classes_needed} further consecutive classes without absence to reach 75%."

        return {
            "projectedAttended": projected_attended,
            "projectedTotal": projected_total,
            "projectedPercentage": projected_pct,
            "isSafe": is_safe,
            "statusChange": status_change,
            "classesNeededFor75": classes_needed,
            "summaryMessage": msg,
        }

    @staticmethod
    def calculate_academic_risk(db: Session, student_id: str, target_cgpa: Optional[float] = None) -> Dict[str, Any]:
        """Evaluate academic risk based on real attendance records, marks, and pending assignments."""
        summary = AcademicService.get_attendance_summary(db, student_id)
        overall_att = summary["overallPercentage"]
        at_risk_subjects = summary["subjectsAtRiskCount"]

        # Check pending assignments
        pending_assignments = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.student_id == student_id,
                AssignmentSubmission.status.in_(["Pending", "Overdue"])
            )
            .count()
        )

        # Check CIE Marks
        marks_list = db.query(SubjectMarks).filter(SubjectMarks.student_id == student_id).all()
        avg_marks_pct = 75.0
        low_marks_subjects = []
        if marks_list:
            avg_marks_pct = round(sum(m.total_percentage for m in marks_list) / len(marks_list), 1)
            low_marks_subjects = [m for m in marks_list if m.total_percentage < 70.0]

        # Calculate risk score (0 to 100, where 0 is safest, 100 is critical)
        score = 20  # baseline
        if overall_att < 75.0:
            score += 35
        elif overall_att < 80.0:
            score += 15

        if at_risk_subjects > 0:
            score += (at_risk_subjects * 10)

        if pending_assignments >= 3:
            score += 20
        elif pending_assignments >= 1:
            score += 10

        if low_marks_subjects:
            score += len(low_marks_subjects) * 10

        if target_cgpa and target_cgpa >= 9.0:
            score += 15  # higher target demands more scrutiny

        score = min(100, max(10, score))

        if score >= 65:
            overall_risk = "HIGH"
            title = "High Academic Attention Required"
        elif score >= 40:
            overall_risk = "MEDIUM"
            title = "Moderate Academic Attention Required"
        else:
            overall_risk = "SAFE"
            title = "Academic Health Stable & on Track"

        # Construct specific factors
        factors = [
            {
                "id": "risk-1",
                "factor": "Attendance",
                "status": "Warning" if overall_att < 80.0 else ("Critical" if overall_att < 75.0 else "Safe"),
                "value": f"{overall_att}% overall",
                "impactScore": 35.0 if overall_att < 75.0 else 15.0,
                "detail": f"{at_risk_subjects} subject(s) below AKTU 75% threshold." if at_risk_subjects > 0 else "All enrolled subjects currently meet attendance minimums."
            },
            {
                "id": "risk-2",
                "factor": "Internal Marks",
                "status": "Warning" if low_marks_subjects else "Safe",
                "value": f"{avg_marks_pct}% CIE average",
                "impactScore": 25.0,
                "detail": f"{len(low_marks_subjects)} subject(s) scored below 70% in recent sessionals." if low_marks_subjects else "Continuous internal assessments are progressing above target."
            },
            {
                "id": "risk-3",
                "factor": "Assignment Completion",
                "status": "Warning" if pending_assignments >= 2 else "Safe",
                "value": f"{pending_assignments} pending submission(s)",
                "impactScore": 20.0,
                "detail": "Upcoming course assignments require submission before deadline to maintain internal marks." if pending_assignments else "All active assignments submitted."
            }
        ]

        # Recommended actions
        actions = []
        if at_risk_subjects > 0:
            actions.append({
                "id": "act-1",
                "action": f"Attend all remaining classes in {summary['insight']['subject']} to surpass the 75% cutoff.",
                "priority": "Immediate",
                "subject": summary["insight"]["subject"]
            })
        if low_marks_subjects:
            actions.append({
                "id": "act-2",
                "action": f"Practice AKTU 5-year PYQs in {low_marks_subjects[0].subject_name} to strengthen Sessional 2 projection.",
                "priority": "Important",
                "subject": low_marks_subjects[0].subject_name
            })
        if pending_assignments > 0:
            actions.append({
                "id": "act-3",
                "action": "Complete and upload pending lab exercises and assignment reports.",
                "priority": "Important",
                "subject": "All Active Courses"
            })
        if not actions:
            actions.append({
                "id": "act-default",
                "action": "Maintain current revision rhythm and complete weekly PYQ problem sets.",
                "priority": "Recommended",
                "subject": "General"
            })

        why_explanation = (
            f"Overall attendance stands at {overall_att}% with {at_risk_subjects} subject(s) in the caution zone. "
            f"CIE internal average is {avg_marks_pct}%, and there are {pending_assignments} pending assignment deadlines."
        )
        if target_cgpa:
            why_explanation += f" Targeting CGPA {target_cgpa} requires converting internal marks to minimum A grades while fulfilling the 75% attendance threshold."

        return {
            "overallRisk": overall_risk,
            "score": score,
            "title": title,
            "whyExplanation": why_explanation,
            "factors": factors,
            "recommendedActions": actions
        }
