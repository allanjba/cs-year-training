// Day 011 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario: API error rate monitoring using a sliding window.

const hourlyErrors = [2, 0, 4, 1, 3, 9, 7, 2, 0, 1];

/**
 * windowErrorRates(errorCounts, windowSize)
 * -----------------------------------------
 * Given an array of per-period error counts and a window size,
 * return an array of the average error rate for each window position.
 *
 * If errorCounts has fewer than windowSize elements, return [].
 *
 * Example:
 *   windowErrorRates([2, 0, 4, 1, 3], 3)
 *   => [2, 1.67, 2.67]  (rounded for display)
 *      (2+0+4)/3=2, (0+4+1)/3≈1.67, (4+1+3)/3≈2.67
 */
function windowErrorRates(errorCounts, windowSize) {
  // TODO: implement
}

/**
 * alertsTriggered(errorCounts, windowSize, threshold)
 * ----------------------------------------------------
 * Return true if any window's average error rate exceeds the threshold.
 * Return false otherwise.
 *
 * "Exceeds" means strictly greater than (>), not >=.
 *
 * Example:
 *   alertsTriggered([2, 0, 4, 1, 3, 9, 7, 2, 0, 1], 3, 5)  => true
 *   alertsTriggered([2, 0, 4, 1, 3, 9, 7, 2, 0, 1], 3, 10) => false
 */
function alertsTriggered(errorCounts, windowSize, threshold) {
  // TODO: implement (can reuse windowErrorRates)
}

/**
 * firstAlertWindow(errorCounts, windowSize, threshold)
 * -----------------------------------------------------
 * Return the starting index of the FIRST window whose average error rate
 * exceeds the threshold. Return null if no window exceeds the threshold.
 *
 * Example:
 *   firstAlertWindow([2, 0, 4, 1, 3, 9, 7, 2, 0, 1], 3, 5)
 *   => 4  (window starting at index 4: [3, 9, 7] → avg 6.33)
 */
function firstAlertWindow(errorCounts, windowSize, threshold) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(windowErrorRates(hourlyErrors, 3));
// console.log(alertsTriggered(hourlyErrors, 3, 5));    // true
// console.log(alertsTriggered(hourlyErrors, 3, 10));   // false
// console.log(firstAlertWindow(hourlyErrors, 3, 5));   // 4
