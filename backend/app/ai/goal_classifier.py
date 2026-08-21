"""Zero-Shot Goal Classification and Statutory Journey Parameter Extraction Pipeline.

Translates unstructured natural language citizen goals into clean statutory parameters
and deterministically loads matching journey seed templates from Track 2.
"""

from __future__ import annotations
import re
from typing import Dict, Any
from app.schemas.ai import (
    GoalType,
    GoalClassificationRequest,
    GoalClassificationResponse,
)
from app.data.blueprints import MASTER_BLUEPRINTS, get_validated_blueprint
from app.ai.gemini_client import gemini_client

SYSTEM_PROMPT_GOAL_CLASSIFIER = """You are a senior statutory GovTech intent classification architect for India's National Public Administration portal (JanSetu™ / जनसेतु).
Your task is to analyze an unstructured citizen life-event goal and extract clean structured parameters.

You must return:
1. goal_type: One of [FOOD_BUSINESS, HIGHER_EDUCATION_LOAN, STUDY_ABROAD, TOURIST_GUIDE, STARTUP_SEED_FUNDING, PASSPORT_SEVA, MSME_REGISTRATION, OTHER]
2. target_state: Indian state jurisdiction (e.g. 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala', 'Tamil Nadu', 'Telangana') or 'National'.
3. scale_or_entity_type: Entity structure (e.g. 'Micro / Sole Proprietorship', 'Private Limited Company', 'Individual / Student', 'Partnership Firm').
4. extracted_parameters: JSON dictionary of fine-grained entities:
   - 'city': City name if mentioned (e.g. 'Bangalore', 'Mysore', 'Pune', 'Hyderabad', 'Mumbai')
   - 'sub_activity': Specific niche (e.g. 'Cloud Kitchen', 'BTech Loan', 'Degree Legalization', 'Tourist Facilitator')
   - 'estimated_budget_or_turnover': Financial scale if mentioned
5. confidence_score: Float between 0.0 and 1.0 indicating extraction confidence.
6. initial_guidance: A concise 1-2 sentence actionable next step for the citizen.

You must NEVER decide procedural eligibility or grant exemptions; your job is strictly intent classification and parameter extraction.
"""


def _map_goal_type_to_journey_id(goal_type: GoalType, state: str) -> str:
    """Map extracted goal type and attributes to a Track 2 journey blueprint ID."""
    mapping = {
        GoalType.FOOD_BUSINESS: "food-business-license",
        GoalType.MSME_REGISTRATION: "food-business-license",
        GoalType.HIGHER_EDUCATION_LOAN: "pm-vidyalaxmi-loan",
        GoalType.STUDY_ABROAD: "study-abroad-global",
        GoalType.PASSPORT_SEVA: "study-abroad-global",
        GoalType.TOURIST_GUIDE: "certified-tourist-guide",
        GoalType.STARTUP_SEED_FUNDING: "startup-seed-funding",
    }
    return mapping.get(goal_type, "food-business-license")


def _heuristic_classify_goal(goal_text: str) -> GoalClassificationResponse:
    """Deterministic, zero-latency rule-based classifier when running offline or in tests."""
    text_lower = goal_text.lower()

    # 1. State / City detection
    state = "National"
    city = None
    if any(k in text_lower for k in ["bangalore", "bengaluru", "mysore", "karnataka"]):
        state = "Karnataka"
        city = "Bangalore" if ("bangalore" in text_lower or "bengaluru" in text_lower) else "Mysore"
    elif any(k in text_lower for k in ["mumbai", "pune", "maharashtra"]):
        state = "Maharashtra"
        city = "Mumbai" if "mumbai" in text_lower else "Pune"
    elif any(k in text_lower for k in ["hyderabad", "telangana"]):
        state = "Telangana"
        city = "Hyderabad"
    elif any(k in text_lower for k in ["delhi", "ncr"]):
        state = "Delhi"
        city = "New Delhi"
    elif any(k in text_lower for k in ["kerala", "kochi", "trivandrum"]):
        state = "Kerala"
        city = "Kochi" if "kochi" in text_lower else "Kerala"

    # 2. Goal Type & Scale detection
    if any(k in text_lower for k in ["food", "kitchen", "cloud kitchen", "cafe", "restaurant", "fssai", "bakery", "catering"]):
        goal_type = GoalType.FOOD_BUSINESS
        scale = "Micro / Sole Proprietorship"
        journey_id = "food-business-license"
        sub_activity = "Cloud Kitchen / Food Establishment"
        initial_guidance = "Start by verifying your Proprietor identity and registering for zero-cost Udyam MSME, followed by FSSAI FoSCoS registration."
    elif any(k in text_lower for k in ["education loan", "vidyalakshmi", "vidyalaxmi", "btech", "college fee", "student loan", "higher education"]):
        goal_type = GoalType.HIGHER_EDUCATION_LOAN
        scale = "Individual / Student"
        journey_id = "pm-vidyalaxmi-loan"
        sub_activity = "Higher Education Technical Loan"
        initial_guidance = "Begin by verifying your DigiLocker marksheets and obtaining a Tahsildar Family Income Certificate to unlock 100% CSIS interest subsidy."
    elif any(k in text_lower for k in ["study abroad", "apostille", "foreign university", "germany", "usa", "uk", "visa", "remittance", "lrs"]):
        goal_type = GoalType.STUDY_ABROAD
        scale = "Individual / Student"
        journey_id = "study-abroad-global"
        sub_activity = "International Higher Education Clearance"
        initial_guidance = "Authenticate your university degree via State HRD / eSanad, obtain MEA Hague Apostille, and execute RBI Form A2 for outward remittance."
    elif any(k in text_lower for k in ["tourist", "guide", "iitf", "tourism", "travel facilitator", "monument"]):
        goal_type = GoalType.TOURIST_GUIDE
        scale = "Individual Professional"
        journey_id = "certified-tourist-guide"
        sub_activity = "Incredible India Tourist Facilitator"
        initial_guidance = "Enroll in the Ministry of Tourism online IITF 7-module course, obtain a clean police clearance certificate, and receive your official digital badge."
    elif any(k in text_lower for k in ["startup", "seed fund", "sisfs", "dpiit", "incorporate", "company", "pvt ltd", "funding"]):
        goal_type = GoalType.STARTUP_SEED_FUNDING
        scale = "Private Limited Company"
        journey_id = "startup-seed-funding"
        sub_activity = "Early Stage Tech / Product Startup"
        initial_guidance = "Incorporate your company seamlessly via MCA SPICe+, apply for DPIIT Startup Recognition, and file for up to ₹50 Lakhs in SISFS seed grant."
    elif any(k in text_lower for k in ["passport", "tatkaal", "pcc", "police clearance"]):
        goal_type = GoalType.PASSPORT_SEVA
        scale = "Individual Citizen"
        journey_id = "study-abroad-global"
        sub_activity = "Passport Seva & Verification"
        initial_guidance = "Prepare identity proofs (Aadhaar, PAN) and book your PSK appointment for verified digital processing."
    else:
        goal_type = GoalType.FOOD_BUSINESS
        scale = "Micro / Sole Proprietorship"
        journey_id = "food-business-license"
        sub_activity = "Small Enterprise Commercial Registration"
        initial_guidance = "Initiate your statutory onboarding by completing foundational identity and business licensing milestones."

    blueprint = MASTER_BLUEPRINTS.get(journey_id, MASTER_BLUEPRINTS["food-business-license"])
    title = blueprint["title"]

    return GoalClassificationResponse(
        goal_type=goal_type,
        target_state=state,
        scale_or_entity_type=scale,
        extracted_parameters={
            "city": city,
            "sub_activity": sub_activity,
            "detected_keywords": [k for k in re.findall(r"\w+", text_lower) if len(k) > 3][:6],
        },
        confidence_score=0.94,
        raw_goal=goal_text,
        matched_journey_id=journey_id,
        matched_journey_title=title,
        initial_guidance=initial_guidance,
    )


def classify_goal(request: GoalClassificationRequest) -> GoalClassificationResponse:
    """Execute zero-shot goal classification with live Gemini Pro or robust heuristic fallback."""
    raw_goal = request.goal.strip()

    if gemini_client.is_live:
        prompt = f"Citizen Goal Prompt: \"{raw_goal}\"\nTarget Language: {request.preferred_language or 'en'}"
        live_result = gemini_client.generate_structured(
            prompt=prompt,
            system_instruction=SYSTEM_PROMPT_GOAL_CLASSIFIER,
            response_model=GoalClassificationResponse,
            temperature=0.1
        )
        if live_result:
            # Ensure matched journey ID is bound to a valid Track 2 blueprint
            journey_id = _map_goal_type_to_journey_id(live_result.goal_type, live_result.target_state)
            blueprint = MASTER_BLUEPRINTS.get(journey_id, MASTER_BLUEPRINTS["food-business-license"])
            live_result.matched_journey_id = journey_id
            live_result.matched_journey_title = blueprint["title"]
            live_result.raw_goal = raw_goal
            return live_result

    # Fallback execution
    return _heuristic_classify_goal(raw_goal)
