# Day 16 — Lesson A (Foundations): Merge Sort

## Why this matters

Yesterday you built O(n²) sorting algorithms and learned why they don't scale. Today you'll build merge sort — the first O(n log n) algorithm in this curriculum — and understand exactly where that speedup comes from.

Merge sort matters for several reasons beyond its speed. It demonstrates **divide and conquer**, one of the most powerful algorithmic strategies, which reappears in binary search (Day 13), fast exponentiation, matrix multiplication, and the FFT. It also introduces a key pattern: break a hard problem (sort n elements) into two easier sub-problems of the same kind (sort n/2 elements each), solve them recursively, then combine results. Once you internalize that pattern, you'll recognize it everywhere.

Merge sort is also the foundation of Tim sort (used in Python, Java, and JavaScript's built-in sort) and is directly applicable to the problem of merging sorted streams — which you'll implement in Lesson B today.

---

## The core concept

Merge sort is built on a single powerful observation: **merging two already-sorted arrays into one sorted array is O(n)**. If you can get two sorted halves, combining them is cheap.

The recursion does the rest. You don't need to know how the halves got sorted — just call yourself on each half. Eventually the sub-arrays are so small (length 1) that they're trivially sorted. Then the merges start executing as the recursive calls return, building up progressively larger sorted arrays until the whole input is sorted.

Two functions do all the work:
- `merge(left, right)`: given two sorted arrays, return one sorted array containing all elements from both. This is the engine.
- `mergeSort(arr)`: split the array in half, recursively sort each half, then call `merge` on the results. This is the control structure.

---

## How it works (with hand trace)

**Input: `[8, 3, 5, 1, 6, 2]`**

### Step 1 — The recursion tree (splitting phase)

```
mergeSort([8, 3, 5, 1, 6, 2])
├── mergeSort([8, 3, 5])
│   ├── mergeSort([8])           ← base case, length 1, returns [8]
│   └── mergeSort([3, 5])
│       ├── mergeSort([3])       ← base case, returns [3]
│       └── mergeSort([5])       ← base case, returns [5]
└── mergeSort([1, 6, 2])
    ├── mergeSort([1])           ← base case, returns [1]
    └── mergeSort([6, 2])
        ├── mergeSort([6])       ← base case, returns [6]
        └── mergeSort([2])       ← base case, returns [2]
```

The tree has roughly log₂(6) ≈ 3 levels of splitting. Every base case returns immediately.

### Step 2 — The merges (combining phase, bottom up)

As the recursive calls return, merges execute from leaves to root.

**Merge `[3]` and `[5]`:**
```
i=0  j=0:  3 vs 5 → take 3  → result = [3]
left exhausted → append remaining right: [5]
Result: [3, 5]  ✓
```

**Merge `[8]` and `[3, 5]`:**
```
i=0  j=0:  8 vs 3 → take 3  → result = [3]
i=0  j=1:  8 vs 5 → take 5  → result = [3, 5]
right exhausted → append remaining left: [8]
Result: [3, 5, 8]  ✓
```

**Merge `[6]` and `[2]`:**
```
i=0  j=0:  6 vs 2 → take 2  → result = [2]
right exhausted → append remaining left: [6]
Result: [2, 6]  ✓
```

**Merge `[1]` and `[2, 6]`:**
```
i=0  j=0:  1 vs 2 → take 1  → result = [1]
left exhausted → append remaining right: [2, 6]
Result: [1, 2, 6]  ✓
```

**Final merge: `[3, 5, 8]` and `[1, 2, 6]`:**
```
i=0  j=0:  3 vs 1 → take 1  → result = [1]
i=0  j=1:  3 vs 2 → take 2  → result = [1, 2]
i=0  j=2:  3 vs 6 → take 3  → result = [1, 2, 3]
i=1  j=2:  5 vs 6 → take 5  → result = [1, 2, 3, 5]
i=2  j=2:  8 vs 6 → take 6  → result = [1, 2, 3, 5, 6]
right exhausted → append remaining left: [8]
Result: [1, 2, 3, 5, 6, 8]  ✓
```

The merge function uses **two pointers**: one index `i` into `left`, one index `j` into `right`. At each step, compare the front elements of both sorted arrays and take the smaller one. When one array is exhausted, append everything remaining from the other — it's already in sorted order.

---

## Code implementation

```javascript
function merge(left, right) {
  const result = [];
  let i = 0; // pointer into left
  let j = 0; // pointer into right

  // While both arrays have remaining elements, take the smaller front element
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // One array is exhausted. Append whatever remains from the other.
  // Only one of these two loops will actually execute.
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  // Base case: arrays of length 0 or 1 are already sorted
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);  // creates a new sub-array
  const right = arr.slice(mid);    // creates a new sub-array

  // Recursively sort each half, then merge the two sorted halves
  return merge(mergeSort(left), mergeSort(right));
}
```

A few things to notice:

- `merge` creates a new `result` array. It does **not** modify `left` or `right`. Merge sort is **not** in-place — it uses O(n) auxiliary space across all the intermediate arrays.
- The `<=` in `if (left[i] <= right[j])` makes merge sort **stable**: when two elements are equal, we take from the left array first, preserving the original relative order of equal elements.
- `mergeSort` uses `arr.slice()` to create new sub-arrays and returns a brand new sorted array. The original `arr` passed in is **not** modified.
- The two remainder loops after the main while loop handle whichever array still has elements. Exactly one of them executes; the other's condition is immediately false.

---

## Common pitfalls

**Forgetting the base case.** Without `if (arr.length <= 1) return arr`, the recursion never terminates — it keeps slicing empty arrays and calling itself infinitely, producing a stack overflow. The base case is what stops the recursion. `arr.length <= 1` covers both empty arrays (length 0) and single-element arrays (length 1).

**Off-by-one in the split.** `Math.floor(arr.length / 2)` gives the midpoint. For `[8, 3, 5]` (length 3), `mid = 1`, so `left = [8]` and `right = [3, 5]`. This is a valid uneven split — the recursion still terminates because both halves are strictly smaller than the original. What would be wrong: using `mid = arr.length / 2` without `Math.floor`, which gives a float and breaks `slice`.

**Using `<` instead of `<=` in the merge comparison.** Writing `left[i] < right[j]` means equal elements from `right` are taken before equal elements from `left`. This makes merge sort **unstable** — the original order of equal elements is not preserved. Always use `<=` to take from `left` first on ties.

**Forgetting both remainder loops.** After the main while loop, exactly one of `left` or `right` may still have elements. A common mistake is only writing one remainder loop. The other then silently skips, and those elements are lost from the result. Both loops are needed (though only one will run for any given merge call).

---

## Computer Science foundations

**The recurrence relation.** Merge sort's time complexity satisfies: `T(n) = 2T(n/2) + O(n)`.
- Two recursive calls, each on n/2 elements: `2T(n/2)`
- The merge step on the two halves costs O(n): `+ O(n)`

By the **Master Theorem** (case 2, where work at each level equals the splitting overhead), this solves to `T(n) = O(n log n)`.

Intuitively: the recursion tree has log₂(n) levels. At each level, every element is involved in exactly one merge, so the total merge work across all calls at any given level is O(n). With O(log n) levels: total work = O(n log n).

**Space complexity: O(n).** The `result` arrays created by each `merge` call add up to O(n) at any point in the execution. The call stack adds O(log n) frames. Dominant term: O(n).

**Stability.** Because we use `<=` and take from `left` first on ties, merge sort is stable. Two elements with the same value maintain their left-to-right order from the input. This matters when sorting objects by a key: if two records have the same price, their original order is preserved.

**Connection to binary search (Day 13).** Binary search requires a sorted array — merge sort produces one. More deeply: both algorithms work by repeatedly halving. Binary search discards one half; merge sort recurses into both. The O(log n) depth of the recursion tree is the same reason binary search needs O(log n) steps. Halving is the key operation in both.

**The O(n log n) lower bound.** Any comparison-based sort must make Ω(n log n) comparisons. Merge sort achieves this lower bound exactly — it is asymptotically optimal among comparison-based algorithms.

---

## Real-world applications

**External sorting.** When a dataset is too large to fit in RAM (e.g., sorting a multi-terabyte log file), external merge sort writes small sorted chunks to disk, then merges them — exactly the merge step, but reading from files. This is how database engines sort large result sets.

**Parallel sorting.** The two recursive calls in `mergeSort` are independent — sort left on CPU 0, sort right on CPU 1, then merge. Parallel merge sort scales naturally to multi-core machines and distributed systems. MapReduce's shuffle phase is conceptually a large-scale merge.

**Counting inversions.** A variant of merge sort counts "inversions" — pairs `(i, j)` where `i < j` but `arr[i] > arr[j]` — in O(n log n). During the merge step, when you take an element from `right` before finishing `left`, the remaining elements in `left` are all inversions with that right element. This metric is used in collaborative filtering, voting theory, and version control.

**Tim sort.** Python's `sorted()`, Java's `Collections.sort()`, and JavaScript's `Array.prototype.sort` use Tim sort, a hybrid that identifies already-sorted "runs" in the input and merges them — the merge step is exactly `merge(left, right)`, extended to handle runs of arbitrary length.

---

## Before the exercise

Make sure you can answer these before coding:

1. What does `merge` return when both `left` and `right` are empty? Trace through the code.
2. After the main while loop in `merge`, why can you be sure that at most one of the two arrays still has elements?
3. In `mergeSort`, `arr.slice(0, mid)` creates a copy. Does that mean the original `arr` is never modified by `mergeSort`? Is the output a new array or the same one?
4. If `arr = [4, 2]`, what is `mid`? What are `left` and `right`? What does `mergeSort(left)` return? What does `mergeSort(right)` return? What does `merge` return?
5. The `<=` comparison (not `<`) makes merge sort stable. If you replaced it with `<`, trace what would happen to `[1, 1]` — do both elements still appear in the output?
