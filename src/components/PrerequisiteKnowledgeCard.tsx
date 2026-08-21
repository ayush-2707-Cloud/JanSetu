"use client";

import React from "react";
import { Lightbulb, ExternalLink, ChevronRight } from "lucide-react";
import { PrerequisiteKnowledge, Language } from "@/types/journey";

interface PrerequisiteKnowledgeCardProps {
  prerequisites: PrerequisiteKnowledge[];
  language: Language;
}

/**
 * "Things You Should Know Before Starting" cards.
 * Shows prerequisite knowledge, eligibility criteria, and "learn more" links.
 */
export const PrerequisiteKnowledgeCard: React.FC<PrerequisiteKnowledgeCardProps> = ({
  prerequisites,
  language,
}) => {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === "HI"
            ? "शुरू करने से पहले जानने योग्य बातें"
            : language === "KN"
            ? "ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ತಿಳಿಯಬೇಕಾದ ವಿಷಯಗಳು"
            : "Things to Know Before Starting"}
        </h4>
      </div>

      <div className="space-y-2">
        {prerequisites.map((prereq) => {
          const title =
            language === "HI" && prereq.titleHi
              ? prereq.titleHi
              : language === "KN" && prereq.titleKn
              ? prereq.titleKn
              : prereq.title;

          const description =
            language === "HI" && prereq.descriptionHi
              ? prereq.descriptionHi
              : language === "KN" && prereq.descriptionKn
              ? prereq.descriptionKn
              : prereq.description;

          return (
            <div
              key={prereq.id}
              className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl space-y-2"
            >
              <h5 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {title}
              </h5>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                {description}
              </p>

              {prereq.learnMoreUrl && (
                <a
                  href={prereq.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold pl-5"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>
                    {language === "HI"
                      ? "और जानें"
                      : language === "KN"
                      ? "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ"
                      : "Learn More"}
                  </span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
