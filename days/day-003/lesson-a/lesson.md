## Day 003 — Lesson A (Foundations)

### Objectives

- Deepen your understanding of **arrays + loops**.
- Practice **searching** for values and checking simple conditions over arrays.
- Keep building your intuition for **linear time** work (\(O(n)\)).

### Concepts for today

- **Array inspection patterns**:
  - “Does this array contain X?” → boolean search.
  - “Does every element satisfy condition C?”.
  - “Does at least one element satisfy condition C?”.
- **Loop control**:
  - Early return / early `break` once you have an answer.
  - Why early exit still counts as \(O(n)\) in the worst case.

### Reading + examples

Check if an array contains a value:

```js
function contains(items, target) {
  for (const item of items) {
    if (item === target) {
      return true; // early exit
    }
  }
  return false;
}
```

Check if all numbers are positive:

```js
function allPositive(numbers) {
  for (const n of numbers) {
    if (n <= 0) {
      return false;
    }
  }
  return true;
}
```

Questions:

- What are the **best case** and **worst case** numbers of loop iterations?
- Why do we still call this \(O(n)\) even with early returns?
- How would you adapt these to check other conditions?

### What you’ll implement in the exercise

In the exercise file you will:

- Implement small helper functions that:
  - Check existence of a value.
  - Check whether **all** items satisfy a condition.
  - Check whether **any** item satisfies a condition.
- Continue writing a one-line **Big-O note** for each function.\*\*\*
