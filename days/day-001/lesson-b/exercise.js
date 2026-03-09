// Day 001 — Lesson B (Applied)
// Type: Applied
// Tech: js
//
// Scenario:
// A small online shop exports a list of yesterday's order totals as numbers.
// You have been asked to compute a few simple metrics from this list.
//
// The focus today is on:
// - Turning a rough business request into clear function signatures.
// - Reusing your array + loop skills from Lesson A.

/**
 * calculateTotalRevenue(orders)
 * -----------------------------
 * Given an array of order totals (numbers), return the sum of all orders.
 *
 * Requirements:
 * - Do not mutate the input array.
 * - If there are no orders, return 0.
 */
function calculateTotalRevenue(orders) {
  // TODO: implement (you can reuse the idea of sumArray from Lesson A)
}

/**
 * countLargeOrders(orders, threshold)
 * -----------------------------------
 * Given an array of order totals and a numeric threshold, return how many
 * orders are strictly greater than the threshold.
 *
 * Example:
 *   countLargeOrders([10, 50, 120], 100) === 1
 */
function countLargeOrders(orders, threshold) {
  // TODO: implement
}

/**
 * calculateAverageOrderValue(orders)
 * ----------------------------------
 * Return the average order value (total revenue divided by number of orders).
 *
 * Requirements:
 * - If there are no orders, return 0 (not NaN).
 */
function calculateAverageOrderValue(orders) {
  // TODO: implement
}

// You can use the sample data below to sanity-check your implementation.

const sampleOrders = [19, 35, 12, 99, 5];

// Uncomment these lines once you have implementations:
// console.log('Total revenue:', calculateTotalRevenue(sampleOrders));
// console.log('Large orders > 50:', countLargeOrders(sampleOrders, 50));
// console.log('Average order value:', calculateAverageOrderValue(sampleOrders));
