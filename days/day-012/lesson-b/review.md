## Day 012 — Lesson B Review: Gift Card Budget Matching

### What you should have learned

1. **Domain application doesn't change the algorithm**: `hasExactBudgetPair` is `hasPairWithSum` with different variable names. The e-commerce context (prices, gift cards, budgets) is just vocabulary layered on top of the same two-pointer structure.
2. **Bulk counting with `right - left`**: When `prices[left] + prices[right] <= budget`, *all* pairs `(left, j)` where `j` ranges from `left+1` to `right` are affordable. The sorted order guarantees this, and counting `right - left` in one step is more efficient than a nested loop.
3. **`cheapestAffordablePair` has a short answer**: In a sorted array, the cheapest pair is always the two smallest elements. If those two don't fit the budget, no pair does. The two-pointer approach finds it, but so does a direct check of `prices[0] + prices[1]`.
4. **"At most" vs "exactly" changes the pointer movement logic**: `hasExactBudgetPair` requires exact equality — both conditions (`< target` and `> target`) move pointers. `countAffordablePairs` uses `<=` — when the sum fits, count and advance `left`; only when it's too large do we shrink from the right.
5. **Naming inputs `sortedPrices` communicates a precondition**: The word "sorted" in the parameter name is a contract — callers know they must provide sorted input. This is better than silently failing on unsorted data.

### Reviewing your implementation

#### Function 1: `hasExactBudgetPair(sortedPrices, giftCardValue)`

```js
function hasExactBudgetPair(sortedPrices, giftCardValue) {
  let left = 0;
  let right = sortedPrices.length - 1;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];
    if (total === giftCardValue) return true;
    if (total < giftCardValue) left++;
    else right--;
  }

  return false;
}

const catalog = [10, 15, 20, 25, 30, 35, 50, 75, 100];

console.log(hasExactBudgetPair(catalog, 45));   // true  (10+35 or 15+30)
console.log(hasExactBudgetPair(catalog, 125));  // true  (25+100)
console.log(hasExactBudgetPair(catalog, 12));   // false
console.log(hasExactBudgetPair([], 50));        // false
```

**Key insights:**
- Structurally identical to `hasPairWithSum` from Lesson A — the algorithm is unchanged
- Returns `true` on the first matching pair found — doesn't need to find all matching pairs
- Early return on first match makes it efficient in the best case (O(1) if the first pair matches)

**Edge cases handled:**
- Empty catalog → `false`
- Single item → `false` (can't form a pair)
- Gift card value smaller than the two cheapest items → loop runs but no pair ever matches → `false`

---

#### Function 2: `countAffordablePairs(sortedPrices, budget)`

```js
function countAffordablePairs(sortedPrices, budget) {
  let left = 0;
  let right = sortedPrices.length - 1;
  let count = 0;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];

    if (total <= budget) {
      count += right - left;   // all (left, j) pairs where j in [left+1..right]
      left++;
    } else {
      right--;
    }
  }

  return count;
}

console.log(countAffordablePairs([10, 20, 30, 40], 50));   // 4
// (10+20), (10+30), (10+40), (20+30) all ≤ 50
// (20+40)=60 > 50, (30+40)=70 > 50 → not counted

console.log(countAffordablePairs([50, 60], 50));           // 0
```

**Key insights:**
- `total <= budget → count += right - left` — the bulk counting step; advances `left` not `right`
- `total > budget → right--` — the pair is too expensive; try a cheaper right item
- When the sum is within budget, we advance `left` because we've counted all qualifying pairs involving `sortedPrices[left]`; there's nothing more to check for this `left` position

**Trace for `[10, 20, 30, 40]`, budget `50`:**
```
left=0(10), right=3(40): 50 ≤ 50 → count += 3-0=3, left=1
left=1(20), right=3(40): 60 > 50 → right=2
left=1(20), right=2(30): 50 ≤ 50 → count += 2-1=1, left=2
left=2(30), right=2(30): stop
Total: 3+1 = 4 ✓
```

**Edge cases handled:**
- No pair within budget → `0`
- All pairs within budget → total is n*(n-1)/2
- Empty or single-element array → `0`

---

#### Function 3: `cheapestAffordablePair(sortedPrices, budget)`

```js
function cheapestAffordablePair(sortedPrices, budget) {
  if (sortedPrices.length < 2) return null;

  // The cheapest possible pair is always the two smallest elements.
  // If they don't fit, nothing fits.
  const cheapest = sortedPrices[0] + sortedPrices[1];
  if (cheapest > budget) return null;

  return [sortedPrices[0], sortedPrices[1]];
}

console.log(cheapestAffordablePair([10, 20, 30, 40], 50));   // [10, 20]
console.log(cheapestAffordablePair([30, 40, 50], 20));       // null
console.log(cheapestAffordablePair([10], 100));              // null
```

**Key insights:**
- In a sorted array, the minimum-sum pair is always the two leftmost elements — this makes the function O(1)
- The two-pointer approach would also find this (it would terminate immediately), but the direct approach is clearer
- Recognizing that "cheapest pair" in a sorted array is trivially the first two elements is the key insight

**Edge cases handled:**
- Fewer than 2 items → `null` (can't form a pair)
- Cheapest pair exceeds budget → `null`

### Going deeper

#### Extension 1: Find the pair closest to the budget (without exceeding it)

```js
function closestAffordablePair(sortedPrices, budget) {
  let left = 0;
  let right = sortedPrices.length - 1;
  let bestPair = null;
  let bestTotal = -1;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];

    if (total <= budget) {
      if (total > bestTotal) {
        bestTotal = total;
        bestPair = [sortedPrices[left], sortedPrices[right]];
      }
      left++;
    } else {
      right--;
    }
  }

  return bestPair;
}

console.log(closestAffordablePair([10, 20, 30, 40], 55));
// [20, 30] or [10, 40] → total 50 (closest to 55 without exceeding)
```

This is a common interview variant: "find the pair with maximum sum not exceeding target."

#### Extension 2: Return all exact-match pairs

```js
function allExactBudgetPairs(sortedPrices, giftCardValue) {
  const pairs = [];
  let left = 0;
  let right = sortedPrices.length - 1;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];
    if (total === giftCardValue) {
      pairs.push([sortedPrices[left], sortedPrices[right]]);
      left++;
      right--;
    } else if (total < giftCardValue) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}

console.log(allExactBudgetPairs([10, 15, 20, 25, 30, 35], 45));
// [[10, 35], [15, 30], [20, 25]]
```

### Common mistakes and how to fix them

#### Mistake 1: Using `<` instead of `<=` in the affordable-pairs check

```js
// WRONG — misses pairs that sum exactly to the budget
function countAffordablePairs(sortedPrices, budget) {
  // ...
  if (total < budget) {   // should be <=
    count += right - left;
    left++;
  } else {
    right--;
  }
}

// With <: [10+40=50] is not counted for budget=50. Returns 2 instead of 4.
```

**Problem:** "Affordable" means `<= budget` (at most the budget), not `< budget`. A pair that costs exactly the budget is affordable.
**Fix:** `if (total <= budget)`.

---

#### Mistake 2: `count += right - left + 1` (off by one)

```js
// WRONG — counts the element paired with itself
count += right - left + 1;   // should be right - left
```

**Problem:** `right - left + 1` includes the pair `(left, left)` — the same element paired with itself. The valid pairs are `(left, left+1), (left, left+2), ..., (left, right)` — that's `right - left` pairs.
**Fix:** `count += right - left`.

---

#### Mistake 3: Sorting inside the function without telling the caller

```js
// SILENT SIDE EFFECT
function hasExactBudgetPair(prices, giftCardValue) {
  prices.sort((a, b) => a - b);   // mutates the caller's array!
  // ...
}
```

**Problem:** If the caller passes `catalog` and expects it to remain in its original order (by product ID, not price), sorting inside the function breaks that expectation silently.
**Fix:** Either document that the function requires sorted input, or sort a copy: `const sortedPrices = [...prices].sort((a, b) => a - b);`.

### Connection to interview problems

- **LeetCode 167 — Two Sum II**: `hasExactBudgetPair` is the exact problem (sorted array, return the 1-indexed pair positions instead of a boolean)
- **LeetCode 1099 — Two Sum Less Than K**: `countAffordablePairs` variant — find the maximum sum strictly less than k, and the pair that achieves it
- **Real-world e-commerce**: Amazon's "complete the look" feature, Spotify's "two songs that fit in a commute" — both are pair-finding problems on sorted data with a budget constraint

### Discussion questions

1. **`cheapestAffordablePair` is O(1) because the answer is always the two smallest elements. Does this generalization hold for three items?** Yes — the cheapest triple is always the three smallest elements. For the minimum-sum k-element subset of a sorted array, the answer is always the first k elements. This is a greedy observation: you can't do better than using the smallest available values.

2. **`countAffordablePairs` counts pairs without returning which pairs they are. When would you need the actual pairs?** For display (showing a customer the pairs they can afford), for further processing (filtering by some other attribute), or for debugging. In performance-critical code, counting is enough; for user-facing features, you often need the actual pairs. Design the interface based on what the caller needs.

3. **Suppose prices can include duplicates — two products both cost $30. Does `hasExactBudgetPair` still work correctly?** Yes — the two-pointer approach works whether values are unique or not. If both `prices[left]` and `prices[right]` are 30 and the gift card value is 60, the condition `total === giftCardValue` fires immediately. Two different products at the same price are still a valid pair.

### Further exploration

- [LeetCode 167 — Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/): The canonical two-pointer pair problem — start here if you want to practice before tackling variants
- Read about **SQL range queries**: `WHERE price + price2 = 50` in a product table — database optimizers sometimes use two-pointer-like scans on sorted indexes, or they fall back to nested loops when indexes aren't available. Understanding the algorithm helps you understand query performance.
