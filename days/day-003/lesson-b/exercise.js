// Day 003 — Lesson B (Applied)
// Type: Applied
// Tech: js
//
// Scenario:
// You are scanning simple log lines to decide if the system is healthy.
// Each log line is just a string.

/**
 * isErrorLog(line)
 * ----------------
 * Return true if the log line should be treated as an error.
 *
 * For now, treat it as an error if (case-insensitive):
 * - It contains "error" OR
 * - It contains "failed"
 *
 * Requirements:
 * - Handle null/undefined by returning false.
 */
function isErrorLog(line) {
  // TODO: implement
}

/**
 * hasAnyErrors(logLines)
 * ----------------------
 * Return true if ANY log line in the array is an error according to isErrorLog.
 *
 * Requirements:
 * - Do not mutate the input array.
 * - Handle an empty array correctly.
 */
function hasAnyErrors(logLines) {
  // TODO: implement
}

/**
 * allLogsHealthy(logLines)
 * ------------------------
 * Return true if NO log line is an error according to isErrorLog.
 *
 * Requirements:
 * - For an empty array, return true (no evidence of errors).
 */
function allLogsHealthy(logLines) {
  // TODO: implement
}

// Sample data for manual testing:
const sampleLogs = [
  "INFO User logged in",
  "WARN Disk space at 80%",
  "ERROR Failed to connect to database",
  "INFO Request completed",
];

// Uncomment after implementing:
// console.log("Any errors?", hasAnyErrors(sampleLogs));
// console.log("All healthy?", allLogsHealthy(sampleLogs));
