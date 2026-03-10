// Day 010 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Topic: running totals / prefix sums.

/**
 * runningTotal(numbers)
 * ---------------------
 * Given [a, b, c, ...], return [a, a+b, a+b+c, ...].
 *
 * Example:
 *   runningTotal([1, 2, 3]) => [1, 3, 6]
 */
function runningTotal(numbers) {
  // TODO: implement
}

/**
 * runningAverage(numbers)
 * -----------------------
 * Given [a, b, c, ...], return the running averages:
 *   [a, (a+b)/2, (a+b+c)/3, ...]
 *
 * Requirements:
 * - For an empty array, return [].
 */
function runningAverage(numbers) {
  // TODO: implement
}

/**
 * prefixSumsFromIndex(numbers, index)
 * -----------------------------------
 * Using the idea of running totals, return the sum of numbers from 0
 * up to and including `index`.
 *
 * Requirements:
 * - If index is out of range, return null.
 */
function prefixSumsFromIndex(numbers, index) {
  // TODO: implement (you may reuse runningTotal)
}

// OPTIONAL: manual checks
// console.log(runningTotal([1, 2, 3]));
// console.log(runningAverage([1, 2, 3]));
// console.log(prefixSumsFromIndex([1, 2, 3], 1)); // 3
