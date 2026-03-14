# Day 21 — Lesson B Review: LRU Cache

## 1. What You Should Have Learned

- An LRU cache evicts the least recently used item when capacity is exceeded; O(1) for both `get` and `put` requires combining a doubly linked list (for O(1) reordering) with a hash map (for O(1) key lookup).
- Sentinel head and tail nodes eliminate null-pointer edge cases in list manipulation — every real node always has defined `prev` and `next` pointers.
- `_addToHead` and `_removeNode` are the primitive operations; `_moveToHead` and `_removeTail` compose them.
- In `put`, always add the node first, then check capacity — not the other way around — so the size count is accurate.
- After eviction, the evicted node's key must be deleted from the map; otherwise the map grows without bound.

## 2. Reviewing Your Implementation

### Full reference implementation:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();

    this.head = { key: null, val: null, prev: null, next: null };
    this.tail = { key: null, val: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._moveToHead(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = value;
      this._moveToHead(node);
    } else {
      const node = { key, val: value, prev: null, next: null };
      this.map.set(key, node);
      this._addToHead(node);
      if (this.map.size > this.capacity) {
        const evicted = this._removeTail();
        this.map.delete(evicted.key);
      }
    }
  }

  _addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;   // step 3 before step 4
    this.head.next = node;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _removeTail() {
    const tail = this.tail.prev;
    this._removeNode(tail);
    return tail;
  }

  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }
}
```

**Key insights:**

**`_addToHead` pointer order:** Steps 3 and 4 are the critical pair. `this.head.next.prev = node` must happen before `this.head.next = node`. If you do step 4 first, `this.head.next` becomes `node` and `this.head.next.prev` now sets `node.prev = node` (a self-loop) instead of connecting the formerly-first real node back to `node`.

**Sentinel nodes:** With sentinels, `_removeNode` always has valid `node.prev` and `node.next` — even if the node is the only real node in the cache. `node.prev` is the head sentinel; `node.next` is the tail sentinel. No null checks needed.

**Map stores nodes, not values:** `map.get(key)` returns the node object, which gives direct access to the list position. This is the key to O(1) `_moveToHead`.

**Edge cases:**
- `capacity = 1`: put a second key immediately evicts the first. `_removeTail` returns the head sentinel's neighbor, which is the one and only real node.
- `get` on a key that exists: returns value AND moves to head. Calling `cache.get("a")` twice in a row is valid; the second call finds "a" already at head, moves it to head again (no-op for the list structure, but harmless).
- `put` on an existing key: updates value in place (no new node allocation), moves to head. Cache size does not change.

## 3. Going Deeper

### Extension 1: LFU Cache (Least Frequently Used)

LFU evicts the key with the fewest accesses (ties broken by LRU). It requires a Map from key → node, a Map from frequency → doubly-linked-list-of-nodes, and a `minFreq` tracker:

```javascript
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyMap = new Map();   // key → { val, freq, node in freqMap list }
    this.freqMap = new Map();  // freq → Set of keys (maintains insertion order)
    this.minFreq = 0;
  }

  _increment(key) {
    const item = this.keyMap.get(key);
    const oldFreq = item.freq;
    item.freq++;

    this.freqMap.get(oldFreq).delete(key);
    if (this.freqMap.get(oldFreq).size === 0) {
      this.freqMap.delete(oldFreq);
      if (this.minFreq === oldFreq) this.minFreq++;
    }

    if (!this.freqMap.has(item.freq)) this.freqMap.set(item.freq, new Set());
    this.freqMap.get(item.freq).add(key);
  }

  get(key) {
    if (!this.keyMap.has(key)) return -1;
    this._increment(key);
    return this.keyMap.get(key).val;
  }

  put(key, value) {
    if (this.capacity === 0) return;
    if (this.keyMap.has(key)) {
      this.keyMap.get(key).val = value;
      this._increment(key);
    } else {
      if (this.keyMap.size >= this.capacity) {
        const minFreqSet = this.freqMap.get(this.minFreq);
        const evictKey = minFreqSet.keys().next().value;   // oldest in min freq set
        minFreqSet.delete(evictKey);
        this.keyMap.delete(evictKey);
      }
      this.keyMap.set(key, { val: value, freq: 1 });
      if (!this.freqMap.has(1)) this.freqMap.set(1, new Set());
      this.freqMap.get(1).add(key);
      this.minFreq = 1;
    }
  }
}
```

LFU is conceptually cleaner than LRU for workloads where some keys are accessed millions of times — those should never be evicted regardless of recency.

---

### Extension 2: Time-to-live (TTL) eviction

Real caches often expire entries after a set duration. Add TTL to LRU:

```javascript
class LRUCacheWithTTL extends LRUCache {
  constructor(capacity, ttlMs) {
    super(capacity);
    this.ttlMs = ttlMs;
    this.expiry = new Map();   // key → expiry timestamp
  }

  get(key) {
    if (this.expiry.has(key) && Date.now() > this.expiry.get(key)) {
      // Expired — evict lazily
      const node = this.map.get(key);
      this._removeNode(node);
      this.map.delete(key);
      this.expiry.delete(key);
      return -1;
    }
    return super.get(key);
  }

  put(key, value) {
    super.put(key, value);
    this.expiry.set(key, Date.now() + this.ttlMs);
  }
}

// const cache = new LRUCacheWithTTL(2, 1000); // 1 second TTL
// cache.put("a", 1);
// cache.get("a");  // 1
// // (after 1 second...)
// cache.get("a");  // -1 (expired)
```

This is "lazy eviction" — expired items are only removed when accessed. Active eviction (background cleanup) requires a separate sorted structure (min-heap by expiry time) or periodic scanning.

## 4. Common Mistakes and How to Fix Them

### Mistake 1: Forgetting to delete the evicted key from the map

```javascript
// WRONG — map grows without bound; evicted nodes remain accessible
put(key, value) {
  // ...new key path...
  const node = { key, val: value, prev: null, next: null };
  this.map.set(key, node);
  this._addToHead(node);
  if (this.map.size > this.capacity) {
    this._removeTail();   // BUG: removed from list but not from map
  }
}
```

```javascript
// FIX — always delete the evicted key from the map
if (this.map.size > this.capacity) {
  const evicted = this._removeTail();
  this.map.delete(evicted.key);   // this.tail.prev stores .key for exactly this reason
}
```

---

### Mistake 2: Wrong pointer order in `_addToHead`

```javascript
// WRONG — step 4 before step 3 creates a self-loop
_addToHead(node) {
  node.prev = this.head;
  node.next = this.head.next;
  this.head.next = node;              // BUG: head.next now points to node
  this.head.next.prev = node;         // this.head.next IS node → node.prev = node
}
```

```javascript
// FIX — step 3 (fix the old first node's prev) BEFORE step 4 (update head.next)
_addToHead(node) {
  node.prev = this.head;
  node.next = this.head.next;
  this.head.next.prev = node;   // fix old first node first
  this.head.next = node;        // then update head
}
```

---

### Mistake 3: Not moving to head on `put` of an existing key

```javascript
// WRONG — updating an existing key's value without marking it as recently used
put(key, value) {
  if (this.map.has(key)) {
    this.map.get(key).val = value;   // BUG: no _moveToHead call
    return;
  }
  // ...
}
// Effect: an updated key stays at its old position in the LRU order
// and may be evicted even though it was just accessed.
```

```javascript
// FIX — always move to head on any access (get or put)
put(key, value) {
  if (this.map.has(key)) {
    const node = this.map.get(key);
    node.val = value;
    this._moveToHead(node);   // mark as recently used
    return;
  }
  // ...
}
```

## 5. Connection to Interview Problems

**LeetCode 146 — LRU Cache** (Medium)
This is exactly the `LRUCache` class. It is one of the canonical "design" problems on LeetCode and one of the most common interview questions at top tech companies. The class-based implementation you built is the expected solution.

**LeetCode 460 — LFU Cache** (Hard)
The LFU extension shown above. Considerably harder because you need to maintain `minFreq` and the frequency-to-key mapping simultaneously. Built on the same principles as LRU but requires an additional layer of bookkeeping.

**LeetCode 432 — All O(1) Data Structure** (Hard)
Requires O(1) insert, delete, getMaxKey, and getMinKey. Uses a doubly linked list of frequency buckets — the same sentinel-node doubly linked list pattern from this lesson.

**System Design — Design a CDN Cache / Design Redis**
At system design interviews, LRU cache is a required building block for almost every caching question. Knowing the implementation (doubly linked list + hash map, O(1) operations, eviction on capacity) lets you discuss cache hit rates, eviction policies, and distributed caching trade-offs with confidence.

## 6. Discussion Questions

**Q: Why does the LRU cache store the `key` inside each list node?**
A: When evicting the tail, you need to delete the evicted key from the map (`map.delete(evicted.key)`). If the node didn't store its own key, you'd have to search the entire map to find which key points to the tail node — O(n). Storing the key in the node makes eviction O(1).

**Q: What is the time complexity of `get` and `put`? What makes them O(1) rather than O(n)?**
A: Both are O(1) amortized. `get` is: one `map.has` call (O(1)), one `map.get` call (O(1)), one `_moveToHead` call (O(1) — just pointer rewiring). `put` is: one `map.has`, one `map.set`, one `_addToHead`, and one optional `_removeTail` + `map.delete` — all O(1). The reason nothing is O(n) is that the doubly linked list allows direct node access via the map pointer, bypassing any traversal.

**Q: If you replaced the doubly linked list with a singly linked list, which operations would become O(n) and why?**
A: `_removeNode` would become O(n) for arbitrary positions. In a singly linked list, to remove a node you need its predecessor's reference to update `prev.next = node.next`. Finding the predecessor requires traversal from head — O(n). The only operation that remains O(1) is `_addToHead`. Since `_moveToHead` depends on `_removeNode`, it would also become O(n), breaking the O(1) guarantee for both `get` and `put`.

**Q: How would you extend `LRUCache` to support a `peek(key)` operation that reads a value WITHOUT updating its LRU position?**
A: In `get`, move to head after lookup. In `peek`, don't move to head — just return the value. Since we access the node via the map (O(1)), omitting `_moveToHead` gives the desired behavior: `const node = this.map.get(key); return node ? node.val : -1;`. This is useful for monitoring tools that need to inspect cache contents without affecting eviction order.

## 7. Further Exploration

**LeetCode 146 editorial and discussion** — The editorial explains both the doubly linked list + map approach (which you implemented) and a Java `LinkedHashMap` shortcut. Reading the top discussion answers shows how different languages' standard libraries provide built-in LRU-adjacent data structures.

**"Redis: The Definitive Guide" by Karl Seguin** (free online at `openmymind.net`) — Chapter 1 and the Expiry/Eviction section show how Redis implements LRU at scale, including the "approximated LRU" used in production (sampling K random keys and evicting the least recently used among them). Your implementation is the conceptually pure version; Redis's is the performance-optimized approximation.

**Wikipedia — Cache replacement policies** (`en.wikipedia.org/wiki/Cache_replacement_policies`) — a thorough comparison of LRU, LFU, FIFO, Clock, and ARC (Adaptive Replacement Cache) with mathematical hit rate analysis. After implementing LRU, reading the ARC section is particularly rewarding: ARC dynamically balances between recency (LRU) and frequency (LFU) and is what OS X/macOS uses for its page cache.
