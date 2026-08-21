"""
Comprehensive Test Suite for Legal Templates Provider, Multi-Domain Journeys,
Hierarchical Data Contract, and Sub-Step State Machine.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.legal_templates import (
    MASTER_LEGAL_TEMPLATES,
    get_legal_template,
    list_legal_template_summaries,
)
from app.data.blueprints import (
    HIERARCHICAL_MSME_FOOD_JOURNEY,
    HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY,
    HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
    get_hierarchical_journey,
    get_all_hierarchical_journeys,
)
from app.ai.vector_store import vector_store

client = TestClient(app)


# ─────────────────────────────────────────────────────────────────────────────
# 1. Legal Templates Catalog & Detail Endpoints
# ─────────────────────────────────────────────────────────────────────────────

def test_list_legal_templates_endpoint():
    """Verify GET /api/legal/templates returns all standardized legal templates."""
    response = client.get("/api/legal/templates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    template_ids = [t["template_id"] for t in data]
    assert "standard-partnership-deed-karnataka" in template_ids
    assert "commercial-rent-agreement-noc" in template_ids
    assert "landlord-security-deposit-legal-notice" in template_ids
    assert "rti-application-pio" in template_ids
    assert "inc9-director-declaration" in template_ids


def test_get_partnership_deed_template():
    """Verify GET /api/legal/templates/standard-partnership-deed-karnataka."""
    response = client.get("/api/legal/templates/standard-partnership-deed-karnataka")
    assert response.status_code == 200
    data = response.json()
    assert data["template_id"] == "standard-partnership-deed-karnataka"
    assert "Indian Partnership Act" in data["statutory_act"]
    assert "₹1,000" in data["estamp_value"]
    assert "partner1_name" in data["default_fields"]
    assert "firm_name" in data["default_fields"]
    assert len(data["clauses"]) >= 4
    assert "{{firm_name}}" in data["boilerplate_text"]


def test_get_commercial_rent_agreement_noc_template():
    """Verify GET /api/legal/templates/commercial-rent-agreement-noc."""
    response = client.get("/api/legal/templates/commercial-rent-agreement-noc")
    assert response.status_code == 200
    data = response.json()
    assert data["template_id"] == "commercial-rent-agreement-noc"
    assert "Transfer of Property Act" in data["statutory_act"]
    assert "landlord_name" in data["default_fields"]
    assert "premises_address" in data["default_fields"]
    assert "EXPRESS NO-OBJECTION CERTIFICATE" in data["boilerplate_text"]


def test_get_landlord_security_deposit_legal_notice_template():
    """Verify GET /api/legal/templates/landlord-security-deposit-legal-notice."""
    response = client.get("/api/legal/templates/landlord-security-deposit-legal-notice")
    assert response.status_code == 200
    data = response.json()
    assert data["template_id"] == "landlord-security-deposit-legal-notice"
    assert "Section 106" in data["statutory_act"]
    assert "advocate_name" in data["default_fields"]
    assert "LEGAL NOTICE" in data["boilerplate_text"]


def test_get_rti_application_template():
    """Verify GET /api/legal/templates/rti-application-pio."""
    response = client.get("/api/legal/templates/rti-application-pio")
    assert response.status_code == 200
    data = response.json()
    assert data["template_id"] == "rti-application-pio"
    assert "Right to Information Act" in data["statutory_act"]
    assert "FORM A" in data["boilerplate_text"]
    assert "₹10" in data["estamp_value"]


def test_get_nonexistent_legal_template_returns_404():
    """Verify 404 response for invalid template_id."""
    response = client.get("/api/legal/templates/nonexistent-template-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


# ─────────────────────────────────────────────────────────────────────────────
# 2. Hierarchical Sub-Step Completion State Machine
# ─────────────────────────────────────────────────────────────────────────────

def test_api_substep_complete_with_snake_case_payload():
    """Verify POST /api/journey/sub-step/complete supports sub_step_id and step_id."""
    payload = {
        "journey_id": "commercial-lease-tenant-security",
        "step_id": "node-title-encumbrance",
        "sub_step_id": "substep-kaveri-account",
        "completed_substep_ids": []
    }
    response = client.post("/api/journey/sub-step/complete", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["completed_substep_id"] == "substep-kaveri-account"
    assert data["node_completed"] is False
    assert data["node_progress_percentage"] == 50  # 1 out of 2 mandatory done


def test_api_substep_complete_recalculates_node_and_unlocks_next():
    """Verify completing all mandatory substeps completes parent node and unlocks next node."""
    # Complete 1st substep
    res1 = client.post("/api/journey/sub-step/complete", json={
        "journey_id": "commercial-lease-tenant-security",
        "node_id": "node-title-encumbrance",
        "substep_id": "substep-kaveri-account",
        "completed_substep_ids": []
    })
    assert res1.status_code == 200

    # Complete 2nd and final mandatory substep
    res2 = client.post("/api/journey/sub-step/complete", json={
        "journey_id": "commercial-lease-tenant-security",
        "node_id": "node-title-encumbrance",
        "substep_id": "substep-ec-form-15",
        "completed_substep_ids": ["substep-kaveri-account"]
    })
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["node_completed"] is True
    assert data2["node_progress_percentage"] == 100
    assert "node-lease-draft-estamp" in data2["unlocked_node_ids"]


def test_citizen_dispute_journey_integrity():
    """Verify citizen dispute, Tele-Law and RTI journey structure."""
    journey = get_hierarchical_journey("citizen-dispute-telelaw-rti")
    assert journey.title == "Landlord Dispute Resolution, NALSA Tele-Law & RTI Filing"
    assert len(journey.nodes) == 4
    node_ids = [n.node_id for n in journey.nodes]
    assert node_ids == ["node-lease-review", "node-legal-notice", "node-telelaw-mediation", "node-edaakhil-rti"]

    # Verify RTI sub-step has legal template link
    edaakhil_node = next(n for n in journey.nodes if n.node_id == "node-edaakhil-rti")
    rti_sub = next(s for s in edaakhil_node.substeps if s.substep_id == "substep-rti-filing")
    assert rti_sub.legal_template_url == "/api/legal/templates/rti-application-pio"


def test_vector_search_finds_dispute_and_lease_journeys():
    """Verify semantic vector search correctly identifies dispute and lease journeys."""
    results = vector_store.search_journeys("I want to resolve a dispute with my landlord regarding security deposit", top_k=3)
    assert len(results) > 0
    top_jids = [r["journey_id"] for r in results]
    assert "citizen-dispute-telelaw-rti" in top_jids or "landlord-tenant-deposit-dispute" in top_jids
