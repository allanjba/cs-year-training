// Day 013 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Topic: binary search.
// All functions assume their array input is sorted in ascending order.

/**
 * binarySearch(sortedArray, target)
 * ----------------------------------
 * Return the index of target in sortedArray, or null if it is not present.
 *
 * Example:
 *   binarySearch([2, 5, 8, 12, 16, 23, 38], 23) => 5
 *   binarySearch([2, 5, 8, 12, 16, 23, 38], 9)  => null
 */
function binarySearch(sortedArray, target) {
  // TODO: implement
}

/**
 * findInsertPosition(sortedArray, value)
 * ----------------------------------------
 * Return the index at which value should be inserted to keep the array sorted.
 * If value already exists in the array, return the index of the first occurrence.
 *
 * Example:
 *   findInsertPosition([1, 3, 5, 7], 4) => 2  (between 3 and 5)
 *   findInsertPosition([1, 3, 5, 7], 0) => 0  (before everything)
 *   findInsertPosition([1, 3, 5, 7], 9) => 4  (after everything)
 *   findInsertPosition([1, 3, 5, 7], 5) => 2  (at the existing 5)
 */
function findInsertPosition(sortedArray, value) {
  // TODO: implement
}

/**
 * searchRange(sortedArray, target)
 * ---------------------------------
 * Return [firstIndex, lastIndex] of all occurrences of target.
 * If target is not in the array, return [-1, -1].
 *
 * Example:
 *   searchRange([1, 2, 2, 2, 3], 2) => [1, 3]
 *   searchRange([1, 2, 2, 2, 3], 4) => [-1, -1]
 *   searchRange([1, 2, 3], 2)       => [1, 1]
 */
function searchRange(sortedArray, target) {
  // TODO: implement (hint: run two binary searches — one left-biased, one right-biased)
}

// OPTIONAL: manual checks
// console.log(binarySearch([2, 5, 8, 12, 16, 23, 38], 23));     // 5
// console.log(findInsertPosition([1, 3, 5, 7], 4));              // 2
// console.log(searchRange([1, 2, 2, 2, 3], 2));                  // [1, 3]
