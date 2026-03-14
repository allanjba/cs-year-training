# Day 19 — Lesson B: Request Queue Simulation

## 1. Why This Matters

Every web server in existence has to answer a fundamental question dozens of times per second: "We have more incoming requests than we have workers. Which request do we handle next, and how do we track them all?" The answer is almost always a queue. Nginx, Node.js's event loop, thread pools in Java web servers, AWS Lambda's concurrency system — all of them use queuing to manage work that arrives faster than it can be processed.

Understanding this pattern makes you a better backend engineer immediately. When you configure `MAX_POOL_SIZE` in a database connection pool, you are tuning a queue. When a tech interview asks you to "design a rate limiter" or "build a job scheduler," the queue is always in the answer. When you read metrics like "p99 latency" and "request queue depth," you are reading properties of a live queue in production.

This lesson takes the raw queue mechanics from Lesson A and applies them to a realistic simulation: a web server with multiple workers processing HTTP requests. You will implement functions that model how a server assigns work, tracks which requests complete in which order, and groups requests by priority — a stepping stone toward understanding priority queues, which come later in the curriculum.

## 2. The Core Concept

Imagine a web server as a restaurant. Requests are customers arriving at the door. Workers are cooks in the kitchen. A queue is the waiting area. When a cook finishes a dish, they take the next customer's order from the front of the line. All cooks work simultaneously, so with N workers you can process N requests in parallel.

This model has two operations: **assigning** a request to a free worker (dequeue + mark worker busy), and **completing** a request (mark worker free, possibly assign next request). In a real async system this is event-driven; in our simulation we'll process it step by step.

The second concept is **grouping by a key while maintaining order**. `groupByPriority` must preserve the FIFO ordering within each priority bucket. If request A (priority 1) arrived before request B (priority 1), A should appear before B in the priority-1 group. JavaScript's `Map` preserves insertion order, which makes it the right tool — plain objects preserve insertion order too in modern JavaScript, but `Map` is semantically cleaner when keys are not known in advance.

## 3. How It Works — Hand Trace

**`processQueue` with 2 workers:**

```
requests = [
  {id:1, priority:2, url:"/home"},
  {id:2, priority:1, url:"/api"},
  {id:3, priority:2, url:"/about"},
  {id:4, priority:1, url:"/data"},
]
workerCount = 2

Initial state:
  queue  = [req1, req2, req3, req4]
  workers = [free, free]
  completed = []

--- Tick 1: assign work to free workers ---
  Worker 0 takes req1 (dequeue front)  → workers = [req1, free]
  Worker 1 takes req2 (dequeue front)  → workers = [req1, req2]
  queue = [req3, req4]

--- Tick 2: workers complete ---
  Worker 0 finishes req1  → completed = [1]   → workers = [free, req2]
  Worker 1 finishes req2  → completed = [1,2] → workers = [free, free]
  (In simulation: all assigned requests complete in one tick)

--- Tick 3: assign next batch ---
  Worker 0 takes req3  → workers = [req3, free]
  Worker 1 takes req4  → workers = [req3, req4]
  queue = []

--- Tick 4: complete ---
  completed = [1, 2, 3, 4]

Return [1, 2, 3, 4]
```

**`groupByPriority` trace:**

```
requests = [req1(p2), req2(p1), req3(p2), req4(p1)]

Start: map = new Map()

req1 (priority 2): map has no key 2 → map.set(2, []);  map.get(2).push(req1)
req2 (priority 1): map has no key 1 → map.set(1, []);  map.get(1).push(req2)
req3 (priority 2): map has key 2    →                   map.get(2).push(req3)
req4 (priority 1): map has key 1    →                   map.get(1).push(req4)

Result Map:
  2 → [req1, req3]
  1 → [req2, req4]
```

Order within each priority group matches arrival order — FIFO preserved.

## 4. Code Implementation

```javascript
// Sample request object shape
// { id: number, priority: number, url: string }

/**
 * Simulates processing all requests with N parallel workers.
 * Workers are assigned requests from the front of the queue (FIFO).
 * All assigned requests complete in one "tick" (simplified model).
 * Returns the IDs of completed requests in the order they completed.
 *
 * Time:  O(n) — each request is processed exactly once
 * Space: O(n) — workers array + completed array
 */
function processQueue(requests, workerCount) {
  const queue = [...requests];       // don't mutate input
  const completed = [];

  while (queue.length > 0) {
    // Fill all workers (up to workerCount) from the queue
    const batch = [];
    while (batch.length < workerCount && queue.length > 0) {
      batch.push(queue.shift());     // dequeue: FIFO assignment
    }

    // All workers complete their current request (simplified: instant)
    for (const req of batch) {
      completed.push(req.id);        // record completion order
    }
  }

  return completed;
}
```

```javascript
/**
 * Groups requests by priority, maintaining FIFO order within each group.
 * Uses a Map so that keys are iterated in insertion order.
 *
 * Time:  O(n) — one pass through requests
 * Space: O(n) — stores all requests in the map
 */
function groupByPriority(requests) {
  const map = new Map();             // priority (number) → request[]

  for (const req of requests) {
    if (!map.has(req.priority)) {
      map.set(req.priority, []);     // first time seeing this priority
    }
    map.get(req.priority).push(req); // FIFO: push to back of group
  }

  return map;
}
```

**Why `Map` over a plain object here:**
- A plain object coerces keys to strings. `obj[1]` and `obj["1"]` are the same key, which is surprising if priorities could ever be non-numeric.
- `Map` preserves insertion order for `Map.keys()`, `Map.values()`, and `Map.entries()` — a language spec guarantee.
- `map.has(key)` is more explicit and readable than `key in obj` or `obj[key] !== undefined`.

**Connecting back to queues:**
Each group in `groupByPriority` is itself a FIFO queue — requests within a priority level are processed in arrival order. A full priority queue system would dequeue from the highest-priority group first. That extension is left for you to explore.

## 5. Common Pitfalls

**Pitfall 1: Mutating the input `requests` array.**
`processQueue` calls `queue.shift()`. If `queue = requests` (not a copy), you destroy the caller's array. Always `[...requests]` at the start.

**Pitfall 2: Off-by-one in batch size.**
`while (batch.length < workerCount && queue.length > 0)` — both conditions are essential. The first prevents overfilling (more workers than you have). The second prevents running when the queue is empty. Missing either produces wrong batch sizes or infinite loops.

**Pitfall 3: Using a plain object instead of `Map` for `groupByPriority`.**
Numeric keys on a plain object get sorted in ascending numeric order when iterating with `for...in` or `Object.keys()`. If priority 3 is inserted before priority 1, `Object.keys(obj)` still returns `["1", "3"]`. A `Map` preserves insertion order, which represents the order priorities first appeared in the request stream.

**Pitfall 4: Forgetting that `Map.get` returns `undefined` for missing keys.**
`map.get(key).push(...)` will throw `TypeError: Cannot read properties of undefined` if the key doesn't exist yet. Always check `map.has(key)` (or use the pattern `map.get(key) ?? []`) before calling methods on the result.

## 6. Computer Science Foundations

**Producer-consumer pattern.** `processQueue` is a simplified producer-consumer system. Producers (the network) enqueue requests; consumers (workers) dequeue and process them. The queue decouples production from consumption: producers don't wait for workers to be free, and workers don't block waiting for requests to arrive.

**Work queue vs. task queue.** A work queue (like `processQueue`) assigns tasks to a fixed pool of workers. A task queue (like Celery, Sidekiq, BullMQ) also handles retries, priorities, delays, and persistence. Both are built on the same queue primitive.

**Round-robin vs. FIFO.**  `processQueue` uses strict FIFO. An alternative is round-robin: each worker maintains its own queue, and requests are distributed across workers in rotation. FIFO is fairer for latency (no request waits more than necessary); round-robin can achieve better load balancing when request processing times vary.

**Amortized complexity of batch dequeue.** The total number of `shift()` calls across all ticks equals `n` (one per request). Even though each `shift()` is O(n) in the worst case for arrays, we could make the whole simulation O(n) total with an O(1) queue (linked list or head-pointer array).

## 7. Real-World Applications

**Node.js event loop.** The event loop is a queue. I/O callbacks, resolved promises, and timer callbacks all sit in queues (microtask queue, macrotask queue). Understanding FIFO and the separation of queues by type explains the `process.nextTick` vs. `Promise.resolve` vs. `setTimeout` ordering that trips up many developers.

**AWS SQS (Simple Queue Service).** SQS lets you decouple microservices with durable FIFO queues. A Lambda function (worker) polls SQS, processes a batch of messages, and deletes them on success. This is `processQueue` at internet scale with durability guarantees.

**Database connection pools.** When all connections in a pool are in use and a new query arrives, the pool enqueues the query request. When a connection becomes free, it dequeues the oldest waiting query (FIFO). The pool's queue depth is a critical health metric.

**Kubernetes pod scheduling.** When a pod is submitted to Kubernetes and no node has enough resources, it enters a pending queue. The scheduler periodically dequeues pods and attempts to bind them to nodes. Priority classes let certain pods jump the queue — analogous to `groupByPriority` plus priority-aware dequeue.

## 8. Before the Exercise

Answer these questions before writing code:

1. In `processQueue`, what does the inner `while` loop's exit condition `queue.length > 0` protect against? What happens if you remove it?

2. If `workerCount = 1`, does `processQueue` still produce the correct output? Trace through the first three requests.

3. In `groupByPriority`, what is the relationship between insertion order into the `Map` and the order of `for (const req of requests)` iteration? Is FIFO within each priority guaranteed by the algorithm, or by JavaScript's `Map`?

4. What would change about `groupByPriority` if two requests have the same `id` but different priorities? Is `id` used as a key anywhere, or just recorded?

5. How would you modify `processQueue` so that it processes requests in priority order (highest priority first) instead of arrival order? What data structure would you need?
