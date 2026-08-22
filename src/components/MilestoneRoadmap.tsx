"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { 
  Check, 
  Lock, 
  Clock, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Scale,
  Calculator,
  ExternalLink,
  ChevronDown,
  BellRing,
  ArrowUp,
  MessageSquare,
  MapPin,
  ListTree,
  Layers,
  Sparkles,
  Printer,
  Download,
  HardDrive,
  Users,
  Wrench,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { translations } from "@/data/translations";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CostEstimator } from "@/components/CostEstimator";
import { LegalReferencesList } from "@/components/LegalReferenceChip";
import { JourneyProgressTracker } from "@/components/JourneyProgressTracker";
import { HelplineSidebar } from "@/components/HelplineSidebar";
import { RelatedJourneysSection } from "@/components/RelatedJourneysSection";
import { ShareAndBookmark } from "@/components/ShareAndBookmark";
import { HolidayAlertBanner } from "@/components/HolidayAlertBanner";
import { SubStepMilestoneCard } from "@/components/SubStepMilestoneCard";
import { CelebrationConfetti } from "@/components/CelebrationConfetti";
import { LicenseRenewalCalendarModal } from "@/components/LicenseRenewalCalendarModal";
import { StampDutyCalculatorModal } from "@/components/StampDutyCalculatorModal";
import { SMSWhatsAppDispatchModal } from "@/components/SMSWhatsAppDispatchModal";
import { NodalOfficeFinder } from "@/components/NodalOfficeFinder";
import { useRouter } from "next/navigation";
import { JourneyGanttChart } from "@/components/JourneyGanttChart";
import { RoadmapExportModal } from "@/components/RoadmapExportModal";
import { OfflineVaultModal } from "@/components/OfflineVaultModal";
import { CoApplicantCollaborationModal } from "@/components/CoApplicantCollaborationModal";
import { EnhancedJourney, EnhancedJourneyStep, JourneyStep } from "@/types/journey";

export const MilestoneRoadmap: React.FC = () => {
  const router = useRouter();
  const {
    activeJourney,
    allJourneys,
    language,
    filterStatus,
    setFilterStatus,
    selectedStepId,
    isDrawerOpen,
    openStepDrawer,
    openDigiLockerModal,
    completeSubStep,
    setActiveScreen,
    navigateToHome,
    selectJourneyById,
    highlightedElementSelector,
  } = useJourney();

  const [viewMode, setViewMode] = useState<"SUBSTEPS" | "TIMELINE">("SUBSTEPS");
  const [showCostEstimator, setShowCostEstimator] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [justCompletedStepId, setJustCompletedStepId] = useState<string | null>(null);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState<boolean>(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState<boolean>(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState<boolean>(false);
  const [isNodalModalOpen, setIsNodalModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState<boolean>(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState<boolean>(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const t = (translations as Record<string, typeof translations.EN>)[language] || translations.EN;

  // Auto-scroll to selected step node if activated
  useEffect(() => {
    if (selectedStepId) {
      const el = document.getElementById(`step-card-${selectedStepId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedStepId]);

  const triggerCelebration = useCallback((stepId: string) => {
    if (typeof window !== "undefined") {
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 2500);
      setJustCompletedStepId(stepId);
      setTimeout(() => setJustCompletedStepId(null), 1200);
    }
  }, []);

  const handleSubStepComplete = useCallback((stepId: string, substepId: string) => {
    completeSubStep(stepId, substepId);
    triggerCelebration(stepId);
  }, [completeSubStep, triggerCelebration]);

  // Power User Keyboard Shortcuts (Alt+Arrow or Arrow keys only when drawer is open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const stepList = activeJourney.steps;
      if (!stepList || stepList.length === 0) return;

      const currentIdx = stepList.findIndex((s) => s.id === selectedStepId);

      // Only hijack Arrow keys if drawer is actively open, or if Alt modifier is pressed
      if ((isDrawerOpen || e.altKey) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        if (e.key === "ArrowDown") {
          const nextIdx = currentIdx < stepList.length - 1 ? currentIdx + 1 : 0;
          openStepDrawer(stepList[nextIdx].id);
        } else if (e.key === "ArrowUp") {
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : stepList.length - 1;
          openStepDrawer(stepList[prevIdx].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeJourney, selectedStepId, isDrawerOpen, openStepDrawer]);

  // Scroll listener for back-to-top FAB (throttled with rAF)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 250);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to the current active step in the timeline
  const scrollToActiveStep = useCallback(() => {
    if (!timelineRef.current) return;
    const activeEl = timelineRef.current.querySelector('[data-step-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, []);

  const steps: JourneyStep[] = useMemo(() => {
    return activeJourney.steps.filter((step: JourneyStep) => {
      if (filterStatus === "ALL") return true;
      return step.status === filterStatus;
    });
  }, [activeJourney.steps, filterStatus]);

  const totalSteps = activeJourney.steps.length;
  const enhancedJourney = activeJourney as EnhancedJourney;
  const currentActiveStep = activeJourney.steps.find((s) => s.status === "IN_PROGRESS") || activeJourney.steps[0];

  const localizedJourneyTitle =
    language === "HI" && activeJourney.titleHi
      ? activeJourney.titleHi
      : language === "KN" && activeJourney.titleKn
      ? activeJourney.titleKn
      : activeJourney.title;

  const localizedJourneyDesc =
    language === "HI" && activeJourney.descriptionHi
      ? activeJourney.descriptionHi
      : language === "KN" && activeJourney.descriptionKn
      ? activeJourney.descriptionKn
      : activeJourney.description;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-4">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          {
            label: "Home",
            onClick: () => {
              navigateToHome();
              router.push("/");
            },
          },
          {
            label: activeJourney.category,
            onClick: () => {
              navigateToHome();
              router.push("/");
            },
          },
          { label: localizedJourneyTitle },
        ]}
      />

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-gov-card space-y-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                {activeJourney.agencyCode}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Ref: {activeJourney.applicantReference}
              </span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {localizedJourneyTitle}
            </h2>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {localizedJourneyDesc}
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.overallProgress}</span>
              <span className="font-black text-blue-700 dark:text-blue-400">{activeJourney.overallProgressPercentage}%</span>
            </div>
            
            {/* Progress Meter */}
            <Progress value={activeJourney.overallProgressPercentage} className="h-3" />
            
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block text-right">
              {activeJourney.steps.filter((s) => s.status === "COMPLETED").length} {t.of} {totalSteps} {t.completedBadge}
            </span>
          </div>
        </div>

        {/* Action toolbar & Filter Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center flex-wrap gap-2">
            {/* View Mode Toggle: Nested Sub-Steps vs Compact Timeline */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("SUBSTEPS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "SUBSTEPS"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>{(t as any).nestedSubSteps || "Nested Sub-Steps"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("TIMELINE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "TIMELINE"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{(t as any).compactTimeline || "Compact Timeline"}</span>
              </button>
            </div>

            {/* Estimated Cost Breakdown Toggle Button */}
            <button
              type="button"
              onClick={() => setShowCostEstimator(!showCostEstimator)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                showCostEstimator
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.costBreakdownTitle}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCostEstimator ? "rotate-180" : ""}`} />
            </button>

            {/* Statutory Tools & Compliance Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs border cursor-pointer ${
                  isToolsMenuOpen
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                title="Statutory calculators, nodal offices, alerts & reminders"
              >
                <Wrench className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Statutory Tools</span>
                <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded-full">
                  4
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isToolsMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Floating Dropdown Popover */}
              {isToolsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsToolsMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setIsStampModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-600" />
                        <span>{(t as any).eStampDuty || "e-Stamp Duty Calculator"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">State Rates</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setIsNodalModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>{(t as any).findNodalOffices || "Find Nodal Offices"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Geo-Location</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setIsRenewalModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/50 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-amber-600" />
                        <span>{(t as any).trackRenewal || "Track License Expiry (.ICS)"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setIsSMSModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span>{(t as any).smsAlert || "SMS / WhatsApp Alerts"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Sandbox</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Offline Encrypted Vault Button */}
            <button
              type="button"
              onClick={() => setIsVaultModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all text-xs cursor-pointer"
              title="Open AES-256 encrypted offline document vault"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>{(t as any).encryptedVault || "Encrypted Vault"}</span>
            </button>

            {/* Multi-Party Co-Applicant Collaboration Hub Button */}
            <button
              type="button"
              onClick={() => setIsCollabModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all text-xs cursor-pointer"
              title="Invite co-founders, partners, or landlords to collaborate on this roadmap"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>{(t as any).coApplicantCollab || "Co-Applicant Collab"}</span>
            </button>

            {/* Export Statutory Citizen Dossier (PDF / Print) Button */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white shadow-xs transition-all text-xs cursor-pointer"
              title="Download official citizen milestone dossier and print checklist"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
              <span>{(t as any).exportDossier || "Export Dossier (PDF)"}</span>
            </button>
          </div>

          {/* Milestone Filter Status Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            {[
              { id: "ALL", label: t.searchFilterAll },
              { id: "IN_PROGRESS", label: t.searchFilterActive },
              { id: "COMPLETED", label: t.searchFilterDone },
              { id: "LOCKED", label: t.searchFilterLocked },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id as any)}
                className={`py-1 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  filterStatus === f.id
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Cost Breakdown */}
        {showCostEstimator && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2">
            <CostEstimator journey={enhancedJourney} language={language} />
          </div>
        )}

      </div>

      {/* Government Gazetted Holiday Notice */}
      <HolidayAlertBanner journey={activeJourney} language={language} />

      {/* Statutory Milestone Critical Path & GANTT Timeline View */}
      <JourneyGanttChart journey={enhancedJourney} language={language} />

      {/* View Mode: Nested Sub-Step Accordion Checklist Mode */}
      {viewMode === "SUBSTEPS" ? (
        <div className="space-y-4">
          {steps.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No milestones found matching the "{filterStatus}" filter.
              </p>
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Show All Milestones
              </button>
            </div>
          ) : (
            steps.map((step, idx) => (
              <SubStepMilestoneCard
                key={step.id}
                step={step}
                journeyId={activeJourney.journeyId}
                isExpandedDefault={idx === 0 || step.status === "IN_PROGRESS"}
                onCompleteSubStep={handleSubStepComplete}
                onOpenDigiLocker={openDigiLockerModal}
              />
            ))
          )}
        </div>
      ) : (
        /* View Mode: Vertical Milestone Timeline */
        <div ref={timelineRef} className="relative pl-6 sm:pl-10">
        
        {steps.map((step, index) => {
          const enhancedStep = step as EnhancedJourneyStep;
          const isCompleted = step.status === "COMPLETED";
          const isInProgress = step.status === "IN_PROGRESS";
          const isLocked = step.status === "LOCKED";
          const isSelected = selectedStepId === step.id;
          const isLastStep = index === steps.length - 1;

          const stepTitle =
            language === "HI" && step.titleHi
              ? step.titleHi
              : language === "KN" && step.titleKn
              ? step.titleKn
              : step.title;

          const stepDesc =
            language === "HI" && step.descriptionHi
              ? step.descriptionHi
              : language === "KN" && step.descriptionKn
              ? step.descriptionKn
              : step.description;

          // Stem line active calculation
          const nextStep = steps[index + 1];
          const isLineActive = isCompleted && (nextStep?.status === "COMPLETED" || nextStep?.status === "IN_PROGRESS");

          // Check if step has critical precautions
          const hasCriticalPrecaution = enhancedStep.precautions?.some(p => p.severity === "CRITICAL");
          const hasWarningPrecaution = enhancedStep.precautions?.some(p => p.severity === "WARNING");

          const isHighlighted =
            highlightedElementSelector === `#${step.id}` ||
            highlightedElementSelector === step.id;

          return (
            <div
              key={step.id}
              id={step.id}
              data-step-id={step.id}
              data-step-active={isInProgress ? "true" : undefined}
              className={`relative pb-10 last:pb-2 group transition-all duration-300 ${
                isHighlighted ? "ring-4 ring-amber-400 dark:ring-amber-500 rounded-3xl p-1 bg-amber-400/10 animate-pulse" : ""
              }`}
            >
              
              {/* Dynamic Vertical Connecting Progress Stem Line */}
              {!isLastStep && (
                <div 
                  className={`absolute left-4 sm:left-5 top-10 bottom-0 w-1 transform -translate-x-1/2 transition-colors duration-500 rounded-full ${
                    isLineActive 
                      ? "bg-gradient-to-b from-emerald-500 to-blue-500" 
                      : isCompleted 
                      ? "bg-emerald-400" 
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Node Icon Circle Badge with Micro-Interactions */}
              <div className="absolute left-4 sm:left-5 top-1 transform -translate-x-1/2 z-10">
                {isCompleted && (
                  <div 
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950 transition-all group-hover:scale-105 ${
                      justCompletedStepId === step.id ? "animate-celebrate ring-8 ring-emerald-400" : ""
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}

                {isInProgress && (
                  <div 
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-gov-glow ring-4 ring-blue-100 dark:ring-blue-950 ring-offset-2 transition-all group-hover:scale-105 ${
                      justCompletedStepId ? "animate-unlock-shake ring-8 ring-blue-400" : "animate-pulse"
                    }`}
                  >
                    <Clock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}

                {isLocked && (
                  <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Milestone Card */}
              <div className="ml-6 sm:ml-8">
                <div 
                  onClick={() => openStepDrawer(step.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openStepDrawer(step.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Step ${step.stepNumber}: ${stepTitle}`}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 ${
                    isInProgress
                      ? `bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-500 dark:border-blue-500 shadow-gov-glow ring-2 ring-blue-400/30 hover:border-blue-600 cursor-pointer ${
                          isSelected ? "ring-4 ring-blue-600 bg-blue-50 dark:bg-blue-950/60" : ""
                        }`
                      : isCompleted
                      ? `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md cursor-pointer ${
                          isSelected ? "ring-2 ring-emerald-500 border-emerald-400" : ""
                        }`
                      : `bg-slate-50 dark:bg-slate-950/60 border-slate-200/90 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 opacity-90 ${
                          isSelected ? "ring-2 ring-slate-400" : ""
                        }`
                  }`}
                >
                  
                  {/* Card Header & Node State Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {t.step} {String(step.stepNumber).padStart(2, "0")} {t.of} {String(totalSteps).padStart(2, "0")}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700">
                        {step.category}
                      </span>

                      {/* Warning indicators */}
                      {hasCriticalPrecaution && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span>Critical Precaution</span>
                        </span>
                      )}

                      {!hasCriticalPrecaution && hasWarningPrecaution && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Important Notice</span>
                        </span>
                      )}
                    </div>

                    {/* Strict Node State Badges */}
                    <div>
                      {isCompleted && (
                        <Badge variant="success" className="gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.completedBadge}</span>
                        </Badge>
                      )}

                      {isInProgress && (
                        <Badge variant="active" className="gap-1.5 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span>{t.inProgressBadge}</span>
                        </Badge>
                      )}

                      {isLocked && (
                        <Badge variant="locked" className="gap-1">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>{t.lockedBadge}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Card Title & Description */}
                  <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                    isInProgress ? "text-blue-950 dark:text-blue-200" : isCompleted ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {stepTitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {stepDesc}
                  </p>

                  {/* Legal References chips */}
                  {enhancedStep.legalReferences && enhancedStep.legalReferences.length > 0 && (
                    <div className="mt-2.5">
                      <LegalReferencesList references={enhancedStep.legalReferences} />
                    </div>
                  )}

                  {/* Explicit Locked Dependency Badge */}
                  {isLocked && (
                    <div className="mt-3 p-2.5 bg-slate-200/60 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 rounded-xl flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        {t.requiresDependency} {step.stepNumber - 1} {t.completionNotice}
                      </span>
                    </div>
                  )}

                  {/* Card Footer Action Buttons */}
                  <div className="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {isCompleted && step.completedAt && (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {t.completedAt} {step.completedAt}
                        </span>
                      )}

                      {isInProgress && (
                        <span className="flex items-center gap-1 text-blue-800 dark:text-blue-300 font-semibold bg-blue-100/80 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-transparent dark:border-blue-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          {t.estimatedTime}: {step.estimatedDays || "Active"}
                        </span>
                      )}
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="flex items-center gap-2">
                      
                      {isInProgress && step.requiresDigiLocker && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDigiLockerModal(step.id);
                          }}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{t.verifyDigiLocker}</span>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openStepDrawer(step.id);
                          }}
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm hover:shadow-gov-glow transition-all active:scale-[0.98]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.viewInstructions}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline">
                          <span>{t.viewInstructions}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              </div>

            </div>
          );
        })}

      </div>
      )}

      {/* ── Helpline Dropdown Banner (Collapsible & Organized Grid) ── */}
      <div className="mt-4">
        <HelplineSidebar
          activeStep={currentActiveStep}
          domainId={enhancedJourney.domainId}
          language={language}
        />
      </div>

      {/* ── Bottom Panels: Progress Tracker, Share, Related ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left column: Progress Tracker */}
        <div className="lg:col-span-1 space-y-4">
          <JourneyProgressTracker
            journey={activeJourney}
            language={language}
            onGoToActiveStep={scrollToActiveStep}
          />
        </div>

        {/* Right column: Share + Related Journeys */}
        <div className="lg:col-span-2 space-y-4">
          {/* Share & Bookmark */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <ShareAndBookmark
              shareTitle={localizedJourneyTitle}
              shareDescription={localizedJourneyDesc}
              language={language}
              variant="inline"
            />
          </div>

          {/* Related Journeys */}
          <RelatedJourneysSection
            currentJourney={activeJourney}
            allJourneys={allJourneys}
            onSelectJourney={selectJourneyById}
            language={language}
          />
        </div>
      </div>

      {/* Celebration Confetti Effect upon Step Completion */}
      <CelebrationConfetti
        isActive={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />

      {/* Floating Action Button (FAB) for Fast Navigation */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 no-print fab-container">
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-3 rounded-full bg-slate-900/90 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all border border-slate-700/50 flex items-center justify-center cursor-pointer"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={scrollToActiveStep}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Go to active step"
          title="Jump to current active step"
        >
          <span>→ Step {currentActiveStep.stepNumber}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Proactive License Expiry & Renewal Calendar Modal - Lazy Mounted */}
      {isRenewalModalOpen && (
        <LicenseRenewalCalendarModal
          isOpen={isRenewalModalOpen}
          onClose={() => setIsRenewalModalOpen(false)}
          journey={activeJourney}
        />
      )}

      {/* State e-Stamp Duty Calculator Modal - Lazy Mounted */}
      {isStampModalOpen && (
        <StampDutyCalculatorModal
          isOpen={isStampModalOpen}
          onClose={() => setIsStampModalOpen(false)}
        />
      )}

      {/* SMS & WhatsApp Status Notification Dispatch Sandbox - Lazy Mounted */}
      {isSMSModalOpen && (
        <SMSWhatsAppDispatchModal
          isOpen={isSMSModalOpen}
          onClose={() => setIsSMSModalOpen(false)}
          journeyTitle={activeJourney.title}
          stepTitle={currentActiveStep.title}
        />
      )}

      {/* Geo-Located Nodal Officer & CSC Center Finder Modal - Lazy Mounted */}
      {isNodalModalOpen && (
        <NodalOfficeFinder
          isOpen={isNodalModalOpen}
          onClose={() => setIsNodalModalOpen(false)}
        />
      )}

      {/* Export Statutory Citizen Dossier Modal - Lazy Mounted */}
      {isExportModalOpen && (
        <RoadmapExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          journey={activeJourney}
          language={language}
        />
      )}

      {/* Offline Encrypted Document Vault Modal - Lazy Mounted */}
      {isVaultModalOpen && (
        <OfflineVaultModal
          isOpen={isVaultModalOpen}
          onClose={() => setIsVaultModalOpen(false)}
        />
      )}

      {/* Multi-Party Co-Applicant Collaboration Modal - Lazy Mounted */}
      {isCollabModalOpen && (
        <CoApplicantCollaborationModal
          isOpen={isCollabModalOpen}
          onClose={() => setIsCollabModalOpen(false)}
          journey={activeJourney}
        />
      )}

    </div>
  );
};
