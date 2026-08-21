"""
Comprehensive Pytest Test Suite for LegalPath Backend & Workflow Engine (Developer Track 2).
Covers:
1. Priority 1: Pydantic schemas and 5 Seed Journey Blueprints (MSME, PM-Vidyalaxmi, Tourist, Study Abroad, Startups)
2. Priority 1: Core Fetch Endpoints (GET /api/journey/{id}, GET /api/journeys)
3. Priority 2: Deterministic Prerequisite Engine (POST /api/journey/complete-step) with HTTP 400 violations
4. Priority 2: Mock DigiLocker & API Setu Sandbox (OAuth token + verifiable digital signatures)
5. Priority 3: SQLite Session Persistence (POST/GET /api/session, /complete-step)
6. Priority 3: Regulatory Alert Dispatcher (GET /api/alerts)
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.blueprints import (
    get_all_validated_blueprints,
    get_validated_blueprint
)
from app.engine.dependency_graph import DependencyEngine, DependencyResolutionError

client = TestClient(app)


# ═══════════════════════════════════════════════════════════════════════════════
# Priority 1: Schemas & Seed Data Tests
# ═══════════════════════════════════════════════════════════════════════════════

def test_all_blueprints_pydantic_validation():
    """Verify that all 5 life event blueprints pass strict Pydantic model validation."""
    blueprints = get_all_validated_blueprints()
    assert len(blueprints) >= 5

    journey_ids = [b.journey_id for b in blueprints]
    assert "food-business-license" in journey_ids
    assert "pm-vidyalaxmi-loan" in journey_ids
    assert "certified-tourist-guide" in journey_ids
    assert "study-abroad-global" in journey_ids
    assert "startup-seed-funding" in journey_ids


def test_food_business_nodes_structure():
    """Verify MSME Food Business blueprint sequence: Identity -> Udyam -> FSSAI -> Current Account."""
    food = get_validated_blueprint("food-business-license")
    assert len(food.nodes) == 4

    step_ids = [n.step_id for n in food.nodes]
    assert step_ids == ["identity-verification", "udyam-registration", "fssai-license", "current-business-account"]

    # Step 1
    assert food.nodes[0].action_type.value == "MOCK_VERIFY"
    assert food.nodes[0].prerequisites == []

    # Step 2
    assert food.nodes[1].action_type.value == "PORTAL_REDIRECT"
    assert food.nodes[1].prerequisites == ["identity-verification"]

    # Step 3
    assert food.nodes[2].action_type.value == "FORM_FILL"
    assert set(food.nodes[2].prerequisites) == {"identity-verification", "udyam-registration"}

    # Step 4
    assert food.nodes[3].action_type.value == "MOCK_VERIFY"
    assert set(food.nodes[3].prerequisites) == {"identity-verification", "udyam-registration", "fssai-license"}


def test_pm_vidyalaxmi_nodes_structure():
    """Verify PM-Vidyalaxmi Higher Ed Loan blueprint sequence: Marksheet -> Income Cert -> Scheme Discovery -> Bank App."""
    loan = get_validated_blueprint("pm-vidyalaxmi-loan")
    assert len(loan.nodes) == 4

    step_ids = [n.step_id for n in loan.nodes]
    assert step_ids == ["marksheet-verification", "income-certificate", "scheme-discovery", "bank-loan-application"]

    assert loan.nodes[0].action_type.value == "MOCK_VERIFY"
    assert loan.nodes[1].prerequisites == ["marksheet-verification"]
    assert loan.nodes[2].prerequisites == ["marksheet-verification", "income-certificate"]
    assert loan.nodes[3].action_type.value == "PORTAL_REDIRECT"


def test_core_fetch_journey_endpoints():
    """Verify GET /api/journey/{id} and GET /api/journeys endpoints."""
    # List all
    r_list = client.get("/api/journeys")
    assert r_list.status_code == 200
    assert len(r_list.json()) >= 5

    # Fetch specific
    r_food = client.get("/api/journey/food-business-license")
    assert r_food.status_code == 200
    food_data = r_food.json()
    assert food_data["journey_id"] == "food-business-license"
    assert "FSSAI" in food_data["title"]
    assert len(food_data["nodes"]) == 4

    # Fetch 404
    r_404 = client.get("/api/journey/non-existent-journey")
    assert r_404.status_code == 404


# ═══════════════════════════════════════════════════════════════════════════════
# Priority 2: Dependency Engine & Mock Sandboxes Tests
# ═══════════════════════════════════════════════════════════════════════════════

def test_deterministic_prerequisite_engine_transitions():
    """Verify deterministic state machine transitions LOCKED -> IN_PROGRESS when unblocked."""
    guide = get_validated_blueprint("certified-tourist-guide")

    # Initial evaluation: Step 1 is IN_PROGRESS (0 prereqs), Steps 2 & 3 are LOCKED
    initial_eval = DependencyEngine.evaluate_journey(guide, [])
    assert initial_eval.nodes[0].status.value == "IN_PROGRESS"
    assert initial_eval.nodes[1].status.value == "LOCKED"
    assert initial_eval.nodes[2].status.value == "LOCKED"
    assert initial_eval.overall_progress_percentage == 0

    # Complete Step 1
    completed, eval_step1 = DependencyEngine.validate_and_complete_step(
        blueprint=guide,
        completed_step_ids=[],
        target_step_id="iitf-course"
    )
    assert completed == ["iitf-course"]
    assert eval_step1.nodes[0].status.value == "COMPLETED"
    assert eval_step1.nodes[1].status.value == "IN_PROGRESS"  # Transitioned from LOCKED!
    assert eval_step1.nodes[2].status.value == "LOCKED"
    assert eval_step1.overall_progress_percentage == 33


def test_api_complete_step_endpoint_happy_and_violation():
    """Verify POST /api/journey/complete-step endpoint with happy path and 400 violation."""
    # 1. Violation: Try to jump to Step 3 without completing Step 1
    r_bad = client.post(
        "/api/journey/complete-step",
        json={
            "journey_id": "food-business-license",
            "completed_step_ids": [],
            "step_id": "fssai-license"
        }
    )
    assert r_bad.status_code == 400
    data_bad = r_bad.json()
    assert data_bad["detail"]["error"] == "SEQUENTIAL_DEPENDENCY_VIOLATION"
    assert "identity-verification" in data_bad["detail"]["missing_prerequisites"]

    # 2. Happy Path: Complete Step 1
    r_good = client.post(
        "/api/journey/complete-step",
        json={
            "journey_id": "food-business-license",
            "completed_step_ids": [],
            "step_id": "identity-verification"
        }
    )
    assert r_good.status_code == 200
    data_good = r_good.json()
    assert data_good["success"] is True
    assert data_good["evaluated_journey"]["overall_progress_percentage"] == 25
    assert data_good["evaluated_journey"]["nodes"][1]["status"] == "IN_PROGRESS"


def test_mock_apisetu_oauth_token():
    """Verify mock API Setu OAuth2 token endpoint."""
    res = client.post(
        "/api/sandbox/apisetu/oauth/token",
        json={
            "client_id": "SIH-CIVIC-CLIENT-001",
            "consent_artifact_id": "CONSENT-AR-2026-X99"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["token_type"] == "Bearer"
    assert data["access_token"].startswith("apisetu_live_sim_")
    assert data["expires_in"] == 3600
    assert "consent_timestamp" in data


def test_mock_apisetu_fetch_document_pan():
    """Verify mock API Setu document fetch returns digital signature and verified metadata."""
    res = client.post(
        "/api/sandbox/apisetu/fetch-document",
        json={
            "doc_type": "PAN",
            "doc_id": "ABCDE1234F",
            "full_name": "Aarav Sharma"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "VERIFIED"
    assert data["doc_type"] == "PAN"
    assert data["digilocker_uri"] == "in.gov.pan/ABCDE1234F"
    assert "Income Tax Department" in data["issuing_authority"]
    assert data["citizen_name"] == "Aarav Sharma"
    
    # Digital Signature Verification
    sig = data["digital_signature"]
    assert sig["algorithm"] == "SHA256withRSA-PKCS#7"
    assert sig["signature_digest"].startswith("0x")
    assert sig["is_revoked"] is False
    assert "verification_hash" in data


def test_mock_apisetu_fetch_document_marksheet_12():
    """Verify mock API Setu document fetch for Class 12 Marksheet."""
    res = client.post(
        "/api/sandbox/apisetu/fetch-document",
        json={
            "doc_type": "MARKSHEET_12",
            "doc_id": "84729102",
            "full_name": "Priya Patel"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["attributes"]["stream"] == "Science / PCM"
    assert data["attributes"]["result"] == "PASS"


# ═══════════════════════════════════════════════════════════════════════════════
# Priority 3: Persistence & Regulatory Alert Dispatcher Tests
# ═══════════════════════════════════════════════════════════════════════════════

def test_sqlite_session_lifecycle_and_persistence():
    """Verify session creation, milestone completion persistence in SQLite, and retrieval."""
    # 1. Create Session
    r_create = client.post(
        "/api/session",
        json={
            "active_journey_id": "pm-vidyalaxmi-loan",
            "profile_parameters": {
                "state": "Karnataka",
                "annual_family_income": 450000,
                "category": "OBC"
            }
        }
    )
    assert r_create.status_code == 200
    sess_data = r_create.json()
    session_id = sess_data["session_id"]
    assert session_id is not None
    assert sess_data["active_journey_id"] == "pm-vidyalaxmi-loan"
    assert sess_data["progress_percentage"] == 0

    # 2. Complete Step 1 in Session
    r_step1 = client.post(
        f"/api/session/{session_id}/complete-step",
        json={"step_id": "marksheet-verification"}
    )
    assert r_step1.status_code == 200
    step1_data = r_step1.json()
    assert "marksheet-verification" in step1_data["completed_step_ids"]
    assert step1_data["progress_percentage"] == 25

    # 3. Retrieve Session across simulated page reload
    r_get = client.get(f"/api/session/{session_id}")
    assert r_get.status_code == 200
    get_data = r_get.json()
    assert get_data["session_id"] == session_id
    assert get_data["completed_step_ids"] == ["marksheet-verification"]
    assert get_data["progress_percentage"] == 25
    assert get_data["profile_parameters"]["category"] == "OBC"


def test_regulatory_alert_dispatcher():
    """Verify GET /api/alerts filters by domain and jurisdiction."""
    # Query Food Business domain
    r_food = client.get("/api/alerts?domain=Food%20Business")
    assert r_food.status_code == 200
    food_alerts = r_food.json()
    assert food_alerts["total_alerts"] >= 2
    assert any("FoSCoS" in a["title"] for a in food_alerts["alerts"])

    # Query Karnataka jurisdiction
    r_ka = client.get("/api/alerts?jurisdiction=Karnataka")
    assert r_ka.status_code == 200
    ka_alerts = r_ka.json()
    assert ka_alerts["total_alerts"] >= 1
    assert any("Karnataka" in a["jurisdiction"] or "National" in a["jurisdiction"] for a in ka_alerts["alerts"])

    # All alerts
    r_all = client.get("/api/alerts")
    assert r_all.status_code == 200
    assert r_all.json()["total_alerts"] >= 6
