# Day 17 — Lesson A (Foundations): Sets and Deduplication

## Why this matters

Arrays let you store items in sequence. But arrays make a bad answer to the question "have I seen this before?" — you'd have to scan every element to check membership, making it O(n) per lookup and O(n²) for n lookups. For large datasets — checking whether a user ID has already been processed, whether a tag has already been applied, whether an IP has been seen in a request log — that's too slow.

A **Set** is a data structure built for exactly this question. Sets store unique values, and membership testing (`has`) runs in O(1) — the same cost whether the set contains 10 items or 10 million. This makes Set the right tool any time you need to deduplicate a collection, compute the overlap between two groups, or detect repeated values.

You've been sorting and merging and searching arrays. Today you add a new tool to your toolkit: one that trades the ordered-sequence model of arrays for the O(1)-membership model of sets. Understanding which structure fits which problem is one of the key skills of algorithm design.

---

## The core concept

A **Set** is an unordered collection of unique values. "Unordered" means there's no concept of position — you can't ask for the third item. "Unique" means each value appears at most once — adding a duplicate is a no-op.

The core operations:
- `new Set(iterable)` — construct a set from any iterable (array, string, another set)
- `set.add(value)` — add a value; returns the set (chainable); ignores duplicates
- `set.has(value)` — returns true/false; O(1)
- `set.delete(value)` — removes a value; returns true if it existed, false otherwise
- `set.size` — number of unique values (property, not method)
- `[...set]` or `Array.from(set)` — convert back to an array

JavaScript's `Set` uses a hash table internally. When you call `set.has(x)`, JavaScript hashes `x`, looks up that bucket, and checks if `x` is there — no scanning required. This is why `has` is O(1) regardless of set size.

The key mental model: **use an array when order or position matters, use a Set when uniqueness or membership testing matters.**

---

## How it works (with hand trace)

**Deduplicating an array: `[3, 1, 4, 1, 5, 9, 2, 6, 5, 3]`**

```
new Set([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])

Processing:
  3  → not in set → add → {3}
  1  → not in set → add → {3, 1}
  4  → not in set → add → {3, 1, 4}
  1  → already in set → skip
  5  → not in set → add → {3, 1, 4, 5}
  9  → not in set → add → {3, 1, 4, 5, 9}
  2  → not in set → add → {3, 1, 4, 5, 9, 2}
  6  → not in set → add → {3, 1, 4, 5, 9, 2, 6}
  5  → already in set → skip
  3  → already in set → skip

Result set: {3, 1, 4, 5, 9, 2, 6}
[...set]  = [3, 1, 4, 5, 9, 2, 6]  (insertion order preserved)
```

Note: JavaScript's `Set` preserves insertion order when iterating — the first occurrence of each value determines its position. So `[...new Set(arr)]` deduplicates and preserves the first-seen order.

**Intersection: tags shared by two articles**

```
articlA tags: ["js", "react", "hooks"]
articleB tags: ["react", "hooks", "typescript"]

setA = new Set(["js", "react", "hooks"])
setB = new Set(["react", "hooks", "typescript"])

For each tag in setA: is it in setB?
  "js"    → setB.has("js")    = false → skip
  "react" → setB.has("react") = true  → include
  "hooks" → setB.has("hooks") = true  → include

intersection = ["react", "hooks"]
```

This runs in O(n + m) time: O(n) to build setB, O(m) to iterate setA, O(1) per lookup.

---

## Code implementation

```javascript
// ---- Deduplication ----

function deduplicate(arr) {
  return [...new Set(arr)];
}

deduplicate([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]);
// => [3, 1, 4, 5, 9, 2, 6]
// First occurrence of each value; duplicates removed; order preserved.

// ---- Set operations ----

function intersection(arrA, arrB) {
  const setB = new Set(arrB);
  return arrA.filter(item => setB.has(item));
}

function difference(arrA, arrB) {
  // Items in A that are NOT in B
  const setB = new Set(arrB);
  return arrA.filter(item => !setB.has(item));
}

function union(arrA, arrB) {
  return [...new Set([...arrA, ...arrB])];
}

// Examples:
const a = [1, 2, 3, 4, 5];
const b = [3, 4, 5, 6, 7];

intersection(a, b);  // [3, 4, 5]
difference(a, b);    // [1, 2]      (in a but not b)
union(a, b);         // [1, 2, 3, 4, 5, 6, 7]
```

**Breaking it down:**

`deduplicate`: The `Set` constructor accepts any iterable and automatically discards duplicates. Spread (`[...set]`) converts back to an array. This is a one-liner because `Set` does all the work.

`intersection`: Build a Set from `arrB` (O(m)), then filter `arrA` keeping only items found in `setB`. Each `.has()` call is O(1), so the total is O(n + m).

`difference`: Same structure as intersection but inverted — keep items NOT in `setB`. "A minus B" in set notation.

`union`: Concatenate both arrays, then deduplicate. `[...arrA, ...arrB]` creates a combined array; `new Set(...)` removes duplicates; spread converts back. Order: arrA elements first (in their original order), then arrB elements that weren't already in arrA.

**Why this works:**

Each operation converts one array to a Set so that membership tests are O(1). Without the Set, each `.includes()` call on an array is O(n), turning an O(n + m) operation into O(n × m). For 1000 items each, that's 1000 operations vs 1,000,000.

---

## Common pitfalls

**`Set` equality checks use the same rules as `===`**: `new Set([1, "1"])` contains two distinct elements — the number `1` and the string `"1"`. `NaN` is treated as equal to itself (unlike `===`), so `new Set([NaN, NaN]).size === 1`. Objects are compared by reference, not value: `new Set([{a:1}, {a:1}]).size === 2` because they're two different objects.

**`set.size` is a property, not a method**: Write `set.size`, not `set.size()`. Calling it as a function returns `undefined` (properties aren't callable), which is falsy and will silently break any size-based logic.

**Iterating over a Set gives values, not indices**: `for (const x of set)` works, but `for (let i = 0; i < set.size; i++) set[i]` does not — Sets have no numeric indices. Use `for...of` or `[...set].forEach(...)`.

**`difference(a, b)` is not symmetric**: `difference([1,2,3], [3,4,5])` is `[1,2]` but `difference([3,4,5], [1,2,3])` is `[4,5]`. These are different things. The order of arguments matters.

**`union` may not preserve both arrays' orders perfectly**: Elements appear in the order they're first encountered in `[...arrA, ...arrB]`. All arrA elements come first; arrB elements that are new come after. If you need a different order, sort the result explicitly.

---

## Computer Science foundations

**Hash tables under the hood.** JavaScript's `Set` is implemented as a hash table. Each value is hashed to a bucket index; lookup checks only that bucket. Average case: O(1) per operation. Worst case (many hash collisions): O(n), but this is extremely rare in practice with good hash functions.

**Time complexity of Set operations:**
- `add`, `has`, `delete`: O(1) average
- `new Set(array)`: O(n) — processes each element once
- `intersection(a, b)`: O(n + m) — build Set from b: O(m), filter a: O(n)
- `difference(a, b)`: O(n + m) — same structure
- `union(a, b)`: O(n + m) — concatenate: O(n + m), deduplicate: O(n + m)

**Space complexity: O(n)** — the Set stores each unique value once.

**Comparison with sorted arrays for membership testing.** If your data is already sorted, binary search gives O(log n) membership testing — worse than O(1) but doesn't require O(n) space for the hash table. In practice, hash-based sets win for most use cases; sorted arrays + binary search are preferred when memory is extremely constrained or when you need range queries (e.g., "all items between X and Y").

**The mathematical Set.** Computer science Sets correspond to mathematical sets from set theory: intersection (∩), union (∪), difference (A \ B), symmetric difference (A △ B = (A \ B) ∪ (B \ A)). Set theory underpins relational databases — SQL's `JOIN`, `UNION`, `EXCEPT`, and `INTERSECT` are direct translations of these operations to table rows.

---

## Real-world applications

**Deduplication in data pipelines.** When processing events from a distributed system, the same event can arrive multiple times (network retries, at-least-once delivery). A Set of seen event IDs filters duplicates in O(1) per event — much faster than querying a database or scanning an array.

**Feature flags and permission sets.** A user's permissions are often stored as a Set of permission strings. Checking `permissions.has("admin:write")` is the access control pattern. Intersection of user permissions and required permissions determines what's allowed.

**Visited node tracking in graph traversal.** BFS and DFS algorithms use a Set of visited nodes to avoid revisiting. Without it, traversal loops forever on cycles. Adding and checking visited is the core of every graph traversal algorithm.

**Tag intersection for content recommendations.** "Find articles that share at least 2 tags with this article" — compute the intersection of tag sets, check the size. This is the foundation of collaborative filtering.

---

## Before the exercise

Make sure you can answer these before coding:

1. `new Set([1, 2, 2, 3])` has what `.size`? What does `[...new Set([1, 2, 2, 3])]` produce?
2. Why is `set.has(x)` O(1) but `arr.includes(x)` O(n)? What data structure underlies `Set`?
3. In `intersection(a, b)`, why do you build a `Set` from `b` and filter `a`, rather than building a Set from `a` and filtering `b`? Is there a difference in correctness? In performance?
4. What does `difference([1, 2, 3], [2, 3, 4])` return? What about `difference([2, 3, 4], [1, 2, 3])`? Are they the same?
5. `new Set([{a:1}, {a:1}]).size` is 2, not 1. Why? How would you deduplicate an array of objects by a specific key?
