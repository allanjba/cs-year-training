# Day 16 — Lesson B (Applied): Merging Sorted Event Logs

## Why this matters

Modern systems run on many servers simultaneously. Each server writes its own log file in timestamp order. When you need to investigate an incident — or build a monitoring dashboard — you need a single unified log stream sorted by time. You can't just concatenate logs: server A might have written events at 10:01 and 10:03, server B at 10:02 and 10:04, and a naive concat would put all of A's events before any of B's.

The solution is the **merge step from Lesson A**, applied directly: each server's log is already sorted. Merge them the same way you merge two sorted arrays. This pattern appears constantly in production systems — Kafka consumers, distributed tracing (Zipkin, Jaeger), and database query execution all perform this operation at scale.

---

## The core concept

You have `N` arrays of log entries, each sorted by timestamp. You need one merged array, also sorted by timestamp.

For two logs: apply `merge(left, right)` from Lesson A directly. The comparison changes from `left[i] <= right[j]` (numbers) to `left[i].timestamp <= right[j].timestamp` (objects compared by field).

For more than two logs: there are two strategies:
1. **Reduce pairwise**: merge logs[0] with logs[1], then merge result with logs[2], etc. Simple to implement.
2. **Divide and conquer**: merge pairs at each level, like merge sort's tree. Better for very large `N` because the total work is O(n log k) where `n` is total entries and `k` is the number of logs.

Today you'll implement both.

---

## How it works (with hand trace)

**Server logs:**
```
serverA: [{ts: 1, msg: "start"}, {ts: 3, msg: "ok"}, {ts: 5, msg: "done"}]
serverB: [{ts: 2, msg: "boot"}, {ts: 4, msg: "ping"}]
```

**`mergeSortedLogs(serverA, serverB)` — same two-pointer logic as Lesson A:**

```
i=0  j=0:  ts 1 vs ts 2 → take A[0] {ts:1}  → result = [{ts:1}]
i=1  j=0:  ts 3 vs ts 2 → take B[0] {ts:2}  → result = [{ts:1},{ts:2}]
i=1  j=1:  ts 3 vs ts 4 → take A[1] {ts:3}  → result = [{ts:1},{ts:2},{ts:3}]
i=2  j=1:  ts 5 vs ts 4 → take B[1] {ts:4}  → result = [{ts:1},{ts:2},{ts:3},{ts:4}]
B exhausted → append remaining A: [{ts:5}]
Result: [{ts:1},{ts:2},{ts:3},{ts:4},{ts:5}]  ✓
```

**`mergeAllLogs([serverA, serverB, serverC])` via reduce:**

```
step 1: merge(serverA, serverB) → AB (sorted)
step 2: merge(AB, serverC)       → ABC (sorted)
return ABC
```

The reduce approach is clean and sufficient for a small number of servers.

---

## Code implementation

```javascript
const serverA = [
  { timestamp: 1000, server: "A", message: "Server started" },
  { timestamp: 1020, server: "A", message: "Request received" },
  { timestamp: 1050, server: "A", message: "Request processed" },
];

const serverB = [
  { timestamp: 1010, server: "B", message: "Server started" },
  { timestamp: 1030, server: "B", message: "Health check OK" },
  { timestamp: 1060, server: "B", message: "Request received" },
];

function mergeSortedLogs(logs1, logs2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < logs1.length && j < logs2.length) {
    // Use <= for stability: same-timestamp entries from logs1 come first
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

function mergeAllLogs(logArrays) {
  if (logArrays.length === 0) return [];
  return logArrays.reduce((merged, next) => mergeSortedLogs(merged, next));
}
```

Notice how `mergeSortedLogs` is structurally identical to Lesson A's `merge` — only the comparison changes from `left[i] <= right[j]` (comparing numbers) to `logs1[i].timestamp <= logs2[j].timestamp` (comparing a field of objects).

---

## Common pitfalls

**Forgetting to sort input logs before merging.** `mergeSortedLogs` requires both inputs to already be sorted by timestamp. If a server's log file was written out of order (which can happen with async writes), you must sort each log array first. The merge step only works correctly on pre-sorted input.

**Mutating the input arrays.** Each `result.push(logs1[i++])` pushes the original object reference — the entry itself is not copied. This is correct and efficient (no deep cloning needed), but it means the merged result shares objects with the originals. If callers mutate entries after merging, both the original and merged arrays are affected.

**Wrong reduce behavior on empty input.** `[].reduce(fn)` with no initial value throws `TypeError: Reduce of empty array with no initial value`. Guard with `if (logArrays.length === 0) return [];` before calling reduce, or pass `[]` as the initial accumulator (then every log array gets one extra merge with `[]`, which is harmless but slightly wasteful).

**Using strict equality (`===`) for timestamp ties.** With `<=`, same-timestamp events from `logs1` come before same-timestamp events from `logs2`, preserving the server order you passed in. With `<`, same-timestamp events from `logs2` come first — the merge is no longer stable across log sources.

---

## Computer Science foundations

**This is the merge step from merge sort.** The only change is comparing `timestamp` fields instead of bare numbers. The time complexity is the same: O(n + m) where n and m are the lengths of the two input logs.

**`mergeAllLogs` with reduce is O(n × k)** where n is the total number of entries and k is the number of log sources. Each reduce step merges into a growing accumulated array. The k-th merge is O(n), and there are k−1 merges: total O(n × k).

**The divide-and-conquer approach is O(n log k).** Merge logs in pairs: [A,B], [C,D], ... → then merge the results: [AB, CD], ... This halves the number of arrays at each level. With log₂(k) levels and O(n) work per level, the total is O(n log k). For k=1000 servers with 1M entries, this is the difference between 1,000,000,000 and 20,000,000 comparisons.

**Heap-based k-way merge is also O(n log k).** Instead of pairwise merges, maintain a min-heap of size k — always pop the smallest front element, push the next element from the same source. This is how production systems (Kafka consumers, LevelDB, Cassandra) merge sorted streams from many sources.

---

## Real-world applications

**Distributed log aggregation.** Tools like Elasticsearch's fleet logs, Splunk, and Datadog ingest log streams from thousands of servers. The merge step is the core operation for producing a unified time-sorted view.

**Database merge joins.** When two tables are both sorted on a join key, the database engine can join them in O(n + m) using the same two-pointer merge. No hash table needed. This is called a "sort-merge join" and appears in every major RDBMS.

**Git conflict resolution.** When two branches modify overlapping regions of a file, Git's merge algorithm aligns them by line number — a variation of the two-pointer merge, with conflict markers inserted where the sequences diverge.

**Streaming data pipelines.** Apache Flink and Apache Beam process event streams with out-of-order timestamps. The "watermark" mechanism establishes when a window is closed, then merges buffered events in timestamp order using exactly this pattern.

---

## Before the exercise

Make sure you can answer these before coding:

1. `mergeSortedLogs` uses `logs1[i].timestamp <= logs2[j].timestamp`. What happens to same-timestamp events from two different servers if you use `<` instead of `<=`?
2. After the main while loop in `mergeSortedLogs`, you have two remainder loops. Can both execute for a single call? Which one runs when `logs1` is longer?
3. `mergeAllLogs([A, B, C])` calls `reduce`. What is the accumulated value after the first reducer invocation? After the second?
4. If `logArrays = []`, what does `logArrays.reduce(mergeSortedLogs)` throw? How does the guard clause prevent this?
5. `mergeSortedLogs` pushes original object references into `result`. If you later do `result[0].message = "modified"`, does `serverA[0].message` change? Why?
