# 11 — Risk Assessment

Objective, code-evidenced risks only. No remediation suggestions are included (out of scope for this audit). Severity reflects potential impact if the described condition is exploited or triggered, given the application's stated purpose (managing a real person's private tasks, finances, and personal data).

---

### CRITICAL

**R1 — No server-side authentication or authorization on any API route.**
- Evidence: `api/concierge.ts`, `api/finance/status.ts`, `api/finance/sync.ts`, and their Express equivalents in `server/index.ts` check only HTTP method, never any credential, session token, or origin/referrer.
- Impact: Anyone who can reach the deployed URL can call `POST /api/concierge` (consuming the operator's Gemini API quota/cost with arbitrary prompts) or `POST /api/finance/sync` (overwriting the operator's configured Google Sheet with arbitrary attacker-supplied data), without ever logging into the app.

**R2 — Application-wide login credential is a single shared secret compared in client-side JavaScript, with a hardcoded default.**
- Evidence: `client/src/context/AppContext.tsx`: `const APP_USER = (import.meta.env.VITE_APP_USER || 'Layla_Portal').trim(); const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || '@Mimo2026';` and `login()` performs a plain string comparison. Both the fallback values and, if set, any `VITE_APP_PASSWORD` override are compiled into the publicly downloadable client JS bundle (`.env.example`'s own comment confirms this: *"anyone who loads the app can extract them"*).
- Impact: Any party with network access to the built bundle can read the credential(s) directly out of the JavaScript source, bypassing the login screen entirely, and gain full "operator" access (which defaults to on) to real personal and financial data about a named individual.

---

### HIGH

**R3 — Personal financial and case data for a real, named individual is stored unencrypted in browser `localStorage`, including base64-encoded receipt/proof photographs.**
- Evidence: `client/src/services/dataAdapter.ts` persists `FinanceTransaction[]` (including `receiptBase64`) and `CaseItem[]` (including `completionProof.photoUrl`) as plain JSON strings under predictable `localStorage` keys (`lami_finance_data_v1`, `lami_cases_data_v1`), with no encryption at rest. `seedData.ts` contains real-looking financial figures and account-adjacent details (e.g., a Tasleem balance dispute amount) as example data.
- Impact: Any script able to execute in the page's origin (e.g., via an XSS vector, a malicious browser extension, or physical/shared-device access) can read the entirety of the operator's and client's business and financial history in plaintext.

**R4 — WebAuthn ("biometric login") implementation does not follow the standard server-verified challenge/credential model.**
- Evidence: `client/src/utils/webauthn.ts` generates the WebAuthn challenge client-side (`window.crypto.getRandomValues`) instead of receiving it from a server, and stores/compares the resulting credential ID in `localStorage` rather than verifying an attestation/assertion server-side. The file's own comment acknowledges: *"In a real scenario, this would come from a server challenge."*
- Impact: The biometric login path does not provide the cryptographic assurance WebAuthn is designed to provide; it functions closer to "local device unlock" than a verified second factor, while presenting UI (`ShieldCheck` iconography, "Private access" copy) suggesting stronger assurance to the user.

**R5 — If the documented WhatsApp Business Cloud API token is ever configured as instructed, it will be embedded in the public client bundle.**
- Evidence: `client/src/services/whatsapp.ts` reads `VITE_WHATSAPP_TOKEN` and `VITE_WHATSAPP_PHONE_ID` — both `VITE_`-prefixed, meaning Vite inlines them into the built JavaScript at build time (same mechanism as R2). `AI_CONTEXT.md` Phase 5 notes describe this as the planned activation path ("WhatsApp Business API (Meta) for true auto-send").
- Impact: A Meta Business API token with send-message privileges for the operator's WhatsApp Business account would become extractable by anyone loading the app, allowing impersonation/abuse of that messaging channel if this integration is activated exactly as currently coded.

**R6 — No rate limiting on any endpoint, combined with a paid/quota-metered third-party API (Gemini) and a destructive third-party write operation (Sheets overwrite).**
- Evidence: No rate-limiting code exists anywhere in `api/` or `server/index.ts` (confirmed by full read of both). `api/_lib/sheets.ts::syncLedgerToSheet` performs a full clear-then-overwrite of a fixed spreadsheet range on every call with no authentication gate (see R1).
- Impact: Combined with R1, an unauthenticated party can drive unbounded Gemini API cost and repeatedly overwrite the operator's Google Sheet with garbage data, with no code-level throttle to slow this down.

**R7 — No automated test suite and no CI/CD pipeline exist for an application handling private personal/financial data.**
- Evidence: `vitest` is a declared devDependency, but zero `*.test.*`/`*.spec.*` files exist anywhere in the repository. No `.github/workflows/` or other CI configuration exists.
- Impact: Regressions in security-relevant logic (auth checks, data-sanitization boundaries such as `buildGroundingData()`'s exclusion list) or in core data operations (case/finance mutations) have no automated safety net before reaching the production deployment described in `AI_CONTEXT.md`.

---

### MEDIUM

**R8 — Client-supplied, unauthenticated input is embedded directly into the Gemini system prompt without sanitization for prompt-injection content.**
- Evidence: `api/_lib/concierge.ts::conciergeSystemPrompt` embeds `JSON.stringify(groundingData ?? {})` — which per `client/src/services/concierge.ts` is normally built from trusted local app state, but because the API route itself is unauthenticated (R1), an attacker can call `/api/concierge` directly with an arbitrary `groundingData` payload of their own construction, not the client-computed one.
- Impact: An attacker with direct API access could attempt prompt-injection against the model, or use the endpoint as a free-form, un-billed-to-them Gemini proxy for unrelated purposes, within the model's 220-token output budget.

**R9 — Case-completion "proof" photos and Concierge "photo/proof URL" fields accept arbitrary attacker/operator-supplied URLs rendered as `<img>` tags across origins.**
- Evidence: `CaseDetailScreen.tsx` renders `completionProof.photoUrl` and timeline `photos[]` via `<img src={...} referrerPolicy="no-referrer">` without any URL validation (protocol/host allowlist) before rendering.
- Impact: While `referrerPolicy="no-referrer"` mitigates referrer leakage, no content-type or origin validation exists; this is a data-integrity/trust concern more than an active exploit path given the operator-only entry point, but it means any string can be stored and later rendered as an image source, including `javascript:`-adjacent edge cases depending on browser handling (not independently verified in this audit — flagged as a code-level absence of validation, not a confirmed XSS).

**R10 — Full-overwrite Google Sheets sync has no conflict handling or history.**
- Evidence: `api/_lib/sheets.ts::syncLedgerToSheet` always performs `values/{range}:clear` immediately followed by a full `PUT` of the current in-memory ledger; there is no revision check, no append-only log, no backup of the sheet's prior contents before clearing.
- Impact: Any manual edits a human made directly in the Google Sheet between syncs are silently destroyed on the next sync; a bug in the client's transaction array (or the attack described in R6) can permanently wipe the sheet's contents with no recovery path visible in this codebase.

**R11 — Single point of data loss: all application data lives only in one browser's `localStorage`, with a one-click, confirmation-gated but irreversible "reset to seed data" action and no server-side backup.**
- Evidence: `DataAdapter.resetToDefaultSeed()` overwrites every collection back to hardcoded seed values; it is wired to `OperatorPanel.tsx`'s "Reset Seed Data" button behind a native `confirm()` dialog only. No server copy of the data exists to restore from (per `06_Data_Model.md`).
- Impact: Clearing browser storage (user action, browser policy, private-browsing mode, or a user mistakenly confirming the reset dialog) permanently destroys the operator's and client's actual working data, recoverable only from whatever JSON export files a human separately downloaded and retained via the (working) "Export Backup" feature.

---

### LOW

**R12 — Two independent service-worker registration call sites with different guard conditions.**
- Evidence: `client/index.html` registers `sw.js` inline guarded by `location.hostname !== 'localhost'`; `AppContext.tsx`'s effect registers it again guarded by `serviceWorker in navigator && location.protocol !== 'file:'`. `navigator.serviceWorker.register()` is idempotent per the Service Worker spec, so this is unlikely to cause a functional failure, but it is redundant, unreviewed code that could mask a future logic error in either path.
- Impact: Low — primarily a maintainability/clarity concern, not a demonstrated functional defect.

**R13 — Manual, easy-to-forget cache-version bump requirement for the service worker.**
- Evidence: `client/public/sw.js` header comment: *"Bump these on every release that ships new UI so the `activate` handler purges the previous caches — otherwise a returning PWA can serve a stale bundle and appear to be 'missing' newly shipped features."*
- Impact: If a future release forgets this manual step, installed-PWA users could silently continue to see an outdated version of the app, including outdated case/finance data displays (though not outdated *localStorage* data itself, since that is separate from the asset cache).

**R14 — Dead `ErrorBoundary` component provides no actual protection.**
- Evidence: Confirmed via repository-wide search — `ErrorBoundary.tsx` is never imported.
- Impact: An unhandled render-time exception anywhere in the component tree will surface as an unstyled crash/blank screen to the client or operator rather than the graceful "reload" UI that already exists in the codebase for this purpose.

**R15 — Stale, contradictory design documentation (`ideas.md`) left in the repository root.**
- Evidence: `ideas.md` describes trilingual PT/EN/HE + RTL support, directly contradicted by the current English-only/LTR implementation confirmed in `client/src/types/index.ts` (`Language = 'en'`) and `AI_CONTEXT.md`.
- Impact: Low direct security/functional impact, but a realistic source of confusion for any future contributor or AI assistant reading root-level docs without cross-referencing the actual code.
