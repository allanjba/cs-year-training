## Day 010 — Lesson B (Applied): Cumulative Budget Tracking

### Why this matters

In Lesson A, you learned the prefix sum algorithm as an abstract concept. Now you'll apply it to a real-world problem that every business faces: **tracking spending over time**.

Imagine you're building a financial dashboard for a small team. The team lead has a monthly budget of $500 and wants to understand:
- "How much have we spent by day 15?"
- "On which day did we exceed our budget?"
- "What's our average daily spending up to today?"

These aren't just array algorithm exercises—they're the exact questions that financial software, expense trackers, and business analytics tools answer every day. Companies like Expensify, Brex, and even your bank's mobile app use these patterns to show cumulative spending, budget alerts, and spending trends.

This lesson connects the CS foundations from Lesson A to the kind of production code you'll write in a real job.

### The core concept

**Cumulative tracking** means converting individual events (transactions, visits, errors, etc.) into running totals that show "how much so far?" at any point in time.

For budget tracking specifically:
- **Input**: Daily spending amounts `[10, 5, 0, 20, 15]`
- **Output**: Cumulative totals `[10, 15, 15, 35, 50]`

This lets us:
1. Visualize spending as a line chart that always goes up (or stays flat)
2. Answer "what's the total spent by day N?" in O(1) time after preprocessing
3. Find when a threshold (like a budget limit) is crossed
4. Compute running averages to understand spending velocity

In production systems, this pattern appears in:
- **Financial dashboards**: Cumulative revenue, burn rate, spending by category
- **SaaS metrics**: Monthly Recurring Revenue (MRR) growth over time
- **E-commerce**: Order volume and revenue tracking
- **Infrastructure monitoring**: Cumulative error counts, API call quotas

### How it works

Let's trace through a concrete example: A team has a $30 budget and daily spending of `[10, 5, 0, 20, 15]`.

**Step 1: Build cumulative spending**

```
Day | Daily Spend | Cumulative Spend
----|-------------|------------------
 0  |     10      |       10
 1  |      5      |       15  (10 + 5)
 2  |      0      |       15  (15 + 0)
 3  |     20      |       35  (15 + 20)
 4  |     15      |       50  (35 + 15)
```

This is just the running total pattern from Lesson A applied to money instead of abstract numbers.

**Step 2: Find when budget is exceeded**

Our budget is $30. Let's check each cumulative total:
- Day 0: $10 ≤ $30 ✓
- Day 1: $15 ≤ $30 ✓
- Day 2: $15 ≤ $30 ✓
- Day 3: $35 > $30 ✗ **First day over budget!**

We stop at day 3 because that's when we first crossed the threshold.

**Step 3: Compute running averages**

```
Day | Cumulative | Days Elapsed | Average
----|-----------|--------------|----------
 0  |    10     |       1      |  10.00
 1  |    15     |       2      |   7.50
 2  |    15     |       3      |   5.00
 3  |    35     |       4      |   8.75
 4  |    50     |       5      |  10.00
```

This tells us: "If we keep spending at this rate, what's our average daily burn?"

### Code implementation

#### Implementation 1: Cumulative spending

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

// Example:
console.log(runningSpend([10, 5, 0, 20, 15]));
// Output: [10, 15, 15, 35, 50]
```

**This is identical to `runningTotal` from Lesson A.** The algorithm doesn't care whether it's money, visitors, or points—it's the same pattern. This is the power of abstraction: learn it once, apply it everywhere.

#### Implementation 2: Finding budget violations

```js
function firstDayOverBudget(dailySpend, budget) {
  let total = 0;

  for (let i = 0; i < dailySpend.length; i++) {
    total += dailySpend[i];

    if (total > budget) {
      return i;  // Return immediately when threshold crossed
    }
  }

  return null;  // Budget never exceeded
}

// Examples:
console.log(firstDayOverBudget([10, 5, 0, 20, 15], 30));  // 3
console.log(firstDayOverBudget([10, 5, 0, 20, 15], 100)); // null
```

**Key insight:** We don't need to build the full cumulative array if we only care about finding *when* a threshold is crossed. We can check on-the-fly as we accumulate.

**Breaking it down:**

- We maintain a running `total` as we scan
- After adding each day's spending, we check: "Did we just go over budget?"
- If yes, return the current index immediately (early exit)
- If we finish the loop without exceeding, return `null`

**Why this works:**

Once we find the first day that exceeds the budget, we don't need to check any more days. This is more efficient than building the full array and then searching it.

**Alternative approach (reusing `runningSpend`):**

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

This is clearer but less efficient (O(n) space to build the array, then O(n) time to search). If you only need to find the first violation, the direct approach is better.

#### Implementation 3: Running average spending

```js
function runningAverageSpend(dailySpend) {
  const averages = [];
  let total = 0;

  for (let i = 0; i < dailySpend.length; i++) {
    total += dailySpend[i];
    averages.push(total / (i + 1));  // Average = cumulative / number of days
  }

  return averages;
}

// Example:
console.log(runningAverageSpend([10, 5, 0, 20, 15]));
// Output: [10, 7.5, 5, 8.75, 10]
```

**This is identical to `runningAverage` from Lesson A.** Same pattern, different context.

### Common pitfalls

**1. Off-by-one in day counting**

In our examples, day indices are 0-based (day 0, day 1, day 2...), but humans think in 1-based days (day 1, day 2, day 3...). When displaying to users, you'll need to add 1:

```js
const dayIndex = firstDayOverBudget(dailySpend, 30);
if (dayIndex !== null) {
  console.log(`Budget exceeded on day ${dayIndex + 1}`);  // Display as "day 4"
}
```

**2. Confusing "strictly exceeds" vs "equals or exceeds"**

The requirements say "strictly exceeds" (>), not "equals or exceeds" (≥). Make sure you use the right comparison:

```js
if (total > budget) {  // Correct: strictly exceeds
  return i;
}

if (total >= budget) {  // Wrong: this would flag when exactly at budget
  return i;
}
```

This matters! If your budget is $30 and you spend exactly $30, you're *at* budget, not *over* it.

**3. Returning -1 vs null for "not found"**

Some developers return `-1` for "not found" (like `indexOf`), others return `null` or `undefined`. The exercise asks for `null`. Be consistent with the specification.

**4. Forgetting to handle empty arrays**

What if `dailySpend` is `[]`? Both `runningSpend([])` and `firstDayOverBudget([], 30)` should handle this gracefully:
- `runningSpend([])` returns `[]`
- `firstDayOverBudget([], 30)` returns `null` (no days means no violation)

Our implementations handle this correctly because the loops simply don't run.

### Computer Science foundations

**Time Complexity:**

- `runningSpend(dailySpend)`: O(n) where n = number of days
- `firstDayOverBudget(dailySpend, budget)`: O(n) worst case, but O(k) average case where k is the day the budget is exceeded (early exit optimization)
- `runningAverageSpend(dailySpend)`: O(n)

All are linear time—efficient even for large datasets (thousands of days).

**Space Complexity:**

- `runningSpend`: O(n) — creates a new array
- `firstDayOverBudget`: O(1) — only uses a `total` variable
- `runningAverageSpend`: O(n) — creates a new array

**Early exit optimization:**

In `firstDayOverBudget`, we return as soon as we find the answer. This is a common optimization: if you're searching for something, stop as soon as you find it. Don't waste work.

**Design trade-off:**

Should `firstDayOverBudget` build the full cumulative array first, or check on-the-fly?

*Build array first (composition):*
- Pro: Reuses existing code (`runningSpend`), easier to understand
- Pro: If you need the cumulative array anyway, you can use it for other purposes
- Con: Always O(n) space and time, even if violation is on day 1

*Check on-the-fly (direct):*
- Pro: Can exit early if violation found soon
- Pro: Only O(1) space
- Con: More code duplication (reimplements accumulation logic)

In this case, the direct approach is better because the function's purpose is to *find* a violation, not to *compute* all cumulative values. Early exit is a meaningful optimization.

### Real-world applications

**Financial software:**

This exact pattern powers:
- **Mint, Personal Capital**: "You've spent $X out of $Y this month" (cumulative tracking)
- **Expensify, Brex**: Budget alerts when teams exceed limits
- **Banking apps**: Spending trends, "You're spending $50/day on average this month"

**SaaS business metrics:**

- **Stripe, ChartMogul**: Cumulative revenue over time (MRR/ARR charts)
- **Datadog, New Relic**: Cumulative error counts, alert when threshold exceeded
- **AWS Cost Explorer**: Track cumulative cloud spending against budgets

**E-commerce:**

- **Shopify admin**: Daily order volume, cumulative revenue
- **Amazon seller dashboard**: Sales velocity, burn rate of inventory

**Key insight:** The same code structure handles all of these. The domain changes (money, errors, orders), but the algorithm stays the same.

### Before the exercise

In the exercise file, you'll implement three functions for budget tracking:

1. **`runningSpend(dailySpend)`**: Compute cumulative spending day by day
2. **`firstDayOverBudget(dailySpend, budget)`**: Find when spending exceeds a budget limit
3. **`runningAverageSpend(dailySpend)`**: Compute average daily spending up to each day

These functions mirror Lesson A's exercises, but now they're grounded in a concrete business scenario. As you write them, think about:

- **How would a user see this data?** (A line chart? A table? An alert notification?)
- **What questions does this answer?** (Is the team on track? When will we run out of money?)
- **What would you add next?** (Forecasting? Spending by category? Budget resets each month?)

This is applied computer science: using algorithms to solve real problems that businesses care about.

### Extension: Forecasting (optional challenge)

If you finish early, try this: Given current spending trends, predict when the budget will be exceeded.

```js
function predictBudgetExhaustion(dailySpend, budget, daysInMonth) {
  // Compute average daily spending so far
  const avg = runningAverageSpend(dailySpend);
  const currentAvg = avg[avg.length - 1];

  // Compute current cumulative spending
  const current = runningSpend(dailySpend);
  const currentTotal = current[current.length - 1];

  // How much budget remains?
  const remaining = budget - currentTotal;

  // How many more days at current rate before we exceed?
  const daysUntilExhausted = Math.floor(remaining / currentAvg);

  return dailySpend.length + daysUntilExhausted;
}

// Example: After 5 days, spending $10/day average, $50 spent, $100 budget
// Remaining: $50, at $10/day means ~5 more days → exhaust on day 10
```

This combines multiple running total concepts into predictive analytics—exactly what financial dashboards do.
