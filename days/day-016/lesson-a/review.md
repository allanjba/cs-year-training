## Day 016 — Lesson A Review: Merge Sort

### What you should have learned

1. **Divide and conquer is a strategy, not an algorithm**: Split the problem into smaller sub-problems of the same shape, solve each recursively, then combine the results. Merge sort is the archetype; the same pattern reappears in binary search, quicksort, FFT, and many others.
2. **The merge step is the real work**: Splitting an array takes O(1) — just compute a midpoint. Merging two sorted arrays takes O(n). The recursion tree has O(log n) levels, and O(n) merge work happens at each level, giving O(n log n) total.
3. **Merge sort is not in-place**: Each `merge` call allocates a new result array. Across the whole sort, O(n) auxiliary space is used. This is its main disadvantage vs. in-place sorts like heap sort or (average case) quicksort.
4. **Stability comes from `<=` in the comparison**: Taking from `left` first on ties preserves the relative order of equal elements. This is essential when sorting objects by a secondary key after sorting by a primary key.
5. **The base case is `arr.length <= 1`**: A one-element array is trivially sorted. Without this guard, the recursion never terminates. It must cover both 0 and 1, not just 1.

### Reviewing your implementation

#### Function 1: `merge(left, right)`

```js
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length)  result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

console.log(merge([1, 4, 7], [2, 5, 6]));   // [1, 2, 4, 5, 6, 7]
console.log(merge([], [1, 2]));              // [1, 2]
console.log(merge([3], []));                 // [3]
console.log(merge([], []));                  // []
```

**Key insights:**
- After the main `while` loop, at most one of `left` or `right` has remaining elements — the other was exhausted. Both remainder loops are needed; only one will execute.
- `<=` (not `<`) ensures stability: equal elements from `left` are taken before equal elements from `right`.
- `i++` and `j++` as post-increment inside `push` is idiomatic; alternatively write `result.push(left[i]); i++;` for clarity.

**Edge cases handled:**
- Both empty → `[]` (main loop never runs, remainder loops don't run)
- One empty → entire non-empty array is returned via remainder loop
- All equal elements → taken left-first, preserving order

---

#### Function 2: `mergeSort(arr)`

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left  = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

console.log(mergeSort([8, 3, 5, 1, 6, 2]));   // [1, 2, 3, 5, 6, 8]
console.log(mergeSort([]));                     // []
console.log(mergeSort([42]));                  // [42]
console.log(mergeSort([2, 1]));                // [1, 2]
console.log(mergeSort([1, 1, 1]));             // [1, 1, 1]
```

**Key insights:**
- `arr.slice(0, mid)` and `arr.slice(mid)` create new arrays — `arr` is never mutated. The return value is always a brand new array.
- For odd-length inputs, `left` gets the smaller half (e.g., length 3 → left 1, right 2). The recursion terminates regardless of how the split is uneven, as long as both halves are strictly shorter than the original.
- The one-line recursive call `merge(mergeSort(left), mergeSort(right))` expresses the algorithm with complete clarity: sort left, sort right, merge.

**Edge cases handled:**
- Empty → `[]` (base case)
- Single element → returned as-is (base case)
- Already sorted → still O(n log n) work (merge sort has no best-case shortcut for this)
- All equal → returns a new array with all equal elements

### Going deeper

#### Extension 1: Count inversions with merge sort

An inversion is a pair `(i, j)` where `i < j` but `arr[i] > arr[j]`. Counting inversions measures "how unsorted" an array is. The count can be computed in O(n log n) by augmenting the merge step:

```js
function mergeCounting(left, right) {
  const result = [];
  let i = 0, j = 0, inversions = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      // Every remaining element in left is > right[j], forming an inversion.
      inversions += left.length - i;
      result.push(right[j++]);
    }
  }
  while (i < left.length)  result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return { sorted: result, inversions };
}

function countInversions(arr) {
  if (arr.length <= 1) return { sorted: arr, inversions: 0 };

  const mid = Math.floor(arr.length / 2);
  const L = countInversions(arr.slice(0, mid));
  const R = countInversions(arr.slice(mid));
  const M = mergeCounting(L.sorted, R.sorted);

  return { sorted: M.sorted, inversions: L.inversions + R.inversions + M.inversions };
}

console.log(countInversions([3, 1, 2]).inversions);  // 2 → (3,1) and (3,2)
console.log(countInversions([1, 2, 3]).inversions);  // 0 → already sorted
```

#### Extension 2: In-place merge sort using indices (avoiding O(n) space)

Instead of slicing, pass `lo` and `hi` indices and sort the sub-range in place. Requires an auxiliary buffer:

```js
function mergeSortInPlace(arr, lo = 0, hi = arr.length - 1, buf = [...arr]) {
  if (lo >= hi) return;

  const mid = Math.floor((lo + hi) / 2);
  mergeSortInPlace(arr, lo, mid, buf);
  mergeSortInPlace(arr, mid + 1, hi, buf);

  // Merge arr[lo..mid] and arr[mid+1..hi] into buf, then copy back
  let i = lo, j = mid + 1, k = lo;
  while (i <= mid && j <= hi) {
    buf[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
  }
  while (i <= mid)  buf[k++] = arr[i++];
  while (j <= hi)   buf[k++] = arr[j++];
  for (let x = lo; x <= hi; x++) arr[x] = buf[x];
}
```

This avoids creating new arrays on every recursive call. The buffer is allocated once. This is closer to how production merge sort implementations work.

### Common mistakes and how to fix them

#### Mistake 1: Missing the base case

```js
// WRONG — infinite recursion
function mergeSort(arr) {
  const mid = Math.floor(arr.length / 2);
  const left  = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

mergeSort([1, 2]);
// mergeSort([1]) → mid=0, left=[], right=[1]
// mergeSort([]) → mid=0, left=[], right=[]
// mergeSort([]) → ... infinite loop → RangeError: Maximum call stack size exceeded
```

**Problem:** Without the base case, single-element and empty arrays keep splitting forever.
**Fix:** `if (arr.length <= 1) return arr;` — must cover both 0 and 1.

---

#### Mistake 2: Only one remainder loop after merge's main loop

```js
// WRONG — loses elements from whichever array is longer
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  while (i < left.length) result.push(left[i++]);  // only handles left remainder
  // Forgot: while (j < right.length) result.push(right[j++]);
  return result;
}

console.log(merge([1, 3], [2, 4, 5]));  // [1, 2, 3]  — missing 4 and 5!
```

**Problem:** When `right` is longer, its remaining elements after the main loop are silently dropped.
**Fix:** Always write both remainder loops. Exactly one will execute for any given call.

---

#### Mistake 3: Using `<` instead of `<=` in the merge comparison (breaks stability)

```js
// WRONG — unstable sort (right-side wins on tie instead of left-side)
if (left[i] < right[j]) {   // should be <=
  result.push(left[i++]);
} else {
  result.push(right[j++]);
}
```

**Problem:** On equal elements, `right[j]` is taken first. When elements are objects being sorted by a key, equal-key objects from the right half appear before equal-key objects from the left half — reversing their original order.
**Fix:** `left[i] <= right[j]` — take from `left` first on ties.

### Connection to interview problems

- **LeetCode 912 — Sort an Array**: Implementing merge sort directly (can't use built-in sort)
- **LeetCode 315 — Count of Smaller Numbers After Self**: The inversion-counting extension applied to each element
- **LeetCode 148 — Sort List**: Merge sort on a linked list — uses the same merge step, but on nodes instead of array indices; a common interview challenge
- **LeetCode 23 — Merge k Sorted Lists**: The Lesson B "merge N sorted arrays" problem on linked lists — one of the most frequently asked hard problems

### Discussion questions

1. **Merge sort always runs in O(n log n) — even on a sorted array. Bubble sort (with the early-exit flag) runs in O(n) on sorted input. Does that make bubble sort better for nearly-sorted data?** Yes — for nearly-sorted data where you expect very few inversions, insertion sort or bubble sort can outperform merge sort in practice. Tim sort (Python's and JavaScript's real sort) detects existing sorted runs and exploits them, getting close to O(n) on nearly-sorted input while still guaranteeing O(n log n) worst case.

2. **`mergeSort` creates many intermediate slice arrays. Each `slice` call is O(k) where k is the sub-array length. Does this change the total time complexity?** No — across the entire execution, the total length of all slices created at each level of the recursion tree is O(n). Since there are O(log n) levels, the total slicing work is O(n log n), which doesn't change the asymptotic complexity. It does increase the constant factor and memory allocation overhead compared to the index-based in-place version.

3. **Merge sort is stable. Does the built-in `Array.prototype.sort` in JavaScript guarantee stability?** Yes, since ES2019 the specification requires `Array.prototype.sort` to be stable. All modern engines implement Tim sort (or a variant) which is stable. Before ES2019, stability was not guaranteed and V8's sort was unstable for arrays of length > 10.

4. **The merge step uses two pointers advancing through two sorted arrays. Where else in this curriculum have two pointers appeared?** Day 12 (two pointers on a single sorted array for pair-sum problems). The merge step is two-pointer applied to two separate arrays rather than opposite ends of one array — the same "compare front elements and advance the pointer" pattern.

### Further exploration

- **Tim sort**: Read the original Tim Peters paper describing the algorithm used in Python and JavaScript. The key insight: real-world data is rarely random; it has natural "runs" that Tim sort exploits.
- [Visualgo — Merge Sort](https://visualgo.net/en/sorting): Animated step-by-step visualization showing the recursion tree and merges executing in order.
- *Introduction to Algorithms* (CLRS), Chapter 2.3: The textbook treatment of merge sort including the full recurrence proof and loop invariant for the merge procedure.
