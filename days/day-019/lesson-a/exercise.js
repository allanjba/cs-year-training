// Day 19 — Lesson A: Queue Fundamentals
// Topic: FIFO queues, BFS level-order traversal, Hot Potato simulation

// ─── Sample Data ────────────────────────────────────────────────────────────

// Helper: build a tree node
function TreeNode(val, left = null, right = null) {
  return { val, left, right };
}

// Tree 1: balanced
//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
const TREE_1 = TreeNode(
  1,
  TreeNode(2, TreeNode(4), TreeNode(5)),
  TreeNode(3, null, TreeNode(6))
);

// Tree 2: left-skewed (linked-list shaped)
//   1
//  /
// 2
//  \
//   3  (actually right child of 2)
// Let's make it a pure left chain for clarity:
//   1
//  /
// 2
//  /
// 3
const TREE_2 = TreeNode(1, TreeNode(2, TreeNode(3)));

// Tree 3: single node
const TREE_3 = TreeNode(42);

// Hot Potato players
const PLAYERS = ["Alice", "Bob", "Carol", "Dave", "Eve"];

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Returns the level-order traversal of a binary tree.
 * Each level's node values are grouped into their own sub-array.
 *
 * Use an array as a queue (push = enqueue, shift = dequeue).
 * Snapshot queue.length at the start of each outer loop to know
 * how many nodes belong to the current level.
 *
 * @param {object|null} root - Tree node with { val, left, right } shape
 * @returns {number[][]} Array of arrays, one per level, left-to-right
 *
 * @example
 * levelOrder(TREE_1)
 * // => [[1], [2, 3], [4, 5, 6]]
 *
 * levelOrder(null)
 * // => []
 */
function levelOrder(root) {
  // TODO: handle the empty-tree edge case first

  // TODO: initialize queue with root, initialize result array

  // TODO: while queue is not empty:
  //   - snapshot levelSize = queue.length
  //   - create currentLevel = []
  //   - loop levelSize times:
  //       dequeue a node
  //       push node.val into currentLevel
  //       enqueue node.left and node.right if they exist
  //   - push currentLevel into result

  // TODO: return result
}

/**
 * Simulates the Hot Potato game.
 *
 * Players sit in a circle. On each "pass", the potato moves one seat
 * clockwise. After exactly `passes` passes, whoever holds the potato
 * is eliminated. The game repeats with the remaining players until
 * one player is left — that player is the winner.
 *
 * Model the circle as an array-based queue:
 *   - Rotate `passes` times: take from front, append to back.
 *   - Then eliminate: take from front (they have the potato).
 *
 * @param {string[]} names  - Ordered list of player names (clockwise)
 * @param {number}   passes - Number of passes per round before elimination
 * @returns {string} The name of the winner
 *
 * @example
 * hotPotato(["Alice", "Bob", "Carol", "Dave", "Eve"], 7)
 * // logs eliminated players, returns winner
 *
 * hotPotato(["Alice", "Bob", "Carol"], 1)
 * // => "Carol"  (trace: Bob out, Alice out, Carol wins)
 */
function hotPotato(names, passes) {
  // TODO: copy names into a queue (don't mutate the input)

  // TODO: while more than one player remains:
  //   - rotate `passes` times (shift from front, push to back)
  //   - eliminate the front player (shift and log their name)

  // TODO: return the sole remaining player
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// console.log("levelOrder(TREE_1):", JSON.stringify(levelOrder(TREE_1)));
// // Expected: [[1],[2,3],[4,5,6]]

// console.log("levelOrder(TREE_2):", JSON.stringify(levelOrder(TREE_2)));
// // Expected: [[1],[2],[3]]

// console.log("levelOrder(TREE_3):", JSON.stringify(levelOrder(TREE_3)));
// // Expected: [[42]]

// console.log("levelOrder(null):", JSON.stringify(levelOrder(null)));
// // Expected: []

// console.log("\nhotPotato with 7 passes:");
// console.log("Winner:", hotPotato(PLAYERS, 7));

// console.log("\nhotPotato(['Alice','Bob','Carol'], 1):");
// console.log("Winner:", hotPotato(["Alice", "Bob", "Carol"], 1));
// // Expected winner: "Carol"
