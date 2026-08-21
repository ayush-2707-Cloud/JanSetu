"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

// ── Tabs Root ──

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
  onChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className, onChange }) => {
  const [activeTab, setActiveTabState] = React.useState(defaultValue);

  const setActiveTab = (id: string) => {
    setActiveTabState(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// ── Tab List ──

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({ children, className }) => (
  <div
    role="tablist"
    className={cn(
      "flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto",
      className
    )}
  >
    {children}
  </div>
);

// ── Tab Trigger ──

interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({ value, children, icon, className }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabTrigger must be used within Tabs");

  const isActive = ctx.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "py-2 px-3 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5",
        isActive
          ? "bg-white text-blue-700 shadow-xs"
          : "text-slate-600 hover:text-slate-900",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// ── Tab Content ──

interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({ value, children, className }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabContent must be used within Tabs");

  if (ctx.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("animate-in fade-in pt-4", className)}
    >
      {children}
    </div>
  );
};
