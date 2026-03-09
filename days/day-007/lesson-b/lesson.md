## Day 007 — Lesson B (Applied)

### Scenario: Data quality checks for signups

You are helping a small product team check the quality of their **user signup**
data before it is imported into another system.

They have an array of user-like objects with fields such as `email`, `age`,
and `isActive`. You will write small checks and then use simple assertions
to confirm the checks behave as expected.

### Concepts in play

- Encoding simple **validation rules** as functions.
- Writing tiny tests to make sure the rules behave correctly.
- Reusing the testing mindset from Lesson A in a realistic scenario.

### What you’ll implement in the exercise

- Functions that:
  - Decide if a single user record is “valid enough” (basic rules only).
  - Count how many invalid records there are.
- A few assertions to test your rules on sample signup data.\*\*\*
