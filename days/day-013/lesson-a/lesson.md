## Day 013 — Lesson A (Foundations): Binary Search

### Why this matters

Every technique you've built this week — running totals, sliding window, two pointers — scans through an array once, touching every element. They're all O(n). Binary search is different: it finds an answer in O(log n) by *never scanning*. Instead of looking at every element, it cuts the search space in half with each step.

Consider searching a phone book for "Smith." You don't start at page 1 and read every name. You open to the middle. If "Smith" comes after what you find, discard the first half entirely and open to the middle of the second half. Repeat until you find the name or run out of pages. A 1,000-page phone book takes at most 10 such steps (2^10 = 1,024 > 1,000). A 1,000,000-page directory takes at most 20 steps.

This logarithmic growth is extraordinarily powerful:

| n (array size) | O(n) steps | O(log n) steps |
|----------------|-----------|----------------|
| 1,000          | 1,000     | 10             |
| 1,000,000      | 1,000,000 | 20             |
| 1,000,000,000  | 1 billion | 30             |

Thirty steps to search a billion-element sorted array. Binary search is behind every search autocomplete, every database index lookup, every sorted set query, and countless standard library implementations. It's one of the most important algorithms in computing.

### The core concept

Binary search works only on **sorted data**. This is the prerequisite: if the data isn't sorted, binary search gives wrong answers. You'd need to sort first (O(n log n)) or use a linear scan (O(n)).

The algorithm maintains a search region defined by two indices: `low` and `high`. Initially, the entire array is the search region. At each step:

1. Find the midpoint `mid = Math.floor((low + high) / 2)`
2. Compare `target` with `array[mid]`:
   - If equal: found it — return `mid`
   - If `target > array[mid]`: the target must be in the right half — discard the left half (`low = mid + 1`)
   - If `target < array[mid]`: the target must be in the left half — discard the right half (`high = mid - 1`)
3. If `low > high`, the target isn't in the array — return `null`

The invariant: the target, if it exists, is always somewhere in `array[low..high]`. Each step either finds the target or provably eliminates half the remaining candidates.

```
sorted: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
indices: 0  1  2   3   4   5   6   7   8   9
target: 23

low=0, high=9 → mid=4 → array[4]=16 < 23 → discard left half
low=5, high=9 → mid=7 → array[7]=56 > 23 → discard right half
low=5, high=6 → mid=5 → array[5]=23 === 23 → FOUND at index 5
```

Three steps to search 10 elements. Linear scan would have taken 6 steps in the worst case.

### How it works

Let's trace `binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 38)` step by step:

```
Initial:
  low=0, high=9

Iteration 1:
  mid = floor((0+9)/2) = 4
  array[4] = 16  <  38 → discard left half
  low = 5

Iteration 2:
  low=5, high=9
  mid = floor((5+9)/2) = 7
  array[7] = 56  >  38 → discard right half
  high = 6

Iteration 3:
  low=5, high=6
  mid = floor((5+6)/2) = 5
  array[5] = 23  <  38 → discard left half
  low = 6

Iteration 4:
  low=6, high=6
  mid = floor((6+6)/2) = 6
  array[6] = 38  ===  38 → FOUND at index 6
```

Now trace a *miss* — `binarySearch([2, 5, 8, 12, 16], 9)`:

```
low=0, high=4 → mid=2 → array[2]=8 < 9 → low=3
low=3, high=4 → mid=3 → array[3]=12 > 9 → high=2
low=3, high=2 → low > high → NOT FOUND → return null
```

The loop terminates because `low` exceeds `high` — the search region has become empty.

### Code implementation

```js
function binarySearch(sortedArray, target) {
  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = sortedArray[mid];

    if (midValue === target) return mid;
    if (midValue < target) {
      low = mid + 1;    // target is in the right half
    } else {
      high = mid - 1;   // target is in the left half
    }
  }

  return null;   // target not found
}

console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23));   // 5
console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 38));   // 6
console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 9));    // null
console.log(binarySearch([], 5));                                         // null
console.log(binarySearch([7], 7));                                        // 0
console.log(binarySearch([7], 8));                                        // null
```

**Breaking it down:**

- `let low = 0; let high = sortedArray.length - 1` — the full array is the initial search region
- `while (low <= high)` — continue while there are elements to examine; `low > high` means the region is empty
- `Math.floor((low + high) / 2)` — integer midpoint (we can't index 3.5 into an array)
- `midValue < target → low = mid + 1` — everything from `low` to `mid` is too small; discard it
- `midValue > target → high = mid - 1` — everything from `mid` to `high` is too large; discard it
- `return null` — target not in array

Now a useful variation — `findInsertPosition`: where would `value` go to keep the array sorted?

```js
function findInsertPosition(sortedArray, value) {
  let low = 0;
  let high = sortedArray.length;   // NOTE: length, not length-1

  while (low < high) {             // NOTE: strict <, not <=
    const mid = Math.floor((low + high) / 2);

    if (sortedArray[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;                  // NOTE: high = mid, not mid-1
    }
  }

  return low;
}

console.log(findInsertPosition([1, 3, 5, 7], 4));   // 2 → [1,3,4,5,7]
console.log(findInsertPosition([1, 3, 5, 7], 0));   // 0 → [0,1,3,5,7]
console.log(findInsertPosition([1, 3, 5, 7], 9));   // 4 → [1,3,5,7,9]
console.log(findInsertPosition([1, 3, 5, 7], 5));   // 2 → inserts before existing 5
console.log(findInsertPosition([], 5));              // 0
```

**Why the variations in `findInsertPosition`?**

- `high = sortedArray.length` (not `length - 1`) — the value could go after the last element
- `while (low < high)` — stops when `low === high` (they've converged on the answer)
- `high = mid` (not `mid - 1`) when the midpoint is too large — the position could be `mid` itself

**Why this works:**

The function finds the leftmost position where `value` could sit. After the loop, `low === high` and every element to the left is `< value`, every element from `low` onward is `>= value`. That's exactly the insertion point.

### Common pitfalls

**1. `while (low <= high)` vs `while (low < high)`**

The standard search uses `low <= high` to ensure the single-element case (`low === high`) is checked. `findInsertPosition` uses `low < high` because it stops when the pointers converge. Using the wrong condition causes missed elements or infinite loops.

**2. `high = mid - 1` vs `high = mid`**

In the standard search: `array[mid] > target` means `mid` itself is not the answer, so `high = mid - 1` safely excludes it. In `findInsertPosition`: `array[mid] >= value` means `mid` *could* be the insertion position, so `high = mid` keeps it in the search region.

**3. Calling `binarySearch` on an unsorted array**

`binarySearch([3, 1, 4, 1, 5], 1)` gives wrong results — the algorithm assumes sortedness and discards half the candidates at each step. If you discard the wrong half, you'll miss elements that are there.

**4. Integer overflow in the midpoint**

`(low + high) / 2` is safe in JavaScript (floating-point arithmetic, no integer overflow for array sizes). In lower-level languages (C, Java), the safe form is `low + Math.floor((high - low) / 2)`. Good practice to know.

### Computer Science foundations

**Time Complexity:** O(log n) — each iteration halves the search space. After k iterations, the remaining region has n / 2^k elements. The loop ends when n / 2^k < 1, i.e., when k > log₂(n). At most ⌈log₂(n)⌉ + 1 iterations.

**Space Complexity:** O(1) iterative — only three variables. A recursive implementation uses O(log n) stack space.

**Why O(log n) is so powerful:**

Logarithms grow so slowly that even for astronomically large inputs, binary search completes in dozens of steps. A sorted list of every grain of sand on Earth (estimated ~7.5 × 10^18) requires at most 62 steps.

**Recursive vs iterative:**

```js
// Recursive version — same logic, different structure
function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return null;
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, high);
  return binarySearchRecursive(arr, target, low, mid - 1);
}
```

Both are O(log n) time. The iterative version is O(1) space; the recursive version is O(log n) space (call stack). Prefer iterative in production.

**Connection to other algorithms:**

- **B-trees**: Database indexes generalize binary search to branching factor > 2 — each node splits the search space not in half but into k parts, reducing disk reads
- **Binary search on the answer**: A meta-technique — binary search over a range of *possible answers* to find the minimum k that satisfies a condition. Used for "find the minimum speed such that all packages arrive on time" problems
- **Merge sort + binary search**: Sort once (O(n log n)), then answer any search query in O(log n). If you'll make many queries on the same data, the sort cost is amortized over all queries

### Real-world applications

- **Database indexes**: B+ trees implement a disk-based form of binary search; every indexed `WHERE id = 42` uses it
- **Git bisect**: Binary searching the commit history to find which commit introduced a bug — literally halves the range at each step
- **Standard libraries**: Python's `bisect`, Java's `Arrays.binarySearch`, C++'s `lower_bound`/`upper_bound`
- **Language runtimes**: V8 (Node.js/Chrome) uses binary search in its garbage collector to find memory regions

### Before the exercise

In the exercise, you'll implement:

1. **`binarySearch(sortedArray, target)`** — find the index of target, or `null` if absent
2. **`findInsertPosition(sortedArray, value)`** — find the index where value should be inserted to keep the array sorted
3. **`searchRange(sortedArray, target)`** — return `[firstIndex, lastIndex]` of all occurrences of target, or `[-1, -1]` if absent

The third function requires running a left-biased and a right-biased binary search. Trace `searchRange([1, 2, 2, 2, 3], 2)` by hand — the answer is `[1, 3]`.
