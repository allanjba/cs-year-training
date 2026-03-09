## Day 006 — Lesson A (Foundations) review notes

### Key ideas to check

- You can build and read simple **frequency maps** with plain objects.
- You can explain why building the map is \(O(n)\) and lookups are near-\(O(1)\).
- You handled empty strings/arrays sensibly.

### Discussion points

- Did you normalize values (e.g. lowercasing characters) before counting?
- How did you choose default values when a key was not yet present?
- For `mostFrequentValue`, how many times did you scan the data?

### Common improvements

- Use `Object.hasOwn` or `in` checks instead of relying purely on truthiness
  when 0 is a valid count.
- Keep the separation between building the map and using it clear and simple.
- Name your intermediate variables descriptively (`counts`, `freq`, etc.).

### Stretch questions

- How would you adapt `charFrequency` to count **words** instead of characters?
- If you had to answer many different queries about the same data, how could
  precomputing frequency maps help?\*\*\*
