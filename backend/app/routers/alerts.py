"""
Regulatory Alert Dispatcher Router.
Dispatches statutory policy change notices, gazette circulars, and fee updates.
"""

from typing import Optional, List
from fastapi import APIRouter, Query
from app.schemas.alert import RegulatoryAlert, AlertListResponse
from app.data.alerts_data import REGULATORY_ALERTS_DATA

router = APIRouter(tags=["Regulatory Alerts & Policy Dispatcher"])


@router.get("/alerts", response_model=AlertListResponse)
@router.get("/api/alerts", response_model=AlertListResponse)
def get_regulatory_alerts(
    domain: Optional[str] = Query(None, description="Active journey domain/category (e.g., Food Business, Higher Education, Tourism)"),
    jurisdiction: Optional[str] = Query(None, description="Target jurisdiction or state (e.g., Karnataka, National, Delhi)")
):
    """
    Retrieve relevant statutory regulatory change notices, gazette orders,
    and compliance alerts filtered by domain and jurisdiction.
    """
    alerts = [RegulatoryAlert(**a) for a in REGULATORY_ALERTS_DATA]

    if domain:
        d_lower = domain.lower()
        alerts = [
            a for a in alerts
            if d_lower in a.domain.lower() or d_lower in a.title.lower() or d_lower in a.summary.lower()
        ]

    if jurisdiction:
        j_lower = jurisdiction.lower()
        alerts = [
            a for a in alerts
            if (
                j_lower in a.jurisdiction.lower()
                or "national" in a.jurisdiction.lower()
                or "multi-state" in a.jurisdiction.lower()
                or "union" in a.jurisdiction.lower()
            )
        ]

    return AlertListResponse(
        domain=domain,
        jurisdiction=jurisdiction,
        total_alerts=len(alerts),
        alerts=alerts
    )
