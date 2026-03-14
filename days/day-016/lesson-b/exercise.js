// Day 016 — Lesson B (Applied): Merging Sorted Event Logs
// Tech: js (JavaScript)

// Sample data — event logs from three servers, each sorted by timestamp.
const serverA = [
  { timestamp: 1000, server: "A", message: "Server started" },
  { timestamp: 1020, server: "A", message: "Request received" },
  { timestamp: 1050, server: "A", message: "Request processed" },
  { timestamp: 1100, server: "A", message: "Request received" },
];

const serverB = [
  { timestamp: 1010, server: "B", message: "Server started" },
  { timestamp: 1030, server: "B", message: "Health check OK" },
  { timestamp: 1060, server: "B", message: "Request received" },
  { timestamp: 1090, server: "B", message: "Request processed" },
];

const serverC = [
  { timestamp: 1005, server: "C", message: "Server started" },
  { timestamp: 1040, server: "C", message: "Cache miss" },
  { timestamp: 1070, server: "C", message: "Database query" },
  { timestamp: 1110, server: "C", message: "Response sent" },
];

// ------------------------------------------------------------

/**
 * mergeSortedLogs(logs1, logs2)
 * ------------------------------
 * Given two arrays of log entries each already sorted by timestamp,
 * return a single merged array also sorted by timestamp.
 *
 * Each log entry has the shape: { timestamp: number, server: string, message: string }
 *
 * Does NOT modify either input array. Returns a new array.
 *
 * On ties (same timestamp), entries from logs1 should appear before entries
 * from logs2 (stable across sources — use <=, not <).
 *
 * @param {Array<{timestamp: number, server: string, message: string}>} logs1
 * @param {Array<{timestamp: number, server: string, message: string}>} logs2
 * @returns {Array<{timestamp: number, server: string, message: string}>}
 *
 * @example
 * mergeSortedLogs(serverA, serverB)
 * // => [
 * //   { timestamp: 1000, server: "A", message: "Server started" },
 * //   { timestamp: 1010, server: "B", message: "Server started" },
 * //   { timestamp: 1020, server: "A", message: "Request received" },
 * //   ...
 * // ]
 */
function mergeSortedLogs(logs1, logs2) {
  // TODO: implement
  // Use two pointers: i into logs1, j into logs2.
  // Compare logs1[i].timestamp and logs2[j].timestamp.
  // Take the entry with the smaller timestamp (use <= for stability).
  // After the main loop, append whichever array still has entries.
}

// ------------------------------------------------------------

/**
 * mergeAllLogs(logArrays)
 * ------------------------
 * Given an array of log arrays (each already sorted by timestamp),
 * return a single merged array sorted by timestamp.
 *
 * Uses mergeSortedLogs to combine the arrays one at a time.
 *
 * Returns [] if logArrays is empty.
 *
 * @param {Array<Array<{timestamp: number, server: string, message: string}>>} logArrays
 * @returns {Array<{timestamp: number, server: string, message: string}>}
 *
 * @example
 * mergeAllLogs([serverA, serverB, serverC])
 * // => all 12 entries sorted by timestamp ascending
 *
 * mergeAllLogs([])
 * // => []
 */
function mergeAllLogs(logArrays) {
  // TODO: implement
  // Guard: if logArrays is empty, return [].
  // Use logArrays.reduce(mergeSortedLogs) to fold all arrays into one.
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// const mergedAB = mergeSortedLogs(serverA, serverB);
// console.log("--- mergeSortedLogs(A, B) ---");
// console.log(mergedAB.map(e => `[${e.timestamp}] ${e.server}: ${e.message}`));
// Expected: timestamps in order 1000, 1010, 1020, 1030, 1050, 1060, 1090, 1100

// const mergedAll = mergeAllLogs([serverA, serverB, serverC]);
// console.log("--- mergeAllLogs([A, B, C]) ---");
// console.log(mergedAll.map(e => `[${e.timestamp}] ${e.server}: ${e.message}`));
// Expected: 12 entries in timestamp order
// 1000 A, 1005 C, 1010 B, 1020 A, 1030 B, 1040 C,
// 1050 A, 1060 B, 1070 C, 1090 B, 1100 A, 1110 C

// console.log("--- edge cases ---");
// console.log(mergeSortedLogs([], serverA));      // => serverA entries only
// console.log(mergeSortedLogs(serverA, []));      // => serverA entries only
// console.log(mergeAllLogs([]));                  // => []
// console.log(mergeAllLogs([serverA]));           // => serverA entries only
