# 04 — Universal Capture Model

## 1. Purpose

Universal Capture provides one conceptual intake path for all incoming information. Users should not need to decide whether something is a task, case, bill, contact, event, document, approval, or knowledge entry before recording it.

The capture model separates four concerns:

1. Receiving information.
2. Preserving the source.
3. Interpreting and proposing structure.
4. Human confirmation before authoritative use.

---

## 2. One Input Philosophy

“One input” means a consistent capture experience, not necessarily one technical endpoint or visual control.

A user may capture from different contexts, but each source should follow the same product contract:

```text
Source → Capture Item → Request Inbox → Interpretation
→ Proposed Objects → Human Review → Authoritative Objects
```

### CAP-001 — Capture without classification

A user must be able to record information without selecting its final object type.

### CAP-002 — Original preservation

The original captured content or an immutable source reference must be preserved.

### CAP-003 — Inbox first

Every unstructured capture must enter the Request Inbox before final classification, unless an explicitly approved deterministic workflow creates a known object type.

### CAP-004 — No consequential execution

Raw capture must not directly trigger consequential external action.

---

## 3. Capture Sources

## 3.1 Typed Text

Typed capture should support short requests, notes, pasted correspondence, and multi-action instructions.

The system should detect:

- Intent.
- People.
- Dates.
- Amounts.
- Locations.
- Commitments.
- Questions.
- Requested outcomes.
- Possible multiple actions.

It must not assume that every sentence is an instruction.

## 3.2 Voice

Voice capture should preserve the audio where policy permits and produce a transcript.

The transcript must remain distinguishable from the original audio and may contain errors. Names, amounts, dates, and addresses should be highlighted when confidence is insufficient.

Voice workflow:

```text
Audio → Transcript → Speaker/context identification
→ Intent extraction → Proposed objects → Human review
```

A transcript must not be treated as verified merely because speech recognition confidence is high.

## 3.3 Clipboard

Clipboard capture should accept copied text or supported content. The system should avoid capturing clipboard data without an explicit user action.

Source application may be recorded when available and appropriate, but the system must not imply that clipboard content remains current in the source application.

## 3.4 Images

Image capture may include receipts, bills, identity documents, handwritten notes, product labels, warranties, or damaged assets.

AI may propose extracted text and object classifications. The image remains the source. Extracted values require review according to sensitivity and consequence.

## 3.5 Documents

Document upload may contain one or more operational objects. A contract can create a document record, renewal reminder, contact, asset relationship, and knowledge entry.

The system should inspect file type, preserve provenance, identify potential sensitivity, and avoid broad AI exposure of secret values.

## 3.6 WhatsApp Forwarding

WhatsApp content may enter through an approved forwarding or integration mechanism.

The system should preserve sender, time, attachment references, and conversation context where authorized. It must distinguish a forwarded message from an instruction approved by the operator.

A WhatsApp message must not automatically authorize sending, booking, payment, or disclosure.

## 3.7 Email Forwarding

Email capture should preserve sender, recipients, subject, date, body, and attachments where permitted.

AI may identify commitments, requests, dates, bills, contacts, and documents. It must account for quoted history and signatures so they are not misclassified as new instructions.

## 3.8 Manual Quick Entry

Manual quick entry should support minimum-friction capture such as:

- Title or short note.
- Optional date.
- Optional person.
- Optional attachment.
- Optional voice note.

The user should be able to save immediately and organize later.

## 3.9 Future Integrations

Future sources must conform to the same capture contract. An integration must not bypass provenance, visibility, approval, and review requirements merely because its data is structured.

---

## 4. Capture Item

A Capture Item is the authoritative intake object before final classification.

It should contain:

- Capture identifier.
- Original content or source reference.
- Source type.
- Source identity where known.
- Capturing actor.
- Capture time.
- Attachments.
- Visibility.
- Sensitivity indicator.
- Processing status.
- AI interpretation.
- Confidence and uncertainty.
- Human review status.
- Created object links.
- Dismissal or deferral reason.

### Capture lifecycle

- Captured.
- Awaiting processing.
- Interpreted.
- Awaiting review.
- Partially classified.
- Classified.
- Deferred.
- Duplicate candidate.
- Dismissed.
- Failed processing.
- Archived.

Dismissal must not equal immediate permanent deletion.

---

## 5. One Capture to Multiple Objects

A single capture may create several related objects.

Example:

> “Please arrange the car service next Tuesday, ask the client to approve anything over 2,000 AED, and remind me the day before.”

Possible proposals:

- A Case for vehicle servicing.
- A Task to contact providers.
- A Calendar Event for the proposed service date.
- A Reminder one day before.
- An Approval rule for costs above 2,000 AED.
- A Conversation link to the source request.
- An Asset link to the relevant vehicle.

The operator must be able to accept all, accept selected proposals, edit them, or request clarification.

---

## 6. Object Conversion Rules

## 6.1 Task

Propose a Task when the capture describes an actionable unit with an intended owner or next action.

Do not create an authoritative deadline if none exists. AI may suggest one visibly.

## 6.2 Reminder

Propose a Reminder when attention is required at a specific time or relative to an event, obligation, or task.

A reminder should link to the object it concerns rather than duplicating the underlying information.

## 6.3 Calendar Event

Propose a Calendar Event when the capture describes a time-bound occurrence, appointment, reservation, or availability period.

The system must distinguish proposed, tentatively held, and externally confirmed events.

## 6.4 Bill

Propose a Bill when the source indicates an amount owed, due date, provider, invoice, recurring obligation, or payment request.

Amount, currency, due date, provider, and payment state require appropriate confidence and review.

## 6.5 Contact

Propose a Contact when the source introduces or updates a person or organization’s communication information.

Potential matches must be shown before merging.

## 6.6 Case

Propose a Case when the outcome requires multiple tasks, stages, approvals, providers, documents, or significant coordination.

## 6.7 Asset

Propose an Asset when the capture concerns a property, vehicle, device, membership, subscription, policy, or other managed item with an ongoing lifecycle.

## 6.8 Knowledge

Propose Knowledge when the source contains reusable, relatively stable information or an approved procedure.

AI-generated summaries must enter as drafts, not verified knowledge.

## 6.9 Conversation

Create or link a Conversation when source context is needed to understand commitments, decisions, or communications.

## 6.10 Approval

Propose an Approval when work cannot proceed without an authorized decision.

The proposed approval must identify the exact action, decision options, deadline, impact, and related records.

## 6.11 Notification

Propose a Notification when a person needs to be informed. A proposed notification is not permission to send it.

---

## 7. Review Experience

The review experience should show:

- Original source.
- AI summary.
- Proposed objects.
- Extracted fields.
- Confidence and uncertainty.
- Existing related records.
- Duplicate candidates.
- Missing information.
- Visibility.
- Consequential effects.

The operator may:

- Confirm.
- Edit.
- Split.
- Merge.
- Link.
- Defer.
- Dismiss.
- Ask for clarification.
- Mark no action required.

### CAP-005 — Review granularity

The operator must be able to reject one proposed object without rejecting all proposals from the capture.

### CAP-006 — Source trace

Every created object should link back to the Capture Item or source that caused it.

---

## 8. Duplicate and Conflict Handling

AI may identify a duplicate but must not delete or merge automatically when material information could be lost.

The review should show:

- Matching fields.
- Conflicting fields.
- Existing verification status.
- Source dates.
- Proposed merge result.

### CAP-007 — Verified-data protection

New unverified capture must not overwrite existing verified data.

### CAP-008 — Conflict state

Unresolved conflicts must remain visible and must not be flattened into one value.

---

## 9. Offline Capture

Offline capture should support drafts and local intake where appropriate.

Offline state must clearly show:

- Not synchronized.
- Not sent externally.
- Awaiting processing.
- Potential conflict.

External messages and consequential actions should require renewed confirmation after synchronization if circumstances may have changed.

---

## 10. Failure Handling

Capture processing may fail because of unsupported format, poor image quality, transcription failure, integration outage, or permission limitations.

The system must:

- Preserve the source where possible.
- Show the failure.
- Avoid partial authoritative creation without disclosure.
- Allow manual classification.
- Allow retry.
- Record whether retry created duplicate candidates.

---

## 11. Requirements Summary

- **CAP-009:** Original source and AI interpretation must be visually distinguishable.
- **CAP-010:** Low-confidence critical fields must require review.
- **CAP-011:** Raw capture must not authorize external communication.
- **CAP-012:** Capture visibility must default conservatively.
- **CAP-013:** Sensitive content must not appear unnecessarily in notifications or summaries.
- **CAP-014:** A capture may produce multiple linked objects.
- **CAP-015:** Future integrations must enter through equivalent provenance and safety controls.
- **CAP-016:** Human edits must be preserved in the final proposal.
- **CAP-017:** Processing failure must not be interpreted as no action required.
- **CAP-018:** The system must support a human-only classification path if AI is unavailable.