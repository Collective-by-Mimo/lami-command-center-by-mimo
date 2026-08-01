# 08 — Personal Knowledge Vault

## 1. Purpose

The Personal Knowledge Vault stores reusable information needed to answer questions, make recommendations, and operate consistently.

It is not an unfiltered collection of AI output. Knowledge must have type, authority, provenance, visibility, effective period, and review state.

---

## 2. Knowledge Classes

## 2.1 Verified Fact

A fact explicitly confirmed by an authorized human or trusted source.

Examples:

- Preferred communication phone number.
- Confirmed property address.
- Verified passport expiry date.
- Approved provider account reference.

A Verified Fact must retain source and verification time.

## 2.2 Personal Preference

A preference stated or approved by the Client.

Examples:

- Preferred communication channel.
- Preferred appointment time.
- Provider preference.
- Notification preference.

Preferences may change and should support effective dates and history.

## 2.3 AI Suggestion

An AI-generated interpretation or recommendation awaiting review.

AI Suggestion must not be used as an authoritative fact. It may support review and decision making.

## 2.4 Temporary Note

Short-lived information useful for current operations but not intended as durable truth.

Temporary Notes should have review or expiry dates.

## 2.5 Archived Information

Information intentionally removed from active use but retained for history, audit, or recovery.

Archived Information should not appear as current in ordinary AI answers.

## 2.6 Historical Information

Information that was valid for a known period.

Examples:

- Previous address.
- Former provider.
- Prior preference.
- Expired insurance policy.

Historical information may explain past decisions but must not be applied to current actions without context.

---

## 3. Trust Levels

Suggested trust levels:

- Authoritative and verified.
- Approved preference.
- Trusted imported source.
- Human entered, unverified.
- AI extracted from source.
- AI suggested.
- Conflicting.
- Historical.
- Archived.

Trust level must not be inferred solely from age or repetition.

- **KNOW-001:** Repeated AI output does not increase authority.
- **KNOW-002:** A summary of a Verified Fact is not itself the source fact.
- **KNOW-003:** Knowledge used in consequential action must meet the required trust level.

---

## 4. Provenance

Knowledge should identify:

- Originating Person or source.
- Source Document, Conversation, Capture Item, or integration.
- AI involvement.
- Verification actor.
- Verification time.
- Effective period.
- Superseded entry.

A user should be able to navigate from an AI answer to the Knowledge entry and from the Knowledge entry to its source where permissions allow.

---

## 5. Verification Workflow

```text
Candidate knowledge captured
→ classified by type
→ source linked
→ AI may summarize
→ human reviews
→ verification state assigned
→ visibility assigned
→ effective/review dates set
→ knowledge becomes available according to trust level
```

Unverified Knowledge may be searchable but should be labeled and restricted from consequential automation.

---

## 6. Access and Visibility

Knowledge may be:

- Operator private.
- Client private.
- Shared.
- Restricted sensitive.
- Approved for specific external use.

Visibility of a source Document does not automatically determine visibility of every derived summary. Derived content must not broaden access.

### KNOW-004 — Private-note boundary

Operator-private notes must not appear in client AI answers.

### KNOW-005 — Minimum disclosure

AI should disclose only the minimum Knowledge required to answer or perform the approved task.

---

## 7. Retention and Review

Knowledge should support:

- Review date.
- Expiry date.
- Effective start and end.
- Supersession.
- Archive.
- Deletion request.

High-impact Knowledge such as emergency procedure, identity status, financial instruction, or trusted-contact authority should have periodic review.

Temporary Notes should expire or prompt review rather than silently becoming permanent memory.

---

## 8. AI Use of Knowledge

AI may use Knowledge according to authority and visibility.

When answering, AI should distinguish:

- “Verified record states…”
- “Client preference states…”
- “Historical information shows…”
- “Unverified note suggests…”
- “I do not have verified information.”

AI must not combine several weak inferences into a claimed fact.

### KNOW-006 — Conflict behavior

If current Knowledge conflicts, AI must show the conflict or request clarification.

### KNOW-007 — Citation

Consequential recommendations should cite the Knowledge or source records used.

---

## 9. Correction and Recovery

When Knowledge is corrected:

- Preserve the previous version where appropriate.
- Record the correction.
- Mark superseded information.
- Identify dependent drafts or active workflows.
- Avoid rewriting historical decisions as if the corrected fact had always been known.
- Update future AI use.

Rejected AI suggestions should remain available for audit if consequential but should not pollute active Knowledge.

---

## 10. Knowledge Completion Conditions

The Vault is correct when users can distinguish fact, preference, suggestion, note, archive, and history; every item has provenance; visibility is enforced; AI cites and qualifies its use; temporary information does not become permanent by accident; and corrections preserve both current truth and historical context.