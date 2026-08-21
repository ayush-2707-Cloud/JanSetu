"use client";

import React, { useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { journeyService } from "@/services/api";

export interface ChoiceChipOption {
  label: string;
  journey_id: string;
  description: string;
}

interface ChoiceChipsProps {
  prompt?: string;
  options: ChoiceChipOption[];
  onSelect?: (option: ChoiceChipOption) => void;
}

export const ChoiceChips: React.FC<ChoiceChipsProps> = ({
  prompt,
  options,
  onSelect,
}) => {
  const { selectJourneyById, setChoiceChipsData } = useJourney();

  // Pre-fetch candidate blueprints in the background for zero-latency switching
  useEffect(() => {
    if (options && options.length > 0) {
      options.forEach((opt) => {
        journeyService.prefetch(opt.journey_id);
      });
    }
  }, [options]);

  const handleChipClick = (option: ChoiceChipOption) => {
    // Clear chips immediately for smooth transition
    setChoiceChipsData(null);
    // Navigate to the selected journey instantly from local cache
    selectJourneyById(option.journey_id);
    // Callback for external handlers
    onSelect?.(option);
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="w-full animate-fadeIn">
      {/* Prompt Header */}
      {prompt && (
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-semibold text-amber-200/90">{prompt}</p>
        </div>
      )}

      {/* Choice Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((option, index) => (
          <button
            key={option.journey_id}
            type="button"
            onMouseEnter={() => journeyService.prefetch(option.journey_id)}
            onClick={() => handleChipClick(option)}
            className="group relative text-left px-4 py-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent
              border-blue-500/30 hover:border-blue-400/60
              hover:bg-gradient-to-br hover:from-blue-500/15 hover:via-indigo-500/10 hover:to-transparent
              shadow-lg hover:shadow-blue-500/20"
            style={{
              animationDelay: `${index * 80}ms`,
              animation: "slideUpFade 0.35s ease-out forwards",
              opacity: 0,
            }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white/95 group-hover:text-blue-200 transition-colors truncate">
                  {option.label}
                </h4>
                <p className="text-[11px] text-blue-200/60 mt-1 line-clamp-2 leading-relaxed">
                  {option.description}
                </p>
              </div>
              <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-blue-500/20 text-blue-300/70 group-hover:text-blue-200 group-hover:bg-blue-500/30 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default ChoiceChips;
