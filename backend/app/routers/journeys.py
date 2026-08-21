"""
Journeys and Statutory Blueprint Router.
Supports both flat blueprints and nested Hierarchical Journeys (/api/journey/{journey_id}/hierarchical).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.journey import JourneyBlueprint, JourneyRuntimeEvaluation, Journey
from app.data.blueprints import (
    get_validated_blueprint,
    get_all_validated_blueprints,
    get_hierarchical_journey,
    get_all_hierarchical_journeys,
)
from app.engine.dependency_graph import DependencyEngine

router = APIRouter(tags=["Journeys & Blueprints"])


# ─────────────────────────────────────────────────────────────────────────────
# Hierarchical Journey Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/journeys/hierarchical", response_model=List[Journey])
@router.get("/api/journeys/hierarchical", response_model=List[Journey])
def list_hierarchical_journeys() -> List[Journey]:
    """Retrieve all available seeded hierarchical journeys with nested SubSteps."""
    return get_all_hierarchical_journeys()


@router.get("/journeys/{journey_id}/hierarchical", response_model=Journey)
@router.get("/api/journey/{journey_id}/hierarchical", response_model=Journey)
def get_hierarchical_journey_endpoint(
    journey_id: str,
    completed_substeps: List[str] = Query(default=[], description="List of completed substep_ids")
) -> Journey:
    """Retrieve hierarchical journey evaluated against completed substep IDs."""
    try:
        raw_journey = get_hierarchical_journey(journey_id)
    except KeyError:
        raise HTTPException(
            status_code=404,
            detail=f"Hierarchical journey '{journey_id}' not found in registry."
        )

    return DependencyEngine.evaluate_hierarchical_journey(raw_journey, completed_substeps)


# ─────────────────────────────────────────────────────────────────────────────
# Flat Blueprint Endpoints (Backward Compatibility)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/journeys", response_model=List[JourneyBlueprint])
@router.get("/api/journeys", response_model=List[JourneyBlueprint])
def list_journey_blueprints(
    category: Optional[str] = Query(None, description="Filter by category/domain"),
    domain: Optional[str] = Query(None, description="Filter by domain ID"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory ID"),
    activity: Optional[str] = Query(None, description="Filter by activity ID"),
    q: Optional[str] = Query(None, description="Search term across title and description")
):
    """Retrieve all available deterministic journey blueprints."""
    blueprints = get_all_validated_blueprints()

    if domain:
        blueprints = [b for b in blueprints if b.domain_id == domain]

    if subcategory:
        blueprints = [b for b in blueprints if b.subcategory_id == subcategory]

    if activity:
        blueprints = [b for b in blueprints if b.activity_id == activity]

    if category:
        blueprints = [b for b in blueprints if category.lower() in b.category.lower()]

    if q:
        query_str = q.lower()
        blueprints = [
            b for b in blueprints
            if query_str in b.title.lower() or query_str in b.description.lower()
        ]

    return blueprints


@router.get("/journeys/{journey_id}", response_model=JourneyBlueprint)
@router.get("/api/journey/{journey_id}", response_model=JourneyBlueprint)
def get_journey_blueprint(journey_id: str):
    """Retrieve raw statutory blueprint for a specific life-event journey."""
    try:
        return get_validated_blueprint(journey_id)
    except KeyError:
        raise HTTPException(
            status_code=404,
            detail=f"Journey blueprint '{journey_id}' not found in registry."
        )


@router.get("/journeys/{journey_id}/evaluate", response_model=JourneyRuntimeEvaluation)
@router.get("/api/journey/{journey_id}/evaluate", response_model=JourneyRuntimeEvaluation)
def evaluate_journey_runtime(
    journey_id: str,
    completed: List[str] = Query(default=[], description="List of completed step_ids")
):
    """
    Dynamically evaluate and resolve lock/unlock states for all steps
    based on the citizen's completed step prerequisites.
    """
    try:
        blueprint = get_validated_blueprint(journey_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Journey '{journey_id}' not found.")

    return DependencyEngine.evaluate_journey(blueprint, completed)
