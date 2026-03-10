## Day 012 — Lesson A Review: The Two-Pointer Technique

### What you should have learned

1. **Sortedness enables O(n) pair searching**: Without sortedness, finding all pairs requires O(n²) nested loops. Sortedness gives a monotonicity guarantee — if the sum is too large, the only fix is to use a smaller value — and that guarantee is what allows O(n) pair checking.
2. **`while (left < right)`, not `while (left <= right)`**: The strict `<` prevents pairing an element with itself. If `left === right`, both pointers point to the same element — using it as both partners in the pair would double-count it.
3. **The inward palindrome check is just two-pointer pattern recognition**: `isPalindrome` is structurally identical to `hasPairWithSum` — two pointers meeting in the middle with a comparison at each step. Recognizing the pattern frees you from reinventing it.
4. **Each step eliminates a set of candidates**: When `sum < target`, every pair `(left, j)` where `j < right` has an even smaller sum — they can all be ruled out at once by advancing `left`. This is why O(n) is achievable.
5. **`countPairsWithSum` requires careful handling of duplicates**: When the target is `6` and the array contains two `3`s, there's exactly one pair `(3, 3)`. When both pointers are at the same value, all valid pairs between them are counted before either pointer moves.

### Reviewing your implementation

#### Function 1: `hasPairWithSum(sortedNumbers, target)`

```js
function hasPairWithSum(sortedNumbers, target) {
  let left = 0;
  let right = sortedNumbers.length - 1;

  while (left < right) {
    const sum = sortedNumbers[left] + sortedNumbers[right];
    if (sum === target) return true;
    if (sum < target) left++;
    else right--;
  }

  return false;
}

console.log(hasPairWithSum([1, 3, 5, 7, 9], 12));    // true  (3+9)
console.log(hasPairWithSum([1, 3, 5, 7, 9], 2));     // false
console.log(hasPairWithSum([2, 4], 6));               // true  (2+4)
console.log(hasPairWithSum([5], 10));                 // false (one element)
console.log(hasPairWithSum([], 5));                   // false
```

**Key insights:**
- `while (left < right)` — the loop terminates when the pointers meet or cross, having examined all meaningful pairs
- `sum < target → left++` — the current left element is too small; the next larger element is immediately to the right
- `sum > target → right--` — the current right element is too large; the next smaller element is immediately to the left
- Returns `false` at the end only if no pair was found during the entire scan

**Edge cases handled:**
- Single element → `left = 0`, `right = 0`, loop condition `0 < 0` is false → `false`
- Empty array → `right = -1`, `0 < -1` is false → `false`
- All same value (e.g., `[3, 3, 3]`, target `6`) → `left=0, right=2`: `3+3=6` → `true`

---

#### Function 2: `isPalindrome(str)`

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
console.log(isPalindrome("a"));         // true
console.log(isPalindrome(""));          // true
console.log(isPalindrome("abba"));      // true
console.log(isPalindrome("abcba"));     // true
```

**Key insights:**
- Both pointers advance together: `left++; right--` — one step inward from both sides per iteration
- First mismatch exits immediately (`return false`) — no need to check the rest
- Middle element in odd-length strings: when `left === right`, the loop stops. The middle character doesn't need a partner.
- `""` → `right = -1`, loop never runs → `true` (empty string is vacuously a palindrome)

**Edge cases handled:**
- Empty string → `true`
- Single character → `true`
- Even length (`"abba"`) → pointers meet between positions 1 and 2, stop when `left = 2 > right = 1`
- Odd length (`"abcba"`) → pointers stop when `left = right = 2` (center)

---

#### Function 3: `countPairsWithSum(sortedNumbers, target)`

```js
function countPairsWithSum(sortedNumbers, target) {
  let left = 0;
  let right = sortedNumbers.length - 1;
  let count = 0;

  while (left < right) {
    const sum = sortedNumbers[left] + sortedNumbers[right];

    if (sum === target) {
      if (sortedNumbers[left] === sortedNumbers[right]) {
        // All elements between left and right (inclusive) are the same value.
        // The number of pairs is C(n, 2) = n*(n-1)/2 where n = right-left+1.
        const n = right - left + 1;
        count += (n * (n - 1)) / 2;
        break;  // No more pairs possible
      } else {
        // Count all valid pairs anchored at these two values by advancing both
        // pointers while the values remain the same
        let leftCount = 1;
        let rightCount = 1;
        while (left + leftCount < right && sortedNumbers[left + leftCount] === sortedNumbers[left]) leftCount++;
        while (right - rightCount > left && sortedNumbers[right - rightCount] === sortedNumbers[right]) rightCount++;
        count += leftCount * rightCount;
        left += leftCount;
        right -= rightCount;
      }
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return count;
}

console.log(countPairsWithSum([1, 2, 3, 4], 5));    // 2  (1+4, 2+3)
console.log(countPairsWithSum([1, 3, 3, 5], 6));    // 1  (3+3)
console.log(countPairsWithSum([3, 3, 3], 6));       // 3  (C(3,2)=3 pairs)
console.log(countPairsWithSum([1, 2, 3], 10));      // 0
```

**Key insights:**
- When both pointers land on the same value (`sortedNumbers[left] === sortedNumbers[right]`), all elements between them are that value — the pair count is C(n, 2) = n*(n-1)/2 where n is the number of those elements
- When they're different values, count the "run" of each value at the pointers, multiply for all cross-combinations, then advance both pointers past their runs
- This handles duplicates correctly without double-counting

**Edge cases handled:**
- No pairs found → `0`
- All-duplicate array with matching target (`[3, 3, 3]`, target 6) → `C(3,2) = 3`
- Array with no duplicates → simpler path through the logic

### Going deeper

#### Extension 1: Two-sum with a hash set (for unsorted input)

When the input isn't sorted and sorting it would break something (e.g., you need to return the original indices):

```js
function hasPairWithSumUnsorted(numbers, target) {
  const seen = new Set();
  for (const n of numbers) {
    if (seen.has(target - n)) return true;
    seen.add(n);
  }
  return false;
}
```

O(n) time, O(n) space (the set). Tradeoff: uses memory proportional to n vs the two-pointer's O(1) space. Always prefer two-pointer when the input is sorted.

#### Extension 2: Three-sum pattern

Fix one element, use two pointers on the rest:

```js
function hasTripleWithSum(sortedNumbers, target) {
  for (let i = 0; i < sortedNumbers.length - 2; i++) {
    const remaining = target - sortedNumbers[i];
    // Two-pointer on sortedNumbers[i+1..]
    let left = i + 1;
    let right = sortedNumbers.length - 1;
    while (left < right) {
      const sum = sortedNumbers[left] + sortedNumbers[right];
      if (sum === remaining) return true;
      if (sum < remaining) left++;
      else right--;
    }
  }
  return false;
}
```

O(n²) — O(n) outer loop × O(n) two-pointer inner. Better than the O(n³) naive three nested loops. This is the exact approach for LeetCode 15 (Three Sum).

### Common mistakes and how to fix them

#### Mistake 1: Using `while (left <= right)`

```js
// WRONG — pairs element with itself
function hasPairWithSum(sortedNumbers, target) {
  let left = 0;
  let right = sortedNumbers.length - 1;
  while (left <= right) {   // should be left < right
    const sum = sortedNumbers[left] + sortedNumbers[right];
    if (sum === target) return true;
    // ...
  }
}

hasPairWithSum([5, 10], 10);   // true — but only because 5+5=10 or... wait:
// left=0, right=1: 5+10=15 > 10 → right--
// left=0, right=0: 5+5=10 === 10 → true  — WRONG: the "pair" is (5,5), using index 0 twice
```

**Problem:** When `left === right`, you're pairing the element with itself.
**Fix:** `while (left < right)`.

---

#### Mistake 2: Calling `hasPairWithSum` on an unsorted array

```js
// WRONG — unsorted input gives wrong answer
console.log(hasPairWithSum([9, 1, 5, 3, 7], 4));
// left=0 (9), right=4 (7): 16 > 4 → right--
// left=0 (9), right=3 (3): 12 > 4 → right--
// left=0 (9), right=2 (5): 14 > 4 → right--
// left=0 (9), right=1 (1): 10 > 4 → right--
// left=0 (9), right=0 (9): stop. return false.
// But 1+3 = 4 exists! The algorithm missed it because the array isn't sorted.
```

**Problem:** The algorithm relies on the sorted order guarantee. On unsorted input, the pointer-movement logic is invalid.
**Fix:** Sort the array first, or use the hash-set approach for unsorted input.

---

#### Mistake 3: Advancing only one pointer when a pair is found in `countPairsWithSum`

```js
// WRONG — infinite loop when duplicates are present
function countPairsWithSum(sortedNumbers, target) {
  let left = 0, right = sortedNumbers.length - 1, count = 0;
  while (left < right) {
    const sum = sortedNumbers[left] + sortedNumbers[right];
    if (sum === target) {
      count++;
      left++;   // only advances left — right stays, causing re-matching
    } else if (sum < target) left++;
    else right--;
  }
  return count;
}

countPairsWithSum([1, 3, 3, 5], 6);
// left=0(1), right=3(5): 6 — count=1, left=1
// left=1(3), right=3(5): 8 > 6 — right=2
// left=1(3), right=2(3): 6 — count=2, left=2
// left=2(3), right=2(3): stop. Returns 2. WRONG — should be 1.
```

**Problem:** Only advancing `left` keeps re-matching the `right` value with new left values, double-counting. Both pointers must advance when a match is found.
**Fix:** Advance both: `left++; right--;` after counting, then handle the duplicate runs.

### Connection to interview problems

- **LeetCode 167 — Two Sum II (sorted array)**: `hasPairWithSum` exactly — returns the 1-indexed positions of the pair
- **LeetCode 125 — Valid Palindrome**: `isPalindrome` with extra character filtering (skip non-alphanumeric)
- **LeetCode 15 — Three Sum**: The two-pointer extension from "Going deeper" above — a very common interview problem
- **LeetCode 11 — Container With Most Water**: Two pointers, greedy rule for which to advance — different invariant, same structure

### Discussion questions

1. **`hasPairWithSum` requires a sorted array. What's the cost of sorting first?** O(n log n) for the sort, then O(n) for the two-pointer scan — total O(n log n). If the caller already has a sorted array, the sort cost disappears. If not, the hash-set approach (O(n) time, O(n) space) might be better if n is large and memory is available.

2. **`isPalindrome("racecar")` works on lowercase ASCII. Would it work on `"A man a plan a canal Panama"`?** No — it would return `false` because spaces and capital letters don't match correctly. A real palindrome checker normalizes first: `str.toLowerCase().replace(/[^a-z]/g, "")`, then runs the two-pointer check. This is exactly what LeetCode 125 asks for.

3. **The two-pointer loop always terminates because `left` and `right` move toward each other. How do you convince yourself they can never skip past each other?** `left` only ever increases (+1 per step) and `right` only ever decreases (-1 per step). Both advance at most once per iteration. The `while (left < right)` condition checks the gap before each iteration. When they are adjacent (`right - left = 1`), one step brings them to equality, ending the loop. They can never "cross" by more than 1.

4. **Can you use two pointers on a linked list (not an array)?** Yes, but differently. With a linked list, you can't index `list[i]` in O(1). Instead, you advance one pointer one step at a time and another pointer two steps at a time (fast/slow pointers). This detects cycles (Floyd's algorithm) and finds the middle element. The "two pointers, same direction, different speed" variant trades the index arithmetic for pointer chasing.

### Further exploration

- **LeetCode Two Pointers tag**: ~100 problems using this pattern — start with 167 (Two Sum II), 125 (Valid Palindrome), and 11 (Container With Most Water)
- *Algorithms* by Sedgewick and Wayne — Chapter 2 covers the merge step in Merge Sort, which uses two-pointer array scanning in a different context
- Read about **Boyer-Moore Voting Algorithm**: A clever O(1) space majority-element finder that uses a single forward pointer — related in spirit to two-pointer thinking: eliminate candidates rather than enumerate them
