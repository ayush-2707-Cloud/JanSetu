"use client";

import React, { useRef } from "react";
import {
  Download,
  X,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  QrCode,
  Share2,
} from "lucide-react";
import { UniversalJourney, EnhancedJourney } from "@/types/journey";
import { useToast } from "@/context/ToastContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface RoadmapExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: UniversalJourney | EnhancedJourney;
  language?: string;
}

export const RoadmapExportModal: React.FC<RoadmapExportModalProps> = ({
  isOpen,
  onClose,
  journey,
  language = "en",
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const { showToast } = useToast();
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !journey) return null;

  const completedSteps = journey.steps.filter((s) => s.status === "COMPLETED");
  const inProgressStep = journey.steps.find((s) => s.status === "IN_PROGRESS");
  const progressPct = Math.round((completedSteps.length / journey.steps.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JanSetu™ Statutory Dossier - ${journey.title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
    h1 { font-size: 22px; color: #0f172a; margin: 0; }
    .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #dbeafe; color: #1e40af; }
    .progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin: 16px 0; }
    .progress-fill { height: 100%; background: #16a34a; width: ${progressPct}%; }
    .step-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
    .step-title { font-size: 15px; font-weight: bold; color: #0f172a; }
    .step-status { font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .status-completed { background: #dcfce7; color: #15803d; }
    .status-progress { background: #dbeafe; color: #1d4ed8; }
    .status-locked { background: #f1f5f9; color: #64748b; }
    .doc-list { margin-top: 10px; font-size: 12px; }
    .doc-item { padding: 4px 0; border-bottom: 1px dotted #e2e8f0; }
    .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">Government of India • JanSetu™ (जनसेतु) Citizen Dossier</span>
      <h1>${journey.title}</h1>
      <div class="meta">Agency: ${journey.agencyCode} | Category: ${journey.category} | Turnaround: ${journey.estimatedDuration}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; font-weight: bold; color: #16a34a;">${progressPct}% Complete</div>
      <div class="meta">Generated: ${new Date().toLocaleDateString("en-IN")}</div>
    </div>
  </div>

  <div class="progress-bar">
    <div class="progress-fill"></div>
  </div>

  <h2>Statutory Milestones & Document Verification Ledger</h2>
  ${journey.steps
    .map(
      (s, idx) => `
    <div class="step-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="step-title">Step ${s.stepNumber || idx + 1}: ${s.title}</span>
        <span class="step-status ${s.status === "COMPLETED" ? "status-completed" : s.status === "IN_PROGRESS" ? "status-progress" : "status-locked"}">${s.status}</span>
      </div>
      <p style="font-size: 12px; color: #475569; margin: 8px 0;">${s.description}</p>
      ${
        s.documentRequirements && s.documentRequirements.length > 0
          ? `
        <div class="doc-list">
          <strong>Required Documents Checklist:</strong>
          ${s.documentRequirements.map((d) => `<div class="doc-item">☐ ${d.name} <em>(${d.isMandatory ? "Mandatory" : "Optional"})</em> - ${d.obtainFrom || "State Portal"}</div>`).join("")}
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("")}

  <div class="footer">
    Verified under National Digital Governance Architecture • JanSetu™ (जनसेतु) Platform Standard v3.0
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JanSetu-Dossier-${journey.journeyId}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Statutory Dossier exported successfully!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Modal Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Export Statutory Citizen Dossier</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Print / PDF Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Generate an official milestone progress report and document verification checklist.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Dossier Preview Body */}
          <div id="printable-dossier-area" ref={printAreaRef} className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible">
            
            {/* Dossier Header Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    {journey.category} • {journey.agencyCode}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {journey.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {journey.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {progressPct}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {completedSteps.length} of {journey.steps.length} Steps Done
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated SLA:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{journey.estimatedDuration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Applicant Ref:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{journey.applicantReference || "KA-2026-99182"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Report Date:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Steps & Milestones Ledger */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Statutory Milestone Checklist
              </h4>

              {journey.steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Step {step.stepNumber || idx + 1}: {step.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        step.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                          : step.status === "IN_PROGRESS"
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    {step.description}
                  </p>

                  {step.documentRequirements && step.documentRequirements.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <span className="font-bold block text-[10px] text-slate-400">Required Documents:</span>
                      {step.documentRequirements.map((d) => (
                        <div key={d.id} className="flex items-center justify-between">
                          <span>• {d.name} {d.isMandatory ? "(Mandatory)" : "(Optional)"}</span>
                          <span className="text-[10px] text-slate-400">{d.obtainFrom}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Official export verified under National e-Governance standards.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadHTML}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Dossier (.HTML)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
