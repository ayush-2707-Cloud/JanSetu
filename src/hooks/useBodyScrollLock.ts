"use client";

import { useEffect, useId } from "react";

// Idempotent Set of active lock IDs to prevent reference count desync
const activeLockIds = new Set<string>();

function applyBodyLock(): void {
  if (typeof document === "undefined") return;

  if (activeLockIds.size > 0) {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overscrollBehavior = "contain";
  } else {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("touch-action");
    document.documentElement.style.removeProperty("overscroll-behavior");
    // Ensure inline style fallback is cleared
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
  }
}

/**
 * Universal Hook to lock body scroll and prevent background viewport jumping or scrolling
 * when modals, drawers, or dialog overlays are mounted.
 *
 * Uses idempotent Set tracking by unique React ID to guarantee 100% reliable unlock
 * when modals or drawers close or unmount.
 */
export function useBodyScrollLock(isLocked: boolean = true): void {
  const lockId = useId();

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isLocked) {
      activeLockIds.add(lockId);
    } else {
      activeLockIds.delete(lockId);
    }

    applyBodyLock();

    return () => {
      activeLockIds.delete(lockId);
      applyBodyLock();
    };
  }, [isLocked, lockId]);
}
