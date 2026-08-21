from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalPath Statutory Engine"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    ENVIRONMENT: str = "development"

    # AI Orchestration & Grounded RAG (Track 3)
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    VECTOR_DB_DIR: str = "backend/data/chroma_db"
    RAG_TOP_K: int = 3

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="allow"
    )


settings = Settings()

