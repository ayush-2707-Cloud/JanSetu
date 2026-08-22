"""FastAPI Router for Real-Time EventBus & Server-Sent Events (SSE) Stream."""

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import List
from app.schemas.events import (
    GovTechEvent,
    EventPublishRequest,
    EventType,
)
from app.services.event_bus import EventBus

router = APIRouter(
    prefix="/events",
    tags=["Event-Driven Pub/Sub & Server-Sent Events (SSE)"]
)


@router.get(
    "/stream",
    summary="Subscribe to Live Server-Sent Events (SSE) Stream",
    description="Maintains an open HTTP connection streaming real-time workflow state changes, officer decisions, and SLA alerts."
)
async def api_stream_events():
    """Stream real-time Server-Sent Events (SSE)."""
    return StreamingResponse(
        EventBus.subscribe(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post(
    "/publish",
    response_model=GovTechEvent,
    summary="Publish Event onto Pub/Sub EventBus",
    description="Dispatches a workflow or scrutiny event to all connected frontends and subscribed webhooks."
)
async def api_publish_event(payload: EventPublishRequest) -> GovTechEvent:
    """Publish a new event onto the EventBus."""
    event = await EventBus.publish(
        event_type=payload.event_type,
        utid=payload.utid,
        department=payload.department,
        actor=payload.actor,
        message=payload.message,
        step_id=payload.step_id,
        metadata=payload.metadata
    )
    return event


@router.get(
    "/recent",
    response_model=List[GovTechEvent],
    summary="Get Recent Broadcast Events",
    description="Returns the last 20 events recorded on the in-memory Pub/Sub event ledger."
)
async def api_get_recent_events(limit: int = 20) -> List[GovTechEvent]:
    """Retrieve recent event history."""
    return EventBus.get_recent_events(limit=limit)
