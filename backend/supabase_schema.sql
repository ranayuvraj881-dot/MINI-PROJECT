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
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'general',
    session_id VARCHAR(64) DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
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
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

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
-- 4. SEED DATA
-- ==============================================================================
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

INSERT INTO public.faculty_profiles (id, user_id, name, enrollment_no, college_id, email, phone, department, semester, section) VALUES
('glb-fac-0042', 'glb-fac-0042', 'Dr. Sanjeev Kumar Sharma', 'EMP-CSE-042', 'FAC042CS', 'sanjeev.sharma@glbitm.ac.in', '+91 98112 34567', 'Computer Science & Engineering', 'Faculty Portal', 'CSE Senior Faculty')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_profiles (id, user_id, name, enrollment_no, roll_number, college_id, email, phone, department, semester, section, cgpa) VALUES
('glb-stu-210192', 'glb-stu-210192', 'Yuvraj', '2101920100142', '2101920100142', 'GLB21CS0892', 'yuvraj.cse@glbitm.ac.in', '+91 98765 43210', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 8.72),
('glb-stu-210018', 'glb-stu-210018', 'Aditya Verma', '2101920100018', '2101920100018', 'GLB21CS0018', 'aditya.verma@glbitm.ac.in', '+91 98123 45678', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 6.84),
('glb-stu-210095', 'glb-stu-210095', 'Priya Sharma', '2101920100095', '2101920100095', 'GLB21CS0095', 'priya.sharma@glbitm.ac.in', '+91 98234 56789', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 7.42),
('glb-stu-210114', 'glb-stu-210114', 'Rohan Gupta', '2101920100114', '2101920100114', 'GLB21CS0114', 'rohan.gupta@glbitm.ac.in', '+91 98345 67890', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 8.10),
('glb-stu-210056', 'glb-stu-210056', 'Sneha Patel', '2101920100056', '2101920100056', 'GLB21CS0056', 'sneha.patel@glbitm.ac.in', '+91 98456 78901', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 9.15),
('glb-stu-210033', 'glb-stu-210033', 'Amit Kumar', '2101920100033', '2101920100033', 'GLB21CS0033', 'amit.kumar@glbitm.ac.in', '+91 98567 89012', 'Computer Science & Engineering', 'Semester VI', 'CSE-3B', 7.80)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (code, name, short_name, credits, faculty_name, color_code, description) VALUES
('KCS-601', 'Database Management Systems', 'DBMS', 4, 'Dr. Sanjeev Kumar Sharma', '#2563eb', 'Relational data model, SQL, normalization theory, transactions, and indexing.'),
('KCS-602', 'Operating Systems', 'OS', 4, 'Prof. Archana Singh', '#7c3aed', 'Process management, concurrency, deadlocks, memory management, and file systems.'),
('KCS-603', 'Compiler Design', 'CD', 4, 'Dr. Ramanuj Gupta', '#059669', 'Lexical analysis, syntax analysis, code generation, and optimization.'),
('KCS-651', 'Database Management Systems Lab', 'DBMS Lab', 2, 'Dr. Sanjeev Kumar Sharma', '#0284c7', 'Practical implementation of SQL queries, PL/SQL blocks, triggers, and transactions.')
ON CONFLICT (code) DO NOTHING;
