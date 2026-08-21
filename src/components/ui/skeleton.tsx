import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width in Tailwind class e.g. "w-32", "w-full" */
  width?: string;
  /** Height in Tailwind class e.g. "h-4", "h-12" */
  height?: string;
  /** Whether it's a circle (e.g., avatar) */
  circle?: boolean;
}

/**
 * Loading skeleton placeholder with shimmer animation.
 * Use during data fetching to indicate content shape.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = "w-full",
  height = "h-4",
  circle = false,
  ...props
}) => (
  <div
    className={cn(
      "animate-pulse bg-slate-200/80",
      circle ? "rounded-full" : "rounded-lg",
      width,
      height,
      className
    )}
    aria-hidden="true"
    {...props}
  />
);

/** Pre-composed skeleton for a card layout */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-gov-card", className)}>
    <div className="flex items-start gap-3">
      <Skeleton circle width="w-10" height="h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton width="w-24" height="h-3" />
        <Skeleton width="w-48" height="h-5" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton height="h-3" />
      <Skeleton width="w-3/4" height="h-3" />
    </div>
    <div className="flex items-center gap-3 pt-2">
      <Skeleton width="w-20" height="h-6" />
      <Skeleton width="w-28" height="h-6" />
    </div>
  </div>
);

/** Pre-composed skeleton for step/timeline items */
export const SkeletonStep: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex gap-4 p-5", className)}>
    <Skeleton circle width="w-10" height="h-10" />
    <div className="flex-1 space-y-3">
      <Skeleton width="w-32" height="h-3" />
      <Skeleton width="w-64" height="h-5" />
      <Skeleton height="h-3" />
      <Skeleton width="w-3/5" height="h-3" />
    </div>
  </div>
);
