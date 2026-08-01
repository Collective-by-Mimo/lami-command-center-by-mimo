# 03 — Operator Philosophy

## 1. Purpose

The operator is the primary coordinator of the concierge service. Product design must reduce the operator’s cognitive and administrative load while preserving control, judgment, and accountability.

Operator-first does not mean client-second. It means the internal workspace must make excellent client service easier to deliver. A simplified client experience depends on a clear operator experience.

---

## 2. Operator-First Workflow

The operator should not need to remember where information belongs before recording it. The system should allow immediate capture and progressively structure the work.

The operator experience shall prioritize:

1. What requires attention.
2. What is new.
3. What is waiting.
4. What is at risk.
5. What requires approval.
6. What changed.
7. What is complete but awaiting verification.

Module navigation is secondary to operational state.

### OP-001 — Work before modules

Primary operator views should organize work around action, time, ownership, waiting, approval, and exception—not only around record type.

### OP-002 — Low-friction capture

The operator must be able to capture a request or observation without completing a full structured form.

### OP-003 — Progressive structure

Structure should be added during review, not demanded before capture.

---

## 3. Capture First

Capture-first prevents loss. The product should make recording easier than postponing.

Capture may contain incomplete, incorrect, or ambiguous information. This is acceptable at intake. The Request Inbox exists to separate fast capture from authoritative organization.

### Capture principles

- Preserve the original.
- Record the source.
- Avoid premature classification.
- Allow voice and mobile capture.
- Show unsent or unsynchronized state.
- Permit later review.
- Do not trigger consequential action from raw capture.

### OP-004 — Inbox boundary

Unreviewed capture must not silently become an approved operational instruction.

---

## 4. Organize Before Execution

Execution without organization creates duplicate work, unclear ownership, missed dependencies, and poor client communication.

Before consequential execution, the operator should be able to determine:

- Intended outcome.
- Object type.
- Owner.
- Participants.
- Priority.
- Relevant date.
- Visibility.
- Related people, assets, documents, bills, cases, or conversations.
- Required approval.
- Completion evidence.

Not every quick action requires a formal case. The level of organization should be proportionate to complexity and risk.

### OP-005 — Minimum actionable structure

Every active task should have a clear owner and next action. It should have a date or an explicit reason why no date is required.

### OP-006 — Complex outcomes

Work involving multiple stages, providers, approvals, documents, or significant cost should be represented as a case rather than hidden inside one task.

---

## 5. Verify Before Completion

Completion is a real-world condition, not merely a user-interface state.

Examples:

- A message is not completed merely because it was drafted.
- A booking is not completed merely because a request was sent.
- A payment is not completed merely because a portal was opened.
- A repair is not completed merely because the provider marked a job finished.
- A document renewal is not completed merely because an application was submitted.

### OP-007 — Completion criteria

Consequential work should define completion criteria before closure where practical.

### OP-008 — Evidence

Completion may require confirmation, receipt, document, external reference, client acknowledgement, operator observation, or another appropriate evidence type.

### OP-009 — Awaiting verification

The system must support “awaiting verification” separately from “completed.”

---

## 6. Everything Traceable

The operator must be able to understand how an item entered the system, how it changed, what was decided, and what happened.

Traceability should include:

- Original capture.
- Classification.
- Human edits.
- AI suggestions.
- Ownership changes.
- Due-date changes.
- Approval requests and decisions.
- External communications.
- Execution attempts.
- Errors.
- Completion evidence.
- Verification.

### OP-010 — Activity history

Consequential objects must retain a meaningful activity history.

### OP-011 — AI visibility

Activity history must distinguish human, AI, deterministic automation, import, and external-system actions.

---

## 7. Every Action Linked

Operational actions should be linked to the object and purpose that justify them.

Examples:

- A provider message links to a case or task.
- A payment reminder links to a bill.
- A calendar event links to the appointment, case, or obligation.
- A document request links to the case or Life Hub record needing it.
- An approval links to the proposed action.
- A notification links to the reminder or state change that caused it.

### OP-012 — Orphan prevention

The system should warn when consequential actions have no clear related record or purpose.

### OP-013 — Contextual history

A user viewing a case should be able to see its related tasks, approvals, documents, conversations, appointments, costs, and completion evidence without reconstructing them manually.

---

## 8. One Source of Truth

The operator should never need to update the same fact in several modules.

A person’s verified phone number should be referenced by tasks, cases, notifications, and provider workflows. Updating the authoritative contact value should not require independent edits everywhere.

A status displayed on a dashboard must derive from the authoritative object. Editing a dashboard card must not create a disconnected status.

### OP-014 — Object authority

Each operational concept must have one authoritative object even when displayed in multiple contexts.

### OP-015 — No report authority

Briefings and reports must not become authoritative sources for the records they summarize.

---

## 9. Operator Work Surfaces

The product should ultimately provide operator surfaces centered on:

### Today

Time-sensitive commitments, appointments, approvals, overdue items, and recommended priorities.

### Inbox

Unclassified captures and new requests.

### Tasks

Actionable work by owner, state, date, priority, and relationship.

### Cases

Multi-step outcomes and their complete operational context.

### Calendar

Shared and private time commitments, deadlines, reminders, and obligations.

### Waiting

Items blocked by client, provider, document, payment, appointment, external response, or another dependency.

### Approvals

Actions that cannot proceed without a decision.

### Exceptions

Failures, conflicts, missing information, unusual finance activity, expired records, and automation problems.

### Search

Cross-object retrieval with visibility enforcement.

These are product concepts, not prescribed screen architecture.

---

## 10. Manual Override Philosophy

The operator must be able to override AI recommendations and operational classifications when authorized.

An override should capture:

- Previous value.
- New value.
- Actor.
- Time.
- Optional reason, mandatory for high-risk changes.
- Affected dependent items.

Manual override does not authorize bypassing mandatory safety rules. For example, an operator may correct a suggested category but may not cause the system to fabricate payment confirmation.

### OP-016 — Override respect

AI must respect an authoritative manual correction and not silently restore its prior output.

### OP-017 — Dependent review

When an override affects downstream work, the system should identify dependent reminders, tasks, approvals, or reports requiring review.

---

## 11. Interruption and Return

Concierge work is interrupt-driven. The operator must be able to stop and later understand what changed.

The system should provide:

- Draft preservation.
- Last-action context.
- New activity since last view.
- Items awaiting the operator.
- Failed background operations.
- Changes made by the client.
- Changes made by automation.

### OP-018 — No hidden background completion

Background activity must not make consequential work appear complete without operator awareness.

---

## 12. Operator Success Conditions

The operator philosophy is successful when the operator can answer, with minimal reconstruction:

- What should I do now?
- What is waiting, and on whom?
- What changed?
- What did AI infer?
- What needs approval?
- What has failed?
- What is the source of this information?
- What is the next action?
- What evidence confirms completion?
- What does the client currently see?