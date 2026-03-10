## Day 014 — Lesson A Review: Recursion

### What you should have learned

1. **Every recursive function has exactly two parts**: A base case (the answer is known directly) and a recursive case (reduce the problem, call again). The base case stops the recursion; the recursive case makes progress toward it.
2. **The call stack is the mechanism**: Each recursive call pushes a frame; each return pops one. The maximum depth is the number of simultaneously active frames. Stack overflow happens when you exceed the platform's frame limit (~10,000 in V8).
3. **The recursive case must reduce the input**: `factorial(n - 1)` makes n smaller; `sumArray(numbers.slice(1))` makes the array shorter. If you call `factorial(n)` from inside `factorial(n)`, it never terminates.
4. **Recursion trades stack space for code clarity**: Iterative `factorial` uses O(1) space; recursive uses O(n). For simple linear problems, iteration is usually better. For naturally recursive structures (trees, nested data), recursion is cleaner.
5. **`countDown` builds a result on the way "up"**: The array is assembled as the stack unwinds — a different shape than `factorial`, which multiplies on the way "down." Tracing both carefully reveals how the stack works in each direction.

### Reviewing your implementation

#### Function 1: `factorial(n)`

```js
function factorial(n) {
  if (n === 0) return 1;         // base case: 0! = 1
  return n * factorial(n - 1);   // recursive case
}

console.log(factorial(0));   // 1
console.log(factorial(1));   // 1
console.log(factorial(5));   // 120
console.log(factorial(10));  // 3628800
```

**Key insights:**
- Base case first — always. The conditional guard must appear before the recursive call
- `n - 1` is the "smaller input" — each call reduces n by 1 toward the base case of 0
- The multiplication happens *after* the recursive call returns — on the way "up" the stack

**Call stack trace for `factorial(4)`:**
```
factorial(4) waits for factorial(3)
  factorial(3) waits for factorial(2)
    factorial(2) waits for factorial(1)
      factorial(1) waits for factorial(0)
        factorial(0) = 1 → returns
      factorial(1) = 1 * 1 = 1 → returns
    factorial(2) = 2 * 1 = 2 → returns
  factorial(3) = 3 * 2 = 6 → returns
factorial(4) = 4 * 6 = 24 → returns
```

**Edge cases handled:**
- `n = 0` → base case, returns `1`
- `n = 1` → `1 * factorial(0) = 1 * 1 = 1`

---

#### Function 2: `sumArray(numbers)`

```js
function sumArray(numbers) {
  if (numbers.length === 0) return 0;
  return numbers[0] + sumArray(numbers.slice(1));
}

console.log(sumArray([3, 1, 4, 1, 5]));   // 14
console.log(sumArray([]));                 // 0
console.log(sumArray([7]));               // 7
```

**Key insights:**
- `numbers.slice(1)` creates a *new* array without the first element — this is the "smaller input"
- The addition happens after the recursive call returns — the first element is added to the sum of the rest
- `sumArray` using `slice` creates n new arrays — this is O(n) time and O(n²) memory. In practice, use `reduce` or a loop for array summation; this is for learning the recursion structure.

**Edge cases handled:**
- Empty array → `0` (base case)
- Single element → `numbers[0] + sumArray([]) = numbers[0] + 0 = numbers[0]`

---

#### Function 3: `countDown(n)`

```js
function countDown(n) {
  if (n <= 0) return [];
  return [n, ...countDown(n - 1)];
}

console.log(countDown(5));   // [5, 4, 3, 2, 1]
console.log(countDown(1));   // [1]
console.log(countDown(0));   // []
```

**Key insights:**
- `[n, ...countDown(n - 1)]` — spread the recursive result into the array
- The current value `n` is placed first (before the recursive result), so the array is `[n, n-1, ..., 1]`
- The array is assembled from the inside out: `countDown(1)` returns `[1]`, `countDown(2)` returns `[2, 1]`, etc.

**Trace for `countDown(4)`:**
```
countDown(4) = [4, ...countDown(3)]
countDown(3) = [3, ...countDown(2)]
countDown(2) = [2, ...countDown(1)]
countDown(1) = [1, ...countDown(0)]
countDown(0) = []   ← base case

Unwinding:
countDown(1) = [1, ...[]] = [1]
countDown(2) = [2, ...[1]] = [2, 1]
countDown(3) = [3, ...[2, 1]] = [3, 2, 1]
countDown(4) = [4, ...[3, 2, 1]] = [4, 3, 2, 1]
```

**Edge cases handled:**
- `n = 0` → `[]`
- `n < 0` → `[]` (the `<= 0` base case catches this)

### Going deeper

#### Extension 1: Fibonacci — two recursive calls

```js
function fibonacci(n) {
  if (n <= 1) return n;   // fib(0) = 0, fib(1) = 1
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(0));   // 0
console.log(fibonacci(5));   // 5  (0, 1, 1, 2, 3, 5)
console.log(fibonacci(10));  // 55
```

Fibonacci makes two recursive calls per step — it branches, unlike factorial. This creates a recursion *tree* rather than a chain. The time complexity is O(2^n) — exponentially slow. `fibonacci(50)` takes minutes. This is why memoization exists: caching already-computed values to avoid recomputation. You'll revisit this in the dynamic programming section.

#### Extension 2: Recursive countdown with memoization preview

```js
const memo = {};
function fibMemo(n) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];   // return cached result
  memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
  return memo[n];
}

console.log(fibMemo(50));   // 12586269025 — instant!
```

Adding a cache reduces `fibonacci(50)` from ~2^50 operations to 50 unique subproblems. Same recursive structure; fundamentally different performance.

### Common mistakes and how to fix them

#### Mistake 1: Missing the base case → stack overflow

```js
// WRONG — no base case
function sumArray(numbers) {
  return numbers[0] + sumArray(numbers.slice(1));
}

sumArray([1, 2, 3]);
// RangeError: Maximum call stack size exceeded
// When numbers becomes [], numbers[0] is undefined, and sumArray([]) calls sumArray([])...
```

**Problem:** There's nothing to stop the recursion. `numbers.slice(1)` on `[]` returns `[]`, leading to infinite calls.
**Fix:** Always add the base case first: `if (numbers.length === 0) return 0;`

---

#### Mistake 2: Recursive case doesn't reduce the input

```js
// WRONG — calls factorial(n) from factorial(n)
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n);   // should be n - 1
}

factorial(5);  // infinite recursion → stack overflow
```

**Problem:** `factorial(n)` calls `factorial(n)` with the same `n` — no progress toward the base case.
**Fix:** `factorial(n - 1)` — reduce n by 1 each call.

---

#### Mistake 3: Wrong base case value for factorial

```js
// WRONG — base case returns 0
function factorial(n) {
  if (n === 0) return 0;   // should be 1
  return n * factorial(n - 1);
}

console.log(factorial(5));   // 0 — (5 * 4 * 3 * 2 * 1 * 0 = 0)
```

**Problem:** Multiplying anything by 0 gives 0. All factorials return 0.
**Fix:** `return 1` — the empty product (0!) is 1 by mathematical definition.

### Connection to interview problems

- **LeetCode 509 — Fibonacci Number**: `fibonacci(n)` using the two-recursive-call structure (then optimize with memoization)
- **LeetCode 206 — Reverse Linked List**: Recursive reversal uses the same "process current, recurse on rest" pattern as `sumArray`
- **LeetCode 344 — Reverse String**: Recursive string reversal — a direct match to the lesson's `reverseString`
- **Recursion as interview skill**: Nearly every tree, graph, backtracking, and divide-and-conquer problem in interviews is solved recursively — this is the fundamental technique to master

### Discussion questions

1. **`sumArray` using `slice` creates n new arrays — that's O(n²) memory total. Is this a problem?** For learning, no. For production, use the iterative version or pass indices instead of slices: `sumArray(arr, i = 0) = arr[i] + sumArray(arr, i+1)`. No new arrays are created. This pattern (pass an index rather than slicing) appears in many efficient recursive implementations.

2. **`countDown(n)` builds the array on the way "up." Could you build it on the way "down" instead?** Yes — using an accumulator: `countDown(n, acc = []) = countDown(n-1, [...acc, n])`. This is the tail-recursive style. The array grows as you recurse deeper rather than as you return. Both produce the same result; the accumulator style avoids creating the array from scratch on each unwind.

3. **If `factorial(20000)` would overflow the call stack, how would you compute it iteratively?** A simple loop: `let result = 1; for (let i = 1; i <= n; i++) result *= i;` — O(n) time, O(1) space, no stack risk. For very large n, you'd also need BigInt to avoid floating-point precision loss.

4. **Why is `fibonacci` O(2^n) when `factorial` is O(n) even though both make recursive calls?** `factorial` makes exactly one recursive call per invocation — a linear chain. `fibonacci` makes two recursive calls per invocation — a branching tree. The tree grows exponentially: at depth d there are 2^d calls. The total nodes across all depths sums to roughly 2^n.

### Further exploration

- [CS50 — Recursion lecture](https://cs50.harvard.edu/x/): The classic university introduction — uses physical demonstrations of the call stack
- Read about **tail-call optimization (TCO)**: Why languages like Scheme guarantee it, why JavaScript's TC39 added it in ES2015 but V8 never fully implemented it, and why it matters for deep recursion
- *Structure and Interpretation of Computer Programs* (SICP), Chapter 1: The book that taught a generation of CS students that recursion and iteration are just two ways of expressing the same computation
