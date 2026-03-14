// Day 20 — Lesson A: Hash Maps — Frequency, Grouping, and Two Sum
// Topic: Map API, frequency counting, groupBy, O(n) complement lookup

// ─── Sample Data ────────────────────────────────────────────────────────────

const NUMBERS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
// Expected frequency: Map { 3→2, 1→2, 4→1, 5→3, 9→1, 2→1, 6→1 }

const WORDS = ["apple", "ant", "banana", "bear", "avocado", "blueberry", "cherry"];
// groupBy first letter:
//   "a" → ["apple", "ant", "avocado"]
//   "b" → ["banana", "bear", "blueberry"]
//   "c" → ["cherry"]

const PEOPLE = [
  { name: "Alice",   dept: "Engineering" },
  { name: "Bob",     dept: "Marketing" },
  { name: "Carol",   dept: "Engineering" },
  { name: "Dave",    dept: "HR" },
  { name: "Eve",     dept: "Marketing" },
  { name: "Frank",   dept: "Engineering" },
];
// groupBy dept:
//   "Engineering" → [Alice, Carol, Frank]
//   "Marketing"   → [Bob, Eve]
//   "HR"          → [Dave]

const TWO_SUM_A = { numbers: [2, 7, 11, 15], target: 9 };   // => [0, 1]
const TWO_SUM_B = { numbers: [3, 2, 4],      target: 6 };   // => [1, 2]
const TWO_SUM_C = { numbers: [3, 3],         target: 6 };   // => [0, 1]

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Counts how many times each element appears in the array.
 *
 * Use the `?? 0` pattern to handle elements seen for the first time:
 *   map.set(item, (map.get(item) ?? 0) + 1)
 *
 * @param {any[]} arr - Array of elements (numbers, strings, etc.)
 * @returns {Map<any, number>} Map from element to its count
 *
 * @example
 * frequencyMap([1, 2, 1, 3, 2, 1])
 * // => Map { 1 → 3, 2 → 2, 3 → 1 }
 *
 * frequencyMap([])
 * // => Map {}  (empty map)
 */
function frequencyMap(arr) {
  // TODO: create a new Map

  // TODO: iterate arr; for each item:
  //   map.set(item, (map.get(item) ?? 0) + 1)

  // TODO: return the map
}

/**
 * Groups array elements by a key computed from each element.
 *
 * The keyFn receives each element and returns the group key.
 * Maintain FIFO order within each group (elements appear in the
 * same order as they appear in the input array).
 *
 * @param {any[]} arr     - Input array
 * @param {function} keyFn - Function that maps an element to its group key
 * @returns {Map<any, any[]>} Map from group key to array of elements
 *
 * @example
 * groupBy(["apple", "ant", "banana"], s => s[0])
 * // => Map { "a" → ["apple", "ant"], "b" → ["banana"] }
 *
 * groupBy(PEOPLE, p => p.dept)
 * // => Map { "Engineering" → [Alice,Carol,Frank], "Marketing" → [Bob,Eve], "HR" → [Dave] }
 */
function groupBy(arr, keyFn) {
  // TODO: create a new Map

  // TODO: for each item in arr:
  //   const key = keyFn(item)
  //   if map doesn't have key, set it to []
  //   push item into map.get(key)

  // TODO: return the map
}

/**
 * Finds the indices [i, j] of the two numbers that add up to target.
 * Exactly one solution is guaranteed. i < j.
 *
 * Strategy: as you iterate, check if (target - numbers[i]) is already
 * in the map. If yes, you found the pair. If no, record numbers[i] → i
 * in the map for future lookups.
 *
 * @param {number[]} numbers - Array of integers
 * @param {number}   target  - The desired sum
 * @returns {number[]} Two-element array [i, j] of indices (i < j)
 *
 * @example
 * twoSum([2, 7, 11, 15], 9)   // => [0, 1]  (2 + 7 = 9)
 * twoSum([3, 2, 4],      6)   // => [1, 2]  (2 + 4 = 6)
 * twoSum([3, 3],         6)   // => [0, 1]  (3 + 3 = 6)
 */
function twoSum(numbers, target) {
  // TODO: create a Map called `seen` to store value → index

  // TODO: for each index i:
  //   const complement = target - numbers[i]
  //   if seen.has(complement), return [seen.get(complement), i]
  //   else seen.set(numbers[i], i)

  // TODO: return [] if no pair found (shouldn't happen with valid input)
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// const freq = frequencyMap(NUMBERS);
// console.log("frequencyMap([3,1,4,1,5,9,2,6,5,3,5]):");
// for (const [k, v] of freq) console.log(`  ${k} → ${v}`);
// // Expected: 3→2, 1→2, 4→1, 5→3, 9→1, 2→1, 6→1

// console.log("\nfrequencyMap([]):", [...frequencyMap([]).entries()]);
// // Expected: []

// const wordGroups = groupBy(WORDS, s => s[0]);
// console.log("\ngroupBy(WORDS, first letter):");
// for (const [k, v] of wordGroups) console.log(`  "${k}" → [${v.join(", ")}]`);

// const deptGroups = groupBy(PEOPLE, p => p.dept);
// console.log("\ngroupBy(PEOPLE, dept):");
// for (const [dept, people] of deptGroups) {
//   console.log(`  ${dept}: ${people.map(p => p.name).join(", ")}`);
// }

// console.log("\ntwoSum tests:");
// console.log(twoSum(TWO_SUM_A.numbers, TWO_SUM_A.target)); // [0, 1]
// console.log(twoSum(TWO_SUM_B.numbers, TWO_SUM_B.target)); // [1, 2]
// console.log(twoSum(TWO_SUM_C.numbers, TWO_SUM_C.target)); // [0, 1]
