# GL Bajaj CampusOS - Backend Service

FastAPI-powered academic ERP and AI intelligence backend for GL Bajaj Institute of Technology & Management (GLBITM), Greater Noida.

---

## Technology Stack

- **Framework**: Python 3.12+ / FastAPI / Uvicorn
- **ORM & Database**: SQLAlchemy 2.x, PostgreSQL (with SQLite zero-config local fallback)
- **Database Migrations**: Alembic
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Intelligence**: Official Google Gen AI SDK (`google-genai`), Google Gemini API (model `gemini-2.5-flash`)
- **Testing**: pytest, HTTPX / TestClient

---

## Directory Structure

```
backend/
├── alembic/                  # Alembic migration environment and versions
│   ├── versions/
│   │   └── 06f815efad43_initial_campusos_schema.py
│   └── env.py
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── academics.py     # Subjects and course catalog
│   │       ├── analytics.py     # Academic risk and institutional stats
│   │       ├── assignments.py   # Course assignments and student submissions
│   │       ├── attendance.py    # Attendance summary, subject stats, simulation
│   │       ├── auth.py          # Real login, demo role switcher, current user
│   │       ├── copilot.py       # Campus AI Copilot with persistent chat
│   │       ├── dashboard.py     # Unified student dashboard aggregation
│   │       ├── marks.py         # Continuous Internal Evaluation (CIE) & trends
│   │       ├── notifications.py # Notification feed & read receipts
│   │       ├── resources.py     # Study notes, AKTU PYQs, topic frequency
│   │       ├── students.py      # Student profile view and edit
│   │       ├── study_planner.py # AI dynamic study planner & session toggle
│   │       └── timetable.py     # Weekly schedule & today's classes
│   ├── core/
│   │   ├── config.py        # Pydantic environment configuration
│   │   ├── dependencies.py  # JWT auth & role-based access dependencies
│   │   └── security.py      # Password hashing & JWT generation
│   ├── db/
│   │   ├── base.py          # SQLAlchemy metadata discovery
│   │   ├── seed.py          # Idempotent development seed script
│   │   └── session.py       # Engine creation & session lifecycle
│   ├── models/              # Normalized relational database models
│   │   ├── academic.py
│   │   ├── assignment.py
│   │   ├── attendance.py
│   │   ├── copilot.py
│   │   ├── notification.py
│   │   ├── planner.py
│   │   ├── resource.py
│   │   └── user.py
│   ├── schemas/             # Pydantic validation schemas
│   └── services/
│       ├── academic_service.py # Attendance math & risk engine
│       └── gemini_service.py   # Grounded Google GenAI SDK integration
├── tests/                   # Full pytest automated test suite
│   ├── conftest.py
│   └── test_api.py
├── .env.example             # Configuration template
├── alembic.ini              # Alembic configuration
└── requirements.txt         # Pinned backend dependencies
```

---

## Setup & Running with Windows PowerShell

### 1. Create and Activate Virtual Environment
```powershell
cd "c:\Users\hp\Downloads\MINI-PROJECT-main (1)\MINI-PROJECT-main\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Edit `.env` to configure:
- `DATABASE_URL`: By default uses `sqlite:///./campusos.db`. For PostgreSQL, set:
  ```
  DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/campusos_db
  ```
- `GEMINI_API_KEY`: Enter your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- `JWT_SECRET_KEY`: Set a secure secret key for production JWT tokens.

### 4. Run Migrations & Seed Data
```powershell
# Apply Alembic migrations
python -m alembic upgrade head

# Seed development data (idempotent, synthetic demo records)
python -m app.db.seed
```

### 5. Run the Backend Server
```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation:
- Swagger UI: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- ReDoc: [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)
- Health check: [http://localhost:8000/health](http://localhost:8000/health)

### 6. Run Automated Backend Tests
```powershell
python -m pytest tests -v
```

---

## Default Seed Credentials

| Role | College ID / Username | Password | User Name |
| :--- | :--- | :--- | :--- |
| **Student** | `GLB21CS0892` | `password123` | Yuvraj (CSE, Sem VI) |
| **Faculty** | `FAC042CS` | `password123` | Dr. Sanjeev Kumar Sharma |
| **Admin** | `ADM001` | `password123` | Prof. (Dr.) Manas Kumar Mishra |
