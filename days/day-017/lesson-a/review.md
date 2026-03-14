## Day 017 — Lesson A Review: Sets and Deduplication

### What you should have learned

1. **Set is the right tool for membership testing**: `set.has(x)` is O(1) because Set uses a hash table internally. `array.includes(x)` is O(n) because it scans every element. This difference is the entire reason Set exists.
2. **`new Set(iterable)` deduplicates automatically**: Passing an array to the Set constructor produces a set of unique values in O(n). Spreading back with `[...set]` gives a deduplicated array that preserves insertion (first-occurrence) order.
3. **Set operations (intersection, difference, union) all run in O(n + m)**: Build a Set from one array (O(m)), then iterate the other (O(n)) with O(1) lookups. Without Set, these would be O(n × m).
4. **Set uses `===` semantics, with one exception**: `1` and `"1"` are distinct. Two different object literals `{a:1}` and `{a:1}` are distinct (compared by reference). `NaN` equals itself (unlike `===`), so Set deduplicates NaN correctly.
5. **`difference` is asymmetric**: `difference(a, b)` gives "elements in a but not b" — swapping the arguments gives a completely different result. The order of arguments always matters.

---

### Reviewing your implementation

#### Function 1: `deduplicate(arr)`

```js
function deduplicate(arr) {
  return [...new Set(arr)];
}

console.log(deduplicate([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]));
// [3, 1, 4, 5, 9, 2, 6]

console.log(deduplicate(["a", "b", "a", "c"]));
// ["a", "b", "c"]

console.log(deduplicate([]));   // []
console.log(deduplicate([42])); // [42]
```

**Key insights:**
- This is idiomatic JavaScript for deduplication. Any experienced JS developer recognizes `[...new Set(arr)]` immediately.
- The Set constructor's O(n) pass over the array builds the hash table. Spread performs an O(n) iteration to produce the array. Total: O(n).
- Insertion order is preserved: the first time a value is seen, it's added to the set; subsequent occurrences are ignored. So the result contains values in the order of their first appearance in `arr`.

**Edge cases handled:**
- Empty array → `new Set([])` is an empty set; spread gives `[]`
- Single element → size 1 set; returns single-element array
- All same value → set contains one entry; returns `[value]`
- Mixed types → `1` and `"1"` are preserved as distinct

---

#### Function 2: `intersection(arrA, arrB)`

```js
function intersection(arrA, arrB) {
  const setB = new Set(arrB);
  return arrA.filter(item => setB.has(item));
}

console.log(intersection([1, 2, 3, 4], [3, 4, 5, 6]));
// [3, 4]

console.log(intersection(["js", "css", "html"], ["css", "ts", "js"]));
// ["js", "css"]

console.log(intersection([1, 2], [3, 4]));    // []
console.log(intersection([], [1, 2, 3]));      // []
```

**Key insights:**
- Building `setB` first converts O(n) lookup on `arrB` to O(1). Without this, each `filter` iteration would call `arrB.includes(item)` — O(m) per item — making the whole function O(n × m).
- The result reflects `arrA`'s order and may contain duplicates if `arrA` has duplicates. If you want a deduplicated intersection, wrap the result: `[...new Set(intersection(arrA, arrB))]`.
- Why filter `arrA` using `setB` rather than filter `arrB` using `setA`? Either is correct. Filtering `arrA` preserves `arrA`'s element order in the result. If the order of the smaller array matters, swap which you filter.

**Edge cases handled:**
- Either empty → `filter` on empty returns `[]`; empty `setB` → `has` always false → filter returns `[]`
- No overlap → filter removes everything → `[]`
- Full overlap → filter keeps everything → copy of arrA

---

#### Function 3: `difference(arrA, arrB)`

```js
function difference(arrA, arrB) {
  const setB = new Set(arrB);
  return arrA.filter(item => !setB.has(item));
}

console.log(difference([1, 2, 3, 4], [3, 4, 5, 6]));
// [1, 2]

console.log(difference([3, 4, 5, 6], [1, 2, 3, 4]));
// [5, 6]

console.log(difference([1, 2, 3], [1, 2, 3]));  // []
console.log(difference([], [1, 2, 3]));           // []
```

**Key insights:**
- `!setB.has(item)` is the only change from `intersection`. The structure is identical: build a Set from the second argument, filter the first. This pattern generalizes — you can think of it as "filter the first array using the second as a lookup source."
- `difference(a, b)` ≠ `difference(b, a)` in general. `difference([1,2,3,4], [3,4,5,6])` = `[1,2]`; `difference([3,4,5,6], [1,2,3,4])` = `[5,6]`. Asymmetry is a property of set difference, not a bug.
- The symmetric difference (items in A or B but not both) is `[...difference(a, b), ...difference(b, a)]`.

**Edge cases handled:**
- arrA empty → filter on `[]` returns `[]`
- arrB empty → `setB` is empty; `!setB.has(...)` is always true → returns copy of arrA
- Complete overlap → filter removes everything → `[]`

---

### Going deeper

#### Extension 1: Union (items in A or B or both)

```js
function union(arrA, arrB) {
  return [...new Set([...arrA, ...arrB])];
}

console.log(union([1, 2, 3], [3, 4, 5]));
// [1, 2, 3, 4, 5]

console.log(union(["a", "b"], ["b", "c"]));
// ["a", "b", "c"]
```

`[...arrA, ...arrB]` concatenates both arrays; `new Set(...)` removes duplicates; spread converts back. Order: all of arrA (deduplicated), then new elements from arrB. The implementation is idiomatic and O(n + m).

#### Extension 2: Deduplicating objects by a key field

`new Set` compares by reference — it won't deduplicate `{id: 1}` and another `{id: 1}`. To deduplicate objects by a field, use a `Map` keyed by that field:

```js
function deduplicateByKey(arr, key) {
  const seen = new Map();
  for (const item of arr) {
    if (!seen.has(item[key])) {
      seen.set(item[key], item);
    }
  }
  return [...seen.values()];
}

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice (duplicate)" },
];

deduplicateByKey(users, "id");
// [{id:1, name:"Alice"}, {id:2, name:"Bob"}]
// First occurrence of each id wins.
```

This keeps the first occurrence of each key and runs in O(n). It's the general pattern for deduplicating arrays of objects in real-world code.

---

### Common mistakes and how to fix them

#### Mistake 1: Using `arr.includes()` inside a loop instead of a Set

```js
// WRONG — O(n²) time
function intersection(arrA, arrB) {
  return arrA.filter(item => arrB.includes(item));  // BUG: O(m) per item
}

// For arrA of length 10,000 and arrB of length 10,000:
// 10,000 × 10,000 = 100,000,000 operations.
// With a Set: 10,000 + 10,000 = 20,000 operations.
```

**Problem:** `arrB.includes(item)` scans `arrB` from the start on every call. For large arrays, this is orders of magnitude slower than building a Set once.
**Fix:** `const setB = new Set(arrB);` before the filter, then `setB.has(item)` in the filter callback.

---

#### Mistake 2: Calling `set.size` as a method

```js
// WRONG — returns undefined, not the size
function hasAnyOverlap(arrA, arrB) {
  return intersection(arrA, arrB).length > 0;  // This is fine.
}

function setSize(s) {
  return s.size();  // BUG: size is a property, not a method
}

const s = new Set([1, 2, 3]);
s.size();   // TypeError: s.size is not a function
s.size;     // 3  ✓
```

**Problem:** `Set.prototype.size` is a getter (property accessor), not a method. Calling it with `()` tries to invoke `undefined` as a function.
**Fix:** Remove the parentheses: `s.size`.

---

#### Mistake 3: Expecting Set to deduplicate objects by value

```js
// WRONG — objects compared by reference, not value
const tags = [{ name: "js" }, { name: "css" }, { name: "js" }];
const deduped = [...new Set(tags)];
console.log(deduped.length);  // 3, not 2!

// Both { name: "js" } objects are different references,
// so the Set sees them as distinct values.
```

**Problem:** `Set` uses `===` for non-primitive values, which compares object references. Two objects with identical properties are still two different objects.
**Fix:** Use `deduplicateByKey(tags, "name")` (from Going Deeper) or convert to primitive keys: `[...new Set(tags.map(t => t.name))].map(name => ({ name }))`.

---

### Connection to interview problems

- **LeetCode 217 — Contains Duplicate**: Add each number to a Set; if `set.has(n)` is true before adding, return true. Classic O(n) + O(n space) vs O(n²) naive.
- **LeetCode 349 — Intersection of Two Arrays**: Exactly the `intersection` function — but return a deduplicated result (wrap with `[...new Set(...)]`).
- **LeetCode 128 — Longest Consecutive Sequence**: Build a Set of all numbers; for each `n`, check if `n-1` is NOT in the set (i.e., `n` is the start of a sequence), then count forward with `has(n+1)`, `has(n+2)`, etc. O(n) because each element is visited at most twice.
- **LeetCode 1 — Two Sum** (hash map variant): The hash map technique used there is the same O(1) lookup principle as Set — a complement of the same underlying data structure.

---

### Discussion questions

1. **`new Set([1, "1", true, 1, "1"]).size` is 3, not 5. Which three values are in the set?** `1` (number), `"1"` (string), and `true` (boolean). Each is a distinct primitive type. The duplicates `1` (second) and `"1"` (second) are ignored. This illustrates that Set uses strict type equality, not coercion.

2. **`intersection(a, b)` builds a Set from `b` and filters `a`. What's the time complexity if `a` is very large and `b` is small vs. `b` is very large and `a` is small?** In both cases it's O(n + m). The Set construction is O(m), the filter is O(n). Swapping a and b swaps which is n and which is m — the asymptotic complexity is the same. In practice, building the Set from the smaller array uses less memory, so you'd prefer `const setSmaller = new Set(smaller); return larger.filter(x => setSmaller.has(x))`.

3. **When would you prefer a sorted array + binary search over a Set for membership testing?** When (a) memory is very constrained (hash tables have overhead per entry), (b) you need range queries ("all items between X and Y"), or (c) you need a guaranteed traversal order independent of insertion. Binary search gives O(log n) per query vs O(1) for Set, but arrays are cache-friendlier for sequential access. In most JavaScript applications, Set wins.

4. **The `union` implementation spreads both arrays and deduplicates. What's the result of `union([3, 1, 2], [2, 4, 3])`?** `[3, 1, 2, 4]` — all of `arrA` in original order, then new elements from `arrB` in their original order. `2` appears in both but only once (first occurrence from arrA at position 2). `4` is new, appended. `3` from arrB is a duplicate (already in arrA), skipped.

---

### Further exploration

- **Map vs Set**: `Map` extends Set with key→value associations. The `deduplicateByKey` extension shows where Map is the right choice. Understanding when to use Set (just membership) vs Map (membership + payload) is the key decision.
- **WeakSet**: A variant where values must be objects and are held weakly — the GC can collect them if no other reference exists. Useful for tracking DOM nodes or objects without preventing garbage collection. Not iterable.
- [MDN — Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set): The complete API reference including `forEach`, `entries`, `values`, `keys` (alias for values), and how Set fits into the iterable protocol.
- **Hash tables in depth**: *Introduction to Algorithms* (CLRS) Chapter 11 covers hash tables — chaining vs open addressing, load factors, and the analysis behind O(1) expected operations.
