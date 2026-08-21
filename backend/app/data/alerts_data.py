"""
Pre-seeded Statutory & Regulatory Policy Alerts Data.
"""

from typing import List, Dict, Any
from app.schemas.alert import AlertSeverity

REGULATORY_ALERTS_DATA: List[Dict[str, Any]] = [
    {
        "alert_id": "ALERT-FSSAI-2026-01",
        "title": "Mandatory FoSCoS Annual Return (Form D1) E-Filing Deadline",
        "domain": "Food Business",
        "jurisdiction": "National / Multi-State",
        "severity": AlertSeverity.CRITICAL,
        "effective_date": "2026-05-31",
        "summary": "All FSSAI-licensed food business operators (FBOs) manufacturing or importing food must submit their online annual return via FoSCoS by May 31 to avoid statutory penalty of ₹100/day.",
        "official_gazette_ref": "FSSAI Notification No. 15(31)2020/FoSCoS/RCD/FSSAI",
        "source_url": "https://foscos.fssai.gov.in",
        "action_required": "File Form D1 on FoSCoS portal before deadline."
    },
    {
        "alert_id": "ALERT-FSSAI-KA-2026-02",
        "title": "Karnataka State Health Clearance Hygiene Rating Mandate for Cloud Kitchens",
        "domain": "Food Business",
        "jurisdiction": "Karnataka",
        "severity": AlertSeverity.IMPORTANT,
        "effective_date": "2026-07-01",
        "summary": "BBMP and Karnataka Health Department require all commercial delivery-only kitchens to display 3-star minimum FSSAI hygiene audit certificates on food aggregator apps.",
        "official_gazette_ref": "Govt of Karnataka Health & Family Welfare Circular HFW 148 FPS 2025",
        "source_url": "https://karnataka.gov.in",
        "action_required": "Schedule third-party NABL hygiene audit via FSSAI FoSCoS."
    },
    {
        "alert_id": "ALERT-EDU-VIDYA-2026-01",
        "title": "PM-Vidyalaxmi CSIS 100% Interest Subsidy Expansion for FY 2026-27",
        "domain": "Higher Education",
        "jurisdiction": "National",
        "severity": AlertSeverity.IMPORTANT,
        "effective_date": "2026-04-01",
        "summary": "Department of Higher Education raised parental income threshold to ₹8 Lakh per annum for 100% interest subvention during course moratorium period under CSIS.",
        "official_gazette_ref": "MoE Gazette Notification F. No. 1-1/2026-U.Policy",
        "source_url": "https://www.vidyalakshmi.co.in",
        "action_required": "Ensure Tahsildar income certificate is dated after April 1, 2026."
    },
    {
        "alert_id": "ALERT-MEA-APOSTILLE-2026-01",
        "title": "MEA eSanad Paperless Digital Apostille Mandate for EU/Hague Countries",
        "domain": "Study Abroad",
        "jurisdiction": "National",
        "severity": AlertSeverity.CRITICAL,
        "effective_date": "2026-03-15",
        "summary": "Physical sticker apostilles are phased out in favor of QR-coded verifiable digital certificates on legalize.mea.gov.in for all 124 Hague Apostille Convention countries.",
        "official_gazette_ref": "MEA CPV Division Order CPV/2026/Apostille-Digital",
        "source_url": "https://legalize.mea.gov.in",
        "action_required": "Opt for digital eSanad attestation when requesting state HRD clearance."
    },
    {
        "alert_id": "ALERT-MCA-STARTUP-2026-01",
        "title": "DPIIT Fast-Track Patent Examination Fee Rebate for Recognized Startups",
        "domain": "Startups",
        "jurisdiction": "National",
        "severity": AlertSeverity.ADVISORY,
        "effective_date": "2026-01-01",
        "summary": "Startups with valid DPIIT recognition certificates receive an 80% rebate on statutory patent filing fees and expedited examination within 90 days.",
        "official_gazette_ref": "DPIIT Order No. 4(1)/2026-IPR",
        "source_url": "https://www.startupindia.gov.in",
        "action_required": "Link DPIIT DIPP number in Form 18A on the Indian Patent Office portal."
    },
    {
        "alert_id": "ALERT-TOURISM-IITFC-2026-01",
        "title": "Ministry of Tourism Digital ID Badge Mandatory DigiLocker Verification",
        "domain": "Tourism",
        "jurisdiction": "National",
        "severity": AlertSeverity.IMPORTANT,
        "effective_date": "2026-06-01",
        "summary": "All ASI monument tourist guides must present QR-verifiable DigiLocker Tourist Facilitator credentials on mobile devices to CISF security personnel.",
        "official_gazette_ref": "Ministry of Tourism Notification TT-II/2026/09",
        "source_url": "https://tourism.gov.in",
        "action_required": "Issue digital guide card to citizen DigiLocker account post-certification."
    }
]
