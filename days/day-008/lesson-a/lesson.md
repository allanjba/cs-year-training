## Day 008 — Lesson A (Foundations): Decomposing a Problem into Helpers

### Why this matters

So far you've written individual functions in isolation: sum an array, filter objects, count values. Real programs are bigger than any single function. They require you to take a complex problem, break it into smaller sub-problems, solve each sub-problem with a focused function, and then combine those functions into a complete solution.

This is **decomposition** — one of the most important skills in software engineering. A problem that seems hard becomes manageable once you've broken it into pieces small enough to solve directly.

Today's problem is transaction processing. You have a list of financial transactions, each with a type (`"credit"` or `"debit"`) and an amount. You need to compute the totals, the net balance, and a summary. Instead of writing one big function that does everything, you'll write small, focused helpers and combine them.

### The core concept

When you encounter a complex problem, the first question to ask is: "What are the independent sub-problems here?"

For transaction data:
- "What's the total of all credits?" — one specific calculation
- "What's the total of all debits?" — another specific calculation
- "What's the net balance?" — derived from the above two
- "How many of each type are there?" — a frequency count
- "Can I summarize all of this in one object?" — combining everything

Each of these is small enough to implement directly with patterns you already know (array scanning, filtering, frequency counting). The complexity lives in *understanding what the problem needs*, not in any individual function.

**The rule:** Each function should do one thing. `totalByType` computes a total. `netBalance` computes the net. `transactionSummary` assembles the final picture by calling the others.

### How it works

Let's work with this transaction list:

```js
const transactions = [
  { id: 1, type: "credit", amount: 100 },
  { id: 2, type: "debit",  amount: 30 },
  { id: 3, type: "credit", amount: 50 },
  { id: 4, type: "debit",  amount: 20 },
  { id: 5, type: "credit", amount: 200 },
];
```

**Total credits:**
```
Filter to credits: [100, 50, 200]
Sum: 100 + 50 + 200 = 350
```

**Total debits:**
```
Filter to debits: [30, 20]
Sum: 30 + 20 = 50
```

**Net balance:**
```
credits - debits = 350 - 50 = 300
```

**Transaction type frequency:**
```
type counts: { credit: 3, debit: 2 }
```

**Full summary object:**
```js
{
  totalCredits: 350,
  totalDebits: 50,
  netBalance: 300,
  typeCounts: { credit: 3, debit: 2 }
}
```

### Code implementation

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

console.log(totalByType(transactions, "credit"));  // 350
console.log(totalByType(transactions, "debit"));   // 50
```

**Breaking it down:**
- One loop, one accumulator — simple and focused
- `type` is a parameter so the function works for any transaction type, not just credit/debit
- We sum `tx.amount` only when `tx.type` matches — combined filter + accumulate

```js
function netBalance(transactions) {
  return totalByType(transactions, "credit") - totalByType(transactions, "debit");
}

console.log(netBalance(transactions));  // 300
```

**Breaking it down:**
- `netBalance` doesn't do any looping itself — it delegates to `totalByType`
- This is **composition**: building a higher-level function from lower-level ones
- Clean, readable, and correct: net = credits minus debits

```js
function countByType(transactions) {
  const counts = {};
  for (const tx of transactions) {
    counts[tx.type] = (counts[tx.type] || 0) + 1;
  }
  return counts;
}

console.log(countByType(transactions));  // { credit: 3, debit: 2 }
```

**Breaking it down:**
- This is the frequency-map pattern from Day 6, applied to `tx.type` instead of a raw value
- The output tells us how many of each type we have

```js
function transactionSummary(transactions) {
  return {
    totalCredits: totalByType(transactions, "credit"),
    totalDebits:  totalByType(transactions, "debit"),
    netBalance:   netBalance(transactions),
    typeCounts:   countByType(transactions),
  };
}

console.log(transactionSummary(transactions));
/*
{
  totalCredits: 350,
  totalDebits: 50,
  netBalance: 300,
  typeCounts: { credit: 3, debit: 2 }
}
*/
```

**Breaking it down:**
- `transactionSummary` calls three helper functions and assembles their results into one object
- It does no calculation itself — the helpers do all the work
- Adding a new field to the summary is just one more line: `newField: someHelper(transactions)`

### Common pitfalls

**1. Writing one massive function**

```js
// Hard to test, debug, and modify
function everythingAtOnce(transactions) {
  let credits = 0;
  let debits = 0;
  const counts = {};
  for (const tx of transactions) {
    if (tx.type === "credit") credits += tx.amount;
    if (tx.type === "debit") debits += tx.amount;
    counts[tx.type] = (counts[tx.type] || 0) + 1;
  }
  return { totalCredits: credits, totalDebits: debits, net: credits - debits, counts };
}
```

This works but is harder to test (you can only test the whole thing together) and harder to change (fixing the net balance logic means touching the big function). Decompose instead.

**2. Making helpers too specific**

```js
// Too specific: only works for "credit"
function totalCredits(transactions) {
  let total = 0;
  for (const tx of transactions) {
    if (tx.type === "credit") total += tx.amount;
  }
  return total;
}
```

A parameterized `totalByType(transactions, type)` is more reusable. You'd need separate `totalCredits`, `totalDebits`, `totalRefunds`, etc. without it.

**3. Not handling edge cases in helpers**

```js
totalByType([], "credit")      // should return 0
netBalance([])                 // should return 0 (0 - 0)
countByType([])                // should return {}
transactionSummary([])         // should work, returning zeros and empty counts
```

Test each helper with an empty array. A well-decomposed system handles edge cases at the helper level, so the composed functions automatically handle them too.

**4. Looping multiple times when one would do**

`transactionSummary` calls `totalByType` twice and `countByType` once — that's three passes through the array. For a summary function, this is fine and keeps things clean. But if performance mattered (millions of transactions), you'd want one pass that computes everything. This is a conscious trade-off between clarity and efficiency.

### Computer Science foundations

**Time Complexity:**
- `totalByType`: O(n)
- `netBalance`: O(n) (calls `totalByType` twice, each O(n))
- `countByType`: O(n)
- `transactionSummary`: O(n) — calls helpers that each do O(n) work; constants don't change the O(n) classification

**Space Complexity:**
- `totalByType`, `netBalance`: O(1)
- `countByType`: O(k) where k = number of distinct transaction types
- `transactionSummary`: O(k) for the counts object, O(1) for the numeric fields

**Abstraction:**
`netBalance` doesn't know how `totalByType` works internally — it just calls it and trusts the result. This is abstraction: you hide the details of how something is computed behind a name. The caller only needs to know *what* `totalByType` does, not *how*. This is what makes large programs manageable.

**Separation of concerns:**
Each function handles one concern:
- `totalByType`: filtering + accumulation
- `netBalance`: the relationship between credits and debits
- `countByType`: frequency counting
- `transactionSummary`: assembling the full picture

If the definition of "net balance" changes (e.g., refunds should be counted differently), you update only `netBalance`. Everything that calls it automatically gets the new behavior.

### Real-world applications

- **Banking apps**: Statement summaries showing total in, total out, and net change
- **Expense trackers (Expensify, Mint)**: Categorize and total expenses by type
- **Payroll systems**: Separate gross pay, deductions, and net pay
- **E-commerce**: Break down orders by status (pending, shipped, returned)
- **Accounting software (QuickBooks)**: Credit/debit ledger entries, account balances

The structure you're building today — small helpers composed into a summary function — mirrors how production financial software is organized. The difference is scale and persistence (they use databases), not the fundamental logic.

### Before the exercise

In the exercise file, you'll implement:

1. **`totalByType(transactions, type)`** — Sum `amount` fields for all transactions matching the given type
2. **`netBalance(transactions)`** — Return total credits minus total debits, using `totalByType`
3. **`countByType(transactions)`** — Return a frequency map of transaction types
4. **`transactionSummary(transactions)`** — Return a summary object with all four values

As you implement:
- Write and test `totalByType` first — everything else depends on it
- Use `totalByType` inside `netBalance` — don't re-implement the looping logic
- Verify each helper with manual checks before building `transactionSummary`
- Test with: empty array, only credits, only debits, mixed
