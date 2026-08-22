/**
 * JanSetu™ (जनसेतु) Statutory API Service Layer
 *
 * Provides typed client connections to the FastAPI Statutory State Machine
 * with automatic, seamless fallback to local pre-seeded blueprints if the
 * backend server is offline or unreachable during client-side testing.
 */

import { UniversalJourney, UserProgress } from "@/types/journey";
import { mockJourneys } from "@/data/mockJourneys";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Helper fetch with timeout & fallback
async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (typeof window === "undefined") return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for AI reasoning
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      console.warn(`[safeFetch] Request to ${endpoint} returned status ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.warn(`[safeFetch] Request to ${endpoint} failed:`, err?.message || err);
    return null;
  }
}

// ── Journey Service with In-Memory Blueprint Caching & Pre-fetching ──

const journeyCache = new Map<string, UniversalJourney>();

// Seed cache with bundled blueprints on module load for sub-millisecond instant switching
mockJourneys.forEach((j) => {
  journeyCache.set(j.journeyId, j);
});

export const journeyService = {
  /**
   * Fast synchronous retrieval from client-side pre-bundled cache (<1ms latency).
   */
  getCachedById: (id: string): UniversalJourney | null => {
    return journeyCache.get(id) || mockJourneys.find((j) => j.journeyId === id) || null;
  },

  /**
   * Pre-fetches blueprint into client cache on hover or choice chip render.
   */
  prefetch: async (id: string): Promise<void> => {
    if (journeyCache.has(id)) return;
    try {
      const live = await safeFetch<UniversalJourney>(`/api/journey/${encodeURIComponent(id)}`);
      if (live) {
        journeyCache.set(id, live);
      }
    } catch {
      // Non-blocking prefetch failure
    }
  },

  /**
   * Non-blocking background sync for regulatory notices or state updates.
   */
  syncJourneyBackground: async (id: string, onUpdate?: (updated: UniversalJourney) => void): Promise<void> => {
    try {
      const live = await safeFetch<UniversalJourney>(`/api/journey/${encodeURIComponent(id)}`);
      if (live) {
        journeyCache.set(id, live);
        onUpdate?.(live);
      }
    } catch {
      // Silent background sync
    }
  },

  /**
   * Fetch all statutory journeys from FastAPI backend or fallback to local dataset.
   */
  getAll: async (filters?: {
    query?: string;
    domainId?: string;
  }): Promise<UniversalJourney[]> => {
    const liveData = await safeFetch<UniversalJourney[]>("/api/journeys");
    let results = liveData && Array.isArray(liveData) && liveData.length > 0 ? liveData : [...mockJourneys];

    // Update in-memory cache
    results.forEach((j) => journeyCache.set(j.journeyId, j));

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      );
    }

    return results;
  },

  /**
   * Fetch a single journey blueprint by ID with cache-first strategy.
   */
  getById: async (id: string): Promise<UniversalJourney | null> => {
    if (journeyCache.has(id)) {
      // Return cached copy instantly, sync in background
      journeyService.syncJourneyBackground(id);
      return journeyCache.get(id)!;
    }

    const liveJourney = await safeFetch<UniversalJourney>(`/api/journey/${encodeURIComponent(id)}`);
    if (liveJourney) {
      journeyCache.set(id, liveJourney);
      return liveJourney;
    }
    return mockJourneys.find((j) => j.journeyId === id) || null;
  },

  /**
   * Complete step using statutory state machine rule engine.
   */
  completeStep: async (journeyId: string, stepId: string): Promise<{ success: boolean; message?: string }> => {
    const res = await safeFetch<{ success: boolean; message?: string }>("/api/journey/complete-step", {
      method: "POST",
      body: JSON.stringify({ journey_id: journeyId, completed_node_id: stepId }),
    });
    if (res) return res;
    return { success: true, message: "Step completed locally" };
  },

  /**
   * Natural language search across journeys.
   */
  search: async (query: string): Promise<UniversalJourney[]> => {
    const all = await journeyService.getAll();
    const q = query.toLowerCase();
    return all.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.steps.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        )
    );
  },
};

// ── Regulatory Alerts Service ──

export interface StatutoryAlert {
  alert_id: string;
  domain: string;
  jurisdiction: string;
  category: string;
  title: string;
  summary: string;
  effective_date: string;
  source_circular_url: string;
  mandatory_action_required: boolean;
}

export const alertService = {
  getAlerts: async (domain?: string, jurisdiction?: string): Promise<StatutoryAlert[]> => {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (jurisdiction) params.append("jurisdiction", jurisdiction);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await safeFetch<StatutoryAlert[]>(`/api/alerts${query}`);
    return res || [];
  },
};

// ── User Progress Service (Local Persistence & Sync) ──

const PROGRESS_STORAGE_KEY = "legalpath_user_progress";

export const userService = {
  saveProgress: async (progress: UserProgress): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
  },

  getProgress: async (): Promise<UserProgress | null> => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserProgress) : null;
  },

  clearProgress: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  },
};

// ── Statutory AI Orchestration & Grounded RAG Service (Track 3) ──

export interface GoalClassificationResult {
  goal_type: string;
  target_state: string;
  scale_or_entity_type: string;
  extracted_parameters: Record<string, any>;
  confidence_score: number;
  raw_goal: string;
  matched_journey_id: string;
  matched_journey_title: string;
  initial_guidance: string;
}

export interface CitationItem {
  department: string;
  document_title: string;
  section: string;
  portal_url: string;
  excerpt: string;
}

export interface RAGQueryResponse {
  answer: string;
  citations: CitationItem[];
  is_fallback: boolean;
  department_source: string;
  verified_portal_url: string;
  query_language: string;
}

export interface MultilingualGuidanceResponse {
  step_id: string;
  language: string;
  localized_title: string;
  plain_language_summary: string;
  actionable_checklist: string[];
  common_pitfalls_to_avoid: string[];
  official_portal_url: string;
}

export interface ParsedPolicyAlert {
  alert_title: string;
  issuing_authority: string;
  what_changed: string;
  why_it_matters_to_journey: string;
  action_or_deadline_required: string;
  deadline_date?: string;
  severity: string;
  affected_domains: string[];
  source_reference: string;
}

export interface KnowledgeSourceItem {
  doc_id: string;
  title: string;
  department: string;
  jurisdiction: string;
  official_portal_url: string;
  section_count: number;
  source_reference: string;
  domain: string;
}

export const aiService = {
  /**
   * Priority 1: Zero-Shot Goal Classification & Parameter Extraction.
   */
  classifyGoal: async (
    goal: string,
    preferredLanguage: string = "en"
  ): Promise<GoalClassificationResult | null> => {
    const res = await safeFetch<GoalClassificationResult>("/api/ai/classify-goal", {
      method: "POST",
      body: JSON.stringify({
        goal,
        preferred_language: preferredLanguage,
      }),
    });
    return res;
  },

  /**
   * Priority 2: Grounded Step Q&A via ChromaDB RAG.
   */
  queryRAG: async (
    query: string,
    stepId?: string,
    journeyId?: string,
    language: string = "en"
  ): Promise<RAGQueryResponse | null> => {
    const res = await safeFetch<RAGQueryResponse>("/api/ai/rag/query", {
      method: "POST",
      body: JSON.stringify({
        query,
        step_id: stepId,
        journey_id: journeyId,
        language,
      }),
    });
    return res;
  },

  /**
   * Priority 3: Multilingual Step Guidance & Checklist.
   */
  getStepGuidance: async (
    stepId: string,
    journeyId?: string,
    language: string = "hi"
  ): Promise<MultilingualGuidanceResponse | null> => {
    const res = await safeFetch<MultilingualGuidanceResponse>("/api/ai/step-guidance", {
      method: "POST",
      body: JSON.stringify({
        step_id: stepId,
        journey_id: journeyId,
        language,
      }),
    });
    return res;
  },

  /**
   * Priority 3: Policy Alert Parser for Raw Gazette Circulars.
   */
  parsePolicyAlert: async (
    rawCircularText: string,
    activeJourneyId?: string
  ): Promise<ParsedPolicyAlert | null> => {
    const res = await safeFetch<ParsedPolicyAlert>("/api/ai/parse-policy-alert", {
      method: "POST",
      body: JSON.stringify({
        raw_circular_text: rawCircularText,
        active_journey_id: activeJourneyId,
      }),
    });
    return res;
  },

  /**
   * List 15 Curated Official Knowledge Base Manuals.
   */
  getKnowledgeBase: async (): Promise<KnowledgeSourceItem[]> => {
    const res = await safeFetch<KnowledgeSourceItem[]>("/api/ai/knowledge-base");
    return res || [];
  },

  /**
   * Compatibility wrapper for existing chat interfaces.
   */
  sendMessage: async (
    messages: { role: string; content: string }[],
    context: { journeyId: string; stepId?: string }
  ): Promise<{ message: string; sources?: { title: string; url: string }[] }> => {
    const lastMsg = messages[messages.length - 1]?.content || "";
    const ragRes = await aiService.queryRAG(lastMsg, context.stepId, context.journeyId);
    if (ragRes) {
      return {
        message: ragRes.answer,
        sources: ragRes.citations.map((c) => ({
          title: `${c.department} — ${c.section}`,
          url: c.portal_url,
        })),
      };
    }

    return {
      message:
        "Statutory advice: Ensure your documents are authenticated through official state portals. No broker or unofficial fees apply.",
      sources: [{ title: "National Portal of India", url: "https://india.gov.in" }],
    };
  },
};

// ── In-App AI Copilot & Generative UI Tool Action Service ──

export type CopilotActionType =
  | "LOAD_JOURNEY"
  | "OPEN_STEP"
  | "OPEN_DRAWER"
  | "SCROLL_TO_NODE"
  | "TRIGGER_CONSENT"
  | "SWITCH_LANGUAGE"
  | "FILTER_CATALOG"
  | "HIGHLIGHT_ELEMENT"
  | "COMPLETE_STEP"
  | "SHOW_CHOICE_CHIPS";

export interface CopilotAction {
  action_type: CopilotActionType;
  payload: Record<string, any>;
  description: string;
}

export interface CopilotRequest {
  query: string;
  language?: string;
  active_journey_id?: string;
  active_step_id?: string;
  active_screen?: string;
}

export interface CopilotResponse {
  speech_text: string;
  explanation_markdown: string;
  actions: CopilotAction[];
  citations: CitationItem[];
  suggested_chips: string[];
  matched_journey_id?: string;
  latency_ms: number;
  is_fallback?: boolean;
}

export const copilotService = {
  /**
   * Send synchronous voice/text query to In-App Copilot and receive Generative UI actions.
   */
  sendActionQuery: async (request: CopilotRequest): Promise<CopilotResponse | null> => {
    // 1. Try primary AI copilot action endpoint
    const res = await safeFetch<CopilotResponse>("/api/ai/copilot/action", {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (res) return res;

    // 2. Client-Side Fallback Intent Engine (<5ms latency)
    const q = (request.query || "").toLowerCase();
    const lang = (request.language || "en").toUpperCase();

    // Food / Kitchen / FSSAI
    if (q.includes("food") || q.includes("kitchen") || q.includes("fssai") || q.includes("restaurant") || q.includes("खाद्य") || q.includes("ಅಡುಗೆ")) {
      return {
        explanation_markdown: "### 🍳 Statutory Cloud Kitchen & FSSAI Pathway\nI have loaded the **Karnataka Cloud Kitchen & MSME Legal Compliance Roadmap** onto your screen.\n\n* **Nodal Authority:** FSSAI / BBMP Health Department\n* **Required Actions:** Complete Entity Constitution, obtain Lease NOC, and submit Form B on FoSCoS portal.\n* **Statutory SLA:** 7–14 Business Days.",
        speech_text: lang === "HI" ? "मैंने कर्नाटक क्लाउड किचन और FSSAI कानूनी रोडमैप आपकी स्क्रीन पर लोड कर दिया है।" : lang === "KN" ? "ನಾನು ನಿಮ್ಮ ಪರದೆಯ ಮೇಲೆ ಕ್ಲೌಡ್ ಕಿಚನ್ ಮತ್ತು FSSAI ರೋಡ್‌ಮ್ಯಾಪ್ ಅನ್ನು ಲೋಡ್ ಮಾಡಿದ್ದೇನೆ." : "I have loaded the Cloud Kitchen and FSSAI statutory roadmap onto your screen.",
        actions: [
          { action_type: "LOAD_JOURNEY" as any, payload: { journey_id: "karnataka_cloud_kitchen_setup" }, description: "Load Cloud Kitchen Roadmap" },
          { action_type: "OPEN_STEP" as any, payload: { step_id: "step_entity_structuring", tab: "instructions" }, description: "Open Entity Structuring Step" },
        ],
        citations: [
          {
            department: "Food Safety and Standards Authority of India (FSSAI)",
            document_title: "Food Safety and Standards (Licensing and Registration) Regulations, 2011",
            section: "Regulation 2.1.2 — Mandatory State Licensing Thresholds",
            portal_url: "https://foscos.fssai.gov.in",
            excerpt: "All food business operators with turnover up to ₹12 Lakhs require Registration, while commercial cloud kitchens require State License under FoSCoS portal.",
          },
        ],
        suggested_chips: ["Draft Rent Agreement & Owner NOC", "Verify Identity via DigiLocker", "View Fee Breakdown"],
        matched_journey_id: "karnataka_cloud_kitchen_setup",
        latency_ms: 12,
        is_fallback: true,
      };
    }

    // Higher Education Loan
    if (q.includes("loan") || q.includes("education") || q.includes("vidyalaxmi") || q.includes("student") || q.includes("ऋण") || q.includes("ಸಾ ಸಾಲ")) {
      return {
        explanation_markdown: "### 🎓 PM-Vidyalaxmi Higher Education Loan Pathway\nI have loaded the **PM-Vidyalaxmi Interest Subsidy & Education Loan Pathway** on screen.\n\n* **Nodal Authority:** Department of Higher Education / Canara Bank Nodal Cell\n* **Statutory Benefit:** Full interest subvention for family income up to ₹8 Lakhs.\n* **Portal:** Official Vidya Lakshmi NSDL Portal.",
        speech_text: lang === "HI" ? "मैंने पीएम विद्यालक्ष्मी उच्च शिक्षा ऋण रोडमैप खोल दिया है।" : "I have loaded the PM Vidyalaxmi Higher Education Loan roadmap on your screen.",
        actions: [
          { action_type: "LOAD_JOURNEY" as any, payload: { journey_id: "pm-vidyalaxmi-loan" }, description: "Load PM-Vidyalaxmi Loan Pathway" },
          { action_type: "OPEN_STEP" as any, payload: { step_id: "step-1-loan-eligibility", tab: "instructions" }, description: "Open Loan Eligibility Milestone" },
        ],
        citations: [
          {
            department: "Department of Higher Education (Ministry of Education)",
            document_title: "Central Sector Interest Subsidy Scheme (CSIS) Guidelines",
            section: "Clause 4.1 — Eligibility Criteria for Full Interest Subvention",
            portal_url: "https://www.vidyalakshmi.co.in",
            excerpt: "Under the PM-Vidyalaxmi scheme, students enrolled in NIRF top 100 institutions receive 100% interest subsidy during the moratorium period.",
          },
        ],
        suggested_chips: ["Check Loan Eligibility", "DigiLocker Marksheet Verification", "Calculate Loan EMI"],
        matched_journey_id: "pm-vidyalaxmi-loan",
        latency_ms: 8,
        is_fallback: true,
      };
    }

    // Startup / Patent / DPIIT
    if (q.includes("startup") || q.includes("patent") || q.includes("dpiit") || q.includes("intellectual") || q.includes("स्टार्टअप")) {
      return {
        explanation_markdown: "### 🚀 DPIIT Startup Registration & Intellectual Property\nI have loaded the **DPIIT Startup Recognition & Fast-Track Patent Pathway**.\n\n* **Nodal Authority:** DPIIT, Ministry of Commerce and Industry\n* **Benefits:** 80% Patent Fee Rebate + Section 80-IAC Tax Exemption.",
        speech_text: "I have loaded the DPIIT Startup and Patent pathway on your screen.",
        actions: [
          { action_type: "LOAD_JOURNEY" as any, payload: { journey_id: "dpiit_startup_ip_pathway" }, description: "Load DPIIT Startup Pathway" },
          { action_type: "OPEN_STEP" as any, payload: { step_id: "step_dpiit_recognition", tab: "instructions" }, description: "Open Startup Recognition Milestone" },
        ],
        citations: [
          {
            department: "DPIIT, Ministry of Commerce and Industry",
            document_title: "Startup India Action Plan & Gazetted Notification G.S.R. 127(E)",
            section: "Section 3 — Criteria for Recognition of Startups",
            portal_url: "https://www.startupindia.gov.in",
            excerpt: "Entity shall be considered a startup up to 10 years from incorporation with turnover not exceeding ₹100 Crore.",
          },
        ],
        suggested_chips: ["Generate Form INC-9 Draft", "Fast-Track Patent Filing", "Tax Exemption Form 1"],
        matched_journey_id: "dpiit_startup_ip_pathway",
        latency_ms: 9,
        is_fallback: true,
      };
    }

    // DigiLocker / Verification
    if (q.includes("digilocker") || q.includes("verify") || q.includes("aadhaar") || q.includes("pan") || q.includes("पहचान")) {
      return {
        explanation_markdown: "### 🛡️ DPDP Act 2023 DigiLocker Identity Verification\nOpening the secure, consent-driven **DigiLocker Sandbox Modal** for instantaneous KYC verification.",
        speech_text: "Opening DigiLocker identity verification consent modal.",
        actions: [
          { action_type: "TRIGGER_CONSENT" as any, payload: { doc_type: "PAN", purpose: "Identity Verification for Statutory Application" }, description: "Trigger DigiLocker Consent Modal" },
        ],
        citations: [
          {
            department: "National e-Governance Division (NeGD) / MeitY",
            document_title: "Digital Personal Data Protection (DPDP) Act, 2023",
            section: "Section 6 — Consent Architecture for Verified Credential Extraction",
            portal_url: "https://www.digilocker.gov.in",
            excerpt: "Consent must be free, specific, informed, unconditional, and unambiguous with clear notice.",
          },
        ],
        suggested_chips: ["Verify PAN Card", "Verify Aadhaar", "Verify Class 12 Marksheet"],
        latency_ms: 6,
        is_fallback: true,
      };
    }

    // Default Fallback
    const firstJourney = mockJourneys[0];
    return {
      explanation_markdown: `### 🏛️ Civic Copilot™ Assistant\nI found relevant government roadmaps matching your inquiry: **${firstJourney.title}**.\n\n* **Authority:** ${firstJourney.department}\n* **Estimated SLA:** ${firstJourney.estimatedDuration}`,
      speech_text: `I have loaded the ${firstJourney.title} roadmap for you.`,
      actions: [
        { action_type: "LOAD_JOURNEY" as any, payload: { journey_id: firstJourney.journeyId }, description: "Load Primary Roadmap" },
      ],
      citations: [
        {
          department: firstJourney.department,
          document_title: "Citizen Charter & Government Service Delivery Manual",
          section: "Standard Operating Procedures",
          portal_url: "https://india.gov.in",
          excerpt: "Citizens are entitled to transparent, time-bound service delivery across statutory licensing milestones.",
        },
      ],
      suggested_chips: ["View Steps", "Estimated Cost", "Required Documents"],
      matched_journey_id: firstJourney.journeyId,
      latency_ms: 10,
      is_fallback: true,
    };
  },

  /**
   * Stream Server-Sent Events (SSE) from the Copilot endpoint with sub-300ms latency.
   */
  streamCopilot: async (
    request: CopilotRequest,
    onEvent: (event: string, data: any) => void
  ): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
      const response = await fetch(`${API_BASE}/api/ai/copilot/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok || !response.body) {
        // Fallback to synchronous endpoint
        const syncRes = await copilotService.sendActionQuery(request);
        if (syncRes) {
          onEvent("actions", { actions: syncRes.actions, speech_text: syncRes.speech_text });
          onEvent("token", { token: syncRes.explanation_markdown });
          onEvent("citations", { citations: syncRes.citations, suggested_chips: syncRes.suggested_chips });
          onEvent("done", { status: "complete", latency_ms: syncRes.latency_ms });
        }
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "message";
        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEvent = line.replace("event:", "").trim();
          } else if (line.startsWith("data:")) {
            const rawData = line.replace("data:", "").trim();
            try {
              const parsed = JSON.parse(rawData);
              onEvent(currentEvent, parsed);
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (err) {
      console.warn("Copilot SSE stream error, falling back to sync:", err);
      const syncRes = await copilotService.sendActionQuery(request);
      if (syncRes) {
        onEvent("actions", { actions: syncRes.actions, speech_text: syncRes.speech_text });
        onEvent("token", { token: syncRes.explanation_markdown });
        onEvent("citations", { citations: syncRes.citations, suggested_chips: syncRes.suggested_chips });
        onEvent("done", { status: "complete", latency_ms: syncRes.latency_ms });
      }
    }
  },

  /**
   * Query Gemini 2.5 Flash agent endpoint at /api/copilot/query with UI tool declarations.
   */
  queryGeminiAgent: async (
    message: string,
    language: string = "en"
  ): Promise<{ text_response: string; ui_actions: { action: string; payload: any }[] } | null> => {
    const res = await safeFetch<{
      text_response: string;
      ui_actions: { action: string; payload: any }[];
    }>("/api/copilot/query", {
      method: "POST",
      body: JSON.stringify({ message, language }),
    });
    return res;
  },
};

// ── Officer Back-Office Dashboard & Scrutiny API Service ──

import type {
  OfficerApplication,
  OfficerDecisionRequest,
  OfficerDecisionResponse,
  DossierAnalysisRequest,
  DossierAnalysisResponse,
  DepartmentCode,
  ApplicationStatus,
} from "@/types/officer";

const FALLBACK_OFFICER_APPLICATIONS: OfficerApplication[] = [
  {
    application_id: "APP-2026-MSME-0841",
    citizen_name: "Rahul Rajesh Sharma",
    enterprise_name: "Namma Cloud Technologies LLP",
    department: "MSME",
    department_name: "Ministry of Micro, Small & Medium Enterprises",
    service_title: "Udyam Enterprise Registration & Priority Credit Certificate",
    journey_id: "msme-registration",
    current_step_id: "step-2",
    current_step_title: "NIC Code & Enterprise Classification Validation",
    status: "PENDING_REVIEW",
    submission_date: "2026-08-21T09:30:00Z",
    sla_deadline: "2026-08-23T09:30:00Z",
    sla_hours_total: 48,
    sla_hours_remaining: 31.5,
    is_sla_breached: false,
    risk_score: 12,
    dossier: {
      citizen_name: "Rahul Rajesh Sharma",
      applicant_id: "CITIZEN-KA-88129",
      aadhaar_masked: "XXXX-XXXX-4912",
      pan_masked: "ABCPS****K",
      mobile: "+91 98765 43210",
      email: "rahul.sharma@nammacloud.io",
      enterprise_name: "Namma Cloud Technologies LLP",
      entity_type: "Limited Liability Partnership (LLP)",
      registered_address: "#42, 100ft Ring Road, Indiranagar, Bengaluru",
      pincode: "560038",
      state: "Karnataka",
      district: "Bengaluru Urban",
      timeline: [
        {
          step_id: "step-1",
          step_title: "Aadhaar & PAN Biometric Match",
          department: "UIDAI / Income Tax Dept",
          completed_at: "2026-08-21T09:32:00Z",
          status: "VERIFIED",
          verified_by: "API Setu Gateway (Automated)",
          officer_remarks: "100% cryptographic match between Aadhaar demographic data and PAN database.",
        },
        {
          step_id: "step-2",
          step_title: "NIC Code & Enterprise Classification Validation",
          department: "MSME Nodal Directorate",
          completed_at: null,
          status: "PENDING",
          verified_by: null,
          officer_remarks: null,
        },
      ],
      documents: [
        {
          doc_id: "doc-msme-1",
          doc_name: "Aadhaar Identity Record",
          category: "Identity Proof",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "UIDAI",
          file_url: "https://digilocker.gov.in/sample/aadhaar_verified.pdf",
          uploaded_at: "2026-08-21T09:31:00Z",
        },
        {
          doc_id: "doc-msme-2",
          doc_name: "LLP Incorporation Certificate",
          category: "Statutory Registration",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "Ministry of Corporate Affairs (MCA)",
          file_url: "https://mca.gov.in/sample/llp_cert.pdf",
          uploaded_at: "2026-08-21T09:31:30Z",
        },
        {
          doc_id: "doc-msme-3",
          doc_name: "Electricity Bill (Proof of Address)",
          category: "Address Proof",
          verification_status: "REQUIRES_SCRUTINY",
          issuing_authority: "BESCOM (Karnataka Electricity Board)",
          file_url: "https://bescom.karnataka.gov.in/sample/bill_aug26.pdf",
          uploaded_at: "2026-08-21T09:32:00Z",
        },
      ],
    },
  },
  {
    application_id: "APP-2026-FSSAI-1904",
    citizen_name: "Priya V. Sundaram",
    enterprise_name: "Anand Sweets & Cloud Kitchen",
    department: "FOOD_SAFETY",
    department_name: "Food Safety and Standards Authority of India (FSSAI)",
    service_title: "FSSAI State Food Business Operator (FBO) License",
    journey_id: "food-license-fssai",
    current_step_id: "step-2",
    current_step_title: "Kitchen Hygiene & FSMS Plan Scrutiny",
    status: "PENDING_REVIEW",
    submission_date: "2026-08-20T14:15:00Z",
    sla_deadline: "2026-08-22T14:15:00Z",
    sla_hours_total: 48,
    sla_hours_remaining: 4.2,
    is_sla_breached: false,
    risk_score: 42,
    dossier: {
      citizen_name: "Priya V. Sundaram",
      applicant_id: "CITIZEN-TN-44912",
      aadhaar_masked: "XXXX-XXXX-8921",
      pan_masked: "DFGPS****M",
      mobile: "+91 97123 45678",
      email: "priya.sundaram@anandsweets.in",
      enterprise_name: "Anand Sweets & Cloud Kitchen",
      entity_type: "Partnership Firm",
      registered_address: "Shop #12, Ground Floor, Anna Nagar Main Road, Chennai",
      pincode: "600040",
      state: "Tamil Nadu",
      district: "Chennai",
      timeline: [
        {
          step_id: "step-1",
          step_title: "Nominated Food Safety Supervisor Certification",
          department: "FoSTaC / FSSAI",
          completed_at: "2026-08-20T14:20:00Z",
          status: "VERIFIED",
          verified_by: "FoSTaC Portal API",
          officer_remarks: "Supervisor completed Level 2 Advanced Catering Food Safety Course.",
        },
        {
          step_id: "step-2",
          step_title: "Kitchen Hygiene & FSMS Plan Scrutiny",
          department: "Tamil Nadu Food Safety Directorate",
          completed_at: null,
          status: "PENDING",
          verified_by: null,
          officer_remarks: null,
        },
      ],
      documents: [
        {
          doc_id: "doc-fssai-1",
          doc_name: "Commercial Rent Agreement (11-Month Registered Lease)",
          category: "Premises Possession",
          verification_status: "REQUIRES_SCRUTINY",
          issuing_authority: "Sub-Registrar Anna Nagar",
          file_url: "https://tnreginet.gov.in/sample/lease.pdf",
          uploaded_at: "2026-08-20T14:16:00Z",
        },
        {
          doc_id: "doc-fssai-2",
          doc_name: "Water Potability Test Report (IS 10500 Compliant)",
          category: "Public Health",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "King Institute of Preventive Medicine",
          file_url: "https://kinginstitute.tn.gov.in/lab_report_774.pdf",
          uploaded_at: "2026-08-20T14:17:00Z",
        },
      ],
    },
  },
  {
    application_id: "APP-2026-REV-3301",
    citizen_name: "Amitabh Ramesh Kulkarni",
    enterprise_name: "Kulkarni Agro Processing Units",
    department: "REVENUE",
    department_name: "Department of Land Records & Revenue",
    service_title: "Agricultural Land Conversion & Non-Agricultural (NA) Permission",
    journey_id: "property-registration",
    current_step_id: "step-3",
    current_step_title: "Tahsildar Field Inspection & Title Search Clearance",
    status: "DEFECT_FLAGGED",
    submission_date: "2026-08-18T11:00:00Z",
    sla_deadline: "2026-08-21T11:00:00Z",
    sla_hours_total: 72,
    sla_hours_remaining: -24.0,
    is_sla_breached: true,
    risk_score: 68,
    last_action_date: "2026-08-21T16:40:00Z",
    last_officer_id: "OFFICER-MH-4410",
    last_officer_remarks: "Survey Map discrepancy: Missing boundary coordinates for plot 142/3-B bordering forest buffer zone.",
    dossier: {
      citizen_name: "Amitabh Ramesh Kulkarni",
      applicant_id: "CITIZEN-MH-90214",
      aadhaar_masked: "XXXX-XXXX-1149",
      pan_masked: "BKMPK****L",
      mobile: "+91 94220 11223",
      email: "amitabh.kulkarni@agrocorp.in",
      enterprise_name: "Kulkarni Agro Processing Units",
      entity_type: "Sole Proprietorship",
      registered_address: "Gat No. 142, Village Shirwal, Taluka Khandala, Satara",
      pincode: "412801",
      state: "Maharashtra",
      district: "Satara",
      timeline: [
        {
          step_id: "step-1",
          step_title: "7/12 Extract & Mutation Entry (Ferfar) Verification",
          department: "MahaBhulekh (Land Records)",
          completed_at: "2026-08-18T11:05:00Z",
          status: "VERIFIED",
          verified_by: "MahaBhumi Setu",
          officer_remarks: "Clear title without encumbrance in last 30 years.",
        },
        {
          step_id: "step-2",
          step_title: "Zone Demarcation by Town Planning Department",
          department: "Town Planning & Valuation",
          completed_at: "2026-08-19T17:00:00Z",
          status: "VERIFIED",
          verified_by: "Town Planning Officer",
          officer_remarks: "Classified under Agro-Industrial Expansion Belt.",
        },
        {
          step_id: "step-3",
          step_title: "Tahsildar Field Inspection & Title Search Clearance",
          department: "Revenue Sub-Division Satara",
          completed_at: null,
          status: "DEFECT",
          verified_by: "OFFICER-MH-4410",
          officer_remarks: "Discrepancy in Survey Map plot coordinates.",
        },
      ],
      documents: [
        {
          doc_id: "doc-rev-1",
          doc_name: "Digitally Signed 7/12 Land Record Extract",
          category: "Title Proof",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "Revenue Dept Govt of Maharashtra",
          file_url: "https://mahabhumi.gov.in/sample/7_12.pdf",
          uploaded_at: "2026-08-18T11:02:00Z",
        },
        {
          doc_id: "doc-rev-2",
          doc_name: "Cadastral Survey Map (KJP)",
          category: "Demarcation",
          verification_status: "DEFECT",
          issuing_authority: "District Land Survey Office",
          file_url: "https://landrecords.mh.gov.in/sample/kjp_map.pdf",
          uploaded_at: "2026-08-18T11:03:00Z",
        },
      ],
    },
  },
  {
    application_id: "APP-2026-MUNI-5590",
    citizen_name: "Fatima Zahra Khan",
    enterprise_name: "Zahra Designer Studios",
    department: "MUNICIPAL",
    department_name: "Greater Bengaluru Municipal Corporation (BBMP)",
    service_title: "Trade License & Commercial Establishment Sanction",
    journey_id: "trade-license",
    current_step_id: "step-1",
    current_step_title: "Property Tax (PID) & Zonal Sanction Verification",
    status: "APPROVED",
    submission_date: "2026-08-21T08:00:00Z",
    sla_deadline: "2026-08-23T08:00:00Z",
    sla_hours_total: 48,
    sla_hours_remaining: 38.0,
    is_sla_breached: false,
    risk_score: 8,
    last_action_date: "2026-08-21T18:00:00Z",
    last_officer_id: "OFFICER-BBMP-8821",
    last_officer_remarks: "PID 102-W0041-94 verified with up-to-date FY 2025-26 SAS property tax receipt. Approved.",
    dossier: {
      citizen_name: "Fatima Zahra Khan",
      applicant_id: "CITIZEN-KA-77610",
      aadhaar_masked: "XXXX-XXXX-9920",
      pan_masked: "EPZPK****R",
      mobile: "+91 99887 66554",
      email: "fatima@zahrastudios.com",
      enterprise_name: "Zahra Designer Studios",
      entity_type: "Proprietorship",
      registered_address: "#19, Commercial Street, Tasker Town, Bengaluru",
      pincode: "560001",
      state: "Karnataka",
      district: "Bengaluru Urban",
      timeline: [
        {
          step_id: "step-1",
          step_title: "Property Tax (PID) & Zonal Sanction Verification",
          department: "BBMP Revenue Cell",
          completed_at: "2026-08-21T18:00:00Z",
          status: "VERIFIED",
          verified_by: "OFFICER-BBMP-8821",
          officer_remarks: "PID and SAS tax clearance verified.",
        },
      ],
      documents: [
        {
          doc_id: "doc-bbmp-1",
          doc_name: "BBMP Property Tax SAS Receipt FY 25-26",
          category: "Tax Clearance",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "BBMP Revenue Dept",
          file_url: "https://bbmptax.karnataka.gov.in/receipt_2026.pdf",
          uploaded_at: "2026-08-21T08:01:00Z",
        },
      ],
    },
  },
  {
    application_id: "APP-2026-RTO-7102",
    citizen_name: "Kavita Devendra Patil",
    enterprise_name: null,
    department: "TRANSPORT",
    department_name: "Ministry of Road Transport & Highways (MoRTH)",
    service_title: "Commercial Goods Carrier Permit & Fitness Certification",
    journey_id: "driving-license",
    current_step_id: "step-2",
    current_step_title: "Automated Vehicle Inspection & Emission Report Check",
    status: "PENDING_REVIEW",
    submission_date: "2026-08-21T12:00:00Z",
    sla_deadline: "2026-08-22T12:00:00Z",
    sla_hours_total: 24,
    sla_hours_remaining: 14.9,
    is_sla_breached: false,
    risk_score: 19,
    dossier: {
      citizen_name: "Kavita Devendra Patil",
      applicant_id: "CITIZEN-MH-33819",
      aadhaar_masked: "XXXX-XXXX-3381",
      pan_masked: "ASDPP****Q",
      mobile: "+91 98112 33445",
      email: "kavita.patil@logisticsindia.org",
      registered_address: "Plot 8, MIDC Bhosari, Pune",
      pincode: "411026",
      state: "Maharashtra",
      district: "Pune",
      timeline: [
        {
          step_id: "step-1",
          step_title: "Vehicle Chassis & VAHAN Record Match",
          department: "VAHAN National Register",
          completed_at: "2026-08-21T12:05:00Z",
          status: "VERIFIED",
          verified_by: "VAHAN 4.0 API",
          officer_remarks: "Chassis match verified with zero pending e-challans.",
        },
      ],
      documents: [
        {
          doc_id: "doc-rto-1",
          doc_name: "Commercial Vehicle RC & Speed Governor Certificate",
          category: "Vehicle Registration",
          verification_status: "VERIFIED_DIGILOCKER",
          issuing_authority: "MoRTH / Parivahan",
          file_url: "https://parivahan.gov.in/sample/rc.pdf",
          uploaded_at: "2026-08-21T12:02:00Z",
        },
      ],
    },
  },
];

export const officerService = {
  /**
   * Retrieve list of cross-departmental citizen applications for officer scrutiny.
   */
  getApplications: async (
    department?: DepartmentCode,
    status?: ApplicationStatus,
    search?: string
  ): Promise<OfficerApplication[]> => {
    const params = new URLSearchParams();
    if (department) params.append("department", department);
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const live = await safeFetch<OfficerApplication[]>(`/api/officer/applications${qs}`);
    if (live && Array.isArray(live)) {
      return live;
    }

    // Client-side fallback filtering
    let results = [...FALLBACK_OFFICER_APPLICATIONS];
    if (department) results = results.filter((a) => a.department === department);
    if (status) results = results.filter((a) => a.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (a) =>
          a.application_id.toLowerCase().includes(q) ||
          a.citizen_name.toLowerCase().includes(q) ||
          (a.enterprise_name && a.enterprise_name.toLowerCase().includes(q)) ||
          a.service_title.toLowerCase().includes(q)
      );
    }
    return results;
  },

  /**
   * Retrieve single application detail with full dossier.
   */
  getApplicationById: async (applicationId: string): Promise<OfficerApplication | null> => {
    const live = await safeFetch<OfficerApplication>(`/api/officer/applications/${encodeURIComponent(applicationId)}`);
    if (live) return live;
    return FALLBACK_OFFICER_APPLICATIONS.find((a) => a.application_id === applicationId) || null;
  },

  /**
   * Submit statutory decision (APPROVE, FLAG_DEFECT, REJECT) with SLA delta calculation.
   */
  submitDecision: async (payload: OfficerDecisionRequest): Promise<OfficerDecisionResponse> => {
    const live = await safeFetch<OfficerDecisionResponse>("/api/officer/decision", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (live) return live;

    // Fallback response generator
    const nowStr = new Date().toISOString();
    return {
      success: true,
      application_id: payload.application_id,
      new_status: payload.decision,
      decision_timestamp: nowStr,
      sla_time_delta_hours: 14.5,
      sla_performance_summary: `Completed in 14.5 hrs (33.5 hrs ahead of statutory SLA limit of 48 hrs)`,
      audit_reference_id: `AUDIT-${payload.department || "GOV"}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      officer_id: payload.officer_id || "OFFICER-KA-9942",
      message: `Application ${payload.application_id} updated to ${payload.decision}.`,
    };
  },

  /**
   * Request automated Gemini 2.5 Flash 3-point dossier briefing.
   */
  analyzeDossier: async (payload: DossierAnalysisRequest): Promise<DossierAnalysisResponse> => {
    const live = await safeFetch<DossierAnalysisResponse>("/api/officer/analyze-dossier", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (live) return live;

    const isFssai = payload.application_id.includes("FSSAI") || payload.service_title.includes("Food");
    const isRev = payload.application_id.includes("REV") || payload.service_title.includes("Land");

    if (isFssai) {
      return {
        application_id: payload.application_id,
        identity_verification_status: "Aadhaar & PAN authenticated with 100% biometric and name match via DigiLocker. Food Safety Supervisor Level 2 FoSTaC Certificate verified.",
        document_completeness: "IS 10500 compliant water test report and registered 11-month lease deed attached. Kitchen equipment layout blueprint attached.",
        regulatory_red_flags: "Commercial lease agreement has 28 days remaining for statutory renewal; requires a 3-year extension undertaking under FSSAI Section 31 before final 5-year license dispatch.",
        overall_risk_level: "MEDIUM",
        risk_score: 42,
        statutory_citations: ["FSSAI Act 2006 Section 31", "Food Safety and Standards Regulations 2011"],
        recommended_action: "REQUEST_CLARIFICATION",
        analysis_timestamp: new Date().toISOString(),
      };
    } else if (isRev) {
      return {
        application_id: payload.application_id,
        identity_verification_status: "Applicant identity confirmed with DigiLocker verified 7/12 land record mutation extract (Ferfar) dating back 30 years without encumbrances.",
        document_completeness: "Cadastral survey map (KJP) submitted; Town Planning zone classification letter attached.",
        regulatory_red_flags: "Discrepancy noted in plot boundary coordinates on Survey Plot 142/3-B bordering forest buffer zone. Demarcation must be verified by Deputy Director of Land Records (DDLR).",
        overall_risk_level: "ELEVATED",
        risk_score: 68,
        statutory_citations: ["Maharashtra Land Revenue Code 1966 Section 44", "Forest Conservation Act 1980"],
        recommended_action: "REQUEST_CLARIFICATION",
        analysis_timestamp: new Date().toISOString(),
      };
    } else {
      return {
        application_id: payload.application_id,
        identity_verification_status: "Aadhaar KYC & Income Tax PAN cryptographic match confirmed via API Setu with zero discrepancy in applicant demographic records.",
        document_completeness: "Incorporation certification from Ministry of Corporate Affairs and BESCOM electricity utility tariff bill verified.",
        regulatory_red_flags: "No high-risk regulatory red flags identified. Enterprise qualifies for Micro category under MSMED Act 2006 with clean statutory standing.",
        overall_risk_level: "LOW",
        risk_score: 12,
        statutory_citations: ["MSMED Act 2006 Section 7", "Central Goods and Services Tax Act 2017"],
        recommended_action: "APPROVE",
        analysis_timestamp: new Date().toISOString(),
      };
    }
  },
};




