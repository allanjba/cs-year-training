// Day 012 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Topic: two-pointer technique.
// IMPORTANT: functions that use the "sum to target" approach require
// the input array to be sorted in ascending order.

/**
 * hasPairWithSum(sortedNumbers, target)
 * --------------------------------------
 * Given a SORTED array of numbers, return true if any two distinct
 * elements sum to exactly target. Return false otherwise.
 *
 * "Distinct" means two different positions (you cannot use the same
 * element twice).
 *
 * Example:
 *   hasPairWithSum([1, 3, 5, 7, 9], 12) => true  (3 + 9)
 *   hasPairWithSum([1, 3, 5, 7, 9], 2)  => false
 */
function hasPairWithSum(sortedNumbers, target) {
  // TODO: implement using two pointers
}

/**
 * isPalindrome(str)
 * -----------------
 * Return true if str reads the same forwards and backwards.
 * Use two pointers starting at opposite ends and moving inward.
 *
 * Example:
 *   isPalindrome("racecar") => true
 *   isPalindrome("hello")   => false
 *   isPalindrome("")        => true  (empty string is a palindrome)
 */
function isPalindrome(str) {
  // TODO: implement using two pointers
}

/**
 * countPairsWithSum(sortedNumbers, target)
 * -----------------------------------------
 * Return the count of distinct index pairs (i, j) where i < j
 * and sortedNumbers[i] + sortedNumbers[j] === target.
 *
 * Example:
 *   countPairsWithSum([1, 3, 3, 5], 6) => 1  (only one 3+3 pair)
 *   countPairsWithSum([1, 2, 3, 4], 5) => 2  (1+4, 2+3)
 *   countPairsWithSum([1, 2, 3, 4], 9) => 0
 */
function countPairsWithSum(sortedNumbers, target) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(hasPairWithSum([1, 3, 5, 7, 9], 12));    // true
// console.log(isPalindrome("racecar"));                 // true
// console.log(countPairsWithSum([1, 2, 3, 4], 5));     // 2
