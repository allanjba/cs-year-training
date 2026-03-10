## Day 004 — Lesson B (Applied): Customer List Tools

### Why this matters

Subscription businesses — SaaS products, streaming services, membership platforms — live and die by their customer data. Every day, someone on the team wants to know: "How many active customers do we have? Who is customer #4821? Can you give me a list of names for the email we're sending?"

These are simple questions, but answering them requires code that can navigate a list of customer records. In Lesson A, you learned to work with arrays of objects. Now you'll apply that to a realistic customer dataset and build the small utilities that an internal script would actually use.

### The core concept

Customer data is typically an array of objects with several fields:

```js
const customers = [
  { id: 1, firstName: "Sarah", lastName: "Chen", isActive: true, plan: "pro" },
  { id: 2, firstName: "Marcus", lastName: "Webb", isActive: false, plan: "basic" },
  { id: 3, firstName: "Priya", lastName: "Patel", isActive: true, plan: "enterprise" },
];
```

Your tools need to work with this structure: loop over the array, read fields from each object, and either build new arrays or return a single value.

The key skill is translating business questions into precise code:
- "Give me a list of names" → map each customer to `firstName + " " + lastName`
- "Only active customers" → filter where `isActive === true`
- "Find customer #3" → search for `id === 3`, return early when found

### How it works

**Getting a list of full names from `customers`:**

```
step 1 — Sarah Chen:  "Sarah" + " " + "Chen" = "Sarah Chen"
step 2 — Marcus Webb: "Marcus" + " " + "Webb" = "Marcus Webb"
step 3 — Priya Patel: "Priya" + " " + "Patel" = "Priya Patel"

result: ["Sarah Chen", "Marcus Webb", "Priya Patel"]
```

**Filtering active customers:**

```
step 1 — Sarah: isActive = true  → include
step 2 — Marcus: isActive = false → skip
step 3 — Priya: isActive = true  → include

result: [Sarah Chen customer object, Priya Patel customer object]
```

**Finding by ID (target: 2):**

```
step 1 — id 1: 1 === 2? no
step 2 — id 2: 2 === 2? yes → return Marcus Webb object immediately
```

### Code implementation

```js
function getCustomerNames(customers) {
  const names = [];
  for (const customer of customers) {
    names.push(`${customer.firstName} ${customer.lastName}`);
  }
  return names;
}

console.log(getCustomerNames(customers));
// ["Sarah Chen", "Marcus Webb", "Priya Patel"]
```

**Breaking it down:**
- We produce a new array of *strings*, not objects — this is a transformation (a "map")
- The original `customers` array is unchanged
- Template literals make the string construction readable

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
// [{ id: 1, ...Sarah... }, { id: 3, ...Priya... }]
```

**`customer.isActive === true` vs `customer.isActive`:**
Both work when `isActive` is always a boolean. But `=== true` is more explicit and protects against edge cases where `isActive` might be a truthy non-boolean value (like `1` or `"yes"`). Being explicit about types is a good habit.

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
// { id: 3, firstName: "Priya", lastName: "Patel", isActive: true, plan: "enterprise" }

console.log(findCustomerById(customers, 999));
// null
```

### Common pitfalls

**1. Checking `isActive` with loose truthy/falsy when you shouldn't**

```js
if (customer.isActive) {  // works for booleans, but...
```

This is fine if `isActive` is always `true` or `false`. But if the field is missing (`undefined`), or if someone stored `0` or `""` for false, you might get unexpected results. Being explicit (`=== true`) makes your intent clear and makes edge cases visible.

**2. Confusing "filter by active" with "filter out inactive"**

These produce the same result but read differently. Pick the phrasing that matches the business language:

```js
// "Give me the active customers"
if (customer.isActive === true) result.push(customer);

// "Remove the inactive customers"
if (customer.isActive !== false) result.push(customer);
```

The first is clearer. Match the language to the intent.

**3. Returning objects vs returning names**

`getCustomerNames` returns strings. `getActiveCustomers` returns objects. These are different shapes. Make sure your caller knows what type to expect. Good function names help: "getCustomerNames" signals strings, "getActiveCustomers" signals objects.

**4. What happens if `firstName` or `lastName` is undefined?**

```js
const badCustomer = { id: 4, isActive: true };
getFullName(badCustomer);  // "undefined undefined"
```

In a real system, you'd validate data before processing it. For now, assume the data is well-formed — but be aware this assumption can break.

### Computer Science foundations

**Time Complexity:**
- `getCustomerNames(customers)`: O(n) — visits every customer once
- `getActiveCustomers(customers)`: O(n) — visits every customer once
- `findCustomerById(customers, id)`: O(n) worst case — checks every customer if the ID doesn't exist

**Space Complexity:**
- `getCustomerNames`: O(n) — output array has one string per input customer
- `getActiveCustomers`: O(k) where k is the number of active customers
- `findCustomerById`: O(1) — returns a reference to an existing object

**When O(n) lookup isn't good enough:**
For small customer lists (dozens to hundreds), O(n) search is fine. But if you have 100,000 customers and frequently need to find them by ID, you'd preprocess the list into a lookup object:

```js
const customerById = {};
for (const c of customers) {
  customerById[c.id] = c;
}
// Now: customerById[42] is O(1)
```

This trades O(n) upfront work for O(1) lookups afterward. We'll explore this pattern more on Day 6.

### Real-world applications

These three functions are the building blocks of customer management screens in real products:

- **CRM systems**: Display a table of customer names, filter by status
- **Admin dashboards**: Show active subscriber count, find a customer by ID to view their details
- **Email campaigns**: Get the names of all active customers in a particular plan
- **Billing systems**: Find a customer by ID to check their subscription status
- **Support tools**: Look up a customer by ID when a ticket comes in

In a real codebase, these would likely call a database instead of filtering an in-memory array — but the *logic* (filter, map, find-by-id) stays the same. The functions you're writing today are the application layer; the database is just where the data lives.

### Before the exercise

In the exercise file, you'll implement:

1. **`getCustomerNames(customers)`** — Return an array of full name strings for all customers
2. **`getActiveCustomers(customers)`** — Return an array of customer objects where `isActive === true`
3. **`findCustomerById(customers, id)`** — Return the customer with the matching ID, or `null`

As you work:
- Use the same loop patterns from Lesson A — the structure is identical, only the field names change
- Test each function with the empty array, with all customers active, with no customers active
- Make sure `getCustomerNames` returns strings and `getActiveCustomers` returns objects — they're different transformations of the same data
