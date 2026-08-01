# 07 — Finance Operations Center

## 1. Purpose

The Finance Operations Center coordinates personal financial obligations, spending awareness, receipts, approvals, and historical reporting.

It is operational, not custodial. It does not move money, approve payments, provide investment advice, replace accounting records, or guarantee external balances.

---

## 2. Core Principles

- Human-confirmed financial information is authoritative.
- Original bills, receipts, statements, and confirmations remain source evidence.
- AI extraction is provisional.
- Payment intent, payment attempt, and verified payment are different states.
- Manual override is allowed but logged.
- Financial reports are derived views, not independent records.

- **FIN-001:** AI must never invent an amount, currency, merchant, due date, balance, return, category, or payment state.
- **FIN-002:** The system must never approve or initiate movement of money.
- **FIN-003:** Payment links and shortcuts must not imply payment completion.
- **FIN-004:** Human-verified financial values must not be silently overwritten.

---

## 3. Monthly Dashboard

The monthly dashboard should provide:

- Confirmed spending this month.
- Pending or unverified transactions.
- Upcoming payments.
- Overdue obligations.
- Spending by category.
- Comparison with previous month.
- Recurring obligations.
- Missing receipts.
- Items awaiting approval.
- Anomalies requiring review.
- Payment history.

Every number should identify whether it is confirmed, estimated, imported, incomplete, or affected by missing data.

---

## 4. Category Dashboard

Categories support operational understanding, not formal accounting classification unless separately approved.

A category may have:

- Name.
- Parent category.
- Description.
- Human verification status.
- Budget or guidance amount.
- Related providers, assets, or properties.
- Historical totals.

AI may suggest categories based on source evidence and prior accepted patterns. A human correction must be retained and should influence future suggestions without rewriting history.

---

## 5. Spending Trends

Trend views may show:

- Monthly comparison.
- Yearly comparison.
- Category movement.
- Recurring versus non-recurring spending.
- Provider-level change.
- Property or Asset-related spending.
- Missing-data warnings.

Trend interpretation must distinguish arithmetic fact from AI explanation.

Example:

- Fact: utility spending increased 18% compared with the prior month.
- Suggestion: review whether seasonal use or tariff changes explain the increase.

AI must not state a cause without evidence.

---

## 6. Bills and Upcoming Obligations

A Bill should track provider, amount, currency, dates, category, recurrence, responsibility, approval requirement, source Document, payment status, and evidence.

Upcoming obligations should include confirmed bills and expected recurring obligations. Expected values must be labeled when the exact bill has not yet arrived.

### Obligation states

- Expected.
- Received.
- Awaiting verification.
- Confirmed.
- Awaiting approval.
- Due.
- Overdue.
- Payment reported.
- Awaiting payment verification.
- Paid and verified.
- Disputed.
- Cancelled.

---

## 7. Recurring Obligations

Recurring obligations may include utilities, rent, loans, subscriptions, community fees, insurance, memberships, and services.

A recurring rule should define:

- Frequency.
- Expected date or window.
- Expected or variable amount state.
- Responsible Person.
- Approval requirement.
- Reminder schedule.
- Source Contract or service record.
- End or review date.

The rule may create an expected obligation but must not fabricate the final bill.

---

## 8. Investment Tracking

Investment tracking is informational and may organize:

- Provider or platform.
- Account reference.
- Asset class.
- Human-entered or imported valuation.
- Valuation date.
- Contributions and withdrawals where verified.
- Supporting Documents.
- Review reminders.

The system must clearly show valuation date and source. It must not represent stale values as current, predict returns as facts, recommend trades as authoritative advice, or initiate transactions.

---

## 9. Loans

Loan records may include lender, principal reference, payment schedule, rate information as supplied, next due date, remaining term, portal shortcut, Documents, and related Property, Vehicle, or Asset.

Calculations must identify assumptions and source fields. AI must not invent interest rates, balances, or amortization facts.

---

## 10. Receipts

Receipts provide evidence of purchase or payment.

Receipt processing may extract provider, date, amount, tax, category, payment method reference, and related Asset or Case.

Critical extracted fields require review based on confidence. The original Receipt Document remains authoritative.

Missing-receipt detection may identify confirmed transactions without evidence. It must not claim a receipt is legally required unless an approved rule says so.

---

## 11. Payment Reminders

Payment reminders should be based on confirmed due dates or explicitly labeled expected dates.

A typical sequence may be:

- Early awareness.
- Upcoming due reminder.
- Due-date reminder.
- Overdue alert.
- Escalation to operator.

Timing must be configurable by obligation type and user preference. Reminder delivery does not prove payment.

---

## 12. Approval Workflow

Payment-related approval must identify:

- Obligation.
- Provider.
- Amount and currency.
- Due date.
- Source Bill.
- Reason.
- Payment method reference, if relevant.
- Consequence of delay.
- Proposed action.

Approval states:

- Not required.
- Required.
- Requested.
- Clarification requested.
- Approved.
- Approved with conditions.
- Rejected.
- Expired.
- Superseded.

### FIN-005 — Material change

A material change to amount, provider, destination, currency, or purpose invalidates prior approval and requires renewed approval.

### FIN-006 — Approval is not payment

Approval must not mark an obligation paid.

---

## 13. Payment Links and External Shortcuts

A payment shortcut may open an approved external portal.

The product must display:

- Destination identity.
- Related obligation.
- Whether the link is user-supplied, provider-supplied, or verified.
- Last review date where appropriate.

The product must not automatically populate sensitive credentials into untrusted destinations.

Opening a link changes no payment status. Payment requires separate evidence or confirmation.

---

## 14. Historical Reports

Reports may cover:

- Monthly spending.
- Yearly spending.
- Category totals.
- Provider totals.
- Property or Asset costs.
- Recurring commitments.
- Payment timeliness.
- Missing receipts.
- Approval history.

Reports must be reproducible from authoritative records and disclose excluded, missing, disputed, or unverified data.

---

## 15. AI Anomaly Detection

AI or deterministic analysis may flag:

- Unusual amount compared with history.
- Duplicate bill or receipt.
- Unexpected category change.
- New provider.
- Missing recurring bill.
- Repeated late payment.
- Amount inconsistent with source.
- Payment reported without receipt or confirmation.

An anomaly is a review signal, not proof of error or fraud.

The system should explain the comparison used, such as “42% higher than the previous three confirmed bills.”

---

## 16. Budget Summaries

Budgets may be guidance limits, targets, or planning assumptions.

The dashboard must distinguish:

- Approved budget.
- Suggested budget.
- Historical average.
- Forecast.
- Actual confirmed spending.

AI may draft a summary but must not silently change budget values.

---

## 17. Reconciliation

Reconciliation compares records that may represent the same financial event.

Potential sources include Bill, transaction, receipt, payment confirmation, statement, and external import.

Reconciliation states:

- Unmatched.
- Candidate match.
- Partially matched.
- Matched and verified.
- Conflict.
- Duplicate.
- Intentionally separate.

AI may suggest matches. Material conflicts require human review.

---

## 18. Manual Override

Authorized users may correct category, description, relationship, due date, amount, status, or reconciliation state.

The override must preserve previous value, actor, time, reason for sensitive changes, source evidence, and dependent records requiring review.

Manual override cannot make unsupported information true. For example, it can record a human assertion that payment occurred, but the system should still distinguish human-confirmed from independently evidenced payment where relevant.

---

## 19. Exception Handling

Exceptions include:

- Missing amount or currency.
- Conflicting due dates.
- Duplicate obligations.
- Unknown provider.
- Failed import.
- Missing receipt.
- Approval expired.
- Payment reported but unverified.
- External portal unavailable.
- Report totals affected by missing data.

Exceptions must remain visible until resolved, accepted, or explicitly dismissed with reason.

---

## 20. Audit Trail

Consequential financial activity should record source, extraction, human edits, approval, status changes, external navigation or attempt where appropriate, evidence, reconciliation, and verification.

Sensitive financial data should be masked in logs.

---

## 21. Finance Completion Conditions

The Finance Operations Center is correct when it provides useful awareness without implying banking authority; every important amount has provenance; expected and confirmed obligations are distinct; approval and payment are distinct; reports disclose uncertainty; AI anomalies are explainable; and manual correction preserves history.