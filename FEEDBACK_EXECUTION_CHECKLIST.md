# ✅ JanSetu™ (CivicJourney) User Feedback Execution Checklist

Master interactive execution checklist tracking all 31 user testing items and bug fixes.

---

## 📊 Overall Progress Summary

- **Total Feedback Items:** 31
- **Completed & Verified:** 31 / 31 (100.0%)
- **Status:** **ALL 4 BATCHES / PHASES COMPLETE & FULLY VERIFIED** 🏆

---

## 🚀 Batch 1: Core Navigation, State & Scroll Lock (COMPLETED)

- [x] **Item 14: "Back to Goal Discovery" Router Navigation Fix** *(COMPLETED)*
  - *Problem:* Clicking "Back to Search / Home" in header/roadmap does not work on dynamic `/journey/...` routes.
  - *Fix:* Integrated Next.js `useRouter().push('/')` and wrapped breadcrumb / header actions with full reset to landing.
  - *Files:* `src/components/GovTechHeader.tsx`, `src/components/MilestoneRoadmap.tsx`, `src/context/JourneyContext.tsx`
  - *Priority:* High

- [x] **Item 21: Brand Logo / Header Title Click-to-Home Fix** *(COMPLETED)*
  - *Problem:* Clicking the portal brand title/logo in the top navigation header does nothing when on dynamic routes.
  - *Fix:* Wrapped the logo and brand title with Next.js `<Link href="/">` and triggered `navigateToHome()` reset.
  - *Files:* `src/components/GovTechHeader.tsx`
  - *Priority:* High

- [x] **Item 11: "Mark Completed" Progression Bug** *(COMPLETED)*
  - *Problem:* Step gets stuck and doesn't advance to next step when clicking "Mark Completed".
  - *Fix:* Refactored `toggleStepStatus` and `completeSubStep` in `JourneyContext.tsx` to automatically mark all sub-steps complete and advance the next locked milestone to `IN_PROGRESS`.
  - *Files:* `src/context/JourneyContext.tsx`, `src/components/MilestoneRoadmap.tsx`
  - *Priority:* Critical

- [x] **Item 10: Autonomous UI Navigation & Step AI Guide Drawer Opening / Auto-Closing Fix** *(COMPLETED)*
  - *Problem:* Clicking quick prompt chips scrolls to step but fails to open drawer; clicking inside drawer dismisses it unexpectedly.
  - *Fix:* Added `openStepDrawer(action.payload.step_id)` in `executeCopilotAction`, added `e.stopPropagation()` to drawer panel and containers, and added fallback step lookup.
  - *Files:* `src/components/AICopilotBar.tsx`, `src/components/InstructionDrawer.tsx`, `src/components/MilestoneRoadmap.tsx`
  - *Priority:* High

- [x] **Item 13: Keyboard Shortcuts & Drawer Conflict Fix** *(COMPLETED)*
  - *Problem:* Arrow keys and 1/2/3/4 shortcuts malfunction and cause drawer to keep closing when typing in inputs.
  - *Fix:* Isolated keyboard event listener: ignore keydowns when user focuses `input` / `textarea` / `select`; separate drawer-open from drawer-closed navigation.
  - *Files:* `src/components/InstructionDrawer.tsx`, `src/components/MilestoneRoadmap.tsx`
  - *Priority:* High

- [x] **Item 24: ChromaDB RAG Legal Citations & QA Test 3.4 Verification** *(COMPLETED)*
  - *Problem:* User could not test QA Test 3.4 because the Step AI Guide drawer does not open or stay open.
  - *Fix:* Verified and mounted `StepAIChat.tsx` inside `InstructionDrawer.tsx` with grounded `.gov.in` clickable citation badges, section cards, and verified portal links.
  - *Files:* `src/components/InstructionDrawer.tsx`, `src/components/StepAIChat.tsx`
  - *Priority:* High

- [x] **Item 1 & Item 17: Universal Modal & Drawer Background Scroll Lock** *(COMPLETED)*
  - *Problem:* Scrolling inside any modal, popup menu, or drawer still scrolls the background home/roadmap page.
  - *Fix:* Built and mounted reusable `useBodyScrollLock` hook (`overflow: hidden`, `overscroll-behavior: contain`, `touch-action: none` on `document.body`) across all 12 modals and drawers.
  - *Files:* `src/hooks/useBodyScrollLock.ts`, `InstructionDrawer.tsx`, `MunicipalComparisonModal.tsx`, `StampDutyCalculatorModal.tsx`, `NodalOfficeFinder.tsx`, `LicenseRenewalCalendarModal.tsx`, `OfflineVaultModal.tsx`, `CoApplicantCollaborationModal.tsx`, `RoadmapExportModal.tsx`, `SMSWhatsAppDispatchModal.tsx`, `DPDPConsentModal.tsx`, `LegalDraftModal.tsx`, `EligibilityDiagnosticRadar.tsx`, `DigiLockerModal.tsx`, `DigitalSignatureVerifierModal.tsx`, `DocumentOCRScannerModal.tsx`, `LanguageWelcomeModal.tsx`, `JourneyComparisonModal.tsx`, `QATestingModal.tsx`
  - *Priority:* High

---

## 🎨 Batch 2: Layout, Localization, Audio & Print Export (COMPLETED)

- [x] **Item 6: Toolbar Horizontal Overflow Fix** *(COMPLETED)*
  - *Problem:* Roadmap toolbar overflows horizontally on small screens.
  - *Fix:* Refactored toolbar from single-row overflow to responsive wrapped flex layout (`flex-wrap gap-2`) with clean grouped cards in `MilestoneRoadmap.tsx`.
  - *Priority:* High

- [x] **Item 18: Roadmap Print / PDF Export Page Duplication & Pagination Fix** *(COMPLETED)*
  - *Problem:* Exporting to print / PDF duplicated sections across multiple sheets.
  - *Fix:* Added `#printable-dossier-area` print isolation in `RoadmapExportModal.tsx` and updated `@media print` CSS in `globals.css` with `page-break-inside: avoid` to guarantee single clean print output without duplicated pages.
  - *Priority:* High

- [x] **Item 5: Complete Multi-Language Localization** *(COMPLETED)*
  - *Problem:* Unlocalized English text in toolbar buttons and modal triggers.
  - *Fix:* Expanded translation dictionaries across all 11 Indian languages (`en`, `hi`, `kn`, `bn`, `gu`, `ml`, `mr`, `or`, `pa`, `ta`, `te`) in `src/data/translations/` and bound `(t as any)` keys to all toolbar and utility buttons in `MilestoneRoadmap.tsx`.
  - *Priority:* High

- [x] **Item 7: Voice Typing / Copilot Mic & Real Audio Waves** *(COMPLETED)*
  - *Problem:* Microphone button lacked real frequency wave visualization.
  - *Fix:* Connected Web Audio API (`AudioContext` + `AnalyserNode`) in `useSpeechRecognition.ts` and `useVoiceInput.ts` for live microphone frequency visualization and smooth waveform animations.
  - *Priority:* High

- [x] **Item 20: Voice Recognition & Speech-to-Text Input Failure (EN / HI / KN)** *(COMPLETED)*
  - *Problem:* Voice recognition failed on select browser setups.
  - *Fix:* Integrated robust Web Speech API initialization, permission handling, and language-specific recognition tagging across `AICopilotBar.tsx`, `VoiceCopilotFloatingBar.tsx`, and `CopilotBar.tsx`.
  - *Priority:* High

- [x] **Item 23: Full-Duplex Speech Barge-In & Interruption Fix** *(COMPLETED)*
  - *Problem:* User speaking while AI voice is reading creates overlapping audio.
  - *Fix:* Integrated real-time microphone RMS threshold detector in Web Audio API loop that immediately executes `window.speechSynthesis.cancel()` as soon as the citizen starts speaking, enabling instant collision-free audio barge-in interruption.
  - *Priority:* High

- [x] **Item 9: Smart Voice Audio Policy (Voice-In $\rightarrow$ Voice-Out Only; Silent on Search Typing / Text / Chips)** *(COMPLETED)*
  - *Problem:* AI TTS reads out responses when typing text searches.
  - *Fix:* Enforced `isVoiceOrigin: boolean` parameter across `AICopilotBar.tsx`, `VoiceCopilotFloatingBar.tsx`, and `CopilotBar.tsx`. Vocal TTS reading is ONLY triggered when the query originated from microphone input; text typing, search submit, and chip clicks remain 100% silent.
  - *Priority:* High

---

## 🏛️ Batch 3 (Phase 1): Municipal Expansion, Directory Explorer, Legal Depth, Collab & RCS (COMPLETED)

- [x] **Item 15: Domain-Specific Municipal Diff & Field Filter Drawer** *(COMPLETED)*
  - Added slide-out **Domain & Field Filter Drawer** inside `MunicipalComparisonModal` across 6 dedicated sectors with granular category checkboxes, quick domain switch bar, pincode auto-match, and field search.

- [x] **Item 27: Domain Explorer (`/explore`) Interactive Filtering & Category Switching** *(COMPLETED)*
  - Connected sector category pills (*Business & MSME, Agriculture, Legal & Identity, Real Estate, Education, Healthcare*), quick domain selector dropdown, instant keyword filtering with live counts, and direct "Launch Roadmap" links in `src/app/explore/page.tsx`.

- [x] **Item 2: Pan-India Cities Expansion (16+ Municipal Corporations)** *(COMPLETED)*
  - Expanded `src/data/municipalities.ts` with comprehensive statutory compliance rules for 16 Indian cities: `BBMP` (Bengaluru), `BMC` (Mumbai), `MCD` (Delhi NCR), `GHMC` (Hyderabad), `GCC` (Chennai), `PMC` (Pune), `KMC` (Kolkata), `AMC` (Ahmedabad), `BBSR` (Bhubaneswar), `JMC` (Jaipur), `LMC` (Lucknow), `GMC` (Guwahati), `MCC` (Chandigarh), `VMC` (Vijayawada), `SMC` (Surat), `IMC` (Indore), `KMC_KL` (Kochi / Thiruvananthapuram).

- [x] **Item 3: Pincode Lookup & Auto-Select** *(COMPLETED)*
  - Implemented 6-digit Pincode auto-matching with 3-digit prefix routing via `detectMunicipalityByPincode()` in `MunicipalComparisonModal.tsx`.

- [x] **Item 4: GPS Auto-Location Permission** *(COMPLETED)*
  - Added HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`) "Use My GPS" button in `MunicipalComparisonModal.tsx` mapped with `getNearestMunicipalityByCoords()`.

- [x] **Item 8: Authentic, Distinct Statutory Content Across All Blueprints** *(COMPLETED)*
  - Validated legal rules across blueprints with authentic statutory acts (FoSCoS Schedule 4, BESCOM 3-phase power, Kaveri EC Form 15, SPICe+ Part B, PM-Vidyalaxmi CSIS, BBMP Bylaws 2020, BMC DCPR 2034, MCD UBBL 2016).

- [x] **Item 12: Legal Draft Modal Performance & Lag** *(COMPLETED)*
  - Verified `LegalDraftModal.tsx` optimized with `useMemo` text interpolation, e-Stamp paper fee calculations, and instant plain-text download/print.

- [x] **Item 16: RCS Verified Push Notification Handler & Rich Card Simulation** *(COMPLETED)*
  - Implemented Google RCS Verified Business Messaging (RBM) rich card UI (verified badge, hero banner, interactive action chips: "View Notice", "Verify Online", "Call Helpline") in `SMSWhatsAppDispatchModal.tsx`.

- [x] **Item 26: Multi-Party Co-Applicant Collaboration Cross-Tab Sync & Multi-Channel Invites** *(COMPLETED)*
  - Implemented dual `BroadcastChannel('civic_collab_channel')` and `window.addEventListener('storage')` listeners in `src/utils/collaborationSession.ts` and `CoApplicantCollaborationModal.tsx` for real-time cross-tab synchronization and simulated multi-channel invites.

- [x] **Item 19: GANTT Chart Timeline & Critical Path Time-Accuracy Validation** *(COMPLETED)*
  - Validated `JourneyGanttChart.tsx` duration algorithms against working days and statutory SLAs.

- [x] **Item 25: AES-256-GCM Encrypted Offline Document Vault Optimization & Enhancements** *(COMPLETED)*
  - Validated `OfflineVaultModal.tsx` client-side Web Crypto AES-GCM encryption with password key derivation and auto-lock security.

- [x] **Item 28: Government Portals & Statutory Resources Directory (`/resources`) Validation** *(COMPLETED)*
  - Verified `src/app/resources/page.tsx` with active HTTPS `.gov.in` portals (FoSCoS, MCA21, DigiLocker, Kaveri 2.0, IGRS Maharashtra, Tele-Law, Udyam, etc.) with search and category filters.

- [x] **Item 29: Search Engine Indexing, Dynamic XML Sitemap & Robots Directive (`/sitemap.xml`, `/robots.txt`)** *(COMPLETED)*
  - Verified dynamic XML sitemap in `src/app/sitemap.ts` generating all journey routes and `src/app/robots.ts` search engine crawler directives.

- [x] **Item 30: Roadmap Toolbar Congestion & Layout De-Cluttering** *(COMPLETED)*
  - Grouped the 4 statutory tools (*e-Stamp Duty*, *Find Nodal Offices*, *Track Renewal*, *SMS Alerts*) into a single **`Statutory Tools`** popover menu (`Wrench` icon with counter badge) in `MilestoneRoadmap.tsx` and restored a spacious layout.

- [x] **Item 31: Milestone Filter Status Tabs (All / In Progress / Completed / Locked) Inactivity Fix** *(COMPLETED)*
  - Fixed sub-step accordion mode in `MilestoneRoadmap.tsx` to map over the filtered `steps` array instead of unfiltered `activeJourney.steps`, and added an empty state card.

---

## 🏷️ Batch 4 (Phase 2): Platform-Wide Rebranding to JanSetu™ / जनसेतु

- [x] **Item 22: Platform Rebranding to JanSetu™ / जनसेतु (CRITICAL)** *(COMPLETED)*
  - *Problem:* Platform name needed to be updated from *CivicJourney™ / LegalPath* to **JanSetu™ / जनसेतु** across all user-facing interfaces, headers, footers, page metadata, blueprints, and translation dictionaries.
  - *Accomplished:*
    1. Navigation Header & Footer (`GovTechHeader.tsx`, `GoalDiscoveryLanding.tsx`, `layout.tsx`, `page.tsx`, `journey/[journeyId]/page.tsx`, `step/[stepId]/page.tsx`)
    2. Page Titles & Metadata (`layout.tsx`, `loading.tsx`, `error.tsx`, `public/manifest.json`)
    3. Export Dossier PDF Branding (`RoadmapExportModal.tsx`, `OfflineVaultModal.tsx`, `LicenseRenewalCalendarModal.tsx`, `MunicipalComparisonModal.tsx`)
    4. AI Copilot system identity prompt & greetings (`backend/app/main.py`, `backend/app/ai/goal_classifier.py`, `backend/app/ai/rag_service.py`, `backend/app/routers/notifications.py`, `SMSWhatsAppDispatchModal.tsx`)
    5. Multi-language translation dictionaries in `src/data/translations/` (`en.ts`, `hi.ts`, `kn.ts`, `bn.ts`, `te.ts`, `ta.ts`, `mr.ts`, `gu.ts`, `ml.ts`, `pa.ts`, `or.ts`)
  - *Priority:* Critical 🏆
