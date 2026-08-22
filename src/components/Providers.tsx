"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { JourneyProvider } from "@/context/JourneyContext";
import { InstructionDrawer } from "@/components/InstructionDrawer";
import { DigiLockerModal } from "@/components/DigiLockerModal";
import { DPDPConsentModal } from "@/components/DPDPConsentModal";
import { LanguageWelcomeModal } from "@/components/LanguageWelcomeModal";
import { FloatingDemoController } from "@/components/FloatingDemoController";
import { VoiceCopilotFloatingBar } from "@/components/VoiceCopilotFloatingBar";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import MobilePhoneMockup from "@/components/MobilePhoneMockup";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <JourneyProvider>
              {children}
              <InstructionDrawer />
              <DigiLockerModal />
              <DPDPConsentModal />
              <LanguageWelcomeModal />
              <FloatingDemoController />
              <VoiceCopilotFloatingBar />
              <AccessibilityToolbar />
              <MobilePhoneMockup />
            </JourneyProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
};
