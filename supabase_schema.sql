-- ==============================================================================
-- GL BAJAJ CAMPUSOS - SUPABASE DATABASE INITIALIZATION SCHEMA & SEED DATA
-- Project Ref: gfkunutisfqnaggampxm
-- Target: PostgreSQL 15+ (Supabase)
-- Instructions: Copy and run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    college_id VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    hashed_password VARCHAR(256) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id VARCHAR(64) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    enrollment_no VARCHAR(64) NOT NULL,
    roll_number VARCHAR(64),
    college_id VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    avatar_url VARCHAR(512),
    department VARCHAR(128) NOT NULL DEFAULT 'Computer Science & Engineering',
    course VARCHAR(64) DEFAULT 'B.Tech',
    branch VARCHAR(64) DEFAULT 'CSE',
    semester VARCHAR(64) DEFAULT 'Semester VI',
    section VARCHAR(32) DEFAULT 'CSE-3B',
    batch VARCHAR(64) DEFAULT '2022 - 2026',
    mentor_name VARCHAR(128) DEFAULT 'Dr. Sanjeev Kumar Sharma',
    blood_group VARCHAR(16) DEFAULT 'B+',
    cgpa NUMERIC(4, 2) DEFAULT 8.00,
    total_credits INT DEFAULT 124,
    achievements_json TEXT DEFAULT '[]'
);

-- Faculty Profiles Table
CREATE TABLE IF NOT EXISTS public.faculty_profiles (
    id VARCHAR(64) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    enrollment_no VARCHAR(64) NOT NULL,
    college_id VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    department VARCHAR(128) NOT NULL DEFAULT 'Computer Science & Engineering',
    course VARCHAR(64) DEFAULT 'B.Tech',
    branch VARCHAR(64) DEFAULT 'CSE',
    semester VARCHAR(64) DEFAULT 'Faculty Portal',
    section VARCHAR(32) DEFAULT 'Senior Faculty',
    batch VARCHAR(64) DEFAULT 'Academic Year 2025-26'
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    code VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    short_name VARCHAR(32),
    credits INT DEFAULT 4,
    type VARCHAR(32) DEFAULT 'Theory',
    department VARCHAR(128) DEFAULT 'Computer Science & Engineering',
    semester VARCHAR(32) DEFAULT 'Semester VI',
    faculty_name VARCHAR(128),
    faculty_id VARCHAR(64),
    color_code VARCHAR(32) DEFAULT '#2563eb',
    description TEXT,
    syllabus_json TEXT DEFAULT '[]'
);

-- Subject Attendance Table
CREATE TABLE IF NOT EXISTS public.subject_attendances (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    faculty_name VARCHAR(128),
    total_classes INT DEFAULT 0,
    attended_classes INT DEFAULT 0,
    min_required NUMERIC(4, 1) DEFAULT 75.0
);

-- Attendance History Table
CREATE TABLE IF NOT EXISTS public.attendance_history (
    id VARCHAR(64) PRIMARY KEY,
    subject_attendance_id VARCHAR(64) NOT NULL REFERENCES public.subject_attendances(id) ON DELETE CASCADE,
    date VARCHAR(32) NOT NULL,
    status VARCHAR(16) NOT NULL -- Present, Absent, Late
);

-- Subject Marks Table
CREATE TABLE IF NOT EXISTS public.subject_marks (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    credits INT DEFAULT 4,
    faculty_name VARCHAR(128),
    sessional1_scored NUMERIC(5, 2) DEFAULT 0.0,
    sessional1_max NUMERIC(5, 2) DEFAULT 30.0,
    sessional2_scored NUMERIC(5, 2) DEFAULT 0.0,
    sessional2_max NUMERIC(5, 2) DEFAULT 30.0,
    quizzes_scored NUMERIC(5, 2) DEFAULT 0.0,
    quizzes_max NUMERIC(5, 2) DEFAULT 10.0,
    assignments_scored NUMERIC(5, 2) DEFAULT 0.0,
    assignments_max NUMERIC(5, 2) DEFAULT 10.0,
    practicals_scored NUMERIC(5, 2) DEFAULT 0.0,
    practicals_max NUMERIC(5, 2) DEFAULT 20.0,
    grade_projected VARCHAR(8) DEFAULT 'B+',
    trend VARCHAR(16) DEFAULT 'stable',
    change_percentage NUMERIC(4, 1) DEFAULT 0.0
);

-- Timetable Slots Table
CREATE TABLE IF NOT EXISTS public.timetable_slots (
    id VARCHAR(64) PRIMARY KEY,
    day VARCHAR(32) NOT NULL,
    time VARCHAR(64) NOT NULL,
    start_time VARCHAR(16) NOT NULL,
    end_time VARCHAR(16) NOT NULL,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    faculty_name VARCHAR(128) NOT NULL,
    room VARCHAR(64) NOT NULL,
    type VARCHAR(32) DEFAULT 'Lecture',
    semester VARCHAR(32) DEFAULT 'Semester VI',
    section VARCHAR(32) DEFAULT 'CSE-3B'
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    faculty_name VARCHAR(128),
    description TEXT,
    due_date VARCHAR(64) NOT NULL,
    max_marks INT DEFAULT 10,
    total_submissions INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'Active',
    file_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment Submissions Table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    submitted_at VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'Submitted',
    score NUMERIC(5, 2),
    feedback TEXT,
    attachment_name VARCHAR(256),
    attachment_url VARCHAR(512)
);

-- Study Resources Table
CREATE TABLE IF NOT EXISTS public.study_resources (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    unit_number INT DEFAULT 1,
    topic VARCHAR(256) NOT NULL,
    resource_type VARCHAR(64) DEFAULT 'Lecture Notes',
    file_size VARCHAR(32) DEFAULT '2.4 MB',
    download_url VARCHAR(512) DEFAULT '#',
    uploaded_by VARCHAR(128),
    faculty_name VARCHAR(128),
    downloads_count INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PYQ Items Table
CREATE TABLE IF NOT EXISTS public.pyq_items (
    id VARCHAR(64) PRIMARY KEY,
    subject_code VARCHAR(32) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    year VARCHAR(32) NOT NULL,
    examination_type VARCHAR(64) NOT NULL,
    question_paper_code VARCHAR(64) NOT NULL,
    download_url VARCHAR(512) DEFAULT '#',
    frequency_weight NUMERIC(4, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic Analyses Table
CREATE TABLE IF NOT EXISTS public.topic_analyses (
    id VARCHAR(64) PRIMARY KEY,
    subject_code VARCHAR(32) NOT NULL,
    unit_number INT NOT NULL,
    topic_name VARCHAR(256) NOT NULL,
    exam_occurrence_count INT DEFAULT 1,
    marks_weightage INT DEFAULT 10,
    difficulty_level VARCHAR(32) DEFAULT 'Medium',
    is_high_yield BOOLEAN DEFAULT FALSE,
    predicted_probability INT DEFAULT 70
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(256) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    category VARCHAR(64) DEFAULT 'General',
    action_url VARCHAR(256),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'general',
    session_id VARCHAR(64) DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_roll ON public.student_profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_student_profiles_section ON public.student_profiles(section);
CREATE INDEX IF NOT EXISTS idx_subject_attendances_student ON public.subject_attendances(student_id);
CREATE INDEX IF NOT EXISTS idx_subject_attendances_code ON public.subject_attendances(subject_code);
CREATE INDEX IF NOT EXISTS idx_attendance_history_att ON public.attendance_history(subject_attendance_id);
CREATE INDEX IF NOT EXISTS idx_subject_marks_student ON public.subject_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_subject_marks_code ON public.subject_marks(subject_code);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_study_resources_subject ON public.study_resources(subject_code);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON public.timetable_slots(day);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated & anon clients
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- 5.1 Users
INSERT INTO public.users (id, college_id, email, hashed_password, role) VALUES
('glb-fac-0042', 'FAC042CS', 'sanjeev.sharma@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'faculty'),
('glb-adm-0001', 'ADM001', 'director.office@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'admin'),
('glb-stu-210192', 'GLB21CS0892', 'yuvraj.cse@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student'),
('glb-stu-210018', 'GLB21CS0018', 'aditya.verma@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student'),
('glb-stu-210095', 'GLB21CS0095', 'priya.sharma@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student'),
('glb-stu-210114', 'GLB21CS0114', 'rohan.gupta@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student'),
('glb-stu-210056', 'GLB21CS0056', 'sneha.patel@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student'),
('glb-stu-210033', 'GLB21CS0033', 'amit.kumar@glbitm.ac.in', '$2b$12$7kP.7wS6zKxS1YwT3iU8e.BfMvY5ZgYw1PqZ5b9h5rY5n5qZ5b9h5', 'student')
ON CONFLICT (id) DO NOTHING;

-- 5.2 Faculty Profile
INSERT INTO public.faculty_profiles (id, user_id, name, enrollment_no, college_id, email, phone, department, semester, section) VALUES
('glb-fac-0042', 'glb-fac-0042', 'Dr. Sanjeev Kumar Sharma', 'EMP-CSE-042', 'FAC042CS', 'sanjeev.sharma@glbitm.ac.in', '+91 98112 34567', 'Computer Science & Engineering', 'Faculty Portal', 'CSE Senior Faculty')
ON CONFLICT (id) DO NOTHING;

-- 5.3 Student Profiles
INSERT INTO public.student_profiles (id, user_id, name, enrollment_no, roll_number, college_id, email, phone, department, semester, section, cgpa) VALUES
('glb-stu-210192', 'glb-stu-210192', 'Yuvraj', '2101920100142', '2101920100142', 'GLB21CS0892', 'yuvraj.cse@glbitm.ac.in', '+91 98765 43210', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 8.72),
('glb-stu-210018', 'glb-stu-210018', 'Aditya Verma', '2101920100018', '2101920100018', 'GLB21CS0018', 'aditya.verma@glbitm.ac.in', '+91 98123 45678', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 6.84),
('glb-stu-210095', 'glb-stu-210095', 'Priya Sharma', '2101920100095', '2101920100095', 'GLB21CS0095', 'priya.sharma@glbitm.ac.in', '+91 98234 56789', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 7.42),
('glb-stu-210114', 'glb-stu-210114', 'Rohan Gupta', '2101920100114', '2101920100114', 'GLB21CS0114', 'rohan.gupta@glbitm.ac.in', '+91 98345 67890', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 8.10),
('glb-stu-210056', 'glb-stu-210056', 'Sneha Patel', '2101920100056', '2101920100056', 'GLB21CS0056', 'sneha.patel@glbitm.ac.in', '+91 98456 78901', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 9.15),
('glb-stu-210033', 'glb-stu-210033', 'Amit Kumar', '2101920100033', '2101920100033', 'GLB21CS0033', 'amit.kumar@glbitm.ac.in', '+91 98567 89012', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 7.80)
ON CONFLICT (id) DO NOTHING;

-- 5.4 Subjects
INSERT INTO public.subjects (code, name, short_name, credits, faculty_name, color_code, description) VALUES
('KCS-601', 'Database Management Systems', 'DBMS', 4, 'Dr. Sanjeev Kumar Sharma', '#2563eb', 'Relational data model, SQL, normalization theory, transactions, and indexing.'),
('KCS-602', 'Operating Systems', 'OS', 4, 'Prof. Archana Singh', '#7c3aed', 'Process management, concurrency, deadlocks, memory management, and file systems.'),
('KCS-603', 'Compiler Design', 'CD', 4, 'Dr. Ramanuj Gupta', '#059669', 'Lexical analysis, syntax analysis, code generation, and optimization.'),
('KCS-651', 'Database Management Systems Lab', 'DBMS Lab', 2, 'Dr. Sanjeev Kumar Sharma', '#0284c7', 'Practical implementation of SQL queries, PL/SQL blocks, triggers, and transactions.'),
('KCS-652', 'Operating Systems Lab', 'OS Lab', 2, 'Prof. Archana Singh', '#6d28d9', 'Linux shell scripting, POSIX system calls, IPC, and thread programming.'),
('KOE-068', 'Software Project Management', 'SPM', 3, 'Dr. Neha Mittal', '#d97706', 'Agile methodologies, sprint planning, project metrics, and risk management.'),
('KCS-061', 'Advanced Database Systems (Elective)', 'ADS', 3, 'Dr. Sanjeev Kumar Sharma', '#4f46e5', 'Distributed architectures, NoSQL stores, column-family stores, and graph databases.')
ON CONFLICT (code) DO NOTHING;

-- 5.5 Subject Attendance Records for Cohort
INSERT INTO public.subject_attendances (id, student_id, subject_code, subject_name, faculty_name, total_classes, attended_classes, min_required) VALUES
('att-210192-KCS-601', 'glb-stu-210192', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 19, 75.0),
('att-210192-KCS-602', 'glb-stu-210192', 'KCS-602', 'Operating Systems', 'Prof. Archana Singh', 24, 20, 75.0),
('att-210018-KCS-601', 'glb-stu-210018', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 16, 75.0),
('att-210095-KCS-601', 'glb-stu-210095', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 18, 75.0),
('att-210114-KCS-601', 'glb-stu-210114', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 19, 75.0),
('att-210056-KCS-601', 'glb-stu-210056', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 25, 75.0),
('att-210033-KCS-601', 'glb-stu-210033', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 26, 22, 75.0)
ON CONFLICT (id) DO NOTHING;

-- 5.6 Subject Marks (CIE)
INSERT INTO public.subject_marks (id, student_id, subject_code, subject_name, credits, faculty_name, sessional1_scored, sessional2_scored, quizzes_scored, assignments_scored, practicals_scored, grade_projected) VALUES
('mrk-210192-KCS-601', 'glb-stu-210192', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 22.0, 24.0, 8.0, 9.0, 18.0, 'B+'),
('mrk-210018-KCS-601', 'glb-stu-210018', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 14.0, 15.0, 5.0, 6.0, 18.0, 'C'),
('mrk-210095-KCS-601', 'glb-stu-210095', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 19.0, 18.0, 4.0, 7.0, 18.0, 'B'),
('mrk-210114-KCS-601', 'glb-stu-210114', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 24.0, 23.0, 8.0, 5.0, 18.0, 'B+'),
('mrk-210056-KCS-601', 'glb-stu-210056', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 28.0, 29.0, 10.0, 10.0, 19.0, 'A+'),
('mrk-210033-KCS-601', 'glb-stu-210033', 'KCS-601', 'Database Management Systems', 4, 'Dr. Sanjeev Kumar Sharma', 22.0, 21.0, 7.0, 8.0, 18.0, 'B+')
ON CONFLICT (id) DO NOTHING;

-- 5.7 Active Timetable Slots
INSERT INTO public.timetable_slots (id, day, time, start_time, end_time, subject_code, subject_name, faculty_name, room, type) VALUES
('tt-mon-1', 'Monday', '09:00 AM – 09:50 AM', '09:00', '09:50', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 'Room 304, AB-2', 'Lecture'),
('tt-mon-2', 'Monday', '09:50 AM – 10:40 AM', '09:50', '10:40', 'KCS-602', 'Operating Systems', 'Prof. Archana Singh', 'Room 304, AB-2', 'Lecture'),
('tt-mon-3', 'Monday', '10:55 AM – 11:45 AM', '10:55', '11:45', 'KCS-603', 'Compiler Design', 'Dr. Ramanuj Gupta', 'Room 304, AB-2', 'Lecture'),
('tt-mon-4', 'Monday', '01:30 PM – 03:10 PM', '13:30', '15:10', 'KCS-651', 'Database Management Systems Lab', 'Dr. Sanjeev Kumar Sharma', 'Advanced DB Lab 4', 'Lab')
ON CONFLICT (id) DO NOTHING;

-- 5.8 Assignments
INSERT INTO public.assignments (id, title, subject_code, subject_name, faculty_name, description, due_date, max_marks, status) VALUES
('asg-001', 'DBMS Assignment 4: Conflict Serializability & Two-Phase Locking', 'KCS-601', 'Database Management Systems', 'Dr. Sanjeev Kumar Sharma', 'Draw precedence graphs for given schedules and determine conflict serializability. Implement Strict 2PL protocol logic.', '2026-03-24', 10, 'Active'),
('asg-002', 'OS Assignment 3: Banker Algorithm for Deadlock Avoidance', 'KCS-602', 'Operating Systems', 'Prof. Archana Singh', 'Implement multithreaded resource request algorithm with safety checks in C/POSIX.', '2026-03-28', 10, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 5.9 Study Resources
INSERT INTO public.study_resources (id, title, subject_code, subject_name, unit_number, topic, resource_type, file_size, uploaded_by, faculty_name) VALUES
('res-001', 'Unit 3: Functional Dependencies & Boyce-Codd Normal Form', 'KCS-601', 'Database Management Systems', 3, 'Normalization Theory & Lossless Joins', 'Lecture Notes', '3.4 MB', 'Dr. Sanjeev Kumar Sharma', 'Dr. Sanjeev Kumar Sharma'),
('res-002', 'Unit 4: Transaction Processing & ACID Concurrency Protocols', 'KCS-601', 'Database Management Systems', 4, 'Transactions & Strict 2PL', 'Lecture Notes', '4.1 MB', 'Dr. Sanjeev Kumar Sharma', 'Dr. Sanjeev Kumar Sharma')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SCHEMA & SEED CREATION COMPLETE!
-- Your Supabase PostgreSQL database is now fully prepared for GL Bajaj CampusOS.
-- ==============================================================================
