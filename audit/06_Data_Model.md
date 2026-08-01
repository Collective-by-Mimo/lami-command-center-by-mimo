# 06 — Data Model

## Database Schema

**There is no database.** No SQL/NoSQL engine, ORM, schema-definition language, or migration tooling exists anywhere in the repository. All "schema" is expressed purely as TypeScript interfaces in `client/src/types/index.ts`, enforced only at compile time (and only within the client bundle — nothing enforces these shapes at the persistence layer, since persistence is just `JSON.stringify`/`JSON.parse` against `localStorage`).

## "Tables" (Data Collections)

Each collection below is a top-level array/object held in memory by `DataAdapter` (`client/src/services/dataAdapter.ts`) and mirrored to one `localStorage` key. There is no relational integrity enforcement (no foreign keys, no cascading deletes) — all "relationships" below are informal (matching string IDs) and unvalidated.

| Collection | `localStorage` key | Shape | Seeded from |
|---|---|---|---|
| Cases | `lami_cases_data_v1` | `CaseItem[]` | `client/src/data/seedData.ts` → `INITIAL_CASES` |
| Briefing | `lami_briefing_data_v1` | `BriefingData` (single object, not an array) | `seedData.ts` → `INITIAL_BRIEFING` |
| Utilities | `lami_utilities_data_v1` | `UtilityItem[]` | `seedData.ts` → `INITIAL_UTILITIES` |
| Key dates | `lami_keydates_data_v1` | `KeyDateItem[]` | `client/src/data/keydates.json` |
| Handoffs | `lami_handoffs_data_v1` | `HandoffItem[]` | Hardcoded `INITIAL_HANDOFFS` constant inside `dataAdapter.ts` itself (not in `seedData.ts`) |
| Finance transactions | `lami_finance_data_v1` | `FinanceTransaction[]` | `seedData.ts` → `INITIAL_TRANSACTIONS` |
| Custom case categories | `lami_custom_categories_v1` | `CaseCategoryDef[]` | Empty by default; user-added via `appConfig.ts` → `addCustomCategory` |
| WhatsApp notification queue | `lami_whatsapp_queue_v1` | `{ message, phone, queuedAt }[]`, capped at last 50 | Empty by default; populated by `whatsapp.ts` when Cloud API credentials are absent |

## Schema Detail (from `client/src/types/index.ts`)

**`CaseItem`** (the "Cases" collection):
- `id: string`, `emoji: string`, `title: I18nText` (alias for `string`)
- `clientState: '🔔 Awaiting you' | '✅ In our hands' | '✔️ Completed'`
- `internalStatus: 'Open' | 'Awaiting approval' | 'Paused' | 'Completed'`
- `priority: 'High' | 'Normal'`
- `isRecurring: boolean`, `dueDate?: string`, `nextStep: string`
- `subtasks?: SubTask[]` → `{ id, title, completed, completedAt? }`
- `timeline: TimelineEntry[]` → `{ id, date, time?, content, photos?, addedBy: 'operator'|'client' }`
- `quotations?: QuotationRow[]` → `{ id, title, priceAED: number|string, timeline?, observation?, isRecommended?, recommendationReason?, quantity? }`
- `decision?: DecisionData` → `{ prompt, options: DecisionOption[], resolvedOptionId?, resolvedAt?, resolvedComment? }`; `DecisionOption` → `{ id, label, variant? }`
- `completionProof?: CompletionProof` → `{ photoUrl?, note, completedAt }`
- `completedMonth?: string` (e.g. `"2026-06"`)
- `utilityType?: 'DEWA' | 'Tasleem' | 'Lootah Gas' | 'Just Life'`
- `category?: string`, `subcategory?: string`

**`BriefingData`**: `{ lastUpdated: string, prose: string }` — a single object, not a history log; every update fully replaces it.

**`UtilityItem`**: `{ id, name, type: 'DEWA'|'Tasleem'|'Lootah Gas', contractAccount?, customerNumber?, phone?, notes, statusText }`. Note: this type's `type` union does **not** include `'Just Life'`, even though `CaseItem.utilityType` does — an inconsistency between the two related types.

**`KeyDateItem`**: `{ id, label, date: string "YYYY-MM-DD", category: 'document'|'lease'|'bill'|'pattern', lead_time_days: number, suggestion, status?: 'pending'|'accepted'|'dismissed' }`.

**`HandoffItem`**: `{ id, createdAt, clientQuestion, language, resolved?, operatorResponse?, resolvedAt? }`.

**`FinanceTransaction`**: `{ id, date, description, category: string (FINANCE_CATEGORIES id), amountAED: number, type: 'income'|'expense'|'reimbursement', status: 'pending'|'confirmed'|'reimbursed', receiptBase64?, paidBy?: 'Layla'|'Lior'|'Mimo'|'Other', paidByOther?: string, paymentMethods?: ('Cash'|'Card'|'Bank Transfer'|'PayPal'|'Voucher'|'Exchange'|'Crypto')[] }`.

**`CaseCategoryDef`** (config, not user data unless custom): `{ id, emoji, label, subcategories?: { id, label }[] }`.

## Relationships

Informal only, matched by string equality, never validated or enforced:
- `CaseItem.category` ↔ `CaseCategoryDef.id` (built-in `CASE_CATEGORIES` in `appConfig.ts`, or a custom category's generated ID). `resolveCaseCategory()` in `appConfig.ts` falls back through a legacy-ID map and then an emoji-keyed map if the stored `category` doesn't resolve — evidence that historical data with orphaned category references exists or is anticipated.
- `CaseItem.subcategory` ↔ `CaseCategoryDef.subcategories[].id` — looked up via `getSubcategory()`, no enforcement that a case's subcategory actually belongs to its own category.
- `FinanceTransaction.category` ↔ `FINANCE_CATEGORIES[].id` (a separate, smaller, hardcoded list — **not** the same taxonomy as `CASE_CATEGORIES`; the two category systems are entirely independent data structures with overlapping but not identical concepts, e.g., `'casa'`/`'utilidades'`/`'transporte'` Portuguese-origin IDs still in `FINANCE_CATEGORIES` even though the case taxonomy was migrated to English IDs in Phase 2).
- `KeyDateItem` has no direct foreign key to `CaseItem`; accepting a suggestion (`acceptKeyDateSuggestion`) creates a brand-new `CaseItem` with no back-reference stored on the `KeyDateItem` beyond its own `status: 'accepted'` flag (so there is no way to navigate from an accepted key date to the case it produced, other than by matching the copied title text).
- `HandoffItem` → "Convert to Case" (`OperatorPanel.tsx`) creates a new `CaseItem` with the handoff's question text as the title, again with no stored foreign key linking the two records.

## Storage (Non-Database)

Covered in `03_System_Architecture.md` — receipt/proof photos are base64 strings embedded directly in the `FinanceTransaction.receiptBase64` field and `CompletionProof.photoUrl` field (the latter can also be an arbitrary external URL string, since the completion-proof UI takes a text input rather than a file picker). No object storage service is integrated.

## Cache

Two Cache Storage buckets managed by the service worker (`client/public/sw.js`): `lami-command-center-v3` (static app shell) and `lami-dynamic-v3` (fonts/scripts/styles/images and general network-first responses). No server-side or API-response cache layer exists (each `/api/*` call is computed fresh on every request; there is no in-memory or Redis-style cache in `api/_lib/*`).

## Sessions

No session table/store. "Session" state is three `localStorage` booleans (`lami_authenticated`, `lami_biometric`, `lami_op_mode`) with no expiry, no server-side session ID, and no CSRF/session-fixation protections (see `11_Risk_Assessment.md`).

## User Data

All "user data" (the operator's and client's shared business data — cases, finance, handoffs, briefing, utilities, key dates, custom categories, WhatsApp notification queue) lives exclusively in the requesting browser's `localStorage`. There is no per-user data separation at all: the app is single-tenant by construction (one shared login, one shared `localStorage` origin). Two different browsers/devices logging in with the same credential will each have their own, independently-diverging copy of "the data," since nothing is synced server-side.

## Configuration Data

- Static/code-level (redeploy required to change): `CONTACT_CATEGORIES`, `CONNECTION_PROVIDERS`, `CASE_CATEGORIES`, `FINANCE_CATEGORIES`, `PAID_BY_OPTIONS`, `PAYMENT_METHOD_OPTIONS`, `HOME_CONFIG`, `MIMO_WHATSAPP_NUMBER`/`MIMO_PHONE_DISPLAY`/`MIMO_PHONE_TEL` (all in `client/src/config/appConfig.ts`), and the entire `SERVICE_DOMAINS` catalogue (`client/src/config/serviceCatalogue.ts`).
- Runtime-editable (stored in `localStorage`, per-browser): custom case categories only. All other configuration requires a source change and redeploy.
- Environment-level configuration is covered fully in `08_Configuration_Report.md`.
