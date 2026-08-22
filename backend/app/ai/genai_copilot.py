"""AI Copilot Engine powered by Gemini 2.5 Flash & official google-genai SDK.

Defines Function Declarations (Tools) for client-side Generative UI actions:
- load_journey(journey_id: str)
- open_step_drawer(step_id: str)
- trigger_consent_modal(doc_type: str, purpose: str)
- switch_language(lang_code: str)

Enforces strict system prompt, ChromaDB RAG retrieval grounding, and dual-mode
live GenAI / deterministic fallback execution.
"""

from __future__ import annotations
import time
import logging
from typing import List, Dict, Any, Optional
from app.config import settings
from app.schemas.copilot import (
    CopilotQueryRequest,
    CopilotQueryResponse,
    ToolCall,
)
from app.ai.vector_store import vector_store

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are the AI Citizen Journey Copilot for an Indian Government statutory services portal. "
    "When a citizen states a goal or asks to perform an action, you must extract multi-variable parameters in a single shot:\n"
    "1. domain: (EDUCATION | BUSINESS | TRAVEL | WELFARE | LEGAL | HOUSING | BANKING)\n"
    "2. sub_type: (e.g., FOOD_CAFE, TECH_STARTUP, HIGHER_STUDIES, SCHOLARSHIPS, PASSPORT, TOURIST_GUIDE, PROPERTY_RERA, AADHAAR_CIVIC)\n"
    "3. jurisdiction: (STATE_NAME or CENTRAL)\n"
    "4. persona: (STUDENT | ENTREPRENEUR | TOURIST | FARMER | CITIZEN)\n\n"
    "DECISION LOGIC:\n"
    "- If any critical attribute is missing to select an exact journey, or if the intent is broad (e.g., 'I want to start a business', 'help with higher education'), "
    "call 'show_choice_chips' with 'prompt' and 3-4 distinct 'options' [{ label, journey_id, description }] from the candidate templates provided in the context.\n"
    "- If the intent is specific and all attributes map unambiguously to a single journey (e.g., 'FSSAI food license in Karnataka'), call 'load_journey' directly.\n"
    "- Always accompany your tool calls with a concise, polite explanation (max 2 sentences).\n"
    "- Never hallucinate government fees or unverified prerequisites."
)

COPILOT_MODEL_NAME = "gemini-2.5-flash"


def _get_genai_tools():
    """Build official google.genai types Function Declarations."""
    try:
        from google.genai import types

        load_journey_decl = types.FunctionDeclaration(
            name="load_journey",
            description="Loads and renders an active statutory citizen roadmap on screen.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "journey_id": types.Schema(
                        type=types.Type.STRING,
                        description="The unique identifier of the journey (e.g., 'food-business-license', 'pm-vidyalaxmi-loan', 'study-abroad-global')."
                    )
                },
                required=["journey_id"]
            )
        )

        open_step_drawer_decl = types.FunctionDeclaration(
            name="open_step_drawer",
            description="Slides open the instruction side panel for a specific milestone step.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "step_id": types.Schema(
                        type=types.Type.STRING,
                        description="The unique milestone node ID to open in the side drawer (e.g., 'fssai-license', 'vidyalaxmi-application', 'apostille-attestation')."
                    )
                },
                required=["step_id"]
            )
        )

        trigger_consent_modal_decl = types.FunctionDeclaration(
            name="trigger_consent_modal",
            description="Opens the DPDP Act 2023 consent dialog for identity verification via DigiLocker Sandbox.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "doc_type": types.Schema(
                        type=types.Type.STRING,
                        description="The statutory document type to verify (e.g. 'PAN', 'AADHAAR', 'MARKSHEET_12', 'INCOME_CERTIFICATE')."
                    ),
                    "purpose": types.Schema(
                        type=types.Type.STRING,
                        description="The specific statutory purpose for requesting digital document consent."
                    )
                },
                required=["doc_type", "purpose"]
            )
        )

        switch_language_decl = types.FunctionDeclaration(
            name="switch_language",
            description="Switches the portal interface language (e.g. 'en', 'hi', 'kn').",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "lang_code": types.Schema(
                        type=types.Type.STRING,
                        description="The BCP-47 / 2-letter language code to activate ('en', 'hi', 'kn')."
                    )
                },
                required=["lang_code"]
            )
        )

        return [
            types.Tool(function_declarations=[
                load_journey_decl,
                open_step_drawer_decl,
                trigger_consent_modal_decl,
                switch_language_decl,
                _get_show_choice_chips_decl(),
            ])
        ]
    except Exception as e:
        logger.debug(f"google.genai tools building notice: {e}")
        return []


def _get_show_choice_chips_decl():
    """Build the show_choice_chips FunctionDeclaration for journey disambiguation."""
    from google.genai import types

    return types.FunctionDeclaration(
        name="show_choice_chips",
        description=(
            "Present interactive choice options to the citizen when their query is ambiguous "
            "or matches multiple statutory journeys. The citizen will click one to proceed."
        ),
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "prompt": types.Schema(
                    type=types.Type.STRING,
                    description="A brief question to display above the chips (e.g. 'Which journey would you like to explore?')."
                ),
                "options": types.Schema(
                    type=types.Type.ARRAY,
                    description="Array of 2-4 journey option objects for the citizen to choose from.",
                    items=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "label": types.Schema(
                                type=types.Type.STRING,
                                description="Short display label for the chip (e.g. 'FSSAI Food License')."
                            ),
                            "journey_id": types.Schema(
                                type=types.Type.STRING,
                                description="The journey_id to load if selected."
                            ),
                            "description": types.Schema(
                                type=types.Type.STRING,
                                description="One-line description of this journey option."
                            ),
                        },
                        required=["label", "journey_id", "description"]
                    )
                )
            },
            required=["prompt", "options"]
        )
    )


def query_copilot(request: CopilotQueryRequest) -> CopilotQueryResponse:
    """Process citizen query with Gemini 2.5 Flash, RAG grounding, and Tool Calling."""
    start_time = time.perf_counter()
    query = request.get_prompt_text()
    language = (request.language or "en").lower()

    # 1. RAG Retrieval from ChromaDB (if not pre-provided in request)
    context_chunks = request.context_chunks
    if not context_chunks:
        try:
            hits = vector_store.search(query or "statutory citizen journey guidance", top_k=3)
            context_chunks = [
                {
                    "department": h.get("department", ""),
                    "document_title": h.get("document_title", ""),
                    "section_title": h.get("section_title", ""),
                    "portal_url": h.get("portal_url", ""),
                    "excerpt": h.get("text", "")[:350],
                }
                for h in hits
            ]
        except Exception as e:
            logger.warning(f"ChromaDB retrieval error: {e}")
            context_chunks = []

    # 2. Try Live Google GenAI SDK Execution
    api_key = settings.GEMINI_API_KEY
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            tools = _get_genai_tools()

            # Build grounded context section
            rag_context_text = ""
            if context_chunks:
                rag_context_text = "\n\nVerified Official Government Sources:\n" + "\n".join(
                    f"• [{c.get('department', 'Gov')}] {c.get('document_title', '')} — {c.get('section_title', '')}: {c.get('excerpt', '')}"
                    for c in context_chunks
                )

            # Pre-search journey blueprints for grounding
            journey_matches = vector_store.search_journeys(query, top_k=3)
            journey_context = ""
            if journey_matches:
                journey_context = "\n\nMatching Journey Blueprints (use for disambiguation):\n" + "\n".join(
                    f"• {m['journey_id']}: {m['title']} ({m['category']}) — score: {m['score']}"
                    for m in journey_matches
                )

            user_prompt = f"User Request: {query}\nLanguage Preference: {language}{rag_context_text}{journey_context}"

            response = client.models.generate_content(
                model=COPILOT_MODEL_NAME,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    tools=tools,
                    temperature=0.1,
                )
            )

            # Extract tool calls and text response from Gemini response
            extracted_tool_calls: List[ToolCall] = []
            synthesized_text = ""

            if response and response.candidates:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        fc = getattr(part, "function_call", None)
                        if fc and getattr(fc, "name", None):
                            call_name = str(fc.name)
                            call_args = dict(fc.args) if getattr(fc, "args", None) else {}
                            extracted_tool_calls.append(ToolCall(
                                name=call_name,
                                arguments=call_args
                            ))
                        txt = getattr(part, "text", None)
                        if txt:
                            synthesized_text += str(txt).strip() + " "

            if not synthesized_text and response.text:
                synthesized_text = response.text.strip()

            if synthesized_text and len(extracted_tool_calls) > 0:
                latency = round((time.perf_counter() - start_time) * 1000, 2)
                ui_actions = [
                    {"action": t.name, "payload": t.arguments}
                    for t in extracted_tool_calls
                ]
                return CopilotQueryResponse(
                    text_response=synthesized_text.strip(),
                    ui_actions=ui_actions,
                    tool_calls=extracted_tool_calls,
                    context_chunks=context_chunks,
                    model=COPILOT_MODEL_NAME,
                    latency_ms=latency,
                )

        except Exception as e:
            logger.warning(f"Live Gemini 2.5 Flash query failed: {e}. Executing deterministic copilot resolution.")

    # 3. Deterministic Fallback & Fast Grounded Rule Engine (with vector search)
    return _deterministic_copilot_query(query, language, context_chunks, start_time)


def _deterministic_copilot_query(
    query: str,
    language: str,
    context_chunks: List[Dict[str, Any]],
    start_time: float
) -> CopilotQueryResponse:
    """Deterministic, zero-latency copilot tool action generator with vector-based disambiguation."""
    q_lower = query.lower()
    tool_calls: List[ToolCall] = []
    text_response = ""

    # Check for Language Switch Intent
    if any(k in q_lower for k in ["हिंदी", "hindi", "in hindi", "हिन्दी"]):
        tool_calls.append(ToolCall(
            name="switch_language",
            arguments={"lang_code": "hi"}
        ))
        language = "hi"
    elif any(k in q_lower for k in ["kannada", "ಕನ್ನಡ", "in kannada"]):
        tool_calls.append(ToolCall(
            name="switch_language",
            arguments={"lang_code": "kn"}
        ))
        language = "kn"

    # Check for DigiLocker / Consent Intent
    if any(k in q_lower for k in ["digilocker", "consent", "verify pan", "verify aadhaar", "verify marksheet", "पैन", "आधार"]):
        doc_type = "PAN"
        if "aadhaar" in q_lower or "आधार" in q_lower:
            doc_type = "AADHAAR"
        elif "marksheet" in q_lower or "मार्कशीट" in q_lower:
            doc_type = "MARKSHEET_12"
        elif "income" in q_lower or "आय" in q_lower:
            doc_type = "INCOME_CERTIFICATE"
        elif "udyam" in q_lower or "उद्यम" in q_lower:
            doc_type = "UDYAM_CERTIFICATE"

        tool_calls.append(ToolCall(
            name="trigger_consent_modal",
            arguments={
                "doc_type": doc_type,
                "purpose": f"Statutory {doc_type} verification via DigiLocker Sandbox"
            }
        ))

    # Check for Food / FSSAI / Cloud Kitchen Intent (unambiguous)
    if any(k in q_lower for k in ["fssai", "food", "kitchen", "restaurant", "catering", "cafe", "baking", "sweet shop", "खाद्य", "भोजन", "ಆಹಾರ"]):
        tool_calls.append(ToolCall(
            name="load_journey",
            arguments={"journey_id": "food-business-license"}
        ))
        if any(k in q_lower for k in ["license", "fssai", "foscos", "drawer", "step 3", "दस्तावेज", "लाइसेंस"]):
            tool_calls.append(ToolCall(
                name="open_step_drawer",
                arguments={"step_id": "fssai-license"}
            ))

        if language == "hi":
            text_response = "मैंने आपके लिए खाद्य व्यवसाय और FSSAI लाइसेंस रोडमैप खोल दिया है। ₹12 लाख से कम टर्नओवर के लिए ₹100/वर्ष का बेसिक रजिस्ट्रेशन आवश्यक है।"
        elif language == "kn":
            text_response = "ನಾನು ನಿಮಗಾಗಿ ಎಫ್‌ಎಸ್‌ಎಸ್‌ಎಐ ಆಹಾರ ಪರವಾನಗಿ ರೋಡ್‌ಮ್ಯಾಪ್ ಮತ್ತು ಹಂತಗಳನ್ನು ತೆರೆದಿದ್ದೇನೆ."
        else:
            text_response = "I have loaded the Food Business roadmap and opened the FSSAI license step for your review. Establishments with turnover under ₹12 Lakhs require Basic Registration at ₹100 per year."

    # Check for Education Loan / PM-Vidyalaxmi Intent (unambiguous)
    elif any(k in q_lower for k in ["loan", "vidyalaxmi", "college fee", "interest subsidy", "csis", "ऋण", "लोन", "विद्यालक्ष्मी", "शिक्षा"]):
        tool_calls.append(ToolCall(
            name="load_journey",
            arguments={"journey_id": "pm-vidyalaxmi-loan"}
        ))
        tool_calls.append(ToolCall(
            name="open_step_drawer",
            arguments={"step_id": "vidyalaxmi-application"}
        ))

        if language == "hi":
            text_response = "मैंने पीएम-विद्यालक्ष्मी उच्च शिक्षा ऋण रोडमैप खोल दिया है। ₹4.5 लाख तक पारिवारिक आय पर कोर्स अवधि के दौरान 100% ब्याज सब्सिडी मिलती है।"
        else:
            text_response = "I have loaded the PM-Vidyalaxmi Education Loan roadmap and opened the Common Application step. Eligible students receive a 100% Central Sector Interest Subsidy during the moratorium."

    # Check for Study Abroad Intent (unambiguous)
    elif any(k in q_lower for k in ["study abroad", "abroad", "foreign", "visa", "apostille", "passport", "lrs", "विदेश", "पासपोर्ट"]):
        tool_calls.append(ToolCall(
            name="load_journey",
            arguments={"journey_id": "study-abroad-global"}
        ))
        tool_calls.append(ToolCall(
            name="open_step_drawer",
            arguments={"step_id": "apostille-attestation"}
        ))

        text_response = "I have loaded the Study Abroad statutory compliance roadmap and opened the MEA eSanad Apostille step for certificate attestation."

    # Ambiguous / General: Use vector search for dynamic journey discovery
    else:
        journey_matches = vector_store.search_journeys(query, top_k=3)

        if journey_matches and len(journey_matches) >= 2:
            top_score = journey_matches[0]["score"]
            second_score = journey_matches[1]["score"]
            score_gap = top_score - second_score

            # If top match is strongly dominant (>15% gap), load directly
            if score_gap > 0.15 and top_score > 0.3:
                tool_calls.append(ToolCall(
                    name="load_journey",
                    arguments={"journey_id": journey_matches[0]["journey_id"]}
                ))
                text_response = f"I have loaded the {journey_matches[0]['title']} roadmap based on your query."
            else:
                # Disambiguation: show choice chips
                options = [
                    {
                        "label": m["title"][:60],
                        "journey_id": m["journey_id"],
                        "description": m["description"][:120],
                    }
                    for m in journey_matches[:4]
                ]
                tool_calls.append(ToolCall(
                    name="show_choice_chips",
                    arguments={
                        "prompt": "I found multiple matching journeys. Which one would you like to explore?",
                        "options": options,
                    }
                ))
                if language == "hi":
                    text_response = "आपकी खोज से कई रोडमैप मिले हैं। कृपया नीचे से एक विकल्प चुनें।"
                elif language == "kn":
                    text_response = "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಹಲವು ರೋಡ್‌ಮ್ಯಾಪ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗಿವೆ. ದಯವಿಟ್ಟು ಕೆಳಗಿನಿಂದ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ."
                else:
                    text_response = "I found multiple matching statutory roadmaps for your query. Please select one below to proceed."

        elif journey_matches and len(journey_matches) == 1 and journey_matches[0]["score"] > 0.25:
            tool_calls.append(ToolCall(
                name="load_journey",
                arguments={"journey_id": journey_matches[0]["journey_id"]}
            ))
            text_response = f"I have loaded the {journey_matches[0]['title']} roadmap for you."
        else:
            tool_calls.append(ToolCall(
                name="load_journey",
                arguments={"journey_id": "food-business-license"}
            ))
    # Attach grounded statutory context chunks if not already provided
    if not context_chunks:
        try:
            rag_hits = vector_store.search(query, top_k=3)
            context_chunks = [
                {
                    "department": h.get("department", "Government of India"),
                    "document_title": h.get("document_title", "Official Gazette Manual"),
                    "section_title": h.get("section_title", "Statutory Guidelines"),
                    "portal_url": h.get("portal_url", "https://india.gov.in"),
                    "excerpt": h.get("text", "")[:350],
                }
                for h in rag_hits
            ]
        except Exception:
            context_chunks = []

    latency = round((time.perf_counter() - start_time) * 1000, 2)
    ui_actions = [
        {"action": t.name, "payload": t.arguments}
        for t in tool_calls
    ]

    return CopilotQueryResponse(
        text_response=text_response,
        ui_actions=ui_actions,
        tool_calls=tool_calls,
        context_chunks=context_chunks,
        model=COPILOT_MODEL_NAME,
        latency_ms=latency,
    )
