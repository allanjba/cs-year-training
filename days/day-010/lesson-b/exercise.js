// Day 010 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Cumulative budget tracking over days in a month.

const dailySpend = [10, 5, 0, 20, 15]; // you can adjust values as you test

/**
 * runningSpend(dailySpend)
 * ------------------------
 * Return an array of cumulative spend per day.
 *
 * Example:
 *   runningSpend([10, 5, 0]) => [10, 15, 15]
 */
function runningSpend(dailySpend) {
  // TODO: implement
}

/**
 * firstDayOverBudget(dailySpend, budget)
 * --------------------------------------
 * Given an array of daily spend amounts and a total monthly budget,
 * return the index (0-based) of the first day where cumulative spend
 * strictly exceeds the budget.
 *
 * If the budget is never exceeded, return null.
 */
function firstDayOverBudget(dailySpend, budget) {
  // TODO: implement (you may reuse runningSpend or accumulate on the fly)
}

/**
 * runningAverageSpend(dailySpend)
 * -------------------------------
 * Return the running average spend per day.
 *
 * Example:
 *   runningAverageSpend([10, 5]) => [10, 7.5]
 */
function runningAverageSpend(dailySpend) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(runningSpend(dailySpend));
// console.log(firstDayOverBudget(dailySpend, 20));
// console.log(runningAverageSpend(dailySpend));
