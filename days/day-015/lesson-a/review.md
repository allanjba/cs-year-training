# Day 15 — Lesson A (Foundations): Sorting Algorithms — Review

## What you should have learned

- Bubble sort makes repeated passes, swapping adjacent pairs, and the `swapped` flag enables O(n) early exit on sorted input.
- Insertion sort maintains a sorted prefix and shifts elements right to insert each new element, making it genuinely fast on nearly-sorted data.
- Both algorithms sort in place (O(1) space) and have O(n²) worst-case time, but different best-case behavior.
- `isSorted` checks for non-decreasing order in a single O(n) pass — empty and single-element arrays are trivially sorted.
- Comparison-based sorting has a proven lower bound of O(n log n); the O(n²) algorithms are useful for small or nearly-sorted inputs, not large unsorted datasets.

---

## Reviewing your implementation

### `bubbleSort(arr)`

**Reference implementation:**

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
```

**Key insights:**
- The inner loop upper bound is `n - 1 - i`. After pass `i`, the last `i` elements are in final position — no need to visit them again. Without this, the algorithm still works but does redundant comparisons.
- The `swapped` flag is the difference between O(n) and O(n²) best case. Don't skip it.
- The destructuring swap `[arr[j], arr[j+1]] = [arr[j+1], arr[j]]` is clean but creates a temporary array. An explicit `let tmp` swap is slightly more efficient and may be what an interviewer expects.

**Edge cases:**
- Empty array: outer loop runs `n - 1 = -1` times, i.e., zero times. Returns `[]` correctly.
- Single element: outer loop runs 0 times. Returns `[x]` correctly.
- All equal elements: no swaps occur on pass 1, `swapped` stays false, exits immediately. O(n).

---

### `insertionSort(arr)`

**Reference implementation:**

```javascript
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

**Key insights:**
- Save `key = arr[i]` before the while loop. The loop overwrites `arr[i]` during shifting, so you'd lose the value if you didn't save it.
- After the while loop, `j` has been decremented past the insertion point. The correct index is `j + 1`, not `j`.
- The while loop condition `j >= 0` prevents reading `arr[-1]` when the key belongs at the start of the array.

**Edge cases:**
- Array in reverse order: every element requires shifting the entire sorted prefix — true worst case, O(n²).
- Array already sorted: the `while` condition `arr[j] > key` is immediately false for every `i`. Inner loop body never executes. O(n).
- Duplicate values: `arr[j] > key` uses strict greater-than, so equal elements don't shift. This preserves the original order of equal elements — insertion sort is **stable**.

---

### `isSorted(arr)`

**Reference implementation:**

```javascript
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}
```

**Key insights:**
- The loop runs to `arr.length - 1` (exclusive), so it compares indices 0-1, 1-2, ..., (n-2)-(n-1). This covers all adjacent pairs without going out of bounds.
- For an empty array, `arr.length - 1 = -1`, so the loop runs 0 times and returns `true`. Correct.
- The check is `arr[i] > arr[i + 1]` — strictly greater than — so equal adjacent elements don't trigger a false return. `[1, 1, 2]` is sorted.

**Edge cases:**
- `[2, 1]`: loop runs once, `2 > 1` is true, returns false immediately.
- `[1]`: loop runs 0 times, returns true.

---

## Going deeper

### Extension 1: Bidirectional bubble sort (cocktail shaker sort)

Standard bubble sort only moves elements rightward (large elements bubble right). Large elements move fast; small elements only move one position left per pass. This means `[9, 1, 2, 3, 4, 5]` takes 1 pass but `[1, 2, 3, 4, 5, 0]` takes n-1 passes — the "turtle problem."

Cocktail shaker sort alternates direction: one pass left-to-right (bubbles max to right), then right-to-left (bubbles min to left). This gives small elements a fast path to the front.

```javascript
function cocktailShakerSort(arr) {
  let start = 0;
  let end = arr.length - 1;
  while (start < end) {
    let swapped = false;
    // Left to right pass — moves max to arr[end]
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    end--;
    // Right to left pass — moves min to arr[start]
    for (let i = end; i > start; i--) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        swapped = true;
      }
    }
    start++;
    if (!swapped) break;
  }
  return arr;
}
```

Try it on `[0, 1, 2, 3, 4, 9]` reversed: `[9, 4, 3, 2, 1, 0]`. Compare how many passes standard vs. cocktail shaker sort needs.

### Extension 2: Make insertion sort work with a custom comparator

The built-in `Array.prototype.sort` accepts a comparator function. Modify `insertionSort` to accept an optional comparator so it can sort in descending order, or sort arrays of objects.

```javascript
function insertionSortWithComparator(arr, compareFn = (a, b) => a - b) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    // Replace arr[j] > key with compareFn(arr[j], key) > 0
    while (j >= 0 && compareFn(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Sort descending:
insertionSortWithComparator([3, 1, 4, 1, 5], (a, b) => b - a); // [5, 4, 3, 1, 1]

// Sort strings by length:
insertionSortWithComparator(['banana', 'fig', 'kiwi', 'apple'], (a, b) => a.length - b.length);
// ['fig', 'kiwi', 'apple', 'banana']
```

This pattern — passing behavior as a function — is the same pattern you'll use with `Array.prototype.sort` in Lesson B.

---

## Common mistakes and how to fix them

### Mistake 1: Inner loop goes one step too far

```javascript
// BUGGY: inner loop bound is wrong
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i; j++) {  // BUG: should be n - 1 - i
      if (arr[j] > arr[j + 1]) {        // arr[n-1+1] = arr[n] = undefined!
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

When `j = n - 1 - i` (the last valid j for this pass), the loop still runs because `j < n - i` is true. It then accesses `arr[n - i]` which may be out of bounds or already-settled, and `arr[j + 1]` could be `undefined`. The comparison `arr[j] > undefined` is `false`, so no swap happens, but the access itself is a latent bug. Fix: change `n - i` to `n - 1 - i`.

### Mistake 2: Forgetting to save the key before shifting

```javascript
// BUGGY: key is never saved, gets overwritten
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    while (j >= 0 && arr[j] > arr[i]) {  // BUG: should compare arr[j] > key
      arr[j + 1] = arr[j];                // this overwrites arr[i] when j+1 == i
      j--;
    }
    arr[j + 1] = arr[i];                  // arr[i] has been corrupted
  }
  return arr;
}
```

On the first iteration where a shift occurs, `arr[j + 1] = arr[j]` writes to index `i` (since `j = i - 1` initially), destroying the original value. By the time we try to place `arr[i]`, it's already been overwritten. Fix: `const key = arr[i]` before the while loop, use `key` everywhere you'd use `arr[i]`.

### Mistake 3: isSorted using the wrong comparison direction or bounds

```javascript
// BUGGY: wrong comparison, and loop goes out of bounds
function isSorted(arr) {
  for (let i = 0; i <= arr.length; i++) {  // BUG: <= instead of <, will read arr[length]
    if (arr[i] < arr[i + 1]) return false; // BUG: wrong direction — this finds descending order
  }
  return true;
}
```

Two bugs: `i <= arr.length` causes the loop to access `arr[arr.length]` which is `undefined`, and the `undefined` comparisons may not throw an error but will produce wrong results. Second, `arr[i] < arr[i + 1]` returns false when the array is ascending — it's checking the wrong condition. An ascending sorted array should return `true`, but this would return `false` at the first pair where `arr[i] < arr[i+1]` (which is every pair in a sorted array). Fix: `i < arr.length - 1` and `arr[i] > arr[i + 1]`.

---

## Connection to interview problems

Sorting algorithms are a gateway to several classic interview problem patterns:

**"Sort then use two pointers"** — Problems like "Two Sum II" (sorted array), "3Sum," and "Container With Most Water" often involve sorting the input first, then applying a two-pointer scan. The O(n log n) sort cost is usually acceptable.

**"Find the kth largest element"** — One approach: sort descending, return index k-1. Better approach: QuickSelect (average O(n)). Knowing why O(n log n) sort is a baseline lets you appreciate when a faster algorithm matters.

**"Nearly sorted array" problems** — If an input is guaranteed to be "almost sorted" (each element at most k positions from its final place), insertion sort runs in O(nk), which is O(n) when k is small. This knowledge appears directly in interview questions.

**Custom comparators** — LeetCode 179 ("Largest Number") requires sorting strings using a custom comparator: compare "9" + "90" vs "90" + "9" to decide ordering. The comparator pattern from Lesson B today is exactly what you'd implement.

---

## Discussion questions

1. Insertion sort is O(n²) worst case, but experienced developers often use it in production for small arrays. What properties make it practical despite the poor asymptotic complexity? Can you think of a situation where you'd specifically choose insertion sort over a faster algorithm?

2. Both bubble sort and insertion sort are "stable" — they preserve the original order of equal elements. Why does stability matter? Give a concrete example where two sort operations (first by one key, then by another) would produce different results depending on whether the sort is stable.

3. The `swapped` flag gives bubble sort O(n) best case on an already-sorted input. Does the same early exit help on a nearly-sorted input? Trace through `[1, 2, 4, 3, 5]` to see how many passes bubble sort makes with and without the optimization.

4. Both algorithms sort in place. What are the trade-offs between in-place sorting (O(1) space) and out-of-place sorting (O(n) space)? When would you accept the higher memory cost to avoid mutating the original array?

---

## Further exploration

- **Tim sort**: the hybrid algorithm used in Python (`sorted()`, `.sort()`) and Java (`Arrays.sort()` for objects). It combines merge sort's O(n log n) with insertion sort's efficiency on small/nearly-sorted inputs. Wikipedia has a readable description of how "runs" are detected and merged.
- **Sorting networks**: a fixed sequence of compare-and-swap operations (hardwired, not data-dependent) that sorts any input. Used in hardware and parallel algorithms. For n=4, an optimal sorting network needs only 5 comparisons.
- **Stability in practice**: JavaScript's `Array.prototype.sort` is required to be stable as of ES2019. Before that, implementations varied. The MDN documentation on `Array.prototype.sort` notes the history.
