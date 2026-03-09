// Day 003 — Lesson A (Foundations)
// Type: Foundations
// Tech: js
//
// Today you will work with array-search patterns: "contains", "all", "any".
//
// INSTRUCTIONS:
// 1. Implement each function below.
// 2. Above each function, add a comment with your Big-O time complexity guess.
// 3. Use early returns where it makes the intent clearer.

/**
 * containsValue(items, target)
 * ----------------------------
 * Return true if `target` appears anywhere in the `items` array.
 *
 * Requirements:
 * - Use a loop, do not call built-in `.includes()` for this exercise.
 * - Handle the empty array correctly.
 */
function containsValue(items, target) {
  // TODO: implement
}

/**
 * allGreaterThan(numbers, threshold)
 * ----------------------------------
 * Return true if EVERY number in the array is strictly greater than `threshold`.
 *
 * Requirements:
 * - For an empty array, return true (this is a common convention).
 */
function allGreaterThan(numbers, threshold) {
  // TODO: implement
}

/**
 * anyMatch(items, predicate)
 * --------------------------
 * `predicate` is a function that takes one item and returns true/false.
 * Return true if `predicate(item)` is true for AT LEAST ONE item in `items`,
 * otherwise return false.
 *
 * Example:
 *   anyMatch([1, 2, 3], (n) => n % 2 === 0) === true
 */
function anyMatch(items, predicate) {
  // TODO: implement
}

// OPTIONAL manual tests:
// console.log(containsValue([1, 2, 3], 2)); // true
// console.log(allGreaterThan([5, 10], 3)); // true
// console.log(allGreaterThan([], 3)); // true
// console.log(anyMatch([1, 3, 5], (n) => n % 2 === 0)); // false
