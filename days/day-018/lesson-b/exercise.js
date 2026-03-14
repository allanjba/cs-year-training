// Day 018 — Lesson B (Applied): Undo/Redo History
// Tech: js (JavaScript)

// Actions represent operations on a simple text buffer.
// Each action has a type ("insert" or "delete") and the character involved.
// This is enough information to both apply and reverse any action.

// ------------------------------------------------------------

/**
 * createHistory()
 * ---------------
 * Return an object that manages a text buffer with undo and redo support.
 *
 * The returned object must have these methods:
 *
 *   getText()               → returns the current text string
 *   apply(action)           → applies the action, adds to undo stack, clears redo stack
 *   undo()                  → reverses the last applied action; returns true if successful,
 *                             false if there is nothing to undo
 *   redo()                  → reapplies the last undone action; returns true if successful,
 *                             false if there is nothing to redo
 *   canUndo()               → returns true if there is at least one action to undo
 *   canRedo()               → returns true if there is at least one action to redo
 *
 * Action shape: { type: "insert" | "delete", char: string }
 *   - "insert": appends char to the text
 *   - "delete": removes the last character from the text (char records what was deleted,
 *               needed to restore it on undo)
 *
 * @returns {{ getText, apply, undo, redo, canUndo, canRedo }}
 *
 * @example
 * const h = createHistory();
 * h.apply({ type: "insert", char: "H" });
 * h.apply({ type: "insert", char: "i" });
 * h.getText();    // "Hi"
 * h.undo();       // true — removes "i"
 * h.getText();    // "H"
 * h.redo();       // true — reapplies "i"
 * h.getText();    // "Hi"
 * h.apply({ type: "insert", char: "!" });
 * h.canRedo();    // false — new action cleared redo stack
 */
function createHistory() {
  // TODO: implement
  // Two stacks: undoStack and redoStack (both plain arrays).
  // Track current text in a variable.
  //
  // apply(action):
  //   - applyAction(action) to update text
  //   - undoStack.push(action)
  //   - clear redoStack (set to [])
  //
  // undo():
  //   - if undoStack is empty, return false
  //   - pop action from undoStack
  //   - reverseAction(action) to undo the change
  //   - push action to redoStack
  //   - return true
  //
  // redo():
  //   - if redoStack is empty, return false
  //   - pop action from redoStack
  //   - applyAction(action)
  //   - push action to undoStack
  //   - return true
  //
  // Helper — applyAction:
  //   "insert" → text += action.char
  //   "delete" → text = text.slice(0, -1)
  //
  // Helper — reverseAction:
  //   "insert" → text = text.slice(0, -1)  (remove what was inserted)
  //   "delete" → text += action.char        (restore what was deleted)
}

// ------------------------------------------------------------
// Manual checks — uncomment to verify your output.

// const h = createHistory();

// h.apply({ type: "insert", char: "H" });
// h.apply({ type: "insert", char: "i" });
// h.apply({ type: "insert", char: "!" });
// console.log(h.getText());    // "Hi!"
// console.log(h.canUndo());    // true
// console.log(h.canRedo());    // false

// h.undo();
// console.log(h.getText());    // "Hi"
// h.undo();
// console.log(h.getText());    // "H"
// console.log(h.canRedo());    // true

// h.redo();
// console.log(h.getText());    // "Hi"

// // New action clears redo stack:
// h.apply({ type: "insert", char: "?" });
// console.log(h.getText());    // "Hi?"
// console.log(h.canRedo());    // false — "!" branch is gone

// // Undo past everything:
// h.undo(); h.undo(); h.undo();
// console.log(h.getText());    // ""
// console.log(h.undo());       // false — nothing left to undo

// // Delete action:
// h.apply({ type: "insert", char: "A" });
// h.apply({ type: "insert", char: "B" });
// h.apply({ type: "delete", char: "B" });  // char records what was deleted
// console.log(h.getText());    // "A"
// h.undo();
// console.log(h.getText());    // "AB"  — "B" was restored
