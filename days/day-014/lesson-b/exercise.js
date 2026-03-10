// Day 014 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario: recursive task tree processing for a project management tool.

const project = {
  name: "Launch v2.0",
  done: false,
  subtasks: [
    {
      name: "Design Phase",
      done: false,
      subtasks: [
        { name: "Wireframes", done: true,  subtasks: [] },
        { name: "Mockups",    done: false, subtasks: [] },
      ],
    },
    {
      name: "Development",
      done: false,
      subtasks: [
        {
          name: "Backend API",
          done: false,
          subtasks: [
            { name: "Auth endpoint",  done: true,  subtasks: [] },
            { name: "Data endpoints", done: false, subtasks: [] },
          ],
        },
        { name: "Frontend", done: false, subtasks: [] },
      ],
    },
    {
      name: "QA",
      done: false,
      subtasks: [
        { name: "Write test cases", done: false, subtasks: [] },
      ],
    },
  ],
};

/**
 * countAllTasks(task)
 * --------------------
 * Return the total number of tasks in the tree, including the root
 * task itself and all nested subtasks at every level.
 *
 * Example:
 *   countAllTasks({ name: "A", done: false, subtasks: [] }) => 1
 *   countAllTasks({ name: "A", done: false, subtasks: [
 *     { name: "B", done: false, subtasks: [] }
 *   ]}) => 2
 */
function countAllTasks(task) {
  // TODO: implement recursively
}

/**
 * flattenTasks(task)
 * -------------------
 * Return an array of ALL task names (strings) in the tree, depth-first
 * (current task name first, then subtasks left to right).
 *
 * Example:
 *   flattenTasks({ name: "A", subtasks: [
 *     { name: "B", subtasks: [] },
 *     { name: "C", subtasks: [] }
 *   ]}) => ["A", "B", "C"]
 */
function flattenTasks(task) {
  // TODO: implement recursively
}

/**
 * countIncompleteTasks(task)
 * ---------------------------
 * Return the count of tasks (at any depth) where done === false.
 *
 * Example:
 *   countIncompleteTasks({ name: "A", done: true, subtasks: [
 *     { name: "B", done: false, subtasks: [] }
 *   ]}) => 1  (only B is incomplete)
 */
function countIncompleteTasks(task) {
  // TODO: implement recursively
}

// OPTIONAL: manual checks
// console.log(countAllTasks(project));         // 9
// console.log(flattenTasks(project));          // ["Launch v2.0", "Design Phase", ...]
// console.log(countIncompleteTasks(project));  // 7 (only Wireframes and Auth are done)
