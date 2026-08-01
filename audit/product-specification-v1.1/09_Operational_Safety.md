# 09 — Operational Safety

## 1. Purpose

Operational safety protects people, information, money, relationships, and real-world outcomes from incorrect assumptions, hidden automation, unauthorized disclosure, destructive changes, and misleading completion states.

Safety is a product behavior, not only a technical control.

---

## 2. Non-Negotiable Rules

- **SAFE-001:** Never delete information automatically.
- **SAFE-002:** Never silently overwrite verified human data.
- **SAFE-003:** Never invent financial information.
- **SAFE-004:** Never invent deadlines.
- **SAFE-005:** Never send external communication without the required approval.
- **SAFE-006:** Never approve payments.
- **SAFE-007:** Never silently modify ownership.
- **SAFE-008:** Every automated action must be logged.
- **SAFE-009:** Important actions should be reversible whenever practical.
- **SAFE-010:** Never claim completion without appropriate evidence.

---

## 3. Human Approval Requirements

Approval must be explicit, informed, scoped, current, and attributable.

Approval is required for:

- External communication unless covered by an approved deterministic rule.
- Sharing sensitive information or Documents.
- Financial confirmation or consequential finance changes.
- Booking, cancelling, or committing to external services.
- Ownership transfer.
- Visibility change that broadens access.
- Permanent deletion.
- Destructive bulk changes.
- Identity, legal, medical, or emergency information changes.
- Material changes after prior approval.

Silence, inactivity, prior similar approval, or inferred preference does not constitute approval.

---

## 4. Approval Presentation

Before approval, show:

- Proposed action.
- Reason.
- Relevant source information.
- Recipient or affected party.
- Information to be shared.
- Cost or financial effect.
- Time effect.
- Known uncertainty.
- Alternatives.
- Reversibility.
- Expiry of the approval request.

High-risk approvals should require deliberate confirmation rather than an accidental single tap.

---

## 5. Audit Logging

Consequential actions should log:

- Actor.
- Time.
- Source or trigger.
- Previous state.
- Proposed state.
- AI involvement.
- Approval basis.
- Executed action.
- External result.
- Verification.
- Reversal where applicable.

Logs must be protected from ordinary editing and must minimize duplication of sensitive values.

Audit logs are evidence, not a substitute for backup.

---

## 6. Rollback Philosophy

Rollback restores a prior operational state where practical. It must not pretend an external action never occurred.

Examples:

- Internal classification can be reversed.
- Ownership can be restored with history.
- A sent message cannot be unsent merely by changing its status.
- A cancelled booking may require a new booking rather than rollback.
- A deleted local draft may be restored from recoverable deletion.

### SAFE-011 — Honest rollback

Rollback must distinguish restoring internal records from reversing real-world consequences.

### SAFE-012 — Dependency review

Rollback should identify related objects that may now be inconsistent.

---

## 7. Sensitive Information

Sensitive information includes identity, credentials, financial accounts, medical data, emergency data, private communications, access instructions, and confidential Documents.

The product shall apply:

- Minimum-necessary collection.
- Conservative default visibility.
- Masked display.
- Purpose-based access.
- Restricted AI context.
- Controlled export.
- Controlled sharing.
- Access and change logging where appropriate.

Sensitive values must not be exposed in general notifications, analytics, search previews, or logs.

---

## 8. Data Ownership

The Client owns their personal information subject to applicable obligations and approved operating arrangements. The Operator may manage information only within the authorized concierge purpose.

The product should support:

- Viewing stored personal information.
- Correction.
- Export where appropriate.
- Access revocation.
- Retention transparency.
- Deletion requests subject to safety, legal, and audit constraints.

AI-generated organization does not transfer ownership to the system or operator.

---

## 9. Privacy

Privacy shall be enforced through explicit record visibility and relationship-aware access.

Privacy categories:

- Client private.
- Operator private.
- Shared.
- Restricted sensitive.
- Approved external disclosure.

An object relationship must not leak inaccessible content. A shared Case may reference a private operator note without exposing that note.

---

## 10. Backup

Backup requirements should cover authoritative records, relationships, Documents, audit history, settings, and approved Knowledge.

A backup is useful only if it can be restored.

The product should define:

- Backup scope.
- Frequency.
- Retention.
- Encryption expectations.
- Verification.
- Restore testing.
- Responsibility.
- Recovery objectives during architecture planning.

### SAFE-013 — Restore proof

Backup success must not be assumed solely because a backup file exists.

---

## 11. Recovery

Recovery may be required after accidental change, AI error, integration failure, data corruption, lost access, or incomplete external action.

Recovery sequence:

1. Contain further impact.
2. Preserve evidence.
3. Identify affected objects and people.
4. Determine authoritative state.
5. Restore recoverable data.
6. Reconcile external actions.
7. Notify affected users when required.
8. Re-verify outcomes.
9. Record root cause and correction.

---

## 12. Explainability

A user must be able to understand why an important recommendation, alert, or automation occurred.

Explainability should identify:

- Trigger.
- Rule or reasoning.
- Source records.
- Confidence or uncertainty.
- Resulting action.
- Approval basis.

The product must not use “AI decided” as a sufficient explanation.

---

## 13. Automation Safety

Automation must be:

- Approved.
- Bounded.
- Observable.
- Idempotent where repeated execution is possible.
- Failure-visible.
- Reversible where practical.
- Disabled or paused when key assumptions are invalid.

Automation must not convert an AI suggestion into authority without the required review.

---

## 14. External-System Safety

External systems may accept a request without completing the desired outcome.

The product must distinguish:

- Request prepared.
- Request sent.
- External system accepted.
- External party confirmed.
- Outcome completed.
- Human verified.

Credentials, provider outages, rate limits, and partial failures must not be hidden behind a generic success state.

---

## 15. Incident Handling

Operational incidents include unauthorized disclosure, incorrect external message, duplicate action, wrong recipient, financial misstatement, lost data, and AI-caused misclassification with material effect.

The product should support:

- Incident flagging.
- Affected-object identification.
- Timeline reconstruction.
- Containment.
- Corrective action.
- User notification where required.
- Follow-up verification.

---

## 16. Safety Completion Conditions

Safety requirements are met only when users can see what happened, authority is attributable, sensitive data remains controlled, errors can be contained and corrected, backups can be restored, automation failures remain visible, and the system never confuses internal status changes with verified real-world outcomes.