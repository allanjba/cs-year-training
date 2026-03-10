## Day 003 — Lesson A Review: Searching Arrays and Early Exit

### What you should have learned

1. **Three fundamental search patterns**: `containsValue` (exact match), `allGreaterThan` (universal quantifier), `anyMatch` (existential quantifier).
2. **Early exit discipline**: Return as soon as you have enough information — don't keep looping when the answer is known.
3. **Default return values matter**: `containsValue` defaults to `false`, `allGreaterThan` defaults to `true`, `anyMatch` defaults to `false`. Getting these backwards is a common bug.
4. **Vacuous truth**: `allGreaterThan([], anything)` returns `true` — "every element in the empty set satisfies the condition" is mathematically correct.
5. **Higher-order functions**: `anyMatch` accepts a function as an argument — this is a foundational pattern in JavaScript.

### Reviewing your implementation

#### Function 1: `containsValue(items, target)`

```js
function containsValue(items, target) {
  for (const item of items) {
    if (item === target) {
      return true;   // early exit — found it
    }
  }
  return false;      // exhausted all items, not found
}

console.log(containsValue([1, 2, 3], 2));    // true
console.log(containsValue([1, 2, 3], 99));   // false
console.log(containsValue([], 5));            // false
```

**Key insights:**
- `===` strict equality — `containsValue([1, 2], "1")` correctly returns `false`
- `return true` inside the loop exits immediately — no need to check remaining elements
- `return false` after the loop runs only when every element was checked without finding a match

**Edge cases handled:**
- Empty array → `false` (loop never runs, default is returned)
- Target not in array → `false` (full scan, then default)
- Target at position 0 → `true` (exits after one check)

---

#### Function 2: `allGreaterThan(numbers, threshold)`

```js
function allGreaterThan(numbers, threshold) {
  for (const n of numbers) {
    if (n <= threshold) {
      return false;   // early exit — found a violator
    }
  }
  return true;        // no violators found
}

console.log(allGreaterThan([5, 10, 15], 3));   // true
console.log(allGreaterThan([5, 2, 15], 3));    // false
console.log(allGreaterThan([], 3));             // true — vacuous truth
```

**Key insights:**
- We look for a **violator** (an element that does NOT satisfy the condition) and return `false` on the first one found
- The default return `true` means: "I scanned everything and found no violators"
- The empty array returns `true` — this is vacuous truth, not a bug

**Why vacuous truth is correct:**
"Is it true that every element in `[]` is greater than 3?" There are no elements to violate the condition, so yes — vacuously true. This matches JavaScript's built-in `[].every(fn)` behavior.

---

#### Function 3: `anyMatch(items, predicate)`

```js
function anyMatch(items, predicate) {
  for (const item of items) {
    if (predicate(item)) {
      return true;   // early exit — found a match
    }
  }
  return false;      // no matches found
}

console.log(anyMatch([1, 2, 3], n => n % 2 === 0));    // true (2 is even)
console.log(anyMatch([1, 3, 5], n => n % 2 === 0));    // false
console.log(anyMatch([], n => n > 0));                  // false
```

**Key insights:**
- `predicate` is a function — `anyMatch` doesn't care what condition is checked, only whether it's met
- This is a **higher-order function**: a function that accepts another function as an argument
- Arrow functions (`n => n % 2 === 0`) are the concise way to pass a one-off condition

**Edge cases handled:**
- Empty array → `false` (vacuously, no element satisfies the condition)

### Going deeper

#### Extension 1: `noneMatch` — the logical complement of `anyMatch`

"Are there zero elements matching the condition?"

```js
function noneMatch(items, predicate) {
  return !anyMatch(items, predicate);
}

console.log(noneMatch([1, 3, 5], n => n % 2 === 0));   // true  (no evens)
console.log(noneMatch([1, 2, 5], n => n % 2 === 0));   // false (2 is even)
```

Implementing `noneMatch` by inverting `anyMatch` is an example of **logical duality** — `noneMatch` and `anyMatch` are opposite questions. Similarly, `allGreaterThan` has a dual: `anyLessOrEqual`.

#### Extension 2: Count matches (combining anyMatch with accumulation)

```js
function countMatches(items, predicate) {
  let count = 0;
  for (const item of items) {
    if (predicate(item)) count++;
  }
  return count;
}

console.log(countMatches([1, 2, 3, 4, 5], n => n % 2 === 0));   // 2
console.log(countMatches(["", "hi", "", "ok"], s => s.length > 0)); // 2
```

Note: `countMatches` cannot use early exit — it must visit every element to get an accurate count.

### Common mistakes and how to fix them

#### Mistake 1: Wrong default return for `allGreaterThan`

```js
// WRONG
function allGreaterThan(numbers, threshold) {
  for (const n of numbers) {
    if (n <= threshold) return false;
  }
  return false;   // BUG: should be true!
}

console.log(allGreaterThan([5, 10], 3));   // false — wrong!
console.log(allGreaterThan([], 3));         // false — wrong!
```

**Problem:** If no violator is found, the function should return `true`. Returning `false` means "always false" for non-empty arrays that all satisfy the condition.
**Fix:** `return true` after the loop.

---

#### Mistake 2: Using a flag variable instead of early return

```js
// WORKS but unnecessary
function containsValueSlow(items, target) {
  let found = false;
  for (const item of items) {
    if (item === target) {
      found = true;   // sets flag but keeps looping!
    }
  }
  return found;
}
```

**Problem:** After finding the target, the loop continues through all remaining elements unnecessarily. For a million-element array where the target is at position 0, this wastes 999,999 iterations.
**Fix:** `return true` directly inside the `if` — exit immediately when you have your answer.

---

#### Mistake 3: Using `==` instead of `===` in `containsValue`

```js
// WRONG
function containsValue(items, target) {
  for (const item of items) {
    if (item == target) return true;   // type coercion!
  }
  return false;
}

console.log(containsValue([1, 2, 3], "1"));   // true — wrong! "1" == 1 in JS
```

**Problem:** `==` coerces types, so `1 == "1"` is `true`. `containsValue([1], "1")` should return `false`.
**Fix:** Always use `===` for equality in search functions.

### Connection to interview problems

These three patterns are building blocks for dozens of interview problems:

- **LeetCode 268 — Missing Number**: Uses "contains" logic — is each expected number present?
- **LeetCode 704 — Binary Search**: Advanced search — same `contains` concept, but O(log n) on sorted arrays
- **LeetCode 2299 — Strong Password Checker II**: Uses "all" and "any" style checks on password characters
- **Array.prototype.every / some / includes**: JavaScript's built-in versions of these exact functions — now you know what they do internally

When you see "does the array contain X?" or "are all elements ≥ threshold?" in an interview, reach for these patterns first.

### Discussion questions

1. **`allGreaterThan([], 100)` returns `true`. Is this correct?** Yes — vacuous truth. There are no elements that violate "greater than 100," because there are no elements at all. This is mathematically sound and matches how `[].every(fn)` works in JavaScript. It's a useful default: an empty list of requirements is trivially satisfied.

2. **What's the best case for `containsValue`? The worst case?** Best case: target is at index 0, one check → O(1). Worst case: target is absent, n checks → O(n). We describe it as O(n) because Big-O always describes the worst case.

3. **Can you implement `allGreaterThan` using `anyMatch`?** Yes: `allGreaterThan(numbers, threshold)` is equivalent to `!anyMatch(numbers, n => n <= threshold)`. "All are greater than threshold" means "none are less than or equal to threshold." Logical duality lets you derive one operation from the other.

4. **When would you use `anyMatch` over just calling `Array.prototype.some`?** In production, you'd use the built-in `.some()` — it's more readable and optimized. But implementing it yourself is how you understand what `.some()` does. When you're on an interview whiteboard and `.some()` isn't available, you know how to write it.

### Further exploration

- Boolean logic and **De Morgan's laws**: `!(A && B) === (!A || !B)` and `!(A || B) === (!A && !B)` — the formal basis for the duality between `all` and `any`
- MDN: [Array.prototype.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) and [Array.prototype.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) — the built-in implementations of what you wrote today
