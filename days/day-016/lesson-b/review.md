## Day 016 — Lesson B Review: Merging Sorted Event Logs

### What you should have learned

1. **The merge step is domain-agnostic**: The same two-pointer logic from Lesson A works unchanged on log objects — only the comparison changes from `left[i] <= right[j]` to `logs1[i].timestamp <= logs2[j].timestamp`. The algorithm is the same.
2. **Stability across sources matters**: Using `<=` means same-timestamp entries from `logs1` come before entries from `logs2`. This preserves the caller's implied ordering of sources and matches the behavior of Lesson A's stable merge.
3. **`reduce` composes pairwise merges elegantly**: `logArrays.reduce(mergeSortedLogs)` calls `mergeSortedLogs(accumulated, next)` for each additional log array — no explicit loop needed. The initial accumulator is the first element, and each call extends the merged result.
4. **Empty input requires a guard**: `[].reduce(fn)` with no initial value throws. Always check `logArrays.length === 0` and return `[]` before calling reduce.
5. **Objects are shared by reference**: `result.push(logs1[i++])` pushes the original entry — not a copy. The merged array and the source arrays share the same objects. This is efficient and correct as long as entries are not mutated after merging.

---

### Reviewing your implementation

#### Function 1: `mergeSortedLogs(logs1, logs2)`

```js
function mergeSortedLogs(logs1, logs2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < logs1.length && j < logs2.length) {
    if (logs1[i].timestamp <= logs2[j].timestamp) {
      result.push(logs1[i++]);
    } else {
      result.push(logs2[j++]);
    }
  }

  while (i < logs1.length) result.push(logs1[i++]);
  while (j < logs2.length) result.push(logs2[j++]);

  return result;
}

const mergedAB = mergeSortedLogs(serverA, serverB);
// timestamps: 1000, 1010, 1020, 1030, 1050, 1060, 1090, 1100
```

**Key insights:**
- Structurally identical to `merge(left, right)` from Lesson A. Recognizing this is the point — a reusable pattern adapts to new domains by changing only the comparison expression.
- Both remainder loops are needed. If `serverA` has a later entry than all of `serverB`, the first remainder loop runs. If `serverB` is longer, the second runs.
- Pushing object references (not clones) is correct here. Log entries are treated as immutable values — there's no need to defensively copy them.

**Edge cases handled:**
- One empty → the main loop never runs; the non-empty array's remainder loop runs
- Both empty → main loop and both remainder loops are skipped; returns `[]`
- All same timestamp → taken from `logs1` first (stability via `<=`)

---

#### Function 2: `mergeAllLogs(logArrays)`

```js
function mergeAllLogs(logArrays) {
  if (logArrays.length === 0) return [];
  return logArrays.reduce((merged, next) => mergeSortedLogs(merged, next));
}

mergeAllLogs([serverA, serverB, serverC]);
// All 12 entries in timestamp order:
// 1000 A, 1005 C, 1010 B, 1020 A, 1030 B, 1040 C,
// 1050 A, 1060 B, 1070 C, 1090 B, 1100 A, 1110 C

mergeAllLogs([]);         // []
mergeAllLogs([serverA]);  // serverA entries only (reduce returns the single element)
```

**Key insights:**
- `reduce` without an initial value uses the first element as the accumulator. For `[A, B, C]`: first call is `mergeSortedLogs(A, B)` → `AB`; second call is `mergeSortedLogs(AB, C)` → `ABC`.
- For a single-element array, `reduce` returns the element without calling the callback at all — correct behavior.
- This is O(n × k) where n is total entries and k is number of logs. Each reduce step merges into a growing accumulated array. Acceptable for small k; use divide-and-conquer or a heap for large k.

**Edge cases handled:**
- Empty array → guard returns `[]` before reduce runs
- Single log → reduce returns it unchanged
- Logs already merged → subsequent merge with empty array is harmless

---

### Going deeper

#### Extension 1: Divide-and-conquer merge for O(n log k)

The reduce approach merges into a growing array, making each step more expensive. The divide-and-conquer approach merges pairs at each level, keeping all merges balanced:

```js
function mergeAllLogsDivide(logArrays) {
  if (logArrays.length === 0) return [];
  if (logArrays.length === 1) return logArrays[0];

  const mid = Math.floor(logArrays.length / 2);
  const left  = mergeAllLogsDivide(logArrays.slice(0, mid));
  const right = mergeAllLogsDivide(logArrays.slice(mid));
  return mergeSortedLogs(left, right);
}
```

This mirrors `mergeSort` from Lesson A exactly — but operating on an array of log arrays rather than an array of elements. At each level of the recursion tree, the total merge work is O(n). With O(log k) levels, total is O(n log k). For k=1000 servers with 1M entries, that's ~20M operations vs ~1B with reduce.

#### Extension 2: Filter merged logs by time range

Once merged, you often want only the events within an incident window. Instead of filtering after merging, you can filter during the remainder appends for a small optimization — but the clean approach is post-merge filtering:

```js
function mergeLogsInRange(logs1, logs2, startTs, endTs) {
  return mergeSortedLogs(logs1, logs2)
    .filter(entry => entry.timestamp >= startTs && entry.timestamp <= endTs);
}

// Find all events between timestamps 1020 and 1060:
mergeLogsInRange(serverA, serverB, 1020, 1060);
// [{ts:1020,A,"Request received"}, {ts:1030,B,"Health check OK"},
//  {ts:1050,A,"Request processed"}, {ts:1060,B,"Request received"}]
```

For very large log arrays where only a tiny range is needed, you can binary search for the start position in each sorted input before merging — an O(log n) setup that skips irrelevant entries entirely.

---

### Common mistakes and how to fix them

#### Mistake 1: Using `<` instead of `<=` (breaks source stability)

```js
// WRONG — same-timestamp entries from logs2 come before logs1
function mergeSortedLogs(logs1, logs2) {
  // ...
  while (i < logs1.length && j < logs2.length) {
    if (logs1[i].timestamp < logs2[j].timestamp) {  // BUG: < not <=
      result.push(logs1[i++]);
    } else {
      result.push(logs2[j++]);  // Taken on ties — logs2 wins, not logs1
    }
  }
  // ...
}

mergeSortedLogs(serverA, serverB);
// If both have timestamp 1000, serverB's entry appears first — wrong order
```

**Problem:** On equal timestamps, `logs2[j]` is taken first. If the caller passes logs in priority order (primary server first), the ordering is silently reversed for ties.
**Fix:** `logs1[i].timestamp <= logs2[j].timestamp` — take from `logs1` first on ties.

---

#### Mistake 2: Missing the empty-array guard before reduce

```js
// WRONG — crashes on empty input
function mergeAllLogs(logArrays) {
  return logArrays.reduce((merged, next) => mergeSortedLogs(merged, next));
  // TypeError: Reduce of empty array with no initial value
}

mergeAllLogs([]);  // Throws!
```

**Problem:** `Array.prototype.reduce` with no initial value throws when called on an empty array. There is no first element to use as the accumulator.
**Fix:** Guard with `if (logArrays.length === 0) return [];` before calling reduce. Alternatively, pass `[]` as the second argument to reduce — but then the first iteration is `mergeSortedLogs([], logArrays[0])`, which is correct but wasteful.

---

#### Mistake 3: Merging unsorted input

```js
// WRONG — produces incorrect output when input is not sorted
const unordered = [
  { timestamp: 1050, server: "A", message: "late" },
  { timestamp: 1000, server: "A", message: "early" },  // out of order!
];

mergeSortedLogs(unordered, serverB);
// The two-pointer merge assumes both inputs are sorted.
// With unsorted input, the comparison takes wrong elements at each step,
// producing output that is neither sorted nor complete.
```

**Problem:** The merge algorithm's correctness depends entirely on both inputs being sorted. When an out-of-order element is encountered, the pointer skips past correct elements and appends them in the wrong position.
**Fix:** Sort each log array before passing it to merge, or validate inputs are sorted in debug mode. In production, trust that log sources write in order, and flag any out-of-order timestamp as a bug in the log producer.

---

### Connection to interview problems

- **LeetCode 23 — Merge k Sorted Lists**: The k-way merge problem on linked lists. The `mergeAllLogs` pattern applies directly — the two-pointer merge for two lists is the same algorithm, just on nodes instead of array indices. The optimal solution uses a min-heap (priority queue).
- **LeetCode 88 — Merge Sorted Array**: Merge two sorted arrays in-place into the first array. Same two-pointer logic, but iterating from the back to avoid overwriting.
- **LeetCode 21 — Merge Two Sorted Lists**: Merge two sorted linked lists. The same comparison logic; `result.next = ...` instead of `result.push(...)`.
- **LeetCode 315 — Count of Smaller Numbers After Self**: Uses an augmented merge step (like the inversion-counting extension in Lesson A) — the same connection between merging and counting cross-array relationships.

---

### Discussion questions

1. **`mergeAllLogs` using `reduce` is O(n × k). At what value of k would you switch to the divide-and-conquer approach?** The pairwise merge makes each step more expensive because the accumulated array grows. For k=2 they're the same; for k=10 the difference is small; for k=100+ the divide-and-conquer approach is meaningfully faster. In practice, the heap-based k-way merge is preferred for k > ~10.

2. **The merged result shares object references with the source arrays. Is this a bug or a feature?** It's a deliberate design choice. Log entries are typically treated as immutable records — you read them, filter them, display them, but don't mutate them. Sharing references avoids copying potentially large objects and keeps memory usage low. If entries could be mutated, you'd need to `structuredClone` each entry before pushing.

3. **`mergeAllLogs([serverA])` returns `serverA` directly (the reduce returns the single element without calling the callback). Is this correct behavior?** Yes — a single sorted log is already merged. However, this means the returned array IS `serverA`, not a copy. If the caller mutates the returned array, they mutate `serverA`. Adding `.slice()` to the guard cases would make the behavior consistent (always returns a new array).

4. **This lesson's `mergeSortedLogs` and Lesson A's `merge` are almost identical. When does code duplication make sense vs. extracting a shared helper?** Here the duplication is intentional for learning — you see the same pattern applied in a new domain. In production, you'd write one generic merge function: `merge(arr1, arr2, compareFn)` where `compareFn` is `(a, b) => a - b` for numbers or `(a, b) => a.timestamp - b.timestamp` for logs. This is how JavaScript's `sort` works — the algorithm is fixed, the comparison is injected.

---

### Further exploration

- **Heap-based k-way merge**: For merging k sorted streams where k is large, a min-heap allows popping the global minimum in O(log k) per element, giving O(n log k) total. `@datastructures-js/priority-queue` on npm provides a heap in JavaScript. Implement `mergeAllLogsHeap` as an exercise.
- **LevelDB and RocksDB SSTables**: These key-value stores organize data in sorted "levels." Compaction merges sorted files at one level into the next — exactly this pattern, operating on disk rather than RAM. The merge step is the core of their write amplification tradeoff.
- **Apache Kafka consumer groups**: When multiple partitions each have ordered events, the consumer must merge them by offset or timestamp. Kafka's consumer API exposes this problem; the solution is the same two-pointer merge generalized to k sources.
