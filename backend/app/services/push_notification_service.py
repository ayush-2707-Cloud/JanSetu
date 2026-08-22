"""Proactive Citizen Push Notification Service (WhatsApp & SMS).

Dispatches realistic statutory milestone alerts, SLA warnings, and approval notices.
"""

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.schemas.tier3_suite import PushNotificationRequest, PushNotificationRecord


class PushNotificationService:
    """Manages proactive WhatsApp & SMS push notifications."""

    _notification_history: List[PushNotificationRecord] = [
        PushNotificationRecord(
            notification_id="NOTIF-WA-849102",
            utid="UTID-MH-2026-094182",
            channel="WHATSAPP",
            event_type="MILESTONE_APPROVED",
            recipient_name="Ayush Singh Chauhan",
            phone="+91 98765-43210",
            department="Food Safety Authority (FSSAI)",
            timestamp="2026-02-22T14:32:00Z",
            message="Govt of Maharashtra Alert: Your FSSAI Basic License for UTID-MH-2026-094182 has been approved by the designated Food Safety Officer. Next step: Municipal Trade NOC is now unlocked.",
            delivery_status="DELIVERED",
            read_receipt=True,
        )
    ]

    @classmethod
    def simulate_push(cls, req: PushNotificationRequest) -> PushNotificationRecord:
        """Dispatches a new push notification."""
        now = datetime.now(timezone.utc).isoformat()
        notif_id = f"NOTIF-{req.channel[:2]}-{uuid.uuid4().hex[:6].upper()}"

        if not req.message:
            if req.event_type == "MILESTONE_APPROVED":
                msg = f"Govt of Maharashtra: Your application milestone with {req.department} under {req.utid} is APPROVED. Subsequent dependencies unlocked."
            elif req.event_type == "DEFECT_FLAGGED":
                msg = f"Govt of Maharashtra: Scrutiny query raised on {req.utid} by {req.department}. Please upload corrected document within statutory window."
            elif req.event_type == "SLA_WARNING":
                msg = f"Govt of Maharashtra RTSA Alert: Application {req.utid} SLA window is 80% elapsed. Accelerated priority assigned."
            else:
                msg = f"Govt of Maharashtra JanSetu Alert: Update on {req.utid} ({req.department})."
        else:
            msg = req.message

        record = PushNotificationRecord(
            notification_id=notif_id,
            utid=req.utid,
            channel=req.channel,
            event_type=req.event_type,
            recipient_name=req.recipient_name,
            phone=req.phone,
            department=req.department,
            timestamp=now,
            message=msg,
            delivery_status="DELIVERED",
            read_receipt=True,
        )

        cls._notification_history.append(record)
        return record

    @classmethod
    def get_history_for_utid(cls, utid: str) -> List[PushNotificationRecord]:
        return [n for n in cls._notification_history if n.utid == utid]

    @classmethod
    def get_all_recent(cls) -> List[PushNotificationRecord]:
        return list(reversed(cls._notification_history[-15:]))
