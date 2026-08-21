"""Grounded Step Q&A Engine via Retrieval-Augmented Generation (RAG).

Retrieves top-3 verified official government source passages from ChromaDB,
mandates official department/section citations, and enforces strict zero-hallucination guardrails.
"""

from __future__ import annotations
from typing import Optional, List, Dict, Any
from app.schemas.ai import (
    RAGQueryRequest,
    RAGQueryResponse,
    CitationItem,
)
from app.ai.vector_store import vector_store
from app.ai.gemini_client import gemini_client
from app.data.blueprints import MASTER_BLUEPRINTS

SYSTEM_PROMPT_GROUNDED_RAG = """You are the official JanSetu™ (जनसेतु) Statutory Legal Assistant for citizens in India.
Your mission is to provide accurate, concise, grounded answers to citizen inquiries about government procedures, fees, timelines, and documentation.

STRICT OPERATIONAL RULES:
1. STRICT ADHERENCE: Answer the user query using ONLY the provided official statutory context passages. Do not invent, speculate, extrapolate, or offer legal loopholes.
2. MANDATORY SOURCE CITATIONS: In your explanation, explicitly cite the governing department, manual/section title, and official portal URL.
3. CONCISE FORMAT: Provide the answer in clear, numbered or bulleted points, followed by a 'Statutory Reference' block.
4. ZERO-HALLUCINATION GUARDRAIL: If the provided official context does NOT contain sufficient factual basis to answer the citizen's query, you MUST output the following exact fallback advisory:
   "STATUTORY ADVISORY: The requested information is not specified in the official verified guidelines for this milestone. Please consult the official department portal or nodal helpdesk directly."
5. PROCEDURAL PARTITIONING: You NEVER grant exemptions or alter milestone prerequisites.
"""


def _build_rag_prompt(query: str, step_context: str, retrieved_passages: List[Dict[str, Any]], language: str = "en") -> str:
    context_str = ""
    for idx, p in enumerate(retrieved_passages, 1):
        context_str += f"""
--- PASSAGE {idx} ---
Department: {p.get('department')}
Document: {p.get('document_title')}
Section: {p.get('section_title')}
Reference: {p.get('source_reference')}
Official Portal: {p.get('portal_url')}
Content: {p.get('text')}
"""

    return f"""
TARGET CITIZEN QUERY: "{query}"
ACTIVE MILESTONE CONTEXT: {step_context}
REQUESTED LANGUAGE: {language}

OFFICIAL VERIFIED CONTEXT PASSAGES:
{context_str}

Respond strictly following the Grounded Statutory Legal Assistant instructions.
"""


def _heuristic_rag_answer(
    query: str,
    retrieved_passages: List[Dict[str, Any]],
    step_id: Optional[str],
    journey_id: Optional[str],
    language: str = "en",
) -> RAGQueryResponse:
    """Deterministic grounded response generator with zero-hallucination guardrail for offline mode."""
    q_lower = query.lower()

    # Detect out-of-scope / speculative queries to trigger zero-hallucination guardrail
    out_of_scope_triggers = [
        "bribe", "shortcut", "fake certificate", "bypass police", "crypto", "hack",
        "illegal", "without exam pass", "skip fee", "avoid income tax"
    ]
    if any(trigger in q_lower for trigger in out_of_scope_triggers) or not retrieved_passages:
        primary_portal = "https://india.gov.in"
        dept = "Government of India Citizen Helpdesk"
        if retrieved_passages:
            primary_portal = retrieved_passages[0].get("portal_url", primary_portal)
            dept = retrieved_passages[0].get("department", dept)

        return RAGQueryResponse(
            answer=(
                "⚠️ STATUTORY ADVISORY: The requested information is not permitted or not specified in official government guidelines. "
                f"Please refer directly to the verified official portal at {primary_portal} or contact the {dept} for statutory guidance."
            ),
            citations=[],
            is_fallback=True,
            department_source=dept,
            verified_portal_url=primary_portal,
            query_language=language,
        )

    # Convert retrieved passages to structured citations
    citations: List[CitationItem] = []
    for p in retrieved_passages:
        citations.append(
            CitationItem(
                department=p.get("department", "Government Department"),
                document_title=p.get("document_title", "Statutory Manual"),
                section=p.get("section_title", "Section Regulations"),
                portal_url=p.get("portal_url", "https://india.gov.in"),
                excerpt=p.get("text", "")[:280] + "...",
            )
        )

    top_passage = retrieved_passages[0]
    dept = top_passage.get("department", "Government of India")
    portal_url = top_passage.get("portal_url", "https://india.gov.in")
    sec_title = top_passage.get("section_title", "")
    doc_title = top_passage.get("document_title", "")
    passage_text = top_passage.get("text", "")

    # Localized answer construction
    if language == "hi":
        answer = (
            f"**आधिकारिक वैधानिक स्पष्टीकरण ({dept})**:\n\n"
            f"• **प्रासंगिक नियम**: {doc_title} ({sec_title})\n"
            f"• **मुख्य निर्देश**: {passage_text}\n"
            f"• **सत्यापित पोर्टल**: सीधे [{portal_url}]({portal_url}) पर ऑनलाइन आवेदन करें।"
        )
    elif language == "kn":
        answer = (
            f"**ಅಧಿಕೃತ ಶಾಸನಬದ್ಧ ಮಾರ್ಗದರ್ಶನ ({dept})**:\n\n"
            f"• **ನಿಯಮಾವಳಿ**: {doc_title} ({sec_title})\n"
            f"• **ಮುಖ್ಯ ವಿವರಣೆ**: {passage_text}\n"
            f"• **ಅಧಿಕೃತ ಪೋರ್ಟಲ್**: ನೇರವಾಗಿ [{portal_url}]({portal_url}) ನಲ್ಲಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
        )
    else:
        answer = (
            f"**Statutory Guidance ({dept})**:\n\n"
            f"• **Official Regulation**: {doc_title} — {sec_title}\n"
            f"• **Key Provisions**: {passage_text}\n"
            f"• **Official Action Portal**: Proceed directly at [{portal_url}]({portal_url})."
        )

    return RAGQueryResponse(
        answer=answer,
        citations=citations,
        is_fallback=False,
        department_source=dept,
        verified_portal_url=portal_url,
        query_language=language,
    )


def execute_grounded_rag(request: RAGQueryRequest) -> RAGQueryResponse:
    """Execute end-to-end Grounded Step Q&A with ChromaDB retrieval and Gemini Pro / Fallback."""
    query = request.query.strip()
    step_id = request.step_id
    journey_id = request.journey_id
    language = request.language or "en"

    # Step context lookup
    step_context = f"Step ID: {step_id or 'General'}, Journey: {journey_id or 'General'}"
    if journey_id and journey_id in MASTER_BLUEPRINTS:
        blueprint = MASTER_BLUEPRINTS[journey_id]
        if step_id:
            for node in blueprint.get("nodes", []):
                if node.get("step_id") == step_id:
                    step_context = f"Milestone Step: '{node.get('title')}' (Gov Dept: {node.get('governing_department')}, Fee: {node.get('statutory_fee')})"
                    break

    # 1. Retrieve top 3 official passages from local ChromaDB
    retrieved_passages = vector_store.search(
        query=f"{query} {step_id or ''}",
        top_k=3,
        step_id=step_id,
    )

    # 2. If live Gemini client is available, call model with grounded prompt
    if gemini_client.is_live and retrieved_passages:
        prompt = _build_rag_prompt(query, step_context, retrieved_passages, language)
        live_text = gemini_client.generate_text(
            prompt=prompt,
            system_instruction=SYSTEM_PROMPT_GROUNDED_RAG,
            temperature=0.1
        )
        if live_text:
            is_fallback = "STATUTORY ADVISORY" in live_text
            citations: List[CitationItem] = []
            if not is_fallback:
                for p in retrieved_passages:
                    citations.append(
                        CitationItem(
                            department=p.get("department", "Government Department"),
                            document_title=p.get("document_title", "Statutory Manual"),
                            section=p.get("section_title", "Section Regulations"),
                            portal_url=p.get("portal_url", "https://india.gov.in"),
                            excerpt=p.get("text", "")[:280] + "...",
                        )
                    )

            top_p = retrieved_passages[0]
            return RAGQueryResponse(
                answer=live_text,
                citations=citations,
                is_fallback=is_fallback,
                department_source=top_p.get("department", "Government of India"),
                verified_portal_url=top_p.get("portal_url", "https://india.gov.in"),
                query_language=language,
            )

    # 3. Fallback grounded generation
    return _heuristic_rag_answer(query, retrieved_passages, step_id, journey_id, language)
