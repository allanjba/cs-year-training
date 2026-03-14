# Day 21 — Lesson A Review: Linked List Fundamentals

## 1. What You Should Have Learned

- A singly linked list is a chain of nodes, each holding a value and a `next` pointer. The only entry point is the `head`.
- `listFromArray` and `listToArray` establish the round-trip pattern used to construct and verify linked lists in tests.
- The slow/fast pointer technique finds the middle in O(n) time and O(1) space by exploiting the 2:1 speed ratio between pointers.
- `reverseList` rewires nodes in-place with three pointers (`prev`, `current`, `next`) and zero extra allocations.
- All four functions are O(n) time and require careful handling of the null (empty list) edge case.

## 2. Reviewing Your Implementation

### `listFromArray(arr)`

**Reference implementation:**

```javascript
function listFromArray(arr) {
  if (arr.length === 0) return null;

  const head = ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = ListNode(arr[i]);
    current = current.next;
  }

  return head;
}
```

**Key insights:**
- `head` is created from `arr[0]` and never changes — it is the return value.
- `current` is the "write cursor": it always points to the most recently created node. Creating a node and immediately advancing to it is the standard list-building pattern.
- The loop starts at `i = 1` because `arr[0]` was already handled when creating `head`.

**Edge cases:**
- Empty array: returns `null`. A list with no elements has no head.
- Single element: `head` is created, the loop doesn't run, `head.next` is `null`. Returns `head`.

---

### `listToArray(head)`

**Reference implementation:**

```javascript
function listToArray(head) {
  const result = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}
```

**Key insights:**
- `current = current.next` on the tail node (where `next === null`) sets `current` to `null`, ending the loop.
- This is the universal linked list traversal template. Almost every linked list operation starts with this while-loop skeleton.
- `head` is not modified — `current` is a separate variable that walks the list. This is important: if you modified `head`, you'd lose access to the beginning of the list.

**Edge cases:**
- `null` input: while condition is immediately false, returns `[]`. Correct.

---

### `findMiddle(head)`

**Reference implementation:**

```javascript
function findMiddle(head) {
  if (head === null) return null;

  let slow = head;
  let fast = head;

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```

**Key insights:**
- Both pointers start at `head`, not `head` and `head.next`. Starting both at `head` makes even-length lists return the first middle node.
- The condition checks `fast.next.next`, not `fast.next.next.next`. This is because on each iteration, fast moves to `fast.next.next`. We need to ensure that destination exists before attempting to move there.
- Why O(n/2)? Fast takes 2 steps per iteration. Fast traverses the full list in n/2 iterations. So the loop runs n/2 times, but it's still O(n) asymptotically.

**Edge cases:**
- Null: return null immediately.
- Single node: `fast.next === null` immediately, slow stays at head. Returns the only node. ✓
- Two nodes: `fast.next !== null` ✓, `fast.next.next === null` ✗, loop exits. Slow is at head (first node) — the first of two middles. ✓

---

### `reverseList(head)`

**Reference implementation:**

```javascript
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}
```

**Key insights:**
- The 4-step sequence must happen in this exact order. Saving `next` first is the critical invariant: once you overwrite `current.next`, the rest of the list is unreachable without `next`.
- After the loop, `current` is `null` (that's the exit condition) and `prev` is the last real node — the new head.
- The original `head` node is now the tail. Its `next` is `null` (set during the first iteration when `prev` was `null`).
- This is O(1) space — the algorithm only uses 3 pointer variables regardless of list length.

**Edge cases:**
- `null`: while loop never runs, returns `prev = null`. ✓
- Single node: saves `next = null`, sets `node.next = null` (same), prev = node, current = null. Returns the single node. ✓

## 3. Going Deeper

### Extension 1: Detect a cycle (Floyd's algorithm)

The same slow/fast pointer technique detects cycles:

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;   // pointers met — there's a cycle
  }

  return false;   // fast reached the end — no cycle
}

// Build a cycle for testing:
const cycleHead = listFromArray([1, 2, 3, 4, 5]);
// Connect tail back to node 2 to form: 1 → 2 → 3 → 4 → 5 → (back to 2)
let tail = cycleHead;
let loopEntry = null;
while (tail.next !== null) {
  if (tail.val === 2) loopEntry = tail;
  tail = tail.next;
}
tail.next = loopEntry;   // create cycle

console.log(hasCycle(cycleHead));   // true
console.log(hasCycle(listFromArray([1, 2, 3])));  // false
```

Why does this work? In a cycle, the fast pointer laps the slow pointer. They're guaranteed to meet within O(n) steps because the gap between them decreases by 1 each iteration (fast gains 1 step on slow per iteration inside the cycle).

---

### Extension 2: Check if a linked list is a palindrome

Use `findMiddle` and `reverseList` together:

```javascript
function isPalindrome(head) {
  if (head === null || head.next === null) return true;

  // Find middle
  const middle = findMiddle(head);

  // Reverse second half (starting from middle.next)
  let secondHalf = reverseList(middle.next);
  middle.next = null;   // sever the list

  // Compare first half and reversed second half
  let p1 = head;
  let p2 = secondHalf;
  let result = true;

  while (p2 !== null) {
    if (p1.val !== p2.val) { result = false; break; }
    p1 = p1.next;
    p2 = p2.next;
  }

  // Restore the list (optional but good practice)
  middle.next = reverseList(secondHalf);

  return result;
}

// isPalindrome(listFromArray([1, 2, 2, 1]))  => true
// isPalindrome(listFromArray([1, 2, 3]))      => false
```

This is O(n) time, O(1) space — a combination of two algorithms from this lesson.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Losing the rest of the list in `reverseList`

```javascript
// WRONG — reverses the link before saving next
function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    current.next = prev;            // BUG: next is now lost!
    const next = current.next;      // next is null (just set above)
    prev = current;
    current = next;                 // current = null every iteration
  }
  return prev;
}
```

```javascript
// FIX — save next BEFORE overwriting current.next
function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    const next = current.next;      // save first
    current.next = prev;            // then flip
    prev = current;
    current = next;
  }
  return prev;
}
```

---

### Mistake 2: Wrong loop condition in `findMiddle`

```javascript
// WRONG — fast.next.next is not checked; throws TypeError on even lists
function findMiddle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {  // BUG: should also check fast.next.next
    slow = slow.next;
    fast = fast.next.next;   // may throw if fast.next.next is null before fast.next is
  }
  return slow;
}
// For [1, 2, 3, 4]: after first iteration, fast = Node(3)
// fast.next = Node(4), not null ✓
// fast.next.next = null  → crash on fast.next.next access? No — fast.next.next IS null,
// but then fast = null after assignment, and next loop check fast.next throws TypeError
```

```javascript
// FIX — check both fast.next and fast.next.next before advancing
function findMiddle(head) {
  let slow = head;
  let fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

---

### Mistake 3: Advancing `head` instead of using a separate `current` variable

```javascript
// WRONG — destroys the only reference to the list's beginning
function listToArray(head) {
  const result = [];
  while (head !== null) {
    result.push(head.val);
    head = head.next;   // BUG: head now points further in; original head is lost
  }
  return result;
  // Works here because we only read, but if the caller uses head after this call,
  // head now points to null — the caller's reference is clobbered
}
```

```javascript
// FIX — use a separate traversal pointer
function listToArray(head) {
  const result = [];
  let current = head;   // separate variable; head is unchanged
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}
```

## 5. Connection to Interview Problems

**LeetCode 206 — Reverse Linked List** (Easy)
This is exactly `reverseList`. It is one of the most commonly asked linked list problems. The iterative version (three pointers) is what you implemented; there is also a recursive version worth understanding after mastering the iterative one.

**LeetCode 876 — Middle of the Linked List** (Easy)
This is exactly `findMiddle`. LeetCode's version asks for the second middle node on even-length lists (adjust by starting fast one node ahead, or by changing the loop condition to `fast !== null && fast.next !== null`).

**LeetCode 234 — Palindrome Linked List** (Easy)
Uses `findMiddle` + `reverseList` + comparison. After this lesson you have all the pieces; the palindrome check is just composing them as shown in the extension.

**LeetCode 141 — Linked List Cycle** (Easy)
Floyd's cycle detection from the extension above. This is O(1) space, which is the expected solution. The naive O(n) space solution uses a `Set` of visited nodes — correct but not optimal.

## 6. Discussion Questions

**Q: Why is `reverseList` O(1) space when it modifies n nodes?**
A: Space complexity counts extra memory allocated by the algorithm, not memory already occupied by the input. The algorithm uses exactly 3 extra variables (`prev`, `current`, `next`) regardless of list length. It modifies the existing nodes (overwriting their `next` pointers) but doesn't allocate new nodes. So it's O(1) auxiliary space.

**Q: After calling `reverseList(head)`, what does the original `head` variable now point to?**
A: It still points to the first node of the original list — but that node is now the tail of the reversed list. Its `next` is `null` (set during the first iteration of reverseList when `prev` was `null`). The return value of `reverseList` is the new head (old tail). If you don't capture the return value, you've lost access to the reversed list's beginning.

**Q: Why do both slow and fast pointers start at `head` in `findMiddle`, rather than fast starting at `head.next`?**
A: Starting both at `head` returns the first middle node for even-length lists. If fast started at `head.next`, the math would shift by one and return the second middle node. Neither is universally "correct" — it depends on the problem. LeetCode 876 wants the second middle; our implementation returns the first. Knowing both behaviors is important.

**Q: Can `listFromArray` and `listToArray` be used to test other linked list functions? What are the limitations?**
A: Yes — they form a test harness: `listToArray(someFunction(listFromArray([1, 2, 3])))` lets you write expectations as plain arrays. The limitation is that they don't preserve the original list structure for cycle detection (cycles would cause `listToArray` to loop forever). For cycle tests, you must construct and inspect cycles differently.

## 7. Further Exploration

**"Cracking the Coding Interview" by Gayle Laakmann McDowell, Chapter 2 (Linked Lists)** — 9 classic linked list problems with detailed solutions. After this lesson you can solve problems 1 (remove dups), 2 (kth from last), 5 (sum lists), and 6 (palindrome) immediately.

**Visualgo — Linked List visualization** (`visualgo.net/en/list`) — animated, step-by-step visualization of insertion, deletion, and traversal. Invaluable for building intuition around pointer manipulation before committing algorithms to memory.

**MDN — Memory management in JavaScript** (`developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management`) — explains garbage collection, why circular references can cause memory leaks (relevant to cycle detection), and how the JavaScript engine handles node objects. Bridges the gap between linked list concepts and how they behave in a garbage-collected language.
