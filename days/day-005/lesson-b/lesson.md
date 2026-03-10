## Day 005 — Lesson B (Applied): Product Catalog Cleanup

### Why this matters

Every marketplace, online store, or SaaS product has a product catalog. Over time, catalogs accumulate stale data: products that have been discontinued, items that were never activated, products with outdated pricing. Someone periodically needs to clean it up.

This is a classic data processing task: take a raw list, filter out the bad records, derive useful subsets, and apply business rules to classify items. In Lesson A, you learned the mechanics of transform and filter. Now you'll apply them to product data with real business meaning.

### The core concept

A product catalog is an array of objects. Each product has fields that determine whether it should be shown, how it should be priced, and whether it qualifies for special treatment (like being "featured" in promotions):

```js
const products = [
  { name: "Laptop Pro", price: 1299, isActive: true },
  { name: "Old Mouse", price: 15, isActive: false },
  { name: "Headphones", price: 89, isActive: true },
  { name: "Desk Lamp", price: 45, isActive: true },
  { name: "Keyboard", price: 0, isActive: false },
];
```

Your tools will answer questions like:
- "What are the names of our active products?" (filter + transform)
- "Which products are affordable?" (filter by price)
- "Which products should we feature?" (filter by multiple conditions)

### How it works

**Getting active product names:** Filter by `isActive`, then extract the name.

```
products iteration:

"Laptop Pro"  — isActive: true  → name = "Laptop Pro"   → include
"Old Mouse"   — isActive: false → skip
"Headphones"  — isActive: true  → name = "Headphones"   → include
"Desk Lamp"   — isActive: true  → name = "Desk Lamp"    → include
"Keyboard"    — isActive: false → skip

result: ["Laptop Pro", "Headphones", "Desk Lamp"]
```

**Filtering under $50:** Filter by price condition.

```
"Laptop Pro"  — 1299 < 50? no  → skip
"Old Mouse"   — 15 < 50?   yes → include (even though inactive)
"Headphones"  — 89 < 50?   no  → skip
"Desk Lamp"   — 45 < 50?   yes → include
"Keyboard"    — 0 < 50?    yes → include

result: [Old Mouse, Desk Lamp, Keyboard]
```

**Featured products (active AND price > $50):**

```
"Laptop Pro"  — active: true, price 1299 > 50 → both conditions met → include
"Old Mouse"   — active: false → fails → skip
"Headphones"  — active: true, price 89 > 50   → both met → include
"Desk Lamp"   — active: true, price 45 > 50   → 45 is NOT > 50 → skip
"Keyboard"    — active: false → fails → skip

result: [Laptop Pro, Headphones]
```

### Code implementation

```js
function getActiveProductNames(products) {
  const names = [];
  for (const product of products) {
    if (product.isActive) {
      names.push(product.name);
    }
  }
  return names;
}

console.log(getActiveProductNames(products));
// ["Laptop Pro", "Headphones", "Desk Lamp"]
```

**Breaking it down:**
- This is a filter + transform in one pass: we check `isActive` (filter), then push `product.name` (transform — extracting the name instead of the whole object)
- The output is an array of strings, not an array of product objects

```js
function getProductsUnder(products, maxPrice) {
  const result = [];
  for (const product of products) {
    if (product.price < maxPrice) {
      result.push(product);
    }
  }
  return result;
}

console.log(getProductsUnder(products, 50));
// [{ name: "Old Mouse", ... }, { name: "Desk Lamp", ... }, { name: "Keyboard", ... }]
```

**Breaking it down:**
- `maxPrice` is a parameter — the threshold is configurable, not hardcoded
- This returns the full product objects (not just names) so the caller has all the data
- `<` not `<=` — "under $50" means strictly less than 50

```js
function getFeaturedProducts(products) {
  const result = [];
  for (const product of products) {
    if (product.isActive && product.price > 50) {
      result.push(product);
    }
  }
  return result;
}

console.log(getFeaturedProducts(products));
// [{ name: "Laptop Pro", ... }, { name: "Headphones", ... }]
```

**Breaking it down:**
- Both conditions must be true: `&&` requires active AND price > 50
- A $1000 inactive product doesn't get featured — it must pass both tests

### Common pitfalls

**1. Wrong condition for the "under price" filter**

```js
if (product.price <= maxPrice)  // includes products AT the price — is that "under"?
if (product.price < maxPrice)   // strictly under
```

The difference between `<` and `<=` matters. "Under $50" is strictly less than 50. "Up to $50" would include exactly $50. Match the operator to the business rule.

**2. Hardcoding thresholds**

```js
// Fragile: what when "featured" changes to price > $100?
function getFeaturedProducts(products) {
  for (const p of products) {
    if (p.price > 50) ...   // 50 is buried in the function
  }
}
```

Consider making the threshold a parameter: `getFeaturedProducts(products, minPrice = 50)`. This makes the function more flexible and the rule easier to find and change.

**3. Returning product names when objects are expected (or vice versa)**

`getActiveProductNames` returns strings. `getFeaturedProducts` returns objects. These are different output types. If a caller expects objects but gets strings, they'll get `undefined` when trying to access `.price`.

Be consistent about what each function returns, and make it clear from the function name: "getProductNames" signals strings, "getProducts" signals objects.

**4. Not handling products with a price of 0**

A product with `price: 0` (e.g., a free item or deleted product) is `< 50`, so it would appear in `getProductsUnder(products, 50)`. Is that correct? Think about whether zero-price items should be treated differently. For this exercise, include them — but notice the edge case.

### Computer Science foundations

**Time Complexity:** O(n) for all three functions.
- Each function visits every product exactly once.
- Condition checks and property accesses are O(1).

**Space Complexity:** O(k) where k is the number of products in the result.
- For `getActiveProductNames`: O(k) strings in the output
- For `getProductsUnder` and `getFeaturedProducts`: O(k) object references in the output
- In the worst case, all products pass the filter and k = n

**Filter then transform vs transform then filter:**

```js
// Approach 1: filter then transform (two passes)
const active = products.filter(p => p.isActive);    // pass 1
const names = active.map(p => p.name);              // pass 2

// Approach 2: combined (one pass)
const names = [];
for (const p of products) {
  if (p.isActive) names.push(p.name);              // one pass
}
```

Approach 1 is more readable and composable. Approach 2 is more efficient (one pass, less intermediate memory). For small catalogs, readability wins. For large datasets, efficiency matters. Most JavaScript runtimes are fast enough that the two-pass approach is fine unless you're processing millions of records.

### Real-world applications

- **E-commerce (Shopify, WooCommerce)**: Filter active products for a storefront, exclude out-of-stock items, find products in a price range
- **Admin tools**: Bulk updates — "archive all products under $1 that haven't sold in 90 days"
- **Search and discovery**: Filter results by category, price range, ratings
- **Promotions**: Select products for a sale based on price thresholds and activity status
- **Inventory reports**: Find products that need restocking, are overstocked, or are inactive

### Before the exercise

In the exercise file, you'll implement:

1. **`getActiveProductNames(products)`** — Return an array of name strings for all active products (filter by `isActive`, extract `.name`)
2. **`getProductsUnder(products, maxPrice)`** — Return an array of product objects with price strictly less than `maxPrice`
3. **`getFeaturedProducts(products)`** — Return products that are both active and priced above some threshold (you decide the threshold)

As you work:
- Return strings for "names" functions, objects for "products" functions
- Make thresholds parameters where possible
- Test with no products passing (result should be `[]`), all products passing, and mixed results
- Consider: should inactive products appear in the "under price" filter? Be intentional about your decision
