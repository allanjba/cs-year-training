// Day 006 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Today you will build simple frequency maps using plain objects.
// For each function:
// - Add a brief Big-O time complexity comment.
// - Note at least one non-trivial edge case.

/**
 * charFrequency(text)
 * -------------------
 * Return an object mapping each character in `text` to how many times
 * it appears.
 *
 * Example:
 *   charFrequency("aba") => { a: 2, b: 1 }
 */
function charFrequency(text) {
  // TODO: implement
}

/**
 * valueFrequency(values)
 * ----------------------
 * Return an object mapping each distinct value in the array to its count.
 *
 * Example:
 *   valueFrequency(["a", "b", "a"]) => { a: 2, b: 1 }
 */
function valueFrequency(values) {
  // TODO: implement
}

/**
 * mostFrequentValue(values)
 * -------------------------
 * Return the value that appears most often in the array.
 *
 * Requirements:
 * - If there are multiple values tied for most frequent, returning any
 *   one of them is fine.
 * - If the array is empty, return null.
 *
 * Hint: you can use valueFrequency to help.
 */
function mostFrequentValue(values) {
  // TODO: implement
}

/**
 * countUniqueValues(values)
 * -------------------------
 * Return how many distinct values appear in the array.
 *
 * Example:
 *   countUniqueValues(["a", "b", "a"]) => 2
 */
function countUniqueValues(values) {
  // TODO: implement (can also reuse valueFrequency)
}

// OPTIONAL: manual checks
// console.log(charFrequency("hello"));
// console.log(valueFrequency(["a", "b", "a", "c", "b"]));
// console.log(mostFrequentValue(["a", "b", "a", "c", "b", "a"]));
// console.log(countUniqueValues(["a", "b", "a", "c", "b"]));
