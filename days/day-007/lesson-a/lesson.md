## Day 007 — Lesson A (Foundations)

### Objectives

- Introduce a **tiny testing mindset** with simple assertion helpers.
- Practice writing **small, pure functions** and checking them with test cases.
- Keep thinking about inputs, outputs, and edge cases.

### Concepts for today

- **Assertions**:
  - A check that should always be true if your code is correct.
  - When it fails, it tells you something is wrong (bug or wrong assumption).
- **Test cases**:
  - Example inputs + expected outputs.
  - Cover typical cases and edge cases (empty arrays, boundaries, etc.).

We are not using a real test framework yet—just small helper functions and `console.log`.

### Reading + examples

```js
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.log("FAIL:", message, "expected:", expected, "got:", actual);
  } else {
    console.log("PASS:", message);
  }
}

function maxOfTwo(a, b) {
  return a >= b ? a : b;
}

assertEqual(maxOfTwo(3, 5), 5, "maxOfTwo basic case");
assertEqual(maxOfTwo(5, 5), 5, "maxOfTwo equal numbers");
```

Questions:

- What happens if you accidentally implement `maxOfTwo` incorrectly?
- Which edge cases are worth testing?
- How does this help you trust your code as it grows?

### What you’ll implement in the exercise

In the exercise file you will:

- Implement very small assertion helpers.
- Write a couple of simple functions and a handful of test cases for each.
- Practice thinking “what else could go wrong here?” before moving on.\*\*\*
