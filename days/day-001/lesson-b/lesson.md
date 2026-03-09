## Day 001 — Lesson B (Applied)

### Scenario: Daily sales snapshots

You are working for a small **online shop** that wants a simple way to
inspect yesterday’s sales. They are not ready for a full analytics stack yet;
they just export a list of numbers (order totals) from their payment provider.

Today you will:

- Use your array skills from Lesson A to compute simple metrics.
- Practice turning a rough “business request” into concrete functions.

### Concepts in play

- Translating vague requirements into clear **inputs/outputs**.
- Choosing good function names for business concepts (e.g. `calculateTotalRevenue`).
- Being careful about **edge cases**:
  - No orders.
  - A single large order.
  - Orders with value 0 (e.g. full discounts).

### What you’ll implement in the exercise

- Functions that:
  - Compute total revenue for the day.
  - Count how many orders are “large” (above some threshold).
  - Derive a simple average order value.
- Simple manual checks (via `console.log`) so you can see the outputs.
