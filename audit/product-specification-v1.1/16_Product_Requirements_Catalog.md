# 16 — Product Requirements Catalog

## 1. Purpose

This catalog consolidates mandatory and high-value requirements for traceability. The detailed chapters remain authoritative for interpretation.

---

## 2. Authority Requirements

| ID | Requirement |
|---|---|
| AUTH-001 | Material conflicts must not be silently resolved. |
| AUTH-002 | Human correction takes precedence over corrected AI interpretation. |
| AUTH-003 | Rejected inference must not return as fact without new evidence. |
| AUTH-004 | Approval cannot be reused for a materially different action. |
| AUTH-005 | Approval must show scope, effect, sharing, uncertainty, and reversibility. |
| AUTH-006 | The same operational fact must not have independent authoritative copies. |
| AUTH-007 | Dashboards and reports are views, not sources of truth. |
| AUTH-008 | Derived information should link to source records. |
| AUTH-009 | AI-generated content must be distinguishable. |
| AUTH-010 | Consequential actions require a recorded authority basis. |
| AUTH-011 | Important actions should be reversible where practical. |
| AUTH-012 | Failures remain visible until resolved or acknowledged. |
| AUTH-013 | Relationships must not leak private data. |
| AUTH-014 | Uncertainty must not be represented as certainty. |
| AUTH-015 | Consequential decisions require reconstructable history. |

---

## 3. AI Requirements

| ID | Requirement |
|---|---|
| AI-001 | AI must never invent facts. |
| AI-002 | AI must not silently modify verified human information. |
| AI-003 | AI output must remain distinguishable. |
| AI-004 | Recommendations should identify evidence. |
| AI-005 | Humans must be able to correct AI. |
| AI-006 | Confidence never replaces authority. |
| AI-007 | Critical extracted fields require uncertainty indicators. |
| AI-008 | Confidence must not use false precision. |
| AI-009 | Unknown is a valid state. |
| AI-010 | Ambiguous dates must not be silently resolved. |
| AI-011 | Financial ambiguity must not be filled by invention. |
| AI-012 | Similar names must not cause silent identity merging. |
| AI-013 | Consequential recommendations should link to evidence. |
| AI-015 | Consequential AI behavior must be reconstructable. |
| AI-016 | Consequential AI errors must not be concealed. |
| AI-018 | Unverified inference must not become verified memory. |
| AI-020 | Durable memory must be inspectable and correctable. |
| AI-023 | Operator-private notes must not leak to Client AI. |
| AI-025 | Secret values must not enter general AI memory. |

---

## 4. Operator and Capture Requirements

| ID | Requirement |
|---|---|
| OP-001 | Operator work should be organized around action and state. |
| OP-002 | Capture must be low friction. |
| OP-004 | Unreviewed capture is not an approved instruction. |
| OP-005 | Active Tasks require owner and next action. |
| OP-007 | Consequential work should define completion criteria. |
| OP-009 | Awaiting verification is distinct from completed. |
| OP-010 | Consequential objects require activity history. |
| OP-012 | Consequential actions should not be orphaned. |
| OP-014 | Each concept has one authoritative object. |
| OP-016 | AI must respect manual correction. |
| CAP-001 | Capture must not require final classification. |
| CAP-002 | Original content or source reference must be preserved. |
| CAP-003 | Unstructured capture enters Request Inbox. |
| CAP-004 | Raw capture cannot trigger consequential execution. |
| CAP-005 | Review must allow proposal-level acceptance or rejection. |
| CAP-006 | Created objects link to source Capture Item. |
| CAP-007 | Unverified capture cannot overwrite verified data. |
| CAP-010 | Low-confidence critical fields require review. |
| CAP-018 | Human-only classification must remain available. |

---

## 5. Object Requirements

| ID | Requirement |
|---|---|
| OBJ-001 | Objects retain stable identity across views. |
| OBJ-002 | Relationships are explicit and navigable. |
| OBJ-003 | Relationship does not automatically grant access. |
| OBJ-004 | Sensitive communication destinations should be verified. |
| OBJ-006 | Consequential Task completion requires evidence or verification. |
| OBJ-007 | Active Cases require next action or waiting reason. |
| OBJ-008 | Payment state cannot be inferred from portal access. |
| OBJ-009 | AI extraction cannot replace source Document. |
| OBJ-010 | Sensitive Document sharing requires approval. |
| OBJ-011 | Materially changed Approval requires renewed decision. |
| OBJ-014 | Deleting one object cannot silently delete related authority. |
| OBJ-016 | Merge preserves provenance and identifiers. |
| OBJ-019 | Search cannot expose inaccessible relationships. |
| OBJ-023 | Derived views navigate to authoritative records. |

---

## 6. Life Hub and Finance Requirements

| ID | Requirement |
|---|---|
| LIFE-001 | Sensitive values require defined purpose. |
| LIFE-002 | Collect only information needed for approved operation. |
| LIFE-004 | AI cannot invent sensitive values. |
| LIFE-006 | Access depends on role, visibility, sensitivity, and need. |
| LIFE-007 | Secrets cannot appear in general output. |
| LIFE-010 | Deletion must be explicit and recoverable where practical. |
| FIN-001 | AI cannot invent financial values or status. |
| FIN-002 | Product cannot approve or move money. |
| FIN-003 | Payment links cannot imply completion. |
| FIN-004 | Verified finance data cannot be silently overwritten. |
| FIN-005 | Material payment change requires renewed approval. |
| FIN-006 | Approval is not payment. |

---

## 7. Knowledge, Safety, Notification, and Workspace Requirements

| ID | Requirement |
|---|---|
| KNOW-001 | Repeated AI output does not increase authority. |
| KNOW-003 | Consequential use requires sufficient trust level. |
| KNOW-004 | Private Operator notes cannot enter Client AI. |
| KNOW-006 | Conflicting Knowledge must be surfaced. |
| SAFE-001 | Never delete automatically. |
| SAFE-002 | Never overwrite verified human data silently. |
| SAFE-003 | Never invent finance information. |
| SAFE-004 | Never invent deadlines. |
| SAFE-005 | Never send externally without required approval. |
| SAFE-006 | Never approve payments. |
| SAFE-007 | Never silently modify ownership. |
| SAFE-008 | Log every automated action. |
| SAFE-009 | Important actions should be reversible. |
| SAFE-010 | Never claim completion without evidence. |
| NOT-001 | Sending attempt is not delivery. |
| NOT-002 | Stop reminders after verified completion. |
| NOT-003 | Snooze does not change due date. |
| NOT-004 | Missed reminders remain visible. |
| WORK-001 | Visibility is explicit and conservative. |
| WORK-002 | Relationships do not broaden access. |
| WORK-003 | AI obeys requester visibility. |

---

## 8. Workflow Requirements

| ID | Requirement |
|---|---|
| FLOW-001 | Workflows identify authoritative objects. |
| FLOW-002 | Consequential actions identify approval basis. |
| FLOW-003 | Workflows define failure and partial completion. |
| FLOW-004 | Execution and verification remain distinct. |
| FLOW-005 | Workflows should define recovery. |
| FLOW-006 | External actions retain recipient, scope, and result. |
| FLOW-007 | AI involvement remains visible. |
| FLOW-008 | Workflows cannot disclose inaccessible content. |
| FLOW-009 | Completion preserves source and approval history. |
| FLOW-010 | Templates remain editable and governed. |

---

## 9. Acceptance Gate

Before architecture planning, each requirement must be reviewed as:

- Accepted.
- Accepted with clarification.
- Deferred to a named future version.
- Rejected with reason.
- Duplicate and consolidated.

No requirement may disappear silently during architecture translation.