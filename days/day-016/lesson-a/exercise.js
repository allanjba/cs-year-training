// Day 016 — Lesson A (Foundations): Merge Sort
// Tech: js (JavaScript)

/**
 * merge(left, right)
 * ------------------
 * Given two SORTED arrays, return a single sorted array containing all
 * elements from both. Does not modify either input.
 *
 * Example:
 *   merge([1, 4, 7], [2, 5, 6]) => [1, 2, 4, 5, 6, 7]
 *   merge([], [1, 2])           => [1, 2]
 *   merge([3], [])              => [3]
 */
function merge(left, right) {
  // TODO: implement
  // Use two pointers (i into left, j into right).
  // At each step take the smaller front element.
  // After the main loop, append whichever array still has elements.
}

/**
 * mergeSort(arr)
 * --------------
 * Return a new sorted array containing all elements of arr.
 * Uses the merge sort algorithm (divide, recurse, merge).
 * Does not modify the original arr.
 *
 * Example:
 *   mergeSort([8, 3, 5, 1, 6, 2]) => [1, 2, 3, 5, 6, 8]
 *   mergeSort([])                  => []
 *   mergeSort([42])                => [42]
 */
function mergeSort(arr) {
  // TODO: implement
  // Base case: arr.length <= 1 → already sorted, return it
  // Recursive case:
  //   mid = Math.floor(arr.length / 2)
  //   return merge(mergeSort(left half), mergeSort(right half))
}

// OPTIONAL: manual checks
// console.log(merge([1, 4, 7], [2, 5, 6]));         // [1, 2, 4, 5, 6, 7]
// console.log(mergeSort([8, 3, 5, 1, 6, 2]));       // [1, 2, 3, 5, 6, 8]
// console.log(mergeSort([]));                         // []
