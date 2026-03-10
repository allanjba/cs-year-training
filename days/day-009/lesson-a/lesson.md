## Day 009 — Lesson A (Foundations): Week 1 Consolidation

### Why this matters

You've spent eight days building a toolkit of fundamental patterns. Today is a checkpoint. The goal isn't to learn something new — it's to demonstrate that you can *apply what you know independently*, without the lesson guiding each step.

This matters because real programming tasks don't come labeled with the technique to use. When a colleague hands you a problem, you have to decide: Is this a filter problem? A frequency map problem? A search with early exit? A problem I should decompose into helpers first? Good developers make these decisions quickly because they've internalized the patterns.

Today's exercises are designed to make you drive. You'll get a problem description and some data. You'll decide how to break it down, which patterns to use, and how to validate your work. The lesson explains the thinking process — the "how to approach this" — rather than walking through a specific solution.

### The core concept

You now have six fundamental patterns in your toolkit:

| Pattern | When to use it | Example |
|---|---|---|
| **Linear scan + accumulate** | Need one result from all elements | `sumArray`, `minAndMax` |
| **Filter** | Keep only elements meeting a condition | `getActiveProducts` |
| **Transform** | Derive new values from each element | `getFullNames` |
| **Search with early exit** | Yes/no question, stop when answered | `contains`, `findById` |
| **Frequency map** | Count distinct values | `countEvents` |
| **Decompose + compose** | Complex problem → sub-problems → combine | `transactionSummary` |

The skill you're practicing today: **read a problem, identify which patterns it calls for, and implement them**.

### How to approach a problem

When you encounter a new problem, ask these questions in order:

**1. What shape is the input?**
- A single value (number, string)?
- An array of values?
- An array of objects? What fields matter?

**2. What shape is the output?**
- A single value (number, boolean, string)?
- A new array?
- An object (summary, grouped result)?
- `null` to signal "not found" or "no result"?

**3. What's the transformation from input to output?**
- Am I looking at every element to produce one value? → scan + accumulate
- Am I keeping some elements? → filter
- Am I changing every element? → transform
- Am I asking a yes/no question? → search + early exit
- Am I counting? → frequency map
- Is the problem complex enough to need helpers? → decompose

**4. What are the edge cases?**
- Empty input (array with 0 elements)
- Single element
- All elements pass / no elements pass a filter
- Input with 0 values, null, or missing fields

### Worked example

**Problem:** Given an array of items like `{ name: "widget", category: "tools", price: 15, inStock: true }`, write a function `summarizeCatalog(items)` that returns:
- `activeCount`: how many items are in stock
- `totalValue`: total price × 1 for in-stock items (as if buying one of each)
- `categories`: frequency map of categories across all items (not just in-stock)

**Step 1 — Input shape:** Array of objects with `name`, `category`, `price`, `inStock`.

**Step 2 — Output shape:** One summary object with three fields.

**Step 3 — Transformation:**
- `activeCount`: filter to in-stock items, count them → scan + filter
- `totalValue`: filter to in-stock items, sum their prices → scan + filter + accumulate
- `categories`: frequency map of `item.category` for all items → frequency map

**Step 4 — Edge cases:** Empty array → `{ activeCount: 0, totalValue: 0, categories: {} }`

**Decomposing into helpers:**

```js
function getInStockItems(items) {
  const result = [];
  for (const item of items) {
    if (item.inStock) result.push(item);
  }
  return result;
}

function sumPrices(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}

function categoryCounts(items) {
  const counts = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
}

function summarizeCatalog(items) {
  const inStock = getInStockItems(items);
  return {
    activeCount: inStock.length,
    totalValue:  sumPrices(inStock),
    categories:  categoryCounts(items),
  };
}
```

**Trace through a small example:**

```js
const items = [
  { name: "Hammer", category: "tools", price: 20, inStock: true },
  { name: "Nails", category: "tools", price: 5, inStock: true },
  { name: "Saw", category: "tools", price: 45, inStock: false },
  { name: "Paint", category: "materials", price: 15, inStock: true },
];

summarizeCatalog(items);
// inStock items: [Hammer, Nails, Paint]
// activeCount: 3
// totalValue: 20 + 5 + 15 = 40
// categories (all items): { tools: 3, materials: 1 }
```

### What good code looks like at this point

After eight days, here's what we'd expect from your code:

**Functions are focused:** Each function does one thing, has a clear name, and could be tested independently.

**No mutation of inputs:** You build new arrays/objects rather than modifying what was passed in.

**Edge cases handled:** Empty arrays return sensible values (0, `[]`, `{}`, or `null` as appropriate).

**Named variables:** No cryptic single-letter variables (except index `i` in a loop). Variable names describe what they hold.

**Composition over duplication:** If `getInStockItems` already exists, `summarizeCatalog` calls it instead of re-implementing the filter inline.

**Tests or manual checks present:** At least a few `console.log` calls that verify the output for a known input.

### Common patterns you may have forgotten

**Filtering + transforming in one pass:**
```js
for (const item of items) {
  if (item.inStock) {
    names.push(item.name);  // filter by inStock, transform to name
  }
}
```

**Finding max in one pass:**
```js
let max = null;
for (const item of items) {
  if (max === null || item.price > max) {
    max = item.price;
  }
}
```

**Frequency map shorthand:**
```js
counts[key] = (counts[key] || 0) + 1;
```

**Early exit search:**
```js
for (const item of items) {
  if (item.id === targetId) return item;
}
return null;
```

### Before the exercise

Today's exercise gives you a problem with a dataset and asks you to implement several helpers and a summary function. You won't be walked through it step by step. Instead:

1. **Read the problem carefully.** Identify the input shape, output shape, and what transformation is needed.
2. **Plan your helpers** before writing code. What small functions will you need?
3. **Implement and test each helper** before combining them.
4. **Check edge cases.** What happens with an empty array? What's the right return value?

The measure of success isn't just "code that runs" — it's code that's clear, correct, and handles edge cases. Apply everything from the past eight days.
