// Day 004 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Working with a simple in-memory list of customers for a subscription service.

const customers = [
  { id: 1, firstName: "Ada", lastName: "Lovelace", isActive: true, plan: "pro" },
  { id: 2, firstName: "Alan", lastName: "Turing", isActive: false, plan: "free" },
  { id: 3, firstName: "Grace", lastName: "Hopper", isActive: true, plan: "team" },
];

/**
 * getCustomerFullNames(customers)
 * -------------------------------
 * Return an array of strings with the full names of all customers.
 *
 * Example:
 *   getCustomerFullNames(customers) =>
 *     ["Ada Lovelace", "Alan Turing", "Grace Hopper"]
 */
function getCustomerFullNames(customers) {
  // TODO: implement
}

/**
 * getActiveCustomers(customers)
 * -----------------------------
 * Return a new array containing only customers where `isActive` is true.
 *
 * Requirements:
 * - Do not modify the original `customers` array.
 */
function getActiveCustomers(customers) {
  // TODO: implement
}

/**
 * findCustomerById(customers, id)
 * -------------------------------
 * Return the customer object with the given `id`, or null if not found.
 */
function findCustomerById(customers, id) {
  // TODO: implement
}

// OPTIONAL: sanity checks
// console.log(getCustomerFullNames(customers));
// console.log(getActiveCustomers(customers));
// console.log(findCustomerById(customers, 2));
