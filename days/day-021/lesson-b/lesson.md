# Day 21 — Lesson B: LRU Cache

## 1. Why This Matters

Caching is one of the most impactful performance techniques in software engineering. The fundamental idea: if computing or fetching a value is expensive (database query, API call, heavy computation), remember the result and return it directly next time the same key is requested. A good cache can turn a 200ms database roundtrip into a 1ms in-memory lookup.

But memory is finite. A cache that grows without bound eventually consumes all available memory. You need an **eviction policy** — a rule for which item to remove when the cache is full. The most widely used policy is **LRU: Least Recently Used**. Evict the item that has not been accessed for the longest time. The intuition: if you haven't used it recently, you probably won't use it soon.

LRU caches power Redis, CPU instruction caches, browser page caches, and CDN routing tables. In system design interviews, "should we cache this?" and "what eviction policy?" are questions you will encounter constantly. Understanding how LRU works — including why it requires both a doubly linked list and a hash map — gives you a concrete mental model for cache design.

## 2. The Core Concept

A naive LRU implementation tracks access times and evicts the item with the oldest access time. But scanning all items to find the least recently used one is O(n). We need O(1) for both `get` and `put`.

The classical O(1) LRU cache combines two data structures:

**A doubly linked list** maintains the access order. The most recently used item is at the **head** (front). The least recently used item is at the **tail** (back). On every `get` or `put`, the accessed item is moved to the head. When the cache is full and a new item must be added, the tail item is evicted.

**A hash map** maps each key to its corresponding node in the linked list. This gives O(1) lookup: given a key, find the node instantly, then rewire it to the head in O(1) via the doubly linked list pointers.

The combination gives:
- `get(key)`: hash map lookup → O(1). Move node to head → O(1). Return value.
- `put(key, value)`: hash map lookup → O(1). If exists: update and move to head. If new: create node, add to head, add to map. If over capacity: remove tail, remove from map → O(1).

## 3. How It Works — Hand Trace

`LRUCache(capacity = 2)`

```
cache: head <→> tail   (sentinel nodes, no data)
map: {}

put(1, "one"):
  Create node {key:1, val:"one"}
  Insert at head: head <→ [1,"one"] <→ tail
  map: {1: Node(1)}

put(2, "two"):
  Create node {key:2, val:"two"}
  Insert at head: head <→ [2,"two"] <→ [1,"one"] <→ tail
  map: {1: Node(1), 2: Node(2)}

get(1):
  map.get(1) = Node(1) → val = "one"
  Move Node(1) to head:
    Remove from current position: head <→ [2,"two"] <→ tail
    Insert at head:               head <→ [1,"one"] <→ [2,"two"] <→ tail
  Return "one"

put(3, "three"):
  Cache is full (size = 2 = capacity)
  Evict LRU: tail.prev = [2,"two"] — remove it
    Delete [2,"two"] from list: head <→ [1,"one"] <→ tail
    Delete key 2 from map: map: {1: Node(1)}
  Create node {key:3, val:"three"}, insert at head:
    head <→ [3,"three"] <→ [1,"one"] <→ tail
  map: {1: Node(1), 3: Node(3)}

get(2):
  map.get(2) = undefined → return -1 (evicted)
```

The list always has most-recently-used at the head and LRU at the tail. The map always has O(1) access to any node.

## 4. Code Implementation

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();    // key → Node

    // Sentinel nodes — dummy head and tail eliminate edge cases in insert/remove
    this.head = { key: null, val: null, prev: null, next: null };
    this.tail = { key: null, val: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Returns the value for the key, or -1 if not found.
   * Accessing a node makes it the most recently used: move to head.
   */
  get(key) {
    if (!this.map.has(key)) return -1;

    const node = this.map.get(key);
    this._moveToHead(node);    // accessed → most recent
    return node.val;
  }

  /**
   * Inserts or updates key with value.
   * If key exists: update and move to head.
   * If new and at capacity: evict LRU (tail), then add new node at head.
   */
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = value;          // update value in place
      this._moveToHead(node);
    } else {
      const node = { key, val: value, prev: null, next: null };
      this.map.set(key, node);
      this._addToHead(node);

      if (this.map.size > this.capacity) {
        const evicted = this._removeTail();
        this.map.delete(evicted.key);   // must delete by key — not by node reference!
      }
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  /** Inserts node immediately after head (most recent position). */
  _addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /** Removes a node from wherever it is in the list (rewires its neighbors). */
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /** Removes the tail (LRU) and returns it. */
  _removeTail() {
    const tail = this.tail.prev;   // actual last node (not sentinel)
    this._removeNode(tail);
    return tail;
  }

  /** Moves an existing node to the head (mark as most recently used). */
  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }
}
```

**Why sentinel nodes?** Without dummy head/tail, every insert and remove must handle edge cases: "is this the first node?", "is this the last?", "is the list empty?". Sentinels never hold data but always exist, so every real node always has both `prev` and `next` defined. The four-line `_addToHead` and two-line `_removeNode` work without any special cases.

**Why doubly linked (not singly)?** `_removeNode` requires access to `node.prev` to rewire `node.prev.next`. In a singly linked list, getting `prev` requires traversal from head — O(n). The doubly linked list makes it O(1).

## 5. Common Pitfalls

**Pitfall 1: Forgetting to delete the evicted key from the map.**
When the cache is full and you remove the tail node, you must also call `map.delete(evictedNode.key)`. If you don't, the map grows without bound and `map.get(evictedKey)` still returns the removed (dangling) node.

**Pitfall 2: Evicting before adding, or adding before evicting.**
In `put`, when adding a new key: add the node to the map and list first (so `map.size` reflects the new count), then check if `map.size > capacity` and evict. If you check capacity before adding, you evict one too early. The sequence is: add, then if over capacity, evict.

**Pitfall 3: Not using sentinel nodes and dealing with null pointers.**
Without sentinels, inserting the first node requires setting `head = node; tail = node; node.prev = null; node.next = null`. Removing the last node requires `head = null; tail = null`. Every helper must null-check. Sentinels eliminate all of this complexity.

**Pitfall 4: Updating `node.val` without moving to head in `put` when key exists.**
A `put` on an existing key is an access — it should refresh the node's position to head (most recently used). Forgetting to call `_moveToHead` means the node stays in its old position and may be incorrectly evicted.

## 6. Computer Science Foundations

**Why O(1) requires two data structures.** Either structure alone is insufficient. A doubly linked list alone gives O(1) insert/remove by position, but O(n) lookup. A hash map alone gives O(1) lookup but O(n) reordering. Combining them gives O(1) for all operations — a classic example of using one data structure to accelerate another.

**Amortized O(1).** Like all hash maps, `Map` operations are O(1) amortized, not worst case. Rarely, a rehash occurs (O(n)), but it happens infrequently enough that the average cost per operation is O(1).

**Alternative eviction policies.** LRU is not the only policy. LFU (Least Frequently Used) evicts the item accessed the fewest times — better for working sets where popularity matters more than recency. FIFO (First In, First Out) evicts the oldest inserted item — simplest implementation but suboptimal cache hit rate. Random eviction is surprisingly competitive with LRU in practice on uniform workloads.

**Cache hit rate.** The effectiveness of a cache is measured by its hit rate: what fraction of `get` calls return a cached value? LRU performs well on workloads with temporal locality (recently accessed items tend to be accessed again) — which is most workloads.

## 7. Real-World Applications

**Redis.** Redis is an in-memory key-value store that supports multiple eviction policies including `allkeys-lru` (evict any key, LRU) and `volatile-lru` (evict only keys with TTLs). Understanding LRU makes Redis configuration decisions concrete.

**CPU L1/L2/L3 caches.** Processor caches use hardware-implemented LRU (or pseudo-LRU approximations) at the cache line level. When a new cache line is loaded and the cache set is full, the hardware evicts the LRU line. The principle is identical to your `LRUCache` class, just at nanosecond speeds.

**Web browser caching.** Browsers maintain an in-memory page cache and a disk cache. Both use LRU-based eviction. When you load a page from the back-forward cache (bfcache), the browser is doing exactly what `get(url)` does in your implementation: retrieving a cached page and marking it as recently used.

**Database buffer pools.** InnoDB (MySQL's storage engine) manages a buffer pool of data pages using an LRU-like algorithm. Frequently accessed table data stays in memory; cold data is evicted to disk. Understanding this is essential for database query optimization.

## 8. Before the Exercise

Answer these questions before writing code:

1. Why does `LRUCache` use sentinel (dummy) head and tail nodes? Give one specific bug that would occur in `_addToHead` if head were a real data node.

2. In `_addToHead`, there are exactly 4 pointer assignments. Name them and explain the order they must happen in. What goes wrong if you do `this.head.next = node` before `node.next = this.head.next`?

3. In `put`, you check `map.size > capacity` after adding the new node. Why after, rather than before? What would be evicted incorrectly if you checked before adding?

4. After `cache.put(key, value)` on an existing key, should the node move to the head of the list? Why or why not?

5. The `_removeNode` function does not need to know whether the node is in the middle, at the head, or at the tail. Why? What would be different without sentinel nodes?
