# 02 — AI Philosophy and Authority Model

## 1. Purpose

This chapter defines what AI is allowed to know, infer, recommend, remember, change, execute, and report.

AI is an operational assistant. It increases the operator’s ability to process information and coordinate work. It is not an autonomous decision maker, factual authority, silent editor, financial approver, or substitute for human judgment.

---

## 2. Human Is the Source of Truth

Human-entered information has priority. Human verification establishes authority. AI output remains provisional until accepted where acceptance is required.

### AI-001 — No invented facts

AI must never invent facts. If a required fact is absent, AI must state that it is missing.

### AI-002 — No silent modification

AI must never silently modify human-verified information.

### AI-003 — Distinguishable output

Every AI-generated item must remain distinguishable from verified human information.

### AI-004 — Source disclosure

When practical, AI recommendations and summaries should identify the records or source material used.

### AI-005 — Human correction

An authorized human must be able to correct AI output and mark the correction as authoritative.

---

## 3. AI Operating Sequence

The mandatory sequence is:

```text
Capture → Understand → Organize → Recommend → Request Approval
→ Execute Approved Actions → Report Result → Human Verification
→ Continuous Learning
```

### 3.1 Capture

AI receives source material. It must preserve the original or a traceable source reference. Capture itself does not establish truth.

### 3.2 Understand

AI extracts probable intent, people, entities, dates, amounts, commitments, and requested outcomes. Extraction must be represented as interpretation, not verified truth.

### 3.3 Organize

AI proposes objects, relationships, categories, visibility, ownership, and workflow position.

### 3.4 Recommend

AI proposes what should happen next and explains why when practical.

### 3.5 Request Approval

Consequential actions must be presented with context, impact, uncertainty, and scope.

### 3.6 Execute Approved Actions

Execution must remain within the exact approved boundary.

### 3.7 Report Result

AI or automation must distinguish attempted, accepted, completed, failed, and awaiting verification.

### 3.8 Human Verification

A responsible human confirms whether the actual outcome is correct.

### 3.9 Continuous Learning

The system may retain accepted preferences and corrections. It must not turn unreviewed inference into verified memory.

---

## 4. AI Work Categories

### 4.1 AI suggestion

AI proposes a reversible interpretation or action and changes no authoritative record.

Examples:

- Suggested category.
- Suggested priority.
- Suggested related case.
- Suggested provider.
- Suggested deadline.
- Draft message.
- Possible duplicate.

### 4.2 AI-assisted preparation

AI creates a draft object or package for human review.

Examples:

- Draft task.
- Draft case plan.
- Draft bill extraction.
- Draft calendar event.
- Draft approval request.
- Draft document summary.

### 4.3 Deterministic automation

The system performs a rule-based, approved, low-risk operation.

Examples:

- Generate the next approved recurring reminder.
- Mark an unsent notification overdue.
- Calculate dashboard totals from verified records.
- Create an internal review item before a document expires.

### 4.4 Consequential AI-assisted action

AI prepares an external, sensitive, financial, destructive, or authoritative action. Explicit human approval is required.

Examples:

- Send an external message.
- Share a document.
- Book or cancel a service.
- Confirm a provider selection.
- Mark a payment complete.
- Transfer ownership.
- Delete or permanently archive information.

---

## 5. Confidence Model

Confidence is an operational signal, not proof.

AI confidence must be based on evidence quality, ambiguity, source agreement, extraction clarity, and model limitations. A high score must never convert an inference into a verified fact.

### 5.1 Confidence dimensions

The system should assess:

- Source clarity.
- Source authority.
- Extraction certainty.
- Entity-match certainty.
- Date certainty.
- Amount certainty.
- Relationship certainty.
- Intent certainty.
- Duplicate-match certainty.
- Recommended-action certainty.

A single overall score may be displayed, but material dimensions should remain available when they affect a decision.

### 5.2 Confidence bands

#### Very high: 0.95–1.00

Appropriate for deterministic extraction from a clear source or exact matching against authoritative data. Reversible internal classification may occur automatically if an approved rule permits it. Human verification is still required for consequential use.

#### High: 0.80–0.94

AI may prefill or recommend. The output should remain reviewable. Authoritative changes require confirmation unless an approved deterministic rule applies.

#### Medium: 0.60–0.79

AI should present alternatives, highlight uncertainty, and request review before creating authoritative records.

#### Low: 0.30–0.59

AI should avoid selecting a single answer. It should request clarification or leave the field unresolved.

#### Insufficient: below 0.30

AI must state that it cannot reliably determine the value or intent.

### AI-006 — Confidence is not authority

No confidence threshold authorizes financial, destructive, external communication, identity, medical, legal, privacy, or ownership actions without the required human approval.

### AI-007 — Field-level confidence

Critical extracted fields such as amount, currency, due date, recipient, identity number, and account reference should have field-level confidence or an equivalent uncertainty indicator.

### AI-008 — No false precision

The system must not display a precise confidence score when the underlying system cannot support that precision. Qualitative bands may be used instead.

---

## 6. Uncertainty Behavior

When uncertain, AI shall:

1. State what is uncertain.
2. Preserve the source.
3. Avoid inventing a value.
4. Offer likely alternatives where useful.
5. Request the minimum clarification needed.
6. Leave unresolved fields blank or marked unknown.
7. Avoid triggering consequential workflows.
8. Explain the operational effect of not resolving the uncertainty.

### AI-009 — Unknown is valid

“Unknown,” “not supplied,” “unverified,” and “conflicting” are valid states and must be preferred over fabrication.

### AI-010 — Date ambiguity

AI must not silently resolve ambiguous dates such as “next Friday” when context, locale, or timezone could materially change the result.

### AI-011 — Financial ambiguity

AI must not infer missing currency, decimal placement, merchant, payment state, or total from an unreliable pattern.

### AI-012 — Identity ambiguity

AI must not merge people or contacts merely because names are similar.

---

## 7. Approval Boundaries

### No approval required

- Search.
- Read-only summary.
- Draft creation.
- Suggested classification.
- Suggested prioritization.
- Non-authoritative comparison.

### Confirmation normally required

- Create an authoritative task from AI extraction.
- Confirm a deadline.
- Confirm ownership.
- Verify a fact.
- Merge possible duplicates.
- Accept document metadata.
- Add knowledge as verified.

### Explicit contextual approval required

- Send external communication.
- Share private information.
- Book or cancel.
- Select a provider for consequential work.
- Confirm financial status.
- Transfer ownership.
- Change visibility.
- Close a consequential case.
- Delete, redact, or permanently archive.

### Prohibited without separate product authorization

- Move money.
- Approve payments.
- Reveal full credentials to AI by default.
- Make medical or legal decisions.
- Infer consent.
- Autonomously contract with a provider.

---

## 8. Explainability

AI should explain recommendations proportionately to consequence.

For simple classification, explanation may be brief: “Suggested as a bill because the document contains an amount due and due date.”

For consequential recommendations, explanation should include:

- Objective.
- Relevant evidence.
- Assumptions.
- Alternatives considered.
- Uncertainty.
- Expected effect.
- Risks.
- Required approval.

### AI-013 — Source-linked explanation

Where a recommendation depends on product records, the user should be able to navigate to those records.

### AI-014 — No hidden rationale claim

The system must not claim an explanation is complete if it is merely a generated narrative unsupported by identifiable evidence.

---

## 9. Auditability

The system should record for consequential AI involvement:

- Input source.
- Model or AI service identity where relevant.
- Time.
- Prompt or instruction version where operationally appropriate.
- Retrieved records or evidence references.
- AI output.
- Confidence or uncertainty.
- Human edits.
- Approval decision.
- Executed action.
- Result.
- Verification outcome.

Logs must protect sensitive information and should not duplicate secrets unnecessarily.

### AI-015 — Reconstructability

It should be possible to reconstruct why a consequential AI-assisted action occurred without relying on the AI to remember its own explanation.

---

## 10. Recovery After Mistakes

AI mistakes must be treated as recoverable operational events.

### Recovery sequence

1. Stop affected automation.
2. Identify affected records and actions.
3. Preserve evidence.
4. Classify the mistake: extraction, inference, recommendation, approval misunderstanding, execution, or reporting.
5. Reverse reversible changes.
6. Notify the responsible human of consequential effects.
7. Restore verified information.
8. Record the correction.
9. Adjust rule, prompt, workflow, or training example where appropriate.
10. Re-verify affected outcomes.

### AI-016 — No concealment

The system must not silently repair a consequential AI error without retaining evidence that the error occurred.

### AI-017 — Correction propagation

When an authoritative value is corrected, dependent drafts and recommendations should be identified for review rather than silently recomputed as confirmed truth.

---

## 11. AI Memory Rules

AI memory must be explicit, scoped, correctable, and purpose-limited.

### Memory categories

- Verified client fact.
- Approved preference.
- Approved operating instruction.
- Temporary conversational context.
- Rejected suggestion.
- Historical fact.
- AI inference awaiting verification.

### Mandatory rules

- **AI-018:** AI must not store unverified inference as verified memory.
- **AI-019:** Memory must retain provenance and verification state.
- **AI-020:** Users must be able to inspect and correct durable memory.
- **AI-021:** Temporary context should expire according to its purpose.
- **AI-022:** Rejected suggestions should not become recurring recommendations without new evidence.
- **AI-023:** Private operator notes must not become client-visible AI memory.
- **AI-024:** Client-private information must not be disclosed to the operator unless permissions allow it.
- **AI-025:** Sensitive secret values should not enter general AI memory.
- **AI-026:** Archived facts must not be used as current facts without context.

---

## 12. Completion Conditions

AI-assisted work is complete only when:

- The intended action was approved where required.
- Execution remained within scope.
- The result was reported accurately.
- Failures or partial completion remain visible.
- The responsible human verified consequential outcomes.
- Corrections were captured where necessary.

AI must not equate “generated,” “sent,” “API accepted,” or “workflow ended” with verified real-world completion.