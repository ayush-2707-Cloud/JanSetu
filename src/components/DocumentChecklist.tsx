"use client";

import React, { useRef, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Circle,
  Download,
  Clock,
  MapPin,
  UploadCloud,
  Paperclip,
  Trash2,
  Scan,
  QrCode,
} from "lucide-react";
import { DocumentRequirement, Language } from "@/types/journey";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DocumentOCRScannerModal } from "@/components/DocumentOCRScannerModal";
import { DigitalSignatureVerifierModal } from "@/components/DigitalSignatureVerifierModal";

interface DocumentChecklistProps {
  documents: DocumentRequirement[];
  stepId: string;
  language: Language;
}

interface StagedFileInfo {
  fileName: string;
  fileSize: string;
  stagedAt: string;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  stepId,
  language,
}) => {
  const [checkedDocs, setCheckedDocs] = useLocalStorage<string[]>(
    `doc_checklist_${stepId}`,
    []
  );
  const [stagedFiles, setStagedFiles] = useLocalStorage<Record<string, StagedFileInfo>>(
    `doc_staged_${stepId}`,
    {}
  );
  const [ocrScanningDoc, setOcrScanningDoc] = useState<DocumentRequirement | null>(null);
  const [isSignVerifierOpen, setIsSignVerifierOpen] = useState<boolean>(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!documents || documents.length === 0) return null;

  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setStagedFiles((prev) => ({
      ...prev,
      [docId]: {
        fileName: file.name,
        fileSize: sizeStr,
        stagedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    }));

    // Auto-check doc if not checked
    if (!checkedDocs.includes(docId)) {
      setCheckedDocs((prev) => [...prev, docId]);
    }
  };

  const handleRemoveStagedFile = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStagedFiles((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  const checkedCount = checkedDocs.filter((id) =>
    documents.some((d) => d.id === id)
  ).length;
  const totalMandatory = documents.filter((d) => d.isMandatory).length;
  const progressPercent =
    documents.length > 0
      ? Math.round((checkedCount / documents.length) * 100)
      : 0;

  return (
    <div className="space-y-3">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === "HI"
              ? "आवश्यक दस्तावेज चेकलिस्ट"
              : language === "KN"
              ? "ಅಗತ್ಯ ದಾಖಲೆ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ"
              : "Required Documents Checklist"}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {checkedCount}/{documents.length}
          </span>
          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory count note */}
      {totalMandatory > 0 && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          <span className="text-red-600 dark:text-red-400 font-bold">*</span>{" "}
          {language === "HI"
            ? `${totalMandatory} अनिवार्य दस्तावेज आवश्यक`
            : language === "KN"
            ? `${totalMandatory} ಕಡ್ಡಾಯ ದಾಖಲೆಗಳು ಅಗತ್ಯ`
            : `${totalMandatory} mandatory document${totalMandatory > 1 ? "s" : ""} required`}
        </p>
      )}

      {/* Document List */}
      <div className="space-y-2.5">
        {documents.map((doc) => {
          const isChecked = checkedDocs.includes(doc.id);
          const staged = stagedFiles[doc.id];

          const docName =
            language === "HI" && doc.nameHi
              ? doc.nameHi
              : language === "KN" && doc.nameKn
              ? doc.nameKn
              : doc.name;

          return (
            <div
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleDoc(doc.id);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={isChecked}
              className={`group p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold transition-colors ${
                        isChecked
                          ? "text-emerald-800 dark:text-emerald-300 line-through"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {docName}
                    </span>

                    {doc.isMandatory && (
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded-full">
                        MANDATORY
                      </span>
                    )}

                    {!doc.isMandatory && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-full">
                        OPTIONAL
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {doc.description}
                  </p>

                  {/* Meta info row */}
                  <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                    {doc.format && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-transparent dark:border-slate-700">
                        <FileText className="w-3 h-3" />
                        {doc.format}
                        {doc.maxSize && ` (max ${doc.maxSize})`}
                      </span>
                    )}

                    {doc.obtainFrom && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {doc.obtainFrom}
                      </span>
                    )}

                    {doc.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {doc.estimatedTime}
                      </span>
                    )}
                  </div>

                    {/* Action buttons */}
                    <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[doc.id] = el;
                        }}
                        onChange={(e) => handleFileUpload(doc.id, e)}
                        className="hidden"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {staged ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold"
                        >
                          <Paperclip className="w-3 h-3 text-emerald-600" />
                          <span className="truncate max-w-[180px]">{staged.fileName}</span>
                          <span className="text-[10px] text-emerald-600/80">({staged.fileSize})</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveStagedFile(doc.id, e)}
                            className="hover:text-red-500 p-0.5 rounded cursor-pointer ml-1"
                            title="Remove staged file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRefs.current[doc.id]?.click();
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <UploadCloud className="w-3 h-3 text-blue-500" />
                          <span>Stage File Locally</span>
                        </button>
                      )}

                      {/* OCR & Quality Inspection Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOcrScanningDoc(doc);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all cursor-pointer"
                        title="Inspect file legibility, seal keywords, and expiration validity"
                      >
                        <Scan className="w-3 h-3 text-emerald-600" />
                        <span>Inspect Quality (OCR)</span>
                      </button>

                      {/* Cryptographic Digital Signature / QR Verifier Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSignVerifierOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-[11px] font-bold transition-all cursor-pointer"
                        title="Verify X.509 DSC signature and Controller of Certifying Authorities (CCA) certificate"
                      >
                        <QrCode className="w-3 h-3 text-blue-600" />
                        <span>Verify DSC / QR</span>
                      </button>

                      {doc.sampleUrl && (
                        <a
                          href={doc.sampleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold px-2 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Sample / Template</span>
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pre-Submission OCR Scanner Modal */}
        <DocumentOCRScannerModal
          isOpen={ocrScanningDoc !== null}
          onClose={() => setOcrScanningDoc(null)}
          documentName={ocrScanningDoc?.name || "Required Document"}
          onScanPass={(fileName) => {
            if (ocrScanningDoc) {
              setStagedFiles((prev) => ({
                ...prev,
                [ocrScanningDoc.id]: {
                  fileName,
                  fileSize: "Verified (OCR Pass)",
                  stagedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              }));
              if (!checkedDocs.includes(ocrScanningDoc.id)) {
                setCheckedDocs((prev) => [...prev, ocrScanningDoc.id]);
              }
            }
          }}
        />

        {/* Cryptographic Digital Signature & QR Verifier Modal */}
        <DigitalSignatureVerifierModal
          isOpen={isSignVerifierOpen}
          onClose={() => setIsSignVerifierOpen(false)}
        />

      </div>
    );
  };
