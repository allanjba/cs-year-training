// Day 005 — Lesson B (Applied)
// Tech: js (JavaScript)
//
// Scenario:
// Product catalog cleanup for a small online marketplace.

const products = [
  { id: 1, name: "Basic Plan", price: 10, isActive: true },
  { id: 2, name: "Legacy Plan", price: 5, isActive: false },
  { id: 3, name: "Pro Plan", price: 25, isActive: true },
];

/**
 * listActiveProductNames(products)
 * --------------------------------
 * Return a NEW array of names for products where `isActive` is true.
 */
function listActiveProductNames(products) {
  // TODO: implement
}

/**
 * filterAffordableProducts(products, maxPrice)
 * -------------------------------------------
 * Return a NEW array containing only products whose price is <= maxPrice.
 */
function filterAffordableProducts(products, maxPrice) {
  // TODO: implement
}

/**
 * filterFeaturedProducts(products, minPrice)
 * -----------------------------------------
 * Return a NEW array containing products that are:
 * - active (isActive === true) AND
 * - have price >= minPrice
 */
function filterFeaturedProducts(products, minPrice) {
  // TODO: implement
}

// OPTIONAL: sanity checks
// console.log(listActiveProductNames(products));
// console.log(filterAffordableProducts(products, 10));
// console.log(filterFeaturedProducts(products, 20));
