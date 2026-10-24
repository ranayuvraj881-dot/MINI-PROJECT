import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(path, method="GET", body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode('utf-8') if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, err_body
    except Exception as e:
        return 0, str(e)

def run_tests():
    results = []
    
    # 1. Health
    st, res = request("/health")
    results.append(("Health Check", st == 200, st, res.get("status") if isinstance(res, dict) else res))

    # 2. Public students
    st, res = request("/api/v1/auth/students")
    results.append(("Public Students Roster", st == 200, st, f"{len(res)} students" if isinstance(res, list) else res))

    # 3. Student Login
    st, res = request("/api/v1/auth/login", method="POST", body={"identifier": "GLB21CS0892", "password": "password123", "role": "student"})
    token = res.get("access_token") if isinstance(res, dict) else None
    results.append(("Student Login", st == 200 and token is not None, st, res.get("user", {}).get("name") if isinstance(res, dict) else res))

    # 4. Auth Me
    st, res = request("/api/v1/auth/me", token=token)
    results.append(("Auth Me", st == 200, st, res.get("name") if isinstance(res, dict) else res))

    # 5. Dashboard Summary
    st, res = request("/api/v1/dashboard/summary", token=token)
    results.append(("Dashboard Summary", st == 200, st, res))

    # 6. Academics Subjects
    st, res = request("/api/v1/academics/subjects", token=token)
    results.append(("Academics Subjects", st == 200, st, f"{len(res)} subjects" if isinstance(res, list) else res))

    # 7. Attendance Summary
    st, res = request("/api/v1/attendance/summary", token=token)
    results.append(("Attendance Summary", st == 200, st, res.get("overallPercentage") if isinstance(res, dict) else res))

    # 8. Attendance Subjects
    st, res = request("/api/v1/attendance/subjects", token=token)
    results.append(("Attendance Subjects", st == 200, st, f"{len(res)} subjects" if isinstance(res, list) else res))

    # 9. Marks Performance
    st, res = request("/api/v1/marks/performance", token=token)
    results.append(("Marks Performance", st == 200, st, res.keys() if isinstance(res, dict) else res))

    # 10. Assignments
    st, res = request("/api/v1/assignments", token=token)
    results.append(("Assignments List", st == 200, st, f"{len(res)} assignments" if isinstance(res, list) else res))

    # 11. Timetable Weekly
    st, res = request("/api/v1/timetable/weekly", token=token)
    results.append(("Timetable Weekly", st == 200, st, f"{len(res)} days" if isinstance(res, list) else res))

    # 12. Resources Notes
    st, res = request("/api/v1/resources/notes", token=token)
    results.append(("Resources Notes", st == 200, st, f"{len(res)} notes" if isinstance(res, list) else res))

    # 13. Resources PYQs
    st, res = request("/api/v1/resources/pyqs", token=token)
    results.append(("Resources PYQs", st == 200, st, f"{len(res)} pyqs" if isinstance(res, list) else res))

    # 14. PYQs Topics
    st, res = request("/api/v1/resources/pyqs/topics", token=token)
    results.append(("PYQ Topics Frequency", st == 200, st, f"{len(res)} topics" if isinstance(res, list) else res))

    # 15. Study Planner
    st, res = request("/api/v1/study-planner", token=token)
    results.append(("Study Planner", st == 200, st, f"{len(res)} days" if isinstance(res, list) else res))

    # 16. Copilot Prompts
    st, res = request("/api/v1/ai/copilot/prompts", token=token)
    results.append(("Copilot Prompts", st == 200, st, res))

    # 17. Copilot Contexts
    st, res = request("/api/v1/ai/copilot/contexts", token=token)
    results.append(("Copilot Contexts", st == 200, st, f"{len(res)} contexts" if isinstance(res, list) else res))

    # 18. Copilot History
    st, res = request("/api/v1/ai/copilot/history", token=token)
    results.append(("Copilot History", st == 200, st, f"{len(res)} msgs" if isinstance(res, list) else res))

    # 19. Copilot Status
    st, res = request("/api/v1/ai/copilot/status", token=token)
    results.append(("Copilot Status", st == 200, st, res))

    # 20. Notifications
    st, res = request("/api/v1/notifications", token=token)
    results.append(("Notifications List", st == 200, st, f"{len(res)} notifications" if isinstance(res, list) else res))

    # 21. Analytics Risk Report
    st, res = request("/api/v1/analytics/risk-report", token=token)
    results.append(("Analytics Risk Report", st == 200, st, res.get("overallRisk") if isinstance(res, dict) else res))

    # 22. Faculty Role Switch
    st, res = request("/api/v1/auth/role-switch-demo", method="POST", body={"role": "faculty"})
    faculty_token = res.get("access_token") if isinstance(res, dict) else None
    results.append(("Faculty Role Switch", st == 200 and faculty_token is not None, st, res.get("user", {}).get("name") if isinstance(res, dict) else res))

    # 23. Faculty Students
    st, res = request("/api/v1/faculty/students", token=faculty_token)
    results.append(("Faculty Students", st == 200, st, f"{len(res)} students" if isinstance(res, list) else res))

    # 24. Faculty Stats
    st, res = request("/api/v1/faculty/stats", token=faculty_token)
    results.append(("Faculty Stats", st == 200, st, res))

    # 25. Admin Role Switch
    st, res = request("/api/v1/auth/role-switch-demo", method="POST", body={"role": "admin"})
    admin_token = res.get("access_token") if isinstance(res, dict) else None
    results.append(("Admin Role Switch", st == 200 and admin_token is not None, st, res.get("user", {}).get("name") if isinstance(res, dict) else res))

    # 26. Admin Institutional Data
    st, res = request("/api/v1/analytics/admin/institutional", token=admin_token)
    results.append(("Admin Institutional Data", st == 200, st, res.keys() if isinstance(res, dict) else res))

    # Print Report
    print("=" * 60)
    print("GL BAJAJ CAMPUSOS ENDPOINT TEST REPORT")
    print("=" * 60)
    passed = 0
    for name, success, code, detail in results:
        status_str = "PASS" if success else "FAIL"
        if success:
            passed += 1
        print(f"[{status_str}] {name:<30} (HTTP {code}) -> {str(detail)[:45]}")
    print("=" * 60)
    print(f"Total: {passed}/{len(results)} passed.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
