// Day 15 — Lesson B (Applied): Custom Sorting with Comparators
// Sort a product catalog in multiple ways using Array.prototype.sort.

// Sample data — a product catalog with name, price, and category.
const PRODUCTS = [
  { name: "Wireless Mouse",    price: 29.99, category: "peripherals" },
  { name: "USB-C Hub",         price: 49.99, category: "peripherals" },
  { name: "Mechanical Keyboard", price: 89.99, category: "peripherals" },
  { name: "Monitor Stand",     price: 39.99, category: "accessories" },
  { name: "Cable Organizer",   price: 12.99, category: "accessories" },
  { name: "Webcam",            price: 69.99, category: "peripherals" },
  { name: "Desk Lamp",         price: 34.99, category: "accessories" },
  { name: "Laptop Sleeve",     price: 19.99, category: "accessories" },
  { name: "Blue Light Glasses", price: 19.99, category: "accessories" },
  { name: "Notebook",          price: 8.99,  category: "office" },
];

// ------------------------------------------------------------

/**
 * Returns a new array of products sorted by price, lowest to highest.
 *
 * Must NOT mutate the original array. Return a new sorted copy.
 *
 * Hint: the numeric comparator is `(a, b) => a.price - b.price`.
 * Do NOT call .sort() without a comparator — it will sort by the string
 * representation of each object ("[object Object]"), not by price.
 *
 * @param {Array<{name: string, price: number, category: string}>} products
 * @returns {Array<{name: string, price: number, category: string}>}
 *
 * @example
 * const sorted = sortByPrice(PRODUCTS);
 * sorted[0].name  // => "Notebook"       ($8.99)
 * sorted[9].name  // => "Mechanical Keyboard" ($89.99)
 */
function sortByPrice(products) {
  // Your implementation here
}

// ------------------------------------------------------------

/**
 * Returns a new array of products sorted alphabetically by name, A to Z.
 *
 * Must NOT mutate the original array.
 *
 * Use String.prototype.localeCompare for correct alphabetical ordering.
 * Do NOT use `a.name < b.name ? -1 : 1` — it works for ASCII but breaks
 * on accented characters and locale-specific ordering rules.
 *
 * @param {Array<{name: string, price: number, category: string}>} products
 * @returns {Array<{name: string, price: number, category: string}>}
 *
 * @example
 * const sorted = sortByNameAlphabetically(PRODUCTS);
 * sorted[0].name  // => "Blue Light Glasses"
 * sorted[9].name  // => "Wireless Mouse"
 */
function sortByNameAlphabetically(products) {
  // Your implementation here
}

// ------------------------------------------------------------

/**
 * Returns a new array of products sorted by price ascending, with ties
 * broken alphabetically by name (A to Z).
 *
 * Must NOT mutate the original array.
 *
 * This is a multi-key sort. The pattern is:
 *   1. Compute the primary comparison (price diff).
 *   2. If it's non-zero, return it.
 *   3. If it's zero (tie), return the secondary comparison (name).
 *
 * There are two products priced at $19.99: "Blue Light Glasses" and
 * "Laptop Sleeve". After sorting, "Blue Light Glasses" should appear
 * before "Laptop Sleeve" (B comes before L).
 *
 * @param {Array<{name: string, price: number, category: string}>} products
 * @returns {Array<{name: string, price: number, category: string}>}
 *
 * @example
 * const sorted = sortByPriceThenName(PRODUCTS);
 * sorted[0].name  // => "Notebook"          ($8.99)
 * sorted[1].name  // => "Cable Organizer"   ($12.99)
 * sorted[2].name  // => "Blue Light Glasses" ($19.99, B before L)
 * sorted[3].name  // => "Laptop Sleeve"      ($19.99)
 */
function sortByPriceThenName(products) {
  // Your implementation here
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// console.log("--- sortByPrice ---");
// console.log(sortByPrice(PRODUCTS).map(p => `${p.name}: $${p.price}`));
// Expected order: Notebook $8.99, Cable Organizer $12.99, Blue Light Glasses $19.99,
//   Laptop Sleeve $19.99, Wireless Mouse $29.99, Desk Lamp $34.99,
//   Monitor Stand $39.99, USB-C Hub $49.99, Webcam $69.99, Mechanical Keyboard $89.99

// console.log("--- sortByNameAlphabetically ---");
// console.log(sortByNameAlphabetically(PRODUCTS).map(p => p.name));
// Expected: Blue Light Glasses, Cable Organizer, Desk Lamp, Laptop Sleeve,
//   Mechanical Keyboard, Monitor Stand, Notebook, USB-C Hub, Webcam, Wireless Mouse

// console.log("--- sortByPriceThenName ---");
// console.log(sortByPriceThenName(PRODUCTS).map(p => `${p.name}: $${p.price}`));
// Expected: Notebook $8.99, Cable Organizer $12.99,
//   Blue Light Glasses $19.99, Laptop Sleeve $19.99,  <-- tie broken by name
//   Wireless Mouse $29.99, Desk Lamp $34.99, Monitor Stand $39.99,
//   USB-C Hub $49.99, Webcam $69.99, Mechanical Keyboard $89.99

// Verify original is not mutated:
// sortByPrice(PRODUCTS);
// console.log(PRODUCTS[0].name); // => "Wireless Mouse" (unchanged)
