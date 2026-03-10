## Day 004 — Lesson B Review: Customer List Tools

### What you should have learned

1. **Business names for array patterns**: `getCustomerFullNames` is a transform, `getActiveCustomers` is a filter, `findCustomerById` is a search with early exit — same algorithms, domain-specific names.
2. **Filter returns objects; transform returns derived values**: `getCustomerFullNames` returns strings. `getActiveCustomers` returns customer objects. The output type communicates the intent.
3. **Parameterizing for reusability**: Functions that accept the dataset as a parameter are reusable; functions with hardcoded data are not.
4. **`isActive === true` vs truthy `isActive`**: Explicit boolean check is more defensive and communicates intent clearly.

### Reviewing your implementation

#### Function 1: `getCustomerFullNames(customers)`

```js
function getCustomerFullNames(customers) {
  const names = [];
  for (const customer of customers) {
    names.push(`${customer.firstName} ${customer.lastName}`);
  }
  return names;
}

const customers = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", isActive: true, plan: "pro" },
  { id: 2, firstName: "Alan", lastName: "Turing", isActive: false, plan: "free" },
  { id: 3, firstName: "Grace", lastName: "Hopper", isActive: true, plan: "team" },
];

console.log(getCustomerFullNames(customers));
// ["Ada Lovelace", "Alan Turing", "Grace Hopper"]
```

**Key insights:**
- Returns strings — a transform from object to display name
- All customers are included regardless of `isActive` — names for the full customer list
- Template literals are cleaner than string concatenation for multiple values

**Edge cases handled:**
- Empty input → `[]`
- All customers → all names returned

---

#### Function 2: `getActiveCustomers(customers)`

```js
function getActiveCustomers(customers) {
  const result = [];
  for (const customer of customers) {
    if (customer.isActive === true) {
      result.push(customer);
    }
  }
  return result;
}

console.log(getActiveCustomers(customers));
// [{ id: 1, Ada... }, { id: 3, Grace... }]
console.log(getActiveCustomers([]));
// []
```

**Key insights:**
- Returns customer objects — the caller needs the full record, not just the name
- `=== true` is explicit: protects against truthy non-boolean values (e.g., `isActive: 1`)
- Does not modify the original `customers` array

**Edge cases handled:**
- Empty input → `[]`
- No active customers → `[]`
- All customers active → returns a new array with all original references

---

#### Function 3: `findCustomerById(customers, id)`

```js
function findCustomerById(customers, id) {
  for (const customer of customers) {
    if (customer.id === id) {
      return customer;
    }
  }
  return null;
}

console.log(findCustomerById(customers, 3));
// { id: 3, firstName: "Grace", lastName: "Hopper", isActive: true, plan: "team" }

console.log(findCustomerById(customers, 999));
// null
```

**Key insights:**
- `===` prevents matching string ID `"1"` against number ID `1`
- Early exit: stops at first match
- Returns the full customer object so the caller can access any field

**Edge cases handled:**
- ID not found → `null`
- Empty array → `null`

### Going deeper

#### Extension 1: Get names of active customers only (combining filter + transform)

```js
function getActiveCustomerNames(customers) {
  const names = [];
  for (const customer of customers) {
    if (customer.isActive === true) {
      names.push(`${customer.firstName} ${customer.lastName}`);
    }
  }
  return names;
}

// Or composed from helpers:
function getActiveCustomerNamesComposed(customers) {
  const active = getActiveCustomers(customers);
  return getCustomerFullNames(active);
}
```

The composed version uses two passes but reads clearly. The inline version uses one pass and is more efficient. At this scale, prefer clarity.

#### Extension 2: Group customers by plan

```js
function groupByPlan(customers) {
  const groups = {};
  for (const customer of customers) {
    const plan = customer.plan;
    if (!groups[plan]) groups[plan] = [];
    groups[plan].push(customer);
  }
  return groups;
}

console.log(groupByPlan(customers));
// {
//   pro:  [{ id: 1, Ada... }],
//   free: [{ id: 2, Alan... }],
//   team: [{ id: 3, Grace... }],
// }
```

This is a new pattern: grouping. Instead of counting (frequency map), we're collecting objects into buckets. The structure is similar: build an object where each key maps to a list.

### Common mistakes and how to fix them

#### Mistake 1: Returning strings from `getActiveCustomers`

```js
// WRONG — returns names instead of objects
function getActiveCustomers(customers) {
  const result = [];
  for (const customer of customers) {
    if (customer.isActive) {
      result.push(customer.firstName);  // BUG: caller expects full objects
    }
  }
  return result;
}

const active = getActiveCustomers(customers);
active[0].plan  // undefined — there's no .plan on a string!
```

**Problem:** The function name says "customers" but it returns strings. Callers expect objects.
**Fix:** `result.push(customer)` — push the full object. If you want names, write a separate `getActiveCustomerNames`.

---

#### Mistake 2: Using truthy check when boolean is expected

```js
// RISKY
if (customer.isActive) {  // matches 1, "yes", any truthy value
```

vs.

```js
// EXPLICIT
if (customer.isActive === true) {  // only matches boolean true
```

**Problem:** If `isActive` were stored as `1` instead of `true`, the truthy check would work but the intent is unclear. In TypeScript, this would be caught at compile time. In plain JS, being explicit prevents subtle bugs.

---

#### Mistake 3: Modifying the input array

```js
// WRONG
function getActiveCustomersMutating(customers) {
  const inactive = [];
  for (let i = 0; i < customers.length; i++) {
    if (!customers[i].isActive) {
      inactive.push(customers.splice(i, 1));   // mutates the original!
      i--;  // now needs index adjustment
    }
  }
  return customers;
}
```

**Problem:** Removes elements from the caller's array. The caller's data is now different after calling this function.
**Fix:** Always build a new `result` array; never modify `customers`.

### Connection to interview problems

- **LeetCode 2390 — Removing Stars From a String**: Filter elements from a sequence — same filter pattern
- **LeetCode 1832 — Check if the Sentence Is Pangram**: `containsValue`-style check over transformed data
- Real-world: Every admin dashboard (user management, customer lists, subscription management) is built on `getAll`, `getActive`, `findById` — the exact functions you wrote today

### Discussion questions

1. **`getCustomerFullNames` and `getActiveCustomerNames` sound similar. When should they be the same function?** When both use cases are common and the difference is just a filter step, you could add an optional parameter: `getCustomerFullNames(customers, { activeOnly: false })`. But optional parameters add complexity. If "active only" is one well-defined use case, a separate function `getActiveCustomerNames` is clearer. Avoid premature generalization.

2. **`getActiveCustomers` returns references to the original customer objects. Is that a problem here?** For read-only operations (displaying a list), no. If you need to modify returned customers without affecting originals, spread each: `result.push({ ...customer })`. In most application code, you read the list and render it — no copying needed.

3. **A new requirement: find customer by email. Write the signature.** `findCustomerByEmail(customers, email)` — same early-exit search pattern, just checking `customer.email === email` (or `customer.email.toLowerCase() === email.toLowerCase()` for case-insensitive match). The structure doesn't change; only the field and comparison change.

### Further exploration

- Grouping, sorting, and paginating arrays of objects: these three operations (plus filter and transform) are the building blocks of every list-based UI
- When arrays of objects grow large (thousands+), building lookup maps (`buildUserMap`-style from Lesson A) becomes important — preview of what hash maps formalize in the curriculum
