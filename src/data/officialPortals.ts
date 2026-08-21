/**
 * Official Government Portal Registry
 * Master list of verified government portals grouped by domain.
 * Each link is tagged with its type and verification status.
 */

export type PortalLinkType = "APPLY" | "DOWNLOAD" | "VERIFY" | "TRACK" | "PAY" | "INFO";

export interface OfficialPortal {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  url: string;
  type: PortalLinkType;
  description: string;
  domainId: string;       // Maps to LegalDomain.id
  isGovernment: boolean;
  ministry?: string;      // Parent ministry/department
  verifiedDate?: string;  // Last verification date
}

export const officialPortals: OfficialPortal[] = [
  // ── Business & Entrepreneurship ──
  {
    id: "mca-portal",
    name: "MCA Portal (Company Registration)",
    url: "https://www.mca.gov.in",
    type: "APPLY",
    description: "Ministry of Corporate Affairs — Register companies, file annual returns, and manage corporate compliance.",
    domainId: "business",
    isGovernment: true,
    ministry: "Ministry of Corporate Affairs",
    verifiedDate: "2026-07-15",
  },
  {
    id: "gst-portal",
    name: "GST Portal",
    url: "https://www.gst.gov.in",
    type: "APPLY",
    description: "Goods & Services Tax Network — GST registration, returns filing, and tax payment.",
    domainId: "business",
    isGovernment: true,
    ministry: "Ministry of Finance",
    verifiedDate: "2026-08-01",
  },
  {
    id: "fssai-foscos",
    name: "FSSAI FoSCoS Portal",
    url: "https://foscos.fssai.gov.in",
    type: "APPLY",
    description: "Food Safety and Standards Authority — License and registration for food businesses.",
    domainId: "business",
    isGovernment: true,
    ministry: "Ministry of Health & Family Welfare",
    verifiedDate: "2026-07-20",
  },
  {
    id: "udyam-registration",
    name: "Udyam Registration Portal",
    url: "https://udyamregistration.gov.in",
    type: "APPLY",
    description: "MSME/Udyam registration for micro, small, and medium enterprises.",
    domainId: "business",
    isGovernment: true,
    ministry: "Ministry of MSME",
    verifiedDate: "2026-07-10",
  },
  {
    id: "startup-india",
    name: "Startup India Portal",
    url: "https://www.startupindia.gov.in",
    type: "APPLY",
    description: "DPIIT recognition, tax benefits, and ecosystem support for startups.",
    domainId: "business",
    isGovernment: true,
    ministry: "Department for Promotion of Industry and Internal Trade",
    verifiedDate: "2026-08-10",
  },
  {
    id: "dgft-iec",
    name: "DGFT Portal (IEC Code)",
    url: "https://www.dgft.gov.in",
    type: "APPLY",
    description: "Directorate General of Foreign Trade — Import/Export Code (IEC) application.",
    domainId: "business",
    isGovernment: true,
    ministry: "Ministry of Commerce & Industry",
    verifiedDate: "2026-06-25",
  },

  // ── Property & Real Estate ──
  {
    id: "igr-karnataka",
    name: "Karnataka IGR (Sub-Registrar)",
    url: "https://karigr.karnataka.gov.in",
    type: "APPLY",
    description: "Inspector General of Registration — Property registration, encumbrance certificates, and stamp duty.",
    domainId: "property",
    isGovernment: true,
    ministry: "Department of Stamps & Registration",
    verifiedDate: "2026-07-28",
  },
  {
    id: "rera-portal",
    name: "RERA Portal",
    url: "https://rera.karnataka.gov.in",
    type: "VERIFY",
    description: "Real Estate Regulatory Authority — Check builder registration and project approvals.",
    domainId: "property",
    isGovernment: true,
    ministry: "Ministry of Housing & Urban Affairs",
    verifiedDate: "2026-07-15",
  },
  {
    id: "bhoomi-karnataka",
    name: "Bhoomi (Karnataka Land Records)",
    url: "https://landrecords.karnataka.gov.in",
    type: "VERIFY",
    description: "Karnataka Land Records — RTC (Record of Rights, Tenancy and Crop Inspection), mutation status.",
    domainId: "property",
    isGovernment: true,
    ministry: "Department of Revenue",
    verifiedDate: "2026-08-05",
  },

  // ── Education & Careers ──
  {
    id: "pm-vidyalaxmi",
    name: "PM-Vidyalaxmi Portal",
    url: "https://www.vidyalakshmi.co.in",
    type: "APPLY",
    description: "Common education loan portal — Apply to multiple banks and schemes in one application.",
    domainId: "education",
    isGovernment: true,
    ministry: "Ministry of Education",
    verifiedDate: "2026-07-30",
  },
  {
    id: "national-scholarship",
    name: "National Scholarship Portal",
    url: "https://scholarships.gov.in",
    type: "APPLY",
    description: "One-stop portal for all central and state government scholarship schemes.",
    domainId: "education",
    isGovernment: true,
    ministry: "Ministry of Electronics & IT",
    verifiedDate: "2026-08-02",
  },
  {
    id: "mea-apostille",
    name: "MEA eSanad Portal",
    url: "https://www.esanad.mea.gov.in",
    type: "APPLY",
    description: "Ministry of External Affairs — Apostille and attestation of educational documents.",
    domainId: "education",
    isGovernment: true,
    ministry: "Ministry of External Affairs",
    verifiedDate: "2026-07-12",
  },

  // ── Travel & Immigration ──
  {
    id: "passport-seva",
    name: "Passport Seva",
    url: "https://www.passportindia.gov.in",
    type: "APPLY",
    description: "Apply for fresh passport, renewal, and track application status.",
    domainId: "travel",
    isGovernment: true,
    ministry: "Ministry of External Affairs",
    verifiedDate: "2026-08-10",
  },
  {
    id: "indian-visa-online",
    name: "Indian Visa Online",
    url: "https://indianvisaonline.gov.in",
    type: "APPLY",
    description: "E-visa and regular visa applications for foreign nationals visiting India.",
    domainId: "travel",
    isGovernment: true,
    ministry: "Ministry of Home Affairs",
    verifiedDate: "2026-07-25",
  },
  {
    id: "oci-services",
    name: "OCI Services Portal",
    url: "https://ociservices.gov.in",
    type: "APPLY",
    description: "Overseas Citizen of India — Card application, renewal, and miscellaneous services.",
    domainId: "travel",
    isGovernment: true,
    ministry: "Ministry of Home Affairs",
    verifiedDate: "2026-07-18",
  },

  // ── Finance & Banking ──
  {
    id: "income-tax-efiling",
    name: "Income Tax e-Filing Portal",
    url: "https://www.incometax.gov.in",
    type: "APPLY",
    description: "File income tax returns, view Form 26AS, apply for PAN, and manage TDS.",
    domainId: "finance",
    isGovernment: true,
    ministry: "Central Board of Direct Taxes",
    verifiedDate: "2026-08-12",
  },
  {
    id: "nsdl-pan",
    name: "NSDL PAN Services",
    url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    type: "APPLY",
    description: "Apply for new PAN card, correction, or reprint through NSDL.",
    domainId: "finance",
    isGovernment: false,
    ministry: "NSDL e-Governance (Authorized by CBDT)",
    verifiedDate: "2026-07-22",
  },
  {
    id: "epfo-portal",
    name: "EPFO Member Portal",
    url: "https://unifiedportal-mem.epfindia.gov.in",
    type: "TRACK",
    description: "Employee Provident Fund Organization — Check balance, transfer, and withdrawal.",
    domainId: "finance",
    isGovernment: true,
    ministry: "Ministry of Labour & Employment",
    verifiedDate: "2026-08-01",
  },

  // ── Vehicle & Transport ──
  {
    id: "parivahan",
    name: "Parivahan (Transport Portal)",
    url: "https://parivahan.gov.in",
    type: "APPLY",
    description: "Apply for driving license, vehicle registration, and learner's permit.",
    domainId: "vehicle",
    isGovernment: true,
    ministry: "Ministry of Road Transport & Highways",
    verifiedDate: "2026-08-08",
  },
  {
    id: "vahan-portal",
    name: "VAHAN Portal",
    url: "https://vahan.parivahan.gov.in",
    type: "VERIFY",
    description: "National vehicle registration database — Verify RC details and ownership.",
    domainId: "vehicle",
    isGovernment: true,
    ministry: "Ministry of Road Transport & Highways",
    verifiedDate: "2026-08-08",
  },

  // ── Legal Disputes ──
  {
    id: "edaakhil",
    name: "e-Daakhil (Consumer Complaints)",
    url: "https://edaakhil.nic.in",
    type: "APPLY",
    description: "National Consumer Disputes Redressal Commission — File consumer complaints online.",
    domainId: "legal",
    isGovernment: true,
    ministry: "Ministry of Consumer Affairs",
    verifiedDate: "2026-07-30",
  },
  {
    id: "rti-portal",
    name: "RTI Online Portal",
    url: "https://rtionline.gov.in",
    type: "APPLY",
    description: "File Right to Information applications to central government departments.",
    domainId: "legal",
    isGovernment: true,
    ministry: "Department of Personnel & Training",
    verifiedDate: "2026-08-05",
  },
  {
    id: "cybercrime-portal",
    name: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in",
    type: "APPLY",
    description: "Report cyber crimes including financial fraud, social media offences, and hacking.",
    domainId: "legal",
    isGovernment: true,
    ministry: "Ministry of Home Affairs",
    verifiedDate: "2026-08-10",
  },

  // ── Identity & Civic Documents ──
  {
    id: "uidai-aadhaar",
    name: "UIDAI (Aadhaar Portal)",
    url: "https://uidai.gov.in",
    type: "APPLY",
    description: "Aadhaar enrolment, update, download, and verify demographic/biometric data.",
    domainId: "identity",
    isGovernment: true,
    ministry: "Unique Identification Authority of India",
    verifiedDate: "2026-08-12",
  },
  {
    id: "nvsp-voter",
    name: "National Voter Service Portal",
    url: "https://www.nvsp.in",
    type: "APPLY",
    description: "Voter registration, electoral roll search, and Voter ID card application.",
    domainId: "identity",
    isGovernment: true,
    ministry: "Election Commission of India",
    verifiedDate: "2026-08-01",
  },
  {
    id: "digilocker",
    name: "DigiLocker",
    url: "https://www.digilocker.gov.in",
    type: "VERIFY",
    description: "Government-issued digital document wallet — Access Aadhaar, PAN, driving license, and more.",
    domainId: "identity",
    isGovernment: true,
    ministry: "Ministry of Electronics & IT",
    verifiedDate: "2026-08-15",
  },

  // ── Healthcare ──
  {
    id: "pmjay-portal",
    name: "Ayushman Bharat PM-JAY Portal",
    url: "https://pmjay.gov.in",
    type: "APPLY",
    description: "Pradhan Mantri Jan Arogya Yojana — Check eligibility and enrol for health coverage.",
    domainId: "healthcare",
    isGovernment: true,
    ministry: "National Health Authority",
    verifiedDate: "2026-07-28",
  },
];

/** Get portals by domain ID */
export function getPortalsByDomain(domainId: string): OfficialPortal[] {
  return officialPortals.filter((p) => p.domainId === domainId);
}

/** Get portal by ID */
export function getPortalById(id: string): OfficialPortal | undefined {
  return officialPortals.find((p) => p.id === id);
}
