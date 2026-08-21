# 🏛️ LegalPath / CivicJourney™ Statutory Engine & Grounded RAG (Tracks 2 & 3)

High-performance, deterministic life-event journey node dependency engine and strictly partitioned AI Orchestrator built with **FastAPI**, **Pydantic v2**, **SQLAlchemy (SQLite)**, **Google GenAI SDK (Gemini Pro)**, and **ChromaDB**.

---

## 📂 Architecture Overview

```
backend/
├── app/
│   ├── main.py                  # FastAPI entry point, CORS & centralized exception handlers
│   ├── config.py                # Pydantic v2 application settings (Gemini, Vector DB)
│   ├── db/
│   │   ├── database.py          # SQLAlchemy SQLite connection & session generator
│   │   └── models.py            # UserSessionModel & JourneyProgressModel
│   ├── schemas/
│   │   ├── journey.py           # ActionType, NodeBlueprint, JourneyBlueprint, Runtime models
│   │   ├── sandbox.py           # Mock DigiLocker / API Setu request & response schemas
│   │   ├── session.py           # Session state and persistence models
│   │   ├── alert.py             # Statutory regulatory alert models
│   │   └── ai.py                # Goal classification, RAG, multilingual, and policy parser schemas
│   ├── data/
│   │   ├── blueprints.py        # 5 validated statutory life-event blueprints
│   │   ├── alerts_data.py       # Pre-seeded regulatory policy notices & circulars
│   │   └── knowledge_base.py    # 15 curated official government statutory manuals & circulars
│   ├── engine/
│   │   └── dependency_graph.py  # Strict sequential dependency resolution & DAG state machine
│   ├── ai/
│   │   ├── gemini_client.py     # Gemini Pro client with structured outputs & fallback mode
│   │   ├── goal_classifier.py   # Zero-shot intent classification & parameter extraction
│   │   ├── vector_store.py      # ChromaDB vector store with semantic & lexical retrieval
│   │   ├── rag_service.py       # Grounded Step Q&A, mandatory citations & guardrails
│   │   ├── multilingual.py      # Multilingual guidance in English, Hindi, and Kannada
│   │   └── policy_parser.py     # Gazette circular parser (What changed, Why it matters, Action)
│   └── routers/
│       ├── journeys.py          # GET /api/journey/{id}, GET /api/journeys, /evaluate
│       ├── progress.py          # POST /api/journey/complete-step (prerequisite enforcement)
│       ├── sandbox.py           # POST /api/sandbox/apisetu/oauth/token, /fetch-document
│       ├── sessions.py          # POST/GET /api/session, /api/session/{id}/complete-step
│       ├── alerts.py            # GET /api/alerts (domain & jurisdiction filter)
│       └── ai.py                # POST /api/ai/classify-goal, /rag/query, /step-guidance, /parse-policy-alert
├── tests/
│   ├── test_journey_dependencies.py # Track 2 DAG & Sandbox test suite (11 tests)
│   └── test_ai_orchestration.py     # Track 3 AI & RAG test suite (13 tests)
└── requirements.txt             # FastAPI, Uvicorn, Pydantic, SQLAlchemy, google-genai, chromadb
```

---

## 🚀 Running the FastAPI Server

### 1. Activate Environment & Run
```powershell
$env:PYTHONPATH="backend"
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

### 2. Interactive Swagger / OpenAPI Docs
Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

## 🧪 Running Automated Tests

```powershell
$env:PYTHONPATH="backend"
.\.venv\Scripts\pytest backend\tests -v
```
*Current test suite: **24/24 tests passing** covering all Track 2 and Track 3 priorities.*


---

## 📋 Implemented Demonstration Blueprints (Priority 1)

### 1. 🍛 "MSME / Food Business" (`food-business-license`)
- **Step 1:** `identity-verification` — Proprietor Aadhaar & PAN Verification (`MOCK_VERIFY`)
- **Step 2:** `udyam-registration` — Udyam MSME Registration (`PORTAL_REDIRECT` → `https://udyamregistration.gov.in`) `[Prereq: identity-verification]`
- **Step 3:** `fssai-license` — FSSAI FoSCoS Basic Registration / State License (`FORM_FILL` → `https://foscos.fssai.gov.in`) `[Prereq: identity-verification, udyam-registration]`
- **Step 4:** `current-business-account` — Commercial Business Current Bank Account (`MOCK_VERIFY`) `[Prereq: identity-verification, udyam-registration, fssai-license]`

### 2. 🎓 "Higher Education Loan (PM-Vidyalaxmi)" (`pm-vidyalaxmi-loan`)
- **Step 1:** `marksheet-verification` — Academic Qualification & Marksheet Attestation (`MOCK_VERIFY` → `https://nad.gov.in`)
- **Step 2:** `income-certificate` — Tahsildar Family Income Certificate Attestation (`FORM_FILL` → `https://edistrict.gov.in`) `[Prereq: marksheet-verification]`
- **Step 3:** `scheme-discovery` — PM-Vidyalaxmi CSIS 100% Subsidy Discovery (`FORM_FILL` → `https://www.vidyalakshmi.co.in`) `[Prereq: marksheet-verification, income-certificate]`
- **Step 4:** `bank-loan-application` — Digital Loan Application & Bank Disbursal (`PORTAL_REDIRECT` → `https://www.vidyalakshmi.co.in/Students/`) `[Prereq: marksheet-verification, income-certificate, scheme-discovery]`

### 3. ✈️ "Study Abroad" (`study-abroad-global`)
- **Step 1:** `degree-verification` — State HRD Document Authentication (`FORM_FILL` → `https://eSanad.nic.in`)
- **Step 2:** `mea-apostille` — MEA Hague Apostille (`MOCK_VERIFY` → `https://legalize.mea.gov.in`) `[Prereq: degree-verification]`
- **Step 3:** `forex-lrs-declaration` — RBI LRS Form A2 Outward Remittance (`FORM_FILL` → `https://rbi.org.in/...`) `[Prereq: degree-verification, mea-apostille]`
- **Step 4:** `visa-checklist` — Student Visa Biometrics & Filing (`PORTAL_REDIRECT` → `https://visa.vfsglobal.com/ind/en`) `[Prereq: degree-verification, mea-apostille, forex-lrs-declaration]`

### 4. 🗺️ "Become a Certified Tourist Guide" (`certified-tourist-guide`)
- **Step 1:** `iitf-course` — IITF Basic Certification Course (`PORTAL_REDIRECT` → `https://iitf.gov.in`)
- **Step 2:** `police-verification` — Police Clearance Certificate (`MOCK_VERIFY` → `https://www.passportindia.gov.in/...`) `[Prereq: iitf-course]`
- **Step 3:** `tourism-ministry-registration` — Ministry of Tourism Guide Licence (`FORM_FILL` → `https://tourism.gov.in/guidelines`) `[Prereq: iitf-course, police-verification]`

### 5. 💼 "Startup & Seed Funding" (`startup-seed-funding`)
- **Step 1:** `entity-formation` — SPICe+ Company Incorporation (`PORTAL_REDIRECT` → `https://www.mca.gov.in/...`)
- **Step 2:** `dpiit-recognition` — Startup India Recognition (`FORM_FILL` → `https://www.startupindia.gov.in/...`) `[Prereq: entity-formation]`
- **Step 3:** `sisfs-grant-application` — SISFS Up to ₹50 Lakh Grant (`PORTAL_REDIRECT` → `https://seedfund.startupindia.gov.in`) `[Prereq: entity-formation, dpiit-recognition]`
- **Step 4:** `current-bank-account` — Commercial Current Bank Account & AD Code (`MOCK_VERIFY` → `https://www.rbi.org.in`) `[Prereq: entity-formation, dpiit-recognition, sisfs-grant-application]`

---

## 🔒 Deterministic State Machine & Prerequisite Resolution (Priority 2)

The engine enforces sequential milestone rules without AI hallucination:
- When a step is completed via `POST /api/journey/complete-step`:
  1. The backend appends the step ID to the completed set.
  2. The DAG evaluates all remaining locked steps.
  3. Steps whose prerequisite IDs are satisfied transition from **`LOCKED` $\rightarrow$ `IN_PROGRESS`**.
  4. Recalculates overall journey progress percentage.
- If a user attempts to skip prerequisites, the server returns an **HTTP 400 Bad Request**:
```json
{
  "detail": {
    "error": "SEQUENTIAL_DEPENDENCY_VIOLATION",
    "message": "Cannot unlock/complete 'FSSAI Basic Registration / State Food Safety License (FoSCoS)' (Step 3). You must first complete the preceding prerequisite milestone(s): Proprietor / Partner Identity & Aadhaar OTP Verification, Udyam MSME National Registration & Certificate Allotment.",
    "target_step_id": "fssai-license",
    "missing_prerequisites": ["identity-verification", "udyam-registration"]
  }
}
```

---

## 🛡️ Mock DigiLocker / API Setu Sandbox (Priority 2)

Simulates official API Setu requester specifications:
1. **Citizen Authorization Token**: `POST /api/sandbox/apisetu/oauth/token`
   - Returns Bearer access token, expiry (3600s), and DPDP consent audit timestamp.
2. **Verifiable Document Pull**: `POST /api/sandbox/apisetu/fetch-document`
   - Supports `PAN`, `AADHAAR`, `MARKSHEET_10`, `MARKSHEET_12`, `DEGREE_CERTIFICATE`, `INCOME_CERTIFICATE`, `UDYAM_CERTIFICATE`, `POLICE_CLEARANCE`, `DPIIT_CERTIFICATE`.
   - Returns simulated digital signature payload:
     - `algorithm`: `SHA256withRSA-PKCS#7`
     - `cert_serial_number`, `issuer_ca`, `signature_digest`, `digilocker_uri` (e.g. `in.gov.pan/ABCDE1234F`), and `verification_hash`.

---

## 💾 SQLite Session Persistence (Priority 3)

Maintains citizen progress across page reloads:
- `POST /api/session`: Initialize or resume session with profile parameters (e.g. `state`, `income`, `category`).
- `GET /api/session/{session_id}`: Retrieve saved active journey and completed milestones.
- `POST /api/session/{session_id}/complete-step`: Complete step and persist in SQLite `civic_journey.db`.

---

## 📢 Regulatory Alert Dispatcher (Track 2 Priority 3)

- `GET /api/alerts?domain={domain}&jurisdiction={jurisdiction}`:
  - Dispatches context-aware statutory circulars (e.g., FSSAI FoSCoS Form D1 annual return deadline, PM-Vidyalaxmi 100% interest subvention rules, MEA digital apostille mandate).

---

## 🧠 AI Orchestration & Grounded RAG (Track 3)

The AI engine is **strictly partitioned**: it handles natural language understanding, semantic retrieval, and document summarization, but never decides procedural eligibility or alters the deterministic prerequisite DAG state machine.

### 1. Zero-Shot Goal Classification & Parameter Extraction (Priority 1)
- `POST /api/ai/classify-goal`:
  - Accepts unstructured natural language goals (e.g., *"I want to open a cloud kitchen in Bangalore"*).
  - Returns clean structured parameters: `goal_type` (`FOOD_BUSINESS`), `target_state` (`Karnataka`), `scale_or_entity_type` (`Micro / Sole Proprietorship`), `extracted_parameters` (city, turnover), and maps intent to the Track 2 journey seed blueprint `food-business-license`.

### 2. Grounded Step Q&A via ChromaDB RAG (Priority 2)
- `POST /api/ai/rag/query`:
  - Contextual similarity search over **15 indexed official government statutory manuals** in ChromaDB.
  - Generates concise answers with **mandatory source citations**: Official Department Name, Manual Section, and Verified Portal Link (e.g. `https://foscos.fssai.gov.in`).
  - **Zero-Hallucination Guardrail**: Prohibits speculation; returns fallback advisory directing the citizen to the official portal if information is not specified in the official manuals.

### 3. Multilingual Generation & Plain Language Guidance (Priority 3)
- `POST /api/ai/step-guidance`:
  - Generates localized step guidance, plain language summaries, actionable checklists, and common pitfalls in **English**, **Hindi** (`hi`), and **Kannada** (`kn`).

### 4. Gazette Policy Alert Parser (Priority 3)
- `POST /api/ai/parse-policy-alert`:
  - Takes raw gazette notices or circular text and extracts 3 structured elements:
    1. **What changed** (exact rule/fee amendment)
    2. **Why it matters to this active journey** (impact on active business or student milestones)
    3. **What action or deadline is required** (statutory compliance deadline)

### 5. Curated Government Knowledge Base
- `GET /api/ai/knowledge-base`:
  - Returns metadata for all 15 indexed official manuals across FSSAI, MoMSME, Ministry of Education, MEA, RBI, Ministry of Tourism, DPIIT, MCA, and BBMP.

