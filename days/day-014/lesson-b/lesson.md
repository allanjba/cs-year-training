## Day 014 — Lesson B (Applied): Recursive Task Tree Processing

### Why this matters

In Lesson A, recursion operated on simple structures: a single number (factorial), a flat array (sumArray), a string. In real software, recursion shines on *nested* or *tree-shaped* data — structures where each element can itself contain more elements of the same type.

Consider a project management tool: tasks have subtasks, which can have their own subtasks. This isn't a flat list — it's a tree. To count all tasks (including nested ones), to find all incomplete tasks, or to produce a flat list for a report, you need to traverse every node — and recursion maps directly onto this structure.

```
Project: Launch v2.0
├── Design Phase
│   ├── Wireframes          ← leaf (no subtasks)
│   └── Mockups             ← leaf
├── Development Phase
│   ├── Backend API
│   │   ├── Auth endpoint   ← leaf
│   │   └── Data endpoints  ← leaf
│   └── Frontend            ← leaf
└── QA
    └── Write test cases    ← leaf
```

To count all tasks: count 1 (current) + count all subtasks recursively. The structure drives the algorithm. This is the exact shape of file system traversal, org chart processing, comment threads, and menu hierarchies — all tree problems that recursion solves cleanly.

### The core concept

A **task tree** is an object with a `name` (string), optional `done` (boolean), and optional `subtasks` (array of more task objects):

```js
{
  name: "Launch v2.0",
  done: false,
  subtasks: [
    { name: "Design Phase", done: false, subtasks: [
        { name: "Wireframes", done: true, subtasks: [] },
        { name: "Mockups",    done: false, subtasks: [] },
    ]},
    { name: "QA", done: false, subtasks: [
        { name: "Write test cases", done: false, subtasks: [] }
    ]},
  ]
}
```

The recursive structure: a task is a node; its `subtasks` are child nodes. To process the whole tree, process the root, then recursively process each subtask.

Base case: a task with no subtasks (leaf node) — count just 1, or process just that task's data.
Recursive case: count 1 + sum of counts of all subtasks.

### How it works

**Function 1: `countAllTasks(task)`** — count total tasks (including nested)

```
countAllTasks({ name: "QA", subtasks: [{ name: "Test", subtasks: [] }] })

= 1 + countAllTasks({ name: "Test", subtasks: [] })
= 1 + 1 + 0   (Test has no subtasks)
= 2
```

For the root of the full tree:
```
countAllTasks(root)
= 1 + countAllTasks(Design) + countAllTasks(Dev) + countAllTasks(QA)
= 1 + (1 + 1 + 1) + (1 + (1 + 1 + 1) + 1) + (1 + 1)
= 1 + 3 + 5 + 2
= 11 total tasks
```

**Function 2: `flattenTasks(task)`** — get all task names as a flat array

```
flattenTasks({ name: "A", subtasks: [
  { name: "B", subtasks: [] },
  { name: "C", subtasks: [] }
]})

= ["A", ...flattenTasks(B), ...flattenTasks(C)]
= ["A", "B", "C"]
```

The spread operator (`...`) flattens the recursive results into the parent array — a common pattern for recursive array building.

### Code implementation

```js
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
        { name: "Backend API", done: false, subtasks: [
          { name: "Auth endpoint",  done: true,  subtasks: [] },
          { name: "Data endpoints", done: false, subtasks: [] },
        ]},
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

function countAllTasks(task) {
  if (task.subtasks.length === 0) return 1;   // leaf node: just itself

  let count = 1;   // count the task itself
  for (const subtask of task.subtasks) {
    count += countAllTasks(subtask);   // add each subtree's count
  }
  return count;
}

console.log(countAllTasks(project));   // 9 total tasks
```

**Breaking it down:**

- `if (task.subtasks.length === 0) return 1` — leaf node: base case
- `let count = 1` — always count the current task
- Loop over `task.subtasks` and recurse on each — the recursive case
- The loop *itself* isn't recursion; calling `countAllTasks(subtask)` inside the loop is

The function can be simplified slightly:

```js
function countAllTasks(task) {
  // Count this task + sum of all subtask counts
  return 1 + task.subtasks.reduce((sum, subtask) => sum + countAllTasks(subtask), 0);
}
```

Both are equivalent; the loop version is easier to trace for beginners.

Now flatten:

```js
function flattenTasks(task) {
  if (task.subtasks.length === 0) return [task.name];   // leaf: just its own name

  const result = [task.name];
  for (const subtask of task.subtasks) {
    const subtaskNames = flattenTasks(subtask);
    for (const name of subtaskNames) {
      result.push(name);
    }
  }
  return result;
}

// More concise using spread:
function flattenTasks(task) {
  return [task.name, ...task.subtasks.flatMap(st => flattenTasks(st))];
}

console.log(flattenTasks(project));
// ["Launch v2.0", "Design Phase", "Wireframes", "Mockups", "Development",
//  "Backend API", "Auth endpoint", "Data endpoints", "Frontend",
//  "QA", "Write test cases"]
```

**Why the order is depth-first:**

The traversal visits the current task, then *all descendants of the first subtask*, then all descendants of the second subtask, and so on. This is **pre-order depth-first traversal** — the most natural recursive shape. (Breadth-first requires a queue and is iterative; you'll cover it later.)

### Common pitfalls

**1. Forgetting to count the current node itself**

```js
// WRONG — doesn't count the root task
function countAllTasks(task) {
  let count = 0;   // should start at 1
  for (const subtask of task.subtasks) {
    count += countAllTasks(subtask);
  }
  return count;
}
```

`countAllTasks(project)` with this code returns `8` instead of `9` — the top-level task is never counted.

**2. Mutating the task object during traversal**

Never modify `task.subtasks` or `task.name` while recursing. You're reading the tree, not writing it. If you need to transform the data, return a new object rather than mutating.

**3. Not guarding against tasks without a `subtasks` property**

If a task object might have `subtasks: undefined` instead of `subtasks: []`, the line `task.subtasks.length` throws `TypeError: Cannot read properties of undefined`. Guard: `const subtasks = task.subtasks || [];`.

### Computer Science foundations

**Tree traversal:**

Recursive tree traversal is one of the most important algorithms in CS. Three orders exist for binary trees:
- **Pre-order** (NLR): visit current node, then left subtree, then right subtree
- **In-order** (LNR): left, current, right — produces sorted output for binary search trees
- **Post-order** (LRN): left, right, current — used for expression trees and deletion

`flattenTasks` uses pre-order: current task name first, then subtask names.

**Time Complexity:** O(n) where n = total number of tasks — each task is visited exactly once.

**Space Complexity:** O(d) where d = maximum depth of the tree (the call stack depth). For a balanced tree, d = O(log n). For a degenerate tree (one long chain), d = O(n).

**Trees vs arrays:**

Arrays have O(1) access by index; trees have O(depth) access by key. But trees naturally represent hierarchical data that would require complex encoding in a flat array. Choosing the right data structure for the problem's shape is a recurring theme in DS&A.

### Real-world applications

- **File systems**: Every OS exposes directories as trees; `find`, `du`, and backup tools traverse them recursively
- **DOM traversal**: A web page is a tree (the DOM); React's virtual DOM reconciliation is a tree-diff algorithm
- **JSON schemas**: Nested JSON naturally maps to recursive data structures
- **Org chart tools**: Reporting relationships are trees; recursive traversal generates headcount, budget rollups, and org charts

### Before the exercise

In the exercise, you'll implement:

1. **`countAllTasks(task)`** — total count of all tasks (including nested)
2. **`flattenTasks(task)`** — array of all task names, depth-first
3. **`countIncompleteTasks(task)`** — count only tasks where `done === false`

The third function adds a condition to the count: only increment when `task.done === false`. It's the same tree traversal structure with a filter added.
