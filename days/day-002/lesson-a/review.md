## Day 002 — Lesson A (Foundations) review notes

### Key ideas to check

- Comfort with basic string operations: `.length`, indexing, `.toLowerCase()`, `.includes()`.
- Correct, readable use of `if/else` and boolean expressions.
- Linear scan thinking: you know when you are visiting each character once.

### Discussion points

- Did you handle `null` / `undefined` safely where required?
- How did you decide what counts as an “edge case” for these functions?
- Where did you choose to normalize input (e.g. lowercasing once up front vs many times)?

### Common improvements

- Avoid deeply nested `if` statements when a simple early return is clearer.
- Keep function responsibilities focused: one function per decision / computation.
- Prefer strict comparisons (`===`) over `==`.

### Stretch questions

- How would you extend `countDigits` to also count letters separately from other characters?
- If you had to call `areEqualIgnoreCase` thousands of times with the same `a` but different `b` values,
  how might you optimize that usage?\*\*\*
