// Day 007 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Today you will:
// - Implement tiny assertion helpers.
// - Write a couple of small pure functions.
// - Add test cases using your assertions.

/**
 * assertEqual(actual, expected, message)
 * --------------------------------------
 * Log "PASS: <message>" when actual === expected.
 * Otherwise log "FAIL: <message> expected: <expected> got: <actual>".
 */
function assertEqual(actual, expected, message) {
  // TODO: implement
}

/**
 * assertArrayEqual(actual, expected, message)
 * -------------------------------------------
 * Very simple array equality checker:
 * - Treat two arrays as equal if they have the same length and
 *   the same values in the same order (using ===).
 */
function assertArrayEqual(actual, expected, message) {
  // TODO: implement
}

/**
 * sumNonNegative(numbers)
 * -----------------------
 * Return the sum of all numbers that are >= 0.
 *
 * Example:
 *   sumNonNegative([-1, 5, 3]) => 8
 */
function sumNonNegative(numbers) {
  // TODO: implement
}

/**
 * selectNonEmpty(strings)
 * -----------------------
 * Return an array containing only the non-empty strings from the input.
 *
 * Example:
 *   selectNonEmpty(["", "hi", " ", "ok"]) => ["hi", " ", "ok"]
 */
function selectNonEmpty(strings) {
  // TODO: implement
}

// After implementing the functions above, add a few test calls like:
// assertEqual(sumNonNegative([-1, 5, 3]), 8, "sumNonNegative basic case");
// assertArrayEqual(selectNonEmpty(["", "hi", "ok"]), ["hi", "ok"], "selectNonEmpty trims empties");
