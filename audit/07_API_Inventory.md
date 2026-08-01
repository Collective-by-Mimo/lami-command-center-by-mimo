# 07 — API Inventory

## Internal Endpoints (this application's own API surface)

All three endpoints are implemented twice (once as a Vercel serverless function, once as an Express route in `server/index.ts`) but share the exact same underlying logic from `api/_lib/*`. Behavior described below applies to both runtimes unless noted.

---

### `POST /api/concierge`

- **Source:** `api/concierge.ts` (Vercel) / `server/index.ts` (Express) → `api/_lib/concierge.ts::conciergeReply`.
- **Purpose:** Answer an open-ended client question using Google Gemini, grounded in a client-supplied data snapshot.
- **Authentication:** None. No API key, session token, or origin check is required or verified by this route.
- **Rate limiting:** None implemented anywhere in the codebase (no in-memory limiter, no reference to any rate-limiting middleware or third-party service).
- **Input:**
  ```json
  { "message": "string", "language": "en", "groundingData": { "briefing": "string", "cases": [...], "bills": [...], "keyDates": [...] } }
  ```
  The Vercel handler rejects non-`POST` methods with `405 { "error": "method_not_allowed" }`. The Express route does not check method at all (registered only for `app.post`, so Express itself returns 404 for other methods on that path). Body is read via `req.body` (Express's `express.json({ limit: '2mb' })` middleware for the standalone server; Vercel's own body parsing for the serverless function — the two runtimes are not guaranteed to enforce the identical 2 MB limit, since the Vercel path does not explicitly configure one in the audited code).
- **Output (200, always, even on failure):**
  ```json
  { "reply": "string", "fallback": boolean }
  ```
- **Error handling:** By design, this endpoint **never returns a non-2xx status from the Vercel handler except `405` for wrong method**; all internal failures (missing `GEMINI_API_KEY`, empty message, Gemini HTTP error, empty Gemini output, network failure) are caught and converted into `200 { reply: CONCIERGE_FALLBACK, fallback: true }`. The Express route mirrors this via the same shared `conciergeReply()` function.
- **Data sent to a third party:** The entire `groundingData` object (a sanitized snapshot of cases/bills/keyDates/briefing, deliberately excluding IDs and internal status fields per `client/src/services/concierge.ts`) is embedded as literal JSON inside the system prompt sent to Google's Gemini API. This is the only endpoint that forwards client data to an external AI provider.

---

### `GET /api/finance/status`

- **Source:** `api/finance/status.ts` (Vercel) / `server/index.ts` (Express) → `api/_lib/sheets.ts::getSheetsConfig`.
- **Purpose:** Tell the client whether server-side Google Sheets credentials are configured (used to decide whether to show a "sync pending" state — though see `04_Feature_Catalog.md` item 5 regarding whether the client actually calls this route).
- **Authentication:** None.
- **Rate limiting:** None.
- **Input:** None (no body, no query params consumed).
- **Output (200, always):**
  ```json
  { "sheetsConfigured": boolean }
  ```
- **Error handling:** Wrapped in try/catch; any thrown error (e.g., malformed `GOOGLE_SHEETS_CREDENTIALS` JSON) results in `200 { sheetsConfigured: false }`, never a 5xx.
- **Data sent to a third party:** None — this route never contacts Google; it only inspects local environment variables.

---

### `POST /api/finance/sync`

- **Source:** `api/finance/sync.ts` (Vercel) / `server/index.ts` (Express) → `api/_lib/sheets.ts::syncLedgerToSheet`.
- **Purpose:** Overwrite a configured Google Sheet with the client's full finance ledger.
- **Authentication:** None.
- **Rate limiting:** None.
- **Input:**
  ```json
  { "transactions": [ { "date", "description", "category", "type", "status", "amountAED", "paidBy", "paidByOther", "paymentMethod", "runningBalance" }, ... ] }
  ```
  Non-array `transactions` is coerced to an empty array (`Array.isArray(...) ? ... : []`), so a malformed body does not error, it just syncs zero rows. Non-`POST` requests: Vercel handler returns `405 { "error": "method_not_allowed" }`; Express route only registers `POST` (other methods 404 via Express default).
- **Output:**
  - `200 { synced: false, reason: "credentials_pending" }` if server env vars are absent.
  - `200 { synced: true, rows: <count> }` on success.
  - `502 { synced: false, reason: "sync_failed" }` if any step of the Google API call throws (this is the **only** non-2xx response among all three endpoints).
- **Error handling:** Try/catch around the whole Sheets interaction; errors are logged server-side (`console.error`) with the raw error object, which could include HTTP status codes from Google but not full credential material (credentials are never included in the thrown `Error` messages per the code in `sheets.ts`).
- **Data sent to a third party:** The full transaction ledger (minus `receiptBase64`, stripped client-side before the request is made) is written to Google Sheets via the Sheets API v4, authenticated as the configured service account. This is a **full overwrite** of a fixed range (`A1:I100000`) on every call — not additive, not incremental, and not scoped to only new/changed rows.

---

## External APIs Consumed

| API | Called from | Auth mechanism | Purpose |
|---|---|---|---|
| Google Gemini `generateContent` (`generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`) | `api/_lib/concierge.ts` | `x-goog-api-key` header, value = `GEMINI_API_KEY` env var | Concierge AI text generation |
| Google OAuth2 token endpoint (`oauth2.googleapis.com/token`) | `api/_lib/sheets.ts::getGoogleAccessToken` | Hand-rolled JWT bearer assertion (`urn:ietf:params:oauth:grant-type:jwt-bearer`), signed with the service account's RSA private key from `GOOGLE_SHEETS_CREDENTIALS` | Exchange service-account credentials for a short-lived (1-hour) access token |
| Google Sheets API v4 (`sheets.googleapis.com/v4/spreadsheets/{id}/values/...`) | `api/_lib/sheets.ts::syncLedgerToSheet` | Bearer token from the OAuth2 exchange above | Clear then overwrite the finance ledger range |
| WhatsApp Business Cloud API (`graph.facebook.com/v18.0/{phoneNumberId}/messages`) | `client/src/services/whatsapp.ts::sendWhatsAppNotification` | Bearer token = `VITE_WHATSAPP_TOKEN` (client-side env var — see Risk Assessment) | Server-push notifications; currently inert (no-op) since these env vars are unset by default |
| `wa.me` (WhatsApp deep link, not a programmatic API) | Multiple client components | None (public URL scheme) | Opens a pre-filled WhatsApp chat in the user's own WhatsApp client/web session |
| Google Fonts CSS/font delivery | `client/index.html` `<link>` tags | None | Typeface delivery (Cormorant Garamond, Inter) |

No other external APIs (payment processors, SMS providers, maps/geocoding APIs beyond a static Google Maps URL, Notion, Supabase, etc.) are called anywhere in the code, despite some of these being referenced as future integrations in `AI_CONTEXT.md`.

## Rate Limits

- **This application's own endpoints:** No rate limiting is implemented at any layer (no middleware, no Vercel Edge Config/KV-based limiter, no WAF rule visible in the repo — Vercel platform-level DDoS protection, if any, is outside this repository's code and thus Unknown).
- **Google Gemini / Sheets / OAuth2 rate limits:** Governed entirely by Google's own service quotas for the configured API key/service account; not managed or tracked by any code in this repository.
- **WhatsApp Cloud API rate limits:** Not applicable currently (feature inert); would be governed by Meta's own tier limits if activated.

## Input/Output Validation

- No schema-validation library (`zod` is a declared dependency but is **not imported anywhere** in the codebase — see `09_Dependency_Report.md`) is used to validate any of the three endpoints' request bodies. Validation is limited to ad hoc `typeof`/`Array.isArray` checks inline in each handler.
- Output shapes are not formally validated either; they are constructed by hand in each handler and are consistent with the TypeScript interfaces only by convention, not by a shared contract/schema file.
