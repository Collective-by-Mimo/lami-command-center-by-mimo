# 15 — End-to-End Workflows

## 1. Purpose

This chapter defines complete operational flows. Workflows cross modules but operate on shared authoritative objects.

Every workflow follows the governing sequence:

```text
Capture → Understand → Organize → Recommend → Request Approval
→ Execute Approved Actions → Report Result → Human Verification
→ Continuous Learning
```

A workflow may skip a stage only when it is genuinely unnecessary, not to hide an assumption or approval.

---

## 2. General Request Workflow

1. Client or Operator captures text, voice, image, Document, message, or manual note.
2. Capture Item enters Request Inbox.
3. AI identifies probable intent, people, dates, amounts, objects, and missing information.
4. Original source remains visible.
5. AI proposes one or more Tasks, Cases, Events, Reminders, Approvals, Contacts, Assets, Bills, Documents, Notifications, Conversations, or Knowledge entries.
6. Operator reviews confidence and uncertainty.
7. Operator confirms, edits, splits, links, defers, or dismisses proposals.
8. Authoritative objects are created with source links.
9. Ownership, next action, visibility, and dates are confirmed.
10. Required Client clarification or Approval is requested.
11. Execution proceeds.
12. Results and failures are recorded.
13. Completion evidence is attached.
14. Human verifies the outcome.
15. Accepted corrections or preferences may update Knowledge.

Failure path: if interpretation fails, preserve the Capture Item, show the error, and allow human classification.

---

## 3. Voice-to-Task Workflow

1. User records voice.
2. System records capture time, actor, visibility, and source.
3. Audio is transcribed.
4. Transcript is labeled AI-generated and linked to audio.
5. AI detects actions, dates, people, amounts, and urgency.
6. Low-confidence names, dates, and amounts are highlighted.
7. AI proposes Tasks and related objects.
8. User reviews transcript and proposals.
9. User corrects errors.
10. Task owner and due date are confirmed.
11. Reminder and Calendar proposals are reviewed.
12. Task becomes active.

AI must not invent a date when the speaker gave none. It may suggest a review date visibly.

---

## 4. Case Workflow

1. Request is identified as multi-step.
2. Case outcome and scope are defined.
3. Case owner is assigned.
4. AI may recommend a template.
5. Required information checklist is prepared.
6. Tasks, milestones, Documents, Providers, Events, costs, and Approvals are linked.
7. Missing information is requested.
8. Options or quotations are collected.
9. AI summarizes options with sources and uncertainty.
10. Authorized Person approves consequential choice.
11. Work executes through linked Tasks.
12. Waiting states identify who owes the next action.
13. Communications and changes remain in Case history.
14. Completion criteria are reviewed.
15. Evidence is attached.
16. Operator verifies operational completion.
17. Client confirmation is requested where appropriate.
18. Case closes, remains awaiting verification, or reopens.

---

## 5. Provider Selection Workflow

1. Service need is linked to Client, Case, Asset, Property, or Vehicle.
2. Requirements, location, timing, cost boundary, and approval authority are captured.
3. AI suggests eligible Providers using approved records.
4. Operator reviews conflicts, availability, history, and missing data.
5. Outreach messages are drafted.
6. Operator approves recipient and content.
7. Messages are sent and status recorded.
8. Quotations and replies become Documents and Conversations.
9. AI compares price, timing, scope, conditions, and prior history.
10. Operator reviews recommendation.
11. Client Approval is requested where required.
12. Selected Provider is confirmed.
13. Booking is prepared and approved.
14. Event and Tasks are created.
15. Work is monitored.
16. Bill, Receipt, and completion evidence are captured.
17. Human verifies outcome.
18. Provider history is updated with verified facts, not unsupported scoring.

---

## 6. Calendar and Appointment Workflow

1. Need for appointment is captured.
2. Participants, purpose, location, duration, and timing constraints are identified.
3. Private availability may be used without disclosing private event details.
4. AI proposes suitable times.
5. Operator or Client confirms options to offer.
6. External request is approved and sent.
7. Tentative Event is created.
8. Provider or participant response is recorded.
9. Event becomes externally confirmed only with evidence.
10. Preparation Tasks, travel time, Documents, and Reminders are linked.
11. Changes require visibility and, where material, renewed approval.
12. After the event, attendance and outcome are recorded.
13. Follow-up Task or Case stage is created.

---

## 7. Bill and Payment Coordination Workflow

1. Bill or expected obligation is captured.
2. Original Document is preserved.
3. AI extracts provider, amount, currency, due date, category, and reference.
4. Field confidence is displayed.
5. Human verifies consequential values.
6. Bill is matched to recurring obligation, Property, Asset, Contract, or Provider.
7. Duplicate and anomaly checks run.
8. Responsibility and Approval requirement are identified.
9. Reminders are scheduled.
10. Client or Operator Approval is requested where required.
11. User opens approved external payment shortcut or pays outside LaMi.
12. System does not assume payment.
13. Payment confirmation, statement, or human assertion is captured.
14. Bill moves to payment reported or awaiting verification.
15. Receipt is attached and reconciled.
16. Authorized human verifies payment.
17. Dashboard and history update from the authoritative Bill.
18. Next expected recurrence is generated if applicable.

---

## 8. Document Intake Workflow

1. Document, image, or attachment is captured.
2. Source, actor, time, visibility, and file information are recorded.
3. Safety and format checks occur.
4. AI proposes Document type and extracted metadata.
5. Sensitive fields are masked.
6. Related Person, Client, Provider, Case, Bill, Asset, or Life Hub record is proposed.
7. Expiry, renewal, amount, or action dates are identified as proposed values.
8. Human reviews critical fields.
9. Document is classified and stored.
10. Related Tasks, Reminders, or Events are proposed.
11. Search index and Knowledge access respect visibility.
12. Superseded Documents remain historically traceable.

---

## 9. Life Hub Renewal Workflow

1. Verified Life Hub record has expiry or review date.
2. System creates an internal early-awareness Reminder according to record type.
3. AI checks required Documents and related history.
4. Missing information is identified.
5. Operator reviews renewal plan.
6. Case may be created for complex renewal.
7. Client is informed with minimum sensitive detail.
8. Application or appointment action requires approval where consequential.
9. Submission evidence is recorded.
10. Current record remains active or expiring until replacement is verified.
11. New Document is captured.
12. Human verifies new values.
13. Previous record becomes superseded, not silently overwritten.
14. Dependent travel, identity, or emergency records are reviewed.

---

## 10. Client Approval Workflow

1. Workflow reaches a decision boundary.
2. Approval object identifies action, reason, cost, deadline, information shared, alternatives, and recommendation.
3. Authorized approver is confirmed.
4. Approval is delivered through an approved channel.
5. Client reviews source context.
6. Client approves, approves with conditions, rejects, asks a question, or requests changes.
7. Decision is logged.
8. Material changes invalidate prior approval.
9. Approved action executes within scope.
10. Result is reported.
11. Client or Operator verifies consequential outcome.

---

## 11. Notification Workflow

1. Reminder or state change creates a notification need.
2. Recipient, channel, purpose, timing, and sensitivity are determined.
3. Message uses approved template or AI draft.
4. Required approval is obtained.
5. Notification is scheduled or sent.
6. Send, delivery, acknowledgement, and failure are tracked separately.
7. Failure enters Exceptions.
8. Duplicate protection prevents repeated sends.
9. Missed or unacknowledged reminders escalate according to policy.
10. Underlying obligation remains open until independently complete.

---

## 12. Daily Operations Workflow

1. System compiles authoritative events, Tasks, Cases, Bills, Reminders, Approvals, Waiting items, and Exceptions.
2. AI prepares Daily Briefing with source links.
3. Suggested priorities are labeled.
4. Operator reviews and adjusts agenda.
5. New captures enter Inbox throughout the day.
6. Quick actions remain linked to source objects.
7. Blocked work moves to Waiting with responsible party.
8. Consequential decisions move to Approvals.
9. Failures move to Exceptions.
10. Completed work enters verification where required.
11. End-of-day review identifies unresolved work, missed reminders, and tomorrow’s risks.

---

## 13. Weekly Planning Workflow

1. System reviews next 7–14 days.
2. Events, due dates, renewals, Bills, recurring obligations, and Case milestones are combined.
3. AI detects conflicts, workload concentration, and early decisions needed.
4. Operator reviews recommendations.
5. Tasks are rescheduled only by authorized action.
6. Client receives relevant shared preview.
7. Reminders and follow-ups are confirmed.
8. Weekly plan remains a derived view linked to authoritative objects.

---

## 14. Knowledge Creation Workflow

1. Reusable information is identified from a Capture, Conversation, Document, correction, or repeated workflow.
2. AI proposes Knowledge class and summary.
3. Source is linked.
4. Human chooses Verified Fact, Preference, Procedure, Temporary Note, or another class.
5. Visibility and effective period are assigned.
6. Entry becomes available according to trust level.
7. Review or expiry date is scheduled where needed.
8. Future AI responses cite the entry.
9. Correction supersedes rather than erases historical context.

---

## 15. Error Recovery Workflow

1. Error is reported or detected.
2. Affected automation pauses where necessary.
3. Source, timeline, actions, and affected objects are preserved.
4. Error is classified.
5. Authoritative human information is identified.
6. Reversible changes are rolled back.
7. External consequences are reconciled honestly.
8. Affected users are informed where required.
9. Dependent objects are reviewed.
10. Corrective rule or workflow change is documented.
11. Outcome is re-verified.
12. Incident closes only after remaining risks are visible and accepted.

---

## 16. Offline Capture and Synchronization Workflow

1. User captures while offline.
2. Item is clearly marked local and unsynchronized.
3. No external send is claimed.
4. Local changes retain source and time.
5. Connection returns.
6. System checks identity, permissions, and conflicts.
7. Non-conflicting drafts synchronize.
8. Material conflicts require review.
9. Consequential queued actions require renewed confirmation where circumstances may have changed.
10. Synchronization result is reported.

---

## 17. Workflow Integrity Requirements

- **FLOW-001:** Every workflow must identify authoritative objects.
- **FLOW-002:** Every consequential action must identify approval basis.
- **FLOW-003:** Every workflow must define failure and partial-completion behavior.
- **FLOW-004:** Every workflow must distinguish execution from verification.
- **FLOW-005:** Every workflow should define recovery.
- **FLOW-006:** External actions must retain recipient, scope, and result.
- **FLOW-007:** AI involvement must remain visible.
- **FLOW-008:** No workflow may use an inaccessible related object to disclose private content.
- **FLOW-009:** Completion must not erase source, approval, or evidence history.
- **FLOW-010:** Workflow templates must remain editable and subject to the same authority rules.