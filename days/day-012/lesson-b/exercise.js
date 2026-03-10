// Day 012 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario: gift card budget matching for a product catalog.
// All functions assume sortedPrices is sorted in ascending order.

const catalog = [10, 15, 20, 25, 30, 35, 50, 75, 100];

/**
 * hasExactBudgetPair(sortedPrices, giftCardValue)
 * ------------------------------------------------
 * Return true if any two distinct products sum to exactly giftCardValue.
 * (You cannot use the same product twice.)
 *
 * Example:
 *   hasExactBudgetPair([10, 15, 20, 35, 50], 55) => true  (20 + 35)
 *   hasExactBudgetPair([10, 15, 20, 35, 50], 12) => false
 */
function hasExactBudgetPair(sortedPrices, giftCardValue) {
  // TODO: implement using two pointers
}

/**
 * countAffordablePairs(sortedPrices, budget)
 * -------------------------------------------
 * Return the number of distinct pairs (i, j) where i < j
 * and sortedPrices[i] + sortedPrices[j] <= budget.
 *
 * Example:
 *   countAffordablePairs([10, 20, 30, 40], 50) => 4
 *     (10+20, 10+30, 10+40, 20+30 all ≤ 50)
 */
function countAffordablePairs(sortedPrices, budget) {
  // TODO: implement using two pointers
}

/**
 * cheapestAffordablePair(sortedPrices, budget)
 * ---------------------------------------------
 * Return the pair [price1, price2] with the smallest combined price
 * that is still <= budget. Return null if no pair qualifies.
 *
 * If multiple pairs share the same minimum combined price, return any one.
 *
 * Example:
 *   cheapestAffordablePair([10, 20, 30, 40], 50) => [10, 20]
 *   cheapestAffordablePair([30, 40, 50], 20)     => null  (cheapest pair is 70)
 */
function cheapestAffordablePair(sortedPrices, budget) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(hasExactBudgetPair(catalog, 45));              // true  (10+35 or 15+30)
// console.log(hasExactBudgetPair(catalog, 12));              // false
// console.log(countAffordablePairs([10, 20, 30, 40], 50));  // 4
// console.log(cheapestAffordablePair([10, 20, 30, 40], 50));// [10, 20]
