## Curriculum plan (v1.0.0)

This is the high-level year plan. It defines sequencing, dependencies, and the daily/weekly operating model.

### Daily structure

- **Lesson A (Foundations)**: CS concept + focused drills (implementation and/or analysis).
- **Lesson B (Applied)**: scenario work that uses Lesson A’s concept in production-flavored code.

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
