# 04 — Feature Catalog

Each entry reflects what the code actually does today. "Missing functionality" lists gaps observed directly in the code (not aspirational roadmap items unless the code itself references them).

---

### 1. Authentication / Login

- **Description:** Username+password gate in front of the entire app, with an optional WebAuthn "biometric" second path.
- **Status:** Live (client-side only).
- **Dependencies:** `AppContext.tsx` (`login`, `loginBiometric`, `logout`), `client/src/utils/webauthn.ts`, `localStorage`.
- **Files involved:** `client/src/components/LoginScreen.tsx`, `client/src/context/AppContext.tsx`, `client/src/utils/webauthn.ts`.
- **User workflow:** User lands on `LoginScreen` if `lami_authenticated !== 'true'`; enters username/password → `login()` compares against `VITE_APP_USER`/`VITE_APP_PASSWORD` (or hardcoded defaults) → on success sets `localStorage.lami_authenticated = 'true'` and a haptic success buzz fires. If biometric was previously enabled, a "Biometric login" button calls WebAuthn `navigator.credentials.get`.
- **Missing functionality:** No server-side verification, no per-user accounts, no password reset, no rate limiting/lockout, no real WebAuthn server challenge/verification.
- **Technical debt:** Password default is hardcoded in source (`@Mimo2026`); any `VITE_`-prefixed value is inlined into the public JS bundle regardless.

---

### 2. Operator / Client Mode Toggle

- **Description:** A single boolean that shows/hides all create/edit/delete controls app-wide.
- **Status:** Live.
- **Dependencies:** `AppContext.tsx` (`isOperator`, `setIsOperator`, `toggleOperator`).
- **Files involved:** `AppContext.tsx`, `Header.tsx` (3-second long-press toggles it), every screen component (conditionally renders operator-only controls).
- **User workflow:** Defaults to operator mode for any authenticated session. Can be flipped via URL params (`?op=0`, `?client=1`, `?op=1`, `?operator=1`) or long-pressing the header logo for 3 seconds.
- **Missing functionality:** Not a real authorization boundary — no server ever checks this flag; it is purely a UI presentation switch.
- **Technical debt:** None beyond the security caveat above (this is by design per `AI_CONTEXT.md` "Phase 1" note).

---

### 3. Cases (task/request management)

- **Description:** The core "todo/case" tracking system: create, categorize, filter, view detail, approve decisions, add timeline updates, mark complete with proof.
- **Status:** Live.
- **Dependencies:** `DataAdapter`, `appConfig.ts` (category taxonomy), `whatsapp.ts` (`notifyNewCase`).
- **Files involved:** `CasesScreen.tsx`, `CaseCard.tsx`, `CaseDetailScreen.tsx`, `SubtaskProgressChart.tsx`, `types/index.ts` (`CaseItem` and related interfaces), `dataAdapter.ts`.
- **User workflow:** Cases list shows search + 4 state-filter pills (All/Awaiting/In progress/Completed) + category filter chips (13 built-in + any custom categories) with collapsible groups. Operator FAB opens a "New case" modal (emoji, title, category, subcategory, inline "add your own category"). Tapping a card opens `CaseDetailScreen`, which shows next step, subtask progress chart (donut/bar via Recharts), quotation comparison with a "Recommended" gold badge and one-tap approve buttons, a WhatsApp deep-link button, an editable timeline (operator can add entries with a photo URL), and (operator) a "Complete Case" modal requiring a proof note (photo URL optional).
- **Missing functionality:** No due-date reminders/notifications beyond the WeekStrip display; no file/photo upload for timeline entries (only raw URL text input, unlike Finance's file picker); no case deletion (only creation/update — `dataAdapter.ts` has no `deleteCase`); no pagination for large case lists (all cases are always loaded into memory).
- **Technical debt:** `resolveCaseCategory()` in `appConfig.ts` carries a hardcoded `LEGACY_CATEGORY_MAP` translating pre-Phase-2 Portuguese category IDs (`viagens-reservas`, `moda-luxo`, etc.) and an emoji-based fallback map — permanent migration-compatibility code with no removal path.

---

### 4. Case Category Taxonomy ("add your own")

- **Description:** 13 nested built-in categories (each with subcategories), plus user-defined custom categories persisted client-side.
- **Status:** Live.
- **Dependencies:** `localStorage` (`lami_custom_categories_v1`).
- **Files involved:** `appConfig.ts` (`CASE_CATEGORIES`, `getAllCaseCategories`, `addCustomCategory`), `CasesScreen.tsx`.
- **User workflow:** In the "New case" modal, an operator can type a new category name and emoji; it's persisted and immediately selectable/filterable alongside built-ins.
- **Missing functionality:** No edit or delete of custom categories once added; no server sync (custom categories are per-browser, not shared across the operator's devices or with the client's browser).
- **Technical debt:** Custom category IDs are generated from `Date.now().toString(36)`, offering no collision protection across browsers/devices if this were ever synced.

---

### 5. Finance Ledger

- **Description:** AED-denominated income/expense/reimbursement ledger with cash-flow attribution.
- **Status:** Live (explicitly flagged in-app as pre-production: a visible dev banner reads *"Real authentication pending — do not publish with real financial data until Phase 2"*).
- **Dependencies:** `DataAdapter`, `appConfig.ts` (`FINANCE_CATEGORIES`, `PAID_BY_OPTIONS`, `PAYMENT_METHOD_OPTIONS`), `/api/finance/sync`, `/api/finance/status` (status endpoint is defined but not confirmed to be called from the client in this audit — see `12_Open_Questions.md`).
- **Files involved:** `FinanceScreen.tsx` (641 lines, the largest component), `types/index.ts` (`FinanceTransaction`), `dataAdapter.ts`.
- **User workflow:** Month-chip selector; 3 summary cards (Income/Expenses/Reimbursements); month balance strip; all-time running-balance strip; CSV export button; "Sync to Google Sheets" button; per-transaction rows showing receipt thumbnail (if attached), category, status, Paid By, Payment Method tags, signed amount, and a running-balance readout; operator FAB opens a "New transaction" modal (date, description, amount, type, category, status, Paid By [+ "Other" free text], multi-select Payment Method tags, optional receipt photo up to 2 MB).
- **Missing functionality:** No transaction edit UI is wired up in `FinanceScreen.tsx` even though `AppContext.updateTransaction` exists (only create and delete are exposed in this screen); no multi-currency support; no budget/forecast features; the Google Sheets sync is a full-overwrite of a fixed `A1:I100000` range rather than incremental/append.
- **Technical debt:** Receipt photos are base64-encoded directly into the same JSON blob as the rest of the ledger in `localStorage` (explicit `// TODO cloud storage` comment in both `types/index.ts` and `FinanceScreen.tsx`); the in-app dev banner is permanent UI clutter that must be manually removed later (comment: `// Dev banner — remove at Phase 2`).

---

### 6. Bills / Utilities Panel

- **Description:** A read-mostly panel of 4 hardcoded utility accounts (DEWA, Tasleem, Lootah Gas, Just Life) with copy-to-clipboard account numbers and call buttons.
- **Status:** Live, but **entirely hardcoded** — not driven by `DataAdapter`'s `utilities` collection (see Technical Debt).
- **Dependencies:** None beyond `navigator.clipboard`.
- **Files involved:** `UtilitiesPanel.tsx`.
- **User workflow:** View 4 static cards; tap "Copy Number" (shows a toast) or "Call Now" (`tel:` link).
- **Missing functionality:** No add/edit/delete of utility accounts from this screen (despite `DataAdapter` having a parallel `UtilityItem[]` collection with `getUtilities()` that is loaded but apparently not rendered by this component — a mismatch between the data model and this screen; see `12_Open_Questions.md` for whether another screen consumes `utilities` from context).
- **Technical debt:** The `BILLS` array inside `UtilitiesPanel.tsx` duplicates/diverges from the seed data in `seedData.ts`'s `INITIAL_UTILITIES` (different account numbers formatting, an added "Just Life" entry not present in `INITIAL_UTILITIES` at all) — two sources of truth for the same domain concept.

---

### 7. Contacts Directory

- **Description:** A categorized, tap-to-call phone directory (Emergency, Utilities, Home & Community, Health, Transport, Mimo/LaMi).
- **Status:** Live, fully hardcoded (no CRUD).
- **Dependencies:** None.
- **Files involved:** `ContactsScreen.tsx`, `appConfig.ts` (`CONTACT_CATEGORIES`).
- **User workflow:** Browse by category; tap a phone icon (`tel:` link) or WhatsApp icon (`wa.me` link, Mimo entry only).
- **Missing functionality:** No way to add/edit contacts from the UI — changes require editing source code and redeploying.
- **Technical debt:** None beyond the above (this is documented as intentional operator-editable config, not a runtime feature).

---

### 8. Connections (Provider Portal Shortcuts)

- **Description:** A grid of styled badges linking out to 6 external provider websites (DEWA, Tasleem/Tabreed, Lootah, du, Emaar, e&).
- **Status:** Live, fully hardcoded.
- **Dependencies:** None.
- **Files involved:** `ConnectionsScreen.tsx`, `appConfig.ts` (`CONNECTION_PROVIDERS`).
- **User workflow:** Tap a card → opens the provider's public homepage in a new browser tab.
- **Missing functionality:** No stored credentials, no SSO, no deep-linking into authenticated provider pages — by design ("launcher only, no stored credentials" per the code comment).
- **Technical debt:** None notable.

---

### 9. Services Catalogue

- **Description:** A static, read-only presentation of the full concierge service offering, grouped into 7 domains, each service tagged Live / Ready / Phase 2.
- **Status:** Live (as a presentation screen; the underlying services it describes are a mix of actually-implemented and not-yet-implemented).
- **Dependencies:** None.
- **Files involved:** `ServicesScreen.tsx`, `serviceCatalogue.ts`.
- **User workflow:** Read-only browse from the Briefing screen's "Services" quick-access tile.
- **Missing functionality:** Entirely static; no way to request a "Ready"/"Phase 2" service from within this screen (no CTA wired to Cases or Concierge).
- **Technical debt:** Status labels (`live`/`ready`/`phase2`) are manually maintained free text per service line item — no link between a catalogue entry marked "live" and any verifiable feature flag/test.

---

### 10. Concierge AI Chat

- **Description:** Floating chat widget answering client questions, first from local app data, then via a server-side Gemini call.
- **Status:** Live.
- **Dependencies:** `localConcierge.ts`, `services/concierge.ts`, `/api/concierge`, `GEMINI_API_KEY` (server env, optional).
- **Files involved:** `ConciergeAI.tsx`, `localConcierge.ts`, `services/concierge.ts`, `api/concierge.ts`, `api/_lib/concierge.ts`, `server/index.ts`.
- **User workflow:** Floating bell button → slide-up sheet with quick-reply chips and free-text input → local keyword match answers instantly; unmatched questions call the server; any failure (no API key, network error, empty model output) shows a fixed WhatsApp hand-off message. A "Call Mimo" button in the chat header is a placeholder (shows a "coming soon" toast; no real call functionality).
- **Missing functionality:** No conversation memory/history is persisted (chat resets when the sheet is closed and reopened — `messages` is local `useState`, not synced to `DataAdapter`); no ability for the model to take actions (by design — the system prompt explicitly forbids confirming bookings/cancellations and instructs a hand-off phrase instead); no in-app voice/call feature despite UI affordance for it.
- **Technical debt:** None beyond the design choice to keep this "answer-only" per the system prompt.

---

### 11. Concierge Handoff Queue

- **Description:** Unanswered/open-ended client questions are logged for the operator to review and answer manually, or convert into a new Case.
- **Status:** Partially wired — **the actual code path that calls `addHandoff()` from the Concierge chat was not found in `ConciergeAI.tsx`** in this audit (the seed data includes 3 example handoffs, and `AppContext.addHandoff` exists and is exposed, but the chat component's fallback path does not appear to call it — see `12_Open_Questions.md` for confirmation needed).
- **Dependencies:** `DataAdapter.addHandoff`/`resolveHandoff`.
- **Files involved:** `OperatorPanel.tsx` (queue UI: Pending/Resolved tabs, reply textarea, "Convert to Case" button), `dataAdapter.ts`, `AppContext.tsx`.
- **User workflow (operator side, confirmed working):** Operator Panel shows pending handoffs with the client's original question; operator can type a reply and "Reply & Sync" (marks resolved with the reply text stored), "Resolve without Reply," or "Convert to Case" (creates a new Case pre-filled with the question as the title).
- **Missing functionality:** No notification to the operator when a new handoff is created (no push, no WhatsApp trigger observed calling `notifyNewCase`/similar for handoffs specifically); operator replies are stored in `handoffs` but there is no UI surface shown to the *client* to view "Mimo's replies" to their prior questions (the reply is stored, not obviously surfaced back into the chat transcript).
- **Technical debt:** Seed data (`INITIAL_HANDOFFS` in `dataAdapter.ts`) is duplicated/hardcoded directly inside the adapter file rather than in `seedData.ts` alongside the other seeds, an inconsistent seeding pattern.

---

### 12. Proactive "Radar" Suggestions

- **Description:** Hardcoded upcoming key dates (lease end, passport expiry, DEWA billing cycle, a recurring Friday restaurant reservation) surface as accept/dismiss cards once a lead-time window is reached.
- **Status:** Live.
- **Dependencies:** `client/src/data/keydates.json`, `DataAdapter`.
- **Files involved:** `RadarCard.tsx`, `BriefingScreen.tsx` (renders at most 1 active suggestion), `WeekStrip.tsx` (also surfaces key dates within the next 7 days), `AppContext.tsx` (`activeRadarSuggestions` memo).
- **User workflow:** When `today >= date - lead_time_days` and status is `pending`, a card appears on the Briefing screen ("Yes, please" creates a new Case automatically; "Not now" dismisses it, both persisted as a status change on the key date).
- **Missing functionality:** Key dates are static seed data with no UI to add/edit/remove them (no "add key date" form anywhere); no recurrence logic beyond the data's own `category: 'pattern'` label (accepting a "pattern" suggestion does not automatically reschedule the next occurrence).
- **Technical debt:** `keydates.json`'s dates are fixed calendar dates (e.g., `2026-07-28`, `2026-07-31`) that will become permanently stale/past-due without a code or data update — there is no relative-date generation.

---

### 13. Briefing (Home Screen)

- **Description:** The default landing screen: time-aware greeting, an editable "today's briefing" prose card, a "requires your attention" list of cases awaiting client decision, quick-access tiles (Services, Take me home, Call Mimo placeholder, Contacts, Connections), the WeekStrip, at most one Radar suggestion, and recently-completed case chips.
- **Status:** Live.
- **Dependencies:** `DataAdapter` (`briefing`), most of `AppContext`.
- **Files involved:** `BriefingScreen.tsx`, `WeekStrip.tsx`, `RadarCard.tsx`.
- **User workflow:** Operator can tap the briefing prose to edit it inline (textarea + Save/Cancel); a "Read more/less" toggle appears for long text; the collapsed/expanded state resets based on a one-time `briefing-visited` localStorage flag (collapsed by default after first visit).
- **Missing functionality:** No versioning/history of past briefings (each `updateBriefingText` call fully overwrites the single `BriefingData` object, discarding the previous text with only `lastUpdated` changing).
- **Technical debt:** None beyond the above.

---

### 14. Archive (Completed Cases)

- **Description:** Completed cases grouped by completion month, with search.
- **Status:** Live.
- **Dependencies:** `DataAdapter` (`cases` filtered by `clientState === '✔️ Completed'`).
- **Files involved:** `ArchiveScreen.tsx`.
- **User workflow:** Search by title/emoji; browse month-grouped, newest month first; tap through to `CaseDetailScreen`.
- **Missing functionality:** No export of the archive; no filtering by category within the archive.
- **Technical debt:** None notable.

---

### 15. WhatsApp Integration

- **Description:** Two independent mechanisms: (a) always-on `wa.me` deep links for user-initiated contact, (b) a WhatsApp Business Cloud API sender for server-push notifications, currently a documented no-op.
- **Status:** (a) Live. (b) Not live — infrastructure only, per the file's own header comment: *"activates the moment Meta business verification completes and `VITE_WHATSAPP_TOKEN`/`VITE_WHATSAPP_PHONE_ID` are configured. Until then, calls are safely no-ops (logged + queued in localStorage)."*
- **Dependencies:** None for (a); Meta Graph API + `VITE_`-prefixed env vars for (b).
- **Files involved:** `whatsapp.ts`, `CaseCard.tsx`, `CaseDetailScreen.tsx`, `ContactsScreen.tsx`, `CasesScreen.tsx` (calls `notifyNewCase` on case creation, which is currently a no-op given (b) is inactive).
- **User workflow:** Tapping a WhatsApp icon anywhere opens `wa.me` with a pre-filled message referencing the specific case/contact.
- **Missing functionality:** No real push notification delivery to the client's WhatsApp today.
- **Technical debt:** The token/phone-ID for a *business-to-consumer notification API* are modeled as `VITE_`-prefixed (client-bundled) env vars — if ever configured as documented, the Meta access token would ship inside the public JS bundle (see `11_Risk_Assessment.md`).

---

### 16. Google Sheets Finance Sync

- Covered in detail in `03_System_Architecture.md` and `07_API_Inventory.md`. Status: Live (conditional on server env vars); full-overwrite semantics; no incremental sync; receipts intentionally excluded from the synced payload.

---

### 17. PWA Install / Offline Support

- **Description:** Installable web-app manifest, custom service worker, an install-prompt banner shown 30 seconds after page load (once, unless dismissed permanently).
- **Status:** Live.
- **Dependencies:** `client/public/manifest.json`, `client/public/sw.js`.
- **Files involved:** `InstallBanner.tsx`, `AppContext.tsx` (`beforeinstallprompt` handling, online/offline toasts), `client/index.html`.
- **User workflow:** After 30s (if not already installed/standalone and not previously dismissed), a bottom banner offers "Add to your home screen"; browser's native install prompt is triggered on tap.
- **Missing functionality:** No update-available UI (the service worker updates silently; a returning user only gets new assets after the cache-version bump ships and the old caches are purged on `activate`).
- **Technical debt:** Two separate service-worker registration call sites (see `03_System_Architecture.md`) — redundant but not necessarily harmful (`register()` is idempotent), yet unreviewed for race conditions.

---

### 18. JSON Backup Export / Import / Reset

- **Description:** Operator tools to export all local data as a downloadable JSON file, import a JSON file back in (`DataAdapter.importDataJSON`, not observed to be wired to any UI control — see below), and reset all data to the original seed.
- **Status:** Export and Reset are live and wired to UI (`OperatorPanel.tsx`). **Import does not appear to have a corresponding UI control** in any component read during this audit (the method exists in `DataAdapter` but no file-input/"Import backup" button was found calling it) — see `12_Open_Questions.md`.
- **Dependencies:** `DataAdapter.exportDataJSON`/`importDataJSON`/`resetToDefaultSeed`.
- **Files involved:** `OperatorPanel.tsx`, `dataAdapter.ts`, `AppContext.tsx` (`exportJSON`, `resetAllData`).
- **User workflow:** "Export Backup (JSON)" downloads a timestamped `.json` file; "Reset Seed Data" (behind a native `confirm()` dialog) wipes all localStorage-backed collections back to the hardcoded seed data.
- **Missing functionality:** No import UI; no scheduled/automatic backups; no cloud backup destination.
- **Technical debt:** `resetAllData` is a hard, unrecoverable action once confirmed (no "undo," no server-side copy to restore from, since there is no server-side data at all).

---

### 19. Error Boundary

- **Description:** A React class component (`ErrorBoundary.tsx`) implementing `getDerivedStateFromError` to catch render errors and show a "reload" screen.
- **Status:** **Built but not integrated.** Confirmed by repository-wide search: no file imports `ErrorBoundary` — it does not wrap `<App/>` in `main.tsx` or anywhere else. It currently has no effect on the running application.
- **Dependencies:** None beyond React.
- **Files involved:** `client/src/components/ErrorBoundary.tsx`.
- **Missing functionality:** Integration into the app tree.
- **Technical debt:** Dead code.

---

### 20. Unused shadcn/ui Component Library

- **Description:** 54 generic UI primitive files (accordion, dialog, table, sidebar, calendar, carousel, command palette, form, chart wrapper, etc.) following the shadcn/ui + Radix UI convention.
- **Status:** Present in the repository; **confirmed unused** — no file outside `client/src/components/ui/` imports from that directory.
- **Dependencies:** Numerous Radix UI packages, `cmdk`, `embla-carousel-react`, `react-day-picker`, `react-hook-form`, `@hookform/resolvers`, `input-otp`, `next-themes`, `sonner`, `vaul`, `react-resizable-panels` — all installed as production dependencies to support this unused layer (see `09_Dependency_Report.md`).
- **Missing functionality:** N/A (not a feature of the running app).
- **Technical debt:** Significant — this is dead weight in both the dependency tree and the mental model of the codebase for a future maintainer, since it visually resembles a design system in active use.

---

### 21. Debug/Dev Platform Hooks ("Manus")

- **Description:** Vite dev-server plugins and a browser-side script that collect console logs, network requests, and session replay data, plus a storage-presigning proxy — tied to a third-party AI app-building platform ("Manus") the project appears to have been built/iterated on.
- **Status:** Active only in local development (`transformIndexHtml` explicitly skips injecting the debug-collector script when `NODE_ENV === 'production'`); inert in the deployed production build.
- **Dependencies:** `vite-plugin-manus-runtime` (devDependency), local filesystem (`.manus-logs/` directory, gitignored implicitly via general ignores — not explicitly named in `.gitignore` but the directory is not tracked).
- **Files involved:** `vite.config.ts` (multiple plugin functions), `client/public/__manus__/debug-collector.js`, `template.json`.
- **Missing functionality:** N/A — this is tooling, not an application feature.
- **Technical debt:** Couples the build configuration to a specific third-party development platform; a maintainer unfamiliar with "Manus" would need to reverse-engineer these plugins' purpose (there is no README explaining them beyond inline code comments).
