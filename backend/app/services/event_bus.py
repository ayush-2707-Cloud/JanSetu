"""In-memory async broadcast EventBus for GovTech Interoperability Middleware.

Supports:
- Asynchronous publish/subscribe
- Streaming Server-Sent Events (SSE) to connected Next.js frontends
- Automatic event history buffer
"""

import asyncio
import uuid
from datetime import datetime, timezone
from typing import List, Set, AsyncGenerator
from app.schemas.events import GovTechEvent, EventType


class EventBus:
    """In-memory broadcast EventBus with subscriber queues and event history."""

    _subscribers: Set[asyncio.Queue] = set()
    _history: List[GovTechEvent] = []
    _max_history: int = 50

    @classmethod
    async def publish(
        cls,
        event_type: EventType,
        utid: str,
        department: str,
        actor: str,
        message: str,
        step_id: str = None,
        metadata: dict = None,
    ) -> GovTechEvent:
        event = GovTechEvent(
            event_id=f"evt-{uuid.uuid4().hex[:8]}",
            event_type=event_type,
            utid=utid,
            step_id=step_id,
            department=department,
            actor=actor,
            message=message,
            timestamp=datetime.now(timezone.utc).isoformat(),
            metadata=metadata or {},
        )

        cls._history.append(event)
        if len(cls._history) > cls._max_history:
            cls._history.pop(0)

        # Broadcast to all active subscriber queues
        dead_subscribers = []
        for queue in list(cls._subscribers):
            try:
                queue.put_nowait(event)
            except Exception:
                dead_subscribers.append(queue)

        for q in dead_subscribers:
            cls._subscribers.discard(q)

        return event

    @classmethod
    def get_recent_events(cls, limit: int = 20) -> List[GovTechEvent]:
        return list(reversed(cls._history[-limit:]))

    @classmethod
    async def subscribe(cls) -> AsyncGenerator[str, None]:
        """Async generator streaming SSE formatted events."""
        queue: asyncio.Queue = asyncio.Queue()
        cls._subscribers.add(queue)

        try:
            # Yield initial connection heartbeat
            yield f"data: {{\"type\": \"CONNECTED\", \"message\": \"JanSetu Live GovTech EventStream Active\"}}\n\n"

            while True:
                try:
                    event: GovTechEvent = await asyncio.wait_for(queue.get(), timeout=25.0)
                    yield f"data: {event.model_dump_json()}\n\n"
                except asyncio.TimeoutError:
                    # Heartbeat comment to keep SSE connection alive
                    yield ": ping heartbeat\n\n"
        finally:
            cls._subscribers.discard(queue)
