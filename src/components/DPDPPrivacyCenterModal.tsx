"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  exportCitizenDossier,
  purgeCitizenSession,
  CitizenDossierExport,
  ErasureCertificate,
} from "@/services/tier3Service";

interface DPDPPrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  utid?: string;
}

export default function DPDPPrivacyCenterModal({
  isOpen,
  onClose,
  utid = "UTID-MH-2026-094182",
}: DPDPPrivacyCenterModalProps) {
  useBodyScrollLock(isOpen);

  const [dossier, setDossier] = useState<CitizenDossierExport | null>(null);
  const [erasureCert, setErasureCert] = useState<ErasureCertificate | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadDossier = async () => {
    setIsExporting(true);
    try {
      const data = await exportCitizenDossier(utid);
      setDossier(data);

      // Trigger client JSON download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `JanSetu-Citizen-Dossier-${utid}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePurgeData = async () => {
    if (!confirm("Are you sure you want to exercise your Right-to-be-Forgotten? This will permanently purge cached session data under DPDP Act 2023 Section 12.")) {
      return;
    }
    setIsPurging(true);
    try {
      const cert = await purgeCitizenSession(utid);
      setErasureCert(cert);
    } catch (e) {
      console.error("Purge error:", e);
    } finally {
      setIsPurging(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  DPDP 2025 Data Portability & Privacy Vault
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  DPDP Act 2023 Sec 12 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download Portable Citizen Data Dossier • Exercise Right-to-be-Forgotten with SHA-256 Erasure Certificate
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain transform-gpu text-xs">
          {/* Section 1: Two Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card A: Data Portability Export */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Download className="w-4 h-4" />
                  <h3 className="text-sm text-slate-900 dark:text-white font-bold">
                    1. Portable Data Dossier Export
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export all personal details, active applications, and digital consent tokens across
                  all departments in an open standard JSON format (IndEA 2.0 DRM).
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDossier}
                disabled={isExporting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download Portable Dossier (JSON)</span>
              </button>
            </div>

            {/* Card B: Right to be Forgotten Erasure */}
            <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                  <Trash2 className="w-4 h-4" />
                  <h3 className="text-sm text-rose-950 dark:text-rose-200 font-bold">
                    2. Right to be Forgotten (Statutory Purge)
                  </h3>
                </div>
                <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed">
                  Under DPDP Act 2023 Section 12(3), you can revoke all department consents and purge
                  in-memory cached session attributes. You will receive a SHA-256 signed erasure receipt.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePurgeData}
                disabled={isPurging}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isPurging ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Revoke Consents & Purge Data</span>
              </button>
            </div>
          </div>

          {/* Erasure Certificate Display */}
          {erasureCert && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <strong className="text-xs text-emerald-300 font-bold">
                    Official Statutory Data Erasure Certificate
                  </strong>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {erasureCert.certificate_id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                <div>Data Principal: <strong className="text-white">{erasureCert.data_principal_name}</strong></div>
                <div>Status: <strong className="text-emerald-400">{erasureCert.status}</strong></div>
                <div>Purged Elements: <strong>{erasureCert.purged_records_count} cached data nodes</strong></div>
                <div>Legal Clause: <strong>{erasureCert.legal_clause}</strong></div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <div className="truncate pr-2 text-slate-400">
                  SHA-256 Hash: <span className="text-indigo-300">{erasureCert.sha256_verification_hash}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyHash(erasureCert.sha256_verification_hash)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Digital Personal Data Protection (DPDP) Rules 2025 Standard
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Privacy Center
          </button>
        </div>
      </div>
    </div>
  );
}
