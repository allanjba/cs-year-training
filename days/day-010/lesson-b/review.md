## Day 010 — Lesson B Review: Cumulative Budget Tracking

### What you should have learned

By completing this lesson, you should be able to:

1. **Apply prefix sums to real problems**: Take the abstract algorithm from Lesson A and use it in a concrete business scenario
2. **Recognize the pattern in different contexts**: Understand that "budget tracking," "visitor counting," and "score accumulation" all use the same underlying technique
3. **Optimize for the question asked**: Know when to build the full array vs. when to compute on-the-fly
4. **Think about user-facing features**: Connect your code to how it would appear in a real product
5. **Handle domain-specific edge cases**: Like distinguishing "strictly exceeds" from "equals or exceeds"

The key insight is that **algorithms are tools, not exercises**. The same pattern solves many different problems.

### Reviewing your implementation

#### Function 1: `runningSpend(dailySpend)`

**Reference implementation:**

```js
function runningSpend(dailySpend) {
  const cumulative = [];
  let total = 0;

  for (const amount of dailySpend) {
    total += amount;
    cumulative.push(total);
  }

  return cumulative;
}

// Tests:
console.log(runningSpend([10, 5, 0, 20, 15]));
// Output: [10, 15, 15, 35, 50]

console.log(runningSpend([]));
// Output: []

console.log(runningSpend([100]));
// Output: [100]
```

**Key insights:**

- This is **identical** to `runningTotal` from Lesson A
- The algorithm doesn't care about the domain (money, points, visitors, etc.)
- This demonstrates **code reuse through abstraction**: same logic, different context

**What this enables:**

In a real financial dashboard, this array would power:
- A cumulative spending line chart
- Quick lookups: "How much spent by day X?" → `cumulative[X]`
- Comparisons: "Did we spend more in week 1 or week 2?" → compare ranges

**Time complexity**: O(n)
**Space complexity**: O(n)

#### Function 2: `firstDayOverBudget(dailySpend, budget)`

**Reference implementation (efficient version):**

```js
function firstDayOverBudget(dailySpend, budget) {
  let total = 0;

  for (let i = 0; i < dailySpend.length; i++) {
    total += dailySpend[i];

    if (total > budget) {
      return i;  // Found it! Return immediately
    }
  }

  return null;  // Never exceeded
}

// Tests:
console.log(firstDayOverBudget([10, 5, 0, 20, 15], 30));
// Output: 3 (day 3: cumulative = 35 > 30)

console.log(firstDayOverBudget([10, 5, 0, 20, 15], 100));
// Output: null (never exceeds)

console.log(firstDayOverBudget([10, 5, 0, 20, 15], 15));
// Output: 3 (15 is at budget, but 35 exceeds)

console.log(firstDayOverBudget([], 50));
// Output: null (no days = no violation)
```

**Key insights:**

- **Early exit optimization**: We stop as soon as we find the answer, no need to check remaining days
- **On-the-fly checking**: We don't build the full cumulative array if we don't need it
- **Space efficiency**: Only O(1) extra space (just the `total` variable)

**Critical detail: "strictly exceeds" (>)**

The requirement says *strictly exceeds*, meaning we only flag when spending is *greater than* budget, not equal to it.

```js
Budget: $30
Day 3 cumulative: $30  → Not flagged (at budget, not over)
Day 4 cumulative: $31  → Flagged! (over budget)
```

If the requirement had said "meets or exceeds," we'd use `>=` instead.

**Alternative implementation (using `runningSpend`):**

```js
function firstDayOverBudget(dailySpend, budget) {
  const cumulative = runningSpend(dailySpend);

  for (let i = 0; i < cumulative.length; i++) {
    if (cumulative[i] > budget) {
      return i;
    }
  }

  return null;
}
```

**Trade-off:**
- Pro: Clearer (reuses existing function)
- Pro: If you need `cumulative` for other purposes, you have it
- Con: Always builds the full array (O(n) space, no early exit)

**Which to choose?**
- If the function's *only* job is finding the violation → use the efficient version
- If you're doing multiple things with the cumulative data → build it once and reuse

**Time complexity**: O(n) worst case, O(k) average where k is the violation day
**Space complexity**: O(1)

#### Function 3: `runningAverageSpend(dailySpend)`

**Reference implementation:**

```js
function runningAverageSpend(dailySpend) {
  const averages = [];
  let total = 0;

  for (let i = 0; i < dailySpend.length; i++) {
    total += dailySpend[i];
    averages.push(total / (i + 1));
  }

  return averages;
}

// Tests:
console.log(runningAverageSpend([10, 5, 0, 20, 15]));
// Output: [10, 7.5, 5, 8.75, 10]

console.log(runningAverageSpend([100, 200]));
// Output: [100, 150]

console.log(runningAverageSpend([]));
// Output: []
```

**Key insights:**

- **Reuses the running total pattern**, just divides by count at each step
- **No redundant work**: We don't recompute the sum from scratch each time
- **Efficiency**: One pass through the data, O(n) time

**Why `i + 1`?**

Arrays are 0-indexed, but we're counting *how many elements* we've seen:
- At index 0, we've seen **1** element → divide by 1
- At index 1, we've seen **2** elements → divide by 2
- At index i, we've seen **i + 1** elements → divide by (i + 1)

**What this tells you:**

Running averages show **spending velocity**: "If we keep spending at this rate, what's our average daily burn?"

- Increasing average → spending is accelerating
- Decreasing average → spending is slowing down
- Stable average → consistent spending pattern

This helps answer: "Are we on track to stay within budget for the rest of the month?"

**Time complexity**: O(n)
**Space complexity**: O(n)

### Going deeper

#### Extension 1: Visualizing cumulative data

If you were building a dashboard, how would you display this data?

**Line chart (most common):**

```
Spending Over Time
   $
50 |                              ●
40 |
30 |              - - - - - - - - - - - (budget line)
20 |                    ●
10 | ●
   |___●___●_________________________
      D1  D2  D3  D4  D5
```

- X-axis: Days
- Y-axis: Cumulative spending
- Horizontal line at budget threshold
- Visual indicator when line crosses budget (color change, alert icon)

**Table view:**

| Day | Daily | Cumulative | Average | Status |
|-----|-------|------------|---------|---------|
| 1   | $10   | $10        | $10.00  | ✓       |
| 2   | $5    | $15        | $7.50   | ✓       |
| 3   | $0    | $15        | $5.00   | ✓       |
| 4   | $20   | $35        | $8.75   | ⚠️ Over |
| 5   | $15   | $50        | $10.00  | ⚠️ Over |

**Alert notification:**

```
⚠️ Budget Alert
You exceeded your $30 budget on Day 4.
Current spending: $50 ($20 over budget)
Average daily spend: $10.00
```

#### Extension 2: Multiple budget categories

In a real system, you'd track spending by category:

```js
const dailySpend = [
  { engineering: 50, marketing: 20, operations: 10 },
  { engineering: 60, marketing: 15, operations: 10 },
  { engineering: 55, marketing: 25, operations: 12 },
];

function runningSpendByCategory(dailySpend) {
  const categories = Object.keys(dailySpend[0]);
  const cumulative = {};

  for (const category of categories) {
    cumulative[category] = [];
    let total = 0;

    for (const day of dailySpend) {
      total += day[category];
      cumulative[category].push(total);
    }
  }

  return cumulative;
}

// Output:
// {
//   engineering: [50, 110, 165],
//   marketing: [20, 35, 60],
//   operations: [10, 20, 32]
// }
```

This lets you answer: "Which category is burning through its budget fastest?"

#### Extension 3: Forecasting budget exhaustion

Given current trends, when will we run out of money?

```js
function predictBudgetExhaustion(dailySpend, budget) {
  const cumulative = runningSpend(dailySpend);
  const averages = runningAverageSpend(dailySpend);

  const currentSpend = cumulative[cumulative.length - 1];
  const currentAverage = averages[averages.length - 1];

  if (currentSpend >= budget) {
    return "Already over budget";
  }

  const remaining = budget - currentSpend;
  const daysLeft = Math.floor(remaining / currentAverage);
  const exhaustionDay = dailySpend.length + daysLeft;

  return `Budget will be exhausted around day ${exhaustionDay}`;
}

console.log(predictBudgetExhaustion([10, 5, 0, 20, 15], 100));
// "Budget will be exhausted around day 10"
// Logic: Spent $50 in 5 days ($10/day average)
//        Remaining: $50 / $10/day = 5 more days → day 10
```

This is predictive analytics using the same cumulative patterns!

### Common mistakes and how to fix them

#### Mistake 1: Using `>=` instead of `>` for budget check

```js
// WRONG: Flags when exactly at budget
function firstDayOverBudget(dailySpend, budget) {
  let total = 0;
  for (let i = 0; i < dailySpend.length; i++) {
    total += dailySpend[i];
    if (total >= budget) {  // BUG: Should be >
      return i;
    }
  }
  return null;
}

// Test case that reveals the bug:
console.log(firstDayOverBudget([15, 15], 30));
// Output: 1 (WRONG! We're exactly at budget, not over)
// Expected: null
```

**Fix:** Use `>` for "strictly exceeds."

#### Mistake 2: Displaying 0-based day indices to users

```js
const dayIndex = firstDayOverBudget(dailySpend, 30);
console.log(`Budget exceeded on day ${dayIndex}`);
// Output: "Budget exceeded on day 3"
// But users expect: "Budget exceeded on day 4" (1-indexed)
```

**Fix:** Add 1 when displaying to humans:

```js
if (dayIndex !== null) {
  console.log(`Budget exceeded on day ${dayIndex + 1}`);
}
```

#### Mistake 3: Not handling the "never exceeded" case

```js
const dayIndex = firstDayOverBudget(dailySpend, 100);
console.log(`Budget exceeded on day ${dayIndex + 1}`);
// Output: "Budget exceeded on day null1" — Oops!
```

**Fix:** Check for `null` before using the value:

```js
if (dayIndex !== null) {
  console.log(`Budget exceeded on day ${dayIndex + 1}`);
} else {
  console.log("Budget was never exceeded!");
}
```

#### Mistake 4: Building the full array when you don't need it

```js
// INEFFICIENT: Builds full array just to find one value
function firstDayOverBudget(dailySpend, budget) {
  const cumulative = runningSpend(dailySpend);  // O(n) space
  for (let i = 0; i < cumulative.length; i++) {
    if (cumulative[i] > budget) {
      return i;
    }
  }
  return null;
}
```

**Problem:** If violation happens on day 1 out of 365 days, we still computed all 365 cumulative sums.

**Fix:** Compute on-the-fly with early exit (O(1) space, stops at day 1).

### Connection to interview problems

The budget tracking pattern appears in many interview questions:

- **"Meeting Rooms II"** (LeetCode 253): Track overlapping meetings, find when rooms are exhausted
- **"Maximum Population Year"** (similar to cumulative tracking of birth/death events)
- **"Gas Station"** (LeetCode 134): Track cumulative gas vs. cost to find valid starting point
- **"Maximum Subarray"** (LeetCode 53): Uses cumulative sum ideas (Kadane's algorithm)

When you see problems about:
- "When does X exceed threshold?"
- "Track something over time"
- "Find when a running total reaches a value"

Think: **Prefix sums / cumulative tracking**.

### Discussion questions

1. **How similar are these helpers to Lesson A's functions?**
   - `runningSpend` = `runningTotal` (identical algorithm, different domain)
   - `runningAverageSpend` = `runningAverage` (same pattern)
   - `firstDayOverBudget` = new logic, but builds on prefix sum concept

   **Takeaway:** Master the pattern once, apply it everywhere.

2. **If you visualized `runningSpend` on a chart, what patterns would you look for?**
   - **Slope**: Steep = high spending, flat = low spending
   - **Budget crossing**: When line crosses horizontal budget threshold
   - **Inflection points**: Days where spending suddenly changes (day 3 → day 4 jump)
   - **Comparison**: Multiple categories on same chart to see which grows fastest

3. **How would you extend this to multiple budget categories?**
   - Store daily spending as objects: `{ eng: 50, marketing: 20 }`
   - Run `runningSpend` on each category separately
   - Track separate budgets per category
   - Alert when *any* category exceeds its budget

4. **What if spending could be negative (refunds)?**
   - Algorithm still works! Cumulative total can decrease
   - Budget checking logic stays the same
   - Visualization shows downward slopes on refund days

5. **How would you test `firstDayOverBudget` thoroughly?**
   - Budget never exceeded: `firstDayOverBudget([10, 5], 100)` → `null`
   - Exceeded on first day: `firstDayOverBudget([50], 30)` → `0`
   - Exceeded on last day: `firstDayOverBudget([10, 10, 11], 30)` → `2`
   - Exactly at budget (not over): `firstDayOverBudget([15, 15], 30)` → `null`
   - Empty array: `firstDayOverBudget([], 30)` → `null`

### Real-world connection

**This exact code structure powers:**

1. **Expensify**: Real-time budget alerts when teams exceed spending limits
2. **AWS Cost Explorer**: Track cumulative cloud spending, predict monthly bills
3. **Stripe Dashboard**: Cumulative revenue charts, MRR growth tracking
4. **Datadog/New Relic**: Cumulative error counts, alert when thresholds exceeded
5. **Banking apps**: "You've spent $X out of $Y this month" progress bars

**Key production considerations:**

- **Time zones**: Daily spending depends on when you define "day" (UTC? User's local time?)
- **Currency precision**: Use integers (cents) instead of floats to avoid rounding errors
- **Scale**: For years of data, don't compute on-demand; cache cumulative values in DB
- **Real-time updates**: When new spending occurs, update cumulative totals incrementally instead of recomputing from scratch

### Further exploration

**Next steps in this learning path:**

- **Day 15+**: You'll learn about hash maps, which enable faster lookups for specific days
- **Month 2**: You'll add testing frameworks to automatically verify these functions
- **Month 3**: You'll learn TypeScript, adding type safety to prevent passing wrong data types
- **Month 6**: You'll build a Node.js API that serves this data to a frontend
- **Month 10**: You'll store this data in PostgreSQL with proper schema design and indexing

Everything builds on these foundational patterns. Master them now, and future concepts will click into place.
