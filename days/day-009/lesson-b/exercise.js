// Day 009 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Weekly content engagement snapshot.

const articles = [
  { title: "Post A", views: 100, likes: 10, tags: ["js", "beginners"] },
  { title: "Post B", views: 50, likes: 5, tags: ["js", "arrays"] },
  { title: "Post C", views: 0, likes: 0, tags: ["meta"] },
];

/**
 * totalViews(articles)
 * --------------------
 * Return the sum of the `views` field across all articles.
 */
function totalViews(articles) {
  // TODO: implement
}

/**
 * averageLikesPerArticle(articles)
 * --------------------------------
 * Return average likes per article (total likes / number of articles).
 * For an empty list, return 0 (not NaN).
 */
function averageLikesPerArticle(articles) {
  // TODO: implement
}

/**
 * tagFrequencyAcrossArticles(articles)
 * ------------------------------------
 * Build a frequency map of tags across all articles.
 *
 * Example (simplified):
 *   tagFrequencyAcrossArticles(articles) =>
 *     { js: 2, beginners: 1, arrays: 1, meta: 1 }
 */
function tagFrequencyAcrossArticles(articles) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(totalViews(articles));
// console.log(averageLikesPerArticle(articles));
// console.log(tagFrequencyAcrossArticles(articles));
