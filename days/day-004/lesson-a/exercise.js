// Day 004 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Today you will work with objects and arrays of objects representing users.
// For each function you write, add:
// - A brief Big-O time complexity comment.
// - At least one non-trivial edge case in a comment.

const sampleUsers = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", age: 28 },
  { id: 2, firstName: "Alan", lastName: "Turing", age: 17 },
  { id: 3, firstName: "Grace", lastName: "Hopper", age: 35 },
];

/**
 * getFullName(user)
 * -----------------
 * Given a user object with firstName and lastName, return "First Last".
 *
 * Requirements:
 * - If either name is missing, treat the missing part as an empty string.
 */
function getFullName(user) {
  // TODO: implement
}

/**
 * listFullNames(users)
 * --------------------
 * Given an array of user objects, return an array of full name strings.
 *
 * Example:
 *   listFullNames(sampleUsers) => ["Ada Lovelace", "Alan Turing", "Grace Hopper"]
 */
function listFullNames(users) {
  // TODO: implement (use a loop, not Array.map for practice)
}

/**
 * getAdultUsers(users)
 * --------------------
 * Return a new array containing only users with age >= 18.
 *
 * Requirements:
 * - Do not modify the original `users` array.
 */
function getAdultUsers(users) {
  // TODO: implement
}

/**
 * findUserById(users, id)
 * -----------------------
 * Return the first user object whose `id` matches the given id, or null
 * if no such user exists.
 */
function findUserById(users, id) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(listFullNames(sampleUsers));
// console.log(getAdultUsers(sampleUsers));
// console.log(findUserById(sampleUsers, 2));
