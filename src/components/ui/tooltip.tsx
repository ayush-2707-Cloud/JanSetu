"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * Lightweight CSS-only tooltip using group-hover.
 * No JS dependencies — works with keyboard focus too.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  className,
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className={cn("relative inline-flex group", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "absolute z-50 px-2.5 py-1.5 text-[11px] font-medium text-white bg-slate-900 rounded-lg shadow-lg",
          "opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible",
          "transition-all duration-150 whitespace-nowrap pointer-events-none",
          positionClasses[side]
        )}
      >
        {content}
        {/* Arrow */}
        <span
          className={cn(
            "absolute w-2 h-2 bg-slate-900 rotate-45",
            side === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
            side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
            side === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
            side === "right" && "right-full top-1/2 -translate-y-1/2 -mr-1"
          )}
        />
      </span>
    </span>
  );
};
