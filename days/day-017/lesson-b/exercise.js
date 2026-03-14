// Day 017 — Lesson B (Applied): Article Tag Analysis
// Tech: js (JavaScript)

// Sample data — a small content platform's article catalog.
const articles = [
  { title: "Understanding Async JS",        tags: ["javascript", "performance", "async"] },
  { title: "React Hooks Deep Dive",         tags: ["react", "javascript", "hooks"] },
  { title: "Database Indexing Strategies",  tags: ["performance", "database", "indexing"] },
  { title: "TypeScript with React",         tags: ["react", "typescript", "hooks"] },
  { title: "Node.js Event Loop",            tags: ["javascript", "async", "node"] },
  { title: "CSS Grid vs Flexbox",           tags: ["css", "layout", "frontend"] },
];

// ------------------------------------------------------------

/**
 * allUniqueTags(articles)
 * -----------------------
 * Return a flat array of all unique tags that appear across all articles.
 * Each tag appears at most once in the result.
 * Order is determined by first occurrence (across articles, in order).
 *
 * @param {Array<{title: string, tags: string[]}>} articles
 * @returns {string[]}
 *
 * @example
 * allUniqueTags(articles)
 * // => ["javascript", "performance", "async", "react", "hooks", "database",
 * //     "indexing", "typescript", "node", "css", "layout", "frontend"]
 *
 * allUniqueTags([])  // => []
 */
function allUniqueTags(articles) {
  // TODO: implement
  // Hint: create a Set, then loop over articles and each article's tags,
  // calling set.add(tag) for each. Return [...set].
}

// ------------------------------------------------------------

/**
 * nicheTagsOnly(articles)
 * -----------------------
 * Return an array of tags that appear in EXACTLY ONE article.
 * These are the niche or underused topics on the platform.
 *
 * A tag that appears multiple times within one article still counts as
 * appearing in one article (count by article, not by raw occurrence).
 *
 * Order of tags in the result does not matter.
 *
 * @param {Array<{title: string, tags: string[]}>} articles
 * @returns {string[]}
 *
 * @example
 * nicheTagsOnly(articles)
 * // => ["database", "indexing", "node", "css", "layout", "frontend"]
 * // (Tags appearing in only one article. "javascript", "performance",
 * //  "async", "react", "hooks", "typescript" appear in 2+ articles.)
 *
 * nicheTagsOnly([])  // => []
 */
function nicheTagsOnly(articles) {
  // TODO: implement
  // Build a Map<tag, count> tracking how many articles each tag appears in.
  // Use new Set(article.tags) to deduplicate within each article before counting.
  // Then filter to entries where count === 1 and return the tag strings.
}

// ------------------------------------------------------------

/**
 * sharedTags(articleA, articleB)
 * ------------------------------
 * Return an array of tags that both articles have in common.
 * This is the intersection of their tag arrays.
 *
 * @param {{title: string, tags: string[]}} articleA
 * @param {{title: string, tags: string[]}} articleB
 * @returns {string[]}
 *
 * @example
 * sharedTags(articles[0], articles[1])
 * // => ["javascript"]  (both have "javascript"; "performance"/"async" are only in [0])
 *
 * sharedTags(articles[1], articles[3])
 * // => ["react", "hooks"]  (both have "react" and "hooks")
 *
 * sharedTags(articles[0], articles[5])
 * // => []  (no tags in common between async JS and CSS Grid)
 */
function sharedTags(articleA, articleB) {
  // TODO: implement
  // Hint: build a Set from articleA.tags, then filter articleB.tags
  // keeping only tags in that set.
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// console.log("--- allUniqueTags ---");
// console.log(allUniqueTags(articles));
// Expected: 12 unique tags in first-occurrence order

// console.log("--- nicheTagsOnly ---");
// console.log(nicheTagsOnly(articles));
// Expected: ["database", "indexing", "node", "css", "layout", "frontend"]

// console.log("--- sharedTags ---");
// console.log(sharedTags(articles[0], articles[1]));  // ["javascript"]
// console.log(sharedTags(articles[1], articles[3]));  // ["react", "hooks"]
// console.log(sharedTags(articles[0], articles[5]));  // []

// // Edge cases:
// console.log(allUniqueTags([]));                       // []
// console.log(nicheTagsOnly([{ title: "Solo", tags: ["unique"] }]));  // ["unique"]
// console.log(sharedTags({ title: "A", tags: [] }, articles[0]));     // []
