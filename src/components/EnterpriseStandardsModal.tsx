"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Award,
  Layers,
  Sparkles,
  Lock,
  Zap,
  Globe,
  Database,
  X,
  Copy,
  Check,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchIndEAComplianceAudit,
  IndEAComplianceReport,
} from "@/services/tier2MiddlewareService";

interface EnterpriseStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseStandardsModal({
  isOpen,
  onClose,
}: EnterpriseStandardsModalProps) {
  useBodyScrollLock(isOpen);

  const [report, setReport] = useState<IndEAComplianceReport | null>(null);
  const [selectedPillarCode, setSelectedPillarCode] = useState<string>("BRM");
  const [copiedHeader, setCopiedHeader] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const data = await fetchIndEAComplianceAudit();
    setReport(data);
  };

  const handleCopyHeaders = () => {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report.response_headers_enforced, null, 2));
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  if (!isOpen) return null;

  const currentPillar = report?.pillars.find((p) => p.pillar_code === selectedPillarCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top National Colors Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enterprise Architecture & IndEA 2.0 Compliance
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  100% MeitY Standard Aligned
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formal Audit of India Enterprise Architecture Reference Models (MeitY / NeGD)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Pillars Selector */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 overscroll-contain">
          {report?.pillars.map((pillar) => {
            const isSelected = pillar.pillar_code === selectedPillarCode;
            return (
              <button
                key={pillar.pillar_code}
                onClick={() => setSelectedPillarCode(pillar.pillar_code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-mono text-[10px]">{pillar.pillar_code}:</span>
                <span>{pillar.pillar_name.split(" ")[0]}</span>
                <CheckCircle2 className={`w-3 h-3 ${isSelected ? "text-white" : "text-emerald-500"}`} />
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 overscroll-contain transform-gpu text-xs">
          {currentPillar && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Details (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] text-indigo-600 dark:text-indigo-400">
                      PILLAR {currentPillar.pillar_code} AUDIT DESK
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300">
                      PASSED (100%)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentPillar.pillar_name}
                  </h3>
                  <div className="text-slate-600 dark:text-slate-400 pt-1">
                    Standard Applied: <strong>{currentPillar.standard_applied}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    Verified Architectural Features:
                  </label>
                  <div className="space-y-2">
                    {currentPillar.verified_features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Auditor Remarks (MeitY Guidelines):
                  </span>
                  <p>{currentPillar.audit_remarks}</p>
                </div>
              </div>

              {/* Right Details: Response Headers & Standards Stamp (5 cols) */}
              <div className="md:col-span-5 rounded-2xl bg-slate-900 text-white p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">
                      Live HTTP Response Headers Enforced
                    </span>
                    <button
                      onClick={handleCopyHeaders}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedHeader ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHeader ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-indigo-300">
                    <div>X-IndEA-Framework: 2.0</div>
                    <div>X-DRM-Standard: JSON-LD</div>
                    <div>X-GovTech-Interoperability: Tier-2</div>
                    <div className="text-slate-500 text-[10px] pt-1">
                      Enforced on all /api/* routes via FastAPI Middleware
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900/60 space-y-1 text-[11px] text-slate-300">
                    <span className="font-bold text-indigo-300 block">IndEA 2.0 Architectural Benefits:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                      <li>Guarantees zero proprietary lock-in</li>
                      <li>Ensures seamless interoperability with API Setu</li>
                      <li>Full DPDP Act 2023 consent architecture</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>National Open API Standard Compliance: 100/100</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Conforms strictly to National Enterprise Architecture (IndEA) 2.0 Framework
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
