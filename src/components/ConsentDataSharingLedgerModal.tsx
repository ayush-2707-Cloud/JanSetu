"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  X,
  Trash2,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Database,
  Building2,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { fetchConsentLedger, revokeDepartmentConsent, ConsentItem } from "@/services/tier4Service";

interface ConsentDataSharingLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  utid?: string;
}

export default function ConsentDataSharingLedgerModal({
  isOpen,
  onClose,
  utid = "UTID-MH-2026-094182",
}: ConsentDataSharingLedgerModalProps) {
  useBodyScrollLock(isOpen);

  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revocationSuccessMsg, setRevocationSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConsents();
    }
  }, [isOpen]);

  const loadConsents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchConsentLedger(utid);
      setConsents(data);
    } catch (e) {
      console.warn("Failed to load consents:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (consentId: string, departmentName: string) => {
    if (!confirm(`Are you sure you want to revoke data sharing consent for ${departmentName}? Under DPDP Act 2023 Sec 6(4), this will immediately stop further automated data fetching.`)) {
      return;
    }

    setRevokingId(consentId);
    try {
      const res = await revokeDepartmentConsent(consentId, "Citizen initiated statutory revocation via Consent Ledger.");
      setConsents((prev) =>
        prev.map((c) => (c.consent_id === consentId ? { ...c, status: "REVOKED" } : c))
      );
      setRevocationSuccessMsg(res.message);
      setTimeout(() => setRevocationSuccessMsg(null), 4000);
    } catch (e) {
      console.error("Revoke error:", e);
    } finally {
      setRevokingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Consent-Based Data Sharing Ledger
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  DPDP Act 2023 Section 6 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Audit Trail of Inter-Departmental Data Exchanges • Granular 1-Click Revocation
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain transform-gpu text-xs">
          {/* Data Flow Concept Visual */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Federated Data Flow Topology (Once-Only Principle)
            </span>
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 text-center text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 min-w-[120px]">
                <UserCheck className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                <strong className="text-white block">Data Principal</strong>
                <span className="text-[9px] text-slate-400">Citizen Profile</span>
              </div>

              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />

              <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-800 min-w-[140px]">
                <ShieldCheck className="w-4 h-4 mx-auto text-indigo-400 mb-1" />
                <strong className="text-indigo-300 block">Consent Gateway</strong>
                <span className="text-[9px] text-indigo-400">Granular Scopes</span>
              </div>

              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />

              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 min-w-[130px]">
                <Building2 className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <strong className="text-white block">Central / State / Local</strong>
                <span className="text-[9px] text-slate-400">FSSAI • BMC • Land</span>
              </div>
            </div>
          </div>

          {/* Revocation Success Toast Banner */}
          {revocationSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold">{revocationSuccessMsg}</span>
            </div>
          )}

          {/* Consents Table / Card List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Active Departmental Consent Grants ({consents.length}):
            </h3>

            {isLoading ? (
              <div className="py-8 text-center text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-500 mb-1" />
                <span>Loading cryptographic consent ledger...</span>
              </div>
            ) : (
              consents.map((item) => {
                const isRevoked = item.status === "REVOKED";
                return (
                  <div
                    key={item.consent_id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isRevoked
                        ? "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                          {item.consent_id}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <strong className="text-xs text-slate-800 dark:text-slate-200">
                          {item.department_name}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isRevoked
                              ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300"
                              : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-300"
                          }`}
                        >
                          {item.status}
                        </span>

                        {!isRevoked && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(item.consent_id, item.department_name)}
                            disabled={revokingId === item.consent_id}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {revokingId === item.consent_id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            <span>Revoke</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong>Purpose:</strong> {item.purpose}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <strong className="text-[10px] text-slate-400 uppercase">Data Scope:</strong>
                        {item.data_elements_shared.map((elem) => (
                          <span
                            key={elem}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            {elem}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>Legal Basis: {item.legal_basis}</span>
                      <span>Access Count: {item.total_data_access_count} queries</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Conforms to MeitY India Data Accessibility & Consent Framework
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
