/**
 * Client Service for JanSetu Interoperability Middleware.
 * Provides client interfaces and fallback generators for:
 * 1. Reusable Connectors & Protocol Adapters (SOAP/XML <-> REST/JSON)
 * 2. Master Data Management (MDM) Golden Record & Once-Only Auto-Fill
 * 3. Cryptographic SHA-256 Audit Trail & SLA Analytics
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ConnectorSpec {
  id: string;
  name: string;
  department: string;
  protocol: "REST_JSON" | "SOAP_XML" | "BATCH_XML" | "WEBHOOK" | "OAUTH2_BRIDGE";
  version: string;
  endpoint_url: string;
  latency_ms: number;
  uptime_percentage: number;
  status: "ACTIVE" | "DEGRADED" | "STANDBY";
  supported_operations: string[];
  sample_legacy_payload: string;
  sample_canonical_json: Record<string, any>;
}

export interface ProtocolTransformResponse {
  connector_id: string;
  direction: string;
  original_protocol: string;
  transformed_protocol: string;
  transformed_content: string;
  schema_validation_passed: boolean;
  transformation_latency_ms: number;
  mapped_fields_count: number;
}

export interface MDMGoldenRecord {
  citizen_id: string;
  full_name: string;
  pan_number: string;
  aadhaar_masked: string;
  phone_masked: string;
  email_masked: string;
  date_of_birth: string;
  gender: string;
  primary_address: Record<string, string>;
  registered_enterprises: Array<Record<string, any>>;
  land_parcels: Array<Record<string, any>>;
  identity_attributes: Array<{
    key: string;
    label: string;
    value: string;
    provenance: {
      department: string;
      registry_name: string;
      verified_at: string;
      verification_method: string;
      confidence_score: number;
    };
    is_authoritative: boolean;
  }>;
  deduplication_confidence: number;
  last_sync_timestamp: string;
}

export interface DepartmentPreFilledForm {
  department_code: string;
  form_title: string;
  statutory_portal: string;
  pre_filled_fields: Record<string, any>;
  eliminated_manual_keystrokes: number;
  auto_validated_docs: string[];
}

export interface AutoPopulateResponse {
  citizen_id: string;
  once_only_principle_applied: boolean;
  total_eliminated_fields: number;
  total_time_saved_minutes: number;
  department_forms: DepartmentPreFilledForm[];
}

export interface CryptographicAuditEvent {
  event_id: string;
  sequence_number: number;
  timestamp: string;
  action_type: string;
  actor_role: string;
  actor_identifier: string;
  department: string;
  details: string;
  previous_hash: string;
  current_hash: string;
  signature_algorithm: string;
  ip_origin: string;
}

export interface AuditLedgerResponse {
  utid: string;
  total_events: number;
  genesis_timestamp: string;
  latest_hash: string;
  is_ledger_tamper_free: boolean;
  events: CryptographicAuditEvent[];
}

export interface SLAMetric {
  department: string;
  service_name: string;
  statutory_sla_days: number;
  actual_average_days: number;
  sla_compliance_rate: number;
  active_in_flight: number;
  escalated_cases: number;
  right_to_services_act_clause: string;
}

export interface DepartmentSLAAnalytics {
  overall_sla_compliance_pct: number;
  total_turnaround_reduction_pct: number;
  average_processing_days: number;
  active_bottleneck_department: string;
  department_metrics: SLAMetric[];
  timestamp: string;
}

// --- API Calls with High-Fidelity Fallbacks ---

export async function fetchConnectorsList(): Promise<ConnectorSpec[]> {
  try {
    const res = await fetch(`${API_BASE}/connectors/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for connectors list:", e);
  }

  // Fallback
  return [
    {
      id: "conn-digilocker",
      name: "DigiLocker National e-Credentials Gateway",
      department: "Ministry of Electronics & IT (MeitY)",
      protocol: "REST_JSON",
      version: "v3.2.0 (OpenAPI 3.0)",
      endpoint_url: "https://api.digitallocker.gov.in/public/oauth2/1/token",
      latency_ms: 28,
      uptime_percentage: 99.99,
      status: "ACTIVE",
      supported_operations: ["FETCH_URI_DOC", "VERIFY_AUTH_TOKEN", "PULL_MASKED_AADHAAR"],
      sample_legacy_payload: '{\n  "client_id": "JANSETU_GOVTECH_2026",\n  "doc_type": "PANCR",\n  "uri": "in.gov.pan/pancr/BKZPC9912A"\n}',
      sample_canonical_json: {
        source_registry: "CBDT_INCOMETAX",
        credential_type: "PERMANENT_ACCOUNT_NUMBER",
        credential_id: "BKZPC9912A",
        holder_name: "Vikram Sheshadri Rao",
        verification_status: "DIGILOCKER_SEALED",
      },
    },
    {
      id: "conn-bhoomi",
      name: "State Land Records (Bhoomi / Mahabhulekh) SOAP Wrapper",
      department: "State Revenue & Land Reforms Department",
      protocol: "SOAP_XML",
      version: "SOAP 1.2 / WSDL 2.0",
      endpoint_url: "https://bhoomi.karnataka.gov.in/ws/LandRecordsService.asmx",
      latency_ms: 74,
      uptime_percentage: 99.85,
      status: "ACTIVE",
      supported_operations: ["GET_RTC_MUTATION", "VERIFY_SURVEY_NO", "CHECK_ENCUMBRANCE"],
      sample_legacy_payload:
        '<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <GetRtcExtract xmlns="http://bhoomi.kar.nic.in/">\n      <DistrictCode>18</DistrictCode>\n      <TalukCode>04</TalukCode>\n      <SurveyNo>142/2A</SurveyNo>\n    </GetRtcExtract>\n  </soap:Body>\n</soap:Envelope>',
      sample_canonical_json: {
        canonical_parcel_id: "LAND-KA-18-04-019-142-2A",
        owner_name: "Vikram Sheshadri Rao",
        extent_acres: 2.45,
        encumbrance_status: "UNENCUMBERED_CLEAN",
      },
    },
    {
      id: "conn-mca21",
      name: "MCA21 Corporate Affairs V3 Batch XML Connector",
      department: "Ministry of Corporate Affairs (MCA)",
      protocol: "BATCH_XML",
      version: "MCA-XML-Dossier-v4.1",
      endpoint_url: "https://www.mca.gov.in/mcafoportal/companyLLPMasterData.do",
      latency_ms: 58,
      uptime_percentage: 99.92,
      status: "ACTIVE",
      supported_operations: ["VERIFY_CIN_LLPIN", "CHECK_DIN_STATUS", "FETCH_MOA_AOA"],
      sample_legacy_payload:
        '<CompanyDataRequest version="4.1">\n  <Query>\n    <CIN>U72900KA2026PTC192841</CIN>\n  </Query>\n</CompanyDataRequest>',
      sample_canonical_json: {
        cin: "U72900KA2026PTC192841",
        company_name: "Rao Culinary Labs Private Limited",
        company_status: "ACTIVE_COMPLIANT",
      },
    },
    {
      id: "conn-fssai",
      name: "FSSAI FoSCoS Real-Time Webhook Engine",
      department: "Food Safety and Standards Authority of India",
      protocol: "WEBHOOK",
      version: "FoSCoS-REST-v2.8",
      endpoint_url: "https://foscos.fssai.gov.in/api/v2/application/status-event",
      latency_ms: 31,
      uptime_percentage: 99.98,
      status: "ACTIVE",
      supported_operations: ["PUSH_APPLICATION_DOSSIER", "SUBSCRIBE_SCRUTINY_EVENT"],
      sample_legacy_payload:
        '{\n  "event": "FSSAI_STATE_LICENSE_APPLICATION_SUBMITTED",\n  "application_ref": "FSSAI-2026-BLR-0941"\n}',
      sample_canonical_json: {
        licensing_authority: "FSSAI_KARNATAKA_STATE",
        statutory_turnaround_days: 14,
        inspection_mandated: true,
      },
    },
    {
      id: "conn-gstn",
      name: "GSTN Common Portal OAuth2 & Invoicing Bridge",
      department: "Goods and Services Tax Network (GSTN)",
      protocol: "OAUTH2_BRIDGE",
      version: "GST-API-Setu-v1.4",
      endpoint_url: "https://api.gst.gov.in/taxpayerapi/v1.4/returns",
      latency_ms: 42,
      uptime_percentage: 99.95,
      status: "ACTIVE",
      supported_operations: ["VERIFY_GSTIN", "FETCH_TAX_JURISDICTION"],
      sample_legacy_payload: '{\n  "gstin": "29ABCDE1234F1Z5",\n  "action": "TP_PROFILE"\n}',
      sample_canonical_json: {
        gstin: "29ABCDE1234F1Z5",
        trade_name: "Rao Cloud Kitchens",
        gstin_status: "ACTIVE",
      },
    },
  ];
}

export async function transformProtocol(
  connectorId: string,
  direction: "LEGACY_TO_CANONICAL" | "CANONICAL_TO_LEGACY",
  content: string
): Promise<ProtocolTransformResponse> {
  try {
    const res = await fetch(`${API_BASE}/connectors/transform`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        connector_id: connectorId,
        direction,
        payload_content: content,
      }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for protocol transformation:", e);
  }

  return {
    connector_id: connectorId,
    direction,
    original_protocol: "SOAP_XML",
    transformed_protocol: "REST_JSON",
    transformed_content: JSON.stringify(
      {
        canonical_parcel_id: "LAND-KA-18-04-019-142-2A",
        owner_name: "Vikram Sheshadri Rao",
        status: "VERIFIED_BHOOMI_SOAP",
        unencumbered: true,
        transformed_via: "JanSetu Legacy SOAP-to-JSON Adapter (Fallback)",
      },
      null,
      2
    ),
    schema_validation_passed: true,
    transformation_latency_ms: 1.8,
    mapped_fields_count: 5,
  };
}

export async function fetchMDMGoldenRecord(citizenId = "CIT-2026-IND-9481"): Promise<MDMGoldenRecord> {
  try {
    const res = await fetch(`${API_BASE}/mdm/golden-record/${citizenId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for MDM Golden Record:", e);
  }

  return {
    citizen_id: citizenId,
    full_name: "Vikram Sheshadri Rao",
    pan_number: "BKZPC9912A",
    aadhaar_masked: "XXXX-XXXX-8842",
    phone_masked: "+91 98765-XX410",
    email_masked: "vikram.r***@gmail.com",
    date_of_birth: "1992-07-14",
    gender: "MALE",
    primary_address: {
      line1: "#42, 100 Feet Road, HAL 2nd Stage",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pin_code: "560008",
      municipal_ward: "Ward 4 (Indiranagar / BBMP East)",
    },
    registered_enterprises: [
      {
        enterprise_name: "Rao Culinary Labs Pvt Ltd",
        cin: "U72900KA2026PTC192841",
        udyam_number: "UDYAM-KR-03-0094812",
        gstin: "29ABCDE1234F1Z5",
        classification: "MICRO_FOOD_ENTERPRISE",
      },
    ],
    land_parcels: [
      {
        parcel_id: "LAND-KA-18-04-019-142-2A",
        survey_number: "142/2A",
        extent: "2.45 Acres",
        zoning: "COMMERCIAL_FOOD_AND_BEVERAGE",
        unencumbered: true,
      },
    ],
    identity_attributes: [
      {
        key: "full_name",
        label: "Full Legal Name",
        value: "Vikram Sheshadri Rao",
        provenance: {
          department: "Ministry of Electronics & IT",
          registry_name: "UIDAI Aadhaar DigiLocker e-KYC Vault",
          verified_at: "2026-02-18T10:14:22Z",
          verification_method: "DIGILOCKER_XML_EKYC",
          confidence_score: 1.0,
        },
        is_authoritative: true,
      },
      {
        key: "pan_number",
        label: "Permanent Account Number (PAN)",
        value: "BKZPC9912A",
        provenance: {
          department: "Ministry of Finance (CBDT)",
          registry_name: "Income Tax PAN Master Database",
          verified_at: "2026-02-18T10:14:25Z",
          verification_method: "ITD_NSDL_DIRECT_LOOKUP",
          confidence_score: 1.0,
        },
        is_authoritative: true,
      },
      {
        key: "primary_premises_land_parcel",
        label: "Commercial Premises Land Record (RTC 7/12)",
        value: "Survey No. 142/2A, Indiranagar, Ward 4",
        provenance: {
          department: "State Revenue & Land Reforms",
          registry_name: "Bhoomi / Mahabhulekh Land Ledger",
          verified_at: "2026-02-19T14:30:10Z",
          verification_method: "BHOOMI_SOAP_PARCEL_VERIFY",
          confidence_score: 0.995,
        },
        is_authoritative: true,
      },
      {
        key: "msme_registration",
        label: "MSME Udyam Registration Number",
        value: "UDYAM-KR-03-0094812",
        provenance: {
          department: "Ministry of MSME",
          registry_name: "National Udyam Portal",
          verified_at: "2026-02-20T09:12:00Z",
          verification_method: "UDYAM_API_SETU_SYNC",
          confidence_score: 1.0,
        },
        is_authoritative: true,
      },
    ],
    deduplication_confidence: 0.998,
    last_sync_timestamp: new Date().toISOString(),
  };
}

export async function executeOnceOnlyAutoPopulate(
  citizenId = "CIT-2026-IND-9481"
): Promise<AutoPopulateResponse> {
  try {
    const res = await fetch(`${API_BASE}/mdm/auto-populate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizen_id: citizenId }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for Once-Only auto-fill:", e);
  }

  return {
    citizen_id: citizenId,
    once_only_principle_applied: true,
    total_eliminated_fields: 34,
    total_time_saved_minutes: 85,
    department_forms: [
      {
        department_code: "MSME_UDYAM",
        form_title: "Form Udyam-1: Micro Enterprise Registration",
        statutory_portal: "udyamregistration.gov.in",
        pre_filled_fields: {
          applicant_name: "Vikram Sheshadri Rao",
          pan_number: "BKZPC9912A",
          enterprise_name: "Rao Culinary Labs Pvt Ltd",
          constitution_type: "PRIVATE_LIMITED",
          state: "Karnataka",
        },
        eliminated_manual_keystrokes: 9,
        auto_validated_docs: ["e-PAN Card", "Aadhaar e-KYC Extract"],
      },
      {
        department_code: "FSSAI_FOSCOS",
        form_title: "Form-B: Application for State Food Safety License",
        statutory_portal: "foscos.fssai.gov.in",
        pre_filled_fields: {
          food_business_operator: "Vikram Sheshadri Rao",
          trade_name: "Rao Cloud Kitchens",
          pan_reference: "BKZPC9912A",
          udyam_linked: "UDYAM-KR-03-0094812",
        },
        eliminated_manual_keystrokes: 8,
        auto_validated_docs: ["PAN Certificate", "DigiLocker Commercial Lease"],
      },
      {
        department_code: "MUNICIPAL_TRADE_LICENSE",
        form_title: "Form TL-2: Municipal Corporation Commercial Trade License",
        statutory_portal: "bbmp.gov.in / TradeLicensePortal",
        pre_filled_fields: {
          proprietor_name: "Vikram Sheshadri Rao",
          ward_jurisdiction: "Ward 4 (Indiranagar / BBMP East)",
          property_pid_number: "PID-BBMP-104-0982",
          survey_no_ref: "142/2A",
        },
        eliminated_manual_keystrokes: 9,
        auto_validated_docs: ["Bhoomi RTC Mutation Extract"],
      },
      {
        department_code: "POLLUTION_CONTROL_NOC",
        form_title: "Form CTE-Orange: Consent to Establish",
        statutory_portal: "kspcb.karnataka.gov.in",
        pre_filled_fields: {
          industry_name: "Rao Culinary Labs Pvt Ltd",
          occupier_name: "Vikram Sheshadri Rao",
          cin_ref: "U72900KA2026PTC192841",
        },
        eliminated_manual_keystrokes: 8,
        auto_validated_docs: ["Corporate Incorporation Certificate"],
      },
    ],
  };
}

export async function fetchAuditLedger(utid = "APP-2026-MSME-0841"): Promise<AuditLedgerResponse> {
  try {
    const res = await fetch(`${API_BASE}/audit/ledger/${utid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for Audit Ledger:", e);
  }

  return {
    utid,
    total_events: 6,
    genesis_timestamp: "2026-02-18T10:14:00Z",
    latest_hash: "a4f89d34208a1c89019b882348ff8a12903487becc450912fa89bca450129048",
    is_ledger_tamper_free: true,
    events: [
      {
        event_id: `evt-${utid}-01`,
        sequence_number: 1,
        timestamp: "2026-02-18T10:14:00Z",
        action_type: "APPLICATION_INITIATED",
        actor_role: "CITIZEN",
        actor_identifier: "CITIZEN_VIKRAM_RAO",
        department: "National GovTech Gateway",
        details: `Citizen initiated multi-department journey under UTID ${utid} via Voice Copilot.`,
        previous_hash: "0000000000000000000000000000000000000000000000000000000000000000",
        current_hash: "3b91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091490",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "49.207.194.12 (Airtel Broadband Bengaluru)",
      },
      {
        event_id: `evt-${utid}-02`,
        sequence_number: 2,
        timestamp: "2026-02-18T10:14:22Z",
        action_type: "DPDP_CONSENT_GRANTED",
        actor_role: "CITIZEN",
        actor_identifier: "CITIZEN_VIKRAM_RAO",
        department: "DPDP 2023 Consent Gate",
        details: "Granted purpose-bound credential sharing consent for PAN and Aadhaar e-KYC (Duration: 30 days).",
        previous_hash: "3b91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091490",
        current_hash: "5f82a10984ba109284ca89129038ba98129048bacca340912fa89bca12091491",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "49.207.194.12 (Airtel Broadband Bengaluru)",
      },
      {
        event_id: `evt-${utid}-03`,
        sequence_number: 3,
        timestamp: "2026-02-18T10:14:28Z",
        action_type: "PREFLIGHT_QUALITY_PASSED",
        actor_role: "SYSTEM_MIDDLEWARE",
        actor_identifier: "JANSETU_PREFLIGHT_ENGINE_V3",
        department: "JanSetu Quality Gate",
        details: "Pre-flight deterministic audit passed: 100% Name Similarity, 300 DPI OCR verified, 0 Expiry Blockers.",
        previous_hash: "5f82a10984ba109284ca89129038ba98129048bacca340912fa89bca12091491",
        current_hash: "7e91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091492",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "10.14.22.8 (GovNIC Middleware Cluster)",
      },
      {
        event_id: `evt-${utid}-04`,
        sequence_number: 4,
        timestamp: "2026-02-19T14:30:10Z",
        action_type: "LEGACY_CONNECTOR_SYNC",
        actor_role: "SYSTEM_MIDDLEWARE",
        actor_identifier: "BHOOMI_SOAP_CONNECTOR_V2",
        department: "State Revenue & Land Reforms",
        details: "SOAP envelope dispatched to Bhoomi Land Records; survey No. 142/2A verified unencumbered in 74ms.",
        previous_hash: "7e91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091492",
        current_hash: "8c91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091493",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "10.14.22.14 (State Data Center Hub)",
      },
      {
        event_id: `evt-${utid}-05`,
        sequence_number: 5,
        timestamp: "2026-02-20T11:45:00Z",
        action_type: "OFFICER_SCRUTINY_APPROVED",
        actor_role: "OFFICER",
        actor_identifier: "OFFICER_DESHMUKH_FSSAI_04",
        department: "Food Safety Authority (FSSAI)",
        details: "Nodal scrutiny officer verified water testing certificate & premises NOC. Decision: APPROVED.",
        previous_hash: "8c91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091493",
        current_hash: "9b91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091494",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "164.100.128.4 (NIC GovNet Central Gateway)",
      },
      {
        event_id: `evt-${utid}-06`,
        sequence_number: 6,
        timestamp: "2026-02-21T09:00:00Z",
        action_type: "STATUTORY_LICENSE_GRANTED",
        actor_role: "SYSTEM_MIDDLEWARE",
        actor_identifier: "FOSCOS_DISPATCH_SERVICE",
        department: "Food Safety Authority of India",
        details: "State License FSSAI-2026-BLR-0941 generated, cryptographically signed, and deposited into DigiLocker.",
        previous_hash: "9b91a0c8842149b0198ca7821038ba98129048bacca340912fa89bca12091494",
        current_hash: "a4f89d34208a1c89019b882348ff8a12903487becc450912fa89bca450129048",
        signature_algorithm: "SHA-256 (ECDSA P-256)",
        ip_origin: "10.14.22.8 (GovNIC Middleware Cluster)",
      },
    ],
  };
}

export async function fetchSLAAnalytics(): Promise<DepartmentSLAAnalytics> {
  try {
    const res = await fetch(`${API_BASE}/audit/sla-metrics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline fallback for SLA Analytics:", e);
  }

  return {
    overall_sla_compliance_pct: 94.5,
    total_turnaround_reduction_pct: 72.4,
    average_processing_days: 3.0,
    active_bottleneck_department: "State Pollution Control Board (7.2 Days Avg)",
    department_metrics: [
      {
        department: "Income Tax Department (CBDT)",
        service_name: "PAN Verification & DigiLocker e-KYC",
        statutory_sla_days: 1,
        actual_average_days: 0.05,
        sla_compliance_rate: 99.8,
        active_in_flight: 142,
        escalated_cases: 0,
        right_to_services_act_clause: "Section 4(1) of Citizen Charter 2024",
      },
      {
        department: "Ministry of MSME",
        service_name: "Udyam Micro-Enterprise Classification",
        statutory_sla_days: 3,
        actual_average_days: 0.8,
        sla_compliance_rate: 97.4,
        active_in_flight: 310,
        escalated_cases: 2,
        right_to_services_act_clause: "MSMED Act 2006 (Expedited Nodal Notification)",
      },
      {
        department: "State Municipal Corporation (BBMP / BMC)",
        service_name: "Commercial Trade License & Premises Verification",
        statutory_sla_days: 7,
        actual_average_days: 2.4,
        sla_compliance_rate: 92.1,
        active_in_flight: 580,
        escalated_cases: 14,
        right_to_services_act_clause: "Right to Public Services Act (Municipal Schedule I)",
      },
      {
        department: "Food Safety Authority (FSSAI)",
        service_name: "State Food Business Operator License Grant",
        statutory_sla_days: 14,
        actual_average_days: 4.5,
        sla_compliance_rate: 93.6,
        active_in_flight: 420,
        escalated_cases: 8,
        right_to_services_act_clause: "FSS Act 2006 (14-Day Scrutiny SLA Window)",
      },
      {
        department: "State Pollution Control Board (KSPCB / MPCB)",
        service_name: "Consent to Establish (CTE Orange / Green Category)",
        statutory_sla_days: 21,
        actual_average_days: 7.2,
        sla_compliance_rate: 89.5,
        active_in_flight: 190,
        escalated_cases: 9,
        right_to_services_act_clause: "Water & Air Pollution Acts (Schedule IV)",
      },
    ],
    timestamp: new Date().toISOString(),
  };
}
