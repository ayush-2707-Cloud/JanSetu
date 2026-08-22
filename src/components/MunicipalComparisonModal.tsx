"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  X,
  Clock,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Flame,
  SlidersHorizontal,
  Search,
  Check,
  ChevronRight,
  ArrowRightLeft,
  Sparkles,
  Zap,
  Info,
  Layers,
  Copy,
  RotateCcw,
  Building,
  FileText,
  BadgeCheck,
  Crosshair,
  Navigation,
} from "lucide-react";
import {
  MUNICIPAL_PROFILES,
  MUNICIPAL_DOMAINS,
  DOMAIN_RULE_FIELDS,
  MunicipalDomainId,
  DomainRuleField,
  MunicipalComplianceProfile,
  detectMunicipalityByPincode,
  getNearestMunicipalityByCoords,
} from "@/data/municipalities";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useJourney } from "@/context/JourneyContext";
import { MUNICIPAL_TRANSLATIONS } from "@/data/municipalTranslations";

interface MunicipalComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MunicipalComparisonModal: React.FC<MunicipalComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useJourney();
  const t = MUNICIPAL_TRANSLATIONS[language] || MUNICIPAL_TRANSLATIONS.EN;

  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  // Active Cities
  const [cityA, setCityA] = useState<string>("BBMP");
  const [cityB, setCityB] = useState<string>("BMC");

  // Active Domain
  const [selectedDomain, setSelectedDomain] = useState<MunicipalDomainId>("startups");

  // Drawer Open State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Field selection filter (map of fieldKey -> boolean)
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});

  // Field search query inside drawer
  const [fieldSearchQuery, setFieldSearchQuery] = useState<string>("");

  // Category filter inside drawer
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Pincode auto-lookup state
  const [pincodeInput, setPincodeInput] = useState<string>("");
  const [pincodeTarget, setPincodeTarget] = useState<"A" | "B">("A");
  const [pincodeFeedback, setPincodeFeedback] = useState<string | null>(null);

  // Copy to clipboard status
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize / Reset default fields when domain changes
  useEffect(() => {
    const fields = DOMAIN_RULE_FIELDS[selectedDomain] || [];
    const initialMap: Record<string, boolean> = {};
    fields.forEach((f) => {
      initialMap[f.key] = true;
    });
    setSelectedFields(initialMap);
  }, [selectedDomain]);

  // GPS Geolocation state
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Pincode auto-matching helper
  const handlePincodeLookup = (val: string) => {
    setPincodeInput(val);
    const cleaned = val.trim().replace(/\D/g, "");
    if (cleaned.length >= 3) {
      const matchedCity = detectMunicipalityByPincode(cleaned);

      if (matchedCity && MUNICIPAL_PROFILES[matchedCity]) {
        if (pincodeTarget === "A") {
          setCityA(matchedCity);
          setPincodeFeedback(`Matched ${MUNICIPAL_PROFILES[matchedCity].cityName} (${matchedCity}) for City A`);
        } else {
          setCityB(matchedCity);
          setPincodeFeedback(`Matched ${MUNICIPAL_PROFILES[matchedCity].cityName} (${matchedCity}) for City B`);
        }
      } else if (cleaned.length === 6) {
        setPincodeFeedback("No direct municipal tier mapped. Defaulting to nearest State Nodal Center.");
      }
    } else {
      setPincodeFeedback(null);
    }
  };

  // GPS Geolocation auto-detection
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setPincodeFeedback("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setPincodeFeedback("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const nearestCity = getNearestMunicipalityByCoords(latitude, longitude);
        if (nearestCity && MUNICIPAL_PROFILES[nearestCity]) {
          if (pincodeTarget === "A") {
            setCityA(nearestCity);
            setPincodeFeedback(`📍 GPS detected: Nearest corporation is ${MUNICIPAL_PROFILES[nearestCity].cityName} (${nearestCity})`);
          } else {
            setCityB(nearestCity);
            setPincodeFeedback(`📍 GPS detected: Nearest corporation is ${MUNICIPAL_PROFILES[nearestCity].cityName} (${nearestCity})`);
          }
        }
      },
      (err) => {
        setIsLocating(false);
        setPincodeFeedback("Unable to retrieve GPS coordinates. Please enter a 6-digit postal pincode.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Swap cities
  const handleSwapCities = () => {
    const temp = cityA;
    setCityA(cityB);
    setCityB(temp);
  };

  // Toggle single field
  const toggleField = (key: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Select all fields for current domain
  const handleSelectAllFields = () => {
    const fields = DOMAIN_RULE_FIELDS[selectedDomain] || [];
    const updated: Record<string, boolean> = {};
    fields.forEach((f) => {
      updated[f.key] = true;
    });
    setSelectedFields(updated);
  };

  // Deselect all fields
  const handleClearAllFields = () => {
    setSelectedFields({});
  };

  // Copy summary to clipboard
  const handleCopyComparison = () => {
    const profA = MUNICIPAL_PROFILES[cityA];
    const profB = MUNICIPAL_PROFILES[cityB];
    const domainMeta = MUNICIPAL_DOMAINS[selectedDomain];
    const fields = DOMAIN_RULE_FIELDS[selectedDomain] || [];
    const activeFields = fields.filter((f) => selectedFields[f.key] !== false);

    let text = `🏛️ JanSetu™ (जनसेतु) Municipal Diff Matrix: ${domainMeta.label}\n`;
    text += `Comparing: ${profA.cityName} (${cityA}) vs ${profB.cityName} (${cityB})\n\n`;

    activeFields.forEach((f) => {
      const valA = profA.domainRules?.[selectedDomain]?.[f.key]?.value || "N/A";
      const valB = profB.domainRules?.[selectedDomain]?.[f.key]?.value || "N/A";
      text += `📌 ${f.label}:\n`;
      text += `  • ${cityA} (${profA.cityName}): ${valA}\n`;
      text += `  • ${cityB} (${profB.cityName}): ${valB}\n\n`;
    });

    text += `Generated from JanSetu™ (जनसेतु) Universal GovTech Bridge.`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  const profileA = MUNICIPAL_PROFILES[cityA] || MUNICIPAL_PROFILES.BBMP;
  const profileB = MUNICIPAL_PROFILES[cityB] || MUNICIPAL_PROFILES.BMC;
  const currentDomainMeta = MUNICIPAL_DOMAINS[selectedDomain] || MUNICIPAL_DOMAINS.startups;
  const allDomainFields = DOMAIN_RULE_FIELDS[selectedDomain] || [];

  // Filter fields inside drawer based on search and category
  const filteredDrawerFields = allDomainFields.filter((f) => {
    const matchesSearch =
      f.label.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(fieldSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === "all" || f.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Active fields for main table
  const activeComparisonFields = allDomainFields.filter(
    (f) => selectedFields[f.key] !== false
  );

  // Group active fields by category
  const categoriesInUse = Array.from(
    new Set(activeComparisonFields.map((f) => f.categoryLabel))
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="municipal-modal-title"
    >
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8 flex items-center justify-center">
        {/* Main Modal Card */}
        <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[92vh]">
          
          {/* Top Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="municipal-modal-title"
                  className="text-base font-black text-white flex items-center gap-2 flex-wrap"
                >
                  <span>{t.modalTitle}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/30">
                    Bylaw & SLA Matrix
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {t.modalSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                title="Open domain and field selection drawer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Choose Domain & Fields</span>
                <span className="sm:hidden">Filter</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-800 text-[10px]">
                  {activeComparisonFields.length}
                </span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Domain Pill Selector Bar (Horizontal Quick Switcher) */}
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto">
            <div className="flex items-center justify-between gap-3 min-w-max">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className="text-[11px] uppercase tracking-wider font-bold">Domain:</span>
              </div>
              <div className="flex items-center gap-2">
                {(Object.keys(MUNICIPAL_DOMAINS) as MunicipalDomainId[]).map((domId) => {
                  const meta = MUNICIPAL_DOMAINS[domId];
                  const isSelected = selectedDomain === domId;
                  return (
                    <button
                      key={domId}
                      type="button"
                      onClick={() => {
                        setSelectedDomain(domId);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                    >
                      <span>{meta.emoji}</span>
                      <span>{meta.shortLabel}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer ml-auto pl-2"
              >
                <span>Customize ({activeComparisonFields.length}/{allDomainFields.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Modal Main Scrollable Content */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            
            {/* Domain Context Banner */}
            <div className={`p-4 rounded-2xl border ${currentDomainMeta.colorScheme.bg} ${currentDomainMeta.colorScheme.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                  {currentDomainMeta.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {currentDomainMeta.label}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentDomainMeta.colorScheme.pill}`}>
                      {currentDomainMeta.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
                    {currentDomainMeta.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyComparison}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Copy comparison summary to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Summary"}</span>
                </button>
              </div>
            </div>

            {/* City Selectors & Pincode Quick Match */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* City A Selector */}
              <div className="md:col-span-5 p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>Municipal Corporation A</span>
                  </label>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-mono font-bold">
                    {profileA.stateCode}
                  </span>
                </div>
                <select
                  value={cityA}
                  onChange={(e) => setCityA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  {Object.entries(MUNICIPAL_PROFILES).map(([key, prof]) => (
                    <option key={key} value={key}>
                      {prof.cityName} ({prof.id}) — {prof.state}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Helpline: {profileA.helpline}</span>
                  <a
                    href={profileA.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-2 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                  title="Swap City A and City B"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">Swap</span>
              </div>

              {/* City B Selector */}
              <div className="md:col-span-5 p-3.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>Municipal Corporation B</span>
                  </label>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-mono font-bold">
                    {profileB.stateCode}
                  </span>
                </div>
                <select
                  value={cityB}
                  onChange={(e) => setCityB(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                >
                  {Object.entries(MUNICIPAL_PROFILES).map(([key, prof]) => (
                    <option key={key} value={key}>
                      {prof.cityName} ({prof.id}) — {prof.state}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Helpline: {profileB.helpline}</span>
                  <a
                    href={profileB.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Quick Pincode & GPS Auto-Detect Helper */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center flex-wrap gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Quick Pincode / GPS Auto-Select:
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => handlePincodeLookup(e.target.value)}
                  placeholder="e.g. 560001, 110001"
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-32 font-mono"
                />
                <select
                  value={pincodeTarget}
                  onChange={(e) => setPincodeTarget(e.target.value as "A" | "B")}
                  className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer"
                >
                  <option value="A">Apply to City A</option>
                  <option value="B">Apply to City B</option>
                </select>

                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleGPSLocation}
                  disabled={isLocating}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold hover:bg-indigo-100 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                  title="Detect nearest municipal corporation via GPS"
                >
                  <Navigation className={`w-3 h-3 ${isLocating ? "animate-spin text-indigo-500" : "text-indigo-600"}`} />
                  <span>{isLocating ? "Locating..." : "Use My GPS"}</span>
                </button>
              </div>

              {pincodeFeedback && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {pincodeFeedback}
                </span>
              )}
            </div>

            {/* Comparison Matrix Table */}
            {activeComparisonFields.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  No Rule Fields Selected
                </h5>
                <p className="text-slate-500 max-w-sm mx-auto text-xs">
                  You have filtered out all comparison fields. Open the drawer to re-enable rule metrics.
                </p>
                <button
                  type="button"
                  onClick={handleSelectAllFields}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Restore All Fields for {currentDomainMeta.shortLabel}
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 p-3.5 bg-slate-100 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 items-center text-xs sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span>Statutory Compliance Parameter</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({activeComparisonFields.length} active)
                    </span>
                  </div>
                  <div className="col-span-4 text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{profileA.cityName} ({profileA.id})</span>
                  </div>
                  <div className="col-span-4 text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>{profileB.cityName} ({profileB.id})</span>
                  </div>
                </div>

                {/* Section Nodal Authority Info */}
                <div className="grid grid-cols-12 p-3 bg-slate-50/70 dark:bg-slate-950/60 items-center">
                  <div className="col-span-4 text-slate-500 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Nodal Municipal Authority</span>
                  </div>
                  <div className="col-span-4 font-bold text-slate-900 dark:text-white pr-2">
                    {profileA.corporationName}
                  </div>
                  <div className="col-span-4 font-bold text-slate-900 dark:text-white pr-2">
                    {profileB.corporationName}
                  </div>
                </div>

                {/* Iterate through categories & rules */}
                {categoriesInUse.map((catLabel) => {
                  const catFields = activeComparisonFields.filter(
                    (f) => f.categoryLabel === catLabel
                  );

                  return (
                    <React.Fragment key={catLabel}>
                      {/* Category Separator Header */}
                      <div className="px-3.5 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 border-t border-b border-slate-200 dark:border-slate-800">
                        <span>{catLabel}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 font-mono">
                          {catFields.length} rules
                        </span>
                      </div>

                      {/* Rule Rows */}
                      {catFields.map((field, idx) => {
                        const ruleA =
                          profileA.domainRules?.[selectedDomain]?.[field.key];
                        const ruleB =
                          profileB.domainRules?.[selectedDomain]?.[field.key];

                        const isEven = idx % 2 === 0;

                        return (
                          <div
                            key={field.key}
                            className={`grid grid-cols-12 p-3.5 items-start gap-2 transition-colors ${
                              isEven
                                ? "bg-white dark:bg-slate-900"
                                : "bg-slate-50/40 dark:bg-slate-950/40"
                            }`}
                          >
                            {/* Column 1: Field Name & Help */}
                            <div className="col-span-4 pr-2">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{field.label}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {field.description}
                              </p>
                            </div>

                            {/* Column 2: City A Rule */}
                            <div className="col-span-4 pr-2 space-y-1">
                              {ruleA ? (
                                <>
                                  <div className="flex items-start gap-1.5">
                                    {ruleA.highlight === "better" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                                        Fast-Track / Concession
                                      </span>
                                    )}
                                    {ruleA.highlight === "strict" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shrink-0">
                                        Mandatory Norm
                                      </span>
                                    )}
                                    {ruleA.highlight === "warning" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 shrink-0">
                                        High Tariff / SLA
                                      </span>
                                    )}
                                  </div>

                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {ruleA.value}
                                  </div>

                                  {ruleA.details && (
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                      {ruleA.details}
                                    </p>
                                  )}

                                  {ruleA.statutoryReference && (
                                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono flex items-center gap-1 pt-0.5">
                                      <FileText className="w-2.5 h-2.5" />
                                      <span>{ruleA.statutoryReference}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-400 italic">Not applicable</span>
                              )}
                            </div>

                            {/* Column 3: City B Rule */}
                            <div className="col-span-4 pr-2 space-y-1">
                              {ruleB ? (
                                <>
                                  <div className="flex items-start gap-1.5">
                                    {ruleB.highlight === "better" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                                        Fast-Track / Concession
                                      </span>
                                    )}
                                    {ruleB.highlight === "strict" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shrink-0">
                                        Mandatory Norm
                                      </span>
                                    )}
                                    {ruleB.highlight === "warning" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 shrink-0">
                                        High Tariff / SLA
                                      </span>
                                    )}
                                  </div>

                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {ruleB.value}
                                  </div>

                                  {ruleB.details && (
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                      {ruleB.details}
                                    </p>
                                  )}

                                  {ruleB.statutoryReference && (
                                    <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1 pt-0.5">
                                      <FileText className="w-2.5 h-2.5" />
                                      <span>{ruleB.statutoryReference}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-400 italic">Not applicable</span>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}

                {/* Direct Single Window Portals Footer Row */}
                <div className="grid grid-cols-12 p-3.5 bg-slate-100 dark:bg-slate-950/80 items-center border-t border-slate-200 dark:border-slate-800">
                  <div className="col-span-4 text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>State Single Window Fast-Track</span>
                  </div>
                  <div className="col-span-4">
                    <a
                      href={profileA.singleWindowPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>{profileA.cityName} Single Window</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="col-span-4">
                    <a
                      href={profileB.singleWindowPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>{profileB.cityName} Single Window</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Verified against Municipal Corporation Act Gazette notifications (2026).
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Configure Fields
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                Close Diff Engine
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 SLIDE-OUT DOMAIN & FIELD SELECTION DRAWER */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-60 overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsDrawerOpen(false);
          }}
        >
          {/* Drawer Backdrop */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in" />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">
                      Field & Domain Drawer
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Choose your industry and toggle comparison parameters.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
                
                {/* SECTION 1: DOMAIN SELECTOR */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      1. Select Target Industry / Domain
                    </label>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      6 Sectors
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(MUNICIPAL_DOMAINS) as MunicipalDomainId[]).map((domId) => {
                      const meta = MUNICIPAL_DOMAINS[domId];
                      const isSelected = selectedDomain === domId;
                      return (
                        <div
                          key={domId}
                          onClick={() => {
                            setSelectedDomain(domId);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-400/30"
                              : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="text-xl p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                            {meta.emoji}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                                {meta.label}
                              </h5>
                              {isSelected && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-600 text-white font-bold shrink-0">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {meta.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: RULE PARAMETER FILTERS */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      2. Filter Specific Rule Fields
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {activeComparisonFields.length} of {allDomainFields.length} enabled
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fieldSearchQuery}
                      onChange={(e) => setFieldSearchQuery(e.target.value)}
                      placeholder={`Search ${currentDomainMeta.shortLabel} fields...`}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { id: "all", label: "All" },
                      { id: "sla", label: "⏱️ SLAs" },
                      { id: "fee", label: "💰 Fees" },
                      { id: "noc", label: "🛡️ NOCs" },
                      { id: "zoning", label: "📐 Zoning" },
                      { id: "compliance", label: "📜 Permissibility" },
                      { id: "subsidy", label: "🎁 Grants" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                          selectedCategoryFilter === cat.id
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Bulk Selection Actions */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      type="button"
                      onClick={handleSelectAllFields}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      ✓ Select All ({allDomainFields.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllFields}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Checkbox List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {filteredDrawerFields.map((field) => {
                      const isChecked = selectedFields[field.key] !== false;
                      return (
                        <div
                          key={field.key}
                          onClick={() => toggleField(field.key)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isChecked
                              ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800"
                              : "bg-slate-50/50 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 opacity-60"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                              isChecked
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                {field.label}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                {field.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                              {field.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAllFields}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply & View Diff ({activeComparisonFields.length} fields)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
