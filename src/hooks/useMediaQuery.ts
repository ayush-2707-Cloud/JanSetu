"use client";

import { useState, useEffect } from "react";

/**
 * Detects whether a CSS media query matches.
 * Useful for responsive logic in components (e.g., show/hide sidebar on mobile).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Pre-built responsive breakpoints matching Tailwind defaults */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)") && !useMediaQuery("(min-width: 1024px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
