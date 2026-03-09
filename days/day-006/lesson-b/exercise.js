// Day 006 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Simple event analytics for a product (e.g., "page_view", "signup").

const events = [
  "page_view",
  "signup",
  "page_view",
  "click_button",
  "page_view",
];

/**
 * eventFrequency(events)
 * ----------------------
 * Return an object mapping each event name to how many times it appears.
 */
function eventFrequency(events) {
  // TODO: implement
}

/**
 * mostCommonEvent(events)
 * -----------------------
 * Return the event name that appears most often, or null for an empty list.
 */
function mostCommonEvent(events) {
  // TODO: implement (can reuse eventFrequency)
}

/**
 * countSelectedEvents(events, selectedNames)
 * -----------------------------------------
 * Given an array of event names and an array of selected event names,
 * return how many events in total match any of the selected names.
 *
 * Example:
 *   countSelectedEvents(
 *     ["page_view", "signup", "page_view"],
 *     ["page_view"]
 *   ) === 2
 */
function countSelectedEvents(events, selectedNames) {
  // TODO: implement (you may find eventFrequency helpful)
}

// OPTIONAL: sanity checks
// console.log(eventFrequency(events));
// console.log(mostCommonEvent(events));
// console.log(countSelectedEvents(events, ["page_view", "signup"]));
