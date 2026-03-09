## Day 005 — Lesson B (Applied) review notes

### Core checks

- `listActiveProductNames`:
  - Filters by `isActive === true`.
  - Returns only the `name` field.
- `filterAffordableProducts`:
  - Uses `price <= maxPrice`.
  - Does not mutate the original `products` array.
- `filterFeaturedProducts`:
  - Combines the active flag and price condition correctly.

### Discussion prompts

- How closely do these helpers mirror the generic transform/filter patterns from Lesson A?
- If the business rules changed (e.g. different featured logic), how easy would it be to update?
- How might you unit test these functions with a small set of sample products?

### Real-world tie-in

- Product list cleanup like this appears in:
  - migration scripts,
  - admin/reporting tools,
  - A/B test setup.
- Thinking in terms of “transform” and “filter” prepares you for more advanced collection operations in many languages.\*\*\*
