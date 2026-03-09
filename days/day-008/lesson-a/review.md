## Day 008 — Lesson A (Foundations) review notes

### Key ideas to check

- You can combine arrays, objects, and simple arithmetic in one small problem.
- You are comfortable decomposing a slightly richer problem into helpers.
- You can still explain why your scans are \(O(n)\).

### Discussion points

- Did you reuse earlier patterns (filters, sums, frequencies) instead of
  rewriting everything from scratch?
- How did you handle unknown transaction types (neither credit nor debit)?
- Did you keep calculation logic separate from printing/output?

### Common improvements

- Prefer explicit handling of supported types (e.g. `"credit"`, `"debit"`).
- Consider naming helpers so they read almost like sentences.
- Keep each helper focused; avoid mixing multiple responsibilities.

### Stretch questions

- How would you adapt this to support multi-currency transactions?
- How might you detect suspicious transaction patterns using these helpers?\*\*\*
