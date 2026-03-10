## Day 009 — Lesson B Review: Weekly Content Engagement Snapshot

### What you should have learned

1. **Nested loops for nested data**: `tagFrequencyAcrossArticles` iterates over articles, then iterates over each article's `tags` array — a loop inside a loop. This is O(n × m) where n is articles and m is average tags per article, but it's still linear in total tags.
2. **Fields on objects can themselves be arrays**: `article.tags` is an array. Before you can count tags, you have to iterate into each article's inner array. Recognizing nested shapes is a fundamental skill for working with real-world JSON data.
3. **Guard division by zero explicitly**: `averageLikesPerArticle([])` must return `0` — the spec says so. Division by zero in JavaScript produces `NaN`, not an error, and `NaN` propagates silently into every downstream calculation.
4. **`totalViews` is a pure accumulation**: No conditions, no map — just add every `views` field. The simplest pattern, done correctly: initialize to `0`, loop, accumulate.
5. **Week 1 patterns compose naturally**: `totalViews` is Day 1's accumulation, `averageLikesPerArticle` adds the Day 1 division guard, and `tagFrequencyAcrossArticles` is Day 6's frequency map with an extra loop level. New problems are mostly old patterns in new combinations.

### Reviewing your implementation

#### Function 1: `totalViews(articles)`

```js
function totalViews(articles) {
  let total = 0;
  for (const article of articles) {
    total += article.views;
  }
  return total;
}

const articles = [
  { title: "Post A", views: 100, likes: 10, tags: ["js", "beginners"] },
  { title: "Post B", views: 50,  likes: 5,  tags: ["js", "arrays"]   },
  { title: "Post C", views: 0,   likes: 0,  tags: ["meta"]           },
];

console.log(totalViews(articles));   // 150
console.log(totalViews([]));         // 0
```

**Key insights:**
- Pure accumulation — no filtering, no conditions. Every article contributes its `views` to the total.
- An article with `views: 0` (Post C) contributes `0` — adding zero is correct, not a bug. Never skip zero-valued records.
- Initialize `total = 0`: adding `undefined` (if `views` were missing) would produce `NaN`. The initialization doesn't prevent that, but clean data is assumed here.

**Edge cases handled:**
- Article with `views: 0` → contributes `0`, doesn't break the total
- Empty array → `0` (loop never runs, accumulator stays at initial value)
- Single article → returns its `views` value

---

#### Function 2: `averageLikesPerArticle(articles)`

```js
function averageLikesPerArticle(articles) {
  if (articles.length === 0) return 0;

  let totalLikes = 0;
  for (const article of articles) {
    totalLikes += article.likes;
  }
  return totalLikes / articles.length;
}

console.log(averageLikesPerArticle(articles));   // 5 (15 / 3)
console.log(averageLikesPerArticle([]));         // 0 (not NaN — guarded)
```

**Key insights:**
- Guard `articles.length === 0` before dividing — division by zero in JavaScript yields `NaN` for `0/0`, not an error
- Two-phase structure: sum all likes, then divide once. Do not divide inside the loop.
- `totalLikes / articles.length` — not `/ 3` — the denominator is the length of the actual input, not a hardcoded constant

**Edge cases handled:**
- Empty array → `0` (explicit guard)
- All articles with `likes: 0` → `0` (correct average of zeros)
- Single article → returns that article's likes count (which equals the average)

---

#### Function 3: `tagFrequencyAcrossArticles(articles)`

```js
function tagFrequencyAcrossArticles(articles) {
  const counts = {};
  for (const article of articles) {
    for (const tag of article.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
}

console.log(tagFrequencyAcrossArticles(articles));
// { js: 2, beginners: 1, arrays: 1, meta: 1 }

console.log(tagFrequencyAcrossArticles([]));
// {}
```

**Key insights:**
- Two levels of iteration: outer loop over articles, inner loop over each article's `tags` array
- The inner loop is the same frequency-map pattern from Day 6 — `(counts[tag] || 0) + 1`
- Tags are flattened across all articles: "js" appears in Post A and Post B, so its count is `2`
- An article with an empty `tags: []` contributes nothing (the inner loop doesn't run for that article)

**Edge cases handled:**
- Article with empty `tags: []` → skipped gracefully (inner loop has nothing to iterate)
- Tag appearing in multiple articles → counted once per occurrence, not once per article
- Empty articles array → `{}`

### Going deeper

#### Extension 1: Top tag by frequency

```js
function mostUsedTag(articles) {
  if (articles.length === 0) return null;

  const freq = tagFrequencyAcrossArticles(articles);
  let topTag = null;
  let topCount = 0;

  for (const tag of Object.keys(freq)) {
    if (freq[tag] > topCount) {
      topCount = freq[tag];
      topTag = tag;
    }
  }

  return topTag;
}

console.log(mostUsedTag(articles));   // "js" (appears twice)
```

Build the frequency map with `tagFrequencyAcrossArticles`, then scan it for the max — the same "build once, query once" pattern as `mostCommonEvent` on Day 6.

#### Extension 2: Engagement rate per article

```js
function engagementRate(article) {
  if (article.views === 0) return 0;
  return article.likes / article.views;
}

function topEngagedArticle(articles) {
  if (articles.length === 0) return null;

  let best = null;
  let bestRate = -1;

  for (const article of articles) {
    const rate = engagementRate(article);
    if (rate > bestRate) {
      bestRate = rate;
      best = article;
    }
  }

  return best;
}

console.log(topEngagedArticle(articles));
// Post A: 10/100 = 0.1; Post B: 5/50 = 0.1; Post C: 0/0 = 0
// Tie between A and B — first encountered wins
```

The guard `if (article.views === 0) return 0` prevents division by zero at the level of a single article. Same pattern as the empty-array guard in `averageLikesPerArticle`, applied at a different granularity.

### Common mistakes and how to fix them

#### Mistake 1: Dividing inside the loop instead of after

```js
// WRONG — computes a running average, not a final average
function averageLikesPerArticle(articles) {
  if (articles.length === 0) return 0;
  let avg = 0;
  for (const article of articles) {
    avg += article.likes / articles.length;   // divides inside the loop
  }
  return avg;
}
```

**Problem:** This happens to give the correct answer for this specific calculation (summing fractions equals the fraction of sums) but it's harder to read, does more division operations, and obscures the intent.
**Fix:** Sum first, then divide once: `return totalLikes / articles.length;`

---

#### Mistake 2: Forgetting the inner loop in `tagFrequencyAcrossArticles`

```js
// WRONG — tries to count article.tags (an array) as a single value
function tagFrequencyAcrossArticles(articles) {
  const counts = {};
  for (const article of articles) {
    counts[article.tags] = (counts[article.tags] || 0) + 1;  // treats tags array as a key!
  }
  return counts;
}

console.log(tagFrequencyAcrossArticles(articles));
// { "js,beginners": 1, "js,arrays": 1, "meta": 1 }  — arrays coerce to comma-joined strings!
```

**Problem:** `article.tags` is an array. Using it as an object key coerces it to a string: `["js", "beginners"]` becomes `"js,beginners"`. The result counts tag-combinations, not individual tags.
**Fix:** Add the inner loop: `for (const tag of article.tags) { counts[tag] = (counts[tag] || 0) + 1; }`

---

#### Mistake 3: Not guarding empty array before averaging

```js
// WRONG — returns NaN for empty input
function averageLikesPerArticle(articles) {
  let totalLikes = 0;
  for (const article of articles) {
    totalLikes += article.likes;
  }
  return totalLikes / articles.length;   // 0 / 0 = NaN for empty array!
}

console.log(averageLikesPerArticle([]));   // NaN — propagates silently
```

**Problem:** `0 / 0 = NaN` in JavaScript. `NaN` propagates: any calculation that uses this result also becomes `NaN`. The spec explicitly says return `0` for empty input.
**Fix:** `if (articles.length === 0) return 0;` — guard before any division.

### Connection to interview problems

- **LeetCode 1480 — Running Sum of 1D Array**: Accumulate across an array — same structure as `totalViews`
- **LeetCode 1748 — Sum of Unique Elements**: Frequency map + filter — builds on `tagFrequencyAcrossArticles`'s frequency-map pattern
- **LeetCode 2006 — Count Number of Pairs With Absolute Difference K**: Frequency map on array elements, then query — same build-once query pattern
- **Real-world analytics**: Mixpanel, Amplitude, and PostHog compute exactly these metrics — total views, average engagement, tag/category frequency — from event streams. `tagFrequencyAcrossArticles` is the inner loop of every tag-cloud and content-performance dashboard.

### Discussion questions

1. **`tagFrequencyAcrossArticles` has a loop inside a loop — is it O(n²)?** No — it is O(n × m) where n is the number of articles and m is the average number of tags per article. If each article has at most 10 tags, the total work is at most 10n operations — still O(n) with respect to articles. The nested loop is only O(n²) if m scales with n, which tags per article don't.

2. **`totalViews` adds `article.views` without checking if it exists. What happens if a record has no `views` field?** `undefined + 0 = NaN`. The accumulator becomes `NaN` on the first missing field and stays `NaN` for the rest of the loop. In production, you'd validate at ingestion or default: `total += article.views ?? 0;`. For this exercise, clean data is assumed.

3. **`averageLikesPerArticle` returns `0` for an empty array. Should it return `null` instead?** It depends on who the caller is. `0` is simpler to work with (no null check required), but it blurs the distinction between "no articles" and "all articles have zero likes." In a dashboard that shows the average, `0` is fine. In a system that calculates weighted averages across groups, `null` signals "this group had no data." The spec says `0` — so return `0`, and document the decision.

4. **Could you compute all three metrics (`totalViews`, `averageLikes`, `tagFrequency`) in a single pass over the articles array?** Yes — one loop that accumulates `totalViews`, `totalLikes`, article count, and tag frequencies simultaneously. This is what a production analytics pipeline would do to avoid reading the data multiple times. For learning, three separate focused functions are better; for performance at scale, combine them.

### Further exploration

- Read about **content performance metrics**: How platforms like Medium, Substack, and Dev.to define and compute engagement — read time, scroll depth, likes, shares, comment rate. The underlying computation is always aggregation over event records, exactly as you practiced today.
- MDN: [Array.prototype.flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) — an alternative approach to `tagFrequencyAcrossArticles`: `articles.flatMap(a => a.tags)` flattens all tags into a single array, then you run `buildTagFrequency` on it. Two lines instead of a nested loop; same result.
