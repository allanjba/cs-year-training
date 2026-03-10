## Day 007 — Lesson A (Foundations): The Testing Mindset

### Why this matters

You've been writing functions for six days. How do you know they're correct?

Right now you probably run the code, look at the output, and decide "that looks right." That works for simple cases. But as code gets more complex, you need a more reliable method — one that checks your assumptions automatically and tells you immediately when something breaks.

Testing is a discipline, not just a technique. It's a way of thinking: before you write code, you ask "what should this function do?" and you express those expectations as **assertions** — checks that either pass or fail. When they all pass, you can have confidence in your code. When one fails, you know exactly what broke and where.

Today you'll build a tiny testing framework from scratch. Not because you'll always roll your own, but because understanding how tests work at the fundamental level makes you a better developer regardless of which testing library you use.

### The core concept

An **assertion** is a statement that should always be true if your code is correct. If it's not true, something is wrong — either in your code or in your understanding of what the code should do.

The simplest possible assertion: check if two values are equal.

```js
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.log("FAIL:", message, "| expected:", expected, "| got:", actual);
  } else {
    console.log("PASS:", message);
  }
}
```

You call it like this:

```js
assertEqual(sumArray([1, 2, 3]), 6, "sum of [1, 2, 3]");
assertEqual(sumArray([]), 0, "sum of empty array");
assertEqual(sumArray([-1, 1]), 0, "sum cancels to zero");
```

Each call either prints `PASS` or `FAIL`. If you change `sumArray` and accidentally break it, the failing assertion tells you exactly which case broke and what it expected.

**A test case is:** a description of one specific scenario, plus the expected result for that scenario.

**Good test cases cover:**
1. A typical/normal case
2. Edge cases (empty input, zero values, single element)
3. Boundary conditions (exactly at a threshold, e.g., checking `>= 18` at age 18)
4. Cases that previously caused bugs (regression tests)

### How it works

Let's trace through testing a `maxOfTwo` function:

**The function:**
```js
function maxOfTwo(a, b) {
  return a >= b ? a : b;
}
```

**Writing tests:**
```
assertEqual(maxOfTwo(3, 5), 5, "second is larger")
assertEqual(maxOfTwo(5, 3), 5, "first is larger")
assertEqual(maxOfTwo(5, 5), 5, "equal values — returns either")
assertEqual(maxOfTwo(-1, -5), -1, "both negative")
assertEqual(maxOfTwo(0, 0), 0, "both zero")
```

**Running the tests:**
```
PASS: second is larger
PASS: first is larger
PASS: equal values — returns either
PASS: both negative
PASS: both zero
```

Now suppose someone "fixes" the function:

```js
function maxOfTwo(a, b) {
  return a > b ? a : b;  // changed >= to >
}
```

```
PASS: second is larger
PASS: first is larger
FAIL: equal values — returns either | expected: 5 | got: 5
```

Wait — the output is still 5, so why does it pass? Because `a > b` when `a = b = 5` is false, so it returns `b` which is also 5. The test passes even for wrong implementations! This is why **test messages matter** — they describe the intention, not just the values.

A better test for this case would be:
```js
assertEqual(maxOfTwo(7, 7), 7, "equal values return that value");
```

The value doesn't change, but the logic path does. Both implementations return 7 here, so this test alone can't distinguish them. You need to think carefully about what each test actually validates.

### Code implementation

```js
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.log(`FAIL: ${message} | expected: ${expected} | got: ${actual}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}
```

**For comparing arrays or objects, `!==` won't work:**

```js
[1, 2, 3] === [1, 2, 3]  // false! These are two different objects in memory
```

You need a deep comparison:

```js
function assertDeepEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.log(`FAIL: ${message} | expected: ${e} | got: ${a}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

assertDeepEqual([1, 2, 3], [1, 2, 3], "same array contents");  // PASS
assertDeepEqual({ a: 1 }, { a: 1 }, "same object contents");   // PASS
```

**Using the assertions to test a function:**

```js
function maxOfTwo(a, b) {
  return a >= b ? a : b;
}

// Test cases
assertEqual(maxOfTwo(3, 5), 5, "second number is larger");
assertEqual(maxOfTwo(10, 3), 10, "first number is larger");
assertEqual(maxOfTwo(7, 7), 7, "equal numbers");
assertEqual(maxOfTwo(-3, -1), -1, "both negative, -1 is larger");
assertEqual(maxOfTwo(0, 5), 5, "zero vs positive");
```

### Common pitfalls

**1. Testing only the happy path**

```js
// Don't just test the obvious case
assertEqual(sumArray([1, 2, 3]), 6, "basic sum");
// Test the edge cases too
assertEqual(sumArray([]), 0, "empty array");
assertEqual(sumArray([-5, 5]), 0, "canceling values");
assertEqual(sumArray([0, 0, 0]), 0, "all zeros");
```

The bugs usually live in the edge cases, not the normal path.

**2. Tests that can't fail**

```js
// This test can never fail — it's circular
const result = sumArray([1, 2, 3]);
assertEqual(result, result, "result equals itself");  // always passes!
```

Tests should have a *hardcoded* expected value that you computed by hand, not a value derived from the function being tested.

**3. Vague test messages**

```js
assertEqual(maxOfTwo(5, 5), 5, "test");        // unhelpful
assertEqual(maxOfTwo(5, 5), 5, "equal inputs return either value");  // useful
```

Good test messages explain what scenario you're testing. When a test fails, the message tells you what broke without having to re-read the code.

**4. Testing too many things at once**

```js
// Bad: one test for everything
const result = processData([1, 2, 3]);
assertEqual(result.sum, 6, "processData works");

// Better: separate tests for each behavior
assertEqual(processData([1, 2, 3]).sum, 6, "sum is correct");
assertEqual(processData([1, 2, 3]).count, 3, "count is correct");
assertEqual(processData([]).sum, 0, "sum of empty is 0");
```

Each test should verify one specific thing. When it fails, you know exactly which behavior broke.

### Computer Science foundations

**Why testing matters at scale:**
A function with 3 inputs might work correctly for the cases you manually tested but fail for input #4. As programs grow, you accumulate hundreds of functions, each with many possible behaviors. Manual verification doesn't scale. Automated tests run in milliseconds and check every case every time you make a change.

**The testing pyramid:**
- **Unit tests**: Test one function in isolation (what you're writing today)
- **Integration tests**: Test how multiple functions work together
- **End-to-end tests**: Test the full system from the user's perspective

Unit tests are the foundation. They run fastest, are easiest to write, and pinpoint failures precisely.

**Test-driven development (TDD):**
Some developers write the tests *before* writing the function. This forces you to think clearly about the function's specification before writing any code. When all tests pass, you know you've correctly implemented the specification. It's a powerful discipline — even if you don't always follow it strictly.

**Regression testing:**
When you find a bug, write a test that reproduces it *before* fixing it. Then fix the bug. The test confirms your fix worked. If the same bug reappears later (regression), the test will catch it.

### Real-world applications

- **Professional software development**: Every serious codebase has a test suite that runs automatically on every code change
- **CI/CD pipelines**: Tests run before code is deployed; failures block the deployment
- **Open source libraries**: Test suites document expected behavior and prevent contributors from accidentally breaking things
- **APIs**: Tests verify that endpoint behavior matches documentation

You'll write tests every day as a professional developer. The mental habit — "what are all the ways this could fail?" — is as important as the syntax.

### Before the exercise

In the exercise file, you'll implement:

1. **`assertEqual(actual, expected, message)`** — Print PASS or FAIL with a clear message
2. **`assertDeepEqual(actual, expected, message)`** — Same, but works for arrays and objects
3. **A set of small functions** with thorough test cases for each

For each function you write:
- Test the typical case
- Test at least one edge case (empty input, zero, boundary value)
- Write descriptive test messages that explain the scenario

Ask yourself: "If my function were wrong in one specific way, would my tests catch it?" If yes, that's a good test.
