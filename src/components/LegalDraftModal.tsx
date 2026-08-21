"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  X,
  Copy,
  Check,
  Printer,
  Download,
  ShieldCheck,
  Sparkles,
  Scale,
  Building2,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { LegalDraftTemplate } from "@/types/journey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface LegalDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: LegalDraftTemplate | null;
  onTriggerDigiLockerSign?: (docTitle: string) => void;
}

export const LegalDraftModal: React.FC<LegalDraftModalProps> = ({
  isOpen,
  onClose,
  template,
  onTriggerDigiLockerSign,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const [copied, setCopied] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  // Initialize form fields when template changes
  React.useEffect(() => {
    if (template) {
      setFormFields(template.defaultFields || {});
    }
  }, [template]);

  // Compute live interpolated draft text
  const renderedText = useMemo(() => {
    if (!template) return "";
    let text = template.boilerplateText;
    for (const [key, value] of Object.entries(formFields)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      text = text.replace(regex, value || `[${key.toUpperCase()}]`);
    }
    return text;
  }, [template, formFields]);

  if (!isOpen || !template) return null;

  const handleFieldChange = (key: string, val: string) => {
    setFormFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([renderedText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.id}-legal-draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${template.title} — Official Legal Draft</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; }
            h1 { text-align: center; font-size: 18pt; text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .meta { font-size: 10pt; color: #666; margin-bottom: 25px; text-align: center; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 11pt; }
            .estamp { border: 2px dashed #888; padding: 15px; text-align: center; font-weight: bold; margin-bottom: 25px; }
          </style>
        </head>
        <body>
          <div class="estamp">NON-JUDICIAL e-STAMP PAPER VALUE: ${template.eStampValue || "₹200"}</div>
          <h1>${template.title}</h1>
          <div class="meta">${template.statutoryAct || "Statutory Legal Format"}</div>
          <pre>${renderedText}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-700/50">
                  {template.category}
                </span>
                {template.eStampValue && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    e-Stamp: {template.eStampValue}
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Auto-Interpolated Boilerplate
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {template.title}
              </h2>
              {template.statutoryAct && (
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Reference: {template.statutoryAct}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Form & Live Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Parameters (4 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-400" />
              Customize Agreement Parties
            </div>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {Object.keys(formFields).map((fieldKey) => {
                const label = fieldKey
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")
                  .toUpperCase();
                return (
                  <div key={fieldKey} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formFields[fieldKey]}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Statutory Compliance Notice */}
            <div className="p-3.5 bg-blue-950/40 border border-blue-800/50 rounded-2xl text-xs text-blue-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Statutory Execution Guidelines:
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Print on official Non-Judicial e-Stamp paper ({template.eStampValue || "₹200"}), execute before a Notary Public / Oath Commissioner, and upload the signed PDF to the designated statutory portal.
              </p>
            </div>
          </div>

          {/* Right Column: Live Formatted Draft (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                Live Draft Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {renderedText.split("\n").length} Clauses
              </span>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] shadow-inner selection:bg-blue-600 selection:text-white">
              {renderedText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copied
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Clause!" : "Copy Text"}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download (.txt)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onTriggerDigiLockerSign && (
              <button
                onClick={() => {
                  onClose();
                  onTriggerDigiLockerSign(template.title);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>E-Sign via DigiLocker</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
