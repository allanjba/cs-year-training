## Day 003 — Lesson B (Applied) review notes

### Core checks

- `isErrorLog`:
  - Handles null/undefined safely.
  - Performs case-insensitive checks for "error" and "failed".
- `hasAnyErrors` / `allLogsHealthy`:
  - Correctly delegate to `isErrorLog`.
  - Return sensible values for empty arrays.

### Discussion prompts

- How could you extend the logic to treat some errors as less severe than others?
- If logs were very large strings, would your approach change?
- How might you factor this code if you later wanted to parse log levels (`INFO`, `WARN`, `ERROR`) explicitly?

### Real-world tie-in

- Log scanning is a common pattern in reliability and observability work.
- These same patterns show up later in:
  - health checks,
  - alerting rules,
  - basic anomaly detection scripts.
