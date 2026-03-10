## Day 004 — Lesson A (Foundations): Objects and Arrays of Objects

### Why this matters

Real data isn't just arrays of numbers or strings. A user is more than a name — they have an ID, an email, an age, a role, a signup date. A product has a title, price, category, and stock level. An order has line items, shipping info, and a status.

In JavaScript, **objects** are how you group related data together under one name. And when you have many records of the same type, you store them as an **array of objects**. This is the most common data structure in real applications — it's how database query results come back, how APIs respond, and how configuration data is structured.

Today you'll learn to work with objects: how to access their fields, how to scan an array of objects to filter or derive information, and how to think about the data shape you're working with.

### The core concept

A **JavaScript object** is a collection of key-value pairs:

```js
const user = {
  id: 1,
  firstName: "Ada",
  lastName: "Lovelace",
  age: 28,
};
```

You access values using dot notation (`user.firstName`) or bracket notation (`user["firstName"]`). Both do the same thing; dot notation is preferred when you know the key name at write time.

An **array of objects** is just an array where each element is an object:

```js
const users = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 },
  { id: 2, firstName: "Alan", lastName: "Turing", age: 17 },
  { id: 3, firstName: "Grace", lastName: "Hopper", age: 45 },
];
```

Processing this list uses the exact same loop patterns from Days 1–3 — you just access properties on each element instead of using the element value directly.

### How it works

Let's trace through getting full names from the users array:

**The idea:** Walk each user, combine `firstName` and `lastName` with a space between them.

```
users = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 },
  { id: 2, firstName: "Alan", lastName: "Turing", age: 17 },
]

step 1 — user = { id: 1, firstName: "Ada", ... }:
          "Ada" + " " + "Lovelace" = "Ada Lovelace"
          result = ["Ada Lovelace"]

step 2 — user = { id: 2, firstName: "Alan", ... }:
          "Alan" + " " + "Turing" = "Alan Turing"
          result = ["Ada Lovelace", "Alan Turing"]
```

Now filtering adults (age ≥ 18):

```
step 1 — Ada, age 28:  28 >= 18? yes → include
step 2 — Alan, age 17: 17 >= 18? no  → skip

result = [{ id: 1, firstName: "Ada", ... }]
```

Now finding a user by ID (target: 2):

```
step 1 — id 1: 1 === 2? no
step 2 — id 2: 2 === 2? yes → return this user immediately

Returns: { id: 2, firstName: "Alan", ... }
```

### Code implementation

```js
function getFullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

const users = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 },
  { id: 2, firstName: "Alan", lastName: "Turing", age: 17 },
];

console.log(getFullName(users[0]));  // "Ada Lovelace"
```

**Breaking it down:**
- Template literals (backtick strings) with `${expression}` are the cleanest way to interpolate values into strings
- `getFullName` takes a single user object — it doesn't need to know about arrays

```js
function getAdultUsers(users) {
  const result = [];
  for (const user of users) {
    if (user.age >= 18) {
      result.push(user);
    }
  }
  return result;
}

console.log(getAdultUsers(users));
// [{ id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 }]
```

**Breaking it down:**
- `result.push(user)` adds the *original* user object to the result array — we're returning references to the same objects, not copies
- The filter condition is `>=` (greater than or equal), not `>` — 18 year olds qualify as adults

```js
function findById(users, id) {
  for (const user of users) {
    if (user.id === id) {
      return user;  // early exit
    }
  }
  return null;  // not found
}

console.log(findById(users, 1));   // { id: 1, firstName: "Ada", ... }
console.log(findById(users, 99));  // null
```

**Breaking it down:**
- Returns the full user object so the caller gets all the data they need
- Returns `null` when not found — a clear, checkable signal
- Uses early exit: stops as soon as the ID matches

### Common pitfalls

**1. Accessing a nonexistent property returns `undefined`, not an error**

```js
const user = { id: 1, firstName: "Ada" };
console.log(user.email);    // undefined — no error thrown!
console.log(user.email.length);  // TypeError: Cannot read properties of undefined
```

JavaScript silently returns `undefined` for missing properties. This is a common source of bugs: your code doesn't crash on the first access, but crashes later when you try to use the `undefined` value. Always think about whether a field might be missing.

**2. Modifying the returned object modifies the original**

```js
const adults = getAdultUsers(users);
adults[0].firstName = "Changed";  // Also changes users[0].firstName!
```

When you push objects into a result array, you're pushing references to the same objects. There's no automatic copying. If you want independent copies, you'd need to explicitly create new objects. For now, be aware of this — we'll discuss copying in depth later.

**3. Using loose equality for ID checks**

```js
findById(users, "1")  // target is string "1"
// user.id === "1" will be false if user.id is the number 1!
```

IDs are often numbers in your data but might come from user input (URLs, form fields) as strings. Always make sure your types match, or deliberately convert: `parseInt(id)` or `String(id)`.

**4. Returning `undefined` instead of `null` for not-found**

```js
// Fragile: implicitly returns undefined
function findById(users, id) {
  for (const user of users) {
    if (user.id === id) return user;
  }
  // No explicit return — caller gets undefined
}
```

`undefined` means "no return statement was reached," which is an implementation detail. `null` means "I explicitly searched and found nothing." Return `null` to signal "not found" intentionally.

### Computer Science foundations

**Time Complexity:**
- `getFullName(user)`: O(1) — just accessing two properties and concatenating
- `getAdultUsers(users)`: O(n) — one pass through the array
- `findById(users, id)`: O(n) worst case, O(1) best case (if first element matches)

**Space Complexity:**
- `getAdultUsers(users)`: O(k) where k is the number of adults — the result array could be as large as the input
- `findById(users, id)`: O(1) — returns a reference to an existing object, no new space needed

**Why is finding by ID O(n)?**
We have to check each user's ID until we find the match. If the user we want is last in the list, we check every other user first. This is fine for small lists, but for large datasets, you'd use a different data structure — a **lookup table** (object or Map) that allows O(1) access by key. We'll get there.

**Objects as structured data:**
Objects are JavaScript's version of what other languages call **structs** or **records**. They group related fields into one named unit. This is fundamental to modeling real-world entities in code.

### Real-world applications

- **User management**: Get all users, filter by role/status, find by ID or email
- **Product catalogs**: Filter products by category, price range, availability
- **Order processing**: Find orders by status, compute totals from line items
- **Configuration objects**: Access settings, feature flags, environment variables
- **API responses**: Nearly every REST API returns arrays of objects (JSON)

When you call a REST API and get back a list of users, orders, or products, you get exactly what you're working with today: an array of objects. Every loop, every filter, every field access you practice now is something you'll use constantly.

### Before the exercise

In the exercise file, you'll implement:

1. **`getFullName(user)`** — Return the user's full name as a formatted string
2. **`getAdultUsers(users)`** — Return a new array containing only users who are 18 or older
3. **`findById(users, id)`** — Return the user with the matching ID, or `null` if not found

As you work:
- Access properties using dot notation (`user.firstName`, not `user["firstName"]`) where possible
- Think about what happens when a field is missing — what would your function return?
- For `findById`, use early exit: return as soon as you find the match
- Test with an empty array, a single-element array, and an ID that doesn't exist
