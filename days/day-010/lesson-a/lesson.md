## Day 010 — Lesson A (Foundations): Running Totals and Prefix Sums

### Why this matters

Imagine you're analyzing website traffic throughout the day. You have hourly visitor counts: `[120, 150, 200, 180, 220, ...]`. A product manager walks up and asks: "How many total visitors did we have by 3pm?" You add up the first four numbers. Then they ask: "How about by 5pm?" You add again. "What about by 7pm?" Each time, you're repeating most of the same additions.

Now imagine you need to answer hundreds of these queries, or compute sums for ranges of hours, or visualize cumulative traffic on a chart. Doing the same additions repeatedly becomes wasteful.

A **running total** (also called a **prefix sum**) solves this elegantly: we precompute all the cumulative sums once in a single pass, then we can answer any "what's the total up to time X?" query instantly by looking up a single value.

This pattern appears everywhere in both algorithm design and real-world systems: financial cumulative spending, game score tracking, memory usage over time, analytics dashboards, and critically in advanced data structures and algorithms for range queries, subarray problems, and even image processing.

### The core concept

A running total transforms a sequence of individual values into a sequence of cumulative values. Instead of looking at each value in isolation, you look at "everything up to and including this point."

Think of it like tracking a bank account:

```
Transaction log:       Running balance:
+$100                  $100
+$50                   $150  (100 + 50)
-$30                   $120  (150 - 30)
+$200                  $320  (120 + 200)
```

Each balance is the sum of *all previous transactions plus the current one*. That's a running total. The balance at any point gives you the cumulative effect of all transactions up to that moment.

Mathematically, given an array `[a₀, a₁, a₂, a₃, ...]`, we produce a new array:
```
[a₀, a₀+a₁, a₀+a₁+a₂, a₀+a₁+a₂+a₃, ...]
```

Each position `i` in the output holds the sum of all elements from index `0` through index `i` in the input.

### How it works

Let's trace through the computation step by step with a concrete example: `[3, 1, 4, 1, 5]`

**Initial state:**
```
input:  [3, 1, 4, 1, 5]
sum = 0
result = []
```

**Step 1:** Process first element (3)
```
sum = 0 + 3 = 3
result = [3]
```
We've now seen just the first element, so the cumulative sum is 3.

**Step 2:** Process second element (1)
```
sum = 3 + 1 = 4
result = [3, 4]
```
The cumulative sum of the first two elements is 4.

**Step 3:** Process third element (4)
```
sum = 4 + 4 = 8
result = [3, 4, 8]
```
The cumulative sum of the first three elements is 8.

**Step 4:** Process fourth element (1)
```
sum = 8 + 1 = 9
result = [3, 4, 8, 9]
```
The cumulative sum of the first four elements is 9.

**Step 5:** Process fifth element (5)
```
sum = 9 + 5 = 14
result = [3, 4, 8, 9, 14]
```
The cumulative sum of all five elements is 14.

**Key insight:** We maintain a running variable `sum` that acts as our "memory" of everything we've seen so far. Each iteration:
1. We add the current element to our running total
2. We snapshot that total into our result array

This means we make exactly **one pass** through the input, touching each element exactly once.

### Code implementation

```js
function runningTotal(numbers) {
  const result = [];
  let sum = 0;

  for (const n of numbers) {
    sum += n;           // Accumulate the current number
    result.push(sum);   // Store the cumulative sum at this point
  }

  return result;
}

// Test it:
console.log(runningTotal([3, 1, 4, 1, 5]));
// Output: [3, 4, 8, 9, 14]

console.log(runningTotal([10, -5, 3]));
// Output: [10, 5, 8]
```

**Breaking it down:**

- `const result = []` — We need a new array to store our cumulative sums
- `let sum = 0` — Our running total starts at zero (we haven't seen any numbers yet)
- `for (const n of numbers)` — Visit each number exactly once
- `sum += n` — Add the current number to our running total
- `result.push(sum)` — Save this cumulative sum to the result array

**Why this works:**

At any point in the loop, `sum` contains the total of all elements we've processed so far. By pushing `sum` into `result` after adding each element, we capture the cumulative total at each position. When we're done, `result[i]` contains the sum of all elements from index 0 through i in the input array.

### Common pitfalls

**1. Off-by-one confusion: Does `result[i]` include `numbers[i]`?**

Yes! The cumulative sum at position `i` includes the element at position `i`.

```js
runningTotal([5, 10, 15])
// [5, 15, 30]
//  ^   ^    ^
//  |   |    includes 5+10+15
//  |   includes 5+10
//  includes just 5
```

**2. Empty array edge case**

What should `runningTotal([])` return? Some might think `[0]`, but that's wrong. An empty input should produce an empty output: `[]`. If there are zero elements, there are zero cumulative sums to compute.

```js
runningTotal([])  // Correct: []
                  // Wrong: [0]
```

Our implementation handles this correctly because the loop never runs, so nothing gets pushed to `result`.

**3. Forgetting to initialize `sum`**

If you forget `let sum = 0`, JavaScript will initialize `sum` as `undefined`, and `undefined + 5` gives `NaN`. Always initialize accumulator variables!

**4. Mutating the input array**

Don't try to compute running totals "in place" by modifying the input array. This violates the principle of pure functions and makes debugging harder. Always create a new result array.

### Computer Science foundations

**Time Complexity:** O(n) where n is the length of the input array.
- We visit each element exactly once
- Each operation (addition, push) takes constant time
- Total: n elements × O(1) per element = O(n)

**Space Complexity:** O(n) for the result array.
- We create a new array of the same length as the input
- The `sum` variable is O(1) additional space

**The Space-Time Trade-off:**

This is a classic example of preprocessing for faster queries. Consider these two approaches:

*Approach 1: No preprocessing*
- Space: O(1) — store only the original array
- Query "sum from 0 to k": O(k) — must add k+1 elements every time

*Approach 2: Precompute running totals*
- Space: O(n) — store both original array and prefix sums
- Query "sum from 0 to k": O(1) — just look up `prefixSum[k]`

If you need to answer many queries (which is common), spending O(n) time once to build the prefix sum array, then answering each query in O(1), is far more efficient than recomputing sums repeatedly.

**Connection to other algorithms:**

Prefix sums are a foundational technique that appears in:

- **Kadane's Algorithm**: Finding maximum subarray sum in O(n)
- **Range Query Problems**: Answering sum queries for any subrange [i, j]
- **Difference Arrays**: The inverse operation (reconstruct original from differences)
- **Image Processing**: Integral images for computing rectangular region sums in O(1)
- **Segment Trees and Fenwick Trees**: Advanced data structures for range queries with updates

The simple running total you're implementing today is your first step into a whole family of range query techniques.

### Real-world applications

- **Analytics dashboards**: Cumulative metrics over time (total revenue, total users, cumulative error rates)
- **Financial systems**: Running account balances, cumulative P&L
- **Game development**: Cumulative score tracking, experience points over time
- **Computer graphics**: Summed area tables for fast texture filtering
- **Data streaming**: Maintaining running aggregates in real-time systems

### Before the exercise

In the exercise file, you'll implement:

1. **`runningTotal(numbers)`** — The core prefix sum algorithm
2. **`runningAverage(numbers)`** — A variation that computes cumulative averages instead of sums
3. **`prefixSumsFromIndex(numbers, index)`** — A helper that returns the cumulative sum up to a specific index

These exercises will help you internalize the pattern of maintaining running state as you scan through an array. You'll practice:
- Managing accumulator variables
- Building result arrays incrementally
- Handling edge cases (empty arrays, out-of-bounds indices)
- Reusing one function to build another (composition)

Take your time tracing through examples by hand before coding. Understanding *why* it works is more valuable than just getting it to pass tests.
