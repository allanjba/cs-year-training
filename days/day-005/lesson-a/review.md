## Day 005 — Lesson A (Foundations) review notes

### Key ideas to check

- You can implement simple **transform** and **filter** operations with loops.
- You understand that these helpers are \(O(n)\) in the number of items.
- You avoided mutating the original arrays.

### Discussion points

- Did you clearly separate transform vs filter responsibilities?
- How did you handle empty arrays in each function?
- Did you rely on any built-in helpers, or did you keep the loops explicit?

### Common improvements

- Ensure you always return a **new** array from your helpers.
- Keep naming specific: `filterLongWords` vs something vague like `process`.
- Avoid duplicating similar loop logic; consider small shared helpers where it makes sense.

### Stretch questions

- How would you implement a generic `map` function that takes an array and a callback?
- How about a generic `filter` function? How close can you get to the built-ins?\*\*\*
