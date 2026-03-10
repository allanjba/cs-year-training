## Day 002 — Lesson B (Applied): Support Inbox Triage

### Why this matters

Any company with customers has a support inbox. As the volume of messages grows, teams need automated ways to prioritize — to flag urgent issues so they get handled first, and let routine questions wait.

In Lesson A, you learned to scan strings character by character and apply conditions. Now you'll apply those skills to a real problem: classifying customer support messages as "urgent" or "routine" based on their content, and counting how many need immediate attention.

This is exactly the kind of small automation script that saves teams hours every day. You're building the logic that could power an email triage tool.

### The core concept

**Classification** means taking an input and putting it into one of several categories based on rules. Here, the categories are "urgent" and "not urgent," and the rules involve string matching:

- Does the subject contain the word "urgent"?
- Does it contain "broken" or "down"?
- Does it contain "billing" combined with "error"?

Each rule translates directly into a condition. Combining rules uses `&&` (both must be true) and `||` (either can be true).

The key insight: turn fuzzy human rules ("flag anything that sounds urgent") into precise, testable code ("return true if the subject contains any of these keywords").

### How it works

Let's trace through classifying a few messages:

**Rules:**
1. Contains "urgent" (case-insensitive) → urgent
2. Contains "broken" or "down" → urgent
3. Contains "billing" AND "error" → urgent

**Message 1:** `"Urgent: My account is locked"`
```
lowercase: "urgent: my account is locked"
contains "urgent"? yes → urgent
```

**Message 2:** `"The login page is broken"`
```
lowercase: "the login page is broken"
contains "urgent"? no
contains "broken"? yes → urgent
```

**Message 3:** `"Billing error on last invoice"`
```
lowercase: "billing error on last invoice"
contains "urgent"? no
contains "broken"? no
contains "down"? no
contains "billing"? yes AND contains "error"? yes → urgent
```

**Message 4:** `"Question about pricing plans"`
```
lowercase: "question about pricing plans"
contains "urgent"? no
contains "broken"? no
contains "down"? no
contains "billing" + "error"? no
→ not urgent
```

### Code implementation

```js
function isUrgent(subject) {
  const lower = subject.toLowerCase();

  if (lower.includes("urgent")) return true;
  if (lower.includes("broken")) return true;
  if (lower.includes("down")) return true;
  if (lower.includes("billing") && lower.includes("error")) return true;

  return false;
}

console.log(isUrgent("Urgent: Account locked"));          // true
console.log(isUrgent("The login page is broken"));        // true
console.log(isUrgent("Billing error on last invoice"));   // true
console.log(isUrgent("Question about pricing plans"));    // false
console.log(isUrgent("System is DOWN"));                  // true
```

**Breaking it down:**
- `const lower = subject.toLowerCase()` — normalize once, check many times; this is more efficient and cleaner than calling `.toLowerCase()` inside every condition
- Each `if ... return true` is an early exit: as soon as we find a reason the message is urgent, we stop checking
- `return false` at the end is the "none of the above" case — if no rule fired, it's not urgent

```js
function countUrgentMessages(subjects) {
  let count = 0;
  for (const subject of subjects) {
    if (isUrgent(subject)) {
      count++;
    }
  }
  return count;
}

const inbox = [
  "Urgent: My account is locked",
  "Question about pricing",
  "The app is broken",
  "Following up on my order",
  "Billing error — please help",
];

console.log(countUrgentMessages(inbox));  // 3
```

**Breaking it down:**
- We reuse `isUrgent` rather than duplicating its logic — this is **function composition**: build small pieces, then combine them
- `countUrgentMessages` doesn't need to know *how* urgency is determined — it just calls `isUrgent` and trusts the result

### Common pitfalls

**1. Case sensitivity**

```js
// Wrong: misses "Urgent", "URGENT", "uRgEnT"
function isUrgentBroken(subject) {
  return subject.includes("urgent");  // only matches lowercase
}
```

Always normalize case before matching. Convert to lowercase once at the start of the function and use that everywhere.

**2. Overly broad keywords**

The keyword `"down"` will match "download", "countdown", "markdown". You need to think about false positives. In a real system, you might check for whole words (`" down "` with spaces, or regex word boundaries). For this exercise, simple substring matching is fine — but in production, you'd need to think about precision.

**3. Combining `&&` and `||` without parentheses**

```js
// What does this mean?
if (lower.includes("billing") || lower.includes("charge") && lower.includes("error")) {
```

JavaScript evaluates `&&` before `||`, so this reads as: `billing OR (charge AND error)`. That may not be what you intended. Use parentheses to make it explicit:

```js
if ((lower.includes("billing") || lower.includes("charge")) && lower.includes("error")) {
```

When in doubt, add parentheses. They make intent clear and prevent bugs.

**4. Duplicating classification logic**

```js
// Wrong: logic is duplicated, now you have to maintain two places
function countUrgent(subjects) {
  let count = 0;
  for (const s of subjects) {
    const lower = s.toLowerCase();
    if (lower.includes("urgent") || lower.includes("broken")) {
      count++;
    }
  }
  return count;
}
```

If the urgency rules change, you'd have to update both `isUrgent` and `countUrgent`. Extract the logic into a single function (`isUrgent`) and call it from everywhere.

### Computer Science foundations

**Time Complexity:**
- `isUrgent(subject)`: O(m) where m is the length of the subject. Each `.includes()` scan is O(m), and we do a constant number of them.
- `countUrgentMessages(subjects)`: O(n × m) where n is the number of messages and m is the average message length. For each of n messages, we do O(m) work.

**Space Complexity:** O(m) for the lowercase copy of the string. O(1) additional for the counter.

**Early exit in classification:**
Once we find a rule that matches, we return immediately. This means for messages that are "obviously urgent" (e.g., they contain "urgent" right at the start), we do less work. For messages that are "not urgent," we must check all rules before concluding that.

This is an example of **best case** vs **worst case** behavior: best case is O(1) checks (first rule matches), worst case is O(number of rules) checks.

**Function composition:**
`countUrgentMessages` calls `isUrgent` for each message. This is composition — building larger behaviors from smaller, reusable pieces. It's a core design principle. Well-composed code is easier to test, change, and understand.

### Real-world applications

This classification pattern is everywhere:

- **Email clients (Gmail Priority Inbox)**: Automatically label emails as important based on sender, keywords, and patterns
- **Customer support tools (Zendesk, Intercom)**: Auto-assign tickets to queues based on content
- **Spam filters**: Classify messages as spam or not-spam using keyword and behavioral rules
- **Monitoring alerts (PagerDuty, OpsGenie)**: Route alerts to on-call based on severity keywords
- **Fraud detection**: Flag transactions containing certain patterns for manual review

The underlying logic is always the same: define rules, check each input against them, return a classification.

### Before the exercise

In the exercise file, you'll implement:

1. **`isUrgent(subject)`** — Return `true` if the subject matches any urgency rule
2. **`countUrgentMessages(subjects)`** — Count urgent messages in an array, reusing `isUrgent`

As you implement, think about:
- What does "urgent" mean precisely? Write the rules down in comments before coding.
- How do you handle edge cases: an empty string, a subject with only spaces?
- How would you add a new urgency rule without breaking existing ones?

This is real automation work: turning a human's classification instinct into repeatable, testable code.
