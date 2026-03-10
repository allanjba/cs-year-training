## Day 006 — Lesson A (Foundations): Frequency Counting and Hash Maps

### Why this matters

Some questions about data can't be answered with a single scan that tracks one value. "What's the most common word in this text?" "How many times did each event type occur?" "Which item appears exactly twice?" These require keeping track of *many* counts at once.

The tool for this is a **frequency map** (also called a hash map, dictionary, or lookup table): an object where each key is a distinct value from your data, and each value is a count of how many times that key appeared.

This is one of the most powerful and versatile patterns in programming. Many problems that seem like they require complex nested loops can be solved elegantly with a single pass that builds a frequency map. You'll use this pattern constantly — in algorithms, in analytics, in real application code.

### The core concept

A frequency map transforms a list into a summary of counts:

```
input:  ["a", "b", "a", "c", "b", "a"]
output: { "a": 3, "b": 2, "c": 1 }
```

The process is straightforward:
1. Start with an empty object `{}`
2. Walk through the data
3. For each element: if it's not in the map yet, add it with count 1; if it's already there, increment its count
4. When done, the map tells you how many times each value appeared

What makes this powerful: building the map is O(n), but *answering questions* from the map is O(1). "How many times did 'a' appear?" → `counts["a"]` → instant answer.

### How it works

Let's trace through counting letters in `"hello"`:

```
text   = "hello"
counts = {}

step 1 — "h":
  "h" in counts? no → counts["h"] = 1
  counts = { h: 1 }

step 2 — "e":
  "e" in counts? no → counts["e"] = 1
  counts = { h: 1, e: 1 }

step 3 — "l":
  "l" in counts? no → counts["l"] = 1
  counts = { h: 1, e: 1, l: 1 }

step 4 — "l":
  "l" in counts? yes → counts["l"]++
  counts = { h: 1, e: 1, l: 2 }

step 5 — "o":
  "o" in counts? no → counts["o"] = 1
  counts = { h: 1, e: 1, l: 2, o: 1 }

result: { h: 1, e: 1, l: 2, o: 1 }
```

After this single pass, we can answer any frequency question in O(1):
- "How many l's?" → `counts["l"]` → 2
- "How many z's?" → `counts["z"]` → `undefined` (treat as 0)
- "How many unique letters?" → `Object.keys(counts).length` → 4

### Code implementation

```js
function countLetters(text) {
  const counts = {};
  for (const ch of text) {
    if (!counts[ch]) {
      counts[ch] = 0;
    }
    counts[ch]++;
  }
  return counts;
}

console.log(countLetters("hello"));
// { h: 1, e: 1, l: 2, o: 1 }

console.log(countLetters(""));
// {}
```

**Breaking it down:**
- `const counts = {}` — start with an empty object
- `if (!counts[ch]) counts[ch] = 0` — if we haven't seen this character before, initialize its count to 0
- `counts[ch]++` — increment the count (works because we just ensured it exists)
- The two lines can be combined using the nullish/OR pattern (see below)

**A cleaner idiom** using `||`:

```js
function countLetters(text) {
  const counts = {};
  for (const ch of text) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}
```

`counts[ch] || 0` reads as: "the current count if it exists, or 0 if it doesn't." Then we add 1 and store the result. Same logic, fewer lines.

**Counting values in an array:**

```js
function countValues(items) {
  const counts = {};
  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1;
  }
  return counts;
}

console.log(countValues(["red", "blue", "red", "green", "blue", "red"]));
// { red: 3, blue: 2, green: 1 }
```

**Finding the most common value:**

```js
function mostCommon(items) {
  const counts = countValues(items);
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

console.log(mostCommon(["red", "blue", "red", "green", "blue", "red"]));
// "red"
```

**Breaking it down:**
- `Object.keys(counts)` returns an array of all keys in the object
- We iterate over those keys, tracking which one has the highest count
- `topValue` and `topCount` are our "running best" variables — same pattern as `minAndMax` from Day 1

### Common pitfalls

**1. Reading a missing key returns `undefined`, not 0**

```js
const counts = { a: 3, b: 1 };
counts["z"]      // undefined — not 0!
counts["z"] > 2  // false (undefined > 2 is false)
counts["z"] + 1  // NaN  (undefined + 1 is NaN)
```

Always handle missing keys. Use `counts[key] || 0` when you need a numeric default.

**2. Using number keys**

```js
const counts = {};
counts[1]++;     // counts["1"]++, then counts["1"] is NaN
```

Object keys are always strings in JavaScript. The number `1` becomes the string `"1"`. This isn't usually a problem, but be aware: `counts[1]` and `counts["1"]` access the same key.

**3. Initializing to 1 vs 0**

The two common patterns:

```js
// Initialize to 1 on first encounter
if (!counts[ch]) counts[ch] = 1;
else counts[ch]++;

// Initialize to 0, then always increment
counts[ch] = (counts[ch] || 0) + 1;
```

Both work. The second is more concise and less error-prone — it handles every element the same way with no if/else.

**4. Confusing `Object.keys()` with the values**

```js
for (const key of Object.keys(counts)) {
  console.log(key);         // prints the key (e.g., "red")
  console.log(counts[key]); // prints the count (e.g., 3)
}
```

`Object.keys(counts)` gives you the keys (distinct values from your input). The counts are accessed as `counts[key]`.

### Computer Science foundations

**Time Complexity:**
- Building the frequency map: O(n) — one pass, O(1) per element for object property access (amortized)
- Querying the map: O(1) — direct property lookup
- Finding the most common: O(k) where k is the number of unique values

**Space Complexity:** O(k) where k is the number of unique values.
- The frequency map stores one entry per unique value
- In the worst case (all elements distinct), k = n and space is O(n)

**Why object property access is O(1):**
JavaScript objects are implemented as hash tables. When you access `obj[key]`, JavaScript hashes the key string to find the storage location directly — no scanning required. The average case is O(1), which is what makes the "build once, query many times" approach so efficient.

**The build-once, query-many pattern:**
This is a general strategy: spend O(n) time building an index (the frequency map), then answer any subsequent query in O(1). The break-even point is when the query cost savings exceed the preprocessing cost. If you need to answer k queries and each query would otherwise take O(n) without the map, preprocessing pays off when k > 1.

### Real-world applications

- **Analytics**: Count page views by URL, events by type, orders by status
- **Text analysis**: Word frequency, character distribution, anagram detection
- **Inventory**: Count items by category, find most/least common SKUs
- **Voting systems**: Count votes for each option
- **Duplicate detection**: Any value with count > 1 appears multiple times
- **Top-N problems**: Find the N most frequent values (frequency map + sort)

Frequency maps are so fundamental that they appear in solutions to hundreds of algorithm interview problems. They're the first thing to reach for when you need to count, group, or detect duplicates.

### Before the exercise

In the exercise file, you'll implement:

1. **`countLetters(text)`** — Build a frequency map of characters in a string
2. **`countValues(items)`** — Build a frequency map of values in an array
3. **`mostCommon(items)`** — Return the most frequently occurring value
4. **`uniqueCount(items)`** — Return the number of distinct values (hint: `Object.keys(counts).length`)

As you implement:
- Start by building the frequency map correctly — get that right before building on top of it
- Remember: missing keys return `undefined`, not 0 — handle that in your accumulation
- For `mostCommon`, trace through a small example by hand to verify your logic
- Test with an empty array or string, a single element, and all identical elements
