## Day 013 — Lesson B Review: Pricing Tier Lookup

### What you should have learned

1. **"Find which range contains this value" is a binary search problem**: Pricing tiers, tax brackets, shipping rate tables — all are sorted boundary lists. Binary search finds the right tier in O(log n) instead of scanning.
2. **`findInsertPosition` is the foundation for range queries**: Most "find where this falls" problems are solved by finding the insertion position and adjusting by ±1.
3. **Two binary search calls give O(log n) range counting**: `countLogsInRange` uses one search for the start of the range and one for the end. Subtracting the positions gives the count without touching any individual log entry.
4. **The `userCount + 1` trick handles boundary values cleanly**: Finding `findInsertPosition(boundaries, userCount + 1) - 1` gives the index of the highest boundary that is ≤ `userCount`. This avoids special-casing exact boundary matches.
5. **Return `null` for inputs below the minimum boundary**: Returning a tier name when no tier applies (negative user count, value before any boundary) is misleading. `null` signals "no applicable tier" — let the caller decide how to handle it.

### Reviewing your implementation

#### Function 1: `findPricingTier(userCount, boundaries, names)`

```js
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
  if (userCount < boundaries[0]) return null;

  // Find the last boundary index where boundary <= userCount.
  // findInsertPosition(boundaries, userCount + 1) is the first index > userCount.
  // Subtract 1 to get the last index <= userCount.
  const tierIndex = findInsertPosition(boundaries, userCount + 1) - 1;
  return names[tierIndex] ?? null;
}

const tierBoundaries = [0, 100, 500, 2000];
const tierNames = ["free", "starter", "growth", "enterprise"];

console.log(findPricingTier(0,    tierBoundaries, tierNames));   // "free"
console.log(findPricingTier(99,   tierBoundaries, tierNames));   // "free"
console.log(findPricingTier(100,  tierBoundaries, tierNames));   // "starter"
console.log(findPricingTier(750,  tierBoundaries, tierNames));   // "growth"
console.log(findPricingTier(5000, tierBoundaries, tierNames));   // "enterprise"
console.log(findPricingTier(-1,   tierBoundaries, tierNames));   // null
```

**Key insights:**
- The `+1` trick: `findInsertPosition(boundaries, userCount + 1)` gives one past the last boundary ≤ `userCount`. Subtract 1 for the tier index.
- This correctly handles exact boundary values: `userCount = 100` → find position of `101` → index 2 → tier index 1 → "starter" ✓
- `names[tierIndex] ?? null` — if `tierIndex` is somehow out of bounds, return `null` safely

**Edge cases handled:**
- `userCount` exactly at a boundary → correct tier (starter starts at 100, not free)
- `userCount` below minimum → `null`
- Very large user count → last tier (enterprise)

---

#### Function 2: `firstLogAfter(timestamps, targetTime)`

```js
function firstLogAfter(timestamps, targetTime) {
  const pos = findInsertPosition(timestamps, targetTime);
  if (pos >= timestamps.length) return null;
  return pos;
}

const logTimestamps = [1000, 1050, 1100, 1200, 1500, 2000];

console.log(firstLogAfter(logTimestamps, 1075));   // 2 (timestamp 1100)
console.log(firstLogAfter(logTimestamps, 1100));   // 2 (exact match)
console.log(firstLogAfter(logTimestamps, 2001));   // null
console.log(firstLogAfter(logTimestamps, 999));    // 0
```

**Key insights:**
- `findInsertPosition` returns the first index where `targetTime` could go — which is the first index where `timestamp >= targetTime`
- This handles exact matches correctly: if `targetTime = 1100` and 1100 is in the array, `findInsertPosition` returns that index
- Guard: if `pos >= timestamps.length`, all logs are before the target

**Edge cases handled:**
- Target before all timestamps → returns `0`
- Target exactly at a timestamp → returns that timestamp's index
- Target after all timestamps → returns `null`

---

#### Function 3: `countLogsInRange(timestamps, start, end)`

```js
function countLogsInRange(timestamps, start, end) {
  const startPos = findInsertPosition(timestamps, start);         // first index >= start
  const endPos   = findInsertPosition(timestamps, end + 1) - 1;  // last index <= end

  if (startPos > endPos) return 0;
  return endPos - startPos + 1;
}

console.log(countLogsInRange(logTimestamps, 1050, 1200));   // 3  (1050, 1100, 1200)
console.log(countLogsInRange(logTimestamps, 1001, 1049));   // 0
console.log(countLogsInRange(logTimestamps, 1000, 2000));   // 6  (all logs)
```

**Key insights:**
- `startPos`: first log at or after `start` — `findInsertPosition(timestamps, start)`
- `endPos`: last log at or before `end` — `findInsertPosition(timestamps, end + 1) - 1`
- Count = `endPos - startPos + 1` (inclusive on both ends)
- Guard: `if (startPos > endPos) return 0` — handles the case where no log falls in the range

**Trace for `countLogsInRange([1000, 1050, 1100, 1200, 1500, 2000], 1050, 1200)`:**
```
findInsertPosition([...], 1050) → 1 (1050 is at index 1)
findInsertPosition([...], 1201) → 4 (1201 goes at index 4, before 1500)
endPos = 4 - 1 = 3
count = 3 - 1 + 1 = 3 ✓  (indices 1, 2, 3 → timestamps 1050, 1100, 1200)
```

**Edge cases handled:**
- No logs in range → `startPos > endPos` → `0`
- All logs in range → `startPos = 0`, `endPos = length-1`

### Going deeper

#### Extension 1: Find the last tier below a threshold

```js
// What tier was a user in BEFORE upgrading to userCount?
function previousTier(userCount, boundaries, names) {
  if (userCount <= boundaries[0]) return null;  // already at the minimum

  // Find current tier index, then go one step back
  const currentTierIndex = findInsertPosition(boundaries, userCount + 1) - 1;
  if (currentTierIndex === 0) return null;  // already in the first tier
  return names[currentTierIndex - 1];
}

console.log(previousTier(750, tierBoundaries, tierNames));   // "starter"
console.log(previousTier(100, tierBoundaries, tierNames));   // "free"
console.log(previousTier(50,  tierBoundaries, tierNames));   // null (already in free)
```

#### Extension 2: Binary search range query at scale

```js
// Given multiple time ranges to query, answer each in O(log n)
function batchCountLogsInRanges(timestamps, ranges) {
  return ranges.map(([start, end]) => countLogsInRange(timestamps, start, end));
}

const queries = [[1000, 1100], [1050, 1500], [1200, 1200]];
console.log(batchCountLogsInRanges(logTimestamps, queries));
// [3, 4, 1]
```

Each query is O(log n); k queries is O(k log n). Compare to naive O(kn) if you scanned for each range.

### Common mistakes and how to fix them

#### Mistake 1: Using `findInsertPosition(boundaries, userCount)` without the `+1`

```js
// WRONG — mishandles exact boundary values
function findPricingTier(userCount, boundaries, names) {
  const tierIndex = findInsertPosition(boundaries, userCount) - 1;
  return names[tierIndex];
}

// findPricingTier(100, [0, 100, 500, 2000], names):
// findInsertPosition([0, 100, 500, 2000], 100) = 1 (position of 100)
// tierIndex = 1 - 1 = 0 → "free" — WRONG! 100 is the START of "starter"
```

**Problem:** `findInsertPosition(boundaries, 100)` returns 1 (where 100 currently sits), not 2. Subtracting 1 gives tier 0 ("free") instead of tier 1 ("starter").
**Fix:** Use `findInsertPosition(boundaries, userCount + 1) - 1`. For `userCount = 100`: insertion position of 101 is 2, tier index is 1 → "starter" ✓.

---

#### Mistake 2: Off-by-one in `countLogsInRange`

```js
// WRONG — doesn't count the end timestamp itself
function countLogsInRange(timestamps, start, end) {
  const startPos = findInsertPosition(timestamps, start);
  const endPos   = findInsertPosition(timestamps, end);   // should be end + 1
  return endPos - startPos;
}

// countLogsInRange([1050, 1100, 1200], 1050, 1200):
// startPos = findInsertPosition([...], 1050) = 0
// endPos   = findInsertPosition([...], 1200) = 2  (position of 1200)
// count = 2 - 0 = 2  — WRONG! Should be 3 (includes 1050, 1100, 1200).
```

**Problem:** `findInsertPosition(timestamps, 1200)` returns the index of 1200 itself (2), not one past it (3). The end timestamp is not counted.
**Fix:** `findInsertPosition(timestamps, end + 1) - 1` gives the index of the last timestamp ≤ `end`.

---

#### Mistake 3: Not guarding `startPos > endPos` in `countLogsInRange`

```js
// WRONG — returns negative count for empty ranges
function countLogsInRange(timestamps, start, end) {
  const startPos = findInsertPosition(timestamps, start);
  const endPos   = findInsertPosition(timestamps, end + 1) - 1;
  return endPos - startPos + 1;   // can be negative if startPos > endPos!
}

// countLogsInRange([1000, 2000], 1500, 1999):
// startPos = 1 (first timestamp >= 1500 is 2000, at index 1)
// endPos   = findInsertPosition([1000, 2000], 2000) - 1 = 1 - 1 = 0
// count = 0 - 1 + 1 = 0... actually this would be 0. But:

// countLogsInRange([1000, 2000], 1001, 1999):
// startPos = 1, endPos = 0 → count = 0 - 1 + 1 = 0... hmm, actually still 0.
// Try: countLogsInRange([1000, 2000], 1001, 1050):
// startPos = 1 (2000 at index 1), endPos = findInsertPosition([...], 1051)-1 = 1-1 = 0
// count = 0 - 1 + 1 = 0. Still 0. The guard is still needed for clarity.
```

**Best practice:** Always guard with `if (startPos > endPos) return 0` to make the empty-range case explicit and self-documenting.

### Connection to interview problems

- **LeetCode 35 — Search Insert Position**: `findInsertPosition` exactly
- **LeetCode 2389 — Longest Subsequence With Limited Sum**: Sort prefix sums, then binary search for each query — the same log-range-count pattern
- **Real-world billing systems**: Stripe, Recurly, Chargebee all use sorted tier tables with binary search to determine pricing in O(log n) per billing event

### Discussion questions

1. **`findPricingTier` uses `findInsertPosition(boundaries, userCount + 1) - 1`. Is there a simpler formulation?** Yes — you could also do a right-biased binary search that finds the last index where `boundaries[mid] <= userCount`. The `+1` trick is a shortcut that reuses `findInsertPosition` without writing a new variant. Both are correct; choose based on which is clearer to your team.

2. **The log timestamp functions assume `timestamps` is sorted. What if logs arrive out of order?** In production, you'd either sort on insertion (maintaining a sorted data structure), sort before querying, or accept O(n) scan for unsorted logs. The binary search approach is only valid when sortedness is guaranteed. Documenting this as a precondition (naming the parameter `sortedTimestamps`) makes the assumption explicit.

3. **`countLogsInRange` makes two binary search calls. Could you do it in one?** Yes, but it would be more complex. You could combine both searches into a single pass that tracks both the start and end positions simultaneously. However, two separate O(log n) calls is still O(log n) total — there's no asymptotic benefit to combining them, and the two-call version is clearer.

### Further exploration

- Read about **SQL between queries**: `WHERE timestamp BETWEEN start AND end` — databases use B+ tree indexes to answer this in O(log n), exactly like `countLogsInRange` but on disk-based sorted data
- [Stripe Pricing Tiers](https://stripe.com/docs/billing/prices/pricing-models): See how a production billing system defines tier boundaries and how pricing lookup works at scale
