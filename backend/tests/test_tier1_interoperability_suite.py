"""Automated Pytest Suite for Tier-1 Interoperability Middleware (SIH26129 - Govt of Maharashtra).

Verifies:
1. IndEA 2.0 Schema Harmonization across Revenue, Municipal, and MSME keys.
2. MeriPehchaan / Jan Parichay Federated OIDC SSO Simulation.
3. EventBus Pub/Sub & Server-Sent Events dispatch.
4. No-Code DAG Workflow Orchestrator Runtime Rule Updating.
5. Maharashtra RTSA Citizen Charter SLA Calculation & Escalation Engine.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_indea_schema_harmonizer_revenue_payload():
    """Verify Revenue payload (tax_id, cust_name, res_address) harmonizes into IndEA 2.0."""
    payload = {
        "department_code": "REVENUE_MAHARASHTRA",
        "raw_payload": {
            "cust_name": "Ayush S Chauhan",
            "tax_id": "bkzpc9912a",
            "res_address": "Flat 42, Palm Meadows, Indiranagar, Bengaluru 560008",
            "contact_no": "9876543210",
            "entity_cat": "Private Limited",
            "khasra_no": "142/2A",
            "utid": "UTID-MH-2026-094182"
        }
    }
    response = client.post("/api/mdm/harmonize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HARMONIZED_SUCCESS"
    assert data["canonical_record"]["full_name"] == "Ayush S Chauhan"
    assert data["canonical_record"]["pan_number"] == "BKZPC9912A"
    assert data["canonical_record"]["mobile"] == "+91-9876543210"
    assert data["canonical_record"]["address"]["pin_code"] == "560008"
    assert data["canonical_record"]["schema_version"] == "IndEA-2.0-GovTech"
    assert len(data["rules_applied"]) >= 4


def test_indea_schema_harmonizer_sample_payloads_endpoint():
    """Verify sample legacy schemas endpoint returns valid payloads for 4 departments."""
    response = client.get("/api/mdm/sample-payloads")
    assert response.status_code == 200
    data = response.json()
    assert "REVENUE_MAHARASHTRA" in data
    assert "MUNICIPAL_BMC" in data
    assert "MSME_UDYAM" in data
    assert "FSSAI_FOSCOS" in data


def test_meripehchaan_sso_login_returns_oidc_claims():
    """Verify MeriPehchaan federated login returns realistic OIDC claims and JWT tokens."""
    payload = {
        "auth_code": "MOCK_AUTH_CODE_JP_2026",
        "citizen_mobile": "+91 98765-43210",
        "login_type": "MERIPEHCHAAN_JANPARICHAY"
    }
    response = client.post("/api/auth/sso/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "Bearer"
    assert "claims" in data
    assert data["claims"]["sub"] == "JP-2026-981245"
    assert data["claims"]["name"] == "Ayush Singh Chauhan"
    assert data["claims"]["aadhaar_token"] == "TOK-UID-88219"
    assert data["claims"]["pan_linked"] == "BKZPC9912A"
    assert "CITIZEN" in data["claims"]["roles"]


def test_meripehchaan_sso_userinfo_endpoint():
    """Verify OIDC UserInfo endpoint returns authenticated citizen profile."""
    response = client.get("/api/auth/sso/userinfo")
    assert response.status_code == 200
    claims = response.json()
    assert claims["name"] == "Ayush Singh Chauhan"
    assert claims["iss"] == "https://meripehchaan.gov.in/openid/connect/v1"


def test_event_bus_publish_and_recent_events():
    """Verify EventBus publish and recent event buffer."""
    payload = {
        "event_type": "STEP_APPROVED",
        "utid": "UTID-MH-2026-094182",
        "step_id": "step-fssai-03",
        "department": "Food Safety Authority of India",
        "actor": "OFFICER_DESHMUKH_04",
        "message": "FSSAI License Approved under Section 31",
        "metadata": {"inspection_score": 98}
    }
    response = client.post("/api/events/publish", json=payload)
    assert response.status_code == 200
    event = response.json()
    assert event["event_type"] == "STEP_APPROVED"
    assert event["utid"] == "UTID-MH-2026-094182"

    # Fetch recent events
    recent_res = client.get("/api/events/recent?limit=5")
    assert recent_res.status_code == 200
    recent_events = recent_res.json()
    assert len(recent_events) > 0
    assert any(e["event_id"] == event["event_id"] for e in recent_events)


def test_workflow_dag_rules_retrieval():
    """Verify retrieval of configurable workflow DAG graph."""
    response = client.get("/api/admin/workflow/rules/msme-food-business")
    assert response.status_code == 200
    graph = response.json()
    assert graph["journey_id"] == "msme-food-business"
    assert len(graph["nodes"]) >= 5
    
    # Check node 1 (PAN) has no prerequisites
    node_pan = next(n for n in graph["nodes"] if n["step_id"] == "step-pan-01")
    assert len(node_pan["prerequisites"]) == 0

    # Check node 3 (FSSAI) has prerequisites
    node_fssai = next(n for n in graph["nodes"] if n["step_id"] == "step-fssai-03")
    assert "step-pan-01" in node_fssai["prerequisites"]


def test_workflow_dag_rules_runtime_update():
    """Verify runtime modification of DAG prerequisite dependencies."""
    payload = {
        "journey_id": "msme-food-business",
        "step_id": "step-fssai-03",
        "prerequisites": ["step-pan-01"],  # removed udyam prerequisite
        "is_optional": True,
        "conditional_rule": "water_test_exempt = daily_orders < 50",
        "statutory_sla_hours": 36,
        "updated_by": "OFFICER_NODAL_ADMIN"
    }
    response = client.post("/api/admin/workflow/update", json=payload)
    assert response.status_code == 200
    updated_graph = response.json()
    
    node_fssai = next(n for n in updated_graph["nodes"] if n["step_id"] == "step-fssai-03")
    assert node_fssai["prerequisites"] == ["step-pan-01"]
    assert node_fssai["is_optional"] is True
    assert node_fssai["statutory_sla_hours"] == 36


def test_maharashtra_rtsa_sla_applications():
    """Verify RTSA SLA applications list and status categorization."""
    response = client.get("/api/sla/applications")
    assert response.status_code == 200
    apps = response.json()
    assert len(apps) >= 3

    statuses = [a["sla_status"] for a in apps]
    assert "HEALTHY" in statuses
    assert "WARNING" in statuses
    assert "ESCALATED" in statuses


def test_maharashtra_rtsa_sla_escalation_trigger():
    """Verify SLA breach escalation trigger to District Collector / Appellate Officer."""
    payload = {
        "application_id": "APP-2026-FSSAI-001",
        "reason": "Statutory 48h Scrutiny Window Breached",
        "escalate_to": "DISTRICT_COLLECTOR_APPELLATE_OFFICE_MUMBAI"
    }
    response = client.post("/api/sla/escalate/APP-2026-FSSAI-001", json=payload)
    assert response.status_code == 200
    app_data = response.json()
    assert app_data["sla_status"] == "ESCALATED"
    assert app_data["escalated_to_appellate"] == "DISTRICT_COLLECTOR_APPELLATE_OFFICE_MUMBAI"
