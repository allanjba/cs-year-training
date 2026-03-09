## Day 005 — Lesson A (Foundations)

### Objectives

- Introduce **array transformations**: building new arrays from old ones.
- Practice the core ideas behind **map** and **filter** using plain loops.
- Keep applying \(O(n)\) reasoning and edge-case thinking.

### Concepts for today

- **Transform vs filter**:
  - Transform (map): same number of items, but values changed.
  - Filter: fewer or equal items, only those that match a condition.
- **Immutability (lightweight)**:
  - Prefer building a **new** array instead of mutating the original.
  - Avoid surprising callers by changing their data.

### Reading + examples

```js
function doubleAll(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n * 2);
  }
  return result;
}

function onlyEven(numbers) {
  const result = [];
  for (const n of numbers) {
    if (n % 2 === 0) {
      result.push(n);
    }
  }
  return result;
}
```

Questions:

- Does `doubleAll` ever change the original array?
- How many times can each loop run in the worst case?
- What happens for `[]` (empty input)?

### What you’ll implement in the exercise

In the exercise file you will:

- Write your own small “map” and “filter” style helpers using loops.
- Combine them with previous skills (strings, objects).
- Continue annotating each function with a one-line **Big-O note**.\*\*\*
