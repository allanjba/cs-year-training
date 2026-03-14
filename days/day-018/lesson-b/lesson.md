# Day 18 — Lesson B (Applied): Undo/Redo History

## Why this matters

Almost every editor, drawing tool, and document application has undo and redo. These feel like magic — how does an app know how to reverse what you just did? The answer is two stacks. The most recent action is always at the top of the undo stack. Pressing undo pops it and pushes it onto the redo stack. Pressing redo reverses that — pops from redo, pushes to undo.

This is a real design pattern used in production code. VS Code's undo system works this way. Gmail's "Undo send" is a delayed single-item version. The browser's back/forward buttons are two stacks. Understanding this pattern gives you the mental model for an entire class of "reversible action" problems — and a direct answer to "design an undo system" in a systems design interview.

---

## The core concept

Two stacks: `undoStack` and `redoStack`.

**Apply an action:**
1. Push the action onto `undoStack`
2. Clear `redoStack` — once you do something new, the "future" (redo history) is gone

**Undo:**
1. Pop from `undoStack`
2. Push that action onto `redoStack`
3. Return or apply the reverse of the action

**Redo:**
1. Pop from `redoStack`
2. Push that action onto `undoStack`
3. Return or apply the action again

The invariant: at any point, the sequence of items in `undoStack` (bottom to top) represents the history of applied actions in order. `redoStack` holds actions that were undone and can be reapplied.

---

## How it works (with hand trace)

```
Initial state: undoStack = [], redoStack = [], text = ""

apply("type: H")  → undoStack: ["type: H"],    redoStack: [],            text: "H"
apply("type: i")  → undoStack: ["type: H","type: i"], redoStack: [],     text: "Hi"
apply("type: !") → undoStack: ["type: H","type: i","type: !"], redoStack: [], text: "Hi!"

undo()
  pop "type: !" from undoStack → undoStack: ["type: H","type: i"]
  push "type: !" to redoStack  → redoStack: ["type: !"]
  reverse of "type: !" → delete last char → text: "Hi"

undo()
  pop "type: i" from undoStack → undoStack: ["type: H"]
  push "type: i" to redoStack  → redoStack: ["type: !","type: i"]
  reverse → text: "H"

redo()
  pop "type: i" from redoStack → redoStack: ["type: !"]
  push "type: i" to undoStack  → undoStack: ["type: H","type: i"]
  reapply → text: "Hi"

apply("type: ?")  → push to undoStack, CLEAR redoStack
  undoStack: ["type: H","type: i","type: ?"]
  redoStack: []   ← cleared! The "!" branch is gone.
  text: "Hi?"
```

Clearing redoStack on a new action is essential: once you've branched, the old "future" is no longer valid.

---

## Code implementation

```javascript
// A simple text history manager using two stacks.

class TextHistory {
  #text = "";
  #undoStack = [];
  #redoStack = [];

  getText() { return this.#text; }

  apply(action) {
    // action: { type: "insert" | "delete", char: string }
    this.#applyAction(action);
    this.#undoStack.push(action);
    this.#redoStack = [];  // Clear redo history when a new action is applied
  }

  undo() {
    if (this.#undoStack.length === 0) return false;
    const action = this.#undoStack.pop();
    this.#reverseAction(action);
    this.#redoStack.push(action);
    return true;
  }

  redo() {
    if (this.#redoStack.length === 0) return false;
    const action = this.#redoStack.pop();
    this.#applyAction(action);
    this.#undoStack.push(action);
    return true;
  }

  canUndo() { return this.#undoStack.length > 0; }
  canRedo() { return this.#redoStack.length > 0; }

  #applyAction(action) {
    if (action.type === "insert") this.#text += action.char;
    else if (action.type === "delete") this.#text = this.#text.slice(0, -1);
  }

  #reverseAction(action) {
    if (action.type === "insert") this.#text = this.#text.slice(0, -1);
    else if (action.type === "delete") this.#text += action.char;
  }
}
```

The key design decisions:
- **Actions are data, not functions**: Each action stores enough information to apply and reverse it. `{ type: "insert", char: "H" }` can be reversed by deleting the last character. `{ type: "delete", char: "H" }` saves the deleted character so it can be reinserted.
- **`apply` always clears redoStack**: This implements the "branching" behavior — a new action invalidates the redo history.
- **`undo`/`redo` return `false` when nothing to do**: Callers can use this to disable UI buttons or show "nothing to undo" messages.

---

## Common pitfalls

**Not clearing redoStack on apply**: If you apply a new action without clearing redoStack, you can redo actions that happened before the new action — producing an inconsistent state. Clearing is mandatory.

**Not saving enough information to reverse an action**: `type: "delete"` isn't enough for undo — you need to know which character was deleted to reinsert it. Actions must be fully invertible from the stored data alone.

**Undo/redo returning void instead of a success signal**: When the undo stack is empty, you want callers to know "nothing happened" so they can disable the button or show a notification. Return a boolean or throw a descriptive error rather than silently doing nothing.

**Mutating action objects**: If the same action object is stored on both stacks (e.g., by reference after popping and pushing), mutating it breaks both histories. Keep actions immutable — treat them as value objects.

---

## Computer Science foundations

**Command pattern**: The undo/redo system is a classic application of the Command design pattern. Each action is an object (a "command") with `apply` and `reverse` operations. The two stacks are the command history. This pattern decouples "what to do" from "when and how to do it."

**Two-stack invariant**: At any point, the sequence `[...undoStack, ...redoStack.reverse()]` represents the complete history of all actions applied, in order. Undo moves the boundary left; redo moves it right. A new action truncates everything to the right of the boundary.

**Space complexity**: Both stacks together hold O(h) actions where h is the history length. If history is unbounded, this can grow without limit. Real applications limit history depth (e.g., VS Code's 500-operation limit by default) to bound memory usage.

**Persistent data structures**: An alternative to two stacks is a persistent (immutable, version-tracked) data structure — each "apply" creates a new version, and undo/redo navigate the version tree. Git's commit history is this model. The two-stack approach is simpler; persistent structures allow branching history (multiple undo timelines).

---

## Real-world applications

**Text editors**: Every keystroke can be an action. Editors often batch rapid keystrokes into single actions ("delete word" rather than individual characters) to make undo coarser-grained. VS Code, Vim, Emacs, and every other editor uses a variant of this two-stack model.

**Drawing/graphics tools**: Figma, Photoshop, and Illustrator have undo for every tool action. The "action" might store a pixel diff, a layer transform, or a node position change — anything needed to reverse the operation.

**Database transactions**: A transaction log is a sequence of operations. Rollback replays the log in reverse. This is the same "store enough information to reverse" requirement — the log entries are the "actions" on the undo stack.

**Collaborative editing (CRDT)**: When multiple users edit simultaneously, the undo/redo model becomes more complex — undoing your own action shouldn't undo what someone else did in between. Conflict-free Replicated Data Types (CRDTs) generalize the two-stack model to distributed, concurrent edits.

---

## Before the exercise

Make sure you can answer these before coding:

1. Why does applying a new action clear `redoStack`? Give a concrete example of what would go wrong if you didn't.
2. `undo` pops from `undoStack` and pushes to `redoStack`. Does `redo` do the same thing in reverse? Trace through a `undo` followed by `redo` and verify the stacks return to their original state.
3. The `TextHistory` class stores `action.char` in delete actions. Why? What would go wrong if `{ type: "delete" }` had no `char` field and you tried to undo it?
4. `canUndo()` returns `undoStack.length > 0`. How would a UI use this — when would you disable the undo button?
5. After three applies followed by two undos: what are the contents of `undoStack` and `redoStack`?
