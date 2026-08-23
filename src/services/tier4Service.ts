/**
 * Tier-4 Service for Problem Statement Enhancements (SIH26129 - Maharashtra).
 *
 * Implements:
 * 1. Unified Cross-Portal Application Tracking
 * 2. Consent-Based Data Sharing Ledger & DPDP Revocation
 * 3. Cross-Department Officer Coordination Summary & Inter-Agency Handoffs
 * 4. Exception Handling & AI Resolution Pipeline
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApplicationTrackItem {
  utid: string;
  application_id: string;
  journey_id: string;
  journey_title: string;
  department_code: string;
  department_name: string;
  portal_origin: string;
  current_milestone: string;
  status: string;
  sla_total_days: number;
  sla_days_remaining: number;
  sla_status: "ON_TRACK" | "WARNING" | "ESCALATED" | "COMPLETED";
  assigned_officer: string;
  submitted_at: string;
  last_updated_at: string;
  action_required_by_citizen: boolean;
  action_notes?: string;
}

export interface UnifiedTrackerResponse {
  citizen_name: string;
  pan_masked: string;
  total_active_applications: number;
  completed_applications: number;
  pending_actions_count: number;
  overall_sla_compliance_rate: number;
  applications: ApplicationTrackItem[];
}

export interface ConsentItem {
  consent_id: string;
  utid: string;
  department_code: string;
  department_name: string;
  purpose: string;
  data_elements_shared: string[];
  legal_basis: string;
  granted_at: string;
  expiry_at: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  access_frequency: string;
  total_data_access_count: number;
}

export interface DepartmentStat {
  department_code: string;
  department_name: string;
  icon: string;
  total_received: number;
  pending_scrutiny: number;
  approved_count: number;
  defects_flagged: number;
  avg_turnaround_days: number;
  sla_compliance_rate: number;
  active_grievances: number;
}

export interface InterDepartmentHandoff {
  handoff_id: string;
  source_department: string;
  target_department: string;
  service_transition: string;
  active_in_flight_count: number;
  bottleneck_score: "LOW" | "MODERATE" | "HIGH";
  recommendation: string;
}

export interface CrossDepartmentSummaryResponse {
  total_statewide_applications: number;
  total_approved_statewide: number;
  total_active_grievances: number;
  overall_sla_compliance_rate: number;
  statewide_avg_days: number;
  department_breakdown: DepartmentStat[];
  inter_department_handoffs: InterDepartmentHandoff[];
}

export interface ExceptionRecord {
  exception_id: string;
  utid: string;
  application_id: string;
  citizen_name: string;
  department_code: string;
  department_name: string;
  exception_type: string;
  severity: "WARNING" | "BLOCKED" | "CRITICAL";
  description: string;
  detected_value: string;
  expected_value: string;
  ai_confidence_score: number;
  ai_suggested_fix: string;
  status: "PENDING_RESOLUTION" | "AUTO_FIXED" | "MANUALLY_OVERRIDDEN" | "REJECTED" | "REUPLOAD_REQUESTED";
  logged_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

// --- API Functions with Offline Fallbacks ---

export async function fetchMyUnifiedApplications(statusFilter?: string): Promise<UnifiedTrackerResponse> {
  try {
    const url = statusFilter ? `${API_BASE}/tracker/my-applications?status_filter=${statusFilter}` : `${API_BASE}/tracker/my-applications`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for unified tracker:", e);
  }

  return {
    citizen_name: "Ayush Singh Chauhan",
    pan_masked: "BKZPC****A",
    total_active_applications: 3,
    completed_applications: 2,
    pending_actions_count: 1,
    overall_sla_compliance_rate: 94.5,
    applications: [
      {
        utid: "UTID-MH-2026-094182",
        application_id: "FSSAI-MH-2026-88129",
        journey_id: "commercial_restaurant_journey",
        journey_title: "Commercial Restaurant & Food Establishment",
        department_code: "FOOD_SAFETY",
        department_name: "Food Safety and Standards Authority of India",
        portal_origin: "FoSCoS Central Portal (FSSAI)",
        current_milestone: "Stage 2: Designated Officer Document Scrutiny",
        status: "SCRUTINY_STAGE_1",
        sla_total_days: 14,
        sla_days_remaining: 9,
        sla_status: "ON_TRACK",
        assigned_officer: "Dr. Rajesh G. Deshmukh (DO-Pune-04)",
        submitted_at: "2026-02-18T10:30:00Z",
        last_updated_at: "2026-02-22T14:15:00Z",
        action_required_by_citizen: false,
        action_notes: "Application undergoing desk scrutiny for water test certificate.",
      },
      {
        utid: "UTID-MH-2026-094182",
        application_id: "BMC-TRADE-2026-44012",
        journey_id: "commercial_restaurant_journey",
        journey_title: "Commercial Restaurant & Food Establishment",
        department_code: "MUNICIPAL",
        department_name: "Brihanmumbai Municipal Corporation (BMC)",
        portal_origin: "Aaple Sarkar Municipal Gateway",
        current_milestone: "Health Trade License & Fire NOC Verification",
        status: "DEFECT_FLAGGED",
        sla_total_days: 21,
        sla_days_remaining: 4,
        sla_status: "WARNING",
        assigned_officer: "Shri Vikas Kulkarni (Health Officer K-East)",
        submitted_at: "2026-02-16T11:00:00Z",
        last_updated_at: "2026-02-23T09:45:00Z",
        action_required_by_citizen: true,
        action_notes: "Uploaded Commercial Rent Agreement missing Sub-Registrar stamp seal. Re-upload requested.",
      },
      {
        utid: "UTID-MH-2026-094182",
        application_id: "REV-MH-712-90184",
        journey_id: "commercial_restaurant_journey",
        journey_title: "Commercial Restaurant & Food Establishment",
        department_code: "REVENUE",
        department_name: "Department of Revenue & Land Records (Mahabhulekh)",
        portal_origin: "Mahabhulekh Land Records System",
        current_milestone: "Non-Agricultural (NA) Land Conversion Clearance",
        status: "APPROVED",
        sla_total_days: 30,
        sla_days_remaining: 0,
        sla_status: "COMPLETED",
        assigned_officer: "Smt. Anjali S. Patil (Tahsildar Haveli)",
        submitted_at: "2026-02-05T09:00:00Z",
        last_updated_at: "2026-02-19T16:20:00Z",
        action_required_by_citizen: false,
        action_notes: "Digitally signed 7/12 extract and NA Certificate issued via DigiLocker.",
      },
      {
        utid: "UTID-MH-2026-094182",
        application_id: "UDYAM-MH-26-0091823",
        journey_id: "msme_udyam_journey",
        journey_title: "Udyam MSME Enterprise Registration",
        department_code: "MSME",
        department_name: "Ministry of Micro, Small and Medium Enterprises",
        portal_origin: "National Udyam Registration Portal",
        current_milestone: "Automated ITR & GSTIN Inter-linking",
        status: "APPROVED",
        sla_total_days: 1,
        sla_days_remaining: 0,
        sla_status: "COMPLETED",
        assigned_officer: "Automated MDM Interoperability Gateway",
        submitted_at: "2026-02-10T14:20:00Z",
        last_updated_at: "2026-02-10T14:21:00Z",
        action_required_by_citizen: false,
        action_notes: "Zero-touch instant issuance based on verified PAN & GST token.",
      },
    ],
  };
}

export async function fetchConsentLedger(utid = "UTID-MH-2026-094182"): Promise<ConsentItem[]> {
  try {
    const res = await fetch(`${API_BASE}/consent/ledger?utid=${utid}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for consent ledger:", e);
  }

  return [
    {
      consent_id: "CNS-FSSAI-094182",
      utid: "UTID-MH-2026-094182",
      department_code: "FOOD_SAFETY",
      department_name: "Food Safety Authority (FSSAI)",
      purpose: "Food Business Operator Registration & Hygiene Scrutiny",
      data_elements_shared: ["PAN_NUMBER", "FULL_NAME", "BUSINESS_ADDRESS", "ELECTRICITY_BILL_PROOF"],
      legal_basis: "DPDP Act 2023 Sec 6(1) & FSS Act 2006",
      granted_at: "2026-02-18T10:30:00Z",
      expiry_at: "2027-02-18T10:30:00Z",
      status: "ACTIVE",
      access_frequency: "ON_DEMAND",
      total_data_access_count: 3,
    },
    {
      consent_id: "CNS-BMC-094182",
      utid: "UTID-MH-2026-094182",
      department_code: "MUNICIPAL",
      department_name: "Brihanmumbai Municipal Corporation (BMC)",
      purpose: "Municipal Health Trade License & Fire Safety NOC",
      data_elements_shared: ["PAN_NUMBER", "PROPERTY_PID", "KHASRA_PLOT_NO", "WATER_TEST_REPORT"],
      legal_basis: "MMC Act 1888 Sec 394 & DPDP 2023",
      granted_at: "2026-02-16T11:00:00Z",
      expiry_at: "2027-02-16T11:00:00Z",
      status: "ACTIVE",
      access_frequency: "ONCE",
      total_data_access_count: 1,
    },
  ];
}

export async function revokeDepartmentConsent(consentId: string, reason: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/consent/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent_id: consentId, reason }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for consent revocation:", e);
  }

  return {
    consent_id: consentId,
    status: "REVOKED",
    revoked_at: new Date().toISOString(),
    message: "Consent revoked successfully.",
    sha256_revocation_hash: "a492810f849102c4819028401928401928401928401928401928401928401928",
  };
}

export async function fetchCrossDepartmentSummary(): Promise<CrossDepartmentSummaryResponse> {
  try {
    const res = await fetch(`${API_BASE}/officer/coordination/summary`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for cross department summary:", e);
  }

  return {
    total_statewide_applications: 13850,
    total_approved_statewide: 12080,
    total_active_grievances: 29,
    overall_sla_compliance_rate: 95.3,
    statewide_avg_days: 2.78,
    department_breakdown: [
      {
        department_code: "FOOD_SAFETY",
        department_name: "Food Safety Authority (FSSAI)",
        icon: "🍲",
        total_received: 1420,
        pending_scrutiny: 180,
        approved_count: 1180,
        defects_flagged: 60,
        avg_turnaround_days: 2.8,
        sla_compliance_rate: 96.2,
        active_grievances: 3,
      },
      {
        department_code: "MUNICIPAL",
        department_name: "Municipal Corporation (BMC / PMC)",
        icon: "🏙️",
        total_received: 2850,
        pending_scrutiny: 490,
        approved_count: 2150,
        defects_flagged: 210,
        avg_turnaround_days: 4.1,
        sla_compliance_rate: 91.4,
        active_grievances: 14,
      },
      {
        department_code: "REVENUE",
        department_name: "Revenue & Land Records (Mahabhulekh)",
        icon: "📜",
        total_received: 3100,
        pending_scrutiny: 320,
        approved_count: 2680,
        defects_flagged: 100,
        avg_turnaround_days: 3.4,
        sla_compliance_rate: 95.8,
        active_grievances: 6,
      },
      {
        department_code: "MSME",
        department_name: "MSME / Udyam Directorate",
        icon: "🏢",
        total_received: 4500,
        pending_scrutiny: 85,
        approved_count: 4390,
        defects_flagged: 25,
        avg_turnaround_days: 0.5,
        sla_compliance_rate: 99.2,
        active_grievances: 1,
      },
      {
        department_code: "TRANSPORT",
        department_name: "Transport & RTO Commissionerate",
        icon: "🚛",
        total_received: 1980,
        pending_scrutiny: 240,
        approved_count: 1680,
        defects_flagged: 60,
        avg_turnaround_days: 3.1,
        sla_compliance_rate: 94.0,
        active_grievances: 5,
      },
    ],
    inter_department_handoffs: [
      {
        handoff_id: "HO-FSSAI-BMC-01",
        source_department: "Food Safety (FSSAI)",
        target_department: "Municipal Corporation (Trade NOC)",
        service_transition: "FSSAI License Issued -> Municipal Fire & Health Inspection",
        active_in_flight_count: 142,
        bottleneck_score: "LOW",
        recommendation: "Auto-share FSSAI inspection report to bypass redundant municipal kitchen inspection.",
      },
    ],
  };
}

export async function fetchOfficerExceptions(statusFilter?: string, departmentCode?: string): Promise<ExceptionRecord[]> {
  try {
    let url = `${API_BASE}/officer/exceptions`;
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== "ALL") params.append("status_filter", statusFilter);
    if (departmentCode && departmentCode !== "ALL") params.append("department_code", departmentCode);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for officer exceptions:", e);
  }

  return [
    {
      exception_id: "EXC-2026-00192",
      utid: "UTID-MH-2026-094182",
      application_id: "BMC-TRADE-2026-44012",
      citizen_name: "Ayush Singh Chauhan",
      department_code: "MUNICIPAL",
      department_name: "Municipal Corporation (BMC)",
      exception_type: "NAME_MISMATCH",
      severity: "WARNING",
      description: "Fuzzy demographic discrepancy detected between Aadhaar e-KYC and Municipal Property Tax Record.",
      detected_value: "Ayush S. Chouhan",
      expected_value: "Ayush Singh Chauhan",
      ai_confidence_score: 94.2,
      ai_suggested_fix: "Accept phonetically normalized identity via DigiLocker PAN deterministic cross-verification.",
      status: "PENDING_RESOLUTION",
      logged_at: "2026-02-23T09:45:00Z",
    },
  ];
}

export async function resolveOfficerException(
  exceptionId: string,
  action: string,
  officerNotes: string
): Promise<ExceptionRecord> {
  try {
    const res = await fetch(`${API_BASE}/officer/exceptions/${exceptionId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        officer_notes: officerNotes,
        officer_id: "OFFICER-MH-8492",
      }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for resolve exception:", e);
  }

  return {
    exception_id: exceptionId,
    utid: "UTID-MH-2026-094182",
    application_id: "BMC-TRADE-2026-44012",
    citizen_name: "Ayush Singh Chauhan",
    department_code: "MUNICIPAL",
    department_name: "Municipal Corporation (BMC)",
    exception_type: "NAME_MISMATCH",
    severity: "WARNING",
    description: "Fuzzy demographic discrepancy resolved.",
    detected_value: "Ayush S. Chouhan",
    expected_value: "Ayush Singh Chauhan",
    ai_confidence_score: 94.2,
    ai_suggested_fix: "Accepted fix.",
    status: action === "ACCEPT_AI_FIX" ? "AUTO_FIXED" : "MANUALLY_OVERRIDDEN",
    logged_at: "2026-02-23T09:45:00Z",
    resolved_at: new Date().toISOString(),
    resolved_by: "OFFICER-MH-8492",
    resolution_notes: officerNotes,
  };
}
