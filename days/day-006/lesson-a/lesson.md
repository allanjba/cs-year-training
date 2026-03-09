## Day 006 — Lesson A (Foundations)

### Objectives

- Introduce **frequency counting** using plain objects (hash-map idea).
- Practice building and reading simple lookup tables.
- Connect this to \(O(n)\) building + near-\(O(1)\) average lookups.

### Concepts for today

- **Frequency maps**:
  - Count how many times each value appears.
  - Represented as `{ value: count }` objects.
- **Two-phase work**:
  - Phase 1: build the frequency map (loop once).
  - Phase 2: use the map to answer questions quickly.

### Reading + examples

```js
function countLetters(text) {
  const counts = {};
  for (const ch of text) {
    if (!counts[ch]) {
      counts[ch] = 0;
    }
    counts[ch]++;
  }
  return counts;
}
```

Questions:

- What does `counts["a"]` mean after running this?
- How many times can the loop run in the worst case?
- How fast is it to check `counts["z"]` afterwards?

### What you’ll implement in the exercise

In the exercise file you will:

- Build frequency maps for:
  - Characters in a string.
  - Values in an array.
- Use those maps to answer questions like:
  - “Which value appears most often?”
  - “How many unique values are there?”

You will continue to write a short **Big-O note** for each function.\*\*\*
