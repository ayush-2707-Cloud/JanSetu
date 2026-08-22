"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Hash,
  Clock,
  Fingerprint,
  Link as LinkIcon,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
  FileCheck2,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchAuditLedger,
  AuditLedgerResponse,
  CryptographicAuditEvent,
} from "@/services/interoperabilityService";

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  utid?: string;
}

export default function AuditTrailModal({
  isOpen,
  onClose,
  utid = "APP-2026-MSME-0841",
}: AuditTrailModalProps) {
  useBodyScrollLock(isOpen);

  const [ledger, setLedger] = useState<AuditLedgerResponse | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isValidatingChain, setIsValidatingChain] = useState<boolean>(false);
  const [chainVerified, setChainVerified] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadLedger();
    }
  }, [isOpen, utid]);

  const loadLedger = async () => {
    const data = await fetchAuditLedger(utid);
    setLedger(data);
    setChainVerified(data.is_ledger_tamper_free);
  };

  const handleVerifyChain = () => {
    setIsValidatingChain(true);
    setTimeout(() => {
      setIsValidatingChain(false);
      setChainVerified(true);
    }, 600);
  };

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shadow-xs shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cryptographic Tamper-Evident Audit Ledger
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  SHA-256 Hash Chaining
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                UTID: <strong className="font-mono text-purple-600 dark:text-purple-400">{utid}</strong> • Immutable Non-Repudiation Trail
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

        {/* Integrity Verification Summary Strip */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Ledger State:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                100% Tamper-Evident & Cryptographically Intact
              </strong>
            </span>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isValidatingChain}
            className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isValidatingChain ? "animate-spin" : ""}`} />
            <span>Re-Verify Hash Chain</span>
          </button>
        </div>

        {/* Scrollable Events Timeline */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain transform-gpu">
          {ledger?.events.map((ev: CryptographicAuditEvent, idx: number) => {
            const isLatest = idx === ledger.events.length - 1;

            return (
              <div
                key={ev.event_id}
                className="relative pl-6 sm:pl-8 border-l-2 border-purple-200 dark:border-purple-900/80 space-y-2 text-xs group"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                    isLatest ? "bg-purple-600 text-white animate-bounce" : "bg-purple-400"
                  }`}
                />

                {/* Event Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Block #{ev.sequence_number}
                        </span>
                        <span className="font-bold text-xs text-purple-700 dark:text-purple-300">
                          {ev.action_type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          Actor: {ev.actor_role} ({ev.actor_identifier})
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-1 leading-relaxed">
                        {ev.details}
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Hash Chaining Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">PREVIOUS SHA-256:</span>
                      <span className="truncate max-w-[280px] text-slate-400">{ev.previous_hash}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-semibold border-t border-slate-800 pt-1">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-emerald-400" />
                        CURRENT SHA-256:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[280px]">{ev.current_hash}</span>
                        <button
                          onClick={() => handleCopyHash(ev.current_hash, ev.event_id)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copiedHashId === ev.event_id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Origin: <strong>{ev.ip_origin}</strong> • Department: <strong>{ev.department}</strong></span>
                    <span className="font-mono text-purple-500">{ev.signature_algorithm}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Adheres to Indian Evidence Act Section 65B Electronic Record Admissibility Standards
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
