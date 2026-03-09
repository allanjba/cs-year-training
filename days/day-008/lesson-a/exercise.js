// Day 008 — Lesson A (Foundations)
// Tech: js (JavaScript)
//
// Mini-synthesis: work with a list of transactions.

const transactions = [
  { id: 1, type: "credit", amount: 50 },
  { id: 2, type: "debit", amount: 20 },
  { id: 3, type: "credit", amount: 30 },
];

/**
 * totalByType(transactions, type)
 * -------------------------------
 * Return the total amount for all transactions with the given type.
 *
 * Example:
 *   totalByType(transactions, "credit") => 80
 */
function totalByType(transactions, type) {
  // TODO: implement
}

/**
 * netBalance(transactions)
 * ------------------------
 * Treat "credit" as +amount and "debit" as -amount.
 * Return the net balance (number).
 *
 * Example:
 *   netBalance(transactions) => 60 (50 - 20 + 30)
 */
function netBalance(transactions) {
  // TODO: implement
}

/**
 * transactionTypeFrequency(transactions)
 * --------------------------------------
 * Return an object mapping each transaction type to how many times it appears.
 *
 * Example:
 *   transactionTypeFrequency(transactions) => { credit: 2, debit: 1 }
 */
function transactionTypeFrequency(transactions) {
  // TODO: implement
}

// OPTIONAL: manual checks
// console.log(totalByType(transactions, "credit"));
// console.log(netBalance(transactions));
// console.log(transactionTypeFrequency(transactions));
