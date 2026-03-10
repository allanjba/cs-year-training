## Day 003 — Lesson A (Foundations): Searching Arrays and Early Exit

### Why this matters

A lot of real programming questions have yes/no answers about collections of data:

- "Does this list contain the item we're looking for?"
- "Are all of these values valid?"
- "Does at least one of these records have an error?"

These questions don't require you to process every element — once you have enough information to answer, you can stop. Learning when and how to exit a loop early is a key skill that makes code both more efficient and easier to read.

Today you'll build three fundamental search patterns that appear constantly in real codebases: `contains`, `every`, and `some`. They're also available as built-in array methods in JavaScript (`Array.prototype.includes`, `.every`, `.some`) — but implementing them from scratch helps you understand exactly what they do and why they work.

### The core concept

There are three fundamental questions you can ask about a collection:

1. **"Does it contain X?"** — Search for one specific value. Stop as soon as you find it.
2. **"Does every element satisfy condition C?"** — The moment you find one that *doesn't*, you have your answer: false. Stop there.
3. **"Does at least one element satisfy condition C?"** — The moment you find one that *does*, you have your answer: true. Stop there.

Notice the pattern: in all three cases, you can exit as soon as you have enough information. You don't need to process the rest of the array.

This is called **early exit** (or short-circuit evaluation), and it's a key optimization for search problems.

### How it works

Let's trace through each pattern:

**contains: does `[10, 20, 30]` contain 20?**

```
items  = [10, 20, 30]
target = 20

step 1 — 10: 10 === 20? no
step 2 — 20: 20 === 20? yes → return true immediately

We never check 30. There's no need.
```

**contains: does `[10, 20, 30]` contain 99?**

```
step 1 — 10: 10 === 99? no
step 2 — 20: 20 === 99? no
step 3 — 30: 30 === 99? no

Loop ends. Nothing found. → return false
```

**every: are all elements of `[2, 4, 6]` even?**

```
step 1 — 2: 2 % 2 === 0? yes → continue
step 2 — 4: 4 % 2 === 0? yes → continue
step 3 — 6: 6 % 2 === 0? yes → continue

Loop ends with no violations. → return true
```

**every: are all elements of `[2, 4, 5]` even?**

```
step 1 — 2: 2 % 2 === 0? yes → continue
step 2 — 4: 4 % 2 === 0? yes → continue
step 3 — 5: 5 % 2 === 0? no → return false immediately

We never needed to finish the loop.
```

**some: does `[1, 3, 4]` have any even number?**

```
step 1 — 1: 1 % 2 === 0? no
step 2 — 3: 3 % 2 === 0? no
step 3 — 4: 4 % 2 === 0? yes → return true immediately
```

### Code implementation

```js
function contains(items, target) {
  for (const item of items) {
    if (item === target) {
      return true;  // early exit — found it
    }
  }
  return false;  // not found
}

console.log(contains([10, 20, 30], 20));  // true
console.log(contains([10, 20, 30], 99));  // false
console.log(contains([], 5));             // false
```

**Breaking it down:**
- `return true` inside the loop exits immediately when found — no need to keep scanning
- `return false` after the loop runs only when we've seen *every* element without finding the target
- The function never tells you *where* the item is, only whether it exists

```js
function every(items, condition) {
  for (const item of items) {
    if (!condition(item)) {
      return false;  // early exit — found a violator
    }
  }
  return true;  // no violations found
}

const isEven = n => n % 2 === 0;
console.log(every([2, 4, 6], isEven));   // true
console.log(every([2, 4, 5], isEven));   // false
console.log(every([], isEven));          // true — edge case!
```

**Why does `every([])` return `true`?**
This is called **vacuous truth**: "every element in the empty set satisfies the condition" is true because there are no elements to violate it. This is mathematically correct and matches JavaScript's `.every()`. It may feel counterintuitive, but it's the right behavior.

```js
function some(items, condition) {
  for (const item of items) {
    if (condition(item)) {
      return true;  // early exit — found one
    }
  }
  return false;  // none found
}

const isNegative = n => n < 0;
console.log(some([1, -2, 3], isNegative));   // true
console.log(some([1, 2, 3], isNegative));    // false
console.log(some([], isNegative));           // false
```

**Passing functions as arguments:**
`every` and `some` accept a `condition` parameter that is itself a function. This is **higher-order functions** — functions that take other functions as arguments. It makes these helpers reusable for any condition, not just one specific check.

### Common pitfalls

**1. Returning the wrong default**

The default return value matters:

| Function | Default (after full scan) | Why |
|---|---|---|
| `contains` | `false` | If not found after checking all, answer is false |
| `every` | `true` | If no violator found after checking all, answer is true |
| `some` | `false` | If no match found after checking all, answer is false |

Getting these backwards is a very common bug. Think: "What do I return if I finish the entire loop without finding what I'm looking for?"

**2. Forgetting early exit**

```js
// Correct but inefficient — processes every element even after finding answer
function containsSlow(items, target) {
  let found = false;
  for (const item of items) {
    if (item === target) {
      found = true;   // doesn't exit!
    }
  }
  return found;
}
```

This gives the right answer but unnecessarily scans the whole array. Use `return` inside the loop to exit as soon as you have your answer.

**3. Using `==` instead of `===`**

Always use strict equality `===` when checking for a specific value. `contains([1, 2], "1")` should return `false` — the string `"1"` is not the number `1`.

**4. The empty array edge case**

- `contains([], anything)` → `false` (nothing in empty array can match)
- `every([], anyCondition)` → `true` (vacuous truth)
- `some([], anyCondition)` → `false` (no element can satisfy the condition)

Make sure you understand *why* each of these is correct.

### Computer Science foundations

**Time Complexity:** O(n) in the worst case for all three.
- Worst case: we check every element (e.g., `contains` when target is absent, `every` when all elements pass, `some` when all elements fail)
- Best case: we check only one element (when the first element triggers early exit)
- We still say O(n) because Big-O describes worst-case behavior by default

**Space Complexity:** O(1).
- We use only a few variables regardless of array size.
- No new data structures are created.

**Why O(n) even with early exit?**
Big-O notation describes the *worst case*. Even though early exit can make these faster in practice, in the worst case we still touch every element. A linear search — where you check elements one by one without any prior knowledge of their order — is always O(n) in the worst case.

**Contrast with sorted arrays:**
If the array were *sorted*, you could do a **binary search** and find elements in O(log n). We'll cover that later. For now, with unsorted data, linear search is the best we can do.

### Real-world applications

- **Access control**: "Is this user ID in the list of banned users?" (`contains`)
- **Data validation**: "Do all submitted form fields have values?" (`every`)
- **Error detection**: "Are there any critical errors in these log lines?" (`some`)
- **Feature flags**: "Does this user have any premium features enabled?" (`some`)
- **Configuration checks**: "Are all required environment variables set?" (`every`)

These patterns are so common that JavaScript provides them as built-in array methods: `Array.includes()`, `Array.every()`, and `Array.some()`. Now you know exactly how they work under the hood.

### Before the exercise

In the exercise file, you'll implement:

1. **`contains(items, target)`** — Return `true` if target is in the array; exit early when found
2. **`every(items, condition)`** — Return `true` only if every element satisfies the condition; exit early on first failure
3. **`some(items, condition)`** — Return `true` if at least one element satisfies the condition; exit early on first match

As you implement each function:
- Think carefully about what the function should return for an empty array.
- Use early return (`return true` or `return false` inside the loop) — don't use a boolean flag variable if you can avoid it.
- Test each function with: a typical case, an empty array, an array where the answer is at the very start, and an array where the answer is at the very end (or absent).
