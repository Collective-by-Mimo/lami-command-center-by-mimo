# AI_CONTEXT — LaMi Command Center (handover)

Short handover so a new Claude Code / AI session can continue without re-reading the whole history.

## Project goal
A **private, login-only PWA** ("LaMi Command Center") that lets the operator (Mimo) run a concierge/lifestyle-management service for the client (Layla). One portal replaces many apps: tasks ("cases"), finance, bills, contacts, provider portals, an AI concierge, and a service catalogue. **English-only, LTR.** Design tokens: cream `#F7F5F1`, teal `#145A52`/`#0E3F3A`, gold `#B8912E`, Cormorant (headings) + Inter (body). Card surfaces use a warm 1px hairline (`#E7E1D5`), not heavy shadows.

## Stack & deploy
- **React + Vite + TypeScript** client in `client/src`, **Express** in `server/index.ts`, **Vercel serverless** functions in `api/` (shared code in `api/_lib/`).
- Data currently persists in the **browser (localStorage)** via `client/src/services/dataAdapter.ts`. **Notion is NOT yet wired into the app** (it's connected to Claude via MCP and has the LaMi databases, but the deployed app does not read/write it yet).
- GitHub: `Collective-by-Mimo/lami-command-center-by--manus` (repo was renamed to `lami-command-center-by-mimo`; same repo). Work branch history lives on `main`.
- Vercel project: `lami-command-center-by-mimo` (team "Mimo's Collective"). Auto-deploys on push to `main`.
- **Live URL:** https://lami-command-center-by-mimo.vercel.app · login `Layla_Portal` / `@Mimo2026` (or `VITE_APP_PASSWORD` env).
- Verify a deploy is green before reporting "done". Build with `pnpm run build`; typecheck `pnpm run check`.

## Already working (LIVE)
- Screens: Briefing, Cases (+ category filter/collapsible groups), Case Detail (quotations, decision approve, timeline, completion proof, subtask chart), Finance (AED ledger, monthly summary, receipt photo upload, CSV export, gated Google Sheets sync), Bills/Utilities, Archive, Contacts (tap-to-call), Connections (provider portals), Services (full catalogue with Live/Ready/Phase 2 badges), Concierge (server-side Gemini, graceful WhatsApp fallback).
- Per-case WhatsApp button; "Take me home"; PWA installable; service worker cache v3.
- **Phase 1 (DONE):** the app is private/login-only, so **any logged-in user now has full control by default** — Add task, Add finance, Edit, Delete, and photo-upload buttons are always visible (no `?operator=1` needed). `?op=0` gives a read-only "client preview". Change was in `client/src/context/AppContext.tsx` (isOperator defaults on). **Do not redo Phase 1.**

## Still missing (planned)
- **Categories are too narrow** and only show when a task already exists in them → Phase 2 (this task).
- **Finance has no cash-flow** (no "Paid By" / payment-method, no running balance, no invoice) → Phase 3.
- **Notion is not the source of truth** (app uses localStorage) → Phase 4.
- **No invoice email / WhatsApp / Sheets automation on submit** → Phase 5.
- **No AI task-creation agent** (natural-language "create task X"); the Concierge exists but isn't a task creator → Phase 6.

## Roadmap (do in order; one phase at a time, verify + deploy + report between each)
- **Phase 2 (NEXT / in progress): rebuild the category system.** 13 nested, always-selectable categories:
  Home & Accommodation · Transportation · Reservations & Bookings · Fashion & Luxury · Health & Wellness · Mother & Daughter · Finance & Admin · Documents & Compliance · Staff & Household Help · Groceries & Consumables · Travel & Mobility · Personal & Lifestyle · Emergency.
  Rules: keep nested + always selectable; allow "add your own"; **do NOT** redesign the app, touch Notion, or start invoicing/email/WhatsApp/Sheets. Keep UI consistent. Files: `client/src/config/appConfig.ts` (CASE_CATEGORIES), `client/src/types/index.ts` (add `subcategory?`), `client/src/data/seedData.ts` (remap category ids), `client/src/components/CasesScreen.tsx` (all-selectable chips + subcategory in New Case modal).
- **Phase 3: finance cash-flow.** Money In/Out entries with two dropdowns — **Paid By** (Layla · Lior · Mimo · Other→type) and **Payment Method** (Cash · Card · Bank Transfer · PayPal · Voucher · Exchange · Crypto · Split e.g. Cash+Card); amount, date, category, description, receipt photo; running balance.
- **Phase 4: Notion source-of-truth bridge.** App reads/writes tasks + finance to Notion via a server API (databases exist: "Casos"/"Seus casos", "My Tasks").
- **Phase 5: invoice/email/WhatsApp/Sheets automation.** On finance submit → auto-generate an internal invoice → email to **3 addresses (TBD from operator)** + WhatsApp notice + reflect in Google Sheet. Needs: email service key (recommend Resend), WhatsApp Business API (Meta) for true auto-send (else pre-filled wa.me), Google Sheets service-account key (`GOOGLE_SHEETS_CREDENTIALS` + `GOOGLE_SHEETS_SPREADSHEET_ID`).
- **Phase 6: AI task agent + concierge.** Natural-language task creation with rules: no date → create at real "now"; explicit date → use that exact time even if already past; map to the correct existing category, else create a new one. Recommended model: **reuse Gemini Flash-Lite** (already wired for the Concierge; free tier; no new key) rather than adding Kimi/Groq. The "navigation AI (virtual Mimo)" = the existing Concierge, enhanced.

## Guardrails
- Make only the next safe change; don't restart from zero; don't redesign.
- Keep English-only + LTR. Preserve the trilingual `I18nText` data shape already in the code (only the English value renders).
- After each phase: `pnpm run check` + `pnpm run build` clean, push to `main`, confirm the Vercel production deploy is READY, then report exactly what changed and stop.
