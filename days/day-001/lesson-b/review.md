## Day 001 — Lesson B Review: Daily Sales Snapshots

### What you should have learned

1. **Translating business questions into function signatures**: A vague request becomes a precise function name, input type, and output type before you write any code.
2. **Parameterizing thresholds**: Constants that represent business rules belong in function parameters, not hardcoded in the body.
3. **Guard against division by zero**: Any function that divides should check the divisor first.
4. **Return types should match caller expectations**: Return numbers from calculation functions, not formatted strings.
5. **Reusing patterns**: `calculateTotalRevenue` is `sumArray` with a business name — the algorithm is identical.

### Reviewing your implementation

#### Function 1: `calculateTotalRevenue(orders)`

```js
function calculateTotalRevenue(orders) {
  let total = 0;
  for (const amount of orders) {
    total += amount;
  }
  return total;
}

console.log(calculateTotalRevenue([19, 35, 12, 99, 5]));  // 170
console.log(calculateTotalRevenue([]));                    // 0
```

**Key insights:**
- This is `sumArray` renamed to reflect the business domain. The algorithm is identical — domain changes, code doesn't.
- Returns a number, not a formatted string. The caller decides how to display it: `calculateTotalRevenue(orders).toFixed(2)`.

**Edge cases handled:**
- Empty array → `0`: no orders, no revenue; zero is the correct and meaningful answer
- Orders with value `0` (free items, full discounts): correctly handled, contribute nothing to total

---

#### Function 2: `countLargeOrders(orders, threshold)`

```js
function countLargeOrders(orders, threshold) {
  let count = 0;
  for (const amount of orders) {
    if (amount > threshold) {
      count++;
    }
  }
  return count;
}

console.log(countLargeOrders([19, 35, 12, 99, 5], 50));  // 1 (only 99)
console.log(countLargeOrders([19, 35, 12, 99, 5], 100)); // 0
console.log(countLargeOrders([], 50));                   // 0
```

**Key insights:**
- `threshold` is a parameter — whoever calls this function decides what "large" means
- `>` (strictly greater than), not `>=`: an order of exactly $50 is not "large" by this rule
- Same scan-and-count pattern as `countOccurrences`, just with a comparison instead of equality check

**Edge cases handled:**
- Threshold larger than all orders → `0`: no orders qualify
- All orders equal to threshold → `0`: equality doesn't qualify as "large"

---

#### Function 3: `calculateAverageOrderValue(orders)`

```js
function calculateAverageOrderValue(orders) {
  if (orders.length === 0) return null;
  let total = 0;
  for (const amount of orders) {
    total += amount;
  }
  return total / orders.length;
}

console.log(calculateAverageOrderValue([19, 35, 12, 99, 5]));  // 34
console.log(calculateAverageOrderValue([]));                    // null
```

**Key insights:**
- Returns `null` for empty input — returning `0` would be misleading (zero dollars is not the average of zero orders, it's just nothing)
- Computes the total inline rather than calling `calculateTotalRevenue` — this avoids a second loop, keeping it O(n) with minimal overhead. For large datasets this matters; for small ones either is fine.

**Edge cases handled:**
- `orders.length === 0`: explicitly guarded before division
- Single order `[100]` → `100`: average of one thing is that thing

### Going deeper

#### Extension 1: Reusing helpers for DRY code

An alternative using composition:

```js
function calculateAverageOrderValue(orders) {
  if (orders.length === 0) return null;
  return calculateTotalRevenue(orders) / orders.length;
}
```

This is cleaner and reads like the business definition: "average = total revenue / order count." The downside is two passes through the array. For the small arrays typical in this scenario, that's irrelevant. Prefer clarity unless you've measured a performance problem.

#### Extension 2: Segmented metrics (orders above/below threshold)

Real dashboards often show both totals and segmented splits:

```js
function orderSummary(orders, largeThreshold) {
  if (orders.length === 0) return null;

  let total = 0;
  let largeCount = 0;

  for (const amount of orders) {
    total += amount;
    if (amount > largeThreshold) largeCount++;
  }

  return {
    total,
    count: orders.length,
    average: total / orders.length,
    largeOrderCount: largeCount,
    largeOrderRate: largeCount / orders.length,
  };
}
```

One pass, all metrics. This is the pattern a real analytics endpoint would use.

### Common mistakes and how to fix them

#### Mistake 1: Hardcoding the threshold

```js
// WRONG
function countLargeOrders(orders) {
  let count = 0;
  for (const amount of orders) {
    if (amount > 50) {   // hardcoded — business rule buried in code
      count++;
    }
  }
  return count;
}
```

**Problem:** When the business changes "large" from $50 to $100, you have to find and update every hardcoded value. If this logic appears in three places, you'll miss one.
**Fix:** `function countLargeOrders(orders, threshold)` — pass the rule in, don't bake it in.

---

#### Mistake 2: Returning `NaN` instead of a safe default

```js
// WRONG
function calculateAverageOrderValue(orders) {
  let total = 0;
  for (const amount of orders) total += amount;
  return total / orders.length;  // 0 / 0 = NaN when empty!
}

const avg = calculateAverageOrderValue([]);
console.log(avg > 50);  // false — but for wrong reasons, NaN comparisons are always false
console.log(avg + 10);  // NaN — silently propagates
```

**Problem:** `NaN` passes through arithmetic and comparisons silently, causing confusing bugs far from the source.
**Fix:** Check `orders.length === 0` and return `null` (or `0` if zero is the meaningful default for your use case).

---

#### Mistake 3: Returning a formatted string instead of a number

```js
// WRONG
function calculateTotalRevenue(orders) {
  let total = 0;
  for (const amount of orders) total += amount;
  return `$${total.toFixed(2)}`;   // string, not number!
}

const revenue = calculateTotalRevenue([19, 35]);
console.log(revenue + 10);   // "$54.0010" — string concatenation, not addition!
```

**Problem:** Returning a formatted string locks in the display format and breaks downstream arithmetic.
**Fix:** Return the raw number. Format at the point of display: `console.log('Total: $' + calculateTotalRevenue(orders).toFixed(2))`.

### Connection to interview problems

- **LeetCode 1672 — Richest Customer Wealth**: Sum rows of a 2D array, find the max — direct extension of `calculateTotalRevenue` + `minAndMax`
- **LeetCode 2652 — Sum Multiples**: Count and sum elements meeting a threshold condition — same as `countLargeOrders` with a different condition

The pattern of "compute metrics from a list of numbers" appears in virtually every analytics interview question.

### Discussion questions

1. **Why does `calculateAverageOrderValue` return `null` rather than `0` for an empty array?** Because `0` means "the average is zero dollars." `null` means "there is no average — the question doesn't apply." These are semantically different. A dashboard showing "Average order: $0" is misleading. One showing "No orders yet" is honest.

2. **`countLargeOrders` returns 0 for both an empty array and an array where no orders exceed the threshold. Is that a problem?** The return value is the same, but the meaning is different. If the caller needs to distinguish between these cases, you'd need to change the function signature (return an object with `count` and `hasOrders` fields, for example). For most use cases, just the count is sufficient.

3. **If you had to add "total revenue from large orders" to the summary, would you write a new function or modify `calculateTotalRevenue`?** Write a new function. Adding a parameter or condition to an existing function that does something different is confusing. `revenueFromLargeOrders(orders, threshold)` is clear; `calculateTotalRevenue(orders, threshold)` is ambiguous about whether the threshold filters what's summed.

### Further exploration

- Read about the **Single Responsibility Principle**: each function should have one reason to change. `calculateTotalRevenue` changes when the definition of "total" changes. `countLargeOrders` changes when the definition of "large" changes. They shouldn't be the same function.
- For production financial code: always use integer cents (`1999` for $19.99) instead of floats. `0.1 + 0.2 === 0.30000000000000004` in JavaScript. Financial bugs from floating-point arithmetic are subtle and costly.
