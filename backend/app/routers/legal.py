"""
Standardized Legal Template Provider Router.
Provides GET /api/legal/templates and GET /api/legal/templates/{template_id}.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.journey import LegalTemplateResponse, LegalTemplateSummary
from app.data.legal_templates import (
    get_legal_template,
    list_legal_template_summaries,
    MASTER_LEGAL_TEMPLATES,
)

router = APIRouter(tags=["Legal Templates & Agreements"])


@router.get("/api/legal/templates", response_model=List[LegalTemplateSummary])
@router.get("/legal/templates", response_model=List[LegalTemplateSummary])
def get_all_legal_templates() -> List[LegalTemplateSummary]:
    """Retrieve catalog of all standardized boilerplate legal templates."""
    return list_legal_template_summaries()


@router.get("/api/legal/templates/{template_id}", response_model=LegalTemplateResponse)
@router.get("/legal/templates/{template_id}", response_model=LegalTemplateResponse)
def get_legal_template_by_id(template_id: str) -> LegalTemplateResponse:
    """Retrieve detailed statutory boilerplate text, fillable fields, and legal acts for a specific template."""
    try:
        return get_legal_template(template_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Legal template '{template_id}' not found. Available: {list(MASTER_LEGAL_TEMPLATES.keys())}"
        )
