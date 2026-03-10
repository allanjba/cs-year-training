## Day 007 — Lesson B Review: Data Quality Checks for Signups

### What you should have learned

1. **Validation as classification**: `isValidSignup` is a classifier — it answers "does this record meet all our rules?" Each rule is a separate check.
2. **Type check before method call**: Always verify you have the right type before calling methods like `.includes()` or `.length`.
3. **Boundary conditions are tricky**: `age >= 18` and `age > 17` are equivalent but `age >= 18` reads like the requirement. Always match the operator to the spec.
4. **Single source of truth for rules**: `countInvalidSignups` calls `isValidSignup` — it never reimplements the validation logic.
5. **Write tests that reveal intent**: A test for `isValidSignup` should document *why* each case is valid or invalid, not just that it passes or fails.

### Reviewing your implementation

#### Function 1: `isValidSignup(user)`

```js
function isValidSignup(user) {
  if (!user) return false;
  if (typeof user.email !== "string" || !user.email.includes("@") || user.email.length === 0) {
    return false;
  }
  if (typeof user.age !== "number" || user.age < 18) {
    return false;
  }
  return true;
}

const signupSamples = [
  { email: "alice@example.com", age: 25, isActive: true },   // valid
  { email: "bob@example", age: 17, isActive: true },          // invalid: age < 18
  { email: "", age: 30, isActive: false },                     // invalid: empty email
];

console.log(isValidSignup(signupSamples[0]));   // true
console.log(isValidSignup(signupSamples[1]));   // false (age)
console.log(isValidSignup(signupSamples[2]));   // false (email)
console.log(isValidSignup(null));               // false
```

**Key insights:**
- Guard `!user` first — calling `user.email` on `null` throws
- Check `email.length === 0` in addition to `includes("@")` — an empty string doesn't contain `@` but the check is more explicit
- `typeof user.age !== "number"` catches `age: "25"` (a string age from a form)
- `age < 18` covers `17`, `0`, `-5`, `17.9` — all invalid

**Edge cases handled:**
- `null` user → `false`
- Email without `@` → `false`
- Empty email → `false`
- Age `17` → `false`
- Age `18` → `true` (boundary — 18 is valid)
- Age as a string → `false` (type check)

---

#### Function 2: `countInvalidSignups(users)`

```js
function countInvalidSignups(users) {
  let count = 0;
  for (const user of users) {
    if (!isValidSignup(user)) {
      count++;
    }
  }
  return count;
}

console.log(countInvalidSignups(signupSamples));   // 2
console.log(countInvalidSignups([]));              // 0
```

**Key insights:**
- Negated: `!isValidSignup(user)` — counts the invalids
- Delegates all logic to `isValidSignup` — no rules duplicated here
- O(n) — one pass, one call to `isValidSignup` per user

**Edge cases handled:**
- All valid → `0`
- All invalid → count equals array length
- Empty input → `0`

### Going deeper

#### Extension 1: Return which records are invalid with reasons

```js
function validateSignups(users) {
  return users.map(user => {
    const errors = [];

    if (!user) {
      return { user, errors: ["user is null"] };
    }
    if (!user.email || !user.email.includes("@")) {
      errors.push("invalid email");
    }
    if (typeof user.age !== "number" || user.age < 18) {
      errors.push("must be 18 or older");
    }

    return { user, valid: errors.length === 0, errors };
  });
}

console.log(validateSignups(signupSamples));
// [
//   { user: {...alice}, valid: true, errors: [] },
//   { user: {...bob},   valid: false, errors: ["must be 18 or older"] },
//   { user: {...empty}, valid: false, errors: ["invalid email"] },
// ]
```

Returning error messages alongside the invalid flag lets you show the user *why* their record is invalid — essential for real form validation UX.

#### Extension 2: Composable validators

Instead of one big `isValidSignup` function, compose small validators:

```js
function isValidEmail(email) {
  return typeof email === "string" && email.length > 0 && email.includes("@");
}

function isValidAge(age) {
  return typeof age === "number" && Number.isInteger(age) && age >= 18;
}

function isValidSignup(user) {
  if (!user) return false;
  return isValidEmail(user.email) && isValidAge(user.age);
}
```

Each validator is independently testable:
```js
assertEqual(isValidEmail("alice@example.com"), true, "valid email");
assertEqual(isValidEmail("noemail"), false, "missing @");
assertEqual(isValidAge(18), true, "exactly 18");
assertEqual(isValidAge(17), false, "under 18");
```

When requirements change (new email rules, different age threshold), you update one function and all its callers automatically get the fix.

### Common mistakes and how to fix them

#### Mistake 1: Not checking type before calling string methods

```js
// WRONG
function isValidSignup(user) {
  if (!user.email.includes("@")) return false;   // TypeError if email is null/undefined!
```

**Problem:** If `user.email` is `undefined` (field not present), `.includes` throws `TypeError: Cannot read properties of undefined`.
**Fix:** Check type first: `typeof user.email !== "string"` before calling string methods.

---

#### Mistake 2: Off-by-one on the age boundary

```js
// WRONG — should allow age 18
if (user.age < 18) return false;       // 18 is valid ✓
if (user.age <= 18) return false;      // 18 is invalid ✗ — off by one!

// Read the requirement: "age is a number >= 18"
// So 18 must be valid. Use: if (user.age < 18) return false;
```

**Problem:** The boundary condition `age <= 18` excludes exactly 18, which the spec says should be valid.
**Fix:** Write a test for the boundary value first: `assertEqual(isValidAge(18), true, "18 is valid")`. If this test fails, fix the condition.

---

#### Mistake 3: Duplicating validation in `countInvalidSignups`

```js
// WRONG
function countInvalidSignups(users) {
  let count = 0;
  for (const user of users) {
    // Reimplementing isValidSignup:
    if (!user || !user.email.includes("@") || user.age < 18) {
      count++;
    }
  }
  return count;
}
```

**Problem:** When validation rules change, you update `isValidSignup` but forget to update this copy.
**Fix:** `if (!isValidSignup(user)) count++;` — call the function, don't inline it.

### Connection to interview problems

- **LeetCode 2678 — Number of Senior Citizens**: Validate/classify items in an array, count those meeting criteria — same as `countInvalidSignups`
- **Form validation (real-world)**: React Hook Form, Formik, Zod — all built on composable validator functions like your `isValidEmail` and `isValidAge`
- **Data pipeline validation**: Every ETL (Extract-Transform-Load) pipeline validates incoming records before inserting them into a database — `isValidSignup` at scale

### Discussion questions

1. **The spec says email must contain `@`. Is `"@"` a valid email?** By the current spec: yes — it contains `@`. A real email validator would also check for a local part, a domain, and a TLD. The right response is: implement exactly the spec given, and add a test case that documents the known limitation. `assertEqual(isValidEmail("@"), false, "@ alone is not a valid email")` would reveal the gap.

2. **Should `isValidSignup` validate `isActive`?** Only if the spec says it must be present and valid. The sample data has `isActive` but the exercise description doesn't mention it as a requirement. Adding unrequested validation is over-engineering — keep functions to their spec.

3. **`countInvalidSignups([])` returns `0`. Is that correct?** Yes — zero users means zero invalid users. This is consistent with all the other empty-array behaviors: no elements means no qualifying elements.

### Further exploration

- [Zod](https://zod.dev/) — a TypeScript-first schema validation library that takes the "composable validators" pattern to its logical conclusion; you'll use it in the TypeScript phase of the curriculum
- Read about **validation vs sanitization**: validation rejects bad input; sanitization transforms it into valid form. Both are necessary; understanding the distinction prevents security vulnerabilities (e.g., XSS from unsanitized input)
