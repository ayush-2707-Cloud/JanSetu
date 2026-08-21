"use client";

import { useCallback } from "react";
import { useJourney } from "@/context/JourneyContext";
import { CopilotAction, CopilotActionType } from "@/services/api";

export interface ToolCallAction {
  name: string; // e.g. "load_journey", "open_step_drawer", "trigger_consent_modal", "LOAD_JOURNEY"
  arguments: Record<string, any>;
  description?: string;
}

/**
 * useActionDispatcher
 *
 * Intercepts structured tool calls emitted by the Gemini Copilot backend
 * and automatically updates local application state:
 * - 'load_journey' / 'LOAD_JOURNEY': updates active roadmap & switches to ROADMAP screen
 * - 'open_step_drawer' / 'OPEN_STEP' / 'OPEN_DRAWER': opens side panel for target milestone step
 * - 'trigger_consent_modal' / 'TRIGGER_CONSENT': opens the DPDP consent dialog
 * - 'scroll_to_node' / 'SCROLL_TO_NODE': smooth-scrolls step into viewport
 * - 'switch_language' / 'SWITCH_LANGUAGE': switches portal language ('EN', 'HI', 'KN')
 * - 'highlight_element' / 'HIGHLIGHT_ELEMENT': triggers glowing ring highlight
 */
export function useActionDispatcher() {
  const {
    selectJourneyById,
    setActiveScreen,
    openStepDrawer,
    triggerConsentFlow,
    openDigiLockerModal,
    setLanguage,
    executeCopilotAction,
    setChoiceChipsData,
  } = useJourney();

  const dispatchToolAction = useCallback(
    async (toolAction: ToolCallAction | CopilotAction): Promise<{ success: boolean; message: string }> => {
      const actionName = (
        ("name" in toolAction ? toolAction.name : toolAction.action_type) || ""
      ).toLowerCase();

      const payload = "arguments" in toolAction ? toolAction.arguments : toolAction.payload || {};
      const description = toolAction.description || `Executed ${actionName}`;

      console.log(`[ActionDispatcher] Intercepted tool call: ${actionName}`, payload);

      switch (actionName) {
        // 1. load_journey -> updates active roadmap
        case "load_journey":
        case "loadjourney":
        case "load_roadmap": {
          const journeyId = payload.journey_id || payload.journeyId || payload.id;
          if (journeyId) {
            selectJourneyById(journeyId);
            setActiveScreen("ROADMAP");
            return {
              success: true,
              message: `Loaded roadmap: ${journeyId}`,
            };
          }
          break;
        }

        // 2. open_step_drawer -> opens the side panel for that step
        case "open_step_drawer":
        case "openstepdrawer":
        case "open_step":
        case "open_drawer": {
          const stepId = payload.step_id || payload.stepId || payload.id;
          if (stepId) {
            openStepDrawer(stepId);
            return {
              success: true,
              message: `Opened side panel for step: ${stepId}`,
            };
          }
          break;
        }

        // 3. trigger_consent_modal -> opens the DPDP consent dialog
        case "trigger_consent_modal":
        case "triggerconsentmodal":
        case "trigger_consent": {
          const docType = payload.doc_type || payload.docType || "Statutory Document";
          const purpose = payload.purpose || `DPDP Act 2023 Statutory Verification for ${docType}`;
          const stepId = payload.step_id || payload.stepId;

          triggerConsentFlow(docType, purpose, () => {
            if (stepId) {
              openDigiLockerModal(stepId);
            }
          });

          return {
            success: true,
            message: `Triggered DPDP consent modal for: ${docType}`,
          };
        }

        // 4. scroll_to_node -> scrolls step into viewport center
        case "scroll_to_node":
        case "scrolltonode": {
          const stepId = payload.step_id || payload.stepId;
          if (stepId && typeof window !== "undefined") {
            setTimeout(() => {
              const el =
                document.getElementById(stepId) ||
                document.querySelector(`[data-step-id="${stepId}"]`);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 300);
            return {
              success: true,
              message: `Scrolled to step node: ${stepId}`,
            };
          }
          break;
        }

        // 5. switch_language -> switches interface language
        case "switch_language":
        case "switchlanguage": {
          const lang = (payload.lang || payload.language || "EN").toUpperCase();
          if (["EN", "HI", "KN", "BN", "TE", "TA", "MR", "GU", "ML", "PA", "OR"].includes(lang)) {
            setLanguage(lang as any);
            return {
              success: true,
              message: `Switched language to: ${lang}`,
            };
          }
          break;
        }
        // 6. show_choice_chips -> presents interactive journey choices
        case "show_choice_chips":
        case "showchoicechips": {
          if (payload.options && Array.isArray(payload.options)) {
            setChoiceChipsData(payload.options);
            return {
              success: true,
              message: payload.prompt || "Displayed choice options",
            };
          }
          break;
        }
        default: {
          // Fallback to JourneyContext executeCopilotAction for standard enum actions
          try {
            await executeCopilotAction(toolAction as CopilotAction);
            return {
              success: true,
              message: description,
            };
          } catch (err) {
            console.warn(`[ActionDispatcher] Unhandled action: ${actionName}`, err);
          }
          break;
        }
      }

      return {
        success: false,
        message: `Unknown or incomplete action parameters for: ${actionName}`,
      };
    },
    [
      selectJourneyById,
      setActiveScreen,
      openStepDrawer,
      triggerConsentFlow,
      openDigiLockerModal,
      setLanguage,
      executeCopilotAction,
      setChoiceChipsData,
    ]
  );

  return {
    dispatchToolAction,
  };
}
