## Day 011 — Lesson A Review: The Sliding Window Technique

### What you should have learned

1. **Sliding window vs naive recomputation**: The naive approach to "sum of every k-element window" is O(n × k). The sliding window reduces it to O(n) by adding the entering element and subtracting the exiting element — a one-line update instead of a k-element sum.
2. **Two-phase structure**: Build the first window sum (k iterations), then slide (n - k iterations). The two phases are always separate; trying to merge them into one loop is a common source of bugs.
3. **Exiting element index**: When the window moves to position `i`, the exiting element is at `numbers[i - k]`. This index is the most error-prone part of the implementation — verify it by tracing a small example.
4. **Number of valid windows**: For an array of n elements with window size k, there are exactly `n - k + 1` valid windows. This determines the length of the result array in `windowAverages`.
5. **Amortized cost**: Each element is added to `windowSum` exactly once and subtracted exactly once across the entire execution — 2n operations total, regardless of k. This is amortized O(1) per element.

### Reviewing your implementation

#### Function 1: `maxWindowSum(numbers, k)`

```js
function maxWindowSum(numbers, k) {
  if (numbers.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }
  let maxSum = windowSum;

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    if (windowSum > maxSum) maxSum = windowSum;
  }

  return maxSum;
}

console.log(maxWindowSum([2, 1, 5, 3, 6, 4], 3));   // 14
console.log(maxWindowSum([1, 2, 3], 3));              // 6
console.log(maxWindowSum([4], 2));                    // null
console.log(maxWindowSum([-3, -1, -4, -2], 2));      // -3  (least negative window)
```

**Key insights:**
- `maxSum = windowSum` after Phase 1 — the first window is a candidate; we track the maximum from the start
- `numbers[i - k]` exits the window when `numbers[i]` enters. When `i = k`, exit index is `0`; when `i = k+1`, exit index is `1` — a clean relationship
- Works correctly with negative numbers: `maxSum` is initialized to the first window's sum (not `0`), so even all-negative inputs return the least negative window

**Edge cases handled:**
- Array shorter than k → `null`
- Single valid window (length === k) → Phase 2 loop doesn't run; returns Phase 1 sum
- All negative numbers → returns the maximum (least negative) sum

---

#### Function 2: `windowAverages(numbers, k)`

```js
function windowAverages(numbers, k) {
  if (numbers.length < k) return [];

  const result = [];

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }
  result.push(windowSum / k);

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    result.push(windowSum / k);
  }

  return result;
}

console.log(windowAverages([1, 2, 3, 4, 5], 3));   // [2, 3, 4]
console.log(windowAverages([6, 2, 4], 2));          // [4, 3]
console.log(windowAverages([], 3));                 // []
console.log(windowAverages([1, 2], 5));             // []
```

**Key insights:**
- Result length is `numbers.length - k + 1` — one average per valid window position
- Division by k happens at every push — not inside the sliding loop — keeping `windowSum` as a running integer sum
- Returns `[]` for arrays too short to form a window (not `null`) since the natural return type is an array

**Edge cases handled:**
- Empty array → `[]` (guard catches it)
- Array shorter than k → `[]`
- Single window position → result has one element

---

#### Function 3: `minWindowSum(numbers, k)`

```js
function minWindowSum(numbers, k) {
  if (numbers.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }
  let minSum = windowSum;

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    if (windowSum < minSum) minSum = windowSum;
  }

  return minSum;
}

console.log(minWindowSum([2, 1, 5, 3, 6, 4], 3));   // 8  (window [2,1,5])
console.log(minWindowSum([4, 1, 2, 5], 2));          // 3  (window [1,2])
```

**Key insights:**
- Identical structure to `maxWindowSum` — only `>` becomes `<` and `maxSum` becomes `minSum`
- The comparison flips; the sliding update does not change
- This is a common pattern: the same algorithm, parameterized by the comparison operator

**Edge cases handled:**
- Same as `maxWindowSum` — they're structurally identical

### Going deeper

#### Extension 1: Return the window itself, not just the sum

```js
function maxWindowSumWithWindow(numbers, k) {
  if (numbers.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += numbers[i];

  let maxSum = windowSum;
  let maxStart = 0;

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = i - k + 1;   // window starts here
    }
  }

  return {
    sum: maxSum,
    window: numbers.slice(maxStart, maxStart + k),
  };
}

console.log(maxWindowSumWithWindow([2, 1, 5, 3, 6, 4], 3));
// { sum: 14, window: [5, 3, 6] }
```

Track `maxStart` alongside `maxSum`. When a new maximum is found, update both. Slice the original array at the end — no need to slice during the scan.

#### Extension 2: Variable-size sliding window (preview)

Fixed-size windows are the simpler variant. Variable-size windows expand until a condition is violated, then shrink from the left. Example: "find the shortest subarray with sum ≥ target":

```js
function shortestSubarrayWithSum(numbers, target) {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < numbers.length; right++) {
    windowSum += numbers[right];
    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= numbers[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

Two pointers (`left` and `right`) instead of one loop. The right pointer expands; the left pointer shrinks. Both move forward only — still O(n) total.

### Common mistakes and how to fix them

#### Mistake 1: Wrong exiting element index

```js
// WRONG — exits the wrong element
function maxWindowSum(numbers, k) {
  // ...Phase 1...
  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k + 1];   // off by one!
    // ...
  }
}
```

**Problem:** When `i = k`, the window covers indices `[1, k]` (k elements). The element that left the window is at index `0 = k - k`, not `1 = k - k + 1`. Using `i - k + 1` removes the *second* element instead of the *first*, corrupting the sum.
**Fix:** `numbers[i - k]`. Verify: when `i = k`, exits index `0` ✓; when `i = k+1`, exits index `1` ✓.

---

#### Mistake 2: Initializing `maxSum` to 0 instead of the first window's sum

```js
// WRONG — fails for all-negative arrays
function maxWindowSum(numbers, k) {
  // ...Phase 1...
  let maxSum = 0;   // WRONG: should be windowSum

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= numbers[i - k];
    if (windowSum > maxSum) maxSum = windowSum;
  }
  return maxSum;
}

console.log(maxWindowSum([-3, -1, -2], 2));   // 0 — WRONG! Should be -3
```

**Problem:** If all windows have negative sums, no window ever beats `maxSum = 0`, so the function returns `0` — a sum that never appears in the data.
**Fix:** Initialize `maxSum = windowSum` after building the first window.

---

#### Mistake 3: Trying to do Phase 1 and Phase 2 in a single loop

```js
// WRONG — incorrect sum on the first k iterations
function maxWindowSum(numbers, k) {
  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < numbers.length; i++) {
    windowSum += numbers[i];
    windowSum -= (i >= k ? numbers[i - k] : 0);   // confusing conditional
    if (i >= k - 1) {   // only record after k elements
      if (windowSum > maxSum) maxSum = windowSum;
    }
  }
  return maxSum;
}
```

**Problem:** This works (technically), but the `i >= k` conditional makes it harder to understand and reason about. The two-phase structure communicates intent clearly; the single-loop version obscures it.
**Fix:** Keep the two phases separate. Clear code is more valuable than saving 3 lines.

### Connection to interview problems

- **LeetCode 643 — Maximum Average Subarray I**: Find the subarray of length k with maximum average — `maxWindowSum` divided by k
- **LeetCode 1343 — Number of Sub-arrays of Size K and Average Greater Than or Equal to Threshold**: `windowAverages` filtered by a threshold
- **LeetCode 1876 — Substrings of Size Three with Distinct Characters**: Sliding window over a string with a size-3 window and a uniqueness check
- **LeetCode 239 — Sliding Window Maximum**: A harder variant — maximum *element* (not sum) in each window — requires a deque instead of a running sum, but the window structure is the same

### Discussion questions

1. **`maxWindowSum` with all-equal elements returns the same value regardless of which window you pick. Does the algorithm handle ties gracefully?** Yes — `if (windowSum > maxSum)` uses strict greater-than, so ties don't update `maxStart` (or `maxSum`). The first window wins. This is the natural, expected behavior for a maximum: if there's a tie, return the first occurrence.

2. **Is there a way to implement `windowAverages` without floating-point division?** Yes — return the sums instead of the averages, and divide at display time: `sums.map(s => s / k)`. Or return `{ sum, count }` objects and let the caller decide when to divide. Deferring division avoids floating-point accumulation errors in long pipelines.

3. **The sliding window assumes all windows have exactly k elements. What if the data stream pauses and some time periods have no data?** You'd need to decide: does a "missing" period count as 0 errors, or is it excluded from the average? The algorithm as written assumes a dense time series (all periods present). Sparse data requires either imputation (fill missing values with 0) or a different data structure (timestamps instead of indices).

4. **`windowAverages([1, 2, 3, 4, 5], 3)` returns 3 elements. How would you verify the implementation is correct without running it?** Count windows manually: n=5, k=3 → 5-3+1=3 windows. Sum each by hand: (1+2+3)/3=2, (2+3+4)/3=3, (3+4+5)/3=4. Then run the code and compare. Writing the expected output before running is the TDD mindset applied to manual verification.

### Further exploration

- [LeetCode — Sliding Window tag](https://leetcode.com/tag/sliding-window/): ~200 problems using this pattern, from easy to hard — the fixed-size problems you built today are the entry point
- Read about **SQL window functions** (`OVER`, `PARTITION BY`, `ROW BETWEEN`): they're the database equivalent of the sliding window algorithm, and understanding the algorithm makes the SQL syntax intuitive rather than magical
- *Introduction to Algorithms* (CLRS), Chapter 9 on order statistics and Chapter 14 on augmented data structures — the theoretical cousins of range query techniques
