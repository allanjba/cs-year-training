# Day 15 — Lesson B (Applied): Custom Sorting with Comparators — Review

## What you should have learned

- `Array.prototype.sort` without a comparator converts elements to strings — this silently breaks numeric sorting and sorting of objects.
- A comparator `(a, b) => ...` returns negative to put `a` first, positive to put `b` first, and zero to preserve relative order.
- Multi-key sorting chains comparisons: compute the primary diff first; if non-zero return it, otherwise fall through to the secondary comparison.
- Calling `.slice()` before `.sort()` is the standard idiom for returning a new sorted array without mutating the original.
- `String.prototype.localeCompare` is the correct way to compare strings for sorting — it handles Unicode, accents, and locale rules that raw `<`/`>` operators miss.

---

## Reviewing your implementation

### `sortByPrice(products)`

**Reference implementation:**

```javascript
function sortByPrice(products) {
  return products.slice().sort((a, b) => a.price - b.price);
}
```

**Key insights:**
- `products.slice()` creates a shallow copy of the array. The product objects themselves are not copied — only the array of references. Sorting rearranges those references without touching the objects.
- `a.price - b.price` is the canonical numeric ascending comparator. Negative when `a` is cheaper (put `a` first), positive when `a` is more expensive (put `b` first).
- The sort is stable (ES2019+), so products at the same price maintain their original relative order. If you need a consistent tie-breaking order, use `sortByPriceThenName` instead.

**Edge cases:**
- Empty array: `.slice()` returns `[]`, `.sort()` on `[]` returns `[]`. Correct.
- One product: trivially sorted. Correct.
- All same price: sort returns them in original order (stable sort, zero comparator result everywhere).

---

### `sortByNameAlphabetically(products)`

**Reference implementation:**

```javascript
function sortByNameAlphabetically(products) {
  return products.slice().sort((a, b) => a.name.localeCompare(b.name));
}
```

**Key insights:**
- `localeCompare` returns a negative number when `a.name` sorts before `b.name`, zero when equal, positive when `a.name` sorts after. The sign convention matches what `.sort()` expects.
- Without `localeCompare`, `"Cable Organizer" < "Blue Light Glasses"` — this works by ASCII code point. But "cable organizer" < "Blue Light Glasses" would be wrong because lowercase letters have higher code points than uppercase. `localeCompare` with default locale handles case-folding correctly.
- For a case-insensitive sort explicitly, pass `{ sensitivity: 'base' }` as the third argument to `localeCompare`.

**Edge cases:**
- Products with the same name: `localeCompare` returns 0, stable sort preserves original order.
- Names starting with numbers or special characters: `localeCompare` handles them according to locale rules; raw comparison puts them at the front (code points < 65).

---

### `sortByPriceThenName(products)`

**Reference implementation:**

```javascript
function sortByPriceThenName(products) {
  return products.slice().sort((a, b) => {
    const priceDiff = a.price - b.price;
    if (priceDiff !== 0) return priceDiff;
    return a.name.localeCompare(b.name);
  });
}
```

**Key insights:**
- Computing `priceDiff` first and returning it immediately when non-zero is important for performance — no need to compute the name comparison for the majority of pairs that have different prices.
- The `!== 0` check handles both positive and negative price differences with one condition.
- Floating-point prices: `a.price - b.price` can produce very small non-zero values (e.g., `0.0000000001`) due to float precision. For prices stored as cents (integers), this is not an issue. For float prices, the comparator is still correct — any non-zero value is a valid signal of ordering.

**Edge cases:**
- The $19.99 tie: "Blue Light Glasses" vs "Laptop Sleeve" — `localeCompare("Blue Light Glasses", "Laptop Sleeve")` is negative, so "Blue Light Glasses" comes first. ✓
- Three or more products at the same price: the name comparison handles them correctly, producing full alphabetical order within the price group.

---

## Going deeper

### Extension 1: Make sorting direction configurable

A common UI pattern is a sortable table where clicking a column header toggles between ascending and descending. Generalize the sort functions to accept a direction parameter:

```javascript
function sortByPriceDirectional(products, direction = 'asc') {
  const multiplier = direction === 'asc' ? 1 : -1;
  return products.slice().sort((a, b) => multiplier * (a.price - b.price));
}

// Usage:
sortByPriceDirectional(PRODUCTS, 'asc');   // cheapest first
sortByPriceDirectional(PRODUCTS, 'desc');  // most expensive first
```

Multiplying by `-1` flips the sign of the comparator result, reversing the sort order. This works for any numeric comparator. For `localeCompare`, use `multiplier * a.name.localeCompare(b.name)`.

Now generalize further: a `sortBy(products, key, direction)` function that sorts by any field:

```javascript
function sortBy(products, key, direction = 'asc') {
  const multiplier = direction === 'asc' ? 1 : -1;
  return products.slice().sort((a, b) => {
    if (typeof a[key] === 'number') {
      return multiplier * (a[key] - b[key]);
    }
    return multiplier * String(a[key]).localeCompare(String(b[key]));
  });
}

sortBy(PRODUCTS, 'price', 'desc');    // most expensive first
sortBy(PRODUCTS, 'category', 'asc'); // alphabetical by category
sortBy(PRODUCTS, 'name', 'desc');    // reverse alphabetical by name
```

### Extension 2: Sort by multiple keys passed as an array

Rather than hard-coding a two-key sort, write a function that accepts an ordered list of keys and sorts by them in sequence:

```javascript
function sortByKeys(products, keys) {
  // keys is an array of { field, direction } objects
  // e.g., [{ field: 'price', direction: 'asc' }, { field: 'name', direction: 'asc' }]
  return products.slice().sort((a, b) => {
    for (const { field, direction } of keys) {
      const multiplier = direction === 'asc' ? 1 : -1;
      let diff;
      if (typeof a[field] === 'number') {
        diff = multiplier * (a[field] - b[field]);
      } else {
        diff = multiplier * String(a[field]).localeCompare(String(b[field]));
      }
      if (diff !== 0) return diff; // this key broke the tie, done
    }
    return 0; // all keys tied
  });
}

// Sort by category asc, then price asc, then name asc:
sortByKeys(PRODUCTS, [
  { field: 'category', direction: 'asc' },
  { field: 'price',    direction: 'asc' },
  { field: 'name',     direction: 'asc' },
]);
```

This is essentially what SQL's `ORDER BY col1 ASC, col2 DESC` does — each subsequent column is a tiebreaker for the previous.

---

## Common mistakes and how to fix them

### Mistake 1: Sorting numbers without a comparator

```javascript
// BUGGY: no comparator — sorts by string representation
function sortByPrice(products) {
  return products.slice().sort(); // BUG: sorts by "[object Object]"
}

// Also buggy for a plain number array:
[10, 9, 2, 1, 20].sort() // => [1, 10, 2, 20, 9] — lexicographic, not numeric
```

JavaScript converts each element to a string and sorts lexicographically. For objects this produces `"[object Object]"` for every element — every comparison is zero, so the array is returned in its original order (or an engine-specific order). For numbers, "10" < "2" because "1" < "2", so 10 appears before 2. Fix: always pass `(a, b) => a.price - b.price` for numeric sorts.

### Mistake 2: Mutating the input array

```javascript
// BUGGY: mutates the original products array
function sortByPrice(products) {
  return products.sort((a, b) => a.price - b.price); // BUG: no .slice()
}

// Caller's surprise:
const cheapestFirst = sortByPrice(PRODUCTS);
console.log(PRODUCTS[0].name); // "Notebook" — PRODUCTS is now sorted!
// The caller still holding a reference to PRODUCTS sees it changed.
```

`Array.prototype.sort` sorts in place and returns the same array reference. Without `.slice()`, both `cheapestFirst` and `PRODUCTS` point to the same array — now sorted. Any other code that held a reference to `PRODUCTS` sees unexpected ordering. Fix: `products.slice().sort(...)`.

### Mistake 3: Wrong multi-key comparator — checking equality instead of non-zero

```javascript
// BUGGY: uses == 0 instead of !== 0, fails for floating-point rounding
function sortByPriceThenName(products) {
  return products.slice().sort((a, b) => {
    const priceDiff = a.price - b.price;
    if (priceDiff == 0) {                        // BUG: should be !== 0 to short-circuit
      return a.name.localeCompare(b.name);
    }
    // Falls through to implicit return undefined when prices differ!
  });
}
```

When prices differ, `priceDiff == 0` is false, so the `if` block is skipped — and the function returns `undefined`. A comparator returning `undefined` is treated as `0` by the sort engine (elements are considered equal), so the sort produces incorrect results for all pairs with different prices. Fix: invert the condition to `if (priceDiff !== 0) return priceDiff;` then unconditionally return the name comparison.

---

## Connection to interview problems

**LeetCode 179 — Largest Number:** Given integers, arrange them to form the largest number. The trick is a custom comparator: compare `String(a) + String(b)` vs `String(b) + String(a)`. If "9" + "34" = "934" > "349" = "34" + "9", then 9 should come before 34. This is exactly `(a, b) => (String(b) + String(a)).localeCompare(String(a) + String(b))` — a comparator that `.sort()` calls on every pair.

**"Sort an array of objects by multiple fields"** appears directly in frontend interviews. The multi-key pattern in `sortByPriceThenName` is the expected answer. Interviewers often ask you to extend it to N fields or a configurable direction.

**K Closest Points to Origin (LeetCode 973):** Sort points by their Euclidean distance to the origin, then take the first K. The comparator computes `a[0]**2 + a[1]**2 - (b[0]**2 + b[1]**2)`. Same pattern, different domain.

**Interval scheduling / meeting rooms:** Problems like "can all meetings fit without overlap?" first sort meetings by start time. A comparator on start time is the setup step — and the correctness of everything else depends on the sort being right.

---

## Discussion questions

1. JavaScript's `Array.prototype.sort` is specified as stable since ES2019. Before that, some engines (including older V8) used an unstable sort for arrays larger than 10 elements. What real-world bugs could this cause in a product-sorting UI? How would you detect the problem?

2. The "subtraction trick" `(a, b) => a - b` is concise and common, but breaks for very large integers or `NaN` values. How would you write a safe numeric comparator that handles these edge cases? Is the extra safety worth the verbosity in typical product-price sorting?

3. `sortByPriceThenName` returns a new array; the lesson's `bubbleSort` and `insertionSort` sort in place. When would you choose an in-place sort over a copy-and-sort approach? What are the costs and benefits of each for a large dataset?

4. Suppose a user wants to sort the product table by category first, then by price within each category. How would you extend `sortByPriceThenName` to handle this? Would you rather write a new function or refactor to the generic `sortByKeys` extension?

---

## Further exploration

- **Tim sort internals:** The V8 blog has a post ("Getting things sorted in V8") explaining the history of V8's sort implementation and the transition from an unstable to a stable Tim sort in 2019.
- **The Schwartzian transform:** A pattern from Perl (and applicable in any language) for sorting by an expensive-to-compute key: pre-compute the key for each element, sort the (key, element) pairs, then extract the elements. Avoids recomputing the key on every comparator call. Relevant for, e.g., sorting by a substring, hash, or function result.
- **Radix sort and counting sort:** Non-comparison-based sorts that break the O(n log n) lower bound by exploiting the structure of the keys (e.g., integers in a bounded range). Used in database engines and GPU sorting. Worth understanding why the comparison lower bound doesn't apply to them.
