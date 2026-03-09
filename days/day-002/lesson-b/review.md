## Day 002 — Lesson B (Applied) review notes

### Core checks

- `isUrgentSubject`:
  - Handles null/undefined safely.
  - Uses case-insensitive checks correctly.
  - Aligns with the three business rules given.
- `countUrgentSubjects`:
  - Loops over the list once.
  - Delegates the actual decision to `isUrgentSubject`.

### Discussion prompts

- If the product team changed the rules (e.g. "urgent" in subject OR body),
  how easy would your code be to extend?
- Did you keep the rules in one place, or spread across multiple functions?
- How would you unit test this behavior if you had a test framework?

### Real-world tie-in

- This kind of string-based classification shows up in:
  - log filtering,
  - alert rules,
  - basic spam/priority filters.
- Being precise about conditions and edge cases is exactly what prevents
  noisy alerts or missed true urgents in real systems.
