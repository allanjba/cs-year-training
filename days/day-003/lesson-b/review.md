## Day 003 — Lesson B Review: Error Log Scanning

### What you should have learned

1. **Classifying individual items before processing collections**: `isErrorLog` answers one question cleanly; `hasAnyErrors` and `allLogsHealthy` apply it to a collection.
2. **Composition over duplication**: `hasAnyErrors` calls `isErrorLog` — it never reimplements error detection.
3. **Early exit in collection searches**: `hasAnyErrors` stops at the first error. `allLogsHealthy` stops at the first error. Neither needs to scan the whole array when the answer is found early.
4. **Vacuous truth for empty collections**: An empty log array is vacuously healthy — no evidence of errors.
5. **Logical relationship between the two batch functions**: `allLogsHealthy(logs)` is equivalent to `!hasAnyErrors(logs)`.

### Reviewing your implementation

#### Function 1: `isErrorLog(line)`

```js
function isErrorLog(line) {
  if (line == null) return false;
  const lower = line.toLowerCase();
  if (lower.includes("error")) return true;
  if (lower.includes("failed")) return true;
  return false;
}

console.log(isErrorLog("ERROR Failed to connect to database"));  // true
console.log(isErrorLog("INFO User logged in"));                  // false
console.log(isErrorLog("WARN Disk space at 80%"));               // false
console.log(isErrorLog(null));                                    // false
```

**Key insights:**
- Normalize once: `const lower = line.toLowerCase()`
- Each rule is one `if ... return true` — clean, easy to extend
- Guards against `null`/`undefined` before calling string methods

**Edge cases handled:**
- `null`/`undefined` input → `false`
- Mixed-case errors ("Error", "FAILED") → caught by normalization
- Warning lines ("WARN") → correctly not flagged as errors

---

#### Function 2: `hasAnyErrors(logLines)`

```js
function hasAnyErrors(logLines) {
  for (const line of logLines) {
    if (isErrorLog(line)) {
      return true;   // early exit on first error
    }
  }
  return false;
}

const sampleLogs = [
  "INFO User logged in",
  "WARN Disk space at 80%",
  "ERROR Failed to connect to database",
  "INFO Request completed",
];

console.log(hasAnyErrors(sampleLogs));   // true
console.log(hasAnyErrors(["INFO ok"]));  // false
console.log(hasAnyErrors([]));           // false
```

**Key insights:**
- This is `anyMatch` with `isErrorLog` as the predicate — same pattern, specific domain name
- Early exit: stops at "ERROR Failed to connect to database" without checking the last line
- Empty array → `false`: no logs, no errors

---

#### Function 3: `allLogsHealthy(logLines)`

```js
function allLogsHealthy(logLines) {
  for (const line of logLines) {
    if (isErrorLog(line)) {
      return false;   // early exit on first error
    }
  }
  return true;
}

console.log(allLogsHealthy(["INFO ok", "INFO ok"]));                   // true
console.log(allLogsHealthy(["INFO ok", "ERROR bad", "INFO ok"]));      // false
console.log(allLogsHealthy([]));                                        // true (vacuous)
```

**Key insights:**
- This is the `every` pattern with `!isErrorLog` as the condition — returns `false` on the first violator
- `allLogsHealthy` and `hasAnyErrors` are logical inverses: `allLogsHealthy(logs) === !hasAnyErrors(logs)`
- Empty array → `true`: vacuous truth — no evidence of unhealthiness

### Going deeper

#### Extension 1: Collect error lines instead of just checking existence

```js
function getErrorLines(logLines) {
  const errors = [];
  for (const line of logLines) {
    if (isErrorLog(line)) {
      errors.push(line);
    }
  }
  return errors;
}

console.log(getErrorLines(sampleLogs));
// ["ERROR Failed to connect to database"]
```

This is the filter pattern applied to log lines. No early exit — must scan all lines to collect all errors.

#### Extension 2: Severity levels

```js
function getLogLevel(line) {
  if (line == null) return "unknown";
  const lower = line.toLowerCase();
  if (lower.includes("[error]") || lower.includes("failed") || lower.includes("exception")) return "error";
  if (lower.includes("[warn]") || lower.includes("slow")) return "warn";
  if (lower.includes("[info]")) return "info";
  return "unknown";
}

function countByLevel(logLines) {
  const counts = {};
  for (const line of logLines) {
    const level = getLogLevel(line);
    counts[level] = (counts[level] || 0) + 1;
  }
  return counts;
}

console.log(countByLevel(sampleLogs));
// { info: 2, warn: 1, error: 1 }
```

This combines classification with the frequency map pattern from Day 6.

### Common mistakes and how to fix them

#### Mistake 1: Duplicating `isErrorLog` logic in `hasAnyErrors`

```js
// WRONG — classification duplicated
function hasAnyErrorsBroken(logLines) {
  for (const line of logLines) {
    const lower = (line || "").toLowerCase();
    if (lower.includes("error") || lower.includes("failed")) {
      return true;
    }
  }
  return false;
}
```

**Problem:** The urgency/error rules now live in two places. Add a new rule to `isErrorLog` and `hasAnyErrors` stays out of date.
**Fix:** `if (isErrorLog(line)) return true;` — delegate to the single source of truth.

---

#### Mistake 2: `allLogsHealthy` returning the wrong default

```js
// WRONG
function allLogsHealthy(logLines) {
  for (const line of logLines) {
    if (isErrorLog(line)) return false;
  }
  return false;   // BUG: should return true
}

console.log(allLogsHealthy(["INFO ok"]));   // false — should be true!
```

**Problem:** When no errors are found, the function should return `true`. Returning `false` makes the function always return `false` for healthy systems.
**Fix:** `return true` after the loop — "scanned everything, found no problems."

---

#### Mistake 3: Not handling null log entries

```js
// Brittle
function hasAnyErrorsBroken(logLines) {
  for (const line of logLines) {
    if (line.toLowerCase().includes("error")) return true;  // TypeError if line is null
  }
  return false;
}
```

**Problem:** Real log arrays can have `null` entries (malformed records, partially processed data).
**Fix:** Either guard in `hasAnyErrors` (`if (line == null) continue;`) or, better, let `isErrorLog` handle null — which it does with `if (line == null) return false;`.

### Connection to interview problems

- **LeetCode 2678 — Number of Senior Citizens**: Classify items, count matches — same as `hasAnyErrors` / counting error lines
- **Health check endpoints (real-world)**: A `/health` API endpoint that returns `{ status: "ok" }` or `{ status: "degraded" }` is essentially `allLogsHealthy` applied to internal service checks
- **CI/CD pipelines**: Check build output for error patterns before marking a build as passing — `hasAnyErrors` over build log lines

### Discussion questions

1. **`allLogsHealthy(logs)` is equivalent to `!hasAnyErrors(logs)`. Should you implement one using the other?** You could: `function allLogsHealthy(logs) { return !hasAnyErrors(logs); }`. This is correct and DRY. The tradeoff is a small overhead: `hasAnyErrors` builds its own loop context. For the tiny scale here, it doesn't matter — pick whichever is clearer.

2. **`isErrorLog("download failed")` — is this a false positive?** "failed" matches even though "download failed" might be an expected, handled error (not a critical system failure). In production, you'd need more context: log level, service, error code. Simple keyword matching is a starting point, not a final answer. This is why real log aggregators use structured logs (JSON with explicit `level: "error"` fields) rather than free-text scanning.

3. **For a 10-million-line log file, would the approach change?** You'd stream the file line by line instead of loading it all into an array — but the per-line logic (`isErrorLog`) stays identical. The algorithm is the same; only the I/O layer changes.

### Further exploration

- Structured logging formats: [JSON logging](https://www.loggly.com/ultimate-guide/choosing-json-over-text-for-logging/) — how production systems avoid the ambiguity of free-text log scanning
- Log aggregation tools: Datadog, Splunk, and CloudWatch all implement the same "classify → filter → alert" pipeline you built today, but at billions of events per day
