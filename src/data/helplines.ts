/**
 * National Helpline Directory & Stage-Specific Resolver
 * Emergency and domain-specific helpline numbers for citizens.
 */

import { JourneyStep } from "@/types/journey";

export interface Helpline {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  number: string;
  description: string;
  domainIds: string[];   // Maps to LegalDomain.id — can span multiple domains
  isEmergency: boolean;
  availability: string;  // e.g., "24x7", "Mon-Fri 9AM-6PM"
  type: "TOLL_FREE" | "LANDLINE" | "SMS" | "WHATSAPP" | "EMAIL";
  stageKeywords?: string[]; // Triggers stage-specific relevance
}

export const helplines: Helpline[] = [
  // ── Identity & Core Auth ──
  {
    id: "aadhaar-helpline",
    name: "UIDAI Aadhaar Helpline",
    nameHi: "यूआईडीएआई आधार हेल्पलाइन",
    nameKn: "ಯುಐಡಿಎಐ ಆಧಾರ್ ಸಹಾಯವಾಣಿ",
    number: "1947",
    description: "UIDAI toll-free helpline for Aadhaar OTP verification, demographic updates, and PVC status.",
    domainIds: ["identity", "business", "legal", "finance", "travel"],
    isEmergency: false,
    availability: "24x7 (Toll Free)",
    type: "TOLL_FREE",
    stageKeywords: ["aadhaar", "uidai", "ekyc", "biometrics", "otp authentication", "identity-verification"],
  },
  {
    id: "digilocker-helpdesk",
    name: "DigiLocker Citizen Support",
    nameHi: "डिजिलॉकर नागरिक सहायता",
    nameKn: "ಡಿಜಿಲಾಕರ್ ನಾಗರಿಕ ಬೆಂಬಲ",
    number: "011-24301555",
    description: "National Digital Locker technical support for issued document synchronization and verification.",
    domainIds: ["identity", "legal", "education"],
    isEmergency: false,
    availability: "Mon-Fri 9AM-6PM",
    type: "LANDLINE",
    stageKeywords: ["digilocker", "digital badge", "verifiable credential", "nad", "e-sanad"],
  },

  // ── Emergency & Police ──
  {
    id: "police-emergency",
    name: "Police Emergency & Verification",
    nameHi: "पुलिस आपातकालीन एवं सत्यापन",
    nameKn: "ಪೊಲೀಸ್ ತುರ್ತು ಮತ್ತು ಪರಿಶೀಲನೆ",
    number: "112",
    description: "National emergency number for police verification, FIR assistance, and emergency response.",
    domainIds: ["legal", "family", "travel"],
    isEmergency: true,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["police", "pcc", "character certificate", "verification", "criminal clearance", "police-verification"],
  },
  {
    id: "women-helpline",
    name: "Women Helpline",
    nameHi: "महिला हेल्पलाइन",
    nameKn: "ಮಹಿಳಾ ಸಹಾಯವಾಣಿ",
    number: "181",
    description: "National Women's Helpline for reporting domestic violence, harassment, and abuse.",
    domainIds: ["family", "legal"],
    isEmergency: true,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["women", "harassment", "safety"],
  },
  {
    id: "child-helpline",
    name: "Childline",
    nameHi: "चाइल्डलाइन",
    nameKn: "ಚೈಲ್ಡ್‌ಲೈನ್",
    number: "1098",
    description: "Child rescue and protection helpline for children in distress.",
    domainIds: ["family"],
    isEmergency: true,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["child", "minor"],
  },

  // ── Business, MSME & Food ──
  {
    id: "fssai-helpline",
    name: "FSSAI FoSCoS Food Safety Helpline",
    nameHi: "एफएसएसएआई फोसकॉस खाद्य सुरक्षा हेल्पलाइन",
    nameKn: "ಎಫ್‌ಎಸ್‌ಎಸ್‌ಎಐ ಆಹಾರ ಸುರಕ್ಷತೆ ಸಹಾಯವಾಣಿ",
    number: "1800-112-100",
    description: "Food Safety and Standards Authority helpline for FoSCoS food licenses, registration, and hygiene.",
    domainIds: ["business"],
    isEmergency: false,
    availability: "Mon-Sat 9:30AM-6PM",
    type: "TOLL_FREE",
    stageKeywords: ["fssai", "foscos", "food license", "food business", "hygiene rating", "fssai-license"],
  },
  {
    id: "msme-helpline",
    name: "Ministry of MSME Champions Helpdesk",
    nameHi: "एमएसएमई चैंपियंस हेल्पलाइन",
    nameKn: "ಎಂಎಸ್ಎಂಇ ಚಾಂಪಿಯನ್ಸ್ ಸಹಾಯವಾಣಿ",
    number: "1800-180-6763",
    description: "Udyam MSME paperless registration, URN generation, and priority sector subsidy queries.",
    domainIds: ["business"],
    isEmergency: false,
    availability: "Mon-Fri 9AM-5:30PM",
    type: "TOLL_FREE",
    stageKeywords: ["udyam", "msme", "urn", "nic code", "small enterprise", "udyam-registration"],
  },
  {
    id: "gst-helpdesk",
    name: "GST Helpdesk",
    nameHi: "जीएसटी हेल्पडेस्क",
    nameKn: "ಜಿಎಸ್‌ಟಿ ಸಹಾಯ ಕೇಂದ್ರ",
    number: "1800-103-4786",
    description: "GSTN toll-free helpline for GST registration, filing, and technical portal queries.",
    domainIds: ["business", "finance"],
    isEmergency: false,
    availability: "Mon-Sat 9AM-9PM",
    type: "TOLL_FREE",
    stageKeywords: ["gst", "gstin", "e-invoicing", "tax registration", "current-business-account"],
  },
  {
    id: "startup-india-helpline",
    name: "Startup India & DPIIT Helpdesk",
    nameHi: "स्टार्टअप इंडिया एवं डीपीआईआईटी हेल्पलाइन",
    nameKn: "ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಇಂಡಿಯಾ ಸಹಾಯವಾಣಿ",
    number: "1800-115-565",
    description: "DPIIT helpline for Startup India recognition, Section 80-IAC tax exemption, and SISFS grants.",
    domainIds: ["business"],
    isEmergency: false,
    availability: "Mon-Sat 10AM-5PM",
    type: "TOLL_FREE",
    stageKeywords: ["startup", "dpiit", "sisfs", "seed fund", "dipp", "spice+", "mca", "dpiit-recognition", "sisfs-grant-application", "entity-formation"],
  },

  // ── Finance, Tax & Banking ──
  {
    id: "income-tax-helpline",
    name: "Income Tax & PAN CPC Helpline",
    nameHi: "आयकर एवं पैन सीपीसी हेल्पलाइन",
    nameKn: "ಆದಾಯ ತೆರಿಗೆ ಮತ್ತು ಪ್ಯಾನ್ ಸಹಾಯವಾಣಿ",
    number: "1800-103-0025",
    description: "Central Processing Centre helpline for PAN validation, ITR filing, Form A2, and tax compliance.",
    domainIds: ["finance", "business", "travel"],
    isEmergency: false,
    availability: "Mon-Fri 8AM-8PM",
    type: "TOLL_FREE",
    stageKeywords: ["pan", "income tax", "itr", "lrs", "form a2", "tcs", "forex-lrs-declaration", "income-certificate"],
  },
  {
    id: "vidyalakshmi-helpline",
    name: "PM-Vidyalaxmi Education Loan Helpdesk",
    nameHi: "पीएम-विद्यालक्ष्मी शिक्षा ऋण हेल्पलाइन",
    nameKn: "ಪಿಎಂ-ವಿದ್ಯಾಲಕ್ಷ್ಮಿ ಶಿಕ್ಷಣ ಸಾಲ ಸಹಾಯವಾಣಿ",
    number: "1800-180-2222",
    description: "Department of Higher Education & IBA single-window helpline for education loans & CSIS subsidy.",
    domainIds: ["finance", "education"],
    isEmergency: false,
    availability: "Mon-Sat 9AM-6PM",
    type: "TOLL_FREE",
    stageKeywords: ["vidyalaxmi", "education loan", "celaf", "csis", "interest subsidy", "marksheet", "scheme-discovery", "bank-loan-application"],
  },
  {
    id: "epfo-helpline",
    name: "EPFO Helpline",
    nameHi: "ईपीएफओ हेल्पलाइन",
    nameKn: "ಇಪಿಎಫ್‌ಒ ಸಹಾಯವಾಣಿ",
    number: "1800-118-005",
    description: "Employee Provident Fund helpline for claims, transfers, and balance queries.",
    domainIds: ["finance"],
    isEmergency: false,
    availability: "Mon-Sat 9:15AM-5:45PM",
    type: "TOLL_FREE",
    stageKeywords: ["epf", "epfo", "provident fund", "uan"],
  },

  // ── Travel, MEA & Tourism ──
  {
    id: "tourism-helpline",
    name: "Incredible India 24x7 Tourist Infoline",
    nameHi: "अतुल्य भारत 24x7 पर्यटक हेल्पलाइन",
    nameKn: "ಅತುಲ್ಯ ಭಾರತ 24x7 ಪ್ರವಾಸಿ ಸಹಾಯವಾಣಿ",
    number: "1800-11-1363",
    description: "Ministry of Tourism multi-lingual toll-free helpline for IITF facilitator certification and guidelines.",
    domainIds: ["travel", "business"],
    isEmergency: false,
    availability: "24x7 Multi-lingual",
    type: "TOLL_FREE",
    stageKeywords: ["tourist", "guide", "iitf", "tourism ministry", "nchmct", "iitf-course", "tourism-ministry-registration"],
  },
  {
    id: "passport-helpline",
    name: "Passport Seva & MEA Helpline",
    nameHi: "पासपोर्ट सेवा एवं विदेश मंत्रालय हेल्पलाइन",
    nameKn: "ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಸಹಾಯವಾಣಿ",
    number: "1800-258-1800",
    description: "Ministry of External Affairs helpline for passport tracking, PCC appointments, and consular services.",
    domainIds: ["travel"],
    isEmergency: false,
    availability: "Mon-Sat 8AM-10PM",
    type: "TOLL_FREE",
    stageKeywords: ["passport", "pcc", "visa", "vfs", "travel", "police clearance", "visa-checklist"],
  },
  {
    id: "esanad-apostille-helpline",
    name: "MEA eSanad & Hague Apostille Support",
    nameHi: "विदेश मंत्रालय ई-सनद एवं अपोस्टिल सहायता",
    nameKn: "ಇ-ಸನದ್ ಮತ್ತು ಅಪೋಸ್ಟಿಲ್ ಸಹಾಯ",
    number: "011-49018400",
    description: "CPV Division MEA helpline for educational document attestation and Hague Apostille verification.",
    domainIds: ["travel", "legal", "education"],
    isEmergency: false,
    availability: "Mon-Fri 9:30AM-5:30PM",
    type: "LANDLINE",
    stageKeywords: ["apostille", "esanad", "degree attestation", "hrd authentication", "degree-verification", "mea-apostille"],
  },

  // ── Transport ──
  {
    id: "parivahan-helpline",
    name: "Parivahan / RTO Helpline",
    nameHi: "परिवहन / आरटीओ हेल्पलाइन",
    nameKn: "ಸಾರಿಗೆ / ಆರ್‌ಟಿಒ ಸಹಾಯವಾಣಿ",
    number: "0120-2459169",
    description: "National Transport helpline for driving license, RC, and vehicle registration queries.",
    domainIds: ["vehicle"],
    isEmergency: false,
    availability: "Mon-Fri 9:30AM-6PM",
    type: "LANDLINE",
    stageKeywords: ["driving license", "rc", "rto", "parivahan", "sarathi", "vahan"],
  },

  // ── Legal & Cyber ──
  {
    id: "consumer-helpline",
    name: "National Consumer Helpline",
    nameHi: "राष्ट्रीय उपभोक्ता हेल्पलाइन",
    nameKn: "ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ",
    number: "1800-11-4000",
    description: "File consumer complaints, seek statutory grievance resolution, and track status.",
    domainIds: ["legal"],
    isEmergency: false,
    availability: "Mon-Sat 9:30AM-5:30PM",
    type: "TOLL_FREE",
    stageKeywords: ["consumer", "dispute", "grievance", "complaint"],
  },
  {
    id: "cybercrime-helpline",
    name: "National Cyber Crime Helpline",
    nameHi: "राष्ट्रीय साइबर अपराध हेल्पलाइन",
    nameKn: "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿ",
    number: "1930",
    description: "Citizen financial fraud, identity theft, and cybercrime reporting portal helpline.",
    domainIds: ["legal"],
    isEmergency: true,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["cyber", "fraud", "scam", "unauthorized transaction"],
  },

  // ── Healthcare ──
  {
    id: "ayushman-helpline",
    name: "Ayushman Bharat Helpline",
    nameHi: "आयुष्मान भारत हेल्पलाइन",
    nameKn: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಸಹಾಯವಾಣಿ",
    number: "14555",
    description: "PM-JAY health coverage eligibility check and hospital queries.",
    domainIds: ["healthcare"],
    isEmergency: false,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["ayushman", "pm-jay", "health", "hospital"],
  },
  {
    id: "ambulance",
    name: "National Ambulance Service",
    nameHi: "राष्ट्रीय एम्बुलेंस सेवा",
    nameKn: "ರಾಷ್ಟ್ರೀಯ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ",
    number: "108",
    description: "Emergency medical and ambulance assistance.",
    domainIds: ["healthcare"],
    isEmergency: true,
    availability: "24x7",
    type: "TOLL_FREE",
    stageKeywords: ["medical", "ambulance", "emergency"],
  },
];

/**
 * Deterministically resolve only the helplines strictly pertinent to a particular journey step.
 * Checks explicit helpline IDs, required documents, title, description, and action types.
 */
export function getHelplinesForStep(step?: JourneyStep | null): Helpline[] {
  if (!step) return [];

  // 1. If step has explicit helpline IDs declared, return them first
  if (step.helplineIds && step.helplineIds.length > 0) {
    const matched = step.helplineIds
      .map((id) => helplines.find((h) => h.id === id))
      .filter(Boolean) as Helpline[];
    if (matched.length > 0) return matched;
  }

  // 2. Aggregate text footprint of this specific stage
  const corpus = [
    step.id || "",
    step.title || "",
    step.description || "",
    step.category || "",
    step.instructions?.summary || "",
    step.instructions?.digiLockerDocType || "",
    ...(step.instructions?.documentsRequired || []),
    ...(step.instructions?.requirementsList || []),
    ...(step.legalReferences || []),
  ]
    .join(" ")
    .toLowerCase();

  const matchedSet = new Set<string>();

  for (const helpline of helplines) {
    if (helpline.stageKeywords && helpline.stageKeywords.length > 0) {
      for (const kw of helpline.stageKeywords) {
        if (corpus.includes(kw.toLowerCase())) {
          matchedSet.add(helpline.id);
          break;
        }
      }
    }
  }

  // 3. Fallback to Aadhaar if DigiLocker or identity is used
  if (corpus.includes("aadhaar") && !matchedSet.has("aadhaar-helpline")) {
    matchedSet.add("aadhaar-helpline");
  }

  return Array.from(matchedSet)
    .map((id) => helplines.find((h) => h.id === id))
    .filter(Boolean) as Helpline[];
}

/** Get helplines by domain ID */
export function getHelplinesByDomain(domainId: string): Helpline[] {
  return helplines.filter((h) => h.domainIds.includes(domainId));
}

/** Get only emergency helplines */
export function getEmergencyHelplines(): Helpline[] {
  return helplines.filter((h) => h.isEmergency);
}
