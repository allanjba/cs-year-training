## Day 008 — Lesson B (Applied) review notes

### Core checks

- `totalCredits` / `totalDebits`:
  - Correctly sum only the appropriate transaction types.
  - Handle an empty list by returning 0.
- `buildDailySummary`:
  - Uses the helper functions (doesn’t reimplement the logic).
  - Computes `netBalance` as `credits - debits`.

### Discussion prompts

- How reusable are these helpers if the product team later wants weekly or
  monthly summaries instead of daily?
- Did you keep calculation logic separate from any logging/printing?
- What additional fields might be useful in a real summary (e.g. counts)?

### Real-world tie-in

- This pattern of “compute small aggregates from event/transaction data”
  appears in dashboards, statements, and notifications.
- Being able to cleanly decompose and test this logic is key to building
  trustworthy financial or metrics features.\*\*\*
