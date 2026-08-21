"use client";

import React from "react";
import { Scale } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface LegalReferenceChipProps {
  reference: string; // e.g., "Sec. 138, NI Act 1881"
  tooltip?: string;  // Plain-language explanation
  className?: string;
}

/**
 * Inline chip that references a legal act or section number.
 * Hoverable tooltip shows a plain-language explanation.
 */
export const LegalReferenceChip: React.FC<LegalReferenceChipProps> = ({
  reference,
  tooltip,
  className,
}) => {
  const chip = (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md cursor-help select-none ${className || ""}`}
    >
      <Scale className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
      <span>{reference}</span>
    </span>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} side="top">
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

/** Render a list of legal references as inline chips */
interface LegalReferencesListProps {
  references: string[];
  className?: string;
}

export const LegalReferencesList: React.FC<LegalReferencesListProps> = ({
  references,
  className,
}) => {
  if (!references || references.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className || ""}`}>
      {references.map((ref, idx) => (
        <LegalReferenceChip key={idx} reference={ref} />
      ))}
    </div>
  );
};
