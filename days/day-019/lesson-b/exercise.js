// Day 19 — Lesson B: Request Queue Simulation
// Topic: FIFO queue applied to web server request processing

// ─── Sample Data ────────────────────────────────────────────────────────────

// A batch of incoming HTTP requests, in arrival order.
// Each request has an id (unique), a priority level (1 = low, 3 = high),
// and a url representing the endpoint being called.
const REQUESTS = [
  { id: 1,  priority: 2, url: "/home" },
  { id: 2,  priority: 1, url: "/api/users" },
  { id: 3,  priority: 3, url: "/api/payments" },
  { id: 4,  priority: 1, url: "/static/logo.png" },
  { id: 5,  priority: 3, url: "/api/orders" },
  { id: 6,  priority: 2, url: "/about" },
  { id: 7,  priority: 1, url: "/static/style.css" },
  { id: 8,  priority: 3, url: "/api/checkout" },
];

// Smaller dataset useful for hand-tracing
const SMALL_REQUESTS = [
  { id: 1, priority: 2, url: "/home" },
  { id: 2, priority: 1, url: "/api" },
  { id: 3, priority: 2, url: "/about" },
  { id: 4, priority: 1, url: "/data" },
];

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Simulates processing all requests with N parallel workers (FIFO order).
 *
 * Workers pull from the front of the queue. Each "tick", all available
 * workers are assigned one request each. All assigned requests complete
 * before the next tick begins (simplified synchronous model).
 *
 * Steps:
 *   1. Copy requests into a local queue (don't mutate input).
 *   2. While the queue is not empty:
 *      a. Fill a batch: dequeue up to workerCount requests.
 *      b. "Complete" each: push req.id into the completed array.
 *   3. Return completed.
 *
 * @param {{ id: number, priority: number, url: string }[]} requests
 *   Requests in arrival order.
 * @param {number} workerCount  Number of parallel workers (>= 1).
 * @returns {number[]} Request IDs in the order they completed.
 *
 * @example
 * processQueue(SMALL_REQUESTS, 2)
 * // => [1, 2, 3, 4]  (ids in order: batch1=[1,2], batch2=[3,4])
 *
 * processQueue(SMALL_REQUESTS, 4)
 * // => [1, 2, 3, 4]  (all in one batch)
 *
 * processQueue(SMALL_REQUESTS, 1)
 * // => [1, 2, 3, 4]  (one at a time)
 */
function processQueue(requests, workerCount) {
  // TODO: copy requests into a local queue

  // TODO: initialize completed = []

  // TODO: while queue is not empty:
  //   - build a batch by dequeuing up to workerCount items
  //   - push each batch item's id into completed

  // TODO: return completed
}

/**
 * Groups requests by priority, preserving FIFO order within each group.
 *
 * Use a Map where each key is a priority number and each value is an
 * array of requests with that priority, in the order they appeared
 * in the input array.
 *
 * @param {{ id: number, priority: number, url: string }[]} requests
 * @returns {Map<number, { id: number, priority: number, url: string }[]>}
 *   A Map from priority → array of requests (FIFO within each priority).
 *
 * @example
 * const grouped = groupByPriority(SMALL_REQUESTS);
 * grouped.get(2)  // => [{id:1,...}, {id:3,...}]
 * grouped.get(1)  // => [{id:2,...}, {id:4,...}]
 *
 * // Keys appear in the order priorities were first encountered:
 * [...grouped.keys()]  // => [2, 1]
 */
function groupByPriority(requests) {
  // TODO: create an empty Map

  // TODO: for each request:
  //   - if the priority key doesn't exist in the map, add it with []
  //   - push the request into map.get(req.priority)

  // TODO: return the map
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// console.log("processQueue — 2 workers:", processQueue(SMALL_REQUESTS, 2));
// // Expected: [1, 2, 3, 4]

// console.log("processQueue — 1 worker:", processQueue(SMALL_REQUESTS, 1));
// // Expected: [1, 2, 3, 4]

// console.log("processQueue — 3 workers (full batch):", processQueue(REQUESTS, 3));
// // Expected: [1,2,3, 4,5,6, 7,8]  (batches of 3, last batch has 2)

// const grouped = groupByPriority(REQUESTS);
// console.log("\ngroupByPriority:");
// for (const [priority, reqs] of grouped) {
//   console.log(`  Priority ${priority}:`, reqs.map(r => r.id));
// }
// // Expected:
// //   Priority 2: [1, 6]
// //   Priority 1: [2, 4, 7]
// //   Priority 3: [3, 5, 8]

// // Verify REQUESTS array was not mutated:
// console.log("\nREQUESTS still has", REQUESTS.length, "items (should be 8)");
