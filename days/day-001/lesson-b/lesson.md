## Day 001 — Lesson B (Applied): Daily Sales Snapshots

### Why this matters

In Lesson A, you learned the mechanics of scanning an array: sum its elements, count occurrences, find min and max. These patterns look abstract on their own. Now you'll apply them to a real-world problem that every business with an online store cares about: understanding yesterday's sales.

Imagine you're the only developer at a small online shop. The founder walks up and says: "I exported our payment data for yesterday. Can you tell me our total revenue, how many orders were large, and what our average order was?" They hand you a JavaScript array of numbers — order totals in dollars.

This is exactly the kind of task you'll face in a real job: translate a fuzzy business question into a concrete function, with clear inputs and outputs.

### The core concept

Business problems often arrive as vague requests. Your job as a developer is to turn them into precise specifications:

| Vague request | Concrete function |
|---|---|
| "What was our total revenue?" | `calculateTotalRevenue(orders)` → number |
| "How many orders were big?" | `countLargeOrders(orders, threshold)` → number |
| "What's the average order?" | `averageOrderValue(orders)` → number |

Each of these is just an array scanning problem in disguise. You already know how to scan an array — now you're applying those skills to real data with real names.

### How it works

Suppose the shop's orders for yesterday were: `[12.50, 84.00, 5.99, 250.00, 34.00, 84.00]`

**Total revenue:**
```
12.50 + 84.00 + 5.99 + 250.00 + 34.00 + 84.00 = 470.49
```
This is just `sumArray` with a business-meaningful name.

**Count large orders (threshold: $50):**
```
12.50 → no  (< 50)
84.00 → yes (> 50)
5.99  → no
250.00 → yes
34.00 → no
84.00 → yes

Count: 3
```
Walk the array, increment a counter each time an order exceeds the threshold.

**Average order value:**
```
total revenue / number of orders
470.49 / 6 = 78.415
```
Compute the total, then divide by the count. But watch out for zero orders — dividing by zero gives `Infinity` in JavaScript.

### Code implementation

```js
function calculateTotalRevenue(orders) {
  let total = 0;
  for (const amount of orders) {
    total += amount;
  }
  return total;
}

console.log(calculateTotalRevenue([12.50, 84.00, 5.99]));  // 102.49
console.log(calculateTotalRevenue([]));                     // 0
```

**Breaking it down:**
- Same structure as `sumArray` — this is intentional. The algorithm doesn't change just because the data represents money instead of abstract numbers.
- The function is named after the business concept it computes, not after the technical operation. `calculateTotalRevenue` tells you *why* you're summing. `sumArray` only tells you *what*.

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

console.log(countLargeOrders([12.50, 84.00, 5.99, 250.00], 50));  // 2
console.log(countLargeOrders([], 50));                              // 0
```

**Breaking it down:**
- `threshold` is a parameter, not a hardcoded number. This makes the function reusable — the definition of "large" can change without touching the function's logic.
- We use `>` (strictly greater than), not `>=`. An order of exactly $50 is not "large" by this rule. Always be precise about boundary conditions.

```js
function averageOrderValue(orders) {
  if (orders.length === 0) return null;
  let total = 0;
  for (const amount of orders) {
    total += amount;
  }
  return total / orders.length;
}

console.log(averageOrderValue([12.50, 84.00, 5.99, 250.00, 34.00, 84.00]));  // 78.415
console.log(averageOrderValue([]));                                             // null
```

**Why return `null` for empty?**
An empty orders list has no meaningful average. Returning `0` would be misleading — zero dollars isn't the average of zero orders, it's just nothing. Returning `null` tells the caller "this question has no answer" so they can handle that case explicitly in their UI or report.

### Common pitfalls

**1. Hardcoding thresholds**

```js
// Fragile: what if "large" changes to $100?
function countLargeOrders(orders) {
  let count = 0;
  for (const amount of orders) {
    if (amount > 50) {  // hardcoded!
      count++;
    }
  }
  return count;
}
```

Make thresholds parameters. The business will change its definitions — your code shouldn't need to change everywhere when it does.

**2. Division by zero**

```js
function averageBroken(orders) {
  let total = 0;
  for (const amount of orders) total += amount;
  return total / orders.length;  // 0 / 0 = NaN if orders is empty!
}
```

In JavaScript, `0 / 0` is `NaN`, and `5 / 0` is `Infinity`. Both silently propagate through your code. Always check for zero before dividing.

**3. Treating missing data as zero**

If an order has no amount, should it count as $0? Probably not. Real data often has missing fields, and blindly treating them as zero can corrupt your totals. For now, assume inputs are valid — but in real systems, you'd validate first.

**4. Mixing computation with formatting**

```js
// Hard to test; bakes in display concerns
function showRevenue(orders) {
  let total = 0;
  for (const amount of orders) total += amount;
  console.log(`Total: $${total.toFixed(2)}`);  // mixed!
}
```

Keep your calculation functions clean — they should return values, not print them. Let the caller decide how to display the result. You can always call `console.log(calculateTotalRevenue(orders).toFixed(2))` at the call site.

### Computer Science foundations

**Time Complexity:** O(n) for all three functions.
- Each function visits every order exactly once.
- The time grows linearly with the number of orders.

**Space Complexity:** O(1) for all three functions.
- We use a fixed number of variables (`total`, `count`) regardless of how many orders there are.
- No new arrays are created.

**Why O(1) space matters:**
If you process 10,000 orders, your functions use the same amount of memory as when processing 10 orders. That's important for real applications where order lists can be large.

### Real-world applications

These exact patterns power:
- **Shopify analytics**: Total revenue, order count, average order value dashboards
- **Stripe**: Revenue reports, payout calculations
- **Amazon Seller Central**: Daily sales summaries, high-value order tracking
- **Internal tools**: Any team that exports payment data and needs quick metrics

The functions look simple, but they're the building blocks of real analytics pipelines. A Shopify dashboard showing "$47,832 revenue today from 312 orders, average $153" is computing exactly what you'll implement here — just at larger scale with more fields.

### Before the exercise

In the exercise file, you'll implement:

1. **`calculateTotalRevenue(orders)`** — Sum all order amounts; return 0 for an empty array
2. **`countLargeOrders(orders, threshold)`** — Count orders strictly above the threshold
3. **`averageOrderValue(orders)`** — Return the average; return `null` if there are no orders

As you implement each function, think about:
- What are the realistic edge cases? (No orders, one order, all orders the same amount)
- How would this output appear in a real dashboard? (Revenue displayed as currency, count as a whole number)
- Could you reuse `calculateTotalRevenue` inside `averageOrderValue`, or is that unnecessarily complex for this case?

This is applied computer science: the same algorithms from Lesson A, wearing business clothes.
