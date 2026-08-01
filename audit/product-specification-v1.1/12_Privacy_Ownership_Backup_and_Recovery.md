# 12 — Privacy, Ownership, Backup, and Recovery

## 1. Purpose

This chapter defines product expectations for personal-data ownership, privacy controls, retention, export, backup, restoration, and recovery.

---

## 2. Data Ownership

The Client retains authority over their personal information. The Operator manages information for approved concierge purposes. The product service may process information but does not become the personal owner of the facts it stores.

Users should be able to understand:

- What is stored.
- Why it is stored.
- Who can see it.
- Where it came from.
- Whether AI processed it.
- How it may be corrected.
- How long it is retained.
- How it may be exported or deleted where applicable.

---

## 3. Privacy by Purpose

Access should depend on purpose, not convenience.

A Provider receiving an address for an approved service does not gain access to other Property, Client, or Finance records.

AI answering a Calendar question does not need unrestricted Life Hub access.

- **PRIV-001:** Access must be limited to the minimum information required.
- **PRIV-002:** Derived summaries must not broaden access beyond source permissions.
- **PRIV-003:** Search and AI retrieval must enforce visibility before content is returned.

---

## 4. Retention

Retention should consider operational need, user preference, legal obligations where applicable, audit value, sensitivity, and recovery need.

Records may be active, historical, archived, deletion pending, or permanently deleted according to approved policy.

Temporary Notes, raw AI context, failed drafts, and duplicate captures should not be retained indefinitely without purpose.

---

## 5. Export

Export should preserve useful structure, provenance, relationships, and verification state where practical.

Sensitive exports require explicit confirmation and should explain scope. Export is not complete until the file is generated and accessible; safe handling after export remains the user’s responsibility.

---

## 6. Backup

Backups should include authoritative objects, relationships, Documents, audit history, visibility metadata, and configuration required for recovery.

Backup requirements include:

- Defined scope.
- Scheduled frequency.
- Retention policy.
- Protection appropriate to sensitivity.
- Failure alerting.
- Restore testing.
- Recorded last successful verified restore test.

A synchronization service is not automatically a backup.

---

## 7. Recovery Objectives

Architecture planning must later define acceptable data-loss and recovery-time objectives. Product design must identify which records are critical:

- Identity and emergency records.
- Active Cases and Tasks.
- Approvals.
- Finance obligations.
- Documents.
- Audit history.
- Client preferences.

No specific technology is selected here.

---

## 8. Restore

Restore should support controlled recovery rather than blind overwrite.

The user should know:

- Backup date.
- Scope.
- Records affected.
- Conflicts with current data.
- Whether restore is full or selective.
- Whether current state is preserved for rollback.

Restored records should retain provenance indicating restoration source.

---

## 9. Mistake Recovery

Recovery after human, AI, automation, import, or integration error should preserve evidence and avoid compounding damage.

The system should support version history or equivalent recovery for important records, recoverable deletion where practical, conflict review, and dependent-object identification.

---

## 10. Access Revocation

When access is revoked, future access must stop according to policy. Revocation does not make previously disclosed external information disappear.

The product should identify outstanding delegated tasks, shared Documents, active sessions or integrations, and external disclosures requiring follow-up.

---

## 11. Privacy Completion Conditions

This chapter is satisfied when ownership is understandable, access is purpose-limited, retention is deliberate, export is controlled, backup is verifiable, restore is testable, recovery preserves history, and revocation consequences are visible.