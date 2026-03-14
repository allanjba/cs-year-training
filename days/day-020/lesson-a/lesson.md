# Day 20 — Lesson A: Hash Maps (Maps) for Frequency, Grouping, and Lookup

## 1. Why This Matters

If you had to pick one data structure that shows up most often in coding interviews, it would be the hash map. Not because interviewers are lazy — because hash maps are genuinely that useful. The ability to turn an O(n²) brute-force algorithm into an O(n) one-pass solution is, more often than not, achieved by trading memory for speed via a hash map.

In production code, maps are equally pervasive. Every caching layer — from a Redis store to a simple in-memory LRU cache — is a map at its core. Analytics systems count events by key. Feature flag systems look up configuration by name. API rate limiters track usage by user ID. In all these cases, the hash map provides O(1) average-case lookup, insertion, and deletion — a fundamental building block that makes nearly everything fast.

JavaScript gives you two options: the plain object (`{}`) and the `Map` class. For a long time, developers used objects as maps by default. But `Map` is strictly better for use as a map: its keys can be any type, it preserves insertion order, it has a dedicated `.size` property, and it never has inherited properties that pollute your key space. Once you understand what `Map` can do, you'll reach for it naturally.

## 2. The Core Concept

A hash map is a key-value store with (amortized) O(1) lookup. Under the hood, a hash function converts a key into an integer index into an array. At that index, the value is stored. Lookup follows the same path: hash the key, go to that index, retrieve the value.

JavaScript's `Map` handles all this for you. You don't need to worry about the hash function or collision resolution. Your job is to think at the algorithmic level: what is the key? what is the value? and how does mapping key → value solve the problem?

Three patterns dominate map usage:

1. **Frequency counting**: key = element, value = how many times it appeared. One pass through the data, O(n) time.
2. **Grouping**: key = category, value = array of elements in that category. One pass, O(n) time.
3. **Complement lookup**: store values you've seen; for each new value, check if its "partner" is already in the map. Classic example: Two Sum.

All three patterns share a structure: iterate the input once, consulting and updating the map as you go. The map is the auxiliary structure that makes the one-pass approach possible.

## 3. How It Works — Hand Trace

**`frequencyMap([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])`:**

```
Start: map = new Map()

i=0: 3  → map has no 3  → map.set(3, 1)          map: {3:1}
i=1: 1  → map has no 1  → map.set(1, 1)          map: {3:1, 1:1}
i=2: 4  → map has no 4  → map.set(4, 1)          map: {3:1, 1:1, 4:1}
i=3: 1  → map has 1 (1) → map.set(1, 2)          map: {3:1, 1:2, 4:1}
i=4: 5  → map has no 5  → map.set(5, 1)          map: {3:1, 1:2, 4:1, 5:1}
i=5: 9  → map has no 9  → map.set(9, 1)          map: {3:1, 1:2, 4:1, 5:1, 9:1}
i=6: 2  → map has no 2  → map.set(2, 1)          map: {..., 2:1}
i=7: 6  → map has no 6  → map.set(6, 1)          map: {..., 6:1}
i=8: 5  → map has 5 (1) → map.set(5, 2)          map: {..., 5:2}
i=9: 3  → map has 3 (1) → map.set(3, 2)          map: {..., 3:2}

Final: Map { 3→2, 1→2, 4→1, 5→2, 9→1, 2→1, 6→1 }
```

**`twoSum([2, 7, 11, 15], 9)`:**

```
target = 9
map = new Map()     // stores: value → index

i=0: val=2, complement=9-2=7
     map.has(7)? No → map.set(2, 0)    map: {2:0}

i=1: val=7, complement=9-7=2
     map.has(2)? YES → return [map.get(2), 1] = [0, 1]
```

Key insight: for each element, check if the number needed to reach `target` (the complement) has already been seen. The map answers this in O(1).

## 4. Code Implementation

```javascript
/**
 * Counts how many times each element appears in an array.
 * Time:  O(n)
 * Space: O(k) where k is the number of distinct elements
 */
function frequencyMap(arr) {
  const map = new Map();

  for (const item of arr) {
    // Get current count (0 if not seen yet), add 1
    map.set(item, (map.get(item) ?? 0) + 1);
  }

  return map;
}
```

The `?? 0` (nullish coalescing) is the idiomatic way to handle the "first time" case. `map.get(item)` returns `undefined` for missing keys; `undefined ?? 0` returns `0`. The whole expression `(map.get(item) ?? 0) + 1` is 1 on first visit, existing count + 1 on subsequent visits.

```javascript
/**
 * Groups array elements by a key computed from each element.
 * The keyFn can return any value — that value becomes the map key.
 *
 * Time:  O(n)
 * Space: O(n) — every element ends up in a group
 *
 * @example
 * groupBy(["apple","ant","banana","bear"], s => s[0])
 * // Map { "a" → ["apple","ant"], "b" → ["banana","bear"] }
 */
function groupBy(arr, keyFn) {
  const map = new Map();

  for (const item of arr) {
    const key = keyFn(item);              // compute the group key

    if (!map.has(key)) {
      map.set(key, []);                   // initialize the group on first encounter
    }
    map.get(key).push(item);              // add item to its group
  }

  return map;
}
```

```javascript
/**
 * Given an array of integers and a target, returns the indices [i, j]
 * of the two numbers that add up to target. Exactly one solution is
 * guaranteed to exist. Uses a Map for O(n) lookup.
 *
 * Time:  O(n)
 * Space: O(n) — map stores up to n entries
 */
function twoSum(numbers, target) {
  const seen = new Map();   // value → index

  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];   // what we need

    if (seen.has(complement)) {
      return [seen.get(complement), i];        // found the pair
    }

    seen.set(numbers[i], i);   // record this number for future lookups
  }

  return [];   // should not reach here if exactly one solution exists
}
```

**The Map API at a glance:**

| Method | Purpose | Time |
|---|---|---|
| `map.set(key, val)` | Insert or update | O(1) avg |
| `map.get(key)` | Retrieve (undefined if missing) | O(1) avg |
| `map.has(key)` | Check existence (boolean) | O(1) avg |
| `map.delete(key)` | Remove a key | O(1) avg |
| `map.size` | Number of entries (property) | O(1) |
| `map.keys()` | Iterator over keys | O(n) to exhaust |
| `map.values()` | Iterator over values | O(n) to exhaust |
| `map.entries()` | Iterator over [key, val] pairs | O(n) to exhaust |

## 5. Common Pitfalls

**Pitfall 1: Using `map.get(key)` without checking `map.has(key)` first.**
`map.get("missing")` returns `undefined`. If you then do math on it (`undefined + 1 === NaN`), or call a method (`undefined.push()` throws), you get silent bugs or runtime errors. Always either check `map.has(key)` first, or use the `?? defaultValue` pattern.

**Pitfall 2: Using objects (`{}`) as maps with non-string keys.**
Object keys are always strings (or Symbols). `obj[1]` and `obj["1"]` are the same key. If you use objects to map objects or arrays as keys, you'll get `"[object Object]"` for every key — a single collision bucket. `Map` accepts any key type and uses reference equality for objects.

**Pitfall 3: Iterating a `Map` with `for...in`.**
`for...in` iterates over the enumerable properties of an object, not a `Map`'s entries. Use `for (const [key, val] of map)` or `map.forEach((val, key) => ...)`. Note the argument order in `forEach` is `(value, key)` — reversed from what you might expect.

**Pitfall 4: Forgetting that `Map.size` is a property, not a method.**
`map.size` (no parentheses) returns the count. `map.size()` throws `TypeError: map.size is not a function`.

## 6. Computer Science Foundations

**Hash functions.** A hash function maps a key to an integer index. The ideal hash function is deterministic (same key → same index), uniform (evenly distributes keys), and fast (O(1) to compute). JavaScript engines use highly optimized hash functions for strings and numbers. For object keys, identity (memory address) is used.

**Collision resolution.** When two different keys hash to the same index, a collision occurs. The two standard strategies are chaining (each slot holds a linked list of key-value pairs) and open addressing (probe for the next empty slot). JavaScript engines typically use chaining.

**Amortized O(1).** Hash map operations are O(1) on average but O(n) in the worst case (all keys collide). In practice, with a good hash function and a load factor below ~0.75, collisions are rare. The "amortized" qualifier acknowledges occasional rehashing (when the table grows), which is O(n) but happens rarely enough to average out.

**Two Sum's insight.** The brute-force Two Sum is O(n²): for each element, scan all others looking for the complement. The map solution is O(n): as you scan, you check if the complement has already been seen. This "trade space for time" strategy — using a map to avoid re-scanning — is one of the most important patterns in algorithm design.

## 7. Real-World Applications

**Analytics and telemetry.** Every analytics platform counts events by key: page views by URL, errors by type, transactions by user. `frequencyMap` is the core operation. At scale (billions of events), probabilistic data structures like HyperLogLog approximate frequency without storing every key.

**Database query optimization.** Hash joins in databases use exactly `frequencyMap`'s pattern: build a hash table from the smaller table's join key, then probe it for each row in the larger table. This achieves O(n + m) join instead of O(n * m).

**Caching / memoization.** `Map` is the standard backing store for memoization: key = function arguments (serialized), value = cached return value. Libraries like `memoize-one` and React's `useMemo` build on this pattern.

**Two Sum in payment systems.** Finding pairs that sum to a target amount appears in gift card reconciliation, split-bill calculators, and portfolio rebalancing tools. The O(n) map solution handles thousands of transactions in milliseconds instead of seconds.

## 8. Before the Exercise

Answer these questions before writing code:

1. In `frequencyMap`, what does `map.get(item) ?? 0` return when `item` has never been seen? What does it return on the second occurrence? Trace one example.

2. What is the difference between `map.get(key)` returning `undefined` versus `map.has(key)` returning `false`? Give a scenario where they differ.

3. In `twoSum([3, 2, 4], 6)`, the answer is `[1, 2]` (indices of 2 and 4). Trace through the algorithm — what is in `seen` at each step, and when does `seen.has(complement)` first return true?

4. For `groupBy`, the `keyFn` could return anything: a string, a number, or even an object. If two calls to `keyFn` return different object instances with the same content (e.g., `{type: "A"}` and `{type: "A"}`), will they map to the same group? Why or why not?

5. Can `twoSum` handle the case where the same element is used twice (e.g., `twoSum([3, 3], 6)`)? Trace through the algorithm to see why or why not.
