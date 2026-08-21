"use client";

import React, { useState, useMemo } from "react";
import { 
  Rocket, 
  GraduationCap, 
  Plane, 
  Landmark, 
  Home, 
  Fingerprint, 
  Utensils, 
  Laptop, 
  Store, 
  Ship, 
  Globe2, 
  Coins, 
  BookOpen, 
  Briefcase, 
  Compass, 
  MapPin, 
  CreditCard, 
  FileCheck, 
  TrendingUp, 
  Key, 
  Map, 
  BadgeCheck, 
  Award,
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  ExternalLink
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { legalDomains, getDomainById } from "@/data/domains";
import { LegalDomain, LegalDomainSubcategory, GoalActivityTrack } from "@/types/journey";

interface CascadingCategoryNavProps {
  onSelectJourney?: (journeyId: string) => void;
}

export const CascadingCategoryNav: React.FC<CascadingCategoryNavProps> = ({ onSelectJourney }) => {
  const { 
    language, 
    selectJourneyById,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId
  } = useJourney();

  const selectedDomainId = selectedCategoryId === "ALL" ? null : selectedCategoryId;
  const selectedSubcatId = selectedSubcategoryId === "ALL" ? null : selectedSubcategoryId;

  const setSelectedDomainId = (catId: string | null) => {
    setSelectedCategoryId(catId || "ALL");
    if (!catId) {
      setSelectedSubcategoryId("ALL");
    }
  };

  const setSelectedSubcatId = (subId: string | null) => {
    setSelectedSubcategoryId(subId || "ALL");
  };

  // Helper icon resolver
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Rocket": return <Rocket className={className} />;
      case "GraduationCap": return <GraduationCap className={className} />;
      case "Plane": return <Plane className={className} />;
      case "Landmark": return <Landmark className={className} />;
      case "Home": return <Home className={className} />;
      case "Fingerprint": return <Fingerprint className={className} />;
      case "Utensils": return <Utensils className={className} />;
      case "Laptop": return <Laptop className={className} />;
      case "Store": return <Store className={className} />;
      case "Ship": return <Ship className={className} />;
      case "Globe2": return <Globe2 className={className} />;
      case "Coins": return <Coins className={className} />;
      case "BookOpen": return <BookOpen className={className} />;
      case "Briefcase": return <Briefcase className={className} />;
      case "Compass": return <Compass className={className} />;
      case "MapPin": return <MapPin className={className} />;
      case "CreditCard": return <CreditCard className={className} />;
      case "FileCheck": return <FileCheck className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      case "Key": return <Key className={className} />;
      case "Map": return <Map className={className} />;
      case "BadgeCheck": return <BadgeCheck className={className} />;
      case "Award": return <Award className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const selectedDomain = useMemo(() => {
    return selectedDomainId ? getDomainById(selectedDomainId) : null;
  }, [selectedDomainId]);

  const selectedSubcategory = useMemo(() => {
    if (!selectedDomain || !selectedSubcatId) return null;
    return selectedDomain.subcategories.find((s) => s.id === selectedSubcatId) || null;
  }, [selectedDomain, selectedSubcatId]);

  const handleLaunchActivity = (activity: GoalActivityTrack) => {
    if (activity.journeyId) {
      if (onSelectJourney) {
        onSelectJourney(activity.journeyId);
      } else {
        selectJourneyById(activity.journeyId);
      }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* 1. Header & Interactive Cascading Breadcrumb Navigator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          {/* Back button appears smoothly when inside a category/subcategory */}
          {(selectedDomainId || selectedSubcatId) && (
            <button
              onClick={() => {
                if (selectedSubcatId) {
                  setSelectedSubcatId(null);
                } else if (selectedDomainId) {
                  setSelectedDomainId(null);
                }
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/60 dark:hover:border-blue-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center animate-in fade-in zoom-in-95"
              aria-label="Go back to previous category"
              title={selectedSubcatId ? "Back to Subcategories" : "Back to All Categories"}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Goal Categories & Sub-Categories
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a category to explore specialized sub-categories and statutory activity tracks.
            </p>
          </div>
        </div>

        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold flex-wrap bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setSelectedDomainId(null);
              setSelectedSubcatId(null);
            }}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              !selectedDomainId ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            All Categories
          </button>

          {selectedDomain && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setSelectedSubcatId(null)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  !selectedSubcatId ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {language === "HI" && selectedDomain.nameHi
                  ? selectedDomain.nameHi
                  : language === "KN" && selectedDomain.nameKn
                  ? selectedDomain.nameKn
                  : selectedDomain.name}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {language === "HI" && selectedSubcategory.nameHi
                  ? selectedSubcategory.nameHi
                  : language === "KN" && selectedSubcategory.nameKn
                  ? selectedSubcategory.nameKn
                  : selectedSubcategory.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. LEVEL 1: General Category Grid (when no domain is selected) */}
      {!selectedDomain && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Choose a Category ({legalDomains.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalDomains.map((domain) => {
              const localizedTitle =
                language === "HI" && domain.nameHi
                  ? domain.nameHi
                  : language === "KN" && domain.nameKn
                  ? domain.nameKn
                  : domain.name;

              const localizedDesc =
                language === "HI" && domain.descriptionHi
                  ? domain.descriptionHi
                  : language === "KN" && domain.descriptionKn
                  ? domain.descriptionKn
                  : domain.description;

              const totalActivities = domain.subcategories.reduce(
                (acc, sub) => acc + (sub.activities?.length || 0),
                0
              );

              return (
                <div
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomainId(domain.id);
                    setSelectedSubcatId(null);
                  }}
                  className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${domain.bgGradient} text-white shadow-md group-hover:scale-105 transition-transform`}>
                        {renderIcon(domain.iconName, "w-6 h-6")}
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {domain.subcategories.length} Sub-Categories
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {localizedTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {localizedDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {totalActivities} Actionable Tracks
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LEVEL 2: Sub-Categories (when Domain is selected, but no Subcategory) */}
      {selectedDomain && !selectedSubcategory && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDomainId(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Category</span>
              </button>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Sub-Categories under &quot;{selectedDomain.name}&quot;
              </span>
            </div>

            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {selectedDomain.subcategories.length} Sub-Categories Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {selectedDomain.subcategories.map((subcat) => {
              const localizedTitle =
                language === "HI" && subcat.nameHi
                  ? subcat.nameHi
                  : language === "KN" && subcat.nameKn
                  ? subcat.nameKn
                  : subcat.name;

              const activityCount = subcat.activities?.length || 0;

              return (
                <div
                  key={subcat.id}
                  onClick={() => setSelectedSubcatId(subcat.id)}
                  className="group p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedDomain.bgGradient} text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-200 shrink-0`}>
                      {renderIcon(subcat.iconName || "Layers", "w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {localizedTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {subcat.description || "Specialized statutory roadmaps and operational compliance tracks."}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                          {activityCount} Specific Activities
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    <span className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-colors inline-block">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. LEVEL 3: Actionable Activity Tracks (when Subcategory is selected) */}
      {selectedDomain && selectedSubcategory && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSubcatId(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sub-Categories</span>
              </button>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Roadmaps under &quot;{selectedSubcategory.name}&quot;
              </span>
            </div>

            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {selectedSubcategory.activities?.length || 0} Roadmaps Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedSubcategory.activities || []).map((activity) => {
              const localizedTitle =
                language === "HI" && activity.nameHi
                  ? activity.nameHi
                  : language === "KN" && activity.nameKn
                  ? activity.nameKn
                  : activity.name;

              const localizedDesc =
                language === "HI" && activity.descriptionHi
                  ? activity.descriptionHi
                  : language === "KN" && activity.descriptionKn
                  ? activity.descriptionKn
                  : activity.description;

              const hasExecutableRoadmap = Boolean(activity.journeyId);

              return (
                <div
                  key={activity.id}
                  onClick={() => handleLaunchActivity(activity)}
                  className={`group p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    hasExecutableRoadmap
                      ? "border-blue-300 dark:border-blue-800/80 bg-white dark:bg-slate-900 hover:border-blue-600 dark:hover:border-blue-500 shadow-md hover:shadow-xl cursor-pointer"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 opacity-80 cursor-default"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                        {activity.badgeText || "Statutory Track"}
                      </span>
                      {activity.isPopular && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-900/60 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Popular</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {localizedTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                        {localizedDesc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                      {activity.estimatedSteps && (
                        <span className="flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{activity.estimatedSteps} Steps</span>
                        </span>
                      )}
                      {activity.estimatedDuration && (
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>{activity.estimatedDuration}</span>
                        </span>
                      )}
                    </div>

                    {hasExecutableRoadmap ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchActivity(activity);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all group-hover:scale-[1.02]"
                      >
                        <span>Launch Full Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-[11px] text-center text-slate-400 font-medium py-1">
                        Blueprint Registry Active (Ready to Deploy)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
