import json
from app.services.supabase_service import SupabaseService
from app.core.config import settings

client = SupabaseService.get_client()

if not client:
    print("Could not connect to Supabase.")
    exit(1)

print("=" * 80)
print(f"SUPABASE DATABASE INSPECTION ({settings.SUPABASE_URL})")
print("=" * 80)

# Tables defined in schema
potential_tables = [
    "users",
    "student_profiles",
    "faculty_profiles",
    "subjects",
    "subject_attendances",
    "attendance_history",
    "subject_marks",
    "assignments",
    "assignment_submissions",
    "study_resources",
    "pyq_items",
    "topic_analyses",
    "timetable_slots",
    "study_plans",
    "study_plan_slots",
    "notifications",
    "ai_chat_messages",
]

for table in potential_tables:
    try:
        res = client.table(table).select("*", count="exact").execute()
        count = res.count if hasattr(res, 'count') and res.count is not None else len(res.data)
        print(f"Table: {table:<26} | Rows in Supabase: {count}")
        if res.data and len(res.data) > 0:
            sample = res.data[0]
            # print up to 4 key-value pairs of sample
            sample_keys = list(sample.keys())[:4]
            sample_preview = {k: str(sample[k])[:25] for k in sample_keys}
            print(f"   -> Sample: {sample_preview}")
    except Exception as e:
        print(f"Table: {table:<26} | Status/Error: {e}")

print("=" * 80)
