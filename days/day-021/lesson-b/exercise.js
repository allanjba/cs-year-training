// Day 21 — Lesson B: LRU Cache
// Topic: Doubly linked list + Map for O(1) get and put with LRU eviction

// ─── Sample Usage (for manual testing at bottom) ──────────────────────────

// LRUCache(capacity):
//   get(key)         → returns value or -1 if not found
//   put(key, value)  → inserts or updates; evicts LRU if over capacity

// ─── Implementation ────────────────────────────────────────────────────────

class LRUCache {
  /**
   * Creates an LRU cache with the given maximum capacity.
   *
   * Internal structure:
   *   - this.map: Map<key, node>  for O(1) lookup
   *   - Doubly linked list with sentinel head and tail
   *     head <-> [most recent] <-> ... <-> [least recent] <-> tail
   *
   * Sentinel nodes: create dummy head and tail nodes (key=null, val=null).
   * Link them: head.next = tail, tail.prev = head.
   * Real nodes are always inserted between head and tail.
   *
   * @param {number} capacity - Maximum number of key-value pairs to store
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();

    // TODO: create sentinel head node: { key: null, val: null, prev: null, next: null }
    // TODO: create sentinel tail node: { key: null, val: null, prev: null, next: null }
    // TODO: link them: this.head.next = this.tail; this.tail.prev = this.head
  }

  /**
   * Returns the value associated with key, or -1 if not present.
   * Accessing a key makes it the most recently used — move its node to head.
   *
   * @param {number|string} key
   * @returns {any} The stored value, or -1 if key is not in the cache
   *
   * @example
   * cache.get("missing")  // => -1
   * cache.put("a", 1);
   * cache.get("a")        // => 1   (also moves "a" to head)
   */
  get(key) {
    // TODO: if map doesn't have key, return -1

    // TODO: get the node from the map

    // TODO: call this._moveToHead(node) — it was just accessed

    // TODO: return node.val
  }

  /**
   * Inserts or updates a key-value pair.
   *
   * If the key already exists:
   *   - Update node.val in place.
   *   - Move the node to head (it was just accessed).
   *
   * If the key is new:
   *   - Create a new node { key, val: value, prev: null, next: null }.
   *   - Add it to the map.
   *   - Call this._addToHead(node).
   *   - If map.size now exceeds capacity:
   *       call this._removeTail() to get the evicted node,
   *       then map.delete(evicted.key).
   *
   * @param {number|string} key
   * @param {any} value
   */
  put(key, value) {
    // TODO: if key already exists: update val, moveToHead, return

    // TODO: create new node, set in map, addToHead

    // TODO: if map.size > capacity: removeTail → map.delete(evicted.key)
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /**
   * Inserts node immediately after the sentinel head (most recent position).
   * Four pointer assignments required:
   *   1. node.prev = this.head
   *   2. node.next = this.head.next
   *   3. this.head.next.prev = node
   *   4. this.head.next = node
   * Order matters: step 3 must happen before step 4.
   *
   * @param {object} node
   */
  _addToHead(node) {
    // TODO: implement the 4 pointer assignments
  }

  /**
   * Removes a node from its current position in the list.
   * Two pointer assignments:
   *   node.prev.next = node.next
   *   node.next.prev = node.prev
   * Works for any position (front, middle, back) because sentinels exist.
   *
   * @param {object} node
   */
  _removeNode(node) {
    // TODO: rewire prev and next neighbors to skip over node
  }

  /**
   * Removes and returns the tail node (least recently used real node).
   * The real tail is this.tail.prev (not the sentinel).
   *
   * @returns {object} The removed node (you need its .key to delete from map)
   */
  _removeTail() {
    // TODO: const tail = this.tail.prev
    // TODO: call this._removeNode(tail)
    // TODO: return tail
  }

  /**
   * Moves an existing node to the head (marks it as most recently used).
   * Implementation: _removeNode + _addToHead.
   *
   * @param {object} node
   */
  _moveToHead(node) {
    // TODO: _removeNode(node), then _addToHead(node)
  }
}

// ─── Manual Checks (uncomment to run) ───────────────────────────────────────

// // Example from the lesson hand-trace
// const cache = new LRUCache(2);
// cache.put(1, "one");
// cache.put(2, "two");
// console.log(cache.get(1));   // => "one"  (1 is now most recent)
// cache.put(3, "three");       // evicts 2 (LRU)
// console.log(cache.get(2));   // => -1     (evicted)
// console.log(cache.get(3));   // => "three"
// console.log(cache.get(1));   // => "one"

// // Verify update (put on existing key)
// const cache2 = new LRUCache(2);
// cache2.put("a", 1);
// cache2.put("b", 2);
// cache2.put("a", 99);         // update "a", moves it to head
// cache2.put("c", 3);          // evicts "b" (LRU), not "a"
// console.log(cache2.get("b")); // => -1  (evicted)
// console.log(cache2.get("a")); // => 99  (updated value)
// console.log(cache2.get("c")); // => 3

// // Capacity 1
// const cache3 = new LRUCache(1);
// cache3.put("x", 10);
// console.log(cache3.get("x")); // => 10
// cache3.put("y", 20);           // evicts "x"
// console.log(cache3.get("x")); // => -1
// console.log(cache3.get("y")); // => 20

// // LeetCode 146 example
// // ["LRUCache","put","put","get","put","get","put","get","get","get"]
// // [[2],       [1,1],[2,2],[1],  [3,3],[2],  [4,4],[1],  [3],  [4]]
// const lc = new LRUCache(2);
// lc.put(1, 1);
// lc.put(2, 2);
// console.log(lc.get(1));    // 1
// lc.put(3, 3);              // evicts 2
// console.log(lc.get(2));    // -1
// lc.put(4, 4);              // evicts 1
// console.log(lc.get(1));    // -1
// console.log(lc.get(3));    // 3
// console.log(lc.get(4));    // 4
