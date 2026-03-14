# Day 20 — Lesson A Review: Hash Maps — Frequency, Grouping, and Two Sum

## 1. What You Should Have Learned

- A `Map` is the right data structure when you need to associate arbitrary keys with values and need O(1) lookup, insertion, and deletion.
- The `(map.get(key) ?? 0) + 1` pattern is the idiomatic, concise way to implement frequency counting without an explicit `has` check.
- `groupBy` follows a two-step pattern: check if the bucket exists (create if not), then push the item. This guarantees FIFO order within each group.
- `twoSum`'s key insight is the "complement lookup": for each element, check if `target - element` is already in the map. This converts an O(n²) problem into O(n).
- `Map` differs from plain objects in three critical ways: any key type, insertion-order iteration, and no inherited prototype keys.

## 2. Reviewing Your Implementation

### `frequencyMap(arr)`

**Reference implementation:**

```javascript
function frequencyMap(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}
```

**Key insights:**
- `map.get(item) ?? 0` handles both cases in one expression: missing key (returns `undefined`, nullish-coalesces to `0`) and existing key (returns the current count). This avoids a separate `has` check.
- `??` (nullish coalescing) vs `||`: `0 || 1` is `1` (falsy short-circuit), but `0 ?? 1` is `0` (nullish only). If a count could be `0`, use `??` to be safe — though in this case counts are always ≥ 1 after the first visit.
- Iteration order of the returned `Map` matches the first-occurrence order of elements.

**Edge cases:**
- Empty array: returns `new Map()` with `.size === 0`.
- All same element: `Map { element → arr.length }`.
- Mixed types: `frequencyMap([1, "1", 1])` → `Map { 1 → 2, "1" → 1 }`. The number `1` and string `"1"` are different keys in a Map (unlike a plain object).

---

### `groupBy(arr, keyFn)`

**Reference implementation:**

```javascript
function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}
```

**Key insights:**
- `keyFn` is a function parameter, making `groupBy` general-purpose: `groupBy(people, p => p.dept)`, `groupBy(words, w => w.length)`, `groupBy(dates, d => d.getFullYear())`.
- The two-step pattern (`has` then `push`) is deliberately explicit. The one-liner alternative `(map.get(key) ?? [])` creates a new array but doesn't store it — a subtle bug: `map.get(key).push(item)` would push into a temporary array, never persisting in the map.
- FIFO within groups is guaranteed algorithmically: we process `arr` left-to-right and always `push` (never `unshift`).

**Edge cases:**
- Empty array: returns empty `Map`.
- All elements in one group: map has one key containing a copy of the original array.
- `keyFn` returns an object: since objects are compared by reference, each call that creates a `new` object is a different key even if the content is identical. Use primitive keys (strings, numbers) for grouping.

---

### `twoSum(numbers, target)`

**Reference implementation:**

```javascript
function twoSum(numbers, target) {
  const seen = new Map();  // value → index
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(numbers[i], i);
  }
  return [];
}
```

**Key insights:**
- The order matters: check `seen.has(complement)` BEFORE `seen.set(numbers[i], i)`. This prevents using the same element twice: when we check `seen.has(complement)`, the current element `numbers[i]` is not yet in `seen`.
- `seen` maps value → index (not index → value). This is because we look up by value (is `complement` in `seen`?) and retrieve the index to return.
- For duplicate values (e.g., `[3, 3]`): when we process `numbers[1] = 3`, `complement = 3`, and `seen` already has `{3: 0}`. So `seen.has(3)` is true, and we return `[0, 1]`. Correct!

**Edge cases:**
- Single element: complement is never found; returns `[]`. (Problem guarantees exactly one solution, so this shouldn't occur with valid input.)
- Multiple valid pairs: the algorithm returns the first one found (leftmost pair).

## 3. Going Deeper

### Extension 1: Most frequent element

Use `frequencyMap` to find which element appears most often:

```javascript
function mostFrequent(arr) {
  if (arr.length === 0) return null;

  const freq = frequencyMap(arr);

  let maxCount = 0;
  let maxElement = null;

  for (const [element, count] of freq) {
    if (count > maxCount) {
      maxCount = count;
      maxElement = element;
    }
  }

  return maxElement;
}

// mostFrequent([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5])  => 5  (appears 3 times)
```

This is O(n) time, O(k) space where k is unique elements. Note: if multiple elements tie for most frequent, this returns the one that appeared first in the input (due to Map insertion order).

---

### Extension 2: Anagram grouping

Group strings by their sorted characters (a canonical form for anagrams):

```javascript
function groupAnagrams(words) {
  return groupBy(words, word =>
    word.split("").sort().join("")   // "eat" → "aet", "tea" → "aet"
  );
}

// groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
// Map {
//   "aet" → ["eat", "tea", "ate"],
//   "ant" → ["tan", "nat"],
//   "abt" → ["bat"]
// }
```

This is exactly LeetCode 49. The key insight: two strings are anagrams if and only if their sorted forms are identical. The sorted string is the map key. Time: O(n * k log k) where k is the maximum word length.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Using `||` instead of `??` in frequency counting

```javascript
// WRONG — if an element's count reaches 0 somehow, || would reset it to 1
// More practically: if your values could be 0, false, "", or NaN, || skips them
map.set(item, (map.get(item) || 0) + 1);  // risky with falsy values
```

```javascript
// FIX — ?? only coalesces null and undefined, not other falsy values
map.set(item, (map.get(item) ?? 0) + 1);
```

---

### Mistake 2: Trying to push into a temporary array in `groupBy`

```javascript
// WRONG — (map.get(key) ?? []) creates a NEW array not stored in the map
function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    (map.get(key) ?? []).push(item);  // BUG: push into a discarded temp array
  }
  return map;  // all groups are empty!
}
```

```javascript
// FIX — explicitly set the empty array first, then push via map.get
function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);            // correct: mutates the stored array
  }
  return map;
}
```

---

### Mistake 3: Checking complement AFTER storing current element

```javascript
// WRONG — stores current element first, then checks complement
// This allows using the same element twice (e.g., twoSum([4], 8) → [0, 0])
function twoSum(numbers, target) {
  const seen = new Map();
  for (let i = 0; i < numbers.length; i++) {
    seen.set(numbers[i], i);                    // BUG: stored before check
    const complement = target - numbers[i];
    if (seen.has(complement) && seen.get(complement) !== i) {
      return [seen.get(complement), i];
    }
  }
  return [];
}
// Clunky workaround with !== i; just check complement first instead
```

```javascript
// FIX — check complement BEFORE storing current element
function twoSum(numbers, target) {
  const seen = new Map();
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    if (seen.has(complement)) return [seen.get(complement), i]; // check first
    seen.set(numbers[i], i);                                     // store after
  }
  return [];
}
```

## 5. Connection to Interview Problems

**LeetCode 1 — Two Sum** (Easy)
This is exactly `twoSum`. The map solution is the expected answer. If you find yourself writing a nested loop in an interview, reach for a map. The complement-lookup pattern applies to many other "find a pair" problems.

**LeetCode 49 — Group Anagrams** (Medium)
This is exactly `groupBy` with a sorted-string key function. The challenge is recognizing the right key (sorted characters). Once you see the key, the groupBy pattern handles the rest in O(n * k log k).

**LeetCode 560 — Subarray Sum Equals K** (Medium)
Uses prefix sums + a frequency map. For each prefix sum, check how many earlier prefix sums equal `prefixSum - k`. This is a two-sum variant where the "complement" is `prefixSum - k` and the "value" is a count, not an index.

**LeetCode 347 — Top K Frequent Elements** (Medium)
Uses `frequencyMap` as the first step, then a sort or bucket sort. This is the exact `mostFrequent` extension, generalized to the top K elements.

## 6. Discussion Questions

**Q: Why is `Map` preferred over a plain object `{}` for use as a hash map?**
A: Three reasons. First, `Map` accepts any key type — numbers, objects, functions — while object keys are coerced to strings. Second, `Map` never has inherited prototype properties (`constructor`, `hasOwnProperty`, etc.) that could collide with your keys. Third, `Map.size` is O(1), while `Object.keys(obj).length` is O(n).

**Q: If `twoSum` is called with an array that has no valid pair, what does it return?**
A: It returns `[]` (the fallback after the loop). The problem statement guarantees exactly one solution exists, so this path should never be taken with valid input. In production code, you'd want to either assert that a solution exists or explicitly return `null` to distinguish "no solution" from "solution at indices []".

**Q: `frequencyMap` uses value equality for keys. What if you wanted to count objects by their `id` property?**
A: You'd use `item.id` as the key: `map.set(item.id, (map.get(item.id) ?? 0) + 1)`. This is the `groupBy` pattern with `keyFn = item => item.id`, but counting instead of collecting. Two objects with the same `id` would share a count bucket, as intended.

**Q: Why does the order of keys in the returned Map matter for `groupBy` but not for `twoSum`?**
A: `groupBy` returns a Map for the caller to use as a lookup table — the caller might iterate its entries (e.g., to display groups in the order they were first encountered). `twoSum` returns a concrete answer (two indices), not a map for further use. The internal `seen` map is a temporary lookup-only structure; its iteration order is irrelevant.

## 7. Further Exploration

**MDN Web Docs — Map** (`developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map`) — the authoritative reference for the full Map API, including `WeakMap` (useful when you want the garbage collector to reclaim keys), and a comparison table between Map and plain objects.

**"Grokking Algorithms" by Aditya Bhargava, Chapter 5 (Hash Tables)** — the most visually intuitive explanation of how hash functions work, collision resolution, and why hash tables are O(1). Highly recommended if hash internals feel like a black box.

**LeetCode Explore — Hash Table** (`leetcode.com/explore/learn/card/hash-table/`) — structured problem set starting from frequency counting and building through Two Sum, anagram grouping, and subarray-sum problems. The `frequencyMap`, `groupBy`, and `twoSum` functions you wrote today directly solve the first several problems in this card.
