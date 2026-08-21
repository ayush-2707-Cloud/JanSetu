"""
Citizen Session Persistence Router.
Backed by SQLite and SQLAlchemy for cross-reload state recovery.
"""

import uuid
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import UserSessionModel, JourneyProgressModel
from app.schemas.session import (
    SessionCreateRequest,
    SessionStateResponse,
    SessionStepCompleteRequest
)
from app.data.blueprints import get_validated_blueprint
from app.engine.dependency_graph import DependencyEngine, DependencyResolutionError

router = APIRouter(prefix="/api/session", tags=["Session Persistence (SQLite)"])


@router.post("", response_model=SessionStateResponse)
def create_or_restore_session(
    payload: SessionCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Initialize or restore a citizen session.
    Persists profile parameters (category, state, reservation) and active journey.
    """
    sess_id = payload.session_id or str(uuid.uuid4())
    user_sess = db.query(UserSessionModel).filter(UserSessionModel.session_id == sess_id).first()

    if not user_sess:
        user_sess = UserSessionModel(
            session_id=sess_id,
            active_journey_id=payload.active_journey_id or "certified-tourist-guide",
            profile_parameters=payload.profile_parameters or {}
        )
        db.add(user_sess)
        db.commit()
        db.refresh(user_sess)
    else:
        if payload.active_journey_id:
            # pyrefly: ignore [bad-assignment]
            user_sess.active_journey_id = payload.active_journey_id
        if payload.profile_parameters:
            user_sess.profile_parameters = {**user_sess.profile_parameters, **payload.profile_parameters}
        # pyrefly: ignore [bad-assignment]
        user_sess.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user_sess)

    return _build_session_response(user_sess, db)


@router.get("/{session_id}", response_model=SessionStateResponse)
def get_session_state(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve citizen session, completed steps, and active journey evaluation.
    """
    user_sess = db.query(UserSessionModel).filter(UserSessionModel.session_id == session_id).first()
    if not user_sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )

    return _build_session_response(user_sess, db)


@router.put("/{session_id}/active-journey", response_model=SessionStateResponse)
def set_active_journey(
    session_id: str,
    journey_id: str,
    db: Session = Depends(get_db)
):
    """Update active journey selection for a session."""
    user_sess = db.query(UserSessionModel).filter(UserSessionModel.session_id == session_id).first()
    if not user_sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )

    # Verify blueprint exists
    try:
        get_validated_blueprint(journey_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Journey '{journey_id}' not found.")

    # pyrefly: ignore [bad-assignment]
    user_sess.active_journey_id = journey_id
    # pyrefly: ignore [bad-assignment]
    user_sess.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user_sess)

    return _build_session_response(user_sess, db)


@router.post("/{session_id}/complete-step", response_model=SessionStateResponse)
def complete_session_step(
    session_id: str,
    payload: SessionStepCompleteRequest,
    db: Session = Depends(get_db)
):
    """
    Execute step completion for the active session journey.
    Validates prerequisites, updates SQLite persistence, and returns updated evaluation.
    """
    user_sess = db.query(UserSessionModel).filter(UserSessionModel.session_id == session_id).first()
    if not user_sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )

    journey_id = user_sess.active_journey_id or "certified-tourist-guide"
    try:
        # pyrefly: ignore [bad-argument-type]
        blueprint = get_validated_blueprint(journey_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Journey '{journey_id}' not found.")

    progress = db.query(JourneyProgressModel).filter(
        JourneyProgressModel.session_id == session_id,
        JourneyProgressModel.journey_id == journey_id
    ).first()

    existing_completed = progress.completed_steps if progress else []

    try:
        updated_completed, evaluated = DependencyEngine.validate_and_complete_step(
            blueprint=blueprint,
            completed_step_ids=existing_completed,
            target_step_id=payload.step_id
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

    if not progress:
        progress = JourneyProgressModel(
            session_id=session_id,
            journey_id=journey_id,
            completed_steps=updated_completed,
            current_step_id=evaluated.current_active_step_id,
            progress_percentage=evaluated.overall_progress_percentage
        )
        db.add(progress)
    else:
        progress.completed_steps = updated_completed
        # pyrefly: ignore [bad-assignment]
        progress.current_step_id = evaluated.current_active_step_id
        # pyrefly: ignore [bad-assignment]
        progress.progress_percentage = evaluated.overall_progress_percentage
        # pyrefly: ignore [bad-assignment]
        progress.updated_at = datetime.now(timezone.utc)

    db.commit()

    return _build_session_response(user_sess, db)


def _build_session_response(user_sess: UserSessionModel, db: Session) -> SessionStateResponse:
    journey_id = user_sess.active_journey_id
    progress = None
    if journey_id:
        progress = db.query(JourneyProgressModel).filter(
            JourneyProgressModel.session_id == user_sess.session_id,
            JourneyProgressModel.journey_id == journey_id
        ).first()

    completed_ids = progress.completed_steps if progress else []
    current_step = progress.current_step_id if progress else None
    pct = progress.progress_percentage if progress else 0
    evaluated = None

    if journey_id:
        try:
            # pyrefly: ignore [bad-argument-type]
            blueprint = get_validated_blueprint(journey_id)
            evaluated = DependencyEngine.evaluate_journey(blueprint, completed_ids)
            pct = evaluated.overall_progress_percentage
            current_step = evaluated.current_active_step_id
        except Exception:
            pass

    return SessionStateResponse(
        # pyrefly: ignore [bad-argument-type]
        session_id=user_sess.session_id,
        # pyrefly: ignore [bad-argument-type]
        active_journey_id=journey_id,
        profile_parameters=user_sess.profile_parameters,
        completed_step_ids=completed_ids,
        # pyrefly: ignore [bad-argument-type]
        current_step_id=current_step,
        # pyrefly: ignore [bad-argument-type]
        progress_percentage=pct,
        evaluated_journey=evaluated,
        created_at=user_sess.created_at.isoformat() if user_sess.created_at else "",
        updated_at=user_sess.updated_at.isoformat() if user_sess.updated_at else ""
    )
