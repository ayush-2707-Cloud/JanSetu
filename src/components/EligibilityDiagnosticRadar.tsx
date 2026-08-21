"use client";

import React, { useState } from "react";
import {
  Radar,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  UserCheck,
  FileText,
} from "lucide-react";
import { UniversalJourney, Language } from "@/types/journey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface EligibilityDiagnosticRadarProps {
  isOpen: boolean;
  onClose: () => void;
  journey: UniversalJourney | null;
  onStartJourney: () => void;
  language: Language;
}

interface PrerequisiteCheck {
  id: string;
  label: string;
  category: "IDENTITY" | "FINANCIAL" | "PROPERTY" | "ACADEMIC";
  isMandatory: boolean;
  status: "READY" | "MISSING" | "OPTIONAL";
  fixGuidance: string;
}

export const EligibilityDiagnosticRadar: React.FC<EligibilityDiagnosticRadarProps> = ({
  isOpen,
  onClose,
  journey,
  onStartJourney,
  language,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const [answers, setAnswers] = useState<Record<string, boolean>>({
    aadhaar_linked: true,
    pan_verified: true,
    bank_account: true,
    address_proof: true,
    tax_returns: false,
    noc_obtained: false,
  });

  if (!isOpen || !journey) return null;

  const checks: PrerequisiteCheck[] = [
    {
      id: "aadhaar_linked",
      label: "Aadhaar Card Linked with Active Mobile Number (for OTP e-Sign)",
      category: "IDENTITY",
      isMandatory: true,
      status: answers.aadhaar_linked ? "READY" : "MISSING",
      fixGuidance: "Update mobile linkage at nearest Aadhaar Seva Kendra or post office.",
    },
    {
      id: "pan_verified",
      label: "Individual / Enterprise PAN Card Matching Applicant Name",
      category: "IDENTITY",
      isMandatory: true,
      status: answers.pan_verified ? "READY" : "MISSING",
      fixGuidance: "Instant e-PAN can be generated in 10 minutes via NSDL / e-Filing portal.",
    },
    {
      id: "bank_account",
      label: "Active Bank Current / Savings Account with IFSC Code & Cancelled Cheque",
      category: "FINANCIAL",
      isMandatory: true,
      status: answers.bank_account ? "READY" : "MISSING",
      fixGuidance: "Ensure your bank account has active netbanking for statutory fee payments.",
    },
    {
      id: "address_proof",
      label: "Valid Registered Premises Proof (Electricity Bill / Rent Agreement + Landlord NOC)",
      category: "PROPERTY",
      isMandatory: true,
      status: answers.address_proof ? "READY" : "MISSING",
      fixGuidance: "Execute standard e-Stamp rent agreement and obtain signed owner NOC.",
    },
    {
      id: "tax_returns",
      label: "Last 2 Financial Years Income Tax Returns (ITR / Form 16)",
      category: "FINANCIAL",
      isMandatory: false,
      status: answers.tax_returns ? "READY" : "OPTIONAL",
      fixGuidance: "Required for high-value MSME loans or subsidized government seed schemes.",
    },
  ];

  const readyCount = checks.filter((c) => c.status === "READY").length;
  const missingMandatoryCount = checks.filter((c) => c.isMandatory && c.status === "MISSING").length;
  const scorePercent = Math.round((readyCount / checks.length) * 100);

  const toggleCheck = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300">
                <Radar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Prerequisite Radar & Readiness Audit</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    30-Second Diagnostic
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-flight eligibility check for: <span className="text-slate-200 font-bold">{journey.title}</span>
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Readiness Gauge Header */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Citizen Pre-Flight Readiness Score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {scorePercent}% Ready
                  </span>
                  {missingMandatoryCount === 0 ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300">
                      ✓ All Prerequisites Met
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300">
                      ⚠️ {missingMandatoryCount} Critical Prerequisite Missing
                    </span>
                  )}
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-600/25 shrink-0">
                {readyCount}/{checks.length}
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Verify Your Prerequisite Documents:
              </span>

              <div className="space-y-2.5">
                {checks.map((check) => {
                  const isChecked = answers[check.id];
                  return (
                    <div
                      key={check.id}
                      onClick={() => toggleCheck(check.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs"
                          : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold ${isChecked ? "text-slate-900 dark:text-white" : "text-amber-900 dark:text-amber-300"}`}>
                                {check.label}
                              </span>
                              {check.isMandatory && (
                                <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 dark:bg-red-950 px-1.5 py-0.2 rounded border border-red-200">
                                  MANDATORY
                                </span>
                              )}
                            </div>
                            {!isChecked && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                                💡 Tip: {check.fixGuidance}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isChecked
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300"
                        }`}>
                          {isChecked ? "READY" : "MISSING"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Diagnostic runs locally on your device before starting.
            </span>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer">
                Back
              </button>
              <button
                onClick={() => {
                  onStartJourney();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
