## Curriculum plan (v1.0.1)

This is the high-level year plan. It defines sequencing, dependencies, and the daily/weekly operating model.

### Daily structure

- **Lesson A (Foundations)**: CS concept + focused drills (implementation and/or analysis).
- **Lesson B (Applied)**: scenario work that uses Lesson A's concept in production-flavored code.

### Weekly cadence (suggested)

- **Mon–Thu**: new material
- **Fri**: synthesis + refactor day
- **Sat**: spaced-repetition review + timed interview-style sets
- **Sun**: mini-capstone slice + short retro

### Macro sequencing (dependency-guided)

#### Months 1–3 (Weeks 1–12): JavaScript → DS&A core → TypeScript

- **Foundations**: big-O, invariants, recursion/iteration, arrays/strings, hashing, sorting/searching, core patterns; TS types/generics/narrowing.
- **Applied**: CLI utilities + small libraries; testing and Git discipline from day 1.

#### Months 4–5 (Weeks 13–20): React + TypeScript (fixtures first)

- **Foundations**: DOM/events, rendering model, state/props, hooks, accessibility, performance basics.
- **Applied**: build UI against fixtures, then later replace fixtures with real APIs.

#### Months 6–7 (Weeks 21–28): Node.js + APIs + reliability

- **Foundations**: async I/O, HTTP, REST/idempotency, authn/authz, caching, background work, observability.
- **Applied**: production-flavored API; connect the React UI to real services.

#### Months 8–9 (Weeks 29–36): Ruby → Rails (SQLite first)

- **Foundations**: Ruby fluency; Rails MVC/routing/ActiveRecord/validations/testing.
- **Applied**: build a Rails slice; allow different fictional company domains when it helps vary data models.

#### Months 10–11 (Weeks 37–44): SQL (PostgreSQL) + modeling + performance (upgrade phase)

- **Foundations**: schema design, joins, transactions, indexes, query plans, migrations/constraints.
- **Applied**: upgrade prior systems from fixtures/SQLite to Postgres; perf tuning and reporting.

#### Month 12 (Weeks 45–52): NoSQL + data transfer + real-time + Terraform + capstone hardening

- **Foundations**: CAP/doc modeling, caching/invalidation, queues/pub-sub, backpressure, retries/timeouts, eventual consistency, WebSockets/SSE.
- **Applied**: activity feed/eventing + real-time UX; IaC once the system is worth describing.

### Docker policy

Docker becomes the default local runtime once multi-service work starts (around Node + DB), then stays in steady-state (not a brand-new end-of-year topic).

---

## Lesson structure guidelines (v1.0.1 addition)

Lessons should **teach**, not just list bullet points. Each lesson.md should be a complete, self-contained learning resource that explains concepts thoroughly before showing code.

### Structure for lesson.md files

```markdown
## Day X — Lesson A/B (Foundations/Applied): [Concept Name]

### Why this matters
[2-4 paragraphs explaining:]
- The real-world problem this concept solves
- Why it exists and where you'll encounter it
- Concrete, relatable scenarios (not abstract)
- Connect to previous lessons when applicable

### The core concept
[Detailed conceptual explanation BEFORE code:]
- Use analogies or real-world metaphors
- Build intuition and mental models
- Explain the "what" and "why" before the "how"
- Use ASCII diagrams if helpful
- Break complex ideas into digestible pieces

### How it works
[Step-by-step walkthrough:]
- Trace through a concrete example by hand
- Show the state at each step
- Explain the reasoning at each decision point
- Make implicit assumptions explicit
- Show the progression from input to output

### Code implementation
[Now show the code with detailed explanation:]

```js
// Well-commented, clear code
```

**Breaking it down:**
- Explain key lines or sections
- Highlight the insights that make it work
- Connect code back to the concept

**Why this works:**
[Explain the correctness of the approach]

### Common pitfalls
- [Specific mistake 1]: Why beginners make it, how to avoid it
- [Edge case 2]: What goes wrong and how to handle it
- [Misconception 3]: What people often misunderstand

### Computer Science foundations
[Ground in CS theory:]
- Time and space complexity analysis
- Data structure properties
- Algorithm design principles (greedy, divide-and-conquer, etc.)
- Connections to other algorithms or patterns
- Trade-offs being made

### Real-world applications (when relevant)
[Show where this appears in production systems, libraries, or tools]

### Before the exercise
[Brief preview of what they'll implement and what skills they'll practice]
```

### Structure for review.md files

Review files should go deeper than the lesson and provide rich discussion material.

```markdown
## Day X — Lesson A/B Review

### What you should have learned
[Core takeaways, both conceptual and practical]

### Reviewing your implementation
[Walk through the solution with detailed explanations:]

#### Function 1: [name]
```js
// Reference implementation
```

**Key insights:**
- [Why this approach works]
- [What makes it efficient/correct]

**Edge cases handled:**
- [Specific cases and how they're handled]

#### [Additional functions...]

### Going deeper

#### Extension 1: [Advanced concept]
[More sophisticated version or related technique]

#### Extension 2: [Optimization]
[How to make it faster, or handle larger scale]

### Common mistakes and how to fix them

#### Mistake 1: [Description]
```js
// Buggy code example
```
**Problem:** [What's wrong]
**Fix:** [How to correct it]

#### [Additional mistakes...]

### Connection to interview problems
[If relevant, mention specific LeetCode/interview problems that use this concept]

### Discussion questions
[Thought-provoking questions to deepen understanding:]
- What if the constraints changed (size, type, guarantees)?
- How would you test this thoroughly?
- What trade-offs did we make?
- How does this connect to concepts from earlier lessons?

### Further exploration (optional)
[Links to CS resources, papers, or advanced reading - only when genuinely valuable]
```

### Key principles

1. **Teach, don't just reference**: Assume the reader has never seen this concept before
2. **Concept before code**: Build intuition before showing implementation
3. **University-level grounding**: Connect to CS theory, not just blog-level tips
4. **Show, don't tell**: Use concrete examples and traces
5. **Anticipate confusion**: Address common misconceptions explicitly
6. **Progressive depth**: Lesson teaches core idea, review goes deeper
7. **Respect the learner's time**: Be thorough but not verbose. Clear over clever.

### What changed from v1.0.0

- Added detailed lesson structure guidelines
- Emphasized teaching over bullet points
- Added Computer Science foundations as required section
- Clarified the depth expected in both lesson.md and review.md
- Made explicit that lessons should build intuition before showing code
