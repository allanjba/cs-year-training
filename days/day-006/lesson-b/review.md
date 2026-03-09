## Day 006 — Lesson B (Applied) review notes

### Core checks

- `eventFrequency`:
  - Builds the correct counts for each distinct event name.
  - Handles an empty list gracefully.
- `mostCommonEvent`:
  - Returns the expected event for the sample data.
  - Returns `null` when there are no events.
- `countSelectedEvents`:
  - Correctly sums counts for all selected event names.

### Discussion prompts

- How did you reuse ideas or code from Lesson A’s frequency helpers?
- If the product team wanted to break events down by **day** or **user**,
  how might you extend your data structures?
- How could you test these helpers over larger, more varied inputs?

### Real-world tie-in

- This style of counting is the backbone of many analytics systems:
  - dashboards,
  - funnels,
  - simple anomaly detectors.
- Getting comfortable with frequency-based thinking now will pay off when we
  later talk about hashing, maps, and more formal DS&A topics.\*\*\*
