## Day 002 — Lesson A (Foundations)

### Objectives

- Work confidently with **strings** in JavaScript.
- Practice **conditionals** (`if`, `else`) and boolean expressions.
- Strengthen your intuition for **linear scans** over data (\(O(n)\)).

### Concepts for today

- **Strings as sequences of characters**:
  - Accessing characters with `str[i]`.
  - Common helpers: `.length`, `.toLowerCase()`, `.includes()`, `.trim()`.
- **Conditionals**:
  - `if/else if/else`, comparison operators, combining conditions with `&&` and `||`.
- **Linear scans (\(O(n)\))**:
  - Walk a string once to count or classify characters.

We are still focusing on **clarity** and **edge cases** rather than cleverness.

### Reading + examples

Count vowels in a string:

```js
function countVowels(text) {
  const vowels = "aeiouAEIOU";
  let count = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (vowels.includes(ch)) {
      count++;
    }
  }

  return count;
}
```

Questions:

- What happens for `""` (empty string)?
- How many times can the loop body run?
- Is this safe for `null` or `undefined`? (What would you need to check first?)

### What you’ll implement in the exercise

In the exercise file you will write functions that:

- Check simple string properties (e.g. “is this string longer than N?”).
- Normalize and compare strings (e.g. case-insensitive comparison).
- Walk over every character once to compute something (e.g. count digits).

You will also continue annotating each function with a brief **Big-O note**.\*\*\*
