## Day 018 — Lesson A Review: Stacks

### What you should have learned

1. **A stack is an array used with only `push` and `pop`**: JavaScript arrays are stacks out of the box. The discipline of only using these two operations (plus `at(-1)` for peek) is what makes a data structure a stack — not a special class.
2. **Stacks solve "most recent pending item" problems**: Bracket matching works because the stack always holds the most recent unmatched opener. When a closer arrives, the stack instantly tells you what it should match.
3. **Both failure conditions matter for bracket matching**: `stack.length === 0` (closer with no pending opener) AND `top !== expected` (closer that doesn't match the opener). Both are distinct bugs in input; both must be checked.
4. **The final `stack.length === 0` check is essential**: It catches strings with unclosed openers. The loop can finish without error even if the stack is non-empty — the check after the loop is the only guard against this.
5. **`pop` on an empty array returns `undefined`, not an error**: This is a JavaScript quirk. Always check for empty before popping if you need the value. Unchecked, it produces subtle bugs where `undefined !== matching[char]` happens to return false — correct by accident, not by design.

---

### Reviewing your implementation

#### Function 1: `isBalanced(str)`

```js
function isBalanced(str) {
  const stack = [];
  const matching = { ')': '(', '}': '{', ']': '[' };

  for (const char of str) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else if (')}]'.includes(char)) {
      if (stack.length === 0 || stack.at(-1) !== matching[char]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}

console.log(isBalanced("({[]})"));    // true
console.log(isBalanced("({[}])"));    // false
console.log(isBalanced("("));         // false
console.log(isBalanced(")"));         // false
console.log(isBalanced("([)]"));      // false
console.log(isBalanced("hello"));     // true
```

**Key insights:**
- `matching` is a lookup table. `matching[')']` = `'('` means "a `)` should close a `(`". This avoids a chain of if-else conditions and makes adding new bracket types trivial.
- `stack.at(-1)` is the peek operation — reads the top without removing it. Equivalent to `stack[stack.length - 1]` but cleaner.
- Non-bracket characters fall through both `if` branches and are silently ignored. This is correct — balanced brackets in a sentence like `"print(x + y[0])"` work as expected.
- The early `return false` in the closer branch exits immediately on mismatch — no need to process the rest of the string.

**Edge cases handled:**
- Empty string → loop never runs → `stack.length === 0` → `true`
- Only closers → first closer hits `stack.length === 0` → `false`
- Only openers → loop pushes all → `stack.length > 0` → `false`
- Wrong order `([)]` → `]` arrives, top is `(`, `matching[']']` is `[`, `( !== [` → `false`

---

#### Function 2: `reverseWords(sentence)`

```js
function reverseWords(sentence) {
  if (sentence === "") return "";
  const stack = sentence.split(" ");  // split creates the "pushed" order
  const result = [];
  while (stack.length > 0) {
    result.push(stack.pop());
  }
  return result.join(" ");
}

// Simpler equivalent:
function reverseWords(sentence) {
  return sentence.split(" ").reverse().join(" ");
}

// Stack-explicit version (showing the mechanism):
function reverseWords(sentence) {
  if (sentence === "") return "";
  const words = sentence.split(" ");
  const stack = [];
  for (const word of words) stack.push(word);
  const reversed = [];
  while (stack.length > 0) reversed.push(stack.pop());
  return reversed.join(" ");
}

console.log(reverseWords("hello world"));         // "world hello"
console.log(reverseWords("the quick brown fox")); // "fox brown quick the"
console.log(reverseWords("one"));                 // "one"
console.log(reverseWords(""));                    // ""
```

**Key insights:**
- Reversing by push-then-pop demonstrates the LIFO property: pushing `["the", "quick", "brown", "fox"]` in order and popping gives `"fox"`, `"brown"`, `"quick"`, `"the"` — reversed.
- The one-liner `.split(" ").reverse().join(" ")` is idiomatic JavaScript. Arrays have a built-in `.reverse()` that mutates in place. For an interview, the explicit stack version shows understanding of the mechanism.
- Empty string: `"".split(" ")` returns `[""]` — an array with one empty string. Popping it gives `""`, joining gives `""`. The explicit guard `if (sentence === "") return ""` makes intent clearer but isn't strictly necessary.

**Edge cases handled:**
- Single word → pushed and immediately popped → same word returned
- Empty string → guard or natural handling → `""`

---

### Going deeper

#### Extension 1: Evaluate a postfix (RPN) expression

Postfix notation places operators after their operands: `3 4 + 5 *` means `(3 + 4) * 5 = 35`. Stack evaluation is mechanical: push numbers, pop operands when you see an operator.

```js
function evalRPN(tokens) {
  // tokens is an array of strings: ["3", "4", "+", "5", "*"]
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),  // integer division, truncate toward zero
  };

  for (const token of tokens) {
    if (token in ops) {
      const b = stack.pop();  // second operand (top)
      const a = stack.pop();  // first operand (below top)
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token));
    }
  }

  return stack.pop();  // final result
}

console.log(evalRPN(["3", "4", "+", "5", "*"]));  // 35  → (3+4)*5
console.log(evalRPN(["2", "1", "+", "3", "*"]));  // 9   → (2+1)*3
console.log(evalRPN(["4", "13", "5", "/", "+"])); // 6   → 4+(13/5) = 4+2 = 6
```

Note: `b` is popped first (it's on top) and `a` second. For `+` and `*` this doesn't matter, but for `-` and `/` it does: `a - b` where `a` was pushed first and `b` pushed second — so `"5 3 -"` means `5 - 3 = 2`.

#### Extension 2: Next greater element

For each element in an array, find the next element to its right that is strictly greater. Return `-1` if none exists. Uses a **monotonic stack** — the stack stays in decreasing order.

```js
function nextGreaterElement(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];  // stores indices of elements awaiting their "next greater"

  for (let i = 0; i < arr.length; i++) {
    // Pop all elements smaller than arr[i] — arr[i] is their next greater
    while (stack.length > 0 && arr[stack.at(-1)] < arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

console.log(nextGreaterElement([4, 1, 2, 3]));
// [  -1,  2,  3, -1]
// 4: nothing greater to right → -1
// 1: next greater is 2
// 2: next greater is 3
// 3: nothing greater to right → -1
```

The stack holds indices of elements still waiting for their answer. When `arr[i]` is larger than the element at the stack's top index, that element's next greater is `arr[i]`. This runs in O(n) — each element is pushed and popped exactly once.

---

### Common mistakes and how to fix them

#### Mistake 1: Not checking stack length before popping/peeking

```js
// WRONG — relies on undefined comparison working by coincidence
function isBalanced(str) {
  const stack = [];
  const matching = { ')': '(', '}': '{', ']': '[' };

  for (const char of str) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else if (')}]'.includes(char)) {
      // BUG: no stack.length check — if stack is empty, stack.at(-1) is undefined
      if (stack.at(-1) !== matching[char]) {  // undefined !== '(' → true → return false
        return false;
      }
      stack.pop();  // pops undefined from empty stack — returns undefined, no error
    }
  }
  return stack.length === 0;
}

// This "works" for simple cases because undefined !== any string → returns false.
// But it's relying on accidental behavior, not explicit logic.
// The intent should be explicit: if no pending opener, return false immediately.
```

**Problem:** Relying on `undefined !== '('` being true is correct by coincidence, not by design. It obscures intent and could break if the logic changes.
**Fix:** Explicitly check `stack.length === 0 || stack.at(-1) !== matching[char]`.

---

#### Mistake 2: Missing the final stack length check

```js
// WRONG — doesn't catch unclosed openers
function isBalanced(str) {
  const stack = [];
  const matching = { ')': '(', '}': '{', ']': '[' };

  for (const char of str) {
    if ('({['.includes(char)) stack.push(char);
    else if (')}]'.includes(char)) {
      if (stack.length === 0 || stack.at(-1) !== matching[char]) return false;
      stack.pop();
    }
  }

  return true;  // BUG: should be stack.length === 0
}

isBalanced("((");  // Returns true — WRONG! Two unclosed openers.
isBalanced("(()"); // Returns true — WRONG! One unclosed opener.
```

**Problem:** The loop processes all characters without error — no closer triggers a mismatch — so nothing returns false. But the stack still has pending openers. `return true` ignores them.
**Fix:** `return stack.length === 0` — verifies every opener was eventually matched.

---

#### Mistake 3: Using `shift`/`unshift` (queue operations) instead of `pop`/`push` (stack operations)

```js
// WRONG — reverses order incorrectly
function reverseWords(sentence) {
  const stack = sentence.split(" ");
  const reversed = [];
  while (stack.length > 0) {
    reversed.push(stack.shift());  // BUG: shift removes from front (FIFO), not back (LIFO)
  }
  return reversed.join(" ");
}

reverseWords("the quick brown fox");
// => "the quick brown fox"  — same order, not reversed!
// shift takes "the" first (the front), producing original order.
```

**Problem:** `shift` dequeues from the front — the first element out is the first element in. This is FIFO behavior, producing the original order. Stack (LIFO) behavior requires `pop`, which removes from the back.
**Fix:** `stack.pop()` removes from the back, giving LIFO: `"fox"` is the last pushed and the first popped.

---

### Connection to interview problems

- **LeetCode 20 — Valid Parentheses**: Exactly `isBalanced` — the most common stack introduction problem in interviews.
- **LeetCode 150 — Evaluate Reverse Polish Notation**: The RPN evaluator from Going Deeper, verbatim.
- **LeetCode 496 — Next Greater Element I**: The monotonic stack pattern from Going Deeper, applied to matching elements between two arrays.
- **LeetCode 739 — Daily Temperatures**: "For each day, how many days until a warmer temperature?" — monotonic stack; same pattern as nextGreaterElement, storing indices and computing differences.
- **LeetCode 84 — Largest Rectangle in Histogram**: Hard problem using a monotonic stack to find, for each bar, the nearest shorter bar to its left and right. Classic interview challenge that reveals deep stack understanding.

---

### Discussion questions

1. **Why does the call stack overflow on infinite recursion but not infinite loops?** A loop reuses the same stack frame — the variables are updated in place. Recursion creates a new stack frame on every call. Each frame takes memory. Infinitely nested frames fill the call stack's memory limit. The stack overflow is literally the call stack overflowing its allocated space.

2. **A queue is "first in, first out" — the opposite of a stack. What real-world systems are queues rather than stacks?** Print queues (first document sent, first printed). Message queues (Kafka, RabbitMQ — messages are processed in order). HTTP request queues in servers (requests handled in arrival order). The key difference: stacks reverse order; queues preserve it.

3. **In the RPN evaluator, why does `b = stack.pop()` come before `a = stack.pop()`?** Because `b` is the second operand — the one pushed last, so it's on top. `a` is the first operand, pushed before `b`, so it's below. For `"5 3 -"`: push 5, push 3. Pop `b = 3`, pop `a = 5`. Compute `a - b = 5 - 3 = 2`. If you swapped the order and computed `b - a`, you'd get `3 - 5 = -2` — wrong.

4. **The monotonic stack in `nextGreaterElement` runs in O(n). Why?** Each element is pushed exactly once and popped exactly once. Even though there's a `while` loop inside the `for` loop, the total number of pop operations across the entire execution is at most n — bounded by the number of push operations. Amortized analysis: n pushes + at most n pops = O(n) total.

---

### Further exploration

- **Monotonic stacks in depth**: "Largest Rectangle in Histogram" (LeetCode 84) and "Trapping Rain Water" (LeetCode 42) are the two canonical hard problems that require the monotonic stack pattern. Once you can solve both, you've mastered the technique.
- **The Shunting-Yard algorithm**: Edsger Dijkstra's algorithm for converting infix notation (`3 + 4 * 5`) to postfix notation (`3 4 5 * +`) using a stack and a queue. This is how calculators and parsers handle operator precedence.
- [Visualgo — Stack](https://visualgo.net/en/list): Animated visualization of push/pop operations. The "Stack" tab shows the structure clearly.
- *Introduction to Algorithms* (CLRS), Section 10.1: The formal treatment of stacks and queues, including the array-based implementation.
