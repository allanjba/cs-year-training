## Day 011 — Lesson A (Foundations): The Sliding Window Technique

### Why this matters

In Day 10 you learned to compute a running total — the cumulative sum of all elements up to each position. That answered questions like "what is the total so far?" But a different class of questions asks: "what is the best (or average) value over any consecutive group of k elements?"

Consider a practical example: a server monitoring system records error counts for each of the last 24 hours: `[0, 1, 0, 3, 5, 2, 0, 0, 1, ...]`. Your alert system needs to fire whenever the average error rate over any 3-hour window exceeds a threshold. You could check every possible window of 3 hours — there are 22 of them in 24 hours — but the naive approach recomputes each sum from scratch, doing 3 additions per window, for 22 × 3 = 66 total additions.

Now imagine this at scale: 1,440-minute windows over a year (525,960 minutes), checked every minute. The naive approach becomes computationally expensive. The **sliding window** technique reduces this to a single pass of O(n), regardless of window size.

The sliding window appears throughout software engineering: moving averages in financial charts, spell-checking consecutive characters, network packet analysis, finding longest substrings, and many interview problems where you need to examine "every consecutive group of k things" efficiently.

### The core concept

A **sliding window** is a subarray (or substring) of fixed size that moves through the data one step at a time. Think of it like a physical window frame you slide along a number line:

```
numbers: [2, 1, 5, 3, 6, 4, 8, 2, 1]
          ↑window size k=3↑

Step 0:  [2, 1, 5] 3  6  4  8  2  1   → sum = 8
Step 1:   2 [1, 5, 3] 6  4  8  2  1   → sum = 9
Step 2:   2  1 [5, 3, 6] 4  8  2  1   → sum = 14
Step 3:   2  1  5 [3, 6, 4] 8  2  1   → sum = 13
...
```

The key insight: when the window moves one step right, only *two* things change:
1. One element **enters** the window (the new right side)
2. One element **exits** the window (the old left side)

Instead of recomputing the entire sum from scratch, you update it:

```
new_sum = old_sum + entering_element - exiting_element
```

This is one addition and one subtraction — O(1) — regardless of window size.

### How it works

Let's trace `maxWindowSum([2, 1, 5, 3, 6, 4], k=3)` step by step.

**Phase 1: Build the first window**

Before we can slide, we need the sum of the first k elements:
```
numbers: [2, 1, 5, 3, 6, 4]
indices:  0  1  2  3  4  5

First window (indices 0..2): 2 + 1 + 5 = 8
currentSum = 8
maxSum = 8
```

**Phase 2: Slide the window**

Now we move the window right, one step at a time. At each step, we add the entering element (right side) and subtract the exiting element (left side):

```
Move window right by 1 (indices 1..3):
  entering: numbers[3] = 3
  exiting:  numbers[0] = 2
  currentSum = 8 + 3 - 2 = 9
  maxSum = max(8, 9) = 9

Move window right by 1 (indices 2..4):
  entering: numbers[4] = 6
  exiting:  numbers[1] = 1
  currentSum = 9 + 6 - 1 = 14
  maxSum = max(9, 14) = 14

Move window right by 1 (indices 3..5):
  entering: numbers[5] = 4
  exiting:  numbers[2] = 5
  currentSum = 14 + 4 - 5 = 13
  maxSum = max(14, 13) = 14

No more positions — window has reached the end.
```

Result: `14` (the window `[5, 3, 6]` has the maximum sum).

Notice: we did 3 additions to build the first window, then 3 more operations (one add + one subtract per step) for 3 more window positions. A total of 6 operations for 6 elements — O(n), not O(n × k).

### Code implementation

```js
function maxWindowSum(numbers, k) {
  // Edge case: can't form a window if the array is too short
  if (numbers.length < k) return null;

  // Phase 1: compute the sum of the first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }
  let maxSum = windowSum;

  // Phase 2: slide the window across the rest of the array
  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];       // add the entering element
    windowSum -= numbers[i - k];   // remove the exiting element
    if (windowSum > maxSum) {
      maxSum = windowSum;
    }
  }

  return maxSum;
}

console.log(maxWindowSum([2, 1, 5, 3, 6, 4], 3));   // 14 (window [5,3,6])
console.log(maxWindowSum([1, 2, 3], 3));              // 6  (only one window)
console.log(maxWindowSum([4, 4, 4, 4], 2));           // 8
console.log(maxWindowSum([5], 2));                    // null (too short)
```

**Breaking it down:**

- `if (numbers.length < k) return null` — if there aren't k elements, there are no valid windows; `null` signals "no answer"
- The first loop (Phase 1) runs exactly k times to seed the initial sum
- The second loop (Phase 2) runs `n - k` times (one per window position after the first)
- `numbers[i]` is the entering element — the new right edge of the window
- `numbers[i - k]` is the exiting element — the old left edge. When `i = k`, the exiting element is at index `0`; when `i = k+1`, it's at index `1`; and so on

**Why this works:**

At step `i` in Phase 2, the window covers indices `[i-k+1, i]`. The sum of this window is the sum of the previous window plus `numbers[i]` minus `numbers[i-k]`. By maintaining `windowSum` as a running total, we avoid recomputing the sum of k elements at every step.

Now let's implement a second function that returns *all* window averages:

```js
function windowAverages(numbers, k) {
  if (numbers.length < k) return [];

  const result = [];

  // Phase 1: first window sum
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }
  result.push(windowSum / k);

  // Phase 2: slide and compute average for each position
  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    result.push(windowSum / k);
  }

  return result;
}

console.log(windowAverages([1, 2, 3, 4, 5], 3));
// [2, 3, 4]  →  (1+2+3)/3=2, (2+3+4)/3=3, (3+4+5)/3=4
```

### Common pitfalls

**1. Off-by-one in the exiting element index**

The element that exits when the window moves to position `i` is at index `i - k`, not `i - k + 1`. Trace it: when the window covers `[k, k+1, ..., 2k-1]`, the element that was in the previous window but not this one is at index `0 = k - k`.

If you write `numbers[i - k + 1]` instead, you remove the wrong element and the sum is wrong. Always verify with a small example.

**2. Array too short for the window**

`numbers.length < k` means there isn't a single valid window. Return `null` for functions that return a single value, or `[]` for functions that return an array. Don't let the first loop run k times when there are fewer than k elements.

**3. Integer vs floating-point division for averages**

`windowSum / k` in JavaScript always produces a floating-point number. `(1 + 2 + 3) / 3 = 2.0`, which looks like an integer but is a float. This is generally fine, but be aware that `2.0 === 2` is `true` in JavaScript while in other languages it might not be.

**4. Confusing window size k with number of windows**

For an array of length n with window size k, there are exactly `n - k + 1` valid windows. An array of 5 elements with window size 3 has 5 - 3 + 1 = 3 windows: starting at indices 0, 1, and 2.

### Computer Science foundations

**Time Complexity:** O(n) — the naive approach is O(n × k); the sliding window is O(n).

To understand why this matters, consider k = 1000 and n = 1,000,000:
- Naive: 1,000,000 × 1,000 = 1 billion operations
- Sliding window: ~1,000,000 operations

The sliding window reduces a quadratic relationship to linear by *reusing computation*. The sum of the new window is derived from the previous window's sum rather than computed from scratch.

**Space Complexity:** O(1) for `maxWindowSum` (only a few variables); O(n - k + 1) for `windowAverages` (the result array is the output, not auxiliary space).

**The "amortized" perspective:**

Across the entire execution of `maxWindowSum`, each element is added to `windowSum` exactly once (when it enters the window) and subtracted exactly once (when it exits). That's 2n operations total, regardless of k. Every element pays a constant "cost" when entering and a constant "cost" when leaving — amortized O(1) per element.

**Connection to other algorithms:**

- **Variable-size sliding window**: A variation where the window expands and contracts based on a condition (not covered today, but a direct extension). Used for "longest substring with at most k distinct characters" and similar problems.
- **Two-pointer technique**: Related — two indices that advance through the array, often used when the window's definition is more complex than "fixed size k."
- **Prefix sums (Day 10)**: You can answer any range sum query with prefix sums: `rangeSum(i, j) = prefix[j] - prefix[i-1]`. The sliding window maintains only the current window's sum; prefix sums maintain all cumulative sums.

### Real-world applications

- **Financial systems**: 7-day, 30-day, 90-day rolling averages on stock prices, revenue, or expenses
- **Network monitoring**: Sliding window over packet counts or latency measurements to detect anomalies
- **Rate limiting**: APIs often limit requests in a sliding window (e.g., "no more than 100 requests in any 60-second window")
- **Signal processing**: Moving average filters in audio and sensor data to smooth noise
- **Database query optimization**: `OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` in SQL window functions is exactly this

### Before the exercise

In the exercise, you'll implement:

1. **`maxWindowSum(numbers, k)`** — find the maximum sum over any k-element window
2. **`windowAverages(numbers, k)`** — return the average for each k-element window position
3. **`minWindowSum(numbers, k)`** — the minimum sum variant (same structure, different comparison)

Focus on the two-phase structure: build the first window, then slide. The off-by-one on the exiting element index (`i - k`) is the most common mistake — trace through a 4-element array with k=2 by hand before writing any code.
