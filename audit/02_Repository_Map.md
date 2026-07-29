# 02 — Repository Map

## Complete Folder Tree

(Excludes `.git/`, `node_modules/` — neither exists as a working directory in this checkout. All other tracked files are listed.)

```
lami-command-center-by-mimo/
├── .env.example
├── .gitignore
├── .gitkeep
├── .prettierignore
├── .prettierrc
├── AI_CONTEXT.md
├── ideas.md
├── package.json
├── pnpm-lock.yaml
├── template.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
├── api/
│   ├── _lib/
│   │   ├── apiTypes.ts
│   │   ├── concierge.ts
│   │   └── sheets.ts
│   ├── concierge.ts
│   └── finance/
│       ├── status.ts
│       └── sync.ts
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── .gitkeep
│   │   ├── __manus__/
│   │   │   └── debug-collector.js
│   │   ├── favicon.png
│   │   ├── icons/
│   │   │   ├── icon-192.png
│   │   │   └── icon-512.png
│   │   ├── manifest.json
│   │   └── sw.js
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── components/
│       │   ├── ArchiveScreen.tsx
│       │   ├── BriefingScreen.tsx
│       │   ├── CaseCard.tsx
│       │   ├── CaseDetailScreen.tsx
│       │   ├── CasesScreen.tsx
│       │   ├── ConciergeAI.tsx
│       │   ├── ConnectionsScreen.tsx
│       │   ├── ContactsScreen.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── FinanceScreen.tsx
│       │   ├── Header.tsx
│       │   ├── InstallBanner.tsx
│       │   ├── LoginScreen.tsx
│       │   ├── Navbar.tsx
│       │   ├── OperatorPanel.tsx
│       │   ├── ProofModal.tsx
│       │   ├── RadarCard.tsx
│       │   ├── ServicesScreen.tsx
│       │   ├── SubtaskProgressChart.tsx
│       │   ├── Toast.tsx
│       │   ├── UtilitiesPanel.tsx
│       │   ├── WeekStrip.tsx
│       │   └── ui/                     (54 shadcn/ui primitive files — see note below)
│       ├── config/
│       │   ├── appConfig.ts
│       │   └── serviceCatalogue.ts
│       ├── context/
│       │   └── AppContext.tsx
│       ├── data/
│       │   ├── keydates.json
│       │   └── seedData.ts
│       ├── hooks/
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       ├── lib/
│       │   └── utils.ts
│       ├── services/
│       │   ├── concierge.ts
│       │   ├── dataAdapter.ts
│       │   ├── localConcierge.ts
│       │   └── whatsapp.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           ├── haptics.ts
│           └── webauthn.ts
├── components.json
└── server/
    └── index.ts
```

## Purpose of Every Folder

| Folder | Purpose |
|---|---|
| `/` (root) | Project metadata, build config, environment template, and two free-form project notes (`AI_CONTEXT.md`, `ideas.md`). |
| `api/` | Vercel serverless function entry points. Each `.ts` file directly under `api/` (or under `api/finance/`) maps to a deployed HTTP route; files under `api/_lib/` are shared library code, not routes themselves. |
| `api/_lib/` | Business logic shared between the Vercel serverless handlers and the standalone Express server: Gemini concierge logic, Google Sheets sync logic, minimal request/response type shims. |
| `api/finance/` | The two finance-related serverless routes (`/api/finance/status`, `/api/finance/sync`). |
| `client/` | The entire frontend application; configured as Vite's project `root` (see `vite.config.ts`). |
| `client/public/` | Static assets copied as-is into the build output: PWA manifest, service worker, icons, favicon, and a debug-collector script for the "Manus" dev platform. |
| `client/public/__manus__/` | Third-party dev-platform debug tooling (see `08_Configuration_Report.md`); not part of the LaMi application logic. |
| `client/public/icons/` | PWA home-screen icons (192×192, 512×512). |
| `client/src/` | All application TypeScript/TSX source. |
| `client/src/components/` | React screen and widget components specific to LaMi (21 files). |
| `client/src/components/ui/` | Generic shadcn/ui component primitives (accordion, dialog, button, table, sidebar, etc.) generated from the shadcn/ui + Radix UI convention declared in `components.json`. **Confirmed by repository-wide search: none of these 54 files are imported by any file outside this same directory** — i.e., none are used by the actual application screens. Left in place as unused scaffolding. |
| `client/src/config/` | Static, operator-editable configuration data: contact directory, provider-portal links, case-category taxonomy, finance categories, and the full service catalogue shown on the Services screen. |
| `client/src/context/` | The single React context (`AppContext`) that holds all client-side application state and the functions that mutate it. |
| `client/src/data/` | Seed/fixture data used to initialize `localStorage` on first run: hardcoded example cases, briefing text, utilities, finance transactions (`seedData.ts`), and hardcoded "key dates" for the proactive radar feature (`keydates.json`). |
| `client/src/hooks/` | Small reusable React hooks: IME composition handling (used by the unused `ui/input.tsx`/`ui/textarea.tsx`), a mobile-breakpoint hook (used by the unused `ui/sidebar.tsx`), and a `usePersistFn` utility (used only by `useComposition`). |
| `client/src/lib/` | A single utility (`cn()`) combining `clsx` + `tailwind-merge`, the shadcn/ui convention helper — used throughout `ui/*.tsx` (which are themselves unused) and not found to be imported by any app-specific component in this audit's checks. |
| `client/src/services/` | Client-side integration modules: the two-tier Concierge logic (local keyword matcher + server API client), the `DataAdapter` (the app's entire persistence layer, backed by `localStorage`), and the WhatsApp notification/deep-link helper. |
| `client/src/types/` | All shared TypeScript type/interface definitions for the domain model (cases, transactions, utilities, key dates, handoffs, view modes). |
| `client/src/utils/` | Two standalone browser API wrappers: haptic feedback (`navigator.vibrate`) and WebAuthn (biometric) helpers. |
| `server/` | The standalone Express server entry point, used for non-Vercel deployment and for local development (`pnpm run dev:server`). |

## Purpose of Important Files

| File | Purpose |
|---|---|
| `package.json` | npm/pnpm manifest: scripts (`dev`, `dev:server`, `build`, `start`, `preview`, `check`, `format`), all runtime and dev dependencies, pnpm override, pinned `packageManager`. |
| `vite.config.ts` | Vite build/dev configuration: sets `client/` as project root, `dist/public` as output dir, path alias `@` → `client/src`, dev proxy of `/api` → `http://localhost:3001`, and registers several dev-only plugins tied to the "Manus" platform (debug log collector, storage proxy) plus the standard React/Tailwind/JSX-location plugins. |
| `tsconfig.json` | TypeScript compiler options for the whole project (client, server, api); strict mode on; `noEmit` (type-checking only, bundling is done by Vite/esbuild separately); path alias `@/*` → `client/src/*`. |
| `tsconfig.node.json` | Present at root; not read in detail in this audit — assumed to configure TypeScript for Node-context files (Vite config itself). Mark as **Unknown in detail** (see `12_Open_Questions.md`). |
| `vercel.json` | Vercel platform config: install/build commands (`pnpm install`, `pnpm run build`), output directory `dist/public`, and a catch-all rewrite (`/(.*) → /index.html`) for SPA client-side routing. |
| `components.json` | shadcn/ui CLI configuration: style "new-york", Tailwind CSS variable mode, path aliases matching `tsconfig.json`. |
| `.env.example` | Documents all server-side and client-side environment variables the app can use (Gemini key, Google Sheets credentials, login override vars) with inline comments explaining trust boundaries; no example WhatsApp Business API vars are listed here even though `whatsapp.ts` reads `VITE_WHATSAPP_TOKEN` / `VITE_WHATSAPP_PHONE_ID` / `VITE_LAYLA_WHATSAPP` (see `08_Configuration_Report.md`). |
| `.gitignore` | Standard Node/TypeScript ignores plus project-specific entries for a `.webdev/` directory, a Manus-generated `client/public/__manus__/version.json`, and `.project-config.json`. |
| `.prettierrc` / `.prettierignore` | Code formatting configuration for `pnpm run format`. |
| `template.json` | A large (14 KB) JSON snapshot embedding a near-duplicate of `package.json` and other scaffold metadata under an `"id": "web-static"` template descriptor. This is evidence the project originated from (or is tracked by) an AI app-scaffolding platform template system, not an application source file. |
| `AI_CONTEXT.md` | Free-form handover document (not code) summarizing project goals, stack, phased roadmap status, and guardrails for future AI-assisted sessions. Treated as a primary source of "intended" state in this audit, cross-checked against code where possible. |
| `ideas.md` | Free-form design-brief document describing a **trilingual (PT/EN/HE), RTL, Framer-Motion-heavy "Quiet Luxury Concierge" design system**. This directly contradicts the current English-only/LTR implementation and appears stale/superseded — not reconciled with `AI_CONTEXT.md` anywhere in the repository. |
| `client/index.html` | The single HTML shell: PWA meta tags, Google Fonts (Cormorant Garamond, Inter) links, service-worker registration script, root `<div id="root">`, and a template placeholder script tag for an analytics endpoint (`%VITE_ANALYTICS_ENDPOINT%` / `%VITE_ANALYTICS_WEBSITE_ID%` — Umami-style; these placeholders are not defined anywhere else in the repo). |
| `client/public/manifest.json` | PWA manifest: name, icons, theme colors, `display: standalone`, `start_url: /`. |
| `client/public/sw.js` | Hand-written service worker implementing: cache-first-with-network-fallback for navigation requests, stale-while-revalidate for fonts/static assets, network-first-with-cache-fallback for everything else. Cache name is versioned (`v3`) and must be bumped manually on releases that change cached assets (per its own header comment) — a manual, easy-to-forget step. |

## Entry Points

| Entry point | Path | Used by |
|---|---|---|
| Client SPA bootstrap | `client/src/main.tsx` | Rendered into `client/index.html`'s `#root`; mounts `<App/>` in `React.StrictMode`. Does **not** wrap `<App/>` in the existing `ErrorBoundary` component. |
| Client app shell | `client/src/App.tsx` | Wraps the whole app in `AppProvider` (the single context) and renders the routed screen based on `currentView` state — client-side view switching, not URL-based routing (no router library is used; the SPA has effectively one URL). |
| Vercel serverless: Concierge | `api/concierge.ts` | Deployed automatically by Vercel as `POST /api/concierge`. |
| Vercel serverless: Finance status | `api/finance/status.ts` | Deployed automatically by Vercel as `GET /api/finance/status`. |
| Vercel serverless: Finance sync | `api/finance/sync.ts` | Deployed automatically by Vercel as `POST /api/finance/sync`. |
| Standalone server | `server/index.ts` | Run via `pnpm run dev:server` (dev, port 3001) or bundled to `dist/index.js` and run via `pnpm start` (production, `NODE_ENV=production node dist/index.js`, default port 3000; also serves the built static SPA and implements the same two API routes plus SPA catch-all). |

## Build Configuration

- **Dev:** `vite --host` (client only, port 3000 with fallback) run alongside, optionally, `PORT=3001 tsx watch server/index.ts` (`dev:server`) for local API testing; Vite's dev server proxies `/api/*` to port 3001.
- **Production build:** `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` — this always builds the Express server bundle even when the deployment target is Vercel serverless (Vercel does not execute `dist/index.js`; it builds `api/*.ts` independently as functions). This means the `build` script produces artifacts unused in a pure-Vercel deployment.
- **Type-check:** `tsc --noEmit` (`pnpm run check`), covering `client/src`, `server`, and `api` per `tsconfig.json`'s `include`.
- **Format:** `prettier --write .` per `.prettierrc`/`.prettierignore`.
- **Package manager:** pnpm, with an override forcing `tailwindcss`'s transitive `nanoid` dependency to `3.3.7` (unrelated to the unused top-level `nanoid` dependency — see `09_Dependency_Report.md`).

## Environment Configuration

Declared in `.env.example` (see `08_Configuration_Report.md` for the full inventory and trust-boundary notes):
- `GEMINI_API_KEY` (server-only)
- `GOOGLE_SHEETS_CREDENTIALS`, `GOOGLE_SHEETS_SPREADSHEET_ID` (server-only)
- `VITE_APP_USER`, `VITE_APP_PASSWORD` (client-bundled "soft gate," explicitly documented as not a real secret)

Read in code but **not** present in `.env.example`:
- `VITE_WHATSAPP_TOKEN`, `VITE_WHATSAPP_PHONE_ID`, `VITE_LAYLA_WHATSAPP` (`client/src/services/whatsapp.ts`)
- `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID` (referenced as template placeholders in `client/index.html`)
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` (read only inside the dev-only Manus storage-proxy Vite plugin in `vite.config.ts`; not used by application code)

## Deployment Configuration

- **Primary documented target (per `AI_CONTEXT.md`):** Vercel, project `lami-command-center-by-mimo` under team "Mimo's Collective," auto-deploying on push to `main`. Live URL stated as `https://lami-command-center-by-mimo.vercel.app` (Assumption: not independently verified by this audit — no network access was used to confirm the deployment is currently live).
- `vercel.json` governs the Vercel build: `pnpm install` → `pnpm run build` → serve `dist/public` as static output, with all non-file routes rewritten to `index.html`, and `api/*.ts` auto-detected as serverless functions by Vercel's file-system routing convention.
- **Alternative deployment path:** any Node host capable of running `pnpm run build && pnpm start`, using the bundled Express server in `dist/index.js` (serves both the static SPA and the two API routes from one process).
- No containerization files (no `Dockerfile`, `docker-compose.yml`) were found.
- No Infrastructure-as-Code files were found.
- No CI/CD configuration (no `.github/workflows/`, no other CI config files such as `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/`) was found anywhere in the repository.
