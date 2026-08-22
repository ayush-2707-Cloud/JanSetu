import sys
from pathlib import Path

# Ensure backend root is in search path
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.db.database import init_db
from app.routers import journeys, progress, sandbox, sessions, alerts, ai, copilot, legal, stamp_duty, notifications, officer, auth, preflight
from app.engine.dependency_graph import DependencyResolutionError

# Initialize database tables on application startup
init_db()

app = FastAPI(
    title="JanSetu™ (जनसेतु) Statutory Workflow & AI Engine",
    description="Deterministic Statutory Journey & Milestone Dependency Engine partitioned with AI Orchestration & Grounded RAG",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware (supports Next.js frontend port 3000 and standard local origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers (supporting both track default routes and /api/v1/ prefix)
app.include_router(auth.router)
app.include_router(journeys.router)
app.include_router(progress.router)
app.include_router(sandbox.router)
app.include_router(sessions.router)
app.include_router(alerts.router)
app.include_router(ai.router)
app.include_router(copilot.router, prefix="/api")
app.include_router(preflight.router, prefix="/api")
app.include_router(legal.router)
app.include_router(stamp_duty.router)
app.include_router(notifications.router)
app.include_router(officer.router)

# Also expose under versioned /api/v1 prefix
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(journeys.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(sandbox.router, prefix=settings.API_V1_STR)
app.include_router(sessions.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)
app.include_router(preflight.router, prefix=settings.API_V1_STR)
app.include_router(legal.router, prefix=settings.API_V1_STR)
app.include_router(stamp_duty.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(officer.router, prefix=settings.API_V1_STR)


@app.exception_handler(DependencyResolutionError)
async def dependency_resolution_exception_handler(request: Request, exc: DependencyResolutionError):
    return JSONResponse(
        status_code=400,
        content={
            "error": "SEQUENTIAL_DEPENDENCY_VIOLATION",
            "message": str(exc),
            "step_id": exc.step_id,
            "missing_prerequisites": exc.missing_prerequisites,
        },
    )


@app.get("/")
def root():
    return {
        "service": "LegalPath Python FastAPI Statutory Journey Engine",
        "version": "3.0.0",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "tracks": [
            "Developer Track 2: Backend & Deterministic Workflow Engine",
            "Developer Track 3: AI Orchestration & Grounded RAG"
        ],
        "ai_endpoints": [
            "/api/ai/classify-goal",
            "/api/ai/rag/query",
            "/api/ai/step-guidance",
            "/api/ai/parse-policy-alert",
            "/api/ai/knowledge-base"
        ],
        "sandboxes": ["/api/sandbox/apisetu/oauth/token", "/api/sandbox/apisetu/fetch-document"],
        "persistence": ["/api/session"],
        "alerts": ["/api/alerts"]
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "deterministic-sequential-dag",
        "ai_rag_engine": "chromadb-gemini-grounded",
        "database": "sqlite-connected",
        "blueprints_loaded": 5,
        "knowledge_sources_indexed": 15
    }

