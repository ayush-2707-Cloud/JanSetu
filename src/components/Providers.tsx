"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { JourneyProvider } from "@/context/JourneyContext";
import { InstructionDrawer } from "@/components/InstructionDrawer";
import { DigiLockerModal } from "@/components/DigiLockerModal";
import { DPDPConsentModal } from "@/components/DPDPConsentModal";
import { LanguageWelcomeModal } from "@/components/LanguageWelcomeModal";
import { FloatingDemoController } from "@/components/FloatingDemoController";
import { VoiceCopilotFloatingBar } from "@/components/VoiceCopilotFloatingBar";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <JourneyProvider>
          {children}
          <InstructionDrawer />
          <DigiLockerModal />
          <DPDPConsentModal />
          <LanguageWelcomeModal />
          <FloatingDemoController />
          <VoiceCopilotFloatingBar />
        </JourneyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
