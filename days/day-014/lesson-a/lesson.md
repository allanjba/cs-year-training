## Day 014 — Lesson A (Foundations): Recursion

### Why this matters

Every algorithm you've written this week used a loop to repeat work. Loops are iterative — the same block of code runs multiple times with changing state. Recursion is a fundamentally different model: a function that calls *itself* to solve a smaller version of the same problem, eventually reaching a case simple enough to answer directly.

This isn't just a different way to write loops. Recursion expresses the *structure* of certain problems directly:
- A directory contains files and subdirectories, each of which contains files and subdirectories…
- A sentence is a word plus the rest of the sentence
- A tree node has children, each of which has children…
- The factorial of n is n times the factorial of (n-1)

These problems have a naturally self-similar structure. Writing them recursively makes the code mirror the problem structure, which is often cleaner and more understandable than an iterative equivalent.

Recursion is a prerequisite for the algorithms you'll encounter in the coming weeks: merge sort, tree traversal, depth-first search, backtracking, and divide-and-conquer algorithms. Understanding recursion *well* — including its costs and pitfalls — is essential for the DS&A phase of the curriculum.

### The core concept

A recursive function has two parts:

1. **Base case**: A condition where the answer is known directly, without another recursive call. This is what stops the recursion. Without it, the function would call itself forever.

2. **Recursive case**: The function calls itself with a *smaller* or *simpler* version of the input, gradually working toward the base case.

Think of it like Russian nesting dolls (matryoshkas): to open the set, you open the outermost doll, then the next one inside, then the next, until you reach the smallest doll that doesn't open. That final doll is the base case. Each layer of opening is a stack frame on the call stack.

The **call stack** is crucial to understanding recursion. Each call to a function creates a new *stack frame* — a record of the function's local variables and where to return when it's done. For recursive calls, these stack frames accumulate:

```
factorial(4)
  → factorial(3)
      → factorial(2)
          → factorial(1)
              → factorial(0) = 1 ← base case, returns
          ← returns 1 * 1 = 1
      ← returns 2 * 1 = 2
  ← returns 3 * 2 = 6
← returns 4 * 6 = 24
```

The stack grows as we make recursive calls (going "down"), then unwinds as each call returns (going "back up"). The final answer is assembled as the stack unwinds.

### How it works

**Example 1: Factorial**

`factorial(n) = n × (n-1) × (n-2) × ... × 1`

Problem structure: `factorial(n) = n × factorial(n-1)`. A smaller version of the same problem!

Base case: `factorial(0) = 1` (by definition — the empty product is 1).

Let's trace `factorial(4)`:

```
factorial(4)
  = 4 * factorial(3)      ← recursive call with smaller input
  = 4 * (3 * factorial(2))
  = 4 * (3 * (2 * factorial(1)))
  = 4 * (3 * (2 * (1 * factorial(0))))
  = 4 * (3 * (2 * (1 * 1)))   ← base case reached
  = 4 * (3 * (2 * 1))
  = 4 * (3 * 2)
  = 4 * 6
  = 24
```

**Example 2: Sum of array**

`sumArray([3, 1, 4, 1, 5])` = `3 + sumArray([1, 4, 1, 5])`

Base case: `sumArray([]) = 0`

Trace:
```
sumArray([3, 1, 4])
  = 3 + sumArray([1, 4])
  = 3 + (1 + sumArray([4]))
  = 3 + (1 + (4 + sumArray([])))
  = 3 + (1 + (4 + 0))   ← base case
  = 3 + (1 + 4)
  = 3 + 5
  = 8
```

**Example 3: Reverse a string**

`reverseString("hello")` = `"o"` + `reverseString("hell")`... wait, that's not quite right.

Better: `reverseString("hello")` = last character + `reverseString("hell")`:
- Base case: string of length 0 or 1 — already "reversed"
- Recursive case: `str[str.length-1] + reverseString(str.slice(0, -1))`

Or: first character goes to the end — `reverseString("hello")` = `reverseString("ello")` + `"h"`

Trace of `reverseString("abc")`:
```
reverseString("abc")
  = reverseString("bc") + "a"
  = (reverseString("c") + "b") + "a"
  = (("c") + "b") + "a"   ← base case: single char returns itself
  = "cb" + "a"
  = "cba"
```

### Code implementation

```js
// Factorial
function factorial(n) {
  if (n === 0) return 1;         // base case
  return n * factorial(n - 1);   // recursive case
}

console.log(factorial(0));   // 1
console.log(factorial(1));   // 1
console.log(factorial(5));   // 120
console.log(factorial(10));  // 3628800
```

**Breaking it down:**
- `if (n === 0) return 1` — the base case. This must come first.
- `return n * factorial(n - 1)` — the recursive case: the answer depends on a smaller version

```js
// Recursive array sum
function sumArray(numbers) {
  if (numbers.length === 0) return 0;                      // base case
  return numbers[0] + sumArray(numbers.slice(1));          // recursive case
}

console.log(sumArray([3, 1, 4, 1, 5]));   // 14
console.log(sumArray([]));                 // 0
console.log(sumArray([7]));               // 7
```

**Breaking it down:**
- `numbers.length === 0` → empty array → base case, return 0
- `numbers[0] + sumArray(numbers.slice(1))` — first element + sum of the rest
- `numbers.slice(1)` creates a new array without the first element — this is the "smaller input"

```js
// Reverse a string
function reverseString(str) {
  if (str.length <= 1) return str;                                    // base case
  return reverseString(str.slice(1)) + str[0];                       // recursive case
}

console.log(reverseString("hello"));   // "olleh"
console.log(reverseString("a"));       // "a"
console.log(reverseString(""));        // ""
console.log(reverseString("ab"));      // "ba"
```

**Breaking it down:**
- `str.length <= 1` — single character or empty string, already "reversed"
- `reverseString(str.slice(1)) + str[0]` — reverse everything after the first character, then append the first character at the end

**Why this works:**

At each step, the string shrinks by one character until we reach the base case. On the way back up, we concatenate each first character at the end of the reversed remainder.

### Common pitfalls

**1. Missing or wrong base case → infinite recursion**

```js
// WRONG — no base case → stack overflow
function factorial(n) {
  return n * factorial(n - 1);   // never stops!
}
```

JavaScript has a call stack limit (~10,000-15,000 frames). Infinite recursion crashes with `RangeError: Maximum call stack size exceeded`. Always identify and implement the base case first.

**2. Recursive case doesn't make progress toward base case**

```js
// WRONG — same input forever
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n);   // should be n-1, not n
}
```

The recursive call must use a *smaller* input than the current call. If it doesn't, you'll hit infinite recursion just like missing the base case.

**3. Wrong base case value**

`factorial(0)` is `1` (the empty product), not `0`. Getting the base case wrong silently corrupts all results: `factorial(5)` with `return 0` for the base would return `5 * 4 * 3 * 2 * 1 * 0 = 0` — wrong.

**4. Performance: O(n) stack space**

Each recursive call adds a stack frame. `sumArray([1, 2, 3, ..., 10000])` uses 10,000 stack frames. For very large inputs, this can cause a stack overflow even with a correct base case. Iterative solutions use O(1) space. Recursion trades stack space for code clarity.

### Computer Science foundations

**The call stack:**

Every function call in JavaScript (and most languages) is recorded on the call stack: a LIFO (Last In, First Out) data structure where each frame holds the function's local variables and return address. Recursive calls push frames; returning pops them. The maximum depth is ~10,000 in V8.

**Time Complexity of recursive `factorial`:** O(n) — exactly n recursive calls, each O(1).

**Space Complexity:** O(n) — n stack frames live simultaneously at maximum depth.

**Tail recursion:**

A recursive call is *tail-recursive* if the recursive call is the last operation in the function — nothing is multiplied or added after it returns. In tail-recursive form, each frame doesn't need to be kept alive while waiting for the recursive call:

```js
// Tail-recursive factorial with accumulator
function factorialTail(n, acc = 1) {
  if (n === 0) return acc;
  return factorialTail(n - 1, n * acc);   // tail call — nothing after it
}
```

Some languages (and strict-mode JavaScript, technically) optimize tail calls to reuse the current frame rather than creating a new one — O(1) space instead of O(n). V8 doesn't implement this optimization in practice, but the concept matters in other contexts.

**Recursion vs iteration:**

Every recursive algorithm can be rewritten iteratively (and vice versa). The choice is about readability and stack depth:
- For simple problems (factorial, sum), iteration is usually better — O(1) space, no stack risk
- For tree traversal, divide-and-conquer, and backtracking, recursion is cleaner and often the natural expression of the algorithm

**Mathematical induction and recursion:**

Proving a recursive function correct uses the same structure as mathematical induction:
1. Base case: prove the function is correct for the base case input(s)
2. Inductive step: assuming the function is correct for all inputs smaller than n, prove it's correct for n

If your base case is right and your recursive case correctly reduces to a smaller problem, the function is correct by induction.

### Real-world applications

- **File system traversal**: Listing all files in a directory (including subdirectories) — the OS API is recursive because directory structure is recursive
- **JSON parsing**: A JSON value is either a primitive, an array of values, or an object of string-value pairs — recursive by definition
- **React component trees**: Components render children, which are themselves components — the rendering model is recursive
- **Git history**: Each commit points to parent commit(s) — traversing commit history is tree traversal

### Before the exercise

In the exercise, you'll implement:

1. **`factorial(n)`** — the classic recursive introduction; n! = n × (n-1)!
2. **`sumArray(numbers)`** — sum of an array using recursion (base case: empty array = 0)
3. **`countDown(n)`** — return an array `[n, n-1, n-2, ..., 1]` using recursion

The third function builds a result *while* unwinding the stack — a slightly different shape of recursion than accumulating through arithmetic. Trace `countDown(4)` by hand before coding.
