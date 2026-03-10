## Day 006 — Lesson B (Applied): Event Analytics

### Why this matters

Modern software tracks user behavior through **events**: every button click, page view, signup, purchase, or error generates an event record. Analyzing these events is the foundation of product analytics — understanding what users do, what's working, and what's broken.

The raw event stream looks like a list of strings:

```js
["page_view", "signup", "page_view", "click_button", "page_view", "purchase", "signup"]
```

From this, a product manager wants to know:
- "Which event happens most often?"
- "How many times did users hit the signup page?"
- "What's the breakdown of all event types?"

In Lesson A, you built frequency maps. Now you'll apply that pattern to event data and produce the kind of summaries that power analytics dashboards.

### The core concept

An event stream is just an array of strings — event names. A frequency map transforms it into something useful:

```
input:  ["page_view", "signup", "page_view", "click_button", "page_view"]
output: { page_view: 3, signup: 1, click_button: 1 }
```

Once you have the frequency map, you can answer any question in O(1):
- "How many page_views?" → `counts["page_view"]` → 3
- "Did anyone sign up?" → `counts["signup"] > 0` → true
- "What happened most?" → scan the map for the max value

This is the exact data structure behind dashboards showing "5,432 page views, 234 signups, 89 purchases today."

### How it works

**Building the event counts map from:**
```
["page_view", "signup", "page_view", "click_button", "page_view", "purchase", "signup"]
```

```
counts = {}

"page_view"    → counts = { page_view: 1 }
"signup"       → counts = { page_view: 1, signup: 1 }
"page_view"    → counts = { page_view: 2, signup: 1 }
"click_button" → counts = { page_view: 2, signup: 1, click_button: 1 }
"page_view"    → counts = { page_view: 3, signup: 1, click_button: 1 }
"purchase"     → counts = { page_view: 3, signup: 1, click_button: 1, purchase: 1 }
"signup"       → counts = { page_view: 3, signup: 2, click_button: 1, purchase: 1 }

result: { page_view: 3, signup: 2, click_button: 1, purchase: 1 }
```

**Finding the most common event** — scan the map:

```
current best: topEvent = null, topCount = 0

"page_view":    3 > 0? yes → topEvent = "page_view",    topCount = 3
"signup":       2 > 3? no
"click_button": 1 > 3? no
"purchase":     1 > 3? no

result: "page_view"
```

**Total events for selected types** (`["signup", "purchase"]`):

```
counts["signup"]   = 2
counts["purchase"] = 1
total = 2 + 1 = 3
```

### Code implementation

```js
function countEvents(events) {
  const counts = {};
  for (const event of events) {
    counts[event] = (counts[event] || 0) + 1;
  }
  return counts;
}

const stream = ["page_view", "signup", "page_view", "click_button", "page_view", "purchase", "signup"];
console.log(countEvents(stream));
// { page_view: 3, signup: 2, click_button: 1, purchase: 1 }
```

**Breaking it down:**
- Identical to `countValues` from Lesson A — event names are just strings, same as any other values
- The output object is our analytics summary: each key is an event type, each value is its count

```js
function mostCommonEvent(events) {
  const counts = countEvents(events);
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

console.log(mostCommonEvent(stream));  // "page_view"
console.log(mostCommonEvent([]));      // null
```

**Breaking it down:**
- Build the map first, then scan the map to find the winner
- `Object.keys(counts)` gives us the distinct event types to compare
- `topEvent = null` is the correct return for an empty event stream (there is no most common event)

```js
function totalForEventTypes(events, selectedTypes) {
  const counts = countEvents(events);
  let total = 0;

  for (const type of selectedTypes) {
    total += counts[type] || 0;  // use 0 if the event type never occurred
  }

  return total;
}

console.log(totalForEventTypes(stream, ["signup", "purchase"]));  // 3
console.log(totalForEventTypes(stream, ["error", "timeout"]));    // 0
```

**Breaking it down:**
- Build the map once, then query it for each selected type
- `counts[type] || 0` handles event types that don't appear in the data — they have no entry in the map, so we fall back to 0
- This is the "build-once, query-many" pattern from Lesson A applied directly

### Common pitfalls

**1. Not handling event types that never occurred**

```js
function totalBroken(events, selectedTypes) {
  const counts = countEvents(events);
  let total = 0;
  for (const type of selectedTypes) {
    total += counts[type];  // NaN if counts[type] is undefined!
  }
  return total;
}
```

If a selected event type never appeared in the stream, `counts[type]` is `undefined`, and `undefined + undefined = NaN`. Always use `|| 0` as a fallback.

**2. Returning 0 instead of null for empty stream in `mostCommonEvent`**

`mostCommonEvent([])` should return `null` — there is no most common event in an empty stream. Returning `0` or `""` would be misleading.

**3. Calling `countEvents` multiple times**

```js
function bad(events) {
  const top = mostCommonEvent(events);   // calls countEvents internally
  const total = totalForEventTypes(events, [top]);  // calls countEvents again!
}
```

If you need the frequency map for multiple operations, compute it once and pass it around. For these exercises, each function is standalone, so calling `countEvents` inside each is fine.

**4. Assuming `Object.keys` returns keys in insertion order**

Modern JavaScript engines do return keys in insertion order for string keys, but this is an implementation detail. If you need deterministic ordering, sort the keys explicitly. For analytics summaries, insertion order is usually fine.

### Computer Science foundations

**Time Complexity:**
- `countEvents(events)`: O(n) where n = number of events
- `mostCommonEvent(events)`: O(n) to build map + O(k) to scan it, where k = number of unique event types; total O(n)
- `totalForEventTypes(events, selectedTypes)`: O(n) to build map + O(t) to query, where t = number of selected types; total O(n + t)

**Space Complexity:** O(k) for the frequency map, where k = number of unique event types.

In real analytics systems, event streams can have millions of events per day, but the number of distinct event types (k) is usually small (dozens to hundreds). This means the frequency map stays manageable even when the input is enormous.

**Two-phase architecture:**
Notice the pattern: build the map (O(n)), then query the map (O(1) per query). This is a form of **preprocessing**: spend time upfront organizing data so future operations are fast. This pattern appears in databases (indexes), search engines (inverted indexes), and many data structures you'll learn about later.

### Real-world applications

- **Product analytics (Mixpanel, Amplitude, PostHog)**: "Which events are most common this week? How many users completed the signup flow?"
- **A/B testing platforms**: Count conversion events per experiment variant
- **Error monitoring (Sentry, Datadog)**: Which error types occur most frequently?
- **Marketing attribution**: Which channels drive the most signups or purchases?
- **Rate limiting**: Count API calls per user per minute, block those exceeding the limit

The specific data (events, errors, API calls) changes, but the frequency map pattern stays the same.

### Before the exercise

In the exercise file, you'll implement:

1. **`countEvents(events)`** — Return a frequency map of event names
2. **`mostCommonEvent(events)`** — Return the name of the most frequent event; return `null` for empty input
3. **`totalForEventTypes(events, selectedTypes)`** — Return the total count for a specified subset of event types

As you implement:
- Get `countEvents` right first — all other functions depend on it
- Handle missing event types with `|| 0` to avoid `NaN`
- Test `mostCommonEvent` with a tie (two events equally common — either answer is acceptable)
- Test `totalForEventTypes` with event types that don't appear in the data
