## Day 007 — Lesson B (Applied) review notes

### Core checks

- `isValidSignup`:
  - Rejects empty emails and ones without `"@"`.
  - Rejects ages under 18 or non-numeric ages.
- `countInvalidSignups`:
  - Correctly counts how many records fail validation.

### Discussion prompts

- How strict would you make these rules in a real system?
- Did you write any assertions or console-based checks to validate behavior?
- How might these rules change if you had to support more complex requirements
  (e.g., email domain restrictions, country-specific age rules)?

### Real-world tie-in

- Simple validation like this is everywhere: signup forms, import scripts,
  and background jobs that clean data.
- Combining validation rules with basic testing habits is a core professional skill.\*\*\*
