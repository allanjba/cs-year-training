## Day 007 — Lesson A (Foundations) review notes

### Key ideas to check

- You can write and use **simple assertion helpers**.
- You are comfortable creating **test cases** for small functions.
- You are thinking about both typical inputs and edge cases.

### Discussion points

- Did your first implementation of any function fail your own tests?
- How did writing tests change the way you thought about the function design?
- Which edge cases did you remember to cover (empty arrays, all negatives, only empties, etc.)?

### Common improvements

- Keep assertion messages specific so failures are easy to understand.
- Group related tests together to make the file easier to scan.
- Prefer small, composable helpers; avoid mixing “do work” and “print results” in the same function.

### Stretch questions

- How would you extend `assertArrayEqual` to show _where_ arrays differ?
- How might you organize tests if you had dozens of functions?\*\*\*
