// Day 20 — Lesson B: Word Frequency Analysis
// Topic: Map + string normalization for text frequency analysis

// ─── Sample Data ────────────────────────────────────────────────────────────

// A short blog post excerpt for analysis
const BLOG_POST = `
  JavaScript is a versatile programming language. JavaScript runs in the browser
  and on the server with Node.js. Many developers love JavaScript because it is
  flexible and ubiquitous. Learning JavaScript opens many doors in web development.
  The language has evolved significantly with modern JavaScript features like
  arrow functions, destructuring, and the Map data structure. Understanding the
  Map data structure is essential for every JavaScript developer.
`;

// A simpler text for hand-tracing during development
const SIMPLE_TEXT = "The quick brown fox jumps. The fox is quick!";

// A sentence with tricky punctuation
const TRICKY_TEXT = "Hello, world! Hello... world? hello-world.";

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Builds a word frequency map from a text string.
 *
 * Normalization steps (in order):
 *   1. Lowercase the entire string
 *   2. Remove all characters that are NOT letters, digits, or whitespace
 *      Hint: .replace(/[^a-z0-9\s]/g, "")  after lowercasing
 *   3. Split on whitespace (/\s+/)
 *   4. Filter out any empty strings
 *   5. Count with a Map
 *
 * @param {string} text - Raw text input (may have mixed case, punctuation)
 * @returns {Map<string, number>} Map from word to occurrence count
 *
 * @example
 * wordFrequency("The quick brown fox. The fox!")
 * // => Map { "the" → 2, "quick" → 1, "brown" → 1, "fox" → 2 }
 *
 * wordFrequency("")
 * // => Map {}
 */
function wordFrequency(text) {
  // TODO: normalize: lowercase, strip non-alphanumeric non-space chars

  // TODO: tokenize: split on whitespace, filter empty strings

  // TODO: count: build and return frequency Map
}

/**
 * Returns the top N words by frequency, as [word, count] pairs.
 *
 * Steps:
 *   1. Get the frequency map via wordFrequency(text)
 *   2. Spread .entries() into an array
 *   3. Sort descending by count (b[1] - a[1])
 *   4. Slice the first n entries
 *
 * If n >= uniqueWordCount, return all words (no crash).
 *
 * @param {string} text - Raw text input
 * @param {number} n    - How many top words to return
 * @returns {[string, number][]} Array of [word, count] pairs, sorted by count desc
 *
 * @example
 * topNWords("a a a b b c", 2)
 * // => [["a", 3], ["b", 2]]
 *
 * topNWords("a a a b b c", 10)
 * // => [["a", 3], ["b", 2], ["c", 1]]  (fewer than 10, no crash)
 */
function topNWords(text, n) {
  // TODO: get frequency map

  // TODO: spread entries, sort descending by count

  // TODO: slice first n and return
}

/**
 * Returns the number of distinct words in the text.
 * Normalization is applied, so "Hello" and "hello" count as one word.
 *
 * @param {string} text - Raw text input
 * @returns {number} Count of distinct normalized words
 *
 * @example
 * uniqueWordCount("Hello hello HELLO world")  // => 2  ("hello" and "world")
 * uniqueWordCount("")                          // => 0
 */
function uniqueWordCount(text) {
  // TODO: delegate to wordFrequency, return .size
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// console.log("=== SIMPLE_TEXT ===");
// const simpleFreq = wordFrequency(SIMPLE_TEXT);
// console.log("wordFrequency:", [...simpleFreq.entries()]);
// // Expected: [["the",2],["quick",2],["brown",1],["fox",2],["jumps",1],["is",1]]

// console.log("uniqueWordCount:", uniqueWordCount(SIMPLE_TEXT));
// // Expected: 6

// console.log("topNWords(n=3):", topNWords(SIMPLE_TEXT, 3));
// // Expected: [["the",2],["quick",2],["fox",2]]  (all tied at 2, then brown/jumps/is)

// console.log("\n=== TRICKY_TEXT ===");
// console.log("wordFrequency:", [...wordFrequency(TRICKY_TEXT).entries()]);
// // "Hello, world! Hello... world? hello-world."
// // After normalize: "hello world hello world helloworld"
// // Expected: Map { hello→2, world→2, helloworld→1 }
// // (hyphen is stripped, joining hello-world into one token)

// console.log("\n=== BLOG_POST ===");
// console.log("uniqueWordCount:", uniqueWordCount(BLOG_POST));
// console.log("topNWords(5):", topNWords(BLOG_POST, 5));
// // "javascript" and "the" should dominate
