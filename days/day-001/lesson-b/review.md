## Day 001 — Lesson B (Applied) review notes

### Core checks

- `calculateTotalRevenue`:
  - Returns 0 for an empty array.
  - Correctly adds all numbers without mutating the input.
- `countLargeOrders`:
  - Uses `>` (strictly greater than) and matches the requirement.
  - Handles thresholds larger than any order.
- `calculateAverageOrderValue`:
  - Returns 0 (not `NaN`) when there are no orders.
  - Uses total / count with the correct types.

### Discussion prompts

- How did you decide on function and parameter names?
- Where did you reuse ideas or patterns from Lesson A?
- If the business later wanted to:
  - Exclude refunded orders,
  - Or group by country,
  - How would you extend your functions or data structures?

### Real-world tie-in

- This kind of “small metric computation” is everywhere in backend and analytics work.
- Getting fast at mapping business concepts to clean, testable functions will pay off
  in larger systems (services, reporting jobs, dashboards) later in the curriculum.
