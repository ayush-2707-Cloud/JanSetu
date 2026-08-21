"""Statutory Stamp Duty & e-Stamping Rules Catalog for Indian States.

Covers:
- Karnataka (Karnataka Stamp Act, 1957)
- Maharashtra (Maharashtra Stamp Act, 1958)
- Delhi (Indian Stamp (Delhi Amendment) Act)
- Tamil Nadu (Tamil Nadu Stamp Act)
- Telangana & Andhra Pradesh (Indian Stamp Act - TS/AP Amendments)
- Uttar Pradesh & Gujarat
"""

from typing import Dict, Any, List

STATE_STAMP_SCHEDULES: Dict[str, Dict[str, Any]] = {
    "KA": {
        "state_name": "Karnataka",
        "governing_act": "Karnataka Stamp Act, 1957 (Schedule Article 5 & 20)",
        "official_estamp_portal": "https://kaverionline.karnataka.gov.in",
        "estamp_provider": "Stock Holding Corporation of India (SHCIL) & Kaveri 2.0",
        "minimum_stamp_duty_inr": 100,
        "articles": {
            "RENT_AGREEMENT_RESIDENTIAL": {
                "title": "Residential Rent Agreement (<11 Months)",
                "rate_type": "PERCENT_OR_FLAT",
                "flat_inr": 200,
                "percentage_of_annual_rent": 0.5,
                "registration_surcharge_inr": 100,
                "description": "For lease duration < 11 months: Flat ₹200 e-Stamp or 0.5% of total annual rent + advance deposit (whichever is applicable).",
            },
            "RENT_AGREEMENT_COMMERCIAL": {
                "title": "Commercial Lease Agreement (1 to 5 Years)",
                "rate_type": "PERCENTAGE",
                "percentage_of_annual_rent": 1.0,
                "registration_surcharge_inr": 1000,
                "description": "Commercial leases up to 5 years: 1.0% of the Average Annual Rent (AAR) + Deposit. Mandatory registration at Sub-Registrar Office.",
            },
            "PARTNERSHIP_DEED": {
                "title": "Partnership Firm Constitution Deed",
                "rate_type": "SLAB_CAPITAL",
                "slabs": [
                    {"max_capital": 50000, "stamp_duty_inr": 500},
                    {"max_capital": 500000, "stamp_duty_inr": 1000},
                    {"max_capital": 999999999999, "stamp_duty_inr": 2000},
                ],
                "description": "Article 40: Stamp duty starts at ₹500 for capital under ₹50,000 and scales to ₹2,000 for capital exceeding ₹5 Lakhs.",
            },
            "AFFIDAVIT_OR_NOC": {
                "title": "Landlord NOC / General Affidavit",
                "rate_type": "FLAT",
                "flat_inr": 100,
                "description": "Non-judicial e-Stamp paper of ₹100 attested before a Notary Public or Oath Commissioner.",
            },
            "POWER_OF_ATTORNEY": {
                "title": "General Power of Attorney (GPA)",
                "rate_type": "FLAT",
                "flat_inr": 500,
                "description": "GPA in favour of non-family business representative requires ₹500 e-Stamp paper.",
            },
        },
    },
    "MH": {
        "state_name": "Maharashtra",
        "governing_act": "Maharashtra Stamp Act, 1958 (Article 36A & 47)",
        "official_estamp_portal": "https://igrmaharashtra.gov.in",
        "estamp_provider": "GRAS (Government Receipt Accounting System) / IGRS",
        "minimum_stamp_duty_inr": 100,
        "articles": {
            "RENT_AGREEMENT_RESIDENTIAL": {
                "title": "Leave and License Agreement (Up to 60 Months)",
                "rate_type": "PERCENTAGE",
                "percentage_of_annual_rent": 0.25,
                "registration_surcharge_inr": 1000,
                "description": "Section 36A: 0.25% of the total rent for the entire term + non-refundable deposit. Urban registration fee ₹1,000.",
            },
            "RENT_AGREEMENT_COMMERCIAL": {
                "title": "Commercial Leave & License / Lease",
                "rate_type": "PERCENTAGE",
                "percentage_of_annual_rent": 0.50,
                "registration_surcharge_inr": 1000,
                "description": "0.50% of the aggregate consideration + advance deposit.",
            },
            "PARTNERSHIP_DEED": {
                "title": "Partnership / LLP Constitution Deed",
                "rate_type": "FLAT",
                "flat_inr": 500,
                "description": "Article 47: Fixed stamp duty of ₹500 on execution.",
            },
            "AFFIDAVIT_OR_NOC": {
                "title": "Owner NOC & Self-Declaration Affidavit",
                "rate_type": "FLAT",
                "flat_inr": 100,
                "description": "Article 4: ₹100 non-judicial stamp paper.",
            },
        },
    },
    "DL": {
        "state_name": "Delhi NCR",
        "governing_act": "Indian Stamp (Delhi Amendment) Act",
        "official_estamp_portal": "https://doris.delhigovt.nic.in",
        "estamp_provider": "Stock Holding Corporation of India (SHCIL Delhi)",
        "minimum_stamp_duty_inr": 100,
        "articles": {
            "RENT_AGREEMENT_RESIDENTIAL": {
                "title": "Residential Rent Agreement (<11 Months)",
                "rate_type": "PERCENTAGE",
                "percentage_of_annual_rent": 2.0,
                "registration_surcharge_inr": 1100,
                "description": "2% of the average annual rent for residential leases.",
            },
            "RENT_AGREEMENT_COMMERCIAL": {
                "title": "Commercial Lease Agreement",
                "rate_type": "PERCENTAGE",
                "percentage_of_annual_rent": 3.0,
                "registration_surcharge_inr": 1100,
                "description": "3% of the total rent consideration for commercial properties.",
            },
            "PARTNERSHIP_DEED": {
                "title": "Partnership Deed",
                "rate_type": "FLAT",
                "flat_inr": 200,
                "description": "Fixed ₹200 e-Stamp paper.",
            },
            "AFFIDAVIT_OR_NOC": {
                "title": "Affidavit / Landlord Consent",
                "rate_type": "FLAT",
                "flat_inr": 100,
                "description": "₹100 non-judicial e-Stamp paper.",
            },
        },
    },
}
