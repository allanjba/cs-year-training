## Day 002 — Lesson A (Foundations): Strings, Conditionals, and Character Scanning

### Why this matters

Text is everywhere in software. User names, email addresses, passwords, search queries, messages, log lines — almost every real application processes strings. Understanding how strings work and how to scan through them character by character is a fundamental skill.

Today you'll learn that strings are just sequences of characters, and most string problems reduce to the same linear scan pattern you practiced yesterday with arrays. The techniques are the same; only the data type changes.

You'll also work with conditionals in depth — the `if/else` logic that classifies data and makes decisions. Knowing *when* to return early and *how* to combine conditions cleanly is what separates readable code from tangled code.

### The core concept

In JavaScript, a string is a sequence of characters you can access by index:

```js
const word = "hello";
word[0]  // "h"
word[1]  // "e"
word[2]  // "l"
word[3]  // "l"
word[4]  // "o"
word.length  // 5
```

You can iterate over every character the same way you iterate over an array:

```js
for (let i = 0; i < text.length; i++) {
  const ch = text[i];
  // process character ch
}
```

Strings also come with useful built-in methods:
- `.toLowerCase()` — returns a new lowercase string; doesn't modify the original
- `.toUpperCase()` — returns a new uppercase string
- `.trim()` — removes leading and trailing whitespace
- `.includes(str)` — returns `true` if the string contains `str`
- `.length` — number of characters (not a method call — just a property)

### How it works

Let's trace through counting vowels in `"hello"`:

**The idea:** Walk every character. If it's a vowel, increment a counter.

```
text    = "hello"
vowels  = "aeiouAEIOU"
count   = 0

step 1 — "h": is "h" in vowels? no
step 2 — "e": is "e" in vowels? yes → count = 1
step 3 — "l": is "l" in vowels? no
step 4 — "l": is "l" in vowels? no
step 5 — "o": is "o" in vowels? yes → count = 2

result: 2
```

Now let's trace counting digits in `"abc123"`:

```
text  = "abc123"
count = 0

step 1 — "a": "a" >= "0" && "a" <= "9"? no
step 2 — "b": no
step 3 — "c": no
step 4 — "1": "1" >= "0" && "1" <= "9"? yes → count = 1
step 5 — "2": yes → count = 2
step 6 — "3": yes → count = 3

result: 3
```

Character comparisons in JavaScript work on character codes. `"0"` through `"9"` are consecutive in ASCII/Unicode, so `ch >= "0" && ch <= "9"` correctly identifies digit characters.

### Code implementation

```js
function countVowels(text) {
  const vowels = "aeiouAEIOU";
  let count = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (vowels.includes(ch)) {
      count++;
    }
  }

  return count;
}

console.log(countVowels("hello"));    // 2
console.log(countVowels("RHYTHM"));   // 0
console.log(countVowels(""));         // 0
```

**Breaking it down:**
- `const vowels = "aeiouAEIOU"` — we list both cases so we don't need `.toLowerCase()` on every character
- `vowels.includes(ch)` — checks if the vowel string contains the current character; this is O(10) which is effectively O(1) since the vowel list is always the same fixed size
- The loop runs `text.length` times — O(n) overall

```js
function countDigits(text) {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch >= "0" && ch <= "9") {
      count++;
    }
  }
  return count;
}

console.log(countDigits("abc123"));   // 3
console.log(countDigits("no nums"));  // 0
console.log(countDigits("007"));      // 3
```

**Breaking it down:**
- `ch >= "0" && ch <= "9"` — character range check for digits; works because "0"-"9" are sequential in Unicode
- `&&` means *both* conditions must be true — `ch` must be at least "0" *and* at most "9"

```js
function isLongerThan(text, n) {
  return text.length > n;
}

function caseInsensitiveEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

console.log(isLongerThan("hello", 3));           // true
console.log(caseInsensitiveEqual("Hello", "hello"));  // true
```

**Why `.toLowerCase()` instead of `.toUpperCase()`?**
Either works for comparison. Convention favors lowercase for normalization, but the important thing is that *both sides* get the same treatment.

### Common pitfalls

**1. Calling `.toLowerCase()` mutates the string — no, it doesn't**

```js
let s = "HELLO";
s.toLowerCase();  // returns "hello" — but s is still "HELLO"!
console.log(s);   // "HELLO"
```

Strings in JavaScript are **immutable**. Methods like `.toLowerCase()` return *new* strings; they don't change the original. Always capture the result:

```js
const lower = s.toLowerCase();
```

**2. Confusing `length` property with a method call**

```js
text.length    // correct: property, no parentheses
text.length()  // wrong: TypeError, length is not a function
```

`length` is a property, not a method. Don't put parentheses after it.

**3. Using `==` for character comparison**

Always use `===` when comparing characters. `"1" == 1` is `true` in JavaScript (type coercion), but `"1" === 1` is `false`. When checking characters, you always want strict equality.

**4. Off-by-one in string length**

The last valid index in a string of length `n` is `n - 1`. If you write `i <= text.length` in your loop condition, you'll read `text[text.length]` which is `undefined`. The safe condition is `i < text.length`.

**5. Not handling empty strings**

Empty strings are valid input. A well-written function returns sensible results for `""`. `countVowels("")` should return `0`, not crash. Our loop simply never executes for empty strings — the `text.length` is 0, so `i < 0` is immediately false. Always verify your code handles empty input correctly.

### Computer Science foundations

**Time Complexity:** O(n) where n is the length of the string.
- We visit each character exactly once.
- Each check (`includes`, comparison) costs O(1) per character.
- Total work scales linearly with string length.

**Space Complexity:** O(1).
- We only use a counter variable.
- We don't create new strings or arrays.

**A note on `includes` inside a loop:**
`vowels.includes(ch)` is O(k) where k is the length of the vowels string (10 characters). Since k is a fixed constant, this is O(1) per iteration. If we were checking against a list that grows with the input, that would change the analysis.

**String immutability:**
Unlike arrays, strings in JavaScript cannot be modified in place. `text[0] = "X"` silently does nothing. If you need to "modify" a string, you must build a new one. This is a common source of confusion for new developers.

### Real-world applications

- **Form validation**: Check that an email contains "@", a password is long enough, a phone number contains only digits
- **Search and filtering**: Case-insensitive search, checking if a message contains a keyword
- **Data cleaning**: Count and identify non-alphabetic characters in user input
- **Log analysis**: Scan log lines for specific patterns, count error occurrences
- **Natural language processing**: Word counts, character frequencies, text statistics

### Before the exercise

In the exercise file, you'll implement functions that:

1. **Check string properties** — Is a string longer than N characters?
2. **Normalize and compare** — Are two strings equal when case is ignored?
3. **Scan character by character** — Count digits in a string

As you implement each function:
- Think about what constitutes a valid input. What if `text` is an empty string?
- Remember that string methods return new values — they don't modify the original.
- Trace through a small example by hand before writing the code.

The same linear scan pattern from Day 1 applies here — you're just scanning a string instead of an array of numbers.
