# 🏛️ CivicJourney™ / LegalPath — Complete User Testing Scratchpad & Feature Matrix
**Smart India Hackathon (SIH) • Enterprise GovTech Platform Verification Guide**  
**Version:** 3.0 (Full-Stack Master Edition)  
**Target Environment:** Local Dev (`Frontend: http://localhost:3000` • `Backend: http://127.0.0.1:8000`)

---

## 📑 Table of Contents
1. [Prerequisites & Dev Server Status](#1-prerequisites--dev-server-status)
2. [Master Feature Catalog (What Was Built)](#2-master-feature-catalog)
3. [Section A: Interactive Frontend & UI/UX Features](#3-section-a-interactive-frontend--uiux-features)
4. [Section B: Top 10 Flagship GovTech Innovations](#4-section-b-top-10-flagship-govtech-innovations)
5. [Section C: AI Voice Copilot & Generative UI Action Dispatcher](#5-section-c-ai-voice-copilot--generative-ui)
6. [Section D: All 8 App Router Pages & Deep-Links](#6-section-d-all-8-app-router-pages--deep-links)
7. [Section E: Backend APIs & Deterministic DAG State Machine](#7-section-e-backend-apis--state-machine)
8. [Section F: Edge Case, Stress & Accessibility Testing](#8-section-f-edge-case-stress--accessibility-testing)
9. [Section G: User Feedback & Improvement Notes Log](#9-section-g-user-feedback--improvement-notes-log)

---

## 1. Prerequisites & Dev Server Status

Ensure both services are running in separate terminal windows:
```powershell
# 1. Frontend Next.js Dev Server (Port 3000)
npm run dev
# URL: http://localhost:3000

# 2. Backend FastAPI Server (Port 8000)
$env:PYTHONPATH="backend"
.\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
# URL: http://127.0.0.1:8000/docs
```

---

## 2. Master Feature Catalog

| Category | Features Implemented | Total Count |
|---|---|:---:|
| **Core UI & Timeline** | Dynamic SVG Stem lines, Status Morphing, Sub-Step Accordion, Resizable Drawer, GANTT Critical Path, Confetti Burst | 12 |
| **GovTech Toolkits** | Stamp Duty Calculator, QR/DSC Verifier, Municipal Diff, Nodal Office Finder, License Expiry (.ICS), SMS/WhatsApp Sandbox | 6 |
| **Legal & Compliance** | Legal Document Drafting Engine, Pre-Submission OCR Scanner, Eligibility Diagnostic Radar, Holiday Awareness Banner | 4 |
| **AI & Voice** | In-App Generative UI Voice Copilot, Full-Duplex Barge-in, ChromaDB RAG, Zero-Shot Classifier, Policy Alert Parser | 6 |
| **Collaboration & PWA** | Multi-Party Co-Applicant Hub, AES-256-GCM Encrypted Offline Vault, PWA Manifest, Dossier HTML/PDF Export | 4 |
| **Pages & Routes** | `/explore`, `/journey/[id]`, `/journey/[id]/step/[id]`, `/search`, `/resources`, `error.tsx`, `not-found.tsx`, `loading.tsx` | 8 |
| **Accessibility & SEO** | WCAG 2.1 AA Skip Link, ARIA tags, `next/font` Inter, Dynamic Sitemap (`/sitemap.xml`), Robots (`/robots.txt`) | 5 |
| **Total Features** | **Complete Full-Stack GovTech Suite** | **45+ Features** |

---

## 3. Section A: Interactive Frontend & UI/UX Features

### Test Case A.1: Floating "Back to Top + Active Step" FAB
- **Where:** `http://localhost:3000/journey/karnataka_cloud_kitchen_setup`
- **Steps:**
  1. Scroll down past the first 3 milestone steps.
  2. Look at the bottom-right corner for the floating dual-action pill button.
  3. Click **"↑ Top"** $\rightarrow$ verifies smooth scroll back to header.
  4. Click **"→ Step 2" (or active step)** $\rightarrow$ verifies smooth centering on current `IN_PROGRESS` step.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case A.2: Step Completion Celebration & Micro-Interactions
- **Where:** Milestone Roadmap view on any journey.
- **Steps:**
  1. Expand Step 1 or Step 2.
  2. Click on a sub-step checkbox or click **"Mark as Completed"** inside the Instruction Drawer.
  3. Observe:
     - GPU canvas confetti burst (`CelebrationConfetti.tsx`).
     - Green checkmark scale-bounce animation.
     - Connecting vertical timeline stem line fills green downward.
     - The next locked step node triggers a subtle unlock vibration shake.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case A.3: Resizable Instruction Drawer (Drag-to-Widen)
- **Where:** Click any milestone step card to slide open the right drawer.
- **Steps:**
  1. Move mouse cursor over the left border of the drawer (cursor turns to `col-resize`).
  2. Click and drag leftwards to widen up to `1100px` (or rightwards down to `380px`).
  3. Release mouse and refresh the browser page.
- **Expected Result:** Drawer remembers your custom width from `localStorage`.
- **Status:** [ ] Pass [ ] Fail

---

### Test Case A.4: Power User Keyboard Shortcuts
- **Where:** Any Roadmap page (`/journey/...`).
- **Steps:**
  1. Press `↓` (Arrow Down) $\rightarrow$ opens next milestone step drawer.
  2. Press `↑` (Arrow Up) $\rightarrow$ opens previous milestone step drawer.
  3. Inside the drawer, press `1` $\rightarrow$ switches to **Department Info** tab.
  4. Press `2` $\rightarrow$ switches to **Instructions** tab.
  5. Press `3` $\rightarrow$ switches to **Required Documents** tab.
  6. Press `4` $\rightarrow$ switches to **Official Portals** tab.
  7. Press `Escape` $\rightarrow$ smoothly closes the drawer.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case A.5: Tri-Lingual Language Switching (EN / HI / KN)
- **Where:** Top navigation header language dropdown.
- **Steps:**
  1. Click **"Language: English"** and select **"हिंदी (Hindi)"**.
  2. Verify: Header, roadmaps, step titles, precaution banners, and drawer instructions switch to official Hindi terminology.
  3. Switch to **"ಕನ್ನಡ (Kannada)"** and verify Kannada typography.
  4. Reload page $\rightarrow$ verifies persistence in `localStorage`.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case A.6: System-Preferred Dark / Light Mode Cross-Fade
- **Where:** Top navigation header theme toggle (Sun/Moon icon).
- **Steps:**
  1. Click the theme icon.
  2. Observe a smooth 300ms cross-fade transition across backgrounds, borders, and cards without harsh flashing.
- **Expected Result:** [ ] Pass [ ] Fail

---

## 4. Section B: Top 10 Flagship GovTech Innovations

### Test Case B.1: Dynamic Stamp Duty & State e-Stamping Calculator
- **Where:** Roadmap toolbar $\rightarrow$ click **"e-Stamp Duty"** button.
- **Steps:**
  1. Select State: **Karnataka** (under Karnataka Stamp Act 1957) or **Maharashtra** (Stamp Act 1958).
  2. Select Instrument: **Commercial Lease / Rental Agreement** or **Partnership Deed**.
  3. Enter Consideration Amount: `₹5,00,000` (5 Lakhs).
  4. Click **"Calculate Duty & Registration"**.
  5. Verify computed Stamp Duty, Surcharge, Registration Fee, and direct link to Kaveri 2.0 / SHCIL portal.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.2: Cryptographic QR & Digital Signature (DSC) Verifier
- **Where:** Open Instruction Drawer $\rightarrow$ **Required Documents** tab $\rightarrow$ click **"Verify DSC / QR"**.
- **Steps:**
  1. The verifier opens with simulated CCA India certificate trust chain.
  2. Inspect:
     - 2048-bit RSA Class 3 Signer: `e-Mudhra / (CCA India)`.
     - SHA-256 Digest Hash.
     - Document Integrity: `VALID / UNTAMPERED`.
  3. Click **"Re-Verify Integrity"** to see live cryptographic audit timestamp.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.3: Municipal Compliance Diff Engine (BBMP vs BMC vs MCD vs GCC)
- **Where:** Top header $\rightarrow$ click **"City Bylaws Diff"** button.
- **Steps:**
  1. Select City 1: **BBMP (Bengaluru)** vs City 2: **BMC (Mumbai)**.
  2. Inspect side-by-side matrix:
     - Trade License SLA (15 days vs 21 days).
     - Health Officer Physical Inspection mandatory trigger.
     - Commercial Power & Water Utility clearances.
     - Direct municipal portal links.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.4: Real-Time SMS & WhatsApp Notification Dispatch Sandbox
- **Where:** Roadmap toolbar $\rightarrow$ click **"SMS / WhatsApp Alert"** button.
- **Steps:**
  1. Select Channel: **WhatsApp (Meta Business API Verified)** or **SMS (C-DAC e-Pramaan)**.
  2. Enter citizen mobile number: `9876543210`.
  3. Select language: **English** or **Hindi**.
  4. Inspect the interactive smartphone live preview mockup.
  5. Click **"Simulate Instant Dispatch"** $\rightarrow$ verifies HTTP POST to `/api/notifications/simulate-dispatch` and simulated delivery SLA.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.5: Geo-Located Nodal Officer & CSC Center Finder
- **Where:** Roadmap toolbar $\rightarrow$ click **"Find Nodal Offices"** button.
- **Steps:**
  1. Type pincode: `560038` (Indiranagar) or `560001` (MG Road).
  2. Select filter: **Sub-Registrar Office (SRO)**, **Bangalore One / CSC**, or **Tahsildar**.
  3. Inspect contact numbers, working hours, live token counter wait status, and click **"Open Directions"** (Google Maps).
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.6: Statutory Milestone Critical Path & GANTT Timeline View
- **Where:** Above the milestone cards on any roadmap.
- **Steps:**
  1. Inspect the GANTT bar chart displaying cumulative day durations (e.g. Day 1 to Day 25).
  2. Toggle **"Hide GANTT Chart" / "Show Critical Path"**.
  3. Verify that bottleneck steps glow with amber rings and badge `Critical Path (SLA Bound)`.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.7: AES-256-GCM Encrypted Offline Vault & PWA Mode
- **Where:** Roadmap toolbar $\rightarrow$ click **"Encrypted Vault (Offline)"** button.
- **Steps:**
  1. Enter a 4-to-6 digit security PIN (e.g. `123456`).
  2. Click **"Unlock My Vault"**.
  3. Click **"Choose File"** and upload any sample PDF/image (e.g., PAN card or Rent Agreement).
  4. Verify the document is encrypted locally using `crypto.subtle` AES-256-GCM.
  5. Click the **Eye icon** $\rightarrow$ decrypts and previews the document.
  6. Click **"Export Backup (.civicvault)"** $\rightarrow$ downloads encrypted JSON backup.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.8: Multi-Party Co-Applicant Collaboration Hub
- **Where:** Roadmap toolbar $\rightarrow$ click **"Co-Applicant Collab"** button.
- **Steps:**
  1. View active session members (Primary Applicant, Co-Founder, Landlord).
  2. Click **"+ Invite Member"** and add `Vikram Seth` as `CA / Lawyer`.
  3. Under Document Checklist Ownership, click status buttons to cycle `PENDING` $\rightarrow$ `UPLOADED` $\rightarrow$ `VERIFIED`.
  4. Click **"Share Co-Applicant Invite Link"** $\rightarrow$ copies encrypted session link.
  5. Open another browser tab with that link $\rightarrow$ verify real-time `BroadcastChannel` synchronization!
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.9: Statutory Citizen Dossier & PDF Export Engine
- **Where:** Roadmap toolbar $\rightarrow$ click **"Export Dossier (PDF)"** button.
- **Steps:**
  1. Inspect the compiled dossier overview (Milestone checklist, progress percentage, applicant ref).
  2. Click **"Download Dossier (.HTML)"** $\rightarrow$ downloads standalone printable `.html` report.
  3. Click **"Print / PDF"** $\rightarrow$ triggers browser print preview with clean print styles.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case B.10: Pre-Submission OCR & Quality Scanner
- **Where:** Document checklist row $\rightarrow$ click **"Scan & Verify OCR"**.
- **Steps:**
  1. Upload a mock certificate or identity document.
  2. The client scanner performs keyword matching (e.g. `Registration Certificate`, `Government of Karnataka`, `Valid Upto`).
  3. Inspect Legibility Score (e.g. 98%), Seal Detection, and Expiration Date validation.
- **Expected Result:** [ ] Pass [ ] Fail

---

## 5. Section C: AI Voice Copilot & Generative UI Action Dispatcher

### Test Case C.1: Voice Recognition & Regional Locales
- **Where:** Floating Copilot button in bottom-right corner (`✨`).
- **Steps:**
  1. Click the Copilot button to expand the floating panel.
  2. Click the **Microphone (🎙️)** button.
  3. Speak in English: *"Help me register for FSSAI food license in Karnataka"*.
  4. Observe speech transcription in the input box and automatic execution.
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case C.2: Generative UI Autonomous Action Execution
- **Where:** Floating Copilot panel.
- **Steps:**
  1. Click the quick chip: **"FSSAI Food License (Karnataka)"** (or submit the query).
  2. Watch the frontend autonomously execute sequential actions:
     - ⚡ `LOAD_JOURNEY("karnataka_cloud_kitchen_setup")`
     - ⚡ Smoothly scroll down to Step 2 (*FSSAI License*)
     - ⚡ Slides open the Instruction Drawer directly to the *Required Documents* tab
     - ⚡ Speaks the 1-sentence Hindi/English summary aloud via browser Text-to-Speech
- **Expected Result:** [ ] Pass [ ] Fail

---

### Test Case C.3: Full-Duplex Speech Barge-In (Interruption)
- **Where:** While the Copilot is speaking aloud.
- **Steps:**
  1. Trigger any speech prompt.
  2. While the AI voice is reading the response, click the microphone or speak again.
  3. Verify that `speechSynthesis.cancel()` immediately cuts off audio to prevent overlapping speech collisions.
- **Expected Result:** [ ] Pass [ ] Fail

---

## 6. Section D: All 8 App Router Pages & Deep-Links

| Route | URL | Test Action | Expected Result | Pass/Fail |
|---|---|---|---|:---:|
| **Domain Explorer** | [`/explore`](http://localhost:3000/explore) | Search "GST" or click "Startups & Business" card | Expands subcategory activity matrix and links to roadmaps | [ ] |
| **Dynamic Journey** | [`/journey/karnataka_cloud_kitchen_setup`](http://localhost:3000/journey/karnataka_cloud_kitchen_setup) | Navigate directly via URL | Loads Cloud Kitchen roadmap, GANTT chart, and sub-steps | [ ] |
| **Deep-Linked Step** | [`/journey/karnataka_cloud_kitchen_setup/step/step_bbmp_trade`](http://localhost:3000/journey/karnataka_cloud_kitchen_setup/step/step_bbmp_trade) | Open in new tab | Mounts roadmap and automatically slides open Step 3 drawer | [ ] |
| **Search Engine** | [`/search?q=FSSAI`](http://localhost:3000/search?q=FSSAI) | Filter by Agency & Category | Lists matching roadmaps with direct "View Roadmap" buttons | [ ] |
| **Gov Portals Directory** | [`/resources`](http://localhost:3000/resources) | Search "DigiLocker" or filter "Central Portals" | Shows official acts, helplines, and direct `.gov.in` links | [ ] |
| **Error Boundary** | [`/error`](http://localhost:3000/error) (Simulated) | Trigger error boundary | Shows friendly diagnostic recovery with "Retry" button | [ ] |
| **Not Found 404** | [`/non-existent-route`](http://localhost:3000/non-existent-route) | Open random URL | Renders official 404 page with suggested roadmaps | [ ] |
| **Sitemap & Robots** | [`/sitemap.xml`](http://localhost:3000/sitemap.xml) & [`/robots.txt`](http://localhost:3000/robots.txt) | Open XML in browser | Valid XML sitemap with all static and dynamic routes | [ ] |

---

## 7. Section E: Backend APIs & Deterministic DAG State Machine

Open FastAPI Swagger UI at **`http://127.0.0.1:8000/docs`** to execute interactive API calls:

### Test Case E.1: Prerequisite Enforcement (HTTP 400 Bad Request)
- **Endpoint:** `POST /api/journey/complete-step`
- **Payload:**
  ```json
  {
    "journey_id": "food-business-license",
    "step_id": "fssai-license",
    "completed_step_ids": []
  }
  ```
- **Expected Response:** `HTTP 400 Bad Request` with `SEQUENTIAL_DEPENDENCY_VIOLATION` explaining that `identity-verification` and `udyam-registration` must be completed first.
- **Status:** [ ] Pass [ ] Fail

---

### Test Case E.2: Grounded ChromaDB RAG with Citations
- **Endpoint:** `POST /api/ai/rag/query`
- **Payload:**
  ```json
  {
    "query": "What is the annual turnover limit for basic FSSAI registration?",
    "domain_filter": "FSSAI"
  }
  ```
- **Expected Response:** Answer specifying `₹12 Lakhs/year` with mandatory citations to *FSSAI Food Safety and Standards (Licensing and Registration) Regulations, Section 2.1*.
- **Status:** [ ] Pass [ ] Fail

---

### Test Case E.3: Zero-Hallucination Fallback Guardrail
- **Endpoint:** `POST /api/ai/rag/query`
- **Payload:**
  ```json
  {
    "query": "What is the secret recipe for making Biryani under FSSAI rules?"
  }
  ```
- **Expected Response:** Safe fallback advisory stating the query is out of statutory scope and directing user to the official portal.
- **Status:** [ ] Pass [ ] Fail

---

### Test Case E.4: State Stamp Duty Tariff Computation
- **Endpoint:** `POST /api/legal/stamp-duty/calculate`
- **Payload:**
  ```json
  {
    "state_code": "KA",
    "instrument_type": "LEASE_AGREEMENT",
    "consideration_amount": 600000,
    "term_years": 3,
    "is_female_beneficiary": false
  }
  ```
- **Expected Response:** Calculated Stamp Duty (`₹3,000`), Surcharge (`₹600`), and Registration Fee (`₹3,000`).
- **Status:** [ ] Pass [ ] Fail

---

## 8. Section F: Edge Case, Stress & Accessibility Testing

- [ ] **F.1 WCAG 2.1 AA Keyboard Navigation:** Press `Tab` from page load $\rightarrow$ verify `"Skip to main content"` appears and jumps focus to `<main id="main-content">`.
- [ ] **F.2 Offline Mode Disconnection:** Open Chrome DevTools $\rightarrow$ Network $\rightarrow$ toggle **"Offline"** $\rightarrow$ verify cached pages and Encrypted Vault continue to operate without crashing.
- [ ] **F.3 High-Contrast Screen Reader Audit:** Verify all modal close buttons and form controls have accessible `aria-label` tags.
- [ ] **F.4 Mobile Viewport Responsive Layout:** Resize browser to `375px` (iPhone SE) $\rightarrow$ verify floating FAB, hamburger drawer, GANTT scrollbar, and modal cards adapt cleanly.

---

## 9. Section G: User Feedback & Improvement Notes Log

All 14 items recorded during testing are logged here and in [`USER_TESTING_FEEDBACK_LOG.md`](file:///c:/Users/HP/Desktop/SIH%20Project/USER_TESTING_FEEDBACK_LOG.md):

| # | Feature Tested | Observation / Bug / UX Note | Priority | Action Needed |
|---|---|---|:---:|---|
| **1** | **Modal Body Scroll Lock** | Scrolling inside modal scrolls background page. | **High** | Lock body scroll (`overflow: hidden`) on modal mount + add `overscroll-contain`. |
| **2** | **Municipalities Catalog** | Only 4 cities (BBMP, BMC, MCD, GCC). | **High** | Expand `src/data/municipalities.ts` to 15+ Pan-India cities (GHMC, PMC, AMC, KMC, SMC, JMC, LMC, IMC, Kochi, MCC, Noida, Chandigarh). |
| **3** | **Pincode Auto-Detection** | Need 6-digit pincode input to auto-detect city. | **High** | Add 6-digit Pincode input with automatic prefix mapping (560xxx -> BBMP, 400xxx -> BMC, etc.). |
| **4** | **GPS Auto-Location** | Need one-click GPS auto-location detection. | **Medium** | Add HTML5 Geolocation API button to auto-detect and select city. |
| **5** | **Multi-Language Localization** | Words remain in English after switching to Hindi/Kannada. | **High** | Audit and translate all hardcoded strings, buttons, toolbars, and steps into `translations.ts`. |
| **6** | **Toolbar Overflow** | Roadmap buttons stretch out of page horizontally. | **High** | Make toolbar responsive with clean `flex-wrap gap-2` and grouped cards. |
| **7** | **Voice Typing & Waveform** | Voice mic collapses; wave visualizer looks static. | **High** | Connect real Web Audio API `AudioContext` + `AnalyserNode` frequency visualizer and fix mic lifecycle. |
| **8** | **Statutory Content Depth** | Steps feel too generic across journeys. | **High** | Deepen statutory legal rules in `mockJourneys.ts` and `blueprints.py` with authentic acts and departmental procedures. |
| **9** | **Smart Voice Audio Policy** | AI speaks aloud even on text/chip clicks. | **High** | Add `isVoiceOrigin: boolean` flag; only speak aloud if user used microphone. |
| **10** | **Step AI Guide Auto-Closing** | Chat drawer keeps closing when clicked. | **High** | Add `e.stopPropagation()` and fix outside click handler detection. |
| **11** | **"Mark Completed" Stuck** | Step doesn't advance to next step when marked complete. | **Critical** | Fix `toggleStepStatus` state transition and auto-unlock next sequential milestone. |
| **12** | **Legal Draft Modal Lag** | Legal draft template popups feel laggy. | **Medium** | Optimize React renders with `useMemo` and debounced inputs. |
| **13** | **Keyboard Shortcuts Conflict** | 1/2/3/4 and arrow keys cause drawer to close/malfunction. | **High** | Separate drawer-open vs drawer-closed key listeners and prevent input key propagation. |
| **14** | **Back to Goal Discovery Button** | Back button does nothing on dynamic routes. | **High** | Replace state toggle with Next.js router navigation (`useRouter().push('/')` / `<Link href="/">`). |

---
*Created for Smart India Hackathon (SIH) Citizen Milestone Roadmap Verification.*
