"""
Standardized Statutory Legal Agreement & Documentation Catalog.
Provides legally vetted boilerplate templates for MSME Law, Corporate IP,
Real Estate & Leases, and Citizen Rights / Tele-Law / RTI applications.
"""

from typing import Dict, List, Any
from app.schemas.journey import LegalTemplateResponse, LegalTemplateSummary


# ─────────────────────────────────────────────────────────────────────────────
# 1. Standard Partnership Deed (Karnataka)
# ─────────────────────────────────────────────────────────────────────────────
PARTNERSHIP_DEED_TEMPLATE = LegalTemplateResponse(
    template_id="standard-partnership-deed-karnataka",
    title="Partnership Deed for Commercial Enterprise",
    category="Business & MSME Law",
    statutory_act="Indian Partnership Act, 1932 & Karnataka Stamp Act, 1957",
    estamp_value="₹1,000 (Non-Judicial e-Stamp Paper)",
    description=(
        "Standard constitution deed for commercial and MSME partnerships specifying capital contributions, "
        "profit-sharing ratios, banking mandates, and dispute resolution mechanisms."
    ),
    default_fields={
        "partner1_name": "Rahul Sharma",
        "partner1_address": "#42, 100ft Ring Road, Indiranagar, Bengaluru - 560038",
        "partner2_name": "Priya Patel",
        "partner2_address": "#15, 5th Cross, Koramangala, Bengaluru - 560034",
        "firm_name": "Namma Kitchen Ventures",
        "principal_place": "Indiranagar, Bengaluru, Karnataka",
        "capital_amount": "₹5,00,000 (Rupees Five Lakhs Only)",
        "profit_ratio_partner1": "50%",
        "profit_ratio_partner2": "50%",
        "commencement_date": "1st day of April 2026",
    },
    clauses=[
        "1. NAME & COMMENCEMENT: The business shall be carried on under the firm name '{{firm_name}}' commencing from {{commencement_date}}.",
        "2. PRINCIPAL PLACE: The principal place of business shall be situated at {{principal_place}}.",
        "3. CAPITAL CONTRIBUTION: The initial capital of {{capital_amount}} shall be contributed equally by the Partners.",
        "4. PROFIT & LOSS SHARING: Net profits and losses shall be shared: {{partner1_name}} ({{profit_ratio_partner1}}) and {{partner2_name}} ({{profit_ratio_partner2}}).",
        "5. BANKING OPERATION: All bank accounts of the Firm shall be operated jointly by both Partners.",
        "6. ARBITRATION: Any disputes arising out of this Deed shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 in Bengaluru.",
    ],
    boilerplate_text="""THIS DEED OF PARTNERSHIP is made this {{commencement_date}} at Bengaluru, Karnataka:

BETWEEN:
1. {{partner1_name}}, residing at {{partner1_address}} (hereinafter called the "FIRST PARTY"),
AND
2. {{partner2_name}}, residing at {{partner2_address}} (hereinafter called the "SECOND PARTY").

WHEREAS the Parties desire to join together in partnership to carry on commercial food processing and restaurant operations under the Indian Partnership Act, 1932.

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. The partnership firm name shall be "{{firm_name}}".
2. The principal place of business shall be at {{principal_place}}.
3. The initial capital of {{capital_amount}} is contributed by the partners in equal proportions.
4. Profits and losses shall be divided: {{partner1_name}} ({{profit_ratio_partner1}}) and {{partner2_name}} ({{profit_ratio_partner2}}).
5. All statutory licenses (FSSAI, GST, Udyam, Shop & Establishment) shall be held in the name of the Firm.

IN WITNESS WHEREOF the Parties have set their hands on the day and year first above written.

FIRST PARTY: _______________________ ({{partner1_name}})
SECOND PARTY: ______________________ ({{partner2_name}})

WITNESS 1: _________________________
WITNESS 2: _________________________""",
    statutory_citations=[
        "Indian Partnership Act, 1932 (Section 4, 14, 30)",
        "Karnataka Stamp Act, 1957 (Article 40 — Partnership)",
    ],
)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Commercial Rent Agreement with Owner NOC
# ─────────────────────────────────────────────────────────────────────────────
COMMERCIAL_RENT_AGREEMENT_TEMPLATE = LegalTemplateResponse(
    template_id="commercial-rent-agreement-noc",
    title="Commercial Lease Agreement with Landlord NOC",
    category="Civil & Real Estate Law",
    statutory_act="Transfer of Property Act, 1882 & Registration Act, 1908",
    estamp_value="₹200 - ₹500 (Non-Judicial e-Stamp Paper)",
    description=(
        "Standard commercial premise tenancy deed with express landlord No-Objection Certificate (NOC) "
        "permitting commercial usage, FSSAI licensing, BBMP trade licensing, and GST registration."
    ),
    default_fields={
        "landlord_name": "Suresh Kumar Reddy",
        "landlord_address": "#101, Palm Meadows, Whitefield, Bengaluru - 560066",
        "tenant_name": "Rahul Sharma",
        "tenant_enterprise": "Namma Kitchen Ventures",
        "premises_address": "#42, Ground Floor, 100ft Ring Road, Indiranagar, Bengaluru - 560038",
        "monthly_rent": "₹35,000 (Rupees Thirty Five Thousand Only)",
        "security_deposit": "₹2,00,000 (Rupees Two Lakhs Only)",
        "lease_period": "11 Months",
        "permitted_use": "Commercial Kitchen / Food Delivery Establishment",
    },
    clauses=[
        "1. DEMISE: The Landlord leases the commercial premises at {{premises_address}} for a period of {{lease_period}}.",
        "2. RENT & DEPOSIT: Monthly rent of {{monthly_rent}} payable on or before 5th of each month. Refundable security deposit: {{security_deposit}}.",
        "3. LANDLORD NOC FOR LICENSES: The Landlord grants express NOC and authorization to the Tenant to apply for FSSAI, GSTIN, BBMP Trade License, Electricity Board power sanction, and MSME Udyam registration at the demised premises.",
        "4. RETURN OF SECURITY DEPOSIT: The security deposit of {{security_deposit}} shall be refunded in full without interest upon handover of peaceful possession within 7 days.",
    ],
    boilerplate_text="""COMMERCIAL LEASE AGREEMENT & LANDLORD NOC

THIS COMMERCIAL LEASE AGREEMENT is made on this day at Bengaluru, Karnataka:

BY AND BETWEEN:
{{landlord_name}}, residing at {{landlord_address}} (hereinafter referred to as the "LESSOR / LANDLORD"),
AND
{{tenant_name}}, representing {{tenant_enterprise}}, having address at {{premises_address}} (hereinafter referred to as the "LESSEE / TENANT").

1. PREMISES: The Landlord hereby leases the commercial shop/unit at {{premises_address}} for {{permitted_use}}.
2. TENURE & RENT: The lease is for {{lease_period}}. The monthly rent is {{monthly_rent}}.
3. SECURITY DEPOSIT: The Tenant has paid a refundable interest-free security deposit of {{security_deposit}}.
4. EXPRESS NO-OBJECTION CERTIFICATE (NOC): The Landlord hereby declares that he/she is the absolute owner of the scheduled premises and has NO OBJECTION to the Tenant obtaining electricity connection, water supply, FSSAI Food License, BBMP Health Trade License, and GST Registration in the name of {{tenant_enterprise}}.

LESSOR / OWNER: _____________________ ({{landlord_name}})
LESSEE / TENANT: ____________________ ({{tenant_name}})""",
    statutory_citations=[
        "Transfer of Property Act, 1882 (Section 105, 108)",
        "Registration Act, 1908 (Section 17)",
    ],
)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Formal Legal Notice for Security Deposit Recovery
# ─────────────────────────────────────────────────────────────────────────────
LEGAL_NOTICE_DEPOSIT_TEMPLATE = LegalTemplateResponse(
    template_id="landlord-security-deposit-legal-notice",
    title="Statutory Legal Notice for Recovery of Security Deposit",
    category="Citizen Rights & Dispute Redressal",
    statutory_act="Section 106, Transfer of Property Act, 1882 & Order 37 CPC",
    estamp_value="₹0 (Issued via Advocate / Registered Post AD)",
    description=(
        "Formal demand legal notice under Section 106 of Transfer of Property Act calling upon the landlord "
        "to refund withheld security deposit within 15 days, failing which summary recovery suit and criminal breach of trust proceedings follow."
    ),
    default_fields={
        "advocate_name": "Adv. Ramesh V. Iyer",
        "advocate_bar_no": "KAR/2841/2012",
        "client_name": "Rahul Sharma",
        "landlord_name": "Suresh Kumar Reddy",
        "landlord_address": "#101, Palm Meadows, Whitefield, Bengaluru - 560066",
        "premises_address": "#42, Ground Floor, 100ft Ring Road, Indiranagar, Bengaluru - 560038",
        "deposit_amount": "₹2,00,000",
        "vacation_date": "31st January 2026",
        "notice_period_days": "15 Days",
    },
    clauses=[
        "1. DEMAND: Refund outstanding security deposit of {{deposit_amount}} within {{notice_period_days}}.",
        "2. VACATION EVIDENCE: Proof of peaceful possession handover on {{vacation_date}} with zero utility dues.",
        "3. LEGAL ACTION: Initiation of Summary Suit under Order XXXVII CPC and civil recovery with 18% penal interest.",
    ],
    boilerplate_text="""REGISTERED POST WITH ACKNOWLEDGEMENT DUE (RPAD) / SPEED POST

LEGAL NOTICE UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882

Date: [CURRENT_DATE]
From:
{{advocate_name}}, Advocate
Enrollment No: {{advocate_bar_no}}
High Court of Karnataka, Bengaluru

To:
{{landlord_name}}
{{landlord_address}}

SUBJECT: DEMAND FOR IMMEDIATE REFUND OF SECURITY DEPOSIT OF {{deposit_amount}} REGARDING PREMISES AT {{premises_address}}.

Sir/Madam,
Under instructions from and on behalf of my client {{client_name}}, I do hereby serve upon you this formal Legal Notice:

1. That my client was the lawful tenant of your commercial premises at {{premises_address}} and paid a security deposit of {{deposit_amount}}.
2. That my client lawfully vacated the premises on {{vacation_date}}, handed over key possession, and cleared all electricity and water arrears.
3. That despite repeated requests and written demands, you have unlawfully and malafide withheld the security deposit of {{deposit_amount}}, amounting to criminal breach of trust (Section 316 BNS / 405 IPC) and civil default.

NOW THEREFORE, I hereby call upon you to refund the said sum of {{deposit_amount}} to my client within {{notice_period_days}} of receipt of this notice, failing which my client shall initiate legal recovery proceedings before the Competent Civil Court under Order XXXVII of the Code of Civil Procedure 1908 along with 18% per annum penal interest, holding you liable for all legal costs and consequences.

Yours faithfully,
{{advocate_name}}, Advocate""",
    statutory_citations=[
        "Transfer of Property Act, 1882 (Section 106)",
        "Code of Civil Procedure, 1908 (Order XXXVII — Summary Suits)",
        "Bharatiya Nyaya Sanhita, 2023 (Section 316 — Criminal Breach of Trust)",
    ],
)


# ─────────────────────────────────────────────────────────────────────────────
# 4. RTI Application under Section 6(1)
# ─────────────────────────────────────────────────────────────────────────────
RTI_APPLICATION_TEMPLATE = LegalTemplateResponse(
    template_id="rti-application-pio",
    title="Right to Information (RTI) Application Form A",
    category="Citizen Rights & Governance",
    statutory_act="Right to Information Act, 2005 (Section 6(1))",
    estamp_value="₹10 (Court Fee Stamp / IPO / Online Fee)",
    description=(
        "Standard statutory Form A application under Section 6(1) of RTI Act 2005 to Public Information Officers (PIO) "
        "requesting certified government records, inspection files, and status reports within the 30-day SLA."
    ),
    default_fields={
        "applicant_name": "Rahul Sharma",
        "applicant_address": "#42, 100ft Ring Road, Indiranagar, Bengaluru - 560038",
        "pio_designation": "Public Information Officer (PIO)",
        "department_name": "Bruhat Bengaluru Mahanagara Palike (BBMP)",
        "subject_matter": "Status of Health Trade License Application Ref No: BLR-TL-2026-8819",
        "specific_information_points": (
            "1. Daily progress report and movement of file from date of submission.\n"
            "2. Name and designation of the officials who handled the file.\n"
            "3. Certified copy of the inspection report submitted by the Health Inspector."
        ),
    },
    clauses=[
        "1. CITIZEN ELIGIBILITY: The applicant is a citizen of India under Section 3 of RTI Act 2005.",
        "2. STATUTORY TIME LIMIT: 30 days mandatory SLA under Section 7(1) of RTI Act 2005.",
        "3. STATUTORY FEE: ₹10 paid via Court Fee Stamp / Postal Order / Online portal.",
    ],
    boilerplate_text="""FORM A — APPLICATION FOR SEEKING INFORMATION UNDER THE RTI ACT, 2005
(Section 6(1) of the Right to Information Act, 2005)

To:
The {{pio_designation}}
{{department_name}}
Bengaluru, Karnataka

1. Full Name of the Applicant: {{applicant_name}}
2. Address for Communication: {{applicant_address}}
3. Particulars of Information Required:
   a. Subject Matter: {{subject_matter}}
   b. Period to which information relates: 2025-2026
   c. Specific Information Sought:
{{specific_information_points}}

4. Whether information is required by post or in person: Registered Post
5. Statutory Fee Details: ₹10 (Rupees Ten Only) affixed / paid online.

DECLARATION:
I state that I am a citizen of India and the information sought falls within the public authority's purview under the RTI Act 2005.

Date: [CURRENT_DATE]
Place: Bengaluru
Signature of Applicant: _____________________ ({{applicant_name}})""",
    statutory_citations=[
        "Right to Information Act, 2005 (Section 3, 6(1), 7(1))",
        "Karnataka Right to Information Rules, 2005",
    ],
)


# ─────────────────────────────────────────────────────────────────────────────
# 5. Form INC-9 Director Non-Conviction Declaration
# ─────────────────────────────────────────────────────────────────────────────
INC9_DECLARATION_TEMPLATE = LegalTemplateResponse(
    template_id="inc9-director-declaration",
    title="Form INC-9 Declaration by First Director",
    category="Corporate & Startup Law",
    statutory_act="Companies Act, 2013 (Section 7(1)(c)) & Companies Rules 2014",
    estamp_value="₹100 (Non-Judicial e-Stamp / Electronic Signature)",
    description="Statutory non-conviction and compliance declaration under Section 7(1)(c) of Companies Act for company incorporation via SPICe+.",
    default_fields={
        "director_name": "Rahul Sharma",
        "father_name": "Rajesh Sharma",
        "pan_number": "ABCPS1234F",
        "din_number": "09876543",
        "proposed_company": "Namma Tech Ventures Private Limited",
    },
    clauses=[
        "1. NON-CONVICTION: Not convicted of any offence in connection with the promotion, formation or management of any company.",
        "2. FRAUD DECLARATION: Not guilty of any fraud or misfeasance under Companies Act during preceding 5 years.",
    ],
    boilerplate_text="""FORM INC-9 — DECLARATION BY FIRST SUBSCRIBER / DIRECTOR
[Pursuant to Section 7(1)(c) of the Companies Act, 2013 and Rule 15 of the Companies (Incorporation) Rules, 2014]

I, {{director_name}}, S/o {{father_name}}, PAN: {{pan_number}}, DIN: {{din_number}}, do hereby solemnly declare that:

1. I am a subscriber to the memorandum / named as a first director in the articles of {{proposed_company}}.
2. I have not been convicted of any offence in connection with the promotion, formation or management of any company.
3. I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years.
4. All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.

Date: [CURRENT_DATE]
Place: Bengaluru
Signature: _______________________ ({{director_name}})""",
    statutory_citations=[
        "Companies Act, 2013 (Section 7(1)(c))",
        "Companies (Incorporation) Rules, 2014 (Rule 15)",
    ],
)


# Master Legal Templates Registry
MASTER_LEGAL_TEMPLATES: Dict[str, LegalTemplateResponse] = {
    "standard-partnership-deed-karnataka": PARTNERSHIP_DEED_TEMPLATE,
    "commercial-rent-agreement-noc": COMMERCIAL_RENT_AGREEMENT_TEMPLATE,
    "landlord-security-deposit-legal-notice": LEGAL_NOTICE_DEPOSIT_TEMPLATE,
    "rti-application-pio": RTI_APPLICATION_TEMPLATE,
    "inc9-director-declaration": INC9_DECLARATION_TEMPLATE,
}


def get_legal_template(template_id: str) -> LegalTemplateResponse:
    """Retrieve a legal template by ID."""
    if template_id not in MASTER_LEGAL_TEMPLATES:
        raise KeyError(f"Legal template '{template_id}' not found.")
    return MASTER_LEGAL_TEMPLATES[template_id]


def list_legal_template_summaries() -> List[LegalTemplateSummary]:
    """Retrieve summary catalog of all available legal templates."""
    summaries = []
    for tid, t in MASTER_LEGAL_TEMPLATES.items():
        summaries.append(
            LegalTemplateSummary(
                template_id=tid,
                title=t.title,
                category=t.category,
                statutory_act=t.statutory_act,
                estamp_value=t.estamp_value,
                description=t.description,
                download_url=f"/api/legal/templates/{tid}",
            )
        )
    return summaries
