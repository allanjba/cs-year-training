## Day 010 — Lesson A Review: Running Totals and Prefix Sums

### What you should have learned

By completing this lesson, you should be able to:

1. **Understand the prefix sum pattern**: Recognize when maintaining a running accumulator as you scan an array can simplify problems
2. **Implement running totals**: Write clean, efficient code that builds cumulative sums in a single pass
3. **Handle variations**: Adapt the pattern for running averages and indexed lookups
4. **Analyze complexity**: Understand why these solutions are O(n) time and O(n) space
5. **Recognize the trade-off**: See how precomputation trades space for faster query time

The core insight is that **maintaining state as you iterate** is a fundamental programming pattern that appears constantly in both algorithms and production code.

### Reviewing your implementation

#### Function 1: `runningTotal(numbers)`

**Reference implementation:**

```js
function runningTotal(numbers) {
  const result = [];
  let sum = 0;

  for (const n of numbers) {
    sum += n;
    result.push(sum);
  }

  return result;
}

// Tests:
console.log(runningTotal([1, 2, 3]));        // [1, 3, 6]
console.log(runningTotal([10, -5, 3]));      // [10, 5, 8]
console.log(runningTotal([]));               // []
console.log(runningTotal([5]));              // [5]
```

**Key insights:**

- **Single pass, single purpose**: We visit each element exactly once, maintaining a running sum as our "memory" of what we've seen
- **The accumulator pattern**: `sum` starts at 0 and grows as we incorporate each element
- **Snapshot each step**: After each addition, we capture the current cumulative total

**Edge cases handled:**

- **Empty array `[]`**: Loop never runs, returns empty array (correct)
- **Single element `[5]`**: Returns `[5]` (the cumulative sum of just one element)
- **Negative numbers**: Work correctly; the running total can decrease
- **Large arrays**: Algorithm scales linearly; no performance concerns

**Time complexity**: O(n) — one loop, each iteration does O(1) work
**Space complexity**: O(n) — result array has same length as input

#### Function 2: `runningAverage(numbers)`

**Reference implementation:**

```js
function runningAverage(numbers) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
    result.push(sum / (i + 1));  // Average = total sum / count of elements
  }

  return result;
}

// Tests:
console.log(runningAverage([1, 2, 3]));      // [1, 1.5, 2]
console.log(runningAverage([10, 20]));       // [10, 15]
console.log(runningAverage([]));             // []
```

**Key insights:**

- **Reuse the running total pattern**: We still maintain `sum`, but now we divide by the count at each step
- **The count is implicit**: At position `i`, we've seen `i + 1` elements (because arrays are 0-indexed)
- **Efficiency**: We don't recompute the sum from scratch each time; we build on the previous sum

**Why `i + 1`?**

When we're at index 0, we've seen 1 element.
When we're at index 1, we've seen 2 elements.
When we're at index `i`, we've seen `i + 1` elements.

**Alternative approach (using `for...of`):**

```js
function runningAverage(numbers) {
  const result = [];
  let sum = 0;
  let count = 0;

  for (const n of numbers) {
    sum += n;
    count++;
    result.push(sum / count);
  }

  return result;
}
```

This version explicitly tracks the count, which some find more readable.

#### Function 3: `prefixSumsFromIndex(numbers, index)`

**Reference implementation:**

```js
function prefixSumsFromIndex(numbers, index) {
  // Validate index is within bounds
  if (index < 0 || index >= numbers.length) {
    return null;
  }

  // Build running totals
  const totals = runningTotal(numbers);

  // Return the cumulative sum at the requested index
  return totals[index];
}

// Tests:
console.log(prefixSumsFromIndex([1, 2, 3], 0));    // 1
console.log(prefixSumsFromIndex([1, 2, 3], 1));    // 3
console.log(prefixSumsFromIndex([1, 2, 3], 2));    // 6
console.log(prefixSumsFromIndex([1, 2, 3], 5));    // null (out of bounds)
console.log(prefixSumsFromIndex([1, 2, 3], -1));   // null (out of bounds)
```

**Key insights:**

- **Composition**: We reuse `runningTotal` rather than rewriting the logic
- **Boundary checking first**: Always validate inputs before doing work
- **Clear return value for errors**: `null` signals "invalid index" (could also throw an error, depending on your design philosophy)

**Alternative (more efficient for single queries):**

If you only need *one* prefix sum and don't need the entire array, you could compute just that one value:

```js
function prefixSumsFromIndex(numbers, index) {
  if (index < 0 || index >= numbers.length) {
    return null;
  }

  let sum = 0;
  for (let i = 0; i <= index; i++) {
    sum += numbers[i];
  }
  return sum;
}
```

This is O(k) where k = index, versus O(n) for building the full array. Choose based on your use case:
- Need many prefix sums? Precompute the full array once.
- Need just one? Compute it directly.

### Going deeper

#### Extension 1: Range sum queries

Now that you have a prefix sum array, you can answer any "what's the sum from index `i` to index `j`?" in O(1) time.

**The trick:**

```
sum(i, j) = prefixSum[j] - prefixSum[i-1]
```

Why? The prefix sum at `j` includes elements from 0 to j. The prefix sum at `i-1` includes elements from 0 to i-1. Subtracting them gives you just the elements from i to j.

**Example:**

```js
const numbers = [3, 1, 4, 1, 5];
const prefix = runningTotal(numbers);  // [3, 4, 8, 9, 14]

// Sum from index 2 to 4 (4 + 1 + 5 = 10)
// Method 1: Direct calculation
let sum = 0;
for (let i = 2; i <= 4; i++) {
  sum += numbers[i];
}
console.log(sum);  // 10

// Method 2: Using prefix sums
// sum(2, 4) = prefix[4] - prefix[1]
//           = 14 - 4
//           = 10
console.log(prefix[4] - prefix[1]);  // 10
```

**Edge case**: What if `i = 0`? Then you just want `prefix[j]` (no subtraction needed).

#### Extension 2: Suffix sums (running totals from the end)

You can also build running totals from right to left:

```js
function runningSuffixTotal(numbers) {
  const result = new Array(numbers.length);
  let sum = 0;

  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += numbers[i];
    result[i] = sum;
  }

  return result;
}

console.log(runningSuffixTotal([1, 2, 3]));
// [6, 5, 3]  —  from position i to end: [1+2+3, 2+3, 3]
```

This is useful for problems where you need to know "what's the total from here to the end?"

### Common mistakes and how to fix them

#### Mistake 1: Off-by-one error in `runningAverage`

```js
// WRONG: Dividing by i instead of i+1
function runningAverage(numbers) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
    result.push(sum / i);  // BUG: When i=0, we divide by 0!
  }

  return result;
}
```

**Problem:** At index 0, we divide by 0, giving `Infinity`.

**Fix:** Divide by `i + 1` because we've processed `i + 1` elements so far.

#### Mistake 2: Returning `[0]` for empty array

```js
// WRONG: Creating a result with initial value
function runningTotal(numbers) {
  const result = [0];  // BUG: Should start empty
  let sum = 0;

  for (const n of numbers) {
    sum += n;
    result.push(sum);
  }

  return result;
}

console.log(runningTotal([]));  // [0] — Wrong! Should be []
```

**Problem:** Empty input should give empty output, but this returns `[0]`.

**Fix:** Initialize `result` as `[]`, not `[0]`.

#### Mistake 3: Mutating the input array

```js
// WRONG: Modifying input in place
function runningTotal(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
    numbers[i] = sum;  // BUG: Mutating input!
  }
  return numbers;
}

const arr = [1, 2, 3];
console.log(runningTotal(arr));  // [1, 3, 6]
console.log(arr);                // [1, 3, 6] — Oops! Original was destroyed
```

**Problem:** The caller's array is now modified, which is unexpected and breaks the principle of pure functions.

**Fix:** Always create a new `result` array instead of modifying the input.

### Connection to interview problems

Prefix sums appear in many coding interview questions:

- **LeetCode 53 - Maximum Subarray** (Kadane's algorithm builds on prefix sum ideas)
- **LeetCode 303 - Range Sum Query (Immutable)** (direct application)
- **LeetCode 304 - Range Sum Query 2D (Immutable)** (2D prefix sums)
- **LeetCode 560 - Subarray Sum Equals K** (uses prefix sums with hash map)
- **LeetCode 523 - Continuous Subarray Sum** (prefix sums modulo k)

When you see problems asking about sums of subarrays or ranges, think: "Could prefix sums help here?"

### Discussion questions

1. **How does `runningTotal` compare to repeatedly summing from scratch?**
   - Repeatedly summing: O(n) per query, so O(n·q) for q queries
   - Precomputing: O(n) once, then O(1) per query, so O(n + q) total
   - Massive win when q is large!

2. **Could you compute running totals without creating a new array?**
   - Technically yes, by mutating the input array, but this is bad practice
   - Pure functions (no side effects) are easier to reason about, test, and debug
   - The extra O(n) space is worth it for code clarity

3. **What if you needed running products instead of running sums?**
   - Same pattern, just use `product *= n` instead of `sum += n`
   - Watch out for zeroes! Once you multiply by 0, everything after is 0
   - Watch out for very large products (overflow in some languages, not JavaScript)

4. **How would you test `runningTotal` thoroughly?**
   - Empty array `[]`
   - Single element `[5]`
   - All positive `[1, 2, 3]`
   - All negative `[-1, -2, -3]`
   - Mix of positive/negative `[10, -5, 3]`
   - With zeros `[1, 0, 2]`
   - Large array (performance test)

### Further exploration

**Academic resources:**

- *Introduction to Algorithms* (CLRS), Chapter 2: Discusses cumulative operations and their complexity
- *Programming Pearls* by Jon Bentley, Column 8: Algorithm design techniques including prefix sums

**Advanced topics:**

- **Fenwick Trees (Binary Indexed Trees)**: Allow prefix sum queries *and* updates in O(log n)
- **Segment Trees**: Generalize to handle any associative operation (min, max, sum, etc.) with updates
- **Difference Arrays**: The inverse operation—reconstruct original array from cumulative data

These advanced structures are worth studying once you're comfortable with the basic prefix sum pattern you've learned today.
