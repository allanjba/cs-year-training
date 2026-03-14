# Day 20 — Lesson B Review: Word Frequency Analysis

## 1. What You Should Have Learned

- Text analysis requires normalization before counting: lowercase first, strip punctuation, then tokenize by splitting on whitespace.
- The `filter(w => w.length > 0)` step is essential to remove empty strings that result from leading/trailing whitespace or consecutive spaces.
- `topNWords` is a composition: `wordFrequency` (O(n)) followed by sort (O(k log k)) followed by slice (O(n)). Total: O(n + k log k).
- `uniqueWordCount` is simply `wordFrequency(text).size` — O(1) once the map is built.
- Regex `/[^a-z0-9\s]/g` means "replace every character that is not a letter, digit, or space" — the `^` inside a character class negates it, the `g` flag applies globally.

## 2. Reviewing Your Implementation

### `wordFrequency(text)`

**Reference implementation:**

```javascript
function wordFrequency(text) {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");

  const words = normalized
    .split(/\s+/)
    .filter(w => w.length > 0);

  const map = new Map();
  for (const word of words) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }
  return map;
}
```

**Key insights:**
- Order of operations matters: lowercase first (so the regex only needs `[a-z]`, not `[a-zA-Z]`), then strip punctuation, then split.
- `/[^a-z0-9\s]/g` removes hyphens, apostrophes, and all other punctuation. "hello-world" becomes "helloworld" — one token, not two. If you want hyphens to split words, replace `-` with a space before this regex.
- The three-step pipeline (normalize → tokenize → count) is testable at each stage: you can test normalization independently of counting.

**Edge cases:**
- Empty string: `"".split(/\s+/)` → `[""]`, `.filter(w => w.length > 0)` → `[]`. Returns `new Map()` (size 0). Correct.
- All punctuation: `"!!!".replace(/[^a-z0-9\s]/g, "")` → `""`. Tokenizes to `[]`. Returns empty map.
- Numbers: digits are preserved by `/[^a-z0-9\s]/g`. `"year 2025"` → tokens `["year", "2025"]`, both counted. Intentional.

---

### `topNWords(text, n)`

**Reference implementation:**

```javascript
function topNWords(text, n) {
  const freq = wordFrequency(text);
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, n);
}
```

**Key insights:**
- `[...freq.entries()]` spreads the Map iterator into an array. `freq.entries()` alone is a `MapIterator` — not an array and not sortable.
- `sort((a, b) => b[1] - a[1])`: `a` and `b` are `[word, count]` pairs. `a[1]` is the count. Descending order: `b[1] - a[1]` (if positive, b's count is larger → b goes first).
- `.slice(0, n)` is safe when `n > sorted.length`: `[1,2,3].slice(0, 100)` returns `[1,2,3]` without error.
- Tie-breaking: JavaScript's sort is stable (since ES2019). Tied words appear in Map insertion order, which equals first-occurrence order in the text. "The" appearing before "fox" in the text means "the" appears before "fox" among tied entries.

**Edge cases:**
- `n = 0`: `.slice(0, 0)` returns `[]`. Valid.
- Empty text: `wordFrequency` returns empty map, `sorted` is `[]`, `slice` returns `[]`.

---

### `uniqueWordCount(text)`

**Reference implementation:**

```javascript
function uniqueWordCount(text) {
  return wordFrequency(text).size;
}
```

**Key insights:**
- `Map.size` is O(1) — it's a stored property updated on every `set` and `delete`, not recomputed.
- This delegates all normalization logic to `wordFrequency`, so "Hello" and "hello" correctly count as one word.
- The simplicity here is a sign of good composition: `wordFrequency` is the workhorse; `uniqueWordCount` just queries it.

## 3. Going Deeper

### Extension 1: Stop word filtering

Add optional stop word filtering to avoid counting function words:

```javascript
const DEFAULT_STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were",
  "in", "on", "at", "to", "for", "of", "with", "it", "its", "this",
]);

function wordFrequencyFiltered(text, stopWords = DEFAULT_STOP_WORDS) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  const map = new Map();
  for (const word of words) {
    if (stopWords.has(word)) continue;   // skip stop words — O(1) check via Set
    map.set(word, (map.get(word) ?? 0) + 1);
  }
  return map;
}

// topNWords applied to BLOG_POST with stop words filtered:
// "javascript" and "developer" dominate instead of "the" and "is"
```

`Set.has()` is O(1), so stop word filtering adds no asymptotic cost to the overall O(n) algorithm.

---

### Extension 2: Relative frequency (term frequency)

Normalize counts to proportions for cross-document comparison:

```javascript
function termFrequency(text) {
  const freq = wordFrequency(text);
  const total = [...freq.values()].reduce((sum, count) => sum + count, 0);

  const tf = new Map();
  for (const [word, count] of freq) {
    tf.set(word, count / total);    // proportion: 0 to 1
  }
  return tf;
}

// termFrequency("a a b") → Map { "a" → 0.667, "b" → 0.333 }
// Now you can compare TF across documents of different lengths.
```

This is the "TF" part of TF-IDF. The total word count is the sum of all frequencies, computable in one pass over `freq.values()`.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Forgetting to filter empty strings after split

```javascript
// WRONG — "  hello  ".split(/\s+/) produces ["", "hello", ""]
function wordFrequency(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
  // BUG: no filter; "" gets counted as a word
  const map = new Map();
  for (const word of words) map.set(word, (map.get(word) ?? 0) + 1);
  return map;  // contains "" → 2 for "  hello  "
}
```

```javascript
// FIX
const words = text.toLowerCase()
  .replace(/[^a-z0-9\s]/g, "")
  .split(/\s+/)
  .filter(w => w.length > 0);   // remove empty strings
```

---

### Mistake 2: Sorting a Map iterator instead of an array

```javascript
// WRONG — MapIterator is not an array and has no .sort() method
function topNWords(text, n) {
  const freq = wordFrequency(text);
  const sorted = freq.entries().sort((a, b) => b[1] - a[1]);  // TypeError
  return sorted.slice(0, n);
}
```

```javascript
// FIX — spread the iterator into an array first
function topNWords(text, n) {
  const freq = wordFrequency(text);
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, n);
}
```

---

### Mistake 3: Skipping normalization causes case-sensitive counts

```javascript
// WRONG — "JavaScript" and "javascript" are counted separately
function wordFrequency(text) {
  const words = text.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  // BUG: no toLowerCase(); "JavaScript" ≠ "javascript"
  const map = new Map();
  for (const word of words) map.set(word, (map.get(word) ?? 0) + 1);
  return map;
}
```

```javascript
// FIX — lowercase BEFORE stripping punctuation
function wordFrequency(text) {
  const words = text
    .toLowerCase()                         // normalize case first
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 0);
  // ...
}
```

## 5. Connection to Interview Problems

**LeetCode 192 — Word Frequency** (Shell)
The shell version of word frequency using `awk` or `sort | uniq -c`. Understanding the problem deeply from the JS side makes the shell version trivial to reason about.

**LeetCode 347 — Top K Frequent Elements** (Medium)
Identical structure to `topNWords` but on an array of integers. `frequencyMap(nums)` then sort by count descending, take first K. If K is small compared to N, a partial sort (heap) is more efficient — but for interviews, the sort approach is accepted.

**LeetCode 819 — Most Common Word** (Easy)
`wordFrequency` with a banned-word filter, then find the max. Your `wordFrequencyFiltered` extension is the solution with `stopWords = new Set(banned)`.

**LeetCode 692 — Top K Frequent Words** (Medium)
Like `topNWords` but with a secondary sort: when counts tie, sort alphabetically. Change the sort comparator: `b[1] - a[1] || a[0].localeCompare(b[0])`. The `||` chains comparators: use count first, break ties by alphabetical order.

## 6. Discussion Questions

**Q: Why do we lowercase before replacing punctuation rather than after?**
A: Order doesn't strictly matter for correctness in this case, but lowercasing first simplifies the regex: `/[^a-z0-9\s]/g` only needs lowercase letters since the string is already all lowercase. If you replaced punctuation first, you'd need `/[^a-zA-Z0-9\s]/g`. Lowercase first is a minor readability improvement, and it's the conventional NLP pipeline order.

**Q: `"hello-world"` becomes `"helloworld"` after stripping the hyphen. Is this correct behavior?**
A: It depends on the use case. For blog post word counting, treating "hello-world" as one token ("helloworld") is probably wrong. A better approach for hyphenated compounds is to replace hyphens with spaces before stripping punctuation: `text.replace(/-/g, " ").toLowerCase().replace(/[^a-z0-9\s]/g, "")`. This is a design decision — the lesson version is explicit and simple for learning purposes.

**Q: What is the time complexity of `topNWords` as a function of text length n and unique word count k?**
A: `wordFrequency` is O(n) where n is text length (character count). The sort is O(k log k) where k is unique word count. Slice is O(N). Total: O(n + k log k). Since k ≤ n (unique words can't exceed total words), this simplifies to O(n log n) in the worst case (all words unique). For typical text, k << n so the map-building step dominates.

**Q: How would you find words that appear in exactly one document out of a collection of documents?**
A: Build a `wordFrequency` map for each document, then combine them into a cross-document `Map<word, documentCount>` (where documentCount increments once per document that contains the word, regardless of within-document frequency). Filter for entries where `documentCount === 1`. This is related to TF-IDF's IDF component.

## 7. Further Exploration

**"Natural Language Processing with JavaScript" (various tutorials on Dev.to and Medium)** — searching this query finds practical guides for tokenization, stop word removal, and stemming in JS. After this lesson you have the foundation to follow these guides comfortably.

**TF-IDF Wikipedia article** — a concise mathematical explanation of how term frequency and inverse document frequency combine into a relevance score. Your `wordFrequency` and `termFrequency` functions implement the first half directly.

**`natural` npm package** (`github.com/NaturalNode/natural`) — a mature NLP library for Node.js. Its tokenizers, stemmers, and TF-IDF implementation are built on exactly the patterns you implemented today. Reading its source code after this lesson is an excellent way to see production-quality NLP in JavaScript.
