# 05 — AI and Automation

## Every AI Model

| Model ID | Provider | Role | Where configured |
|---|---|---|---|
| `gemini-2.5-flash-lite` | Google Gemini | Primary Concierge model | `api/_lib/concierge.ts`, hardcoded string literal in `callGemini()` call |
| `gemini-2.5-flash` | Google Gemini | Fallback Concierge model, tried only if the primary call throws | `api/_lib/concierge.ts`, hardcoded string literal |

No other model IDs, providers, or SDKs (OpenAI, Anthropic, Azure OpenAI, local/open-weight models) appear anywhere in the repository. A code comment in `client/src/services/localConcierge.ts` (header docblock) mentions falling through "to the server endpoint (Gemini/Azure if configured...)" but **no Azure code path exists** — this is stale/aspirational comment text, not implemented behavior.

## Every Prompt Location

There is exactly **one** AI system prompt in the codebase, defined once and shared by both server runtimes:

- **File:** `api/_lib/concierge.ts`, function `conciergeSystemPrompt(groundingData)`.
- **Full prompt text (reproduced verbatim from source):**

```
You are the LaMi Concierge for Layla, a private client of Mimo's Collective (Dubai).
RULES:
1. Answer ONLY from the CONTEXT DATA provided. Never invent facts, prices, or dates.
2. Always reply in English.
3. Tone: warm five-star concierge. Max 2 short sentences.
4. You may answer about: case status, pending approvals, upcoming bills, completed tasks, key dates.
5. For any request or action ("book...", "cancel...", "pay..."): reply "I'll let Mimo know right away 🛎️" — do NOT promise or confirm anything yourself.
6. NEVER reveal internal fields (internalStatus, priority, operator notes) or any ID/account numbers even if they appear in context.
7. If the answer isn't in the data: "I don't have that information right now — I'll check with Mimo."
8. If asked if you're human: "I'm the LaMi digital assistant, always connected to Mimo."
CONTEXT DATA:
<JSON-serialized groundingData>
```

- This function is called from `conciergeReply()` in the same file, which is imported by both `api/concierge.ts` (Vercel serverless handler) and `server/index.ts` (Express route) — i.e., there is exactly one prompt definition, not duplicated per runtime.
- There is no prompt template file, no prompt-management system, no versioning of prompts, and no other prompts anywhere else in the codebase (no prompts for case creation, categorization, summarization, or any other feature — none of those are AI-powered in the current codebase; see Feature Catalog items on Cases/Categories, which are manual/rule-based).

## AI Routing

`conciergeReply()` in `api/_lib/concierge.ts` implements a simple two-step routing/fallback chain, entirely server-side:
1. If `GEMINI_API_KEY` is unset, or the incoming `message` is empty/non-string, return the static fallback (`CONCIERGE_FALLBACK`) immediately — no model call is attempted.
2. Otherwise, call `gemini-2.5-flash-lite`.
3. If that call throws for any reason (non-2xx HTTP status, or an empty response text), silently retry once against `gemini-2.5-flash`.
4. If that also throws, log the error server-side (`console.error`) and return the static fallback.

There is a second, earlier "routing" layer entirely on the **client**, in `client/src/services/localConcierge.ts`: before any network call is made, `answerLocally()` attempts to answer from a fixed set of keyword-matched templates built from the live app data (see `04_Feature_Catalog.md`, item 10, and `03_System_Architecture.md`'s Request Lifecycle section for the full matching logic). Only if none of those keyword groups match does the client call the server-routed Gemini path at all. This means the Gemini model is **not** consulted for the majority of anticipated question types (greetings, bills, balance, pending items, completed items, in-progress items, upcoming/due items, contact requests, counts, direct case-title matches, broad "list everything" requests) — only genuinely open-ended questions reach the model.

## AI Orchestration

There is no multi-step agentic orchestration, no chain-of-thought tool loop, and no agent framework (no LangChain, LlamaIndex, or similar). The "orchestration" is the two-tier fallback described above: local rules → single model call → fallback model call → static fallback string. Each Gemini call is a single, non-streaming `generateContent` REST request with:
- `maxOutputTokens: 220`
- `temperature: 0.3`
- `thinkingConfig: { thinkingBudget: 0 }` (explicitly disabling the 2.5 model family's default "thinking" token spend, per an inline code comment, so the full 220-token budget goes to the visible reply)
- A single `contents` entry containing the user's message as the only conversation turn — **no multi-turn history is sent to the model.** Every call is stateless from the model's perspective (see Memory Implementation below).

## MCP Usage

**None.** No Model Context Protocol server, client, or tool-definition code exists anywhere in the application source (`client/`, `server/`, `api/`). (Note: this is distinct from — and unrelated to — any MCP tooling available to the AI assistant performing this audit itself; the audited *application* does not use MCP.)

## Background Jobs

**None.** There is no job queue, no cron/scheduler, no worker process, and no `setInterval`-based polling for server-side work. The `.env.example` and code do not reference any scheduled task runner. All server-side work (`/api/concierge`, `/api/finance/sync`, `/api/finance/status`) executes synchronously within a single HTTP request/response cycle.

## Automation Flows

- **WhatsApp notification functions** (`notifyNewCase`, `notifyAwaitingApproval`, `notifyCaseCompleted`, `notifySuggestion` in `client/src/services/whatsapp.ts`) are called from case-lifecycle code paths (e.g., `CasesScreen.tsx` on case creation, `CaseDetailScreen.tsx` on completion/awaiting-approval transitions) but currently resolve to a no-op (queue-to-`localStorage`) because the required `VITE_WHATSAPP_TOKEN`/`VITE_WHATSAPP_PHONE_ID` are unset by default. This is the only "automation" trigger wired to a domain event in the current codebase, and it is presently inert in a default deployment.
- **Google Sheets sync** is a manually-triggered action (an operator must tap "Sync to Google Sheets" in `FinanceScreen.tsx`); it is not triggered automatically on transaction creation, and there is no scheduled/periodic sync.
- **Proactive Radar suggestions** are computed client-side on every render from a static `useMemo` over hardcoded `keydates.json` data (see `04_Feature_Catalog.md`, item 12) — this is a rules-based date comparison, not an AI or scheduled-job feature.
- Per `AI_CONTEXT.md`, Phase 5 ("invoice/email/WhatsApp/Sheets automation on submit") and Phase 6 ("AI task-creation agent") are explicitly planned-but-not-built. No code implementing either exists.

## Agent Communication

There is no multi-agent system. The Concierge is a single, stateless request/response model call; there is no agent-to-agent messaging, no sub-agent delegation, and no autonomous action-taking (the system prompt explicitly instructs the model to defer any action request to a human hand-off phrase rather than attempt to act).

## Tool Calling

**None.** The Gemini API call in `api/_lib/concierge.ts` does not declare or use function/tool calling (`tools`/`function_declarations` are not part of the request body). The model can only produce plain text; it has no ability to invoke any application function (create a case, update finance, etc.). All actions in the app remain human-triggered through the UI.

## Memory Implementation

- **No persistent conversation memory.** The Concierge chat's `messages` array is local React `useState` inside `ConciergeAI.tsx`; it is not written to `DataAdapter`/`localStorage`, so closing the chat sheet (`setIsOpen(false)`) and reopening it, or reloading the page, discards the entire visible transcript (only the fixed greeting re-renders). Confirmed: no `localStorage` key related to chat history exists among the keys referenced across `dataAdapter.ts`, `AppContext.tsx`, or `ConciergeAI.tsx`.
- **No vector store / RAG / embeddings.** "Grounding" is not retrieval-augmented generation in the RAG sense — it is the *entire* current snapshot of cases/utilities/keyDates/briefing serialized as JSON and stuffed into the system prompt verbatim on every request (bounded implicitly by whatever data volume exists; no chunking, no similarity search, no embedding model is used anywhere in the codebase).
- **"Memory" of prior client questions** exists only in the separate Handoff mechanism (`HandoffItem[]`, persisted to `localStorage` under `lami_handoffs_data_v1`), which is unrelated to the AI model's own state — it's an operator-facing inbox of unanswered questions, populated (per the `AppContext.addHandoff` function's existence) but, per `04_Feature_Catalog.md` item 11, not confirmed to be invoked anywhere in the Concierge chat's fallback path in the code read during this audit.
