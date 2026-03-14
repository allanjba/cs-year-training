# Day 17 — Lesson B (Applied): Article Tag Analysis

## Why this matters

A content platform needs to surface related content, find coverage gaps, and understand what topics authors share expertise in. The raw data is an array of articles, each tagged with a list of topic keywords. The business questions — "which tags do two authors both write about?", "what tags appear only once across the platform?", "which articles share at least two tags?" — are all set operations applied to tag arrays.

This is where Lesson A's tools become immediately practical. Each article's tag list is naturally a set (tags are unique per article). The question "find articles related to this one" becomes "find articles whose tag set intersects with this article's tag set." The question "find niche topics" becomes "find tags that appear in only one article." You know the primitives — now apply them to a realistic data shape.

---

## The core concept

The scenario has a list of articles. Each article has a title and a `tags` array. The tags are strings like `"javascript"`, `"performance"`, `"react"`.

Three questions to answer with Set operations:

1. **All unique tags across all articles** — union of every article's tag set. This is a vocabulary of topics the platform covers.
2. **Tags that appear in only one article** — filter the unique tags to those whose count is 1. These are niche or underused topics.
3. **Tags two specific articles have in common** — intersection of their tag sets.

For (1) and (2), you need to count how many articles each tag appears in. A `Map<string, number>` is the right structure: for each article, for each tag, increment its count. After processing all articles, you can filter by count.

For (3), pure intersection: convert one article's tags to a Set, filter the other article's tags by that set.

---

## How it works (with hand trace)

**Sample data:**
```
article 0: ["javascript", "performance", "async"]
article 1: ["react", "javascript", "hooks"]
article 2: ["performance", "database", "indexing"]
article 3: ["react", "typescript", "hooks"]
```

**All unique tags (union of all tag sets):**
```
Collect all tags into one Set:
  process article 0: add "javascript", "performance", "async"
  process article 1: add "react", "javascript" (dup → skip), "hooks"
  process article 2: add "performance" (dup → skip), "database", "indexing"
  process article 3: add "react" (dup → skip), "typescript", "hooks" (dup → skip)

Result: {"javascript","performance","async","react","hooks","database","indexing","typescript"}
[...set] = 8 unique tags
```

**Tag frequency (count per tag):**
```
Map after processing all articles:
  "javascript":  2  (articles 0 and 1)
  "performance": 2  (articles 0 and 2)
  "async":       1  (article 0 only)
  "react":       2  (articles 1 and 3)
  "hooks":       2  (articles 1 and 3)
  "database":    1  (article 2 only)
  "indexing":    1  (article 2 only)
  "typescript":  1  (article 3 only)

Tags with count === 1: ["async", "database", "indexing", "typescript"]
```

**Shared tags between article 1 and article 3:**
```
article 1 tags: ["react", "javascript", "hooks"]
article 3 tags: ["react", "typescript", "hooks"]

setA = new Set(["react", "javascript", "hooks"])
filter article 3's tags: "react" ∈ setA ✓, "typescript" ∉ setA, "hooks" ∈ setA ✓

intersection = ["react", "hooks"]
```

---

## Code implementation

```javascript
const articles = [
  { title: "Understanding Async JS",   tags: ["javascript", "performance", "async"] },
  { title: "React Hooks Deep Dive",    tags: ["react", "javascript", "hooks"] },
  { title: "Database Indexing",        tags: ["performance", "database", "indexing"] },
  { title: "TypeScript with React",    tags: ["react", "typescript", "hooks"] },
];

function allUniqueTags(articles) {
  const tags = new Set();
  for (const article of articles) {
    for (const tag of article.tags) {
      tags.add(tag);
    }
  }
  return [...tags];
}

function nicheTagsOnly(articles) {
  // Tags that appear in exactly one article
  const count = new Map();
  for (const article of articles) {
    for (const tag of article.tags) {
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }
  return [...count.entries()]
    .filter(([, n]) => n === 1)
    .map(([tag]) => tag);
}

function sharedTags(articleA, articleB) {
  const setA = new Set(articleA.tags);
  return articleB.tags.filter(tag => setA.has(tag));
}
```

**`allUniqueTags`:** Nested loop — outer over articles, inner over tags. Each `tags.add(tag)` is O(1). Total: O(n × t) where n is the number of articles and t is the average tag count. The Set automatically deduplicates.

**`nicheTagsOnly`:** Same nested loop, but with a Map to count occurrences. `count.get(tag) ?? 0` returns 0 for unseen tags (nullish coalescing). After building the map, filter to entries with count 1, then map to extract just the tag strings. Total: O(n × t).

**`sharedTags`:** Intersection of two tag arrays. Build a Set from articleA's tags (O(a)), filter articleB's tags (O(b) with O(1) lookups). Total: O(a + b).

---

## Common pitfalls

**Counting the same tag twice within one article.** If an article's tag array has duplicates (e.g., `["js", "js", "react"]`), your count map will count "js" as appearing twice in the frequency map for that one article. In `nicheTagsOnly`, you want to count how many *articles* contain a tag, not how many times it appears across all tag arrays. Fix: deduplicate each article's tags before counting — `for (const tag of new Set(article.tags))`.

**Mutating input data.** Calling `article.tags.sort()` or `article.tags.push(...)` inside your functions modifies the original data. Functions that work with shared data should treat it as read-only. Your implementations above are safe — `Set`, `filter`, and `map` all produce new structures.

**`count.get(tag)` returning `undefined` for the first occurrence.** `undefined + 1` is `NaN`, not `1`. Always provide a default: `count.get(tag) ?? 0` (nullish coalescing) or `count.get(tag) || 0` (falsy check — works here since valid counts are always > 0). Using `??` is preferred because it's explicit about handling `null`/`undefined`, not all falsy values.

---

## Computer Science foundations

**Time complexity:** `allUniqueTags` and `nicheTagsOnly` are O(n × t) where n is the number of articles and t is average tags per article. This is essentially O(total tags). `sharedTags` is O(a + b) for two tag arrays of lengths a and b.

**Space complexity: O(u)** where u is the number of unique tags — the Set or Map stores one entry per unique tag.

**This is Map-Reduce thinking.** `nicheTagsOnly` follows the map-reduce pattern: the nested loop *maps* each (article, tag) pair into a (tag, count) accumulation (reduce), then the filter and map *transforms* the aggregated results. This is the same computational model as Hadoop or Spark's reduce phase — count occurrences, then filter by count.

**Connection to graph theory.** Articles and tags can be modeled as a bipartite graph: articles on one side, tags on the other, edges representing "article has tag." `sharedTags(A, B)` counts common neighbors. The number of shared tags is related to graph similarity metrics like the Jaccard coefficient: `|intersection| / |union|`.

---

## Real-world applications

**Content recommendations.** "Related articles" often uses tag intersection as a proxy for similarity. Articles with 3+ shared tags are likely in the same topical cluster. The Jaccard coefficient (intersection size ÷ union size) quantifies this as a similarity score between 0 and 1.

**Skill gap analysis.** Replace "tags" with "skills" and "articles" with "employees." `nicheTagsOnly` becomes "skills only one person has" — a single point of failure. `sharedTags` between a job description and a candidate's skill set is automated resume matching.

**Faceted search.** When filtering a product catalog by multiple attributes simultaneously ("in stock AND in category 'electronics' AND under $100"), each filter is a set of matching product IDs. The final result is the intersection of those sets. This is how search engines apply boolean filters efficiently.

---

## Before the exercise

Make sure you can answer these before coding:

1. In `allUniqueTags`, why do you use a `Set` rather than checking `arr.includes(tag)` before pushing? What's the complexity difference?
2. In `nicheTagsOnly`, what does `count.get(tag) ?? 0` return when `tag` has never been seen? What does it return on the second occurrence of the same tag?
3. `sharedTags(articleA, articleB)` — which article's tags do you convert to a Set? Why that one and not the other? (Hint: either is correct; think about which result order you prefer.)
4. If article tags can contain duplicates, how would you modify `nicheTagsOnly` to count how many *articles* contain each tag (not total occurrences)?
5. How would you compute the Jaccard similarity between two articles? The formula is `|intersection| / |union|` — both values are derivable from functions you've already written.
