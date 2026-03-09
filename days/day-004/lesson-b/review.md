## Day 004 — Lesson B (Applied) review notes

### Core checks

- `getCustomerFullNames`:
  - Uses the correct `firstName` and `lastName` fields.
  - Returns a new array of strings.
- `getActiveCustomers`:
  - Filters only `isActive === true`.
  - Does not mutate the original `customers` array.
- `findCustomerById`:
  - Returns the correct customer or `null` when not found.

### Discussion prompts

- How do these helpers relate to the ones you wrote in Lesson A?
- If the business added more fields (e.g. `email`, `country`), would your code
  be easy to extend?
- How would you test these helpers automatically if you had a test framework?

### Real-world tie-in

- This kind of “small customer utility” code shows up in:
  - internal admin tools,
  - data cleanup scripts,
  - quick one-off analyses.
- Getting comfortable with arrays of objects now will pay off later in API and DB work.\*\*\*
