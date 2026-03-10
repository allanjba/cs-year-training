## Day 007 — Lesson B (Applied): Data Quality Checks for Signups

### Why this matters

When users fill out a signup form, they can enter anything. Empty fields, made-up emails, ages in the hundreds, duplicate accounts. Before this data reaches your database, your application should validate it — catch problems early, before they cause bugs downstream or corrupt your data.

Data validation is fundamentally a classification problem: given a record, is it valid or invalid? And once you can classify one record, you can classify a whole list of records and count the bad ones.

In Lesson A, you built assertion tools. Now you'll use that testing mindset to write validation rules *and* write tests that verify those rules. This is a complete loop: write the rules, write tests for the rules, run the tests, iterate until they all pass.

### The core concept

A **validation rule** is a function that takes a record and returns whether it's valid. Each rule expresses one specific requirement:

```
isValidEmail:     must contain "@" and at least one "."
isValidAge:       must be a positive integer, realistically 13–120
isValidRecord:    all required fields present, no rule violations
```

The tricky part isn't writing the checks — you already know how to do that. The tricky part is **thinking about edge cases**: What counts as a valid email? What about `@.com`? What about age `0`? What about `null`?

Writing test cases forces you to make those decisions explicit. Before you write `isValidAge`, you write:

```js
assertEqual(isValidAge(25), true, "normal adult age");
assertEqual(isValidAge(0), false, "zero is not a valid age");
assertEqual(isValidAge(-5), false, "negative age is invalid");
assertEqual(isValidAge(200), false, "unrealistically high age");
assertEqual(isValidAge(13), true, "minimum valid age");
```

These tests *define* what valid means. The implementation just satisfies the definition.

### How it works

Let's trace through validating a user record:

```js
const user = { email: "alice@example.com", age: 25, isActive: true };
```

**Is the email valid?**
```
email = "alice@example.com"
contains "@"? yes
contains "."? yes
→ valid
```

**Is the age valid?**
```
age = 25
typeof age === "number"? yes
Number.isInteger(25)? yes
25 >= 13? yes
25 <= 120? yes
→ valid
```

**Is the record valid?**
```
isValidEmail("alice@example.com")? yes
isValidAge(25)? yes
All checks passed → valid
```

**Now a bad record:**
```js
const bad = { email: "notanemail", age: -3, isActive: true };
```

```
isValidEmail("notanemail")?
  contains "@"? no → invalid immediately

isValidAge(-3)?
  -3 >= 13? no → invalid immediately

→ record is invalid
```

### Code implementation

```js
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  if (!email.includes("@")) return false;
  if (!email.includes(".")) return false;
  return true;
}

// Tests
assertEqual(isValidEmail("alice@example.com"), true, "valid email");
assertEqual(isValidEmail("notanemail"), false, "missing @ symbol");
assertEqual(isValidEmail("missing@dot"), false, "missing dot");
assertEqual(isValidEmail(""), false, "empty string");
assertEqual(isValidEmail(null), false, "null is not a valid email");
```

**Breaking it down:**
- Check the type first — `null`, numbers, and arrays shouldn't be valid emails, and calling `.includes()` on them would throw an error
- Each rule is a separate `if`-check for clarity and easy maintenance
- Return `true` only after all checks pass

```js
function isValidAge(age) {
  if (typeof age !== "number") return false;
  if (!Number.isInteger(age)) return false;
  if (age < 13) return false;
  if (age > 120) return false;
  return true;
}

// Tests
assertEqual(isValidAge(25), true, "normal age");
assertEqual(isValidAge(13), true, "minimum valid age");
assertEqual(isValidAge(120), true, "maximum valid age");
assertEqual(isValidAge(12), false, "one below minimum");
assertEqual(isValidAge(0), false, "zero is invalid");
assertEqual(isValidAge(-5), false, "negative is invalid");
assertEqual(isValidAge(200), false, "unrealistically high");
assertEqual(isValidAge(25.5), false, "fractional age is invalid");
assertEqual(isValidAge("25"), false, "string is not valid");
```

```js
function isValidRecord(user) {
  if (!user) return false;
  if (!isValidEmail(user.email)) return false;
  if (!isValidAge(user.age)) return false;
  return true;
}

function countInvalidRecords(users) {
  let count = 0;
  for (const user of users) {
    if (!isValidRecord(user)) {
      count++;
    }
  }
  return count;
}

// Tests
const users = [
  { email: "alice@example.com", age: 30 },   // valid
  { email: "notanemail", age: 25 },            // invalid email
  { email: "bob@test.com", age: -1 },          // invalid age
  { email: "carol@site.org", age: 42 },        // valid
];

assertEqual(countInvalidRecords(users), 2, "two invalid records");
assertEqual(countInvalidRecords([]), 0, "no records means no invalid records");
```

### Common pitfalls

**1. Not checking the type before calling methods**

```js
function isValidEmailBroken(email) {
  return email.includes("@");  // TypeError if email is null/undefined!
}
```

Always check that you have the right type before calling methods. `null.includes(...)` throws a TypeError.

**2. Boundary conditions are always tricky**

```js
if (age < 13)  // age 13 is valid (the check fails for 13, as intended)
if (age <= 13) // age 13 is invalid (off by one!)
```

For any `>` or `<` check involving a threshold, manually verify: "Is the threshold value itself valid or invalid?" Then use `<`, `<=`, `>`, or `>=` accordingly.

**3. Testing only invalid cases**

```js
// Don't just test that bad data fails — test that good data passes
assertEqual(isValidAge(25), true, "normal age should pass");  // test the happy path too
```

A function that always returns `false` passes all your "invalid" tests but fails in production when given real data.

**4. Validation rules changing**

What's a "valid" email today might need to change later (add length limits, block certain domains). Keep each validation rule in its own function so you can update it in one place. Don't inline validation logic into `isValidRecord` directly.

**5. Confusing "invalid" with "missing"**

A missing email (`user.email === undefined`) and an invalid email (`"notanemail"`) both fail validation, but they're different problems. For now, treat both as invalid. In production systems, you might want to distinguish between "field is missing" and "field has a bad value" to give users better error messages.

### Computer Science foundations

**Time Complexity:**
- `isValidEmail`, `isValidAge`, `isValidRecord`: O(m) where m is the string length for the email check; effectively O(1) for fixed-size inputs
- `countInvalidRecords(users)`: O(n) where n = number of users, assuming each validation is O(1)

**Space Complexity:** O(1) — no new data structures, just boolean logic.

**Defense in depth:**
Validation typically happens at multiple layers:
1. **Client side** (browser/app): Fast feedback for the user
2. **Server side** (your API): Authoritative, can't be bypassed
3. **Database level** (constraints): Last line of defense

The functions you're writing today represent server-side validation. Never trust client-side validation alone — a user can bypass it.

**Single Responsibility Principle:**
Each validation function does one thing: `isValidEmail` checks email, `isValidAge` checks age. `isValidRecord` composes them. This separation makes it easy to:
- Update one rule without affecting others
- Add new rules by adding a new function
- Test each rule independently

### Real-world applications

- **Signup flows**: Validate all fields before creating an account
- **API input validation**: Reject requests with malformed data before processing
- **CSV import**: Check imported data rows before inserting into the database
- **Configuration files**: Validate settings on startup, fail fast with clear error messages
- **Form builders (Typeform, Google Forms)**: Apply per-field validation rules

Validation code is unglamorous but critically important. A missing validation is how bad data gets into your system, causes bugs, and sometimes exposes security vulnerabilities (like SQL injection or XSS).

### Before the exercise

In the exercise file, you'll implement:

1. **`isValidEmail(email)`** — Return `true` if the email is a string containing `@` and `.`
2. **`isValidAge(age)`** — Return `true` for integer ages in a reasonable range
3. **`isValidRecord(user)`** — Return `true` only if both email and age are valid
4. **`countInvalidRecords(users)`** — Count records where `isValidRecord` returns false

For each validation function, write assertions that:
- Confirm valid inputs return `true`
- Confirm each type of invalid input returns `false`
- Test boundary values (the exact threshold, one above, one below)
- Test null/undefined/wrong type inputs

Write the tests *before* the implementation if you can. Think: "What inputs should make this return `false`?" and write those tests. Then implement to make them pass.
