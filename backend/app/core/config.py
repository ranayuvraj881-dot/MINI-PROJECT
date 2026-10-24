import os
from typing import List
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory if present
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    PROJECT_NAME: str = "GL Bajaj CampusOS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = os.getenv("API_V1_PREFIX", "/api/v1")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'campusos.db'}"
    )

    # Security & JWT
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "glb-campusos-super-secret-jwt-key-change-in-production-2026"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Google Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

    # Supabase Database & Cloud Services
    SUPABASE_URL: str = os.getenv(
        "SUPABASE_URL",
        "https://gfkunutisfqnaggampxm.supabase.co"
    )
    SUPABASE_ANON_KEY: str = os.getenv(
        "SUPABASE_ANON_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma3VudXRpc2ZxbmFnZ2FtcHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NjkzODMsImV4cCI6MjEwODI0NTM4M30.253xIU_0ZO_f43BBY_F9qrPmLTykAyky_1CiyQqpYEc"
    )
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv(
        "SUPABASE_SERVICE_ROLE_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma3VudXRpc2ZxbmFnZ2FtcHhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjY2OTM4MywiZXhwIjoyMTA4MjQ1MzgzfQ.SzrYjp6fPBV6W9ro_v_Byibqj9zVOQ7lXhrETr8wXJI"
    )

    # CORS
    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173")
        return [origin.strip() for origin in raw.split(",") if origin.strip()]


settings = Settings()
