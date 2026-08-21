"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Accordion Root ──

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  type = "single",
  defaultOpen = [],
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === "single") next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// ── Accordion Item ──

interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const AccordionItemContext = React.createContext<{ id: string; isOpen: boolean } | undefined>(undefined);

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className }) => {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");

  const isOpen = ctx.openItems.has(id);

  return (
    <AccordionItemContext.Provider value={{ id, isOpen }}>
      <div className={cn("", className)} data-state={isOpen ? "open" : "closed"}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// ── Accordion Trigger ──

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className, icon }) => {
  const ctx = React.useContext(AccordionContext);
  const itemCtx = React.useContext(AccordionItemContext);
  if (!ctx || !itemCtx) throw new Error("AccordionTrigger must be used within AccordionItem");

  return (
    <button
      onClick={() => ctx.toggleItem(itemCtx.id)}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-slate-900",
        "hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
        className
      )}
      aria-expanded={itemCtx.isOpen}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200",
          itemCtx.isOpen && "rotate-180"
        )}
      />
    </button>
  );
};

// ── Accordion Content ──

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className }) => {
  const itemCtx = React.useContext(AccordionItemContext);
  if (!itemCtx) throw new Error("AccordionContent must be used within AccordionItem");

  if (!itemCtx.isOpen) return null;

  return (
    <div
      className={cn("px-4 pb-4 text-xs text-slate-700 leading-relaxed animate-in fade-in slide-in-from-top-1", className)}
      role="region"
    >
      {children}
    </div>
  );
};
