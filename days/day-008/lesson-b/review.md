## Day 008 — Lesson B Review: Daily Account Summary

### What you should have learned

1. **Composition as the default**: `buildDailySummary` should call `totalCredits` and `totalDebits` rather than reimplementing their logic — the value of helpers is that you *use* them.
2. **Named helper functions clarify intent**: `totalCredits(transactions)` says what it does in its name. A loop with `tx.type === "credit"` inside `buildDailySummary` hides intent inside implementation.
3. **Object literals as return values**: Returning `{ totalCredits, totalDebits, netBalance }` packages related values together — the caller gets one result, not three separate function calls.
4. **Net balance is a derived value**: `netBalance = totalCredits - totalDebits` is not stored in the data; it is computed from other fields. Derived values belong in functions, not raw state.
5. **Empty array behavior must be specified**: `totalCredits([])` returning `0` (not `undefined`, not `NaN`) makes `buildDailySummary([])` return `{ totalCredits: 0, totalDebits: 0, netBalance: 0 }` — consistent and correct.

### Reviewing your implementation

#### Function 1: `totalCredits(transactions)`

```js
function totalCredits(transactions) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") {
      total += tx.amount;
    }
  }
  return total;
}

const dailyTransactions = [
  { id: 1, type: "credit", amount: 100 },
  { id: 2, type: "debit",  amount: 40  },
  { id: 3, type: "credit", amount: 10  },
];

console.log(totalCredits(dailyTransactions));   // 110
console.log(totalCredits([]));                  // 0
```

**Key insights:**
- Equivalent to `totalByType(transactions, "credit")` from Lesson A — the pattern is identical; the function name is more specific
- `total = 0` initialization ensures empty input returns 0, not undefined
- Only `tx.type === "credit"` transactions contribute — debit amounts are silently skipped

**Edge cases handled:**
- No credit transactions → `0`
- Empty array → `0`
- All credits → sum of all amounts

---

#### Function 2: `totalDebits(transactions)`

```js
function totalDebits(transactions) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === "debit") {
      total += tx.amount;
    }
  }
  return total;
}

console.log(totalDebits(dailyTransactions));   // 40
console.log(totalDebits([]));                  // 0
```

**Key insights:**
- Structurally identical to `totalCredits` — only the type string changes
- Both return positive numbers: debit amounts are stored as positive values in the data, and the subtraction happens in `buildDailySummary`

**Edge cases handled:**
- No debit transactions → `0`
- Empty array → `0`

---

#### Function 3: `buildDailySummary(transactions)`

```js
function buildDailySummary(transactions) {
  const credits = totalCredits(transactions);
  const debits  = totalDebits(transactions);
  return {
    totalCredits: credits,
    totalDebits:  debits,
    netBalance:   credits - debits,
  };
}

console.log(buildDailySummary(dailyTransactions));
// { totalCredits: 110, totalDebits: 40, netBalance: 70 }

console.log(buildDailySummary([]));
// { totalCredits: 0, totalDebits: 0, netBalance: 0 }
```

**Key insights:**
- Calls `totalCredits` and `totalDebits` once each, stores results in `credits` and `debits`, uses them for both the object fields and the `netBalance` computation — no repeated work
- The object literal `{ totalCredits, totalDebits, netBalance }` groups related values — the caller does not need to call three separate functions
- `netBalance` is computed from the helpers, not independently from the raw data — a single source of truth

**Edge cases handled:**
- Empty array → all fields are `0`, `netBalance` is `0`
- All credits → `totalDebits: 0`, positive `netBalance`
- All debits → `totalCredits: 0`, negative `netBalance`

### Going deeper

#### Extension 1: Enrich the summary with counts

```js
function buildDailySummary(transactions) {
  const credits  = totalCredits(transactions);
  const debits   = totalDebits(transactions);
  const creditCount = transactions.filter(tx => tx.type === "credit").length;
  const debitCount  = transactions.filter(tx => tx.type === "debit").length;

  return {
    totalCredits:  credits,
    totalDebits:   debits,
    netBalance:    credits - debits,
    creditCount,
    debitCount,
    transactionCount: transactions.length,
  };
}
```

Adding counts makes the summary more useful: "110 in from 2 transactions, 40 out from 1." This is the shape of a real bank statement summary line.

#### Extension 2: Weekly rollup from daily summaries

```js
// Given an array of daily transaction arrays:
function buildWeeklySummary(weeks) {
  const dailies = weeks.map(day => buildDailySummary(day));

  return {
    totalCredits: dailies.reduce((sum, d) => sum + d.totalCredits, 0),
    totalDebits:  dailies.reduce((sum, d) => sum + d.totalDebits,  0),
    netBalance:   dailies.reduce((sum, d) => sum + d.netBalance,   0),
    days: dailies,
  };
}
```

`buildDailySummary` composes into `buildWeeklySummary` without modification — this is what "reusable helper" means in practice. Each level of the hierarchy delegates to the level below.

### Common mistakes and how to fix them

#### Mistake 1: Reimplementing credit/debit logic inside `buildDailySummary`

```js
// WRONG — ignores the helpers that were just written
function buildDailySummary(transactions) {
  let credits = 0;
  let debits  = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") credits += tx.amount;
    if (tx.type === "debit")  debits  += tx.amount;
  }
  return { totalCredits: credits, totalDebits: debits, netBalance: credits - debits };
}
```

**Problem:** `totalCredits` and `totalDebits` were written specifically to avoid this inline duplication. When you inline the logic, a future change to how credits are calculated (e.g., excluding a fee type) requires updating multiple places.
**Fix:** Call the helpers: `const credits = totalCredits(transactions);`

---

#### Mistake 2: Returning `NaN` for an empty list

```js
// WRONG — net balance divides when there should be no division
function buildDailySummary(transactions) {
  const credits = totalCredits(transactions);
  const debits  = totalDebits(transactions);
  const avg     = (credits + debits) / transactions.length;   // Infinity or NaN for []!
  return { totalCredits: credits, totalDebits: debits, netBalance: credits - debits, avg };
}
```

**Problem:** `transactions.length` is `0` for an empty array. Division by zero yields `Infinity` (for non-zero numerators) or `NaN` (for `0/0`). These propagate silently.
**Fix:** Guard before dividing: `const avg = transactions.length === 0 ? 0 : (credits + debits) / transactions.length;`

---

#### Mistake 3: Computing `netBalance` independently instead of from the helpers

```js
// WRONG — computes net balance in a third loop, inconsistent with helpers
function buildDailySummary(transactions) {
  const credits = totalCredits(transactions);
  const debits  = totalDebits(transactions);
  let net = 0;
  for (const tx of transactions) {   // third loop!
    net += tx.type === "credit" ? tx.amount : -tx.amount;
  }
  return { totalCredits: credits, totalDebits: debits, netBalance: net };
}
```

**Problem:** The third loop could silently diverge from `totalCredits - totalDebits` if an unknown type appears (it would subtract unknown amounts). It also does redundant work.
**Fix:** `netBalance: credits - debits` — derive the value from the values you already have.

### Connection to interview problems

- **LeetCode 1342 — Number of Steps to Reduce a Number to Zero**: Each step modifies a running total based on a condition — the same conditional-accumulate structure as `totalCredits`/`totalDebits`
- **LeetCode 2011 — Final Value of Variable After Performing Operations**: Parse operations and accumulate a running total — direct structural match to `netBalance`
- **Real-world fintech**: Stripe's balance API, bank statements, PayPal dashboards — all surface exactly these four values: total in, total out, net, count. The computation you wrote today is the backend of every financial dashboard.

### Discussion questions

1. **`totalCredits` and `totalDebits` are nearly identical functions — should you merge them into one?** `totalByType(transactions, "credit")` from Lesson A is that merged function. Both approaches are valid. Named helpers (`totalCredits`, `totalDebits`) are more readable at call sites; parameterized functions (`totalByType`) are less code. In a real codebase, use the parameterized version and add thin wrappers if readability demands it.

2. **`buildDailySummary` calls `totalCredits` and `totalDebits` separately — two passes over the data. Is there a more efficient approach?** Yes: one pass that accumulates both simultaneously. But two O(n) passes is still O(n). Only optimize when profiling shows the passes are a bottleneck — which, for typical daily transaction counts, they never will be.

3. **The summary object has `totalCredits`, `totalDebits`, and `netBalance`. Is `netBalance` redundant since callers could compute it themselves?** Yes — but redundancy in a summary object is often a deliberate UX decision. The caller should not be required to know that `netBalance = totalCredits - totalDebits`. Returning a pre-computed summary is friendlier and prevents the caller from accidentally computing it wrong.

### Further exploration

- Read about **the accounting equation**: Assets = Liabilities + Equity. The fundamental identity that makes double-entry bookkeeping self-consistent — every credit creates a debit somewhere else. Your `netBalance` is a simplified version of this.
- [Stripe Docs — Balance](https://stripe.com/docs/api/balance): See how a production payment platform exposes available, pending, and reserved balances as named fields in a summary object — the same structure as `buildDailySummary`, at scale.
