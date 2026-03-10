// Day 011 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Topic: sliding window (fixed size).

/**
 * maxWindowSum(numbers, k)
 * ------------------------
 * Return the maximum sum of any consecutive k elements in the array.
 * If the array has fewer than k elements, return null.
 *
 * Example:
 *   maxWindowSum([2, 1, 5, 3, 6, 4], 3) => 14  (window [5, 3, 6])
 *   maxWindowSum([1, 2, 3], 5)           => null (too short)
 */
function maxWindowSum(numbers, k) {
  // TODO: implement
}

/**
 * windowAverages(numbers, k)
 * --------------------------
 * Return an array of the average value for each k-element window.
 * The array will have (numbers.length - k + 1) elements.
 * If the array has fewer than k elements, return [].
 *
 * Example:
 *   windowAverages([1, 2, 3, 4, 5], 3) => [2, 3, 4]
 *     (1+2+3)/3=2, (2+3+4)/3=3, (3+4+5)/3=4
 */
function windowAverages(numbers, k) {
  // TODO: implement
}

/**
 * minWindowSum(numbers, k)
 * ------------------------
 * Return the minimum sum of any consecutive k elements.
 * If the array has fewer than k elements, return null.
 *
 * Example:
 *   minWindowSum([2, 1, 5, 3, 6, 4], 3) => 6  (window [2, 1, 5] no —
 *     windows: [2,1,5]=8, [1,5,3]=9, [5,3,6]=14, [3,6,4]=13 → min is 8)
 *   minWindowSum([4, 1, 2, 5], 2)        => 3  (window [1, 2])
 */
function minWindowSum(numbers, k) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(maxWindowSum([2, 1, 5, 3, 6, 4], 3));   // 14
// console.log(windowAverages([1, 2, 3, 4, 5], 3));    // [2, 3, 4]
// console.log(minWindowSum([4, 1, 2, 5], 2));          // 3
