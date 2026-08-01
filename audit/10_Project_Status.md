# 10 — Project Status

## Completed Components

Confirmed working end-to-end in code (client logic present, no obvious broken wiring found in this audit):
- Login gate (username/password, client-side) + biometric login option
- Operator/client mode toggle
- Cases: list, filter (state + category, with collapsible groups), search, create, detail view, subtasks with progress chart, quotations comparison, one-tap decision approval, timeline entries, completion with proof
- Case category taxonomy: 13 built-in nested categories + user-added custom categories
- Finance ledger: create/delete transactions, month selector, summary cards, all-time running balance, CSV export, receipt photo attach (base64), Paid By / Payment Method tagging
- Google Sheets sync (conditional on server credentials) and its "pending" UI state
- Concierge AI: local keyword-based answering + Gemini server fallback + graceful degradation
- Operator Panel: briefing edit, handoff queue (reply/resolve/convert-to-case UI), JSON export, reset-to-seed
- Archive of completed cases, grouped by month, searchable
- Contacts directory (hardcoded, tap-to-call/WhatsApp)
- Connections grid (hardcoded, external links)
- Services catalogue (static, read-only)
- Proactive Radar suggestions (accept/dismiss, hardcoded key dates)
- WeekStrip (7-day view of key dates + case due dates)
- PWA manifest + service worker + install banner
- WhatsApp `wa.me` deep links (case- and contact-level)

## Partially Completed Components

- **WhatsApp Business Cloud API push notifications** — code is fully written (`whatsapp.ts`) and called from case-lifecycle events, but is inert (queues to `localStorage` instead of sending) until `VITE_WHATSAPP_TOKEN`/`VITE_WHATSAPP_PHONE_ID`/`VITE_LAYLA_WHATSAPP` are configured — and even then, would expose the Meta token client-side (see `11_Risk_Assessment.md`).
- **Concierge Handoff queue** — the operator-facing UI (reply, resolve, convert-to-case) is fully built in `OperatorPanel.tsx` and the underlying `DataAdapter` methods work, but no code path in `ConciergeAI.tsx` was found calling `AppContext.addHandoff()` — meaning new handoffs may not actually be created from real chat usage today (only the 3 seeded example handoffs exist by default). See `12_Open_Questions.md` for verification needed.
- **JSON backup import** — `DataAdapter.importDataJSON()` exists and is functional in isolation, but no UI control (file picker / "Import" button) was found calling it anywhere in the audited components.
- **Finance transaction editing** — `AppContext.updateTransaction` exists and is exposed, but `FinanceScreen.tsx` only wires up create and delete actions; there is no visible "edit" affordance in the ledger rows.
- **Bills/Utilities screen and `DataAdapter.getUtilities()` data** — `UtilitiesPanel.tsx` renders a separate, fully hardcoded `BILLS` array rather than the `utilities` collection served by `DataAdapter`/`AppContext`; the two data sets have diverged (different account details, an extra "Just Life" entry). It is unclear whether the `utilities` context data is rendered anywhere at all (see `12_Open_Questions.md`).
- **`/api/finance/status` endpoint** — implemented on the server, but no calling code was found in `FinanceScreen.tsx` or elsewhere in the client; the client instead infers "sync pending" purely from the response of an actual `/api/finance/sync` call attempt.

## Broken Components

None were identified as broken (i.e., present, wired up, and throwing/crashing) within the scope of static code reading performed for this audit. This audit did **not** execute the application (no `pnpm install`/`pnpm run dev`/`pnpm run build` was run), so runtime-only defects cannot be ruled out — see `12_Open_Questions.md`.

## Experimental / Non-Functional-by-Design Components

- **"Call Mimo" in-app voice call** — UI buttons exist (`ConciergeAI.tsx` chat header, `BriefingScreen.tsx` quick-access tile) but both simply show a "coming soon" toast; there is no calling/telephony code at all.
- **WebAuthn biometric login** — functional as browser-native WebAuthn calls, but the challenge/verification model does not follow a secure client-server WebAuthn pattern (see `11_Risk_Assessment.md`); effectively a UX/demo-level implementation rather than a hardened auth factor.
- **Analytics script tag** (`client/index.html`) — references unresolved template placeholders (`%VITE_ANALYTICS_ENDPOINT%`, `%VITE_ANALYTICS_WEBSITE_ID%`) with no substitution mechanism found in this repository.

## Known Issues (objectively observable in code)

1. `client/src/components/ErrorBoundary.tsx` is never imported/mounted anywhere — unhandled render errors will show React's default error overlay (dev) or a blank/broken page (production), not the custom recovery UI that exists in the codebase for exactly this purpose.
2. `ideas.md` describes a trilingual PT/EN/HE RTL design system that contradicts the current English-only/LTR implementation and was not updated when the language layer was removed (commit `5a7f6e2`).
3. `UtilityItem.type` (`types/index.ts`) omits `'Just Life'` from its union even though `CaseItem.utilityType` includes it, and `UtilitiesPanel.tsx`'s hardcoded data includes a "Just Life" row that bypasses the typed `UtilityItem` model entirely.
4. Two independent, non-identical category taxonomies exist for the same general concept (`CASE_CATEGORIES` in `appConfig.ts`, English IDs; `FINANCE_CATEGORIES` in the same file, Portuguese-origin IDs like `casa`/`utilidades`/`transporte`), left over from the pre-Phase-2 migration.
5. `resolveCaseCategory()` carries a permanent legacy-ID translation table and an emoji-based fallback map, both required only to keep pre-migration seed/legacy case data displaying correctly.
6. `package.json` declares two different pnpm versions (`packageManager: 10.4.1+sha...` vs. `devDependencies.pnpm: ^10.15.1`).
7. `tailwindcss-animate` is a declared dependency with no import/reference anywhere in the codebase (superseded by `tw-animate-css`, which is actually imported).
8. `zod`, `nanoid`, `streamdown`, `@hookform/resolvers` are declared dependencies with zero imports anywhere.
9. The entire `client/src/components/ui/` directory (54 files) and its supporting dependency tree (24 Radix packages plus 8 others) are unused by the shipped application.
10. `client/public/sw.js`'s cache-busting scheme requires a manual version-string bump (`v3` → `v4`, etc.) on every release that changes cached assets, per the file's own header comment — an easy step to forget, which would cause returning PWA users to see a stale bundle.
11. Service-worker registration is attempted from two separate code locations (`client/index.html` inline script and `AppContext.tsx`'s effect), with two different guard conditions.
12. The in-app Finance screen displays a permanent developer warning banner in production ("Real authentication pending — do not publish with real financial data...") with no mechanism to hide it short of a code change.

## Blocked Work

Per `AI_CONTEXT.md`'s own roadmap notes, the following are explicitly blocked pending external prerequisites, not pending further coding effort alone:
- **WhatsApp Business Cloud API activation** — blocked on Meta business verification completing (an external, non-code dependency).
- **Phase 5 automation (invoice/email/WhatsApp/Sheets on submit)** — blocked on operator decisions ("3 addresses TBD") and acquiring an email service key (Resend recommended in the doc, not yet integrated) and a WhatsApp Business API credential.
- **Phase 4 (Notion source-of-truth bridge)** — per `AI_CONTEXT.md`, the Notion databases exist externally, but the code-side bridge (server API reading/writing to Notion) has not been started.

## Technical Debt

Consolidated list (individual items detailed in their respective sections above and in `04_Feature_Catalog.md`):
- Unused shadcn/ui component layer and its dependency footprint.
- Unused npm packages (`zod`, `nanoid`, `streamdown`, `@hookform/resolvers`, `tailwindcss-animate`).
- Dead `ErrorBoundary` component.
- Duplicated/diverging "utilities" data model (context collection vs. hardcoded panel data).
- Two independent, inconsistent category taxonomies (case vs. finance).
- Legacy-category translation and emoji-fallback compatibility code with no sunset plan.
- Base64 photo storage directly inside `localStorage`-persisted JSON (explicitly marked `// TODO cloud storage` in source).
- Permanent "dev banner" in the Finance screen.
- Manual, easy-to-forget service-worker cache-version bump requirement.
- No automated tests despite a test runner (`vitest`) being installed.
- No CI/CD pipeline of any kind.
- Stale root-level design document (`ideas.md`) contradicting the implemented design.

## Current Priorities

Per `AI_CONTEXT.md`'s own stated roadmap (the most authoritative "current priorities" source found in this repository, though it is a project note, not code, and its accuracy relative to the actual code state was cross-checked wherever possible in this audit):
1. Phase 4 — Notion source-of-truth bridge (server-side read/write to Notion for tasks and finance).
2. Phase 5 — invoice/email/WhatsApp/Sheets automation triggered on finance submission.
3. Phase 6 — AI task-creation agent (natural-language case creation) built on the existing Gemini wiring.

`AI_CONTEXT.md`'s own guardrails instruct future work to proceed "one phase at a time" and explicitly not to redesign, restart, or combine phases — this audit does not assess whether that guidance is being followed, only that it exists as the documented intent.
