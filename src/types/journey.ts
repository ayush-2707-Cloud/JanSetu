export type StepStatus = "COMPLETED" | "IN_PROGRESS" | "LOCKED";
export type Language =
  | "EN" // English
  | "HI" // Hindi (हिन्दी)
  | "KN" // Kannada (ಕನ್ನಡ)
  | "BN" // Bengali (বাংলা)
  | "TE" // Telugu (తెలుగు)
  | "TA" // Tamil (தமிழ்)
  | "MR" // Marathi (मराठी)
  | "GU" // Gujarati (ગુજરાતી)
  | "ML" // Malayalam (മലയാളം)
  | "PA" // Punjabi (ਪੰਜਾਬੀ)
  | "OR"; // Odia (ଓଡ଼ିଆ)

export interface InstructionPayload {
  summary: string;
  summaryHi?: string;
  summaryKn?: string;
  requirementsList?: string[];
  documentsRequired?: string[];
  fee?: string;
  actionUrl?: string;
  actionText?: string;
  notes?: string;
  prerequisites?: string[];
  digiLockerDocType?: string; // e.g., "AADHAAR", "PAN", "INCOME_CERTIFICATE"
  officerContact?: {
    name: string;
    role: string;
    email: string;
  };
}

export type DocumentVerificationStatus =
  | "VERIFIED_DIGILOCKER"
  | "VERIFIED_APISETU"
  | "REQUIRES_UPLOAD"
  | "OPTIONAL";

export interface SubStepDocumentRequirement {
  id: string;
  title: string;
  description?: string;
  isMandatory: boolean;
  status: DocumentVerificationStatus;
  templateUrl?: string;
  issuingAuthority?: string;
  verificationMethod?: "DIGILOCKER" | "APISETU" | "MANUAL_UPLOAD" | "SELF_DECLARATION";
}

export interface LegalDraftTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  statutoryAct?: string;
  eStampValue?: string;
  defaultFields: Record<string, string>;
  boilerplateText: string;
}

export interface SubStepItem {
  id: string;
  substepNumber?: number;
  sub_step_id?: string;
  title: string;
  titleHi?: string;
  titleKn?: string;
  description?: string;
  guidance?: string;
  descriptionHi?: string;
  descriptionKn?: string;
  isMandatory?: boolean;
  is_mandatory?: boolean;
  status: StepStatus;
  officialPortalUrl?: string;
  official_portal_url?: string;
  legalTemplateUrl?: string;
  legal_template_url?: string;
  statutoryFormCode?: string;
  statutory_form_code?: string;
  estimatedDuration?: string;
  requiredDocuments?: SubStepDocumentRequirement[];
  legalDraft?: LegalDraftTemplate;
}

export interface JourneyStep {
  id: string;
  stepNumber: number;
  step_id?: string;
  title: string;
  titleHi?: string;
  titleKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  status: StepStatus;
  category: string;
  estimatedDays?: string;
  completedAt?: string;
  requiresDigiLocker?: boolean;
  instructions: InstructionPayload;
  precautions?: LegalPrecaution[];
  officialLinks?: OfficialLink[];
  prerequisiteKnowledge?: PrerequisiteKnowledge[];
  documentRequirements?: DocumentRequirement[];
  substeps?: SubStepItem[];
  sub_steps?: SubStepItem[];
  legalDrafts?: LegalDraftTemplate[];
  commonMistakes?: string[];
  commonMistakesHi?: string[];
  commonMistakesKn?: string[];
  legalReferences?: string[];
  helplineIds?: string[];
}

export interface UniversalJourney {
  journeyId: string;
  title: string;
  titleHi?: string;
  titleKn?: string;
  department: string;
  agencyCode: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  category: string;
  iconName?: string;
  estimatedDuration: string;
  overallProgressPercentage: number;
  lastUpdated: string;
  applicantReference: string;
  domainId?: string;
  subcategoryId?: string;
  activityId?: string;
  jurisdiction?: string;
  relatedJourneyIds?: string[];
  totalEstimatedCost?: {
    governmentFees: string;
    professionalCharges?: string;
    totalRange: string;
  };
  steps: JourneyStep[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Hierarchical Cascading Category & Activity Taxonomy Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GoalActivityTrack {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  journeyId?: string; // Direct link to executable roadmap
  estimatedSteps?: number;
  estimatedDuration?: string;
  badgeText?: string;
  isPopular?: boolean;
}

export interface LegalDomainSubcategory {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  description?: string;
  iconName?: string;
  activities?: GoalActivityTrack[];
}

export interface LegalDomain {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  iconName: string;
  color: string;        // Tailwind color prefix e.g. "emerald", "blue"
  bgGradient: string;   // Tailwind gradient classes
  subcategories: LegalDomainSubcategory[];
}


// ─────────────────────────────────────────────────────────────────────────────
// Enhanced Legal Process Types (Phase 1 Expansion)
// These extend the existing types without breaking backward compatibility.
// ─────────────────────────────────────────────────────────────────────────────

/** Severity-tagged precaution shown as a warning/info banner per step */
export type PrecautionSeverity = "CRITICAL" | "WARNING" | "INFO";

export interface LegalPrecaution {
  id: string;
  severity: PrecautionSeverity;
  title: string;
  titleHi?: string;
  titleKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
}

/** Link to an official government portal with type tag and verification */
export type OfficialLinkType = "APPLY" | "DOWNLOAD" | "VERIFY" | "TRACK" | "PAY" | "INFO";

export interface OfficialLink {
  id: string;
  label: string;
  labelHi?: string;
  labelKn?: string;
  url: string;
  portal: string;             // e.g., "FSSAI Portal", "MCA Portal"
  type: OfficialLinkType;
  isGovernment: boolean;
}

/** Detailed document requirement with format and sourcing info */
export interface DocumentRequirement {
  id: string;
  name: string;
  nameHi?: string;
  nameKn?: string;
  description: string;
  isMandatory: boolean;
  format?: string;            // e.g., "PDF", "JPEG", "Original + Photocopy"
  maxSize?: string;           // e.g., "2MB"
  sampleUrl?: string;         // Link to sample/template
  obtainFrom?: string;        // Where to get it, e.g., "District Collector Office"
  estimatedTime?: string;     // Time to obtain, e.g., "2-3 Days"
}

/** Prerequisite knowledge card — "things to know before starting" */
export interface PrerequisiteKnowledge {
  id: string;
  title: string;
  titleHi?: string;
  titleKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  learnMoreUrl?: string;
}

/** Enhanced step type with all legal-specific fields */
export interface EnhancedJourneyStep extends JourneyStep {
  precautions?: LegalPrecaution[];
  officialLinks?: OfficialLink[];
  prerequisiteKnowledge?: PrerequisiteKnowledge[];
  documentRequirements?: DocumentRequirement[];
  commonMistakes?: string[];
  commonMistakesHi?: string[];
  commonMistakesKn?: string[];
  legalReferences?: string[];    // Act names, section numbers
  helplineIds?: string[];        // References to helplines.ts entries
}

/** Enhanced journey type with domain association and cost breakdown */
export interface EnhancedJourney extends UniversalJourney {
  domainId?: string;              // Maps to LegalDomain.id from domains.ts
  subcategoryId?: string;         // Maps to LegalDomainSubcategory.id
  relatedJourneyIds?: string[];   // Cross-references to related journeys
  totalEstimatedCost?: {
    governmentFees: string;       // e.g., "₹2,500 - ₹5,000"
    professionalCharges?: string; // e.g., "₹5,000 - ₹15,000 (CA/Lawyer)"
    totalRange: string;           // e.g., "₹7,500 - ₹20,000"
  };
  steps: EnhancedJourneyStep[];
}

/** User progress tracking (stored in localStorage, syncs to backend later) */
export interface UserJourneyProgress {
  journeyId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedSteps: string[];
  checkedDocuments: string[];      // Document IDs user has checked off
  personalNotes: Record<string, string>; // stepId → note
  bookmarked: boolean;
}

export interface UserProgress {
  userId?: string;                 // Populated when auth is available
  journeys: UserJourneyProgress[];
  recentSearches: string[];
  recentlyViewedJourneyIds: string[];
  preferredLanguage: Language;
}
