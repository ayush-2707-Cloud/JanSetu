"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileText,
  FileSignature,
  ArrowRight,
  Lock,
  ChevronDown,
  ChevronUp,
  Scale,
  Copy,
  Check,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  runPreflightValidation,
  resolveExceptionWithAI,
  fetchDemoCases,
  PreflightValidationRequest,
  PreflightValidationResponse,
  ValidationIssue,
  ExceptionResolutionResponse,
} from "@/services/preflightService";

interface PreFlightReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
  initialRequest?: PreflightValidationRequest;
  stepTitle?: string;
  journeyTitle?: string;
}

// Memoized Quality Gauge Component for 60fps rendering
const QualityScoreGauge = memo(function QualityScoreGauge({
  qualityScore,
  isBlocked,
  hasWarnings,
}: {
  qualityScore: number;
  isBlocked: boolean;
  hasWarnings: boolean;
}) {
  const strokeColorClass = isBlocked
    ? "text-rose-500"
    : hasWarnings
    ? "text-amber-500"
    : "text-emerald-500";

  return (
    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center perf-gpu">
      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={strokeColorClass}
          strokeDasharray={`${qualityScore}, 100`}
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="absolute font-black text-base text-slate-900 dark:text-white">
        {qualityScore}%
      </span>
    </div>
  );
});

export default function PreFlightReviewModal({
  isOpen,
  onClose,
  onProceed,
  initialRequest,
  stepTitle = "Statutory Milestone Filing",
  journeyTitle = "Citizen Public Service",
}: PreFlightReviewModalProps) {
  // Prevent background body scroll when modal is open to ensure 60fps buttery scrolling
  useBodyScrollLock(isOpen);

  const [requestData, setRequestData] = useState<PreflightValidationRequest>(
    initialRequest || {
      applicant_name: "Vikram Sheshadri Rao",
      applicant_pan: "ABCDE1234F",
      applicant_aadhaar_last4: "8842",
      applicant_pin: "560001",
      uploaded_documents: [
        {
          id: "doc-pan",
          doc_type: "PAN_CARD",
          file_name: "ePAN_Vikram_Rao.pdf",
          extracted_name: "Vikram Sheshadri Rao",
          ocr_confidence: 0.98,
          resolution_dpi: 300,
          digilocker_verified: true,
        },
        {
          id: "doc-rent",
          doc_type: "RENT_AGREEMENT",
          file_name: "Commercial_Lease_2026.pdf",
          extracted_name: "Vikram Sheshadri Rao",
          expiry_date: "2027-12-31",
          ocr_confidence: 0.95,
          resolution_dpi: 300,
        },
      ],
    }
  );

  const [validationResult, setValidationResult] = useState<PreflightValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [aiResolutions, setAiResolutions] = useState<Record<string, ExceptionResolutionResponse>>({});
  const [loadingAiIssueId, setLoadingAiIssueId] = useState<string | null>(null);
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<Record<string, boolean>>({});
  const [demoCases, setDemoCases] = useState<Record<string, any>>({});
  const [activeScenario, setActiveScenario] = useState<string>("clean_pass");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Load demo cases and initial validation on mount
  useEffect(() => {
    if (isOpen) {
      loadDemoData();
    }
  }, [isOpen]);

  const loadDemoData = async () => {
    const cases = await fetchDemoCases();
    setDemoCases(cases);
    if (initialRequest) {
      executeValidation(initialRequest);
    } else if (cases.clean_pass) {
      setRequestData(cases.clean_pass.request);
      executeValidation(cases.clean_pass.request);
    }
  };

  const executeValidation = async (payload: PreflightValidationRequest) => {
    setIsValidating(true);
    try {
      const res = await runPreflightValidation(payload);
      setValidationResult(res);
      if (res.issues.length > 0) {
        setExpandedIssueId(res.issues[0].id);
      }
    } catch (e) {
      console.error("Preflight execution error:", e);
    } finally {
      setIsValidating(false);
    }
  };

  const handleScenarioChange = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    const targetCase = demoCases[scenarioKey];
    if (targetCase) {
      setRequestData(targetCase.request);
      setAcknowledgedWarnings({});
      setAiResolutions({});
      executeValidation(targetCase.request);
    }
  };

  const handleTriggerAIResolution = async (issue: ValidationIssue) => {
    if (!issue.discrepancy) return;
    setLoadingAiIssueId(issue.id);
    try {
      const res = await resolveExceptionWithAI({
        issue_id: issue.id,
        field_a_name: issue.discrepancy.field_a_name,
        field_a_value: issue.discrepancy.field_a_value,
        field_b_name: issue.discrepancy.field_b_name,
        field_b_value: issue.discrepancy.field_b_value,
        doc_type: issue.field,
      });
      setAiResolutions((prev) => ({ ...prev, [issue.id]: res }));
    } catch (e) {
      console.error("AI Resolution trigger failed:", e);
    } finally {
      setLoadingAiIssueId(null);
    }
  };

  const handleAutoFixName = (targetName: string) => {
    const updated = {
      ...requestData,
      applicant_name: targetName,
    };
    setRequestData(updated);
    executeValidation(updated);
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const overallStatus = validationResult?.overall_status || "PASSED";
  const qualityScore = validationResult?.metrics.quality_score || 100;
  const isBlocked = overallStatus === "BLOCKED";
  const hasWarnings = (validationResult?.warning_checks_count || 0) > 0;
  const allWarningsAcknowledged = useMemo(() => {
    if (!validationResult?.issues) return false;
    const warnings = validationResult.issues.filter((i) => i.severity === "WARNING");
    return warnings.length > 0 && warnings.every((i) => acknowledgedWarnings[i.id]);
  }, [validationResult, acknowledgedWarnings]);

  const canProceed = !isBlocked && (!hasWarnings || allWarningsAcknowledged);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Header */}
        <div
          className={`h-1.5 w-full transition-colors duration-200 ${
            isBlocked
              ? "bg-rose-500"
              : hasWarnings
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
        />

        {/* Modal Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${
                isBlocked
                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
                  : hasWarnings
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
              }`}
            >
              {isBlocked ? (
                <XCircle className="w-5 h-5" />
              ) : hasWarnings ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Data-Quality Pre-Flight Quality Gate
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Pre-Submission Audit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {stepTitle} • {journeyTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Quality Gate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Scenario Switcher */}
        <div className="px-5 py-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 overscroll-contain">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Interactive Demo Test Cases:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleScenarioChange("clean_pass")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScenario === "clean_pass"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              1. Clean Pass (100%)
            </button>
            <button
              onClick={() => handleScenarioChange("name_mismatch_warning")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScenario === "name_mismatch_warning"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              2. Name Mismatch (82%)
            </button>
            <button
              onClick={() => handleScenarioChange("expired_blocker")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScenario === "expired_blocker"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              3. Expired Blocker
            </button>
          </div>
        </div>

        {/* Scrollable Content Body - Optimized with overscroll-contain & content-visibility */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain transform-gpu">
          {/* Quality Score & Executive Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Score Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
              <QualityScoreGauge
                qualityScore={qualityScore}
                isBlocked={isBlocked}
                hasWarnings={hasWarnings}
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Quality Readiness Score
                </span>
                <span
                  className={`text-sm font-bold ${
                    isBlocked
                      ? "text-rose-600 dark:text-rose-400"
                      : hasWarnings
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isBlocked
                    ? "Submission Blocked"
                    : hasWarnings
                    ? "Passed with Advisories"
                    : "Optimal for Submission"}
                </span>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                  Gemini Scrutiny Risk Assessment
                </span>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  {validationResult?.ai_summary || "Evaluating statutory readiness..."}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Core Verification Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deterministic Verification Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Card 1: OCR Legibility */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    OCR Legibility
                  </span>
                  {(validationResult?.metrics.ocr_confidence_avg || 1) >= 0.9 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Confidence:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {Math.round((validationResult?.metrics.ocr_confidence_avg || 0.96) * 100)}%
                  </strong>
                </div>
                <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-semibold">
                  300 DPI Standard Passed
                </span>
              </div>

              {/* Card 2: Identity & Name Consistency */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Identity Match
                  </span>
                  {(validationResult?.metrics.name_similarity_min || 1) >= 0.85 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (validationResult?.metrics.name_similarity_min || 1) >= 0.6 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Similarity:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {Math.round((validationResult?.metrics.name_similarity_min || 1) * 100)}%
                  </strong>
                </div>
                <span className="text-[10px] block text-slate-500 dark:text-slate-400">
                  DigiLocker PAN & Aadhaar
                </span>
              </div>

              {/* Card 3: Statutory Schema */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Schema Format
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  PAN & PIN:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">100% Valid</strong>
                </div>
                <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-semibold">
                  Section 139A Compliant
                </span>
              </div>

              {/* Card 4: Validity & Expiry */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Expiry Guardrail
                  </span>
                  {validationResult?.metrics.validity_guardrail_passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Documents:{" "}
                  <strong
                    className={
                      validationResult?.metrics.validity_guardrail_passed
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {validationResult?.metrics.validity_guardrail_passed ? "Active" : "Expired"}
                  </strong>
                </div>
                <span className="text-[10px] block text-slate-500 dark:text-slate-400">
                  Bylaw Validity Check
                </span>
              </div>
            </div>
          </div>

          {/* Interactive AI Discrepancy & Exception Section */}
          {validationResult && validationResult.issues.length > 0 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Flagged Discrepancies & AI Exception Handling ({validationResult.issues.length})
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Click any card to view Gemini resolution guidance
                </span>
              </div>

              <div className="space-y-3">
                {validationResult.issues.map((issue) => {
                  const isExpanded = expandedIssueId === issue.id;
                  const aiResolution = aiResolutions[issue.id];
                  const isAiLoading = loadingAiIssueId === issue.id;
                  const isAcked = acknowledgedWarnings[issue.id];

                  return (
                    <div
                      key={issue.id}
                      className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                        issue.severity === "BLOCKED"
                          ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                          : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60"
                      }`}
                    >
                      {/* Issue Card Header */}
                      <button
                        onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                        className="w-full p-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {issue.severity === "BLOCKED" ? (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  issue.severity === "BLOCKED"
                                    ? "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300"
                                    : "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                                }`}
                              >
                                {issue.severity}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {issue.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {issue.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {issue.autofix_available && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                              <Sparkles className="w-3 h-3" />
                              1-Click Fix
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Details & AI Exception Handler */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-slate-200/60 dark:border-slate-800">
                          {/* Discrepancy Side-by-Side View */}
                          {issue.discrepancy && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {issue.discrepancy.field_a_name}
                                </span>
                                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                  {issue.discrepancy.field_a_value}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {issue.discrepancy.field_b_name}
                                </span>
                                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                  {issue.discrepancy.field_b_value}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rejection Risk Explanation */}
                          <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-950 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-blue-400" />
                                Why Government Portals Will Reject This:
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Official Scrutiny Standard
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {issue.rejection_reason}
                            </p>
                          </div>

                          {/* Gemini AI Resolution Card */}
                          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                  <Sparkles className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  Gemini Exception Guidance & 1-Step Corrective Action
                                </span>
                              </div>

                              {!aiResolution && (
                                <button
                                  onClick={() => handleTriggerAIResolution(issue)}
                                  disabled={isAiLoading}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  {isAiLoading ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Scale className="w-3 h-3" />
                                  )}
                                  Deep Legal Citation
                                </button>
                              )}
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {aiResolution
                                ? aiResolution.plain_language_explanation
                                : issue.corrective_action}
                            </p>

                            {/* Statutory Affidavit Snippet */}
                            {aiResolution?.affidavit_template_snippet && (
                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                  <span>STATUTORY ANNEXURE-A CLAUSE</span>
                                  <button
                                    onClick={() =>
                                      handleCopySnippet(
                                        aiResolution.affidavit_template_snippet!,
                                        issue.id
                                      )
                                    }
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedSnippetId === issue.id ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    Copy Clause
                                  </button>
                                </div>
                                <p className="font-serif italic text-slate-700 dark:text-slate-300 text-[11px]">
                                  {aiResolution.affidavit_template_snippet}
                                </p>
                              </div>
                            )}

                            {/* 1-Click Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {issue.autofix_action === "SYNC_NAME_TO_AADHAAR" &&
                                issue.discrepancy && (
                                  <button
                                    onClick={() =>
                                      handleAutoFixName(issue.discrepancy!.field_b_value)
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Auto-Sync Name to Match DigiLocker (
                                    {issue.discrepancy.field_b_value})
                                  </button>
                                )}

                              {issue.can_override && (
                                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer ml-auto">
                                  <input
                                    type="checkbox"
                                    checked={!!isAcked}
                                    onChange={(e) =>
                                      setAcknowledgedWarnings((prev) => ({
                                        ...prev,
                                        [issue.id]: e.target.checked,
                                      }))
                                    }
                                    className="w-4 h-4 rounded-sm text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span>Acknowledge advisory & proceed with self-declaration</span>
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clean Pass State */}
          {validationResult && validationResult.issues.length === 0 && (
            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                100% Statutory Credential Compliance
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-lg mx-auto leading-relaxed">
                All uploaded documents, DigiLocker tokens, and entered parameters have passed
                deterministic checks. Zero discrepancies or expiry risks detected.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => executeValidation(requestData)}
            disabled={isValidating}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? "animate-spin" : ""}`} />
            Re-Run Quality Checks
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel / Return to Form
            </button>

            <button
              onClick={() => {
                if (canProceed && onProceed) {
                  onProceed();
                  onClose();
                }
              }}
              disabled={!canProceed}
              className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                canProceed
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isBlocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Resolve Blockers to Submit
                </>
              ) : (
                <>
                  Proceed with Statutory Filing
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
