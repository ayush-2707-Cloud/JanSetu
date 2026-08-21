"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Database,
  UploadCloud,
  Scale,
  Download,
  Play,
  HelpCircle,
  PhoneCall,
} from "lucide-react";
import {
  JourneyStep,
  SubStepItem,
  StepStatus,
  DocumentVerificationStatus,
  LegalDraftTemplate,
} from "@/types/journey";
import { useJourney } from "@/context/JourneyContext";
import { LegalDraftModal } from "@/components/LegalDraftModal";

interface SubStepMilestoneCardProps {
  step: JourneyStep;
  journeyId: string;
  isExpandedDefault?: boolean;
  onCompleteSubStep?: (stepId: string, substepId: string) => void;
  onOpenDigiLocker?: (stepId: string) => void;
}

export const SubStepMilestoneCard: React.FC<SubStepMilestoneCardProps> = ({
  step,
  journeyId,
  isExpandedDefault = false,
  onCompleteSubStep,
  onOpenDigiLocker,
}) => {
  const { language, openDigiLockerModal, openStepDrawer, executeCopilotAction } = useJourney();
  const [isExpanded, setIsExpanded] = useState<boolean>(
    isExpandedDefault || step.status === "IN_PROGRESS"
  );
  const [activeDraftTemplate, setActiveDraftTemplate] = useState<LegalDraftTemplate | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);

  // Derive substeps or fallback
  const substeps: SubStepItem[] = React.useMemo(() => {
    if (step.substeps && step.substeps.length > 0) {
      return step.substeps;
    }
    if (step.sub_steps && step.sub_steps.length > 0) {
      return step.sub_steps;
    }

    const defaultSubsteps: SubStepItem[] = [
      {
        id: `${step.id}-sub-1`,
        substepNumber: 1,
        title: "Identity & Prerequisite Document Verification",
        description: "Verify mandatory identity documents and applicant eligibility records via DigiLocker / API Setu.",
        guidance: "Ensure your Aadhaar & PAN details match applicant records.",
        isMandatory: true,
        status: step.status === "COMPLETED" ? "COMPLETED" : step.status === "IN_PROGRESS" ? "IN_PROGRESS" : "LOCKED",
        estimatedDuration: "Instant (5 Mins)",
        requiredDocuments: step.documentRequirements?.map((doc, idx) => ({
          id: doc.id || `doc-${idx}`,
          title: doc.name,
          description: doc.description,
          isMandatory: doc.isMandatory,
          status: (step.status === "COMPLETED"
            ? "VERIFIED_DIGILOCKER"
            : idx === 0
            ? "VERIFIED_DIGILOCKER"
            : "REQUIRES_UPLOAD") as DocumentVerificationStatus,
          templateUrl: doc.sampleUrl,
          issuingAuthority: doc.obtainFrom,
          verificationMethod: "DIGILOCKER",
        })) || [
          {
            id: `doc-${step.id}-id`,
            title: "Applicant Government Identity (Aadhaar / PAN)",
            description: "Digitally signed identity record",
            isMandatory: true,
            status: (step.status === "COMPLETED" ? "VERIFIED_DIGILOCKER" : "REQUIRES_UPLOAD") as DocumentVerificationStatus,
            verificationMethod: "DIGILOCKER",
          },
        ],
      },
      {
        id: `${step.id}-sub-2`,
        substepNumber: 2,
        title: `Submit Application on Official Portal`,
        description: step.instructions?.summary || step.description,
        guidance: step.instructions?.summary || "Fill out the online application form and attach necessary blueprints.",
        isMandatory: true,
        status: step.status === "COMPLETED" ? "COMPLETED" : "LOCKED",
        officialPortalUrl: step.instructions?.actionUrl || step.officialLinks?.[0]?.url,
        statutoryFormCode: step.legalReferences?.[0] || "FORM-STATUTORY-01",
        estimatedDuration: step.estimatedDays || "1-3 Business Days",
      },
      {
        id: `${step.id}-sub-3`,
        substepNumber: 3,
        title: "Statutory Scrutiny & Digital Certificate Issuance",
        description: "Pay prescribed statutory fee and download digitally signed QR-coded government clearance certificate.",
        guidance: "Download digitally signed certificate upon approval.",
        isMandatory: true,
        status: step.status === "COMPLETED" ? "COMPLETED" : "LOCKED",
        estimatedDuration: "2-5 Business Days",
      },
    ];

    return defaultSubsteps;
  }, [step]);

  // Substep completion calculations
  const mandatorySubsteps = substeps.filter((s) => s.isMandatory !== false && s.is_mandatory !== false);
  const completedSubsteps = substeps.filter((s) => s.status === "COMPLETED");
  const progressPercentage =
    mandatorySubsteps.length > 0
      ? Math.round((completedSubsteps.length / mandatorySubsteps.length) * 100)
      : step.status === "COMPLETED"
      ? 100
      : 0;

  const defaultLegalDraft: LegalDraftTemplate = useMemo(() => {
    if (step.legalDrafts && step.legalDrafts.length > 0) {
      return step.legalDrafts[0];
    }
    return {
      id: `draft-${step.id}`,
      title: `${step.title} — Statutory Legal Agreement / NOC Draft`,
      category: step.category || "Statutory Compliance",
      description: "Standardized legally sound boilerplate agreement template.",
      statutoryAct: step.legalReferences?.[0] || "Statutory Rules & Regulations",
      eStampValue: "₹200 (Non-Judicial e-Stamp)",
      defaultFields: {
        citizenName: "Rahul Sharma",
        fatherOrHusbandName: "Rajesh Sharma",
        enterpriseName: "Namma Ventures LLP",
        registeredAddress: "#42, 100ft Ring Road, Indiranagar, Bengaluru - 560038",
        state: "Karnataka",
        authorizedRepresentative: "Rahul Sharma (Managing Partner)",
      },
      boilerplateText: `STATUTORY LEGAL DRAFT & UNDERTAKING

I, {{citizenName}}, residing at {{registeredAddress}}, on behalf of {{enterpriseName}}, do hereby declare that all applications and declarations submitted for ${step.title} are compliant with ${
        step.legalReferences?.[0] || "statutory provisions"
      }.

DEPONENT: {{citizenName}}
For: {{enterpriseName}}`,
    };
  }, [step]);

  const handleOpenDraft = (draft?: LegalDraftTemplate) => {
    setActiveDraftTemplate(draft || defaultLegalDraft);
    setIsDraftModalOpen(true);
  };

  const primaryOfficialPortalUrl =
    step.instructions?.actionUrl ||
    step.officialLinks?.find((l) => l.isGovernment)?.url ||
    step.officialLinks?.[0]?.url;

  return (
    <>
      <div
        className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
          step.status === "COMPLETED"
            ? "bg-white dark:bg-slate-900/95 border-emerald-500/40 dark:border-emerald-500/30"
            : step.status === "IN_PROGRESS"
            ? "bg-white dark:bg-slate-900/95 border-blue-500/60 dark:border-blue-500/40 ring-2 ring-blue-500/20 shadow-blue-500/5"
            : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-90"
        }`}
      >
        {/* Milestone Header Banner */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              {/* Step Status Badge Circle */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border transition-all ${
                  step.status === "COMPLETED"
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20"
                    : step.status === "IN_PROGRESS"
                    ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 animate-pulse"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                }`}
              >
                {step.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === "IN_PROGRESS" ? (
                  <span>{step.stepNumber}</span>
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {step.status === "IN_PROGRESS" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping inline-block" />
                      ACTIVE STEP: {step.title}
                    </span>
                  ) : step.status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}

                  {/* Percentage Progress Badge */}
                  <span
                    className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                      progressPercentage === 100
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300"
                    }`}
                  >
                    [ {progressPercentage}% Complete ]
                  </span>

                  <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                    {step.category}
                  </span>

                  {step.estimatedDays && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      SLA: {step.estimatedDays}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Accordion Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-300 transition-all shrink-0"
              title={isExpanded ? "Collapse Sub-Steps" : "Expand Sub-Steps"}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Sub-Step Completion Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Sub-Step Progress: {completedSubsteps.length} / {substeps.length} Completed
                </span>
                <span
                  className={`text-[11px] font-mono ${
                    progressPercentage === 100
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercentage === 100
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Direct Official Link & Draft Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenDraft()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105"
                title="Generate Legal Draft"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Legal Draft</span>
              </button>

              {primaryOfficialPortalUrl && (
                <a
                  href={primaryOfficialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 hover:scale-105"
                  title="Visit Official Government Portal"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Accordion: ASCII Hierarchy Structure */}
        {isExpanded && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 sm:p-6 space-y-6 animate-fadeIn">
            {/* Sub-Steps Checklist (ASCII Tree Structure) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Procedural Sub-Steps Checklist ({substeps.length}):
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  State Machine Clearance
                </span>
              </div>

              <div className="space-y-3">
                {substeps.map((substep, index) => {
                  const isSubCompleted = substep.status === "COMPLETED";
                  const isSubInProgress = substep.status === "IN_PROGRESS";
                  const isSubLocked = substep.status === "LOCKED";
                  const subOrdinal = substep.substepNumber || index + 1;
                  const guidanceText = substep.guidance || substep.description;

                  return (
                    <div
                      key={substep.id || substep.sub_step_id || `sub-${index}`}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSubCompleted
                          ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-xs"
                          : isSubInProgress
                          ? "bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-600/80 shadow-md ring-1 ring-blue-500/20"
                          : "bg-slate-100/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/80 opacity-75"
                      }`}
                    >
                      {/* Sub-step Title Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Prefix Marker: [✓], [►], or [🔒] */}
                          <span
                            className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg shrink-0 ${
                              isSubCompleted
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                                : isSubInProgress
                                ? "bg-blue-600 text-white shadow-xs animate-pulse"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {isSubCompleted ? "[✓]" : isSubInProgress ? "[►]" : "[🔒]"}
                          </span>

                          <span
                            className={`text-xs font-extrabold ${
                              isSubCompleted
                                ? "text-emerald-800 dark:text-emerald-300 line-through opacity-85"
                                : isSubInProgress
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {subOrdinal}. {substep.title}
                          </span>

                          {substep.statutoryFormCode && (
                            <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {substep.statutoryFormCode}
                            </span>
                          )}

                          {isSubLocked && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              (Unlocks after step {Math.max(1, subOrdinal - 1)})
                            </span>
                          )}
                        </div>

                        {/* Top-Right Action: Open Step Help & Instructions Drawer */}
                        {isSubInProgress && (
                          <button
                            type="button"
                            onClick={() => openStepDrawer(step.id)}
                            className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                            title="Open Step Instructions & Complete Milestone in Help Drawer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Step Guide & Complete</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Active Sub-Step Tree Guidance & Action Block */}
                      {isSubInProgress && (
                        <div className="mt-3 pl-4 border-l-2 border-blue-400 dark:border-blue-600 space-y-2 text-xs">
                          {/* Guidance Line */}
                          {guidanceText && (
                            <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 bg-blue-50/60 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                ├── Guidance:
                              </span>
                              <span className="leading-relaxed">{guidanceText}</span>
                            </div>
                          )}

                          {/* Action Row */}
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
                              └── Action:
                            </span>

                            {/* Upload / Verification Action */}
                            <button
                              type="button"
                              onClick={() => (onOpenDigiLocker ? onOpenDigiLocker(step.id) : openDigiLockerModal(step.id))}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold text-[11px] hover:bg-blue-50 transition-all flex items-center gap-1"
                            >
                              <UploadCloud className="w-3 h-3" />
                              <span>[ Upload / Verify ]</span>
                            </button>

                            {/* Download Sample / Legal Draft */}
                            <button
                              type="button"
                              onClick={() => handleOpenDraft()}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold text-[11px] hover:bg-amber-50 transition-all flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>[ Generate Draft / Blueprint ]</span>
                            </button>

                            {/* Official Portal Link */}
                            {substep.officialPortalUrl && (
                              <a
                                href={substep.officialPortalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 transition-all flex items-center gap-1"
                              >
                                <span>[ Open Portal ]</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DOCUMENT VAULT FOR THIS STEP */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  DOCUMENT VAULT FOR THIS STEP:
                </h4>
                <button
                  type="button"
                  onClick={() => (onOpenDigiLocker ? onOpenDigiLocker(step.id) : openDigiLockerModal(step.id))}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Sync DigiLocker Vault</span>
                  <UploadCloud className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {step.documentRequirements && step.documentRequirements.length > 0 ? (
                  step.documentRequirements.map((doc, idx) => {
                    const isVerified = step.status === "COMPLETED" || idx === 0;
                    return (
                      <div
                        key={doc.id || idx}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-slate-400 font-bold">•</span>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {doc.name}
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {doc.description || "Official statutory identification record"}
                            </p>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="shrink-0">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                              [ Verified via DigiLocker ]
                            </span>
                          ) : idx === 1 ? (
                            <button
                              type="button"
                              onClick={() => handleOpenDraft()}
                              className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-mono hover:bg-amber-200"
                            >
                              [ Notarized Template Ready ]
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => (onOpenDigiLocker ? onOpenDigiLocker(step.id) : openDigiLockerModal(step.id))}
                              className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-full font-mono hover:bg-blue-100"
                            >
                              [ Pending Upload ]
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl col-span-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      • Standard KYC identity records pre-verified via UIDAI / Income Tax DigiLocker Vault.
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      [ Verified via DigiLocker ]
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Need Legal Aid? Tele-Law Consultation / Step AI Guide Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Need Legal Aid? Connect to Tele-Law Consultation / Step AI Guide
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Access free pre-litigation advice with DoJ / NALSA panel advocates or ask the Step AI Guide.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.tele-law.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-blue-50 transition-all flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Tele-Law Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => openStepDrawer(step.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step AI Guide</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Legal Draft Generation Modal */}
      <LegalDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        template={activeDraftTemplate}
        onTriggerDigiLockerSign={(docTitle) => (onOpenDigiLocker ? onOpenDigiLocker(step.id) : openDigiLockerModal(step.id))}
      />
    </>
  );
};
