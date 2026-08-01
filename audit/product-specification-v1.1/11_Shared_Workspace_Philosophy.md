# 11 — Shared Workspace Philosophy

## 1. Purpose

The Shared Workspace coordinates collaboration between Operator and Client while preserving private spaces, clear ownership, and deliberate sharing.

The Operator needs operational depth. The Client needs simplicity, transparency, and control. These are different views of connected objects—not separate contradictory systems.

---

## 2. Roles

## 2.1 Operator

The Operator coordinates work, organizes information, prepares recommendations, communicates with Providers, maintains records, and verifies operational completion within authorized scope.

Operator access is not unlimited ownership of Client information.

## 2.2 Client

The Client is the recipient of concierge service and the authority for their personal information, preferences, approvals, and private records, subject to agreed operating arrangements.

## 2.3 External Participant

A Provider, Trusted Contact, or other external participant receives only the information and actions explicitly required for an approved purpose.

---

## 3. Visibility Classes

### Client private

Visible only to the Client and specifically authorized access paths.

### Operator private

Internal operational material not appropriate for Client presentation, such as draft planning or private work notes. Operator-private content must not contain unnecessary sensitive Client information.

### Shared

Visible to both Operator and Client.

### Restricted sensitive

Visible only to specifically authorized users and contexts.

### External-purpose limited

Approved for a named recipient and purpose without making the full record generally shared.

- **WORK-001:** Visibility must be explicit and conservative by default.
- **WORK-002:** Related-object access must not automatically broaden visibility.
- **WORK-003:** AI must obey the same visibility boundary as the requesting user.

---

## 4. Shared Records

A shared record should show information relevant to collaboration:

- Outcome.
- Status.
- Next action.
- Owner.
- Required decision.
- Relevant dates.
- Client-visible Documents and updates.

Internal operational notes, hidden provider comparisons, or sensitive unrelated data should not be exposed merely because the parent Case is shared.

---

## 5. Private Records

Private records may still influence permitted system behavior without revealing their content.

Example: the system may show the Operator that “Client confirmation is required” without revealing a Client-private note explaining why, unless access is granted.

Private status must not be used to conceal actions that materially affect the other party. A shared outcome should still show accountable status and changes.

---

## 6. Shared Calendar

The Shared Calendar contains events both parties are authorized to view.

It may include appointments, shared deadlines, travel events, service visits, and agreed reminders.

Shared events should show confirmation state and ownership. Sensitive details may be hidden while the time commitment remains visible.

---

## 7. Private Calendars

Operator-private Calendar items support internal planning. Client-private Calendar items support personal scheduling.

Private Calendar events must not automatically become shared because a related Task or Case is shared. Availability may be exposed without revealing event detail where approved.

---

## 8. Shared Tasks

A Shared Task should make collaboration clear without exposing unnecessary internal process.

It should show:

- Primary owner.
- Requested outcome.
- Due date.
- Status.
- Blocked reason where appropriate.
- Required Client action.
- Relevant attachments.

The Client should not need to interpret internal subtasks unless they are assigned or relevant.

---

## 9. Delegation

Delegation assigns responsibility while retaining traceability.

A delegation should identify:

- Delegator.
- Delegate.
- Scope.
- Due date.
- Authority granted.
- Information shared.
- Acceptance state.
- Revocation or completion.

Delegation must not imply permission to delegate further unless explicitly allowed.

---

## 10. Ownership Transfer

Ownership transfer is a consequential change.

The system should show current owner, proposed owner, reason, open responsibilities, due dates, and acceptance requirement.

Ownership must not change silently through AI classification or scheduling.

Historical ownership should remain visible.

---

## 11. Client Approval Experience

The Client should receive focused approvals containing:

- What is being requested.
- Why.
- Options.
- Recommendation.
- Cost.
- Deadline.
- Relevant Documents.
- Consequence of delay.

The Client may approve, reject, request changes, or ask a question.

An approval must not expose unrelated internal notes.

---

## 12. Shared Communication

The workspace should distinguish:

- Internal Operator draft.
- Client-visible draft awaiting approval.
- Approved outbound message.
- Sent message.
- External reply.
- AI summary.

A shared Conversation does not automatically make every internal note shared.

---

## 13. Disagreement and Correction

If Operator and Client provide conflicting information, the system must not silently select one.

The conflict should show source, time, verification state, and affected work. The Client normally has authority over personal facts and preferences; the Operator may have authority over internal operational status. The product must represent both domains accurately.

---

## 14. Workspace Completion Conditions

The Shared Workspace is correct when each participant sees the information needed for their role, privacy is preserved, shared outcomes remain transparent, ownership is explicit, delegation is bounded, transfer is traceable, and collaboration does not require exposing internal complexity.