## Day 018 — Lesson B Review: Undo/Redo History

### What you should have learned

1. **Two stacks implement undo/redo with a clear invariant**: `undoStack` holds applied actions (bottom = oldest, top = most recent); `redoStack` holds undone actions. The boundary between them is the current state.
2. **Applying a new action must clear `redoStack`**: This enforces "linear history" — once you branch to a new action, the old "future" is gone. Without clearing, redo could reapply stale actions that no longer make sense.
3. **Actions must be fully invertible**: Store enough data in each action to reverse it. A delete action must save the deleted character — without it, undo can't know what to reinsert.
4. **Return success signals from undo/redo**: Returning `false` when there's nothing to undo/redo lets callers disable UI elements or show messages. Silent no-ops are harder to use correctly.
5. **A factory function (`createHistory`) is a clean pattern for stateful objects**: Closure-based state (`let text = ""`, `const undoStack = []`) encapsulates the stacks and text without needing a class. Both approaches are valid; the factory function is idiomatic functional JavaScript.

---

### Reviewing your implementation

#### `createHistory()`

```js
function createHistory() {
  let text = "";
  const undoStack = [];
  const redoStack = [];

  function applyAction(action) {
    if (action.type === "insert") text += action.char;
    else if (action.type === "delete") text = text.slice(0, -1);
  }

  function reverseAction(action) {
    if (action.type === "insert") text = text.slice(0, -1);
    else if (action.type === "delete") text += action.char;
  }

  return {
    getText() { return text; },

    apply(action) {
      applyAction(action);
      undoStack.push(action);
      redoStack.length = 0;  // clear redo stack
    },

    undo() {
      if (undoStack.length === 0) return false;
      const action = undoStack.pop();
      reverseAction(action);
      redoStack.push(action);
      return true;
    },

    redo() {
      if (redoStack.length === 0) return false;
      const action = redoStack.pop();
      applyAction(action);
      undoStack.push(action);
      return true;
    },

    canUndo() { return undoStack.length > 0; },
    canRedo() { return redoStack.length > 0; },
  };
}
```

**Key insights:**
- `redoStack.length = 0` clears the array in place without creating a new one. Alternatively, `redoStack = []` works inside the closure (since it's `let`, not `const`) — but `length = 0` is more explicit about intent.
- `reverseAction` is the mirror image of `applyAction`: insert's reverse is delete, and delete's reverse is insert (using `action.char` to know what to restore).
- The two helper functions (`applyAction`, `reverseAction`) are private to the closure — callers can't call them directly. This encapsulation is the advantage over storing helpers as exposed methods.
- `undo` and `redo` are symmetric: undo pops from undo, pushes to redo; redo pops from redo, pushes to undo. They are exact inverses.

**Stack invariant trace:**

```
Initial: undoStack = [], redoStack = [], text = ""

apply insert "H": text="H",  undoStack=["H"], redoStack=[]
apply insert "i": text="Hi", undoStack=["H","i"], redoStack=[]
apply insert "!": text="Hi!", undoStack=["H","i","!"], redoStack=[]

undo():  pop "!" → text="Hi", undoStack=["H","i"], redoStack=["!"]
undo():  pop "i" → text="H",  undoStack=["H"],     redoStack=["!","i"]

redo():  pop "i" → text="Hi", undoStack=["H","i"], redoStack=["!"]

apply insert "?": text="Hi?", undoStack=["H","i","?"], redoStack=[]  ← "!" gone
```

**Edge cases handled:**
- `undo()` when undoStack is empty → returns `false` without touching text
- `redo()` when redoStack is empty → returns `false` without touching text
- New action after undo → redoStack cleared, previous redo history gone
- Delete action undo → uses `action.char` to reinsert the deleted character

---

### Going deeper

#### Extension 1: History with a depth limit

Real editors limit history depth to control memory. When the undo stack exceeds the limit, the oldest entry is removed:

```js
function createHistory(maxDepth = 100) {
  let text = "";
  const undoStack = [];
  const redoStack = [];

  return {
    getText() { return text; },

    apply(action) {
      if (action.type === "insert") text += action.char;
      else text = text.slice(0, -1);
      undoStack.push(action);
      if (undoStack.length > maxDepth) {
        undoStack.shift();  // remove oldest — O(n) but happens rarely
      }
      redoStack.length = 0;
    },

    // ... undo, redo, canUndo, canRedo unchanged
  };
}
```

`undoStack.shift()` removes the oldest action. It's O(n) but only happens once per `apply` when at capacity — acceptable for small history depths. For large depths, a circular buffer (fixed-size array with head/tail pointers) avoids the O(n) shift.

#### Extension 2: Batch (compound) actions

In real editors, you often want "delete word" to undo as one operation, not character by character. A compound action groups multiple actions:

```js
function compoundAction(actions) {
  return { type: "compound", actions };
}

// In applyAction:
function applyAction(action) {
  if (action.type === "compound") {
    for (const a of action.actions) applyAction(a);
  } else if (action.type === "insert") {
    text += action.char;
  } else if (action.type === "delete") {
    text = text.slice(0, -1);
  }
}

// In reverseAction:
function reverseAction(action) {
  if (action.type === "compound") {
    // Reverse each sub-action in reverse order
    for (let i = action.actions.length - 1; i >= 0; i--) {
      reverseAction(action.actions[i]);
    }
  } else if (action.type === "insert") {
    text = text.slice(0, -1);
  } else if (action.type === "delete") {
    text += action.char;
  }
}

// Usage: delete "Hi" as one undoable operation
history.apply(compoundAction([
  { type: "delete", char: "i" },
  { type: "delete", char: "H" },
]));
// One undo reverses both deletions.
```

The key insight for compound reverse: sub-actions must be reversed in reverse order. If the compound applied A then B, the reverse applies B⁻¹ then A⁻¹.

---

### Common mistakes and how to fix them

#### Mistake 1: Not clearing redoStack in apply

```js
// WRONG — redo history not cleared on new action
apply(action) {
  applyAction(action);
  undoStack.push(action);
  // BUG: forgot redoStack.length = 0
}

// Scenario:
// apply "H", apply "i", apply "!" → text = "Hi!", redoStack = []
// undo twice → text = "H", redoStack = ["!", "i"]
// apply "?" → text = "H?", undoStack = [..., "?"], redoStack = ["!", "i"]
// redo() → pops "i", text = "H?i"  — WRONG! "i" was typed before "?", but is now after
```

**Problem:** After the new "?" action, redoing "i" applies it to the new state — but "i" was a historical action that no longer makes sense in the current context.
**Fix:** Always `redoStack.length = 0` (or `redoStack = []`) in `apply`.

---

#### Mistake 2: Not saving deleted characters in delete actions

```js
// WRONG — delete action without char field
history.apply({ type: "delete" });  // BUG: no char stored

// In reverseAction:
function reverseAction(action) {
  if (action.type === "delete") text += action.char;  // action.char is undefined!
  // text becomes "Hi" + undefined = "Hiundefined"  — corrupted!
}
```

**Problem:** To reverse a delete, you need to know which character was deleted. Without saving it, undo inserts `undefined` into the text.
**Fix:** Always include `char` when creating delete actions. The caller is responsible for knowing what was deleted: `history.apply({ type: "delete", char: text.at(-1) })` — read the last character before removing it.

---

#### Mistake 3: Checking the wrong stack in canUndo/canRedo

```js
// WRONG — swapped checks
canUndo() { return redoStack.length > 0; },   // BUG: should be undoStack
canRedo() { return undoStack.length > 0; },   // BUG: should be redoStack
```

**Problem:** `canUndo` reports whether redo is available, and vice versa. Buttons enabled when they should be disabled and vice versa.
**Fix:** `canUndo` checks `undoStack.length > 0`; `canRedo` checks `redoStack.length > 0`. Read the method name carefully — the stack it checks matches the operation it gates.

---

### Connection to interview problems

- **"Design a text editor" (common system design / OOP interview)**: Interviewers expect you to describe the two-stack undo/redo model. The `createHistory` implementation is a direct answer to the data structure portion of this question.
- **LeetCode 155 — Min Stack**: A stack augmented with a `getMin()` operation that runs in O(1). The technique — storing extra state per stack entry — parallels storing `action.char` in delete actions.
- **LeetCode 232 — Implement Queue using Stacks**: Two stacks simulating a queue — a companion to the two-stack undo/redo pattern.
- **"Design Git" (systems design)**: Git's history is a directed acyclic graph of commits, which is the generalization of the linear two-stack model. Understanding linear history (two stacks) is the prerequisite to understanding branching history (DAG).

---

### Discussion questions

1. **After applying N actions and undoing M of them (M ≤ N), applying a new action clears the redo stack. What if instead of clearing, you stored the redo branch as an alternative history?** This is the "persistent history" model — like Git branches. It requires a tree structure instead of two stacks. Each node is a state; branches diverge on new actions. Most simple editors use linear history (clearing redo) because branching history is harder to present in a UI and rare users need it.

2. **If each insert or delete action is one character, typing a 1000-word document creates thousands of undo actions. How would you design "coarser" undo — where pressing undo reverses one word at a time?** The editor batches rapid keystrokes (characters typed within a short time window, or before a non-character event like a cursor move) into a single compound action. VS Code does this: typing a word creates one "insert" that can be undone at once. The timer/event threshold is a UX decision.

3. **`createHistory` uses closure-based state. A class-based version would use `this.#undoStack`. Which is better?** Both are correct. The factory function is more functional and avoids `this` binding issues (no risk of accidental `this` loss when passing methods as callbacks). The class is more conventional for OOP-style code and integrates better with TypeScript's `class` type system. In modern JavaScript, prefer whichever matches your codebase's style.

4. **The `apply(action)` method takes an action object created by the caller. What's the risk of storing that object directly vs. copying it?** If the caller mutates the action object after calling `apply`, the stored reference in `undoStack` now reflects the mutation — potentially corrupting history. Defensive copying (`undoStack.push({ ...action })`) prevents this. In practice, if actions are treated as immutable value objects (created once, never mutated), the risk is low. Explicit copying is safer in shared/public APIs.

---

### Further exploration

- **Command pattern**: The GoF design pattern that `createHistory` implements. *Design Patterns* (Gang of Four), Chapter: Command — describes the general form and variations (macro commands, queue-able commands, logged commands).
- **Event sourcing**: A system architecture where the application state is derived entirely from a log of events (actions). The "current state" is always the result of replaying all events from the beginning. Undo is implemented by rolling back to a snapshot and replaying a shorter history. Used in financial systems, audit trails, and distributed systems. [Martin Fowler's article on Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) is the canonical introduction.
- **CRDTs for collaborative editing**: When multiple users edit simultaneously, standard undo/redo breaks (undoing your change undoes through other users' changes). CRDTs solve this at the algorithm level. [A Conflict-Free Replicated Data Type (paper)](https://crdt.tech/) is the foundational reference.
