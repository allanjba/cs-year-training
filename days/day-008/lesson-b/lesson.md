## Day 008 — Lesson B (Applied): Daily Account Summary

### Why this matters

In Lesson A, you built transaction helpers that compute totals, net balances, and type counts. Now you'll take those pieces and assemble them into something a user would actually see: a **daily account summary** — the kind of screen you see in a banking app or expense tracker that says "Today you spent $85, earned $200, and your balance is +$115."

This lesson is about the final step of data processing: taking computed values and organizing them into a clean, usable output. It's also about thinking from the user's perspective — what questions will they ask, and what data structure answers those questions clearly?

### The core concept

A good summary object is shaped around what the consumer needs, not just around what was easy to compute. Consider the difference:

**Computation-shaped (what the code does):**
```js
{ creditTotal: 200, debitTotal: 85 }
```

**User-shaped (what the user needs):**
```js
{
  totalIn: 200,         // money received — positive framing
  totalOut: 85,         // money spent — positive value for positive spending
  netChange: 115,       // balance change for the day
  transactionCount: 5,  // how active was the account?
  largestDebit: 50,     // biggest single expense
}
```

The second shape answers the user's questions directly. As you design return values, ask: "If someone had to read this object to understand their account day, does it tell them what they need to know?"

### How it works

Working with today's transactions:

```js
const todayTransactions = [
  { id: 1, type: "credit", amount: 200 },
  { id: 2, type: "debit",  amount: 50 },
  { id: 3, type: "debit",  amount: 25 },
  { id: 4, type: "credit", amount: 0 },
  { id: 5, type: "debit",  amount: 10 },
];
```

**Total in (credits):**
```
200 + 0 = 200
```

**Total out (debits):**
```
50 + 25 + 10 = 85
```

**Net change:**
```
200 - 85 = 115
```

**Transaction count:**
```
5
```

**Largest debit:**
```
debits = [50, 25, 10]
max(50, 25, 10) = 50
```

**Final summary:**
```js
{
  totalIn: 200,
  totalOut: 85,
  netChange: 115,
  transactionCount: 5,
  largestDebit: 50,
}
```

### Code implementation

```js
// Assume totalByType and netBalance from Lesson A are available

function largestDebit(transactions) {
  let max = 0;
  for (const tx of transactions) {
    if (tx.type === "debit" && tx.amount > max) {
      max = tx.amount;
    }
  }
  return max;
}

console.log(largestDebit(todayTransactions));  // 50
console.log(largestDebit([]));                  // 0
```

**Breaking it down:**
- Initialize `max = 0` — if there are no debits, the largest debit is 0 (or you could return `null`; the exercise decides)
- Combine filter + max-find in one pass: only update `max` when the transaction is a debit

```js
function dailySummary(transactions) {
  return {
    totalIn:          totalByType(transactions, "credit"),
    totalOut:         totalByType(transactions, "debit"),
    netChange:        netBalance(transactions),
    transactionCount: transactions.length,
    largestDebit:     largestDebit(transactions),
  };
}

console.log(dailySummary(todayTransactions));
/*
{
  totalIn: 200,
  totalOut: 85,
  netChange: 115,
  transactionCount: 5,
  largestDebit: 50
}
*/

console.log(dailySummary([]));
/*
{
  totalIn: 0,
  totalOut: 0,
  netChange: 0,
  transactionCount: 0,
  largestDebit: 0
}
*/
```

**Breaking it down:**
- `dailySummary` assembles the full picture by calling existing helpers
- It does no computation itself — delegation all the way down
- `transactions.length` is a direct property access, not a function call
- The empty array case works correctly because each helper handles empty input gracefully

### Common pitfalls

**1. Mixing display logic with computation**

```js
// Wrong: bakes in formatting decisions
function dailySummary(transactions) {
  return {
    totalIn: `$${totalByType(transactions, "credit").toFixed(2)}`,  // string, not number!
    // ...
  };
}
```

Return numbers, not formatted strings. Formatting is the caller's responsibility. The caller might want to display in dollars, euros, cents, or just the raw number for further calculation. Don't pre-format.

**2. Recomputing the same value multiple times**

```js
function dailySummary(transactions) {
  return {
    totalIn: totalByType(transactions, "credit"),
    netChange: totalByType(transactions, "credit") - totalByType(transactions, "debit"),
    // totalByType("credit") called twice!
  };
}
```

Consider storing intermediate results:

```js
function dailySummary(transactions) {
  const totalIn = totalByType(transactions, "credit");
  const totalOut = totalByType(transactions, "debit");
  return {
    totalIn,
    totalOut,
    netChange: totalIn - totalOut,
    // ...
  };
}
```

This makes it clear that `totalIn` and `totalOut` are computed once and reused.

**3. Not separating calculations from the summary object**

The summary function should be a thin assembler. If `dailySummary` contains complex logic, it's doing too much. Extract complex calculations into their own named helpers.

**4. Mutable state in the summary**

The summary is a snapshot — it represents account activity at a moment in time. Don't design it as something that gets mutated later. Return a plain object with fixed values.

### Computer Science foundations

**Time Complexity:** `dailySummary` calls several helpers, each O(n). Total: O(n) — we do a constant number of passes, each linear, so the overall complexity is still O(n).

**Space Complexity:** O(1) — the summary object has a fixed number of fields regardless of how many transactions there are.

**Data pipeline pattern:**
```
raw transactions
     ↓
totalByType("credit")  → totalIn
totalByType("debit")   → totalOut
netBalance()           → netChange
transactions.length    → transactionCount
largestDebit()         → largestDebit
     ↓
summary object
```

Each step transforms data from one form to another. This pipeline pattern — raw data → computed values → assembled result — is how real data processing works, from Excel formulas to distributed data pipelines.

**Why the output shape matters:**
The summary object is a form of API contract. Once other code starts consuming `dailySummary()`, its shape becomes hard to change without breaking callers. Design output shapes thoughtfully: include what's needed, use clear names, and be consistent with types (always numbers for money, not sometimes numbers and sometimes strings).

### Real-world applications

- **Banking mobile apps**: "Today's summary" card showing money in, money out, net change
- **Personal finance tools (Mint, YNAB, Copilot)**: Daily/weekly/monthly spending breakdowns
- **Business dashboards**: End-of-day revenue summary for e-commerce
- **Payroll systems**: Pay stub showing gross pay, each deduction, and net pay
- **Corporate expense management**: Daily expense report showing categories and totals

In a real app, `dailySummary` would likely query a database for today's transactions, then format and display the result. The logic you're writing is the "business logic" layer — the same whether the data comes from a JavaScript array or a production database.

### Before the exercise

In the exercise file, you'll implement:

1. **`largestDebit(transactions)`** — Return the amount of the largest debit transaction; return 0 for no debits
2. **`dailySummary(transactions)`** — Return a summary object with `totalIn`, `totalOut`, `netChange`, `transactionCount`, and `largestDebit`

As you implement:
- Reuse `totalByType` and `netBalance` from Lesson A — don't re-implement the logic
- Return numbers, not formatted strings, from your summary
- Test with: empty transactions, only credits, only debits, a mix
- Consider: what should `dailySummary([])` return? Make sure each field has a sensible zero value
