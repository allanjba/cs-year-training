## Day 001 — Lesson A (Foundations) review notes

### Key ideas to check

- You can comfortably write small, single-purpose functions.
- You can walk an array with a loop and reason about how many steps that is.
- You can identify obvious edge cases (empty arrays, one element, all negatives).

### Discussion points

- For each function:
  - What did you choose for time complexity and why?
  - Did you ever traverse the array more than once? Could you reduce it to once?
- How did you handle:
  - `sumArray([])`
  - `countOccurrences([], value)`
  - `minAndMax([])` and `minAndMax([5])`

### Common improvements

- Prefer `const` for variables that never get reassigned.
- Keep function names and parameter names descriptive (`numbers`, `items`, `value`).
- Avoid mixing responsibilities: one function should do one clear thing.

### Stretch questions

- How would you change `countOccurrences` to stop early if the count becomes “too large” (e.g. more than 100)?
- How could you extend `minAndMax` to also return the **index** of each extreme?
