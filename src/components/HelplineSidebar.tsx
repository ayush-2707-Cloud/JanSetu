"use client";

import React, { useState, useMemo } from "react";
import {
  Phone,
  PhoneCall,
  Shield,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Headphones,
  MessageCircle,
  Mail,
  Sparkles,
  Search,
  CheckCircle2,
  LifeBuoy,
  X,
} from "lucide-react";
import { Language, JourneyStep } from "@/types/journey";
import {
  helplines,
  getHelplinesForStep,
  getHelplinesByDomain,
  getEmergencyHelplines,
  Helpline,
} from "@/data/helplines";

interface HelplineSidebarProps {
  /** The currently active or selected step in the roadmap */
  activeStep?: JourneyStep | null;
  /** Current domain ID to filter relevant helplines */
  domainId?: string;
  /** Specific helpline IDs to show (from step data) */
  helplineIds?: string[];
  language: Language;
  /** Render as floating sidebar panel or inline section */
  variant?: "sidebar" | "inline";
  className?: string;
}

const i18n = {
  EN: {
    bannerTitle: "Need help? Don't worry, try these helplines!",
    bannerSubtitle: "Instant direct lines for stage assistance, emergency services & official departments",
    stageHelplines: "Active Step Helplines",
    stageBadge: "Pertinent to this Stage",
    emergency: "National Emergency",
    emergencyBadge: "24x7 Emergency",
    domainHelplines: "Domain Helplines",
    allHelplines: "All National Helplines",
    allFilter: "All",
    stageFilter: "Active Step",
    emergencyFilter: "Emergency",
    domainFilter: "Departmental",
    searchPlaceholder: "Search by department, service, or number...",
    availability: "Available",
    callNow: "Call",
    tollFree: "Toll Free",
    noMatches: "No helplines matched your search filter.",
    collapseText: "Collapse helplines",
    expandText: "View helpline directory",
  },
  HI: {
    bannerTitle: "मदद चाहिए? चिंता न करें, ये हेल्पलाइन आज़माएं!",
    bannerSubtitle: "चरण सहायता, आपातकालीन सेवाओं और आधिकारिक विभागों के लिए सीधी लाइनें",
    stageHelplines: "वर्तमान चरण की हेल्पलाइन",
    stageBadge: "इस चरण के लिए आवश्यक",
    emergency: "राष्ट्रीय आपातकालीन",
    emergencyBadge: "24x7 आपातकालीन",
    domainHelplines: "क्षेत्रीय हेल्पलाइन",
    allHelplines: "सभी राष्ट्रीय हेल्पलाइन",
    allFilter: "सभी",
    stageFilter: "वर्तमान चरण",
    emergencyFilter: "आपातकालीन",
    domainFilter: "विभागीय",
    searchPlaceholder: "विभाग, सेवा या नंबर से खोजें...",
    availability: "उपलब्ध",
    callNow: "कॉल करें",
    tollFree: "टोल फ्री",
    noMatches: "आपकी खोज से कोई हेल्पलाइन नहीं मिली।",
    collapseText: "हेल्पलाइन समेटें",
    expandText: "हेल्पलाइन निर्देशिका देखें",
  },
  KN: {
    bannerTitle: "ಸಹಾಯ ಬೇಕೇ? ಚಿಂತಿಸಬೇಡಿ, ಈ ಸಹಾಯವಾಣಿಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ!",
    bannerSubtitle: "ಹಂತದ ನೆರವು, ತುರ್ತು ಸೇವೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ಇಲಾಖೆಗಳಿಗೆ ನೇರ ಸಂಪರ್ಕ",
    stageHelplines: "ಪ್ರಸ್ತುತ ಹಂತದ ಸಹಾಯವಾಣಿ",
    stageBadge: "ಈ ಹಂತಕ್ಕೆ ಪ್ರಸ್ತುತವಾಗಿದೆ",
    emergency: "ರಾಷ್ಟ್ರೀಯ ತುರ್ತು",
    emergencyBadge: "24x7 ತುರ್ತು",
    domainHelplines: "ಸಂಬಂಧಿತ ಸಹಾಯವಾಣಿಗಳು",
    allHelplines: "ಎಲ್ಲಾ ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿಗಳು",
    allFilter: "ಎಲ್ಲವೂ",
    stageFilter: "ಪ್ರಸ್ತುತ ಹಂತ",
    emergencyFilter: "ತುರ್ತು",
    domainFilter: "ಇಲಾಖಾವಾರು",
    searchPlaceholder: "ಇಲಾಖೆ, ಸೇವೆ ಅಥವಾ ಸಂಖ್ಯೆಯ ಮೂಲಕ ಹುಡುಕಿ...",
    availability: "ಲಭ್ಯ",
    callNow: "ಕರೆ ಮಾಡಿ",
    tollFree: "ಟೋಲ್ ಫ್ರೀ",
    noMatches: "ಯಾವುದೇ ಸಹಾಯವಾಣಿ ಕಂಡುಬಂದಿಲ್ಲ.",
    collapseText: "ಸಹಾಯವಾಣಿ ಮುಚ್ಚಿ",
    expandText: "ಸಹಾಯವಾಣಿ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ",
  },
};

/** Icon map for helpline type */
function HelplineTypeIcon({ type }: { type: Helpline["type"] }) {
  switch (type) {
    case "TOLL_FREE":
      return <PhoneCall className="w-3.5 h-3.5" />;
    case "LANDLINE":
      return <Phone className="w-3.5 h-3.5" />;
    case "WHATSAPP":
      return <MessageCircle className="w-3.5 h-3.5" />;
    case "SMS":
      return <MessageCircle className="w-3.5 h-3.5" />;
    case "EMAIL":
      return <Mail className="w-3.5 h-3.5" />;
    default:
      return <Phone className="w-3.5 h-3.5" />;
  }
}

const HelplineSidebarComponent: React.FC<HelplineSidebarProps> = ({
  activeStep,
  domainId,
  helplineIds,
  language,
  variant = "inline",
  className,
}) => {
  const t = (i18n as Record<string, typeof i18n.EN>)[language] || i18n.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "STAGE" | "EMERGENCY" | "DEPT">("STAGE");

  // 1. Resolve stage-specific helplines for the current step
  const stageList = useMemo(() => {
    if (activeStep) {
      return getHelplinesForStep(activeStep);
    }
    if (helplineIds && helplineIds.length > 0) {
      return helplineIds
        .map((id) => helplines.find((h) => h.id === id))
        .filter(Boolean) as Helpline[];
    }
    return [];
  }, [activeStep, helplineIds]);

  const stageIds = useMemo(() => new Set(stageList.map((h) => h.id)), [stageList]);

  // Automatically focus on active step helplines whenever activeStep changes
  React.useEffect(() => {
    if (stageList.length > 0) {
      setSelectedCategory("STAGE");
    } else {
      setSelectedCategory("ALL");
    }
  }, [activeStep?.id, stageList.length]);

  // 2. Emergency and domain lists
  const emergencyList = useMemo(() => getEmergencyHelplines(), []);
  const emergencyIds = useMemo(() => new Set(emergencyList.map((h) => h.id)), [emergencyList]);

  // 3. Filtered helplines based on category and search query
  const filteredHelplines = useMemo(() => {
    let list = [...helplines];

    if (selectedCategory === "STAGE") {
      list = stageList;
    } else if (selectedCategory === "EMERGENCY") {
      list = emergencyList;
    } else if (selectedCategory === "DEPT") {
      list = helplines.filter((h) => !h.isEmergency && !stageIds.has(h.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          (h.nameHi && h.nameHi.toLowerCase().includes(q)) ||
          (h.nameKn && h.nameKn.toLowerCase().includes(q)) ||
          h.number.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
    }

    // Sort order: Stage-relevant first, then Emergency, then general
    return list.sort((a, b) => {
      const aStage = stageIds.has(a.id);
      const bStage = stageIds.has(b.id);
      if (aStage && !bStage) return -1;
      if (!aStage && bStage) return 1;

      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;

      return 0;
    });
  }, [stageList, emergencyList, selectedCategory, searchQuery, stageIds]);

  return (
    <div className={`w-full ${className || ""}`}>
      {/* Dropdown Container Card */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-blue-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-300 dark:hover:border-slate-700">
        
        {/* Clickable Header Accordion Banner */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full px-4 py-3.5 sm:px-5 flex items-center justify-between text-left gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors hover:bg-blue-100/30 dark:hover:bg-slate-800/50 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs ring-2 ring-blue-200 dark:ring-blue-900/60">
              <Headphones className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t.bannerTitle}
                </h3>
                {stageList.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    {stageList.length} Active for Step
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {t.bannerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-slate-700">
              {isOpen ? t.collapseText : t.expandText}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-transform duration-200">
              {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Expandable Helplines Body (Organized 2-Column Grid Layout) */}
        {isOpen && (
          <div className="p-4 sm:p-5 border-t border-blue-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Top Controls: Search Bar & Filter Categories */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                    selectedCategory === "ALL"
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.allFilter} ({helplines.length})
                </button>

                {stageList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("STAGE")}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all shrink-0 ${
                      selectedCategory === "STAGE"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{t.stageFilter} ({stageList.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedCategory("EMERGENCY")}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all shrink-0 ${
                    selectedCategory === "EMERGENCY"
                      ? "bg-red-600 text-white border-red-600 shadow-2xs"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/60"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{t.emergencyFilter} ({emergencyList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory("DEPT")}
                  className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                    selectedCategory === "DEPT"
                      ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.domainFilter}
                </button>
              </div>

              {/* Quick Search Input */}
              <div className="relative min-w-[200px] sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

            {/* Organized 2-Column Responsive Cards Grid */}
            {filteredHelplines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto overscroll-contain touch-pan-y pr-1">
                {filteredHelplines.map((h) => (
                  <HelplineGridCard
                    key={h.id}
                    helpline={h}
                    language={language}
                    isStagePertinent={stageIds.has(h.id)}
                    isEmergency={h.isEmergency}
                    stageBadge={t.stageBadge}
                    emergencyBadge={t.emergencyBadge}
                    callNowText={t.callNow}
                    tollFreeText={t.tollFree}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <LifeBuoy className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {t.noMatches}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

// ── Organized Card Component for Grid Layout ─────────────────────────────
interface HelplineGridCardProps {
  helpline: Helpline;
  language: Language;
  isStagePertinent?: boolean;
  isEmergency?: boolean;
  stageBadge?: string;
  emergencyBadge?: string;
  callNowText: string;
  tollFreeText: string;
}

const HelplineGridCard: React.FC<HelplineGridCardProps> = ({
  helpline,
  language,
  isStagePertinent = false,
  isEmergency = false,
  stageBadge,
  emergencyBadge,
  callNowText,
  tollFreeText,
}) => {
  const name =
    language === "HI" && helpline.nameHi
      ? helpline.nameHi
      : language === "KN" && helpline.nameKn
      ? helpline.nameKn
      : helpline.name;

  return (
    <div
      className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
        isStagePertinent
          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700"
          : isEmergency
          ? "bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/80 shadow-2xs hover:border-red-300 dark:hover:border-red-700"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
            isStagePertinent
              ? "bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700"
              : isEmergency
              ? "bg-red-100 dark:bg-red-900/70 text-red-600 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-800"
              : helpline.type === "TOLL_FREE"
              ? "bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}
        >
          <HelplineTypeIcon type={helpline.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {name}
            </h4>

            {isStagePertinent && stageBadge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/90 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 shrink-0">
                {stageBadge}
              </span>
            )}

            {isEmergency && emergencyBadge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-200/90 dark:bg-red-900 text-red-900 dark:text-red-200 shrink-0">
                {emergencyBadge}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {helpline.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Hours & Instant Call Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            {helpline.availability}
          </span>
          {helpline.type === "TOLL_FREE" && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              {tollFreeText}
            </span>
          )}
        </div>

        <a
          href={`tel:${helpline.number.replace(/[\s-]/g, "")}`}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all ${
            isStagePertinent
              ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-102 active:scale-98"
              : isEmergency
              ? "bg-red-600 hover:bg-red-700 text-white hover:scale-102 active:scale-98"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 active:scale-98"
          }`}
          title={`${callNowText}: ${helpline.number}`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{helpline.number}</span>
        </a>
      </div>
    </div>
  );
};

export const HelplineSidebar = React.memo(HelplineSidebarComponent);
