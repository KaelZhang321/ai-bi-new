# Meeting BI Reverse PRD and RAG Knowledge Base Design

Date: 2026-03-17
Status: Approved design
Audience: Internal PM, R&D, business
Scope: Reverse product documentation for the current Meeting BI system, plus a RAG-ready knowledge base structure

## 1. Background and Objective

The current repository already contains a usable Meeting BI product, but its product description is scattered across code, API definitions, README notes, and an older PRD. The goal of this design is not to invent a new product version. The goal is to reverse-engineer the current system into:

1. one formal reverse PRD for cross-functional reading
2. one modular knowledge base for later RAG ingestion

The reverse PRD should help PM, R&D, and business align on what the system currently does, how the pages and modules are organized, what data and interfaces support them, and where the current gaps are. The knowledge base should transform the same facts into retrieval-friendly documents for onboarding, internal Q&A, and AI-assisted search.

## 2. Current Product Understanding

Based on the current repository structure and API/page layout, the product can be understood as a "Meeting BI dashboard + AI query + WeCom bot reply" system.

Current evidence sources include:

- `README.md`
- `backend/app/api/router.py`
- `backend/app/api/v1/*.py`
- `backend/app/services/*.py`
- `frontend/src/pages/PageCustomer.tsx`
- `frontend/src/pages/PageOperations.tsx`
- `frontend/src/pages/PageAchievement.tsx`
- `frontend/src/components/sections/*.tsx`
- `docs/会议BI看板PRD.md`
- GitNexus process mapping for `ai-bi-new`

Confirmed product-level structure from code:

- Customer page: registration, customer profile, customer source
- Operations page: operations dashboard
- Achievement page: achievement, regional completion, proposal overview
- Shared AI capability: natural-language query, stream query, chart recommendation
- Shared external channel: WeCom integration

Confirmed backend route domains from `backend/app/api/router.py`:

- `kpi`
- `registration`
- `customer`
- `source`
- `operations`
- `achievement`
- `progress`
- `proposal`
- `ai_query`
- `wecom`
- `chart`

GitNexus process results also confirm representative flows such as operations KPI, operations trend, source distribution, target arrival, AI query, AI stream query, achievement chart, and proposal overview.

## 3. Design Decision

Recommended approach: dual-artifact delivery.

### 3.1 Why this approach

A single large PRD is good for humans but weak for RAG ingestion. A card-only knowledge base is good for retrieval but weak for continuous business reading. Because this output will serve PM, R&D, business, and later AI retrieval, the design uses one fact source and two output shapes:

- Reverse PRD: continuous narrative for people
- RAG knowledge base: modular fact cards for machines and targeted lookup

### 3.2 Non-goals

This design does not include:

- new feature design
- UI redesign proposals
- implementation tasks
- future roadmap planning
- speculative business capability beyond the current repository

## 4. Deliverables

The agreed final deliverables are:

1. Reverse PRD  
   `docs/会议BI逆向PRD.md`

2. RAG knowledge base navigation  
   `docs/rag/00-知识库导航.md`

3. RAG knowledge cards  
   Suggested folders:
   - `docs/rag/pages/`
   - `docs/rag/modules/`
   - `docs/rag/apis/`
   - `docs/rag/flows/`
   - `docs/rag/ai/`
   - `docs/rag/metrics/`
   - `docs/rag/issues/`
   - `docs/rag/glossary.md`

4. This design document  
   `docs/plans/2026-03-17-meeting-bi-reverse-prd-rag-design.md`

## 5. Reverse PRD Structure

The reverse PRD should use a "business first, page next, data next, issues last" structure.

### 5.1 Proposed chapters

1. Document overview
2. Product overview
3. Roles and use scenarios
4. Information architecture and page map
5. Page and module specifications
6. Interface and data dependencies
7. AI query capability
8. Key metrics and business definitions
9. Current issues and gaps
10. Appendix

### 5.2 Why this structure works

- Business readers can understand the system through chapters 1 to 5
- R&D can jump into chapters 5 to 10 for implementation mapping
- The same structure can be split into RAG cards later with low rework

### 5.3 Page-level scope already confirmed from code

- Customer page:
  - `RegistrationSection`
  - `CustomerProfileSection`
  - `CustomerSourceSection`
- Operations page:
  - `OperationsSection`
- Achievement page:
  - `AchievementSection`
  - `ProgressSection`
  - `ProposalSection`
- Shared panels:
  - `CoreKpiRow`
  - `AiChatPanel`
  - `HeaderBar`

## 6. RAG Knowledge Base Structure

The RAG knowledge base should use a three-layer structure.

### 6.1 Navigation layer

Purpose: provide high-level entry points for both humans and retrieval.

Suggested contents:

- product overview
- page index
- module index
- API index
- metric index
- glossary index
- update rules

### 6.2 Card layer

Purpose: store one knowledge object per document.

Proposed card types:

- page cards
- module cards
- API cards
- data flow cards
- AI capability cards
- issue cards

### 6.3 Definition layer

Purpose: reduce retrieval errors on business vocabulary and metric interpretation.

Proposed contents:

- metric definition cards
- glossary / terminology cards

## 7. Card Template Standards

The knowledge base should be strongly templated so it can be reviewed by humans and imported by RAG pipelines with low cleanup cost.

### 7.1 Page card

Required fields:

- page name
- page goal
- target users
- core modules
- main decision scenarios
- entry path
- related APIs
- key metrics
- current limitations
- code anchors

### 7.2 Module card

Required fields:

- module name
- parent page
- business purpose
- displayed content
- interaction pattern
- data source
- related APIs
- key fields
- metric references
- current limitations
- code anchors

### 7.3 API card

Required fields:

- API name
- path
- method
- serving object
- inputs
- outputs
- field notes
- calling pages
- calling modules
- backend implementation
- SQL source
- exception risks

### 7.4 Data flow card

Required fields:

- flow name
- business start point
- frontend component
- request API
- backend service
- SQL or data source
- response structure
- frontend consumption pattern
- error-prone points

### 7.5 AI capability card

Required fields:

- capability name
- user input
- processing flow
- model or component
- SQL generation path
- chart recommendation path
- output shape
- reuse entry
- failure handling
- code anchors

### 7.6 Metric card

Required fields:

- metric name
- business meaning
- calculation rule
- data source
- applicable pages
- display form
- common misunderstandings
- current metric risks

### 7.7 Issue card

Required fields:

- issue title
- issue type
- impact scope
- observed symptom
- root-cause judgment
- current status
- temporary handling
- recommended follow-up
- related code

### 7.8 Glossary card

Required fields:

- term
- definition
- context
- related modules
- related metrics
- notes

## 8. Mapping Between PRD and RAG

The two outputs should use the same fact base, with different presentation shapes.

### 8.1 Mapping rules

- PRD chapter 2 -> navigation overview
- PRD chapter 3 -> page cards and partial AI cards
- PRD chapter 4 -> navigation indexes
- PRD chapter 5 -> page cards and module cards
- PRD chapter 6 -> API cards and data flow cards
- PRD chapter 7 -> AI capability cards
- PRD chapter 8 -> metric cards and glossary cards
- PRD chapter 9 -> issue cards
- PRD chapter 10 -> indexes and anchors

### 8.2 Principle

The PRD is the main narrative document. The RAG knowledge base is the retrieval-optimized derivative. Facts should be verified once, then expressed in two shapes. They should not drift independently.

## 9. Documentation Method and Confidence Rules

To keep the reverse PRD reliable, all statements should follow a source priority and confidence model.

### 9.1 Source priority

1. Current code implementation
2. Interface definitions and actual calling relationships
3. README and existing documentation
4. UI behavior inference or naming inference

Rule: code > interface > document > inference

### 9.2 Confidence labels

Each important conclusion should be marked using one of these levels where useful:

- code-verified
- interface-verified
- documented but not yet code-verified
- inferred from naming or behavior

### 9.3 Writing style for the reverse PRD

Each module or capability should prefer a three-part pattern:

1. fact description
2. business interpretation
3. current limitation

This keeps the document readable for business while still precise for R&D.

### 9.4 Writing style for RAG cards

Each card should prefer:

1. one-sentence answer-style summary
2. structured fields
3. code anchors and related links

## 10. Writing Sequence

Recommended production sequence:

1. build the reverse PRD skeleton
2. complete page and module chapters first
3. complete interface, service, SQL, and AI flow chapters
4. extract metric definitions and issue inventory
5. derive RAG cards from the approved PRD facts
6. complete navigation and index files

This sequence ensures the product narrative is complete before knowledge splitting begins.

## 11. Acceptance Criteria

The final documentation package is acceptable only if it satisfies all of the following:

### 11.1 Coverage

- all three main pages are documented
- shared AI capability is documented
- WeCom capability is documented
- key backend route domains are documented

### 11.2 Consistency

- PRD wording and RAG card wording do not conflict
- metric definitions stay consistent across files

### 11.3 Traceability

- key conclusions link back to page, API, service, or SQL anchors
- important capability claims are evidence-backed

### 11.4 Readability

- business readers can understand system value and main scenarios
- PM can retell the product structure from the document
- R&D can locate implementation files quickly

### 11.5 Retrieval quality

- each card is single-topic
- filenames and titles are retrieval-friendly
- metric and glossary definitions are separated from generic page text

## 12. Known Risks and Controls

### 12.1 Existing documentation may be stale

The older file `docs/会议BI看板PRD.md` is useful as historical context, but it should not override current code.

Control: current repository code remains the primary truth source.

### 12.2 GitNexus index may lag the latest HEAD

The indexed graph for `ai-bi-new` may not always match the most recent working tree.

Control: use GitNexus for structural discovery, but validate final facts against local files.

### 12.3 Metric wording may diverge from real SQL logic

Some business names shown in UI or old docs may not exactly match backend calculation logic.

Control: metric cards and PRD metric sections must include source notes and confidence labels.

## 13. Execution Notes

The next practical step after this design is:

1. write the formal reverse PRD based on current code and interfaces
2. split the approved facts into RAG cards
3. run a final cross-check for coverage, consistency, and anchors

If a dedicated planning skill is later available, it should be used to turn this approved design into a file-level writing plan. If not, the plan can be created manually from this design.

## 14. Source Anchors Used in This Design

- `README.md`
- `backend/app/api/router.py`
- `backend/app/api/v1/achievement.py`
- `backend/app/api/v1/ai_query.py`
- `backend/app/api/v1/operations.py`
- `backend/app/api/v1/progress.py`
- `backend/app/api/v1/proposal.py`
- `backend/app/api/v1/registration.py`
- `backend/app/api/v1/source.py`
- `backend/app/api/v1/wecom.py`
- `backend/app/services/achievement_service.py`
- `backend/app/services/kpi_service.py`
- `backend/app/services/operations_service.py`
- `backend/app/services/progress_service.py`
- `backend/app/services/proposal_service.py`
- `backend/app/services/registration_service.py`
- `backend/app/services/source_service.py`
- `frontend/src/pages/PageCustomer.tsx`
- `frontend/src/pages/PageOperations.tsx`
- `frontend/src/pages/PageAchievement.tsx`
- `frontend/src/components/sections/RegistrationSection.tsx`
- `frontend/src/components/sections/CustomerProfileSection.tsx`
- `frontend/src/components/sections/CustomerSourceSection.tsx`
- `frontend/src/components/sections/OperationsSection.tsx`
- `frontend/src/components/sections/AchievementSection.tsx`
- `frontend/src/components/sections/ProgressSection.tsx`
- `frontend/src/components/sections/ProposalSection.tsx`
- GitNexus repo: `ai-bi-new`
