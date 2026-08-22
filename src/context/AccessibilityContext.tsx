"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ContrastMode = "standard" | "high-contrast-dark" | "yellow-on-black";
export type FontSizeScale = "90%" | "100%" | "115%" | "130%";

interface AccessibilityContextType {
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  isDyslexic: boolean;
  setIsDyslexic: (val: boolean | ((prev: boolean) => boolean)) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isToolbarVisible: boolean;
  setIsToolbarVisible: (val: boolean) => void;
  isMobilePhoneOpen: boolean;
  setIsMobilePhoneOpen: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contrastMode, setContrastMode] = useState<ContrastMode>("standard");
  const [fontSize, setFontSize] = useState<FontSizeScale>("100%");
  const [isDyslexic, setIsDyslexic] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);
  const [isMobilePhoneOpen, setIsMobilePhoneOpen] = useState<boolean>(false);

  // Apply root document style updates
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Remove previous classes
    root.classList.remove("hc-yellow", "hc-dark", "font-dyslexic");

    if (contrastMode === "yellow-on-black") {
      root.classList.add("hc-yellow");
    } else if (contrastMode === "high-contrast-dark") {
      root.classList.add("hc-dark");
    }

    if (isDyslexic) {
      root.classList.add("font-dyslexic");
    }

    root.style.fontSize = fontSize;
  }, [contrastMode, fontSize, isDyslexic]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-IN";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        contrastMode,
        setContrastMode,
        fontSize,
        setFontSize,
        isDyslexic,
        setIsDyslexic,
        speakText,
        stopSpeaking,
        isSpeaking,
        isToolbarVisible,
        setIsToolbarVisible,
        isMobilePhoneOpen,
        setIsMobilePhoneOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
