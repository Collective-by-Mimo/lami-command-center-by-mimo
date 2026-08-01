# 05 — Object-Centric Information Model

## 1. Purpose

LaMi shall be object-centric rather than module-centric.

Modules are user experiences. Objects are authoritative operational concepts. A Task may appear in Today, a Case, a Calendar, a client view, and a report, but it remains one Task object.

The object model prevents isolated feature silos and supports traceability, search, AI grounding, permissions, reporting, and future expansion.

This chapter defines product semantics, not a database schema.

---

## 2. Universal Object Properties

Every authoritative object should support the following where applicable:

- Unique identity.
- Human-readable title or label.
- Object type.
- Status.
- Owner.
- Participants.
- Client relationship.
- Visibility.
- Sensitivity.
- Provenance.
- Verification state.
- Created and updated time.
- Relevant dates.
- Source capture.
- Related objects.
- Activity history.
- Attachments.
- AI involvement.
- Archive state.

### OBJ-001 — Stable identity

An object must retain stable identity across views and relationships.

### OBJ-002 — Explicit relationships

Relationships should be explicit and navigable rather than inferred repeatedly from text.

### OBJ-003 — No relationship by leakage

A user’s ability to see one object must not automatically grant access to every related object.

---

## 3. Person

A Person represents a human being independent of operational role.

A Person may become or relate to:

- Client.
- Contact.
- Provider representative.
- Trusted Contact.
- Household member.
- Emergency Contact.
- Doctor or professional contact.
- Operator.

A Person should contain identity and preferred-display information appropriate to the product. Sensitive identity documents belong in Life Hub records, not as unrestricted Person fields.

### Lifecycle

- Proposed.
- Active.
- Inactive.
- Duplicate candidate.
- Merged with retained history.
- Archived.

### Relationships

A Person may own Tasks, participate in Cases, attend Events, send Conversations, receive Notifications, provide Approvals, relate to Assets, and appear in Knowledge.

---

## 4. Contact

A Contact represents methods and context for communicating with a Person or organization.

Contact information may include phone, email, messaging identifier, address, communication preference, and availability notes.

Contact values should carry provenance and verification independently. One verified phone number must not cause another unverified number to disappear.

### OBJ-004 — Contact verification

Communication destinations used for sensitive or consequential messages should be verified or explicitly confirmed before use.

### Relationships

Contacts link to Persons, Clients, Providers, Conversations, Notifications, Cases, and Assets.

---

## 5. Client

A Client represents the person receiving concierge service and the operational context around that service relationship.

Client is a role associated with a Person, not a duplicate person record.

Client context may include:

- Service status.
- Communication preferences.
- Approved preferences.
- Visibility rules.
- Trusted contacts.
- Shared workspace.
- Life Hub.
- Finance operating context.
- Cases, tasks, events, documents, and knowledge.

### OBJ-005 — Preference authority

Client preferences must distinguish verified preference, temporary request, operator observation, and AI inference.

---

## 6. Provider

A Provider represents an organization or individual supplying an external service.

Provider information may include:

- Services.
- Service area.
- Contacts.
- Availability.
- Quotation history.
- Completed work.
- Reliability notes.
- Required documents.
- Payment arrangements.
- Related Assets and Cases.

AI may recommend a Provider based on approved criteria but must not present the recommendation as a guarantee.

### Relationships

Providers connect to Contacts, Persons, Cases, Tasks, Bills, Documents, Conversations, Calendar Events, Assets, and Knowledge.

---

## 7. Task

A Task is an actionable unit of work with one primary owner and a clear next action.

### Core semantics

- A Task should have one primary owner.
- It may have collaborators, watchers, and approvers.
- It should have a due date or explicit no-date state.
- It may be private, shared, or client-visible.
- It may belong to a Case or stand alone.
- Completion criteria should be proportionate to consequence.

### Lifecycle

- Inbox/draft.
- Planned.
- In progress.
- Waiting.
- Blocked.
- Awaiting approval.
- Awaiting verification.
- Completed.
- Cancelled.
- Archived.

### OBJ-006 — Task completion

A consequential Task must not move directly from execution attempt to verified completion without the required evidence or human verification.

### Relationships

Tasks may relate to Persons, Clients, Providers, Cases, Bills, Assets, Documents, Conversations, Reminders, Events, Approvals, Notifications, and Knowledge.

---

## 8. Case

A Case represents a multi-step outcome requiring coordinated work.

A Case should define:

- Requested outcome.
- Scope.
- Owner.
- Participants.
- Lifecycle stage.
- Required information.
- Tasks.
- Milestones.
- Approvals.
- Providers.
- Communications.
- Documents.
- Costs.
- Completion criteria.
- Verification and client confirmation.

### Lifecycle

- Intake.
- Clarification.
- Planning.
- Awaiting approval.
- Execution.
- Waiting/blocked.
- Verification.
- Completed.
- Reopened.
- Cancelled.
- Archived.

### OBJ-007 — Case next action

Every active Case should have a visible next action or an explicit waiting reason.

---

## 9. Bill

A Bill represents a financial obligation or payment request.

A Bill may include:

- Provider.
- Amount.
- Currency.
- Due date.
- Issue date.
- Category.
- Recurrence.
- Payment responsibility.
- Payment status.
- Approval requirement.
- Source document.
- Receipt or confirmation.
- Related Asset, Property, Case, or Contract.

### Lifecycle

- Captured.
- Awaiting review.
- Confirmed.
- Awaiting approval.
- Due.
- Overdue.
- Payment reported.
- Awaiting verification.
- Paid and verified.
- Disputed.
- Cancelled.
- Archived.

### OBJ-008 — No payment invention

Payment state must not be inferred from opening a payment portal or from an unverified message.

---

## 10. Asset

An Asset represents an item, entitlement, account, or location with an ongoing lifecycle requiring organization or service.

Asset types may include Property, Vehicle, Device, Membership, Subscription, Policy, Warranty, and other managed items.

Common Asset properties may include owner, identifier, acquisition date, status, location, documents, providers, recurring costs, maintenance, expiry, and related cases.

Asset does not imply financial ownership valuation unless explicitly recorded and verified.

---

## 11. Property

A Property is a specialized Asset representing a residence, investment property, office, storage location, or other managed real estate context.

It may relate to:

- Addresses and Important Locations.
- Ownership or rental documents.
- Utilities.
- Community fees.
- Providers.
- Household members.
- Maintenance Cases.
- Bills.
- Insurance.
- Access instructions.

Sensitive access information must use restricted visibility and must not appear in general summaries.

---

## 12. Vehicle

A Vehicle is a specialized Asset.

It may relate to:

- Registration.
- Insurance.
- Ownership documents.
- Driver relationships.
- Service history.
- Warranty.
- Fines or obligations where approved.
- Providers.
- Bills and receipts.
- Calendar events and reminders.

A Vehicle identifier must not be used to infer ownership without verified evidence.

---

## 13. Document

A Document represents a stored file or an external document reference with metadata, provenance, visibility, and relationships.

Document types may include identity, invoice, receipt, contract, warranty, insurance, certificate, correspondence, quotation, and evidence.

### Lifecycle

- Uploaded/captured.
- Processing.
- Awaiting classification.
- Awaiting verification.
- Active.
- Superseded.
- Expired.
- Archived.
- Restricted.
- Deletion pending.

### OBJ-009 — Source preservation

AI extraction must not replace the source Document.

### OBJ-010 — Sensitive document sharing

Sharing a sensitive Document externally requires explicit approval and recipient confirmation.

---

## 14. Conversation

A Conversation represents operationally relevant communication context.

It may contain messages, call notes, transcripts, drafts, decisions, and commitments.

Conversation records should distinguish:

- Source channel.
- Participants.
- Inbound and outbound content.
- Draft, approved, sent, delivered, and acknowledged state.
- AI summary versus original content.

The product need not replicate every message from every external platform. It should retain the information required to understand operational commitments and decisions.

---

## 15. Reminder

A Reminder represents a requirement to bring an object or issue to a person’s attention at a defined time or condition.

A Reminder should link to the underlying object. It should not duplicate the entire Task, Bill, Event, or Document.

Reminder lifecycle:

- Draft.
- Scheduled.
- Due.
- Delivered.
- Acknowledged.
- Snoozed.
- Missed.
- Escalated.
- Completed.
- Cancelled.

A Reminder does not prove the underlying obligation was completed.

---

## 16. Calendar Event

A Calendar Event represents a time-bounded occurrence.

Event states should distinguish:

- Proposed.
- Tentative.
- Confirmed internally.
- Confirmed externally.
- Rescheduled.
- Cancelled.
- Occurred.
- Missed.
- Awaiting outcome verification.

Events may link to Tasks, Cases, Bills, Assets, Providers, Persons, Reminders, Conversations, Documents, and Approvals.

---

## 17. Approval

An Approval represents an explicit decision required before a defined action can proceed.

It should contain:

- Requested decision.
- Requester.
- Authorized approver.
- Options.
- Recommendation and explanation.
- Cost or consequence.
- Information to be shared.
- Deadline.
- Related objects.
- Decision.
- Conditions.
- Time.
- Resulting action.

### Lifecycle

- Draft.
- Requested.
- Viewed.
- Clarification requested.
- Approved.
- Approved with conditions.
- Rejected.
- Withdrawn.
- Expired.
- Executed.
- Execution failed.

### OBJ-011 — Approval immutability

The material content of an approval request must not be silently changed after approval. Material change requires renewed approval.

---

## 18. Notification

A Notification represents a communication intended to inform or prompt attention.

It should contain:

- Recipient.
- Channel.
- Purpose.
- Related object.
- Content or template reference.
- Sensitivity.
- Approval basis.
- Schedule.
- Delivery state.
- Acknowledgement state.
- Failure and escalation information.

Notification is distinct from Reminder: the Reminder is the obligation to notify; the Notification is the communication attempt.

---

## 19. Knowledge

Knowledge represents reusable information intended to support future decisions, answers, or workflows.

Knowledge classes include:

- Verified Fact.
- Personal Preference.
- Approved Procedure.
- AI Suggestion.
- Temporary Note.
- Archived Information.
- Historical Information.

Knowledge must retain provenance, verification, scope, visibility, effective date, review date, and supersession state.

AI-generated summaries must not become Verified Facts without human approval.

---

## 20. Relationship

A Relationship is an explicit semantic link between objects.

Examples:

- Person **is client for** Client context.
- Person **represents** Provider.
- Client **owns** Asset.
- Task **belongs to** Case.
- Task **depends on** Task.
- Bill **relates to** Property.
- Document **supports** Bill.
- Approval **authorizes** Action or Task.
- Reminder **alerts about** Bill.
- Calendar Event **schedules** Task.
- Conversation **contains commitment for** Case.
- Provider **services** Asset.
- Knowledge **describes** Procedure or Preference.

Relationships should carry type, provenance, visibility, effective period, and verification where material.

### OBJ-012 — Direction and meaning

Relationships must have explicit meaning and direction where ambiguity could affect behavior.

### OBJ-013 — Relationship lifecycle

A relationship may be proposed, verified, disputed, expired, superseded, or archived.

---

## 21. Relationship Matrix

| Object | Common relationships |
|---|---|
| Person | Contact, Client, Provider, Task, Case, Event, Approval, Conversation, Asset |
| Contact | Person, Provider, Notification, Conversation, Case |
| Client | Person, Task, Case, Bill, Asset, Document, Knowledge, Calendar, Approval |
| Provider | Person, Contact, Service, Case, Task, Bill, Document, Asset, Conversation |
| Task | Owner Person, Client, Case, Bill, Asset, Document, Event, Reminder, Approval |
| Case | Client, Tasks, Providers, Conversations, Documents, Bills, Approvals, Events |
| Bill | Client, Provider, Asset, Property, Document, Reminder, Approval, Payment evidence |
| Asset | Client, Person, Provider, Case, Bill, Document, Reminder, Event, Knowledge |
| Property | Client, Asset, Utility Bill, Contract, Provider, Document, Case |
| Vehicle | Client, Asset, Provider, Document, Bill, Case, Event, Reminder |
| Document | Source capture, Person, Client, Case, Bill, Asset, Approval, Knowledge |
| Conversation | Participants, Case, Task, Approval, Notification, Provider, Client |
| Reminder | Recipient, Task, Bill, Event, Document, Asset, Notification |
| Calendar Event | Participants, Case, Task, Provider, Asset, Reminder, Approval |
| Approval | Approver, requester, proposed action, Case, Task, Bill, Document |
| Notification | Recipient, Reminder, Task, Case, Bill, Approval, Conversation |
| Knowledge | Client, Person, Asset, Procedure, Document, source records |

The matrix is not exhaustive. New relationship types must pass the future expansion and visibility rules.

---

## 22. Object Integrity Requirements

- **OBJ-014:** Deleting one object must not silently delete related authoritative objects.
- **OBJ-015:** Archive must preserve relationship history.
- **OBJ-016:** Merge must preserve provenance and previous identifiers.
- **OBJ-017:** AI may propose relationships but must not silently establish sensitive relationships.
- **OBJ-018:** Visibility must be evaluated for each object and relationship.
- **OBJ-019:** Search must not reveal inaccessible related objects.
- **OBJ-020:** Derived status must identify the authoritative objects used.
- **OBJ-021:** Object history must distinguish correction from deletion.
- **OBJ-022:** Every consequential action should link to the object that justified it.
- **OBJ-023:** A user must be able to navigate from a derived view to its authoritative record.

---

## 23. Acceptance Conditions

The object-centric model is successful when:

- Information is not trapped inside isolated modules.
- One object can appear consistently in multiple workflows.
- Related context is navigable.
- Visibility does not leak through relationships.
- AI can cite authoritative objects rather than relying on unstructured history.
- Reports derive from objects rather than becoming separate facts.
- Corrections propagate through references without rewriting history.
- A complete operational timeline can be reconstructed.