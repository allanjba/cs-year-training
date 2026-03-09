## Day 008 — Lesson A (Foundations)

### Objectives

- Pull together the first week’s skills into a small **mini-synthesis**.
- Combine arrays, objects, conditionals, and frequency counting.
- Practice reading a slightly richer problem and breaking it into helpers.

### Concepts for today

- Decomposing a problem into small, testable functions.
- Reusing patterns:
  - scanning arrays once,
  - filtering,
  - building small summary objects.
- Writing down assumptions and edge cases clearly.

### Reading + examples

We will work with an array of simple **transaction** objects like:

```js
const transactions = [
  { id: 1, type: "credit", amount: 50 },
  { id: 2, type: "debit", amount: 20 },
];
```

Example helpers:

- Compute total credits vs total debits.
- Count how many transactions of each type there are.

Questions:

- How can you split the work into focused helpers?
- What should happen for an empty list?
- How do you avoid mixing “calculation” and “printing” in the same function?

### What you’ll implement in the exercise

In the exercise file you will:

- Implement a few helpers over a `transactions` array:
  - total amount by type,
  - net balance,
  - frequency of transaction types.
- Optionally, add a couple of simple tests or `console.log` checks to validate behavior.\*\*\*
