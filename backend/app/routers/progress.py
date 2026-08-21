"""
Progress and Milestone Step Resolution Router.
Enforces deterministic sequential dependency rules and hierarchical substep state transitions.
"""

from fastapi import APIRouter, HTTPException, status
from typing import Optional
from app.schemas.journey import (
    StepCompletionRequest,
    StepCompletionResponse,
    SubStepCompletionRequest,
    SubStepCompletionResponse,
)
from app.data.blueprints import get_validated_blueprint, get_hierarchical_journey
from app.engine.dependency_graph import DependencyEngine, DependencyResolutionError

router = APIRouter(tags=["Milestone Execution & Dependencies"])


# ─────────────────────────────────────────────────────────────────────────────
# Hierarchical SubStep Completion Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/api/journey/sub-step/complete", response_model=SubStepCompletionResponse)
@router.post("/journey/sub-step/complete", response_model=SubStepCompletionResponse)
@router.post("/api/journey/substep/complete", response_model=SubStepCompletionResponse)
@router.post("/journey/substep/complete", response_model=SubStepCompletionResponse)
def complete_substep_endpoint(payload: SubStepCompletionRequest) -> SubStepCompletionResponse:
    """
    Complete a granular SubStep within a hierarchical workflow Node:
    - Accepts journey_id, node_id/step_id, and substep_id/sub_step_id.
    - Marks the substep COMPLETED.
    - Recalculates parent node progress % based on completed mandatory substeps.
    - If all mandatory substeps are done, marks node COMPLETED and unlocks dependent downstream nodes.
    - Returns updated Journey runtime state.
    """
    try:
        raw_journey = get_hierarchical_journey(payload.journey_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hierarchical journey '{payload.journey_id}' not found."
        )

    try:
        target_node = payload.target_node_id
        target_sub = payload.target_substep_id
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(err)
        )

    try:
        updated_substeps, evaluated_journey, node_completed, unlocked_nodes = DependencyEngine.complete_substep(
            journey=raw_journey,
            node_id=target_node,
            substep_id=target_sub,
            completed_substep_ids=payload.completed_substep_ids or [],
        )

        # Retrieve updated node progress percentage
        updated_node = next((n for n in evaluated_journey.nodes if n.node_id == target_node), None)
        node_progress = updated_node.progress_percentage if updated_node else 100

        msg_parts = [f"SubStep '{target_sub}' marked COMPLETED."]
        if node_completed:
            msg_parts.append(f"Parent Node '{target_node}' is now fully COMPLETED!")
        if unlocked_nodes:
            msg_parts.append(f"Unlocked downstream milestone(s): {', '.join(unlocked_nodes)}.")

        return SubStepCompletionResponse(
            success=True,
            message=" ".join(msg_parts),
            journey_id=payload.journey_id,
            completed_substep_id=target_sub,
            node_completed=node_completed,
            node_progress_percentage=node_progress,
            overall_progress_percentage=evaluated_journey.overall_progress_percentage,
            unlocked_node_ids=unlocked_nodes,
            journey=evaluated_journey,
        )

    except DependencyResolutionError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "SEQUENTIAL_DEPENDENCY_VIOLATION",
                "message": str(err),
                "target_node_id": err.step_id,
                "missing_prerequisites": err.missing_prerequisites,
            }
        )
    except KeyError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err),
        )


# ─────────────────────────────────────────────────────────────────────────────
# Flat Blueprint Step Resolution (Backward Compatibility)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/progress/{journey_id}/complete-step", response_model=StepCompletionResponse)
@router.post("/api/journey/{journey_id}/complete-step", response_model=StepCompletionResponse)
def complete_step_for_journey(
    journey_id: str,
    payload: StepCompletionRequest
):
    """
    Attempt to complete a milestone step for a given journey_id in the URL path.
    Validates sequential prerequisites and transitions newly unblocked nodes to IN_PROGRESS.
    """
    return _resolve_step_completion(journey_id, payload)


@router.post("/api/journey/complete-step", response_model=StepCompletionResponse)
@router.post("/progress/complete-step", response_model=StepCompletionResponse)
def complete_step_generic(
    payload: StepCompletionRequest
):
    """
    Generic evaluation route (POST /api/journey/complete-step) matching Track 2 specification.
    Takes target step ID and journey ID in JSON payload.
    """
    if not payload.journey_id:
        journey_id = "certified-tourist-guide"
    else:
        journey_id = payload.journey_id

    return _resolve_step_completion(journey_id, payload)


def _resolve_step_completion(journey_id: str, payload: StepCompletionRequest) -> StepCompletionResponse:
    try:
        blueprint = get_validated_blueprint(journey_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Journey '{journey_id}' not found."
        )

    try:
        target_step = payload.target_step_id
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(err)
        )

    try:
        updated_completed, evaluated_journey = DependencyEngine.validate_and_complete_step(
            blueprint=blueprint,
            completed_step_ids=payload.completed_step_ids,
            target_step_id=target_step
        )
        return StepCompletionResponse(
            success=True,
            message=f"Step '{target_step}' successfully verified and marked COMPLETED.",
            evaluated_journey=evaluated_journey
        )
    except DependencyResolutionError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "SEQUENTIAL_DEPENDENCY_VIOLATION",
                "message": str(err),
                "target_step_id": err.step_id,
                "missing_prerequisites": err.missing_prerequisites
            }
        )
    except KeyError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
