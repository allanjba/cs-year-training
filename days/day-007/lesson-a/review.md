## Day 007 — Lesson A Review: The Testing Mindset

### What you should have learned

1. **Assertions make expectations explicit**: An assertion is a statement of what *must* be true. When it fails, it tells you exactly what broke.
2. **Test cases = inputs + expected outputs**: Each test covers one specific scenario. The expected value must be hardcoded — not derived from the function being tested.
3. **Cover happy path and edge cases**: Typical input, empty input, boundary values, and previously broken cases all need tests.
4. **Array equality needs deep comparison**: `[1, 2] === [1, 2]` is `false` in JavaScript. Use `JSON.stringify` or a per-element check.
5. **Tests change how you design functions**: Writing tests before code forces you to think about what the function should do before worrying about how.

### Reviewing your implementation

#### Function 1: `assertEqual(actual, expected, message)`

```js
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.log(`FAIL: ${message} | expected: ${expected} | got: ${actual}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

// Tests of the assertion helper itself:
assertEqual(1 + 1, 2, "basic arithmetic");   // PASS: basic arithmetic
assertEqual(1 + 1, 3, "wrong sum");          // FAIL: wrong sum | expected: 3 | got: 2
```

**Key insights:**
- `!==` strict inequality: `assertEqual(0, false, "msg")` prints FAIL (correct — `0 !== false`)
- Template literals make the failure message readable — you can see both the expected and actual value at a glance
- The test message describes *what scenario* is being tested, not just what values are being compared

**Edge cases handled:**
- Both values `null` → PASS (`null !== null` is false)
- Both values `NaN` → FAIL (`NaN !== NaN` is always true — NaN is never equal to itself)

---

#### Function 2: `assertArrayEqual(actual, expected, message)`

```js
function assertArrayEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.log(`FAIL: ${message} | expected: ${e} | got: ${a}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

assertArrayEqual([1, 2, 3], [1, 2, 3], "same contents");   // PASS
assertArrayEqual([1, 2], [1, 3], "different values");       // FAIL
assertArrayEqual([], [], "both empty");                      // PASS
```

**Key insights:**
- `JSON.stringify` converts arrays and objects to comparable strings — two arrays with the same contents produce identical JSON strings
- Limitation: `JSON.stringify` can't handle `undefined` values, circular references, or `NaN` correctly. For production testing, use a real test framework (Jest, Vitest).

**Edge cases handled:**
- Two empty arrays → PASS (`"[]" === "[]"`)
- Different lengths → FAIL (JSON strings differ)

---

#### Function 3: `sumNonNegative(numbers)`

```js
function sumNonNegative(numbers) {
  let sum = 0;
  for (const n of numbers) {
    if (n >= 0) {
      sum += n;
    }
  }
  return sum;
}

// Tests:
assertEqual(sumNonNegative([-1, 5, 3]), 8, "filters negatives");
assertEqual(sumNonNegative([0, 1, 2]), 3, "zero is non-negative");
assertEqual(sumNonNegative([-5, -3]), 0, "all negatives return 0");
assertEqual(sumNonNegative([]), 0, "empty array");
```

**Key insights:**
- `>= 0` includes zero — "non-negative" means zero and positive, not just positive
- All negatives → `0`: the loop runs but nothing passes the condition, `sum` stays `0`

---

#### Function 4: `selectNonEmpty(strings)`

```js
function selectNonEmpty(strings) {
  const result = [];
  for (const s of strings) {
    if (s.length > 0) {
      result.push(s);
    }
  }
  return result;
}

// Tests:
assertArrayEqual(selectNonEmpty(["", "hi", " ", "ok"]), ["hi", " ", "ok"], "removes empty strings");
assertArrayEqual(selectNonEmpty(["", ""]), [], "all empty");
assertArrayEqual(selectNonEmpty([]), [], "empty array");
assertArrayEqual(selectNonEmpty(["hello"]), ["hello"], "single non-empty");
```

**Key insights:**
- `" "` (a space) has `length > 0` — it's non-empty by the spec. Only `""` is empty.
- A string of only spaces being "non-empty" may feel wrong — in real applications you'd use `s.trim().length > 0`. But the spec says non-empty means `length > 0`, so we follow the spec.

### Going deeper

#### Extension 1: Show *where* arrays differ (better failure messages)

The `assertArrayEqual` with `JSON.stringify` tells you the arrays differ but not at which index. An improved version:

```js
function assertArrayEqual(actual, expected, message) {
  if (actual.length !== expected.length) {
    console.log(`FAIL: ${message} | different lengths: ${actual.length} vs ${expected.length}`);
    return;
  }
  for (let i = 0; i < expected.length; i++) {
    if (actual[i] !== expected[i]) {
      console.log(`FAIL: ${message} | index ${i}: expected ${expected[i]}, got ${actual[i]}`);
      return;
    }
  }
  console.log(`PASS: ${message}`);
}
```

This is closer to what real test frameworks (Jest, Vitest) provide.

#### Extension 2: Organizing tests into named test groups

As test files grow, grouping related tests makes output easier to scan:

```js
function test(name, fn) {
  console.log(`\n--- ${name} ---`);
  fn();
}

test("sumNonNegative", () => {
  assertEqual(sumNonNegative([-1, 5, 3]), 8, "filters negatives");
  assertEqual(sumNonNegative([]), 0, "empty array");
});

test("selectNonEmpty", () => {
  assertArrayEqual(selectNonEmpty(["", "hi"]), ["hi"], "removes empty");
  assertArrayEqual(selectNonEmpty([]), [], "empty array");
});
```

This pattern is how real test frameworks structure test suites: `describe` (group) + `it`/`test` (individual case).

### Common mistakes and how to fix them

#### Mistake 1: Deriving the expected value from the function itself

```js
// WRONG — this test can never fail
const result = sumNonNegative([1, 2, 3]);
assertEqual(result, sumNonNegative([1, 2, 3]), "same result");   // always PASS!
```

**Problem:** The expected value is computed by calling the function being tested. If the function is wrong, both sides are wrong in the same way.
**Fix:** Expected values must be hardcoded values you computed independently: `assertEqual(sumNonNegative([1, 2, 3]), 6, "sum 1+2+3")`.

---

#### Mistake 2: Vague test messages that don't help debugging

```js
// BAD — unhelpful when it fails
assertEqual(sumNonNegative([-1, 5, 3]), 8, "test 1");

// GOOD — tells you what scenario you're testing
assertEqual(sumNonNegative([-1, 5, 3]), 8, "negative values are excluded from sum");
```

**Problem:** When `"test 1"` fails, you have to go back and read the test code to understand what broke.
**Fix:** Write messages that describe the scenario: "negative values are excluded," "empty array returns 0," "zero counts as non-negative."

---

#### Mistake 3: Testing only success cases

```js
// INCOMPLETE — only tests when it works
assertEqual(sumNonNegative([1, 2, 3]), 6, "basic sum");
// Missing: what if all are negative? what about empty?
```

**Problem:** Edge cases are where bugs hide. A function that passes happy-path tests but fails on edge cases is broken.
**Fix:** Every function needs at least: one typical case, one empty-input case, one boundary case, one "all values on the wrong side" case.

### Connection to interview problems

The testing mindset directly applies to interviews:

- After writing a solution, interviewers expect you to walk through test cases: "Let me verify with an empty array... with a single element... with all the same values..."
- Bugs found during manual test-case walkthrough prevent "wrong answer" in coding challenges
- LeetCode itself is a form of automated testing — your function is called with inputs and expected outputs compared

### Discussion questions

1. **`assertEqual(NaN, NaN, "nan equals nan")` prints FAIL. Is that correct?** Yes — `NaN !== NaN` is a JavaScript (and IEEE 754) rule. NaN is not equal to anything, including itself. This is intentional: NaN represents an undefined or unrepresentable result, and two undefined results aren't necessarily the same undefined result. If you need to check for NaN, use `Number.isNaN(value)`.

2. **Why write tests before the implementation (TDD)?** Writing tests first forces you to clarify the function's contract — what inputs it accepts, what outputs it produces, what edge cases it handles — before any code exists. This prevents "testing what the code does" (which always passes) in favor of "testing what the code should do." It also gives you immediate confidence when the implementation is done.

3. **What's wrong with `assertArrayEqual([1, 2], [1, "2"], "numbers vs strings")`?** `JSON.stringify([1, 2])` is `"[1,2]"` and `JSON.stringify([1, "2"])` is `'[1,"2"]'` — different strings, so it prints FAIL. Good. But what about `JSON.stringify([undefined])` → `"[null]"`? `JSON.stringify` converts `undefined` values to `null`. A proper test framework handles this correctly.

### Further exploration

- Jest documentation: [matchers](https://jestjs.io/docs/expect) — the professional version of your assertion helpers; `expect(actual).toBe(expected)` = `assertEqual`; `expect(actual).toEqual(expected)` = deep equality for arrays/objects
- Martin Fowler: [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — why unit tests are the foundation of a reliable test suite
- Test-Driven Development (TDD) by example: Kent Beck's book is the definitive reference for the practice you started today
