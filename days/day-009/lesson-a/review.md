## Day 009 — Lesson A Review: Week 1 Consolidation

### What you should have learned

1. **Pattern recognition across domains**: `countShortStrings`, `sumPositiveNumbers`, and `buildTagFrequency` each use a different Week 1 pattern (filter-count, filter-accumulate, frequency map) — being able to identify which pattern fits which problem is the skill Week 1 was building toward.
2. **A test harness is just a function**: `assertEqual` is not magic — it is an `if` statement that prints a message. Understanding that testing frameworks are built on this same primitive removes the mystique.
3. **Boundary conditions from the spec, not from intuition**: `countShortStrings` with `maxLength` is `length <= maxLength` (inclusive), because the spec says "length <= maxLength." Write the test for the boundary value before the implementation.
4. **`sumPositiveNumbers` vs `sumNonNegative`**: Strictly positive means `> 0`. Zero is not positive. This is a one-character difference (`> 0` vs `>= 0`) with real behavior consequences — always check the spec's exact wording.
5. **`buildTagFrequency` generalizes `charFrequency` and `valueFrequency`**: All three are frequency maps. The input shape differs (string vs array vs array-of-values); the algorithm is identical. Recognizing this generalization is how you build a mental library of reusable patterns.

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

// Self-test the test helper:
assertEqual(1 + 1, 2, "basic arithmetic");             // PASS
assertEqual("hi".length, 2, "string length");          // PASS
assertEqual([1, 2].length, 3, "wrong length");         // FAIL: wrong length | expected: 3 | got: 2
assertEqual(null, null, "null equals null");            // PASS
```

**Key insights:**
- `!==` (strict inequality): `assertEqual(0, false, "msg")` fails — that is correct behavior because `0 !== false` in JS
- The message describes the *scenario*, not the values: "basic arithmetic" is better than "1+1"
- `NaN !== NaN` is always `true` — testing for NaN with `assertEqual` always fails, which is why real test frameworks have `Number.isNaN` matchers

**Edge cases handled:**
- Both values `null` → PASS
- Both values `NaN` → FAIL (NaN is not equal to itself — by spec)
- Type mismatch (`0` vs `false`) → FAIL (strict equality)

---

#### Function 2: `countShortStrings(strings, maxLength)`

```js
function countShortStrings(strings, maxLength) {
  let count = 0;
  for (const s of strings) {
    if (s.length <= maxLength) {
      count++;
    }
  }
  return count;
}

assertEqual(countShortStrings(["a", "hello", "hi"], 2), 2, "two short strings");
assertEqual(countShortStrings(["hello", "world"],    2), 0, "none short enough");
assertEqual(countShortStrings([],                    5), 0, "empty array");
assertEqual(countShortStrings(["hi"],                2), 1, "exactly at boundary");
```

**Key insights:**
- `<=` not `<` — "length <= maxLength" means a string of exactly `maxLength` characters counts. Write the boundary test first to verify.
- Accumulate a count, not the strings themselves — the return type is a number
- The same loop-and-count pattern as `countOccurrences` (Day 1) and `countUrgentSubjects` (Day 2)

**Edge cases handled:**
- Empty array → `0`
- All strings longer than `maxLength` → `0`
- Exactly at the boundary (`"hi"` with `maxLength = 2`) → counts (inclusive)

---

#### Function 3: `sumPositiveNumbers(numbers)`

```js
function sumPositiveNumbers(numbers) {
  let sum = 0;
  for (const n of numbers) {
    if (n > 0) {
      sum += n;
    }
  }
  return sum;
}

assertEqual(sumPositiveNumbers([-1, 5, 3]),  8, "sums positives, skips negatives");
assertEqual(sumPositiveNumbers([0, 1, 2]),   3, "zero is not positive");
assertEqual(sumPositiveNumbers([-5, -3]),    0, "all negative returns 0");
assertEqual(sumPositiveNumbers([]),          0, "empty array");
```

**Key insights:**
- `> 0` not `>= 0` — zero is not a positive number. Compare to Day 7's `sumNonNegative` which uses `>= 0`
- Empty input returns `0` — the loop never runs, the accumulator stays at its initial value
- All negatives returns `0` — same reason: no element passes the condition

**Edge cases handled:**
- Zero in input → skipped (zero is not positive)
- All negatives → `0`
- Empty array → `0`

---

#### Function 4: `buildTagFrequency(tags)`

```js
function buildTagFrequency(tags) {
  const counts = {};
  for (const tag of tags) {
    counts[tag] = (counts[tag] || 0) + 1;
  }
  return counts;
}

console.log(buildTagFrequency(["a", "b", "a"]));    // { a: 2, b: 1 }
console.log(buildTagFrequency(["js", "js", "go"])); // { js: 2, go: 1 }
console.log(buildTagFrequency([]));                 // {}
```

**Key insights:**
- Identical algorithm to `charFrequency` (Day 6) and `valueFrequency` (Day 6) — the same frequency-map pattern works for any array of values
- `(counts[tag] || 0) + 1` handles the first occurrence of a tag without throwing (avoids `undefined + 1 = NaN`)
- Recognizing this as "the frequency map" and reaching for the pattern — without rebuilding it from scratch — is what consolidation means

**Edge cases handled:**
- Empty array → `{}`
- All same tag → `{ tag: n }` where n = array length
- All distinct tags → each maps to `1`

### Going deeper

#### Extension 1: Combining consolidation patterns

A function that uses multiple Week 1 patterns together:

```js
function analyzeStrings(strings) {
  const freq = buildTagFrequency(strings);         // frequency map
  const shortCount = countShortStrings(strings, 3); // filter-count
  const totalLength = strings.reduce((s, str) => s + str.length, 0); // accumulate

  return {
    frequency: freq,
    shortCount,
    averageLength: strings.length === 0 ? 0 : totalLength / strings.length,
    uniqueCount: Object.keys(freq).length,
  };
}

console.log(analyzeStrings(["js", "go", "python", "js"]));
// { frequency: { js: 2, go: 1, python: 1 }, shortCount: 2, averageLength: 3.75, uniqueCount: 3 }
```

This is how Week 1 patterns compose in the real world: each helper is simple; combined, they answer rich questions.

#### Extension 2: Assertions that print context

```js
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.log(`FAIL: ${message}`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Got:      ${JSON.stringify(actual)}`);
    console.log(`  Type:     expected=${typeof expected}, got=${typeof actual}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}
```

Printing the type alongside the value reveals type coercion bugs: `assertEqual(1, "1", "id check")` would show `type: expected=string, got=number`.

### Common mistakes and how to fix them

#### Mistake 1: Using `>=` instead of `>` in `sumPositiveNumbers`

```js
// WRONG — includes zero, which is not positive
function sumPositiveNumbers(numbers) {
  let sum = 0;
  for (const n of numbers) {
    if (n >= 0) {   // should be n > 0
      sum += n;
    }
  }
  return sum;
}

assertEqual(sumPositiveNumbers([0, 1, 2]), 3, "zero is not positive");
// FAIL: zero is not positive | expected: 3 | got: 3
// Wait — this passes! But the intent is wrong.

assertEqual(sumPositiveNumbers([0]), 0, "zero alone sums to 0");
// FAIL: zero alone sums to 0 | expected: 0 | got: 0
// Still passes! The bug is invisible unless you test the right case.

assertEqual(sumPositiveNumbers([0, -1]), 0, "zero not counted, negative skipped");
// FAIL: zero not counted... | expected: 0 | got: 0
// This one also passes. The test doesn't reveal the bug.
```

**Problem:** The bug is subtle — `sumPositiveNumbers([0, 5])` with `>=` returns `5`, same as with `>`. The distinction only matters when you *only* have zero: `sumPositiveNumbers([0])` should return `0`. Write a test specifically for zero.
**Fix:** `if (n > 0)` — strictly greater than zero.

---

#### Mistake 2: Using `<` instead of `<=` in `countShortStrings`

```js
// WRONG — excludes strings of exactly maxLength characters
function countShortStrings(strings, maxLength) {
  let count = 0;
  for (const s of strings) {
    if (s.length < maxLength) {   // should be <=
      count++;
    }
  }
  return count;
}

assertEqual(countShortStrings(["hi"], 2), 1, "exactly at boundary");
// FAIL: exactly at boundary | expected: 1 | got: 0
```

**Problem:** `"hi".length === 2`, which is not `< 2`. The string at the boundary is excluded.
**Fix:** Always write a test for the boundary value. If the spec says "length <= maxLength," the boundary test `countShortStrings(["hi"], 2) === 1` must pass.

---

#### Mistake 3: Rebuilding the frequency map from scratch when `buildTagFrequency` exists

```js
// WRONG — reinvents buildTagFrequency inside another function
function mostCommonTag(tags) {
  const counts = {};
  for (const tag of tags) {        // duplicates buildTagFrequency
    counts[tag] = (counts[tag] || 0) + 1;
  }
  let top = null, topCount = 0;
  for (const tag of Object.keys(counts)) {
    if (counts[tag] > topCount) { top = tag; topCount = counts[tag]; }
  }
  return top;
}
```

**Problem:** The first loop is exactly `buildTagFrequency`. When `buildTagFrequency` changes (e.g., case normalization), this copy doesn't get the fix.
**Fix:** `const counts = buildTagFrequency(tags);` — call the function, don't inline it.

### Connection to interview problems

- **LeetCode 1832 — Check if the Sentence is Pangram**: Count character occurrences (`buildTagFrequency` for chars), verify all 26 letters appear — frequency map on characters
- **LeetCode 2089 — Find Target Indices After Sorting Array**: Count values, classify — `countShortStrings`-style counting on a different predicate
- **LeetCode 2185 — Counting Words With a Given Prefix**: Filter strings by a condition and count — same structure as `countShortStrings`
- **Week 1 interview simulation**: "Given an array of log lines, count how many are short enough to fit on a status bar, then build a frequency map of log levels." This problem combines `countShortStrings` and `buildTagFrequency` exactly as you'd write them today.

### Discussion questions

1. **`assertEqual` uses `!==`. What happens when you compare two arrays?** `[1, 2] !== [1, 2]` is always `true` — two different array objects are never `===` even if their contents are identical. For array comparisons you need `assertArrayEqual` (Day 7). This is why test frameworks have `toEqual` (deep equality) as a separate matcher from `toBe` (reference equality).

2. **`buildTagFrequency` and `charFrequency` (Day 6) are the same algorithm. Should there be one shared function?** Yes — the generalized version is `valueFrequency(values)`. `charFrequency(text)` is just `valueFrequency([...text])`. Recognizing this abstraction is good; in a real codebase, you'd write `valueFrequency` and document both use cases. In a curriculum, seeing the pattern in multiple forms first builds the recognition before the abstraction.

3. **Which of the four functions from today would be hardest to extend if requirements changed?** `assertEqual` — because its output format is hardcoded as `console.log`. In a real test runner you'd want to collect failures and report them all at the end, not print each one immediately. `countShortStrings`, `sumPositiveNumbers`, and `buildTagFrequency` are all pure functions — they're easy to extend without side effects.

4. **After a week of practice, which patterns feel automatic now?** If "filter and count" and "accumulate" feel automatic, that's real progress. The goal is to not have to think about the loop structure — just recognize "this is a filter-count" and write it without effort, leaving brain space for the harder parts of the problem.

### Further exploration

- [Jest — Getting Started](https://jestjs.io/docs/getting-started): Your `assertEqual` is a baby version of Jest's `expect(actual).toBe(expected)`. Setting up Jest (or Vitest) is the next step after hand-rolling assertions — see how the primitives you built map to a professional framework.
- Read about **test-driven development (TDD)**: Write the test for `countShortStrings(["hi"], 2) === 1` before writing the function. The test fails first (red), then you write the implementation until it passes (green). This "red-green-refactor" cycle is the discipline that makes the boundary condition `<=` vs `<` obvious before you write the bug.
