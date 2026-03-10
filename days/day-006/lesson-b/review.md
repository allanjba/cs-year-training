## Day 006 — Lesson B Review: Event Analytics

### What you should have learned

1. **Frequency map applied to event streams**: An event name is just a string — `eventFrequency` is `valueFrequency` applied to analytics data.
2. **Build once, answer many queries**: Compute `eventFrequency` once and use it for `mostCommonEvent`, `countSelectedEvents`, and any future queries.
3. **`|| 0` fallback for missing event types**: An event type that never occurred has no key in the map — use `counts[type] || 0` to safely default to zero.
4. **Two-phase architecture**: Build the data structure (phase 1), query it (phase 2). Each phase has a clear, single responsibility.
5. **Empty stream returns `null` for "most common"**: There is no most common event in an empty stream. `null` signals "no answer" cleanly.

### Reviewing your implementation

#### Function 1: `eventFrequency(events)`

```js
function eventFrequency(events) {
  const counts = {};
  for (const event of events) {
    counts[event] = (counts[event] || 0) + 1;
  }
  return counts;
}

const events = ["page_view", "signup", "page_view", "click_button", "page_view"];

console.log(eventFrequency(events));
// { page_view: 3, signup: 1, click_button: 1 }

console.log(eventFrequency([]));
// {}
```

**Key insights:**
- Structurally identical to `valueFrequency` from Lesson A — same algorithm, analytics domain
- The frequency map is the foundation: all other functions in this lesson build on it
- Handles any string as an event name — no special casing needed

**Edge cases handled:**
- Empty array → `{}`
- Single event type that appears many times → `{ eventName: n }`

---

#### Function 2: `mostCommonEvent(events)`

```js
function mostCommonEvent(events) {
  if (events.length === 0) return null;

  const counts = eventFrequency(events);
  let topEvent = null;
  let topCount = 0;

  for (const eventType of Object.keys(counts)) {
    if (counts[eventType] > topCount) {
      topCount = counts[eventType];
      topEvent = eventType;
    }
  }

  return topEvent;
}

console.log(mostCommonEvent(events));   // "page_view"
console.log(mostCommonEvent([]));       // null
```

**Key insights:**
- Build the map, then scan the map — two O(n) passes, but the second pass is over unique event types (often much smaller)
- `null` for empty input: no most-common event exists when there are no events
- In case of ties, returns whichever event type `Object.keys` encounters first (insertion order)

**Edge cases handled:**
- Empty input → `null`
- Single event type → that event type
- Tie → first encountered wins (acceptable per spec)

---

#### Function 3: `countSelectedEvents(events, selectedNames)`

```js
function countSelectedEvents(events, selectedNames) {
  const counts = eventFrequency(events);
  let total = 0;

  for (const name of selectedNames) {
    total += counts[name] || 0;
  }

  return total;
}

console.log(countSelectedEvents(events, ["page_view", "signup"]));   // 4
console.log(countSelectedEvents(events, ["error", "timeout"]));      // 0
```

**Key insights:**
- Build the map once, query for each selected name in O(1) per query
- `counts[name] || 0` — if an event type never appeared, treat its count as zero
- Works correctly even when `selectedNames` contains types not present in the event stream

**Edge cases handled:**
- Selected names that never occurred → contribute 0 to total
- Empty `selectedNames` → `0`
- Empty event stream → `0` (all counts are 0 via `|| 0`)

### Going deeper

#### Extension 1: Percentage breakdown of event types

```js
function eventBreakdown(events) {
  if (events.length === 0) return {};

  const counts = eventFrequency(events);
  const total = events.length;
  const breakdown = {};

  for (const type of Object.keys(counts)) {
    breakdown[type] = {
      count: counts[type],
      percentage: ((counts[type] / total) * 100).toFixed(1) + "%",
    };
  }

  return breakdown;
}

console.log(eventBreakdown(events));
// {
//   page_view:    { count: 3, percentage: "60.0%" },
//   signup:       { count: 1, percentage: "20.0%" },
//   click_button: { count: 1, percentage: "20.0%" },
// }
```

This is the breakdown shown in analytics dashboards: "60% of events were page views."

#### Extension 2: Event frequency over time (windowed analysis)

```js
// Events with timestamps
const timedEvents = [
  { name: "page_view", hour: 1 },
  { name: "signup",    hour: 1 },
  { name: "page_view", hour: 2 },
  { name: "page_view", hour: 2 },
  { name: "signup",    hour: 2 },
];

function eventsByHour(events) {
  const byHour = {};
  for (const event of events) {
    if (!byHour[event.hour]) byHour[event.hour] = {};
    const hourMap = byHour[event.hour];
    hourMap[event.name] = (hourMap[event.name] || 0) + 1;
  }
  return byHour;
}

console.log(eventsByHour(timedEvents));
// {
//   1: { page_view: 1, signup: 1 },
//   2: { page_view: 2, signup: 1 },
// }
```

Nested frequency maps — the same pattern applied at two levels (time period + event type). This is how time-series breakdowns work in real analytics systems.

### Common mistakes and how to fix them

#### Mistake 1: Not using `|| 0` in `countSelectedEvents`

```js
// WRONG
function countSelectedEvents(events, selectedNames) {
  const counts = eventFrequency(events);
  let total = 0;
  for (const name of selectedNames) {
    total += counts[name];   // NaN if event type never occurred!
  }
  return total;
}

console.log(countSelectedEvents(events, ["error"]));   // NaN — silent failure
```

**Problem:** `counts["error"]` is `undefined`. `0 + undefined = NaN`.
**Fix:** `total += counts[name] || 0;`

---

#### Mistake 2: Rebuilding the frequency map inside each function

```js
// INEFFICIENT — builds eventFrequency twice
function mostCommonAndCount(events) {
  const top = mostCommonEvent(events);          // builds map once
  const count = countSelectedEvents(events, [top]);  // builds map again!
  return { event: top, count };
}
```

**Problem:** `eventFrequency` is called twice on the same data, doing redundant O(n) work.
**Fix:** Build the map once and pass it to both functions, or restructure so the map is built once at a higher level.

---

#### Mistake 3: Returning `0` instead of `null` for empty stream in `mostCommonEvent`

```js
// WRONG
function mostCommonEvent(events) {
  const counts = eventFrequency(events);
  // ... finds winner
  return topEvent;  // returns null from topValue = null
}
// Actually this is fine — but consider:
mostCommonEvent([])  // returns null — correct
mostCommonEvent(["page_view"])  // returns "page_view" — correct
```

The concern is not returning `0`, but rather *not guarding the empty case at all* and potentially returning `null` from an uninitialized `topValue` when `events.length === 0`. The guard `if (events.length === 0) return null;` makes the intent explicit and prevents subtle bugs if the implementation changes.

### Connection to interview problems

- **LeetCode 347 — Top K Frequent Elements**: Build frequency map, find top K — `eventFrequency` + `topN` pattern
- **LeetCode 451 — Sort Characters By Frequency**: Sort by descending frequency — `eventFrequency` + sort
- **LeetCode 692 — Top K Frequent Words**: Frequency map + sort by count then alphabetically
- Real-world analytics: Mixpanel, Amplitude, and PostHog all build frequency aggregations over event streams at scale — same logic, different infrastructure

### Discussion questions

1. **`eventFrequency` in JavaScript coerces number keys to strings. Would this affect event analytics?** No — event names are always strings in this domain. The coercion only matters when keys are numbers (like user IDs). For event analytics, you'll never accidentally coerce a string like `"page_view"` to something else.

2. **`mostCommonEvent` builds the full frequency map even to find one winner. Could you do it in one pass without building the full map?** Yes — track the running leader:

```js
function mostCommonEventOnePass(events) {
  if (events.length === 0) return null;
  const counts = {};
  let topEvent = null;
  let topCount = 0;
  for (const event of events) {
    counts[event] = (counts[event] || 0) + 1;
    if (counts[event] > topCount) {
      topCount = counts[event];
      topEvent = event;
    }
  }
  return topEvent;
}
```

One pass, same result. But this only works for finding the single winner. For `topN`, you still need the full map and a sort.

3. **How would you handle events with different capitalizations (`"Page_View"` vs `"page_view"`)?** Normalize before counting: `counts[event.toLowerCase()] = ...`. Add the normalization to `eventFrequency` and everything downstream benefits automatically.

### Further exploration

- Read about **funnel analysis**: how analytics tools track sequences of events (e.g., "viewed page → clicked button → signed up") — builds on frequency counting with ordering added
- JavaScript's `Map` class (vs plain objects): handles non-string keys correctly, preserves insertion order reliably — a better choice for production frequency maps
