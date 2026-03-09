You are helping me build a structured, year-long coding training program.

## Goal

Create a self-contained project I can use to systematically improve my coding skills for
both day-to-day work and technical interview preparation. The training should be grounded
in Computer Science fundamentals (university-level concepts, not just blog posts) and
progressively build toward real-world application.

---

## IMPORTANT: Multi-Step Process

Do NOT generate lessons or files yet. Follow these steps in order, waiting for my
approval before proceeding to the next:

**Step 1** — Propose the overall curriculum structure and technology progression order.
**Step 2** — After approval, scaffold the project folder/file structure.
**Step 3** — After approval, generate lessons ONE DAY AT A TIME, only when I ask.

---

## Lesson Structure

- **2 lessons per day**, every day for 365 days:
  - **Lesson A (Foundations):** Core CS concepts — data structures, algorithms, memory,
    complexity. Grounded in university CS curriculum.
  - **Lesson B (Applied):** Real-world scenario using a fictional company as context,
    applying that day's foundational concept to a practical problem.

- Lessons within a topic can be broken into parts (1a, 1b, 1c...) when depth requires it.
- Each part should be completable in ~1 hour. Shorter is fine; avoid going much longer.
- Concepts taught in earlier lessons should be deliberately reused in later ones.
- Later technologies depend on earlier concepts — respect this dependency order.

---

## Exercise Format

Each exercise file should:

- Be ready to open and start coding immediately
- Contain instructions as comments at the top of the file (or in a separate INSTRUCTIONS.md)
- Include any necessary data files (JSON, SQLite, or DB seed scripts)
- Follow best coding standards throughout — even if it makes the solution longer

After completing an exercise, we review together:

- Discuss improvements and refactors
- Cover edge cases that weren't required but are worth knowing
- Connect back to CS theory where relevant

---

## Technologies (in rough progression order)

JavaScript → TypeScript → OOP concepts → Node.js → Ruby → Ruby on Rails →
React → APIs → SQL (PostgreSQL) → NoSQL (MongoDB) → Docker →
Terraform → Project Architecture → Data Transfer → Real-Time Data Transfer

---

## Project Structure

```
/README.md                        ← Project overview and how to use it
/plan/
  plan-1-0-0.md                   ← Full curriculum plan (versioned)
/days/
  /day-001/
    lesson-a/
      lesson.md                   ← Concept explanation
      exercise.js (or .ts, .rb)   ← Exercise file with instructions as comments
      review.md                   ← Pre-written review notes, edge cases, discussion Qs
      /data/                      ← Any seed data, JSON fixtures, SQL scripts
    lesson-b/
      (same structure)
```

- If a lesson is about file/project organization, include a nested project folder
  (e.g. /dist, /src, /project) inside the lesson folder as part of the exercise.
- Database exercises should build a reusable DB that later lessons can reference.
- Plan versions are saved as new files (plan-1-0-1.md, plan-1-0-2.md) — never overwrite.

---

## Now begin Step 1.

Propose the curriculum structure and technology progression. Show me the high-level
topic groupings by week/month, the rationale for the ordering, and any dependencies
between topics. Do not create any files yet.
