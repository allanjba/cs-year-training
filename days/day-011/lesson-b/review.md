## Day 011 — Lesson B Review: API Error Rate Monitoring

### What you should have learned

1. **Domain application doesn't change the algorithm**: `windowErrorRates` is structurally identical to `windowAverages` from Lesson A. The naming changed to match the domain ("error rates" instead of "averages"), but the code is the same. Recognizing this lets you apply known patterns to new problems without reinventing them.
2. **`>` vs `>=` is a product decision, not a technicality**: Whether `rate > threshold` or `rate >= threshold` triggers an alert is a business requirement. "Exceeds 5.0" means `> 5.0`; "reaches or exceeds" means `>= 5.0`. Always encode the spec precisely — one character difference, real operational consequence.
3. **Early exit on first match**: `firstAlertWindow` doesn't need to find all alerting windows — just the first. Returning as soon as the condition is met is both faster and cleaner than scanning everything.
4. **Composition over reimplementation**: `alertsTriggered` delegates to `windowErrorRates` rather than reimplementing the sliding window. This is the same principle as Day 8 — call the helper, don't inline it.
5. **Partial windows are not valid**: If you have only 2 minutes of data and the window is 5 minutes, the window doesn't exist yet. Return `[]` for `windowErrorRates` and `false` for `alertsTriggered` when data is insufficient — never extrapolate from partial data.

### Reviewing your implementation

#### Function 1: `windowErrorRates(errorCounts, windowSize)`

```js
function windowErrorRates(errorCounts, windowSize) {
  if (errorCounts.length < windowSize) return [];

  const rates = [];

  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    windowSum += errorCounts[i];
  }
  rates.push(windowSum / windowSize);

  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];
    rates.push(windowSum / windowSize);
  }

  return rates;
}

const hourlyErrors = [2, 0, 4, 1, 3, 9, 7, 2, 0, 1];

console.log(windowErrorRates(hourlyErrors, 3));
// [2, 1.67, 2.67, 4.33, 6.33, 6, 3, 1]  (approximately)
console.log(windowErrorRates([], 3));         // []
console.log(windowErrorRates([1, 2], 5));     // []
```

**Key insights:**
- Identical two-phase structure as `windowAverages` from Lesson A — same algorithm, applied in a monitoring context
- Returns `[]` for insufficient data — a monitoring system should not fire alerts based on a partial data window
- The floating-point averages are correct; for display, call `.toFixed(2)` on each value

**Edge cases handled:**
- Empty array → `[]`
- Fewer elements than window size → `[]`
- Window of size 1 → each element is its own average (the original array, converted to floats)

---

#### Function 2: `alertsTriggered(errorCounts, windowSize, threshold)`

```js
function alertsTriggered(errorCounts, windowSize, threshold) {
  const rates = windowErrorRates(errorCounts, windowSize);
  for (const rate of rates) {
    if (rate > threshold) return true;
  }
  return false;
}

console.log(alertsTriggered(hourlyErrors, 3, 5));    // true
console.log(alertsTriggered(hourlyErrors, 3, 10));   // false
console.log(alertsTriggered([], 3, 5));              // false (no data, no alerts)
```

**Key insights:**
- Delegates window computation to `windowErrorRates` — no sliding-window code here
- `rate > threshold` (strict greater-than) — matches "exceeds" in the spec
- Early exit: `return true` as soon as the first violation is found — doesn't check remaining windows

**Edge cases handled:**
- Empty data → `rates` is `[]`, loop never runs → `false` (no data means no alerts)
- No window exceeds threshold → loop completes, `return false`
- First window already exceeds → returns `true` immediately

---

#### Function 3: `firstAlertWindow(errorCounts, windowSize, threshold)`

```js
function firstAlertWindow(errorCounts, windowSize, threshold) {
  if (errorCounts.length < windowSize) return null;

  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    windowSum += errorCounts[i];
  }

  // Check first window (starting at index 0)
  if (windowSum / windowSize > threshold) return 0;

  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];

    const windowStart = i - windowSize + 1;
    if (windowSum / windowSize > threshold) return windowStart;
  }

  return null;
}

console.log(firstAlertWindow(hourlyErrors, 3, 5));   // 4
// Window at index 4: [3, 9, 7] → avg 6.33 > 5 ✓
// Windows 0-3: avgs 2, 1.67, 2.67, 4.33 → all ≤ 5

console.log(firstAlertWindow(hourlyErrors, 3, 10));  // null
console.log(firstAlertWindow([], 3, 5));             // null
```

**Key insights:**
- Returns the *starting index* of the first alerting window, not the window itself or the rate
- `windowStart = i - windowSize + 1`: when the right edge of the window is at `i`, the left edge (start) is at `i - windowSize + 1`
- Checks Phase 1 result before entering Phase 2 — the first window is also a candidate
- Returns `null` (not `-1`) to signal "no alerting window found" — `null` is explicit; `-1` is a C-style convention less idiomatic in JavaScript

**Edge cases handled:**
- No alerting window → `null`
- First window already alerts → returns `0`
- Insufficient data → `null`

### Going deeper

#### Extension 1: Return all alerting window indices

```js
function allAlertWindows(errorCounts, windowSize, threshold) {
  const alertIndices = [];

  if (errorCounts.length < windowSize) return alertIndices;

  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    windowSum += errorCounts[i];
  }
  if (windowSum / windowSize > threshold) alertIndices.push(0);

  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];
    if (windowSum / windowSize > threshold) {
      alertIndices.push(i - windowSize + 1);
    }
  }

  return alertIndices;
}

console.log(allAlertWindows(hourlyErrors, 3, 5));
// [4, 5, 6]  — windows starting at 4, 5, 6 all exceed the threshold
```

Useful for building a timeline of alert periods rather than just detecting the first.

#### Extension 2: Integer arithmetic to avoid floating-point comparison

Multiplying the threshold by the window size turns the average comparison into an integer sum comparison:

```js
function alertsTriggeredExact(errorCounts, windowSize, threshold) {
  const sumThreshold = threshold * windowSize;   // e.g., 5.0 * 3 = 15
  const rates = windowErrorRates(errorCounts, windowSize);
  // But we compare sums, not rates — need the sum version:
  // ...
}

// Or inline the sum check:
function alertsTriggeredExact(errorCounts, windowSize, threshold) {
  if (errorCounts.length < windowSize) return false;

  const sumThreshold = threshold * windowSize;
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) windowSum += errorCounts[i];
  if (windowSum > sumThreshold) return true;

  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];
    if (windowSum > sumThreshold) return true;
  }
  return false;
}
```

Avoids division and floating-point comparison. For integer error counts and integer thresholds, this is exact.

### Common mistakes and how to fix them

#### Mistake 1: Using `>=` instead of `>` for the threshold check

```js
// WRONG — "reaches or exceeds" ≠ "exceeds"
function alertsTriggered(errorCounts, windowSize, threshold) {
  const rates = windowErrorRates(errorCounts, windowSize);
  for (const rate of rates) {
    if (rate >= threshold) return true;   // should be >
  }
  return false;
}

// With threshold = 5 and a window averaging exactly 5.0:
alertsTriggered([5, 5, 5], 3, 5);   // true with >=, false with >
```

**Problem:** "Exceeds 5" means the value must be greater than 5, not equal to it. Using `>=` fires alerts for windows that are exactly at the threshold.
**Fix:** Read the spec. "Exceeds" → `>`. "Reaches or exceeds" → `>=`.

---

#### Mistake 2: Reimplementing the sliding window inside `alertsTriggered`

```js
// WRONG — ignores windowErrorRates, duplicates the sliding window logic
function alertsTriggered(errorCounts, windowSize, threshold) {
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) windowSum += errorCounts[i];
  if (windowSum / windowSize > threshold) return true;

  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];
    if (windowSum / windowSize > threshold) return true;
  }
  return false;
}
```

**Problem:** This is functionally correct but defeats the purpose of writing `windowErrorRates` as a separate function. If the sliding window logic has a bug, it now exists in two places.
**Fix:** `const rates = windowErrorRates(errorCounts, windowSize); for (const rate of rates) { if (rate > threshold) return true; } return false;` — call the helper.

---

#### Mistake 3: Returning `null` for `alertsTriggered` when data is empty

```js
// WRONG — alertsTriggered should return a boolean
function alertsTriggered(errorCounts, windowSize, threshold) {
  if (errorCounts.length < windowSize) return null;   // should be false!
  // ...
}
```

**Problem:** `alertsTriggered` promises a boolean. Callers write `if (alertsTriggered(...))` — but `if (null)` is `false` (falsy), so this accidentally "works," masking the real issue. Returning `null` from a boolean function is a type contract violation.
**Fix:** Return `false`. No data → no alerts → `false`.

### Connection to interview problems

- **LeetCode 1343 — Number of Sub-arrays of Size K and Average Greater Than or Equal to Threshold**: Exactly the alerting problem — count windows where average ≥ threshold
- **LeetCode 2461 — Maximum Sum of Distinct Subarrays With Length K**: Sliding window with an additional uniqueness constraint — builds on the same structure
- **Real-world SRE**: Site reliability engineers write alert rules in PromQL (Prometheus Query Language) as: `avg_over_time(error_count[5m]) > 5`. This is a sliding window average over a 5-minute range — the same computation you built today, expressed in a query language

### Discussion questions

1. **`firstAlertWindow` returns the window's starting index. Is that the most useful thing to return?** It depends on the caller. A dashboard might want the starting index (to display "alert started at 4:00 PM"). A logger might want the full window array. A summary report might want both the index and the rate. Functions should return the minimal useful value — let the caller decide what to do with it. Returning an index is correct; making it richer is an extension.

2. **If error counts can be very large (millions of errors per minute), would this implementation break?** No — JavaScript numbers are IEEE 754 doubles, which can represent integers exactly up to 2^53 (~9 quadrillion). Millions fit easily. The only concern is floating-point precision in the average computation, which can be avoided by working with integer sums and comparing `windowSum > threshold * windowSize`.

3. **`alertsTriggered` scans all windows and returns on the first match. `allAlertWindows` scans all windows and collects all matches. When would you use each?** `alertsTriggered` for real-time alerting: "should I page someone right now?" `allAlertWindows` for post-incident analysis: "during the incident, how long was the error rate elevated?" Knowing which question you're answering determines which function you need.

### Further exploration

- [Prometheus — Recording Rules](https://prometheus.io/docs/practices/rules/): The production system that evaluates exactly these sliding-window alert conditions over time series data at massive scale
- Read about **exponential moving average (EMA)**: An alternative to the simple moving average where recent values are weighted more heavily. Used in stock charts and UNIX load average — the same problem, a different algorithm. The `uptime` command on Mac/Linux shows the 1/5/15-minute load averages using EMA.
