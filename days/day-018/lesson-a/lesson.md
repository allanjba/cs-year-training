# Day 18 — Lesson A (Foundations): Stacks

## Why this matters

Some problems have a natural "last in, first out" shape. Your browser's back button remembers pages in the order you visited them — pressing back undoes the most recent navigation, not the first. A text editor's undo system reverts the last action, not the first. Function calls in every program you write are managed by the call stack — the currently executing function is always the most recently called one.

All of these are **stacks**: a data structure where you can only add to and remove from one end (the "top"). The most recently added item is always the first one out. This constraint — you can only see and touch the top — is what makes stacks useful: they model processes where things need to be reversed or matched in the order they were seen.

You've been using a stack without knowing it: every time you call a function in JavaScript, a frame is pushed onto the call stack. When the function returns, that frame is popped. The stack overflow error from Day 14's missing base case is literally the call stack running out of space. Today you'll implement a stack explicitly and use it to solve matching and evaluation problems.

---

## The core concept

A **stack** is an ordered collection with two primary operations:
- **push(item)**: add item to the top
- **pop()**: remove and return the top item
- **peek()** (or `at(-1)`): look at the top item without removing it

JavaScript arrays support both operations natively: `arr.push(x)` and `arr.pop()`. You don't need a special class — an array used with only `push` and `pop` (never accessing by index) is a stack. The discipline of only using those two operations is what makes it a stack.

The key mental model: **a stack is memory of the most recent pending item**. When you open a parenthesis `(`, it's "pending" — something must close it. You push it. When you see `)`, you pop the most recent pending `(` and check that it matches. This generalizes to any matching problem: XML tags, bracket pairs, open/close scopes.

---

## How it works (with hand trace)

**Problem: Is `"({[]})"` a balanced string of brackets?**

Rules: each opener (`(`, `{`, `[`) must be closed by the corresponding closer (`)`, `}`, `]`) in the correct order. Nested brackets must close innermost first.

```
Input: ( { [ ] } )
Stack starts empty: []

char '(' → opener → push → stack: ['(']
char '{' → opener → push → stack: ['(', '{']
char '[' → opener → push → stack: ['(', '{', '[']
char ']' → closer → pop → got '[', matches ']' ✓ → stack: ['(', '{']
char '}' → closer → pop → got '{', matches '}' ✓ → stack: ['(']
char ')' → closer → pop → got '(', matches ')' ✓ → stack: []

End of string, stack is empty → balanced ✓
```

```
Input: ( ]
Stack starts empty: []

char '(' → opener → push → stack: ['(']
char ']' → closer → pop → got '(', expected ']'s match is '[', NOT '(' → mismatch ✗

Return false immediately.
```

The stack ensures that the most recent unmatched opener is always what you compare against. This is exactly the property needed to enforce proper nesting.

---

## Code implementation

```javascript
// ---- Balanced brackets ----

function isBalanced(str) {
  const stack = [];
  const matching = { ')': '(', '}': '{', ']': '[' };

  for (const char of str) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else if (')}]'.includes(char)) {
      if (stack.length === 0 || stack[stack.length - 1] !== matching[char]) {
        return false;
      }
      stack.pop();
    }
    // Non-bracket characters are ignored
  }

  return stack.length === 0;
}

isBalanced("({[]})");     // true
isBalanced("({[}])");     // false  — wrong closing order
isBalanced("(");           // false  — unclosed opener
isBalanced(")");           // false  — closer with no opener
isBalanced("hello");      // true   — no brackets at all
isBalanced("a(b[c]d)e");  // true   — brackets among other chars
```

**Breaking it down:**

`matching` maps each closer to its expected opener. When we see `)`, we look up `matching[')']` = `'('` and verify the top of the stack is `'('`.

Two failure conditions:
1. `stack.length === 0` — we see a closer but there's no pending opener (e.g., `"]"`)
2. `stack[stack.length - 1] !== matching[char]` — the most recent opener doesn't match (e.g., `"({]"` — `]` expects `[` but top is `{`)

After the loop, `stack.length === 0` ensures every opener was eventually closed.

```javascript
// ---- Stack using a class (optional, for illustration) ----

class Stack {
  #items = [];

  push(item)  { this.#items.push(item); }
  pop()       { return this.#items.pop(); }
  peek()      { return this.#items[this.#items.length - 1]; }
  isEmpty()   { return this.#items.length === 0; }
  get size()  { return this.#items.length; }
}
```

In practice, you almost never need this class — bare arrays with `push`/`pop` are idiomatic JavaScript stacks. The class is useful when you want to enforce the interface (prevent index access) or when the stack is a clear, named concept in a larger codebase.

---

## Common pitfalls

**Checking `arr[arr.length - 1]` instead of `peek()`**: These are equivalent but `arr.length - 1` is a common off-by-one source when you misremember whether arrays are 0-indexed. The modern alternative is `arr.at(-1)` — `-1` means "last element" — which is cleaner and less error-prone.

**Forgetting to check that the stack is non-empty before popping**: `[].pop()` returns `undefined`, not an error. If you compare `undefined !== matching[char]`, it's never equal to a valid opener — which happens to return `false` correctly for unmatched closers. But this is relying on accidental behavior. Always check `stack.length === 0` (or `stack.isEmpty()`) explicitly before inspecting or popping.

**Forgetting the final `stack.length === 0` check**: If the string is `"(("`, the loop processes both openers and never sees a closer — no early return. The loop finishes successfully, but the stack has two unmatched openers. Without the final check, `isBalanced("((")` would incorrectly return `true`.

**Using `shift`/`unshift` instead of `pop`/`push`**: `shift` removes from the front, `unshift` inserts at the front — these make an array behave like a queue (FIFO), not a stack (LIFO). `shift` is also O(n) because it has to re-index every element. Always use `push`/`pop` (or `push`/`at(-1)`) for stacks.

---

## Computer Science foundations

**LIFO — Last In, First Out**: The defining property. The most recently pushed item is always the first to be popped. This contrasts with queues (FIFO: first pushed, first out) and priority queues (highest priority first).

**Time complexity: O(1) per operation**. `push` and `pop` on a JavaScript array are O(1) amortized (occasionally the underlying array must resize, but averaged over many operations, it's constant). `stack.length` is also O(1).

**Space complexity: O(n)** for n items on the stack. In the bracket problem, the worst case is n/2 nested openers before any closers — the stack grows to half the string length.

**The call stack is a stack**: Every function call pushes a frame containing local variables and the return address. Return pops that frame. The maximum call stack depth (which causes stack overflow) is the machine's physical limit on how deep this stack can grow.

**Postfix/RPN notation**: The stack is also the key data structure for evaluating arithmetic expressions. Day 14's recursion showed how the call stack mirrors recursive structure. A stack-based evaluator makes that relationship explicit: push operands, and when you see an operator, pop two operands, compute, push the result.

**Monotonic stacks**: A powerful advanced pattern where you maintain a stack that stays in sorted order (ascending or descending) as you process elements. Used for "next greater element," "largest rectangle in histogram," and "trapping rainwater" problems. The key operation: before pushing a new element, pop everything smaller (or larger) than it, processing those popped elements against the new one.

---

## Real-world applications

**Undo/redo in editors**: A stack of operations. Undo pops from the undo stack and pushes to the redo stack. Redo pops from the redo stack and pushes back to the undo stack. The most recently applied operation is always at the top of the undo stack.

**Browser navigation**: `history.pushState` pushes to the navigation stack. The back button pops. (Forward is a separate redo stack that gets cleared when you navigate to a new page.)

**Parser/compiler design**: Every programming language parser uses a stack to manage the parse state. The grammar rules for nested structures (function calls inside expressions, blocks inside functions) are naturally modeled by pushing and popping parse states. The "stack" in "stack trace" is this same structure.

**Expression evaluation**: Calculators, spreadsheet formula engines, and mathematical software evaluate expressions using stacks. Postfix notation (also called Reverse Polish Notation — RPN) was designed specifically to make stack-based evaluation mechanical and unambiguous: no parentheses needed, no operator precedence rules to remember.

---

## Before the exercise

Make sure you can answer these before coding:

1. What does `stack.at(-1)` return when the stack is empty? What does `stack.pop()` return when the stack is empty?
2. In `isBalanced`, why do you need both the "stack is empty" check AND the "top doesn't match" check when you see a closer? Give an input where each condition is the failure reason.
3. `isBalanced("hello")` returns `true`. Why? What happens in the loop for non-bracket characters?
4. Trace `isBalanced("([)]")` step by step. At what point does it return false?
5. If you built a Stack class with `push`, `pop`, and `peek` methods, and then implemented `isBalanced` using it, how would `if (stack.length === 0 || stack[stack.length - 1] !== ...)` change?
