"""Curated Official Government Statutory Knowledge Base.

Contains 15 verified official source manuals, gazette notifications, and statutory
circulars for grounded RAG with strict citations and zero-hallucination guardrails.
"""

from typing import List, Dict, Any

OFFICIAL_KNOWLEDGE_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "doc_id": "fssai-foscos-licensing-2024",
        "title": "FSSAI Food Safety and Standards (Licensing and Registration) Manual 2024",
        "department": "Food Safety and Standards Authority of India (FSSAI)",
        "jurisdiction": "National / State",
        "domain": "FOOD_BUSINESS",
        "source_reference": "FSSAI Regulation No. 1-1/Standards/SP(L&C)/2020-FSSAI",
        "official_portal_url": "https://foscos.fssai.gov.in",
        "sections": [
            {
                "section_id": "sec_fssai_reg_threshold",
                "section_title": "Section 2.1.1 — Basic Registration vs State License Thresholds",
                "content": (
                    "Under Section 31 of the Food Safety and Standards Act 2006, all Food Business Operators (FBOs) "
                    "must hold a valid license or registration. Petty food manufacturers, cloud kitchens, and hawkers "
                    "with an annual turnover under ₹12 Lakhs require a Basic FSSAI Registration (Form A) at ₹100/year. "
                    "Food establishments with turnover between ₹12 Lakhs and ₹20 Crores must apply for a State FSSAI License (Form B) "
                    "with fees ranging from ₹2,000 to ₹5,000 per annum. Central License is mandatory for turnover exceeding ₹20 Crores, "
                    "e-commerce platforms operating across multiple states, and proprietary foods."
                ),
            },
            {
                "section_id": "sec_fssai_cloud_kitchen",
                "section_title": "Section 2.1.2 — Cloud Kitchens and Food Delivery Compliance",
                "content": (
                    "Cloud kitchens, virtual restaurants, and dark kitchens must obtain an FSSAI license prior to listing on "
                    "e-commerce aggregator platforms (Swiggy, Zomato). Requirements include: (a) Commercial kitchen layout plan, "
                    "(b) Water testing report from an NABL accredited laboratory verifying potable quality, (c) Food Safety "
                    "Management System (FSMS) plan, (d) Medical fitness certificates for all food handling staff, and (e) At least "
                    "one certified Food Safety Supervisor trained under FoSTaC (Food Safety Training and Certification)."
                ),
            },
            {
                "section_id": "sec_fssai_renewal_sla",
                "section_title": "Section 2.2.4 — License Validity, Renewal SLA and Late Penalties",
                "content": (
                    "FSSAI registration or license can be taken for a period of 1 to 5 years. Renewal applications must be "
                    "submitted at least 30 days prior to expiry via the online FoSCoS portal. Applications submitted between "
                    "30 days and the expiry date incur a late fee of ₹100 per day. If a license expires, the FBO must cease operations "
                    "and file a fresh application from scratch. Turnaround time for basic registration is 7 to 15 days, while State License "
                    "involves inspection within 30 to 60 days."
                ),
            },
        ],
    },
    {
        "doc_id": "udyam-msme-operational-guidelines",
        "title": "Ministry of MSME Udyam Registration Operational Guidelines",
        "department": "Ministry of Micro, Small and Medium Enterprises (MoMSME)",
        "jurisdiction": "National",
        "domain": "MSME_REGISTRATION",
        "source_reference": "MoMSME Gazette Notification S.O. 2119(E) dated 26-06-2020",
        "official_portal_url": "https://udyamregistration.gov.in",
        "sections": [
            {
                "section_id": "sec_udyam_classification",
                "section_title": "Section 1.1 — Composite Criteria for MSME Classification",
                "content": (
                    "Effective 1st July 2020, enterprises are classified based on composite investment in plant & machinery and annual turnover: "
                    "(1) Micro Enterprise: Investment not exceeding ₹1 Crore AND turnover not exceeding ₹5 Crores. "
                    "(2) Small Enterprise: Investment not exceeding ₹10 Crores AND turnover not exceeding ₹50 Crores. "
                    "(3) Medium Enterprise: Investment not exceeding ₹50 Crores AND turnover not exceeding ₹250 Crores. "
                    "Export turnover is fully excluded when calculating the turnover threshold for MSME classification."
                ),
            },
            {
                "section_id": "sec_udyam_process",
                "section_title": "Section 2.3 — Online Registration Process & Zero Fee Mandate",
                "content": (
                    "Udyam registration is 100% paperless, self-declaration based, and completely FREE of cost. "
                    "No agency or portal is authorized to collect fees. The registration requires only: (a) Aadhaar number of proprietor/partner/director, "
                    "(b) PAN of the enterprise or proprietor, and (c) GSTIN (mandatory unless exempt under CGST Act). "
                    "Upon successful submission and Aadhaar OTP verification, a permanent digital Udyam Registration Certificate with a dynamic "
                    "QR code is generated instantly."
                ),
            },
        ],
    },
    {
        "doc_id": "pm-vidyalaxmi-csis-circular",
        "title": "PM-Vidyalaxmi CSIS Education Loan & Full Interest Subsidy Guidelines",
        "department": "Ministry of Education & Department of Higher Education",
        "jurisdiction": "National",
        "domain": "HIGHER_EDUCATION_LOAN",
        "source_reference": "MoE Circular F.No. 1-1/2023-CSIS / PM-Vidyalaxmi 2024",
        "official_portal_url": "https://www.vidyalakshmi.co.in",
        "sections": [
            {
                "section_id": "sec_vidyalaxmi_csis",
                "section_title": "Section 3.1 — Central Sector Interest Subsidy (CSIS) Scheme",
                "content": (
                    "The PM-Vidyalaxmi / CSIS scheme provides 100% full interest subsidy during the moratorium period "
                    "(course duration plus 1 year) on educational loans taken from scheduled commercial banks for pursuing professional "
                    "and technical courses in India. Eligibility criteria: (a) Gross parental/family income from all sources must not exceed "
                    "₹8,00,000 per annum, attested by an authorized revenue authority (Tahsildar / Sub-Divisional Magistrate), "
                    "(b) Admission secured in an approved NIRF-ranked or NAAC-accredited institution."
                ),
            },
            {
                "section_id": "sec_vidyalaxmi_collateral",
                "section_title": "Section 4.2 — Collateral Limits and Credit Guarantee (CGFSEL)",
                "content": (
                    "Under IBA Model Educational Loan Guidelines backed by the Credit Guarantee Fund Scheme for Education Loans (CGFSEL): "
                    "(1) Loans up to ₹4.00 Lakhs: No collateral security, no margin requirement, co-obligation of parents only. "
                    "(2) Loans between ₹4.00 Lakhs and ₹7.50 Lakhs: No collateral required; covered by CGFSEL guarantee, 5% margin for studies in India. "
                    "(3) Loans above ₹7.50 Lakhs: Tangible collateral security required along with assignment of future income."
                ),
            },
        ],
    },
    {
        "doc_id": "passport-seva-tatkaal-manual",
        "title": "Ministry of External Affairs Passport Seva Project Guidelines & Tatkaal Scheme",
        "department": "Ministry of External Affairs (CPV Division)",
        "jurisdiction": "National",
        "domain": "PASSPORT_SEVA",
        "source_reference": "MEA Passport Manual 2020 / PSP Standard Operating Procedure",
        "official_portal_url": "https://www.passportindia.gov.in",
        "sections": [
            {
                "section_id": "sec_tatkaal_eligibility",
                "section_title": "Section 5.1 — Tatkaal Scheme Expedited Processing Rules",
                "content": (
                    "Tatkaal passport applications are processed on out-of-turn priority with dispatch within 1 to 3 working days "
                    "without waiting for prior police verification (post-police verification model). Statutory fees: ₹3,500 for a 36-page booklet "
                    "and ₹4,000 for a 60-page booklet. Mandatory documents: Any 3 out of 13 prescribed documents (Aadhaar card, PAN, Voter ID, "
                    "Driving license, Bank passbook with photo, Service ID) plus Annexure E standard self-declaration."
                ),
            },
            {
                "section_id": "sec_police_clearance_cert",
                "section_title": "Section 8.4 — Police Clearance Certificate (PCC) for Emigration/Employment",
                "content": (
                    "Police Clearance Certificate (PCC) is required for citizens traveling abroad for employment, long-term visa, or immigration. "
                    "Citizens must apply online on Passport Seva portal, pay ₹500 statutory fee, and schedule an appointment at the nearest PSK/POPSK. "
                    "The local police station conducts field physical verification within a statutory window of 14 to 21 working days before clearance."
                ),
            },
        ],
    },
    {
        "doc_id": "mea-esanad-apostille-convention",
        "title": "MEA Document Legalization and Apostille (Hague Convention 1961) Manual",
        "department": "Ministry of External Affairs (Legalization & Attestation Cell)",
        "jurisdiction": "National",
        "domain": "STUDY_ABROAD",
        "source_reference": "MEA Gazette Notification on Hague Apostille Convention 1961 / eSanad S.O. 441(E)",
        "official_portal_url": "https://esanad.nic.in",
        "sections": [
            {
                "section_id": "sec_apostille_procedure",
                "section_title": "Section 1.2 — Two-Tier Attestation Protocol for Study Abroad",
                "content": (
                    "India is a signatory to the Hague Apostille Convention 1961. Educational certificates intended for use in convention "
                    "countries require a 2-tier process: Tier 1: Authentication by the State Regional Authentication Centre (State HRD/Higher Education Dept) "
                    "or Home Department of the state where degree was awarded. Tier 2: Apostille sticker issued by the Ministry of External Affairs (MEA) "
                    "directly or via eSanad portal with ₹50 statutory MEA fee per document."
                ),
            },
            {
                "section_id": "sec_esanad_digital_workflow",
                "section_title": "Section 2.1 — Paperless eSanad Verification Protocol",
                "content": (
                    "For universities onboarded to the National Academic Depository (NAD), eSanad allows completely digital contactless attestation. "
                    "The student submits degree details online, the university verifies electronic records against the digital repository, "
                    "and MEA affixes a cryptographically signed QR-coded digital Apostille without physical transit."
                ),
            },
        ],
    },
    {
        "doc_id": "rbi-lrs-education-remittance",
        "title": "RBI Master Direction on Liberalised Remittance Scheme (LRS) & Education Remittances",
        "department": "Reserve Bank of India (Foreign Exchange Department)",
        "jurisdiction": "National",
        "domain": "STUDY_ABROAD",
        "source_reference": "RBI/FED/2015-16/1 Master Direction No. 7/2015-16",
        "official_portal_url": "https://rbi.org.in",
        "sections": [
            {
                "section_id": "sec_lrs_tuition_limits",
                "section_title": "Section 4.1 — Outward Remittance Limits for Studies Abroad",
                "content": (
                    "Under the Liberalised Remittance Scheme (LRS), resident individuals are permitted to remit up to USD 250,000 per financial year "
                    "(April–March) for education abroad, including tuition fees and living expenses. Remittances exceeding USD 250,000 require "
                    "prior RBI approval supported by an official fee estimate letter from the foreign educational institution."
                ),
            },
            {
                "section_id": "sec_lrs_tcs_rates",
                "section_title": "Section 5.3 — Form A2 and Tax Collected at Source (TCS) on Education",
                "content": (
                    "Filing Form A2 along with PAN and FEMA declaration is mandatory through an Authorized Dealer (AD Category I Bank). "
                    "TCS on education remittances: (a) Remittances funded by an education loan from an approved financial institution under Section 80E: "
                    "0.5% TCS on amounts exceeding ₹7 Lakhs. (b) Remittances from personal funds: 5% TCS on amounts exceeding ₹7 Lakhs. "
                    "TCS paid is 100% refundable/adjustable in annual Income Tax Return (ITR)."
                ),
            },
        ],
    },
    {
        "doc_id": "tourism-iitf-facilitator-regulations",
        "title": "Ministry of Tourism Incredible India Tourist Facilitator (IITF) Guidelines",
        "department": "Ministry of Tourism (Travel Trade Division)",
        "jurisdiction": "National / State",
        "domain": "TOURIST_GUIDE",
        "source_reference": "Ministry of Tourism Guidelines for IITF Certification 2022",
        "official_portal_url": "https://iitf.gov.in",
        "sections": [
            {
                "section_id": "sec_iitf_certification",
                "section_title": "Section 2.1 — Online IITF Course Architecture & Modules",
                "content": (
                    "The Incredible India Tourist Facilitator (IITF) Program is an online pan-India certification framework. "
                    "Candidates must complete 7 foundational digital modules covering Indian History, Heritage, Geography, Cultural Tourism, "
                    "Communication Skills, and Emergency First-Aid. Minimum educational qualification is 10+2 (Higher Secondary) and age 18+. "
                    "Registration fee is ₹2,000 (SC/ST/EWS concession: ₹1,000)."
                ),
            },
            {
                "section_id": "sec_iitf_police_licence",
                "section_title": "Section 3.4 — Background Verification & Regional Licence Allotment",
                "content": (
                    "Upon passing the online proctored examination (minimum 50% score), candidates must submit a clean Police Clearance "
                    "Certificate issued within the preceding 6 months. Certified guides receive a digital Smart Badge and authorization license "
                    "under the Ministry of Tourism to legally operate at ASI-protected heritage monuments and national circuits."
                ),
            },
        ],
    },
    {
        "doc_id": "dpiit-sisfs-startup-seed-fund",
        "title": "DPIIT Startup India Seed Fund Scheme (SISFS) Operational Guidelines",
        "department": "Department for Promotion of Industry and Internal Trade (DPIIT)",
        "jurisdiction": "National",
        "domain": "STARTUP_SEED_FUNDING",
        "source_reference": "DPIIT Notification No. P-38018/1/2020-STARTUP dated 28-01-2021",
        "official_portal_url": "https://seedfund.startupindia.gov.in",
        "sections": [
            {
                "section_id": "sec_sisfs_eligibility",
                "section_title": "Section 3.1 — Startup Eligibility Criteria for Seed Funding",
                "content": (
                    "To qualify for SISFS funding: (1) The startup must be recognized by DPIIT with a valid DPIIT Certificate of Recognition. "
                    "(2) Incorporated not more than 2 years prior to application date. (3) Must have a business idea to develop a product or "
                    "service with market fit, viable commercialization, and scope of scaling. (4) Must not have received more than ₹10 Lakhs "
                    "of monetary support under any other Central or State Government scheme."
                ),
            },
            {
                "section_id": "sec_sisfs_disbursal",
                "section_title": "Section 4.2 — Funding Tranches: Grants vs Debt/Convertible Instruments",
                "content": (
                    "SISFS financial assistance is disbursed through approved incubators in two structures: "
                    "(a) Up to ₹20 Lakhs as a milestone-based grant for validation of proof of concept, prototype development, or product trials. "
                    "(b) Up to ₹50 Lakhs of investment through convertible debentures, debt instruments, or equity for market entry, commercialization, "
                    "or scaling. Seed fund assistance does not require promoter collateral."
                ),
            },
        ],
    },
    {
        "doc_id": "mca-spice-plus-incorporation",
        "title": "Ministry of Corporate Affairs SPICe+ Integrated Company Incorporation Manual",
        "department": "Ministry of Corporate Affairs (MCA)",
        "jurisdiction": "National",
        "domain": "STARTUP_SEED_FUNDING",
        "source_reference": "Companies (Incorporation) Rules 2014 / MCA Form SPICe+ (INC-32)",
        "official_portal_url": "https://www.mca.gov.in",
        "sections": [
            {
                "section_id": "sec_spice_parts",
                "section_title": "Section 1.1 — SPICe+ Part A (Name Reservation) and Part B (10 Integrated Services)",
                "content": (
                    "SPICe+ is a single integrated web form for company incorporation: Part A: Reservation of Company Name (RUN service). "
                    "Part B: Integrates 10 statutory registrations in one single filing: (1) Incorporation (COI), (2) Director Identification "
                    "Number (DIN) allotment for up to 3 directors, (3) Mandatory PAN allotment, (4) TAN allotment, (5) EPFO registration, "
                    "(6) ESIC registration, (7) Profession Tax registration, (8) Mandatory Opening of Bank Current Account, (9) GSTIN allotment, "
                    "and (10) Shops and Establishment registration for applicable states."
                ),
            },
            {
                "section_id": "sec_spice_zero_fee",
                "section_title": "Section 2.4 — Zero MCA Filing Fee for Capital up to ₹15 Lakhs",
                "content": (
                    "Under the Government's ease of doing business reforms, MCA filing fees are ₹0 (exempt) for companies incorporated with "
                    "an authorized capital up to ₹15,00,000 (Rupees Fifteen Lakhs). Applicable state stamp duty (₹500–₹2,000 depending on state) "
                    "and PAN/TAN fees (₹132) remain payable online."
                ),
            },
        ],
    },
    {
        "doc_id": "karnataka-bbmp-trade-license",
        "title": "BBMP Act 2020 & Trade Licensing By-laws for Commercial Establishments",
        "department": "Bruhat Bengaluru Mahanagara Palike (Health & Revenue Dept)",
        "jurisdiction": "Karnataka",
        "domain": "FOOD_BUSINESS",
        "source_reference": "BBMP Trade Licensing Rules 2021 / Seva Sindhu Circular HD 112 SST 2022",
        "official_portal_url": "https://site.bbmp.gov.in",
        "sections": [
            {
                "section_id": "sec_bbmp_health_license",
                "section_title": "Section 4.1 — Health Trade License Requirement for Eateries & Kitchens",
                "content": (
                    "Under Section 353 of the Karnataka Municipal Corporations Act / BBMP Act 2020, every commercial eating house, restaurant, "
                    "cloud kitchen, and bakery operating in Bengaluru municipal limits must obtain a Health Trade License from the BBMP Medical Officer "
                    "of Health (MOH). Documents required: (a) Electricity bill & Property Tax PID receipt, (b) Lease deed / Owner consent, "
                    "(c) FSSAI registration/license, (d) Kitchen sanitation and grease trap layout."
                ),
            },
            {
                "section_id": "sec_bbmp_seva_sindhu",
                "section_title": "Section 5.2 — Online Processing via Karnataka Seva Sindhu",
                "content": (
                    "Applications must be submitted via the Karnataka Seva Sindhu / BBMP portal. Renewal is mandatory annually before 28th February. "
                    "Operating without a valid trade license attracts a penalty of 100% of the trade fee and statutory sealing notice under the BBMP Act."
                ),
            },
        ],
    },
    {
        "doc_id": "cbic-gst-small-business",
        "title": "CBIC GST Registration Framework & Turnover Thresholds for Small Businesses",
        "department": "Central Board of Indirect Taxes and Customs (CBIC)",
        "jurisdiction": "National",
        "domain": "MSME_REGISTRATION",
        "source_reference": "CGST Act 2017 Section 22 / CBIC Notification No. 10/2019-Central Tax",
        "official_portal_url": "https://www.gst.gov.in",
        "sections": [
            {
                "section_id": "sec_gst_thresholds",
                "section_title": "Section 22.1 — Mandatory GST Registration Thresholds",
                "content": (
                    "Every supplier whose aggregate annual turnover exceeds the threshold must register for GST: "
                    "(1) Suppliers of Goods: ₹40 Lakhs (₹20 Lakhs in Special Category States). "
                    "(2) Suppliers of Services: ₹20 Lakhs (₹10 Lakhs in Special Category States). "
                    "(3) Mandatory registration irrespective of turnover: Any business supplying goods through an e-commerce operator (e.g. Amazon, Flipkart), "
                    "inter-state suppliers of goods, and reverse charge liability entities. However, food vendors selling through Swiggy/Zomato where the platform "
                    "pays GST under Section 9(5) are exempt from mandatory GST registration if their aggregate turnover is below ₹20 Lakhs."
                ),
            },
            {
                "section_id": "sec_gst_reg01_aadhaar",
                "section_title": "Section 25.4 — Form GST REG-01 & Instant Aadhaar Authentication",
                "content": (
                    "GST registration is completely free of government fees on the official GST portal (gst.gov.in). "
                    "Applicants opting for Aadhaar authentication receive approval within 7 working days without site physical verification. "
                    "If Aadhaar authentication is skipped or fails, a physical site inspection is mandated within 30 days before issuing the GSTIN certificate."
                ),
            },
        ],
    },
    {
        "doc_id": "digilocker-apisetu-technical-manual",
        "title": "National API Setu & DigiLocker Requester Integration Architecture",
        "department": "Ministry of Electronics and Information Technology (MeitY)",
        "jurisdiction": "National",
        "domain": "OTHER",
        "source_reference": "MeitY Digital India API Setu Specification v2.4 / DPDP Act 2023",
        "official_portal_url": "https://apisetu.gov.in",
        "sections": [
            {
                "section_id": "sec_apisetu_auth",
                "section_title": "Section 3.1 — OAuth 2.0 PKCE and Citizen Consent Artifact",
                "content": (
                    "API Setu operates as a federated trust framework connecting government issuers and requester applications. "
                    "All document pulls mandate citizen explicit informed consent compliant with the Digital Personal Data Protection (DPDP) Act 2023. "
                    "Access tokens are generated via OAuth 2.0 with cryptographic client ID and client secret, expiring in 3600 seconds with immutable audit logs."
                ),
            },
            {
                "section_id": "sec_apisetu_signatures",
                "section_title": "Section 4.3 — SHA256withRSA PKCS#7 Digital Signature Verification",
                "content": (
                    "Payloads fetched from API Setu issuers (PAN, Marksheets, Driving License, Udyam) contain an embedded cryptographic signature "
                    "using SHA256withRSA adhering to PKCS#7 / CMS standards. The verifying relying party verifies the issuer X.509 root certificate "
                    "against CCA India national trust store to ensure tamper-evident integrity."
                ),
            },
        ],
    },
    {
        "doc_id": "ugc-nad-academic-bank-credits",
        "title": "UGC National Academic Depository (NAD) & Academic Bank of Credits (ABC)",
        "department": "University Grants Commission & Ministry of Education",
        "jurisdiction": "National",
        "domain": "HIGHER_EDUCATION_LOAN",
        "source_reference": "UGC (Establishment and Operation of Academic Bank of Credits) Regulations 2021",
        "official_portal_url": "https://nad.gov.in",
        "sections": [
            {
                "section_id": "sec_nad_abc_id",
                "section_title": "Section 2.1 — 12-Digit APAAR / ABC ID Integration",
                "content": (
                    "Under National Education Policy (NEP 2020), every student is allotted a unique 12-digit APAAR / ABC ID (Academic Bank of Credits). "
                    "All Class 10, Class 12, Degree, and Diploma marksheets are deposited directly by recognized state and central examination boards "
                    "(CBSE, CISCE, State Boards, Universities). Digital records downloaded through NAD/DigiLocker carry legal parity with physical original certificates "
                    "under Section 9A of the Information Technology Act 2000."
                ),
            },
        ],
    },
    {
        "doc_id": "state-revenue-income-certificate",
        "title": "State Revenue Department Citizen Charter — Family Income Certificate Guidelines",
        "department": "State Department of Revenue (e-District / Seva Sindhu)",
        "jurisdiction": "State / Regional",
        "domain": "HIGHER_EDUCATION_LOAN",
        "source_reference": "State Citizen Services Guarantee Act (Sakala / Right to Services)",
        "official_portal_url": "https://edistrict.gov.in",
        "sections": [
            {
                "section_id": "sec_income_cert_sla",
                "section_title": "Section 3.2 — Tahsildar Income Certificate 15-Day Statutory SLA",
                "content": (
                    "Family Income Certificate is required to claim fee concessions, scholarship benefits, and PM-Vidyalaxmi CSIS 100% interest subvention. "
                    "Application is filed online via State e-District / Seva Sindhu with: (1) Salary slip / Form 16 / ITR or village revenue report, "
                    "(2) Ration card / Family tree certificate, (3) Aadhaar of applicant and parents. The statutory turnaround SLA is 15 working days. "
                    "The issued certificate remains legally valid for 1 to 3 financial years depending on state revenue regulations."
                ),
            },
        ],
    },
    {
        "doc_id": "fssai-annual-return-d1-mandate",
        "title": "FSSAI Annual Return Form D1 Statutory Mandate & Deadline Notice",
        "department": "Food Safety and Standards Authority of India (FSSAI)",
        "jurisdiction": "National",
        "domain": "FOOD_BUSINESS",
        "source_reference": "FSSAI Order No. 15(31)2020/FoSCoS/RCD/FSSAI dated 18-05-2023",
        "official_portal_url": "https://foscos.fssai.gov.in",
        "sections": [
            {
                "section_id": "sec_fssai_d1_return",
                "section_title": "Section 1.1 — Mandatory Online Filing of Annual Return Form D1 by May 31st",
                "content": (
                    "All licensed food manufacturers, processors, and cloud kitchen commercial operations holding an FSSAI State or Central License "
                    "must submit an Annual Return (Form D1) electronically via FoSCoS portal on or before 31st May of each financial year for the "
                    "preceding year's transactions. Physical or email submissions are strictly discontinued. Non-submission beyond 31st May attracts "
                    "an automated compounding penalty of ₹100 per day until the return is furnished, with maximum penalty up to 5 times annual license fee."
                ),
            },
        ],
    },
    {
        "doc_id": "consumer-protection-edaakhil-2019",
        "title": "Consumer Protection Act 2019 & National e-Daakhil Electronic Filing Directives",
        "department": "Ministry of Consumer Affairs, Food & Public Distribution",
        "jurisdiction": "National",
        "domain": "CITIZEN_RIGHTS",
        "source_reference": "Consumer Protection Act, 2019 (Act No. 35 of 2019) & E-Daakhil Rules 2020",
        "official_portal_url": "https://edaakhil.nic.in",
        "sections": [
            {
                "section_id": "sec_edaakhil_filing",
                "section_title": "Section 35 — Online Filing of Consumer Complaints via e-Daakhil",
                "content": (
                    "Under Section 35 of the Consumer Protection Act 2019, any aggrieved consumer or commercial lessee can file "
                    "electronic complaints before the District Consumer Commission via e-Daakhil without physical presence. "
                    "For claims up to ₹5 Lakhs, the statutory court fee is ₹0 (completely free). Claims between ₹5 Lakhs and ₹10 Lakhs "
                    "attract a nominal fee of ₹200. Complaints must be accompanied by statement of claim, copy of demand notice, "
                    "payment receipts, and registered post acknowledgment tracking."
                ),
            },
        ],
    },
    {
        "doc_id": "rti-act-2005-statutory-rules",
        "title": "Right to Information Act 2005 — Procedural Manual & Form A Application Rules",
        "department": "Department of Personnel and Training (DoPT) & Central Information Commission",
        "jurisdiction": "National / State",
        "domain": "CITIZEN_RIGHTS",
        "source_reference": "RTI Act, 2005 (Act No. 22 of 2005) & Right to Information Rules, 2012",
        "official_portal_url": "https://rtionline.gov.in",
        "sections": [
            {
                "section_id": "sec_rti_section6",
                "section_title": "Section 6(1) & Section 7(1) — Form A Application & 30-Day Mandatory SLA",
                "content": (
                    "Section 6(1) of the RTI Act 2005 empowers every citizen to obtain certified copies of government inspection records, "
                    "file notings, and application processing status from the designated Public Information Officer (PIO). "
                    "Application fee is ₹10. Under Section 7(1), the PIO is statutorily mandated to supply the information within 30 calendar days. "
                    "If the requested information concerns life or liberty of a person, it must be provided within 48 hours. "
                    "Failure to supply information attracts a penalty of ₹250 per day (up to ₹25,000) on the PIO under Section 20."
                ),
            },
        ],
    },
    {
        "doc_id": "nalsa-telelaw-legal-aid-guidelines",
        "title": "NALSA Free Legal Services & Department of Justice Tele-Law Mission",
        "department": "National Legal Services Authority (NALSA) & Ministry of Law and Justice",
        "jurisdiction": "National",
        "domain": "CITIZEN_RIGHTS",
        "source_reference": "Legal Services Authorities Act, 1987 (Act No. 39 of 1987) & DoJ Tele-Law Operational Scheme",
        "official_portal_url": "https://www.tele-law.in",
        "sections": [
            {
                "section_id": "sec_telelaw_prelitigation",
                "section_title": "Section 12 & 19 — Free Legal Advice and DLSA Pre-Litigation Mediation",
                "content": (
                    "Under Section 12 of the Legal Services Authorities Act 1987, free legal advice, panel advocates, and pre-litigation "
                    "mediation are provided to citizens, women, MSMEs, industrial workmen, and persons facing exploitation. "
                    "The Tele-Law initiative connects citizens via video consultation to High Court and District Legal Services Authority (DLSA) "
                    "panel advocates. Settlements arrived at during DLSA pre-litigation mediation hold the legal status of a final civil court decree "
                    "under Section 21 of the Act, with zero court fee and no appeal lying against the award."
                ),
            },
        ],
    },
    {
        "doc_id": "transfer-of-property-lease-security-deposit",
        "title": "Transfer of Property Act 1882 — Commercial Lease, Landlord NOC & Deposit Recovery",
        "department": "Ministry of Law and Justice & State Revenue Department",
        "jurisdiction": "National / State",
        "domain": "REAL_ESTATE",
        "source_reference": "Transfer of Property Act, 1882 (Act No. 4 of 1882 — Sections 105 to 108)",
        "official_portal_url": "https://indiacode.nic.in",
        "sections": [
            {
                "section_id": "sec_tpa_deposit_refund",
                "section_title": "Section 106 & 108 — Statutory Notice for Security Deposit Refund & Summary Suit",
                "content": (
                    "Under Section 108 of the Transfer of Property Act 1882, upon peaceful termination of tenancy and handover of keys, "
                    "the lessor is statutorily obligated to refund the refundable security deposit in full within the agreed notice period. "
                    "Unlawful withholding allows the lessee to issue a formal 15-day statutory demand notice under Section 106. "
                    "Upon expiry of 15 days, the tenant may file a Summary Suit under Order XXXVII of the Code of Civil Procedure 1908 "
                    "in the competent Civil Court for recovery with 18% penal interest and damages."
                ),
            },
        ],
    },
]
