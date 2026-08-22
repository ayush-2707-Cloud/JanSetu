"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { UniversalJourney, StepStatus, Language } from "@/types/journey";
import { mockJourneys } from "@/data/mockJourneys";
import { CopilotAction, journeyService } from "@/services/api";
import type { ChoiceChipOption } from "@/components/ChoiceChips";

export type AppMode = "AI_COPILOT" | "MANUAL_DIRECTORY";

interface JourneyContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  activeJourney: UniversalJourney;
  allJourneys: UniversalJourney[];
  selectJourneyById: (id: string) => void;
  activeScreen: "LANDING" | "ROADMAP";
  setActiveScreen: (screen: "LANDING" | "ROADMAP") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: StepStatus | "ALL";
  setFilterStatus: (status: StepStatus | "ALL") => void;
  selectedStepId: string | null;
  openStepDrawer: (stepId: string) => void;
  closeStepDrawer: () => void;
  isDrawerOpen: boolean;

  // Dual-Mode UX: AI Copilot vs Manual Directory
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  // Generative UI: Action Dispatcher & Element Highlighting
  highlightedElementSelector: string | null;
  executeCopilotAction: (action: CopilotAction) => Promise<void>;

  // DigiLocker Modal State
  isDigiLockerModalOpen: boolean;
  openDigiLockerModal: (stepId: string) => void;
  closeDigiLockerModal: () => void;
  digiLockerStepId: string | null;

  // DPDP Consent Modal State
  isConsentModalOpen: boolean;
  consentDocType: string;
  consentPurpose: string;
  triggerConsentFlow: (docType: string, purpose: string, onGranted: () => void) => void;
  grantConsent: () => void;
  cancelConsent: () => void;

  toggleStepStatus: (stepId: string, newStatus: StepStatus) => void;
  completeActiveStepAndUnlockNext: () => void;
  completeDigiLockerVerification: (stepId: string) => void;
  completeSubStep: (stepId: string, substepId: string) => void;
  resetJourney: () => void;

  // Global Category & Sub-Category Selection State
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  selectedSubcategoryId: string;
  setSelectedSubcategoryId: (subcatId: string) => void;

  // Seamless Home Navigation with complete reset
  navigateToHome: () => void;

  // Dynamic Choice Chips for journey disambiguation
  choiceChipsData: ChoiceChipOption[] | null;
  setChoiceChipsData: (data: ChoiceChipOption[] | null) => void;
  choiceChipsPrompt: string | null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: "legalpath_lang",
  ACTIVE_SCREEN: "legalpath_active_screen",
  ACTIVE_JOURNEY_ID: "legalpath_active_journey_id",
  JOURNEYS_DATA: "legalpath_journeys_data",
  SELECTED_STEP_ID: "legalpath_selected_step_id",
  DRAWER_OPEN: "legalpath_drawer_open",
  SELECTED_CATEGORY_ID: "legalpath_selected_category_id",
  SELECTED_SUBCATEGORY_ID: "legalpath_selected_subcategory_id",
};

const JOURNEY_ID_ALIASES: Record<string, string> = {
  "food-business-license": "cloud-kitchen-blr",
  "pm-vidyalaxmi-loan": "edu-loan-india",
  "study-abroad-global": "study-abroad",
  "startup-seed-fund": "startup-idea",
  "tourist-guide-license": "tour-guide",
};

const STEP_ID_ALIASES: Record<string, string> = {
  "fssai-license": "ck-1",
  "identity-verification": "ck-1",
  "udyam-registration": "ck-2",
  "current-business-account": "ck-3",
  "marksheet-verification": "el-1",
  "income-certificate": "el-2",
  "scheme-discovery": "el-3",
  "bank-loan-application": "el-4",
};

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("EN");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [journeysData, setJourneysData] = useState<UniversalJourney[]>(mockJourneys);
  const [activeJourneyId, setActiveJourneyId] = useState<string>("cloud-kitchen-blr");
  const [activeScreen, setActiveScreenState] = useState<"LANDING" | "ROADMAP">("LANDING");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<StepStatus | "ALL">("ALL");

  // Dual-Mode UX & Generative UI Highlighting
  const [appMode, setAppMode] = useState<AppMode>("AI_COPILOT");
  const [highlightedElementSelector, setHighlightedElementSelector] = useState<string | null>(null);

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);


  // Global Category & Sub-Category state
  const [selectedCategoryId, setSelectedCategoryIdState] = useState<string>("ALL");
  const [selectedSubcategoryId, setSelectedSubcategoryIdState] = useState<string>("ALL");

  // DigiLocker Modal State
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);
  const [digiLockerStepId, setDigiLockerStepId] = useState<string | null>(null);

  // DPDP Consent State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [consentDocType, setConsentDocType] = useState<string>("");
  const [consentPurpose, setConsentPurpose] = useState<string>("");
  const [pendingConsentCallback, setPendingConsentCallback] = useState<(() => void) | null>(null);

  // Dynamic Choice Chips State
  const [choiceChipsData, setChoiceChipsData] = useState<ChoiceChipOption[] | null>(null);
  const [choiceChipsPrompt, setChoiceChipsPrompt] = useState<string | null>(null);

  // 1. Initial State Hydration from URL Search Params & LocalStorage (Cross-Reload Recovery)
  useEffect(() => {
    try {
      // Language recovery across all 11 supported Indian languages
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language | null;
      const validLangs: Language[] = ["EN", "HI", "KN", "BN", "TE", "TA", "MR", "GU", "ML", "PA", "OR"];
      if (savedLang && validLangs.includes(savedLang)) {
        setLanguageState(savedLang);
      }

      // Recover persisted journeys & step progress if available
      const savedJourneysRaw = localStorage.getItem(STORAGE_KEYS.JOURNEYS_DATA);
      if (savedJourneysRaw) {
        try {
          const parsed = JSON.parse(savedJourneysRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJourneysData(parsed);
          }
        } catch {
          // Ignore invalid JSON
        }
      }

      // Check URL search parameters first for direct deep links
      const params = new URLSearchParams(window.location.search);
      const urlJourney = params.get("journey");
      const urlScreen = params.get("screen");

      // Check localStorage for active screen and journey ID
      const savedScreen = localStorage.getItem(STORAGE_KEYS.ACTIVE_SCREEN) as "LANDING" | "ROADMAP" | null;
      const savedJourneyId = localStorage.getItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID);
      const savedSelectedStep = localStorage.getItem(STORAGE_KEYS.SELECTED_STEP_ID);
      const savedDrawer = localStorage.getItem(STORAGE_KEYS.DRAWER_OPEN);

      if (urlJourney) {
        setActiveJourneyId(urlJourney);
        setActiveScreenState("ROADMAP");
      } else if (savedJourneyId) {
        setActiveJourneyId(savedJourneyId);
      }

      if (urlScreen === "LANDING" || urlScreen === "ROADMAP") {
        setActiveScreenState(urlScreen);
      } else if (!urlJourney && savedScreen) {
        setActiveScreenState(savedScreen);
      }

      if (savedSelectedStep) {
        setSelectedStepId(savedSelectedStep);
      }

      if (savedDrawer) {
        try {
          setIsDrawerOpen(JSON.parse(savedDrawer));
        } catch {
          // Ignore
        }
      }

      // Recover persisted category & subcategory
      const savedCat = localStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORY_ID);
      const savedSubcat = localStorage.getItem(STORAGE_KEYS.SELECTED_SUBCATEGORY_ID);
      if (savedCat) setSelectedCategoryIdState(savedCat);
      if (savedSubcat) setSelectedSubcategoryIdState(savedSubcat);
    } catch (err) {
      console.error("Failed to restore JanSetu state from storage:", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Persist state changes whenever user navigates or updates progress
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SCREEN, activeScreen);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID, activeJourneyId);
      localStorage.setItem(STORAGE_KEYS.JOURNEYS_DATA, JSON.stringify(journeysData));

      if (selectedStepId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_STEP_ID, selectedStepId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_STEP_ID);
      }

      localStorage.setItem(STORAGE_KEYS.DRAWER_OPEN, JSON.stringify(isDrawerOpen));
      localStorage.setItem(STORAGE_KEYS.SELECTED_CATEGORY_ID, selectedCategoryId);
      localStorage.setItem(STORAGE_KEYS.SELECTED_SUBCATEGORY_ID, selectedSubcategoryId);

      // Synchronize URL with active screen so browser reload stays on current view
      if (activeScreen === "ROADMAP") {
        const targetSearch = `?journey=${encodeURIComponent(activeJourneyId)}`;
        if (window.location.search !== targetSearch) {
          window.history.replaceState(null, "", targetSearch);
        }
      } else {
        if (window.location.search) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    } catch {
      // Ignore storage write quota exceptions
    }
  }, [isInitialized, activeScreen, activeJourneyId, journeysData, selectedStepId, isDrawerOpen]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {
      // Ignore
    }
  }, []);

  const openLanguageModal = useCallback(() => setIsLanguageModalOpen(true), []);
  const closeLanguageModal = useCallback(() => setIsLanguageModalOpen(false), []);

  const activeJourney = useMemo(() => {
    return journeysData.find((j) => j.journeyId === activeJourneyId) || journeysData[0];
  }, [journeysData, activeJourneyId]);

  const selectJourneyById = useCallback((id: string) => {
    const targetId = JOURNEY_ID_ALIASES[id] || id;
    setActiveJourneyId(targetId);
    setActiveScreenState("ROADMAP");
    setSelectedStepId(null);
    setIsDrawerOpen(false);

    // Auto-select category and subcategory from the selected journey
    const matchedJourney = journeysData.find((j) => j.journeyId === targetId);
    if (matchedJourney) {
      if (matchedJourney.domainId) {
        setSelectedCategoryIdState(matchedJourney.domainId);
      }
      if (matchedJourney.subcategoryId) {
        setSelectedSubcategoryIdState(matchedJourney.subcategoryId);
      } else {
        setSelectedSubcategoryIdState("ALL");
      }
    }

    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("legalpath_recent_journeys");
        const existing: string[] = raw ? JSON.parse(raw) : [];
        const updated = [targetId, ...existing.filter((item) => item !== targetId)].slice(0, 8);
        localStorage.setItem("legalpath_recent_journeys", JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
  }, [journeysData]);

  const setSelectedCategoryId = useCallback((catId: string) => {
    setSelectedCategoryIdState(catId);
  }, []);

  const setSelectedSubcategoryId = useCallback((subcatId: string) => {
    setSelectedSubcategoryIdState(subcatId);
  }, []);

  const setActiveScreen = useCallback((screen: "LANDING" | "ROADMAP") => {
    setActiveScreenState(screen);
  }, []);

  const navigateToHome = useCallback(() => {
    setActiveScreenState("LANDING");
    setSearchQuery("");
    setSelectedCategoryIdState("ALL");
    setSelectedSubcategoryIdState("ALL");
    setFilterStatus("ALL");
    setIsDrawerOpen(false);
    setSelectedStepId(null);
    setIsDigiLockerModalOpen(false);
    setDigiLockerStepId(null);
    setIsConsentModalOpen(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_CATEGORY_ID);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_SUBCATEGORY_ID);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_STEP_ID);
        localStorage.removeItem(STORAGE_KEYS.DRAWER_OPEN);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SCREEN);
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        } else {
          const url = new URL(window.location.href);
          url.search = "";
          window.history.pushState({}, "", "/");
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  const openStepDrawer = useCallback((stepId: string) => {
    const targetStepId = STEP_ID_ALIASES[stepId] || stepId;
    const exists = activeJourney.steps.some((s) => s.id === targetStepId);
    if (!exists) {
      const match = activeJourney.steps.find(
        (s) =>
          s.id.toLowerCase() === stepId.toLowerCase() ||
          s.title.toLowerCase().includes(stepId.toLowerCase())
      );
      if (match) {
        setSelectedStepId(match.id);
        setIsDrawerOpen(true);
        return;
      }
    }
    setSelectedStepId(targetStepId);
    setIsDrawerOpen(true);
  }, [activeJourney.steps]);

  const closeStepDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const triggerConsentFlow = useCallback((docType: string, purpose: string, onGranted: () => void) => {
    setConsentDocType(docType);
    setConsentPurpose(purpose);
    setPendingConsentCallback(() => onGranted);
    setIsConsentModalOpen(true);
  }, []);

  const openDigiLockerModal = useCallback((stepId: string) => {
    const step = activeJourney.steps.find((s) => s.id === stepId);
    const docType = step?.instructions.digiLockerDocType || "Govt Certificate";
    const purpose = `Statutory identity & eligibility verification for ${step?.title || "Step"}`;

    triggerConsentFlow(docType, purpose, () => {
      setDigiLockerStepId(stepId);
      setIsDigiLockerModalOpen(true);
    });
  }, [activeJourney.steps, triggerConsentFlow]);

  const closeDigiLockerModal = useCallback(() => {
    setIsDigiLockerModalOpen(false);
    setDigiLockerStepId(null);
  }, []);

  const grantConsent = useCallback(() => {
    setIsConsentModalOpen(false);
    if (pendingConsentCallback) {
      pendingConsentCallback();
      setPendingConsentCallback(null);
    }
  }, [pendingConsentCallback]);

  const cancelConsent = useCallback(() => {
    setIsConsentModalOpen(false);
    setPendingConsentCallback(null);
  }, []);

  const toggleStepStatus = useCallback((stepId: string, newStatus: StepStatus) => {
    setJourneysData((prevJourneys) =>
      prevJourneys.map((j) => {
        if (j.journeyId !== activeJourneyId) return j;

        const targetIdx = j.steps.findIndex((s) => s.id === stepId);
        if (targetIdx === -1) return j;

        const updatedSteps = j.steps.map((step, idx) => {
          // 1. The target step being updated
          if (idx === targetIdx) {
            const updatedSubsteps = (step.substeps || []).map((sub, sIdx) => ({
              ...sub,
              status: (
                newStatus === "COMPLETED"
                  ? "COMPLETED"
                  : newStatus === "IN_PROGRESS"
                  ? (sIdx === 0 ? "IN_PROGRESS" : "LOCKED")
                  : "LOCKED"
              ) as StepStatus,
            }));

            return {
              ...step,
              status: newStatus,
              substeps: updatedSubsteps.length > 0 ? updatedSubsteps : step.substeps,
              completedAt: newStatus === "COMPLETED" ? new Date().toISOString().split("T")[0] : undefined,
            };
          }

          // 2. When completing the current step, automatically unlock the next sequential step
          if (newStatus === "COMPLETED" && idx === targetIdx + 1 && step.status === "LOCKED") {
            const nextSubsteps = (step.substeps || []).map((sub, sIdx) => ({
              ...sub,
              status: (sIdx === 0 ? "IN_PROGRESS" : "LOCKED") as StepStatus,
            }));

            return {
              ...step,
              status: "IN_PROGRESS" as StepStatus,
              substeps: nextSubsteps.length > 0 ? nextSubsteps : step.substeps,
            };
          }

          // 3. STATUTORY CASCADE RULE: When marking ANY prerequisite step as incomplete (IN_PROGRESS or LOCKED),
          // ALL downstream steps (idx > targetIdx) CANNOT remain completed or in-progress!
          // They MUST cascade back to LOCKED because their statutory prerequisite is no longer fulfilled.
          if (newStatus !== "COMPLETED" && idx > targetIdx) {
            const resetSubsteps = (step.substeps || []).map((sub) => ({
              ...sub,
              status: "LOCKED" as StepStatus,
            }));

            return {
              ...step,
              status: "LOCKED" as StepStatus,
              substeps: resetSubsteps.length > 0 ? resetSubsteps : step.substeps,
              completedAt: undefined,
            };
          }

          // 4. Upstream steps (idx < targetIdx) remain unchanged
          return step;
        });

        const completedCount = updatedSteps.filter((s) => s.status === "COMPLETED").length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);

        return {
          ...j,
          steps: updatedSteps,
          overallProgressPercentage: progress,
        };
      })
    );
  }, [activeJourneyId]);

  // Automatically completes current IN_PROGRESS step and unlocks next LOCKED step
  const completeActiveStepAndUnlockNext = useCallback(() => {
    setJourneysData((prevJourneys) =>
      prevJourneys.map((j) => {
        if (j.journeyId !== activeJourneyId) return j;

        const inProgressIndex = j.steps.findIndex((s) => s.status === "IN_PROGRESS");
        if (inProgressIndex === -1) return j;

        const updatedSteps = j.steps.map((step, idx) => {
          if (idx === inProgressIndex) {
            const updatedSubsteps = (step.substeps || []).map((sub) => ({
              ...sub,
              status: "COMPLETED" as StepStatus,
            }));

            return {
              ...step,
              status: "COMPLETED" as StepStatus,
              substeps: updatedSubsteps.length > 0 ? updatedSubsteps : step.substeps,
              completedAt: new Date().toISOString().split("T")[0],
            };
          }
          if (idx === inProgressIndex + 1 && step.status === "LOCKED") {
            const nextSubsteps = (step.substeps || []).map((sub, sIdx) => ({
              ...sub,
              status: (sIdx === 0 ? "IN_PROGRESS" : "LOCKED") as StepStatus,
            }));

            return {
              ...step,
              status: "IN_PROGRESS" as StepStatus,
              substeps: nextSubsteps.length > 0 ? nextSubsteps : step.substeps,
            };
          }
          return step;
        });

        const completedCount = updatedSteps.filter((s) => s.status === "COMPLETED").length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);

        return {
          ...j,
          steps: updatedSteps,
          overallProgressPercentage: progress,
        };
      })
    );
  }, [activeJourneyId]);

  const completeSubStep = useCallback((stepId: string, substepId: string) => {
    setJourneysData((prevJourneys) =>
      prevJourneys.map((j) => {
        if (j.journeyId !== activeJourneyId) return j;

        const stepIdx = j.steps.findIndex((s) => s.id === stepId);
        if (stepIdx === -1) return j;

        const updatedSteps = j.steps.map((step, idx) => {
          if (idx !== stepIdx) return step;

          const updatedSubsteps = (step.substeps || []).map((sub) => {
            if (sub.id === substepId) {
              return { ...sub, status: "COMPLETED" as StepStatus };
            }
            return sub;
          });

          // Check if all substeps or all mandatory substeps are completed
          const mandatorySubs = updatedSubsteps.filter((s) => s.isMandatory);
          const allMandatoryDone =
            mandatorySubs.length > 0
              ? mandatorySubs.every((s) => s.status === "COMPLETED")
              : updatedSubsteps.length > 0 && updatedSubsteps.every((s) => s.status === "COMPLETED");

          const newStepStatus = allMandatoryDone ? ("COMPLETED" as StepStatus) : step.status;

          return {
            ...step,
            status: newStepStatus,
            substeps: updatedSubsteps,
            completedAt: allMandatoryDone ? new Date().toISOString().split("T")[0] : step.completedAt,
          };
        });

        // Automatically unlock next step if current step was completed
        const completedIdx = updatedSteps.findIndex((s) => s.id === stepId && s.status === "COMPLETED");
        if (completedIdx !== -1 && completedIdx + 1 < updatedSteps.length) {
          if (updatedSteps[completedIdx + 1].status === "LOCKED") {
            updatedSteps[completedIdx + 1].status = "IN_PROGRESS";
            if (
              updatedSteps[completedIdx + 1].substeps &&
              updatedSteps[completedIdx + 1].substeps!.length > 0
            ) {
              updatedSteps[completedIdx + 1].substeps![0].status = "IN_PROGRESS";
            }
          }
        }

        const completedCount = updatedSteps.filter((s) => s.status === "COMPLETED").length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);

        return {
          ...j,
          steps: updatedSteps,
          overallProgressPercentage: progress,
        };
      })
    );

    // Call backend in non-blocking background
    journeyService.completeStep(activeJourneyId, stepId);
  }, [activeJourneyId]);

  const completeDigiLockerVerification = useCallback((stepId: string) => {
    toggleStepStatus(stepId, "COMPLETED");
    closeDigiLockerModal();
    openStepDrawer(stepId);
  }, [toggleStepStatus, closeDigiLockerModal, openStepDrawer]);

  const resetJourney = useCallback(() => {
    setJourneysData(mockJourneys);
    setFilterStatus("ALL");
    setSelectedStepId(null);
    setIsDrawerOpen(false);

    try {
      localStorage.removeItem(STORAGE_KEYS.JOURNEYS_DATA);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SCREEN);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_STEP_ID);
      localStorage.removeItem(STORAGE_KEYS.DRAWER_OPEN);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Generative UI Action Dispatcher: Intercepts AI tool calls and animates the UI automatically
  const executeCopilotAction = async (action: CopilotAction) => {
    switch (action.action_type) {
      case "LOAD_JOURNEY":
        if (action.payload?.journey_id) {
          selectJourneyById(action.payload.journey_id);
          setActiveScreenState("ROADMAP");
        }
        break;

      case "OPEN_STEP":
      case "OPEN_DRAWER":
        if (action.payload?.step_id) {
          openStepDrawer(action.payload.step_id);
        }
        break;

      case "SCROLL_TO_NODE":
        if (action.payload?.step_id && typeof window !== "undefined") {
          setTimeout(() => {
            const stepId = action.payload.step_id;
            const targetId = STEP_ID_ALIASES[stepId] || stepId;
            const el =
              document.getElementById(targetId) ||
              document.getElementById(stepId) ||
              document.querySelector(`[data-step-id="${targetId}"]`) ||
              document.querySelector(`[data-step-id="${stepId}"]`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 350);
        }
        break;

      case "TRIGGER_CONSENT":
        if (action.payload?.doc_type) {
          triggerConsentFlow(
            action.payload.doc_type,
            action.payload.purpose || "Statutory Identity Verification",
            () => {
              setIsDigiLockerModalOpen(true);
            }
          );
        }
        break;

      case "SWITCH_LANGUAGE":
        if (action.payload?.lang && ["EN", "HI", "KN"].includes(action.payload.lang.toUpperCase())) {
          setLanguageState(action.payload.lang.toUpperCase() as Language);
        }
        break;

      case "FILTER_CATALOG":
        if (action.payload?.domain_id) {
          setSelectedCategoryIdState(action.payload.domain_id);
          setAppMode("MANUAL_DIRECTORY");
        }
        break;

      case "HIGHLIGHT_ELEMENT":
        if (action.payload?.selector) {
          setHighlightedElementSelector(action.payload.selector);
          setTimeout(() => setHighlightedElementSelector(null), 4500);
        }
        break;

      case "SHOW_CHOICE_CHIPS":
        if (action.payload?.options && Array.isArray(action.payload.options)) {
          setChoiceChipsData(action.payload.options as ChoiceChipOption[]);
          setChoiceChipsPrompt(action.payload.prompt || "Which journey would you like to explore?");
        }
        break;

      default:
        break;
    }
  };

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      isLanguageModalOpen,
      openLanguageModal,
      closeLanguageModal,
      activeJourney,
      allJourneys: journeysData,
      selectJourneyById,
      activeScreen,
      setActiveScreen,
      searchQuery,
      setSearchQuery,
      filterStatus,
      setFilterStatus,
      selectedStepId,
      openStepDrawer,
      closeStepDrawer,
      isDrawerOpen,
      appMode,
      setAppMode,
      highlightedElementSelector,
      executeCopilotAction,
      isDigiLockerModalOpen,
      openDigiLockerModal,
      closeDigiLockerModal,
      digiLockerStepId,
      isConsentModalOpen,
      consentDocType,
      consentPurpose,
      triggerConsentFlow,
      grantConsent,
      cancelConsent,
      toggleStepStatus,
      completeActiveStepAndUnlockNext,
      completeDigiLockerVerification,
      completeSubStep,
      resetJourney,
      selectedCategoryId,
      setSelectedCategoryId,
      selectedSubcategoryId,
      setSelectedSubcategoryId,
      navigateToHome,
      choiceChipsData,
      setChoiceChipsData,
      choiceChipsPrompt,
    }),
    [
      language,
      setLanguage,
      isLanguageModalOpen,
      openLanguageModal,
      closeLanguageModal,
      activeJourney,
      journeysData,
      selectJourneyById,
      activeScreen,
      setActiveScreen,
      searchQuery,
      setSearchQuery,
      filterStatus,
      setFilterStatus,
      selectedStepId,
      openStepDrawer,
      closeStepDrawer,
      isDrawerOpen,
      appMode,
      setAppMode,
      highlightedElementSelector,
      executeCopilotAction,
      isDigiLockerModalOpen,
      openDigiLockerModal,
      closeDigiLockerModal,
      digiLockerStepId,
      isConsentModalOpen,
      consentDocType,
      consentPurpose,
      triggerConsentFlow,
      grantConsent,
      cancelConsent,
      toggleStepStatus,
      completeActiveStepAndUnlockNext,
      completeDigiLockerVerification,
      completeSubStep,
      resetJourney,
      selectedCategoryId,
      setSelectedCategoryId,
      selectedSubcategoryId,
      setSelectedSubcategoryId,
      navigateToHome,
      choiceChipsData,
      setChoiceChipsData,
      choiceChipsPrompt,
    ]
  );

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
};
