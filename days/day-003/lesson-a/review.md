## Day 003 — Lesson A (Foundations) review notes

### Key ideas to check

- You are comfortable writing loops that:
  - Return early when they already know the answer.
  - Still behave correctly for empty arrays.
- You can explain why these functions are \(O(n)\) in the worst case.

### Discussion points

- For `allGreaterThan`, do you agree with returning `true` for an empty array?
  - How would you explain this to someone else?
- Did you keep the logic for "any match" and "all match" clear and symmetric?
- How did you structure your predicates for `anyMatch`?

### Common improvements

- Prefer early returns over complex flags when they clarify the control flow.
- Keep the predicate for `anyMatch` small and focused when you use it.
- Avoid repeating the same condition multiple times; extract helpers if needed.

### Stretch questions

- How would you implement `noneMatch(items, predicate)` using `anyMatch`?
- Could you generalize these patterns into a small utility module for reuse?\*\*\*
