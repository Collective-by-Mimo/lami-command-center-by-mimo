# 08 — Configuration Report

## Environment Variables

### Documented in `.env.example`

| Variable | Scope | Purpose | Behavior when unset |
|---|---|---|---|
| `GEMINI_API_KEY` | Server-only | Google Gemini API key for the Concierge endpoint | Concierge falls back to the static WhatsApp hand-off message (graceful, no error) |
| `GOOGLE_SHEETS_CREDENTIALS` | Server-only | Google service-account key JSON (single-line string) | `getSheetsConfig()` returns `null`; Finance sync reports `credentials_pending` |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Server-only | Target spreadsheet ID for the Finance sync | Same as above |
| `VITE_APP_USER` | Client-bundled | Overrides the default login username (`Layla_Portal`) | Falls back to hardcoded default `Layla_Portal` |
| `VITE_APP_PASSWORD` | Client-bundled | Overrides the default login password (`@Mimo2026`) | Falls back to hardcoded default `@Mimo2026` |

`.env.example` itself contains explicit inline documentation of the trust boundary for the two `VITE_APP_*` variables: *"These VITE_ vars are inlined into the built client bundle, so anyone who loads the app can extract them... Real protection is the Phase 2 Supabase auth."*

### Read in code but NOT documented in `.env.example`

| Variable | Scope | File | Purpose | Status if unset |
|---|---|---|---|---|
| `VITE_WHATSAPP_TOKEN` | Client-bundled | `client/src/services/whatsapp.ts` | Meta Cloud API bearer token | Notification calls become a `localStorage`-queued no-op |
| `VITE_WHATSAPP_PHONE_ID` | Client-bundled | `client/src/services/whatsapp.ts` | Meta phone-number ID for sending | Same as above |
| `VITE_LAYLA_WHATSAPP` | Client-bundled | `client/src/services/whatsapp.ts` | Default recipient phone number | Same as above |
| `VITE_ANALYTICS_ENDPOINT` | Client-bundled | `client/index.html` (template placeholder `%VITE_ANALYTICS_ENDPOINT%`) | Analytics script host (Umami-style) | Placeholder left unresolved in the shipped HTML unless substituted by an external build step not present in this repo |
| `VITE_ANALYTICS_WEBSITE_ID` | Client-bundled | `client/index.html` | Analytics site identifier | Same as above |
| `BUILT_IN_FORGE_API_URL` | Dev-server only (Node) | `vite.config.ts` (Manus storage-proxy plugin) | Base URL for a dev-only file-storage presign proxy | Proxy responds `500 Storage proxy not configured` |
| `BUILT_IN_FORGE_API_KEY` | Dev-server only (Node) | `vite.config.ts` | Auth for the same dev-only proxy | Same as above |
| `NODE_ENV` | Standard Node | `server/index.ts`, `vite.config.ts` | Switches static-file path resolution and disables the Manus debug-collector script injection in production | Defaults to Node's own default behavior (not production) if unset |
| `PORT` | Standard Node | `server/index.ts` | HTTP listen port for the standalone Express server (default `3000`; `dev:server` script sets it to `3001`) | Falls back to `3000` |

Because `VITE_*` variables are compiled into the static client bundle by Vite at build time, **any secret placed in `VITE_WHATSAPP_TOKEN` would be publicly extractable from the deployed JS**, exactly as already documented for `VITE_APP_PASSWORD`. This is a repeated pattern in the codebase (see `11_Risk_Assessment.md`).

## Secrets Used (names only — no values reproduced)

- `GEMINI_API_KEY`
- `GOOGLE_SHEETS_CREDENTIALS`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `VITE_APP_USER`
- `VITE_APP_PASSWORD`
- `VITE_WHATSAPP_TOKEN`
- `VITE_WHATSAPP_PHONE_ID`
- `VITE_LAYLA_WHATSAPP`
- `BUILT_IN_FORGE_API_KEY`

No secret *values* were read, printed, or committed to this audit. `.env.example` itself contains no values (all fields blank), and no `.env`/`.env.local` file is present in this checkout (`.gitignore` excludes them).

## Feature Flags

There is no formal feature-flag system (no LaunchDarkly, GrowthBook, Unleash, or home-rolled flag service). The closest equivalents are:
- **`isOperator` boolean** — a client-only "mode" switch (URL param / long-press / `localStorage`), described fully in `03_System_Architecture.md` and `04_Feature_Catalog.md`. Not a true feature flag (it's a permissions/visibility toggle, evaluated entirely client-side).
- **Presence/absence of environment variables** functions as an implicit flag for three integrations: Gemini (Concierge AI replies vs. static fallback), Google Sheets (sync active vs. "pending"), WhatsApp Cloud API (push notifications active vs. queued no-op).
- **`ServiceStatus` labels** (`live`/`ready`/`phase2`) in `serviceCatalogue.ts` are presentation-only metadata for the Services screen, not a runtime flag gating any code path.

## Build Settings

- **Package manager:** pnpm. `package.json`'s `packageManager` field pins `pnpm@10.4.1+sha512...`, while the `devDependencies` block separately lists `"pnpm": "^10.15.1"` — **these two pnpm version references disagree** (10.4.1 pinned vs. ^10.15.1 as an installable dependency range); see `12_Open_Questions.md`.
- **TypeScript:** strict mode; `noEmit: true` (type-checking only; actual JS output comes from Vite/esbuild, not `tsc`).
- **Bundling:** Vite 7 for the client (`vite build`), esbuild for the server (`esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`). The `build` npm script always runs both, even though a pure-Vercel deployment only needs the Vite output (see `02_Repository_Map.md`).
- **pnpm override:** `"tailwindcss>nanoid": "3.3.7"` — pins a transitive `nanoid` version used internally by `tailwindcss`, unrelated to the top-level (and unused) `nanoid` dependency declared in `package.json`.

## CI/CD

**None found.** No `.github/workflows/` directory, no `.gitlab-ci.yml`, no `Jenkinsfile`, no `.circleci/`, no `azure-pipelines.yml`, and no other CI configuration file exists anywhere in the repository. There is no automated build/test/lint gate on pushes or pull requests as far as this repository's own configuration is concerned.

## GitHub Actions

**None.** Confirmed absent (see CI/CD above).

## Vercel Configuration

`vercel.json` (full contents):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist/public",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- Serverless functions under `api/` are picked up by Vercel's file-system convention automatically; there is no explicit `functions` block configuring memory/timeout/runtime overrides — Vercel platform defaults apply (Unknown from this repo alone what those numeric defaults currently are, since that depends on the Vercel account/plan, not the repository).
- No `vercel.json` `env` block, no `regions` pinning, no cron configuration (`crons` key absent — consistent with "no background jobs" from `05_AI_and_Automation.md`).
- Per `AI_CONTEXT.md` (not verifiable from repo config alone): project name `lami-command-center-by-mimo`, team "Mimo's Collective," auto-deploy on push to `main`.

## Supabase Configuration

**None.** No Supabase client library, connection string, or config file exists in the repository. Supabase is referenced only in code *comments* as a planned future integration point for real authentication (`server/index.ts`: `// AUTH: Supabase multi-user — Phase 2 integration point.`; identical comment in `AppContext.tsx`). No Supabase project is currently wired in.

## Firebase Configuration

**None.** No Firebase SDK, config object, or `firebase.json` exists anywhere in the repository.

## Cloudflare Configuration

**None.** No `wrangler.toml`, Cloudflare Workers/Pages config, or Cloudflare-specific code exists anywhere in the repository.

## Other Integrations

- **Notion:** Referenced extensively in `AI_CONTEXT.md` as the intended Phase 4 "source of truth," but **no Notion API client, API key reference, or database-ID configuration exists in any source file.** Per `AI_CONTEXT.md`, Notion databases ("Casos"/"Seus casos", "My Tasks") reportedly exist externally and are connected to an AI assistant via MCP in a separate tool context — not through any code in this repository.
- **"Manus" platform tooling:** `vite-plugin-manus-runtime` (devDependency), custom Vite plugins in `vite.config.ts` (debug-log collector writing to a local `.manus-logs/` directory; a `/manus-storage` presigning proxy calling `BUILT_IN_FORGE_API_URL`), `client/public/__manus__/debug-collector.js`, and `template.json` (a scaffold-template snapshot). These constitute a development-platform integration, not a production application dependency — the debug-collector script is explicitly not injected when `NODE_ENV === 'production'`.
- **Google Fonts:** `fonts.googleapis.com`/`fonts.gstatic.com`, loaded via static `<link>` tags with no API key.
- **WebAuthn:** Uses only the browser-native `navigator.credentials` API; no third-party WebAuthn relying-party service (e.g., no Auth0/Okta/Duo integration).
