"""Pydantic schemas for Visual Configurable Workflow Orchestrator (DAG Engine)."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WorkflowNodeRule(BaseModel):
    step_id: str = Field(..., description="Unique step identifier")
    step_number: int
    step_title: str
    department: str
    prerequisites: List[str] = Field(default_factory=list, description="IDs of prerequisite steps")
    is_optional: bool = Field(default=False, description="Whether this node is optional")
    conditional_rule: Optional[str] = Field(
        default=None,
        description="Dynamic condition: e.g. 'requires_fire_noc = premises_area > 500' or 'water_test = daily_orders > 20'"
    )
    statutory_sla_hours: int = Field(default=48, description="Statutory turnaround time in hours under Citizen Charter")


class WorkflowGraph(BaseModel):
    journey_id: str
    journey_name: str
    version: str = "v3.2-configurable"
    nodes: List[WorkflowNodeRule]
    last_updated_at: str
    last_updated_by: str = "SYSTEM_DEFAULT"


class WorkflowRuleUpdateRequest(BaseModel):
    journey_id: str = "msme-food-business"
    step_id: str
    prerequisites: List[str]
    is_optional: bool
    conditional_rule: Optional[str] = None
    statutory_sla_hours: int = 48
    updated_by: str = "OFFICER_ADMIN_DESK_01"
