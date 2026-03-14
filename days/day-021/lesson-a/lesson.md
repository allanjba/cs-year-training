# Day 21 — Lesson A: Linked List Fundamentals

## 1. Why This Matters

Arrays are contiguous blocks of memory — every element sits right next to the previous one. That layout is excellent for indexed access (jump to element 500 in one operation) but poor for insertion and deletion in the middle (shifting everything costs O(n)). Linked lists invert this trade-off: insertion and deletion at any known position are O(1), but indexed access is O(n) because you must follow pointers from the head.

Understanding when to prefer a linked list over an array is a key engineering judgment. Browser history is a doubly linked list. Operating system memory allocators use linked lists to track free blocks. Most queue implementations in systems languages use linked lists for O(1) enqueue and dequeue. And in the garbage-collected world of JavaScript, most of those performance concerns are handled for you — but linked list problems remain one of the most tested categories in coding interviews, because they stress pointer manipulation and careful reasoning about references.

Linked lists also teach you to think in terms of "nodes and references" rather than "indices and arrays." This mental model generalizes to trees, graphs, and every other pointer-based data structure. Mastering linked lists is foundational.

## 2. The Core Concept

A singly linked list is a chain of **nodes**. Each node holds two things:
1. A **value** (the data).
2. A **next** pointer — a reference to the next node in the chain (or `null` if it's the last node).

The list is accessed through a **head** pointer, which refers to the first node. To reach the N-th node, you start at head and follow `next` pointers N times. You cannot go backward (that's a doubly linked list).

```
head → [1 | →] → [2 | →] → [3 | →] → [4 | null]
```

The key algorithmic patterns for linked lists:
- **Traversal**: start at head, advance with `current = current.next` until `current === null`.
- **Slow/fast pointer**: two pointers that advance at different speeds. The fast pointer moves 2 steps per iteration; the slow pointer moves 1. When fast reaches the end, slow is at the middle.
- **In-place reversal**: maintain `prev`, `current`, and `next` pointers. On each step, flip `current.next` to point backward, then advance all three.

## 3. How It Works — Hand Trace

**`findMiddle` with slow/fast pointers:**

List: `1 → 2 → 3 → 4 → 5`

```
slow = Node(1), fast = Node(1)

Iteration 1:
  fast.next    = Node(2) (not null)
  fast.next.next = Node(3) (not null)
  → advance: slow = Node(2), fast = Node(3)

Iteration 2:
  fast.next    = Node(4) (not null)
  fast.next.next = Node(5) (not null)
  → advance: slow = Node(3), fast = Node(5)

Iteration 3:
  fast.next    = null  ← stop condition!
  → return slow = Node(3)  ✓ (middle of 5 nodes)
```

List: `1 → 2 → 3 → 4` (even length)

```
slow = Node(1), fast = Node(1)

Iteration 1: slow = Node(2), fast = Node(3)
Iteration 2:
  fast.next    = Node(4) (not null)
  fast.next.next = null  ← stop condition!
  → return slow = Node(2)  (first of two middle nodes)
```

**`reverseList` with three pointers:**

List: `1 → 2 → 3 → null`

```
prev = null, current = Node(1)

Step 1:
  next = current.next = Node(2)     (save next before breaking link)
  current.next = prev = null         (flip the link)
  prev = current = Node(1)          (advance prev)
  current = next = Node(2)          (advance current)

  State: null ← [1]   [2] → [3] → null

Step 2:
  next = current.next = Node(3)
  current.next = prev = Node(1)
  prev = Node(2), current = Node(3)

  State: null ← [1] ← [2]   [3] → null

Step 3:
  next = current.next = null
  current.next = prev = Node(2)
  prev = Node(3), current = null

  State: null ← [1] ← [2] ← [3]

Loop exits (current === null)
Return prev = Node(3) — new head of reversed list
```

## 4. Code Implementation

```javascript
// Node factory — we use a plain object (no class needed)
function ListNode(val, next = null) {
  return { val, next };
}
```

```javascript
/**
 * Converts an array to a linked list, returning the head node.
 * listFromArray([1, 2, 3]) → Node(1) → Node(2) → Node(3) → null
 *
 * Time:  O(n)
 * Space: O(n) — n nodes created
 */
function listFromArray(arr) {
  if (arr.length === 0) return null;

  const head = ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = ListNode(arr[i]);
    current = current.next;          // advance to the newly created node
  }

  return head;
}
```

```javascript
/**
 * Converts a linked list to an array, in order from head to tail.
 * Useful for printing and testing.
 *
 * Time:  O(n)
 * Space: O(n) — the output array
 */
function listToArray(head) {
  const result = [];
  let current = head;

  while (current !== null) {
    result.push(current.val);
    current = current.next;   // follow the pointer
  }

  return result;
}
```

```javascript
/**
 * Finds the middle node using the slow/fast pointer technique.
 * For even-length lists, returns the FIRST of the two middle nodes.
 *
 * Time:  O(n) — but only n/2 iterations!
 * Space: O(1) — only two pointer variables
 */
function findMiddle(head) {
  if (head === null) return null;

  let slow = head;
  let fast = head;

  // Continue while fast has two more steps to take
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;  // slow is at the middle
}
```

```javascript
/**
 * Reverses a linked list in-place and returns the new head.
 * Uses three pointers: prev, current, next.
 *
 * Time:  O(n) — one pass
 * Space: O(1) — only three pointer variables
 */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current !== null) {
    const next = current.next;    // 1. save next (we're about to overwrite it)
    current.next = prev;          // 2. reverse the link
    prev = current;               // 3. advance prev
    current = next;               // 4. advance current
  }

  // When current === null, prev is the new head
  return prev;
}
```

## 5. Common Pitfalls

**Pitfall 1: Not saving `current.next` before reversing the link.**
In `reverseList`, `current.next = prev` destroys the reference to the rest of the list. If you haven't saved `next = current.next` first, you lose all subsequent nodes — a memory leak in languages with manual memory management, or an unreachable chain in JavaScript.

**Pitfall 2: Using index-based thinking on a linked list.**
Writing `list[3]` mentally is tempting, but you cannot index into a linked list. Every access requires traversal from head. If you find yourself writing `for (let i = 0; i < n; i++)` over a linked list, ask whether traversal with `current = current.next` is more natural.

**Pitfall 3: Off-by-one in the slow/fast pointer termination condition.**
The condition `fast.next !== null && fast.next.next !== null` checks that fast can safely advance TWO positions. If you write `fast !== null && fast.next !== null`, fast advances but `fast.next.next` may be null, causing errors on the next check. Be precise about which pointer is checked.

**Pitfall 4: Forgetting to handle null head.**
`findMiddle(null)` and `reverseList(null)` should return `null`. If you don't guard against null, `head.next` throws `TypeError: Cannot read properties of null`. Always check for the empty-list case at the top.

## 6. Computer Science Foundations

**Time-space trade-offs.** Arrays trade space (contiguous allocation) for O(1) indexed access. Linked lists trade pointers (extra memory per node) for O(1) insertion/deletion at a known position. Neither is universally better — the right choice depends on the dominant operations.

**The slow/fast pointer technique.** Also called Floyd's algorithm (more precisely, Floyd's tortoise and hare algorithm). It was originally designed to detect cycles in a linked list. The same technique finds the middle: when the fast pointer (moving at 2x speed) reaches the end, the slow pointer (at 1x) is at the halfway point. This generalizes: a k/n-ratio pointer combination can find the k/n position of a list in one pass.

**Pointer manipulation as graph traversal.** A linked list is a degenerate graph: each node has out-degree 1 (except the tail, which has out-degree 0). Traversal is DFS/BFS on a path graph. `reverseList` reverses all edges in the graph.

**In-place vs. allocating algorithms.** `reverseList` is O(1) space — it rewires existing nodes rather than allocating new ones. This is the in-place paradigm, critical in embedded systems and memory-constrained environments.

## 7. Real-World Applications

**Browser back/forward history.** Each visited page is a node. The current page is a pointer. Back navigates to `.prev`; forward navigates to `.next` (a doubly linked list). Appending a new page invalidates the forward chain — exactly `current.next = newNode`.

**Music playlists.** A playlist is a linked list of tracks. "Next track" follows `.next`; shuffle can rewire nodes without copying data. Repeat-one sets `current.next = current`.

**Memory allocators.** The `malloc` implementation in C keeps a linked list of free memory blocks. When you call `free(ptr)`, the freed block is inserted into the free list — O(1) with a pointer. When you call `malloc(size)`, it searches the free list for a large enough block — O(n) traversal.

**Undo/redo in text editors.** Each edit is a node. Undo follows the list backward (doubly linked). The list is bounded in length (e.g., max 50 undo steps), maintained by keeping a count and unlinking the oldest node when capacity is exceeded.

## 8. Before the Exercise

Answer these questions before writing code:

1. In `listFromArray`, what does the `current` variable represent as the loop progresses? Why do we initialize it to `head` rather than `null`?

2. In `listToArray`, what is the exit condition of the while loop? What happens on the last iteration — what is `current` after `current = current.next` when `current` was the tail node?

3. For the slow/fast pointer in `findMiddle`, why is the condition `fast.next !== null && fast.next.next !== null` (checking next.next) rather than just `fast !== null && fast.next !== null`?

4. In `reverseList`, there are exactly 4 pointer operations per iteration. Write them in order and explain why their order matters. What would happen if you did step 3 before step 1?

5. After calling `reverseList(head)`, is the original `head` pointer still valid? What does it point to now?
