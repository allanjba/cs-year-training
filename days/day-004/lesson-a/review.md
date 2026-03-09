## Day 004 — Lesson A (Foundations) review notes

### Key ideas to check

- You are comfortable reading and writing **plain objects**.
- You can loop over **arrays of objects** and access properties reliably.
- You can explain why these operations are \(O(n)\) with respect to the number of users.

### Discussion points

- How did you handle missing fields (e.g. `firstName` or `age`)?
- Did your helpers (`getFullName`, `listFullNames`, `getAdultUsers`, `findUserById`)
  have clear, single responsibilities?
- For `findUserById`, what is the worst-case number of checks?

### Common improvements

- Prefer returning `null` or `undefined` consistently when something isn’t found.
- Avoid mutating the original `users` array when filtering.
- Keep naming explicit so it’s obvious what each helper does at a glance.

### Stretch questions

- How would your approach change if `id` values were not unique?
- How might you structure this code if the user objects became much larger?***
