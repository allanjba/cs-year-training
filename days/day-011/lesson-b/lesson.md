## Day 011 — Lesson B (Applied): API Error Rate Monitoring

### Why this matters

In Lesson A you built the sliding window as an abstract algorithm. Now apply it to a problem every backend engineer encounters: **monitoring a service's error rate in real time**.

When a service handles requests, not every request succeeds. Some fail — due to timeouts, bugs, or downstream failures. A single error is acceptable; a sustained burst of errors means something is wrong. The question is not "did any error happen?" but "is the error rate in the *recent* window above the acceptable threshold?"

This is the difference between a smoke alarm and a fire alarm. A smoke alarm fires on the first particle of smoke. A fire alarm (in a well-tuned system) fires when smoke density exceeds a threshold for a sustained period. You want the latter: an alert that triggers when the rolling average error count over the last N minutes crosses a limit.

Every major monitoring platform — Datadog, PagerDuty, AWS CloudWatch — is built on exactly this pattern. You configure an alert as: "alert me if the average errors per minute, measured over any 5-minute window, exceeds 10." This is a sliding window over a time series.

### The core concept

The data for this lesson is a time series: a sequence of values where each position represents one time period (one minute, one hour, etc.). For error monitoring:

```
minute:       1   2   3   4   5   6   7   8   9  10
errorCounts: [0,  1,  0,  3,  8,  5,  2,  0,  1,  4]
```

A **5-minute sliding window** looks at 5 consecutive minutes at a time and computes the average errors per minute:

```
Window [0..4]:  (0+1+0+3+8)/5  = 2.4  → fine
Window [1..5]:  (1+0+3+8+5)/5  = 3.4  → fine
Window [2..6]:  (0+3+8+5+2)/5  = 3.6  → fine
Window [3..7]:  (3+8+5+2+0)/5  = 3.6  → fine
...
```

If the threshold is 4.0, no window triggers an alert here. If the threshold were 3.0, the windows starting at indices 2 and 3 would trigger.

The applied problem: given the raw error counts and a window size, determine (1) the average error rate for each window, and (2) whether any window exceeds a given threshold.

### How it works

**Function 1: `windowErrorRates(errorCounts, windowSize)`**

This is `windowAverages` from Lesson A applied directly to error monitoring data. The structure is identical — we just name it for the domain.

Trace through `windowErrorRates([2, 0, 4, 1, 3], 3)`:

```
Phase 1 — first window [2, 0, 4]:
  windowSum = 2 + 0 + 4 = 6
  rate = 6 / 3 = 2.0
  result = [2.0]

Phase 2 — slide:
  i=3: enter numbers[3]=1, exit numbers[0]=2
    windowSum = 6 + 1 - 2 = 5
    rate = 5 / 3 ≈ 1.67
    result = [2.0, 1.67]

  i=4: enter numbers[4]=3, exit numbers[1]=0
    windowSum = 5 + 3 - 0 = 8
    rate = 8 / 3 ≈ 2.67
    result = [2.0, 1.67, 2.67]
```

**Function 2: `alertsTriggered(errorCounts, windowSize, threshold)`**

Walk through the error rates and return `true` if any window's average exceeds the threshold.

This is a single additional scan: compute the rates, then check each against the threshold. Or combine both into one pass — build the window sum and check the threshold before pushing the rate.

### Code implementation

```js
const hourlyErrors = [2, 0, 4, 1, 3, 9, 7, 2, 0, 1];

function windowErrorRates(errorCounts, windowSize) {
  if (errorCounts.length < windowSize) return [];

  const rates = [];

  // Phase 1: first window
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    windowSum += errorCounts[i];
  }
  rates.push(windowSum / windowSize);

  // Phase 2: slide
  for (let i = windowSize; i < errorCounts.length; i++) {
    windowSum += errorCounts[i];
    windowSum -= errorCounts[i - windowSize];
    rates.push(windowSum / windowSize);
  }

  return rates;
}

console.log(windowErrorRates(hourlyErrors, 3));
// [2, 1.67, 2.67, 4.33, 6.33, 6, 3, 1]
// (rounded for display — actual values may have more decimals)
```

**Breaking it down:**

- The function is structurally identical to `windowAverages` from Lesson A — same two-phase loop, same add/subtract pattern
- `rates.push(windowSum / windowSize)` — divide the running sum by the window size to get the average rate
- The result has `errorCounts.length - windowSize + 1` elements — one per valid window position

Now implement the alert function:

```js
function alertsTriggered(errorCounts, windowSize, threshold) {
  const rates = windowErrorRates(errorCounts, windowSize);
  for (const rate of rates) {
    if (rate > threshold) return true;
  }
  return false;
}

console.log(alertsTriggered(hourlyErrors, 3, 5));   // true  (window [3,9,7] → avg 6.33)
console.log(alertsTriggered(hourlyErrors, 3, 10));  // false (no window exceeds 10)
```

**Why this works:**

`alertsTriggered` delegates the window computation to `windowErrorRates` and only adds the threshold check. It's a composition of two focused functions — the window computation is reusable; the alert logic is a thin layer on top.

### Common pitfalls

**1. Using `>=` vs `>` for the threshold check**

The spec says "exceeds" the threshold, which means strictly greater than: `rate > threshold`. If the spec said "reaches or exceeds," you'd use `>=`. Always read the spec carefully — "exceeds 5.0" means 5.1 triggers the alert, but 5.0 does not.

**2. Alerting on the first data point before a full window is available**

At startup, you may not have `windowSize` data points yet. Return `[]` from `windowErrorRates` when there's not enough data — never extrapolate a partial window's average as if it were a full one. A window of 2 points when you need 5 would appear artificially low.

**3. Floating-point precision**

`(1 + 2 + 3) / 3 = 2.0000000000000004` in JavaScript (sometimes). Don't compare floating-point averages with `===`. In alerting, this usually doesn't matter (thresholds like 5.0 give enough room), but if you need exact comparison, use integer arithmetic: multiply threshold by windowSize and compare the integer sum directly.

**4. Mutating `errorCounts`**

The sliding window only reads from the input array — never writes to it. If you find yourself doing `errorCounts[i] = ...`, stop. Always create a new `rates` array.

### Computer Science foundations

**Time Complexity:** O(n) — same as Lesson A. The monitoring application doesn't change the algorithm's complexity. Whether you call the output "averages" or "error rates" is semantics; the computation is identical.

**Space Complexity:** O(n - k + 1) for the rates array. In a real streaming system, you'd process one window at a time and not store all rates in memory — but for a batch analysis, storing them is fine.

**Streaming vs batch:**

The sliding window in this lesson is a *batch* computation: we have all the data at once. In production monitoring systems, data arrives in a stream and you maintain only the current window's state (the window sum and the window's elements or count) — you don't re-scan the past. This is the same algorithm, but executed incrementally on live data rather than on a stored array.

**Rate limiting — a direct application:**

HTTP APIs often enforce rate limits as: "no more than N requests in any window of duration T seconds." The server maintains a queue of recent request timestamps, counts those within the window, and rejects the request if the count exceeds N. This is a variable-content sliding window (the elements are timestamps, not counts), but the core idea — "count things within a moving time range" — is identical to what you built today.

### Real-world applications

- **Datadog monitors**: Every monitor configured as "alert if avg(metric) > threshold over the last 5 minutes" runs a sliding window at query time
- **AWS CloudWatch alarms**: The "evaluation period" and "datapoints to alarm" settings define a sliding window over metric data
- **Kubernetes HPA**: The Horizontal Pod Autoscaler uses a sliding window of CPU usage to decide when to scale
- **Browser APIs**: `requestAnimationFrame` performance budgets are often expressed as "average frame time over the last N frames" — a real-time sliding window

### Before the exercise

In the exercise, you'll implement:

1. **`windowErrorRates(errorCounts, windowSize)`** — compute average errors per window
2. **`alertsTriggered(errorCounts, windowSize, threshold)`** — detect if any window exceeds a threshold
3. **`firstAlertWindow(errorCounts, windowSize, threshold)`** — return the index of the first window that exceeds the threshold, or `null` if none does

The third function introduces a twist: instead of scanning all windows, you want the first position where the condition is met — an early-exit pattern. Apply the same sliding window structure, but `return` as soon as you find the first alert.
