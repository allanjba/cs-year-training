# Day 15 — Lesson A (Foundations): Sorting Algorithms

## Why this matters

Every application that presents data to a user involves sorting: search results by relevance, products by price, messages by time, leaderboards by score. Sorting is also a prerequisite for many other algorithms — binary search requires a sorted array, and many interview problems become straightforward once the input is sorted.

But more than just knowing how to call a sort function, understanding how sorting works at the mechanical level gives you a window into one of the most important ideas in algorithm analysis: why nested loops cost O(n²), what it means for an algorithm to be "in-place," and why there's a theoretical lower bound on how fast any comparison-based sort can be.

Today you'll implement two classic O(n²) sorting algorithms from scratch. They're not what production code uses, but building them by hand forces you to think clearly about loop boundaries, swapping, and what "making progress" means for an algorithm.

---

## The core concept

A sorting algorithm is a systematic procedure for rearranging elements into order. All comparison-based algorithms work by asking the same question repeatedly: "Is A greater than B?" They differ in *which pairs they compare* and *what they do with the answer*.

The key insight that makes sorting tractable: you don't need to compare every element to every other element to get a sorted result. Each comparison gives you information — it reduces the set of possible orderings. A clever algorithm extracts maximum information from each comparison.

Both algorithms today sort **in place** (they modify the array directly, using O(1) extra space) and can sort in ascending or descending order by changing the comparison.

---

## How it works (with hand trace)

### Bubble Sort

**The idea:** Walk through the array repeatedly. Each pass, compare adjacent pairs — if the left is greater than the right, swap them. The largest unsorted element "bubbles" to its correct position at the end of each pass. After k passes, the last k elements are in their final positions.

**Hand trace on `[5, 2, 8, 1, 9, 3]`:**

```
Pass 1: compare adjacent pairs, swap when left > right
  [5, 2, 8, 1, 9, 3]  → compare 5,2: swap  → [2, 5, 8, 1, 9, 3]
  [2, 5, 8, 1, 9, 3]  → compare 5,8: ok    → [2, 5, 8, 1, 9, 3]
  [2, 5, 8, 1, 9, 3]  → compare 8,1: swap  → [2, 5, 1, 8, 9, 3]
  [2, 5, 1, 8, 9, 3]  → compare 8,9: ok    → [2, 5, 1, 8, 9, 3]
  [2, 5, 1, 8, 9, 3]  → compare 9,3: swap  → [2, 5, 1, 8, 3, 9]
  After pass 1: [2, 5, 1, 8, 3, 9]  ← 9 is in final position

Pass 2: only go up to index 4 (last position already settled)
  compare 2,5: ok
  compare 5,1: swap  → [2, 1, 5, 8, 3, 9]
  compare 5,8: ok
  compare 8,3: swap  → [2, 1, 5, 3, 8, 9]
  After pass 2: [2, 1, 5, 3, 8, 9]  ← 8, 9 settled

Pass 3:
  compare 2,1: swap  → [1, 2, 5, 3, 8, 9]
  compare 2,5: ok
  compare 5,3: swap  → [1, 2, 3, 5, 8, 9]
  After pass 3: [1, 2, 3, 5, 8, 9]  ← 5, 8, 9 settled

Pass 4:
  compare 1,2: ok
  compare 2,3: ok
  No swaps! Array is sorted. (Early exit optimization: if no swaps in a pass, done.)
  After pass 4: [1, 2, 3, 5, 8, 9]  ✓
```

Notice: the inner loop shrinks by 1 each pass. After pass k, the last k elements are guaranteed sorted. The early-exit optimization (stop if no swaps occurred) makes bubble sort O(n) on an already-sorted array.

---

### Insertion Sort

**The idea:** Think of sorting a hand of playing cards. Start with the first card — a hand of 1 is trivially sorted. Pick up each new card and slide it left into the correct position among the cards you're already holding. The left portion of the array is always sorted; you're extending that sorted portion one element at a time.

**Hand trace on `[5, 2, 8, 1, 9, 3]`:**

```
Start: sorted portion = [5], unsorted = [2, 8, 1, 9, 3]

Step 1: pick up 2. Slide left past 5 (5 > 2, shift 5 right). Insert 2.
  [2, 5, 8, 1, 9, 3]  sorted: [2, 5]

Step 2: pick up 8. 5 < 8, stop. Insert 8 in place.
  [2, 5, 8, 1, 9, 3]  sorted: [2, 5, 8]

Step 3: pick up 1. Slide left past 8 (shift right), 5 (shift right), 2 (shift right). Insert at start.
  [1, 2, 5, 8, 9, 3]  sorted: [1, 2, 5, 8]
  Wait — let's be precise:
  key = 1
  8 > 1 → shift 8 right: [2, 5, 8, 8, 9, 3] (conceptually)
  5 > 1 → shift 5 right: [2, 5, 5, 8, 9, 3]
  2 > 1 → shift 2 right: [2, 2, 5, 8, 9, 3]
  no more elements → place key at index 0: [1, 2, 5, 8, 9, 3]
  sorted: [1, 2, 5, 8]

Step 4: pick up 9. 8 < 9, stop. Insert in place.
  [1, 2, 5, 8, 9, 3]  sorted: [1, 2, 5, 8, 9]

Step 5: pick up 3. Slide left past 9, 8, 5 (each shifts right). 2 < 3, stop. Insert after 2.
  key = 3
  9 > 3 → shift: [1, 2, 5, 8, 9, 9]
  8 > 3 → shift: [1, 2, 5, 8, 8, 9]
  5 > 3 → shift: [1, 2, 5, 5, 8, 9]
  2 < 3 → stop, place at index 2: [1, 2, 3, 5, 8, 9]
  sorted: [1, 2, 3, 5, 8, 9]  ✓
```

Key difference from bubble sort: insertion sort **shifts** elements right to make room (rather than swapping adjacent pairs). This tends to do fewer writes, which matters on real hardware.

---

## Code implementation

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // Inner loop: only go up to n - 1 - i because the last i elements are settled
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap adjacent elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // Early exit: if no swaps happened, array is already sorted
    if (!swapped) break;
  }
  return arr;
}

function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i]; // The element we're placing
    let j = i - 1;
    // Shift elements right until we find where key belongs
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]; // Shift right
      j--;
    }
    arr[j + 1] = key; // Place key in its correct position
  }
  return arr;
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}
```

A few things to notice about this implementation:

- Both functions **mutate the input array** and return it. This allows chaining like `isSorted(bubbleSort(arr))`, but callers should be aware the original array is modified. If you need to preserve the original, pass a copy: `bubbleSort([...arr])`.
- The outer loop of bubble sort runs `n - 1` times maximum, but the `swapped` flag means it may exit far earlier on nearly-sorted data.
- In insertion sort, the `while` loop exits as soon as it finds an element that is not greater than `key`. On sorted data, this immediately: that's why insertion sort's best case is O(n).

---

## Common pitfalls

**Off-by-one in bubble sort's inner loop.** The inner loop must stop at `n - 1 - i`, not `n - i` or `n - 1`. If you go to `n - 1`, you compare `arr[n-2]` with `arr[n-1]` which is valid, but you're re-checking positions that are already sorted. More critically, if you go to `n`, you'll access `arr[n]` which is `undefined` — a silent bug that produces wrong results.

**Missing the `swapped` flag.** Bubble sort without early exit still works correctly, but it silently degrades to O(n²) even on sorted input. The `swapped` flag is what gives bubble sort its O(n) best case.

**Forgetting to save the key in insertion sort.** The classic mistake is doing `arr[j + 1] = arr[j]` in the while loop before saving `arr[i]` to `key`. By the time the loop finishes, `arr[i]` has been overwritten. Save `key = arr[i]` before the loop begins.

**Mutating vs. returning.** Both algorithms sort in place, so callers who want the original array untouched must pass a copy. This is a common source of bugs in production code — the function silently modifies data the caller still references.

---

## Computer Science foundations

**Why O(n²)?** Both algorithms have two nested loops. The outer loop runs O(n) times. The inner loop runs O(n) times in the worst case. Together: O(n) × O(n) = O(n²). For an array of 10,000 elements, that's up to 100,000,000 operations. For 100,000 elements: 10,000,000,000. This doesn't scale.

**Space complexity: O(1).** No extra arrays are allocated — both algorithms work purely by rearranging elements within the original array. The only extra variables are the loop counters and the temporary `key` in insertion sort.

**Best case analysis:**
- Bubble sort (with early exit): O(n) — on an already-sorted array, one pass makes no swaps, and the algorithm exits immediately.
- Insertion sort: O(n) — the inner `while` loop never executes because each element is already in the right place.
- Bubble sort without early exit: O(n²) regardless — it always runs all passes.

**Why insertion sort is generally faster in practice than bubble sort (despite same asymptotic complexity):** Bubble sort's inner loop always runs to `n - 1 - i` regardless of whether the data is sorted. Insertion sort's inner loop exits as soon as it finds the right position, so on partially-sorted data it does far less work. Insertion sort also does fewer swaps (shifts instead), which reduces memory writes.

**The comparison-based sorting lower bound.** Any algorithm that can only sort by comparing pairs of elements must make at least O(n log n) comparisons in the worst case. This is a proven mathematical lower bound, derived from information theory: there are n! possible orderings of n elements, and each comparison can only cut the remaining possibilities in half. So you need at least log₂(n!) comparisons, which by Stirling's approximation is Θ(n log n). This means no comparison-based algorithm can be faster than O(n log n) — bubble sort and insertion sort's O(n²) is genuinely worse, not just differently implemented.

---

## Real-world applications

**When O(n²) is fine in practice.** Insertion sort is used inside real sorting libraries (including V8, Node's JavaScript engine) for small arrays — typically n < 10-20. The reason: O(n log n) algorithms like merge sort have overhead (recursive calls, extra memory allocation) that makes them slower than insertion sort for tiny inputs. Tim sort, the algorithm used in Python and Java, switches to insertion sort for small subarrays.

**Already-sorted data is common.** Many real datasets are nearly sorted: logs accumulating in time order, a leaderboard where only a few scores change each day, a sorted list with a few new items appended. Insertion sort's O(n) best case means it handles these efficiently, while a naive implementation of merge sort would still do all its work.

**Comparators and custom ordering.** The logic of comparison-based sorting extends directly to custom comparators — the predicate that determines ordering. You'll build on this in Lesson B today, where you'll use JavaScript's built-in sort with custom comparators to sort products in multiple ways.

---

## Before the exercise

Make sure you can answer these before coding:

1. In bubble sort's inner loop, why does the upper bound shrink by 1 each outer pass?
2. In insertion sort, what exactly does "shifting right" mean — which array index gets overwritten and with what?
3. What is `isSorted` checking? What should it return for an empty array or single-element array?
4. Both functions sort in place. If you want to preserve the original, what do you pass in?

The exercise gives you `[5, 2, 8, 1, 9, 3]` as sample data. Trace through both algorithms by hand before running your code to verify.
