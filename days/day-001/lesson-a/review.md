## Day 001 — Lesson A Review: Pure Functions and Array Scanning

### What you should have learned

1. **Pure functions**: A function that takes inputs, returns an output, and causes no side effects. Same inputs always produce the same output.
2. **Linear scanning**: Walking an array once with a loop, maintaining state (an accumulator) as you go.
3. **O(n) complexity**: Work that grows proportionally with input size — touching each element once.
4. **O(1) space**: Using a fixed number of variables regardless of input size.
5. **Edge case thinking**: Empty arrays, single elements, and negative numbers must be handled explicitly.

### Reviewing your implementation

#### Function 1: `sumArray(numbers)`

```js
function sumArray(numbers) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum;
}
```

**Key insights:**
- `let sum = 0` is the accumulator — the "memory" of everything seen so far
- `sum += n` is the accumulation step — incorporates the current element
- The `return` is outside the loop — you must visit every element before you have the final answer

**Edge cases handled:**
- `sumArray([])` → `0`: loop never runs, initialized value is returned; correct because the sum of zero things is zero
- `sumArray([-1, 1])` → `0`: negatives work correctly; subtraction is just accumulating a negative
- `sumArray([0, 0])` → `0`: zeros contribute nothing, result stays 0

**Time complexity:** O(n) — one pass
**Space complexity:** O(1) — only `sum` variable

---

#### Function 2: `countOccurrences(items, value)`

```js
function countOccurrences(items, value) {
  let count = 0;
  for (const item of items) {
    if (item === value) {
      count++;
    }
  }
  return count;
}
```

**Key insights:**
- `===` (strict equality) checks both value and type — `countOccurrences([1, 2], "1")` correctly returns 0
- Unlike `sumArray`, this has a conditional inside the loop — not every element contributes to the count
- Early exit is not helpful here: even if you've found one match, there may be more

**Edge cases handled:**
- `countOccurrences([], "x")` → `0`: loop never runs
- `countOccurrences([1, 1, 1], 1)` → `3`: counts all occurrences, not just the first
- `countOccurrences([1], 2)` → `0`: value absent, returns 0

---

#### Function 3: `minAndMax(numbers)`

```js
function minAndMax(numbers) {
  if (numbers.length === 0) return null;

  let min = numbers[0];
  let max = numbers[0];

  for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
  }

  return { min, max };
}
```

**Key insights:**
- **Seed with the first element**, not `Infinity`/`-Infinity` — guarantees a real value in the result even with extreme numbers
- Two comparisons per element, but still O(n) — constants don't change Big-O classification
- `{ min, max }` is shorthand for `{ min: min, max: max }` — property name shorthand

**Edge cases handled:**
- `minAndMax([])` → `null`: explicit guard before accessing `numbers[0]`
- `minAndMax([5])` → `{ min: 5, max: 5 }`: single element is both min and max
- `minAndMax([-10, -1])` → `{ min: -10, max: -1 }`: works correctly for all-negative arrays
- `minAndMax([3, 3, 3])` → `{ min: 3, max: 3 }`: ties handled correctly

### Going deeper

#### Extension 1: Find min and max in one pass with indices

What if you need to know *where* the extremes are, not just what they are?

```js
function minAndMaxWithIndex(numbers) {
  if (numbers.length === 0) return null;

  let minIdx = 0;
  let maxIdx = 0;

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < numbers[minIdx]) minIdx = i;
    if (numbers[i] > numbers[maxIdx]) maxIdx = i;
  }

  return {
    min: numbers[minIdx], minIndex: minIdx,
    max: numbers[maxIdx], maxIndex: maxIdx,
  };
}

console.log(minAndMaxWithIndex([3, 1, 4, 1, 5]));
// { min: 1, minIndex: 1, max: 5, maxIndex: 4 }
```

Note: starts the loop at index 1 because we've already seeded with index 0.

#### Extension 2: Combine sum, count, min, and max in a single pass

Four metrics, one pass:

```js
function summarize(numbers) {
  if (numbers.length === 0) return null;

  let sum = 0;
  let min = numbers[0];
  let max = numbers[0];

  for (const n of numbers) {
    sum += n;
    if (n < min) min = n;
    if (n > max) max = n;
  }

  return {
    sum,
    count: numbers.length,
    average: sum / numbers.length,
    min,
    max,
  };
}
```

This is more efficient than calling five separate functions — each of which would be its own O(n) pass.

### Common mistakes and how to fix them

#### Mistake 1: Not initializing the accumulator

```js
// WRONG
function sumBroken(numbers) {
  let sum;           // undefined!
  for (const n of numbers) {
    sum += n;        // undefined + 1 === NaN
  }
  return sum;
}

console.log(sumBroken([1, 2, 3]));  // NaN — silent failure
```

**Problem:** `undefined + anything` produces `NaN`, which propagates silently.
**Fix:** Always initialize: `let sum = 0`.

---

#### Mistake 2: Returning `{ min: undefined, max: undefined }` for empty input

```js
// WRONG
function minAndMaxBroken(numbers) {
  let min = numbers[0];  // undefined if empty!
  let max = numbers[0];
  for (const n of numbers) { /* ... */ }
  return { min, max };
}

console.log(minAndMaxBroken([]));  // { min: undefined, max: undefined }
```

**Problem:** Caller receives an object that looks valid but contains `undefined`. This will cause mysterious bugs later.
**Fix:** Check `numbers.length === 0` first and return `null`.

---

#### Mistake 3: Mutating the input

```js
// WRONG
function sumBad(numbers) {
  let total = numbers.pop();   // destroys the caller's array!
  while (numbers.length > 0) {
    total += numbers.pop();
  }
  return total;
}

const arr = [1, 2, 3];
sumBad(arr);
console.log(arr);  // [] — the array was emptied!
```

**Problem:** The caller's data is destroyed. Pure functions never modify their arguments.
**Fix:** Never call mutating methods (`push`, `pop`, `splice`, `sort`) on input arrays. Read only.

### Connection to interview problems

These patterns are the foundation of many interview problems:

- **LeetCode 1 — Two Sum**: Finds two numbers summing to a target; builds on scanning + counting
- **LeetCode 53 — Maximum Subarray**: Tracks running sum (Kadane's) — direct extension of accumulation
- **LeetCode 217 — Contains Duplicate**: Uses `countOccurrences` logic
- **LeetCode 169 — Majority Element**: Extends frequency counting
- **LeetCode 628 — Maximum Product of Three Numbers**: Extends min/max to find multiple extremes

When you see problems that say "given an array of numbers, find/compute X," your first instinct should be: "Can I solve this in one pass with an accumulator?"

### Discussion questions

1. **`sumArray` and `countOccurrences` both return 0 for empty input. `minAndMax` returns `null`. Why the difference?** Zero is a valid and meaningful sum of zero things. But there is no meaningful minimum or maximum of zero things — returning an object with `undefined` values would be a silent lie. `null` communicates "this question has no answer."

2. **Is it ever correct to walk the array twice?** Yes, if it makes the code significantly clearer. For `minAndMax`, you could compute min in one pass and max in another — still O(n), just with a larger constant. At small scale, clarity beats micro-optimization. At large scale (millions of elements), reducing passes matters.

3. **What happens if `numbers` contains `NaN`?** `NaN < anything` is always `false`, so `NaN` won't become the min. `NaN > anything` is also always `false`, so it won't become the max either. The result silently ignores it. In production code, you'd want to explicitly filter or reject `NaN` inputs.

4. **Why use `for...of` instead of a classic `for (let i = 0; ...)` loop?** `for...of` is cleaner when you only need the value, not the index. When you need the index (like in `minAndMaxWithIndex`), use the classic form. Use the right tool for the job.

### Further exploration

- *Introduction to Algorithms* (CLRS), Chapter 2.1 — Insertion Sort introduces loop invariants, the formal way to reason about accumulator correctness
- MDN: [Array iteration methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) — see how `Array.reduce`, `Array.every`, `Array.some` are built on the same scan pattern you wrote by hand today
