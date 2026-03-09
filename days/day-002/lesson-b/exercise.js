// Day 002 — Lesson B (Applied)
// Type: Applied
// Tech: js
//
// Scenario:
// You are labeling support email subjects as "urgent" or not based on a few
// simple rules.
//
// Use your string + conditional skills from Lesson A.

/**
 * isUrgentSubject(subject)
 * ------------------------
 * Return true if the subject line should be treated as urgent.
 *
 * For now, treat a subject as urgent if (case-insensitive):
 * - It contains the word "down" OR
 * - It contains the word "urgent" OR
 * - It contains the phrase "cannot login"
 *
 * Requirements:
 * - Handle null/undefined by returning false.
 * - Comparison should be case-insensitive.
 */
function isUrgentSubject(subject) {
  // TODO: implement
}

/**
 * countUrgentSubjects(subjects)
 * -----------------------------
 * Given an array of subject lines (strings), return how many are urgent
 * according to isUrgentSubject.
 *
 * Requirements:
 * - Do not mutate the input array.
 * - Safely handle non-string entries by treating them as non-urgent.
 */
function countUrgentSubjects(subjects) {
  // TODO: implement
}

// Sample data for manual testing:
const sampleSubjects = [
  "Site is down for all users",
  "Question about billing",
  "URGENT: cannot login to account",
  "Feature request",
];

// Uncomment after implementing:
// console.log("Urgent flags:");
// for (const s of sampleSubjects) {
//   console.log(`"${s}" ->`, isUrgentSubject(s));
// }
// console.log("Total urgent:", countUrgentSubjects(sampleSubjects));
