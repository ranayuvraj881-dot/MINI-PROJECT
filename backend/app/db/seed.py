import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User, StudentProfile, FacultyProfile
from app.models.academic import Subject, SubjectMarks, TimetableSlotModel
from app.models.attendance import SubjectAttendance, AttendanceHistoryRecord
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.resource import StudyResource, PYQItem, TopicAnalysis
from app.models.planner import StudyPlan, StudyPlanSlot
from app.models.notification import Notification
from app.models.copilot import AIChatMessage


def seed_cohort_students(db: Session):
    """Seed realistic classroom students across every semester (I-VIII) and branch (CSE, IT, AIML, CSE-DS, ECE, ME, CE, EEE)."""
    cohort_data = [
        # --- Semester I ---
        {
            "id": "glb-stu-250012",
            "college_id": "GLB25CS0012",
            "roll": "2501920100012",
            "name": "Aryan Mishra",
            "email": "aryan.mishra@glbitm.ac.in",
            "phone": "+91 98111 22334",
            "cgpa": 8.45,
            "section": "CSE-1A",
            "branch": "CSE",
            "semester": "Semester I",
            "dept": "Computer Science & Engineering",
            "batch": "2025 - 2029",
            "sub_code": "BAS-103",
            "sub_name": "Engineering Mathematics - I",
            "att_total": 24, "att_attended": 21,
            "s1": 26.0, "s2": 25.0, "q": 9.0, "a": 9.0, "grade": "A"
        },
        {
            "id": "glb-stu-250022",
            "college_id": "GLB25EC0022",
            "roll": "2501920310022",
            "name": "Ananya Verma",
            "email": "ananya.verma@glbitm.ac.in",
            "phone": "+91 98222 33445",
            "cgpa": 7.90,
            "section": "ECE-1A",
            "branch": "ECE",
            "semester": "Semester I",
            "dept": "Electronics & Communication Engineering",
            "batch": "2025 - 2029",
            "sub_code": "BAS-101",
            "sub_name": "Engineering Physics",
            "att_total": 24, "att_attended": 18,
            "s1": 21.0, "s2": 22.0, "q": 7.0, "a": 8.0, "grade": "B+"
        },
        # --- Semester II ---
        {
            "id": "glb-stu-240045",
            "college_id": "GLB24IT0045",
            "roll": "2401920130045",
            "name": "Devansh Saxena",
            "email": "devansh.saxena@glbitm.ac.in",
            "phone": "+91 98333 44556",
            "cgpa": 8.15,
            "section": "IT-1B",
            "branch": "IT",
            "semester": "Semester II",
            "dept": "Information Technology",
            "batch": "2024 - 2028",
            "sub_code": "BAS-203",
            "sub_name": "Engineering Mathematics - II",
            "att_total": 26, "att_attended": 23,
            "s1": 24.0, "s2": 26.0, "q": 8.0, "a": 9.0, "grade": "A"
        },
        {
            "id": "glb-stu-240015",
            "college_id": "GLB24ME0015",
            "roll": "2401920400015",
            "name": "Manish Rawat",
            "email": "manish.rawat@glbitm.ac.in",
            "phone": "+91 98444 55667",
            "cgpa": 7.20,
            "section": "ME-1A",
            "branch": "ME",
            "semester": "Semester II",
            "dept": "Mechanical Engineering",
            "batch": "2024 - 2028",
            "sub_code": "BME-101",
            "sub_name": "Fundamentals of Mechanical Engineering",
            "att_total": 26, "att_attended": 17,
            "s1": 18.0, "s2": 19.0, "q": 6.0, "a": 7.0, "grade": "B"
        },
        # --- Semester III ---
        {
            "id": "glb-stu-230038",
            "college_id": "GLB23AI0038",
            "roll": "2301921520038",
            "name": "Ishaan Sen",
            "email": "ishaan.sen@glbitm.ac.in",
            "phone": "+91 98555 66778",
            "cgpa": 9.10,
            "section": "AIML-2A",
            "branch": "AIML",
            "semester": "Semester III",
            "dept": "Artificial Intelligence & Machine Learning",
            "batch": "2023 - 2027",
            "sub_code": "KCS-301",
            "sub_name": "Data Structures",
            "att_total": 28, "att_attended": 26,
            "s1": 29.0, "s2": 28.0, "q": 10.0, "a": 10.0, "grade": "A+"
        },
        {
            "id": "glb-stu-230088",
            "college_id": "GLB23CS0088",
            "roll": "2301920100088",
            "name": "Tanya Singh",
            "email": "tanya.singh@glbitm.ac.in",
            "phone": "+91 98666 77889",
            "cgpa": 8.65,
            "section": "CSE-2B",
            "branch": "CSE",
            "semester": "Semester III",
            "dept": "Computer Science & Engineering",
            "batch": "2023 - 2027",
            "sub_code": "KCS-303",
            "sub_name": "Discrete Structures & Theory of Logic",
            "att_total": 28, "att_attended": 25,
            "s1": 27.0, "s2": 26.0, "q": 9.0, "a": 9.0, "grade": "A"
        },
        # --- Semester IV ---
        {
            "id": "glb-stu-230029",
            "college_id": "GLB23DS0029",
            "roll": "2301921540029",
            "name": "Kabir Mehta",
            "email": "kabir.mehta@glbitm.ac.in",
            "phone": "+91 98777 88990",
            "cgpa": 8.30,
            "section": "DS-2A",
            "branch": "CSE-DS",
            "semester": "Semester IV",
            "dept": "Computer Science - Data Science",
            "batch": "2023 - 2027",
            "sub_code": "KCS-401",
            "sub_name": "Operating Systems",
            "att_total": 28, "att_attended": 23,
            "s1": 25.0, "s2": 24.0, "q": 8.0, "a": 9.0, "grade": "A"
        },
        {
            "id": "glb-stu-230018",
            "college_id": "GLB23EE0018",
            "roll": "2301920210018",
            "name": "Pooja Joshi",
            "email": "pooja.joshi@glbitm.ac.in",
            "phone": "+91 98888 99001",
            "cgpa": 7.45,
            "section": "EEE-2A",
            "branch": "EEE",
            "semester": "Semester IV",
            "dept": "Electrical & Electronics Engineering",
            "batch": "2023 - 2027",
            "sub_code": "KCS-402",
            "sub_name": "Theory of Automata and Formal Languages",
            "att_total": 28, "att_attended": 19,
            "s1": 20.0, "s2": 19.0, "q": 6.0, "a": 7.0, "grade": "B"
        },
        # --- Semester V ---
        {
            "id": "glb-stu-220042",
            "college_id": "GLB22CS0042",
            "roll": "2201920100042",
            "name": "Aarav Sharma",
            "email": "aarav.sharma@glbitm.ac.in",
            "phone": "+91 98999 00112",
            "cgpa": 8.80,
            "section": "CSE-3A",
            "branch": "CSE",
            "semester": "Semester V",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-501",
            "sub_name": "Software Engineering",
            "att_total": 30, "att_attended": 27,
            "s1": 27.0, "s2": 28.0, "q": 9.0, "a": 10.0, "grade": "A+"
        },
        {
            "id": "glb-stu-220052",
            "college_id": "GLB22IT0052",
            "roll": "2201920130052",
            "name": "Rhea Sengupta",
            "email": "rhea.sengupta@glbitm.ac.in",
            "phone": "+91 98122 33445",
            "cgpa": 8.05,
            "section": "IT-3A",
            "branch": "IT",
            "semester": "Semester V",
            "dept": "Information Technology",
            "batch": "2022 - 2026",
            "sub_code": "KCS-503",
            "sub_name": "Design and Analysis of Algorithms",
            "att_total": 30, "att_attended": 24,
            "s1": 23.0, "s2": 24.0, "q": 8.0, "a": 8.0, "grade": "B+"
        },
        # --- Semester VI (Existing cohort + CE) ---
        {
            "id": "glb-stu-210018",
            "college_id": "GLB21CS0018",
            "roll": "2101920100018",
            "name": "Aditya Verma",
            "email": "aditya.verma@glbitm.ac.in",
            "phone": "+91 98123 45678",
            "cgpa": 6.84,
            "section": "CSE-3B",
            "branch": "CSE",
            "semester": "Semester VI",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-601",
            "sub_name": "Database Management Systems",
            "att_total": 26, "att_attended": 16,
            "s1": 14.0, "s2": 15.0, "q": 5.0, "a": 6.0, "grade": "C"
        },
        {
            "id": "glb-stu-210095",
            "college_id": "GLB21CS0095",
            "roll": "2101920100095",
            "name": "Priya Sharma",
            "email": "priya.sharma@glbitm.ac.in",
            "phone": "+91 98234 56789",
            "cgpa": 7.42,
            "section": "CSE-3B",
            "branch": "CSE",
            "semester": "Semester VI",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-601",
            "sub_name": "Database Management Systems",
            "att_total": 26, "att_attended": 18,
            "s1": 19.0, "s2": 18.0, "q": 4.0, "a": 7.0, "grade": "B"
        },
        {
            "id": "glb-stu-210114",
            "college_id": "GLB21CS0114",
            "roll": "2101920100114",
            "name": "Rohan Gupta",
            "email": "rohan.gupta@glbitm.ac.in",
            "phone": "+91 98345 67890",
            "cgpa": 8.10,
            "section": "CSE-3B",
            "branch": "CSE",
            "semester": "Semester VI",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-601",
            "sub_name": "Database Management Systems",
            "att_total": 26, "att_attended": 19,
            "s1": 24.0, "s2": 23.0, "q": 8.0, "a": 5.0, "grade": "B+"
        },
        {
            "id": "glb-stu-210056",
            "college_id": "GLB21CS0056",
            "roll": "2101920100056",
            "name": "Sneha Patel",
            "email": "sneha.patel@glbitm.ac.in",
            "phone": "+91 98456 78901",
            "cgpa": 9.15,
            "section": "CSE-3B",
            "branch": "CSE",
            "semester": "Semester VI",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-601",
            "sub_name": "Database Management Systems",
            "att_total": 26, "att_attended": 25,
            "s1": 28.0, "s2": 29.0, "q": 10.0, "a": 10.0, "grade": "A+"
        },
        {
            "id": "glb-stu-210033",
            "college_id": "GLB21CS0033",
            "roll": "2101920100033",
            "name": "Amit Kumar",
            "email": "amit.kumar@glbitm.ac.in",
            "phone": "+91 98567 89012",
            "cgpa": 7.80,
            "section": "CSE-3B",
            "branch": "CSE",
            "semester": "Semester VI",
            "dept": "Computer Science & Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KCS-601",
            "sub_name": "Database Management Systems",
            "att_total": 26, "att_attended": 22,
            "s1": 22.0, "s2": 21.0, "q": 7.0, "a": 8.0, "grade": "B+"
        },
        {
            "id": "glb-stu-220021",
            "college_id": "GLB22CE0021",
            "roll": "2201920000021",
            "name": "Harshit Pandey",
            "email": "harshit.pandey@glbitm.ac.in",
            "phone": "+91 98678 90123",
            "cgpa": 7.60,
            "section": "CE-3A",
            "branch": "CE",
            "semester": "Semester VI",
            "dept": "Civil Engineering",
            "batch": "2022 - 2026",
            "sub_code": "KOE-068",
            "sub_name": "Software Project Management",
            "att_total": 26, "att_attended": 20,
            "s1": 21.0, "s2": 20.0, "q": 7.0, "a": 8.0, "grade": "B+"
        },
        # --- Semester VII ---
        {
            "id": "glb-stu-210033-ds",
            "college_id": "GLB21DS0033",
            "roll": "2101921540033",
            "name": "Simran Kaur",
            "email": "simran.kaur@glbitm.ac.in",
            "phone": "+91 98789 01234",
            "cgpa": 9.20,
            "section": "DS-4A",
            "branch": "CSE-DS",
            "semester": "Semester VII",
            "dept": "Computer Science - Data Science",
            "batch": "2021 - 2025",
            "sub_code": "KCS-701",
            "sub_name": "Distributed Systems",
            "att_total": 30, "att_attended": 28,
            "s1": 29.0, "s2": 29.0, "q": 10.0, "a": 10.0, "grade": "A+"
        },
        {
            "id": "glb-stu-210019-ai",
            "college_id": "GLB21AI0019",
            "roll": "2101921520019",
            "name": "Varun Chawla",
            "email": "varun.chawla@glbitm.ac.in",
            "phone": "+91 98890 12345",
            "cgpa": 8.50,
            "section": "AIML-4A",
            "branch": "AIML",
            "semester": "Semester VII",
            "dept": "Artificial Intelligence & Machine Learning",
            "batch": "2021 - 2025",
            "sub_code": "KCS-702",
            "sub_name": "Artificial Intelligence & Deep Learning",
            "att_total": 30, "att_attended": 26,
            "s1": 26.0, "s2": 27.0, "q": 8.0, "a": 9.0, "grade": "A"
        },
        # --- Semester VIII ---
        {
            "id": "glb-stu-200091",
            "college_id": "GLB20CS0091",
            "roll": "2001920100091",
            "name": "Neha Deshmukh",
            "email": "neha.deshmukh@glbitm.ac.in",
            "phone": "+91 98901 23456",
            "cgpa": 8.95,
            "section": "CSE-4B",
            "branch": "CSE",
            "semester": "Semester VIII",
            "dept": "Computer Science & Engineering",
            "batch": "2021 - 2025",
            "sub_code": "KOE-085",
            "sub_name": "Internet of Things",
            "att_total": 32, "att_attended": 30,
            "s1": 28.0, "s2": 29.0, "q": 10.0, "a": 10.0, "grade": "A+"
        },
        {
            "id": "glb-stu-200034",
            "college_id": "GLB20ME0034",
            "roll": "2001920400034",
            "name": "Kartik Nair",
            "email": "kartik.nair@glbitm.ac.in",
            "phone": "+91 98012 34567",
            "cgpa": 7.75,
            "section": "ME-4A",
            "branch": "ME",
            "semester": "Semester VIII",
            "dept": "Mechanical Engineering",
            "batch": "2021 - 2025",
            "sub_code": "KOE-074",
            "sub_name": "Renewable Energy Resources",
            "att_total": 32, "att_attended": 24,
            "s1": 22.0, "s2": 23.0, "q": 7.0, "a": 8.0, "grade": "B+"
        },
    ]

    for s in cohort_data:
        exists = db.query(User).filter(User.college_id == s["college_id"]).first()
        if exists:
            continue
        u = User(
            id=s["id"],
            college_id=s["college_id"],
            email=s["email"],
            hashed_password=hash_password("password123"),
            role="student",
            is_active=True,
        )
        db.add(u)
        db.flush()

        p = StudentProfile(
            id=s["id"],
            user_id=u.id,
            name=s["name"],
            enrollment_no=s["roll"],
            roll_number=s["roll"],
            college_id=s["college_id"],
            email=s["email"],
            phone=s["phone"],
            department=s.get("dept", "Computer Science & Engineering"),
            course="B.Tech",
            branch=s.get("branch", "CSE"),
            semester=s.get("semester", "Semester VI"),
            section=s["section"],
            batch=s.get("batch", "2022 - 2026"),
            mentor_name="Dr. Sanjeev Kumar Sharma (Associate Professor)",
            cgpa=s["cgpa"],
            total_credits=124,
        )
        db.add(p)
        db.flush()

        sub_code = s.get("sub_code", "KCS-601")
        sub_name = s.get("sub_name", "Database Management Systems")

        db.add(SubjectAttendance(
            id=f"att-{s['id']}-{sub_code}",
            student_id=p.id,
            subject_code=sub_code,
            subject_name=sub_name,
            faculty_name="Dr. Sanjeev Kumar Sharma",
            total_classes=s["att_total"],
            attended_classes=s["att_attended"],
            min_required=75.0,
        ))

        db.add(SubjectMarks(
            id=f"mrk-{s['id']}-{sub_code}",
            student_id=p.id,
            subject_code=sub_code,
            subject_name=sub_name,
            credits=4,
            faculty_name="Dr. Sanjeev Kumar Sharma",
            sessional1_scored=s["s1"],
            sessional1_max=30.0,
            sessional2_scored=s["s2"],
            sessional2_max=30.0,
            quizzes_scored=s["q"],
            quizzes_max=10.0,
            assignments_scored=s["a"],
            assignments_max=10.0,
            practicals_scored=18.0,
            practicals_max=20.0,
            grade_projected=s["grade"],
            trend="stable",
            change_percentage=0.0,
        ))
    db.commit()


def seed_database(db: Session):
    """Seed the database with initial realistic demo records across all semesters and branches."""
    print("Seeding GL Bajaj CampusOS database with academic curriculum and student records...")

    # 1. Base Users
    user_student = db.query(User).filter(User.college_id == "GLB21CS0892").first()
    if not user_student:
        user_student = User(
            id="glb-stu-210192",
            college_id="GLB21CS0892",
            email="yuvraj.cse@glbitm.ac.in",
            hashed_password=hash_password("password123"),
            role="student",
            is_active=True,
        )
        db.add(user_student)
        db.flush()

        student_profile = StudentProfile(
            id="glb-stu-210192",
            user_id=user_student.id,
            name="Yuvraj",
            enrollment_no="2101920100142",
            roll_number="2101920100142",
            college_id="GLB21CS0892",
            email="yuvraj.cse@glbitm.ac.in",
            phone="+91 98765 43210",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            department="Computer Science & Engineering",
            course="B.Tech",
            branch="CSE",
            semester="Semester VI",
            section="CSE-3B",
            batch="2022 - 2026",
            mentor_name="Dr. Sanjeev Kumar Sharma (Associate Professor)",
            blood_group="B+",
            cgpa=8.72,
            total_credits=124,
        )
        student_profile.achievements = [
            {
                "title": "1st Runner Up - Smart India Hackathon (Internal)",
                "date": "Dec 2025",
                "category": "Hackathon",
                "organization": "GL Bajaj Innovation & Incubation Centre"
            },
            {
                "title": "Dean’s Academic Merit List (Sem IV)",
                "date": "July 2025",
                "category": "Academic",
                "organization": "GL Bajaj Institute of Tech & Mgmt"
            },
            {
                "title": "Published Research Paper on Distributed Databases",
                "date": "Nov 2025",
                "category": "Research",
                "organization": "IEEE Student Branch GLBITM"
            }
        ]
        db.add(student_profile)

    user_faculty = db.query(User).filter(User.college_id == "FAC042CS").first()
    if not user_faculty:
        user_faculty = User(
            id="glb-fac-0042",
            college_id="FAC042CS",
            email="sanjeev.sharma@glbitm.ac.in",
            hashed_password=hash_password("password123"),
            role="faculty",
            is_active=True,
        )
        db.add(user_faculty)
        db.flush()

        faculty_profile = FacultyProfile(
            id="glb-fac-0042",
            user_id=user_faculty.id,
            name="Dr. Sanjeev Kumar Sharma",
            enrollment_no="EMP-CSE-042",
            college_id="FAC042CS",
            email="sanjeev.sharma@glbitm.ac.in",
            phone="+91 98112 34567",
            department="Computer Science & Engineering",
            course="B.Tech",
            branch="CSE",
            semester="Faculty Portal",
            section="CSE Senior Faculty",
            batch="Academic Year 2025-26",
        )
        db.add(faculty_profile)

    user_admin = db.query(User).filter(User.college_id == "ADM001").first()
    if not user_admin:
        user_admin = User(
            id="glb-adm-0001",
            college_id="ADM001",
            email="director.office@glbitm.ac.in",
            hashed_password=hash_password("password123"),
            role="admin",
            is_active=True,
        )
        db.add(user_admin)

    db.flush()
    student_profile = db.query(StudentProfile).filter(StudentProfile.id == "glb-stu-210192").first()

    # 2. Subjects (AKTU B.Tech Curriculum: Semesters I to VIII from NotesGallery)
    subjects_data = [
        # --- Semester I (1st Year) ---
        {
            "code": "BAS-103",
            "name": "Engineering Mathematics - I",
            "short_name": "Math-I",
            "credits": 4,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester I",
            "faculty_name": "Dr. Pratibha Singh",
            "color_code": "#2563eb",
            "description": "Matrices, Differential Calculus, Partial Differentiation, Expansion of Functions, Vector Calculus.",
            "syllabus": ["Unit 1: Matrices & Eigenvalues", "Unit 2: Differential Calculus I", "Unit 3: Differential Calculus II", "Unit 4: Multivariable Calculus", "Unit 5: Vector Calculus"]
        },
        {
            "code": "BAS-101",
            "name": "Engineering Physics",
            "short_name": "Physics",
            "credits": 4,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester I",
            "faculty_name": "Dr. R.K. Shukla",
            "color_code": "#7c3aed",
            "description": "Relativistic Mechanics, Quantum Mechanics, Wave Optics, Fiber Optics and Lasers.",
            "syllabus": ["Unit 1: Relativistic Mechanics", "Unit 2: Electromagnetic Field Theory", "Unit 3: Quantum Mechanics", "Unit 4: Wave Optics", "Unit 5: Fiber Optics & Laser"]
        },
        {
            "code": "BEE-101",
            "name": "Basic Electrical Engineering",
            "short_name": "BEE",
            "credits": 3,
            "type": "Theory",
            "department": "Electrical Engineering",
            "semester": "Semester I",
            "faculty_name": "Prof. Vivek Saxena",
            "color_code": "#d97706",
            "description": "DC Circuits, AC Circuits, Transformers, Electrical Machines, Electrical Installations.",
            "syllabus": ["Unit 1: DC Circuit Analysis", "Unit 2: Steady State AC Circuits", "Unit 3: Transformers", "Unit 4: Electrical Machines", "Unit 5: Power Converters & Installations"]
        },
        {
            "code": "BCS-101",
            "name": "Programming for Problem Solving",
            "short_name": "PPS (C)",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester I",
            "faculty_name": "Dr. Manoj Kumar",
            "color_code": "#059669",
            "description": "Problem solving through C programming, data types, control flow, functions, pointers, file handling.",
            "syllabus": ["Unit 1: Introduction to Computing & C Syntax", "Unit 2: Conditionals & Iterations", "Unit 3: Arrays & String Operations", "Unit 4: Functions & Recursion", "Unit 5: Pointers, Structures & File I/O"]
        },
        {
            "code": "BAS-105",
            "name": "Soft Skills",
            "short_name": "Soft Skills",
            "credits": 2,
            "type": "Theory",
            "department": "Humanities",
            "semester": "Semester I",
            "faculty_name": "Dr. Rashmi Tiwari",
            "color_code": "#0891b2",
            "description": "Interpersonal communication, phonetics, presentation mastery, and corporate etiquette.",
            "syllabus": ["Unit 1: Basics of Communication", "Unit 2: Applied Grammar & Vocabulary", "Unit 3: Reading Skills & Comprehension", "Unit 4: Professional Writing", "Unit 5: Presentation & Group Dynamics"]
        },

        # --- Semester II (1st Year) ---
        {
            "code": "BAS-203",
            "name": "Engineering Mathematics - II",
            "short_name": "Math-II",
            "credits": 4,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester II",
            "faculty_name": "Dr. Pratibha Singh",
            "color_code": "#2563eb",
            "description": "Ordinary Differential Equations of Higher Order, Multivariable Calculus, Complex Numbers and Functions.",
            "syllabus": ["Unit 1: ODE of Higher Order", "Unit 2: Multivariable Calculus (Integration)", "Unit 3: Sequences & Series", "Unit 4: Complex Variable (Differentiation)", "Unit 5: Complex Variable (Integration)"]
        },
        {
            "code": "BAS-102",
            "name": "Engineering Chemistry",
            "short_name": "Chemistry",
            "credits": 4,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester II",
            "faculty_name": "Dr. Sunita Dwivedi",
            "color_code": "#db2777",
            "description": "Atomic & Molecular Structure, Spectroscopic Techniques, Electrochemistry, Polymers and Fuels.",
            "syllabus": ["Unit 1: Atomic & Molecular Structure", "Unit 2: Spectroscopic Techniques", "Unit 3: Electrochemistry & Corrosion", "Unit 4: Water Chemistry", "Unit 5: Polymer & Organometallics"]
        },
        {
            "code": "BEC-201",
            "name": "Basic Electronics Engineering",
            "short_name": "Electronics",
            "credits": 3,
            "type": "Theory",
            "department": "Electronics & Communication Engineering",
            "semester": "Semester II",
            "faculty_name": "Prof. Deepshikha Roy",
            "color_code": "#9333ea",
            "description": "Semiconductor Diodes, BJT, FET, Operational Amplifiers, Digital Electronics.",
            "syllabus": ["Unit 1: Semiconductor Diodes", "Unit 2: Bipolar Junction Transistor", "Unit 3: Field Effect Transistor", "Unit 4: Operational Amplifiers", "Unit 5: Digital Logic Fundamentals"]
        },
        {
            "code": "BME-101",
            "name": "Fundamentals of Mechanical Engineering",
            "short_name": "Mechanical",
            "credits": 3,
            "type": "Theory",
            "department": "Mechanical Engineering",
            "semester": "Semester II",
            "faculty_name": "Dr. Ankit Tyagi",
            "color_code": "#ea580c",
            "description": "Laws of Thermodynamics, Steam Boilers, IC Engines, Refrigeration, Power Transmission.",
            "syllabus": ["Unit 1: Introduction to Mechanics", "Unit 2: First & Second Laws of Thermodynamics", "Unit 3: IC Engines & Air Standard Cycles", "Unit 4: Refrigeration & Air Conditioning", "Unit 5: Fluid Mechanics & Hydraulic Machines"]
        },
        {
            "code": "BAS-204",
            "name": "Environment & Ecology",
            "short_name": "EVS",
            "credits": 2,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester II",
            "faculty_name": "Dr. Alka Sharma",
            "color_code": "#16a34a",
            "description": "Ecosystem dynamics, air/water pollution, environmental impact assessment, global environmental issues.",
            "syllabus": ["Unit 1: Environment & Natural Resources", "Unit 2: Ecosystems & Biodiversity", "Unit 3: Environmental Pollution", "Unit 4: Social Issues & the Environment", "Unit 5: Environmental Regulations & Field Work"]
        },

        # --- Semester III (2nd Year) ---
        {
            "code": "KCS-301",
            "name": "Data Structures",
            "short_name": "DS",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester III",
            "faculty_name": "Dr. Ashish Patel",
            "color_code": "#2563eb",
            "description": "Linear and Non-Linear Data Structures, Stacks, Queues, Trees, AVL Trees, Graphs, Hashing algorithms.",
            "syllabus": ["Unit 1: Arrays, Stacks & Recursion", "Unit 2: Queues & Linked Lists", "Unit 3: Binary Trees, BST & AVL Trees", "Unit 4: Graphs & Shortest Path (Dijkstra)", "Unit 5: Hashing, Sorting & File Organizations"]
        },
        {
            "code": "KCS-302",
            "name": "Computer Organization & Architecture",
            "short_name": "COA",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester III",
            "faculty_name": "Dr. Shalini Sharma",
            "color_code": "#7c3aed",
            "description": "Register Transfer, Microprogrammed Control, CPU design, Memory Hierarchy, Pipeline Architecture.",
            "syllabus": ["Unit 1: Introduction to Computer Systems & ALU", "Unit 2: Control Design & Microprogramming", "Unit 3: Computer Arithmetic & Booth Algorithm", "Unit 4: Memory Organization & Cache Mapping", "Unit 5: Pipeline & Multiprocessors"]
        },
        {
            "code": "KCS-303",
            "name": "Discrete Structures & Theory of Logic",
            "short_name": "DSTL",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester III",
            "faculty_name": "Dr. R.K. Tomar",
            "color_code": "#d97706",
            "description": "Set Theory, Relations, Functions, Propositional Logic, Algebraic Structures, Lattices, Graph Theory.",
            "syllabus": ["Unit 1: Set Theory, Relations & Functions", "Unit 2: Algebraic Structures & Group Theory", "Unit 3: Lattices & Boolean Algebra", "Unit 4: Propositional & Predicate Logic", "Unit 5: Combinatorics, Recurrence & Graphs"]
        },
        {
            "code": "KAS-302",
            "name": "Mathematics - IV",
            "short_name": "Math-IV",
            "credits": 4,
            "type": "Theory",
            "department": "Applied Sciences",
            "semester": "Semester III",
            "faculty_name": "Dr. S.P. Srivastava",
            "color_code": "#0284c7",
            "description": "Partial Differential Equations, Statistical Techniques, Probability Distributions, Sampling and Testing of Hypothesis.",
            "syllabus": ["Unit 1: Partial Differential Equations", "Unit 2: Statistical Techniques I", "Unit 3: Statistical Techniques II", "Unit 4: Probability & Distributions", "Unit 5: Sampling, Hypothesis & Chi-Square"]
        },
        {
            "code": "KVE-301",
            "name": "Universal Human Values & Professional Ethics",
            "short_name": "UHV",
            "credits": 3,
            "type": "Theory",
            "department": "Humanities",
            "semester": "Semester III",
            "faculty_name": "Prof. Reena Mathur",
            "color_code": "#059669",
            "description": "Self-exploration, harmony in human being, harmony in family and society, harmony in nature, professional ethics.",
            "syllabus": ["Unit 1: Introduction to Value Education", "Unit 2: Harmony in the Human Being", "Unit 3: Harmony in Family & Society", "Unit 4: Harmony in Nature & Existence", "Unit 5: Professional Ethics & Competence"]
        },

        # --- Semester IV (2nd Year) ---
        {
            "code": "KCS-401",
            "name": "Operating Systems",
            "short_name": "OS",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester IV",
            "faculty_name": "Prof. Archana Singh",
            "color_code": "#7c3aed",
            "description": "Process management, CPU scheduling, synchronization, deadlocks, memory management, file systems.",
            "syllabus": ["Unit 1: OS Architecture & System Calls", "Unit 2: CPU Scheduling & Synchronization", "Unit 3: Deadlock Detection & Banker Algorithm", "Unit 4: Virtual Memory & Page Replacement", "Unit 5: File Systems & Disk Management"]
        },
        {
            "code": "KCS-402",
            "name": "Theory of Automata and Formal Languages",
            "short_name": "TAFL",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester IV",
            "faculty_name": "Dr. Ramanuj Gupta",
            "color_code": "#dc2626",
            "description": "Finite Automata (DFA/NFA), Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines.",
            "syllabus": ["Unit 1: Finite Automata & Regular Languages", "Unit 2: Regular Expressions & Pumping Lemma", "Unit 3: Context-Free Grammars & Normal Forms", "Unit 4: Pushdown Automata (PDA)", "Unit 5: Turing Machines & Decidability"]
        },
        {
            "code": "KCS-403",
            "name": "Microprocessor",
            "short_name": "Microprocessor",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester IV",
            "faculty_name": "Dr. Sunil Verma",
            "color_code": "#ea580c",
            "description": "8085 and 8086 architecture, assembly language programming, memory interfacing, peripheral controllers.",
            "syllabus": ["Unit 1: 8085 Architecture & Pin Configuration", "Unit 2: 8085 Instruction Set & Timing Diagrams", "Unit 3: 8086 Microprocessor Architecture", "Unit 4: Memory & I/O Interfacing", "Unit 5: Peripheral Interfacing Devices"]
        },
        {
            "code": "KNC-402",
            "name": "Python Programming",
            "short_name": "Python",
            "credits": 2,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester IV",
            "faculty_name": "Prof. Meenakshi Sundaram",
            "color_code": "#059669",
            "description": "Core Python programming, data structures, object-oriented concepts, exception handling, NumPy & Pandas.",
            "syllabus": ["Unit 1: Python Basics & Conditionals", "Unit 2: Strings, Lists, Tuples & Dictionaries", "Unit 3: Functions, Modules & Packages", "Unit 4: Object-Oriented Programming in Python", "Unit 5: File I/O, NumPy & Data Analysis"]
        },
        {
            "code": "KNC-401",
            "name": "Cyber Security",
            "short_name": "Cyber Security",
            "credits": 2,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester IV",
            "faculty_name": "Dr. Alok Srivastava",
            "color_code": "#0891b2",
            "description": "Cyber crimes, security principles, malicious software, cryptography, cyber law and IT Act.",
            "syllabus": ["Unit 1: Cyber Security Fundamentals & Threats", "Unit 2: Security Assessment & Vulnerabilities", "Unit 3: Cryptography & Security Tools", "Unit 4: Cyber Law & IT Act 2000", "Unit 5: Digital Forensics & Incident Response"]
        },

        # --- Semester V (3rd Year) ---
        {
            "code": "KCS-501",
            "name": "Software Engineering",
            "short_name": "SE",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester V",
            "faculty_name": "Dr. Sanjeev Kumar Sharma",
            "color_code": "#2563eb",
            "description": "Software development life cycle, Agile methodologies, requirement engineering, UML design, software testing.",
            "syllabus": ["Unit 1: Software Process Models & Agile", "Unit 2: Requirements Analysis & Specification", "Unit 3: Software Design Concepts & UML", "Unit 4: Software Testing Techniques", "Unit 5: Software Maintenance & Metrics"]
        },
        {
            "code": "KCS-502",
            "name": "Compiler Design",
            "short_name": "CD",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester V",
            "faculty_name": "Dr. Ramanuj Gupta",
            "color_code": "#d97706",
            "description": "Lexical analysis, parsing techniques (LL/LR/LALR), syntax-directed translation, code optimization.",
            "syllabus": ["Unit 1: Introduction to Compilers & Lexical Analysis", "Unit 2: Syntax Analysis & Context-Free Grammars", "Unit 3: LR/LALR Parsing Algorithms", "Unit 4: Syntax-Directed Translation & Intermediate Code", "Unit 5: Code Optimization & Code Generation"]
        },
        {
            "code": "KCS-503",
            "name": "Design and Analysis of Algorithms",
            "short_name": "DAA",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester V",
            "faculty_name": "Dr. Ashish Patel",
            "color_code": "#059669",
            "description": "Divide and conquer, greedy methods, dynamic programming, backtracking, branch & bound, NP-completeness.",
            "syllabus": ["Unit 1: Asymptotic Notations & Recurrences", "Unit 2: Divide-and-Conquer & Greedy Algorithms", "Unit 3: Dynamic Programming (0/1 Knapsack, LCS)", "Unit 4: Backtracking & Branch-and-Bound", "Unit 5: Graph Algorithms, NP-Hard & NP-Complete"]
        },
        {
            "code": "KCS-055",
            "name": "Machine Learning",
            "short_name": "ML",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester V",
            "faculty_name": "Dr. Vivek Rastogi",
            "color_code": "#9333ea",
            "description": "Supervised & unsupervised learning, regression, decision trees, SVM, neural networks, clustering.",
            "syllabus": ["Unit 1: Introduction to Machine Learning", "Unit 2: Supervised Learning (Linear/Logistic)", "Unit 3: Decision Trees & Random Forests", "Unit 4: Support Vector Machines & Kernels", "Unit 5: Unsupervised Learning & Clustering"]
        },
        {
            "code": "KAI-051",
            "name": "Artificial Intelligence",
            "short_name": "AI",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester V",
            "faculty_name": "Dr. Neha Agarwal",
            "color_code": "#ec4899",
            "description": "State space search, heuristics (A*, Minimax), knowledge representation, reasoning, planning.",
            "syllabus": ["Unit 1: Introduction & State Space Representation", "Unit 2: Heuristic Search Strategies (A*, IDA*)", "Unit 3: Game Playing & Adversarial Search", "Unit 4: Knowledge Representation & First-Order Logic", "Unit 5: Reasoning under Uncertainty & Bayes Nets"]
        },

        # --- Semester VI (3rd Year) ---
        {
            "code": "KCS-601",
            "name": "Database Management Systems",
            "short_name": "DBMS",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Dr. Sanjeev Kumar Sharma",
            "color_code": "#2563eb",
            "description": "Relational data model, SQL queries, ER modeling, normalization (1NF-BCNF), transaction concurrency & recovery.",
            "syllabus": ["Unit 1: Introduction to DBMS & Relational Model", "Unit 2: SQL, DDL, DML & Complex Queries", "Unit 3: Relational Design Theory & Normalization", "Unit 4: Transaction Processing & ACID Properties", "Unit 5: Concurrency Control & Recovery Protocols"]
        },
        {
            "code": "KCS-602",
            "name": "Web Technology",
            "short_name": "WT",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Prof. Archana Singh",
            "color_code": "#7c3aed",
            "description": "HTML5, CSS3, JavaScript, DOM manipulation, AJAX, Node.js, Express, REST APIs, JSON.",
            "syllabus": ["Unit 1: HTML5, CSS3 & Responsive Design", "Unit 2: JavaScript & Modern ES6+", "Unit 3: DOM, Events & AJAX Communication", "Unit 4: Server-Side Node.js & Express Framework", "Unit 5: RESTful APIs, JSON & Web Security"]
        },
        {
            "code": "KCS-603",
            "name": "Computer Networks",
            "short_name": "CN",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Dr. Alok Srivastava",
            "color_code": "#d97706",
            "description": "OSI and TCP/IP models, data link protocols, routing algorithms, transport layer (TCP/UDP), application layer (DNS, HTTP).",
            "syllabus": ["Unit 1: Network Architecture & Physical Layer", "Unit 2: Data Link Layer & MAC Protocols", "Unit 3: Network Layer & Routing Algorithms", "Unit 4: Transport Layer Protocols (TCP/UDP)", "Unit 5: Application Layer Services & Security"]
        },
        {
            "code": "KOE-068",
            "name": "Software Project Management",
            "short_name": "SPM",
            "credits": 3,
            "type": "Theory",
            "department": "Open Elective",
            "semester": "Semester VI",
            "faculty_name": "Dr. Neha Mittal",
            "color_code": "#dc2626",
            "description": "Project planning, effort estimation, Agile frameworks, risk management.",
            "syllabus": ["Unit 1: Project Evaluation & Planning", "Unit 2: Activity Planning & Network Analysis", "Unit 3: Risk Management & Cost Estimation", "Unit 4: Monitoring & Control in Agile", "Unit 5: Team Management & Quality Assurance"]
        },
        {
            "code": "KCS-062",
            "name": "Cloud Computing",
            "short_name": "Cloud",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Dr. Shalini Sharma",
            "color_code": "#0284c7",
            "description": "Cloud service models (IaaS, PaaS, SaaS), virtualization, cloud architecture, storage, security.",
            "syllabus": ["Unit 1: Cloud Principles & Delivery Models", "Unit 2: Virtualization & Hypervisors", "Unit 3: Cloud Architecture & AWS/Azure Overview", "Unit 4: Cloud Storage & Distributed File Systems", "Unit 5: Cloud Security, Privacy & SLA"]
        },
        {
            "code": "KCS-651",
            "name": "Database Management Systems Lab",
            "short_name": "DBMS Lab",
            "credits": 2,
            "type": "Practical",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Dr. Sanjeev Kumar Sharma",
            "color_code": "#059669",
            "description": "Hands-on implementation of DDL, DML, triggers, cursors, and stored procedures in PostgreSQL/Oracle.",
            "syllabus": ["Experiment 1-3: DDL & DML Commands", "Experiment 4-6: Complex SQL Joins & Subqueries", "Experiment 7-8: PL/SQL Cursors & Triggers", "Experiment 9-10: Database Project Evaluation"]
        },
        {
            "code": "KCS-652",
            "name": "Operating Systems Lab",
            "short_name": "OS Lab",
            "credits": 2,
            "type": "Practical",
            "department": "Computer Science & Engineering",
            "semester": "Semester VI",
            "faculty_name": "Prof. Archana Singh",
            "color_code": "#0891b2",
            "description": "UNIX system calls, process creation using fork(), CPU scheduling simulation.",
            "syllabus": ["Experiment 1-2: Linux Basic Shell Scripting", "Experiment 3-4: Process Creation (fork, exec)", "Experiment 5-7: Scheduling Algorithms Simulation", "Experiment 8-10: Semaphore & Mutex Programming"]
        },

        # --- Semester VII (4th Year) ---
        {
            "code": "KCS-701",
            "name": "Distributed Systems",
            "short_name": "DS",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VII",
            "faculty_name": "Dr. Hemant Kumar",
            "color_code": "#2563eb",
            "description": "Architectures, RPC, clock synchronization, distributed mutual exclusion, consensus algorithms (Paxos, Raft).",
            "syllabus": ["Unit 1: Distributed System Characterization & Models", "Unit 2: Remote Procedure Calls & Message Passing", "Unit 3: Clock Synchronization & Logical Clocks", "Unit 4: Distributed Mutual Exclusion & Election", "Unit 5: Distributed Transactions & Consensus"]
        },
        {
            "code": "KCS-702",
            "name": "Artificial Intelligence & Deep Learning",
            "short_name": "AI & DL",
            "credits": 4,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VII",
            "faculty_name": "Dr. Vivek Rastogi",
            "color_code": "#7c3aed",
            "description": "Feedforward neural networks, backpropagation, CNNs for computer vision, RNNs/LSTMs, generative models.",
            "syllabus": ["Unit 1: Deep Learning Foundations & Neural Nets", "Unit 2: Optimization, Loss Functions & Backprop", "Unit 3: Convolutional Neural Networks (CNNs)", "Unit 4: Sequence Modeling & RNNs/LSTMs", "Unit 5: Attention Mechanisms & Modern LLMs"]
        },
        {
            "code": "KCS-074",
            "name": "Natural Language Processing",
            "short_name": "NLP",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VII",
            "faculty_name": "Dr. Neha Agarwal",
            "color_code": "#059669",
            "description": "Morphological analysis, language modeling, POS tagging, Word2Vec, Transformer architectures, text generation.",
            "syllabus": ["Unit 1: NLP Foundations & Tokenization", "Unit 2: N-gram Models & Part-of-Speech Tagging", "Unit 3: Word Embeddings (Word2Vec, GloVe)", "Unit 4: Transformer Architecture & Attention", "Unit 5: Text Summarization & Sentiment Analysis"]
        },
        {
            "code": "KCS-075",
            "name": "Cryptography & Network Security",
            "short_name": "CNS",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VII",
            "faculty_name": "Dr. Alok Srivastava",
            "color_code": "#dc2626",
            "description": "Symmetric and asymmetric encryption (DES, AES, RSA), digital signatures, cryptographic hashes, PKI, firewalls.",
            "syllabus": ["Unit 1: Security Threats & Classical Cryptography", "Unit 2: Block Ciphers, DES & AES", "Unit 3: Public-Key Cryptography & RSA Algorithm", "Unit 4: Hash Functions, SHA & Digital Signatures", "Unit 5: Network Security Protocols & Firewalls"]
        },

        # --- Semester VIII (4th Year) ---
        {
            "code": "KOE-085",
            "name": "Internet of Things",
            "short_name": "IoT",
            "credits": 3,
            "type": "Theory",
            "department": "Open Elective",
            "semester": "Semester VIII",
            "faculty_name": "Dr. Tarun Kumar",
            "color_code": "#0891b2",
            "description": "IoT architectural reference model, sensor networks, communication protocols (MQTT, CoAP), cloud platforms.",
            "syllabus": ["Unit 1: Introduction to IoT & Smart Ecosystems", "Unit 2: Sensors, Actuators & Microcontrollers", "Unit 3: IoT Communication Protocols (MQTT, CoAP)", "Unit 4: Cloud Integration & IoT Analytics", "Unit 5: IoT Applications, Security & Case Studies"]
        },
        {
            "code": "KOE-074",
            "name": "Renewable Energy Resources",
            "short_name": "RER",
            "credits": 3,
            "type": "Theory",
            "department": "Open Elective",
            "semester": "Semester VIII",
            "faculty_name": "Dr. R.K. Shukla",
            "color_code": "#16a34a",
            "description": "Solar radiation, photovoltaic conversion, wind energy, biomass, geothermal, ocean energy systems.",
            "syllabus": ["Unit 1: Principles of Solar Energy Radiation", "Unit 2: Solar Thermal & Photovoltaic Systems", "Unit 3: Wind Energy Conversion Systems", "Unit 4: Biomass & Geothermal Power", "Unit 5: Ocean Energy & Energy Storage Solutions"]
        },
        {
            "code": "KCS-081",
            "name": "High Performance Computing",
            "short_name": "HPC",
            "credits": 3,
            "type": "Theory",
            "department": "Computer Science & Engineering",
            "semester": "Semester VIII",
            "faculty_name": "Dr. Ashish Patel",
            "color_code": "#9333ea",
            "description": "Parallel computer architectures, OpenMP, MPI, GPU computing with CUDA, performance tuning.",
            "syllabus": ["Unit 1: Introduction to Parallel Computing", "Unit 2: Shared Memory Programming with OpenMP", "Unit 3: Distributed Memory Programming with MPI", "Unit 4: GPU Architecture & CUDA Programming", "Unit 5: Performance Analysis & Benchmarking"]
        }
    ]

    for s_info in subjects_data:
        existing = db.query(Subject).filter(Subject.code == s_info["code"]).first()
        if existing:
            continue
        sub = Subject(
            code=s_info["code"],
            name=s_info["name"],
            short_name=s_info["short_name"],
            credits=s_info["credits"],
            type=s_info["type"],
            department=s_info["department"],
            semester=s_info["semester"],
            faculty_name=s_info["faculty_name"],
            color_code=s_info["color_code"],
            description=s_info["description"],
        )
        sub.syllabus = s_info["syllabus"]
        db.add(sub)

    # 3. Attendance Records
    attendance_data = [
        {"code": "KCS-601", "name": "Database Management Systems", "faculty": "Dr. Sanjeev Kumar Sharma", "total": 26, "attended": 19},
        {"code": "KCS-602", "name": "Operating Systems", "faculty": "Prof. Archana Singh", "total": 24, "attended": 20},
        {"code": "KCS-603", "name": "Compiler Design", "faculty": "Dr. Ramanuj Gupta", "total": 28, "attended": 22},
        {"code": "KCS-651", "name": "DBMS Lab", "faculty": "Dr. Sanjeev Kumar Sharma", "total": 12, "attended": 10},
        {"code": "KCS-652", "name": "Operating Systems Lab", "faculty": "Prof. Archana Singh", "total": 12, "attended": 9},
        {"code": "KOE-068", "name": "Software Project Management", "faculty": "Dr. Neha Mittal", "total": 20, "attended": 16},
    ]

    for att in attendance_data:
        existing_att = db.query(SubjectAttendance).filter(SubjectAttendance.id == f"att-{student_profile.id}-{att['code']}").first()
        if existing_att:
            continue
        att_record = SubjectAttendance(
            id=f"att-{student_profile.id}-{att['code']}",
            student_id=student_profile.id,
            subject_code=att["code"],
            subject_name=att["name"],
            faculty_name=att["faculty"],
            total_classes=att["total"],
            attended_classes=att["attended"],
            min_required=75.0,
        )
        db.add(att_record)
        db.flush()

        # Add sample recent history
        dates = ["2026-03-24", "2026-03-26", "2026-03-28", "2026-03-31", "2026-04-02"]
        statuses = ["Present", "Present", "Absent" if att["code"] == "KCS-601" else "Present", "Present", "Present"]
        for d, st in zip(dates, statuses):
            h_record = AttendanceHistoryRecord(
                id=f"hist-{att_record.id}-{d}",
                subject_attendance_id=att_record.id,
                date=d,
                status=st,
            )
            db.add(h_record)

    # 4. Subject Marks (CIE)
    marks_data = [
        {
            "code": "KCS-601", "name": "Database Management Systems", "credits": 4, "faculty": "Dr. Sanjeev Kumar Sharma",
            "s1": 22.0, "s2": 24.0, "q": 8.0, "a": 9.0, "p": 18.0, "grade": "B+", "trend": "up", "change": 4.5
        },
        {
            "code": "KCS-602", "name": "Operating Systems", "credits": 4, "faculty": "Prof. Archana Singh",
            "s1": 25.0, "s2": 26.0, "q": 9.0, "a": 9.0, "p": 19.0, "grade": "A", "trend": "up", "change": 3.0
        },
        {
            "code": "KCS-603", "name": "Compiler Design", "credits": 4, "faculty": "Dr. Ramanuj Gupta",
            "s1": 21.0, "s2": 23.0, "q": 8.0, "a": 8.0, "p": 16.0, "grade": "B+", "trend": "stable", "change": 1.2
        },
        {
            "code": "KOE-068", "name": "Software Project Management", "credits": 3, "faculty": "Dr. Neha Mittal",
            "s1": 26.0, "s2": 27.0, "q": 9.0, "a": 10.0, "p": 0.0, "grade": "A+", "trend": "up", "change": 5.0
        }
    ]

    for m in marks_data:
        existing_m = db.query(SubjectMarks).filter(SubjectMarks.id == f"mks-{student_profile.id}-{m['code']}").first()
        if existing_m:
            continue
        m_record = SubjectMarks(
            id=f"mks-{student_profile.id}-{m['code']}",
            student_id=student_profile.id,
            subject_code=m["code"],
            subject_name=m["name"],
            credits=m["credits"],
            faculty_name=m["faculty"],
            sessional1_scored=m["s1"],
            sessional1_max=30.0,
            sessional2_scored=m["s2"],
            sessional2_max=30.0,
            quizzes_scored=m["q"],
            quizzes_max=10.0,
            assignments_scored=m["a"],
            assignments_max=10.0,
            practicals_scored=m["p"],
            practicals_max=20.0 if m["p"] > 0 else 0.0,
            grade_projected=m["grade"],
            trend=m["trend"],
            change_percentage=m["change"],
        )
        db.add(m_record)

    # 5. Timetable Slots
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    slot_templates = [
        {"time": "09:00 AM – 09:50 AM", "start": "09:00", "end": "09:50", "code": "KCS-601", "name": "Database Management Systems", "faculty": "Dr. Sanjeev Kumar Sharma", "room": "Room 304, AB-2", "type": "Lecture"},
        {"time": "09:50 AM – 10:40 AM", "start": "09:50", "end": "10:40", "code": "KCS-602", "name": "Operating Systems", "faculty": "Prof. Archana Singh", "room": "Room 304, AB-2", "type": "Lecture"},
        {"time": "10:55 AM – 11:45 AM", "start": "10:55", "end": "11:45", "code": "KCS-603", "name": "Compiler Design", "faculty": "Dr. Ramanuj Gupta", "room": "Room 304, AB-2", "type": "Lecture"},
        {"time": "11:45 AM – 12:35 PM", "start": "11:45", "end": "12:35", "code": "KOE-068", "name": "Software Project Management", "faculty": "Dr. Neha Mittal", "room": "Room 304, AB-2", "type": "Lecture"},
        {"time": "01:30 PM – 03:10 PM", "start": "01:30", "end": "03:10", "code": "KCS-651", "name": "DBMS Lab (Batch B1)", "faculty": "Dr. Sanjeev Kumar Sharma", "room": "Lab 4, Computer Centre", "type": "Lab"},
    ]

    for day in days:
        for idx, tmpl in enumerate(slot_templates):
            existing_tt = db.query(TimetableSlotModel).filter(TimetableSlotModel.id == f"tt-{day.lower()[:3]}-{idx}").first()
            if existing_tt:
                continue
            tt_slot = TimetableSlotModel(
                id=f"tt-{day.lower()[:3]}-{idx}",
                day=day,
                time=tmpl["time"],
                start_time=tmpl["start"],
                end_time=tmpl["end"],
                subject_code=tmpl["code"],
                subject_name=tmpl["name"],
                faculty_name=tmpl["faculty"],
                room=tmpl["room"],
                type=tmpl["type"],
                semester="Semester VI",
                section="CSE-3B",
            )
            db.add(tt_slot)

    # 6. Assignments
    assignments_data = [
        {
            "id": "asg-01",
            "code": "KCS-603",
            "name": "Compiler Design",
            "title": "Lab Assignment 3: LALR Parsing Tables & Conflict Handling",
            "desc": "Implement Shift-Reduce parsing conflict detection and generate an LALR(1) state transition table in Python/C++.",
            "faculty": "Dr. Ramanuj Gupta",
            "assigned": "2026-03-25",
            "due": "Tomorrow, 11:59 PM",
            "priority": "HIGH PRIORITY",
            "max": 10,
            "status": "Pending",
        },
        {
            "id": "asg-02",
            "code": "KCS-601",
            "name": "Database Management Systems",
            "title": "Assignment 2: Relational Calculus & Complex SQL Joins",
            "desc": "Solve 10 relational algebra calculus problems and formulate nested correlated queries on university ERP schema.",
            "faculty": "Dr. Sanjeev Kumar Sharma",
            "assigned": "2026-03-22",
            "due": "In 3 Days",
            "priority": "MEDIUM PRIORITY",
            "max": 10,
            "status": "Pending",
        },
        {
            "id": "asg-03",
            "code": "KCS-602",
            "name": "Operating Systems",
            "title": "System Assignment: Banker's Deadlock Algorithm & Semaphore",
            "desc": "Simulate resource-allocation graphs and deadlock detection using multithreaded pthreads in Linux.",
            "faculty": "Prof. Archana Singh",
            "assigned": "2026-03-20",
            "due": "In 5 Days",
            "priority": "NORMAL",
            "max": 10,
            "status": "Pending",
        },
        {
            "id": "asg-04",
            "code": "KCS-651",
            "name": "DBMS Lab",
            "title": "DBMS Mini Project Phase 1: E-R Diagram & Schema Design",
            "desc": "Comprehensive Normalized schema design document with ER diagram and DDL scripts.",
            "faculty": "Dr. Sanjeev Kumar Sharma",
            "assigned": "2026-03-10",
            "due": "2026-03-20",
            "priority": "NORMAL",
            "max": 15,
            "status": "Submitted",
            "file": "DBMS_Phase1_Yuvraj.pdf",
            "marks": 14.0,
        },
    ]

    for a_data in assignments_data:
        existing_asg = db.query(Assignment).filter(Assignment.id == a_data["id"]).first()
        if existing_asg:
            continue
        asg = Assignment(
            id=a_data["id"],
            subject_code=a_data["code"],
            subject_name=a_data["name"],
            title=a_data["title"],
            description=a_data["desc"],
            faculty_name=a_data["faculty"],
            assigned_date=a_data["assigned"],
            due_date=a_data["due"],
            priority=a_data["priority"],
            max_marks=a_data["max"],
        )
        db.add(asg)

        sub = AssignmentSubmission(
            id=f"sub-{a_data['id']}-{student_profile.id}",
            assignment_id=asg.id,
            student_id=student_profile.id,
            status=a_data["status"],
            submitted_date="2026-03-19" if a_data["status"] == "Submitted" else None,
            marks_obtained=a_data.get("marks"),
            file_attachment=a_data.get("file"),
        )
        db.add(sub)

    # 7. Study Resources (Notes & Quantum Series from NotesGallery)
    notes_data = [
        # --- Semester I (1st Year) ---
        {
            "id": "note-bas103",
            "title": "Engineering Mathematics - I Complete Handwritten Notes (All Units)",
            "code": "BAS-103",
            "name": "Engineering Mathematics - I",
            "unit": "Units 1-5",
            "topic": "Matrices, Differential Calculus, Vector Calculus & Cayley-Hamilton Theorem",
            "type": "PDF",
            "size": "8.4 MB",
            "date": "March 2026",
            "faculty": "Dr. Pratibha Singh",
            "download_url": "https://notesgallery.com/aktu-notes/aktu-1st-year-notes-2/",
            "summary": "Official AKTU First Year handwritten notes extracted from NotesGallery covering all 5 units with solved previous year numericals."
        },
        {
            "id": "note-bas101",
            "title": "Engineering Physics 1st Year Quantum Series PDF & Formula Sheet",
            "code": "BAS-101",
            "name": "Engineering Physics",
            "unit": "Units 1-5",
            "topic": "Relativistic Mechanics, Quantum Mechanics, Wave Optics, Fiber Optics & Lasers",
            "type": "PDF",
            "size": "12.1 MB",
            "date": "March 2026",
            "faculty": "Dr. R.K. Shukla",
            "download_url": "https://notesgallery.com/quantum-series-pdfs/1st-year-quantum-pdf/",
            "summary": "Complete AKTU Quantum series PDF from NotesGallery containing 5-year solved short and long answer questions."
        },
        {
            "id": "note-bcs101",
            "title": "Programming for Problem Solving (PPS C) Comprehensive Lecture Slides",
            "code": "BCS-101",
            "name": "Programming for Problem Solving",
            "unit": "Units 1-4",
            "topic": "C Basics, Conditionals, Loops, Arrays, Pointers, Structures & File I/O",
            "type": "PPT",
            "size": "6.8 MB",
            "date": "March 2026",
            "faculty": "Dr. Manoj Kumar",
            "download_url": "https://notesgallery.com/b-tech-1st-year-free-study-materials-aktu/",
            "summary": "Unit-wise syntax breakdowns, dry-runs, and 50+ AKTU exam C coding problems."
        },

        # --- Semester II (1st Year) ---
        {
            "id": "note-bas203",
            "title": "Engineering Mathematics - II Notes & Solved Question Bank",
            "code": "BAS-203",
            "name": "Engineering Mathematics - II",
            "unit": "Units 1-5",
            "topic": "Higher Order ODE, Multivariable Integration, Complex Variables",
            "type": "PDF",
            "size": "9.2 MB",
            "date": "March 2026",
            "faculty": "Dr. Pratibha Singh",
            "download_url": "https://notesgallery.com/aktu-notes/aktu-1st-year-notes-2/",
            "summary": "Handwritten notes with step-by-step solutions for Cauchy-Euler equations and residue theorem."
        },
        {
            "id": "note-bec201",
            "title": "Basic Electronics Engineering Quantum Series PDF",
            "code": "BEC-201",
            "name": "Basic Electronics Engineering",
            "unit": "Units 1-5",
            "topic": "Semiconductor Diodes, BJT, FET, Op-Amps, Digital Logic Gates",
            "type": "PDF",
            "size": "11.5 MB",
            "date": "March 2026",
            "faculty": "Prof. Deepshikha Roy",
            "download_url": "https://notesgallery.com/quantum-series-pdfs/1st-year-quantum-pdf/",
            "summary": "Full NotesGallery Quantum revision guide with circuit diagrams and characteristic curves."
        },

        # --- Semester III (2nd Year) ---
        {
            "id": "note-kcs301",
            "title": "Data Structures Comprehensive Handwritten Notes (Trees, Graphs, Hashing)",
            "code": "KCS-301",
            "name": "Data Structures",
            "unit": "Units 1-5",
            "topic": "Stacks, Queues, Binary Trees, AVL Trees, Graphs, Dijkstra & Hashing",
            "type": "PDF",
            "size": "10.4 MB",
            "date": "February 2026",
            "faculty": "Dr. Ashish Patel",
            "download_url": "https://notesgallery.com/aktu-notes/aktu-2nd-year-notes-2/",
            "summary": "Extracted from NotesGallery 2nd Year hub: complete algorithm traces, time complexities, and C/C++ implementations."
        },
        {
            "id": "note-kcs303",
            "title": "Discrete Structures & Theory of Logic (DSTL) Quantum Series",
            "code": "KCS-303",
            "name": "Discrete Structures & Theory of Logic",
            "unit": "Units 1-5",
            "topic": "Sets, Relations, Group Theory, Lattices, Propositional Logic & Graph Theory",
            "type": "PDF",
            "size": "13.2 MB",
            "date": "February 2026",
            "faculty": "Dr. R.K. Tomar",
            "download_url": "https://notesgallery.com/quantum-series-pdfs/aktu-2nd-year-quantum-pdf-download-notes/",
            "summary": "AKTU 2nd Year Quantum Series PDF from NotesGallery containing 10-mark proofs and recurrence relations."
        },

        # --- Semester IV (2nd Year) ---
        {
            "id": "note-kcs401",
            "title": "Operating Systems Unit 3 & 4 Deadlock & Memory Handout",
            "code": "KCS-401",
            "name": "Operating Systems",
            "unit": "Units 3-4",
            "topic": "Resource Allocation Graphs, Safety Algorithm, Banker's Algorithm & Page Replacement",
            "type": "DOC",
            "size": "2.8 MB",
            "date": "February 2026",
            "faculty": "Prof. Archana Singh",
            "download_url": "https://notesgallery.com/aktu-notes/aktu-2nd-year-notes-2/",
            "summary": "Algorithmic steps and 10 solved AKTU numericals on safety state evaluation and LRU/FIFO paging."
        },
        {
            "id": "note-kcs402",
            "name": "Theory of Automata and Formal Languages",
            "title": "TAFL Complete Handwritten Unit Notes & State Transition Diagrams",
            "code": "KCS-402",
            "unit": "Units 1-5",
            "topic": "DFA/NFA conversion, Arden's Theorem, Chomsky Normal Form, PDA & Turing Machines",
            "type": "PDF",
            "size": "11.1 MB",
            "date": "February 2026",
            "faculty": "Dr. Ramanuj Gupta",
            "download_url": "https://notesgallery.com/aktu-notes/aktu-2nd-year-notes-2/",
            "summary": "Handwritten NotesGallery unit guide covering Pumping Lemma proofs and state minimizations."
        },

        # --- Semester V (3rd Year) ---
        {
            "id": "note-kcs501",
            "title": "Unit 3: Normalization & Functional Dependencies Complete Notes",
            "code": "KCS-501",
            "name": "Database Management Systems",
            "unit": "Unit 3",
            "topic": "Normalization (1NF, 2NF, 3NF, BCNF, 4NF, 5NF) & Lossless Join Decomposition",
            "type": "PDF",
            "size": "4.8 MB",
            "date": "March 2026",
            "faculty": "Dr. Sanjeev Kumar Sharma",
            "download_url": "https://notesgallery.com/aktu-3rd-year-notes/",
            "summary": "Full handwritten unit notes from NotesGallery including proof of lossless decomposition and dependency preservation with 15 solved AKTU problems."
        },
        {
            "id": "note-kcs502",
            "title": "Lexical Analysis & Bottom-Up Parsing Comprehensive Slides",
            "code": "KCS-502",
            "name": "Compiler Design",
            "unit": "Unit 2",
            "topic": "Shift-Reduce Parsing, Operator Precedence, LR(0), SLR(1), CLR(1), LALR(1)",
            "type": "PPT",
            "size": "6.1 MB",
            "date": "February 2026",
            "faculty": "Dr. Ramanuj Gupta",
            "download_url": "https://notesgallery.com/aktu-3rd-year-notes/",
            "summary": "Detailed parsing table generation algorithms with side-by-side comparison tables."
        },
        {
            "id": "note-kcs503",
            "title": "Design and Analysis of Algorithms (DAA) Quantum Series PDF",
            "code": "KCS-503",
            "name": "Design and Analysis of Algorithms",
            "unit": "Units 1-5",
            "topic": "Divide and Conquer, Dynamic Programming (0/1 Knapsack, LCS), Backtracking, NP-Complete",
            "type": "PDF",
            "size": "14.5 MB",
            "date": "February 2026",
            "faculty": "Dr. Ashish Patel",
            "download_url": "https://notesgallery.com/quantum-series-pdfs/3rd-year-quantum-pdf/",
            "summary": "3rd Year AKTU Quantum Series PDF downloaded from NotesGallery covering high-frequency university exam proofs."
        },

        # --- Semester VI (3rd Year) ---
        {
            "id": "note-kcs601",
            "title": "Database Management Systems & SQL Query Optimization Notes",
            "code": "KCS-601",
            "name": "Database Management Systems",
            "unit": "Units 1-5",
            "topic": "ER Modeling, Normalization (1NF-BCNF), SQL Joins, Indexing, Transaction Isolation Levels",
            "type": "PDF",
            "size": "6.8 MB",
            "date": "March 2026",
            "faculty": "Dr. Sanjeev Kumar Sharma",
            "download_url": "https://notesgallery.com/aktu-3rd-year-notes/",
            "summary": "NotesGallery 3rd Year DBMS handwritten notes covering normalization proofs, indexing, and solved AKTU questions."
        },
        {
            "id": "note-kcs603",
            "title": "Computer Networks Quantum Series PDF (OSI, TCP/IP & Routing)",
            "code": "KCS-603",
            "name": "Computer Networks",
            "unit": "Units 1-5",
            "topic": "OSI vs TCP/IP, Sliding Window, Distance Vector, Link State, TCP/UDP & DNS",
            "type": "PDF",
            "size": "13.8 MB",
            "date": "March 2026",
            "faculty": "Dr. Alok Srivastava",
            "download_url": "https://notesgallery.com/quantum-series-pdfs/3rd-year-quantum-pdf/",
            "summary": "NotesGallery 3rd Year Quantum series for Computer Networks with solved AKTU past questions."
        },

        # --- Semester VII (4th Year) ---
        {
            "id": "note-kcs701",
            "title": "Distributed Systems Quantum Series PDF & Handouts",
            "code": "KCS-701",
            "name": "Distributed Systems",
            "unit": "Units 1-5",
            "topic": "RPC Architecture, Lamport Logical Clocks, Distributed Mutual Exclusion, Paxos & Raft",
            "type": "PDF",
            "size": "15.2 MB",
            "date": "January 2026",
            "faculty": "Dr. Hemant Kumar",
            "download_url": "https://notesgallery.com/7th-semester-quantum-series-free-pdf/",
            "summary": "Official NotesGallery 7th Semester Quantum Series PDF for B.Tech CSE/IT Distributed Systems."
        },
        {
            "id": "note-kcs702",
            "title": "Deep Learning & Neural Networks Architectural Guide",
            "code": "KCS-702",
            "name": "Artificial Intelligence & Deep Learning",
            "unit": "Units 2-4",
            "topic": "Backpropagation, Convolutional Neural Networks (CNNs), RNNs & Attention Mechanism",
            "type": "PDF",
            "size": "7.5 MB",
            "date": "January 2026",
            "faculty": "Dr. Vivek Rastogi",
            "download_url": "https://notesgallery.com/b-tech-aktu-4th-year-quantum-pdf/",
            "summary": "Comprehensive mathematical derivation of gradient descent, convolutional filters, and transformer self-attention."
        },

        # --- Semester VIII (4th Year) ---
        {
            "id": "note-koe085",
            "title": "Internet of Things (IoT) 8th Sem Common Quantum Series PDF",
            "code": "KOE-085",
            "name": "Internet of Things",
            "unit": "Units 1-5",
            "topic": "IoT Reference Architecture, Sensors, Actuators, MQTT, CoAP, Cloud Platforms & Security",
            "type": "PDF",
            "size": "12.7 MB",
            "date": "January 2026",
            "faculty": "Dr. Tarun Kumar",
            "download_url": "https://notesgallery.com/latest-b-tech-8th-sem-quantums-oe-3-oe-4-common-aktu/",
            "summary": "Latest AKTU 8th Sem Common Open Elective Quantum Series PDF from NotesGallery."
        },
        {
            "id": "note-koe074",
            "title": "Renewable Energy Resources Complete Notes & Solved Papers",
            "code": "KOE-074",
            "name": "Renewable Energy Resources",
            "unit": "Units 1-5",
            "topic": "Solar Radiation, Photovoltaics, Wind Energy Systems, Biomass Gasification, Geothermal",
            "type": "PDF",
            "size": "9.9 MB",
            "date": "January 2026",
            "faculty": "Dr. R.K. Shukla",
            "download_url": "https://notesgallery.com/latest-b-tech-8th-sem-quantums-oe-3-oe-4-common-aktu/",
            "summary": "NotesGallery 8th Semester Open Elective study material with complete environmental and economic evaluations."
        }
    ]

    for n_data in notes_data:
        existing = db.query(StudyResource).filter(StudyResource.id == n_data["id"]).first()
        if existing:
            continue
        res = StudyResource(
            id=n_data["id"],
            title=n_data["title"],
            subject_code=n_data["code"],
            subject_name=n_data["name"],
            unit=n_data["unit"],
            topic=n_data["topic"],
            type=n_data["type"],
            file_size=n_data["size"],
            uploaded_date=n_data["date"],
            faculty_name=n_data["faculty"],
            uploaded_by=n_data["faculty"],
            download_url=n_data.get("download_url", f"/api/v1/resources/download/{n_data['id']}"),
            summary=n_data["summary"],
        )
        db.add(res)

    # 8. AKTU PYQs (Semesters I to VIII from NotesGallery Archives)
    pyqs_data = [
        # --- Semester I ---
        {
            "id": "pyq-sem1-01",
            "q": "Find the Eigenvalues and Eigenvectors of the matrix A = [[1, 2, 3], [0, 2, 3], [0, 0, 2]]. Verify Cayley-Hamilton theorem and compute A^-1.",
            "code": "BAS-103",
            "name": "Engineering Mathematics - I",
            "sem": "Semester I",
            "year": 2024,
            "unit": "Unit 1",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 5,
            "topic": "Matrices & Cayley-Hamilton",
            "marks": 10
        },
        {
            "id": "pyq-sem1-02",
            "q": "Explain the concept of length contraction and time dilation in relativistic mechanics with derivation based on Lorentz transformations.",
            "code": "BAS-101",
            "name": "Engineering Physics",
            "sem": "Semester I",
            "year": 2024,
            "unit": "Unit 1",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 4,
            "topic": "Special Theory of Relativity",
            "marks": 10
        },
        # --- Semester II ---
        {
            "id": "pyq-sem2-01",
            "q": "Solve the second order differential equation using method of variation of parameters: d2y/dx2 + a2 y = tan(ax).",
            "code": "BAS-203",
            "name": "Engineering Mathematics - II",
            "sem": "Semester II",
            "year": 2024,
            "unit": "Unit 1",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 4,
            "topic": "Differential Equations",
            "marks": 10
        },
        {
            "id": "pyq-sem2-02",
            "q": "Explain the working of a full-wave bridge rectifier with a neat circuit diagram and derive expressions for ripple factor and efficiency.",
            "code": "BEC-201",
            "name": "Basic Electronics Engineering",
            "sem": "Semester II",
            "year": 2023,
            "unit": "Unit 1",
            "exam": "End-Sem",
            "diff": "Easy",
            "freq": 5,
            "topic": "Rectifiers & Diodes",
            "marks": 10
        },
        # --- Semester III ---
        {
            "id": "pyq-sem3-01",
            "q": "Explain AVL Tree rotations with examples. Construct an AVL tree by inserting the elements: 10, 20, 30, 40, 50, 25, 27 into an initially empty tree.",
            "code": "KCS-301",
            "name": "Data Structures",
            "sem": "Semester III",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 5,
            "topic": "AVL Trees & Balanced Trees",
            "marks": 10
        },
        {
            "id": "pyq-sem3-02",
            "q": "Define a Lattice. Show that the set D_30 of all positive divisors of 30 under the relation 'divides' forms a Boolean algebra.",
            "code": "KCS-303",
            "name": "Discrete Structures & Theory of Logic",
            "sem": "Semester III",
            "year": 2023,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 4,
            "topic": "Lattices & Boolean Algebra",
            "marks": 10
        },
        # --- Semester IV ---
        {
            "id": "pyq-sem4-01",
            "q": "Consider a system with 5 processes P0 through P4 and 3 resource types A (10), B (5), C (7). Determine if the system is in a safe state using Banker's algorithm.",
            "code": "KCS-401",
            "name": "Operating Systems",
            "sem": "Semester IV",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 4,
            "topic": "Deadlock & Banker's Algorithm",
            "marks": 10
        },
        {
            "id": "pyq-sem4-02",
            "q": "Construct a minimum state DFA equivalent to the NFA given with states {q0, q1, q2} and alphabet {0, 1}. State and prove Arden's Theorem.",
            "code": "KCS-402",
            "name": "Theory of Automata and Formal Languages",
            "sem": "Semester IV",
            "year": 2024,
            "unit": "Unit 1",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 5,
            "topic": "DFA Minimization & Arden's Theorem",
            "marks": 10
        },
        # --- Semester V ---
        {
            "id": "pyq-sem5-01",
            "q": "State and prove Boyce-Codd Normal Form (BCNF). Decompose R(A,B,C,D,E) with F={A->BC, CD->E, B->D, E->A} into 3NF and BCNF.",
            "code": "KCS-501",
            "name": "Database Management Systems",
            "sem": "Semester V",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 4,
            "topic": "Normalization & Decomposition",
            "marks": 10
        },
        {
            "id": "pyq-sem5-02",
            "q": "Solve the 0/1 Knapsack problem using Dynamic Programming where weights w={2, 3, 4, 5}, values v={3, 4, 5, 6} and knapsack capacity W=5.",
            "code": "KCS-503",
            "name": "Design and Analysis of Algorithms",
            "sem": "Semester V",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 5,
            "topic": "Dynamic Programming (Knapsack)",
            "marks": 10
        },
        {
            "id": "pyq-sem5-03",
            "q": "Construct the Canonical collection of LR(0) items and build the SLR(1) parsing table for the grammar: S -> C C, C -> c C | d.",
            "code": "KCS-502",
            "name": "Compiler Design",
            "sem": "Semester V",
            "year": 2024,
            "unit": "Unit 2",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 5,
            "topic": "LR Parsing Tables",
            "marks": 10
        },
        # --- Semester VI ---
        {
            "id": "pyq-sem6-01",
            "q": "What is normalization? Explain 1NF, 2NF, 3NF and BCNF with suitable relational examples and functional dependency diagrams.",
            "code": "KCS-601",
            "name": "Database Management Systems",
            "sem": "Semester VI",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 6,
            "topic": "Normalization & Functional Dependencies",
            "marks": 10
        },
        {
            "id": "pyq-sem6-02",
            "q": "Explain Dijkstra's Link-State routing algorithm. For a 6-node network graph with given link costs, trace the execution of the algorithm to find shortest paths from source node A.",
            "code": "KCS-603",
            "name": "Computer Networks",
            "sem": "Semester VI",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 5,
            "topic": "Routing Algorithms (Dijkstra)",
            "marks": 10
        },
        # --- Semester VII ---
        {
            "id": "pyq-sem7-01",
            "q": "Explain Lamport's Logical Clocks and Vector Clocks. How does Lamport's algorithm enforce total ordering of events in a distributed system?",
            "code": "KCS-701",
            "name": "Distributed Systems",
            "sem": "Semester VII",
            "year": 2023,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Hard",
            "freq": 4,
            "topic": "Logical Clocks & Event Ordering",
            "marks": 10
        },
        {
            "id": "pyq-sem7-02",
            "q": "In an RSA cryptosystem, given p=11, q=13, and encryption key e=7. Determine the private key d and encrypt the plaintext M=9.",
            "code": "KCS-075",
            "name": "Cryptography & Network Security",
            "sem": "Semester VII",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 5,
            "topic": "RSA Public Key Cryptography",
            "marks": 10
        },
        # --- Semester VIII ---
        {
            "id": "pyq-sem8-01",
            "q": "Describe the MQTT protocol architecture in detail. Explain the Publish/Subscribe model, MQTT packet structure, and Quality of Service (QoS) levels 0, 1, and 2.",
            "code": "KOE-085",
            "name": "Internet of Things",
            "sem": "Semester VIII",
            "year": 2024,
            "unit": "Unit 3",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 5,
            "topic": "MQTT Protocol & QoS Levels",
            "marks": 10
        },
        {
            "id": "pyq-sem8-02",
            "q": "Explain the principle of solar photovoltaic power generation. Draw the equivalent circuit of a solar PV cell and derive its I-V characteristics equation.",
            "code": "KOE-074",
            "name": "Renewable Energy Resources",
            "sem": "Semester VIII",
            "year": 2024,
            "unit": "Unit 2",
            "exam": "End-Sem",
            "diff": "Medium",
            "freq": 4,
            "topic": "Solar Photovoltaic Cell Conversion",
            "marks": 10
        }
    ]

    for p in pyqs_data:
        existing = db.query(PYQItem).filter(PYQItem.id == p["id"]).first()
        if existing:
            continue
        pyq_obj = PYQItem(
            id=p["id"],
            question=p["q"],
            subject_code=p["code"],
            subject_name=p["name"],
            semester=p["sem"],
            year=p["year"],
            unit=p["unit"],
            exam_type=p["exam"],
            difficulty=p["diff"],
            frequency=p["freq"],
            topic=p["topic"],
            marks_weightage=p["marks"],
        )
        db.add(pyq_obj)

    # 9. Topic Analyses
    topics_data = [
        {"topic": "BCNF & 3NF Lossless Decomposition", "code": "KCS-601", "name": "Database Management Systems", "freq": 5, "imp": "HIGH IMPORTANCE", "unit": "Unit 3", "avg": 10.0, "last": 2024},
        {"topic": "Precedence Graph Conflict Serializability", "code": "KCS-601", "name": "Database Management Systems", "freq": 4, "imp": "HIGH IMPORTANCE", "unit": "Unit 4", "avg": 9.5, "last": 2024},
        {"topic": "LALR Parsing Table Construction", "code": "KCS-603", "name": "Compiler Design", "freq": 5, "imp": "HIGH IMPORTANCE", "unit": "Unit 2", "avg": 10.0, "last": 2024},
        {"topic": "Banker's Algorithm & Resource Safety", "code": "KCS-602", "name": "Operating Systems", "freq": 4, "imp": "HIGH IMPORTANCE", "unit": "Unit 3", "avg": 10.0, "last": 2024},
    ]

    for t in topics_data:
        existing_top = db.query(TopicAnalysis).filter(TopicAnalysis.id == f"top-{t['code']}-{t['unit']}").first()
        if existing_top:
            continue
        t_obj = TopicAnalysis(
            id=f"top-{t['code']}-{t['unit']}",
            topic=t["topic"],
            subject_code=t["code"],
            subject_name=t["name"],
            frequency=t["freq"],
            importance=t["imp"],
            unit=t["unit"],
            average_marks=t["avg"],
            last_asked_year=t["last"],
        )
        db.add(t_obj)

    # 10. Notifications
    notifs_data = [
        {
            "id": "notif-01",
            "title": "Low Attendance Alert: DBMS (KCS-601)",
            "msg": "Your current attendance in Database Management Systems is 73.0%, below the mandatory 75% AKTU threshold. Please attend the next 2 classes.",
            "cat": "Attendance",
            "time": "Today, 08:30 AM",
            "read": False,
            "url": "/attendance",
            "label": "View Attendance",
        },
        {
            "id": "notif-02",
            "title": "Assignment Deadline: Compiler Design Lab 3",
            "msg": "Assignment 3 on LALR Parsing Tables is due tomorrow by 11:59 PM. Upload via the assignments portal.",
            "cat": "Assignments",
            "time": "Yesterday, 04:15 PM",
            "read": False,
            "url": "/assignments",
            "label": "Open Assignment",
        },
        {
            "id": "notif-03",
            "title": "AKTU Even Semester Examination Form 2026",
            "msg": "University examination portal is now open for Semester VI subject registration. Complete verification by April 15.",
            "cat": "Academic",
            "time": "April 02, 10:00 AM",
            "read": False,
            "url": "/exams",
            "label": "Exam Guidelines",
        },
        {
            "id": "notif-04",
            "title": "Smart India Hackathon 2026 Campus Round",
            "msg": "Internal shortlisting for SIH 2026 announced. 12 teams from GLBITM advanced to the final round.",
            "cat": "Important",
            "time": "March 28, 02:30 PM",
            "read": True,
            "url": "/dashboard",
            "label": "Read Bulletin",
        },
    ]

    for n_item in notifs_data:
        existing_notif = db.query(Notification).filter(Notification.id == n_item["id"]).first()
        if existing_notif:
            continue
        notif = Notification(
            id=n_item["id"],
            user_id=user_student.id,
            title=n_item["title"],
            message=n_item["msg"],
            category=n_item["cat"],
            timestamp_str=n_item["time"],
            read=n_item["read"],
            action_url=n_item["url"],
            action_label=n_item["label"],
        )
        db.add(notif)

    # 11. Initial Study Plan
    existing_plan = db.query(StudyPlan).filter(StudyPlan.id == f"plan-{student_profile.id}-0").first()
    if not existing_plan:
        plan_monday = StudyPlan(
            id=f"plan-{student_profile.id}-0",
            student_id=student_profile.id,
            day="Monday",
            date="Upcoming Monday",
            focus_area="Database Management Systems & Sessional Prep",
            target_hours=3.0,
            order_index=0,
        )
        db.add(plan_monday)
        db.flush()

        s1 = StudyPlanSlot(
            id="slot-mon-1",
            plan_id=plan_monday.id,
            time_slot="06:00 PM – 07:00 PM",
            subject_name="Database Management Systems",
            subject_code="KCS-601",
            topic="Normalization (3NF vs BCNF Numerical Proofs)",
            task_type="Revision",
            completed=True,
            order_index=0,
        )
        s2 = StudyPlanSlot(
            id="slot-mon-2",
            plan_id=plan_monday.id,
            time_slot="07:15 PM – 08:15 PM",
            subject_name="Compiler Design",
            subject_code="KCS-603",
            topic="Shift-Reduce Conflict Detection & LALR Tables",
            task_type="Problem Solving",
            completed=False,
            order_index=1,
        )
        db.add(s1)
        db.add(s2)

        plan_tuesday = StudyPlan(
            id=f"plan-{student_profile.id}-1",
            student_id=student_profile.id,
            day="Tuesday",
            date="Upcoming Tuesday",
            focus_area="Operating Systems & Deadlock Numericals",
            target_hours=3.0,
            order_index=1,
        )
        db.add(plan_tuesday)
        db.flush()

        s3 = StudyPlanSlot(
            id="slot-tue-1",
            plan_id=plan_tuesday.id,
            time_slot="06:00 PM – 07:00 PM",
            subject_name="Operating Systems",
            subject_code="KCS-602",
            topic="Banker's Algorithm Safety & Resource Allocation",
            task_type="PYQ Practice",
            completed=False,
            order_index=0,
        )
        s4 = StudyPlanSlot(
            id="slot-tue-2",
            plan_id=plan_tuesday.id,
            time_slot="07:15 PM – 08:15 PM",
            subject_name="Database Management Systems",
            subject_code="KCS-601",
            topic="Precedence Graph Conflict Serializability",
            task_type="Revision",
            completed=False,
            order_index=1,
        )
        db.add(s3)
        db.add(s4)

    # Seed classroom cohort students
    seed_cohort_students(db)

    db.commit()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    from app.db.session import SessionLocal, Base, engine
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_database(session)
