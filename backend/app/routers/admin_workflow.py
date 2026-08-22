"""FastAPI Router for Configurable Workflow Orchestrator (No-Code DAG Engine).

Allows authorized administrators to modify DAG prerequisite dependencies and conditional rules at runtime.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from app.schemas.workflow_dag import (
    WorkflowNodeRule,
    WorkflowGraph,
    WorkflowRuleUpdateRequest,
)
from app.schemas.events import EventType
from app.services.event_bus import EventBus

router = APIRouter(
    prefix="/admin/workflow",
    tags=["Visual Configurable Workflow Orchestrator (DAG Engine)"]
)

# In-memory mutable workflow graph registry
WORKFLOW_REGISTRY: Dict[str, WorkflowGraph] = {
    "msme-food-business": WorkflowGraph(
        journey_id="msme-food-business",
        journey_name="MSME Cloud Kitchen & Food Business Registration",
        version="v3.2-configurable",
        last_updated_at=datetime.now(timezone.utc).isoformat(),
        last_updated_by="SYSTEM_DEFAULT",
        nodes=[
            WorkflowNodeRule(
                step_id="step-pan-01",
                step_number=1,
                step_title="Income Tax PAN & Aadhaar e-KYC Verification",
                department="Ministry of Finance (CBDT)",
                prerequisites=[],
                is_optional=False,
                conditional_rule=None,
                statutory_sla_hours=12,
            ),
            WorkflowNodeRule(
                step_id="step-udyam-02",
                step_number=2,
                step_title="MSME Udyam Micro-Enterprise Registration",
                department="Ministry of MSME",
                prerequisites=["step-pan-01"],
                is_optional=False,
                conditional_rule=None,
                statutory_sla_hours=24,
            ),
            WorkflowNodeRule(
                step_id="step-fssai-03",
                step_number=3,
                step_title="FSSAI State Food Business Operator License",
                department="Food Safety Authority (FSSAI)",
                prerequisites=["step-pan-01", "step-udyam-02"],
                is_optional=False,
                conditional_rule="water_test_exempt = daily_orders < 20",
                statutory_sla_hours=48,
            ),
            WorkflowNodeRule(
                step_id="step-trade-04",
                step_number=4,
                step_title="Municipal Corporation Commercial Trade License",
                department="State Municipal Corporation (BBMP / BMC)",
                prerequisites=["step-fssai-03"],
                is_optional=False,
                conditional_rule="fire_noc_required = premises_area > 500",
                statutory_sla_hours=72,
            ),
            WorkflowNodeRule(
                step_id="step-noc-05",
                step_number=5,
                step_title="State Pollution Control Board Consent (CTE)",
                department="State Pollution Control Board (KSPCB / MPCB)",
                prerequisites=["step-trade-04"],
                is_optional=True,
                conditional_rule="cte_exempt = investment_inr < 2500000",
                statutory_sla_hours=120,
            ),
        ]
    )
}


@router.get(
    "/rules/{journey_id}",
    response_model=WorkflowGraph,
    summary="Get Configurable Workflow Rules and Dependency Tree",
    description="Retrieves the active DAG nodes, prerequisite lists, and conditional rules for a given journey."
)
async def api_get_workflow_rules(journey_id: str = "msme-food-business") -> WorkflowGraph:
    """Retrieve active DAG workflow rules for the journey."""
    graph = WORKFLOW_REGISTRY.get(journey_id)
    if not graph:
        # Fallback to default journey
        graph = WORKFLOW_REGISTRY["msme-food-business"]
    return graph


@router.post(
    "/update",
    response_model=WorkflowGraph,
    summary="Update Workflow DAG Prerequisites & Conditions at Runtime",
    description="Allows administrators to dynamically modify prerequisite dependencies (e.g. make a step optional or modify required prerequisites) and broadcasts a WORKFLOW_UPDATED event."
)
async def api_update_workflow_rule(payload: WorkflowRuleUpdateRequest) -> WorkflowGraph:
    """Update a specific node's prerequisites and broadcast update."""
    graph = WORKFLOW_REGISTRY.get(payload.journey_id)
    if not graph:
        graph = WORKFLOW_REGISTRY["msme-food-business"]

    # Locate and update the target node
    node = next((n for n in graph.nodes if n.step_id == payload.step_id), None)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{payload.step_id}' not found in journey '{payload.journey_id}'."
        )

    node.prerequisites = payload.prerequisites
    node.is_optional = payload.is_optional
    node.conditional_rule = payload.conditional_rule
    node.statutory_sla_hours = payload.statutory_sla_hours

    graph.last_updated_at = datetime.now(timezone.utc).isoformat()
    graph.last_updated_by = payload.updated_by

    # Broadcast event onto EventBus
    await EventBus.publish(
        event_type=EventType.WORKFLOW_UPDATED,
        utid=f"CONFIG-{payload.journey_id.upper()}",
        department=node.department,
        actor=payload.updated_by,
        message=f"DAG Rule updated for '{node.step_title}': Prerequisites set to {payload.prerequisites}, Optional={payload.is_optional}",
        step_id=payload.step_id,
        metadata={
            "journey_id": payload.journey_id,
            "prerequisites": payload.prerequisites,
            "is_optional": payload.is_optional,
            "conditional_rule": payload.conditional_rule,
        }
    )

    return graph
