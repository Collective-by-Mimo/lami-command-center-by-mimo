# 10 — Notification Philosophy

## 1. Purpose

Notifications exist to bring the right information to the right person at the right time with the minimum necessary interruption and disclosure.

A Notification is a communication attempt. A Reminder is the underlying attention requirement. An obligation is not complete because a Notification was sent or acknowledged.

---

## 2. Principles

- Notifications must have a purpose and related object.
- Important reminders must not depend on one invisible delivery attempt.
- Sensitive detail should remain inside the secure product.
- Delivery, acknowledgement, and completion are different states.
- Frequency should reflect consequence, urgency, and user preference.
- Escalation should be explicit and proportionate.

- **NOT-001:** The system must not claim delivery when only sending was attempted.
- **NOT-002:** The system must not repeatedly notify after completion is verified.
- **NOT-003:** Snoozing must not alter the underlying due date.
- **NOT-004:** Missed reminders must remain visible.

---

## 3. Reminder Timing

A reminder schedule may include:

- Awareness reminder: enough time to plan.
- Preparation reminder: enough time to gather information or travel.
- Due reminder: at or near the required action time.
- Grace reminder: after due time where a grace period exists.
- Overdue reminder: when the obligation remains incomplete.
- Escalation reminder: to another authorized person or operator queue.

Timing should consider object type, consequence, user preference, timezone, working hours, and whether the date is confirmed or suggested.

### Default behavior

Defaults may be offered, but no universal timing fits every obligation. A passport renewal may require months of notice; a meeting may require hours; a bill may require days.

Suggested dates must remain distinct from confirmed dates.

---

## 4. Escalation

Escalation means increasing visibility or changing the responsible attention path because the original reminder did not produce the required outcome.

Escalation may occur when:

- A reminder is not acknowledged.
- An obligation becomes overdue.
- A high-risk item remains unresolved.
- Delivery fails.
- The owner is unavailable.
- A client decision blocks consequential work.

Escalation may notify the operator, create a Task, enter the Exceptions Center, or request an alternate channel. It must not broaden sensitive disclosure automatically.

---

## 5. Snoozing

Snoozing postpones the next reminder presentation. It does not:

- Change the underlying due date.
- Mark the obligation complete.
- Cancel escalation permanently.
- Transfer ownership.
- Approve delay where approval is required.

A user should select or state a snooze time. Repeated snoozing of important items may trigger a review rather than endless postponement.

---

## 6. Daily Briefing

The Daily Briefing should summarize:

- Today’s confirmed events.
- Must-do work.
- Overdue items.
- Items waiting for the user.
- Approvals required.
- Upcoming payments.
- Failed notifications or integrations.
- At-risk Cases.
- AI-recommended priorities.

The briefing is a derived view. It must link to authoritative records and label AI recommendations.

Sensitive values should be summarized minimally.

---

## 7. Weekly Briefing

The Weekly Briefing should support planning for the next seven to fourteen days.

It may include:

- Major appointments.
- Upcoming obligations.
- Case milestones.
- Client decisions needed early.
- Provider follow-ups.
- Capacity conflicts.
- Expiring Documents.
- Spending and bill summary.
- Recurring tasks.

AI may propose priorities but must not silently reschedule confirmed commitments.

---

## 8. Missed Reminder Behavior

A reminder is missed when its attention window passes without acknowledgement or required action.

The system should:

1. Preserve the missed state.
2. Check whether the underlying item is already completed.
3. Avoid duplicate external messages.
4. Escalate according to policy.
5. Show the owner and next action.
6. Record acknowledgement or resolution.

A missed Reminder should not be silently deleted when a new reminder is scheduled.

---

## 9. Delivery States

- Draft.
- Awaiting approval.
- Scheduled.
- Sending.
- Sent.
- Delivered where verifiable.
- Read where verifiable and appropriate.
- Acknowledged.
- Failed.
- Cancelled.
- Superseded.

External provider status must be represented accurately. “Sent” is not “delivered”; “delivered” is not “understood”; “acknowledged” is not “completed.”

---

## 10. Channel Selection

Channels may include in-product notification, email, WhatsApp, or future approved methods.

Selection should consider:

- User preference.
- Sensitivity.
- Urgency.
- Delivery reliability.
- Cost.
- Consent.
- Whether acknowledgement is required.

Highly sensitive information should usually generate a minimal prompt directing the user to the secure product.

---

## 11. Notification Approval

Internal low-risk notifications may follow approved rules. External messages require approval unless a precise standing rule covers recipient, purpose, template, schedule, and allowed data.

Materially changed content requires renewed approval.

---

## 12. Notification Completion Conditions

The notification system is correct when users are informed without being overwhelmed, reminder timing is explainable, snoozing preserves truth, missed reminders remain visible, escalation is controlled, sensitive data is minimized, and delivery status is never confused with real-world completion.