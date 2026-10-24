# GL Bajaj CampusOS - Fully Functional Full-Stack Application

GL Bajaj CampusOS is an Academic ERP and AI Intelligence workspace for **GL Bajaj Institute of Technology & Management (GLBITM)**, Greater Noida, affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU).

The application pairs a modern, responsive React + TypeScript frontend with a secure, production-minded Python FastAPI backend, normalized relational database, and official Google Gemini AI integration.

---

## Architecture Overview

```
MINI-PROJECT-main/
├── backend/                  # FastAPI 0.115+, SQLAlchemy 2.x, Alembic, Google GenAI SDK
│   ├── app/
│   │   ├── api/v1/          # 13 REST API router modules (Auth, Dashboard, AI, etc.)
│   │   ├── core/            # Config, JWT security, Role authorization
│   │   ├── db/              # SQLAlchemy sessions, Alembic Base, Seed script
│   │   ├── models/          # 12 Normalized relational database models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # GeminiService, AcademicService, Risk engine
│   ├── alembic/             # Version-controlled migrations
│   ├── tests/               # 17 automated pytest test suites
│   ├── requirements.txt
│   └── .env.example
├── src/                      # React 19 + TypeScript + Vite + TailwindCSS v4
│   ├── components/          # Reusable UI components & modals
│   ├── layouts/             # DashboardLayout with role navigation
│   ├── pages/               # 16 Full-page views
│   ├── services/            # API client connected to backend (USE_MOCK_FALLBACK = false)
│   └── types/               # Clean TypeScript definitions
├── package.json
└── vite.config.ts           # Configured with proxy to http://localhost:8000
```

---

## Quick Start (Windows PowerShell)

### Terminal 1: Start FastAPI Backend

```powershell
cd "c:\Users\hp\Downloads\MINI-PROJECT-main (1)\MINI-PROJECT-main\backend"

# 1. (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup environment configuration
Copy-Item .env.example .env

# 4. Apply database migrations
python -m alembic upgrade head

# 5. Seed initial demonstration records
python -m app.db.seed

# 6. Start the FastAPI backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be live at:
- **API Base**: [http://127.0.0.1:8000/api/v1](http://127.0.0.1:8000/api/v1)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
- **Health Check & Readiness**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### Terminal 2: Start React Frontend

```powershell
cd "c:\Users\hp\Downloads\MINI-PROJECT-main (1)\MINI-PROJECT-main"

# Start the Vite development server
npm run dev
```

Frontend will be live at [http://localhost:3000](http://localhost:3000).

---

## Credentials for Demo & Testing

| Role | College ID / Login | Password | Account Details |
| :--- | :--- | :--- | :--- |
| **Student** | `GLB21CS0892` | `password123` | **Yuvraj** (Roll: 2101920100142, CSE Sem VI) |
| **Faculty** | `FAC042CS` | `password123` | **Dr. Sanjeev Kumar Sharma** (Assoc. Prof, CSE) |
| **Admin** | `ADM001` | `password123` | **Prof. (Dr.) Manas Kumar Mishra** (Director) |

---

## Verified Features

1. **Authentication & Roles**: Real JWT access tokens with bcrypt password hashing. Role switching support for Student, Faculty, and Admin.
2. **Student Dashboard**: Live aggregation of attendance percentage (78.4%), today's classes, CIE internal marks, and upcoming deadlines.
3. **Attendance Intelligence**: Subject-wise attendance breakdown, automatic detection of low attendance (DBMS at 73.0% flagged as At Risk), calculation of classes needed to reach 75%, and what-if simulation tool.
4. **Academics & CIE Marks**: Subject catalog, credits, sessional 1 & 2 scores, quizzes, practical vivas, semester CGPA trends, and projected grades.
5. **Assignments & Submissions**: Real submission tracking and file upload persistence into database.
6. **Timetable**: Monday–Saturday weekly schedule with rooms and faculty.
7. **Notes & AKTU PYQs**: Searchable study resources, previous-year question papers, and topic recurrence analyses.
8. **AI Academic Copilot**: Server-side Google Gemini integration grounded in actual student attendance, marks, syllabus, and AKTU archives. Persistent chat history stored in database.
9. **AI Study Planner**: Dynamic study plan generator adhering to user constraints (available hours, weak subjects, preferred time of day). Study sessions and task completion toggles are persisted in database.
10. **Profile Management**: Viewing and editing student contact details with persistence across page refreshes.
11. **Notifications**: Real-time notifications with individual and bulk read tracking.

---

## Running Automated Tests

```powershell
# Run backend pytest suite (17 tests)
cd "c:\Users\hp\Downloads\MINI-PROJECT-main (1)\MINI-PROJECT-main\backend"
python -m pytest tests -v

# Run frontend TypeScript validation & production build
cd "c:\Users\hp\Downloads\MINI-PROJECT-main (1)\MINI-PROJECT-main"
npm run lint
npm run build
```
