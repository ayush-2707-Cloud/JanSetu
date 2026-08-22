"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Lock, 
  FileText, 
  ExternalLink, 
  Building2, 
  ListOrdered, 
  Layers, 
  ArrowUpRight, 
  ShieldCheck, 
  UserCheck, 
  DollarSign, 
  Download, 
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useToast } from "@/context/ToastContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { StepAIChat } from "@/components/StepAIChat";
import { translations } from "@/data/translations";
import { PrecautionBanner } from "@/components/PrecautionBanner";
import { OfficialLinksPanel } from "@/components/OfficialLinksPanel";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { PrerequisiteKnowledgeCard } from "@/components/PrerequisiteKnowledgeCard";
import { CommonMistakesSection } from "@/components/CommonMistakesSection";
import { LegalReferencesList } from "@/components/LegalReferenceChip";
import { ShareAndBookmark } from "@/components/ShareAndBookmark";
import { HelplineSidebar } from "@/components/HelplineSidebar";
import PreFlightReviewModal from "@/components/PreFlightReviewModal";
import { EnhancedJourneyStep, DocumentRequirement } from "@/types/journey";

type TabKey = "dept" | "instructions" | "docs" | "redirection";

const STEP_ID_ALIASES: Record<string, string> = {
  "fssai-license": "ck-1",
  "identity-verification": "ck-1",
  "udyam-registration": "ck-2",
  "current-business-account": "ck-3",
  "marksheet-verification": "el-1",
  "bonafide-certificate": "el-2",
  "passport-application": "sa-1",
};

export const InstructionDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeStepDrawer,
    selectedStepId,
    activeJourney,
    language,
    toggleStepStatus,
    openDigiLockerModal,
    highlightedElementSelector,
  } = useJourney();

  // Universal background scroll lock
  useBodyScrollLock(isDrawerOpen);

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("dept");
  const [drawerWidth, setDrawerWidth] = useState<number>(640);
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const t = useMemo(() => (translations as Record<string, typeof translations.EN>)[language] || translations.EN, [language]);

  // Restore preferred width from localStorage
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem("instruction_drawer_width");
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (parsed >= 380 && parsed <= 1200) {
          setDrawerWidth(parsed);
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Performance-optimized Drag-to-Resize handler
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    let animationFrameId: number | null = null;
    let latestWidth = drawerWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const newWidth = window.innerWidth - moveEvent.clientX;
        const clamped = Math.min(Math.max(380, newWidth), Math.min(window.innerWidth - 40, 1100));
        latestWidth = clamped;
        setDrawerWidth(clamped);
      });
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      try {
        localStorage.setItem("instruction_drawer_width", String(latestWidth));
      } catch {}
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
  };

  // ESC and numeric 1/2/3/4 tab switch listeners (Ignore input/textarea typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawerOpen) return;
      const activeTag = (document.activeElement?.tagName || "").toUpperCase();
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;

      if (e.key === "Escape") {
        closeStepDrawer();
      } else if (e.key === "1") {
        setActiveTab("dept");
      } else if (e.key === "2") {
        setActiveTab("instructions");
      } else if (e.key === "3") {
        setActiveTab("docs");
      } else if (e.key === "4") {
        setActiveTab("redirection");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeStepDrawer]);

  if (!isDrawerOpen || !selectedStepId) return null;

  const rawStep =
    activeJourney.steps.find((s) => s.id === selectedStepId) ||
    activeJourney.steps.find((s) => s.id === STEP_ID_ALIASES[selectedStepId || ""]) ||
    activeJourney.steps.find(
      (s) =>
        s.id.toLowerCase() === selectedStepId?.toLowerCase() ||
        s.title.toLowerCase().includes((selectedStepId || "").toLowerCase())
    ) ||
    activeJourney.steps[0];

  if (!rawStep) return null;

  const step = rawStep as EnhancedJourneyStep;
  const { status, stepNumber, category, estimatedDays, instructions, completedAt } = step;

  const stepTitle =
    language === "HI" && step.titleHi
      ? step.titleHi
      : language === "KN" && step.titleKn
      ? step.titleKn
      : step.title;

  const localizedSummary =
    language === "HI" && instructions.summaryHi
      ? instructions.summaryHi
      : language === "KN" && instructions.summaryKn
      ? instructions.summaryKn
      : instructions.summary;

  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";
  const isLocked = status === "LOCKED";

  // Build document requirements list (structured or fallback from string array)
  const docRequirements: DocumentRequirement[] = step.documentRequirements && step.documentRequirements.length > 0
    ? step.documentRequirements
    : (instructions.documentsRequired || []).map((docName, idx) => ({
        id: `${step.id}-doc-${idx}`,
        name: docName.replace(/_/g, " ").replace(/\.[^/.]+$/, ""),
        description: `Official statutory certificate or verified record: ${docName}`,
        isMandatory: true,
        format: docName.endsWith(".pdf") ? "PDF Document" : "Official Certificate",
        maxSize: "2MB",
      }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Performance-Optimized Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in"
        onClick={closeStepDrawer}
      />

      <div 
        className="fixed inset-y-0 right-0 max-w-full flex z-50 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag-to-Resize Left Handle */}
        <div
          onMouseDown={handleDragStart}
          className="w-2.5 hover:w-3.5 bg-transparent hover:bg-blue-500/40 cursor-col-resize z-50 transition-all flex items-center justify-center group shrink-0"
          title="Drag to resize drawer width"
        >
          <div className="w-1 h-12 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-500 group-hover:h-16 transition-all" />
        </div>

        <div 
          style={{ width: `${drawerWidth}px` }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-[95vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
        >
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
                  {t.step} {stepNumber} • {category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                {stepTitle}
              </h2>
            </div>
            
            <button
              onClick={closeStepDrawer}
              className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Organized Tab Bar Navigation */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto text-xs shrink-0">
            {[
              { id: "dept", label: t.tabDeptInfo, icon: Building2 },
              { id: "instructions", label: t.tabInstructions, icon: ListOrdered },
              { id: "docs", label: t.tabDocuments, icon: FileText },
              { id: "redirection", label: t.tabRedirection, icon: ExternalLink },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-400 bg-slate-850"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Body 60fps Hardware-Accelerated Scroll Container */}
          <div className="flex-1 drawer-scroll-pane px-6 py-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">

            
            {/* Status Summary Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              isCompleted 
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" 
                : isInProgress 
                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 shadow-sm" 
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}>
              {isCompleted && (
                <div className="p-1.5 rounded-lg bg-emerald-500 text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {isInProgress && (
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 animate-pulse">
                  <Clock className="w-5 h-5" />
                </div>
              )}
              {isLocked && (
                <div className="p-1.5 rounded-lg bg-slate-400 text-white shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    Status: {isCompleted ? t.completedBadge : isInProgress ? t.inProgressBadge : t.lockedBadge}
                  </span>
                  {completedAt && (
                    <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      {t.completedAt} {completedAt}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {localizedSummary}
                </p>
              </div>
            </div>

            {/* TAB 1: Department Info */}
            {activeTab === "dept" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Governing Ministry & Authority</span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{activeJourney.department}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Agency Code: {activeJourney.agencyCode}</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-900 dark:text-blue-300 font-semibold flex items-center justify-between">
                    <span>{t.officialPortalBadge}</span>
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">MeitY Verified</span>
                  </div>
                </div>

                {/* Legal References if available */}
                {step.legalReferences && step.legalReferences.length > 0 && (
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                      {t.legalReferencesTitle}
                    </span>
                    <LegalReferencesList references={step.legalReferences} />
                  </div>
                )}

                {instructions.officerContact && (
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      {t.officerInCharge}
                    </span>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{instructions.officerContact.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{instructions.officerContact.role}</span>
                      </div>
                      <a href={`mailto:${instructions.officerContact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                        {instructions.officerContact.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Stage-Specific Helplines for this Step */}
                <HelplineSidebar
                  activeStep={step}
                  language={language}
                  variant="inline"
                />
              </div>
            )}

            {/* TAB 2: Step Instructions */}
            {activeTab === "instructions" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Precautions & Warnings Banner */}
                {step.precautions && step.precautions.length > 0 && (
                  <PrecautionBanner precautions={step.precautions} language={language} />
                )}

                {/* Prerequisite Knowledge */}
                {step.prerequisiteKnowledge && step.prerequisiteKnowledge.length > 0 && (
                  <PrerequisiteKnowledgeCard prerequisites={step.prerequisiteKnowledge} language={language} />
                )}

                {/* Mandatory Requirements List */}
                {instructions.requirementsList && instructions.requirementsList.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{t.mandatoryRequirements}</span>
                    </h3>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
                      {instructions.requirementsList.map((req, idx) => (
                        <div key={idx} className="p-3.5 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                          <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="leading-relaxed">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Mistakes */}
                {step.commonMistakes && step.commonMistakes.length > 0 && (
                  <CommonMistakesSection
                    mistakes={step.commonMistakes}
                    mistakesHi={step.commonMistakesHi}
                    mistakesKn={step.commonMistakesKn}
                    language={language}
                  />
                )}

                {instructions.fee && (
                  <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-md">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">{t.statutoryFee}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{instructions.fee}</span>
                    </div>
                  </div>
                )}

                {instructions.notes && (
                  <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 rounded-lg text-xs text-blue-900 dark:text-blue-300 space-y-1">
                    <span className="font-semibold block text-blue-950 dark:text-blue-200">{t.notesLabel}:</span>
                    <p className="leading-relaxed text-blue-800 dark:text-blue-300">{instructions.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Required Documents */}
            {activeTab === "docs" && (
              <div
                id="required-docs-checklist"
                className={`space-y-4 animate-in fade-in transition-all duration-300 ${
                  highlightedElementSelector === "#required-docs-checklist"
                    ? "ring-4 ring-amber-400 dark:ring-amber-500 rounded-2xl p-2 bg-amber-400/10 animate-pulse"
                    : ""
                }`}
              >
                {docRequirements.length > 0 ? (
                  <DocumentChecklist
                    documents={docRequirements}
                    stepId={step.id}
                    language={language}
                  />
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No mandatory paper certificates required for this milestone step.</p>
                )}
              </div>
            )}

            {/* TAB 4: Official Redirection & Action */}
            {activeTab === "redirection" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Official Links Panel (if step has multiple official links) */}
                {step.officialLinks && step.officialLinks.length > 0 && (
                  <OfficialLinksPanel links={step.officialLinks} language={language} />
                )}

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Official Portal Redirection</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Direct redirection to the verified state portal for submission or record downloading.
                  </p>
                  
                  {instructions.actionUrl ? (
                    <a
                      href={instructions.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span>{instructions.actionText || t.visitPortalBtn}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-lg text-center font-medium">
                      Official portal link will activate upon reaching active status.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Embedded Step AI Chat Component */}
            <div className="pt-2">
              <StepAIChat key={step.id} step={step} />
            </div>

          </div>

          {/* Footer CTAs */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            {isInProgress && (
              <>
                <button
                  type="button"
                  onClick={() => setIsPreflightModalOpen(true)}
                  className="px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Run data-quality pre-checks before final step submission"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pre-Flight Gate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleStepStatus(step.id, "COMPLETED");
                    showToast(`✓ Step ${step.stepNumber} marked as completed! 🎉`, "success");
                    closeStepDrawer();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.markCompleted}</span>
                </button>
              </>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={() => {
                  toggleStepStatus(step.id, "IN_PROGRESS");
                  showToast(`Step ${step.stepNumber} marked as incomplete 🔄 (Dependent downstream steps locked)`, "info");
                  closeStepDrawer();
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Mark this milestone incomplete to redo actions or update documentation"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.markIncomplete || "Mark as Incomplete"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeStepDrawer}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              {t.close}
            </button>

            {/* Share this step */}
            <ShareAndBookmark
              shareTitle={`Step ${stepNumber}: ${stepTitle}`}
              language={language}
              variant="compact"
            />
          </div>

        </div>
      </div>

      {/* Pre-Flight Quality Gate Modal */}
      <PreFlightReviewModal
        isOpen={isPreflightModalOpen}
        onClose={() => setIsPreflightModalOpen(false)}
        onProceed={() => {
          toggleStepStatus(step.id, "COMPLETED");
          showToast(`✓ Step ${step.stepNumber} passed Pre-Flight Quality Gate & marked completed! 🎉`, "success");
          closeStepDrawer();
        }}
        stepTitle={`Step ${stepNumber}: ${stepTitle}`}
        journeyTitle={activeJourney.department || "Statutory Department Clearance"}
      />
    </div>
  );
};
