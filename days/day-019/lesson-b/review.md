# Day 19 — Lesson B Review: Request Queue Simulation

## 1. What You Should Have Learned

- The producer-consumer pattern uses a queue to decouple work arrival from work processing, and FIFO ensures no request is unfairly bypassed.
- `processQueue` models parallel workers as batch dequeuing: each tick fills up to N workers from the front of the queue.
- `groupByPriority` is a one-pass O(n) grouping operation; using `Map` preserves both insertion order of keys and FIFO order within each group.
- `Map` is preferable to plain objects when keys are dynamic, non-string, or when insertion-order iteration matters.
- The pattern `if (!map.has(key)) map.set(key, [])` followed by `map.get(key).push(item)` is the idiomatic JavaScript grouping idiom.

## 2. Reviewing Your Implementation

### `processQueue(requests, workerCount)`

**Reference implementation:**

```javascript
function processQueue(requests, workerCount) {
  const queue = [...requests];      // copy, don't mutate input
  const completed = [];

  while (queue.length > 0) {
    const batch = [];
    while (batch.length < workerCount && queue.length > 0) {
      batch.push(queue.shift());    // FIFO: take from front
    }
    for (const req of batch) {
      completed.push(req.id);       // record completion
    }
  }

  return completed;
}
```

**Key insights:**
- The double-`while` structure (outer: while work remains, inner: fill batch) is the standard "batch consumer" pattern. It cleanly handles partial last batches (when requests % workerCount !== 0).
- `queue.shift()` is called exactly `n` times total. Each `shift()` is O(n) for an array, so naive total complexity is O(n²). For the inputs in this exercise (n ≤ 100) this is invisible; for production queues with millions of requests, use a proper O(1) queue.
- Completion order equals arrival order because we enqueue in arrival order and always dequeue from the front. FIFO in → FIFO out.

**Edge cases:**
- `workerCount > requests.length`: the single batch fills with all requests; the inner while loop exits on `queue.length > 0`, not on `batch.length < workerCount`.
- `workerCount = 1`: degenerates to a serial loop; each batch has exactly one request.
- Empty `requests`: the outer while never runs; returns `[]`.

---

### `groupByPriority(requests)`

**Reference implementation:**

```javascript
function groupByPriority(requests) {
  const map = new Map();

  for (const req of requests) {
    if (!map.has(req.priority)) {
      map.set(req.priority, []);
    }
    map.get(req.priority).push(req);
  }

  return map;
}
```

**Key insights:**
- The `Map` key order reflects the order priorities first appeared in the input. If priority 2 arrives before priority 1, `[...map.keys()]` is `[2, 1]`.
- Within each priority group, requests appear in arrival order. This is guaranteed by the algorithm (we always `push` to the back of the group array), not by any special `Map` behavior.
- This function is a foundation for a priority queue system: to process in priority order, sort `[...map.keys()]` descending and dequeue from the highest-priority group first.

**Edge cases:**
- All same priority: map has one key containing all requests in arrival order.
- One request: map has one key with a one-element array.
- Empty array: returns an empty `Map`.

## 3. Going Deeper

### Extension 1: Priority-aware processing

Extend `processQueue` to process high-priority requests before low-priority ones:

```javascript
function processQueueByPriority(requests, workerCount) {
  // Group by priority first
  const grouped = groupByPriority(requests);

  // Sort priority keys descending (3 first, 1 last)
  const sortedPriorities = [...grouped.keys()].sort((a, b) => b - a);

  // Build a new ordered queue: all priority-3 first, then 2, then 1
  const orderedQueue = [];
  for (const priority of sortedPriorities) {
    orderedQueue.push(...grouped.get(priority));
  }

  // Now process FIFO within the priority-ordered queue
  const completed = [];
  while (orderedQueue.length > 0) {
    const batch = [];
    while (batch.length < workerCount && orderedQueue.length > 0) {
      batch.push(orderedQueue.shift());
    }
    for (const req of batch) {
      completed.push(req.id);
    }
  }

  return completed;
}

// Test:
// processQueueByPriority(REQUESTS, 2)
// Priority 3 first: [3, 5, 8], then priority 2: [1, 6], then priority 1: [2, 4, 7]
// Batches of 2: [3,5], [8,1], [6,2], [4,7]
// => [3, 5, 8, 1, 6, 2, 4, 7]
```

---

### Extension 2: Tracking worker assignments

Extend `processQueue` to return not just IDs but which worker handled each request:

```javascript
function processQueueWithWorkers(requests, workerCount) {
  const queue = [...requests];
  const completions = [];   // { workerId, requestId }

  while (queue.length > 0) {
    const batch = [];
    while (batch.length < workerCount && queue.length > 0) {
      batch.push(queue.shift());
    }
    batch.forEach((req, index) => {
      completions.push({ workerId: index, requestId: req.id });
    });
  }

  return completions;
}

// processQueueWithWorkers(SMALL_REQUESTS, 2)
// => [
//   { workerId: 0, requestId: 1 },
//   { workerId: 1, requestId: 2 },
//   { workerId: 0, requestId: 3 },
//   { workerId: 1, requestId: 4 },
// ]
```

This models a real dispatcher that tracks which worker handles which job — essential for logging, retries, and worker-specific rate limiting.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Mutating the input array

```javascript
// WRONG
function processQueue(requests, workerCount) {
  const queue = requests;   // BUG: alias, not copy
  const completed = [];
  while (queue.length > 0) {
    // ... shift() destroys requests
  }
  return completed;
}
```

```javascript
// FIX
function processQueue(requests, workerCount) {
  const queue = [...requests];   // defensive copy
  // ...
}
```

---

### Mistake 2: Missing the second while-condition in batch filling

```javascript
// WRONG — crashes when workerCount > remaining queue size
function processQueue(requests, workerCount) {
  const queue = [...requests];
  const completed = [];
  while (queue.length > 0) {
    const batch = [];
    while (batch.length < workerCount) {   // BUG: no queue.length > 0 guard
      batch.push(queue.shift());            // shift() returns undefined when empty
    }
    // undefined.id will throw
    for (const req of batch) completed.push(req.id);
  }
  return completed;
}
```

```javascript
// FIX — both conditions required
while (batch.length < workerCount && queue.length > 0) {
  batch.push(queue.shift());
}
```

---

### Mistake 3: Using an object instead of Map loses insertion-order for numeric keys

```javascript
// WRONG — numeric keys get sorted, not insertion-ordered
function groupByPriority(requests) {
  const obj = {};
  for (const req of requests) {
    if (!obj[req.priority]) obj[req.priority] = [];
    obj[req.priority].push(req);
  }
  return obj;
}
// Object.keys(obj) → ["1", "2", "3"] regardless of insertion order
```

```javascript
// FIX — Map preserves insertion order
function groupByPriority(requests) {
  const map = new Map();
  for (const req of requests) {
    if (!map.has(req.priority)) map.set(req.priority, []);
    map.get(req.priority).push(req);
  }
  return map;
}
// [...map.keys()] → [2, 1, 3]  (order priority values first appeared)
```

## 5. Connection to Interview Problems

**LeetCode 933 — Number of Recent Calls** (Easy)
A queue that counts how many calls happened in the last 3000ms. You enqueue timestamps and dequeue expired ones. The core skill is maintaining a sliding-window queue, which directly uses the shift/push pattern from this lesson.

**LeetCode 622 — Design Circular Queue** (Medium)
Implement a fixed-capacity queue with O(1) enqueue and dequeue using a ring buffer. The groupByPriority pattern of managing multiple logical queues appears in the follow-up design question.

**LeetCode 1670 — Design Front Middle Back Queue** (Medium)
A queue that supports insertion and deletion from the front, middle, and back. Requires two halves (two queues) kept balanced. The grouping-by-position pattern parallels groupByPriority.

**System Design — Task Scheduler / Job Queue**
A classic system design interview problem: design a job queue where workers poll for tasks, tasks have priorities, and failed tasks retry. Your `processQueue` and `groupByPriority` implementations are the core components. Extend them with: retry logic, dead-letter queues (failed jobs), and persistence.

## 6. Discussion Questions

**Q: Why does FIFO matter for fairness in a request queue? What goes wrong without it?**
A: Without FIFO, a server could process newly arrived requests before older ones — a condition called starvation. A request that arrived first might wait indefinitely if new requests keep arriving and getting processed sooner. FIFO guarantees that every request's wait time is bounded: you wait for at most all the requests ahead of you, no more.

**Q: In `groupByPriority`, why does the order of keys in the returned Map matter to the caller?**
A: If a caller iterates the map with `for (const [priority, reqs] of map)`, the iteration order is the insertion order of keys. If priorities were sorted numerically rather than by first appearance, the caller would see groups in a different order than the request stream — which could mislead monitoring dashboards or priority-processing logic that relies on "which priority appeared first."

**Q: How would you modify `processQueue` to simulate workers that take different amounts of time?**
A: Assign each request a `duration` property. Maintain a priority queue (min-heap) of `{finishTime, workerId}`. On each tick, advance time to the earliest finish, free that worker, and assign the next queued request. This is discrete-event simulation — the foundation of network simulators, CPU schedulers, and queuing theory tools.

**Q: What is the difference between a queue and a buffer? Are they the same?**
A: They overlap but aren't identical. A buffer is any temporary storage between producer and consumer, often with a fixed maximum size. A queue is a specific ordering discipline (FIFO). A bounded queue is a buffer with FIFO ordering. A buffer without FIFO ordering (e.g., it overwrites the oldest data when full) is a ring buffer or circular buffer — same structure, different semantics.

## 7. Further Exploration

**BullMQ documentation** (`docs.bullmq.io`) — BullMQ is the leading Node.js job queue library, built on Redis. Reading its architecture docs shows exactly how `processQueue` patterns (workers, concurrency, priorities, retries) are implemented in production. Particularly illuminating is the "concurrency" section which directly maps to your `workerCount` parameter.

**"Designing Data-Intensive Applications" by Martin Kleppmann, Chapter 11 (Stream Processing)** — goes deep on message queues (Kafka, RabbitMQ) as the backbone of data pipelines. After this lesson you have the conceptual vocabulary to follow the chapter's queue-based architecture discussions.

**AWS SQS FIFO Queues documentation** (`docs.aws.amazon.com/AWSSimpleQueueService`) — shows how the FIFO guarantee is implemented at cloud scale (sequence numbers, deduplication IDs, message groups). Your `groupByPriority` is conceptually similar to SQS's "message group" feature.
