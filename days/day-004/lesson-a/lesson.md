## Day 004 — Lesson A (Foundations)

### Objectives

- Introduce **objects** and **arrays of objects** in JavaScript.
- Practice accessing and combining properties to derive new values.
- Keep using single-pass loops and simple \(O(n)\) reasoning.

### Concepts for today

- **Plain objects**:
  - Key–value pairs: `{ id: 1, name: "Alice", age: 30 }`.
  - Dot vs bracket access: `user.name` vs `user["name"]`.
- **Arrays of objects**:
  - Common in real data: lists of users, orders, products.
  - Looping over an array and reading fields on each object.
- **Deriving new information**:
  - Mapping objects to a simpler representation (e.g. full names).
  - Filtering objects by a basic condition (e.g. age ≥ 18).

### Reading + examples

```js
const user = { id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 };

function getFullName(u) {
  return `${u.firstName} ${u.lastName}`;
}

const users = [
  user,
  { id: 2, firstName: "Alan", lastName: "Turing", age: 17 },
];

function getAdultUsers(list) {
  const result = [];
  for (const u of list) {
    if (u.age >= 18) {
      result.push(u);
    }
  }
  return result;
}
```

Questions:

- What happens if `age` is missing on one of the users?
- How many times can the loop in `getAdultUsers` run in the worst case?
- When would you *not* want to return the original object (e.g. copy vs reference)?

### What you’ll implement in the exercise

In the exercise file you will:

- Work with an array of **user** objects.
- Implement helpers to:
  - Build full names.
  - Filter adults.
  - Find a user by `id`.
- Continue writing one-line **Big-O notes** for each function.***
