# Day 15 — Lesson B (Applied): Custom Sorting with Comparators

## Why this matters

In Lesson A you built sorting algorithms from first principles. In real JavaScript code you'll rarely implement bubble sort — but you'll write comparator functions constantly. Every time you sort an array of objects (users by join date, products by price, search results by relevance), you need to tell the JavaScript engine how to compare two elements.

The built-in `Array.prototype.sort` is fast (O(n log n) in modern engines) and handles the mechanics, but you're fully responsible for the comparator. A wrong comparator produces silently incorrect ordering. One of the most common JavaScript bugs — numbers sorting in "string order" — comes from passing no comparator at all.

Understanding comparators turns you from someone who can sort trivial arrays into someone who can sort anything, in any order, by any combination of keys. That skill shows up in frontend rendering, data pipelines, reporting, and interview problems.

---

## The core concept

`Array.prototype.sort(compareFn)` takes a comparator function with signature `(a, b) => number`. The engine uses this function to compare pairs of elements and decide their order. The rule:

- **Return a negative number** → `a` should come before `b`
- **Return zero** → `a` and `b` are equal; preserve their order (stable sort)
- **Return a positive number** → `b` should come before `a` (i.e., `a` goes after `b`)

The simplest numeric ascending comparator is `(a, b) => a - b`. When `a < b`, the result is negative — `a` comes first. When `a > b`, the result is positive — `b` comes first. When equal, zero.

For strings, the simplest ascending comparator is `(a, b) => a.localeCompare(b)`. You could also use `a < b ? -1 : a > b ? 1 : 0`, but `localeCompare` handles Unicode, locale-specific ordering, and accent marks correctly.

**The danger of no comparator:** Without a comparator, `sort()` converts every element to a string and compares lexicographically. This produces correct results for arrays of strings, but deeply wrong results for numbers: `[1, 10, 2, 20, 3].sort()` → `[1, 10, 2, 20, 3]`. The numbers 10 and 20 come before 2 and 3 because "10" < "2" lexicographically (the character "1" has a lower code point than "2"). This is a silent bug — no error thrown, just wrong ordering.

---

## How it works (with hand trace)

Let's sort this product array by price ascending: `sortByPrice(products)`.

The comparator is `(a, b) => a.price - b.price`.

Say the engine needs to compare these two products during sorting:
```
a = { name: "Widget", price: 29.99 }
b = { name: "Gadget", price: 9.99 }
```

`a.price - b.price = 29.99 - 9.99 = 20`. Positive → `b` comes before `a`. Gadget ($9.99) goes first.

Now for multi-key sort (price then name): `sortByPriceThenName(products)`.

The comparator needs to handle ties. If two products have the same price, we fall back to name order.

```javascript
(a, b) => {
  const priceDiff = a.price - b.price;
  if (priceDiff !== 0) return priceDiff;       // different prices: sort by price
  return a.name.localeCompare(b.name);          // same price: sort by name
}
```

Say we compare:
```
a = { name: "Zephyr", price: 15.00 }
b = { name: "Alpha",  price: 15.00 }
```

`a.price - b.price = 0` → fall through to name comparison.
`"Zephyr".localeCompare("Alpha")` → positive (Z > A) → `b` ("Alpha") comes before `a` ("Zephyr").

This chained comparator pattern generalizes to any number of sort keys.

---

## Code implementation

```javascript
// Products are objects with name (string), price (number), category (string).

function sortByPrice(products) {
  // .slice() creates a copy so we don't mutate the original array
  return products.slice().sort((a, b) => a.price - b.price);
}

function sortByNameAlphabetically(products) {
  return products.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function sortByPriceThenName(products) {
  return products.slice().sort((a, b) => {
    const priceDiff = a.price - b.price;
    if (priceDiff !== 0) return priceDiff;
    return a.name.localeCompare(b.name);
  });
}
```

Notice these functions **do not mutate the input**. They call `.slice()` to create a copy before sorting. This is a deliberate design decision: `sort()` mutates the array it's called on, and callers generally don't expect their original array to change. The `products.slice().sort(...)` pattern is the standard idiom for non-mutating sort.

---

## Common pitfalls

**The default sort converts to strings.** Calling `products.sort()` with no comparator sorts by the string representation of each object: `[object Object]`. Every product becomes the same string and the sort "order" is arbitrary. Always pass a comparator when sorting objects or numbers.

**The subtraction trick has a trap with very large or non-finite numbers.** `(a, b) => a - b` can overflow for very large integers (beyond Number.MAX_SAFE_INTEGER) and produces incorrect results for `NaN` comparisons. For safe comparison of arbitrary numbers, some engineers prefer the explicit form: `a < b ? -1 : a > b ? 1 : 0`. For typical product prices this isn't a concern, but it's worth knowing.

**Forgetting to return the sorted result.** If you write `products.sort(...)` without `return` and without `.slice()`, you've mutated the original array and your function implicitly returns `undefined`. Callers who expect a new array get `undefined`. Always either mutate in place deliberately, or return the result of the sort.

**Case sensitivity in string sorting.** `"banana".localeCompare("Apple")` — does "A" come before "b"? With default locale options, uppercase typically sorts before lowercase (`"Apple"` before `"banana"`). Use `a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })` for case-insensitive sorting. This matters for any user-facing list.

---

## Computer Science foundations

**What algorithm does JavaScript use?** Modern JavaScript engines (V8, SpiderMonkey, JavaScriptCore) use **Tim sort** — a hybrid of merge sort and insertion sort. Tim sort is O(n log n) worst case and O(n) best case on already-sorted data. It's also stable (preserves the original order of equal elements), which is required by the ES2019 specification.

**Comparator as a partial order.** A correct comparator must define a "total order" — it must be:
- Antisymmetric: if `f(a, b) < 0` then `f(b, a) > 0`
- Transitive: if `a < b` and `b < c` then `a < c`
- Reflexive: `f(a, a) === 0`

If your comparator violates these properties (e.g., sometimes saying A < B and sometimes B < A for the same pair), the sort algorithm's behavior is undefined. Some engines will still produce an output, but it won't be a valid sorted order.

**Why comparison-based sort must be O(n log n).** The engine can only learn about element order through comparator calls. There are n! possible orderings of n elements. Each comparator call has 3 possible outcomes (negative/zero/positive), so it can at most cut the remaining possibilities by a factor of 3. To distinguish n! possibilities, you need at least log₃(n!) comparisons, which is Θ(n log n). No comparison-based sort can do better asymptotically.

---

## Real-world applications

**Frontend data tables.** When a user clicks a column header to sort a table, you're calling `Array.prototype.sort` with a dynamically chosen comparator. Clicking the same header twice often toggles between ascending and descending — achieved by multiplying the comparator result by `-1` or swapping `a` and `b`.

**API response sorting.** REST APIs often return lists of objects (orders, users, products). Client-side code sorts them for display. The server may also sort, but client-side re-sorting is common when the user can change sort criteria without a round-trip.

**Stable sort and multi-key sorting.** Because JavaScript's sort is stable (ES2019+), you can achieve multi-key sorting by sorting multiple times: first sort by the secondary key, then sort by the primary key. The secondary sort's order is preserved for equal primary values. However, the chained comparator approach in `sortByPriceThenName` is more readable and requires only one pass.

**Data pipelines.** In Node.js scripts that process CSV data or aggregate logs, sorting by timestamp, user ID, or priority is a core operation. The same comparator patterns apply.

---

## Before the exercise

Make sure you can answer these before coding:

1. What does a comparator return to indicate that `a` should come before `b`? That `b` should come before `a`?
2. Why is `products.sort()` (with no comparator) wrong for sorting by price?
3. In `sortByPriceThenName`, what happens when two products have the same price and the same name?
4. Why does `sortByPrice` call `.slice()` before `.sort()`? What would happen without it?
5. The sample data below has two products at the same price ($19.99). Which one should appear first after `sortByPriceThenName`?

The exercise uses a product catalog with realistic names and prices. Before writing code, read through the sample data and mentally work out what the sorted order should be for each of the three functions — then verify your implementation matches.
