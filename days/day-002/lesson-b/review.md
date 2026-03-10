## Day 002 — Lesson B Review: Support Inbox Triage

### What you should have learned

1. **Classification as a function**: A classification rule is just a function — input comes in, a boolean comes out.
2. **Normalize once at the entry point**: Call `.toLowerCase()` once per function call, not once per rule check.
3. **Single source of truth**: `isUrgentSubject` owns the classification logic. `countUrgentSubjects` calls it — never duplicates it.
4. **Null safety at boundaries**: External inputs (subject lines from users or APIs) can be null; guard at the function boundary.
5. **Combining conditions**: `&&` and `||` have precedence; use parentheses to make intent explicit.

### Reviewing your implementation

#### Function 1: `isUrgentSubject(subject)`

```js
function isUrgentSubject(subject) {
  if (subject == null) return false;
  const lower = subject.toLowerCase();
  if (lower.includes("down")) return true;
  if (lower.includes("urgent")) return true;
  if (lower.includes("cannot login")) return true;
  return false;
}

console.log(isUrgentSubject("Site is down for all users"));      // true
console.log(isUrgentSubject("URGENT: cannot login to account")); // true
console.log(isUrgentSubject("Question about billing"));          // false
console.log(isUrgentSubject(null));                              // false
```

**Key insights:**
- `const lower = subject.toLowerCase()` — normalize once, check multiple times (never call `.toLowerCase()` inside each `if`)
- Each rule is a separate `if ... return true` — clear, easy to add/remove rules
- `return false` at the end is the "no rules matched" default

**Edge cases handled:**
- `null`/`undefined` → `false` instead of `TypeError`
- Mixed case input ("URGENT", "Down") → correctly matched after normalization
- Empty string → `false` (none of the includes will match)

---

#### Function 2: `countUrgentSubjects(subjects)`

```js
function countUrgentSubjects(subjects) {
  let count = 0;
  for (const subject of subjects) {
    if (isUrgentSubject(subject)) {
      count++;
    }
  }
  return count;
}

const sampleSubjects = [
  "Site is down for all users",
  "Question about billing",
  "URGENT: cannot login to account",
  "Feature request",
];

console.log(countUrgentSubjects(sampleSubjects));   // 2
console.log(countUrgentSubjects([]));               // 0
```

**Key insights:**
- Reuses `isUrgentSubject` — the classification logic lives in exactly one place
- Empty array → `0`: loop never runs, initialized count is returned
- Non-string entries are handled safely because `isUrgentSubject` guards against null

**Edge cases handled:**
- Empty subjects array → `0`
- Array with all urgent subjects → count equals array length
- Array with null/undefined entries → `isUrgentSubject` handles them, `countUrgentSubjects` stays clean

### Going deeper

#### Extension 1: Return which subjects are urgent, not just the count

```js
function getUrgentSubjects(subjects) {
  const urgent = [];
  for (const subject of subjects) {
    if (isUrgentSubject(subject)) {
      urgent.push(subject);
    }
  }
  return urgent;
}

console.log(getUrgentSubjects(sampleSubjects));
// ["Site is down for all users", "URGENT: cannot login to account"]
```

Same pattern as `countUrgentSubjects` but collects the matching subjects instead of counting them.

#### Extension 2: Priority levels instead of binary urgent/not-urgent

Real triage systems often have more than two levels:

```js
function getPriority(subject) {
  if (subject == null) return "low";
  const lower = subject.toLowerCase();
  if (lower.includes("down") || lower.includes("cannot login")) return "critical";
  if (lower.includes("urgent") || lower.includes("broken")) return "high";
  if (lower.includes("slow") || lower.includes("error")) return "medium";
  return "low";
}

function countByPriority(subjects) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const subject of subjects) {
    const priority = getPriority(subject);
    counts[priority]++;
  }
  return counts;
}
```

This extends today's binary classification into a multi-class one — the same structure, just with more categories.

### Common mistakes and how to fix them

#### Mistake 1: Calling `.toLowerCase()` inside each condition

```js
// WRONG — normalizes on every check, redundant work
function isUrgentBroken(subject) {
  if (subject == null) return false;
  if (subject.toLowerCase().includes("down")) return true;
  if (subject.toLowerCase().includes("urgent")) return true;     // second normalize
  if (subject.toLowerCase().includes("cannot login")) return true; // third normalize
  return false;
}
```

**Problem:** `.toLowerCase()` creates a new string each time. For three conditions, you allocate three temporary strings unnecessarily. Also harder to read.
**Fix:** `const lower = subject.toLowerCase()` at the top, use `lower` everywhere.

---

#### Mistake 2: Duplicating classification logic in `countUrgentSubjects`

```js
// WRONG — rules duplicated
function countUrgentSubjects(subjects) {
  let count = 0;
  for (const subject of subjects) {
    const lower = (subject || "").toLowerCase();
    if (lower.includes("down") || lower.includes("urgent") || lower.includes("cannot login")) {
      count++;
    }
  }
  return count;
}
```

**Problem:** When the urgency rules change, you must update two places. You'll miss one.
**Fix:** Call `isUrgentSubject(subject)` — let it own the rules.

---

#### Mistake 3: Operator precedence with `&&` and `||`

```js
// AMBIGUOUS — what does this mean?
if (lower.includes("cannot") || lower.includes("login") && lower.includes("error"))
```

JavaScript evaluates `&&` before `||`, so this reads as: `cannot OR (login AND error)`. If the intent was `(cannot OR login) AND error`, use parentheses:

```js
if ((lower.includes("cannot") || lower.includes("login")) && lower.includes("error"))
```

Always parenthesize compound conditions to make intent explicit.

### Connection to interview problems

- **String classification** is at the heart of many text processing problems
- **LeetCode 1108 — Defanging an IP Address**: Rule-based string transformation — same "check-and-replace" structure
- **LeetCode 2678 — Number of Senior Citizens**: Classify array elements by a rule, count matches — direct mirror of `countUrgentSubjects`
- Real systems: Gmail priority inbox, Zendesk AI triage, spam filters — all built on the same classify-then-count foundation

### Discussion questions

1. **`isUrgentSubject("download link broken")` — is this urgent?** It contains "down" (as part of "download"). This is a false positive. In production, you'd need word-boundary checks (e.g., `/ down /` with spaces, or a regex like `/\bdown\b/`). Simple `.includes()` matching is a starting point, not a production-grade solution.

2. **If the team adds 20 urgency rules, does the structure of `isUrgentSubject` still work?** Yes, structurally. But 20 `if` statements becomes hard to read. A better approach for many rules would be an array of keywords: `const urgentKeywords = ["down", "urgent", ...]; for (const kw of urgentKeywords) { if (lower.includes(kw)) return true; }`. Same logic, more maintainable.

3. **`countUrgentSubjects` calls `isUrgentSubject` on every element — could it exit early?** No. Unlike `hasAnyErrors` (where you exit on the first match), counting requires examining every element. Early exit is only possible for yes/no questions, not for accumulation.

### Further exploration

- Read about **Strategy Pattern**: a design pattern that encapsulates interchangeable behaviors — `isUrgentSubject` is essentially a strategy for "is this message high priority?" that could be swapped out for different rules
- For production text classification, look at how rule engines work — Apache Drools, or even just arrays of pattern objects — to see how this scales to hundreds of rules
