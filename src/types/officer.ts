/**
 * Officer Back-Office Dashboard & Scrutiny Types for JanSetu™ (जनसेतु)
 */

export type UserRole = "OFFICER_ROLE" | "CITIZEN_ROLE" | "ADMIN_ROLE";

export type ApplicationStatus = "PENDING_REVIEW" | "APPROVED" | "DEFECT_FLAGGED" | "REJECTED";

export type DepartmentCode = "MSME" | "FOOD_SAFETY" | "REVENUE" | "MUNICIPAL" | "TRANSPORT" | "LABOUR";

export interface VerificationTimelineItem {
  step_id: string;
  step_title: string;
  department: string;
  completed_at?: string | null;
  status: "VERIFIED" | "PENDING" | "DEFECT" | "NOT_REACHED";
  verified_by?: string | null;
  officer_remarks?: string | null;
}

export interface DossierDocument {
  doc_id: string;
  doc_name: string;
  category: string;
  verification_status: "VERIFIED_DIGILOCKER" | "REQUIRES_SCRUTINY" | "SELF_ATTESTED" | "DEFECT";
  issuing_authority: string;
  file_url?: string | null;
  hash_checksum?: string | null;
  uploaded_at: string;
}

export interface BeneficiaryDossier {
  citizen_name: string;
  applicant_id: string;
  aadhaar_masked: string;
  pan_masked: string;
  mobile: string;
  email: string;
  enterprise_name?: string | null;
  entity_type?: string | null;
  registered_address: string;
  pincode: string;
  state: string;
  district: string;
  timeline: VerificationTimelineItem[];
  documents: DossierDocument[];
}

export interface OfficerApplication {
  utid: string;
  application_id?: string;
  applicant_name: string;
  citizen_name?: string;
  enterprise_name?: string | null;
  department: DepartmentCode;
  department_name: string;
  target_goal: string;
  service_title?: string;
  journey_id: string;
  current_step_id: string;
  current_department_stage: string;
  current_step_title?: string;
  status: ApplicationStatus;
  submission_date: string;
  sla_deadline: string;
  sla_hours_total: number;
  sla_hours_remaining: number;
  is_sla_breached: boolean;
  risk_score: number; // 0 - 100
  dossier: BeneficiaryDossier;
  last_action_date?: string | null;
  last_officer_id?: string | null;
  last_officer_remarks?: string | null;
}

export interface OfficerDecisionRequest {
  utid: string;
  application_id?: string;
  step_id: string;
  decision: ApplicationStatus;
  remarks: string;
  defect_reasons?: string[];
  officer_id?: string;
  officer_name?: string;
  department?: DepartmentCode;
}

export interface OfficerDecisionResponse {
  success: boolean;
  utid: string;
  application_id?: string;
  new_status: ApplicationStatus;
  decision_timestamp: string;
  sla_time_delta_hours: number;
  sla_performance_summary: string;
  audit_reference_id: string;
  officer_id: string;
  message: string;
  citizen_roadmap_updated?: boolean;
}

export interface DossierAnalysisRequest {
  utid: string;
  application_id?: string;
  service_title: string;
  department: string;
  citizen_name: string;
  enterprise_name?: string | null;
  documents: Array<{ doc_name: string; status: string }>;
  timeline: Array<{ step_title: string; status: string }>;
  additional_notes?: string;
}

export interface DossierAnalysisResponse {
  utid: string;
  application_id?: string;
  identity_verification_status: string;
  document_completeness: string;
  regulatory_red_flags: string;
  overall_risk_level: "LOW" | "MEDIUM" | "ELEVATED";
  risk_score: number;
  statutory_citations: string[];
  recommended_action: "APPROVE" | "REQUEST_CLARIFICATION" | "REJECT";
  analysis_timestamp: string;
}
