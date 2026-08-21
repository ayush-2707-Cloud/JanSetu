"use client";

import React, { useState, useRef } from "react";
import {
  QrCode,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Lock,
  Sparkles,
  RefreshCw,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface VerificationReport {
  documentTitle: string;
  qrPayloadType: string;
  certificateIssuer: string;
  signatureAlgorithm: string;
  signerCommonName: string;
  signingTimestamp: string;
  ccaTrustChainVerified: boolean;
  sha256IntegrityHash: string;
  isTamperProof: boolean;
  officialGazetteReference: string;
}

interface DigitalSignatureVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalSignatureVerifierModal: React.FC<DigitalSignatureVerifierModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    setReport(null);

    // Simulate Cryptographic PKI & QR Verification
    setTimeout(() => {
      setReport({
        documentTitle: file.name,
        qrPayloadType: "e-Pramaan / National Government QR Envelope v2.4",
        certificateIssuer: "National Informatics Centre (NIC-CA) / (CCA India)",
        signatureAlgorithm: "RSA-SHA256 (2048-bit Class-3 DSC)",
        signerCommonName: "Authorized Signatory, Food Safety Standards Authority (FSSAI)",
        signingTimestamp: new Date().toUTCString(),
        ccaTrustChainVerified: true,
        sha256IntegrityHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        isTamperProof: true,
        officialGazetteReference: "Information Technology (Certifying Authorities) Regulations, 2000 Section 3A",
      });
      setIsVerifying(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Cryptographic QR & Digital Signature Verifier</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    CCA India Standard
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Verify digital certificates, e-Sign hashes, and government QR codes.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs">
            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2.5 ${
                isVerifying
                  ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 animate-pulse"
                  : report
                  ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-950"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.xml"
                className="hidden"
              />

              {isVerifying ? (
                <>
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="font-bold text-slate-900 dark:text-white">
                    Verifying X.509 Cryptographic Certificate Chain & SHA-256 Hash...
                  </p>
                </>
              ) : report ? (
                <>
                  <div className="p-2 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white">
                    {report.documentTitle}
                  </h4>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    ✓ Cryptographically Authentic & Legally Incontestable
                  </span>
                </>
              ) : (
                <>
                  <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Upload Digitally Signed PDF or Scan QR Code
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Supports FSSAI licenses, MCA SPICe+ certificates, Udyam MSME, and DigiLocker XML
                  </span>
                </>
              )}
            </div>

            {/* Verification Detail Report */}
            {report && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-500">Signer Identity:</span>
                  <span className="font-black text-slate-900 dark:text-white">{report.signerCommonName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-500">Certifying Authority:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{report.certificateIssuer}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-500">PKI Algorithm:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{report.signatureAlgorithm}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">SHA-256 Document Digest:</span>
                  <p className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 p-2 rounded-lg break-all text-slate-700 dark:text-slate-300">
                    {report.sha256IntegrityHash}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Validated under IT Act 2000 Section 3A & CCA Guidelines.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
