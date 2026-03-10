## Day 009 — Lesson B (Applied): Weekly Content Engagement Snapshot

### Why this matters

Content platforms — blogs, newsletters, YouTube channels, news sites — need to understand how their content is performing. "Which articles got the most views? What's our average engagement? Which topics are most popular?" These questions guide editorial decisions, inform what to write next, and demonstrate value to advertisers or stakeholders.

This is the Week 1 culmination exercise: a realistic analytics problem that requires you to combine everything you've learned — scanning objects, frequency maps, accumulation, and decomposition — without being given the solution structure. You'll decide how to break it down.

### The core concept

The content platform exports article data like this:

```js
const articles = [
  { title: "Getting Started with Node.js", views: 1200, likes: 85, tags: ["javascript", "node", "tutorial"] },
  { title: "CSS Grid Explained",           views: 800,  likes: 60, tags: ["css", "webdev"] },
  { title: "Understanding Async/Await",    views: 3500, likes: 290, tags: ["javascript", "async", "tutorial"] },
  { title: "Docker for Developers",        views: 950,  likes: 72, tags: ["devops", "docker"] },
  { title: "React Hooks Deep Dive",        views: 2100, likes: 180, tags: ["javascript", "react", "tutorial"] },
];
```

From this, you need to produce:
- **Total views** across all articles
- **Average likes** per article
- **Tag frequency map** — how many articles use each tag?
- **Most viewed article** — which title got the most views?

Each of these calls for a pattern you've already practiced. The challenge is recognizing which pattern to apply to which sub-problem.

### How to approach this problem

Before writing any code, map each output to a pattern:

| Output | Pattern | Key fields |
|---|---|---|
| Total views | Scan + accumulate | `article.views` |
| Average likes | Scan + accumulate, then divide | `article.likes`, `articles.length` |
| Tag frequency | Frequency map — but tags is an array! | `article.tags` (nested iteration) |
| Most viewed | Scan + running max | `article.views`, `article.title` |

The tag frequency is the trickiest — each article has *multiple* tags, so you need to loop over articles *and* loop over each article's tag array.

### How it works

**Total views:**
```
1200 + 800 + 3500 + 950 + 2100 = 8550
```

**Average likes:**
```
total likes = 85 + 60 + 290 + 72 + 180 = 687
average = 687 / 5 = 137.4
```

**Tag frequency (nested loop needed):**
```
article 1: ["javascript", "node", "tutorial"]
  → javascript: 1, node: 1, tutorial: 1

article 2: ["css", "webdev"]
  → css: 1, webdev: 1

article 3: ["javascript", "async", "tutorial"]
  → javascript: 2, async: 1, tutorial: 2

article 4: ["devops", "docker"]
  → devops: 1, docker: 1

article 5: ["javascript", "react", "tutorial"]
  → javascript: 3, react: 1, tutorial: 3

result: { javascript: 3, node: 1, tutorial: 3, css: 1, webdev: 1,
          async: 1, devops: 1, docker: 1, react: 1 }
```

**Most viewed:**
```
running max: start null

"Getting Started with Node.js" views: 1200 → max = 1200, title = this
"CSS Grid Explained"           views: 800  → 800 < 1200, no change
"Understanding Async/Await"    views: 3500 → 3500 > 1200 → max = 3500, title = this
"Docker for Developers"        views: 950  → no change
"React Hooks Deep Dive"        views: 2100 → no change

result: "Understanding Async/Await"
```

### Code implementation patterns

**Nested loop for tags:**

```js
function tagFrequency(articles) {
  const counts = {};
  for (const article of articles) {
    for (const tag of article.tags) {         // inner loop over each article's tags
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
}
```

**The outer loop iterates over articles, the inner loop iterates over that article's tags.** Every tag from every article gets counted. The time complexity is O(n × t) where n is the number of articles and t is the average number of tags per article.

**Running max for most viewed:**

```js
function mostViewedTitle(articles) {
  if (articles.length === 0) return null;

  let bestTitle = articles[0].title;
  let bestViews = articles[0].views;

  for (const article of articles) {
    if (article.views > bestViews) {
      bestViews = article.views;
      bestTitle = article.title;
    }
  }

  return bestTitle;
}
```

**Seed with the first element** — same pattern as `minAndMax` from Day 1, but now tracking two pieces of state (the title and the view count).

### Common pitfalls specific to this problem

**1. Forgetting the nested loop for tags**

A common mistake is:

```js
counts[article.tags]++  // tries to use the whole array as a key!
```

Tags is an array, not a string. You need to loop over each tag individually.

**2. Average with empty array**

```js
function averageLikes(articles) {
  // missing: what if articles.length === 0?
  let total = 0;
  for (const article of articles) {
    total += article.likes;
  }
  return total / articles.length;  // 0/0 = NaN if empty!
}
```

Always check `articles.length === 0` before dividing.

**3. Returning the most-viewed views (a number) instead of the title (a string)**

Read the requirement carefully: "which title?" means return the string title, not the view count number.

**4. Comparing views with `>=` vs `>`**

Using `>=` means a later article with the same views count will displace an earlier one. Using `>` keeps the first occurrence. Either is correct — just be intentional about it.

### Computer Science foundations

**Time Complexity:**
- Total views / average likes: O(n)
- Tag frequency: O(n × t) where t = average tags per article; if t is bounded (say, max 10 tags), this is effectively O(n)
- Most viewed: O(n)
- Complete snapshot function: O(n) overall

**Space Complexity:** O(k) where k = number of distinct tags. For a content platform, this is bounded (hundreds of tags, not millions).

**Nested iteration:**
The tag frequency calculation uses nested loops — O(n × t). This is fine when t is small and bounded. If each article could have thousands of tags, you'd want to think about whether a different data structure would be more efficient. But for content tags (usually 1–10 per article), this is perfectly appropriate.

**Choosing the right output shape:**
A snapshot function returns one object with several fields. This is preferable to several separate functions that each require their own loop over the same data. You compute everything in one conceptual pass over the data (even if the implementation uses multiple function calls), and return a complete picture.

### Before the exercise

In the exercise file, you'll implement:

1. **`totalViews(articles)`** — Sum `article.views` across all articles
2. **`averageLikes(articles)`** — Compute the mean of `article.likes`; return `null` for empty input
3. **`tagFrequency(articles)`** — Return a frequency map of all tags across all articles (nested loop!)
4. **`mostViewedTitle(articles)`** — Return the title of the article with the most views; return `null` for empty input

Optionally, combine them into a `weeklySnapshot(articles)` function.

As you work:
- Plan your helpers before coding — which pattern does each require?
- Get each helper working independently before combining
- Handle the empty array case in each function
- For `tagFrequency`, trace through one or two articles by hand to verify the nested loop logic
- Write at least one assertion or `console.log` check per function using the sample data above

This is your Week 1 final. If you can implement all four functions cleanly and correctly, you've internalized the foundational toolkit. Week 2 builds on exactly this.
