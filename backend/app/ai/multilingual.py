"""Multilingual Step Guidance & Checklist Generation Engine.

Translates complex statutory jargon into clear, plain-language milestone explanations,
actionable document checklists, and pitfalls to avoid in English, Hindi, and Kannada.
"""

from __future__ import annotations
from typing import Dict, Any, List
from app.schemas.ai import (
    MultilingualGuidanceRequest,
    MultilingualGuidanceResponse,
)
from app.data.blueprints import MASTER_BLUEPRINTS
from app.ai.gemini_client import gemini_client

SYSTEM_PROMPT_MULTILINGUAL = """You are a senior multilingual GovTech citizen advisor for the Government of India.
Your mission is to translate complex statutory legal language into clear, accessible step guidance in the citizen's chosen regional language.

Language Codes:
- 'en': English
- 'hi': Hindi (हिन्दी)
- 'kn': Kannada (ಕನ್ನಡ)

You must return:
1. step_id: The ID of the target step.
2. language: The requested language code.
3. localized_title: Accurate regional title.
4. plain_language_summary: 2-3 sentences explaining what this step is and why it is required in simple terms.
5. actionable_checklist: 3-5 concrete steps the citizen must carry out.
6. common_pitfalls_to_avoid: 2-3 frequent errors or reasons for application rejection.
7. official_portal_url: Verified government portal link.
"""

LOCALIZED_STEP_DEFAULTS: Dict[str, Dict[str, Any]] = {
    "fssai-license": {
        "hi": {
            "title": "FSSAI खाद्य सुरक्षा पंजीकरण और राज्य लाइसेंस",
            "summary": "यह खाद्य सुरक्षा अधिनियम 2006 के तहत अनिवार्य लाइसेंस है। ₹12 लाख से कम टर्नओवर के लिए मूल पंजीकरण और ₹12 लाख से अधिक के लिए राज्य लाइसेंस की आवश्यकता होती है।",
            "checklist": [
                "किचन का लेआउट प्लान और जल परीक्षण रिपोर्ट (NABL लैब) तैयार रखें",
                "FoSCoS पोर्टल (foscos.fssai.gov.in) पर फॉर्म A या B भरें",
                "FoSTaC प्रमाणित खाद्य सुरक्षा पर्यवेक्षक का प्रमाण पत्र संलग्न करें",
                "सरकारी शुल्क का ऑनलाइन भुगतान करें और रसीद डाउनलोड करें",
            ],
            "pitfalls": [
                "गैर-पीने योग्य पानी की रिपोर्ट जमा करना",
                "स्वीगी/ज़ोमैटो पर बिना वैध FSSAI नंबर के लिस्टिंग का प्रयास करना",
            ],
        },
        "kn": {
            "title": "FSSAI ಆಹಾರ ಸುರಕ್ಷತಾ ನೋಂದಣಿ ಮತ್ತು ಪರವಾನಗಿ",
            "summary": "ಆಹಾರ ಸುರಕ್ಷತಾ ಕಾಯಿದೆ 2006 ರ ಅಡಿಯಲ್ಲಿ ಕ್ಲೌಡ್ ಕಿಚನ್‌ಗಳು ಮತ್ತು ರೆಸ್ಟೋರೆಂಟ್‌ಗಳಿಗೆ ಈ ಪರವಾನಗಿ ಕಡ್ಡಾಯವಾಗಿದೆ. ವಾರ್ಷಿಕ ವಹಿವಾಟು ₹12 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಇದ್ದರೆ ಮೂಲ ನೋಂದಣಿ ಸಾಕು.",
            "checklist": [
                "ಅಡುಗೆಮನೆಯ ಲೇಔಟ್ ಮತ್ತು NABL ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ನಿಂದ ನೀರಿನ ಪರೀಕ್ಷಾ ವರದಿ",
                "FoSCoS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
                "ಆಹಾರ ಸುರಕ್ಷತಾ ಮೇಲ್ವಿಚಾರಕರ (FoSTaC) ಪ್ರಮಾಣಪತ್ರವನ್ನು ಲಗತ್ತಿಸಿ",
                "ನಿಗದಿತ ಶುಲ್ಕವನ್ನು ಆನ್‌ಲೈನ್ ಮೂಲಕ ಪಾವತಿಸಿ",
            ],
            "pitfalls": [
                "ಅನಧಿಕೃತ ದಲ್ಲಾಳಿಗಳ ಮೂಲಕ ಹೆಚ್ಚುವರಿ ಹಣ ಪಾವತಿಸುವುದು",
                "ಅರ್ಜಿಯ ಸ್ಥಿತಿಯನ್ನು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸದೆ ಬಿಡುವುದು",
            ],
        },
    },
    "udyam-registration": {
        "hi": {
            "title": "उद्यम एमएसएमई राष्ट्रीय ऑनलाइन पंजीकरण",
            "summary": "यह सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय द्वारा जारी आधिकारिक डिजिटल प्रमाण पत्र है। यह पूरी तरह से निःशुल्क और 100% पेपरलेस है।",
            "checklist": [
                "प्रोपराइटर का आधार नंबर और पैन कार्ड तैयार रखें",
                "udyamregistration.gov.in पर जाएं और 'नए उद्यमियों के लिए' चुनें",
                "आधार से जुड़े मोबाइल पर प्राप्त ओटीपी दर्ज करें",
                "त्वरित डिजिटल उद्यम प्रमाण पत्र और क्यूआर कोड डाउनलोड करें",
            ],
            "pitfalls": [
                "नकली/निजी वेबसाइटों पर पंजीकरण शुल्क का भुगतान करना (यह पूर्णतः मुफ्त है)",
                "गलत एनआईसी (NIC) व्यवसाय कोड चुनना",
            ],
        },
        "kn": {
            "title": "ಉದ್ಯಮ್ MSME ರಾಷ್ಟ್ರೀಯ ನೋಂದಣಿ",
            "summary": "ಇದು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಉಚಿತ ಮತ್ತು ಕಾಗದರಹಿತ ಡಿಜಿಟಲ್ ನೋಂದಣಿಯಾಗಿದೆ. ಈ ನೋಂದಣಿಯಿಂದ ಬ್ಯಾಂಕ್ ಸಾಲಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳಿಗೆ ಸುಲಭ ಪ್ರವೇಶ ದೊರೆಯುತ್ತದೆ.",
            "checklist": [
                "ಮಾಲೀಕರ ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್ ವಿವರಗಳು",
                "ಅಧಿಕೃತ udyamregistration.gov.in ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ",
                "ಆಧಾರ್ ಒಟಿಪಿ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಳಿಸಿ",
                "ಡಿಜಿಟಲ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ಹೊಂದಿರುವ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
            ],
            "pitfalls": [
                "ಖಾಸಗಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಗೆ ಹಣ ಪಾವತಿಸುವುದು (ಸರ್ಕಾರ ಯಾವುದೇ ಶುಲ್ಕ ವಿಧಿಸುವುದಿಲ್ಲ)",
            ],
        },
    },
    "scheme-discovery": {
        "hi": {
            "title": "पीएम-विद्यालक्ष्मी 100% ब्याज सब्सिडी और ऋण आवेदन",
            "summary": "₹8 लाख से कम वार्षिक पारिवारिक आय वाले छात्रों के लिए उच्च तकनीकी और व्यावसायिक शिक्षा हेतु 100% ब्याज सब्सिडी योजना।",
            "checklist": [
                "10वीं, 12वीं की अंकतालिका और कॉलेज प्रवेश पत्र तैयार रखें",
                "तहसीलदार द्वारा जारी पारिवारिक आय प्रमाण पत्र अपलोड करें",
                "vidyalakshmi.co.in पोर्टल पर एक साथ 3 बैंकों में आवेदन करें",
            ],
            "pitfalls": [
                "अनधिकृत आय प्रमाण पत्र प्रस्तुत करना",
                "पाठ्यक्रम की एनआईआरएफ (NIRF) रैंकिंग की पुष्टि न करना",
            ],
        },
        "kn": {
            "title": "ಪಿಎಂ-ವಿದ್ಯಾಲಕ್ಷ್ಮಿ 100% ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಯೋಜನೆ",
            "summary": "ವಾರ್ಷಿಕ ಆದಾಯ ₹8 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಇರುವ ಕುಟುಂಬಗಳ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಾಲೇಜು ಶಿಕ್ಷಣದ ಅವಧಿಯಲ್ಲಿ ಪೂರ್ಣ ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ದೊರೆಯುತ್ತದೆ.",
            "checklist": [
                "ಅಂಕಪಟ್ಟಿಗಳು ಮತ್ತು ಕಾಲೇಜು ಪ್ರವೇಶ ಪತ್ರ",
                "ತಹಶೀಲ್ದಾರ್ ನೀಡಿದ ಕುಟುಂಬದ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ",
                "ವಿದ್ಯಾಲಕ್ಷ್ಮಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
            ],
            "pitfalls": [
                "ಅನಧಿಕೃತ ಆದಾಯ ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸುವುದು",
            ],
        },
    },
}


def generate_multilingual_guidance(request: MultilingualGuidanceRequest) -> MultilingualGuidanceResponse:
    """Generate localized step guidance using Gemini Pro or pre-validated statutory translations."""
    step_id = request.step_id
    journey_id = request.journey_id
    language = (request.language or "en").lower()

    # Find step blueprint
    target_node = None
    portal_url = "https://india.gov.in"
    default_title = step_id.replace("-", " ").title()

    if journey_id and journey_id in MASTER_BLUEPRINTS:
        bp = MASTER_BLUEPRINTS[journey_id]
        for n in bp.get("nodes", []):
            if n.get("step_id") == step_id:
                target_node = n
                portal_url = n.get("official_portal_url", portal_url)
                default_title = n.get("title", default_title)
                break

    if not target_node:
        for bp in MASTER_BLUEPRINTS.values():
            for n in bp.get("nodes", []):
                if n.get("step_id") == step_id:
                    target_node = n
                    portal_url = n.get("official_portal_url", portal_url)
                    default_title = n.get("title", default_title)
                    break
            if target_node:
                break

    # 1. Live Gemini structured generation
    if gemini_client.is_live:
        prompt = (
            f"Generate localized guidance for Step '{step_id}' ({default_title}) in language '{language}'.\n"
            f"Official portal: {portal_url}\n"
            f"Required documents: {target_node.get('required_documents', []) if target_node else []}"
        )
        live_res = gemini_client.generate_structured(
            prompt=prompt,
            system_instruction=SYSTEM_PROMPT_MULTILINGUAL,
            response_model=MultilingualGuidanceResponse,
            temperature=0.1
        )
        if live_res:
            live_res.official_portal_url = portal_url
            return live_res

    # 2. Fallback regional mapping
    if step_id in LOCALIZED_STEP_DEFAULTS and language in LOCALIZED_STEP_DEFAULTS[step_id]:
        loc_data = LOCALIZED_STEP_DEFAULTS[step_id][language]
        return MultilingualGuidanceResponse(
            step_id=step_id,
            language=language,
            localized_title=loc_data["title"],
            plain_language_summary=loc_data["summary"],
            actionable_checklist=loc_data["checklist"],
            common_pitfalls_to_avoid=loc_data["pitfalls"],
            official_portal_url=portal_url,
        )

    # 3. Default English construction
    docs_str = ", ".join(target_node.get("required_documents", ["Identity Proof", "Address Proof"])) if target_node else "Identity and address proofs"
    return MultilingualGuidanceResponse(
        step_id=step_id,
        language=language,
        localized_title=default_title,
        plain_language_summary=f"Statutory compliance requirement for '{default_title}'. Ensure all verified credentials are submitted through the official government portal.",
        actionable_checklist=[
            f"Gather verified digital credentials: {docs_str}",
            f"Visit official portal: {portal_url}",
            "Complete digital verification and obtain acknowledgment receipt",
        ],
        common_pitfalls_to_avoid=[
            "Submitting expired or un-attested documents",
            "Paying unofficial broker charges (statutory filing is governed by official fees)",
        ],
        official_portal_url=portal_url,
    )
