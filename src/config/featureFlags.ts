/**
 * Feature Flags Configuration
 *
 * Controls which features are enabled in the UI.
 * Frontend reads environment variables; backend team sets them per environment.
 * All features gracefully degrade — components check flags before rendering.
 */

export const features = {
  /** Enable AI chat in step drawers and journey finder */
  aiChat: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === "true",

  /** Enable DigiLocker integration (real API calls) */
  digiLocker: !!process.env.NEXT_PUBLIC_DIGILOCKER_API,

  /** Enable analytics tracking */
  analytics: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,

  /** Enable user accounts and server-side progress sync */
  userAccounts: !!process.env.NEXT_PUBLIC_API_URL,

  /** Enable document upload and AI analysis */
  documentAnalyzer: process.env.NEXT_PUBLIC_ENABLE_DOC_ANALYZER === "true",

  /** Enable real-time notifications via WebSocket */
  notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",

  /** Show demo controls (sandbox toolbar, floating controller) */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false", // Default: true
} as const;

/**
 * Check if a feature is enabled.
 * Usage: if (isFeatureEnabled("aiChat")) { ... }
 */
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature];
}
