"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Contextual breadcrumb navigation.
 * Example: Home → Business → Company Registration → Step 3
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto ${className || ""}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {isFirst && !item.label.toLowerCase().includes("home") && (
              <>
                <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
              </>
            )}

            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium whitespace-nowrap transition-colors"
              >
                {item.label}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium whitespace-nowrap transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="whitespace-nowrap">{item.label}</span>
            )}

            {!isLast && (
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
