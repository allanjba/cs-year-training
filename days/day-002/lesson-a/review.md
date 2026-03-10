## Day 002 — Lesson A Review: Strings, Conditionals, and Character Scanning

### What you should have learned

1. **Strings are immutable**: String methods return new values — they never modify the original string.
2. **Normalize once, check many times**: Call `.toLowerCase()` at the top of the function, not inside each condition.
3. **Type safety at function boundaries**: Check `typeof` before calling string methods to avoid `TypeError` on unexpected input.
4. **Character range checks**: `ch >= "0" && ch <= "9"` is idiomatic JavaScript for digit detection, using Unicode ordering.
5. **O(n) string scanning**: The same linear scan pattern from arrays applies directly to strings.

### Reviewing your implementation

#### Function 1: `isLongerThan(text, maxLength)`

```js
function isLongerThan(text, maxLength) {
  if (text == null) return false;
  return text.length > maxLength;
}

console.log(isLongerThan("hello", 3));    // true
console.log(isLongerThan("hi", 5));       // false
console.log(isLongerThan("", 0));         // false
console.log(isLongerThan(null, 3));       // false
```

**Key insights:**
- `text == null` catches both `null` and `undefined` in one check (one of the rare appropriate uses of `==`)
- `.length` is a property, not a method — no parentheses
- No loop needed: `.length` answers in O(1)

**Edge cases handled:**
- `null`/`undefined` → `false` instead of `TypeError`
- Empty string → `false` for any positive `maxLength`
- `maxLength = 0` → `true` only if the string has characters

---

#### Function 2: `areEqualIgnoreCase(a, b)`

```js
function areEqualIgnoreCase(a, b) {
  if (a == null || b == null) return false;
  return a.toLowerCase() === b.toLowerCase();
}

console.log(areEqualIgnoreCase("Hello", "hello"));   // true
console.log(areEqualIgnoreCase("ABC", "abc"));        // true
console.log(areEqualIgnoreCase("Hi", "Bye"));         // false
console.log(areEqualIgnoreCase(null, "hello"));       // false
```

**Key insights:**
- Normalize both sides: `a.toLowerCase() === b.toLowerCase()`
- `.toLowerCase()` returns a new string — `a` and `b` are unchanged after the call
- Guard both arguments: if either is `null`/`undefined`, comparison is meaningless → `false`

**Edge cases handled:**
- Either argument `null`/`undefined` → `false`
- Mixed-case same word → `true`
- Different words → `false`

---

#### Function 3: `countDigits(text)`

```js
function countDigits(text) {
  if (typeof text !== "string") return 0;
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch >= "0" && ch <= "9") {
      count++;
    }
  }
  return count;
}

console.log(countDigits("Room 101B"));   // 3
console.log(countDigits("abc"));         // 0
console.log(countDigits("007"));         // 3
console.log(countDigits(""));            // 0
```

**Key insights:**
- `typeof text !== "string"` guards against non-string inputs (numbers, null, arrays)
- Character comparison uses Unicode ordering: "0" through "9" have consecutive code points, so `>=` and `<=` work reliably
- O(n) — visits each character once

**Edge cases handled:**
- Non-string input → `0`
- Empty string → `0` (loop never runs)
- All digits → count equals string length

### Going deeper

#### Extension 1: Count any character category with a predicate

Instead of hardcoding what you're counting, accept a predicate:

```js
function countCharsWhere(text, predicate) {
  if (typeof text !== "string") return 0;
  let count = 0;
  for (const ch of text) {
    if (predicate(ch)) count++;
  }
  return count;
}

const isDigit  = ch => ch >= "0" && ch <= "9";
const isVowel  = ch => "aeiouAEIOU".includes(ch);
const isLetter = ch => (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");

console.log(countCharsWhere("Room 101B", isDigit));   // 3
console.log(countCharsWhere("hello", isVowel));        // 2
console.log(countCharsWhere("abc 123", isLetter));     // 3
```

This is the higher-order function pattern (a function that accepts another function) — the same idea as `anyMatch` from Day 3.

#### Extension 2: Character category summary in one pass

```js
function categorizeChars(text) {
  if (typeof text !== "string") return null;
  let digits = 0, letters = 0, spaces = 0, other = 0;

  for (const ch of text) {
    if (ch >= "0" && ch <= "9") digits++;
    else if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) letters++;
    else if (ch === " ") spaces++;
    else other++;
  }

  return { digits, letters, spaces, other, total: text.length };
}

console.log(categorizeChars("Hello, World! 42"));
// { digits: 2, letters: 10, spaces: 2, other: 2, total: 16 }
```

One pass, four counters — the multi-accumulator pattern.

### Common mistakes and how to fix them

#### Mistake 1: Calling `.toLowerCase()` without capturing the result

```js
// WRONG
function areEqualBroken(a, b) {
  a.toLowerCase();   // result discarded — strings are immutable
  b.toLowerCase();
  return a === b;    // still comparing original values
}

console.log(areEqualBroken("Hello", "hello"));  // false — bug!
```

**Problem:** String methods return new strings. The original is unchanged.
**Fix:** `return a.toLowerCase() === b.toLowerCase()` — compare the return values.

---

#### Mistake 2: Using `.length()` with parentheses

```js
// WRONG
function isLongerBroken(text, n) {
  return text.length() > n;  // TypeError: text.length is not a function
}
```

**Problem:** `length` is a property, not a method.
**Fix:** `text.length` — no parentheses.

---

#### Mistake 3: Not guarding against null before calling string methods

```js
// WRONG
function countDigitsBroken(text) {
  let count = 0;
  for (let i = 0; i < text.length; i++) {   // TypeError if text is null
    if (text[i] >= "0" && text[i] <= "9") count++;
  }
  return count;
}

countDigitsBroken(null);  // Uncaught TypeError
```

**Problem:** Accessing `.length` on `null` throws immediately.
**Fix:** `if (typeof text !== "string") return 0;` at the start.

### Connection to interview problems

- **LeetCode 125 — Valid Palindrome**: Normalize (remove non-alphanumeric, lowercase) then scan — directly uses the character classification from `countDigits`
- **LeetCode 387 — First Unique Character in a String**: Scan characters into a frequency map, find first with count 1 — combines today's scan with Day 6's frequency map
- **LeetCode 242 — Valid Anagram**: Count character frequencies for two strings, compare — `countDigits` logic applied to all letters
- **LeetCode 14 — Longest Common Prefix**: Compare strings character by character — uses the same indexed loop

### Discussion questions

1. **Why `typeof text !== "string"` in `countDigits` rather than `text == null`?** `text == null` catches `null` and `undefined`, but misses passing a number like `123`. Calling `(123).length` returns `undefined`, so the loop would silently never run instead of throwing. `typeof text !== "string"` is a stricter, more explicit guard that handles all non-string types consistently.

2. **`areEqualIgnoreCase` converts to lowercase. Would `.toUpperCase()` work equally well?** Yes — what matters is that both sides are transformed the same way. Lowercase is a convention, not a requirement.

3. **The digit check `ch >= "0" && ch <= "9"` relies on Unicode ordering. Is it safe?** For ASCII digits (U+0030 through U+0039), yes. But Arabic-Indic digits (٠-٩, U+0660 through U+0669) would not be matched. For production internationalized software, use a regex like `/\d/` or Unicode-aware APIs. For this curriculum, the ASCII check is correct and expected.

### Further exploration

- MDN: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) — full list of string methods and their immutability guarantees
- MDN: [Unicode character encodings](https://developer.mozilla.org/en-US/docs/Glossary/Unicode) — why character range comparisons work
