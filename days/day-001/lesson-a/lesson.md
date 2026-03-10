## Day 001 — Lesson A (Foundations): Pure Functions and Array Scanning

### Why this matters

Every program you write takes some data in and produces some result out. The cleaner you make that relationship—clear inputs, predictable outputs, no hidden side effects—the easier your code is to test, debug, and trust.

This is day one. We start with the most fundamental skill in programming: writing a function that processes a list of numbers. Not because it's exciting by itself, but because every technique you'll learn this year builds on this foundation. Running totals, searching, sorting, data transformation—they all start here.

The functions you write today—sum a list, find the min and max, count occurrences—look simple. But they require you to think clearly about *what you're doing at each step*. That deliberate thinking is the skill we're building.

### The core concept

A **pure function** takes inputs and returns an output, with no side effects: it doesn't change the outside world, doesn't print anything, doesn't modify its arguments, and always returns the same result for the same inputs.

```js
// Pure: same input always → same output
function double(n) {
  return n * 2;
}

// Not pure: changes something outside the function (side effect)
let total = 0;
function addToTotal(n) {
  total += n;  // modifies an outer variable — this is a side effect
}
```

Pure functions are easier to reason about. When something goes wrong, you only need to look at the function's inputs and its logic — nothing else.

The other concept for today is **linear scanning**: visiting every element in an array exactly once, front to back, to compute a result. This is the most common algorithmic pattern you'll ever use.

### How it works

Let's trace through computing the sum of `[3, 1, 4, 1, 5]`:

**The idea:** Walk through the array, adding each number to a running total.

```
numbers = [3, 1, 4, 1, 5]
start:    sum = 0

step 1:   sum = 0 + 3 = 3
step 2:   sum = 3 + 1 = 4
step 3:   sum = 4 + 4 = 8
step 4:   sum = 8 + 1 = 9
step 5:   sum = 9 + 5 = 14

result: 14
```

We touch each element exactly once. That's what we mean by "one pass."

Now let's trace finding the min and max of `[3, 1, 10]`:

**The idea:** Start by assuming the first element is both min and max. Update as you encounter new values.

```
numbers = [3, 1, 10]
start:    min = 3, max = 3   (seed with first element)

step 1 — see 1:
          1 < 3? yes → min = 1
          1 > 3? no
          state: min = 1, max = 3

step 2 — see 10:
          10 < 1? no
          10 > 3? yes → max = 10
          state: min = 1, max = 10

result: { min: 1, max: 10 }
```

Two comparisons per element. One pass. Done.

### Code implementation

```js
function sumArray(numbers) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum;
}

console.log(sumArray([1, 2, 3]));  // 6
console.log(sumArray([]));          // 0
```

**Breaking it down:**
- `let sum = 0` — start with nothing accumulated yet
- `for (const n of numbers)` — visit each element once, left to right
- `sum += n` — add the current element to the running total
- `return sum` — return the computed result; don't print it or store it globally

```js
function countOccurrences(items, value) {
  let count = 0;
  for (const item of items) {
    if (item === value) {
      count++;
    }
  }
  return count;
}

console.log(countOccurrences(['a', 'b', 'a'], 'a'));  // 2
console.log(countOccurrences([1, 2, 3], 9));           // 0
```

**Why `===` and not `==`?**
In JavaScript, `==` does type coercion: `1 == "1"` is `true`. That's almost never what you want. `===` checks both value *and* type, so `1 === "1"` is `false`. Always use `===` for equality checks.

```js
function minAndMax(numbers) {
  if (numbers.length === 0) return null;

  let min = numbers[0];
  let max = numbers[0];

  for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
  }

  return { min, max };
}

console.log(minAndMax([3, 1, 10]));  // { min: 1, max: 10 }
console.log(minAndMax([]));           // null
console.log(minAndMax([5]));          // { min: 5, max: 5 }
```

**Why start with `numbers[0]`?**
You might think to initialize with `min = Infinity` and `max = -Infinity`. That works, but seeding with the first element is cleaner — you always have a valid starting point, and you avoid special-casing non-numeric values like `Infinity`.

**The `{ min, max }` shorthand:**
Writing `return { min, max }` is the same as `return { min: min, max: max }`. When the property name matches the variable name, JavaScript lets you drop the repetition.

### Common pitfalls

**1. Forgetting to initialize your accumulator**

```js
function sumBroken(numbers) {
  let sum;            // undefined!
  for (const n of numbers) {
    sum += n;         // undefined + 1 === NaN
  }
  return sum;
}
```

Always initialize accumulator variables before you start accumulating. `let sum = 0`, `let count = 0`, etc.

**2. Not handling the empty array**

What should `minAndMax([])` return? There is no minimum or maximum of zero elements. Returning `null` is a clear signal that the answer doesn't exist. If you skip this check, `numbers[0]` will be `undefined`, and `undefined < undefined` is `false` — so your code will silently produce a wrong answer.

**3. Mutating the input**

```js
// Wrong: modifies the original array
function sumBad(numbers) {
  let total = numbers.pop();  // Changes the caller's array!
  // ...
}
```

Callers pass their array expecting it to stay unchanged. Read from inputs; never modify them unless you've explicitly agreed to do so.

**4. Mixing calculation and printing**

```js
// Harder to test and reuse
function sumAndPrint(numbers) {
  let sum = 0;
  for (const n of numbers) sum += n;
  console.log("Sum:", sum);  // side effect baked in
  return sum;
}
```

Separate computation from output. A function that only calculates can be tested by checking its return value. A function that prints can't be tested this way.

### Computer Science foundations

**Time Complexity:** O(n) for all three functions.
- We visit each element exactly once.
- Each step (addition, comparison, increment) costs O(1) — constant time.
- Total work scales linearly with input size.

**Space Complexity:** O(1) for all three functions.
- We use a fixed number of variables (`sum`, `count`, `min`, `max`), regardless of array size.
- We don't create any new arrays or data structures.

**What O(n) means in practice:**
If `sumArray` takes 1ms for 1,000 elements, it takes roughly 2ms for 2,000 elements, and 10ms for 10,000 elements. Time scales proportionally with input size. This is the most common and generally efficient complexity for problems that require looking at every element at least once.

**Best vs. worst case:**
For `sumArray` and `minAndMax`, best and worst case are the same — we always touch every element. There's no way to skip elements when you need to look at all of them.

### Real-world applications

- **Analytics**: Sum page views across a day, count how many users triggered an event
- **Finance**: Total up a list of transactions before displaying a balance
- **Data validation**: Count how many records match or don't match a condition
- **Health monitoring**: Find minimum and maximum values in a stream of sensor readings
- **E-commerce**: Sum items in a cart, count orders above a threshold

### Before the exercise

In the exercise file, you'll implement:

1. **`sumArray(numbers)`** — Sum all elements; return 0 for an empty array
2. **`countOccurrences(items, value)`** — Count how many times a value appears in the array
3. **`minAndMax(numbers)`** — Return `{ min, max }` in a single pass; return `null` for an empty array

As you write each function, ask yourself:
- What happens if the array is empty?
- Does my function modify its input? (It should not.)
- Can I trace through a small example by hand and get the right answer before I run the code?

Understanding *why* the algorithm works is more valuable than just getting it to run. Take time to trace through examples manually.
