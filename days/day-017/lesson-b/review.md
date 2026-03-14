## Day 017 — Lesson B Review: Article Tag Analysis

### What you should have learned

1. **Nested loops over arrays of arrays are O(n × t) where t is the inner array length**: Iterating every article and every tag within each article touches each tag exactly once — total work is O(total tags). This is the same as O(n) where n is the total tag count across all articles.
2. **A `Map<key, count>` is the standard pattern for frequency counting**: `count.set(tag, (count.get(tag) ?? 0) + 1)` is the idiom. The `?? 0` default handles first occurrences cleanly without an explicit `if` check.
3. **Deduplicate within each article before counting**: If tags can repeat within a single article, wrap with `new Set(article.tags)` in the counting loop to count by article, not by raw occurrence.
4. **Set operations compose naturally on array fields**: `sharedTags` is intersection applied to `article.tags` arrays — the same primitive from Lesson A, applied to a field of an object rather than a bare array.
5. **`??` (nullish coalescing) is safer than `||` for counting**: `count.get(tag) || 0` works when counts are always positive, but `0 || 0` is still `0` — so it would fail if a tag had been explicitly set to 0. `?? 0` only falls back on `null` or `undefined`, which is the semantically correct guard.

---

### Reviewing your implementation

#### Function 1: `allUniqueTags(articles)`

```js
function allUniqueTags(articles) {
  const tags = new Set();
  for (const article of articles) {
    for (const tag of article.tags) {
      tags.add(tag);
    }
  }
  return [...tags];
}

allUniqueTags(articles);
// ["javascript", "performance", "async", "react", "hooks", "database",
//  "indexing", "typescript", "node", "css", "layout", "frontend"]

allUniqueTags([]);  // []
```

**Key insights:**
- The outer loop iterates articles; the inner loop iterates tags within each article. Both loops are simple `for...of` — no index arithmetic needed.
- `Set.add` on a duplicate is a no-op — the tag is silently ignored. You don't need an explicit `if (!tags.has(tag))` guard.
- Spread `[...tags]` iterates the Set in insertion order, producing tags in the order they were first seen.
- Alternative one-liner: `[...new Set(articles.flatMap(a => a.tags))]`. `flatMap` concatenates all tag arrays; `Set` deduplicates. Same result, more idiomatic for functional style.

**Edge cases handled:**
- Empty articles array → outer loop never runs → Set stays empty → returns `[]`
- Article with empty tags → inner loop never runs → nothing added
- All articles have same tag → added once on first article; subsequent adds are no-ops

---

#### Function 2: `nicheTagsOnly(articles)`

```js
function nicheTagsOnly(articles) {
  const count = new Map();
  for (const article of articles) {
    for (const tag of new Set(article.tags)) {  // deduplicate within article
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }
  return [...count.entries()]
    .filter(([, n]) => n === 1)
    .map(([tag]) => tag);
}

nicheTagsOnly(articles);
// ["database", "indexing", "node", "css", "layout", "frontend"]

nicheTagsOnly([]);  // []
```

**Key insights:**
- `new Set(article.tags)` in the inner loop deduplicates tags within each article before counting. Without this, an article with tags `["js", "js"]` would increment the count twice, making "js" appear to be in two articles when it's only in one.
- `count.get(tag) ?? 0` returns `0` for the first occurrence (tag not in map → `get` returns `undefined` → `?? 0` → `0`). On subsequent articles, `get` returns the existing count.
- The final chain `.entries() → .filter() → .map()` is a clean pipeline: extract all (tag, count) pairs, keep only count-1 pairs, extract just the tag string.
- Destructuring `([, n])` skips the first element (tag) and names the second (count). `([tag])` extracts only the first element.

**Edge cases handled:**
- Empty articles → Map is empty → `.entries()` is empty → returns `[]`
- All tags unique across articles → all counts are 1 → returns all tags
- All tags shared → all counts ≥ 2 → returns `[]`

---

#### Function 3: `sharedTags(articleA, articleB)`

```js
function sharedTags(articleA, articleB) {
  const setA = new Set(articleA.tags);
  return articleB.tags.filter(tag => setA.has(tag));
}

sharedTags(articles[0], articles[1]);  // ["javascript"]
sharedTags(articles[1], articles[3]);  // ["react", "hooks"]
sharedTags(articles[0], articles[5]);  // []
```

**Key insights:**
- Identical structure to Lesson A's `intersection` — only accessing `.tags` on each article object instead of using the array directly. The abstraction layer is shallow; the algorithm is unchanged.
- The result is ordered by `articleB.tags` order (filter iterates articleB). If you wanted results ordered by articleA's tags, swap: build a Set from B, filter A.
- `sharedTags(a, b)` and `sharedTags(b, a)` contain the same values but may have different orders (based on which article's tag order is preserved).

**Edge cases handled:**
- Either article has empty tags → Set or filter produces `[]`
- Complete overlap (same tags) → filter keeps all of articleB's tags
- No overlap → filter removes everything → `[]`

---

### Going deeper

#### Extension 1: Jaccard similarity between two articles

Jaccard similarity measures how similar two sets are: `|intersection| / |union|`. A value of 1.0 means identical tag sets; 0.0 means no overlap.

```js
function jaccardSimilarity(articleA, articleB) {
  const setA = new Set(articleA.tags);
  const setB = new Set(articleB.tags);
  const inter = articleA.tags.filter(tag => setB.has(tag)).length;
  const unionSize = new Set([...setA, ...setB]).size;
  if (unionSize === 0) return 1; // both empty → identical by convention
  return inter / unionSize;
}

jaccardSimilarity(articles[1], articles[3]);
// intersection: ["react", "hooks"] → size 2
// union: ["react","javascript","hooks","typescript"] → size 4
// 2 / 4 = 0.5

jaccardSimilarity(articles[0], articles[5]);
// intersection: [] → 0
// union: 6 tags → 0 / 6 = 0.0
```

This is the foundation of content-based recommendation: find the article with the highest Jaccard similarity to the current one.

#### Extension 2: Related articles for a given article

```js
function relatedArticles(articles, target, minSharedTags = 1) {
  const targetTags = new Set(target.tags);
  return articles
    .filter(a => a !== target)
    .map(a => ({
      article: a,
      sharedCount: a.tags.filter(tag => targetTags.has(tag)).length,
    }))
    .filter(({ sharedCount }) => sharedCount >= minSharedTags)
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .map(({ article }) => article);
}

relatedArticles(articles, articles[0]);
// Articles with at least 1 shared tag with "Understanding Async JS",
// sorted by most shared tags first.
// articles[4] "Node.js Event Loop" shares "javascript" and "async" → 2 shared → first
// articles[1] "React Hooks Deep Dive" shares "javascript" → 1 shared → second
// articles[2] "Database Indexing" shares "performance" → 1 shared → third
```

This is a simplified version of how content platforms build "You might also like" features.

---

### Common mistakes and how to fix them

#### Mistake 1: Counting raw tag occurrences instead of article occurrences

```js
// WRONG — counts how many times a tag appears total, not how many articles contain it
function nicheTagsOnly(articles) {
  const count = new Map();
  for (const article of articles) {
    for (const tag of article.tags) {  // BUG: no deduplication within article
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }
  return [...count.entries()].filter(([, n]) => n === 1).map(([tag]) => tag);
}

// If one article has tags: ["js", "js", "react"]
// The map will show "js": 2 — as if it appeared in two articles, when it's only in one.
// "js" is incorrectly excluded from the niche tags result.
```

**Problem:** Without deduplicating each article's tags before counting, repeated tags within one article inflate the count.
**Fix:** `for (const tag of new Set(article.tags))` deduplicates within each article before incrementing the map.

---

#### Mistake 2: Forgetting `?? 0` when initializing map counts

```js
// WRONG — NaN on first occurrence
function nicheTagsOnly(articles) {
  const count = new Map();
  for (const article of articles) {
    for (const tag of article.tags) {
      count.set(tag, count.get(tag) + 1);  // BUG: undefined + 1 = NaN
    }
  }
  // All counts are NaN after the first occurrence of each tag.
  // The filter n === 1 never matches NaN. Returns [].
}
```

**Problem:** `count.get(tag)` returns `undefined` for the first occurrence. `undefined + 1` is `NaN`. All subsequent increments on `NaN` also produce `NaN`. The filter `n === 1` never matches `NaN`, so the function returns `[]`.
**Fix:** `(count.get(tag) ?? 0) + 1` — the default of `0` makes the first occurrence produce `0 + 1 = 1`.

---

#### Mistake 3: Using `===` to compare article objects

```js
// WRONG — accidental reference equality issue
function relatedArticles(articles, target) {
  return articles.filter(a => a !== target && sharedTags(a, target).length > 0);
}

// If target is a copy of an article rather than the same reference:
const targetCopy = { ...articles[0] };
relatedArticles(articles, targetCopy);
// articles[0] is NOT excluded — targetCopy !== articles[0] (different references)
// articles[0] appears in the results, "related to itself"
```

**Problem:** `a !== target` uses reference equality. A copied object with the same data is a different reference and passes the filter.
**Fix:** Compare by a unique identifier: `a.title !== target.title`, or give each article an `id` field and compare `a.id !== target.id`. Reference equality only works when you're guaranteed to be comparing the exact same object from the same array.

---

### Connection to interview problems

- **LeetCode 349 — Intersection of Two Arrays**: `sharedTags` with primitive arrays — deduplicate the result too. `[...new Set(sharedTags(a, b))]`.
- **LeetCode 819 — Most Common Word**: Count word frequencies with a Map, find the max — the same counting pattern as `nicheTagsOnly`, but returning the max count instead of filtering by count.
- **"Find all articles sharing at least k tags" (common interview design question)**: Build a tag→[articleIds] inverted index using a Map, then for each target tag, look up articles and count overlaps — a scaled-up version of `relatedArticles`.
- **LeetCode 771 — Jewels and Stones**: Build a Set of jewels, count stones in the Set. `allUniqueTags` + count in one pass — same pattern.

---

### Discussion questions

1. **`allUniqueTags` could be written as `[...new Set(articles.flatMap(a => a.tags))]`. Why might you prefer the explicit nested loop version?** The one-liner is elegant and idiomatic. The nested loop is more transparent about what's happening and is easier to extend (e.g., if you want to process tags in a special way as you add them). Both are O(n × t). For code that a team will maintain, explicit is often better; for functional pipelines, the one-liner fits.

2. **`nicheTagsOnly` builds a Map and then converts to an array with `.entries()`. Why not use a plain object `{}` as the counter?** You could: `count[tag] = (count[tag] ?? 0) + 1`. But `Map` is preferred because (a) it's designed for dynamic keys and guarantees iteration order by insertion, (b) tag strings could theoretically shadow prototype properties like `"constructor"` or `"hasOwnProperty"` in a plain object, and (c) `Map` has a cleaner API (`.get`, `.set`, `.entries`) vs object property access.

3. **`sharedTags(a, b)` returns tags in `b`'s order. What if you need the shared tags in sorted alphabetical order?** Call `.sort()` on the result: `sharedTags(a, b).sort()`. Or add `.sort()` at the end of the filter chain in the implementation. Sort is O(k log k) where k is the intersection size — negligible unless the intersection is very large.

4. **For the Jaccard similarity extension: if both articles have empty tag arrays, the function returns 1. Is that the right convention?** It's one defensible choice: two articles with no tags are "identical" in their tag space (they both have nothing). The alternative is to return 0 (undefined similarity) or `null` (no meaningful comparison). In practice, empty-tag articles should be filtered out before similarity computation — the question rarely arises in clean data.

---

### Further exploration

- **Inverted index**: The data structure underlying search engines. Instead of `article → tags`, build `tag → [articles]`. Lookup "find all articles with tag X" becomes O(1). The construction is the same nested loop; the structure is transposed. Try building one from the `articles` array.
- **TF-IDF**: "Term Frequency–Inverse Document Frequency" — a weighted similarity metric that gives less credit to tags that appear in many articles (common tags like "javascript" are less distinctive). `nicheTagsOnly` approximates the "inverse document frequency" filter. [Wikipedia — tf–idf](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) has a clear explanation.
- **Jaccard index applications**: Used in MinHash/LSH algorithms for approximate nearest neighbor search at scale — Spotify playlist similarity, document deduplication, image search. The naive O(n²) pairwise comparison doesn't scale; LSH approximates it in sub-quadratic time.
