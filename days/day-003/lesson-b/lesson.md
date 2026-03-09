## Day 003 — Lesson B (Applied)

### Scenario: Error log scanning

You are working with a simple **backend service** that writes one log line per
event. The team wants a tiny script to:

- Detect whether the log contains any **error** events.
- Check if **all** recent events are healthy.

Today you will:

- Apply your array search patterns (`contains`, `all`, `any`) to log entries.
- Practice modeling log lines as simple strings for now.

### Concepts in play

- Using `contains`-style functions with strings and arrays.
- Deciding what makes a log line “bad” or “good” based on substrings.
- Thinking in terms of worst-case vs best-case scan behavior.

### What you’ll implement in the exercise

- Functions that:
  - Decide if a single log line looks like an error.
  - Check whether an array of logs has any errors.
  - Check whether all logs are healthy.
- A few manual checks with sample logs to see the results.
