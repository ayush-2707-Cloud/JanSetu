import { UniversalJourney, Language } from "@/types/journey";
export { translations } from "./translations";


export const mockJourneys: UniversalJourney[] = [
  // 1. Cloud Kitchen
  {
    journeyId: "cloud-kitchen-blr",
    title: "Start a Cloud Kitchen in Bangalore",
    titleHi: "बेंगलुरु में क्लाउड किचन शुरू करें",
    titleKn: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕ್ಲೌಡ್ ಕಿಚನ್ ಪ್ರಾರಂಭಿಸಿ",
    department: "Bruhat Bengaluru Mahanagara Palike (BBMP) & FSSAI",
    agencyCode: "KA-BBMP-FOOD-091",
    description: "End-to-end statutory approval roadmap for establishing a commercial delivery-only food establishment in Bengaluru City limits.",
    descriptionHi: "बेंगलुरु शहर की सीमाओं में व्यावसायिक डिलीवरी-ओनली खाद्य प्रतिष्ठान स्थापित करने के लिए एंड-टू-एंड वैधानिक स्वीकृति रोडमैप।",
    descriptionKn: "ಬೆಂಗಳೂರು ನಗರ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ವಿತರಣಾ-ಮಾತ್ರ ಆಹಾರ ಉದ್ಯಮವನ್ನು ಸ್ಥಾಪಿಸಲು ಪೂರ್ಣ ಶಾಸನಬದ್ಧ ಅನುಮೋದನೆ ಮಾರ್ಗಸೂಚಿ.",
    category: "Business & Startups",
    iconName: "Utensils",
    estimatedDuration: "7-10 Business Days",
    overallProgressPercentage: 40,
    lastUpdated: "2026-08-15T11:00:00Z",
    applicantReference: "BLR-CK-2026-9941",
    domainId: "business",
    subcategoryId: "food-hospitality",
    activityId: "cloud-kitchen-blr",
    totalEstimatedCost: {
      governmentFees: "₹7,500 - ₹12,000",
      professionalCharges: "₹5,000 - ₹10,000 (CA/Consultant)",
      totalRange: "₹12,500 - ₹22,000",
    },
    steps: [
      {
        id: "ck-1",
        stepNumber: 1,
        title: "FSSAI Basic Food Safety Registration",
        titleHi: "एफएसएसएआई मूल खाद्य सुरक्षा पंजीकरण",
        titleKn: "ಎಫ್‌ಎಸ್‌ಎಸ್‌ಎಐ ಮೂಲ ಆಹಾರ ಸುರಕ್ಷತಾ ನೋಂದಣಿ",
        description: "Obtain 14-digit FSSAI registration certificate for commercial food processing & safety protocol adherence.",
        status: "COMPLETED",
        category: "Food Safety",
        estimatedDays: "1-2 Days",
        completedAt: "2026-08-05",
        legalReferences: ["Food Safety and Standards Act, 2006", "Sec 31(1) FSSAI Licensing Rules"],
        precautions: [
          {
            id: "ck-p1",
            severity: "CRITICAL",
            title: "Operating without FSSAI is a Punishable Offence",
            description: "Section 63 of FSS Act imposes imprisonment up to 6 months and fine up to ₹5,00,000 for manufacturing or selling food without license.",
          },
          {
            id: "ck-p2",
            severity: "INFO",
            title: "Turnover Thresholds",
            description: "Turnover under ₹12 Lakh/year needs Basic Registration (₹100/yr). Above ₹12 Lakh requires State License (₹2,000/yr).",
          },
        ],
        officialLinks: [
          {
            id: "foscos-apply",
            label: "FoSCoS Portal — Apply Online",
            url: "https://foscos.fssai.gov.in",
            portal: "FSSAI FoSCoS",
            type: "APPLY",
            isGovernment: true,
          },
          {
            id: "fssai-verify",
            label: "Verify 14-Digit FSSAI License Number",
            url: "https://foscos.fssai.gov.in/check-license-status",
            portal: "FSSAI Verification Desk",
            type: "VERIFY",
            isGovernment: true,
          },
        ],
        documentRequirements: [
          {
            id: "fbo-id",
            name: "Government ID Proof of Food Business Operator",
            description: "Aadhaar Card, Voter ID, or Passport of applicant.",
            isMandatory: true,
            format: "PDF / JPEG",
            maxSize: "2MB",
          },
          {
            id: "premises-proof",
            name: "Proof of Premises Possession",
            description: "Registered Lease Agreement / Electricity Bill / Sale Deed.",
            isMandatory: true,
            format: "PDF",
            maxSize: "5MB",
          },
          {
            id: "fsms-plan",
            name: "Food Safety Management System (FSMS) Plan",
            description: "Standard self-declaration for hygiene, clean water supply, and pest control.",
            isMandatory: true,
            format: "PDF Document",
            sampleUrl: "https://foscos.fssai.gov.in/assets/sample-fsms.pdf",
          },
        ],
        prerequisiteKnowledge: [
          {
            id: "fssai-prereq-1",
            title: "Commercial Kitchen Setup Guidelines",
            description: "Premises must have non-absorbent floors, pest control mesh, potable water test report, and stainless steel prep tables.",
            learnMoreUrl: "https://fssai.gov.in/guidelines",
          },
        ],
        commonMistakes: [
          "Applying under 'Basic Registration' when operating multiple delivery brand aggregator outlets.",
          "Uploading expired rental agreement or electricity bill not in the name of the property owner.",
          "Not displaying the 14-digit FSSAI number on packaging and invoices.",
        ],
        instructions: {
          summary: "FSSAI License #11224334000192 issued and verified against FoSCoS portal.",
          requirementsList: [
            "ID & Passport Photo of Food Business Operator (FBO)",
            "Proof of Premises Occupancy",
            "Food Safety Management System (FSMS) Plan"
          ],
          documentsRequired: ["FSSAI_Registration_Certificate_2026.pdf", "FSMS_Declaration_Form.pdf"],
          fee: "₹100/year (Basic) or ₹2,000/year (State License)",
          actionUrl: "https://foscos.fssai.gov.in",
          actionText: "Download FSSAI Certificate",
          officerContact: { name: "Dr. R. Kulkarni", role: "Designated Food Safety Officer", email: "fssai.blr@karnataka.gov.in" }
        }
      },
      {
        id: "ck-2",
        stepNumber: 2,
        title: "GST Identification Number (GSTIN) Allotment",
        titleHi: "जीएसटी पहचान संख्या (जीएसटीआईएन) आवंटन",
        titleKn: "ಜಿಎಸ್‌ಟಿ ಗುರುತಿನ ಸಂಖ್ಯೆ (ಜಿಎಸ್‌ಟಿಐಎನ್) ಹಂಚಿಕೆ",
        description: "Register for Karnataka State GSTIN under restaurant/catering services tax slab.",
        status: "COMPLETED",
        category: "Taxation",
        estimatedDays: "2 Days",
        completedAt: "2026-08-09",
        legalReferences: ["CGST Act 2017, Section 22", "Karnataka GST Rules 2017"],
        precautions: [
          {
            id: "gst-p1",
            severity: "WARNING",
            title: "Swiggy/Zomato Listing Requires Mandatory GSTIN",
            description: "Even if annual turnover is under ₹20 Lakh, online e-commerce restaurant aggregators require mandatory GSTIN for vendor onboarding.",
          },
        ],
        officialLinks: [
          {
            id: "gst-apply",
            label: "GST Official Registration Portal (REG-01)",
            url: "https://www.gst.gov.in",
            portal: "GST Common Portal",
            type: "APPLY",
            isGovernment: true,
          },
          {
            id: "gst-track",
            label: "Track GST Application Status (ARN)",
            url: "https://services.gst.gov.in/services/arnstatus",
            portal: "GST Portal Tracker",
            type: "TRACK",
            isGovernment: true,
          },
        ],
        documentRequirements: [
          {
            id: "pan-card",
            name: "PAN Card of Business / Proprietor",
            description: "Permanent Account Number issued by Income Tax Department.",
            isMandatory: true,
            format: "PDF / JPEG",
            maxSize: "1MB",
          },
          {
            id: "bank-proof",
            name: "Bank Account Proof (Cancelled Cheque)",
            description: "Cancelled cheque or first page of bank passbook with account number and IFSC.",
            isMandatory: true,
            format: "PDF / JPEG",
            maxSize: "2MB",
          },
        ],
        commonMistakes: [
          "Mismatched name between PAN card and Aadhaar leading to automated rejection.",
          "Not filing nil returns every month once GSTIN is allotted.",
        ],
        instructions: {
          summary: "GSTIN 29AAAAA0000A1Z5 allotted. Principal place of business confirmed in Indiranagar ward.",
          documentsRequired: ["GST_REG06_Certificate.pdf"],
          fee: "₹0 (Free on official portal)",
          actionUrl: "https://gst.gov.in"
        }
      },
      {
        id: "ck-3",
        stepNumber: 3,
        title: "BBMP Trade License & Zoning NOC Verification",
        titleHi: "बीबीएमपी ट्रेड लाइसेंस और ज़ोनिंग एनओसी सत्यापन",
        titleKn: "ಬಿಬಿಎಂಪಿ ವಾಣಿಜ್ಯ ಪರವಾನಗಿ ಮತ್ತು ವಲಯ NOC ಪರಿಶೀಲನೆ",
        description: "Submit property lease agreement, floor plan, and commercial zone occupancy clearance to BBMP Zonal Office.",
        status: "IN_PROGRESS",
        category: "Municipal Licensing",
        estimatedDays: "3-4 Days",
        requiresDigiLocker: true,
        legalReferences: ["Bruhat Bengaluru Mahanagara Palike Act 2020", "Karnataka Municipal Corporations Act"],
        precautions: [
          {
            id: "bbmp-p1",
            severity: "CRITICAL",
            title: "Residential Zone Restrictions",
            description: "Operating commercial cloud kitchen in purely residential zones without commercial mix approval violates BBMP zoning laws and risks immediate closure.",
          },
          {
            id: "bbmp-p2",
            severity: "WARNING",
            title: "Annual Renewal Mandatory",
            description: "BBMP Trade License expires every financial year on March 31st and must be renewed by April 30th to avoid 100% late penalty.",
          },
        ],
        officialLinks: [
          {
            id: "bbmp-apply",
            label: "BBMP Citizen Services — Trade License",
            url: "https://bbmptax.karnataka.gov.in/tradelicense",
            portal: "BBMP Online Portal",
            type: "APPLY",
            isGovernment: true,
          },
          {
            id: "bbmp-fee",
            label: "BBMP Trade License Fee Calculator",
            url: "https://bbmp.gov.in/fee-calculator",
            portal: "BBMP Revenue Department",
            type: "PAY",
            isGovernment: true,
          },
        ],
        documentRequirements: [
          {
            id: "lease-agreement",
            name: "Notarized Commercial Rent/Lease Agreement",
            description: "11-month registered lease agreement clearly stating food business usage.",
            isMandatory: true,
            format: "PDF",
            maxSize: "5MB",
            obtainFrom: "Sub-Registrar Office / Notary Public",
            estimatedTime: "1-2 Days",
          },
          {
            id: "property-tax-receipt",
            name: "Latest BBMP Property Tax Paid Receipt (Katha Certificate)",
            description: "A-Khata / B-Khata tax paid receipt for the current assessment year.",
            isMandatory: true,
            format: "PDF Document",
            maxSize: "2MB",
          },
          {
            id: "floor-plan",
            name: "Kitchen Floor Layout Plan",
            description: "Architect/engineer certified kitchen floor layout showing cooking, washing, and packaging areas.",
            isMandatory: true,
            format: "PDF / Blueprint",
          },
        ],
        prerequisiteKnowledge: [
          {
            id: "bbmp-prereq-1",
            title: "Minimum Kitchen Square Footage",
            description: "BBMP requires a minimum of 100 sq.ft for cold food prep and 250 sq.ft for commercial cooking setups.",
          },
        ],
        commonMistakes: [
          "Submitting residential rental agreement without landlord's commercial NOC.",
          "Forgetting to verify if the previous tenant's trade license was surrendered/cancelled.",
        ],
        instructions: {
          summary: "Step 3 is active. Authenticate property lease & owner Aadhaar via DigiLocker to trigger BBMP inspector visit.",
          digiLockerDocType: "PROPERTY_LEASE",
          requirementsList: [
            "DigiLocker Verified Property Rent/Lease Agreement",
            "Commercial Building Zone Classification (Form B)",
            "Trade License Fee Payment ($120.00)"
          ],
          documentsRequired: ["BBMP_Form_B_Zone_Clearance.pdf", "Commercial_Property_Lease.pdf"],
          fee: "₹4,500 INR (BBMP Municipal Fee)",
          actionUrl: "https://bbmptax.karnataka.gov.in/tradelicense",
          actionText: "Verify with DigiLocker & Submit Application",
          officerContact: { name: "S. Nagaraj", role: "BBMP Health Inspector (Indiranagar)", email: "health.indiranagar@bbmp.gov.in" }
        }
      },
      {
        id: "ck-4",
        stepNumber: 4,
        title: "Karnataka Fire & Emergency Services NOC Audit",
        description: "On-site commercial LPG gas piping safety audit and fire extinguisher compliance certificate.",
        status: "LOCKED",
        category: "Public Safety",
        estimatedDays: "2 Days",
        legalReferences: ["Karnataka Fire Force Act, 1964"],
        precautions: [
          {
            id: "fire-p1",
            severity: "CRITICAL",
            title: "Commercial LPG Cylinder Safety Distances",
            description: "LPG cylinders manifold must be installed outside the kitchen in a well-ventilated enclosure with emergency shut-off valves.",
          },
        ],
        instructions: {
          summary: "Requires Step 3 (BBMP Trade License & Zoning NOC Verification) sign-off.",
          prerequisites: ["Step 3: BBMP Trade License & Zoning NOC Verification"],
          actionUrl: "https://ksfes.karnataka.gov.in",
          fee: "₹2,000 INR"
        }
      },
      {
        id: "ck-5",
        stepNumber: 5,
        title: "BESCOM Commercial Power Tariff Conversion",
        description: "Upgrade electric meter connection from domestic to Commercial LT-3 tariff with BESCOM.",
        status: "LOCKED",
        category: "Utilities",
        estimatedDays: "1 Day",
        legalReferences: ["Electricity Act, 2003", "KERC Electricity Supply Regulations"],
        instructions: {
          summary: "Final step. Unlocks after Fire Safety NOC is issued.",
          prerequisites: ["Step 4: Karnataka Fire & Emergency Services NOC Audit"],
          actionUrl: "https://bescom.karnataka.gov.in",
          fee: "₹1,200 INR (Security Deposit extra)"
        }
      }
    ]
  },

  // 2. Study Abroad
  {
    journeyId: "study-abroad",
    title: "Study Abroad & University Visa Clearance",
    titleHi: "विदेश में पढ़ाई और छात्र वीजा स्वीकृति",
    titleKn: "ವಿದೇಶದಲ್ಲಿ ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ವೀಸಾ ಮಂಜೂರಾತಿ",
    department: "Ministry of External Affairs & Foreign Consulates",
    agencyCode: "MEA-VISA-STUDY-04",
    description: "Complete statutory roadmap for overseas university enrolment, document apostille, international student visa & forex card.",
    descriptionHi: "विदेशों में दाखिले, दस्तावेज एपोस्टिल, छात्र वीजा और फॉरेक्स कार्ड के लिए पूरा रोडमैप।",
    descriptionKn: "ವಿದೇಶಿ ಉನ್ನತ ಶಿಕ್ಷಣ ಪ್ರವೇಶ, ದಾಖಲೆ ಅಪೋಸ್ಟೈಲ್ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ವೀಸಾ ಪಡೆಯುವ ಸಂಪೂರ್ಣ ಮಾರ್ಗಸೂಚಿ.",
    category: "Education & Exams",
    iconName: "Globe2",
    estimatedDuration: "10-14 Business Days",
    overallProgressPercentage: 50,
    lastUpdated: "2026-08-15T09:30:00Z",
    applicantReference: "VISA-EDU-2026-104",
    domainId: "education",
    subcategoryId: "study-abroad-visas",
    activityId: "study-abroad",
    steps: [
      {
        id: "sa-1",
        stepNumber: 1,
        title: "University Acceptance (I-20 / CAS) & Academic Audit",
        description: "Verify official university admission offer letter and CAS/I-20 visa sponsorship code.",
        status: "COMPLETED",
        category: "University Enrolment",
        estimatedDays: "Instant",
        completedAt: "2026-08-01",
        instructions: {
          summary: "CAS / I-20 Form verified and recorded in Consulate Education Database.",
          documentsRequired: ["University_I20_Official.pdf", "TOEFL_IELTS_Scorecard.pdf"],
          actionUrl: "https://educationusa.state.gov"
        }
      },
      {
        id: "sa-2",
        stepNumber: 2,
        title: "Degree Apostille & MEA Document Legalization",
        description: "Obtain MEA Hague Apostille stamp on degree transcripts and birth certificate via DigiLocker.",
        status: "COMPLETED",
        category: "Legalization",
        estimatedDays: "2-3 Days",
        completedAt: "2026-08-08",
        instructions: {
          summary: "Hague Apostille Certificate #MEA-99410 issued.",
          documentsRequired: ["Degree_Certificate_Apostilled.pdf"],
          actionUrl: "https://apostille.gov.in"
        }
      },
      {
        id: "sa-3",
        stepNumber: 3,
        title: "Consulate Student Visa (F-1 / Tier 4) Interview",
        description: "Schedule Embassy biometric appointment and DS-160 / Visa application verification.",
        status: "IN_PROGRESS",
        category: "Visa Application",
        estimatedDays: "4-5 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Step 3 is active. Authenticate Bank Solvency & Income Tax Returns via DigiLocker for Visa interview.",
          digiLockerDocType: "BANK_SOLVENCY",
          requirementsList: [
            "DigiLocker Verified Bank Statement ($35,000 liquid funds proof)",
            "SEVIS Fee Receipt ($350.00)",
            "Valid Passport with 12 months validity"
          ],
          documentsRequired: ["DS160_Confirmation_Page.pdf", "Bank_Solvency_Letter.pdf"],
          fee: "$185.00 USD (Embassy Visa Fee)",
          actionUrl: "https://ustraveldocs.com",
          actionText: "Verify Solvency with DigiLocker & Book Slot"
        }
      },
      {
        id: "sa-4",
        stepNumber: 4,
        title: "International Forex Card & Overseas Health Insurance",
        description: "Issue Multi-Currency Forex Travel Card and mandatory university medical insurance policy.",
        status: "LOCKED",
        category: "Travel & Forex",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Requires Visa Grant clearance in Step 3.",
          prerequisites: ["Step 3: Consulate Student Visa Interview"]
        }
      }
    ]
  },

  // 3. Startup a New Idea
  {
    journeyId: "startup-idea",
    title: "Startup a New Business Idea (DPIIT)",
    titleHi: "एक नया स्टार्टअप विचार शुरू करें (DPIIT)",
    titleKn: "ಹೊಸ ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಆಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ (DPIIT)",
    department: "DPIIT & Ministry of Corporate Affairs",
    agencyCode: "DPIIT-STARTUP-101",
    description: "Official Startup India recognition roadmap: Private Limited registration, DPIIT tax exemption, IP/Patent filing & Incubator seed funding.",
    descriptionHi: "आधिकारिक स्टार्टअप इंडिया रोडमैप: प्राइवेट लिमिटेड पंजीकरण, डीपीआईआईटी कर छूट और पेटेंट फाइलिंग।",
    descriptionKn: "ಅಧಿಕೃತ ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಇಂಡಿಯಾ ನೋಂದಣಿ, ಜಿಎಸ್‌ಟಿ, ಪೇಟೆಂಟ್ ಸಲ್ಲಿಕೆ ಮತ್ತು ಸೀಡ್ ಫಂಡ್ ಪಡೆಯುವ ಮಾರ್ಗಸೂಚಿ.",
    category: "Business & Startups",
    iconName: "Rocket",
    estimatedDuration: "5-7 Business Days",
    overallProgressPercentage: 40,
    lastUpdated: "2026-08-14T14:00:00Z",
    applicantReference: "DPIIT-2026-8891",
    domainId: "business",
    subcategoryId: "tech-startups",
    activityId: "startup-idea",
    steps: [
      {
        id: "su-1",
        stepNumber: 1,
        title: "MCA Company Incorporation (SPICe+ Form)",
        description: "Incorporate Private Limited / LLP company and obtain Certificate of Incorporation with DIN.",
        status: "COMPLETED",
        category: "Corporate Legal",
        estimatedDays: "2 Days",
        completedAt: "2026-08-04",
        instructions: {
          summary: "CIN #U72900KA2026PTC192010 issued by Registrar of Companies (ROC Bangalore).",
          documentsRequired: ["Certificate_of_Incorporation_MCA.pdf", "Company_PAN_TAN.pdf"],
          actionUrl: "https://mca.gov.in"
        }
      },
      {
        id: "su-2",
        stepNumber: 2,
        title: "DPIIT Startup India Recognition Certificate",
        description: "Apply for official DPIIT recognition to unlock tax holidays under Section 80-IAC and fast-track patents.",
        status: "IN_PROGRESS",
        category: "Government Recognition",
        estimatedDays: "2-3 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Submit pitch deck, innovation brief, and Founder Aadhaar via DigiLocker for DPIIT verification.",
          digiLockerDocType: "FOUNDER_AADHAAR",
          requirementsList: [
            "2-Page Pitch Deck detailing innovation & scalability",
            "DigiLocker Verified Founder Identity",
            "Incorporation Certificate"
          ],
          documentsRequired: ["DPIIT_Application_Form.pdf", "Pitch_Deck_v3.pdf"],
          actionUrl: "https://startupindia.gov.in",
          actionText: "Verify Founder Identity & Submit DPIIT Application"
        }
      },
      {
        id: "su-3",
        stepNumber: 3,
        title: "IP Trademark & Fast-Track Patent Filing",
        description: "Register brand trademark and file provisional patent with 80% government fee rebate.",
        status: "LOCKED",
        category: "Intellectual Property",
        estimatedDays: "3 Days",
        instructions: {
          summary: "Requires DPIIT Recognition Number from Step 2.",
          prerequisites: ["Step 2: DPIIT Startup India Recognition"]
        }
      },
      {
        id: "su-4",
        stepNumber: 4,
        title: "Startup India Seed Fund Scheme (SISFS) Grant",
        description: "Apply for up to ₹20 Lakhs proof-of-concept seed grant via recognized incubators.",
        status: "LOCKED",
        category: "Funding",
        estimatedDays: "5 Days",
        instructions: {
          summary: "Final step. Unlocks upon DPIIT Recognition and IP filing.",
          prerequisites: ["Step 3: IP Trademark & Patent Filing"]
        }
      }
    ]
  },

  // 4. Prepare for Competitive Exams
  {
    journeyId: "prepare-exams",
    title: "Prepare & Register for National Exams (UPSC / GATE)",
    titleHi: "राष्ट्रीय परीक्षाओं के लिए पंजीकरण करें (UPSC / GATE)",
    titleKn: "ರಾಷ್ಟ್ರೀಯ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ನೋಂದಾಯಿಸಿ (UPSC / GATE)",
    department: "Union Public Service Commission (UPSC) & NTA",
    agencyCode: "UPSC-EXAM-2026",
    description: "Official examination roadmap for One-Time Registration (OTR), DigiLocker academic verification, admit card & exam hall allocation.",
    descriptionHi: "वन-टाइम रजिस्ट्रेशन (ओटीआर), डिजीलॉकर शैक्षणिक सत्यापन और एडमिट कार्ड के लिए आधिकारिक परीक्षा रोडमैप।",
    descriptionKn: "ಏಕಕಾಲದ ನೋಂದಣಿ (OTR), ಡಿಜಿಲಾಕರ್ ಶೈಕ್ಷಣಿಕ ದೃಢೀಕರಣ ಮತ್ತು ಪ್ರವೇಶ ಪತ್ರ ಪಡೆಯುವ ಪರೀಕ್ಷಾ ಮಾರ್ಗಸೂಚಿ.",
    category: "Education & Exams",
    iconName: "BookOpen",
    estimatedDuration: "2-3 Business Days",
    overallProgressPercentage: 67,
    lastUpdated: "2026-08-12T10:00:00Z",
    applicantReference: "OTR-2026-559210",
    domainId: "education",
    subcategoryId: "competitive-exams",
    activityId: "prepare-exams",
    steps: [
      {
        id: "ex-1",
        stepNumber: 1,
        title: "UPSC / NTA One-Time Registration (OTR) Profile",
        description: "Create lifetime OTR candidate profile with biometric Aadhaar binding.",
        status: "COMPLETED",
        category: "Candidate Registration",
        estimatedDays: "Instant",
        completedAt: "2026-08-02",
        instructions: {
          summary: "OTR Reference ID #OTR-UPSC-99401 created successfully.",
          documentsRequired: ["OTR_Profile_Summary.pdf"],
          actionUrl: "https://upsconline.nic.in"
        }
      },
      {
        id: "ex-2",
        stepNumber: 2,
        title: "DigiLocker Graduation Degree & Category Verification",
        description: "Pull degree certificate and OBC/EWS category certificate directly from DigiLocker.",
        status: "COMPLETED",
        category: "Academic Audit",
        estimatedDays: "Instant",
        completedAt: "2026-08-06",
        instructions: {
          summary: "Bachelor of Engineering Degree verified against National Academic Depository.",
          documentsRequired: ["DigiLocker_Degree_Verified.pdf"],
          actionUrl: "https://digilocker.gov.in"
        }
      },
      {
        id: "ex-3",
        stepNumber: 3,
        title: "Exam Center Allocation & e-Admit Card Issuance",
        description: "Select preferred examination city center and download cryptographically signed e-Admit Card.",
        status: "IN_PROGRESS",
        category: "Admit Card",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Active. Select city center (Bangalore / Delhi / Mumbai) to issue Hall Ticket.",
          requirementsList: [
            "Uploaded passport photograph (spec: 300 DPI, white background)",
            "Valid Government Photo ID Card Number",
            "Examination Fee Payment (₹100.00)"
          ],
          documentsRequired: ["UPSC_Prelims_eAdmitCard_2026.pdf"],
          fee: "₹100 INR",
          actionUrl: "https://upsconline.nic.in/eadmitcard",
          actionText: "Select Center & Generate Hall Ticket"
        }
      }
    ]
  },

  // 5. Open a Bank Account
  {
    journeyId: "open-bank-account",
    title: "Open a Digital Bank Account (Video KYC)",
    titleHi: "डिजिटल बैंक खाता खोलें (वीडियो केवाईसी)",
    titleKn: "ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯಿರಿ (ವಿಡಿಯೋ KYC)",
    department: "Reserve Bank of India (RBI) & State Bank Desk",
    agencyCode: "RBI-BANK-KYC-02",
    description: "Zero-paperwork instant savings & current account opening via DigiLocker e-KYC and live Video-KYC verification.",
    descriptionHi: "डिजीलॉकर ई-केवाईसी और लाइव वीडियो-केवाईसी द्वारा तत्काल शून्य-कागजी बैंक खाता।",
    descriptionKn: "ಡಿಜಿಲಾಕರ್ ಇ-KYC ಮತ್ತು ಲೈವ್ ವಿಡಿಯೋ KYC ಮೂಲಕ ತತ್ಕ್ಷಣದ ಶೂನ್ಯ-ಕಾಗದದ ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯುವ ಮಾರ್ಗಸೂಚಿ.",
    category: "Finance & Banking",
    iconName: "Landmark",
    estimatedDuration: "Instant (15 Mins)",
    overallProgressPercentage: 50,
    lastUpdated: "2026-08-15T15:00:00Z",
    applicantReference: "ACC-2026-1104",
    domainId: "finance",
    subcategoryId: "banking-accounts",
    activityId: "open-bank-account",
    steps: [
      {
        id: "ba-1",
        stepNumber: 1,
        title: "DigiLocker Aadhaar & PAN e-KYC Fetch",
        description: "Pull authenticated Aadhaar XML and PAN card details for instant KYC compliance.",
        status: "COMPLETED",
        category: "Identity Fetch",
        estimatedDays: "Instant",
        completedAt: "2026-08-15",
        instructions: {
          summary: "e-KYC token #KYC-99410 generated with 100% CKYC registry match.",
          documentsRequired: ["eKYC_Aadhaar_PAN_Response.pdf"],
          actionUrl: "https://bank.gov.in"
        }
      },
      {
        id: "ba-2",
        stepNumber: 2,
        title: "Live Video-KYC (V-CIP) Agent Verification",
        description: "Connect with certified bank officer for 2-minute live face match and physical PAN card display.",
        status: "IN_PROGRESS",
        category: "Live Verification",
        estimatedDays: "5 Minutes",
        requiresDigiLocker: true,
        instructions: {
          summary: "Step 2 is ready. Grant camera access and authenticate live location to complete Video KYC.",
          digiLockerDocType: "LIVE_VIDEO_KYC",
          requirementsList: [
            "Original Physical PAN Card ready for camera inspection",
            "Good lighting & quiet environment",
            "Geo-location location access enabled"
          ],
          actionText: "Start Live Video-KYC Call Now"
        }
      },
      {
        id: "ba-3",
        stepNumber: 3,
        title: "Account Number & Virtual Debit Card Activation",
        description: "Instant allocation of Account Number, IFSC code, and RuPay/Visa virtual debit card for NetBanking.",
        status: "LOCKED",
        category: "Account Activation",
        estimatedDays: "Instant",
        instructions: {
          summary: "Unlocks after Video-KYC sign-off.",
          prerequisites: ["Step 2: Live Video-KYC Agent Verification"]
        }
      }
    ]
  },

  // 6. World Tour / Overseas Vacation
  {
    journeyId: "world-tour",
    title: "Go on a World Tour / Overseas Travel",
    titleHi: "वर्ल्ड टूर / विदेश यात्रा पर जाएं",
    titleKn: "ವರ್ಲ್ಡ್ ಟೂರ್ / ವಿದೇಶಿ ಪ್ರವಾಸಕ್ಕೆ ಹೋಗಿ",
    department: "Ministry of External Affairs & Immigration Authorities",
    agencyCode: "MEA-PASSPORT-TOUR-09",
    description: "Comprehensive statutory roadmap for Passport issuance/renewal, Schengen/US Tourist Visas, Forex card & International Driving Permit (IDP).",
    descriptionHi: "पासपोर्ट नवीनीकरण, शेंगेन/अमेरिकी पर्यटक वीजा, फॉरेक्स कार्ड और अंतर्राष्ट्रीय ड्राइविंग परमिट के लिए पूरा रोडमैप।",
    descriptionKn: "ಪಾಸ್‌ಪೋರ್ಟ್ ನವೀಕರಣ, ಟೂರಿಸ್ಟ್ ವೀಸಾ, ಫಾರೆಕ್ಸ್ ಕಾರ್ಡ್ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಚಾಲನಾ ಪರವಾನಗಿ ಪಡೆಯುವ ಮಾರ್ಗಸೂಚಿ.",
    category: "International & Work",
    iconName: "Plane",
    estimatedDuration: "7-12 Business Days",
    overallProgressPercentage: 50,
    lastUpdated: "2026-08-11T12:00:00Z",
    applicantReference: "TOUR-2026-77890",
    domainId: "travel",
    subcategoryId: "overseas-travel-tracks",
    activityId: "world-tour",
    steps: [
      {
        id: "wt-1",
        stepNumber: 1,
        title: "Passport Seva Renewal / Tatkaal Dispatch",
        description: "Re-issue 10-year passport with updated ECNR status and chip-enabled e-Passport.",
        status: "COMPLETED",
        category: "Passport",
        estimatedDays: "3 Days",
        completedAt: "2026-08-03",
        instructions: {
          summary: "e-Passport #Z9948201 dispatched via SpeedPost.",
          documentsRequired: ["Passport_Copy_Page1_2.pdf"],
          actionUrl: "https://passportindia.gov.in"
        }
      },
      {
        id: "wt-2",
        stepNumber: 2,
        title: "Schengen / Country Tourist Visa Application",
        description: "Submit hotel vouchers, return flight tickets, and 6-month bank statement for tourist visa clearance.",
        status: "IN_PROGRESS",
        category: "Tourist Visa",
        estimatedDays: "5 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Submit bank statement and IT returns via DigiLocker to trigger VFS Global visa processing.",
          digiLockerDocType: "BANK_STATEMENT_ITR",
          requirementsList: [
            "DigiLocker Verified 6-Month Bank Statement (Min balance ₹3,00,000)",
            "Confirmed Round-Trip Flight Itinerary",
            "Overseas Travel Medical Insurance ($50,000 coverage)"
          ],
          documentsRequired: ["VFS_Visa_Application_Form.pdf", "Flight_Hotel_Vouchers.pdf"],
          fee: "€80.00 EUR (Consulate Fee)",
          actionUrl: "https://vfsglobal.com",
          actionText: "Verify Bank Statement & Submit Visa Application"
        }
      },
      {
        id: "wt-3",
        stepNumber: 3,
        title: "International Driving Permit (IDP) Issuance",
        description: "Obtain 1-year RTO International Driving Permit for driving rental vehicles abroad.",
        status: "LOCKED",
        category: "Travel Permit",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Unlocks after Tourist Visa is granted.",
          prerequisites: ["Step 2: Schengen / Country Tourist Visa Application"]
        }
      }
    ]
  },

  // 7. Try Job Abroad & Work Visa
  {
    journeyId: "job-abroad",
    title: "Get a Job Abroad & Work Visa Clearance",
    titleHi: "विदेश में नौकरी और वर्क वीजा प्राप्त करें",
    titleKn: "ವಿದೇಶದಲ್ಲಿ ಉದ್ಯೋಗ ಮತ್ತು ವರ್ಕ್ ವೀಸಾ ಪಡೆಯಿರಿ",
    department: "eMigrate Portal & Ministry of External Affairs",
    agencyCode: "MEA-EMIGRATE-WORK-11",
    description: "Official statutory clearance for overseas employment contracts, Police Clearance Certificate (PCC), eMigrate approval & Work Permit.",
    descriptionHi: "विदेशी रोजगार अनुबंधों, पुलिस क्लीयरेंस सर्टिफिकेट (पीसीसी), ई-माइग्रेट अनुमोदन और वर्क परमिट के लिए वैधानिक मंजूरी।",
    descriptionKn: "ವಿದೇಶಿ ಉದ್ಯೋಗ ಒಪ್ಪಂದ, ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಪ್ರಮಾಣಪತ್ರ (PCC) ಮತ್ತು ಇ-ಮೈಗ್ರೇಟ್ ಅನುಮೋದನೆ ಪಡೆಯುವ ಮಾರ್ಗಸೂಚಿ.",
    category: "International & Work",
    iconName: "Briefcase",
    estimatedDuration: "10-15 Business Days",
    overallProgressPercentage: 33,
    lastUpdated: "2026-08-10T11:00:00Z",
    applicantReference: "EMIG-2026-99014",
    domainId: "education",
    subcategoryId: "employment-careers",
    activityId: "job-abroad",
    steps: [
      {
        id: "ja-1",
        stepNumber: 1,
        title: "Police Clearance Certificate (PCC) Verification",
        description: "Obtain PCC from Passport Seva Kendra & Local District Police Head Office.",
        status: "COMPLETED",
        category: "Background Verification",
        estimatedDays: "3 Days",
        completedAt: "2026-08-07",
        instructions: {
          summary: "Clean PCC Certificate #PCC-BLR-9941 issued.",
          documentsRequired: ["PCC_Official_Clearance.pdf"],
          actionUrl: "https://passportindia.gov.in"
        }
      },
      {
        id: "ja-2",
        stepNumber: 2,
        title: "eMigrate Foreign Employer Contract Attestation",
        description: "Verify overseas employment offer contract with Protector of Emigrants (PoE) desk.",
        status: "IN_PROGRESS",
        category: "Emigration Clearance",
        estimatedDays: "4-5 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Authenticate foreign job offer letter and salary certificate via DigiLocker to issue PoE clearance card.",
          digiLockerDocType: "OFFER_LETTER",
          requirementsList: [
            "Signed Overseas Employment Agreement",
            "Minimum Wage Statutory Compliance Certificate",
            "DigiLocker Verified Educational Transcripts"
          ],
          documentsRequired: ["Foreign_Employment_Contract.pdf"],
          actionUrl: "https://emigrate.gov.in",
          actionText: "Verify Job Contract & Request PoE Stamp"
        }
      },
      {
        id: "ja-3",
        stepNumber: 3,
        title: "Consulate Work Permit Visa Stamping",
        description: "Submit passport for physical Work Permit Visa sticker stamping at embassy.",
        status: "LOCKED",
        category: "Work Visa",
        estimatedDays: "5 Days",
        instructions: {
          summary: "Unlocks after eMigrate PoE clearance.",
          prerequisites: ["Step 2: eMigrate Foreign Employer Contract Attestation"]
        }
      }
    ]
  },

  // 8. Tourist / Inland Travel
  {
    journeyId: "tourist-travel",
    title: "Tourist Travel & Heritage Site E-Pass",
    titleHi: "पर्यटक यात्रा और विरासत ई-पास",
    titleKn: "ಪ್ರವಾಸಿ ಪ್ರಯಾಣ ಮತ್ತು ಪಾರಂಪರಿಕ ಇ-ಪಾಸ್",
    department: "Ministry of Tourism & Archaeological Survey (ASI)",
    agencyCode: "MOT-ASI-PASS-03",
    description: "Universal tourist e-pass roadmap: Protected Area Permit (PAP/RAP), heritage monument booking & verified homestay authorization.",
    descriptionHi: "सार्वभौमिक पर्यटक ई-पास रोडमैप: संरक्षित क्षेत्र परमिट (PAP), विरासत स्मारक बुकिंग और सत्यापित होमस्टे।",
    descriptionKn: "ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ ರಹದಾರಿ (PAP), ಪಾರಂಪರಿಕ ಸ್ಮಾರಕ ಕಾಯ್ದಿರಿಸುವಿಕೆ ಮತ್ತು ಪ್ರವಾಸಿ ಇ-ಪಾಸ್ ಪಡೆಯುವ ಮಾರ್ಗಸೂಚಿ.",
    category: "Travel & Tourism",
    iconName: "Compass",
    estimatedDuration: "Instant (1 Business Day)",
    overallProgressPercentage: 67,
    lastUpdated: "2026-08-14T08:00:00Z",
    applicantReference: "TOUR-ASI-2026-3391",
    domainId: "travel",
    subcategoryId: "tourism-hospitality-tracks",
    activityId: "tourist-travel",
    steps: [
      {
        id: "tt-1",
        stepNumber: 1,
        title: "Citizen Tourist Identity DigiLocker Registration",
        description: "Generate national tourist digital pass bound with Aadhaar ID.",
        status: "COMPLETED",
        category: "Tourist Identity",
        estimatedDays: "Instant",
        completedAt: "2026-08-14",
        instructions: {
          summary: "Tourist Digital ID #TID-2026-9941 active.",
          documentsRequired: ["DigiLocker_Tourist_Pass.pdf"],
          actionUrl: "https://tourism.gov.in"
        }
      },
      {
        id: "tt-2",
        stepNumber: 2,
        title: "Protected Area Permit (PAP) / Restricted Zone E-Pass",
        description: "Submit itinerary for eco-sensitive or border zone tourism e-pass clearance.",
        status: "IN_PROGRESS",
        category: "Zone E-Pass",
        estimatedDays: "1 Day",
        requiresDigiLocker: true,
        instructions: {
          summary: "Submit vehicle number and travel dates via DigiLocker to issue instant Restricted Zone E-Pass.",
          digiLockerDocType: "VEHICLE_RC",
          requirementsList: [
            "DigiLocker Verified Driving License / Vehicle RC",
            "Confirmed Homestay / Hotel Booking Receipt"
          ],
          actionText: "Verify Vehicle & Issue PAP E-Pass"
        }
      },
      {
        id: "tt-3",
        stepNumber: 3,
        title: "ASI World Heritage Monument Fast-Track QR Pass",
        description: "Download unified QR ticket pass for instant entry into all UNESCO heritage sites.",
        status: "LOCKED",
        category: "Monument Entry",
        estimatedDays: "Instant",
        instructions: {
          summary: "Unlocks after PAP clearance.",
          prerequisites: ["Step 2: Protected Area Permit E-Pass"]
        }
      }
    ]
  },

  // 9. Become a Certified Tour Guide
  {
    journeyId: "tour-guide",
    title: "Become a Certified Tourist Guide",
    titleHi: "प्रमाणित टूर गाइड बनें",
    titleKn: "ಪ್ರಮಾಣೀಕೃತ ಟೂರ್ ಗೈಡ್ ಆಗಿ",
    department: "Ministry of Tourism & Regional Guide Training Institute",
    agencyCode: "MOT-GUIDE-CERT-07",
    description: "Official licensing roadmap for Tourist Guide certification: Regional examination, Heritage site authorization badge & First-Aid licensing.",
    descriptionHi: "टूर गाइड प्रमाणन के लिए आधिकारिक लाइसेंसिंग रोडमैप: क्षेत्रीय परीक्षा, विरासत स्थल प्राधिकरण और प्राथमिक चिकित्सा लाइसेंस।",
    descriptionKn: "ಅಧಿಕೃತ ಟೂರ್ ಗೈಡ್ ಪರವಾನಗಿ ಪಡೆಯಲು ಪರೀಕ್ಷೆ, ಸ್ಮಾರಕ ದೃಢೀಕರಣ ಬ್ಯಾಡ್ಜ್ ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಲೈಸೆನ್ಸ್ ಮಾರ್ಗಸೂಚಿ.",
    category: "Travel & Tourism",
    iconName: "MapPin",
    estimatedDuration: "5-7 Business Days",
    overallProgressPercentage: 33,
    lastUpdated: "2026-08-11T16:00:00Z",
    applicantReference: "GUIDE-2026-11890",
    domainId: "travel",
    subcategoryId: "tourism-hospitality-tracks",
    activityId: "tour-guide",
    steps: [
      {
        id: "tg-1",
        stepNumber: 1,
        title: "Eligibility Audit & Degree Transcript Verification",
        description: "Verify graduation degree in History, Archaeology, or Foreign Languages via DigiLocker.",
        status: "COMPLETED",
        category: "Eligibility Audit",
        estimatedDays: "1 Day",
        completedAt: "2026-08-09",
        instructions: {
          summary: "BA History degree verified against IITTM regional guide database.",
          documentsRequired: ["DigiLocker_BA_History_Verified.pdf"],
          actionUrl: "https://iittm.ac.in"
        }
      },
      {
        id: "tg-2",
        stepNumber: 2,
        title: "Regional Heritage Knowledge Exam & First-Aid Certification",
        description: "Complete Ministry of Tourism online assessment test and Red Cross First-Aid licensing.",
        status: "IN_PROGRESS",
        category: "Licensing Exam",
        estimatedDays: "3 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Step 2 active. Submit Red Cross First-Aid Card via DigiLocker to schedule regional oral viva exam.",
          digiLockerDocType: "FIRST_AID_CARD",
          requirementsList: [
            "Certified First-Aid Training Card",
            "Regional Language Proficiency Certificate (Kannada / Hindi / English)",
            "Guide Licensing Fee Payment (₹1,500.00)"
          ],
          fee: "₹1,500 INR",
          actionUrl: "https://tourism.gov.in/guides",
          actionText: "Verify First-Aid Card & Book Exam Slot"
        }
      },
      {
        id: "tg-3",
        stepNumber: 3,
        title: "Official Tourist Guide QR Badge & License Issuance",
        description: "Receive physical holographic Tourist Guide badge and digital QR license for official monument entry.",
        status: "LOCKED",
        category: "License Issuance",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Final step. Unlocks upon passing oral exam in Step 2.",
          prerequisites: ["Step 2: Regional Heritage Knowledge Exam"]
        }
      }
    ]
  },

  // 10. Higher Education Loan
  {
    journeyId: "edu-loan-india",
    title: "Apply for Higher Education Loan",
    titleHi: "उच्च शिक्षा ऋण के लिए आवेदन करें",
    titleKn: "ಉನ್ನತ ಶಿಕ್ಷಣ ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    department: "Vidya Lakshmi Student Portal & Union Bank",
    agencyCode: "GOI-EDU-LOAN-88",
    description: "Government-subsidized education loan journey under Central Scheme for Interest Subsidy (CSIS).",
    descriptionHi: "ब्याज सब्सिडी की केंद्रीय योजना (सीएसआईएस) के तहत सरकार द्वारा रियायती शिक्षा ऋण यात्रा।",
    descriptionKn: "ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಕೇಂದ್ರ ಯೋಜನೆಯಡಿ (CSIS) ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಯುಕ್ತ ಶಿಕ್ಷಣ ಸಾಲ ಮಾರ್ಗಸೂಚಿ.",
    category: "Education & Exams",
    iconName: "GraduationCap",
    estimatedDuration: "5-8 Business Days",
    overallProgressPercentage: 40,
    lastUpdated: "2026-08-14T16:00:00Z",
    applicantReference: "VL-2026-440192",
    domainId: "education",
    subcategoryId: "higher-education-loans",
    activityId: "edu-loan-india",
    steps: [
      {
        id: "el-1",
        stepNumber: 1,
        title: "Student Identity & Aadhaar DigiLocker Verification",
        description: "Fetch authenticated Aadhaar and Class X/XII Marksheets directly from UIDAI DigiLocker.",
        status: "COMPLETED",
        category: "Identity",
        estimatedDays: "Instant",
        completedAt: "2026-08-10",
        instructions: {
          summary: "Student Aadhaar and Class XII Board Marksheet verified with 100% authenticity match.",
          documentsRequired: ["DigiLocker_Aadhaar_Verified.pdf", "Class_XII_Marksheet_CBSE.pdf"],
          actionUrl: "https://digilocker.gov.in",
          actionText: "View DigiLocker Record"
        }
      },
      {
        id: "el-2",
        stepNumber: 2,
        title: "University Admission & Fee Structure Verification",
        description: "Submit university offer letter, NAAC accreditation proof, and semester fee breakdown.",
        status: "IN_PROGRESS",
        category: "Academic Audit",
        estimatedDays: "2-3 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Active evaluation under Bank Nodal Officer. Verify Admission Offer Letter via DigiLocker.",
          digiLockerDocType: "ADMISSION_LETTER",
          requirementsList: [
            "University Merit/Entrance Rank Card",
            "Itemized Tuition & Hostel Fee Certificate signed by Registrar",
            "Bank Guarantee Form 16"
          ],
          documentsRequired: ["University_Offer_Letter_2026.pdf", "Fee_Structure_Breakdown.pdf"],
          actionUrl: "https://vidyalakshmi.co.in",
          actionText: "Verify Admission Letter with DigiLocker",
          notes: "Under CSIS Scheme, 100% interest waiver applies during moratorium period if family income < ₹4.5 Lakhs.",
          officerContact: { name: "P. Sharma", role: "Vidya Lakshmi Loan Officer", email: "educationloan@unionbank.gov.in" }
        }
      },
      {
        id: "el-3",
        stepNumber: 3,
        title: "Co-Applicant Income Tax & Asset Assessment",
        description: "Submit Parent/Guardian Form 16 or IT Returns for income subsidy eligibility validation.",
        status: "LOCKED",
        category: "Financial Audit",
        estimatedDays: "2 Days",
        instructions: {
          summary: "Locked step. Unlocks upon University Admission Verification.",
          prerequisites: ["Step 2: University Admission & Fee Structure Verification"],
          actionUrl: "https://incometax.gov.in"
        }
      },
      {
        id: "el-4",
        stepNumber: 4,
        title: "Sanction Letter Issuance & Campus Disbursement",
        description: "Official loan sanction approval letter and direct NEFT disbursement to University account.",
        status: "LOCKED",
        category: "Disbursement",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Final disbursement stage.",
          prerequisites: ["Step 3: Co-Applicant Income Tax & Asset Assessment"],
          actionUrl: "https://vidyalakshmi.co.in"
        }
      }
    ]
  },

  // 11. Property: Buy an Apartment / Plot (RERA & Registration)
  {
    journeyId: "buying-flat-rera",
    title: "Buy an Apartment / Plot (RERA & Sub-Registrar)",
    titleHi: "अपार्टमेंट / प्लॉट खरीदें (रेरा और पंजीकरण)",
    titleKn: "ಅಪಾರ್ಟ್‌ಮೆಂಟ್ / ಪ್ಲಾಟ್ ಖರೀದಿ (ರೆರಾ ಮತ್ತು ನೋಂದಣಿ)",
    department: "State Revenue Department & Real Estate Regulatory Authority (RERA)",
    agencyCode: "REV-RERA-PROP-08",
    description: "Statutory property acquisition roadmap: RERA project search, 30-year Encumbrance Certificate, e-Stamp duty & Sub-Registrar deed registration.",
    descriptionHi: "संपत्ति खरीद के लिए वैधानिक रोडमैप: रेरा खोज, एनकम्ब्रेंस सर्टिफिकेट, ई-स्टाम्प शुल्क और डीड पंजीकरण।",
    descriptionKn: "ಆಸ್ತಿ ಖರೀದಿ ಶಾಸನಬದ್ಧ ಮಾರ್ಗಸೂಚಿ: ರೆರಾ ಪರಿಶೀಲನೆ, ಇಸಿ ಹುಡುಕಾಟ, ಇ-ಸ್ಟ್ಯಾಂಪ್ ಮತ್ತು ನೋಂದಣಿ.",
    category: "Property & Real Estate",
    iconName: "Home",
    estimatedDuration: "15-30 Business Days",
    overallProgressPercentage: 25,
    lastUpdated: "2026-08-16T12:00:00Z",
    applicantReference: "RERA-KA-2026-88019",
    domainId: "property",
    subcategoryId: "buying-selling",
    activityId: "buying-flat-rera",
    steps: [
      {
        id: "prop-1",
        stepNumber: 1,
        title: "RERA Project Registration & Builder Sanction Verification",
        description: "Verify builder RERA registration number and municipal building plan approval sanction order.",
        status: "COMPLETED",
        category: "RERA Audit",
        estimatedDays: "1 Day",
        completedAt: "2026-08-12",
        instructions: {
          summary: "Project RERA PRM/KA/RERA/1251/310/PR/2026 validated against Real Estate Regulatory Authority registry.",
          documentsRequired: ["RERA_Project_Approval_Certificate.pdf"],
          actionUrl: "https://rera.karnataka.gov.in"
        }
      },
      {
        id: "prop-2",
        stepNumber: 2,
        title: "30-Year Encumbrance Certificate (EC) Title Search",
        description: "Fetch online Form 15 non-encumbrance certificate from Kaveri / IGRS portal.",
        status: "IN_PROGRESS",
        category: "Title Verification",
        estimatedDays: "3 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Step 2 is active. Fetch Form 15 Encumbrance Certificate via DigiLocker to ensure clear mortgage-free title.",
          digiLockerDocType: "ENCUMBRANCE_CERTIFICATE",
          requirementsList: [
            "DigiLocker Form 15 Encumbrance Search (Past 30 Years)",
            "Mother Deed & Khata Extract Certificate"
          ],
          documentsRequired: ["Form15_EC_Kaveri.pdf", "Mother_Deed_Copy.pdf"],
          fee: "₹500 INR",
          actionUrl: "https://kaverionline.karnataka.gov.in",
          actionText: "Verify Encumbrance via Kaveri / DigiLocker"
        }
      },
      {
        id: "prop-3",
        stepNumber: 3,
        title: "e-Stamping & Sub-Registrar Biometric Deed Registration",
        description: "Pay stamp duty via Stock Holding Corporation (SHCIL) and execute sale deed before Sub-Registrar.",
        status: "LOCKED",
        category: "Deed Registration",
        estimatedDays: "1 Day",
        instructions: {
          summary: "Unlocks after title verification.",
          prerequisites: ["Step 2: 30-Year Encumbrance Certificate (EC) Title Search"]
        }
      }
    ]
  },

  // 12. Identity & Civic: Aadhaar Address & Mobile Update
  {
    journeyId: "aadhaar-update",
    title: "Aadhaar Address & Mobile Number Update (UIDAI)",
    titleHi: "आधार पता और मोबाइल नंबर अपडेट (UIDAI)",
    titleKn: "ಆಧಾರ್ ವಿಳಾಸ ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನವೀಕರಣ (UIDAI)",
    department: "Unique Identification Authority of India (UIDAI)",
    agencyCode: "UIDAI-MYAADHAAR-01",
    description: "Official statutory identity update roadmap: Online address modification, DigiLocker address proof & Head of Family (HoF) authentication.",
    descriptionHi: "ऑनलाइन आधार पता संशोधन, डिजीलॉकर पता प्रमाण और परिवार के मुखिया द्वारा प्रमाणीकरण।",
    descriptionKn: "ಆನ್‌ಲೈನ್ ವಿಳಾಸ ಬದಲಾವಣೆ, ಡಿಜಿಲಾಕರ್ ವಿಳಾಸ ಪುರಾವೆ ಮತ್ತು ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ದೃಢೀಕರಣ ಮಾರ್ಗಸೂಚಿ.",
    category: "Identity & Civic Documents",
    iconName: "Fingerprint",
    estimatedDuration: "3-5 Business Days",
    overallProgressPercentage: 50,
    lastUpdated: "2026-08-16T15:00:00Z",
    applicantReference: "URN-UIDAI-2026-004128",
    domainId: "civic",
    subcategoryId: "identity-cards",
    activityId: "aadhaar-update",
    steps: [
      {
        id: "aadh-1",
        stepNumber: 1,
        title: "UIDAI OTP Authentication & Demographic Record Fetch",
        description: "Log in to myAadhaar portal using linked mobile OTP and retrieve current demographic XML record.",
        status: "COMPLETED",
        category: "Identity Login",
        estimatedDays: "Instant",
        completedAt: "2026-08-14",
        instructions: {
          summary: "Aadhaar authentication successful via UIDAI secure gateway.",
          actionUrl: "https://myaadhaar.uidai.gov.in"
        }
      },
      {
        id: "aadh-2",
        stepNumber: 2,
        title: "DigiLocker Standard Address Proof Submission",
        description: "Submit registered rent agreement, electricity bill, or bank passbook via DigiLocker.",
        status: "IN_PROGRESS",
        category: "Document Verification",
        estimatedDays: "2 Days",
        requiresDigiLocker: true,
        instructions: {
          summary: "Step 2 active. Submit address proof document via DigiLocker to generate Update Request Number (URN).",
          digiLockerDocType: "ADDRESS_PROOF",
          requirementsList: [
            "Valid DigiLocker Address Proof (Passport / Bank Passbook / Electricity Bill)",
            "Statutory Update Fee (₹50.00)"
          ],
          fee: "₹50 INR",
          actionUrl: "https://myaadhaar.uidai.gov.in",
          actionText: "Submit Proof via DigiLocker & Generate URN"
        }
      },
      {
        id: "aadh-3",
        stepNumber: 3,
        title: "URN Status Tracking & Digitally Signed e-Aadhaar Download",
        description: "Track URN approval by UIDAI back-office and download password-protected e-Aadhaar PDF.",
        status: "LOCKED",
        category: "e-Aadhaar Download",
        estimatedDays: "Instant",
        instructions: {
          summary: "Unlocks upon UIDAI verification.",
          prerequisites: ["Step 2: DigiLocker Standard Address Proof Submission"]
        }
      }
    ]
  }
];

