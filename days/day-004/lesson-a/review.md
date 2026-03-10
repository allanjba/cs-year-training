## Day 004 — Lesson A Review: Objects and Arrays of Objects

### What you should have learned

1. **Objects group related data**: Key-value pairs let you model real-world entities with multiple attributes in one named unit.
2. **Array-of-objects is the most common data structure**: API responses, database results, and configuration data almost always come in this shape.
3. **Dot notation for known keys**: `user.firstName` is clearer than `user["firstName"]` when you know the field name at write time.
4. **Return `null` (not `undefined`) for not-found**: `null` signals "I searched and found nothing" explicitly. `undefined` is an implicit "I fell off the end."
5. **References vs copies**: Pushing objects into a result array adds references — modifying a result element also modifies the original.

### Reviewing your implementation

#### Function 1: `getFullName(user)`

```js
function getFullName(user) {
  const first = user.firstName || "";
  const last  = user.lastName  || "";
  return `${first} ${last}`.trim();
}

console.log(getFullName({ id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 }));  // "Ada Lovelace"
console.log(getFullName({ id: 2, firstName: "Alan" }));  // "Alan" (no last name)
```

**Key insights:**
- `|| ""` safely handles a missing field without throwing — `undefined || ""` gives `""`
- `.trim()` removes the leading/trailing space when one name is missing
- O(1) — just two property accesses and a string concatenation

**Edge cases handled:**
- Missing `lastName` → "Ada" (no trailing space)
- Missing `firstName` → "Lovelace" (no leading space)

---

#### Function 2: `listFullNames(users)`

```js
function listFullNames(users) {
  const names = [];
  for (const user of users) {
    names.push(getFullName(user));
  }
  return names;
}

const sampleUsers = [
  { id: 1, firstName: "Ada",   lastName: "Lovelace", age: 28 },
  { id: 2, firstName: "Alan",  lastName: "Turing",   age: 17 },
  { id: 3, firstName: "Grace", lastName: "Hopper",   age: 35 },
];

console.log(listFullNames(sampleUsers));
// ["Ada Lovelace", "Alan Turing", "Grace Hopper"]
```

**Key insights:**
- Reuses `getFullName` — single responsibility, single implementation
- This is a **transform** (map): same number of elements, each converted from a user object to a string
- The original `sampleUsers` array and its objects are not modified

---

#### Function 3: `getAdultUsers(users)`

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

console.log(getAdultUsers(sampleUsers));
// [{ id: 1, firstName: "Ada", ... }, { id: 3, firstName: "Grace", ... }]
```

**Key insights:**
- `>=` (not `>`): 18-year-olds are adults
- Returns objects (references), not strings — the caller gets full user data
- This is a **filter**: output can have fewer elements than input

**Edge cases handled:**
- All users under 18 → `[]`
- Empty input → `[]`

---

#### Function 4: `findUserById(users, id)`

```js
function findUserById(users, id) {
  for (const user of users) {
    if (user.id === id) {
      return user;   // early exit
    }
  }
  return null;
}

console.log(findUserById(sampleUsers, 2));    // { id: 2, firstName: "Alan", ... }
console.log(findUserById(sampleUsers, 99));   // null
```

**Key insights:**
- `===` strict equality: `findUserById(users, "1")` correctly returns `null` even if `user.id` is the number `1`
- Early exit: returns immediately on first match
- `return null` (not `return undefined`) signals "not found" intentionally

**Edge cases handled:**
- ID not in array → `null`
- Empty array → `null` (loop never runs)

### Going deeper

#### Extension 1: Find all users matching a condition (not just by ID)

```js
function findUsersWhere(users, predicate) {
  const result = [];
  for (const user of users) {
    if (predicate(user)) result.push(user);
  }
  return result;
}

// Users named "Ada"
console.log(findUsersWhere(sampleUsers, u => u.firstName === "Ada"));
// [{ id: 1, firstName: "Ada", ... }]

// Users over 25
console.log(findUsersWhere(sampleUsers, u => u.age > 25));
// [{ id: 1, ... Ada age 28 }, { id: 3, ... Grace age 35 }]
```

`getAdultUsers` is a special case of `findUsersWhere(users, u => u.age >= 18)`.

#### Extension 2: Pre-build a lookup table for O(1) ID access

```js
function buildUserMap(users) {
  const map = {};
  for (const user of users) {
    map[user.id] = user;
  }
  return map;
}

const userMap = buildUserMap(sampleUsers);
console.log(userMap[2]);   // { id: 2, firstName: "Alan", ... } — O(1) lookup
console.log(userMap[99]);  // undefined — not found
```

O(n) upfront to build, then O(1) per lookup. When you need many lookups on the same dataset, this pays off immediately. This is the foundational idea behind **hash maps** (Day 6).

### Common mistakes and how to fix them

#### Mistake 1: Returning `undefined` instead of `null` for not-found

```js
// WRONG — implicit undefined return
function findUserById(users, id) {
  for (const user of users) {
    if (user.id === id) return user;
  }
  // No return statement — returns undefined implicitly
}

const user = findUserById(users, 99);
if (user.age > 18) { /* ... */ }  // TypeError: Cannot read properties of undefined
```

**Problem:** `undefined` from a "missing return" is an implementation accident, not an intentional signal. Callers can't easily distinguish "found nothing" from "something went wrong."
**Fix:** `return null;` explicitly — communicates intent.

---

#### Mistake 2: Using `==` for ID comparison

```js
// WRONG
if (user.id == id) return user;   // "1" == 1 is true!

findUserById(users, "2")   // returns Alan Turing, even though ID is the number 2
```

**Problem:** IDs in data are numbers; IDs from URLs or forms are strings. `==` silently coerces them, hiding a type mismatch.
**Fix:** Use `===`. If you get a string ID from a URL param, convert it explicitly: `parseInt(idFromUrl, 10)`.

---

#### Mistake 3: Accessing a property that might not exist without a guard

```js
function getBio(user) {
  return user.bio.substring(0, 100);  // TypeError if user.bio is undefined
}
```

**Problem:** `user.bio` may not exist. Accessing `.substring` on `undefined` throws.
**Fix:**
```js
function getBio(user) {
  if (!user.bio) return "";
  return user.bio.substring(0, 100);
}
```
Or using optional chaining: `return (user.bio || "").substring(0, 100)`.

### Connection to interview problems

- **LeetCode 1 — Two Sum**: Builds a lookup map to find pairs — extends `buildUserMap`
- **LeetCode 217 — Contains Duplicate**: `findUserById`-style search but checking for duplicates
- **LeetCode 350 — Intersection of Two Arrays II**: Combine filter + frequency map over objects
- Working with arrays of objects is the backbone of every API data manipulation problem

### Discussion questions

1. **`getAdultUsers` returns references to the original objects. What happens if the caller mutates a result?** They also mutate the original `users` array. This is a shallow copy — the array is new, but the objects inside aren't. If immutability matters, use `{ ...user }` to spread a shallow copy: `result.push({ ...user })`. For now, just be aware of the shared reference.

2. **`findUserById` has O(n) worst case. When would you use `buildUserMap` instead?** When you need to look up users by ID more than once. One call: linear search is fine. Ten calls: ten linear searches = O(10n). One `buildUserMap` + ten lookups = O(n + 10) = O(n). The break-even is at 2 lookups.

3. **What happens if there are duplicate IDs in the array?** `findUserById` returns the first match and exits. `buildUserMap` would overwrite with the last match. Real systems enforce unique IDs at the database level to avoid this.

### Further exploration

- MDN: [Spread syntax (`{ ...obj }`) for shallow copies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) — how to make copies of objects
- Read about **hash tables**: the data structure that makes `buildUserMap`-style O(1) lookups possible — you're building one manually every time you create a `{}` lookup object in JavaScript
