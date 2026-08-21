"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "system" | "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  // Read saved preference or default to system
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("legalpath_theme") as Theme | null;
      if (savedTheme && ["system", "dark", "light"].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Compute resolved theme based on current setting and system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (theme === "system") {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === "dark";
      }

      const active = isDark ? "dark" : "light";
      setResolvedTheme(active);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.colorScheme = active;
    };

    applyTheme();

    const listener = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("legalpath_theme", newTheme);
    } catch {
      // Ignore
    }
  };

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
