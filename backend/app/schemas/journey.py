from __future__ import annotations
from enum import Enum
from typing import List, Optional, Dict, Any, Set
from pydantic import BaseModel, Field, field_validator, model_validator


class ActionType(str, Enum):
    """Supported citizen milestone execution action types."""
    MOCK_VERIFY = "MOCK_VERIFY"
    PORTAL_REDIRECT = "PORTAL_REDIRECT"
    FORM_FILL = "FORM_FILL"


class StepStatus(str, Enum):
    """Deterministic step and substep execution states."""
    COMPLETED = "COMPLETED"
    IN_PROGRESS = "IN_PROGRESS"
    LOCKED = "LOCKED"


# ─────────────────────────────────────────────────────────────────────────────
# Hierarchical Workflow State Machine Models
# ─────────────────────────────────────────────────────────────────────────────

class DocumentRequirement(BaseModel):
    """Specific statutory document required for substep/node clearance."""
    document_id: Optional[str] = Field(None, description="Unique slug for document requirement")
    name: Optional[str] = Field(None, description="Document name / title")
    title: Optional[str] = Field(None, description="Official title of the document or certificate")
    description: Optional[str] = Field(None, description="Detailed specifications, e.g. format, size, issuing body")
    is_mandatory: bool = Field(True, description="True if mandatory for clearance")
    status: Optional[str] = Field("PENDING_UPLOAD", description="VERIFIED_VIA_DIGILOCKER, PENDING_UPLOAD, etc.")
    document_template_url: Optional[str] = Field(None, description="Downloadable official legal form/template link")
    issuing_authority: Optional[str] = Field(None, description="Issuing agency or statutory department")
    verification_method: Optional[str] = Field("DIGILOCKER", description="DIGILOCKER, APISETU, MANUAL_UPLOAD, or SELF_DECLARATION")

    @model_validator(mode="before")
    @classmethod
    def unify_name_and_title(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "name" in data and "title" not in data:
                data["title"] = data["name"]
            elif "title" in data and "name" not in data:
                data["name"] = data["title"]
            if "document_id" not in data and "name" in data:
                data["document_id"] = data["name"].lower().replace(" ", "-")
        return data


class SubStep(BaseModel):
    """Granular actionable milestone substep within a workflow Node."""
    substep_id: str = Field(..., description="Unique slug for this substep (or sub_step_id)")
    substep_number: Optional[int] = Field(1, ge=1, description="1-indexed ordinal position within parent node")
    title: str = Field(..., min_length=3, description="Concise human-readable title of the task")
    description: Optional[str] = Field(None, description="Detailed instructions, legal provisions, and operational guide")
    guidance: Optional[str] = Field(None, description="Actionable micro-guidance and instructions for the user")
    is_mandatory: bool = Field(True, description="Whether completing this substep is required to clear parent node")
    status: StepStatus = Field(StepStatus.LOCKED, description="LOCKED, IN_PROGRESS, or COMPLETED")
    official_portal_url: Optional[str] = Field(None, description="Verified .gov.in or official portal URL")
    legal_template_url: Optional[str] = Field(None, description="Statutory draft/deed/application template link")
    statutory_form_code: Optional[str] = Field(None, description="Official form reference (e.g. Form REG-01, Form A)")
    required_documents: List[DocumentRequirement] = Field(default_factory=list, description="Documents required for this substep")
    estimated_duration: Optional[str] = Field("1 Day", description="SLA turnaround time")
    completed_at: Optional[str] = Field(None, description="ISO-8601 timestamp of completion")

    @model_validator(mode="before")
    @classmethod
    def handle_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "sub_step_id" in data and "substep_id" not in data:
                data["substep_id"] = data["sub_step_id"]
            if "guidance" in data and not data.get("description"):
                data["description"] = data["guidance"]
            elif "description" in data and not data.get("guidance"):
                data["guidance"] = data["description"]
        return data

    @field_validator("official_portal_url", "legal_template_url")
    @classmethod
    def validate_urls(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not (v.startswith("http://") or v.startswith("https://") or v.startswith("/")):
            raise ValueError(f"URL must start with http://, https://, or /: {v}")
        return v


class Node(BaseModel):
    """High-level milestone node in a Journey DAG containing nested SubSteps."""
    node_id: str = Field(..., description="Unique identifier for the node (matches step_id)")
    step_number: Optional[int] = Field(1, ge=1, description="1-indexed ordinal position in journey DAG")
    title: str = Field(..., min_length=3, description="Descriptive milestone title")
    description: Optional[str] = Field("", description="Statutory overview of this phase")
    department: Optional[str] = Field(None, description="Coordinating government authority (alias for governing_department)")
    governing_department: Optional[str] = Field(None, description="Coordinating government authority")
    prerequisites: List[str] = Field(default_factory=list, description="Node IDs that must be completed before unlocking")
    action_type: ActionType = Field(ActionType.PORTAL_REDIRECT, description="Operational mechanism")
    official_portal_url: Optional[str] = Field("https://india.gov.in", description="Verified primary government portal URL")
    status: StepStatus = Field(StepStatus.LOCKED, description="LOCKED, IN_PROGRESS, or COMPLETED")
    is_unlocked: bool = Field(False, description="True if all prerequisites are fulfilled")
    missing_prerequisites: List[str] = Field(default_factory=list, description="Node IDs currently blocking this node")
    substeps: List[SubStep] = Field(default_factory=list, description="Ordered list of nested substeps")
    required_documents: List[DocumentRequirement] = Field(default_factory=list, description="Documents required for this node")
    progress_percentage: int = Field(0, ge=0, le=100, description="Calculated % based on completed mandatory substeps")
    statutory_fee: Optional[str] = Field("₹0 (Statutory free)", description="Statutory fee")
    legal_references: List[str] = Field(default_factory=list, description="Statutory acts and section codes")
    estimated_duration: Optional[str] = Field("1-3 Business Days", description="Standard SLA duration")
    completed_at: Optional[str] = Field(None, description="ISO-8601 completion timestamp")

    @model_validator(mode="before")
    @classmethod
    def handle_node_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "step_id" in data and "node_id" not in data:
                data["node_id"] = data["step_id"]
            if "sub_steps" in data and "substeps" not in data:
                data["substeps"] = data["sub_steps"]
            if "department" in data and not data.get("governing_department"):
                data["governing_department"] = data["department"]
            elif "governing_department" in data and not data.get("department"):
                data["department"] = data["governing_department"]
        return data


class Journey(BaseModel):
    """Complete Hierarchical Life-Event Journey with nested Nodes and SubSteps."""
    journey_id: str = Field(..., min_length=3, description="Unique slug identifier for the journey")
    title: str = Field(..., min_length=3, description="High-level title for the life event")
    goal_title: Optional[str] = Field(None, description="Alias for title")
    category: str = Field(..., description="Domain vertical")
    department: Optional[str] = Field("Government of India / State Authority", description="Primary governing body")
    jurisdiction: Optional[str] = Field("Union / Central Government of India", description="Statutory territorial/governmental scope")
    state: Optional[str] = Field("National", description="Target state or 'National'")
    description: Optional[str] = Field("", description="Executive summary of the statutory journey")
    estimated_duration: Optional[str] = Field("2-4 Weeks", description="Overall SLA range")
    overall_progress_percentage: int = Field(0, ge=0, le=100, description="Overall progress percentage")
    overall_progress_percent: Optional[int] = Field(None, ge=0, le=100, description="Alias for overall_progress_percentage")
    completed_nodes_count: int = Field(0, ge=0, description="Number of completed nodes")
    total_nodes_count: int = Field(0, ge=0, description="Total number of nodes")
    current_active_node_id: Optional[str] = Field(None, description="Currently active node ID")
    nodes: List[Node] = Field(..., min_length=1, description="Ordered collection of journey nodes")

    @model_validator(mode="before")
    @classmethod
    def handle_journey_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "goal_title" in data and "title" not in data:
                data["title"] = data["goal_title"]
            elif "title" in data and "goal_title" not in data:
                data["goal_title"] = data["title"]
            if "overall_progress_percent" in data and "overall_progress_percentage" not in data:
                data["overall_progress_percentage"] = data["overall_progress_percent"]
            elif "overall_progress_percentage" in data and "overall_progress_percent" not in data:
                data["overall_progress_percent"] = data["overall_progress_percentage"]
        return data

    @field_validator("nodes")
    @classmethod
    def validate_dag(cls, nodes: List[Node]) -> List[Node]:
        """Validate DAG: no self-prerequisites and valid prior references."""
        seen_ids: Set[str] = set()
        for node in nodes:
            if node.node_id in seen_ids:
                raise ValueError(f"Duplicate node_id detected: {node.node_id}")
            if node.node_id in node.prerequisites:
                raise ValueError(f"Node {node.node_id} cannot list itself as a prerequisite.")
            for prereq in node.prerequisites:
                if prereq not in seen_ids:
                    raise ValueError(f"Node '{node.node_id}' references prerequisite '{prereq}' which is not declared prior.")
            seen_ids.add(node.node_id)
        return nodes


# ─────────────────────────────────────────────────────────────────────────────
# Substep Completion Request & Response Schemas
# ─────────────────────────────────────────────────────────────────────────────

class SubStepCompletionRequest(BaseModel):
    """Payload to mark a specific SubStep as COMPLETED."""
    journey_id: str = Field(..., description="Unique journey identifier")
    node_id: Optional[str] = Field(None, description="Parent node identifier containing the substep (or step_id)")
    step_id: Optional[str] = Field(None, description="Alias for node_id")
    substep_id: Optional[str] = Field(None, description="Target substep identifier to complete (or sub_step_id)")
    sub_step_id: Optional[str] = Field(None, description="Alias for substep_id")
    completed_substep_ids: Optional[List[str]] = Field(
        default_factory=list,
        description="List of all previously completed substep IDs (for stateless evaluation)"
    )

    @property
    def target_node_id(self) -> str:
        target = self.node_id or self.step_id
        if not target:
            raise ValueError("Either 'node_id' or 'step_id' must be provided.")
        return target

    @property
    def target_substep_id(self) -> str:
        target = self.substep_id or self.sub_step_id
        if not target:
            raise ValueError("Either 'substep_id' or 'sub_step_id' must be provided.")
        return target


class SubStepCompletionResponse(BaseModel):
    """Result returned after completing a substep and recalculating workflow state."""
    success: bool = Field(..., description="True if substep was completed successfully")
    message: str = Field(..., description="Human-readable outcome description")
    journey_id: str = Field(..., description="Journey ID evaluated")
    completed_substep_id: str = Field(..., description="The substep ID marked COMPLETED")
    node_completed: bool = Field(..., description="True if parent node is now fully COMPLETED")
    node_progress_percentage: int = Field(..., ge=0, le=100, description="Updated parent node progress %")
    overall_progress_percentage: int = Field(..., ge=0, le=100, description="Updated journey overall progress %")
    unlocked_node_ids: List[str] = Field(default_factory=list, description="List of newly unlocked downstream node IDs")
    journey: Journey = Field(..., description="Full updated hierarchical journey runtime state")


# ─────────────────────────────────────────────────────────────────────────────
# Legal Template Models (GET /api/legal/templates/{template_id})
# ─────────────────────────────────────────────────────────────────────────────

class LegalTemplateSummary(BaseModel):
    """Summary item for legal templates catalog."""
    template_id: str = Field(..., description="Unique slug for the legal template")
    title: str = Field(..., description="Official title of the legal agreement/deed")
    category: str = Field(..., description="Legal domain (e.g. MSME Law, Corporate, Real Estate, Civil Rights)")
    statutory_act: str = Field(..., description="Governing statute or section reference")
    estamp_value: str = Field(..., description="Statutory stamp duty recommendation")
    description: str = Field(..., description="Short explanation of statutory purpose")
    download_url: Optional[str] = Field(None, description="Direct download link")


class LegalTemplateResponse(BaseModel):
    """Full detail of a standardized boilerplate legal agreement with fillable fields."""
    template_id: str
    title: str
    category: str
    statutory_act: str
    estamp_value: str
    description: str
    default_fields: Dict[str, str] = Field(default_factory=dict)
    clauses: List[str] = Field(default_factory=list)
    boilerplate_text: str
    statutory_citations: List[str] = Field(default_factory=list)
    download_formats: List[str] = Field(default=["txt", "pdf", "docx"])


# ─────────────────────────────────────────────────────────────────────────────
# Backward Compatible Schemas (for existing endpoints)
# ─────────────────────────────────────────────────────────────────────────────

class NodeBlueprint(BaseModel):
    """Deterministic life-event step blueprint definition."""
    step_id: str = Field(..., description="Unique step identifier within the journey")
    step_number: int = Field(..., ge=1, description="1-indexed ordinal position in default sequence")
    title: str = Field(..., min_length=3, description="Descriptive human-readable title of the milestone")
    description: str = Field(..., description="Comprehensive explanation of the statutory requirement")
    governing_department: str = Field(..., description="Authority / Ministry responsible for this step")
    prerequisites: List[str] = Field(
        default_factory=list,
        description="Prior step_ids that MUST be COMPLETED before unlocking this step"
    )
    required_documents: List[str] = Field(
        default_factory=list,
        description="Mandatory documentation checklist for clearance"
    )
    action_type: ActionType = Field(
        ...,
        description="Operational mechanism to clear this node"
    )
    official_portal_url: str = Field(
        ...,
        description="Verified government/statutory portal link (.gov.in or official designated domain)"
    )
    estimated_duration: Optional[str] = Field("1-3 Business Days", description="Standard SLA turnaround")
    statutory_fee: Optional[str] = Field("₹0 (Statutory free)", description="Statutory fee required for filing")
    legal_references: Optional[List[str]] = Field(default_factory=list, description="Statutory acts and section codes")

    @field_validator("official_portal_url")
    @classmethod
    def validate_portal_url(cls, v: str) -> str:
        if not (v.startswith("http://") or v.startswith("https://") or v.startswith("/")):
            raise ValueError(f"official_portal_url must be a valid URL starting with http/https: {v}")
        return v


class JourneyBlueprint(BaseModel):
    """Complete statutory life-event journey roadmap blueprint."""
    journey_id: str = Field(..., min_length=3, description="Unique slug identifier for the journey")
    title: str = Field(..., min_length=3, description="High-level title for the life event")
    goal_title: Optional[str] = Field(None, description="Alias for goal title")
    category: str = Field(..., description="Domain vertical")
    jurisdiction: str = Field(..., description="Statutory territorial/governmental scope")
    state: Optional[str] = Field(None, description="Target state or 'National'")
    department: str = Field(..., description="Primary governing body coordinating the process")
    description: str = Field(..., description="Executive summary of the end-to-end statutory journey")
    estimated_duration: str = Field(..., description="Overall SLA range for total milestone completion")
    domain_id: Optional[str] = Field(None, description="Hierarchical life domain ID")
    subcategory_id: Optional[str] = Field(None, description="Contextual sub-division category ID")
    activity_id: Optional[str] = Field(None, description="Actionable specialized activity ID")
    nodes: List[NodeBlueprint] = Field(..., min_length=1, description="Ordered collection of journey step nodes")

    def model_post_init(self, __context: Any) -> None:
        if not self.goal_title:
            self.goal_title = self.title
        if not self.state:
            self.state = self.jurisdiction

    @field_validator("nodes")
    @classmethod
    def validate_sequential_integrity(cls, nodes: List[NodeBlueprint]) -> List[NodeBlueprint]:
        """Validate DAG: no self-prerequisites and all prerequisites refer to earlier valid step_ids."""
        seen_ids: Set[str] = set()
        for node in nodes:
            if node.step_id in seen_ids:
                raise ValueError(f"Duplicate step_id detected: {node.step_id}")
            if node.step_id in node.prerequisites:
                raise ValueError(f"Node {node.step_id} cannot list itself as a prerequisite.")
            for prereq in node.prerequisites:
                if prereq not in seen_ids:
                    raise ValueError(
                        f"Step '{node.step_id}' references prerequisite '{prereq}', "
                        f"which is not declared prior to this step."
                    )
            seen_ids.add(node.step_id)
        return nodes


class NodeRuntimeState(NodeBlueprint):
    """Node augmented with runtime user resolution and lock evaluations."""
    status: StepStatus = Field(StepStatus.LOCKED, description="Evaluated execution state")
    is_unlocked: bool = Field(False, description="True if all prerequisites are fulfilled")
    missing_prerequisites: List[str] = Field(
        default_factory=list,
        description="Step IDs currently blocking this milestone"
    )
    completed_at: Optional[str] = Field(None, description="ISO-8601 completion timestamp")


class JourneyRuntimeEvaluation(BaseModel):
    """Full journey evaluation response with dynamic unlocking & progress calculation."""
    journey_id: str
    title: str
    goal_title: Optional[str] = None
    category: str
    jurisdiction: str
    state: Optional[str] = None
    department: str
    description: str
    estimated_duration: str
    domain_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    activity_id: Optional[str] = None
    overall_progress_percentage: int = Field(0, ge=0, le=100)
    completed_steps_count: int = Field(0, ge=0)
    total_steps_count: int = Field(0, ge=0)
    current_active_step_id: Optional[str] = None
    nodes: List[NodeRuntimeState]

    def model_post_init(self, __context: Any) -> None:
        if not self.goal_title:
            self.goal_title = self.title
        if not self.state:
            self.state = self.jurisdiction


class StepCompletionRequest(BaseModel):
    """Payload to attempt step completion."""
    journey_id: Optional[str] = Field(
        None,
        description="Target journey ID (optional if supplied in URL path)"
    )
    completed_step_ids: List[str] = Field(
        default_factory=list,
        description="Existing verified step IDs already marked as completed"
    )
    step_id_to_complete: Optional[str] = Field(
        None,
        description="Target step ID attempting to be completed"
    )
    step_id: Optional[str] = Field(
        None,
        description="Alias for step_id_to_complete"
    )

    @property
    def target_step_id(self) -> str:
        res = self.step_id_to_complete or self.step_id
        if not res:
            raise ValueError("Either 'step_id_to_complete' or 'step_id' must be provided.")
        return res


class StepCompletionResponse(BaseModel):
    """Response returned upon resolving a step completion request."""
    success: bool
    message: str
    evaluated_journey: JourneyRuntimeEvaluation
