"""
Unit and Integration Tests for Hierarchical Workflow State Machine.
Verifies Pydantic schemas, SubStep completion state transitions, parent Node progress recalculation,
DAG dependent node unlocking, and FastAPI endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.journey import (
    Journey,
    Node,
    SubStep,
    DocumentRequirement,
    StepStatus,
    ActionType,
)
from app.engine.dependency_graph import DependencyEngine, DependencyResolutionError
from app.data.blueprints import (
    get_hierarchical_journey,
    get_all_hierarchical_journeys,
    HIERARCHICAL_MSME_FOOD_JOURNEY,
    HIERARCHICAL_DPIIT_STARTUP_JOURNEY,
)

client = TestClient(app)


# ─────────────────────────────────────────────────────────────────────────────
# 1. Pydantic Model Validation Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_document_requirement_pydantic_validation():
    doc = DocumentRequirement(
        document_id="doc-aadhaar",
        title="Proprietor Aadhaar Card",
        description="12-digit UIDAI card",
        is_mandatory=True,
        document_template_url="https://uidai.gov.in/template.pdf",
        issuing_authority="UIDAI",
        verification_method="DIGILOCKER",
    )
    assert doc.document_id == "doc-aadhaar"
    assert doc.is_mandatory is True
    assert doc.verification_method == "DIGILOCKER"


def test_substep_pydantic_validation():
    sub = SubStep(
        substep_id="sub-1",
        substep_number=1,
        title="Aadhaar e-KYC Verification",
        description="Verify identity via OTP",
        is_mandatory=True,
        official_portal_url="https://myaadhaar.uidai.gov.in",
        legal_template_url="https://myaadhaar.uidai.gov.in/sample.pdf",
        statutory_form_code="UIDAI-01",
        estimated_duration="5 Mins",
    )
    assert sub.substep_id == "sub-1"
    assert sub.status == StepStatus.LOCKED
    assert sub.is_mandatory is True


def test_journey_dag_validation_detects_self_prerequisite():
    with pytest.raises(ValueError, match="cannot list itself as a prerequisite"):
        Journey(
            journey_id="invalid-journey",
            title="Invalid Self Prereq",
            category="Test",
            department="Test Dept",
            jurisdiction="Union",
            description="Test journey",
            estimated_duration="1 Day",
            nodes=[
                Node(
                    node_id="node-1",
                    step_number=1,
                    title="Node 1",
                    description="Desc",
                    governing_department="Dept",
                    prerequisites=["node-1"],  # Self-prerequisite
                    official_portal_url="https://gov.in",
                )
            ]
        )


def test_journey_dag_validation_detects_undeclared_prerequisite():
    with pytest.raises(ValueError, match="not declared prior"):
        Journey(
            journey_id="invalid-journey-2",
            title="Invalid Future Prereq",
            category="Test",
            department="Test Dept",
            jurisdiction="Union",
            description="Test journey",
            estimated_duration="1 Day",
            nodes=[
                Node(
                    node_id="node-1",
                    step_number=1,
                    title="Node 1",
                    description="Desc",
                    governing_department="Dept",
                    prerequisites=["node-2"],  # node-2 not declared prior
                    official_portal_url="https://gov.in",
                ),
                Node(
                    node_id="node-2",
                    step_number=2,
                    title="Node 2",
                    description="Desc",
                    governing_department="Dept",
                    prerequisites=[],
                    official_portal_url="https://gov.in",
                )
            ]
        )


# ─────────────────────────────────────────────────────────────────────────────
# 2. Seeded Blueprints Validation
# ─────────────────────────────────────────────────────────────────────────────

def test_seeded_msme_cloud_kitchen_journey_integrity():
    journey = get_hierarchical_journey("msme-cloud-kitchen-food")
    assert journey.journey_id == "msme-cloud-kitchen-food"
    assert len(journey.nodes) == 4

    # Node 1: Udyam Registration (3 substeps, unlocked)
    node1 = journey.nodes[0]
    assert node1.node_id == "node-udyam-reg"
    assert len(node1.substeps) == 3
    assert node1.prerequisites == []

    # Node 2: FSSAI License (Prerequisite is Node 1)
    node2 = journey.nodes[1]
    assert node2.node_id == "node-fssai-lic"
    assert "node-udyam-reg" in node2.prerequisites
    assert len(node2.substeps) == 3

    # Node 3: BBMP Trade License (Prerequisite is Node 2)
    node3 = journey.nodes[2]
    assert node3.node_id == "node-bbmp-trade"
    assert "node-fssai-lic" in node3.prerequisites

    # Node 4: GST Registration (Prerequisite is Node 3)
    node4 = journey.nodes[3]
    assert node4.node_id == "node-gst-swiggy"
    assert "node-bbmp-trade" in node4.prerequisites


def test_seeded_dpiit_startup_journey_integrity():
    journey = get_hierarchical_journey("dpiit-startup-ip")
    assert journey.journey_id == "dpiit-startup-ip"
    assert len(journey.nodes) == 4

    # Node 1: MCA SPICe+ (4 substeps)
    node1 = journey.nodes[0]
    assert node1.node_id == "node-mca-incorporation"
    assert len(node1.substeps) == 4

    # Node 2: Startup India DPIIT Recognition (Prerequisite is Node 1)
    node2 = journey.nodes[1]
    assert node2.node_id == "node-dpiit-recognition"
    assert "node-mca-incorporation" in node2.prerequisites

    # Node 3: IP Fast-Track (Prerequisite is Node 2)
    node3 = journey.nodes[2]
    assert node3.node_id == "node-trademark-ip"
    assert "node-dpiit-recognition" in node3.prerequisites

    # Node 4: SISFS Seed Fund Grant (Prerequisite is Node 2)
    node4 = journey.nodes[3]
    assert node4.node_id == "node-sisfs-grant"
    assert "node-dpiit-recognition" in node4.prerequisites


# ─────────────────────────────────────────────────────────────────────────────
# 3. State Machine Transition & Recalculation Engine Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_initial_state_evaluation_unlocks_first_node_only():
    journey = get_hierarchical_journey("msme-cloud-kitchen-food")
    evaluated = DependencyEngine.evaluate_hierarchical_journey(journey, completed_substep_ids=[])

    # Node 1 is unlocked and IN_PROGRESS
    assert evaluated.nodes[0].is_unlocked is True
    assert evaluated.nodes[0].status == StepStatus.IN_PROGRESS
    assert evaluated.nodes[0].substeps[0].status == StepStatus.IN_PROGRESS
    assert evaluated.nodes[0].substeps[1].status == StepStatus.LOCKED
    assert evaluated.nodes[0].progress_percentage == 0

    # Nodes 2, 3, 4 are LOCKED
    for n in evaluated.nodes[1:]:
        assert n.is_unlocked is False
        assert n.status == StepStatus.LOCKED
        for sub in n.substeps:
            assert sub.status == StepStatus.LOCKED


def test_partial_substep_completion_recalculates_node_progress():
    journey = get_hierarchical_journey("msme-cloud-kitchen-food")
    
    # Complete SubStep 1 of Node 1 (out of 3 mandatory substeps)
    updated_subs, evaluated, node_completed, unlocked = DependencyEngine.complete_substep(
        journey=journey,
        node_id="node-udyam-reg",
        substep_id="substep-aadhaar-ekyc",
        completed_substep_ids=[]
    )

    assert "substep-aadhaar-ekyc" in updated_subs
    assert node_completed is False
    assert len(unlocked) == 0

    node1 = evaluated.nodes[0]
    assert node1.status == StepStatus.IN_PROGRESS
    assert node1.substeps[0].status == StepStatus.COMPLETED
    assert node1.substeps[1].status == StepStatus.IN_PROGRESS
    # 1 of 3 completed = 33%
    assert node1.progress_percentage == 33


def test_completing_all_mandatory_substeps_marks_node_completed_and_unlocks_downstream():
    journey = get_hierarchical_journey("msme-cloud-kitchen-food")
    
    # Complete Substeps 1 & 2
    completed_subs = ["substep-aadhaar-ekyc", "substep-udyam-filing"]

    # Now complete Substep 3 (final mandatory substep of Node 1)
    updated_subs, evaluated, node_completed, unlocked = DependencyEngine.complete_substep(
        journey=journey,
        node_id="node-udyam-reg",
        substep_id="substep-udyam-cert",
        completed_substep_ids=completed_subs
    )

    assert node_completed is True
    assert "node-fssai-lic" in unlocked  # Node 2 unlocked!

    node1 = evaluated.nodes[0]
    assert node1.status == StepStatus.COMPLETED
    assert node1.progress_percentage == 100

    node2 = evaluated.nodes[1]
    assert node2.is_unlocked is True
    assert node2.status == StepStatus.IN_PROGRESS
    assert node2.substeps[0].status == StepStatus.IN_PROGRESS
    assert node2.missing_prerequisites == []

    # Node 3 remains locked until Node 2 is completed
    node3 = evaluated.nodes[2]
    assert node3.is_unlocked is False
    assert node3.status == StepStatus.LOCKED


def test_cannot_complete_substep_on_locked_node_raises_dependency_error():
    journey = get_hierarchical_journey("msme-cloud-kitchen-food")
    
    # Attempt to complete FSSAI substep while Node 1 is not yet completed
    with pytest.raises(DependencyResolutionError) as exc_info:
        DependencyEngine.complete_substep(
            journey=journey,
            node_id="node-fssai-lic",
            substep_id="substep-foscos-filing",
            completed_substep_ids=[]
        )

    assert "Cannot complete substep" in str(exc_info.value)
    assert exc_info.value.step_id == "node-fssai-lic"
    assert "node-udyam-reg" in exc_info.value.missing_prerequisites


# ─────────────────────────────────────────────────────────────────────────────
# 4. FastAPI Endpoint Integration Tests (POST /api/journey/substep/complete)
# ─────────────────────────────────────────────────────────────────────────────

def test_api_substep_complete_happy_path():
    payload = {
        "journey_id": "msme-cloud-kitchen-food",
        "node_id": "node-udyam-reg",
        "substep_id": "substep-aadhaar-ekyc",
        "completed_substep_ids": []
    }
    response = client.post("/api/journey/substep/complete", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["journey_id"] == "msme-cloud-kitchen-food"
    assert data["completed_substep_id"] == "substep-aadhaar-ekyc"
    assert data["node_completed"] is False
    assert data["node_progress_percentage"] == 33
    assert data["journey"]["nodes"][0]["substeps"][0]["status"] == "COMPLETED"


def test_api_substep_complete_node_completion_and_unlocking():
    payload = {
        "journey_id": "msme-cloud-kitchen-food",
        "node_id": "node-udyam-reg",
        "substep_id": "substep-udyam-cert",
        "completed_substep_ids": ["substep-aadhaar-ekyc", "substep-udyam-filing"]
    }
    response = client.post("/api/journey/substep/complete", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["node_completed"] is True
    assert data["node_progress_percentage"] == 100
    assert "node-fssai-lic" in data["unlocked_node_ids"]
    assert data["journey"]["nodes"][1]["is_unlocked"] is True


def test_api_substep_complete_dependency_violation_returns_400():
    payload = {
        "journey_id": "msme-cloud-kitchen-food",
        "node_id": "node-fssai-lic",
        "substep_id": "substep-water-potability",
        "completed_substep_ids": []  # Node 1 not completed
    }
    response = client.post("/api/journey/substep/complete", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["error"] == "SEQUENTIAL_DEPENDENCY_VIOLATION"
    assert data["detail"]["target_node_id"] == "node-fssai-lic"
    assert "node-udyam-reg" in data["detail"]["missing_prerequisites"]


def test_api_substep_complete_invalid_journey_returns_404():
    payload = {
        "journey_id": "non-existent-journey",
        "node_id": "node-1",
        "substep_id": "sub-1"
    }
    response = client.post("/api/journey/substep/complete", json=payload)
    assert response.status_code == 404


def test_api_get_hierarchical_journey():
    response = client.get("/api/journey/msme-cloud-kitchen-food/hierarchical")
    assert response.status_code == 200
    data = response.json()
    assert data["journey_id"] == "msme-cloud-kitchen-food"
    assert len(data["nodes"]) == 4
    assert len(data["nodes"][0]["substeps"]) == 3
