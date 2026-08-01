# 13 — Glossary

Project-specific terms, abbreviations, internal names, modules, and services referenced across the codebase and its documentation.

## People / Brand Names

| Term | Meaning |
|---|---|
| **LaMi** | The product/brand name of the application ("LaMi Command Center"). Origin of the name is not stated in the repository. |
| **Mimo / Mimo's Collective** | The operator/business brand. In `dataAdapter.ts`'s `exportDataJSON()`, the operator is named `Movsum "Mimo" Mirzazada`. Referred to throughout the UI as "Mimo" (e.g., "Call Mimo," "Message Mimo"). |
| **Layla** | The named client the app is built for. In `dataAdapter.ts`'s `exportDataJSON()`, the client is named `Layla Karoline Aparecida`. Appears throughout UI copy ("Hello, Layla," login username default `Layla_Portal`). |
| **Lior** | One of the selectable "Paid By" values in the Finance module (`PaidBy` type), alongside Layla, Mimo, and "Other." Not otherwise described in the repository — presumed to be another household/family member. |

## Domain / Feature Terms

| Term | Meaning |
|---|---|
| **Case** | The app's unit of work/task tracking (`CaseItem`). Represents a request or matter the operator is handling for the client (e.g., "Louis Vuitton bag repair," "DEWA billing dispute"). |
| **Client State** | The client-facing status of a Case: `🔔 Awaiting you` (needs the client's decision), `✅ In our hands` (operator is handling it), `✔️ Completed`. |
| **Internal Status** | The operator-only status of a Case (`Open`, `Awaiting approval`, `Paused`, `Completed`), never shown to the client-facing UI directly (shown only when Operator mode is on). |
| **Operator Mode** | A client-side UI mode (`isOperator` flag) that shows create/edit/delete controls and internal fields. Defaults to on for any authenticated session. |
| **Client Preview** | The alternate, read-only UI mode entered via `?op=0`/`?client=1`, hiding operator-only controls. |
| **Handoff** | A client question the Concierge AI could not (or should not) answer on its own, logged for the operator to review and personally reply to or convert into a Case (`HandoffItem`). |
| **Radar / Radar Suggestion** | A proactive prompt surfaced ahead of a known upcoming date (`KeyDateItem`), inviting the client to accept (auto-creates a Case) or dismiss it. |
| **Key Date** | A hardcoded date-driven trigger record (`KeyDateItem`) powering the Radar feature and the WeekStrip — e.g., a lease-end date, a passport-expiry date, a recurring billing cycle. |
| **Briefing** | The single, always-current prose summary shown on the app's home screen (`BriefingData`), editable by the operator; not versioned/historized. |
| **Quotation** | A priced option (`QuotationRow`) presented within a Case for the client to compare and approve, optionally flagged as "Recommended" by the operator. |
| **Decision** | A Case's pending approval prompt (`DecisionData`) with one or more `DecisionOption`s; resolving it transitions the Case from "Awaiting you" to "In our hands." |
| **Completion Proof** | The photo/note (`CompletionProof`) attached when a Case is marked complete, required before completion per an in-app UI rule (not a type-level requirement — the modal simply won't submit without a note). |
| **Subtask** | A checklist item (`SubTask`) within a Case, visualized via a progress bar on the card and a donut/bar chart (Recharts) on the detail screen. |
| **Category / Subcategory** | The nested taxonomy classifying Cases (`CaseCategoryDef`/`CaseSubcategory`), 13 built-in top-level categories, each with several subcategories, plus user-addable custom categories. |
| **Finance Category** | A separate, smaller category list (`FINANCE_CATEGORIES`) used only for Finance transactions — not the same list as Case categories. |
| **Paid By** | A Finance transaction attribution field: `Layla`, `Lior`, `Mimo`, or `Other` (with free-text). |
| **Payment Method** | A multi-select tag set on a Finance transaction: Cash, Card, Bank Transfer, PayPal, Voucher, Exchange, Crypto — supports "split" payments (e.g., "Cash+Card"). |
| **Running Balance** | The cumulative, chronologically-ordered sum of all Finance transactions (signed by type), computed client-side and also sent to the Google Sheets sync payload. |
| **Take Me Home** | A quick-access link (Briefing screen) opening Google Maps directions to a hardcoded home address (`HOME_CONFIG`). |
| **Connections** | The screen/feature exposing external provider-portal shortcut links (DEWA, Tasleem, Lootah, du, Emaar, e&) — "launcher only," no credentials stored. |
| **Concierge (Concierge AI / Concierge LaMi)** | The in-app chat assistant; answers first from local app data (`localConcierge.ts`), then via a server-side Gemini call. |
| **Grounding Data** | The sanitized JSON snapshot of cases/utilities/keyDates/briefing sent to the Concierge's Gemini prompt, deliberately excluding internal fields, IDs, and account numbers. |
| **Fallback (Concierge)** | The static hand-off message ("I couldn't answer right now — please message Mimo directly on WhatsApp 💬") returned whenever the Concierge cannot produce a model answer for any reason. |

## Technical / Infrastructure Terms

| Term | Meaning |
|---|---|
| **DataAdapter** | The single class (`client/src/services/dataAdapter.ts`) that is the entire persistence layer of the application, reading/writing JSON to `localStorage`. |
| **AppContext** | The single React Context (`client/src/context/AppContext.tsx`) providing all shared application state and mutation functions to every component. |
| **ViewMode** | The TypeScript union type enumerating the app's "screens" (`briefing`, `cases`, `caseDetail`, `archive`, `utilities`, `contacts`, `connections`, `finance`, `services`) — the app's substitute for URL-based routing. |
| **I18nText** | A type alias (currently equal to plain `string`) retained from a removed multi-language data shape; historical name implying "internationalized text," now vestigial. |
| **PWA** | Progressive Web App — the installable, offline-capable mode enabled by `manifest.json` + `sw.js`. |
| **Service Worker (`sw.js`)** | The hand-written browser script implementing the app's offline caching strategy (cache-first navigation fallback, stale-while-revalidate static assets, network-first everything else). |
| **shadcn/ui** | The open-source component-generation convention (config in `components.json`) whose generated files live in `client/src/components/ui/` — present in this repo but confirmed unused by the application (see `04_Feature_Catalog.md`, `09_Dependency_Report.md`). |
| **Radix UI** | The unstyled component-primitive library underlying shadcn/ui's generated components; installed but, per the above, unused by the shipped app. |
| **Manus** | A third-party AI app-building/development platform whose tooling (a Vite runtime plugin, a debug-log collector, a storage-presign proxy, and a `template.json` scaffold snapshot) is embedded in this repository's dev tooling. Not a part of LaMi's own application logic; inert in production builds. |
| **`.manus-logs/`** | A local directory (not committed; created by the Manus debug-collector Vite plugin) storing browser console/network/session-replay logs during local development. |
| **Gemini** | Google's LLM family; the sole AI provider used by the Concierge feature (`gemini-2.5-flash-lite` primary, `gemini-2.5-flash` fallback), called via direct REST `fetch`, no SDK. |
| **`api/_lib/`** | Shared backend library code (Concierge logic, Sheets sync logic) imported by both the Vercel serverless functions and the standalone Express server, so the two deployment topologies share one implementation. |
| **Vercel serverless function** | Any file directly under `api/` (or its subfolders) whose default export Vercel automatically deploys as an individually invocable HTTP endpoint. |
| **`wa.me` link** | A WhatsApp-provided URL scheme (`https://wa.me/<phone>?text=<message>`) that opens a pre-filled chat in the user's own WhatsApp client/web session — used throughout the app for "message Mimo" actions; distinct from the WhatsApp Business Cloud API (a separate, currently-inert integration for server-initiated push notifications). |
| **WebAuthn** | The W3C browser API for public-key-based authentication (`navigator.credentials`), used here for the optional "biometric login" — implemented in a non-standard, client-only way (see `11_Risk_Assessment.md`, R4). |
| **DEWA** | Dubai Electricity and Water Authority — the emirate's utility provider, referenced throughout Contacts, Connections, Bills, and case categories. |
| **Tasleem** | A district (central) cooling utility provider referenced in Bills/Connections/case categories (external brand name `tabreed.ae` used for its Connections link). |
| **Lootah (Gas)** | A central gas utility provider referenced in Bills/Contacts/Connections/case categories. |
| **RTA** | Roads and Transport Authority (Dubai) — listed in the Contacts directory. |
| **DHA** | Dubai Health Authority — listed in the Contacts directory. |
| **Ejari** | The UAE's official tenancy-contract registration system — referenced as a case subcategory ("Tenancy & Ejari") under Documents & Compliance. |
| **AED** | United Arab Emirates Dirham — the sole currency used throughout the Finance module; no multi-currency support exists. |
