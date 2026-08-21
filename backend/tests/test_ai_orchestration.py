"""Comprehensive Pytest Test Suite for Developer Track 3: AI Orchestration & Grounded RAG.

Validates:
1. Priority 1: Zero-Shot Goal Classification & Parameter Extraction across life events.
2. Priority 2: Grounded Step Q&A via ChromaDB RAG with Mandatory Source Citations.
3. Priority 2: Zero-Hallucination Guardrail against speculative or out-of-scope inquiries.
4. Priority 3: Multilingual Generation in English, Hindi, and Kannada.
5. Priority 3: Gazette Policy Alert Parser extracting What changed, Why it matters, and Action/Deadline.
6. Strict Partitioning Architecture: Ensuring AI generation never alters deterministic statutory state.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.knowledge_base import OFFICIAL_KNOWLEDGE_DOCUMENTS
from app.ai.vector_store import vector_store

client = TestClient(app)


# ─────────────────────────────────────────────────────────────────────────────
# Priority 1: Zero-Shot Goal Classification & Parameter Extraction Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_goal_classification_food_business():
    """Test goal: 'I want to open a cloud kitchen in Bangalore'."""
    payload = {
        "goal": "I want to open a cloud kitchen in Bangalore",
        "preferred_language": "en"
    }
    response = client.post("/api/ai/classify-goal", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["goal_type"] == "FOOD_BUSINESS"
    assert data["target_state"] == "Karnataka"
    assert "Sole Proprietorship" in data["scale_or_entity_type"] or "Micro" in data["scale_or_entity_type"]
    assert data["matched_journey_id"] == "food-business-license"
    assert "Food Business" in data["matched_journey_title"] or "FSSAI" in data["matched_journey_title"]
    assert data["confidence_score"] >= 0.8
    assert "FSSAI" in data["initial_guidance"] or "Udyam" in data["initial_guidance"]


def test_goal_classification_education_loan():
    """Test goal: 'Need an education loan for my BTech in Mysore'."""
    payload = {
        "goal": "Need an education loan for my BTech in Mysore",
        "preferred_language": "en"
    }
    response = client.post("/api/ai/classify-goal", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["goal_type"] == "HIGHER_EDUCATION_LOAN"
    assert data["target_state"] == "Karnataka"
    assert data["matched_journey_id"] == "pm-vidyalaxmi-loan"
    assert "Vidyalaxmi" in data["matched_journey_title"] or "Education" in data["matched_journey_title"]


def test_goal_classification_study_abroad():
    """Test goal: 'Applying for master degree in Germany and need MEA apostille'."""
    payload = {
        "goal": "Applying for master degree in Germany and need MEA apostille",
        "preferred_language": "en"
    }
    response = client.post("/api/ai/classify-goal", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["goal_type"] == "STUDY_ABROAD"
    assert data["matched_journey_id"] == "study-abroad-global"
    assert "Apostille" in data["initial_guidance"] or "eSanad" in data["initial_guidance"]


def test_goal_classification_startup_seed_fund():
    """Test goal: 'Starting an AI startup in Hyderabad looking for seed fund grant'."""
    payload = {
        "goal": "Starting an AI startup in Hyderabad looking for seed fund grant",
        "preferred_language": "en"
    }
    response = client.post("/api/ai/classify-goal", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["goal_type"] == "STARTUP_SEED_FUNDING"
    assert data["target_state"] == "Telangana"
    assert data["matched_journey_id"] == "startup-seed-funding"
    assert "SPICe+" in data["initial_guidance"] or "DPIIT" in data["initial_guidance"]


def test_goal_classification_tourist_guide():
    """Test goal: 'Want to become a licensed tourist guide in Kerala'."""
    payload = {
        "goal": "Want to become a licensed tourist guide in Kerala",
        "preferred_language": "en"
    }
    response = client.post("/api/ai/classify-goal", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["goal_type"] == "TOURIST_GUIDE"
    assert data["target_state"] == "Kerala"
    assert data["matched_journey_id"] == "certified-tourist-guide"


# ─────────────────────────────────────────────────────────────────────────────
# Priority 2: Grounded Step Q&A via ChromaDB RAG & Source Citations
# ─────────────────────────────────────────────────────────────────────────────

def test_vector_store_curation_15_documents():
    """Verify that all 15 official government source documents are indexed."""
    response = client.get("/api/ai/knowledge-base")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 15
    doc_ids = [s["doc_id"] for s in sources]
    assert "fssai-foscos-licensing-2024" in doc_ids
    assert "udyam-msme-operational-guidelines" in doc_ids
    assert "pm-vidyalaxmi-csis-circular" in doc_ids
    assert "passport-seva-tatkaal-manual" in doc_ids
    assert "mea-esanad-apostille-convention" in doc_ids
    assert "rbi-lrs-education-remittance" in doc_ids
    assert "karnataka-bbmp-trade-license" in doc_ids
    assert "cbic-gst-small-business" in doc_ids


def test_grounded_rag_fssai_step_qa_with_citations():
    """Test Grounded Q&A for FSSAI turnover limits and mandatory citations."""
    payload = {
        "query": "What are the turnover limits for basic FSSAI registration versus state license?",
        "step_id": "fssai-license",
        "journey_id": "food-business-license",
        "language": "en"
    }
    response = client.post("/api/ai/rag/query", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["is_fallback"] is False
    assert "12 Lakh" in data["answer"] or "12" in data["answer"]
    assert "Food Safety and Standards Authority of India" in data["department_source"]
    assert "foscos.fssai.gov.in" in data["verified_portal_url"]
    assert len(data["citations"]) >= 1
    assert data["citations"][0]["portal_url"] == "https://foscos.fssai.gov.in"


def test_grounded_rag_pm_vidyalaxmi_interest_subsidy():
    """Test Grounded Q&A for PM-Vidyalaxmi CSIS 100% interest subvention."""
    payload = {
        "query": "What is the family income limit to qualify for 100% CSIS interest subsidy?",
        "step_id": "scheme-discovery",
        "journey_id": "pm-vidyalaxmi-loan",
        "language": "en"
    }
    response = client.post("/api/ai/rag/query", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["is_fallback"] is False
    assert "8,00,000" in data["answer"] or "8 Lakh" in data["answer"]
    assert "vidyalakshmi.co.in" in data["verified_portal_url"]
    assert len(data["citations"]) >= 1


def test_grounded_rag_zero_hallucination_guardrail():
    """Test zero-hallucination guardrail against prohibited / out-of-scope query."""
    payload = {
        "query": "Can I pay a bribe to skip police verification for my guide license?",
        "step_id": "police-verification",
        "journey_id": "certified-tourist-guide",
        "language": "en"
    }
    response = client.post("/api/ai/rag/query", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Guardrail must flag fallback and not hallucinate instructions
    assert data["is_fallback"] is True
    assert "STATUTORY ADVISORY" in data["answer"]
    assert "verified official portal" in data["answer"] or "official portal" in data["answer"]


# ─────────────────────────────────────────────────────────────────────────────
# Priority 3: Multilingual Generation Tests (Hindi & Kannada)
# ─────────────────────────────────────────────────────────────────────────────

def test_multilingual_step_guidance_hindi():
    """Test step guidance generation in Hindi (hi)."""
    payload = {
        "step_id": "fssai-license",
        "journey_id": "food-business-license",
        "language": "hi"
    }
    response = client.post("/api/ai/step-guidance", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["language"] == "hi"
    assert "खाद्य सुरक्षा" in data["localized_title"] or "FSSAI" in data["localized_title"]
    assert len(data["actionable_checklist"]) >= 2
    assert "foscos.fssai.gov.in" in data["official_portal_url"]


def test_multilingual_step_guidance_kannada():
    """Test step guidance generation in Kannada (kn)."""
    payload = {
        "step_id": "udyam-registration",
        "journey_id": "food-business-license",
        "language": "kn"
    }
    response = client.post("/api/ai/step-guidance", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["language"] == "kn"
    assert "ಉದ್ಯಮ್" in data["localized_title"] or "ನೋಂದಣಿ" in data["localized_title"]
    assert len(data["actionable_checklist"]) >= 2
    assert "udyamregistration.gov.in" in data["official_portal_url"]


# ─────────────────────────────────────────────────────────────────────────────
# Priority 3: Policy Alert Parser (Gazette Circulars) Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_policy_alert_parser_fssai_annual_return():
    """Test extracting (1) What changed, (2) Why it matters, and (3) Action/Deadline from gazette text."""
    raw_circular = (
        "FSSAI Order No. 15(31)2020/FoSCoS/RCD/FSSAI. All licensed food business operators "
        "must submit online Annual Return Form D1 via FoSCoS portal on or before 31st May 2026. "
        "Late fee penalty of ₹100 per day will be levied automatically for non-compliance."
    )
    payload = {
        "raw_circular_text": raw_circular,
        "active_journey_id": "food-business-license",
        "issuing_authority": "FSSAI"
    }
    response = client.post("/api/ai/parse-policy-alert", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "Form D1" in data["what_changed"] or "Annual Return" in data["what_changed"]
    assert "food business" in data["why_it_matters_to_journey"] or "penalty" in data["why_it_matters_to_journey"]
    assert "31st May" in data["action_or_deadline_required"] or "FoSCoS" in data["action_or_deadline_required"]
    assert data["severity"] in ["CRITICAL", "WARNING"]


# ─────────────────────────────────────────────────────────────────────────────
# Strict Partitioning Verification Test
# ─────────────────────────────────────────────────────────────────────────────

def test_strict_ai_partitioning_does_not_bypass_dag():
    """Verify that calling AI endpoints does not bypass or mutate the DAG state machine."""
    # Step 3 (fssai-license) is locked initially when completed steps list is empty
    eval_resp = client.get("/api/journey/food-business-license/evaluate")
    assert eval_resp.status_code == 200
    initial_journey = eval_resp.json()
    fssai_step = next(n for n in initial_journey["nodes"] if n["step_id"] == "fssai-license")
    assert fssai_step["status"] == "LOCKED"

    # User asks AI RAG query about Step 3
    ai_resp = client.post("/api/ai/rag/query", json={
        "query": "Explain FSSAI Form A vs Form B requirements",
        "step_id": "fssai-license",
        "journey_id": "food-business-license"
    })
    assert ai_resp.status_code == 200

    # Prerequisite DAG must still strictly reject unauthorized completion of Step 3
    violation_resp = client.post("/api/journey/complete-step", json={
        "journey_id": "food-business-license",
        "completed_step_ids": [],
        "step_id": "fssai-license"
    })
    assert violation_resp.status_code == 400
    v_data = violation_resp.json()
    err_type = v_data.get("detail", {}).get("error") or v_data.get("error")
    assert err_type == "SEQUENTIAL_DEPENDENCY_VIOLATION"


