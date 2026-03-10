## Day 006 — Lesson A Review: Frequency Counting and Hash Maps

### What you should have learned

1. **Frequency map structure**: An object where each key is a distinct value from your data and each value is its count.
2. **Build-once, query-many**: Building the map is O(n). Every subsequent query is O(1). This trade-off pays off whenever you answer more than one question about the same data.
3. **Missing key returns `undefined`, not `0`**: Always use `|| 0` as a fallback when accumulating into an object.
4. **Object property access is O(1) (amortized)**: JavaScript objects are hash tables under the hood.
5. **`Object.keys(obj)`**: Returns an array of all keys in the object — use it to iterate over a frequency map.

### Reviewing your implementation

#### Function 1: `charFrequency(text)`

```js
function charFrequency(text) {
  const counts = {};
  for (const ch of text) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

console.log(charFrequency("hello"));
// { h: 1, e: 1, l: 2, o: 1 }

console.log(charFrequency("aba"));
// { a: 2, b: 1 }

console.log(charFrequency(""));
// {}
```

**Key insights:**
- `(counts[ch] || 0) + 1` — if `ch` not yet seen, `counts[ch]` is `undefined`, `|| 0` gives `0`, then `+1` sets it to `1`
- `for...of` over a string iterates character by character — cleaner than indexed loop here
- Empty string → `{}`: loop never runs, empty object is returned

**Edge cases handled:**
- Empty string → `{}`
- Single character → `{ ch: 1 }`
- All identical characters → `{ ch: n }` where n = string length

---

#### Function 2: `valueFrequency(values)`

```js
function valueFrequency(values) {
  const counts = {};
  for (const value of values) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

console.log(valueFrequency(["a", "b", "a", "c", "b", "a"]));
// { a: 3, b: 2, c: 1 }

console.log(valueFrequency([]));
// {}
```

**Key insights:**
- Identical structure to `charFrequency` — the algorithm is the same, just over an array instead of a string
- Keys become strings in JavaScript objects: `valueFrequency([1, 2, 1])` produces `{ "1": 2, "2": 1 }` — the number keys are coerced to strings

**Edge cases handled:**
- Empty array → `{}`
- All same value → `{ value: n }`

---

#### Function 3: `mostFrequentValue(values)`

```js
function mostFrequentValue(values) {
  if (values.length === 0) return null;

  const counts = valueFrequency(values);
  let topValue = null;
  let topCount = 0;

  for (const key of Object.keys(counts)) {
    if (counts[key] > topCount) {
      topCount = counts[key];
      topValue = key;
    }
  }

  return topValue;
}

console.log(mostFrequentValue(["a", "b", "a", "c", "b", "a"]));  // "a"
console.log(mostFrequentValue([]));                               // null
```

**Key insights:**
- Build the map first, then scan it to find the winner — two passes, but still O(n) overall
- `Object.keys(counts)` returns the distinct values from the original input
- Initialized with `topCount = 0` — any real count (at least 1) will beat it

**Edge cases handled:**
- Empty input → `null`
- Tie: whichever key is encountered first when scanning `Object.keys` wins (insertion order for modern JS)

---

#### Function 4: `countUniqueValues(values)`

```js
function countUniqueValues(values) {
  return Object.keys(valueFrequency(values)).length;
}

console.log(countUniqueValues(["a", "b", "a"]));   // 2
console.log(countUniqueValues([]));                 // 0
```

**Key insights:**
- `Object.keys(map).length` gives the number of distinct keys in the frequency map
- Reuses `valueFrequency` — no need to rewrite the counting logic

### Going deeper

#### Extension 1: Top N most frequent values

```js
function topN(values, n) {
  const counts = valueFrequency(values);
  const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  return sorted.slice(0, n);
}

console.log(topN(["a", "b", "a", "c", "b", "a"], 2));  // ["a", "b"]
```

Build the frequency map, sort keys by count descending, take the first N. This pattern — "top N by frequency" — appears in trending topics, most-used tags, and search suggestions.

#### Extension 2: Detect duplicates using frequency map

```js
function hasDuplicates(values) {
  const counts = valueFrequency(values);
  for (const key of Object.keys(counts)) {
    if (counts[key] > 1) return true;
  }
  return false;
}

// More efficient version — stop building the map as soon as a duplicate is found:
function hasDuplicatesEarlyExit(values) {
  const seen = {};
  for (const value of values) {
    if (seen[value]) return true;  // already seen this value
    seen[value] = true;
  }
  return false;
}

console.log(hasDuplicatesEarlyExit(["a", "b", "c"]));   // false
console.log(hasDuplicatesEarlyExit(["a", "b", "a"]));   // true — exits after seeing second "a"
```

The early-exit version doesn't build a full frequency map — it just tracks "seen or not seen." O(1) extra space per unique element, exits immediately on first duplicate.

### Common mistakes and how to fix them

#### Mistake 1: Not handling missing keys — getting `NaN`

```js
// WRONG
function charFrequencyBroken(text) {
  const counts = {};
  for (const ch of text) {
    counts[ch]++;   // undefined++ === NaN!
  }
  return counts;
}

console.log(charFrequencyBroken("ab"));   // { a: NaN, b: NaN }
```

**Problem:** `counts["a"]` is `undefined` on first access. `undefined + 1` is `NaN`. `NaN` propagates silently.
**Fix:** `counts[ch] = (counts[ch] || 0) + 1;` — initialize with fallback before incrementing.

---

#### Mistake 2: Using `Object.hasOwn` check when `|| 0` is cleaner

```js
// VERBOSE but correct
if (!Object.hasOwn(counts, ch)) {
  counts[ch] = 0;
}
counts[ch]++;

// CLEANER — same result
counts[ch] = (counts[ch] || 0) + 1;
```

Both work. The `|| 0` idiom is idiomatic JavaScript for "default to zero if not present." However, **be aware**: if a valid count could be `0` (which it can't in frequency maps since we only count things that exist), `|| 0` would clobber it. For frequency maps specifically, `|| 0` is always safe.

---

#### Mistake 3: Confusing `Object.keys` with the values

```js
const counts = { a: 3, b: 2 };

for (const key of Object.keys(counts)) {
  console.log(key);         // "a", "b" — the keys
  console.log(counts[key]); // 3, 2 — the values (counts)
}
```

`Object.keys` gives you the keys (distinct input values), not the counts. Access counts via `counts[key]`.

### Connection to interview problems

The frequency map is one of the most commonly used patterns in algorithm interviews:

- **LeetCode 242 — Valid Anagram**: Two strings are anagrams if their character frequency maps are equal
- **LeetCode 49 — Group Anagrams**: Group strings by their sorted-character signature (a frequency key)
- **LeetCode 169 — Majority Element**: Find element appearing more than n/2 times — `mostFrequentValue`
- **LeetCode 383 — Ransom Note**: Can you build one string's characters from another's? Frequency map comparison
- **LeetCode 347 — Top K Frequent Elements**: `topN` pattern from the extension above

When you see "how many times does X appear?" or "find the most common Y" — reach for a frequency map first.

### Discussion questions

1. **Why is object property access O(1)?** JavaScript objects are implemented as hash tables. A hash function converts the key string into a numeric index into an array. The lookup is a hash computation plus an array access — both O(1). Collisions can degrade this, but modern engines handle them efficiently, making the amortized cost O(1).

2. **`mostFrequentValue` returns a string even when the input was numbers. Why?** Object keys in JavaScript are always strings (or Symbols). When you do `counts[1]++`, the key is stored as `"1"`. So `Object.keys(counts)` returns `["1"]`, a string. In a real system, you'd convert back: `parseInt(topValue, 10)`. This is a subtle JavaScript quirk.

3. **The `topN` extension sorts by count — what's the time complexity?** Building the frequency map is O(n). Sorting the keys is O(k log k) where k = number of unique values. Overall: O(n + k log k). For most data, k << n (far fewer unique values than total elements), so this is effectively O(n).

### Further exploration

- MDN: [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) — and related: `Object.values`, `Object.entries`
- MDN: [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) — JavaScript's built-in hash map, which handles non-string keys correctly (fixes the number-key coercion issue)
- *Introduction to Algorithms* (CLRS), Chapter 11 — Hash Tables: the theoretical foundation for why property access is O(1)
