# 📋 CivicJourney™ Simple Testing Checklist

---

## 🎨 1. UI/UX & Interactive Timeline
- [ ] **1.1 Back to Top & Active Step FAB:** Scroll down $\rightarrow$ click "Top" or "Step 2" in bottom-right corner.
- [ ] **1.2 Confetti & Step Completion:** Complete a sub-step $\rightarrow$ observe confetti burst + green node bounce + stem line fill.
- [ ] **1.3 Resizable Drawer:** Drag left border of the instruction drawer to widen between 380px and 1100px.
- [ ] **1.4 Keyboard Shortcuts:** Use `↓`/`↑` to navigate steps, `1`/`2`/`3`/`4` for drawer tabs, `Esc` to close.
- [ ] **1.5 Language Switcher:** Switch between English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ) in the header.
- [ ] **1.6 Dark / Light Mode:** Click Sun/Moon icon in header for 300ms smooth cross-fade.
- [ ] **1.7 Estimated Date Calculator:** Check target completion date in the top progress bar.

---

## 🏛️ 2. Flagship GovTech Toolkits
- [ ] **2.1 Stamp Duty Calculator:** Click "e-Stamp Duty" in toolbar $\rightarrow$ calculate KA/MH lease & deed duties.
- [ ] **2.2 QR & DSC Verifier:** Open drawer $\rightarrow$ Required Docs $\rightarrow$ click "Verify DSC / QR" for Class-3 RSA check.
- [ ] **2.3 City Bylaws Diff:** Click "City Bylaws Diff" in header $\rightarrow$ compare BBMP vs BMC vs MCD trade rules.
- [ ] **2.4 SMS & WhatsApp Sandbox:** Click "SMS / WhatsApp Alert" in toolbar $\rightarrow$ simulate instant dispatch.
- [ ] **2.5 Nodal Office Finder:** Click "Find Nodal Offices" in toolbar $\rightarrow$ search pincode `560038` for SRO & CSCs.
- [ ] **2.6 GANTT Critical Path:** Toggle "View Critical Path" above milestone cards $\rightarrow$ see SLA bottleneck highlights.
- [ ] **2.7 License Expiry Calendar:** Click "Track Renewal (.ICS)" $\rightarrow$ generate downloadable `.ics` reminder.
- [ ] **2.8 Citizen Dossier Export:** Click "Export Dossier (PDF)" $\rightarrow$ download `.html` or print official report.

---

## 🤖 3. AI Voice Copilot & Generative UI
- [ ] **3.1 Voice Recognition:** Click `✨` bottom-right $\rightarrow$ click `🎙️` $\rightarrow$ speak in English or Hindi.
- [ ] **3.2 Generative UI Autonomous Navigation:** Click prompt *"Help me register for FSSAI food license in Karnataka"* $\rightarrow$ watch copilot load roadmap, scroll to Step 2, and open drawer.
- [ ] **3.3 Full-Duplex Barge-in:** Speak while AI voice is reading $\rightarrow$ audio immediately stops.
- [ ] **3.4 Grounded RAG Citations:** Ask legal questions $\rightarrow$ observe verified `.gov.in` source citations.

---

## 🔒 4. Offline Vault & Multi-Party Collab
- [ ] **4.1 Encrypted Offline Vault:** Click "Encrypted Vault (Offline)" $\rightarrow$ set PIN $\rightarrow$ upload & encrypt sample file.
- [ ] **4.2 Multi-Party Collaboration Hub:** Click "Co-Applicant Collab" $\rightarrow$ invite member $\rightarrow$ assign checklist tasks $\rightarrow$ test live sync across tabs.

---

## 🌐 5. App Router Pages & Deep-Links
- [ ] **5.1 Domain Explorer:** Open [`/explore`](http://localhost:3000/explore) $\rightarrow$ search & expand legal domains.
- [ ] **5.2 Dynamic Journey:** Open [`/journey/karnataka_cloud_kitchen_setup`](http://localhost:3000/journey/karnataka_cloud_kitchen_setup).
- [ ] **5.3 Deep-Linked Step:** Open [`/journey/karnataka_cloud_kitchen_setup/step/step_bbmp_trade`](http://localhost:3000/journey/karnataka_cloud_kitchen_setup/step/step_bbmp_trade) $\rightarrow$ auto-opens drawer.
- [ ] **5.4 Search Page:** Open [`/search?q=FSSAI`](http://localhost:3000/search?q=FSSAI).
- [ ] **5.5 Government Portals Directory:** Open [`/resources`](http://localhost:3000/resources).
- [ ] **5.6 404 Not Found Page:** Open [`/random-unknown-route`](http://localhost:3000/random-unknown-route).
- [ ] **5.7 Sitemap & Robots:** Open [`/sitemap.xml`](http://localhost:3000/sitemap.xml) and [`/robots.txt`](http://localhost:3000/robots.txt).

---

## ⚙️ 6. Backend API & State Machine (Swagger)
- [ ] **6.1 Prerequisite Enforcement:** `POST /api/journey/complete-step` $\rightarrow$ returns HTTP 400 when skipping prerequisites.
- [ ] **6.2 Mock DigiLocker OAuth:** `POST /api/sandbox/apisetu/oauth/token` $\rightarrow$ returns bearer token.
- [ ] **6.3 Document Pull:** `POST /api/sandbox/apisetu/fetch-document` $\rightarrow$ returns signed PAN/Marksheet.
- [ ] **6.4 Pytest Suite:** Run `pytest tests/` in backend $\rightarrow$ all 68 tests pass.
