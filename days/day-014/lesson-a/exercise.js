// Day 014 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Topic: recursion.
// IMPORTANT: every recursive function needs a base case. Write it first.

/**
 * factorial(n)
 * ------------
 * Return n! (n factorial): n * (n-1) * (n-2) * ... * 1.
 * factorial(0) = 1 by definition (empty product).
 * Assume n >= 0 (no negative inputs).
 *
 * Example:
 *   factorial(0) => 1
 *   factorial(5) => 120
 */
function factorial(n) {
  // TODO: implement recursively
  // Base case: n === 0
  // Recursive case: n * factorial(n - 1)
}

/**
 * sumArray(numbers)
 * -----------------
 * Return the sum of all numbers in the array using recursion.
 * Do NOT use a loop.
 *
 * Example:
 *   sumArray([3, 1, 4]) => 8
 *   sumArray([])        => 0
 */
function sumArray(numbers) {
  // TODO: implement recursively
  // Base case: empty array → 0
  // Recursive case: numbers[0] + sumArray(rest)
}

/**
 * countDown(n)
 * -------------
 * Return an array [n, n-1, n-2, ..., 1] using recursion.
 * If n <= 0, return [].
 *
 * Example:
 *   countDown(5) => [5, 4, 3, 2, 1]
 *   countDown(1) => [1]
 *   countDown(0) => []
 */
function countDown(n) {
  // TODO: implement recursively
  // Base case: n <= 0 → []
  // Recursive case: [n, ...countDown(n - 1)]
}

// OPTIONAL: manual checks
// console.log(factorial(5));       // 120
// console.log(sumArray([3,1,4]));  // 8
// console.log(countDown(5));       // [5, 4, 3, 2, 1]
