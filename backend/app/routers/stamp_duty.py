"""FastAPI Router for Statutory Stamp Duty & e-Stamping Calculations.

Calculates state-specific non-judicial stamp duty, registration surcharges,
and provides verified statutory act citations and SHCIL/Kaveri portal links.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status
from app.data.stamp_duty_rules import STATE_STAMP_SCHEDULES

router = APIRouter(
    prefix="/api/legal/stamp-duty",
    tags=["Legal & Statutory e-Stamping"]
)

class StampDutyCalculationRequest(BaseModel):
    state_code: str = Field(default="KA", description="State code: 'KA', 'MH', 'DL', etc.")
    article_type: str = Field(default="RENT_AGREEMENT_COMMERCIAL", description="Article type key")
    monthly_rent_inr: Optional[float] = Field(default=25000.0, description="Monthly rent in INR")
    lease_term_months: Optional[int] = Field(default=11, description="Lease duration in months")
    refundable_deposit_inr: Optional[float] = Field(default=100000.0, description="Security deposit in INR")
    capital_contribution_inr: Optional[float] = Field(default=100000.0, description="Partnership capital in INR")

class StampDutyCalculationResponse(BaseModel):
    state_code: str
    state_name: str
    governing_act: str
    article_title: str
    calculated_stamp_duty_inr: float
    registration_fee_inr: float
    total_statutory_cost_inr: float
    official_estamp_portal: str
    estamp_provider: str
    calculation_breakdown: str
    statutory_warning: str

@router.get("/schedules")
async def get_all_schedules():
    """Retrieve full catalog of supported state stamp duty schedules."""
    return STATE_STAMP_SCHEDULES

@router.post("/calculate", response_model=StampDutyCalculationResponse)
async def calculate_stamp_duty(payload: StampDutyCalculationRequest):
    """Compute exact statutory stamp duty and registration fees for a transaction."""
    state_key = payload.state_code.upper()
    if state_key not in STATE_STAMP_SCHEDULES:
        state_key = "KA"  # Default fallback to Karnataka

    sched = STATE_STAMP_SCHEDULES[state_key]
    art_key = payload.article_type.upper()
    
    if art_key not in sched["articles"]:
        art_key = list(sched["articles"].keys())[0]

    article = sched["articles"][art_key]
    stamp_duty = float(sched["minimum_stamp_duty_inr"])
    reg_fee = float(article.get("registration_surcharge_inr", 0))
    breakdown = ""

    rate_type = article.get("rate_type")

    if rate_type == "FLAT":
        stamp_duty = float(article.get("flat_inr", 100))
        breakdown = f"Statutory fixed non-judicial e-Stamp: ₹{stamp_duty:,.2f}"

    elif rate_type == "PERCENT_OR_FLAT":
        total_rent = (payload.monthly_rent_inr or 0) * (payload.lease_term_months or 11)
        calc_pct = (total_rent + (payload.refundable_deposit_inr or 0) * 0.1) * (article.get("percentage_of_annual_rent", 0.5) / 100)
        flat_val = float(article.get("flat_inr", 200))
        stamp_duty = max(flat_val, calc_pct)
        breakdown = f"Calculated based on 0.5% of annual value (₹{calc_pct:,.2f}) vs flat threshold (₹{flat_val:,.2f}) -> ₹{stamp_duty:,.2f}"

    elif rate_type == "PERCENTAGE":
        total_rent = (payload.monthly_rent_inr or 0) * (payload.lease_term_months or 11)
        pct = article.get("percentage_of_annual_rent", 1.0) / 100
        stamp_duty = max(float(sched["minimum_stamp_duty_inr"]), total_rent * pct)
        breakdown = f"{article.get('percentage_of_annual_rent')}% of aggregate consideration ₹{total_rent:,.2f} = ₹{stamp_duty:,.2f}"

    elif rate_type == "SLAB_CAPITAL":
        cap = payload.capital_contribution_inr or 50000
        for slab in article.get("slabs", []):
            if cap <= slab["max_capital"]:
                stamp_duty = float(slab["stamp_duty_inr"])
                breakdown = f"Capital contribution ₹{cap:,.2f} falls in slab <= ₹{slab['max_capital']} -> Stamp Duty: ₹{stamp_duty:,.2f}"
                break

    total = stamp_duty + reg_fee

    return StampDutyCalculationResponse(
        state_code=state_key,
        state_name=sched["state_name"],
        governing_act=sched["governing_act"],
        article_title=article["title"],
        calculated_stamp_duty_inr=round(stamp_duty, 2),
        registration_fee_inr=round(reg_fee, 2),
        total_statutory_cost_inr=round(total, 2),
        official_estamp_portal=sched["official_estamp_portal"],
        estamp_provider=sched["estamp_provider"],
        calculation_breakdown=breakdown,
        statutory_warning="Unstamped or insufficiently stamped documents are inadmissible as evidence under Section 35 of the Indian Stamp Act.",
    )
