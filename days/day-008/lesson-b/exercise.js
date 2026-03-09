// Day 008 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Daily account summary for a fintech-style app.

const dailyTransactions = [
  { id: 1, type: "credit", amount: 100 },
  { id: 2, type: "debit", amount: 40 },
  { id: 3, type: "credit", amount: 10 },
];

/**
 * totalCredits(transactions)
 * --------------------------
 * Return the total amount of all "credit" transactions.
 */
function totalCredits(transactions) {
  // TODO: implement
}

/**
 * totalDebits(transactions)
 * -------------------------
 * Return the total amount of all "debit" transactions.
 */
function totalDebits(transactions) {
  // TODO: implement
}

/**
 * buildDailySummary(transactions)
 * -------------------------------
 * Return an object like:
 *   {
 *     totalCredits: number,
 *     totalDebits: number,
 *     netBalance: number
 *   }
 *
 * where netBalance = totalCredits - totalDebits.
 */
function buildDailySummary(transactions) {
  // TODO: implement (can reuse totalCredits/totalDebits)
}

// OPTIONAL: manual checks
// console.log(buildDailySummary(dailyTransactions));
