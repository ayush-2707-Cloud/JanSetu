"""
Deterministic Statutory Life-Event Journey Node Blueprints.
Architected for FastAPI, Pydantic validation, and dependency resolution graph execution.
"""

from typing import Dict, List, Any
from app.schemas.journey import (
    JourneyBlueprint,
    NodeBlueprint,
    ActionType,
    StepStatus,
    Journey,
    Node,
    SubStep,
    DocumentRequirement,
)


# ─────────────────────────────────────────────────────────────────────────────
# 1. "Become a Certified Tourist Guide"
# Sequence: IITF Course -> Police Verification -> Ministry of Tourism Registration
# ─────────────────────────────────────────────────────────────────────────────
TOURIST_GUIDE_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "certified-tourist-guide",
    "title": "Become a Certified Incredible India Tourist Facilitator (IITF)",
    "goal_title": "Become a Certified Incredible India Tourist Facilitator (IITF)",
    "category": "Tourism & Hospitality",
    "jurisdiction": "Union / Ministry of Tourism, Government of India",
    "state": "National",
    "department": "Ministry of Tourism & National Council for Hotel Management (NCHMCT)",
    "description": (
        "End-to-end statutory certification pathway for obtaining an official, "
        "nationally-recognized Tourist Facilitator / Guide licence under the IITF initiative."
    ),
    "estimated_duration": "4-6 Weeks",
    "nodes": [
        {
            "step_id": "iitf-course",
            "step_number": 1,
            "title": "Incredible India Tourist Facilitator (IITF) Basic Certification Course",
            "description": (
                "Complete the mandatory online learning modules and pass the NCHMCT/Ministry "
                "of Tourism national assessment exam."
            ),
            "governing_department": "National Council for Hotel Management and Catering Technology (NCHMCT)",
            "prerequisites": [],
            "required_documents": [
                "10+2 / Higher Secondary Marksheet",
                "Aadhaar Card / UIDAI Identity Proof",
                "Recent Passport Size Photograph",
                "Category / Domicile Certificate (if seeking fee concession)"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://iitf.gov.in",
            "estimated_duration": "2-3 Weeks",
            "statutory_fee": "₹2,000 (General) / ₹1,000 (SC/ST/OBC/Women)",
            "legal_references": [
                "Incredible India Tourist Facilitator Certification (IITFC) Scheme Guidelines 2020",
                "Ministry of Tourism Order No. 2-TT.I(7)/2019"
            ]
        },
        {
            "step_id": "police-verification",
            "step_number": 2,
            "title": "Police Clearance & Character Verification Certificate (PCC)",
            "description": (
                "Statutory background verification and criminal history clearance through "
                "the local Police Commissionerate / MEA Passport Seva portal."
            ),
            "governing_department": "State Police Department & Ministry of External Affairs",
            "prerequisites": ["iitf-course"],
            "required_documents": [
                "IITF Course Completion Provisional Certificate",
                "Current Address Proof (Utility Bill / Registered Rent Agreement)",
                "Aadhaar Card",
                "Valid Indian Passport Copy"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://www.passportindia.gov.in/AppOnlineProject/online/pccOnlineApp",
            "estimated_duration": "7-10 Business Days",
            "statutory_fee": "₹500 (Police Department Portal / MEA PCC)",
            "legal_references": [
                "Section 157, Code of Criminal Procedure (CrPC) / BNSS",
                "Passport Rules 1980 (Police Clearance Guidelines)"
            ]
        },
        {
            "step_id": "tourism-ministry-registration",
            "step_number": 3,
            "title": "Ministry of Tourism Official Guide Licence & DigiLocker Badge Allotment",
            "description": (
                "Submit passing credentials and clean police clearance for final gazetted "
                "licence generation, regional jurisdiction assignment, and verifiable digital ID badge."
            ),
            "governing_department": "Regional Directorate, Ministry of Tourism, Government of India",
            "prerequisites": ["iitf-course", "police-verification"],
            "required_documents": [
                "IITF Final Passing Certificate & Roll Number",
                "Police Verification Certificate (PCC) Reference Number",
                "Registered Medical Practitioner Fitness Certificate",
                "Notarized Undertaking of Professional Ethical Conduct"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://tourism.gov.in/guidelines",
            "estimated_duration": "5 Business Days",
            "statutory_fee": "₹0 (Included in certification enrollment)",
            "legal_references": [
                "Ministry of Tourism Regional Tourist Guide Guidelines",
                "Digital India DigiLocker Integration Standards Act"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 2. "Study Abroad"
# Sequence: Degree Verification -> MEA Apostille -> Forex/LRS Declaration -> Visa Checklist
# ─────────────────────────────────────────────────────────────────────────────
STUDY_ABROAD_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "study-abroad-global",
    "title": "Study Abroad: Academic Verification, Apostille & Visa Roadmap",
    "goal_title": "Study Abroad: Academic Verification, Apostille & Visa Roadmap",
    "category": "International Education",
    "jurisdiction": "National / Ministry of External Affairs & Reserve Bank of India",
    "state": "National",
    "department": "Association of Indian Universities, MEA & Reserve Bank of India",
    "description": (
        "Statutory compliance roadmap for Indian students pursuing international degrees: "
        "covers HRD state authentication, MEA Hague Apostille, RBI Forex LRS compliance, and visa filing."
    ),
    "estimated_duration": "3-6 Weeks",
    "nodes": [
        {
            "step_id": "degree-verification",
            "step_number": 1,
            "title": "State HRD / University Educational Document Authentication",
            "description": (
                "Attestation of educational certificates from the issuing state's Higher Education "
                "Department (HRD) or Regional Authentication Centre (RAC) via eSanad."
            ),
            "governing_department": "State Higher Education Department & Association of Indian Universities (AIU)",
            "prerequisites": [],
            "required_documents": [
                "Original Degree / Diploma Certificate",
                "Consolidated Marksheet / Transcripts (All Semesters)",
                "Official University Verification Letter",
                "Government Photo ID (Aadhaar / Passport)"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://eSanad.nic.in",
            "estimated_duration": "4-7 Business Days",
            "statutory_fee": "₹500 - ₹1,500 (Varies by State University / Board)",
            "legal_references": [
                "UGC (Equivalence of Degrees) Regulations",
                "Ministry of Education e-Sanad Authentication Guidelines"
            ]
        },
        {
            "step_id": "mea-apostille",
            "step_number": 2,
            "title": "Ministry of External Affairs (MEA) Hague Apostille Sticker & Attestation",
            "description": (
                "Procure the international Hague Apostille verification sticker (1961 Convention) "
                "from MEA to confer legal recognition across 120+ member countries."
            ),
            "governing_department": "CPV Division, Ministry of External Affairs, Government of India",
            "prerequisites": ["degree-verification"],
            "required_documents": [
                "State HRD-Authenticated Original Degree Certificate",
                "Passport Copy (Front, Back & Visa Page)",
                "eSanad Online Submission Acknowledgment Slip",
                "Foreign University Unconditional Offer / Acceptance Letter"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://legalize.mea.gov.in",
            "estimated_duration": "3-5 Business Days",
            "statutory_fee": "₹50 (Statutory MEA Stamp) + ₹90 (Outsourced Service Agency Fee)",
            "legal_references": [
                "Hague Apostille Convention of 5 October 1961 (Abolishing the Requirement of Legalisation)",
                "MEA CPV Division Legalization Circular 2019"
            ]
        },
        {
            "step_id": "forex-lrs-declaration",
            "step_number": 3,
            "title": "Forex Outward Remittance & RBI Liberalised Remittance Scheme (LRS) Form A2",
            "description": (
                "Comply with RBI foreign exchange regulations under LRS (up to USD $250,000/FY) "
                "for international tuition and living cost wire transfer."
            ),
            "governing_department": "Foreign Exchange Department, Reserve Bank of India (RBI) & Authorised Dealer Bank",
            "prerequisites": ["degree-verification", "mea-apostille"],
            "required_documents": [
                "Form A2 & LRS Declaration Form (Duly Signed)",
                "Official Foreign University Tuition Invoice & Wire Instructions",
                "Student Visa Copy or Form I-20 / CAS Statement",
                "PAN Card of Student / Remitter & 1-Year Bank Statement"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://rbi.org.in/scripts/BS_ViewMasCirculardetails.aspx?id=12140",
            "estimated_duration": "2 Business Days",
            "statutory_fee": "₹0 (TCS Exempt up to ₹7 Lakh if funded via approved education loan under Sec 80E)",
            "legal_references": [
                "Foreign Exchange Management Act (FEMA), 1999",
                "RBI Master Direction - Liberalised Remittance Scheme (LRS)",
                "Section 206C(1G) Income Tax Act (TCS Provisions on Remittance)"
            ]
        },
        {
            "step_id": "visa-checklist",
            "step_number": 4,
            "title": "Student Visa (Subclass 500 / F-1 / Tier 4) Statutory Filing & Biometrics",
            "description": (
                "Submit biometric identifiers, proof of financial solvency, health insurance (OSHC/IHS), "
                "and apostilled documents to the destination embassy / VFS Global center."
            ),
            "governing_department": "Destination Country Embassy & VFS Global / Ministry of External Affairs",
            "prerequisites": ["degree-verification", "mea-apostille", "forex-lrs-declaration"],
            "required_documents": [
                "Original Passport (Valid for minimum 6 months beyond intended stay)",
                "MEA-Apostilled Academic Records & Language Test Scorecard (IELTS/TOEFL)",
                "Bank Solvency Certificate / Education Loan Sanction Letter",
                "Swift MT103 Wire Transfer Confirmation for Tuition Fee",
                "Overseas Student Health Cover (OSHC) / Medical Examination Report"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://visa.vfsglobal.com/ind/en",
            "estimated_duration": "10-15 Business Days",
            "statutory_fee": "Country Dependent (e.g., US $185 + SEVIS $350 / UK £490 / AUS A$710)",
            "legal_references": [
                "Immigration and Nationality Act / UK Visas & Immigration Regulations",
                "Emigration Act 1983 (PCC & Emigration Clearance Rules)"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 3. "Startup & Seed Funding"
# Sequence: Entity Formation -> DPIIT Recognition -> SISFS Grant Application -> Current Bank Account
# ─────────────────────────────────────────────────────────────────────────────
STARTUP_FUNDING_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "startup-seed-funding",
    "title": "Startup Incorporation, DPIIT Recognition & Seed Fund Scheme (SISFS)",
    "goal_title": "Startup Incorporation, DPIIT Recognition & Seed Fund Scheme (SISFS)",
    "category": "Business & Entrepreneurship",
    "jurisdiction": "Union / Ministry of Corporate Affairs & DPIIT",
    "state": "National",
    "department": "Ministry of Corporate Affairs (MCA) & Department for Promotion of Industry and Internal Trade (DPIIT)",
    "description": (
        "Comprehensive institutional roadmap for early-stage tech ventures: covers SPICe+ "
        "company registration, Startup India DPIIT recognition, up to ₹50 Lakh SISFS grant, and bank account setup."
    ),
    "estimated_duration": "3-5 Weeks",
    "nodes": [
        {
            "step_id": "entity-formation",
            "step_number": 1,
            "title": "SPICe+ Company Incorporation (Private Limited / LLP Registration)",
            "description": (
                "Name reservation, DIN allotment, and Certificate of Incorporation (COI) "
                "procurement via the Ministry of Corporate Affairs SPICe+ integrated web portal."
            ),
            "governing_department": "Ministry of Corporate Affairs (MCA), Government of India",
            "prerequisites": [],
            "required_documents": [
                "Digital Signature Certificate (DSC Class 3) of Directors",
                "Director Identification Number (DIN / SPICe+ Integrated)",
                "Memorandum of Association (MOA - Form INC-33)",
                "Articles of Association (AOA - Form INC-34)",
                "Registered Office Address Proof & Property Owner NOC (Form INC-22)"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://www.mca.gov.in/content/mca/global/en/home.html",
            "estimated_duration": "3-5 Business Days",
            "statutory_fee": "₹0 MCA Govt Fee (for authorized capital up to ₹15 Lakh) + State Stamp Duty (₹1,000-₹3,000)",
            "legal_references": [
                "Companies Act 2013, Section 7 & Section 398",
                "Companies (Incorporation) Rules, 2014 - SPICe+ Integrated Filing"
            ]
        },
        {
            "step_id": "dpiit-recognition",
            "step_number": 2,
            "title": "Startup India DPIIT Recognition & Tax Exemption Certificate",
            "description": (
                "Attain official DPIIT Certificate of Recognition on the National Startup Portal "
                "to unlock self-certification, IPR fast-tracking, and Section 80-IAC / 56(2)(viib) benefits."
            ),
            "governing_department": "Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce",
            "prerequisites": ["entity-formation"],
            "required_documents": [
                "Certificate of Incorporation (COI) & Company PAN",
                "Brief Pitch Deck & 2-Minute Product/Service Explainer Video",
                "Proof of Innovation & Scalability Statement",
                "Letter of Recommendation / Incubator Reference (Optional)"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://www.startupindia.gov.in/content/sih/en/startupgov/dpiit-recognition.html",
            "estimated_duration": "2-4 Business Days",
            "statutory_fee": "₹0 (Free government service)",
            "legal_references": [
                "DPIIT Notification G.S.R. 127(E) dated 19th February 2019",
                "Section 80-IAC and Section 56(2)(viib) of Income Tax Act 1961"
            ]
        },
        {
            "step_id": "sisfs-grant-application",
            "step_number": 3,
            "title": "Startup India Seed Fund Scheme (SISFS) Up to ₹50 Lakh Grant/Debt Application",
            "description": (
                "Apply to DPIIT-approved incubators for proof of concept, prototype development, "
                "product trials, market entry, and commercialization funding."
            ),
            "governing_department": "DPIIT & Expert Advisory Committee (EAC) Incubator Network",
            "prerequisites": ["entity-formation", "dpiit-recognition"],
            "required_documents": [
                "Valid DPIIT Startup Recognition Certificate Number",
                "Incubator Selection Preference (Select up to 3 approved incubators)",
                "Detailed Milestone-Linked Fund Utilization Plan & Budget",
                "Working Prototype / Proof of Concept Demonstration Link",
                "Cap Table & Shareholding Structure Declaration"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://seedfund.startupindia.gov.in",
            "estimated_duration": "14-21 Business Days",
            "statutory_fee": "₹0 (Zero application fee)",
            "legal_references": [
                "Startup India Seed Fund Scheme (SISFS) Operational Guidelines 2021",
                "DPIIT Scheme Order F. No. 5(17)/2020-SIA"
            ]
        },
        {
            "step_id": "current-bank-account",
            "step_number": 4,
            "title": "Commercial Current Bank Account Opening with Authorized Dealer (AD) Code",
            "description": (
                "Open corporate current bank account, enable AGILE-PRO-S integrated banking, "
                "and register Authorized Dealer (AD) code for foreign remittance and grant disbursement."
            ),
            "governing_department": "Reserve Bank of India & Scheduled Commercial Bank",
            "prerequisites": ["entity-formation", "dpiit-recognition", "sisfs-grant-application"],
            "required_documents": [
                "Board Resolution for Bank Account Opening & Signing Mandate",
                "Certificate of Incorporation (COI), MOA and AOA Copy",
                "Company PAN & GSTIN Registration Certificate",
                "DPIIT Startup India Recognition Certificate",
                "KYC Documents & Passport / Aadhaar of All Authorized Signatory Directors"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://www.rbi.org.in",
            "estimated_duration": "2-3 Business Days",
            "statutory_fee": "₹0 (Zero opening charges; initial deposit required)",
            "legal_references": [
                "RBI Master Direction - Know Your Customer (KYC) Direction, 2016",
                "MCA AGILE-PRO-S Integrated Banking Notification"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 4. "MSME / Food Business" (FSSAI & Udyam)
# Sequence: Identity Verification -> Udyam Registration -> FSSAI Basic License -> Current Business Account
# ─────────────────────────────────────────────────────────────────────────────
MSME_FOOD_BUSINESS_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "food-business-license",
    "title": "Start a Food Business & MSME: FSSAI License, Udyam & Banking",
    "goal_title": "Start a Food Business & MSME: FSSAI License, Udyam & Banking",
    "category": "MSME & Food Enterprises",
    "jurisdiction": "State / FSSAI & Ministry of Micro, Small and Medium Enterprises",
    "state": "Karnataka / Multi-State",
    "department": "Food Safety and Standards Authority of India (FSSAI) & Ministry of MSME",
    "description": (
        "Complete statutory pathway for establishing an MSME food enterprise or cloud kitchen: "
        "covers Aadhaar/PAN identity attestation, Udyam MSME registration, FSSAI FoSCoS food licence, and commercial banking."
    ),
    "estimated_duration": "2-3 Weeks",
    "nodes": [
        {
            "step_id": "identity-verification",
            "step_number": 1,
            "title": "Proprietor / Partner Identity & Aadhaar OTP Verification",
            "description": (
                "Statutory identity and address authentication via DigiLocker / UIDAI Aadhaar "
                "OTP verification for business owner KYC."
            ),
            "governing_department": "UIDAI & Income Tax Department",
            "prerequisites": [],
            "required_documents": [
                "Proprietor Aadhaar Card (Linked with active Mobile Number)",
                "Individual PAN Card",
                "Passport Size Photograph",
                "Electricity Bill / Property Tax Receipt of Business Premises"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://myaadhaar.uidai.gov.in",
            "estimated_duration": "1 Business Day",
            "statutory_fee": "₹0 (Statutory free)",
            "legal_references": [
                "Aadhaar (Targeted Delivery of Financial and Other Subsidies) Act, 2016",
                "Prevention of Money Laundering (Maintenance of Records) Rules, 2005"
            ]
        },
        {
            "step_id": "udyam-registration",
            "step_number": 2,
            "title": "Udyam MSME National Registration & Certificate Allotment",
            "description": (
                "Paperless online MSME registration on the official Udyam portal to obtain "
                "the permanent 19-digit Udyam Registration Number (URN) for priority sector benefits."
            ),
            "governing_department": "Ministry of Micro, Small & Medium Enterprises (MSME)",
            "prerequisites": ["identity-verification"],
            "required_documents": [
                "Aadhaar Number of Entrepreneur",
                "Business PAN & GSTIN (if applicable)",
                "Bank Account Number & IFSC Code",
                "National Industry Classification (NIC) 5-Digit Food Code (e.g., 56102)"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://udyamregistration.gov.in",
            "estimated_duration": "2-3 Business Days",
            "statutory_fee": "₹0 (Completely free; no government charge)",
            "legal_references": [
                "Micro, Small and Medium Enterprises Development Act, 2006 (MSMED Act)",
                "Ministry of MSME Gazette Notification S.O. 2119(E) dated 26th June 2020"
            ]
        },
        {
            "step_id": "fssai-license",
            "step_number": 3,
            "title": "FSSAI Basic Registration / State Food Safety License (FoSCoS)",
            "description": (
                "Procure statutory food safety licence/registration via the FoSCoS portal: "
                "mandatory before manufacturing, packing, storing, or serving food products."
            ),
            "governing_department": "Food Safety and Standards Authority of India (FSSAI), Ministry of Health",
            "prerequisites": ["identity-verification", "udyam-registration"],
            "required_documents": [
                "Udyam Registration Certificate Copy",
                "Business Layout Plan & Equipment List",
                "Food Safety Management System (FSMS) Plan or Undertaking",
                "Water Test Potability Report from NABL-accredited Lab (for State License)",
                "Medical Fitness Certificates of Food Handlers"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://foscos.fssai.gov.in",
            "estimated_duration": "5-10 Business Days",
            "statutory_fee": "₹100/yr (Basic Registration up to ₹12 Lakh turnover) / ₹2,000/yr (State License)",
            "legal_references": [
                "Food Safety and Standards Act, 2006 (Section 31)",
                "Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011"
            ]
        },
        {
            "step_id": "current-business-account",
            "step_number": 4,
            "title": "Commercial Business Current Account & GSTIN Invoicing Setup",
            "description": (
                "Open institutional current bank account using FSSAI license and Udyam certificate, "
                "and configure GSTIN e-invoicing for business transactions."
            ),
            "governing_department": "Reserve Bank of India & Commercial Scheduled Banks",
            "prerequisites": ["identity-verification", "udyam-registration", "fssai-license"],
            "required_documents": [
                "Valid FSSAI Registration / State License Copy",
                "Official Udyam MSME Registration Certificate",
                "Entity PAN Card & GST Registration Certificate (if turnover > ₹20/40 Lakh)",
                "Proof of Business Address (Lease Agreement + Electricity Bill)",
                "KYC Documents of Authorized Signatories"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://www.rbi.org.in",
            "estimated_duration": "2-3 Business Days",
            "statutory_fee": "₹0 (Zero opening fee; minimum monthly average balance applicable)",
            "legal_references": [
                "RBI KYC Master Direction 2016 (Current Account Guidelines)",
                "Central Goods and Services Tax Act, 2017 (Section 22)"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 5. "Higher Education Loan (PM-Vidyalaxmi)"
# Sequence: Marksheet Verification -> Income Certificate -> Scheme Discovery -> Bank Application
# ─────────────────────────────────────────────────────────────────────────────
PM_VIDYALAXMI_LOAN_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "pm-vidyalaxmi-loan",
    "title": "Higher Education Loan: PM-Vidyalaxmi Portal & Collateral-Free Subsidy",
    "goal_title": "Higher Education Loan: PM-Vidyalaxmi Portal & Collateral-Free Subsidy",
    "category": "Higher Education & Financial Aid",
    "jurisdiction": "National / Department of Higher Education & IBA",
    "state": "National",
    "department": "Department of Higher Education, Ministry of Education & Indian Banks' Association (IBA)",
    "description": (
        "Comprehensive statutory pathway for securing subsidized, collateral-free higher education loans "
        "up to ₹7.5 - ₹10 Lakh with Central Sector Interest Subsidy (CSIS) via the single-window PM-Vidyalaxmi platform."
    ),
    "estimated_duration": "2-4 Weeks",
    "nodes": [
        {
            "step_id": "marksheet-verification",
            "step_number": 1,
            "title": "Academic Qualification & Admission Offer Attestation",
            "description": (
                "Verify Class 10/12 marksheets and entrance rank (JEE/NEET/CUET/GATE) or official "
                "merit admission offer letter via DigiLocker / National Academic Depository (NAD)."
            ),
            "governing_department": "National Academic Depository (NAD) & CBSE / State Examination Boards",
            "prerequisites": [],
            "required_documents": [
                "Class 10th & 12th Passing Marksheets (DigiLocker Verified)",
                "Undergraduate / Entrance Exam Rank Card",
                "Official College/University Admission Letter with Fee Structure Breakdown",
                "Student Aadhaar Card & PAN Card"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://nad.gov.in",
            "estimated_duration": "1 Business Day",
            "statutory_fee": "₹0 (Digital verification free via DigiLocker)",
            "legal_references": [
                "UGC (Establishment and Operation of Academic Bank of Credits) Regulations, 2021",
                "National Education Policy 2020 (Digital Credentialing Framework)"
            ]
        },
        {
            "step_id": "income-certificate",
            "step_number": 2,
            "title": "Tahsildar Family Income Certificate & EWS / Category Attestation",
            "description": (
                "Procure revenue authority-attested annual family income certificate to claim "
                "full interest moratorium subsidy under the Central Sector Interest Subsidy (CSIS) scheme."
            ),
            "governing_department": "State Revenue Department / Tahsildar / e-District Portal",
            "prerequisites": ["marksheet-verification"],
            "required_documents": [
                "Salary Slips / Form 16 / ITR of Parents / Guardian",
                "Ration Card / BPL Card (if applicable)",
                "Land Revenue Records / Village Officer Income Statement",
                "Self-Declaration Affidavit of Family Annual Income"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://edistrict.gov.in",
            "estimated_duration": "3-7 Business Days",
            "statutory_fee": "₹25 - ₹50 (State e-District processing fee)",
            "legal_references": [
                "Central Sector Interest Subsidy (CSIS) Guidelines 2022",
                "Ministry of Education Order on Economically Weaker Section (EWS) Verification"
            ]
        },
        {
            "step_id": "scheme-discovery",
            "step_number": 3,
            "title": "PM-Vidyalaxmi & Credit Guarantee Scheme (CGFSEL) Eligibility Discovery",
            "description": (
                "Map student profile against 40+ scheduled public & private banks for collateral-free "
                "loans up to ₹7.5 Lakh under the Credit Guarantee Fund Scheme for Education Loans (CGFSEL)."
            ),
            "governing_department": "National Credit Guarantee Trustee Company (NCGTC) & Ministry of Finance",
            "prerequisites": ["marksheet-verification", "income-certificate"],
            "required_documents": [
                "Verified Family Income Certificate",
                "College Course Approval Recognition Letter (AICTE / UGC / NIRF Ranking)",
                "Detailed Year-Wise Fee Structure from Registrar / Bursar",
                "Co-Borrower (Parent) KYC Documents & 6-Month Bank Statement"
            ],
            "action_type": ActionType.FORM_FILL,
            "official_portal_url": "https://www.vidyalakshmi.co.in",
            "estimated_duration": "1-2 Business Days",
            "statutory_fee": "₹0 (Zero portal registration fee)",
            "legal_references": [
                "Model Educational Loan Scheme by Indian Banks' Association (IBA)",
                "Credit Guarantee Fund Scheme for Education Loans (CGFSEL) Notification"
            ]
        },
        {
            "step_id": "bank-loan-application",
            "step_number": 4,
            "title": "Digital Loan Application Submission & In-Principle Bank Disbursal",
            "description": (
                "Submit common education loan application form (CELAF) to preferred banks with "
                "digital e-sign and track real-time appraisal, sanction letter, and semester fee disbursal."
            ),
            "governing_department": "Participating Member Banks & Indian Banks' Association",
            "prerequisites": ["marksheet-verification", "income-certificate", "scheme-discovery"],
            "required_documents": [
                "Common Educational Loan Application Form (CELAF) Copy",
                "Verified Admission Letter & Bonafide Certificate",
                "Bank Sanction Agreement & Electronic Mandate (e-NACH)",
                "Promissory Note & Co-Borrower Undertaking"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://www.vidyalakshmi.co.in/Students/",
            "estimated_duration": "7-14 Business Days",
            "statutory_fee": "₹0 (No processing fee for education loans up to ₹10 Lakh in priority sector)",
            "legal_references": [
                "Reserve Bank of India Master Circular - Priority Sector Lending (Education)",
                "IBA Guidelines on Education Loans Disbursal Timelines"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 6. "Buy an Apartment / Plot (RERA & Sub-Registrar)"
# Sequence: RERA Verification -> Encumbrance Certificate -> Sub-Registrar Registration
# ─────────────────────────────────────────────────────────────────────────────
BUYING_FLAT_RERA_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "buying-flat-rera",
    "title": "Buy an Apartment / Plot (RERA & Sub-Registrar)",
    "goal_title": "Buy an Apartment / Plot (RERA & Sub-Registrar)",
    "category": "Property & Real Estate",
    "jurisdiction": "State / Real Estate Regulatory Authority & Revenue Department",
    "state": "Karnataka / State",
    "department": "State Revenue Department & Real Estate Regulatory Authority (RERA)",
    "description": (
        "Statutory property acquisition roadmap: RERA project search, 30-year Encumbrance "
        "Certificate, e-Stamp duty payment and Sub-Registrar sale deed biometric registration."
    ),
    "estimated_duration": "15-30 Business Days",
    "nodes": [
        {
            "step_id": "prop-1",
            "step_number": 1,
            "title": "RERA Project Registration & Builder Sanction Verification",
            "description": "Verify builder RERA registration number and municipal building plan approval sanction order.",
            "governing_department": "Real Estate Regulatory Authority (RERA)",
            "prerequisites": [],
            "required_documents": [
                "RERA Project Approval Certificate",
                "Sanctioned Building Plan Copy",
                "Commencement Certificate (CC)"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://rera.karnataka.gov.in",
            "estimated_duration": "1-2 Days",
            "statutory_fee": "₹0 (Public RERA Search)",
            "legal_references": [
                "Real Estate (Regulation and Development) Act 2016 (Sec 3, 4)",
                "State Real Estate General Rules 2017"
            ]
        },
        {
            "step_id": "prop-2",
            "step_number": 2,
            "title": "30-Year Encumbrance Certificate (EC) Title Search",
            "description": "Fetch online Form 15 non-encumbrance certificate via Kaveri / DigiLocker to verify clear title.",
            "governing_department": "Department of Stamps and Registration",
            "prerequisites": ["prop-1"],
            "required_documents": [
                "Property Khata Certificate / Extract",
                "Mother Deed & Prior Sale Deeds (Past 30 Years)",
                "Aadhaar / Identity Proof of Buyer"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://kaverionline.karnataka.gov.in",
            "estimated_duration": "3-5 Business Days",
            "statutory_fee": "₹500 (Search Fee & Certified Copy)",
            "legal_references": [
                "Registration Act 1908 (Section 57)",
                "Transfer of Property Act 1882"
            ]
        },
        {
            "step_id": "prop-3",
            "step_number": 3,
            "title": "e-Stamping & Sub-Registrar Biometric Sale Deed Registration",
            "description": "Pay stamp duty via SHCIL and execute sale deed before the jurisdictional Sub-Registrar.",
            "governing_department": "Jurisdictional Sub-Registrar Office",
            "prerequisites": ["prop-1", "prop-2"],
            "required_documents": [
                "e-Stamp Certificate (SHCIL / Kaveri)",
                "Original Drafted Sale Deed Agreement",
                "Two Witness Identity Proofs (Aadhaar/PAN)",
                "PAN Card of Buyer and Seller"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://kaverionline.karnataka.gov.in",
            "estimated_duration": "1-2 Business Days",
            "statutory_fee": "5% Stamp Duty + 1% Registration Fee",
            "legal_references": [
                "Karnataka Stamp Act 1957",
                "Indian Registration Act 1908 (Section 17)"
            ]
        }
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# 7. "Aadhaar Address & Mobile Number Update (UIDAI)"
# Sequence: OTP Authentication -> Address Proof Upload -> URN Verification
# ─────────────────────────────────────────────────────────────────────────────
AADHAAR_UPDATE_BLUEPRINT: Dict[str, Any] = {
    "journey_id": "aadhaar-update",
    "title": "Aadhaar Address & Mobile Number Update (UIDAI)",
    "goal_title": "Aadhaar Address & Mobile Number Update (UIDAI)",
    "category": "Identity & Civic Documents",
    "jurisdiction": "Central / Unique Identification Authority of India (UIDAI)",
    "state": "National",
    "department": "Unique Identification Authority of India (UIDAI)",
    "description": (
        "Official statutory identity update roadmap: Online demographic address modification, "
        "DigiLocker address proof attachment, and Head of Family (HoF) consent verification."
    ),
    "estimated_duration": "3-5 Business Days",
    "nodes": [
        {
            "step_id": "aadh-1",
            "step_number": 1,
            "title": "UIDAI OTP Authentication & Demographic Record Fetch",
            "description": "Log in to myAadhaar portal using linked mobile OTP and retrieve current demographic XML record.",
            "governing_department": "Unique Identification Authority of India (UIDAI)",
            "prerequisites": [],
            "required_documents": [
                "12-Digit Aadhaar Number",
                "Active Registered Mobile Number for OTP"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://myaadhaar.uidai.gov.in",
            "estimated_duration": "Instant (5 Mins)",
            "statutory_fee": "₹50 (Online Update Fee)",
            "legal_references": [
                "Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act 2016",
                "Aadhaar (Enrolment and Update) Regulations 2016"
            ]
        },
        {
            "step_id": "aadh-2",
            "step_number": 2,
            "title": "Standard Address Proof Attachment via DigiLocker",
            "description": "Submit DigiLocker-verified utility bill, passport, rent agreement, or bank passbook as valid address proof.",
            "governing_department": "UIDAI Authentication Ecosystem",
            "prerequisites": ["aadh-1"],
            "required_documents": [
                "Valid POA Document (Passport, Bank Statement, Utility Bill)",
                "Self-Declaration Form (if using Head of Family flow)"
            ],
            "action_type": ActionType.MOCK_VERIFY,
            "official_portal_url": "https://myaadhaar.uidai.gov.in",
            "estimated_duration": "1-2 Days",
            "statutory_fee": "₹0 (Included in Base Update Fee)",
            "legal_references": [
                "UIDAI List of Acceptable Supporting Documents for Aadhaar Enrolment & Update 2024"
            ]
        },
        {
            "step_id": "aadh-3",
            "step_number": 3,
            "title": "URN Tracking & e-Aadhaar Digital Download",
            "description": "Track 14-digit Update Request Number (URN) and download updated cryptographically-signed e-Aadhaar.",
            "governing_department": "UIDAI",
            "prerequisites": ["aadh-1", "aadh-2"],
            "required_documents": [
                "14-Digit URN Slip",
                "Aadhaar Number"
            ],
            "action_type": ActionType.PORTAL_REDIRECT,
            "official_portal_url": "https://myaadhaar.uidai.gov.in/gen-download-eaadhaar",
            "estimated_duration": "2-3 Days",
            "statutory_fee": "₹0 (Free Digital Download)",
            "legal_references": [
                "Information Technology Act 2000 (Section 4 — Legal Recognition of Electronic Records)"
            ]
        }
    ]
}


# Master repository dictionary
MASTER_BLUEPRINTS: Dict[str, Dict[str, Any]] = {
    "certified-tourist-guide": TOURIST_GUIDE_BLUEPRINT,
    "tour-guide": TOURIST_GUIDE_BLUEPRINT,
    "tourist-travel": TOURIST_GUIDE_BLUEPRINT,
    "study-abroad-global": STUDY_ABROAD_BLUEPRINT,
    "study-abroad": STUDY_ABROAD_BLUEPRINT,
    "job-abroad": STUDY_ABROAD_BLUEPRINT,
    "world-tour": STUDY_ABROAD_BLUEPRINT,
    "startup-seed-funding": STARTUP_FUNDING_BLUEPRINT,
    "startup-idea": STARTUP_FUNDING_BLUEPRINT,
    "food-business-license": MSME_FOOD_BUSINESS_BLUEPRINT,
    "msme-food-business": MSME_FOOD_BUSINESS_BLUEPRINT,
    "cloud-kitchen-blr": MSME_FOOD_BUSINESS_BLUEPRINT,
    "pm-vidyalaxmi-loan": PM_VIDYALAXMI_LOAN_BLUEPRINT,
    "higher-education-loan": PM_VIDYALAXMI_LOAN_BLUEPRINT,
    "edu-loan-india": PM_VIDYALAXMI_LOAN_BLUEPRINT,
    "buying-flat-rera": BUYING_FLAT_RERA_BLUEPRINT,
    "property-registration": BUYING_FLAT_RERA_BLUEPRINT,
    "aadhaar-update": AADHAAR_UPDATE_BLUEPRINT,
    "identity-aadhaar": AADHAAR_UPDATE_BLUEPRINT,
}


def get_validated_blueprint(journey_id: str) -> JourneyBlueprint:
    """Retrieve and Pydantic-validate a journey blueprint by ID."""
    if journey_id not in MASTER_BLUEPRINTS:
        raise KeyError(f"Blueprint for journey_id '{journey_id}' not found.")
    return JourneyBlueprint.model_validate(MASTER_BLUEPRINTS[journey_id])


def get_all_validated_blueprints() -> List[JourneyBlueprint]:
    """Retrieve all unique validated blueprints in the repository."""
    unique_ids = [
        "certified-tourist-guide",
        "study-abroad-global",
        "startup-seed-funding",
        "food-business-license",
        "pm-vidyalaxmi-loan",
        "buying-flat-rera",
        "aadhaar-update",
    ]
    return [JourneyBlueprint.model_validate(MASTER_BLUEPRINTS[jid]) for jid in unique_ids]


# ─────────────────────────────────────────────────────────────────────────────
# Hierarchical Workflow Seeded Journeys (Journey -> Node -> SubStep)
# ─────────────────────────────────────────────────────────────────────────────

HIERARCHICAL_MSME_FOOD_JOURNEY: Journey = Journey(
    journey_id="msme-cloud-kitchen-food",
    title="MSME Cloud Kitchen & Food Business",
    category="Business & MSME",
    department="Ministry of MSME, FSSAI & Bruhat Bengaluru Mahanagara Palike (BBMP)",
    jurisdiction="State / Municipal (Karnataka)",
    state="Karnataka",
    description=(
        "Hierarchical multi-tier statutory clearance roadmap for establishing a commercial cloud kitchen, "
        "bakery, or MSME food enterprise: covers identity verification, zero-cost Udyam MSME certificate, "
        "FSSAI FoSCoS registration, municipal health trade license, and GST aggregator compliance."
    ),
    estimated_duration="25-35 Business Days",
    overall_progress_percentage=0,
    completed_nodes_count=0,
    total_nodes_count=4,
    current_active_node_id="node-udyam-reg",
    nodes=[
        Node(
            node_id="node-udyam-reg",
            step_number=1,
            title="Identity Verification & Udyam MSME Registration",
            description="Establish proprietor identity and procure zero-cost national MSME recognition.",
            governing_department="Ministry of Micro, Small and Medium Enterprises (MSME)",
            prerequisites=[],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://udyamregistration.gov.in",
            status=StepStatus.IN_PROGRESS,
            is_unlocked=True,
            statutory_fee="₹0 (Government Statutory Free Service)",
            legal_references=["MSMED Act 2006 (Section 7, 8)", "Gazette Notification S.O. 2119(E) 2020"],
            estimated_duration="1-2 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-aadhaar-ekyc",
                    substep_number=1,
                    title="Proprietor Aadhaar & PAN e-KYC Verification",
                    description="Authenticate enterprise owner identity through UIDAI OTP and fetch PAN record via DigiLocker.",
                    is_mandatory=True,
                    status=StepStatus.IN_PROGRESS,
                    official_portal_url="https://myaadhaar.uidai.gov.in",
                    legal_template_url="https://udyamregistration.gov.in/docs/Aadhaar_Verification_Guide.pdf",
                    statutory_form_code="UIDAI-EKYC-01",
                    estimated_duration="Instant (5 Mins)",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-aadhaar-proprietor",
                            title="Proprietor Aadhaar Card",
                            description="12-digit UIDAI card linked with active mobile number",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="UIDAI"
                        ),
                        DocumentRequirement(
                            document_id="doc-pan-proprietor",
                            title="Proprietor PAN Card",
                            description="Permanent Account Number issued by Income Tax Department",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="Income Tax Department"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-udyam-filing",
                    substep_number=2,
                    title="Udyam Portal Form Udyam-1 Submission",
                    description="Submit plant machinery investment values, NIC 2-digit code (56 — Food and Beverage Service Activities), and bank account details.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://udyamregistration.gov.in/Udyam_Login.aspx",
                    legal_template_url="https://udyamregistration.gov.in/docs/Sample_Udyam_Application_Form.pdf",
                    statutory_form_code="Form Udyam-1",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-bank-passbook",
                            title="Cancelled Cheque / Bank Statement",
                            description="Showing IFSC code and Account Number for enterprise operations",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Scheduled Commercial Bank"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-udyam-cert",
                    substep_number=3,
                    title="Udyam Registration Certificate Download",
                    description="Retrieve verifiable cryptographic 16-character Udyam Registration Number (e.g. UDYAM-KR-03-XXXXXXX) and QR-coded certificate.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://udyamregistration.gov.in/PrintUdyamCertificate.aspx",
                    legal_template_url="https://udyamregistration.gov.in/docs/Sample_Udyam_Certificate.pdf",
                    statutory_form_code="UDYAM-CERT",
                    estimated_duration="Instant",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-fssai-lic",
            step_number=2,
            title="FSSAI Food Safety Registration / State License",
            description="Procure mandatory food safety registration from Food Safety and Standards Authority of India under Section 31 of FSS Act 2006.",
            governing_department="Food Safety and Standards Authority of India (FSSAI)",
            prerequisites=["node-udyam-reg"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://foscos.fssai.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-udyam-reg"],
            statutory_fee="₹100/yr (Basic Registration) or ₹2,000/yr (State License)",
            legal_references=["Food Safety and Standards Act 2006 (Section 31)", "FSS (Licensing and Registration) Regulations 2011"],
            estimated_duration="7-14 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-water-potability",
                    substep_number=1,
                    title="Water Potability Test Report & Kitchen Layout Blueprint",
                    description="Procure water chemical/microbiological testing report from an NABL-accredited laboratory and prepare kitchen plan layout.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://foscos.fssai.gov.in/guidance",
                    legal_template_url="https://foscos.fssai.gov.in/assets/docs/Water_Testing_Standard_Format.pdf",
                    statutory_form_code="FSSAI-NABL-WTR",
                    estimated_duration="3-5 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-water-test",
                            title="NABL Lab Water Potability Report",
                            description="Testing IS 10500 drinking water parameters for kitchen use",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="NABL-Accredited Water Laboratory"
                        ),
                        DocumentRequirement(
                            document_id="doc-kitchen-layout",
                            title="Kitchen Layout Blueprint Plan",
                            description="Floor plan indicating cooking, preparation, storage, and dishwashing zones",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Architect / Chartered Engineer"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-foscos-filing",
                    substep_number=2,
                    title="FoSCoS Portal Form A / Form B Registration Filing",
                    description="Submit online Form A (Turnover < ₹12 Lakhs) or Form B (Turnover ₹12L–₹20Cr) on FoSCoS portal with Food Safety Management Plan (FSMS).",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://foscos.fssai.gov.in/apply-for-licence-and-registration",
                    legal_template_url="https://foscos.fssai.gov.in/assets/docs/FormA_Specimen_FSSAI.pdf",
                    statutory_form_code="Form A / Form B",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-fsms-plan",
                            title="FSMS Declaration Undertaking",
                            description="Food Safety Management System self-declaration on letterhead",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Self-Declaration"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-fssai-fee-approval",
                    substep_number=3,
                    title="Statutory Fee Payment & 14-Digit License Issuance",
                    description="Pay government fee via Bharatkosh / FoSCoS gateway, clear Designated Officer inspection, and download 14-digit FSSAI certificate.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://foscos.fssai.gov.in/track-application-status",
                    legal_template_url="https://foscos.fssai.gov.in/assets/docs/Sample_FSSAI_Certificate.pdf",
                    statutory_form_code="FSSAI-CERT-14",
                    estimated_duration="7 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-bbmp-trade",
            step_number=3,
            title="Municipal Health Trade License & Fire Safety NOC",
            description="Obtain local municipal commercial establishment license from Bruhat Bengaluru Mahanagara Palike (BBMP) under Section 353 of KMC Act.",
            governing_department="Bruhat Bengaluru Mahanagara Palike (Health & Revenue Dept)",
            prerequisites=["node-fssai-lic"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://site.bbmp.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-fssai-lic"],
            statutory_fee="₹2,500 - ₹5,000 (Based on HP electrical load and area sq.ft)",
            legal_references=["Karnataka Municipal Corporations Act 1976 (Sec 353)", "BBMP Trade Licensing By-laws 2020"],
            estimated_duration="5-10 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-rental-deed",
                    substep_number=1,
                    title="Rental Lease Deed & Property Tax Receipt Verification",
                    description="Verify registered commercial lease agreement, property Khata certificate, and up-to-date municipal SAS property tax payment receipt.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://site.bbmp.gov.in/saspropertytax",
                    legal_template_url="https://site.bbmp.gov.in/docs/Commercial_Lease_Specimen.pdf",
                    statutory_form_code="BBMP-PROP-CHK",
                    estimated_duration="2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-rental-agreement",
                            title="Commercial Rental Agreement (₹200 e-Stamp)",
                            description="Registered lease deed specifying cloud kitchen commercial usage with Owner NOC",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Sub-Registrar / SHCIL"
                        ),
                        DocumentRequirement(
                            document_id="doc-tax-receipt",
                            title="Latest Property Tax Paid Receipt",
                            description="SAS property tax receipt of the commercial premise",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="BBMP Revenue Dept"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-fire-noc",
                    substep_number=2,
                    title="Fire Safety & Extinguisher Self-Declaration Compliance",
                    description="Install certified ABC dry chemical fire extinguishers (minimum 4kg x 2) and submit Fire Safety Self-Compliance Undertaking.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ksp.karnataka.gov.in",
                    legal_template_url="https://ksp.karnataka.gov.in/docs/Fire_Safety_Self_Compliance_Template.pdf",
                    statutory_form_code="KFS-NOC-01",
                    estimated_duration="2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-fire-bill",
                            title="Fire Extinguisher Purchase & Refilling Invoice",
                            description="ISI marked fire extinguisher warranty and test certificate",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Certified Fire Safety Vendor"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-trade-cert",
                    substep_number=3,
                    title="BBMP Health Trade License E-Certificate Issuance",
                    description="Pay municipal trade fee via BBMP online portal and download QR-coded digital Health Trade License.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://site.bbmp.gov.in/tradelicense",
                    legal_template_url="https://site.bbmp.gov.in/docs/Sample_Trade_License.pdf",
                    statutory_form_code="BBMP-TL-E2026",
                    estimated_duration="3 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-gst-swiggy",
            step_number=4,
            title="GST Registration & Delivery Aggregator Onboarding",
            description="Comply with Section 22 of CGST Act for online ecommerce food supply (Swiggy/Zomato onboarding).",
            governing_department="Central Board of Indirect Taxes and Customs (CBIC) & Food Delivery Platforms",
            prerequisites=["node-bbmp-trade"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.gst.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-bbmp-trade"],
            statutory_fee="₹0 (Government Free GST Registration)",
            legal_references=["Central Goods and Services Tax Act 2017 (Section 22, 24)", "Section 52 CGST (TCS on E-Commerce Operators)"],
            estimated_duration="3-7 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-gst-reg",
                    substep_number=1,
                    title="GST REG-01 Online Submission & Aadhaar Authentication",
                    description="Submit online Form GST REG-01 on gst.gov.in with HSN/SAC code 9963 (Restaurant and Food Services) and complete biometric/Aadhaar OTP auth.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://reg.gst.gov.in/registration/",
                    legal_template_url="https://www.gst.gov.in/help/docs/GST_REG_01_Specimen.pdf",
                    statutory_form_code="Form GST REG-01",
                    estimated_duration="3 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-gst-rent",
                            title="Premises Proof for GST",
                            description="Electricity bill or rent agreement showing commercial address",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="Electricity Board / Sub-Registrar"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-bank-current",
                    substep_number=2,
                    title="Commercial Current Bank Account Activation",
                    description="Open business current account using Udyam certificate, FSSAI license, and GSTIN at a scheduled commercial bank.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://rbi.org.in",
                    legal_template_url="https://rbi.org.in/scripts/BS_ViewMasCirculardetails.aspx?id=11566",
                    statutory_form_code="RBI-KYC-CA",
                    estimated_duration="2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-gstin-cert",
                            title="GSTIN Registration Certificate (Form GST REG-06)",
                            description="Official 15-character GSTIN certificate issued by GSTN",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="GSTN / CBIC"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-aggregator-onboarding",
                    substep_number=3,
                    title="Swiggy & Zomato Merchant Onboarding & Menu Compliance",
                    description="Submit FSSAI 14-digit certificate, GSTIN, PAN, and cancelled cheque to delivery aggregator partner portals for kitchen go-live.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://partner.swiggy.com",
                    legal_template_url="https://partner.swiggy.com/assets/merchant-onboarding-agreement.pdf",
                    statutory_form_code="AGG-MERCHANT-AGMT",
                    estimated_duration="2 Business Days",
                    required_documents=[]
                )
            ]
        )
    ]
)


HIERARCHICAL_DPIIT_STARTUP_JOURNEY: Journey = Journey(
    journey_id="dpiit-startup-ip",
    title="DPIIT Startup Registration & Intellectual Property",
    category="Business & Entrepreneurship",
    department="Ministry of Corporate Affairs (MCA), DPIIT & Office of Controller General of Patents, Designs & Trademarks (CGPDTM)",
    jurisdiction="Union / Central Government of India",
    state="National",
    description=(
        "Comprehensive institutional roadmap for tech ventures and innovative startups: "
        "covers MCA SPICe+ private limited company incorporation, Startup India DPIIT recognition, "
        "Section 80-IAC 3-year tax holiday, fast-tracked patent/trademark filing with 50% rebate, "
        "and Startup India Seed Fund Scheme (SISFS) grant application up to ₹20 Lakh."
    ),
    estimated_duration="3-6 Weeks",
    overall_progress_percentage=0,
    completed_nodes_count=0,
    total_nodes_count=4,
    current_active_node_id="node-mca-incorporation",
    nodes=[
        Node(
            node_id="node-mca-incorporation",
            step_number=1,
            title="Company Incorporation via MCA SPICe+ Integrated Form",
            description="Incorporate a Private Limited company with Ministry of Corporate Affairs, obtaining COI, PAN, TAN, DIN, and EPFO/ESIC simultaneously.",
            governing_department="Ministry of Corporate Affairs (MCA)",
            prerequisites=[],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.mca.gov.in",
            status=StepStatus.IN_PROGRESS,
            is_unlocked=True,
            statutory_fee="₹1,000 (Name Reservation RUN) + ₹0 ROC fee for authorized capital up to ₹15 Lakh",
            legal_references=["Companies Act 2013 (Section 3, 7)", "Companies (Incorporation) Rules 2014"],
            estimated_duration="5-7 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-dsc-din",
                    substep_number=1,
                    title="Digital Signature Certificate (DSC Class 3) & Director PIN (DIN)",
                    description="Procure Class 3 cryptographically-signed DSC tokens from authorized Certifying Authority (eMudhra/Capricon) for all founding directors.",
                    is_mandatory=True,
                    status=StepStatus.IN_PROGRESS,
                    official_portal_url="https://cca.gov.in",
                    legal_template_url="https://cca.gov.in/sites/default/files/DSC_Application_Guide.pdf",
                    statutory_form_code="CCA-DSC-CL3",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-dir-pan",
                            title="Director PAN Card",
                            description="Permanent Account Number of all proposed directors",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="Income Tax Department"
                        ),
                        DocumentRequirement(
                            document_id="doc-dir-aadhaar",
                            title="Director Address Proof",
                            description="Aadhaar / Passport / Voter ID of directors",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="UIDAI / MEA"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-spice-name",
                    substep_number=2,
                    title="MCA SPICe+ Part A (Name Reservation RUN Service)",
                    description="Reserve unique corporate name under SPICe+ Part A web form adhering to Rule 8 of Companies (Incorporation) Rules.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.mca.gov.in/content/mca/global/en/home.html",
                    legal_template_url="https://www.mca.gov.in/Ministry/pdf/RUN_Service_Instruction_Kit.pdf",
                    statutory_form_code="SPICe+ Part A",
                    estimated_duration="1-2 Business Days",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-spice-part-b",
                    substep_number=3,
                    title="SPICe+ Part B Filing (MOA, AOA, AGILE-PRO-S & INC-9)",
                    description="Submit consolidated electronic Memorandum of Association (eMOA - INC-33), Articles of Association (eAOA - INC-34), and AGILE-PRO-S form.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.mca.gov.in/content/mca/global/en/home.html",
                    legal_template_url="https://www.mca.gov.in/Ministry/pdf/eMOA_eAOA_Specimen.pdf",
                    statutory_form_code="SPICe+ Part B (INC-32)",
                    estimated_duration="3 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-inc9-declaration",
                            title="Form INC-9 Non-Conviction Declaration",
                            description="Director declaration on non-offence and statutory compliance",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="MCA Certified Template"
                        ),
                        DocumentRequirement(
                            document_id="doc-registered-office",
                            title="Registered Office Utility Bill & Owner NOC",
                            description="Electricity / Telephone bill not older than 2 months with owner NOC",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Premises Owner"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-coi-download",
                    substep_number=4,
                    title="Certificate of Incorporation (COI) Download from MCA",
                    description="Download digital COI containing Corporate Identity Number (CIN) and statutory Permanent Account Number (PAN).",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.mca.gov.in/content/mca/global/en/home.html",
                    legal_template_url="https://www.mca.gov.in/Ministry/pdf/Sample_COI_Certificate.pdf",
                    statutory_form_code="Form INC-11",
                    estimated_duration="1 Business Day",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-dpiit-recognition",
            step_number=2,
            title="Startup India DPIIT Recognition & Tax Exemption",
            description="Obtain national Certificate of Recognition from Department for Promotion of Industry and Internal Trade to unlock subsidies and tax holidays.",
            governing_department="Department for Promotion of Industry and Internal Trade (DPIIT)",
            prerequisites=["node-mca-incorporation"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.startupindia.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-mca-incorporation"],
            statutory_fee="₹0 (Free DPIIT Recognition Portal)",
            legal_references=["Notification G.S.R. 127(E) dated 19th Feb 2019", "Section 80-IAC Income Tax Act 1961"],
            estimated_duration="3-7 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-startup-profile",
                    substep_number=1,
                    title="Startup India User Account & Entity Profile Creation",
                    description="Register company CIN on startupindia.gov.in and complete entity profile with pitch overview.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.startupindia.gov.in/content/sih/en/registration.html",
                    legal_template_url="https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Startup_India_Profile_Guidelines.pdf",
                    statutory_form_code="DPIIT-ENT-01",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-coi-startup",
                            title="Certificate of Incorporation (COI)",
                            description="Digitally signed COI from ROC",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="Registrar of Companies (ROC)"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-pitch-proof",
                    substep_number=2,
                    title="Innovation Note, Pitch Deck & Proof of Concept Upload",
                    description="Submit structured innovation writeup detailing scalability, employment generation potential, and product differentiation.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.startupindia.gov.in/content/sih/en/recognition-page.html",
                    legal_template_url="https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Innovation_Brief_Template.docx",
                    statutory_form_code="DPIIT-INNOV-02",
                    estimated_duration="2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-innovation-deck",
                            title="Startup Pitch Deck & Innovation Note (Max 10 Slides)",
                            description="PDF deck outlining problem, solution, market size, business model, and IP",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Startup Founders"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-dpiit-cert",
                    substep_number=3,
                    title="DPIIT Recognition Certificate & Section 80-IAC Application",
                    description="Download official DPIIT Certificate of Recognition with unique DIPP number and apply for 3-consecutive-year tax holiday under Section 80-IAC.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.startupindia.gov.in/content/sih/en/recognition-page.html",
                    legal_template_url="https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Sample_DPIIT_Certificate.pdf",
                    statutory_form_code="DIPP-REC-CERT",
                    estimated_duration="3 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-trademark-ip",
            step_number=3,
            title="Intellectual Property: Fast-Track Trademark & Patent Filing",
            description="File brand trademark (Form TM-A) and provisional patent with 50% statutory fee rebate under the Startup Intellectual Property Protection (SIPP) scheme.",
            governing_department="Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM / IP India)",
            prerequisites=["node-dpiit-recognition"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://ipindiaonline.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-dpiit-recognition"],
            statutory_fee="₹4,500 (Form TM-A with 50% DPIIT startup rebate) vs ₹9,000 standard",
            legal_references=["Trade Marks Act 1999 (Section 18)", "Trade Marks Rules 2017 (First Schedule — Fee Concessions for Startups)"],
            estimated_duration="1-3 Business Days for filing (6-12 Months for final grant)",
            substeps=[
                SubStep(
                    substep_id="substep-tm-search",
                    substep_number=1,
                    title="Comprehensive IP India Public Trademark Search & Class Selection",
                    description="Search wordmark and device mark across relevant NICE classification classes (e.g. Class 9 for Software, Class 42 for SaaS, Class 35 for Commerce).",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ipindiaonline.gov.in/tmrpublicsearch/frmmain.aspx",
                    legal_template_url="https://ipindia.gov.in/writereaddata/Portal/IPOGuidelines/1_32_1_tmr-classification-manual.pdf",
                    statutory_form_code="IP-NICE-SRCH",
                    estimated_duration="1 Business Day",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-tm-filing",
                    substep_number=2,
                    title="Form TM-A Fast-Track Online Filing with 50% DPIIT Rebate",
                    description="Submit online Form TM-A on IP India comprehensive e-filing portal attaching DPIIT Recognition Certificate for 50% fee concession.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ipindiaonline.gov.in/trademarkefiling/user/frmLoginNew.aspx",
                    legal_template_url="https://ipindia.gov.in/writereaddata/Portal/IPOFormDownload/1_3_1_Form_TM-A.pdf",
                    statutory_form_code="Form TM-A",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-tm-logo",
                            title="High-Resolution Logo & Wordmark Specification",
                            description="JPEG/PNG format brand logo representation",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Startup Design Team"
                        ),
                        DocumentRequirement(
                            document_id="doc-dpiit-sipp",
                            title="DPIIT Certificate of Recognition for SIPP Rebate",
                            description="Proof of DPIIT recognition to claim statutory discount",
                            is_mandatory=True,
                            verification_method="DIGILOCKER",
                            issuing_authority="DPIIT"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-patent-provisional",
                    substep_number=3,
                    title="Provisional Patent Application Filing (Form 1 & Form 2)",
                    description="File provisional patent specification on e-Patent portal to secure priority date for core proprietary technology.",
                    is_mandatory=False,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ipindiaonline.gov.in/epatentfiling/goForLogin/doLogin",
                    legal_template_url="https://ipindia.gov.in/writereaddata/Portal/IPOFormDownload/1_12_1_Form-1.pdf",
                    statutory_form_code="Form 1 & Form 2 (Patent)",
                    estimated_duration="2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-patent-spec",
                            title="Provisional Patent Specification Draft",
                            description="Technical description, claims, and architectural drawings",
                            is_mandatory=False,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Patent Agent / Founders"
                        )
                    ]
                )
            ]
        ),
        Node(
            node_id="node-sisfs-grant",
            step_number=4,
            title="Startup India Seed Fund Scheme (SISFS) Grant Application",
            description="Apply for non-dilutive milestone grant funding up to ₹20 Lakhs for proof-of-concept and prototype validation through DPIIT-approved incubators.",
            governing_department="Department for Promotion of Industry and Internal Trade (DPIIT)",
            prerequisites=["node-dpiit-recognition"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://seedfund.startupindia.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-dpiit-recognition"],
            statutory_fee="₹0 (Government Seed Fund Grant Application)",
            legal_references=["Startup India Seed Fund Scheme (SISFS) Operational Guidelines 2021", "DPIIT Order No. P-38018/1/2020-SIPP"],
            estimated_duration="3-5 Weeks (Incubator Review SLA)",
            substeps=[
                SubStep(
                    substep_id="substep-incubator-select",
                    substep_number=1,
                    title="Incubator Preference Selection & Eligibility Assessment",
                    description="Select up to 3 DPIIT-approved incubators in priority order (e.g. SINE IIT Bombay, NSRCEL IIM Bangalore, T-Hub).",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://seedfund.startupindia.gov.in/incubator-list",
                    legal_template_url="https://seedfund.startupindia.gov.in/assets/docs/SISFS_Guidelines_2021.pdf",
                    statutory_form_code="SISFS-INC-SEL",
                    estimated_duration="1 Business Day",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-financial-milestone",
                    substep_number=2,
                    title="Milestone-Based Financial Projections & Grant Proposal",
                    description="Submit 12-month budget milestone breakdown for product development, testing, clinical trials, and market validation (up to ₹20 Lakh grant).",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://seedfund.startupindia.gov.in/startup-login",
                    legal_template_url="https://seedfund.startupindia.gov.in/assets/docs/Grant_Proposal_Template.xlsx",
                    statutory_form_code="SISFS-PROP-GRANT",
                    estimated_duration="3 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-financial-budget",
                            title="Detailed 12-Month Utilization Budget",
                            description="Spreadsheet showing planned disbursement tranches tied to deliverables",
                            is_mandatory=True,
                            verification_method="MANUAL_UPLOAD",
                            issuing_authority="Chartered Accountant / Startup"
                        )
                    ]
                ),
                SubStep(
                    substep_id="substep-ismc-presentation",
                    substep_number=3,
                    title="Presentation & Pitch before Incubator Seed Management Committee (ISMC)",
                    description="Present live demonstration before ISMC evaluation panel for final grant sanction and fund agreement execution.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://seedfund.startupindia.gov.in",
                    legal_template_url="https://seedfund.startupindia.gov.in/assets/docs/ISMC_Evaluation_Matrix.pdf",
                    statutory_form_code="SISFS-ISMC-SANCTION",
                    estimated_duration="14-21 Business Days",
                    required_documents=[]
                )
            ]
        )
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Commercial Real Estate Lease, Kaveri e-Stamp & Encumbrance Clearance
# ─────────────────────────────────────────────────────────────────────────────

HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY: Journey = Journey(
    journey_id="commercial-lease-tenant-security",
    title="Commercial Lease, Kaveri e-Stamp & Encumbrance Clearance",
    goal_title="Commercial Lease, Kaveri e-Stamp & Encumbrance Clearance",
    category="Civil & Real Estate Law",
    department="Department of Stamps and Registration & Karnataka State Police",
    jurisdiction="State / Municipal (Karnataka)",
    state="Karnataka",
    description=(
        "Standardized procedure for commercial real estate leasing, property title due diligence via Kaveri Online / Bhoomi, "
        "e-Stamping execution, tenant police verification, and municipal fire/health NOC clearances."
    ),
    estimated_duration="10-15 Business Days",
    overall_progress_percentage=0,
    completed_nodes_count=0,
    total_nodes_count=4,
    current_active_node_id="node-title-encumbrance",
    nodes=[
        Node(
            node_id="node-title-encumbrance",
            step_number=1,
            title="Property Title Verification & Encumbrance Certificate (EC)",
            description="Search 15-year property transactions on Kaveri Online Services to verify ownership and absence of mortgage liabilities.",
            governing_department="Department of Stamps and Registration, Government of Karnataka",
            prerequisites=[],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://kaverionline.karnataka.gov.in",
            status=StepStatus.IN_PROGRESS,
            is_unlocked=True,
            statutory_fee="₹100 - ₹200 (Online EC Search Fee)",
            legal_references=["Registration Act, 1908 (Section 57)", "Karnataka Registration Rules, 1965"],
            estimated_duration="2 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-kaveri-account",
                    substep_number=1,
                    title="Register on Kaveri Online Services & Enter Property PID",
                    description="Create citizen account and enter 15-digit BBMP / Municipal Property Identification Number (PID).",
                    guidance="Ensure the Property Identification Number matches the latest property tax receipt.",
                    is_mandatory=True,
                    status=StepStatus.IN_PROGRESS,
                    official_portal_url="https://kaverionline.karnataka.gov.in",
                    statutory_form_code="KAVERI-REG-01",
                    estimated_duration="15 Minutes",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-ec-form-15",
                    substep_number=2,
                    title="Download Digitally Signed Encumbrance Certificate (Form 15)",
                    description="Verify that Form 15 displays clean title with no unrecorded bank mortgages or court attachments.",
                    guidance="If no encumbrance exists, the Sub-Registrar issues Form 15 with zero adverse entries.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://kaverionline.karnataka.gov.in/EncumbranceCertificate",
                    statutory_form_code="FORM-15-EC",
                    estimated_duration="1-2 Business Days",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-property-tax-receipt",
                            name="Latest Municipal Property Tax Paid Receipt",
                            description="Recent SAS Property Tax Receipt with PID",
                            is_mandatory=True,
                            verification_method="DIGILOCKER"
                        )
                    ]
                )
            ]
        ),
        Node(
            node_id="node-lease-draft-estamp",
            step_number=2,
            title="Commercial Lease Agreement Drafting & e-Stamping",
            description="Draft legally binding tenancy agreement with landlord NOC for statutory licensing and execute non-judicial e-Stamp.",
            governing_department="Revenue Department / Stock Holding Corporation of India (SHCIL)",
            prerequisites=["node-title-encumbrance"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.shcilestamp.com",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-title-encumbrance"],
            statutory_fee="₹200 - ₹500 (Non-Judicial e-Stamp Duty)",
            legal_references=["Karnataka Stamp Act, 1957 (Article 30 — Lease)", "Transfer of Property Act, 1882 (Section 105)"],
            estimated_duration="2 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-draft-lease-noc",
                    substep_number=1,
                    title="Draft Commercial Lease Deed with Landlord NOC Clauses",
                    description="Incorporate express clauses granting commercial occupancy rights and authorization for FSSAI / GST registrations.",
                    guidance="Use standardized commercial lease template with express No-Objection Certificate for trade licenses.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    legal_template_url="/api/legal/templates/commercial-rent-agreement-noc",
                    statutory_form_code="DEED-LEASE-COMM",
                    estimated_duration="1 Day",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-estamp-notary",
                    substep_number=2,
                    title="Procure Non-Judicial e-Stamp Paper & Execute Notarization",
                    description="Procure e-Stamp certificate via SHCIL / authorized bank counter and execute before Notary Public.",
                    guidance="Affix signatures of Lessor, Lessee, and two independent adult witnesses.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.shcilestamp.com",
                    statutory_form_code="SHCIL-ESTAMP-01",
                    estimated_duration="1 Business Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-lessor-id",
                            name="Landlord Government ID & Ownership Proof (Sale Deed)",
                            is_mandatory=True,
                            verification_method="DIGILOCKER"
                        )
                    ]
                )
            ]
        ),
        Node(
            node_id="node-police-verification",
            step_number=3,
            title="Tenant & Commercial Staff Police Verification",
            description="Submit tenant and key employee background verification details on the Karnataka State Police Citizen Portal.",
            governing_department="Karnataka State Police (KSP)",
            prerequisites=["node-lease-draft-estamp"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://ksp.karnataka.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-lease-draft-estamp"],
            statutory_fee="₹250 (Police Verification Fee per Individual)",
            legal_references=["Karnataka Police Act, 1963", "Bengaluru City Police Tenant Verification Directives"],
            estimated_duration="3-5 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-ksp-tenant-filing",
                    substep_number=1,
                    title="Online Tenant Background Verification Filing",
                    description="Upload Aadhaar, photograph, and lease agreement copy on the KSP citizen portal.",
                    guidance="Upload signed rent agreement and passport photos of key staff.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ksp.karnataka.gov.in/service/citizen-services",
                    statutory_form_code="KSP-TENANT-VERIF",
                    estimated_duration="2 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-municipal-nocs",
            step_number=4,
            title="Municipal Fire Safety & PCB Environmental Clearance",
            description="Procure Fire Safety Department compliance clearance and State Pollution Control Board Consent to Operate (CTO).",
            governing_department="Karnataka State Fire & Emergency Services / KSPCB",
            prerequisites=["node-police-verification"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://kspcb.karnataka.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-police-verification"],
            statutory_fee="₹1,500 - ₹5,000 (Municipal NOC Fee)",
            legal_references=["Water (Prevention and Control of Pollution) Act 1974", "Karnataka Fire Force Act 1964"],
            estimated_duration="7 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-fire-safety-cert",
                    substep_number=1,
                    title="Fire Extinguisher Installation & Evacuation Blueprint Self-Certification",
                    description="Install BIS-standard ABC fire extinguishers and upload kitchen exit evacuation layout.",
                    guidance="Commercial kitchen setups require minimum 2 units of 4kg ABC dry powder extinguishers.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://ksfes.karnataka.gov.in",
                    statutory_form_code="KSFES-NOC-FORM",
                    estimated_duration="3 Business Days",
                    required_documents=[]
                )
            ]
        )
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# 4. Citizen Rights, Landlord Dispute Redressal & RTI Application
# ─────────────────────────────────────────────────────────────────────────────

HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY: Journey = Journey(
    journey_id="citizen-dispute-telelaw-rti",
    title="Landlord Dispute Resolution, NALSA Tele-Law & RTI Filing",
    goal_title="Landlord Dispute Resolution, NALSA Tele-Law & RTI Filing",
    category="Citizen Rights, Grievances & Legal Aid",
    department="Department of Justice (DoJ), NALSA & Central Information Commission",
    jurisdiction="National / State Legal Services Authority",
    state="National",
    description=(
        "Procedural legal framework for resolving commercial & residential tenancy disputes, recovering withheld security deposits, "
        "accessing free pre-litigation consultation via Tele-Law, issuing formal Section 106 legal notices, and filing RTI applications."
    ),
    estimated_duration="15-30 Business Days",
    overall_progress_percentage=0,
    completed_nodes_count=0,
    total_nodes_count=4,
    current_active_node_id="node-lease-review",
    nodes=[
        Node(
            node_id="node-lease-review",
            step_number=1,
            title="Lease Term Review & Vacation Handover Inventory",
            description="Examine tenancy deed clauses, refund terms, utility bills clearance, and photographic condition evidence.",
            governing_department="Department of Justice / Legal Literacy Mission",
            prerequisites=[],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://legalpath.gov.in",
            status=StepStatus.IN_PROGRESS,
            is_unlocked=True,
            statutory_fee="₹0 (Statutory free)",
            legal_references=["Transfer of Property Act, 1882 (Section 108)", "Indian Contract Act, 1872 (Section 73)"],
            estimated_duration="1-2 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-inventory-checklist",
                    substep_number=1,
                    title="Audit Handover Inventory & Key Return Acknowledgment",
                    description="Compile written handover proof, electricity/water bill receipts, and timestamped premise photographs.",
                    guidance="Ensure you hold written acknowledgment or courier tracking of key return.",
                    is_mandatory=True,
                    status=StepStatus.IN_PROGRESS,
                    statutory_form_code="DISPUTE-INV-01",
                    estimated_duration="1 Day",
                    required_documents=[
                        DocumentRequirement(
                            document_id="doc-original-rent-agreement",
                            name="Original Notarized Rent Agreement",
                            description="Copy of signed tenancy deed",
                            is_mandatory=True,
                            verification_method="DIGILOCKER"
                        )
                    ]
                )
            ]
        ),
        Node(
            node_id="node-legal-notice",
            step_number=2,
            title="Issue Formal Statutory Demand Notice via Registered Post (RPAD)",
            description="Serve formal legal notice under Section 106 Transfer of Property Act demanding refund within 15 days.",
            governing_department="High Court Bar Association / Bar Council of India",
            prerequisites=["node-lease-review"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.indiapost.gov.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-lease-review"],
            statutory_fee="₹50 (Speed Post / RPAD Postal Fee)",
            legal_references=["Transfer of Property Act, 1882 (Section 106)", "Code of Civil Procedure, 1908 (Order XXXVII)"],
            estimated_duration="2 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-draft-legal-notice",
                    substep_number=1,
                    title="Draft Formal Legal Demand Notice with Statutory Citations",
                    description="Generate formal demand notice specifying 18% penal interest and 15-day statutory compliance period.",
                    guidance="Use standardized legal notice format citing Section 106 Transfer of Property Act.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    legal_template_url="/api/legal/templates/landlord-security-deposit-legal-notice",
                    statutory_form_code="LEGAL-NOTICE-SEC106",
                    estimated_duration="1 Day",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-dispatch-rpad",
                    substep_number=2,
                    title="Dispatch via Speed Post / RPAD & Preserve Tracking Consignment",
                    description="Dispatch signed notice to landlord's permanent address and download India Post delivery confirmation certificate.",
                    guidance="India Post delivery certificate serves as admissible evidence under Section 27 General Clauses Act.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx",
                    statutory_form_code="POST-RPAD-01",
                    estimated_duration="2-3 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-telelaw-mediation",
            step_number=3,
            title="NALSA Tele-Law Consultation & Pre-Litigation Mediation",
            description="Access free pre-litigation video consultation with panel advocate via Tele-Law and file DLSA mediation application.",
            governing_department="Department of Justice (Ministry of Law and Justice) & NALSA",
            prerequisites=["node-legal-notice"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://www.tele-law.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-legal-notice"],
            statutory_fee="₹0 (Free Government Legal Aid Initiative)",
            legal_references=["Legal Services Authorities Act, 1987 (Section 12, 19)", "Commercial Courts Act, 2015 (Section 12A)"],
            estimated_duration="5-7 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-telelaw-booking",
                    substep_number=1,
                    title="Book Video Consultation on DoJ Tele-Law Portal / App",
                    description="Schedule 1-on-1 virtual legal advice session with empaneled legal aid advocate through CSC or mobile app.",
                    guidance="Available free for citizens, women, MSME owners, and SC/ST under NALSA scheme.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://www.tele-law.in",
                    statutory_form_code="TELELAW-APPT-01",
                    estimated_duration="1 Business Day",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-dlsa-mediation-filing",
                    substep_number=2,
                    title="File Pre-Litigation Mediation Requisition before District Legal Services Authority",
                    description="Submit dispute summary to District Legal Services Authority (DLSA) for amicable out-of-court settlement.",
                    guidance="DLSA mediation settlements hold the legal weight of a civil court decree under Section 21 Legal Services Authorities Act.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://nalsa.gov.in",
                    statutory_form_code="NALSA-PLM-FORM",
                    estimated_duration="7 Business Days",
                    required_documents=[]
                )
            ]
        ),
        Node(
            node_id="node-edaakhil-rti",
            step_number=4,
            title="e-Daakhil Consumer Complaint & Section 6(1) RTI Tracking",
            description="File digital complaint on e-Daakhil / Consumer Commission or invoke Section 6(1) RTI for government inspection records.",
            governing_department="National Consumer Disputes Redressal Commission (NCDRC) / Central Information Commission",
            prerequisites=["node-telelaw-mediation"],
            action_type=ActionType.PORTAL_REDIRECT,
            official_portal_url="https://edaakhil.nic.in",
            status=StepStatus.LOCKED,
            is_unlocked=False,
            missing_prerequisites=["node-telelaw-mediation"],
            statutory_fee="₹10 (RTI) / ₹0 - ₹500 (e-Daakhil)",
            legal_references=["Consumer Protection Act, 2019 (Section 35)", "Right to Information Act, 2005 (Section 6)"],
            estimated_duration="14-21 Business Days",
            substeps=[
                SubStep(
                    substep_id="substep-edaakhil-complaint",
                    substep_number=1,
                    title="File Online Grievance / Case on e-Daakhil Portal",
                    description="Submit statement of claim, postal receipts, and demand notice on National e-Daakhil portal for virtual hearing.",
                    guidance="e-Daakhil allows paperless e-filing across all District and State Consumer Commissions in India.",
                    is_mandatory=True,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://edaakhil.nic.in",
                    statutory_form_code="EDAAKHIL-CLAIM-01",
                    estimated_duration="3 Business Days",
                    required_documents=[]
                ),
                SubStep(
                    substep_id="substep-rti-filing",
                    substep_number=2,
                    title="Draft & Submit Form A RTI Application to Public Information Officer",
                    description="File Section 6(1) RTI application to obtain certified government inspection copies and official file notings.",
                    guidance="Use standardized Form A RTI template with 30-day statutory reply guarantee.",
                    is_mandatory=False,
                    status=StepStatus.LOCKED,
                    official_portal_url="https://rtionline.gov.in",
                    legal_template_url="/api/legal/templates/rti-application-pio",
                    statutory_form_code="RTI-FORM-A",
                    estimated_duration="30 Calendar Days (Statutory SLA)",
                    required_documents=[]
                )
            ]
        )
    ]
)


# Master Hierarchical Registry Dictionary
MASTER_HIERARCHICAL_JOURNEYS: Dict[str, Journey] = {
    # 1. Business & MSME Food Clearance
    "msme-cloud-kitchen-food": HIERARCHICAL_MSME_FOOD_JOURNEY,
    "karnataka_cloud_kitchen_setup": HIERARCHICAL_MSME_FOOD_JOURNEY,
    "karnataka-cloud-kitchen-setup": HIERARCHICAL_MSME_FOOD_JOURNEY,
    "cloud-kitchen-blr": HIERARCHICAL_MSME_FOOD_JOURNEY,
    "food-business-license": HIERARCHICAL_MSME_FOOD_JOURNEY,
    "msme-food-business": HIERARCHICAL_MSME_FOOD_JOURNEY,

    # 2. DPIIT Startup Recognition & IP
    "dpiit-startup-ip": HIERARCHICAL_DPIIT_STARTUP_JOURNEY,
    "dpiit_startup_recognition_ip": HIERARCHICAL_DPIIT_STARTUP_JOURNEY,
    "dpiit-startup-recognition-ip": HIERARCHICAL_DPIIT_STARTUP_JOURNEY,
    "startup-seed-funding": HIERARCHICAL_DPIIT_STARTUP_JOURNEY,
    "startup-idea": HIERARCHICAL_DPIIT_STARTUP_JOURNEY,

    # 3. Commercial Real Estate Lease & Encumbrance
    "commercial-lease-tenant-security": HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY,
    "commercial_lease_tenant_security": HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY,
    "property-title-encumbrance": HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY,
    "property_title_encumbrance_verification": HIERARCHICAL_COMMERCIAL_LEASE_JOURNEY,

    # 4. Citizen Rights, Landlord Dispute & Tele-Law RTI
    "citizen-dispute-telelaw-rti": HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
    "citizen_dispute_telelaw_rti": HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
    "landlord-tenant-deposit-dispute": HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
    "landlord_tenant_deposit_dispute": HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
    "telelaw-nalsa-legal-aid": HIERARCHICAL_CITIZEN_DISPUTE_JOURNEY,
}


def get_hierarchical_journey(journey_id: str) -> Journey:
    """Retrieve a validated hierarchical Journey instance with nested Nodes and SubSteps."""
    if journey_id not in MASTER_HIERARCHICAL_JOURNEYS:
        raise KeyError(f"Hierarchical journey '{journey_id}' not found in registry.")
    return MASTER_HIERARCHICAL_JOURNEYS[journey_id].model_copy(deep=True)


def get_all_hierarchical_journeys() -> List[Journey]:
    """Retrieve all unique hierarchical journeys."""
    unique_ids = [
        "msme-cloud-kitchen-food",
        "dpiit-startup-ip",
        "commercial-lease-tenant-security",
        "citizen-dispute-telelaw-rti",
    ]
    return [MASTER_HIERARCHICAL_JOURNEYS[jid].model_copy(deep=True) for jid in unique_ids]


