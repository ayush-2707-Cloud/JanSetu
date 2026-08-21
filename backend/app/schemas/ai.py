from __future__ import annotations
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class GoalType(str, Enum):
    """Recognized statutory life-event goal classifications."""
    FOOD_BUSINESS = "FOOD_BUSINESS"
    HIGHER_EDUCATION_LOAN = "HIGHER_EDUCATION_LOAN"
    STUDY_ABROAD = "STUDY_ABROAD"
    TOURIST_GUIDE = "TOURIST_GUIDE"
    STARTUP_SEED_FUNDING = "STARTUP_SEED_FUNDING"
    PASSPORT_SEVA = "PASSPORT_SEVA"
    MSME_REGISTRATION = "MSME_REGISTRATION"
    OTHER = "OTHER"


class GoalClassificationRequest(BaseModel):
    """Natural language citizen goal input."""
    goal: str = Field(
        ...,
        min_length=3,
        description="Unstructured citizen goal (e.g. 'I want to open a cloud kitchen in Bangalore')",
        examples=["I want to open a cloud kitchen in Bangalore"]
    )
    preferred_language: Optional[str] = Field("en", description="Preferred output language ('en', 'hi', 'kn')")


class GoalClassificationResponse(BaseModel):
    """Structured extraction and deterministic journey seed mapping."""
    goal_type: GoalType = Field(..., description="Classified goal domain vertical")
    target_state: str = Field("National", description="Extracted territorial jurisdiction / state")
    scale_or_entity_type: str = Field(
        "Micro / Sole Proprietorship",
        description="Extracted commercial or legal entity scale"
    )
    extracted_parameters: Dict[str, Any] = Field(
        default_factory=dict,
        description="Fine-grained extracted variables (city, turnover, budget, qualification, etc.)"
    )
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Model classification confidence")
    raw_goal: str = Field(..., description="Original citizen prompt")
    matched_journey_id: str = Field(..., description="Deterministic Track 2 journey blueprint ID")
    matched_journey_title: str = Field(..., description="Title of the mapped statutory roadmap")
    initial_guidance: str = Field(..., description="Immediate introductory action advice for citizen")


class CitationItem(BaseModel):
    """Statutory manual citation details."""
    department: str = Field(..., description="Official government department / ministry name")
    document_title: str = Field(..., description="Official title of the manual, circular or regulation")
    section: str = Field(..., description="Specific rule number, section or paragraph code")
    portal_url: str = Field(..., description="Verified official government portal URL")
    excerpt: str = Field(..., description="Relevant statutory text passage snippet")


class RAGQueryRequest(BaseModel):
    """Citizen contextual query on an active milestone step."""
    query: str = Field(..., min_length=2, description="Citizen's question regarding requirements, fees, timelines, or procedures")
    step_id: Optional[str] = Field(None, description="Active milestone step ID (e.g., 'fssai-license', 'scheme-discovery')")
    journey_id: Optional[str] = Field(None, description="Active statutory journey ID (e.g., 'food-business-license')")
    language: Optional[str] = Field("en", description="Target language ('en', 'hi', 'kn')")


class RAGQueryResponse(BaseModel):
    """Grounded AI answer strictly cited with official government sources."""
    answer: str = Field(..., description="Grounded natural language explanation")
    citations: List[CitationItem] = Field(default_factory=list, description="Top-3 official text citations")
    is_fallback: bool = Field(False, description="True if query fell outside official manuals and triggered zero-hallucination guardrail")
    department_source: str = Field(..., description="Primary governing body")
    verified_portal_url: str = Field(..., description="Official portal for citizen execution")
    query_language: str = Field("en", description="Response language")


class MultilingualGuidanceRequest(BaseModel):
    """Request for localized step breakdown."""
    step_id: str = Field(..., description="Target step ID")
    journey_id: Optional[str] = Field(None, description="Journey ID context")
    language: str = Field("hi", description="Requested language ('en', 'hi', 'kn')")


class MultilingualGuidanceResponse(BaseModel):
    """Localized plain-language explanation and checklist."""
    step_id: str
    language: str
    localized_title: str
    plain_language_summary: str
    actionable_checklist: List[str]
    common_pitfalls_to_avoid: List[str]
    official_portal_url: str


class PolicyAlertParseRequest(BaseModel):
    """Raw government gazette notice or circular text."""
    raw_circular_text: str = Field(..., min_length=10, description="Raw government gazette, order or circular text")
    active_journey_id: Optional[str] = Field(None, description="Active user journey context for impact assessment")
    issuing_authority: Optional[str] = Field(None, description="Known department or issuing body")


class ParsedPolicyAlert(BaseModel):
    """Structured extraction from raw gazette/circular text."""
    alert_title: str = Field(..., description="Concise human-readable title of the notice")
    issuing_authority: str = Field(..., description="Government department or ministry")
    what_changed: str = Field(..., description="(1) Exact statutory or procedural change")
    why_it_matters_to_journey: str = Field(..., description="(2) Concrete relevance and impact on active citizen journey")
    action_or_deadline_required: str = Field(..., description="(3) Specific citizen action required or statutory deadline")
    deadline_date: Optional[str] = Field(None, description="Extracted ISO or natural date deadline if present")
    severity: str = Field("WARNING", description="Severity level: 'CRITICAL', 'WARNING', 'INFO'")
    affected_domains: List[str] = Field(default_factory=list, description="Domains impacted (e.g. ['FOOD_BUSINESS', 'MSME'])")
    source_reference: str = Field(..., description="Circular number / notification gazette ID")


class KnowledgeSourceItem(BaseModel):
    """Metadata of an indexed official government source document."""
    doc_id: str
    title: str
    department: str
    jurisdiction: str
    official_portal_url: str
    section_count: int
    source_reference: str
    domain: str
