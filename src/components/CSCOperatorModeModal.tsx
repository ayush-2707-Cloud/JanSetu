"use client";

import React, { useState } from "react";
import {
  Users,
  Printer,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Building,
  CreditCard,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface CSCOperatorModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RuralProfile {
  id: string;
  name: string;
  pan: string;
  aadhaarToken: string;
  service: string;
  village: string;
  district: string;
  status: string;
}

const RURAL_PROFILES: RuralProfile[] = [
  {
    id: "CITIZEN-MH-RURAL-01",
    name: "Ramesh Tukaram Kumar",
    pan: "ABCDE1234K",
    aadhaarToken: "TOK-UID-44102-VAULT",
    service: "Farmer Capital Subsidy & Solar Pump Clearance",
    village: "Baramati",
    district: "Pune",
    status: "DOCUMENT_UPLOAD_STAGE",
  },
  {
    id: "CITIZEN-MH-RURAL-02",
    name: "Sunita Devi Patil",
    pan: "FGHIJ5678L",
    aadhaarToken: "TOK-UID-99124-VAULT",
    service: "Pradhan Mantri Mudra Micro Enterprise Loan",
    village: "Shirur",
    district: "Pune",
    status: "SCRUTINY_PENDING",
  },
  {
    id: "CITIZEN-MH-RURAL-03",
    name: "Anil Babanrao Shinde",
    pan: "KLMNO9012M",
    aadhaarToken: "TOK-UID-77189-VAULT",
    service: "Maharashtra Shop Act & Trade Registration (Gumastha)",
    village: "Daund",
    district: "Pune",
    status: "READY_FOR_PAYMENT",
  },
];

export default function CSCOperatorModeModal({
  isOpen,
  onClose,
}: CSCOperatorModeModalProps) {
  useBodyScrollLock(isOpen);

  const [selectedProfile, setSelectedProfile] = useState<RuralProfile>(RURAL_PROFILES[0]);
  const [batchUploaded, setBatchUploaded] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-xs shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  CSC / VLE Operator Mode (Rural Assisted Delivery)
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Kiosk: VLE-MH-PUNE-8492
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Village Level Entrepreneur Kiosk Interface • Rapid Profile Switching & Batch Certification Uploads
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

        {/* Citizen Quick-Switcher Tabs */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 overscroll-contain">
          {RURAL_PROFILES.map((p) => {
            const isSelected = p.id === selectedProfile.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedProfile(p);
                  setShowReceipt(false);
                  setBatchUploaded(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{p.name.split(" ")[0]} ({p.village})</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain transform-gpu text-xs">
          {!showReceipt ? (
            <>
              {/* Selected Profile Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                      Active Rural Beneficiary
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedProfile.name}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                    {selectedProfile.village}, {selectedProfile.district}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div>PAN: <strong className="text-slate-900 dark:text-white">{selectedProfile.pan}</strong></div>
                  <div>Aadhaar Vault: <strong className="text-indigo-600 dark:text-indigo-400">VERIFIED</strong></div>
                  <div className="col-span-2">Target Service: <strong className="text-slate-900 dark:text-white">{selectedProfile.service}</strong></div>
                </div>
              </div>

              {/* Batch Document Uploader */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Batch Certificate OCR & Pre-Flight Uploader:
                </label>

                {!batchUploaded ? (
                  <div
                    onClick={() => setBatchUploaded(true)}
                    className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded-3xl text-center space-y-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <UploadCloud className="w-10 h-10 text-amber-500 mx-auto" />
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Click to Batch-Scan 7/12 Land Extract, Income Certificate & Bank Passbook
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Simulates high-speed OCR extraction and auto-attachment to all milestone nodes
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>3 Documents OCR Verified & Attached to Scheme Dossier (100% Quality Score)</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                      ✓ 7/12 Extract: Khasra 142/2A • ✓ Income Proof: ₹85,000/yr • ✓ Bank: Bank of Maharashtra IFSC MAHB0001
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Official Receipt Button */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate Official VLE Receipt</span>
                </button>
              </div>
            </>
          ) : (
            /* Official Printable Receipt */
            <div className="p-6 bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-md space-y-4 max-w-lg mx-auto font-sans animate-in fade-in">
              <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center mx-auto text-sm">
                  🇮🇳
                </div>
                <h4 className="font-black text-sm uppercase tracking-wide">
                  Government of Maharashtra • Common Service Center (CSC)
                </h4>
                <p className="text-[10px] text-slate-600">Aaple Sarkar / JanSetu Universal Service Delivery Kiosk</p>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between"><span>Receipt ID:</span><strong>CSC-2026-RCP-98412</strong></div>
                <div className="flex justify-between"><span>VLE Kiosk ID:</span><strong>VLE-MH-PUNE-8492</strong></div>
                <div className="flex justify-between"><span>Beneficiary:</span><strong>{selectedProfile.name}</strong></div>
                <div className="flex justify-between"><span>Village / District:</span><strong>{selectedProfile.village}, {selectedProfile.district}</strong></div>
                <div className="flex justify-between"><span>Service:</span><strong className="text-right truncate max-w-[200px]">{selectedProfile.service}</strong></div>
                <div className="flex justify-between border-t border-slate-300 pt-1 font-bold">
                  <span>Prescribed Govt Fee:</span><strong>₹30.00</strong>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 text-center border-t border-slate-200 pt-2">
                This is a legally valid transaction receipt issued under Maharashtra RTSA 2015.
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowReceipt(false)}
                  className="text-xs text-slate-600 hover:underline cursor-pointer"
                >
                  ← Back to Operator
                </button>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Assisted Digital Delivery Model for 500,000+ Rural Gram Panchayat VLE Centers
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Operator Mode
          </button>
        </div>
      </div>
    </div>
  );
}
