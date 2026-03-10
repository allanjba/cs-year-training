## Day 013 — Lesson A Review: Binary Search

### What you should have learned

1. **O(log n) is qualitatively different from O(n)**: Binary search doesn't scan — it eliminates. Each comparison discards half the remaining search space. A billion-element sorted array takes at most 30 comparisons. This is the first algorithm you've seen that is genuinely sub-linear.
2. **Sorted order is the precondition, not an implementation detail**: Binary search is only correct on sorted data. If you call it on an unsorted array, you get wrong answers with no error. The invariant — "the target, if it exists, is in `array[low..high]`" — depends entirely on sortedness.
3. **Two distinct variants, two distinct loop patterns**: Standard search uses `while (low <= high)` and `high = mid - 1`. Insertion-position search uses `while (low < high)` and `high = mid`. Confusing the two is the most common implementation bug.
4. **`searchRange` requires two separate searches**: Finding the leftmost and rightmost occurrences of a value uses two calls to a left-biased and a right-biased binary search. These are not symmetric — each has a slightly different "what to do on equality" decision.
5. **Binary search on the answer is a meta-technique**: You can binary search over a range of *possible answers* (not data indices) to find the minimum feasible value. This unlocks a class of hard problems by converting a search over answers into a feasibility check.

### Reviewing your implementation

#### Function 1: `binarySearch(sortedArray, target)`

```js
function binarySearch(sortedArray, target) {
  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = sortedArray[mid];

    if (midValue === target) return mid;
    if (midValue < target) low = mid + 1;
    else high = mid - 1;
  }

  return null;
}

console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56], 23));   // 5
console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56], 9));    // null
console.log(binarySearch([], 5));                                 // null
console.log(binarySearch([7], 7));                               // 0
```

**Key insights:**
- `while (low <= high)` — the `=` handles the single-element case; without it, the last candidate would be skipped
- After the loop, `low > high`, meaning the search region is empty — we've checked every possible position
- Returns the index (not the value) — callers who need the value use `sortedArray[binarySearch(sortedArray, target)]`

**Edge cases handled:**
- Empty array → `high = -1`, `0 <= -1` is false → `null`
- Single element, match → `mid = 0`, returns `0`
- Single element, no match → one iteration, `low > high`, returns `null`
- Target not in array → `null`

---

#### Function 2: `findInsertPosition(sortedArray, value)`

```js
function findInsertPosition(sortedArray, value) {
  let low = 0;
  let high = sortedArray.length;   // can be length (one past the end)

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArray[mid] < value) low = mid + 1;
    else high = mid;               // mid itself could be the answer
  }

  return low;
}

console.log(findInsertPosition([1, 3, 5, 7], 4));   // 2
console.log(findInsertPosition([1, 3, 5, 7], 0));   // 0
console.log(findInsertPosition([1, 3, 5, 7], 9));   // 4
console.log(findInsertPosition([1, 3, 5, 7], 5));   // 2
console.log(findInsertPosition([], 5));              // 0
```

**Key insights:**
- `high = sortedArray.length` — valid when inserting after the last element; `length` is one past the end
- `while (low < high)` — the loop terminates when `low === high`; that convergence point is the answer
- `high = mid` (not `mid - 1`) — when `sortedArray[mid] >= value`, `mid` itself is a candidate insertion position

**Edge cases handled:**
- Empty array → `low = 0, high = 0`, loop never runs, returns `0`
- Value smaller than all elements → converges to `0`
- Value larger than all elements → converges to `length`
- Value exactly equal to an element → returns the index of the leftmost occurrence

---

#### Function 3: `searchRange(sortedArray, target)`

```js
function searchRange(sortedArray, target) {
  // Find leftmost index where target could be inserted
  function findLeft(arr, t) {
    let low = 0, high = arr.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[mid] < t) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // Find leftmost index where target+1 could be inserted (= one past last target)
  function findRight(arr, t) {
    let low = 0, high = arr.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[mid] <= t) low = mid + 1;   // note <=, not <
      else high = mid;
    }
    return low - 1;   // last occurrence of t
  }

  const left = findLeft(sortedArray, target);
  if (left === sortedArray.length || sortedArray[left] !== target) {
    return [-1, -1];  // target not found
  }

  return [left, findRight(sortedArray, target)];
}

console.log(searchRange([1, 2, 2, 2, 3], 2));    // [1, 3]
console.log(searchRange([1, 2, 3], 2));           // [1, 1]
console.log(searchRange([1, 2, 3], 4));           // [-1, -1]
console.log(searchRange([2, 2, 2], 2));           // [0, 2]
console.log(searchRange([], 2));                  // [-1, -1]
```

**Key insights:**
- `findLeft` is `findInsertPosition` — finds the leftmost position where `target` could be inserted
- `findRight` uses `arr[mid] <= t` (note `<=`) — moves `low` past all occurrences of `t`, then returns `low - 1`
- After `findLeft`, check `sortedArray[left] !== target` to confirm the target actually exists (it might not)

**Edge cases handled:**
- Target not in array → `findLeft` returns a valid position but `sortedArray[left] !== target` → `[-1, -1]`
- All elements equal to target → `[0, length-1]`
- Single occurrence → `[i, i]`

### Going deeper

#### Extension 1: Binary search on the answer — find the square root

```js
// Find floor(sqrt(n)) using binary search over possible answers
function floorSqrt(n) {
  if (n < 0) return null;
  let low = 0;
  let high = n;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const sq = mid * mid;
    if (sq === n) return mid;
    if (sq < n) low = mid + 1;
    else high = mid - 1;
  }

  return high;  // largest integer whose square <= n
}

console.log(floorSqrt(9));    // 3
console.log(floorSqrt(10));   // 3
console.log(floorSqrt(16));   // 4
```

We binary search over the *answer space* (possible square root values), checking if `mid²` is too small, too large, or exactly right. Same algorithm, different interpretation of `mid`.

#### Extension 2: Count occurrences in O(log n)

```js
function countOccurrences(sortedArray, target) {
  const [left, right] = searchRange(sortedArray, target);
  if (left === -1) return 0;
  return right - left + 1;
}

console.log(countOccurrences([1, 2, 2, 2, 3], 2));   // 3
console.log(countOccurrences([1, 2, 3], 2));          // 1
console.log(countOccurrences([1, 2, 3], 5));          // 0
```

Two binary searches (O(log n) each) give the count without scanning.

### Common mistakes and how to fix them

#### Mistake 1: Using `while (low < high)` instead of `while (low <= high)` in standard search

```js
// WRONG — skips the single-element case
function binarySearch(sortedArray, target) {
  let low = 0, high = sortedArray.length - 1;
  while (low < high) {  // should be <=
    const mid = Math.floor((low + high) / 2);
    if (sortedArray[mid] === target) return mid;
    if (sortedArray[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return null;  // misses sortedArray[low] if low === high
}

console.log(binarySearch([7], 7));  // null — WRONG! Should be 0.
```

**Problem:** When `low === high`, there's one element left to check. `while (low < high)` exits without checking it.
**Fix:** `while (low <= high)`.

---

#### Mistake 2: `high = mid` instead of `high = mid - 1` in standard search

```js
// WRONG — can cause infinite loop when low + 1 === high
function binarySearch(sortedArray, target) {
  let low = 0, high = sortedArray.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArray[mid] === target) return mid;
    if (sortedArray[mid] < target) low = mid + 1;
    else high = mid;   // should be mid - 1
  }
  return null;
}

// When low=4, high=5, mid=4, sortedArray[4] > target:
// high = 4 (same as mid) → low=4, high=4 → mid=4 → same comparison → infinite loop
```

**Problem:** When `sortedArray[mid] > target`, `mid` is not the answer — it can be excluded. `high = mid` keeps `mid` in the region and can cause an infinite loop when `low === mid`.
**Fix:** `high = mid - 1` in the standard search. Only use `high = mid` in the insertion-position variant.

---

#### Mistake 3: Not checking `sortedArray[left] !== target` after `findLeft`

```js
// INCOMPLETE — returns wrong range when target is absent
function searchRange(sortedArray, target) {
  const left = findLeft(sortedArray, target);
  const right = findRight(sortedArray, target);
  return [left, right];   // returns [insertionPos, insertionPos-1] when absent
}

console.log(searchRange([1, 2, 3], 4));
// findLeft returns 3 (insertion position), findRight returns 2
// Returns [3, 2] — WRONG! Should be [-1, -1].
```

**Problem:** `findLeft` always returns *a* position (where the value would go), even when the value isn't present. Must verify `sortedArray[left] === target` after the search.
**Fix:** `if (left === sortedArray.length || sortedArray[left] !== target) return [-1, -1];`

### Connection to interview problems

- **LeetCode 704 — Binary Search**: `binarySearch` exactly — the canonical starting problem
- **LeetCode 35 — Search Insert Position**: `findInsertPosition` exactly
- **LeetCode 34 — Find First and Last Position of Element in Sorted Array**: `searchRange` exactly — a top-20 interview frequency problem
- **LeetCode 69 — Sqrt(x)**: `floorSqrt` — binary search on the answer space

### Discussion questions

1. **`binarySearch` returns an index, not a boolean. Why is an index more useful than a boolean?** With the index, you can get the value (`arr[idx]`), update it (`arr[idx] = newVal`), or compute range distances. A boolean "yes/no" discards information. If you only need a boolean, call `binarySearch(arr, t) !== null` — the caller can throw away the index; they can't reconstruct it from a boolean.

2. **What happens if you call `binarySearch` on an array with duplicate values?** It returns *an* index where the value appears, but not necessarily the first or last. If you need the leftmost or rightmost occurrence, use `searchRange`. For a simple "does it exist?" check, any occurrence is fine.

3. **`findInsertPosition` and `binarySearch` look similar but have slightly different loop conditions and updates. Is there a unified formulation?** Yes — all binary search variants can be expressed as: "maintain the invariant that the answer is in `[low, high]`, and narrow the range." The difference is in what "the answer" means (an index vs an insertion position vs a range boundary). Understanding the invariant for each variant lets you derive the correct conditions rather than memorizing them.

4. **How many iterations does binary search take on an array of 1 million elements?** log₂(1,000,000) ≈ 19.9, so at most 20 iterations. This is why binary search is so fast — you could binary search through a million-element array in the time it takes to blink.

### Further exploration

- **LeetCode Binary Search tag**: ~200 problems using this pattern — start with 704, 35, and 34 in that order
- [visualgo.net — Binary Search](https://visualgo.net/en/bst): An animated visualization of binary search executing step by step
- Read about **B+ trees**: The data structure behind every relational database index — a generalized binary search tree optimized for disk reads, where each node has hundreds of children (not 2)
