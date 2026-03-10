## Day 012 — Lesson A (Foundations): The Two-Pointer Technique

### Why this matters

Many problems ask you to examine *pairs* of elements — two items that together satisfy some condition. The naive approach is to check every possible pair: two nested loops, O(n²). For 1,000 elements, that's 1,000,000 pair checks. For 1,000,000 elements, it's 1 trillion.

The **two-pointer technique** exploits a specific property — usually sortedness — to check pairs in O(n) instead of O(n²). Two indices start at opposite ends of the array and move inward, each decision eliminating a large chunk of candidates rather than examining them one by one.

You'll encounter two-pointer problems constantly in interviews and in real systems: checking if a string is a palindrome, finding if any two items sum to a budget, deduplicating a sorted list, merging sorted arrays, and detecting cycles in linked lists. The pattern is one of the first techniques to reach for when a problem involves "find two elements that satisfy a condition."

Day 11's sliding window moves one pointer forward with a fixed distance between them. Day 12's two pointers move toward each other (or in the same direction) with the distance changing dynamically based on what you find. Both are O(n) scanning techniques; knowing which one fits which problem is the skill.

### The core concept

Consider the problem: given a sorted array, do any two elements sum to exactly `target`?

```
sorted: [1, 3, 5, 7, 9, 11]   target: 12
```

Naive approach: check every pair — (1,3), (1,5), (1,7), ..., (3,5), (3,7), ..., (9,11). That's n×(n-1)/2 pairs.

Two-pointer approach: start one pointer at the left (smallest) and one at the right (largest).

```
left → 1   3   5   7   9   11 ← right
sum = 1 + 11 = 12  ✓  FOUND!
```

If the sum is too small, move the left pointer right (increase the smaller value). If the sum is too large, move the right pointer left (decrease the larger value). If they cross, no pair exists.

```
left → 1   3   5   7   9   11 ← right
       sum = 1 + 11 = 12? No, target = 10.

sum = 1 + 11 = 12 > 10 → move right inward
sum = 1 + 9  = 10 ✓  FOUND!
```

Why does moving the right pointer inward help? Because the array is sorted, `numbers[right-1]` is the next smaller value — it's the only way to decrease the sum. Similarly, `numbers[left+1]` is the only way to increase the sum.

The key invariant: **if the current sum is too large, the only way to reduce it is to use a smaller number — but the left pointer is already as small as possible for this pair. So we must decrease the right pointer.** And vice versa.

### How it works

Let's trace `hasPairWithSum([1, 3, 5, 7, 9, 11], 14)` step by step:

```
Initial:
  left = 0  (value: 1)
  right = 5 (value: 11)
  sum = 1 + 11 = 12
  12 < 14 → sum too small, move left rightward
```

```
Step 2:
  left = 1  (value: 3)
  right = 5 (value: 11)
  sum = 3 + 11 = 14
  14 === 14 → FOUND! Return true.
```

Now trace `hasPairWithSum([1, 3, 5, 7, 9, 11], 2)` (no valid pair):

```
Initial:
  left = 0, right = 5  → 1 + 11 = 12 > 2 → move right inward
  left = 0, right = 4  → 1 + 9 = 10 > 2 → move right inward
  left = 0, right = 3  → 1 + 7 = 8 > 2 → move right inward
  left = 0, right = 2  → 1 + 5 = 6 > 2 → move right inward
  left = 0, right = 1  → 1 + 3 = 4 > 2 → move right inward
  left = 0, right = 0  → left >= right → STOP. Return false.
```

The pointers crossed — we've exhausted all meaningful pairs.

Now trace the palindrome check `isPalindrome("racecar")`:

```
"racecar"
 0123456

left=0  right=6  → 'r' vs 'r' → match → both move inward
left=1  right=5  → 'a' vs 'a' → match → both move inward
left=2  right=4  → 'c' vs 'c' → match → both move inward
left=3  right=3  → left === right → pointers met in the middle → PALINDROME ✓
```

Trace `isPalindrome("hello")`:
```
"hello"
 01234

left=0  right=4  → 'h' vs 'o' → MISMATCH → return false immediately
```

### Code implementation

```js
function hasPairWithSum(sortedNumbers, target) {
  let left = 0;
  let right = sortedNumbers.length - 1;

  while (left < right) {
    const sum = sortedNumbers[left] + sortedNumbers[right];

    if (sum === target) return true;
    if (sum < target) {
      left++;    // sum too small: increase smaller value
    } else {
      right--;   // sum too large: decrease larger value
    }
  }

  return false;
}

console.log(hasPairWithSum([1, 3, 5, 7, 9, 11], 14));   // true  (3 + 11)
console.log(hasPairWithSum([1, 3, 5, 7, 9, 11], 2));    // false (1+1 not allowed — same element)
console.log(hasPairWithSum([1, 3, 5, 7, 9, 11], 20));   // false (9+11=20... wait: true!)
console.log(hasPairWithSum([2, 4], 6));                  // true  (2+4)
console.log(hasPairWithSum([5], 10));                    // false (only one element)
console.log(hasPairWithSum([], 5));                      // false
```

**Breaking it down:**

- `let left = 0; let right = sortedNumbers.length - 1` — start at opposite ends
- `while (left < right)` — stop when they meet or cross; using the same element twice isn't allowed
- `sum < target` → `left++` — we need a bigger number; the only bigger option is to the right
- `sum > target` → `right--` — we need a smaller number; the only smaller option is to the left
- `sum === target` → found it, return immediately

Now the palindrome check:

```js
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("racecar"));   // true
console.log(isPalindrome("hello"));     // false
console.log(isPalindrome("a"));         // true  (single char)
console.log(isPalindrome(""));          // true  (empty string is a palindrome by convention)
console.log(isPalindrome("abba"));      // true
```

**Why this works:**

A string is a palindrome if it reads the same forwards and backwards. Checking whether the first character equals the last, then the second equals the second-to-last, and so on is exactly what the two pointers do — moving inward simultaneously until they meet. The first mismatch exits early; if they complete without mismatch, it's a palindrome.

### Common pitfalls

**1. The array must be sorted**

`hasPairWithSum` is only correct on a sorted array. On `[5, 1, 3, 9]` with target `6`, the algorithm finds `5 + 9 = 14 > 6 → right--`, then `5 + 3 = 8 > 6 → right--`, then `5 + 1 = 6 → return true`. But this works accidentally — unsorted arrays don't have the monotonicity property that makes the pointer movement valid. If you can't sort, use a different approach (hash set).

**2. `while (left < right)` not `while (left <= right)`**

`left < right` prevents using the same element as both values in a pair. If `left === right`, the "pair" would be an element paired with itself — that's only valid if the problem allows reuse (which most don't).

**3. Comparing by index vs value**

When returning the pair, return the *values*, not the indices — unless the problem explicitly asks for indices. Beginners sometimes return `[left, right]` when the caller wants `[sortedNumbers[left], sortedNumbers[right]]`.

**4. Treating the empty string palindrome question as a bug**

`isPalindrome("")` — the `while` loop condition is `left < right`, which is `0 < -1 = false`, so the loop never runs and we return `true`. By convention, the empty string is a palindrome (vacuously — there are no characters to mismatch). This is correct and intentional.

### Computer Science foundations

**Time Complexity:** O(n) — each pointer moves at most n/2 steps. In total, both pointers together advance at most n steps. The loop runs at most n times.

**Space Complexity:** O(1) — only two index variables. No extra data structures.

**Why O(n²) → O(n) is possible here:**

The key is **sortedness**, which provides a monotonicity guarantee: if `numbers[left] + numbers[right]` is too small, then `numbers[left] + numbers[right-1]` is also too small (since `numbers[right-1] < numbers[right]`). We can skip all pairs involving `numbers[left]` as the smaller element — they're all too small. One pointer movement eliminates an entire set of pairs.

Without sortedness, there's no such guarantee, and you can't skip candidates. The hash-set approach trades O(n) space for O(n) time on unsorted data.

**Variants of the pattern:**

| Variant | Both pointers | Direction |
|---------|--------------|-----------|
| Opposite ends | Start at both ends | Move toward center |
| Same direction | Start at left | Move right at different rates (fast/slow) |
| Palindrome check | Character array | Inward |
| Cycle detection (Floyd's) | Linked list | One fast, one slow |

The "fast and slow" variant (Floyd's cycle-detection algorithm) uses the same idea — two pointers, same starting point, one advances twice as fast — to detect cycles in linked lists. You'll see it when studying linked lists.

### Real-world applications

- **Database query optimization**: Range queries on sorted indexes use binary search (also pointer-based)
- **Git diff**: The classic Myers diff algorithm uses pointer-style scanning to find the longest common subsequence between two files
- **Text editors**: Cursor matching (finding the matching bracket/parenthesis) scans inward from the cursor
- **Network protocols**: TCP sliding window is named for the two-pointer pair (send buffer start and end)
- **Genome sequencing**: Comparing DNA sequences uses two-pointer alignment algorithms

### Before the exercise

In the exercise, you'll implement:

1. **`hasPairWithSum(sortedNumbers, target)`** — do any two elements in the sorted array sum to target?
2. **`isPalindrome(str)`** — is the string a palindrome using two pointers?
3. **`countPairsWithSum(sortedNumbers, target)`** — count all distinct pairs that sum to target

The third function requires careful handling when the same pair could be counted multiple times. Trace through `[1, 3, 3, 5]` with target `6` by hand before coding — there's exactly one pair `(3, 3)`, not two.
