## Day 003 — Lesson B (Applied): Error Log Scanning

### Why this matters

Every backend service writes logs — lines of text recording what happened during execution. When something goes wrong, logs are your first tool for diagnosis. But reviewing thousands of log lines manually is impractical. That's why teams build automated log scanners: tools that quickly answer questions like "did anything go wrong?" and "is the system healthy right now?"

In Lesson A, you built `contains`, `every`, and `some`. Now you'll apply them to log data. You'll write functions that classify individual log lines, then answer questions about a whole set of logs. This is the exact kind of automation that runs in production monitoring systems.

### The core concept

A log line is just a string. Whether it represents a healthy event or an error depends on its content. The classification is a function: given a log line, return `true` if it's an error, `false` if it's healthy.

```
"[INFO] Server started on port 3000"     → healthy
"[ERROR] Database connection failed"      → error
"[WARN] Slow query: 2500ms"              → healthy (warning, but not an error)
"[ERROR] Unhandled exception in handler" → error
```

Once you have a reliable `isError` function for individual lines, you can answer questions about a whole batch of logs using the patterns from Lesson A:

- "Are there any errors?" → `some(logs, isError)`
- "Is everything healthy?" → `every(logs, line => !isError(line))`

This is the power of composing small, focused functions.

### How it works

Let's define what makes a log line an "error":
- Contains `"[ERROR]"` in the standard log format
- Contains `"exception"` (case-insensitive) — unhandled exceptions are errors regardless of level
- Contains `"fatal"` — fatal messages indicate critical failures

**Classifying a batch of logs:**

```
logs = [
  "[INFO] Server started",
  "[ERROR] Database failed",
  "[INFO] Request received",
  "[ERROR] Timeout on payment API",
]

isError line by line:
  "[INFO] Server started"      → false
  "[ERROR] Database failed"    → true  ← found one!
  ...
```

**Does the batch have any errors?** — Stop at the first error: `true`

**Are all logs healthy?** — Stop at the first error: `false`

### Code implementation

```js
function isError(logLine) {
  const lower = logLine.toLowerCase();
  if (lower.includes("[error]")) return true;
  if (lower.includes("exception")) return true;
  if (lower.includes("fatal")) return true;
  return false;
}

console.log(isError("[ERROR] Database failed"));          // true
console.log(isError("[INFO] User logged in"));            // false
console.log(isError("Unhandled exception in handler"));   // true
console.log(isError("[FATAL] Out of memory"));            // true
```

**Breaking it down:**
- Normalize to lowercase once: `const lower = logLine.toLowerCase()`
- Check each rule with early return — as soon as any rule matches, we know it's an error
- Return `false` only after all rules have been checked and none matched

```js
function hasAnyErrors(logs) {
  for (const line of logs) {
    if (isError(line)) {
      return true;  // early exit on first error
    }
  }
  return false;
}

console.log(hasAnyErrors(["[INFO] ok", "[ERROR] bad", "[INFO] ok"]));  // true
console.log(hasAnyErrors(["[INFO] ok", "[INFO] ok"]));                 // false
console.log(hasAnyErrors([]));                                          // false
```

**Breaking it down:**
- Reuses `isError` — the classification logic lives in one place
- Early exit: if logs[0] is already an error, we return `true` without looking at any other line

```js
function allHealthy(logs) {
  for (const line of logs) {
    if (isError(line)) {
      return false;  // early exit: found an unhealthy line
    }
  }
  return true;
}

console.log(allHealthy(["[INFO] ok", "[INFO] ok"]));                  // true
console.log(allHealthy(["[INFO] ok", "[ERROR] bad", "[INFO] ok"]));   // false
console.log(allHealthy([]));                                           // true (vacuous)
```

**Notice:** `allHealthy` and `hasAnyErrors` are logically related:
- `allHealthy(logs)` is equivalent to `!hasAnyErrors(logs)`
- This means you could implement one in terms of the other

But keeping them separate with explicit loops is clearer and more direct. Don't over-abstract.

### Common pitfalls

**1. Checking the wrong string (not normalizing case)**

```js
// Wrong: misses "[Error]", "[error]", "ERROR"
function isErrorBroken(line) {
  return line.includes("[ERROR]");  // case sensitive!
}
```

Real log files use inconsistent casing. Normalize to lowercase before checking.

**2. Conflating warnings with errors**

A `[WARN]` line is not an error. Be precise about your classification rules. If "warn" accidentally triggers your error check, you'll get false positives that erode trust in your monitoring.

**3. Treating empty log arrays as unhealthy**

```
allHealthy([])  should return true
hasAnyErrors([]) should return false
```

An empty log is vacuously healthy — there are no errors because there are no lines at all. This matches the same vacuous truth logic from `every([])`.

**4. Not reusing `isError`**

```js
// Wrong: duplicates logic from isError
function hasAnyErrorsBad(logs) {
  for (const line of logs) {
    const lower = line.toLowerCase();
    if (lower.includes("[error]") || lower.includes("exception")) {
      return true;
    }
  }
  return false;
}
```

If you add a new error pattern to `isError`, you'd also have to update `hasAnyErrors`. Single source of truth: define classification logic once, call it from everywhere else.

### Computer Science foundations

**Time Complexity:**
- `isError(line)`: O(m) where m is the length of the log line; we do a constant number of `.includes()` checks
- `hasAnyErrors(logs)`: O(n × m) worst case, where n = number of log lines and m = average line length; best case O(m) if the first line is an error
- `allHealthy(logs)`: O(n × m) worst case; best case O(m) if the first line is an error

**Space Complexity:** O(m) for the lowercase copy of the current line. O(1) additional space.

**Why early exit matters in production:**
A production system might have logs with millions of lines. If the first line is an error, `hasAnyErrors` returns after one check instead of processing a million. In log monitoring, where you want to know "did anything go wrong?" as fast as possible, early exit makes a real difference.

**Separation of concerns:**
Notice that `isError` handles *how to classify a single line*, while `hasAnyErrors` and `allHealthy` handle *how to apply that classification across a list*. This separation makes it easy to change the classification rules without touching the iteration logic, and vice versa.

### Real-world applications

- **Log aggregators (Datadog, Splunk, CloudWatch)**: Scan logs for error patterns and trigger alerts
- **CI/CD pipelines**: Check build output for error messages before marking a build as passing
- **Health check endpoints**: Report system health as "OK" or "degraded" based on internal checks
- **Database monitoring**: Alert on slow queries, failed connections, deadlocks
- **Security monitoring (SIEM tools)**: Detect suspicious patterns in access logs

The core logic you're writing today runs, at larger scale and with more sophisticated rules, inside the monitoring and observability tools that every production engineering team uses.

### Before the exercise

In the exercise file, you'll implement:

1. **`isError(logLine)`** — Return `true` if the log line indicates an error condition
2. **`hasAnyErrors(logs)`** — Return `true` if at least one line in the array is an error; use early exit
3. **`allHealthy(logs)`** — Return `true` if no lines are errors; use early exit

As you implement:
- Define your error rules clearly in `isError` first — get that right before building on top of it
- Test `isError` thoroughly with edge cases (empty string, line with no log level, all caps)
- Make sure `hasAnyErrors` and `allHealthy` call `isError` — don't duplicate the classification logic
- Verify the empty array behavior for both batch functions
