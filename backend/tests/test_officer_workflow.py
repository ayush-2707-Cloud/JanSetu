"""
Pytest Suite for Official/Admin Back-Office Cross-Departmental Review Engine.
Tests application listing, department/status filtering, decision submission,
SLA time delta calculation, and Gemini AI 3-point dossier briefing.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_officer_applications():
    """Test retrieval of cross-departmental application queue."""
    response = client.get("/api/officer/applications")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4

    # Verify presence of multiple departments (MSME, FSSAI, Revenue, Municipal, Transport)
    departments = {item["department"] for item in data}
    assert "MSME" in departments
    assert "FOOD_SAFETY" in departments
    assert "REVENUE" in departments


def test_filter_applications_by_department():
    """Test filtering applications by department code."""
    response = client.get("/api/officer/applications?department=MSME")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for app_item in data:
        assert app_item["department"] == "MSME"


def test_filter_applications_by_status():
    """Test filtering applications by status."""
    response = client.get("/api/officer/applications?status=DEFECT_FLAGGED")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for app_item in data:
        assert app_item["status"] == "DEFECT_FLAGGED"


def test_search_applications():
    """Test keyword searching across citizen name and application ID."""
    response = client.get("/api/officer/applications?search=Sharma")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any("Sharma" in app_item["citizen_name"] for app_item in data)


def test_get_single_application_detail():
    """Test detailed application retrieval with full dossier."""
    response = client.get("/api/officer/applications/APP-2026-MSME-0841")
    assert response.status_code == 200
    data = response.json()
    assert data["application_id"] == "APP-2026-MSME-0841"
    assert "dossier" in data
    assert len(data["dossier"]["documents"]) >= 2
    assert len(data["dossier"]["timeline"]) >= 2


def test_submit_officer_decision_approved():
    """Test officer approving an application step with SLA delta calculation."""
    payload = {
        "application_id": "APP-2026-MSME-0841",
        "step_id": "step-2",
        "decision": "APPROVED",
        "remarks": "All documents verified under MSMED Act Section 7. Enterprise classification approved.",
        "officer_id": "OFFICER-KA-1001",
        "officer_name": "Shri S. Ranganathan",
        "department": "MSME",
    }
    response = client.post("/api/officer/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["new_status"] == "APPROVED"
    assert "sla_time_delta_hours" in data
    assert "sla_performance_summary" in data
    assert "audit_reference_id" in data
    assert data["audit_reference_id"].startswith("AUDIT-MSME")


def test_submit_officer_decision_defect_flagged():
    """Test officer flagging defect on an application."""
    payload = {
        "application_id": "APP-2026-FSSAI-1904",
        "step_id": "step-2",
        "decision": "DEFECT_FLAGGED",
        "remarks": "Lease deed expires in 28 days. Submit renewed 3-year commercial undertaking.",
        "defect_reasons": ["Lease validity below minimum 1-year threshold"],
        "officer_id": "OFFICER-TN-2204",
        "officer_name": "Dr. M. K. Ananth",
        "department": "FOOD_SAFETY",
    }
    response = client.post("/api/officer/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["new_status"] == "DEFECT_FLAGGED"


def test_analyze_dossier_ai_endpoint():
    """Test Gemini 2.5 Flash / Heuristic 3-point dossier analyzer."""
    payload = {
        "utid": "APP-2026-MSME-0841",
        "application_id": "APP-2026-MSME-0841",
        "service_title": "Udyam Enterprise Registration",
        "department": "MSME",
        "citizen_name": "Rahul Rajesh Sharma",
        "enterprise_name": "Namma Cloud Technologies LLP",
        "documents": [
            {"doc_name": "Aadhaar Identity", "status": "VERIFIED_DIGILOCKER"},
            {"doc_name": "LLP Certificate", "status": "VERIFIED_DIGILOCKER"},
        ],
        "timeline": [
            {"step_title": "Aadhaar & PAN Match", "status": "VERIFIED"},
        ],
    }
    response = client.post("/api/officer/analyze-dossier", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["utid"] == "APP-2026-MSME-0841"
    assert "identity_verification_status" in data
    assert "document_completeness" in data
    assert "regulatory_red_flags" in data
    assert data["overall_risk_level"] in ["LOW", "MEDIUM", "ELEVATED"]
    assert isinstance(data["risk_score"], int)
    assert "recommended_action" in data


def test_rbac_middleware_blocks_citizen_role_with_403():
    """Test that simulated CITIZEN_ROLE receives HTTP 403 Forbidden on officer endpoints."""
    headers = {"X-User-Role": "CITIZEN_ROLE"}
    response = client.get("/api/officer/applications", headers=headers)
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"]


def test_rbac_middleware_allows_officer_role():
    """Test that explicit OFFICER_ROLE receives HTTP 200 OK on officer endpoints."""
    headers = {"X-User-Role": "OFFICER_ROLE"}
    response = client.get("/api/officer/applications", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    # Verify presence of UTID and target_goal
    first_item = data[0]
    assert "utid" in first_item
    assert "applicant_name" in first_item
    assert "target_goal" in first_item
    assert "current_department_stage" in first_item


def test_submit_officer_decision_with_utid_payload():
    """Test decision submission using UTID field and roadmap sync confirmation."""
    payload = {
        "utid": "APP-2026-MSME-0841",
        "step_id": "step-2",
        "decision": "APPROVED",
        "remarks": "Statutory verification complete under MSMED Section 7.",
        "officer_id": "OFFICER-KA-1001",
    }
    response = client.post("/api/officer/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["utid"] == "APP-2026-MSME-0841"
    assert data["new_status"] == "APPROVED"
    assert data["citizen_roadmap_updated"] is True

