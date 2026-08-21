"""FastAPI Router for AI Copilot Query powered by Gemini 2.5 Flash & Function Calling Tools."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.copilot import CopilotQueryRequest, CopilotQueryResponse
from app.ai.genai_copilot import query_copilot

router = APIRouter(
    prefix="/copilot",
    tags=["AI Copilot (Gemini 2.5 Flash Tools & RAG)"]
)


@router.post(
    "/query",
    response_model=CopilotQueryResponse,
    summary="AI Copilot Query with Gemini 2.5 Flash Tools & ChromaDB RAG",
    description=(
        "Executes natural language citizen query using gemini-2.5-flash with function declarations "
        "(load_journey, open_step_drawer, trigger_consent_modal, switch_language) and ChromaDB RAG retrieval grounding."
    )
)
async def api_copilot_query(payload: CopilotQueryRequest) -> CopilotQueryResponse:
    """Execute Gemini 2.5 Flash tool calling and grounded RAG synthesis."""
    try:
        return query_copilot(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing Gemini copilot query: {str(e)}"
        )
