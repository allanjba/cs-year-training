## Day 005 — Lesson A Review: Transforming and Filtering Arrays

### What you should have learned

1. **Transform (map) vs filter**: Transform changes every element; output length equals input length. Filter selects elements; output length is ≤ input length.
2. **Unconditional push vs conditional push**: Transform always pushes; filter only pushes when the condition is true. This is the only structural difference between them.
3. **Always return a new array**: Never modify the input. Pure functions don't have side effects.
4. **Composing transforms and filters**: You can chain them (filter then transform), or combine them in one pass. Both approaches are valid; clarity usually wins.
5. **O(n) for both**: Every element is visited once regardless of whether it's a transform or filter.

### Reviewing your implementation

#### Function 1: `doubleNumbers(numbers)`

```js
function doubleNumbers(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n * 2);
  }
  return result;
}

console.log(doubleNumbers([1, 2, 3]));      // [2, 4, 6]
console.log(doubleNumbers([]));              // []
console.log(doubleNumbers([-1, 0, 1]));     // [-2, 0, 2]
```

**Key insights:**
- Unconditional push: every element contributes exactly one element to the output
- Output length always equals input length — a reliable property of transforms
- `-1` → `-2`, `0` → `0`: the transformation applies to all values including negatives and zero

**Edge cases handled:**
- Empty input → `[]`
- Negative numbers → correctly doubled
- Zero → `0` (double of zero is zero)

---

#### Function 2: `filterLongWords(words, minLength)`

```js
function filterLongWords(words, minLength) {
  const result = [];
  for (const word of words) {
    if (word.length >= minLength) {
      result.push(word);
    }
  }
  return result;
}

console.log(filterLongWords(["a", "hello", "world"], 3));    // ["hello", "world"]
console.log(filterLongWords(["hi", "ok"], 5));               // []
console.log(filterLongWords([], 3));                         // []
```

**Key insights:**
- Conditional push: elements only appear in output if they pass the test
- `>=` (not `>`): words with exactly `minLength` characters are included — "at least N characters"
- `minLength` is a parameter — the threshold is configurable

**Edge cases handled:**
- No words qualify → `[]`
- All words qualify → new array containing all
- Empty input → `[]`

---

#### Function 3: `extractFirstNames(users)`

```js
function extractFirstNames(users) {
  const names = [];
  for (const user of users) {
    names.push(user.firstName);
  }
  return names;
}

console.log(extractFirstNames([{ firstName: "Ada" }, { firstName: "Alan" }]));
// ["Ada", "Alan"]
```

**Key insights:**
- Transform over objects: every user object becomes its `firstName` string
- The output type changes: objects in, strings out
- No filtering — every user contributes a name

---

#### Function 4: `filterActiveUsers(users)`

```js
function filterActiveUsers(users) {
  const result = [];
  for (const user of users) {
    if (user.isActive === true) {
      result.push(user);
    }
  }
  return result;
}

console.log(filterActiveUsers([
  { name: "Ada", isActive: true },
  { name: "Alan", isActive: false },
]));
// [{ name: "Ada", isActive: true }]
```

**Key insights:**
- Filter over objects — same pattern as `filterLongWords` but the condition checks an object property
- Returns the full user object (not just the name)
- Does not modify the original array

### Going deeper

#### Extension 1: Generic map and filter

Write the built-in `.map()` and `.filter()` from scratch:

```js
function map(items, transform) {
  const result = [];
  for (const item of items) {
    result.push(transform(item));
  }
  return result;
}

function filter(items, predicate) {
  const result = [];
  for (const item of items) {
    if (predicate(item)) result.push(item);
  }
  return result;
}

// Usage:
console.log(map([1, 2, 3], n => n * 2));
// [2, 4, 6]

console.log(filter([1, 2, 3, 4], n => n % 2 === 0));
// [2, 4]

// Composition:
console.log(map(filter([1, 2, 3, 4], n => n % 2 === 0), n => n * 10));
// [20, 40]
```

`doubleNumbers` is `map(numbers, n => n * 2)`. `filterLongWords` is `filter(words, w => w.length >= minLength)`. Now you can see why `.map()` and `.filter()` are so useful.

#### Extension 2: Reduce — the generalization of both map and filter

Both map and filter can be expressed as a single operation called "reduce":

```js
function reduce(items, combiner, initial) {
  let result = initial;
  for (const item of items) {
    result = combiner(result, item);
  }
  return result;
}

// sum using reduce:
const sum = reduce([1, 2, 3], (acc, n) => acc + n, 0);   // 6

// map using reduce:
const doubled = reduce([1, 2, 3], (acc, n) => { acc.push(n * 2); return acc; }, []);  // [2, 4, 6]

// filter using reduce:
const evens = reduce([1, 2, 3, 4], (acc, n) => { if (n % 2 === 0) acc.push(n); return acc; }, []);  // [2, 4]
```

Reduce (also known as `fold`) is a fundamental operation in functional programming. You'll use `Array.prototype.reduce` constantly in real JavaScript code.

### Common mistakes and how to fix them

#### Mistake 1: Pushing the original value in a transform

```js
// WRONG
function doubleNumbers(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n);   // BUG: pushing n instead of n * 2
  }
  return result;
}

console.log(doubleNumbers([1, 2, 3]));   // [1, 2, 3] — unchanged!
```

**Problem:** The transform isn't applied. Easy to miss when the logic is more complex.
**Fix:** Verify what you're pushing: `result.push(n * 2)`.

---

#### Mistake 2: Mutating the input array

```js
// WRONG
function doubleNumbersMutating(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i] * 2;   // mutates the original!
  }
  return numbers;
}

const arr = [1, 2, 3];
const result = doubleNumbersMutating(arr);
console.log(arr);     // [2, 4, 6] — the original was destroyed!
console.log(result === arr);  // true — same array reference
```

**Problem:** The caller's original array is modified. They passed data in expecting it to be unchanged.
**Fix:** Always `const result = []; ... result.push(...); return result;`.

---

#### Mistake 3: Using `return` inside a transform loop

```js
// WRONG
function doubleNumbers(numbers) {
  const result = [];
  for (const n of numbers) {
    result.push(n * 2);
    return result;    // BUG: exits after first element!
  }
}

console.log(doubleNumbers([1, 2, 3]));   // [2] — only first element!
```

**Problem:** `return` inside a transform loop exits after the first iteration.
**Fix:** `return result` belongs after the loop, not inside it. In transforms, you must visit every element before returning.

### Connection to interview problems

- **LeetCode 1929 — Concatenation of Array**: Transform + combine arrays — builds on `doubleNumbers` logic
- **LeetCode 2011 — Final Value After Operations**: Transform strings to +1/-1, accumulate — transform then reduce
- **LeetCode 1365 — How Many Numbers Are Smaller Than Current Number**: Filter + count — `filterLongWords` pattern applied to numbers

Map and filter are the most used array operations in JavaScript. Almost every real codebase uses them constantly. Understanding them at the loop level is what makes the one-liner built-in versions obvious and trustworthy.

### Discussion questions

1. **Why is `filterLongWords` O(n) even when almost all words are filtered out?** Because we still have to check every word to know whether it qualifies. O(n) describes the number of elements *examined*, not the number returned.

2. **`extractFirstNames` and `getCustomerFullNames` (from Day 4) are both transforms. What's the structural difference?** Both produce one string per input object. `extractFirstNames` extracts one field directly. `getCustomerFullNames` combines two fields. Same shape (transform), different implementation of the transformation.

3. **If you had to apply both a filter and a transform, which order is more efficient?** Filter first, then transform: you reduce the number of elements before applying the (potentially expensive) transform. The two-pass version does the same total work when every element passes, but less work when many are filtered out.

### Further exploration

- MDN: [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) — the built-in version of your transform
- MDN: [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) — the built-in version of your filter
- MDN: [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) — the generalization of both; you'll use it every day in professional JavaScript
