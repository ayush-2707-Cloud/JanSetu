"""Tests for In-App AI Copilot and Generative UI Action Synthesis."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.copilot import CopilotActionType
from app.ai.copilot_agent import resolve_copilot_query, CopilotRequest

client = TestClient(app)


def test_copilot_action_fssai_food_business_generative_ui():
    """Verify Copilot emits structured LOAD_JOURNEY, SCROLL_TO_NODE, OPEN_DRAWER, HIGHLIGHT_ELEMENT."""
    req = CopilotRequest(
        query="Help me register for FSSAI food license in Karnataka",
        language="en"
    )
    res = resolve_copilot_query(req)

    assert res.matched_journey_id == "food-business-license"
    assert len(res.actions) >= 3

    action_types = [a.action_type for a in res.actions]
    assert CopilotActionType.LOAD_JOURNEY in action_types
    assert CopilotActionType.SCROLL_TO_NODE in action_types
    assert CopilotActionType.OPEN_STEP in action_types

    # Verify step ID and tab targeting
    drawer_action = next(a for a in res.actions if a.action_type == CopilotActionType.OPEN_STEP)
    assert drawer_action.payload.get("step_id") == "fssai-license"

    # Verify citations and speech text
    assert len(res.citations) > 0
    assert any("FSSAI" in c.department or "FSSAI" in c.document_title for c in res.citations)
    assert "FSSAI" in res.speech_text
    assert res.latency_ms < 1000.0


def test_copilot_action_hindi_speech_and_language_switch():
    """Verify Copilot handles Hindi queries and returns Hindi TTS speech text."""
    req = CopilotRequest(
        query="मुझे हिंदी में पीएम विद्यालक्ष्मी शिक्षा ऋण के नियम बताएं",
        language="hi"
    )
    res = resolve_copilot_query(req)

    assert res.matched_journey_id == "pm-vidyalaxmi-loan"
    assert any(a.action_type == CopilotActionType.SWITCH_LANGUAGE for a in res.actions)
    assert "ऋण" in res.speech_text or "विद्यालक्ष्मी" in res.speech_text
    assert len(res.citations) > 0


def test_copilot_action_trigger_consent_modal():
    """Verify Copilot emits TRIGGER_CONSENT action for DigiLocker identity requests."""
    req = CopilotRequest(
        query="Verify my PAN card with DigiLocker sandbox",
        language="en"
    )
    res = resolve_copilot_query(req)

    consent_action = next((a for a in res.actions if a.action_type == CopilotActionType.TRIGGER_CONSENT), None)
    assert consent_action is not None
    assert consent_action.payload.get("doc_type") == "PAN"


def test_copilot_fastapi_action_endpoint():
    """Test POST /api/ai/copilot/action HTTP response."""
    response = client.post(
        "/api/ai/copilot/action",
        json={
            "query": "I want to apply for study abroad apostille and forex remittance",
            "language": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()

    assert "speech_text" in data
    assert "explanation_markdown" in data
    assert "actions" in data
    assert len(data["actions"]) > 0
    assert data["matched_journey_id"] == "study-abroad-global"
    assert len(data["citations"]) > 0
    assert "https://esanad.nic.in" in [c["portal_url"] for c in data["citations"]] or data["citations"][0]["portal_url"] != ""


def test_copilot_fastapi_streaming_sse_endpoint():
    """Test POST /api/ai/copilot/stream SSE streaming format."""
    response = client.post(
        "/api/ai/copilot/stream",
        json={
            "query": "Show me FSSAI document requirements",
            "language": "en"
        }
    )
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")

    content = response.text
    assert "event: actions" in content
    assert "event: token" in content
    assert "event: citations" in content
    assert "event: done" in content
