"""FastAPI Router for Developer Track 3: AI Orchestration & Grounded RAG.

Strictly partitioned AI endpoints:
- Zero-Shot Goal Classification & Parameter Extraction (Priority 1)
- Grounded Step Q&A via Local ChromaDB RAG with Citations & Guardrails (Priority 2)
- Multilingual Step Guidance & Checklist Breakdown (Priority 3)
- Policy Alert Impact Parser from Raw Gazette Circulars (Priority 3)
"""

import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from app.schemas.ai import (
    GoalClassificationRequest,
    GoalClassificationResponse,
    RAGQueryRequest,
    RAGQueryResponse,
    MultilingualGuidanceRequest,
    MultilingualGuidanceResponse,
    PolicyAlertParseRequest,
    ParsedPolicyAlert,
    KnowledgeSourceItem,
)
from app.schemas.copilot import (
    CopilotRequest,
    CopilotResponse,
    CopilotAction,
    CopilotActionType,
)
from app.ai.goal_classifier import classify_goal
from app.ai.rag_service import execute_grounded_rag
from app.ai.multilingual import generate_multilingual_guidance
from app.ai.policy_parser import parse_policy_alert
from app.ai.vector_store import vector_store
from app.ai.copilot_agent import resolve_copilot_query, stream_copilot_query

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Orchestration & Grounded RAG (Track 3)"]
)


@router.post(
    "/copilot/action",
    response_model=CopilotResponse,
    summary="In-App AI Copilot: Generative UI Action Resolution & Tool Calling",
    description="Accepts voice/text citizen queries, executes fast hybrid search (<50ms BM25 + ChromaDB RAG), and returns structured client-side UI action payloads (OPEN_STEP, TRIGGER_CONSENT, SWITCH_LANGUAGE, etc.) with regional voice speech text."
)
async def api_copilot_action(payload: CopilotRequest) -> CopilotResponse:
    """Execute In-App Copilot hybrid search, tool action generation, and speech synthesis."""
    try:
        return resolve_copilot_query(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing copilot tool action resolution: {str(e)}"
        )


@router.post(
    "/copilot/stream",
    summary="In-App AI Copilot: Server-Sent Events (SSE) Streaming Generator",
    description="Streams real-time token events and immediate UI action dispatch events with sub-300ms latency."
)
async def api_copilot_stream(payload: CopilotRequest):
    """Stream token chunks and structured UI action events via SSE."""
    async def sse_event_generator():
        try:
            async for chunk in stream_copilot_query(payload):
                event_name = chunk.get("event", "message")
                event_data = json.dumps(chunk.get("data", {}))
                yield f"event: {event_name}\ndata: {event_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": str(e)})
            yield f"event: error\ndata: {error_data}\n\n"

    return StreamingResponse(
        sse_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post(
    "/classify-goal",
    response_model=GoalClassificationResponse,
    summary="Priority 1: Zero-Shot Goal Classification & Parameter Extraction",
    description="Accepts an unstructured natural language goal (e.g. 'I want to open a cloud kitchen in Bangalore') and returns clean parameters mapped to a Track 2 journey blueprint."
)
async def api_classify_goal(payload: GoalClassificationRequest) -> GoalClassificationResponse:
    """Classify natural language goal, extract parameters, and load matching journey template."""
    try:
        return classify_goal(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing goal classification pipeline: {str(e)}"
        )


@router.post(
    "/rag/query",
    response_model=RAGQueryResponse,
    summary="Priority 2: Grounded Step Q&A via Retrieval-Augmented Generation (RAG)",
    description="Performs similarity search across 15 official government manuals in ChromaDB and returns a grounded answer with mandatory source citations and zero-hallucination guardrails."
)
async def api_grounded_rag_query(payload: RAGQueryRequest) -> RAGQueryResponse:
    """Grounded Step Q&A with top-3 ChromaDB passages and official citations."""
    try:
        return execute_grounded_rag(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing Grounded RAG query: {str(e)}"
        )


@router.post(
    "/step-guidance",
    response_model=MultilingualGuidanceResponse,
    summary="Priority 3: Multilingual Generation & Plain Language Guidance",
    description="Returns localized plain-language explanation, actionable checklist, and common pitfalls in the citizen's preferred language (English, Hindi, Kannada)."
)
async def api_step_guidance(payload: MultilingualGuidanceRequest) -> MultilingualGuidanceResponse:
    """Generate localized step guidance and checklist breakdown."""
    try:
        return generate_multilingual_guidance(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating multilingual step guidance: {str(e)}"
        )


@router.post(
    "/parse-policy-alert",
    response_model=ParsedPolicyAlert,
    summary="Priority 3: Policy Alert Impact Parser from Raw Gazette Circulars",
    description="Parses raw government gazette notices or circular text and extracts 3 structured elements: (1) What changed, (2) Why it matters to this active journey, and (3) What action or deadline is required."
)
async def api_parse_policy_alert(payload: PolicyAlertParseRequest) -> ParsedPolicyAlert:
    """Parse raw gazette notice into structured statutory impact elements."""
    try:
        return parse_policy_alert(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing gazette policy alert: {str(e)}"
        )


@router.get(
    "/knowledge-base",
    response_model=List[KnowledgeSourceItem],
    summary="Priority 2: List Curated Official Government Source Manuals",
    description="Returns metadata of all 15 verified official government source manuals indexed in the local ChromaDB vector store."
)
async def api_list_knowledge_base() -> List[KnowledgeSourceItem]:
    """Retrieve metadata of indexed government source manuals."""
    raw_sources = vector_store.list_sources()
    return [KnowledgeSourceItem.model_validate(s) for s in raw_sources]

