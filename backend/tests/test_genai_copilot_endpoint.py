"""Tests for Gemini 2.5 Flash AI Copilot endpoint /api/copilot/query with Function Calling & RAG."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.copilot import CopilotQueryRequest, CopilotQueryResponse
from app.ai.genai_copilot import query_copilot, SYSTEM_PROMPT, COPILOT_MODEL_NAME

client = TestClient(app)


def test_copilot_system_prompt_and_model_metadata():
    """Verify standard Copilot system prompt and Gemini 2.5 Flash model identifier."""
    assert "You are the AI Citizen Journey Copilot" in SYSTEM_PROMPT
    assert "Never hallucinate government fees" in SYSTEM_PROMPT
    assert COPILOT_MODEL_NAME == "gemini-2.5-flash"


def test_copilot_query_load_journey_and_open_step_drawer():
    """Verify tool calls for load_journey and open_step_drawer for Food Business & FSSAI."""
    req = CopilotQueryRequest(
        query="Help me register for FSSAI food license in Karnataka",
        language="en"
    )
    res = query_copilot(req)

    assert isinstance(res, CopilotQueryResponse)
    assert res.model == "gemini-2.5-flash"
    assert len(res.text_response) > 0

    tool_names = [t.name for t in res.tool_calls]
    assert "load_journey" in tool_names
    assert "open_step_drawer" in tool_names

    # Check arguments
    load_tool = next(t for t in res.tool_calls if t.name == "load_journey")
    assert load_tool.arguments.get("journey_id") == "food-business-license"

    drawer_tool = next(t for t in res.tool_calls if t.name == "open_step_drawer")
    assert drawer_tool.arguments.get("step_id") == "fssai-license"

    # Verify RAG context chunks from ChromaDB
    assert len(res.context_chunks) > 0
    assert any("FSSAI" in str(c) for c in res.context_chunks)
    assert res.latency_ms < 1000.0


def test_copilot_query_trigger_consent_modal():
    """Verify tool call for trigger_consent_modal for DigiLocker identity verification."""
    req = CopilotQueryRequest(
        query="Verify my PAN card with DigiLocker sandbox",
        language="en"
    )
    res = query_copilot(req)

    tool_names = [t.name for t in res.tool_calls]
    assert "trigger_consent_modal" in tool_names

    consent_tool = next(t for t in res.tool_calls if t.name == "trigger_consent_modal")
    assert consent_tool.arguments.get("doc_type") == "PAN"
    assert "purpose" in consent_tool.arguments


def test_copilot_query_switch_language_hindi():
    """Verify tool call for switch_language for Hindi queries."""
    req = CopilotQueryRequest(
        query="मुझे हिंदी में पीएम विद्यालक्ष्मी शिक्षा ऋण के नियम बताएं",
        language="hi"
    )
    res = query_copilot(req)

    tool_names = [t.name for t in res.tool_calls]
    assert "switch_language" in tool_names
    assert "load_journey" in tool_names

    switch_tool = next(t for t in res.tool_calls if t.name == "switch_language")
    assert switch_tool.arguments.get("lang_code") == "hi"
    assert len(res.context_chunks) > 0


def test_copilot_query_pre_provided_rag_context():
    """Verify Copilot accepts pre-provided context_chunks without overriding."""
    custom_chunk = {
        "department": "Custom Department",
        "document_title": "Custom Gazette Manual 2026",
        "section_title": "Section 1.1",
        "portal_url": "https://custom.gov.in",
        "excerpt": "Custom verified statutory excerpt."
    }
    req = CopilotQueryRequest(
        query="I need study abroad Hague apostille attestation",
        language="en",
        context_chunks=[custom_chunk]
    )
    res = query_copilot(req)

    assert len(res.context_chunks) == 1
    assert res.context_chunks[0]["document_title"] == "Custom Gazette Manual 2026"
    assert any(t.name == "load_journey" for t in res.tool_calls)


def test_fastapi_copilot_query_endpoint():
    """Test HTTP POST /api/copilot/query endpoint."""
    response = client.post(
        "/api/copilot/query",
        json={
            "query": "I want to apply for PM-Vidyalaxmi Education Loan interest subsidy",
            "language": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()

    assert "text_response" in data
    assert "tool_calls" in data
    assert "context_chunks" in data
    assert data["model"] == "gemini-2.5-flash"
    assert len(data["tool_calls"]) >= 1

    tool_names = [t["name"] for t in data["tool_calls"]]
    assert "load_journey" in tool_names


def test_fastapi_v1_prefixed_copilot_query_endpoint():
    """Test HTTP POST /api/v1/copilot/query prefixed endpoint."""
    response = client.post(
        "/api/v1/copilot/query",
        json={
            "query": "Help me register for FSSAI food license in Karnataka",
            "language": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["tool_calls"]) >= 1
    assert len(data["context_chunks"]) >= 1


def test_vector_store_search_journeys():
    """Verify semantic journey vector search returns valid scored matches."""
    from app.ai.vector_store import vector_store
    matches = vector_store.search_journeys("start a small bakery and catering business", top_k=3)
    assert len(matches) > 0
    assert any("food" in m["journey_id"].lower() or "business" in m["category"].lower() for m in matches)
    assert "score" in matches[0]


def test_copilot_query_show_choice_chips_disambiguation():
    """Verify broad/ambiguous queries trigger show_choice_chips tool call."""
    req = CopilotQueryRequest(
        query="I want to start a new business enterprise in India",
        language="en"
    )
    res = query_copilot(req)
    tool_names = [t.name for t in res.tool_calls]
    # Should either produce show_choice_chips or load_journey
    assert "show_choice_chips" in tool_names or "load_journey" in tool_names
    if "show_choice_chips" in tool_names:
        chip_tool = next(t for t in res.tool_calls if t.name == "show_choice_chips")
        assert "options" in chip_tool.arguments
        assert len(chip_tool.arguments["options"]) >= 2

