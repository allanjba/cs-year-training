// Day 018 — Lesson A (Foundations): Stacks
// Tech: js (JavaScript)

// ------------------------------------------------------------

/**
 * isBalanced(str)
 * ---------------
 * Return true if the brackets in str are properly balanced and nested,
 * false otherwise. The three bracket types are: () {} []
 *
 * Rules:
 * - Every opener must be closed by its matching closer.
 * - Closers must match the most recent unmatched opener (correct nesting).
 * - Non-bracket characters are ignored.
 *
 * @param {string} str
 * @returns {boolean}
 *
 * @example
 * isBalanced("({[]})")       // true
 * isBalanced("({[}])")       // false  — wrong nesting order
 * isBalanced("(")             // false  — unclosed opener
 * isBalanced(")")             // false  — closer without opener
 * isBalanced("hello")        // true   — no brackets
 * isBalanced("a(b[c]d)e")   // true   — brackets among other chars
 */
function isBalanced(str) {
  // TODO: implement
  // Hint: use an array as a stack (push openers, pop when you see a closer).
  // Map each closer to its expected opener: { ')': '(', '}': '{', ']': '[' }
  // Check: stack is non-empty AND top matches expected opener.
  // After the loop: return stack.length === 0 (all openers were closed).
}

// ------------------------------------------------------------

/**
 * reverseWords(sentence)
 * ----------------------
 * Return the sentence with its words in reversed order.
 * Use a stack to reverse them (push each word, pop all words into result).
 *
 * Words are separated by single spaces. The result should have no leading
 * or trailing spaces.
 *
 * @param {string} sentence
 * @returns {string}
 *
 * @example
 * reverseWords("hello world")            // "world hello"
 * reverseWords("the quick brown fox")    // "fox brown quick the"
 * reverseWords("one")                    // "one"
 * reverseWords("")                        // ""
 */
function reverseWords(sentence) {
  // TODO: implement
  // Hint: split the sentence into words, push each onto a stack (array),
  // then pop all words off and join them with spaces.
  // Handle the empty string edge case.
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// console.log(isBalanced("({[]})"));       // true
// console.log(isBalanced("({[}])"));       // false
// console.log(isBalanced("("));            // false
// console.log(isBalanced(")"));            // false
// console.log(isBalanced(""));             // true
// console.log(isBalanced("hello"));        // true
// console.log(isBalanced("a(b[c]d)e"));   // true
// console.log(isBalanced("([)]"));         // false  — wrong nesting
// console.log(isBalanced("((()))"));       // true   — deeply nested

// console.log(reverseWords("hello world"));          // "world hello"
// console.log(reverseWords("the quick brown fox"));  // "fox brown quick the"
// console.log(reverseWords("one"));                  // "one"
// console.log(reverseWords(""));                     // ""
