## Day 005 — Lesson B Review: Product Catalog Cleanup

### What you should have learned

1. **Filter + transform combined**: `listActiveProductNames` filters by `isActive` and transforms to a string in one pass — filter-then-transform logic in a single loop.
2. **Parameterized thresholds**: `filterAffordableProducts(products, maxPrice)` — the price cap is a parameter, not hardcoded.
3. **`<=` vs `<` precision**: "Affordable" means `price <= maxPrice` (inclusive). "Featured" means `price >= minPrice` (also inclusive). Read the requirement carefully to choose the right operator.
4. **Consistent return types**: Functions returning product names return strings. Functions returning products return objects. These are different and should be distinct functions.
5. **Composition vs one-pass trade-off**: Separating filter and transform into two steps is clearer; combining them into one pass is more efficient. For small datasets, clarity wins.

### Reviewing your implementation

#### Function 1: `listActiveProductNames(products)`

```js
function listActiveProductNames(products) {
  const names = [];
  for (const product of products) {
    if (product.isActive) {
      names.push(product.name);
    }
  }
  return names;
}

const products = [
  { id: 1, name: "Basic Plan",  price: 10, isActive: true },
  { id: 2, name: "Legacy Plan", price: 5,  isActive: false },
  { id: 3, name: "Pro Plan",    price: 25, isActive: true },
];

console.log(listActiveProductNames(products));   // ["Basic Plan", "Pro Plan"]
console.log(listActiveProductNames([]));         // []
```

**Key insights:**
- Filter (active check) + transform (name extraction) in one pass
- Output is strings, not objects — the function name says "names"
- Inactive products are silently skipped — no null or placeholder in the output

**Edge cases handled:**
- No active products → `[]`
- All inactive → `[]`
- Empty input → `[]`

---

#### Function 2: `filterAffordableProducts(products, maxPrice)`

```js
function filterAffordableProducts(products, maxPrice) {
  const result = [];
  for (const product of products) {
    if (product.price <= maxPrice) {
      result.push(product);
    }
  }
  return result;
}

console.log(filterAffordableProducts(products, 10));
// [{ id: 1, Basic Plan, price: 10 }, { id: 2, Legacy Plan, price: 5 }]
// Note: includes inactive products! The filter is price-only
```

**Key insights:**
- `<=` (inclusive): a product priced exactly at `maxPrice` is "affordable"
- `maxPrice` is a parameter — the threshold belongs to the caller, not the function
- Includes inactive products — this function only filters by price; `isActive` is a separate concern

**Edge cases handled:**
- `maxPrice = 0` → only free products (price 0)
- No products qualify → `[]`

---

#### Function 3: `filterFeaturedProducts(products, minPrice)`

```js
function filterFeaturedProducts(products, minPrice) {
  const result = [];
  for (const product of products) {
    if (product.isActive && product.price >= minPrice) {
      result.push(product);
    }
  }
  return result;
}

console.log(filterFeaturedProducts(products, 20));
// [{ id: 3, Pro Plan, price: 25, isActive: true }]
```

**Key insights:**
- Two conditions combined with `&&`: both must be true
- `>=` (inclusive): a product priced exactly at `minPrice` qualifies as featured
- An inactive product with a high price does not qualify — `isActive` is checked first

**Edge cases handled:**
- No active products → `[]`
- Active products but all below `minPrice` → `[]`

### Going deeper

#### Extension 1: Get featured product names (combining filter + transform)

```js
function getFeaturedProductNames(products, minPrice) {
  const names = [];
  for (const product of products) {
    if (product.isActive && product.price >= minPrice) {
      names.push(product.name);
    }
  }
  return names;
}

// Or composed:
function getFeaturedProductNamesComposed(products, minPrice) {
  const featured = filterFeaturedProducts(products, minPrice);
  return featured.map(p => p.name);  // using built-in .map() for clarity
}
```

#### Extension 2: Sort filtered results by price

After filtering, sorting is a common next step:

```js
function getCheapActiveProducts(products, maxPrice) {
  const affordable = filterAffordableProducts(products, maxPrice)
    .filter(p => p.isActive);   // chain built-in .filter() for active

  affordable.sort((a, b) => a.price - b.price);   // sort ascending by price
  return affordable;
}

console.log(getCheapActiveProducts(products, 20));
// [{ id: 1, Basic Plan, price: 10, isActive: true }]
```

`Array.prototype.sort` is O(n log n) — a preview of sorting algorithms you'll study in the DS&A phase of the curriculum.

### Common mistakes and how to fix them

#### Mistake 1: Wrong comparison operator for boundary values

```js
// WRONG for "affordable products" (should include products AT the max price)
if (product.price < maxPrice)   // excludes products priced exactly at maxPrice

// WRONG for "featured products" (should include products AT the min price)
if (product.price > minPrice)   // excludes products priced exactly at minPrice
```

**Problem:** Off-by-one at boundaries. "Affordable up to $10" should include the $10 product.
**Fix:** Read the requirement: "affordable" = `price <= maxPrice`; "featured" = `price >= minPrice`.

---

#### Mistake 2: Returning names when objects are expected

```js
// WRONG — returns strings, but caller might expect full product objects
function filterFeaturedProducts(products, minPrice) {
  const result = [];
  for (const product of products) {
    if (product.isActive && product.price >= minPrice) {
      result.push(product.name);   // BUG: string instead of object
    }
  }
  return result;
}

const featured = filterFeaturedProducts(products, 20);
featured[0].price   // undefined — product.name has no .price property
```

**Problem:** Function name says "products" (implies objects) but returns strings.
**Fix:** `result.push(product)` — push the full product. For names only, write `getFeaturedProductNames`.

---

#### Mistake 3: Checking both conditions when they're independent

```js
// WRONG — returns correct result but misunderstands the requirement
function filterAffordableProducts(products, maxPrice) {
  const result = [];
  for (const product of products) {
    if (product.isActive && product.price <= maxPrice) {  // added isActive — not in spec!
      result.push(product);
    }
  }
  return result;
}
```

**Problem:** The spec says "affordable" means `price <= maxPrice`. Adding `isActive` changes the meaning of the function without the caller knowing. Now "affordable" actually means "active AND affordable."
**Fix:** Only add conditions that are in the spec. If the business wants "active affordable products," make that a separate function.

### Connection to interview problems

- **LeetCode 2418 — Sort the People**: Filter + sort over objects — direct extension of today's patterns
- **LeetCode 2215 — Find the Difference of Two Arrays**: Filter values not in another set
- Product filtering is the backbone of every e-commerce search: filter by category, sort by price, paginate — the primitives you built today

### Discussion questions

1. **`filterAffordableProducts` includes inactive products. Is that a bug or a feature?** It depends on the requirement. The exercise asked for products under a price, without mentioning activity status. If the caller always wants active products, they can chain: `filterAffordableProducts(products, max).filter(p => p.isActive)`. Keeping concerns separate gives callers flexibility.

2. **`listActiveProductNames` does filter + transform in one pass. How would you separate the concerns?** `const active = getActiveProducts(products); return active.map(p => p.name);` — two passes, two functions, clearer intent. In production, the two-pass version is preferred for readability unless profiling shows the one-pass version is meaningfully faster.

3. **If `products` contained 10,000 items, would any of these functions become slow?** No — they're all O(n), which scales linearly. 10,000 iterations take milliseconds in JavaScript. These functions would only be "slow" in the context of a tight real-time loop running hundreds of thousands of times per second.

### Further exploration

- Read about how Shopify, WooCommerce, and similar platforms implement product filtering at scale — they use database queries with `WHERE` clauses and indexes instead of in-memory loops, but the *logical* filter/sort/paginate structure is identical
- Functional programming concepts: `filter`, `map`, `reduce` as the trinity of collection processing — available as built-ins in JavaScript, Python, Ruby, and virtually every modern language
