import pytest
from app.core.security import create_access_token


def test_health_check(client):
    """Test health and readiness check."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "gemini" in data
    assert data["database"]["connected"] is True


def test_auth_login_valid(client):
    """Test valid student login."""
    response = client.post("/api/v1/auth/login", json={
        "college_id": "GLB21CS0892",
        "password": "password123",
        "role": "student"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "student"
    assert data["user"]["name"] == "Yuvraj"
    assert data["user"]["rollNumber"] == "2101920100142"


def test_auth_login_invalid(client):
    """Test invalid credentials rejection."""
    response = client.post("/api/v1/auth/login", json={
        "college_id": "NON_EXISTENT_ID_9999",
        "password": "wrongpassword",
        "role": "student"
    })
    # Should reject or fallback correctly
    assert response.status_code in [401, 404]


def test_role_switch_demo(client):
    """Test switching demo role to faculty and admin."""
    # Faculty
    res_fac = client.post("/api/v1/auth/role-switch-demo", json={"role": "faculty"})
    assert res_fac.status_code == 200
    assert res_fac.json()["role"] == "faculty"

    # Admin
    res_adm = client.post("/api/v1/auth/role-switch-demo", json={"role": "admin"})
    assert res_adm.status_code == 200
    assert res_adm.json()["role"] == "admin"


def test_get_current_user_and_profile(client):
    """Test /auth/me and /students/me endpoints."""
    # Login first
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Yuvraj"

    stu_res = client.get("/api/v1/students/me", headers=headers)
    assert stu_res.status_code == 200
    assert stu_res.json()["department"] == "Computer Science & Engineering"


def test_update_student_profile(client):
    """Test updating student profile contact info and persisting changes."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_payload = {
        "phone": "+91 99999 88888",
        "name": "Yuvraj Sharma"
    }
    update_res = client.put("/api/v1/students/me", json=update_payload, headers=headers)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["phone"] == "+91 99999 88888"
    assert updated_data["name"] == "Yuvraj Sharma"


def test_dashboard_aggregation(client):
    """Test comprehensive dashboard data endpoint."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dash_res = client.get("/api/v1/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert "user" in dash_data
    assert "attendanceSummary" in dash_data
    assert "subjectAttendance" in dash_data
    assert "todayClasses" in dash_data
    assert "subjectMarks" in dash_data
    assert "academicRiskReport" in dash_data


def test_academics_and_subjects(client):
    """Test subjects listing and specific subject retrieval."""
    res = client.get("/api/v1/academics/subjects")
    assert res.status_code == 200
    subjects = res.json()
    assert len(subjects) >= 5
    assert any(s["code"] == "KCS-601" for s in subjects)

    single_res = client.get("/api/v1/academics/subjects/KCS-601")
    assert single_res.status_code == 200
    assert single_res.json()["name"] == "Database Management Systems"


def test_attendance_summary_and_simulation(client):
    """Test dynamic attendance summary and what-if simulation calculation."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    att_res = client.get("/api/v1/attendance/summary", headers=headers)
    assert att_res.status_code == 200
    att_data = att_res.json()
    assert att_data["overallPercentage"] > 0
    assert att_data["totalClasses"] > 0

    # Test simulation
    sim_payload = {
        "currentAttended": 19,
        "currentTotal": 26,
        "upcomingClasses": 6,
        "plannedToAttend": 6
    }
    sim_res = client.post("/api/v1/attendance/simulate", json=sim_payload)
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    # (19 + 6) / (26 + 6) = 25/32 = 78.1% >= 75% -> Safe
    assert sim_data["projectedPercentage"] == 78.1
    assert sim_data["isSafe"] is True


def test_marks_performance(client):
    """Test CIE marks and performance endpoint."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    perf_res = client.get("/api/v1/marks/performance", headers=headers)
    assert perf_res.status_code == 200
    perf_data = perf_res.json()
    assert "subjectMarks" in perf_data
    assert "semesterTrends" in perf_data
    assert "insights" in perf_data
    assert len(perf_data["subjectMarks"]) > 0


def test_assignments_and_submission(client):
    """Test assignment listing and submitting an assignment."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    asg_res = client.get("/api/v1/assignments", headers=headers)
    assert asg_res.status_code == 200
    assignments = asg_res.json()
    assert len(assignments) >= 3

    # Submit an assignment
    target_asg = assignments[0]
    sub_res = client.post(
        f"/api/v1/assignments/{target_asg['id']}/submit",
        json={"fileName": "Verified_Final_Report.pdf"},
        headers=headers
    )
    assert sub_res.status_code == 200
    assert sub_res.json()["status"] == "Submitted"
    assert sub_res.json()["fileAttachment"] == "Verified_Final_Report.pdf"


def test_timetable(client):
    """Test weekly and today timetable schedule."""
    weekly_res = client.get("/api/v1/timetable/weekly")
    assert weekly_res.status_code == 200
    assert len(weekly_res.json()) > 0

    today_res = client.get("/api/v1/timetable/today")
    assert today_res.status_code == 200
    assert len(today_res.json()) > 0


def test_resources_and_pyqs(client):
    """Test study notes, PYQs, topic frequency, and strategy."""
    notes_res = client.get("/api/v1/resources/notes")
    assert notes_res.status_code == 200
    assert len(notes_res.json()) >= 3

    pyqs_res = client.get("/api/v1/resources/pyqs")
    assert pyqs_res.status_code == 200
    assert len(pyqs_res.json()) >= 4

    topics_res = client.get("/api/v1/resources/pyqs/topics")
    assert topics_res.status_code == 200
    assert len(topics_res.json()) >= 2

    strat_res = client.get("/api/v1/resources/pyqs/strategy?subjectCode=KCS-601")
    assert strat_res.status_code == 200
    assert "strategyTitle" in strat_res.json()


def test_study_planner_workflow(client):
    """Test getting, generating, and toggling study plan slots."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get initial plan
    plan_res = client.get("/api/v1/study-planner", headers=headers)
    assert plan_res.status_code == 200
    plans = plan_res.json()
    assert len(plans) >= 2

    # 2. Toggle slot completion
    slot_to_toggle = plans[0]["slots"][0]["id"]
    initial_completed = plans[0]["slots"][0]["completed"]
    toggle_res = client.post(f"/api/v1/study-planner/slot/{slot_to_toggle}/toggle", headers=headers)
    assert toggle_res.status_code == 200
    updated_plans = toggle_res.json()
    matching_slot = next(s for p in updated_plans for s in p["slots"] if s["id"] == slot_to_toggle)
    assert matching_slot["completed"] != initial_completed

    # 3. Generate new plan
    gen_payload = {
        "subjects": ["Database Management Systems", "Compiler Design"],
        "availableStudyHours": 3,
        "weakSubjects": ["Compiler Design"],
        "preferredStudyTime": "Evening"
    }
    gen_res = client.post("/api/v1/study-planner/generate", json=gen_payload, headers=headers)
    assert gen_res.status_code == 200
    gen_plans = gen_res.json()
    assert len(gen_plans) == 5


def test_ai_copilot_chat_and_history(client):
    """Test AI Copilot chat, persistence in database, and clearing history."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get prompts and contexts
    assert client.get("/api/v1/ai/copilot/prompts").status_code == 200
    assert client.get("/api/v1/ai/copilot/contexts").status_code == 200

    # 2. Get history (should contain initial welcome)
    hist_res = client.get("/api/v1/ai/copilot/history", headers=headers)
    assert hist_res.status_code == 200
    assert len(hist_res.json()) >= 1

    # 3. Send message
    msg_res = client.post(
        "/api/v1/ai/copilot/chat",
        json={"message": "What is my attendance in DBMS?", "context": "My Academic Data"},
        headers=headers
    )
    assert msg_res.status_code == 200
    ai_response = msg_res.json()
    assert ai_response["sender"] == "assistant"
    assert "DBMS" in ai_response["content"] or "Attendance" in ai_response["content"]

    # 4. History now has both messages
    hist_res2 = client.get("/api/v1/ai/copilot/history", headers=headers)
    assert len(hist_res2.json()) >= 3


def test_notifications_workflow(client):
    """Test notification listing, marking read, and marking all read."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. List
    notif_res = client.get("/api/v1/notifications", headers=headers)
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert len(notifs) >= 3

    # 2. Mark single as read
    target_id = notifs[0]["id"]
    read_res = client.post(f"/api/v1/notifications/{target_id}/read", headers=headers)
    assert read_res.status_code == 200
    updated = read_res.json()
    target_notif = next(n for n in updated if n["id"] == target_id)
    assert target_notif["read"] is True

    # 3. Mark all as read
    all_read_res = client.post("/api/v1/notifications/read-all", headers=headers)
    assert all_read_res.status_code == 200
    for n in all_read_res.json():
        assert n["read"] is True


def test_analytics_and_faculty_admin(client):
    """Test risk analytics, faculty dashboard, and admin dashboard."""
    login_res = client.post("/api/v1/auth/login", json={"college_id": "GLB21CS0892"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Risk report
    risk_res = client.get("/api/v1/analytics/risk", headers=headers)
    assert risk_res.status_code == 200
    risk_data = risk_res.json()
    assert "overallRisk" in risk_data
    assert "factors" in risk_data
    assert "recommendedActions" in risk_data

    # Recalculate with target
    target_res = client.post("/api/v1/analytics/risk/target", json={"targetCgpa": 9.2}, headers=headers)
    assert target_res.status_code == 200
    assert "9.2" in target_res.json()["whyExplanation"]

    # Faculty overview
    fac_res = client.get("/api/v1/analytics/faculty", headers=headers)
    assert fac_res.status_code == 200
    assert len(fac_res.json()["classes"]) > 0

    # Admin institutional data
    adm_res = client.get("/api/v1/analytics/admin", headers=headers)
    assert adm_res.status_code == 200
    assert adm_res.json()["stats"]["totalStudents"] > 0


def test_faculty_student_records_management(client):
    """Test full faculty workflow: managing students, attendance, marks, and assignments."""
    # 1. Fetch student records
    students_res = client.get("/api/v1/faculty/students")
    assert students_res.status_code == 200
    students = students_res.json()
    assert len(students) >= 6

    # 2. Add new student record
    new_student_payload = {
        "name": "Divya Aggarwal",
        "rollNumber": "2101920100999",
        "email": "divya.aggarwal@glbitm.ac.in",
        "phone": "+91 99999 88888",
        "section": "CSE-3B",
        "cgpa": 8.90
    }
    create_res = client.post("/api/v1/faculty/students", json=new_student_payload)
    assert create_res.status_code == 201
    created_student = create_res.json()
    assert created_student["name"] == "Divya Aggarwal"
    assert created_student["rollNumber"] == "2101920100999"

    # 3. Update student record
    student_id = created_student["id"]
    update_res = client.put(f"/api/v1/faculty/students/{student_id}", json={"cgpa": 9.10})
    assert update_res.status_code == 200
    assert update_res.json()["cgpa"] == 9.10

    # 4. Mark attendance
    att_payload = {
        "subjectCode": "KCS-601",
        "date": "2026-04-10",
        "records": [
            {"studentId": student_id, "status": "Present"}
        ]
    }
    att_res = client.post("/api/v1/faculty/attendance", json=att_payload)
    assert att_res.status_code == 200
    assert att_res.json()["presentCount"] == 1

    # 5. Record CIE marks
    marks_payload = {
        "studentId": student_id,
        "subjectCode": "KCS-601",
        "sessional1": 27.5,
        "sessional2": 28.0,
        "quizzes": 9.0,
        "assignments": 9.5,
        "practicals": 19.0
    }
    marks_res = client.post("/api/v1/faculty/marks", json=marks_payload)
    assert marks_res.status_code == 200
    assert marks_res.json()["gradeProjected"] == "A+"

    # 6. Create assignment
    asg_payload = {
        "title": "DBMS Concurrency Quiz",
        "subjectCode": "KCS-601",
        "dueDate": "2026-04-15",
        "maxMarks": 15,
        "description": "Test assignment for lock compatibility matrices."
    }
    asg_res = client.post("/api/v1/faculty/assignments", json=asg_payload)
    assert asg_res.status_code == 201
    assert "assignmentId" in asg_res.json()

    # 7. Send advisory alert
    alert_payload = {
        "studentId": student_id,
        "title": "Faculty Commendation",
        "message": "Outstanding performance in Sessional 1 DBMS.",
        "type": "info"
    }
    alert_res = client.post("/api/v1/faculty/alert", json=alert_payload)
    assert alert_res.status_code == 200

    # 8. Delete student record
    del_res = client.delete(f"/api/v1/faculty/students/{student_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


def test_teacher_upload_notes_and_pyqs(client):
    """Test teacher creating and deleting lecture notes and AKTU PYQs."""
    # 1. Upload lecture note
    note_payload = {
        "title": "B-Tree and B+ Tree Indexing Masterclass",
        "subjectCode": "KCS-601",
        "unit": "Unit 2",
        "topic": "B+ Tree Insertion and Deletion Numericals",
        "type": "PDF",
        "fileSize": "4.2 MB",
        "downloadUrl": "https://notesgallery.com/aktu-notes/",
        "summary": "Step-by-step leaf node splitting and balance restoration algorithms."
    }
    upload_note_res = client.post("/api/v1/resources/notes", json=note_payload)
    assert upload_note_res.status_code == 201
    note_data = upload_note_res.json()
    assert note_data["title"] == note_payload["title"]
    assert note_data["subjectCode"] == "KCS-601"
    assert "id" in note_data
    note_id = note_data["id"]

    # Verify it appears in notes listing
    all_notes = client.get("/api/v1/resources/notes").json()
    assert any(n["id"] == note_id for n in all_notes)

    # 2. Upload AKTU PYQ
    pyq_payload = {
        "question": "Construct a B+ Tree of order 4 for the keys: 10, 20, 30, 40, 50, 60, 70, 80, 90. Show step-by-step node splitting.",
        "subjectCode": "KCS-601",
        "subjectName": "Database Management Systems",
        "semester": "Semester VI",
        "year": "2023-24",
        "unit": "Unit 2",
        "examType": "End-Sem",
        "difficulty": "Hard",
        "frequency": 4,
        "topic": "B+ Tree Indexing",
        "marksWeightage": 10
    }
    upload_pyq_res = client.post("/api/v1/resources/pyqs", json=pyq_payload)
    assert upload_pyq_res.status_code == 201
    pyq_data = upload_pyq_res.json()
    assert "Construct a B+ Tree" in pyq_data["question"]
    assert pyq_data["marksWeightage"] == 10
    pyq_id = pyq_data["id"]

    # Verify it appears in PYQs listing
    all_pyqs = client.get("/api/v1/resources/pyqs").json()
    assert any(p["id"] == pyq_id for p in all_pyqs)

    # 3. Delete the uploaded note and pyq
    del_note_res = client.delete(f"/api/v1/resources/notes/{note_id}")
    assert del_note_res.status_code == 200
    assert del_note_res.json()["success"] is True

    del_pyq_res = client.delete(f"/api/v1/resources/pyqs/{pyq_id}")
    assert del_pyq_res.status_code == 200
    assert del_pyq_res.json()["success"] is True


