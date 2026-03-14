// Day 017 — Lesson A (Foundations): Sets and Deduplication
// Tech: js (JavaScript)

// ------------------------------------------------------------

/**
 * deduplicate(arr)
 * ----------------
 * Given an array of primitive values, return a new array with all duplicates
 * removed. The order of first occurrences is preserved.
 *
 * Does NOT modify the input array.
 *
 * @param {Array} arr
 * @returns {Array}
 *
 * @example
 * deduplicate([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])  // => [3, 1, 4, 5, 9, 2, 6]
 * deduplicate(["a", "b", "a", "c"])              // => ["a", "b", "c"]
 * deduplicate([])                                 // => []
 * deduplicate([42])                               // => [42]
 */
function deduplicate(arr) {
  // TODO: implement
  // Hint: new Set(arr) removes duplicates; spread converts back to array.
}

// ------------------------------------------------------------

/**
 * intersection(arrA, arrB)
 * ------------------------
 * Return a new array containing only the elements that appear in BOTH arrA
 * and arrB. Elements from arrA are included if they exist in arrB.
 * The result preserves arrA's element order.
 *
 * Duplicates in arrA may produce duplicates in the result — this function
 * does not deduplicate its own output.
 *
 * @param {Array} arrA
 * @param {Array} arrB
 * @returns {Array}
 *
 * @example
 * intersection([1, 2, 3, 4], [3, 4, 5, 6])    // => [3, 4]
 * intersection(["js", "css", "html"], ["css", "ts", "js"])  // => ["js", "css"]
 * intersection([1, 2], [3, 4])                 // => []
 * intersection([], [1, 2, 3])                  // => []
 */
function intersection(arrA, arrB) {
  // TODO: implement
  // Hint: build a Set from arrB, then filter arrA keeping items in that set.
}

// ------------------------------------------------------------

/**
 * difference(arrA, arrB)
 * ----------------------
 * Return a new array containing elements that are in arrA but NOT in arrB.
 * This is the set difference A \ B (A minus B).
 * The result preserves arrA's element order.
 *
 * Note: difference(a, b) and difference(b, a) are NOT the same.
 *
 * @param {Array} arrA
 * @param {Array} arrB
 * @returns {Array}
 *
 * @example
 * difference([1, 2, 3, 4], [3, 4, 5, 6])    // => [1, 2]  (in A, not in B)
 * difference([3, 4, 5, 6], [1, 2, 3, 4])    // => [5, 6]  (in A, not in B)
 * difference([1, 2, 3], [1, 2, 3])          // => []
 * difference([], [1, 2, 3])                 // => []
 */
function difference(arrA, arrB) {
  // TODO: implement
  // Hint: build a Set from arrB, then filter arrA keeping items NOT in that set.
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// console.log(deduplicate([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]));
// // => [3, 1, 4, 5, 9, 2, 6]

// console.log(deduplicate(["a", "b", "a", "c"]));
// // => ["a", "b", "c"]

// console.log(intersection([1, 2, 3, 4], [3, 4, 5, 6]));
// // => [3, 4]

// console.log(intersection(["js", "css", "html"], ["css", "ts", "js"]));
// // => ["js", "css"]

// console.log(difference([1, 2, 3, 4], [3, 4, 5, 6]));
// // => [1, 2]

// console.log(difference([3, 4, 5, 6], [1, 2, 3, 4]));
// // => [5, 6]

// // Verify deduplication preserves first-occurrence order:
// const nums = [5, 1, 5, 2, 5, 3];
// console.log(deduplicate(nums));  // => [5, 1, 2, 3]  (5 first, not repeated)
