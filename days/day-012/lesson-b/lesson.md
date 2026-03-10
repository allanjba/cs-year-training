## Day 012 — Lesson B (Applied): Gift Card Budget Matching

### Why this matters

In Lesson A you built the two-pointer technique in the abstract. Now apply it to a problem every e-commerce engineer has faced: **finding product combinations within a budget**.

A customer has a $50 gift card. They want to know: "Are there exactly two products I can buy that total exactly $50?" Or, softer: "What pairs of products can I afford?" A naive nested loop checks every pair — that's O(n²) for a catalog of any size. For a store with 10,000 products, that's 100 million checks to answer a simple customer query.

The two-pointer technique on a sorted price list answers the same question in O(n): one pass, no nested loops, constant space.

This pattern underlies real-world product recommendation systems ("complete the look — this shirt pairs with these pants under $100"), bundle pricing tools, and cart optimization features. Anywhere you need to find combinations of items that hit a price point, the two-pointer approach applies.

### The core concept

The product catalog is a sorted list of prices. Two scenarios:

**Scenario 1: Exact match** — does any pair sum to exactly the gift card value?
- Same as `hasPairWithSum` from Lesson A, applied to prices

**Scenario 2: Within budget** — how many pairs have a combined price ≤ budget?
- A variation: when the sum is ≤ budget, *all* pairs between `left` and `right` also qualify (since the array is sorted and `prices[right-1] < prices[right]`)

The second scenario introduces a key insight: when `prices[left] + prices[right] <= budget`, every element between `left` and `right-1` paired with `prices[left]` also fits the budget. That's `right - left` valid pairs in one step, not just one.

```
prices: [10, 20, 30, 40, 50]   budget: 60

left=0 (10), right=4 (50): 10+50=60 ≤ 60 → all pairs with prices[0] and anything ≤ right qualify:
  (10,20), (10,30), (10,40), (10,50) → that's 4 pairs (right - left = 4)
  Move left rightward.

left=1 (20), right=4 (50): 20+50=70 > 60 → too expensive, move right inward.

left=1 (20), right=3 (40): 20+40=60 ≤ 60 → all pairs with prices[1] and ≤ right:
  (20,30), (20,40) → 2 pairs (right - left = 2)
  Move left rightward.

left=2 (30), right=3 (40): 30+40=70 > 60 → move right inward.

left=2 (30), right=2 (30): left === right → stop.

Total: 4 + 2 = 6 pairs.
```

### How it works

**Function 1: `hasExactBudgetPair(sortedPrices, giftCardValue)`**

Directly reuses the two-pointer pair-sum logic from Lesson A:

```
Input: [10, 15, 20, 35, 50], giftCard = 55

left=0 (10), right=4 (50): 60 > 55 → right--
left=0 (10), right=3 (35): 45 < 55 → left++
left=1 (15), right=3 (35): 50 < 55 → left++
left=2 (20), right=3 (35): 55 === 55 → true!
```

**Function 2: `countAffordablePairs(sortedPrices, budget)`**

When the sum fits, count all qualifying pairs in bulk:

```
Input: [10, 20, 30, 40], budget = 50

left=0 (10), right=3 (40): 10+40=50 ≤ 50 → add (right-left)=3 pairs, left++
left=1 (20), right=3 (40): 20+40=60 > 50 → right--
left=1 (20), right=2 (30): 20+30=50 ≤ 50 → add (right-left)=1 pair, left++
left=2 (30), right=2 (30): left === right → stop

Total: 3 + 1 = 4 pairs
```

### Code implementation

```js
const catalog = [10, 15, 20, 25, 30, 35, 50, 75, 100];

function hasExactBudgetPair(sortedPrices, giftCardValue) {
  let left = 0;
  let right = sortedPrices.length - 1;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];
    if (total === giftCardValue) return true;
    if (total < giftCardValue) {
      left++;
    } else {
      right--;
    }
  }

  return false;
}

console.log(hasExactBudgetPair(catalog, 45));    // true  (10+35 or 15+30)
console.log(hasExactBudgetPair(catalog, 125));   // true  (25+100)
console.log(hasExactBudgetPair(catalog, 12));    // false
```

**Breaking it down:**

- Structurally identical to `hasPairWithSum` from Lesson A — "gift card value" is just a domain name for "target sum"
- The catalog must be sorted — the input is named `sortedPrices` to make the requirement explicit

Now the pair-counting variant:

```js
function countAffordablePairs(sortedPrices, budget) {
  let left = 0;
  let right = sortedPrices.length - 1;
  let count = 0;

  while (left < right) {
    const total = sortedPrices[left] + sortedPrices[right];

    if (total <= budget) {
      // prices[left] + any price in [left+1..right] is ≤ budget
      // (since prices are sorted and prices[right] is the largest in this range)
      count += right - left;
      left++;
    } else {
      right--;
    }
  }

  return count;
}

console.log(countAffordablePairs(catalog, 45));    // count pairs ≤ $45
console.log(countAffordablePairs(catalog, 200));   // count pairs ≤ $200 (probably all)
console.log(countAffordablePairs([10, 20], 100)); // 1
```

**Why `count += right - left` works:**

When `sortedPrices[left] + sortedPrices[right] <= budget`, the cheapest pair involving `sortedPrices[left]` is within budget. Since the array is sorted, any element from index `left+1` to `right` is ≤ `sortedPrices[right]`, so any pair `(sortedPrices[left], sortedPrices[j])` for `j` in `[left+1, right]` is also within budget. That's `right - left` pairs total, counted in one operation.

### Common pitfalls

**1. Forgetting the input must be sorted**

`hasExactBudgetPair` will silently give wrong answers on an unsorted catalog. The fix: sort the prices before calling, or validate in the function. For this lesson, the spec guarantees sorted input — but in production, you'd sort defensively.

**2. Off-by-one in the affordable-pair count**

`count += right - left` counts pairs `(left, left+1), (left, left+2), ..., (left, right)`. That's `right - left` pairs, not `right - left + 1`. The +1 would include the pair `(left, left)` — the same element paired with itself, which is not allowed.

**3. Using the same item twice**

In the gift card problem, buying one item twice (using the same product for both "slots") is usually not allowed — you can't split one $25 item into two $12.50 items to hit a $25 target. The `left < right` condition prevents this.

**4. Checking only the `=== giftCardValue` case and missing nearby pairs**

`hasExactBudgetPair` checks for an exact match. `countAffordablePairs` is different — it counts pairs where the total is *at most* the budget. These are two different questions. Know which one the problem is asking.

### Computer Science foundations

**Time Complexity:** O(n log n) if sorting is needed, O(n) if the input is already sorted. The two-pointer scan is always O(n).

**Space Complexity:** O(1) — no extra data structures beyond the two index variables.

**Why the bulk count works (invariant proof):**

When `prices[left] + prices[right] <= budget`, consider any pair `(left, j)` where `left < j <= right`:
- `prices[j] <= prices[right]` (sorted)
- So `prices[left] + prices[j] <= prices[left] + prices[right] <= budget`
- Therefore all `right - left` pairs involving `prices[left]` are affordable

After counting them, we advance `left` — we've "settled" all affordable pairs that use `prices[left]`, and we never visit this `left` index again.

**Connection to other algorithms:**

- **Three Sum (LeetCode 15)**: Fix one element, then use two pointers on the remainder — reduces O(n³) to O(n²)
- **Container With Most Water (LeetCode 11)**: Two pointers, different greedy rule for which pointer to advance
- **Merge step in Merge Sort**: Two pointers advancing through two sorted halves — same "compare and advance" logic, different purpose

### Real-world applications

- **E-commerce bundles**: "Frequently bought together" recommendations within a price cap
- **Menu optimization**: Restaurant apps suggesting meal + drink combinations within a calorie or price limit
- **Asset allocation**: Finding two-asset portfolios within a risk budget (prices = risk scores)
- **Scheduling**: Finding two tasks that fit within a time slot

### Before the exercise

In the exercise, you'll implement:

1. **`hasExactBudgetPair(sortedPrices, giftCardValue)`** — does any pair sum to exactly the gift card value?
2. **`countAffordablePairs(sortedPrices, budget)`** — how many pairs have combined price ≤ budget?
3. **`cheapestAffordablePair(sortedPrices, budget)`** — return the pair `[price1, price2]` with the smallest combined price that is still ≤ budget, or `null` if no pair qualifies

The third function requires you to find the minimum-sum pair within the budget. Think about where the minimum pair lives in the sorted array before coding.
