// Day 21 — Lesson A: Linked List Fundamentals
// Topic: Building, traversing, and manipulating singly linked lists

// ─── Node Factory ───────────────────────────────────────────────────────────

/**
 * Creates a linked list node.
 * @param {any} val - The value stored in this node
 * @param {object|null} next - Reference to the next node (default null)
 * @returns {{ val: any, next: object|null }}
 */
function ListNode(val, next = null) {
  return { val, next };
}

// ─── Sample Data ────────────────────────────────────────────────────────────

// These are arrays — use listFromArray to convert them for testing
const ARR_ODD  = [1, 2, 3, 4, 5];      // odd length, middle is 3
const ARR_EVEN = [1, 2, 3, 4];         // even length, middle is 2 (first of two)
const ARR_ONE  = [42];                  // single element
const ARR_EMPTY = [];                   // empty

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Converts an array into a singly linked list, returning the head node.
 *
 * Steps:
 *   1. Handle the empty array edge case (return null).
 *   2. Create the head node from arr[0].
 *   3. Keep a `current` pointer starting at head.
 *   4. For each remaining element: create a new node, attach to current.next,
 *      then advance current to the new node.
 *   5. Return head.
 *
 * @param {any[]} arr - Array of values
 * @returns {object|null} Head node of the linked list (null if arr is empty)
 *
 * @example
 * listToArray(listFromArray([1, 2, 3]))  // => [1, 2, 3]
 * listFromArray([])                       // => null
 */
function listFromArray(arr) {
  // TODO: guard for empty array

  // TODO: create head node from arr[0], set current = head

  // TODO: loop from i=1, create nodes, link them, advance current

  // TODO: return head
}

/**
 * Converts a linked list back to an array (head to tail order).
 * Useful for testing and printing.
 *
 * Traverse with: let current = head; while (current !== null) { ... current = current.next; }
 *
 * @param {object|null} head - Head node of the linked list
 * @returns {any[]} Array of node values in order
 *
 * @example
 * listToArray(null)                        // => []
 * listToArray(listFromArray([1, 2, 3]))    // => [1, 2, 3]
 */
function listToArray(head) {
  // TODO: initialize result = [], current = head

  // TODO: while current is not null: push val, advance current

  // TODO: return result
}

/**
 * Finds the middle node of a linked list using the slow/fast pointer technique.
 *
 * - Slow pointer advances 1 step per iteration.
 * - Fast pointer advances 2 steps per iteration.
 * - When fast cannot advance (fast.next or fast.next.next is null), slow is at middle.
 *
 * For even-length lists, return the FIRST of the two middle nodes.
 *
 * Loop condition: fast.next !== null && fast.next.next !== null
 *
 * @param {object|null} head - Head node of the linked list
 * @returns {object|null} The middle node (null if list is empty)
 *
 * @example
 * findMiddle(listFromArray([1,2,3,4,5])).val  // => 3
 * findMiddle(listFromArray([1,2,3,4])).val     // => 2  (first middle)
 * findMiddle(listFromArray([42])).val           // => 42
 * findMiddle(null)                              // => null
 */
function findMiddle(head) {
  // TODO: guard for null head

  // TODO: initialize slow = head, fast = head

  // TODO: while fast.next and fast.next.next are not null:
  //   slow = slow.next
  //   fast = fast.next.next

  // TODO: return slow
}

/**
 * Reverses a linked list in-place and returns the new head.
 *
 * Use three pointers: prev (starts null), current (starts at head), next.
 * Each iteration:
 *   1. Save next = current.next
 *   2. Flip current.next = prev
 *   3. Advance prev = current
 *   4. Advance current = next
 *
 * When current === null, prev is the new head.
 *
 * @param {object|null} head - Head node of the linked list
 * @returns {object|null} The new head (was the old tail)
 *
 * @example
 * listToArray(reverseList(listFromArray([1,2,3,4,5])))  // => [5,4,3,2,1]
 * listToArray(reverseList(listFromArray([1])))           // => [1]
 * reverseList(null)                                       // => null
 */
function reverseList(head) {
  // TODO: initialize prev = null, current = head

  // TODO: while current is not null:
  //   const next = current.next
  //   current.next = prev
  //   prev = current
  //   current = next

  // TODO: return prev (the new head)
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// // Round-trip test
// const list = listFromArray(ARR_ODD);
// console.log("listToArray([1,2,3,4,5]):", listToArray(list));
// // Expected: [1, 2, 3, 4, 5]

// // Empty list
// console.log("listFromArray([]):", listFromArray([]));
// // Expected: null
// console.log("listToArray(null):", listToArray(null));
// // Expected: []

// // findMiddle
// console.log("findMiddle([1,2,3,4,5]).val:", findMiddle(listFromArray(ARR_ODD)).val);
// // Expected: 3
// console.log("findMiddle([1,2,3,4]).val:", findMiddle(listFromArray(ARR_EVEN)).val);
// // Expected: 2
// console.log("findMiddle([42]).val:", findMiddle(listFromArray(ARR_ONE)).val);
// // Expected: 42

// // reverseList
// const list2 = listFromArray(ARR_ODD);
// const reversed = reverseList(list2);
// console.log("reverseList([1,2,3,4,5]):", listToArray(reversed));
// // Expected: [5, 4, 3, 2, 1]

// const list3 = listFromArray([1]);
// console.log("reverseList([1]):", listToArray(reverseList(list3)));
// // Expected: [1]

// console.log("reverseList(null):", reverseList(null));
// // Expected: null
