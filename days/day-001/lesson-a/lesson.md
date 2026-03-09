## Day 001 — Lesson A (Foundations)

### Objectives

- Get comfortable writing and running small JavaScript functions.
- Start thinking in terms of **inputs → outputs** and **time complexity**.
- Practice reading simple problem statements and turning them into code.

### Concepts for today

- **Values & variables**: `const` vs `let`, primitive types (number, string, boolean), arrays.
- **Functions**: parameters, return values, avoiding unnecessary mutation.
- **Loops**: `for` and `for...of` for walking arrays.
- **Big-O intuition (informal)**:
  - \\(O(1)\\): work does not grow with input size (e.g. returning a constant).
  - \\(O(n)\\): work grows linearly with number of items (one pass over an array).

We are not aiming for formal proofs yet. The goal is to start **noticing** how many times your code touches each element.

### Reading + examples

- A small, pure function:

```js
function isEven(n) {
  return n % 2 === 0;
}
```

- A function that walks an array once (\\(O(n)\\)):

```js
function countPositives(numbers) {
  let count = 0;
  for (const n of numbers) {
    if (n > 0) count++;
  }
  return count;
}
```

Questions to ask yourself:

- What are the **inputs** and **outputs**?
- Does this function **change** its input (mutate), or just **read** and produce a new value?
- How many times could that loop body run in the worst case?

### What you’ll implement in the exercise

In the exercise file you will:

- Implement a few **single-pass array functions** (sum, min/max, counting occurrences).
- For each function, write down a **short note** about its time complexity.
- Think about obvious **edge cases** (empty array, single element, negative numbers).
