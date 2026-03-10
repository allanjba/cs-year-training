// Day 15 — Lesson A (Foundations): Sorting Algorithms
// Implement bubble sort, insertion sort, and an isSorted check from scratch.

// Sample data — use this to test your implementations manually.
const SAMPLE = [5, 2, 8, 1, 9, 3];
const ALREADY_SORTED = [1, 2, 3, 4, 5];
const REVERSE_SORTED = [5, 4, 3, 2, 1];
const SINGLE = [42];
const EMPTY = [];
const DUPLICATES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

// ------------------------------------------------------------

/**
 * Sorts an array of numbers in ascending order using bubble sort.
 *
 * Algorithm: make repeated passes through the array. On each pass, compare
 * adjacent pairs and swap them if the left element is greater than the right.
 * After each pass, the largest unsorted element has "bubbled" to its correct
 * position at the end. Use an early-exit optimization: if a full pass makes
 * no swaps, the array is already sorted — stop immediately.
 *
 * Sorts the array IN PLACE and also returns it (so you can write
 * `isSorted(bubbleSort([...arr]))`).
 *
 * Time complexity: O(n²) worst case, O(n) best case (already sorted).
 * Space complexity: O(1).
 *
 * @param {number[]} arr - The array to sort (modified in place).
 * @returns {number[]} The same array, sorted in ascending order.
 *
 * @example
 * bubbleSort([5, 2, 8, 1, 9, 3]) // => [1, 2, 3, 5, 8, 9]
 * bubbleSort([1, 2, 3])           // => [1, 2, 3]  (one pass, no swaps, exits early)
 * bubbleSort([])                  // => []
 */
function bubbleSort(arr) {
  // Your implementation here
}

// ------------------------------------------------------------

/**
 * Sorts an array of numbers in ascending order using insertion sort.
 *
 * Algorithm: maintain a sorted left portion of the array, one element long
 * initially. For each new element (starting at index 1), save it as `key`,
 * then shift elements in the sorted portion rightward until you find the
 * correct position for `key`. Insert `key` there.
 *
 * Think of it like sorting playing cards in your hand: pick up each card
 * and slide it into the right spot among the cards you're already holding.
 *
 * Sorts the array IN PLACE and also returns it.
 *
 * Time complexity: O(n²) worst case, O(n) best case (already sorted).
 * Space complexity: O(1).
 *
 * @param {number[]} arr - The array to sort (modified in place).
 * @returns {number[]} The same array, sorted in ascending order.
 *
 * @example
 * insertionSort([5, 2, 8, 1, 9, 3]) // => [1, 2, 3, 5, 8, 9]
 * insertionSort([1, 2, 3])           // => [1, 2, 3]  (inner loop never runs)
 * insertionSort([3, 1, 4, 1, 5])     // => [1, 1, 3, 4, 5]
 */
function insertionSort(arr) {
  // Your implementation here
}

// ------------------------------------------------------------

/**
 * Returns true if the array is sorted in non-decreasing order, false otherwise.
 *
 * An empty array and a single-element array are both considered sorted.
 * Equal adjacent elements (like [1, 1, 2]) count as sorted (non-decreasing).
 *
 * Time complexity: O(n).
 * Space complexity: O(1).
 *
 * @param {number[]} arr - The array to check.
 * @returns {boolean} True if sorted ascending (or empty/single-element).
 *
 * @example
 * isSorted([1, 2, 3, 5, 8, 9]) // => true
 * isSorted([1, 2, 2, 3])        // => true  (equal elements are fine)
 * isSorted([1, 3, 2])           // => false
 * isSorted([])                  // => true
 * isSorted([7])                 // => true
 */
function isSorted(arr) {
  // Your implementation here
}

// ------------------------------------------------------------
// Manual checks — uncomment one at a time to test your work.
// Remember: bubbleSort and insertionSort mutate the array!
// Pass a copy with [...arr] if you want to reuse SAMPLE.

// console.log(bubbleSort([...SAMPLE]));         // [1, 2, 3, 5, 8, 9]
// console.log(bubbleSort([...ALREADY_SORTED])); // [1, 2, 3, 4, 5]
// console.log(bubbleSort([...REVERSE_SORTED])); // [1, 2, 3, 4, 5]
// console.log(bubbleSort([...SINGLE]));         // [42]
// console.log(bubbleSort([...EMPTY]));          // []
// console.log(bubbleSort([...DUPLICATES]));     // [1, 2, 3, 3, 4, 5, 5, 6, 9]

// console.log(insertionSort([...SAMPLE]));         // [1, 2, 3, 5, 8, 9]
// console.log(insertionSort([...ALREADY_SORTED])); // [1, 2, 3, 4, 5]
// console.log(insertionSort([...REVERSE_SORTED])); // [1, 2, 3, 4, 5]
// console.log(insertionSort([...SINGLE]));         // [42]
// console.log(insertionSort([...EMPTY]));          // []

// console.log(isSorted([1, 2, 3, 5, 8, 9])); // true
// console.log(isSorted([1, 2, 2, 3]));        // true
// console.log(isSorted([1, 3, 2]));           // false
// console.log(isSorted([]));                  // true
// console.log(isSorted([7]));                 // true

// Compose them: sort then check
// console.log(isSorted(bubbleSort([...SAMPLE])));    // true
// console.log(isSorted(insertionSort([...SAMPLE]))); // true
