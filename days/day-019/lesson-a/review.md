# Day 19 — Lesson A Review: Queue Fundamentals

## 1. What You Should Have Learned

- A queue enforces FIFO ordering: the first item enqueued is the first dequeued, making it ideal for fairness-critical scheduling.
- In JavaScript, an array with `push` (enqueue) and `shift` (dequeue) is the simplest queue implementation, though `shift` is O(n).
- BFS level-order traversal uses a queue to process all nodes at depth D before any at depth D+1; snapshotting `queue.length` is the mechanism that separates levels.
- The Hot Potato problem is modeled naturally as a circular queue: rotate N times, then eliminate the front element.
- BFS is O(n) time and O(n) space because every node is enqueued and dequeued exactly once.

## 2. Reviewing Your Implementation

### `levelOrder(root)`

**Reference implementation:**

```javascript
function levelOrder(root) {
  if (root === null) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;   // snapshot BEFORE the inner loop
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left !== null)  queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
```

**Key insights:**
- The snapshot `const levelSize = queue.length` is the crux of the algorithm. Without it, the inner loop processes children that belong to the next level, mixing levels together.
- Each node goes through two queue operations: one `push` (when enqueued as a child) and one `shift` (when processed). Total operations = 2n = O(n).
- The outer `while` loop iterates exactly as many times as there are levels in the tree (the tree's height + 1).

**Edge cases:**
- `null` root: return `[]` immediately. Without this guard, `queue.push(null)` runs and the loop crashes on `null.val`.
- Single-node tree: one outer iteration, `levelSize = 1`, no children enqueued. Returns `[[root.val]]`.
- Linear chain (only right children): each outer iteration processes exactly one node; returns `[[1], [2], [3], ...]`.

---

### `hotPotato(names, passes)`

**Reference implementation:**

```javascript
function hotPotato(names, passes) {
  const queue = [...names];           // copy to avoid mutating input

  while (queue.length > 1) {
    for (let i = 0; i < passes; i++) {
      queue.push(queue.shift());      // rotate one position clockwise
    }
    const eliminated = queue.shift(); // holder gets eliminated
    console.log(`${eliminated} is eliminated`);
  }

  return queue[0];
}
```

**Key insights:**
- The "rotate front to back" pattern (`push(shift())`) is the idiomatic way to advance a circular queue by one position.
- After `passes` rotations, the person at the front has "received" the potato `passes` times and is out.
- `[...names]` is crucial. Without the spread, `queue` and `names` alias the same array.

**Edge cases:**
- `names.length === 1`: while loop never runs; returns `names[0]` immediately.
- `passes === 0`: front player is immediately eliminated every round. Returns the last player.
- Large `passes` values: `passes % queue.length` would be equivalent but the naive loop is fine for reasonable inputs.

## 3. Going Deeper

### Extension 1: O(1) dequeue with a proper queue class

Array `shift()` is O(n). A classic trick is to use a head pointer:

```javascript
class Queue {
  constructor() {
    this.data = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(val) {
    this.data[this.tail] = val;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const val = this.data[this.head];
    delete this.data[this.head];
    this.head++;
    return val;
  }

  peek()    { return this.data[this.head]; }
  isEmpty() { return this.head === this.tail; }
  size()    { return this.tail - this.head; }
}

// Test it with BFS
function levelOrderFast(root) {
  if (root === null) return [];
  const result = [];
  const queue = new Queue();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    const levelSize = queue.size();
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.dequeue();
      currentLevel.push(node.val);
      if (node.left)  queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
```

Every `enqueue` and `dequeue` is O(1). The tradeoff is that object keys accumulate and are never freed until the Queue is garbage collected — a minor memory overhead acceptable for most use cases.

---

### Extension 2: Zigzag level-order traversal

LeetCode 103 asks for level-order where even levels go left-to-right and odd levels go right-to-left:

```javascript
function zigzagLevelOrder(root) {
  if (root === null) return [];
  const result = [];
  const queue = [root];
  let leftToRight = true;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = new Array(levelSize);

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      // Fill from left or right depending on direction
      const index = leftToRight ? i : (levelSize - 1 - i);
      currentLevel[index] = node.val;
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
    leftToRight = !leftToRight;   // alternate direction each level
  }

  return result;
}
```

The key insight: instead of `push`ing to `currentLevel`, pre-allocate it and fill by index. The BFS order doesn't change — only where within the level array each value lands.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Not snapshotting `queue.length`

```javascript
// WRONG — queue.length grows as children are enqueued
while (queue.length > 0) {
  const currentLevel = [];
  for (let i = 0; i < queue.length; i++) {  // BUG: dynamic upper bound
    const node = queue.shift();
    currentLevel.push(node.val);
    if (node.left)  queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  result.push(currentLevel);
}
```

```javascript
// FIX — snapshot the size before the inner loop
while (queue.length > 0) {
  const levelSize = queue.length;   // snapshot
  const currentLevel = [];
  for (let i = 0; i < levelSize; i++) {
    const node = queue.shift();
    currentLevel.push(node.val);
    if (node.left)  queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  result.push(currentLevel);
}
```

---

### Mistake 2: Mutating the input array in `hotPotato`

```javascript
// WRONG — queue IS the same array as names
function hotPotato(names, passes) {
  const queue = names;  // BUG: alias, not copy
  while (queue.length > 1) {
    for (let i = 0; i < passes; i++) queue.push(queue.shift());
    queue.shift();
  }
  return queue[0];
}
```

```javascript
// FIX — shallow copy the input
function hotPotato(names, passes) {
  const queue = [...names];  // copy
  while (queue.length > 1) {
    for (let i = 0; i < passes; i++) queue.push(queue.shift());
    queue.shift();
  }
  return queue[0];
}
```

---

### Mistake 3: Wrong elimination direction in `hotPotato`

```javascript
// WRONG — eliminates from the back instead of the front
function hotPotato(names, passes) {
  const queue = [...names];
  while (queue.length > 1) {
    for (let i = 0; i < passes; i++) queue.push(queue.shift());
    queue.pop();   // BUG: should be shift()
  }
  return queue[0];
}
```

```javascript
// FIX — the potato holder is at the FRONT after rotating
function hotPotato(names, passes) {
  const queue = [...names];
  while (queue.length > 1) {
    for (let i = 0; i < passes; i++) queue.push(queue.shift());
    queue.shift();  // correct: front player is eliminated
  }
  return queue[0];
}
```

## 5. Connection to Interview Problems

**LeetCode 102 — Binary Tree Level Order Traversal** (Medium)
This is exactly `levelOrder`. The only variation is that the problem guarantees the root exists. Practice it on LeetCode to get comfortable with the pattern under time pressure.

**LeetCode 107 — Binary Tree Level Order Traversal II** (Medium)
Same as 102 but the result is reversed (deepest level first). Solve it identically, then call `result.reverse()` at the end — or `result.unshift(currentLevel)` instead of `result.push(currentLevel)` during traversal.

**LeetCode 199 — Binary Tree Right Side View** (Medium)
For each level, return only the last node's value (what you'd see looking from the right). BFS level-order gives you each level as an array; just take `currentLevel[currentLevel.length - 1]`.

**LeetCode 622 — Design Circular Queue** (Medium)
Implement a queue with a fixed-size ring buffer. This forces you to think about head/tail pointers and the modulo trick for wrap-around — the O(1) dequeue structure described in the extension above.

## 6. Discussion Questions

**Q: Why does BFS use a queue while DFS uses a stack (or call stack for recursion)?**
A: The data structure dictates exploration order. A queue processes elements in the order they were added (FIFO), so the shallowest unvisited nodes are always processed first — which is exactly BFS. A stack processes the most recently added element first (LIFO), so the algorithm dives into the deepest branch before backtracking — which is DFS. Swapping the data structure literally swaps the algorithm.

**Q: What's the maximum number of nodes that can be in the queue at once during BFS on a complete binary tree?**
A: The maximum occurs when the queue holds all leaf nodes, which is the entire bottom level. A complete binary tree with height h has 2^h leaf nodes, which is roughly n/2. So the queue's maximum size is O(n), not O(log n). This is why BFS space complexity is O(n), not O(h).

**Q: `hotPotato` with `passes = 0` — what happens?**
A: The rotation loop runs 0 times, so no one is moved. The front player (index 0) immediately holds the potato and is eliminated. This repeats, eliminating `names[0]`, then `names[1]`, and so on. The winner is the last player in the original array: `names[names.length - 1]`.

**Q: Why is `shift()` O(n) and how would you fix it in production?**
A: JavaScript arrays are contiguous in memory. Removing the first element requires shifting every remaining element one position to the left — n-1 moves for a queue of n items. In production, you'd use a doubly linked list (O(1) head removal) or a ring buffer (circular array with head/tail pointers, O(1) for both ends). Node.js's built-in `collections` libraries and third-party packages like `double-ended-queue` provide O(1) queue implementations.

## 7. Further Exploration

**"A Common-Sense Guide to Data Structures and Algorithms" by Jay Wengrow, Chapter 19 (Queues)** — approachable prose explanation of queues with diagrams; good if the concepts feel abstract.

**LeetCode Explore — Queue & Stack** (`leetcode.com/explore/learn/card/queue-stack/`) — a structured sequence of problems starting with queue basics and building to BFS problems; free and interactive.

**"The Josephus Problem" (Wikipedia)** — the mathematical background behind `hotPotato`. Includes the O(1) formula and a fascinating history of how the problem appears in Josephus's own account of a siege, making it one of the oldest known algorithm problems.
