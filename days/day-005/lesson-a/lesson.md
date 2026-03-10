## Day 005 — Lesson A (Foundations): Transforming and Filtering Arrays

### Why this matters

Two of the most fundamental operations in data processing are:

1. **Transform every element** — take an array of X and produce an array of Y, where each Y comes from the corresponding X
2. **Keep only matching elements** — take an array and produce a smaller array containing only the elements that meet some condition

These operations are so common that JavaScript has built-in methods for them: `Array.prototype.map` and `Array.prototype.filter`. But before you use the built-in versions, you need to understand what they're actually doing — which means implementing them yourself with a plain loop.

Once you understand the pattern deeply, the built-in methods become obvious shortcuts rather than mysterious incantations.

### The core concept

**Transform (map):** Produce a new array of the same length, where each element is derived from the corresponding element in the original.

```
input:   [1, 2, 3, 4]
rule:    "multiply by 3"
output:  [3, 6, 9, 12]
```

The input and output are the same length. Every element is transformed, none are skipped.

**Filter:** Produce a new array of the same or smaller length, keeping only elements that pass a test.

```
input:   [1, 2, 3, 4, 5, 6]
rule:    "keep only even numbers"
output:  [2, 4, 6]
```

The output is a subset of the input. Elements either pass or don't — nothing is transformed.

**Key principle in both cases:** The original array is never modified. A new array is always built and returned.

### How it works

Let's trace through doubling all numbers in `[1, 2, 3, 4]`:

```
result = []

step 1 — 1: result = [2]      (1 × 2 = 2)
step 2 — 2: result = [2, 4]   (2 × 2 = 4)
step 3 — 3: result = [2, 4, 6] (3 × 2 = 6)
step 4 — 4: result = [2, 4, 6, 8] (4 × 2 = 8)
```

Now filtering even numbers from `[1, 2, 3, 4, 5, 6]`:

```
result = []

step 1 — 1: 1 % 2 === 0? no  → skip
step 2 — 2: 2 % 2 === 0? yes → result = [2]
step 3 — 3: 3 % 2 === 0? no  → skip
step 4 — 4: 4 % 2 === 0? yes → result = [2, 4]
step 5 — 5: 5 % 2 === 0? no  → skip
step 6 — 6: 6 % 2 === 0? yes → result = [2, 4, 6]
```

**Important distinction:**
- In transform, every element contributes exactly one element to the output — the output length always equals the input length.
- In filter, each element either contributes to the output or doesn't — the output can be shorter (even empty).

### Code implementation

```js
function doubleAll(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n * 2);
  }
  return result;
}

console.log(doubleAll([1, 2, 3, 4]));  // [2, 4, 6, 8]
console.log(doubleAll([]));             // []
```

**Breaking it down:**
- `const result = []` — start with an empty array; we'll build into it
- `result.push(n * 2)` — unconditional push: every element becomes an element in the output
- `return result` — return the new array; the original `numbers` is unchanged

```js
function onlyEven(numbers) {
  const result = [];
  for (const n of numbers) {
    if (n % 2 === 0) {
      result.push(n);
    }
  }
  return result;
}

console.log(onlyEven([1, 2, 3, 4, 5, 6]));  // [2, 4, 6]
console.log(onlyEven([1, 3, 5]));            // []
```

**Breaking it down:**
- `if (n % 2 === 0)` — conditional push: we push only when the element passes the test
- Elements that fail the test are simply not pushed — they're silently skipped

**Combining transform and filter:** What if you want to double only the even numbers?

```js
function doubleEvens(numbers) {
  const result = [];
  for (const n of numbers) {
    if (n % 2 === 0) {
      result.push(n * 2);  // filter + transform in one pass
    }
  }
  return result;
}

console.log(doubleEvens([1, 2, 3, 4]));  // [4, 8]
```

Or you could separate the concerns: filter first, then transform:

```js
function doubleEvensClean(numbers) {
  const evens = onlyEven(numbers);       // [2, 4]
  return doubleAll(evens);               // [4, 8]
}
```

The second approach uses two passes but is clearer: each function does one thing. For large arrays, the one-pass version is more efficient. For small arrays, clarity wins.

### Common pitfalls

**1. Pushing the original value instead of the transformed value**

```js
function doubleAllBroken(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n);    // pushes original n, not n*2!
  }
  return result;
}
```

Make sure you push the *computed* value, not the original.

**2. Mutating the input array**

```js
function doubleAllBad(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i] * 2;  // modifies the original!
  }
  return numbers;
}
```

This changes the caller's array. They passed you their data to read, not to modify. Always build a new array.

**3. Confusing transform and filter**

Transform: output has the same number of elements as input.
Filter: output has fewer or equal elements.

If your "transform" function is producing fewer elements, you're accidentally doing a filter. If your "filter" function is changing the values, you're accidentally doing a transform.

**4. Not testing with empty input**

`doubleAll([])` should return `[]`, not crash or return `null`. Our loop simply doesn't run for an empty array, so `result` stays `[]` and gets returned. Verify this for each function you write.

**5. Returning inside the loop (for transforms)**

```js
function doubleAllBroken(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n * 2);
    return result;  // oops — returns after first element!
  }
}
```

`return` inside the loop exits immediately. For transforms, the `return` belongs *outside* the loop, after processing all elements.

### Computer Science foundations

**Time Complexity:** O(n) for both transform and filter.
- We visit each element exactly once.
- Each operation (multiplication, modulo, push) is O(1).
- Total work is proportional to the input size.

**Space Complexity:** O(n) for the result array.
- Transform always creates an array of size n.
- Filter creates an array of size 0 to n, depending on how many elements pass.
- The input array is not modified.

**Why we always build a new array:**
Modifying data in place (mutation) creates shared mutable state, which makes programs harder to reason about. If you pass an array to a function and that function changes it, any other code that holds a reference to that array sees the change unexpectedly. Building a new array avoids this problem.

This principle — prefer pure transformations over mutation — is the foundation of functional programming style, and it's directly applicable to everyday JavaScript.

### Real-world applications

- **Data pipelines**: Take raw API responses, transform them into display-ready formats
- **Search results**: Filter a list of products by price range, category, availability
- **User lists**: Map user objects to display names, filter to only verified users
- **Log processing**: Filter error lines, transform log strings into structured objects
- **React/UI**: Render lists by filtering and transforming data arrays into JSX elements

The `map` and `filter` operations you're learning here are the backbone of data transformation in modern JavaScript. Every time you call `array.map(fn)` or `array.filter(fn)` in a real codebase, you're using what you practiced today.

### Before the exercise

In the exercise file, you'll implement transform and filter functions using plain loops:

1. A function that **transforms** every element — computes a new value for each
2. A function that **filters** elements — keeps only those meeting a condition
3. A function that **combines** both — filters then transforms (or in a single pass)

As you implement:
- Remember: transform is an unconditional push; filter is a conditional push
- Build a new array; never modify the input
- Test with an empty array, an array where all elements pass the filter, and an array where none pass
- Notice how the output length differs between transform (always equal) and filter (often shorter)
