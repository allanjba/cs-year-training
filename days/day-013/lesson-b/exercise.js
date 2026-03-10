// Day 013 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario: pricing tier lookup and log timestamp search using binary search.

const tierBoundaries = [0, 100, 500, 2000];
const tierNames = ["free", "starter", "growth", "enterprise"];

const logTimestamps = [1000, 1050, 1100, 1200, 1500, 2000];

/**
 * findPricingTier(userCount, boundaries, names)
 * -----------------------------------------------
 * Given a user count, a sorted array of tier start boundaries, and an array
 * of tier names (same length as boundaries), return the name of the tier the
 * user count falls into.
 *
 * A user count belongs to tier[i] if boundaries[i] <= userCount < boundaries[i+1]
 * (or userCount >= boundaries[last] for the final tier).
 *
 * Return null if userCount is below the minimum boundary.
 *
 * Example (using the constants above):
 *   findPricingTier(0,    tierBoundaries, tierNames) => "free"
 *   findPricingTier(100,  tierBoundaries, tierNames) => "starter"
 *   findPricingTier(750,  tierBoundaries, tierNames) => "growth"
 *   findPricingTier(5000, tierBoundaries, tierNames) => "enterprise"
 */
function findPricingTier(userCount, boundaries, names) {
  // TODO: implement using binary search (hint: use findInsertPosition logic)
}

/**
 * firstLogAfter(timestamps, targetTime)
 * ----------------------------------------
 * Given a sorted array of timestamps and a target time, return the INDEX
 * of the first timestamp that is >= targetTime.
 * Return null if all timestamps are before targetTime.
 *
 * Example (using logTimestamps above):
 *   firstLogAfter(logTimestamps, 1075) => 2  (timestamp 1100)
 *   firstLogAfter(logTimestamps, 1100) => 2  (exact match)
 *   firstLogAfter(logTimestamps, 2001) => null
 *   firstLogAfter(logTimestamps, 999)  => 0
 */
function firstLogAfter(timestamps, targetTime) {
  // TODO: implement using binary search
}

/**
 * countLogsInRange(timestamps, start, end)
 * -------------------------------------------
 * Return the count of timestamps in the closed range [start, end].
 * Uses two binary search calls — O(log n) instead of scanning all logs.
 *
 * Example (using logTimestamps above):
 *   countLogsInRange(logTimestamps, 1050, 1200) => 3  (1050, 1100, 1200)
 *   countLogsInRange(logTimestamps, 1001, 1049) => 0
 */
function countLogsInRange(timestamps, start, end) {
  // TODO: implement using two binary searches
}

// OPTIONAL: manual checks
// console.log(findPricingTier(750, tierBoundaries, tierNames));   // "growth"
// console.log(firstLogAfter(logTimestamps, 1075));                // 2
// console.log(countLogsInRange(logTimestamps, 1050, 1200));       // 3
