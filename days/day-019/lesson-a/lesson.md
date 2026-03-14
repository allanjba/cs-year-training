# Day 19 — Lesson A: Queue Fundamentals

## 1. Why This Matters

Every time you send a message, stream a video, or wait for a web page to load, queues are doing invisible work. A message broker like Kafka stores millions of events in order and delivers them first-in, first-out. A CPU scheduler keeps a queue of threads waiting for execution time. A print spooler lines up documents so they emerge from the printer in the order they were sent. Queues are everywhere because ordering under concurrency is one of computing's fundamental problems, and queues solve it elegantly.

Compared to stacks (which you likely just studied), queues enforce the opposite discipline. A stack is LIFO — the last item pushed is the first item popped, like a stack of plates. A queue is FIFO — the first item enqueued is the first item dequeued, like a line at a coffee shop. The person who arrived first gets served first. That fairness guarantee is not a small thing; it prevents starvation, maintains causality, and makes systems predictable.

Queues are also the backbone of one of the most important graph algorithms you will ever learn: Breadth-First Search (BFS). BFS explores a graph level by level, and the reason it works is exactly because a queue processes nodes in the order they were discovered. Understanding queues deeply is a prerequisite for understanding BFS, shortest paths, network routing, and social graph queries.

## 2. The Core Concept

A queue is an ordered collection with two primary operations: **enqueue** (add to the back) and **dequeue** (remove from the front). Unlike arrays — which let you insert and remove anywhere — a queue exposes only two ends, and each end has exactly one allowed operation.

Think of a ticket line at a concert. People join at the back (enqueue). People are served from the front (dequeue). Nobody cuts in the middle. The structure enforces the rule so that code using the queue cannot accidentally break the ordering guarantee.

In JavaScript, you can implement a queue using an array: `push` adds to the back (enqueue), and `shift` removes from the front (dequeue). This works perfectly for small queues. For very large queues, `shift` is O(n) because it moves every remaining element — but for learning purposes and most interview problems, the array approach is fine and idiomatic.

The other key idea in this lesson is **BFS level-order traversal** of a tree. A binary tree has a root, and from the root you can reach its children (level 1), and from those children you can reach their children (level 2), and so on. "Level-order" means visiting all nodes on level 0, then all on level 1, then all on level 2. A queue makes this natural: you enqueue the root, then repeatedly dequeue a node, record its value, and enqueue its children. Because the queue is FIFO, you always finish all nodes at depth D before processing any node at depth D+1.

## 3. How It Works — Hand Trace

Consider this binary tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

We want `levelOrder(root)` to return `[[1], [2, 3], [4, 5, 6]]`.

Step-by-step:

```
queue = [Node(1)]
result = []

--- Iteration 1 ---
levelSize = 1         (there is 1 node at this level)
Dequeue Node(1) → currentLevel = [1]
  Enqueue Node(1).left  = Node(2)
  Enqueue Node(1).right = Node(3)
queue = [Node(2), Node(3)]
result = [[1]]

--- Iteration 2 ---
levelSize = 2         (queue has 2 items = nodes at next level)
Dequeue Node(2) → currentLevel = [2]
  Enqueue Node(2).left  = Node(4)
  Enqueue Node(2).right = Node(5)
Dequeue Node(3) → currentLevel = [2, 3]
  Node(3).left  = null, skip
  Enqueue Node(3).right = Node(6)
queue = [Node(4), Node(5), Node(6)]
result = [[1], [2, 3]]

--- Iteration 3 ---
levelSize = 3
Dequeue Node(4) → currentLevel = [4]  (no children)
Dequeue Node(5) → currentLevel = [4, 5]  (no children)
Dequeue Node(6) → currentLevel = [4, 5, 6]  (no children)
queue = []
result = [[1], [2, 3], [4, 5, 6]]
```

The key insight: snapshot `queue.length` at the start of each outer iteration. That snapshot is exactly how many nodes are on the current level. Process that many nodes, push their children (next level), and repeat.

## 4. Code Implementation

```javascript
// A simple tree node constructor
function TreeNode(val, left = null, right = null) {
  return { val, left, right };
}

/**
 * BFS level-order traversal.
 * Returns an array of arrays, one per level, left-to-right.
 * Time:  O(n) — every node is enqueued and dequeued exactly once
 * Space: O(n) — the queue holds at most O(w) nodes where w is max width,
 *               but in the worst case (complete binary tree) w = n/2
 */
function levelOrder(root) {
  if (root === null) return [];      // edge case: empty tree

  const result = [];
  const queue = [root];              // enqueue the root to start BFS

  while (queue.length > 0) {
    const levelSize = queue.length;  // snapshot: nodes at THIS level
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();    // dequeue from front (FIFO)
      currentLevel.push(node.val);

      // Enqueue children — they belong to the NEXT level
      if (node.left !== null)  queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    result.push(currentLevel);       // commit this level to result
  }

  return result;
}
```

```javascript
/**
 * Hot Potato game simulation.
 * Players sit in a circle. On each pass, the potato moves one position
 * clockwise. After exactly `passes` passes, the player holding the potato
 * is eliminated. Repeat until one player remains — that player wins.
 *
 * Time:  O(n * k) where n is initial players and k is passes per round
 * Space: O(n)
 */
function hotPotato(names, passes) {
  // Use an array as a circular queue
  const queue = [...names];          // copy so we don't mutate input

  while (queue.length > 1) {
    // Rotate: move `passes` people from front to back (they "pass" the potato)
    for (let i = 0; i < passes; i++) {
      queue.push(queue.shift());     // take from front, append to back
    }
    // The person now at the front has the potato — eliminate them
    const eliminated = queue.shift();
    console.log(`${eliminated} is eliminated`);
  }

  return queue[0];                   // last person standing
}
```

**Breaking down `hotPotato`:**
- The array is treated as a circular queue. Moving `passes` people from front to back simulates passing the potato clockwise.
- After `passes` rotations, the person at the front is "holding" the potato and gets eliminated via `shift()`.
- This continues until one person remains.

## 5. Common Pitfalls

**Pitfall 1: Not snapshotting `queue.length` before the inner loop.**
If you write `for (let i = 0; i < queue.length; i++)` inside the BFS loop, `queue.length` grows as you enqueue children, so you'll process more nodes than belong to the current level — collapsing multiple levels into one.

**Pitfall 2: Forgetting the null-root edge case.**
`levelOrder(null)` should return `[]`. If you don't guard for this, `queue.push(root)` pushes `null`, the while loop runs, `queue.shift()` returns `null`, and `null.val` throws a TypeError.

**Pitfall 3: Mutating the input array in `hotPotato`.**
`queue = names` makes them the same array. Every `shift()` and `push()` changes the caller's array. Always copy with `[...names]`.

**Pitfall 4: Off-by-one in the pass count.**
The problem says "after `passes` passes, eliminate the holder." Make sure your loop runs exactly `passes` times. A common mistake is running `passes - 1` times, which eliminates the wrong person.

## 6. Computer Science Foundations

**Time complexity of array-as-queue:**
- `push` is amortized O(1).
- `shift` is O(n) because every element shifts left one position. For a queue of 10,000 items, a single dequeue touches 9,999 elements.
- For truly O(1) dequeue, use a doubly linked list or a ring buffer (circular array with head/tail pointers).

**Why BFS uses a queue and DFS uses a stack:**
BFS processes the shallowest unvisited nodes first — exactly what FIFO gives you. DFS dives as deep as possible before backtracking — exactly what LIFO gives you. This is not a coincidence; the data structure determines the exploration order.

**BFS and shortest paths:**
In an unweighted graph, BFS finds the shortest path (fewest edges) between two nodes. This is because every node at distance D is discovered before any node at distance D+1. Dijkstra's algorithm generalizes this idea to weighted graphs by replacing the plain queue with a priority queue.

**The Josephus problem:**
`hotPotato` is an instance of the Josephus problem, studied since antiquity. There is a closed-form O(1) solution using modular arithmetic, but the queue simulation is the intuitive and readable approach.

## 7. Real-World Applications

**Print spoolers and job queues.** Operating systems queue print jobs, batch jobs, and background tasks in FIFO order. A FIFO queue guarantees that job submitted at 9:00 AM prints before a job submitted at 9:01 AM — a basic fairness requirement.

**Message brokers.** Apache Kafka, RabbitMQ, and AWS SQS are industrial-strength queue systems. Producers write events to a queue; consumers read and process them in order. The FIFO guarantee means downstream systems see events in the order they occurred.

**Web server request handling.** When more requests arrive than workers can handle immediately, the server enqueues the extras. Each worker takes the next request from the front of the queue when it finishes its current task. This prevents newer requests from jumping ahead of older ones.

**Level-order serialization of trees.** Many databases and serialization formats (like the one LeetCode uses to represent trees) serialize a binary tree by storing nodes level by level, left-to-right. Deserializing this format requires BFS.

## 8. Before the Exercise

Answer these five questions before you write any code:

1. In `levelOrder`, what value does `queue.length` hold at the start of the second outer iteration (after processing the root)? Why does snapshotting this value matter?

2. If the input tree is a linked list (every node has only a right child), what does `levelOrder` return? How many outer iterations does the while loop execute?

3. In `hotPotato(["Alice", "Bob", "Carol"], 1)`, trace through by hand. Who gets eliminated first? Who wins?

4. What would happen to `levelOrder` if you replaced `queue.shift()` (dequeue from front) with `queue.pop()` (remove from back)? What traversal order would you get instead?

5. What is the time complexity of the array-based queue in `hotPotato` if there are `n` players and `k` passes per round? Where does the cost come from?
