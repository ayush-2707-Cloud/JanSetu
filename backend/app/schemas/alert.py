"""
Pydantic Schemas for Regulatory Alert Dispatcher.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class AlertSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    IMPORTANT = "IMPORTANT"
    ADVISORY = "ADVISORY"


class RegulatoryAlert(BaseModel):
    """Statutory policy change, gazette notice, or regulatory advisory."""
    alert_id: str
    title: str
    domain: str
    jurisdiction: str
    severity: AlertSeverity
    effective_date: str
    summary: str
    official_gazette_ref: str
    source_url: str
    action_required: str


class AlertListResponse(BaseModel):
    """Response containing matching regulatory alerts."""
    domain: Optional[str] = None
    jurisdiction: Optional[str] = None
    total_alerts: int
    alerts: List[RegulatoryAlert]
