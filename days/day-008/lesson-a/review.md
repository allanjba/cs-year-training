## Day 008 — Lesson A Review: Decomposing a Problem into Helpers

### What you should have learned

1. **Problem decomposition**: Breaking a multi-faceted problem (`totalByType`, `netBalance`, `transactionTypeFrequency`) into focused helpers is the same skill you need to pass a system design interview — divide responsibility, conquer each part.
2. **Single-pass vs multi-pass**: `netBalance` could call `totalByType` twice (two passes) or accumulate credits and debits in one loop (one pass). Both are O(n); knowing the trade-off is what matters.
3. **Parameterized filtering**: `totalByType(transactions, "credit")` and `totalByType(transactions, "debit")` are the same function with different arguments. One function replaces two nearly identical functions.
4. **Frequency maps on typed data**: `transactionTypeFrequency` applies the frequency-counting pattern from Day 6 to a new domain — it's the same algorithm, different shape of input.
5. **Composition as documentation**: A `netBalance` that calls `totalByType` internally reads like a specification: "net balance is credits minus debits." The code *explains itself*.

### Reviewing your implementation

#### Function 1: `totalByType(transactions, type)`

```js
function totalByType(transactions, type) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === type) {
      total += tx.amount;
    }
  }
  return total;
}

const transactions = [
  { id: 1, type: "credit", amount: 50 },
  { id: 2, type: "debit",  amount: 20 },
  { id: 3, type: "credit", amount: 30 },
];

console.log(totalByType(transactions, "credit"));   // 80
console.log(totalByType(transactions, "debit"));    // 20
console.log(totalByType(transactions, "refund"));   // 0 (type never occurs)
console.log(totalByType([], "credit"));             // 0
```

**Key insights:**
- Filter by `tx.type === type` (strict equality), then accumulate — the same filter-then-accumulate pattern as `countLargeOrders` on Day 1
- Initialize `total = 0`: the identity for addition — if no transactions match, the correct answer is 0, not undefined
- `type` is a parameter, not hardcoded — this one function replaces `totalCredits`, `totalDebits`, and any future type

**Edge cases handled:**
- Unknown type (e.g., `"refund"`) → `0` (no matches, accumulator stays at 0)
- Empty array → `0`
- All same type → sums all amounts

---

#### Function 2: `netBalance(transactions)`

```js
// Version 1: composed — clear intent
function netBalance(transactions) {
  return totalByType(transactions, "credit") - totalByType(transactions, "debit");
}

// Version 2: one pass — slightly more efficient
function netBalance(transactions) {
  let balance = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") balance += tx.amount;
    else if (tx.type === "debit") balance -= tx.amount;
  }
  return balance;
}

console.log(netBalance(transactions));   // 60 (50 - 20 + 30)
console.log(netBalance([]));             // 0
```

**Key insights:**
- Version 1 reads exactly like the definition: credits minus debits. Prefer this unless performance is measured to matter.
- Version 2 handles both in a single pass: `+=` for credit, `-=` for debit. Unknown types are silently skipped — neither added nor subtracted.
- Both versions return `0` for an empty array (correct — zero transactions means zero balance).

**Edge cases handled:**
- All credits → positive balance
- All debits → negative balance (the result goes below zero, and that is correct)
- Empty list → `0`

---

#### Function 3: `transactionTypeFrequency(transactions)`

```js
function transactionTypeFrequency(transactions) {
  const counts = {};
  for (const tx of transactions) {
    counts[tx.type] = (counts[tx.type] || 0) + 1;
  }
  return counts;
}

console.log(transactionTypeFrequency(transactions));
// { credit: 2, debit: 1 }

console.log(transactionTypeFrequency([]));
// {}
```

**Key insights:**
- This is `valueFrequency` from Day 6 applied to `tx.type` instead of a raw value — same pattern, different field name
- `(counts[tx.type] || 0) + 1` — the `|| 0` prevents `undefined + 1 = NaN` on the first occurrence of a type
- The result naturally handles any number of distinct types without special-casing

**Edge cases handled:**
- Single transaction type → `{ credit: 3 }`
- Empty array → `{}`
- Three or more distinct types → all counted correctly

### Going deeper

#### Extension 1: Multi-currency support

```js
// If transactions have a currency field: { type, amount, currency }
function totalByTypeCurrency(transactions, type, currency) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === type && tx.currency === currency) {
      total += tx.amount;
    }
  }
  return total;
}

// Or group by currency first, then compute per-currency net balance:
function netBalanceByCurrency(transactions) {
  const byCurrency = {};
  for (const tx of transactions) {
    if (!byCurrency[tx.currency]) byCurrency[tx.currency] = 0;
    byCurrency[tx.currency] += tx.type === "credit" ? tx.amount : -tx.amount;
  }
  return byCurrency;
}
```

A nested grouping — first by currency, then by type. Same building blocks as today, one level deeper.

#### Extension 2: Detecting suspicious patterns

```js
// Flag accounts with more than N debits in a session
function hasSuspiciousActivity(transactions, maxDebits) {
  const freq = transactionTypeFrequency(transactions);
  return (freq["debit"] || 0) > maxDebits;
}

// Find the single largest debit
function largestDebit(transactions) {
  let max = 0;
  for (const tx of transactions) {
    if (tx.type === "debit" && tx.amount > max) {
      max = tx.amount;
    }
  }
  return max;
}

console.log(hasSuspiciousActivity(transactions, 1));   // false (only 1 debit)
console.log(largestDebit(transactions));               // 20
```

Reuse `transactionTypeFrequency` rather than recounting manually. Each helper stays focused; the combination of helpers answers complex questions.

### Common mistakes and how to fix them

#### Mistake 1: Hardcoding the type instead of using the parameter

```js
// WRONG — only ever totals credits
function totalByType(transactions, type) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") {   // ignores `type` parameter!
      total += tx.amount;
    }
  }
  return total;
}

console.log(totalByType(transactions, "debit"));   // 80 — wrong! should be 20
```

**Problem:** The function ignores its own `type` parameter. A caller who passes `"debit"` gets credit totals instead.
**Fix:** Use the parameter: `if (tx.type === type)`.

---

#### Mistake 2: Reimplementing `totalByType` inside `netBalance`

```js
// WRONG — duplicates the filter-and-sum loop
function netBalance(transactions) {
  let credits = 0;
  let debits = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") credits += tx.amount;
  }
  for (const tx of transactions) {
    if (tx.type === "debit") debits += tx.amount;
  }
  return credits - debits;
}
```

**Problem:** When `totalByType` exists, inlining its logic creates two copies of the same filtering code. If the field name changes from `type` to `transactionType`, you have to fix it in multiple places.
**Fix:** `return totalByType(transactions, "credit") - totalByType(transactions, "debit");`

---

#### Mistake 3: Forgetting `|| 0` in `transactionTypeFrequency`

```js
// WRONG
function transactionTypeFrequency(transactions) {
  const counts = {};
  for (const tx of transactions) {
    counts[tx.type]++;   // NaN on first occurrence!
  }
  return counts;
}

console.log(transactionTypeFrequency(transactions));
// { credit: NaN, debit: NaN } — silent failure
```

**Problem:** `counts["credit"]` is `undefined` on the first access. `undefined + 1` (via `++`) is `NaN`. `NaN` propagates silently.
**Fix:** `counts[tx.type] = (counts[tx.type] || 0) + 1;`

### Connection to interview problems

- **LeetCode 1854 — Maximum Population Year**: Sum contributions per type (year) across a list — same filter-and-accumulate structure as `totalByType`
- **LeetCode 560 — Subarray Sum Equals K**: Builds on accumulation patterns; understanding net-balance-style running sums is the prerequisite
- **Real-world fintech**: Every bank statement, Stripe dashboard, and expense tracker computes exactly these aggregates — credits, debits, net balance, transaction counts — from a stream of typed transaction records

### Discussion questions

1. **`netBalance` with the composed version makes two passes over the data. Is that a problem?** For in-memory arrays of reasonable size: no. Two O(n) passes is still O(n). Optimize only when you have measured a performance problem — not before. The composed version wins on clarity.

2. **`totalByType(transactions, "refund")` returns `0` even though there are no refunds. Is that the right answer?** Yes — the total amount of zero refunds is zero. If callers need to distinguish "no refunds" from "refunds summing to zero," return `null` for the first case and change the interface. Don't break the zero-equals-nothing assumption without a good reason.

3. **`transactionTypeFrequency` uses a plain object. What problem would you hit if transaction types were numbers instead of strings?** JavaScript object keys are always strings. `counts[1]` stores the key as `"1"`. The lookup still works (`counts[1]` coerces to `counts["1"]`), but iterating with `Object.keys` returns strings, not numbers. Use `Map` when key types must be preserved exactly.

4. **If you had to add a `averageAmountByType(transactions, type)` function, how would you implement it?** Filter by type, sum amounts, count matches, divide. Or: use `totalByType` for the sum and count matches separately. Do *not* reach for `transactionTypeFrequency` — it counts transactions, not amounts.

### Further exploration

- MDN: [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) — `totalByType` can be expressed as a `reduce`; understanding when to use it (vs a for-loop) is a common interview topic
- Read about **double-entry bookkeeping**: the accounting system that treats every transaction as affecting exactly two accounts — credits and debits are not just a naming convention, they're a centuries-old system for keeping books consistent
