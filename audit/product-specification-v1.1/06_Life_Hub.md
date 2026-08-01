# 06 — Life Hub

## 1. Purpose

Life Hub is the secure personal-information domain of the LaMi Personal Concierge Operating System. It organizes information repeatedly required to coordinate personal, household, travel, identity, financial, medical, emergency, asset, and service activities.

Life Hub shall reduce repeated requests for the same information while preserving privacy, human authority, provenance, and minimum-necessary access.

It is not a password manager, bank, medical authority, legal authority, or unrestricted personal-data warehouse.

---

## 2. Core Rules

- **LIFE-001:** Every sensitive value must have a defined purpose.
- **LIFE-002:** Collection should be limited to information needed for approved concierge operations.
- **LIFE-003:** Sensitive values must carry provenance and verification state.
- **LIFE-004:** AI must not invent or complete sensitive values from patterns.
- **LIFE-005:** AI-generated extraction must remain separate from verified values until confirmed.
- **LIFE-006:** Access must be based on user role, relationship, record visibility, sensitivity, and operational need.
- **LIFE-007:** Full secret values must not appear in general search, notification, briefing, analytics, or logs.
- **LIFE-008:** Important access and changes should be auditable.
- **LIFE-009:** A record may be expired without being historically invalid.
- **LIFE-010:** Deletion must be explicit and recoverable where practical.

---

## 3. Common Record Model

Each Life Hub record should support:

- Category and subtype.
- Subject Person, Client, Asset, or account.
- Human-readable label.
- Issuer or provider.
- Reference or masked identifier.
- Issue, start, expiry, review, and renewal dates.
- Jurisdiction or location where relevant.
- Verification state.
- Provenance.
- Sensitivity classification.
- Visibility.
- Supporting Documents.
- Related Contacts, Providers, Assets, Bills, Cases, Tasks, Events, Reminders, and Knowledge.
- Record owner.
- Last reviewed time.
- Superseded-record link.
- Activity history.

### Lifecycle

- Draft.
- Awaiting verification.
- Active.
- Expiring.
- Expired.
- Superseded.
- Disputed.
- Archived.
- Restricted.
- Deletion pending.

---

## 4. Identity

Identity records support operational verification, travel, renewals, applications, insurance, vehicle use, and government processes.

### Supported identity types

- Passport.
- Emirates ID.
- National ID.
- Driving Licence.
- Residence Permit.
- Visa.
- Insurance Card.

### Information handling

The product may organize name as printed, document type, issuer, nationality or jurisdiction where necessary, issue and expiry dates, masked document number, status, and document image.

Full identifiers should be concealed by default and revealed only to authorized users for an approved purpose.

### Verification

Identity data should be verified against the source document or an authorized human confirmation. OCR is extraction, not verification.

### Relationships

Identity records may connect to Travel, Person, Client, Vehicle, Medical Insurance, Calendar Events, renewal Reminders, Cases, and Documents.

### Recovery

If AI extraction is wrong, the source remains unchanged, the extracted value is corrected, dependent drafts are reviewed, and the correction is logged.

---

## 5. Personal Accounts

Personal Accounts organize the existence, ownership, recovery, and operational context of digital accounts.

### Supported information

- Email accounts.
- Usernames.
- Password references.
- MFA method references.
- Security-question references.
- Recovery emails.
- Recovery phones.

### Mandatory boundary

LaMi is not a password manager. Ordinary account records should prefer references to an approved secure credential location rather than raw passwords, MFA seeds, recovery codes, or security answers.

A Password Reference may identify:

- Account purpose.
- Username.
- Secure-vault location or reference.
- Recovery method.
- Last verification or rotation date.
- Responsible Person.

It should not expose the secret itself.

### AI restrictions

AI must not receive, summarize, reproduce, infer, or retain raw secrets by default. Secret-looking content in capture should be flagged for secure handling rather than added to general Knowledge.

---

## 6. Financial Accounts

Life Hub may organize references for:

- Bank accounts.
- Cards.
- Investments.
- Loans.
- Mortgages.
- Digital wallets.

The purpose is coordination—not account operation.

### Minimum-necessary principle

Records should generally use provider, account type, masked identifier, ownership, purpose, portal shortcut, relevant Contacts, renewal/review date, and related Documents.

Full account and card numbers should not be displayed broadly. Security codes, PINs, and authentication secrets must not be stored as ordinary fields.

### Relationships

Financial Accounts may connect to Bills, recurring obligations, payment shortcuts, Documents, Providers, investment summaries, Loan records, and Finance reports.

### Prohibited behavior

Life Hub must not imply real-time balance accuracy unless a trusted integration confirms it. It must not move money, approve payment, or infer payment completion.

---

## 7. Contracts

Supported contract categories include:

- Employment.
- Rental.
- Property.
- Service contracts.

A Contract record may include parties, purpose, effective date, end date, renewal terms, notice period, related Property or Asset, payment obligations, supporting Document, and responsible Contact.

AI may summarize a contract for operational convenience but must identify the summary as non-authoritative and link to the original document. The system must not present AI summaries as legal advice.

Contract dates may generate proposed Calendar Events, Tasks, Bills, Reminders, or Cases after human review.

---

## 8. Household

Household records coordinate recurring services and obligations for Properties.

### Categories

- Electricity and water, including DEWA where applicable.
- Internet.
- Phone.
- Gas.
- Community fees.
- Other approved utilities and household services.

A Household service record may contain provider, service address, account reference, billing cycle, recurring obligation, portal shortcut, support Contact, service status, and related Property.

AI may detect unusual bill changes but must not invent expected amounts.

---

## 9. Medical

Medical information may include:

- Doctors.
- Medical insurance.
- Medications.
- Allergies.
- Blood type where supplied.
- Relevant medical Contacts and Documents.

### Safety boundary

LaMi is not a medical record, diagnostic system, prescribing system, or emergency-response service.

Medical information must be human supplied or verified. AI must never infer diagnoses, allergies, medication, dosage, blood type, or emergency instructions.

Medication reminders may be supported only as reminders based on approved human-entered instructions. The product must not adjust dosage or treatment.

Medical visibility should be highly restricted. Notification content should avoid revealing sensitive medical detail when a secure prompt is sufficient.

---

## 10. Emergency

Emergency records may include:

- Trusted emergency Contacts.
- Doctors.
- Medical insurance reference.
- Human-verified medications and allergies.
- Blood type.
- Important Locations.
- Emergency procedures supplied by an authorized human.

Emergency information should be available through an intentionally designed emergency-access experience. Access must be logged where practical.

AI must not create emergency procedures independently. It may organize an approved procedure without changing its meaning.

---

## 11. Travel

Travel information may include:

- Passport and visa relationships.
- Itineraries.
- Flights and accommodation.
- Travel insurance.
- Important Contacts and Locations.
- Required Documents.
- Calendar Events.
- Checklists and Cases.
- Expiry or entry requirements supplied by verified sources.

Travel requirements are time-sensitive and jurisdiction-sensitive. AI recommendations must identify source and date and should request verification where rules may change.

---

## 12. Memberships and Subscriptions

Membership and Subscription records may include provider, plan, purpose, renewal date, cost, payment method reference, cancellation terms, portal shortcut, Documents, and usage notes.

The system may propose renewal or cancellation reviews. It must not cancel automatically without approval.

Recurring charges should connect to Finance. Cancellation confirmation should be recorded separately from a cancellation request.

---

## 13. Warranties

Warranty records may include covered Asset, provider or manufacturer, start and expiry dates, coverage summary, exclusions reference, proof of purchase, claim process, and related Documents.

AI may extract dates and summarize coverage, but the source document remains authoritative.

Warranties may generate expiry Reminders and support repair Cases.

---

## 14. Devices

Device records may include type, manufacturer, model, serial identifier, owner, assigned Person, purchase information, warranty, software licences, service history, and relevant Documents.

Sensitive access credentials must not be stored as ordinary Device notes.

Devices may connect to Tasks, Cases, Providers, Warranties, Subscriptions, Bills, and Knowledge procedures.

---

## 15. Software Licences

Software Licence records may include product, provider, licence owner, subscription or perpetual status, renewal date, device association, seat count, support contact, and secure licence-key reference.

Full licence keys should be concealed and excluded from AI context unless specifically required and authorized.

---

## 16. Important Locations

Important Locations may include homes, offices, service locations, storage, medical facilities, meeting points, and approved travel locations.

A Location should distinguish public address information from sensitive access instructions. Alarm codes, access codes, and security procedures must not be general Location fields.

Locations may connect to Properties, Persons, Cases, Events, Providers, Assets, and emergency procedures.

---

## 17. Trusted Contacts

Trusted Contact is a relationship between a Person and Client, not a duplicate Contact type.

The relationship should define:

- Purpose.
- Scope of trust.
- Information that may be shared.
- Actions the Contact may approve, if any.
- Effective and expiry dates.
- Verification.
- Revocation.

The system must not infer broad authority from the label “trusted.” Authority must be explicit.

---

## 18. Search, AI, and Notifications

Search must mask sensitive values and respect object-level access. AI responses should use the minimum information necessary.

Examples:

- Appropriate: “The passport expires in 45 days.”
- Inappropriate for a general briefing: reproducing the full passport number.

Notifications should direct the user to Life Hub rather than include full sensitive information.

---

## 19. Life Hub Completion Conditions

Life Hub is correct when users can find important information quickly without turning the product into an unrestricted secret store; every value has provenance; sensitive access is controlled; expiry and operational relationships are visible; AI cannot silently establish facts; and correction, supersession, archive, export, and recovery behavior are defined.