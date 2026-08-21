import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "active" | "locked";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
    outline: "text-slate-950 border border-slate-200",
    success: "border-emerald-300 bg-emerald-100 text-emerald-800 font-bold",
    active: "border-blue-300 bg-blue-100 text-blue-800 font-bold animate-pulse",
    locked: "border-slate-300 bg-slate-200 text-slate-700 font-medium",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };
