## Day 013 — Lesson B (Applied): Pricing Tier Lookup

### Why this matters

In Lesson A you built binary search as an algorithm for finding exact values. Now apply it to a problem that appears in every SaaS product: **pricing tier lookup**.

A SaaS product might have tiers: Starter (0-100 users), Growth (101-1000 users), Business (1001-10000 users), Enterprise (10001+ users). Given a company's user count, which tier applies? This is not an exact match — it's a "find where this value fits" problem, which maps directly to `findInsertPosition` from Lesson A.

Similarly, warehouse stock lookup, pay-grade determination, shipping rate calculation, tax bracket lookup, and discount threshold checks are all "find which range contains this value" problems on a sorted list of boundaries.

These lookups happen at scale: a billing system might look up the pricing tier for millions of API calls per day. Linear scan (O(n)) over a list of 5 tiers is barely measurable — but the same code pattern, applied to a list of 10,000 postal codes for geographic pricing, would be noticeably slow. Knowing to use binary search rather than a loop is what separates maintainable code from code that needs a rewrite at scale.

### The core concept

A **tier boundary list** is a sorted list of threshold values. To find which tier a value falls into, find the rightmost boundary that is less than or equal to the value — the tier that "covers" it.

```
tier boundaries: [0, 100, 500, 2000]
tier names:      ["free", "starter", "growth", "enterprise"]

user_count = 750

Where does 750 fall?
  boundaries: [0, 100, 500, 2000]
  750 >= 0   → covers free tier
  750 >= 100  → covers starter tier
  750 >= 500  → covers growth tier
  750 < 2000  → stops here
  → Tier: "growth"
```

This is `findInsertPosition(boundaries, 750) - 1`: find where 750 would be inserted, then look one position to the left.

The second scenario: **log timestamp lookup**. Server logs have timestamps. Given a target timestamp, find the first log entry at or after that time — binary search for the insertion position of the timestamp.

### How it works

**Function 1: `findPricingTier(userCount, tierBoundaries, tierNames)`**

1. Use `findInsertPosition` to find where `userCount` would be inserted in `tierBoundaries`
2. Subtract 1 to get the tier whose boundary `userCount` meets or exceeds
3. Look up the tier name at that index

```
userCount = 750
tierBoundaries = [0, 100, 500, 2000]

findInsertPosition([0, 100, 500, 2000], 750):
  low=0, high=4
  mid=2 → boundaries[2]=500 < 750 → low=3
  low=3, high=4
  mid=3 → boundaries[3]=2000 >= 750 → high=3
  low=3, high=3 → stop. Return 3.

Position 3 means 750 would go before 2000.
Tier index = 3 - 1 = 2 → tierNames[2] = "growth" ✓
```

**Function 2: `firstLogAfter(timestamps, targetTime)`**

Given a sorted array of timestamps and a target time, return the index of the first timestamp that is >= the target. Return `null` if all timestamps are before the target.

This is exactly `findInsertPosition(timestamps, targetTime)` — the insertion position is the first index where the value would fit, which is the first timestamp >= target.

### Code implementation

```js
const tierBoundaries = [0, 100, 500, 2000];
const tierNames = ["free", "starter", "growth", "enterprise"];

function findInsertPosition(sortedArray, value) {
  let low = 0;
  let high = sortedArray.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArray[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

function findPricingTier(userCount, boundaries, names) {
  if (userCount < boundaries[0]) return null;   // below the minimum boundary

  const pos = findInsertPosition(boundaries, userCount);

  // If userCount exactly equals a boundary, pos points to that boundary.
  // If userCount is between boundaries, pos points to the next boundary.
  // Either way, the tier it belongs to is at pos - 1 (if exact) or pos - 1 (if between).
  // Exception: if userCount equals boundaries[pos], the tier is at pos.
  // Simpler: the tier index is findInsertPosition for (userCount + 1) - 1.

  // A cleaner formulation: find the last boundary <= userCount.
  const tierIndex = findInsertPosition(boundaries, userCount + 1) - 1;
  return names[tierIndex] ?? null;
}

console.log(findPricingTier(0,    tierBoundaries, tierNames));   // "free"
console.log(findPricingTier(50,   tierBoundaries, tierNames));   // "free"
console.log(findPricingTier(100,  tierBoundaries, tierNames));   // "starter"
console.log(findPricingTier(750,  tierBoundaries, tierNames));   // "growth"
console.log(findPricingTier(5000, tierBoundaries, tierNames));   // "enterprise"
```

**Why `findInsertPosition(boundaries, userCount + 1) - 1`:**

We want the last boundary position that is <= `userCount`. `findInsertPosition(boundaries, userCount + 1)` finds the first position where `userCount + 1` would go — which is one past all boundaries <= `userCount`. Subtract 1 to get the last boundary <= `userCount`.

Now the log timestamp lookup:

```js
const logTimestamps = [1000, 1050, 1100, 1200, 1500, 2000];

function firstLogAfter(timestamps, targetTime) {
  const pos = findInsertPosition(timestamps, targetTime);
  if (pos >= timestamps.length) return null;   // all timestamps are before target
  return pos;
}

console.log(firstLogAfter(logTimestamps, 1075));   // 2 (timestamp 1100)
console.log(firstLogAfter(logTimestamps, 1100));   // 2 (timestamp 1100, exact match)
console.log(firstLogAfter(logTimestamps, 2001));   // null (after all logs)
console.log(firstLogAfter(logTimestamps, 999));    // 0 (before all logs)
```

### Common pitfalls

**1. Off-by-one in tier lookup**

The "which tier does this value belong to?" question requires finding the last boundary that is <= the value. Using `findInsertPosition(boundaries, value)` directly (without the `+1` trick or subtracting 1) can misplace values that land exactly on a boundary.

Trace `findPricingTier(100, [0, 100, 500, 2000], ...)`:
- `findInsertPosition([0, 100, 500, 2000], 100)` returns 1 (position of 100)
- Tier index = 1 → "starter" ✓ (100 is the start of the starter tier)

Trace `findPricingTier(100, ...)` with the `+1` approach:
- `findInsertPosition([0, 100, 500, 2000], 101)` returns 2
- Tier index = 2 - 1 = 1 → "starter" ✓

Both work here. The `+1` trick is cleaner for "inclusive lower boundary" semantics: a user with exactly 100 users is in the "starter" tier (not "free").

**2. Forgetting to guard when the value is below all boundaries**

`findInsertPosition(boundaries, 0)` on `boundaries = [0, 100, 500]` returns 0 when the value equals the minimum. If `userCount` is negative or below the minimum, you'd get tier index `-1`, which is invalid. Guard: `if (userCount < boundaries[0]) return null;`.

**3. Returning `pos` instead of `pos - 1`**

The insertion position is one past the tier it belongs to. `pos` points to where the *next* boundary would go; `pos - 1` points to the tier the value actually belongs to.

### Computer Science foundations

**Time Complexity:** O(log n) — same as binary search. Tier lookups and log searches on lists of any length complete in O(log n).

**Space Complexity:** O(1) — no extra memory beyond the variables in `findInsertPosition`.

**Binary search on the answer (advanced preview):**

The "find minimum k satisfying a condition" pattern uses binary search on the *answer range* rather than on a data array. For example: "find the minimum number of batches to process all n orders, given a batch size limit." Binary search over possible batch counts, checking feasibility at each midpoint. O(log n) evaluations instead of trying every possible batch count linearly.

**Step function lookup:**

The pricing tier lookup is a **step function evaluation**: a function that is constant on intervals and jumps at boundary values. Binary search on boundary arrays is the standard O(log n) technique for evaluating step functions. Tax brackets, shipping rate tables, and pay grade scales are all step functions.

### Real-world applications

- **SaaS billing**: Determining pricing tier from user count or API call volume
- **Tax calculation**: Finding which tax bracket a salary falls into (sorted bracket table + binary search)
- **Shipping rates**: Finding the rate for a given package weight from a sorted rate table
- **Feature flags**: Rolling out a feature to a percentage of users by finding where a user's ID falls in a sorted range
- **Game difficulty**: Finding which difficulty tier a player's skill rating falls into

### Before the exercise

In the exercise, you'll implement:

1. **`findPricingTier(userCount, tierBoundaries, tierNames)`** — return the tier name for the given user count
2. **`firstLogAfter(timestamps, targetTime)`** — return the index of the first log entry at or after the target time
3. **`countLogsInRange(timestamps, start, end)`** — count how many log entries fall in the time range `[start, end]` (inclusive)

The third function uses two binary-search calls: one to find the start of the range and one to find the end, then subtracts the positions to get the count — O(log n) instead of O(n).
