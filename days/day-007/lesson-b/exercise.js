// Day 007 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Data quality checks for signup records.

const signupSamples = [
  { email: "alice@example.com", age: 25, isActive: true },
  { email: "bob@example", age: 17, isActive: true },
  { email: "", age: 30, isActive: false },
];

/**
 * isValidSignup(user)
 * -------------------
 * Return true if the signup record passes some basic checks:
 * - email contains "@" and is not empty
 * - age is a number >= 18
 */
function isValidSignup(user) {
  // TODO: implement
}

/**
 * countInvalidSignups(users)
 * --------------------------
 * Return how many user records fail isValidSignup.
 */
function countInvalidSignups(users) {
  // TODO: implement
}

// OPTIONAL:
// If you feel comfortable, you can copy your assertEqual helper from Lesson A
// into this file and write a few small assertions to test these functions.

// Example manual checks (using console.log is fine too):
// console.log(isValidSignup(signupSamples[0])); // expected: true
// console.log(isValidSignup(signupSamples[1])); // expected: false
// console.log(countInvalidSignups(signupSamples)); // expected: 2
