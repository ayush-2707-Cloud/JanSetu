"""FastAPI Router for Real-Time SMS & WhatsApp Status Notification Dispatch Sandbox.

Simulates official C-DAC e-Pramaan SMS gateway & Meta WhatsApp Business API dispatch
for citizen milestone reminders, statutory SLA expirations, and regulatory gazette alerts.
"""

from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status

router = APIRouter(
    prefix="/api/notifications",
    tags=["Citizen Notification & Alert Dispatch"]
)

class NotificationDispatchRequest(BaseModel):
    channel: str = Field(default="WHATSAPP", description="'WHATSAPP' or 'SMS'")
    recipient_mobile: str = Field(default="+919876543210", description="Recipient 10-digit mobile number")
    journey_title: str = Field(default="Karnataka Cloud Kitchen & MSME Setup", description="Title of active roadmap")
    step_title: str = Field(default="Obtain BBMP Health Trade & Fire NOC", description="Milestone title")
    notification_type: str = Field(default="MILESTONE_REMINDER", description="'MILESTONE_REMINDER' | 'SLA_EXPIRY' | 'GAZETTE_UPDATE'")
    language: str = Field(default="en", description="'en', 'hi', or 'kn'")

class NotificationDispatchResponse(BaseModel):
    dispatch_id: str
    channel: str
    recipient_mobile_masked: str
    template_id: str
    status: str
    rendered_message_text: str
    dispatched_at_iso: str
    gateway_reference: str
    delivery_sla: str

@router.post("/simulate-dispatch", response_model=NotificationDispatchResponse)
async def simulate_notification_dispatch(payload: NotificationDispatchRequest):
    """Simulate dispatching a verified government alert to citizen via SMS or WhatsApp."""
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    masked_phone = payload.recipient_mobile[:3] + "******" + payload.recipient_mobile[-4:]
    dispatch_id = f"CDAC-{now.strftime('%Y%m%d')}-{abs(hash(payload.step_title)) % 100000:05d}"

    if payload.channel.upper() == "WHATSAPP":
        template_id = "gov_citizen_milestone_v2"
        if payload.language == "hi":
            msg = (
                f"🏛️ *JanSetu™ सरकारी सूचना*\n\n"
                f"नमस्ते! आपके *{payload.journey_title}* आवेदन का अगला चरण सक्रिय है:\n"
                f"👉 *{payload.step_title}*\n\n"
                f"⏰ *अनुमानित समय सीमा:* 3 कार्य दिवस\n"
                f"🔗 *दस्तावेज़ सत्यापित करें:* https://jansetu.gov.in/roadmap\n\n"
                f"_यह एक स्वचालित आधिकारिक सरकारी अलर्ट है।_"
            )
        else:
            msg = (
                f"🏛️ *JanSetu™ Statutory Alert*\n\n"
                f"Namaste! The next milestone in your roadmap *{payload.journey_title}* is ready for submission:\n"
                f"👉 *{payload.step_title}*\n\n"
                f"⏰ *Statutory Turnaround SLA:* 3–5 Business Days\n"
                f"🔗 *Review Verified Steps:* https://jansetu.gov.in/roadmap\n\n"
                f"_Issued in public interest by National e-Governance Division (NeGD)._"
            )
        gateway = "Meta WhatsApp Business API (NIC Gov Verified Green Badge)"
        sla = "Instant (<2 seconds)"
    else:
        template_id = "NIC_SMS_SLA_102"
        msg = f"GovTech Alert: Step '{payload.step_title}' in '{payload.journey_title}' is due for statutory verification. Visit jansetu.gov.in - CDAC"
        gateway = "C-DAC e-Pramaan National SMS Gateway"
        sla = "Immediate Carrier Delivery"

    return NotificationDispatchResponse(
        dispatch_id=dispatch_id,
        channel=payload.channel.upper(),
        recipient_mobile_masked=masked_phone,
        template_id=template_id,
        status="DELIVERED_TO_GATEWAY",
        rendered_message_text=msg,
        dispatched_at_iso=now_iso,
        gateway_reference=gateway,
        delivery_sla=sla,
    )
