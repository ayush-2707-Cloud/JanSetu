"use client";

import React from "react";
import { ShieldCheck, Lock, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { translations } from "@/data/translations";

export const DPDPConsentModal: React.FC = () => {
  const {
    isConsentModalOpen,
    consentDocType,
    consentPurpose,
    cancelConsent,
    grantConsent,
    language,
  } = useJourney();

  // Universal background scroll lock
  useBodyScrollLock(isConsentModalOpen);

  if (!isConsentModalOpen) return null;


  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={cancelConsent}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-slate-200 dark:border-slate-800 transform transition-all animate-in zoom-in-95">
        
        {/* DPDP Header */}
        <div className="bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={cancelConsent}
            aria-label="Close DPDP modal"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP Act 2023 Statutory Consent</span>
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-100 leading-tight">
            {t.dpdpModalTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.dpdpModalSub}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
          
          {/* Statutory Disclosure Box */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-[10px]">
                    {t.dpdpDocLabel}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {consentDocType || "Aadhaar Identity & DigiLocker Records"}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-[10px]">
                    {t.dpdpPurposeLabel}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {consentPurpose || "Statutory business entity & citizen eligibility verification for municipal portal."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Retention & Privacy Policy Guarantee */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-950 dark:text-emerald-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {t.dpdpRetentionNote}
            </p>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={cancelConsent}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
          >
            {t.cancelConsentBtn}
          </button>

          <button
            onClick={grantConsent}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.grantConsentBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
