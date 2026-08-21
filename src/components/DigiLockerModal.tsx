"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, CheckCircle2, RefreshCw, X, FileCheck, Smartphone } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { translations } from "@/data/translations";

export const DigiLockerModal: React.FC = () => {
  const {
    isDigiLockerModalOpen,
    closeDigiLockerModal,
    digiLockerStepId,
    completeDigiLockerVerification,
    activeJourney,
    language,
  } = useJourney();

  // Universal background scroll lock
  useBodyScrollLock(isDigiLockerModalOpen);

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isDigiLockerModalOpen || !digiLockerStepId) return null;


  const t = translations[language];
  const step = activeJourney.steps.find((s) => s.id === digiLockerStepId);
  const docType = step?.instructions.digiLockerDocType || "GOVT_RECORD";

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        completeDigiLockerVerification(digiLockerStepId);
        setIsSuccess(false);
        setOtpSent(false);
        setOtpCode("");
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={closeDigiLockerModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden z-10 border border-slate-200 dark:border-slate-800 transform transition-all animate-in zoom-in-95">
        
        {/* DigiLocker Official Blue Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={closeDigiLockerModal}
            aria-label="Close DigiLocker modal"
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white text-blue-900 rounded-xl shadow-md font-black text-xs flex items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>DigiLocker</span>
            </div>
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded">
              Government Verified
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-white leading-tight">
            {t.digiLockerModalTitle}
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            {t.digiLockerModalSub}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">

          {/* Requested Document Badge */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">Target Document</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {step?.title || "National Identity & Certificate"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Type: {docType}</span>
            </div>
          </div>

          {!otpSent && !isSuccess && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Aadhaar Linked Mobile Authentication</p>
                <p>An OTP will be dispatched to your Aadhaar-registered mobile number ending in •••• 8849.</p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl text-[11px] text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>256-bit SSL Encrypted & MeitY SAIF Compliant</span>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Request Authentication OTP</span>
              </button>
            </div>
          )}

          {otpSent && !isSuccess && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Enter 6-Digit Verification OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="8 8 4 9 2 0"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 px-3 text-center text-lg font-black tracking-widest text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block text-center">Demo OTP: Enter any numbers e.g. 123456</span>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpCode.length < 4}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Fetching DigiLocker Cryptographic Proof...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Verify Document</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isSuccess && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                DigiLocker Verification Complete!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Digital Certificate successfully fetched and attached to Step {step?.stepNumber}.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
          Powered by National DigiLocker API • Ministry of Electronics & IT (MeitY)
        </div>

      </div>
    </div>
  );
};
