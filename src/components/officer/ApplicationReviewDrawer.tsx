"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Sparkles,
  UserCheck,
  Send,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  FileWarning,
  Layers,
  ArrowRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  OfficerApplication,
  OfficerDecisionRequest,
  DossierAnalysisResponse,
  ApplicationStatus,
} from "@/types/officer";
import { officerService } from "@/services/api";
import { useToast } from "@/context/ToastContext";

interface ApplicationReviewDrawerProps {
  application: OfficerApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onDecisionSubmitted?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const QUICK_STATUTORY_REMARKS = [
  "All statutory KYC documents and prerequisites verified under Section 14.",
  "Commercial rent agreement validity under 1-year threshold; requires renewal undertaking.",
  "Address discrepancy noted between electricity utility bill and municipal trade PID record.",
  "Water potability IS 10500 certified lab test valid and within 6-month validity.",
  "Boundary coordinates in cadastral survey require re-demarcation by Land Records Officer.",
  "Digitally signed 7/12 land extract verified with zero pending revenue encumbrances.",
];

export const ApplicationReviewDrawer: React.FC<ApplicationReviewDrawerProps> = ({
  application,
  isOpen,
  onClose,
  onDecisionSubmitted,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"DOSSIER" | "AI_BRIEFING" | "DOCUMENTS">("DOSSIER");
  
  // Decision Form State
  const [selectedDecision, setSelectedDecision] = useState<ApplicationStatus>("APPROVED");
  const [remarks, setRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // AI Dossier Briefing State
  const [aiBriefing, setAiBriefing] = useState<DossierAnalysisResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    if (application && isOpen) {
      // Set default remarks based on current status
      setSelectedDecision(application.status === "DEFECT_FLAGGED" ? "DEFECT_FLAGGED" : "APPROVED");
      setRemarks(application.last_officer_remarks || "");
      
      // Auto-trigger AI Briefing
      loadAiBriefing(application);
    }
  }, [application?.application_id, isOpen]);

  const loadAiBriefing = async (app: OfficerApplication) => {
    setIsLoadingAi(true);
    try {
      const res = await officerService.analyzeDossier({
        application_id: app.application_id,
        service_title: app.service_title,
        department: app.department_name,
        citizen_name: app.citizen_name,
        enterprise_name: app.enterprise_name,
        documents: app.dossier.documents.map((d) => ({ doc_name: d.doc_name, status: d.verification_status })),
        timeline: app.dossier.timeline.map((t) => ({ step_title: t.step_title, status: t.status })),
        additional_notes: app.last_officer_remarks || undefined,
      });
      setAiBriefing(res);
    } catch (err) {
      console.warn("AI briefing load error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!isOpen || !application) return null;

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      showToast("Please provide mandatory officer scrutiny remarks.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const req: OfficerDecisionRequest = {
        application_id: application.application_id,
        step_id: application.current_step_id,
        decision: selectedDecision,
        remarks: remarks.trim(),
        officer_id: "OFFICER-KA-9942",
        officer_name: "Shri S. Ranganathan",
        department: application.department,
      };

      const res = await officerService.submitDecision(req);
      if (res && res.success) {
        showToast(
          `Decision recorded! ${application.application_id} marked as ${selectedDecision} (${res.sla_performance_summary})`,
          "success"
        );
        onDecisionSubmitted?.(application.application_id, selectedDecision);
        onClose();
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to record statutory decision.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSlaBadge = () => {
    if (application.is_sla_breached) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          SLA Breached ({Math.abs(application.sla_hours_remaining).toFixed(1)}h Overdue)
        </span>
      );
    }
    if (application.sla_hours_remaining <= 12) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Urgent ({application.sla_hours_remaining.toFixed(1)}h remaining)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        On Track ({application.sla_hours_remaining.toFixed(1)}h remaining)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                {application.application_id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {application.department}
              </span>
              {getSlaBadge()}
            </div>

            <h2 className="text-lg font-black tracking-tight text-white line-clamp-1">
              {application.service_title}
            </h2>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Step Under Review:</span>
              <strong className="text-slate-200">{application.current_step_title}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("DOSSIER")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "DOSSIER"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Beneficiary Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("AI_BRIEFING")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "AI_BRIEFING"
                ? "border-purple-600 text-purple-600 dark:text-purple-400 font-extrabold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI Risk Briefing (Gemini)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("DOCUMENTS")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "DOCUMENTS"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Document Vault ({application.dossier.documents.length})</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: CONSOLIDATED BENEFICIARY DOSSIER */}
          {activeTab === "DOSSIER" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Applicant Identity Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Applicant Identity Profile (DigiLocker KYC)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                    <UserCheck className="w-3 h-3" /> DigiLocker Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Applicant Name:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{application.dossier.citizen_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Enterprise / Entity:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {application.dossier.enterprise_name || "Individual Citizen"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Aadhaar / PAN:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {application.dossier.aadhaar_masked} • {application.dossier.pan_masked}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Contact Details:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {application.dossier.mobile} • {application.dossier.email}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Premises / Address:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {application.dossier.registered_address}, {application.dossier.district}, {application.dossier.state} - {application.dossier.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cross-Department Statutory Verification Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Cross-Department Verification Timeline
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4 ml-2">
                  {application.dossier.timeline.map((step, idx) => (
                    <div key={step.step_id} className="relative group">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.status === "VERIFIED"
                            ? "bg-emerald-500 border-white dark:border-slate-900 text-white"
                            : step.status === "DEFECT"
                            ? "bg-amber-500 border-white dark:border-slate-900 text-white"
                            : "bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-900"
                        }`}
                      />

                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {step.step_title}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              step.status === "VERIFIED"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                : step.status === "DEFECT"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{step.department}</span>
                          {step.completed_at && <span>• {new Date(step.completed_at).toLocaleDateString()}</span>}
                        </div>

                        {step.officer_remarks && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800 mt-1 italic">
                            "{step.officer_remarks}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI RISK BRIEFING (GEMINI 2.5 FLASH) */}
          {activeTab === "AI_BRIEFING" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      AI 3-Point Eligibility & Risk Briefing
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Powered by Gemini 2.5 Flash Grounded Statutory Analyzer
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loadAiBriefing(application)}
                  disabled={isLoadingAi}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingAi ? "animate-spin" : ""}`} />
                  <span>Re-evaluate</span>
                </button>
              </div>

              {isLoadingAi ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cross-referencing DigiLocker KYC with statutory gazette regulations...
                  </p>
                </div>
              ) : aiBriefing ? (
                <div className="space-y-3">
                  {/* Risk Overview Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      aiBriefing.overall_risk_level === "LOW"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                        : aiBriefing.overall_risk_level === "MEDIUM"
                        ? "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                        : "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-black tracking-wider block">
                        Calculated Scrutiny Risk:
                      </span>
                      <strong className="text-sm font-black">
                        {aiBriefing.overall_risk_level} RISK (Score: {aiBriefing.risk_score}/100)
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] block opacity-80">Recommended Action:</span>
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-white/80 dark:bg-slate-900/80 shadow-xs">
                        {aiBriefing.recommended_action}
                      </span>
                    </div>
                  </div>

                  {/* 3-Point Briefing Cards */}
                  <div className="space-y-2.5">
                    {/* Point 1: Identity */}
                    <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        1. Identity Verification Status:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                        {aiBriefing.identity_verification_status}
                      </p>
                    </div>

                    {/* Point 2: Completeness */}
                    <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        2. Document Completeness:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                        {aiBriefing.document_completeness}
                      </p>
                    </div>

                    {/* Point 3: Red Flags */}
                    <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        3. Potential Regulatory Red Flags:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                        {aiBriefing.regulatory_red_flags}
                      </p>
                    </div>
                  </div>

                  {/* Statutory Citations */}
                  {aiBriefing.statutory_citations && aiBriefing.statutory_citations.length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        Statutory Gazette Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiBriefing.statutory_citations.map((cite, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200"
                          >
                            § {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: DOCUMENT VAULT */}
          {activeTab === "DOCUMENTS" && (
            <div className="space-y-3 animate-in fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Uploaded Statutory Records & DigiLocker Vault
              </h3>

              <div className="space-y-2">
                {application.dossier.documents.map((doc) => (
                  <div
                    key={doc.doc_id}
                    className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {doc.doc_name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {doc.category} • Issued by: {doc.issuing_authority}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.verification_status === "VERIFIED_DIGILOCKER"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                            : doc.verification_status === "DEFECT"
                            ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {doc.verification_status}
                      </span>

                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Inspect Document"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Action Controls & Scrutiny Decision Form */}
          <form onSubmit={handleDecisionSubmit} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Statutory Decision Controls
              </h3>
              <span className="text-[11px] text-slate-500">Official Scrutiny Log</span>
            </div>

            {/* Decision Radio / Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDecision("APPROVED")}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedDecision === "APPROVED"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Step</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("DEFECT_FLAGGED")}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedDecision === "DEFECT_FLAGGED"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm scale-102"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-amber-50"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Flag Defect</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("REJECTED")}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedDecision === "REJECTED"
                    ? "bg-red-600 text-white border-red-600 shadow-sm scale-102"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-red-50"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>

            {/* Quick Fill Remark Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Quick-Fill Standard Statutory Remarks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_STATUTORY_REMARKS.map((rem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRemarks(rem)}
                    className="text-[10px] text-left px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors line-clamp-1 cursor-pointer"
                    title={rem}
                  >
                    {rem}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Nodal Officer Statutory Scrutiny Remarks (Mandatory for Audit Trail):
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter detailed statutory scrutiny observations, citations, or defect rectification directions..."
                rows={3}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                selectedDecision === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : selectedDecision === "DEFECT_FLAGGED"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Decision & Recalculating SLA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Commit Official Decision ({selectedDecision.replace("_", " ")})
                  </span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
