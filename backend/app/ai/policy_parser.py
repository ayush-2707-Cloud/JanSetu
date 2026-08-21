"""Gazette Policy Alert Parser & Impact Analysis Model.

Accepts raw government gazette notices, circulars, or statutory orders and extracts:
(1) What changed, (2) Why it matters to this active journey, and (3) What action or deadline is required.
"""

from __future__ import annotations
import re
from typing import Optional, List
from app.schemas.ai import (
    PolicyAlertParseRequest,
    ParsedPolicyAlert,
)
from app.ai.gemini_client import gemini_client

SYSTEM_PROMPT_POLICY_PARSER = """You are a senior statutory policy analyst for the Government of India legal registry.
Your task is to parse raw, complex government gazette notices, circulars, or notifications and extract 3 structured elements:

1. what_changed: Exact statutory, fee, or procedural rule modification.
2. why_it_matters_to_journey: Clear explanation of how this affects the active citizen journey and pending milestones.
3. action_or_deadline_required: Specific concrete compliance action and exact deadline date or timeline.

Also extract:
- alert_title: Short, high-impact headline (e.g., 'Mandatory Form D1 Annual Return Deadline: May 31')
- issuing_authority: Ministry / Regulator (e.g., 'FSSAI', 'RBI', 'Ministry of MSME', 'DPIIT')
- deadline_date: Extracted ISO date (YYYY-MM-DD) or natural date string if applicable.
- severity: One of ['CRITICAL', 'WARNING', 'INFO']
- affected_domains: List of domain tags (e.g., ['FOOD_BUSINESS', 'MSME'])
- source_reference: Gazette or order circular reference number.

Prohibit speculation: extract strictly based on the text provided.
"""


def _heuristic_parse_policy_alert(raw_text: str, active_journey_id: Optional[str] = None) -> ParsedPolicyAlert:
    """Deterministic parser for gazette notifications when running in offline/testing mode."""
    text_lower = raw_text.lower()

    # 1. Authority extraction
    authority = "Government of India Statutory Authority"
    if "fssai" in text_lower or "food safety" in text_lower:
        authority = "Food Safety and Standards Authority of India (FSSAI)"
    elif "rbi" in text_lower or "reserve bank" in text_lower:
        authority = "Reserve Bank of India (RBI)"
    elif "udyam" in text_lower or "msme" in text_lower:
        authority = "Ministry of Micro, Small and Medium Enterprises"
    elif "mea" in text_lower or "external affairs" in text_lower:
        authority = "Ministry of External Affairs (MEA)"
    elif "dpiit" in text_lower or "startup india" in text_lower:
        authority = "Department for Promotion of Industry and Internal Trade (DPIIT)"

    # 2. Extract circular / gazette reference number
    ref_match = re.search(r"(?:notification|order|circular|ref|no\.)\s*[:\.]?\s*([A-Za-z0-9\/\-\(\)\.]+)", raw_text, re.IGNORECASE)
    source_ref = ref_match.group(0) if ref_match else "Official Gazette Notification"

    # 3. Extract dates / deadlines
    date_match = re.search(r"\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}-\d{2}-\d{2})\b", raw_text, re.IGNORECASE)
    deadline_date = date_match.group(1) if date_match else None

    # 4. Domain & Structured Elements
    if "annual return" in text_lower or "form d1" in text_lower or "foscos" in text_lower:
        title = "Mandatory FoSCoS Annual Return (Form D1) Filing Mandate"
        what_changed = "Food business operators holding State or Central FSSAI licenses must submit Form D1 online via FoSCoS portal."
        why_it_matters = "Failure to submit by the statutory date incurs an automated daily penalty of ₹100 and may result in license suspension for your active food business."
        action_required = f"Login to FoSCoS portal (foscos.fssai.gov.in) and file Form D1 before deadline ({deadline_date or '31st May'})."
        severity = "CRITICAL"
        domains = ["FOOD_BUSINESS", "MSME"]
    elif "lrs" in text_lower or "tcs" in text_lower or "remittance" in text_lower:
        title = "Liberalised Remittance Scheme (LRS) Education TCS Revision"
        what_changed = "Tax Collected at Source (TCS) rate updated on outward remittances exceeding ₹7 Lakhs for overseas education."
        why_it_matters = "Affects tuition fee payments and living expense wire transfers to foreign universities in your study abroad journey."
        action_required = "Submit Form A2 along with education loan sanction letter under Section 80E to claim the concessional 0.5% TCS rate."
        severity = "WARNING"
        domains = ["STUDY_ABROAD", "HIGHER_EDUCATION_LOAN"]
    elif "udyam" in text_lower or "turnover" in text_lower:
        title = "Udyam MSME Composite Classification Re-verification Notice"
        what_changed = "Automated annual integration between Income Tax ITR, GST portal, and Udyam MSME classification database."
        why_it_matters = "Your enterprise enterprise tier (Micro/Small/Medium) will be recalculated based on latest filed ITR turnover."
        action_required = "Ensure annual ITR and GST returns are filed to avoid de-registration of Udyam MSME benefits."
        severity = "INFO"
        domains = ["MSME_REGISTRATION", "FOOD_BUSINESS", "STARTUP_SEED_FUNDING"]
    else:
        title = "Statutory Regulatory Amendment Notification"
        what_changed = f"Government rule update: {raw_text[:140]}..."
        why_it_matters = "This statutory notice applies to ongoing citizen license filings and compliance milestones."
        action_required = f"Review official gazette guidelines and ensure compliance before {deadline_date or 'statutory due date'}."
        severity = "WARNING"
        domains = ["GENERAL"]

    return ParsedPolicyAlert(
        alert_title=title,
        issuing_authority=authority,
        what_changed=what_changed,
        why_it_matters_to_journey=why_it_matters,
        action_or_deadline_required=action_required,
        deadline_date=deadline_date,
        severity=severity,
        affected_domains=domains,
        source_reference=source_ref,
    )


def parse_policy_alert(request: PolicyAlertParseRequest) -> ParsedPolicyAlert:
    """Parse raw government circular into 3 structured statutory impact elements."""
    raw_text = request.raw_circular_text.strip()
    active_journey_id = request.active_journey_id

    # 1. Live Gemini structured generation
    if gemini_client.is_live:
        prompt = (
            f"RAW GAZETTE / CIRCULAR TEXT:\n\"{raw_text}\"\n\n"
            f"ACTIVE JOURNEY CONTEXT: {active_journey_id or 'General Statutory Journey'}"
        )
        live_res = gemini_client.generate_structured(
            prompt=prompt,
            system_instruction=SYSTEM_PROMPT_POLICY_PARSER,
            response_model=ParsedPolicyAlert,
            temperature=0.1
        )
        if live_res:
            return live_res

    # 2. Fallback heuristic parser
    return _heuristic_parse_policy_alert(raw_text, active_journey_id)
