"use client";

import React from "react";
import { ArrowRight, Compass, Clock, FileText, ChevronRight } from "lucide-react";
import { UniversalJourney, Language } from "@/types/journey";

interface RelatedJourneysSectionProps {
  /** Current journey (used to look up relatedJourneyIds) */
  currentJourney: UniversalJourney;
  /** Full catalogue of journeys to resolve related IDs */
  allJourneys: UniversalJourney[];
  /** Callback when user clicks a related journey card */
  onSelectJourney: (journeyId: string) => void;
  language: Language;
  className?: string;
}

const i18n = {
  EN: {
    heading: "You Might Also Need",
    subheading: "Related legal processes people often complete together",
    steps: "steps",
    viewJourney: "View Journey",
    noRelated: "No related journeys found.",
  },
  HI: {
    heading: "आपको इसकी भी ज़रूरत हो सकती है",
    subheading: "संबंधित कानूनी प्रक्रियाएँ जो लोग अक्सर साथ में पूरी करते हैं",
    steps: "चरण",
    viewJourney: "यात्रा देखें",
    noRelated: "कोई संबंधित यात्रा नहीं मिली।",
  },
  KN: {
    heading: "ನಿಮಗೆ ಇದೂ ಬೇಕಾಗಬಹುದು",
    subheading: "ಜನರು ಒಟ್ಟಿಗೆ ಪೂರ್ಣಗೊಳಿಸುವ ಸಂಬಂಧಿತ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆಗಳು",
    steps: "ಹಂತಗಳು",
    viewJourney: "ಪ್ರಯಾಣ ನೋಡಿ",
    noRelated: "ಸಂಬಂಧಿತ ಪ್ರಯಾಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
  },
};

/**
 * Cross-referenced "You might also need" section.
 * Resolves relatedJourneyIds from the current journey and renders
 * clickable cards for each related process.
 */
export const RelatedJourneysSection: React.FC<RelatedJourneysSectionProps> = ({
  currentJourney,
  allJourneys,
  onSelectJourney,
  language,
  className,
}) => {
  const t = (i18n as Record<string, typeof i18n.EN>)[language] || i18n.EN;

  // Resolve related journeys from IDs
  const relatedIds = currentJourney.relatedJourneyIds || [];
  const relatedJourneys = relatedIds
    .map((id) => allJourneys.find((j) => j.journeyId === id))
    .filter(Boolean) as UniversalJourney[];

  if (relatedJourneys.length === 0) return null;

  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.heading}
        </h4>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1">
        {t.subheading}
      </p>

      {/* Related Journey Cards */}
      <div className="grid gap-2">
        {relatedJourneys.map((journey) => {
          const title =
            language === "HI" && journey.titleHi
              ? journey.titleHi
              : language === "KN" && journey.titleKn
              ? journey.titleKn
              : journey.title;

          const desc =
            language === "HI" && journey.descriptionHi
              ? journey.descriptionHi
              : language === "KN" && journey.descriptionKn
              ? journey.descriptionKn
              : journey.description;

          const completedSteps = journey.steps.filter(
            (s) => s.status === "COMPLETED"
          ).length;

          return (
            <button
              key={journey.journeyId}
              onClick={() => onSelectJourney(journey.journeyId)}
              className="group w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Category badge */}
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md mb-1.5">
                    {journey.category}
                  </span>

                  {/* Title */}
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors leading-snug truncate">
                    {title}
                  </h5>

                  {/* Description (truncated) */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {journey.steps.length} {t.steps}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {journey.estimatedDuration}
                    </span>
                    {completedSteps > 0 && (
                      <span className="text-emerald-500 font-bold">
                        {completedSteps}/{journey.steps.length} ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="shrink-0 mt-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                </div>
              </div>

              {/* Progress bar */}
              {journey.overallProgressPercentage > 0 && (
                <div className="mt-2.5">
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                      style={{ width: `${journey.overallProgressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
