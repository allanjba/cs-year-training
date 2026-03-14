# Day 20 — Lesson B: Word Frequency Analysis

## 1. Why This Matters

Natural language processing sits at the core of search engines, recommendation systems, spam filters, and large language models. Before any of those sophisticated algorithms can run, the text has to be reduced to a numerical representation. One of the most fundamental representations is term frequency: how often does each word appear? From this simple counting operation flows TF-IDF (term frequency-inverse document frequency), which is how Google originally ranked pages; bag-of-words models used in email spam detection; and the word embedding training signals used by modern transformers.

For software engineers specifically, word frequency analysis is a classic coding interview question — but it is also genuinely useful. Log analysis often comes down to "count occurrences of this pattern." User behavior analysis counts action types. A/B test analysis counts conversions. In all these cases, the technique is the same: clean the input, count with a Map, query the result. The text domain makes it approachable because everyone understands words, but the pattern applies to any domain.

This lesson reinforces and deepens the Map skills from Lesson A by applying them to string manipulation. The twist is that raw text is messy: it has punctuation, mixed case, extra whitespace, and words you might want to ignore. Cleaning the input before counting is as important as the counting itself — a lesson that applies broadly in data engineering.

## 2. The Core Concept

Word frequency analysis has three stages: **normalize**, **tokenize**, and **count**.

- **Normalize** means reducing variation that should be treated as equivalent. "The", "the", and "THE" should all count as the same word. We lowercase everything. We also strip punctuation so that "hello," and "hello" count the same.
- **Tokenize** means splitting the normalized text into individual tokens (words). In English, splitting on whitespace is 90% correct. For production NLP you'd use a proper tokenizer, but for this lesson, `.split(/\s+/)` suffices.
- **Count** means building the frequency map: one pass through the token array, `(map.get(word) ?? 0) + 1` per word.

Once you have the frequency map, querying it is straightforward:
- `topNWords` sorts entries by count descending and takes the first N.
- `uniqueWordCount` is just `map.size`.

The interesting engineering decision is where to do the cleaning: in a separate normalization step, or embedded in the counting loop. Separating concerns (normalize first, count separately) makes each step easier to test and modify — a good habit to build.

## 3. How It Works — Hand Trace

Input text: `"The quick brown fox jumps. The fox is quick!"`

**Stage 1 — Normalize:**
```
lowercase: "the quick brown fox jumps. the fox is quick!"
strip punctuation: "the quick brown fox jumps the fox is quick"
```

**Stage 2 — Tokenize:**
```
split on whitespace: ["the", "quick", "brown", "fox", "jumps", "the", "fox", "is", "quick"]
filter empty strings: (none to filter in this case)
```

**Stage 3 — Count:**
```
"the"   → 1 → 2
"quick" → 1 → 2
"brown" → 1
"fox"   → 1 → 2
"jumps" → 1
"is"    → 1

Final map: { the:2, quick:2, brown:1, fox:2, jumps:1, is:1 }
```

**`topNWords` with n=2:**
```
Entries sorted by count desc:
  [["the",2], ["quick",2], ["fox",2], ["brown",1], ["jumps",1], ["is",1]]

Take first 2: [["the", 2], ["quick", 2]]
```

Note: when counts tie (the, quick, fox all have count 2), the order among tied words depends on sort stability and insertion order. JavaScript's `.sort()` is stable since ES2019, so tied words appear in the order they first occurred in the map.

## 4. Code Implementation

```javascript
/**
 * Builds a word frequency map from a text string.
 * Normalizes to lowercase and strips punctuation before counting.
 *
 * Time:  O(n) where n is the length of the text
 * Space: O(k) where k is the number of unique words
 */
function wordFrequency(text) {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");    // keep letters, digits, spaces

  const words = normalized
    .split(/\s+/)                      // split on any whitespace run
    .filter(w => w.length > 0);        // remove empty strings from leading/trailing spaces

  const map = new Map();
  for (const word of words) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }

  return map;
}
```

```javascript
/**
 * Returns the top N words by frequency.
 * Ties are broken by order of first occurrence (Map insertion order).
 *
 * Time:  O(n log n) — dominated by the sort; building freq map is O(n)
 * Space: O(k) — k unique words
 */
function topNWords(text, n) {
  const freq = wordFrequency(text);

  // Sort entries by count descending
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, n);   // [[word, count], ...]
}
```

```javascript
/**
 * Returns the number of distinct words in the text.
 * Normalization is applied before counting, so "the" and "The" are one word.
 *
 * Time:  O(n)
 * Space: O(k)
 */
function uniqueWordCount(text) {
  return wordFrequency(text).size;
}
```

**Key regex patterns used:**

| Pattern | Meaning |
|---|---|
| `/[^a-z0-9\s]/g` | Any character that is NOT a lowercase letter, digit, or whitespace — replace with `""` |
| `/\s+/` | One or more whitespace characters (space, tab, newline) — used for splitting |

The `g` flag on the replace regex means "replace all occurrences, not just the first."

**Why `filter(w => w.length > 0)`:**
If the text starts or ends with whitespace, `"  hello".split(/\s+/)` produces `["", "hello"]`. The filter removes any empty string tokens that result from leading, trailing, or multiple consecutive spaces.

## 5. Common Pitfalls

**Pitfall 1: Not lowercasing before counting.**
"The" and "the" are different `Map` keys. Without lowercasing, a document with 100 occurrences of "the" (some capitalized at sentence start) would be split across two keys, both with lower counts. Always normalize first.

**Pitfall 2: Forgetting to filter empty strings.**
`"hello  world".split(/\s+/)` returns `["hello", "world"]` — fine. But `"  hello world  ".split(/\s+/)` returns `["", "hello", "world", ""]`. Empty strings counted in the frequency map (`"" → 2`) corrupt results. Always filter.

**Pitfall 3: Stripping too aggressively.**
`text.replace(/\W/g, "")` strips everything that's not a "word character" (`[A-Za-z0-9_]`). This collapses "hello-world" into "helloworld". Be intentional: if hyphens should split words, replace `-` with a space first. The regex `/[^a-z0-9\s]/g` after lowercasing is explicit and safe.

**Pitfall 4: Mutating `entries()` results.**
`[...freq.entries()]` creates a new array. Sorting that array is fine. Sorting `freq.entries()` directly would attempt to sort an iterator, which is a TypeError. Always spread iterators into arrays before sorting.

## 6. Computer Science Foundations

**TF-IDF.** Term Frequency (TF) is `wordFrequency(doc).get(word) / totalWords(doc)`. Inverse Document Frequency (IDF) is `log(totalDocs / docsContainingWord)`. TF × IDF weights words that are common in one document but rare across all documents — giving you the "important" words. Your `wordFrequency` function computes the raw term frequency counts that TF-IDF is built on.

**Bag of Words model.** Converting a document to a frequency map is called "bag of words" representation. It loses word order but captures vocabulary distribution. This representation is the input to classic ML classifiers (Naive Bayes, logistic regression) for spam detection, sentiment analysis, and topic modeling.

**Zipf's law.** In natural language, the frequency of any word is roughly inversely proportional to its frequency rank. The most common word appears about twice as often as the second most common, three times as often as the third, and so on. `topNWords` lets you observe this: the top few words ("the", "and", "a") dominate the frequency distribution.

**Stop word removal.** "The", "is", "a", "and" are so common they carry no information for distinguishing documents. Production NLP pipelines filter these "stop words" before counting. Your `wordFrequency` function would be extended with a `stopWords: Set` parameter to skip these.

## 7. Real-World Applications

**Search indexing.** Google's inverted index maps each word to the list of documents containing it, with term frequencies. Building the index is a massive-scale version of `wordFrequency` applied to billions of documents in parallel (via MapReduce, which was named after this exact operation).

**Spam filtering.** Naive Bayes spam classifiers compute `P(spam | words)` using word frequencies in known spam and non-spam emails. Training the model is `wordFrequency` applied to thousands of labeled emails, producing frequency maps for each class.

**Trending topics.** Twitter/X's trending algorithm computes word frequencies over a rolling time window and identifies words whose frequency has spiked relative to their baseline. Your `topNWords` is the core of the "what's trending" computation.

**Code analysis tools.** Linters and code complexity tools count identifier frequencies, comment ratios, and pattern occurrences in source code. Your `wordFrequency` function works equally well on JavaScript source text (modulo comment stripping).

## 8. Before the Exercise

Answer these questions before writing code:

1. What does `"Hello, World!".toLowerCase().replace(/[^a-z0-9\s]/g, "")` produce? Trace through both operations.

2. What does `"  hello   world  ".split(/\s+/)` return? What element is at index 0? Why is the `filter` step necessary?

3. In `topNWords`, you spread `freq.entries()` into an array before sorting. Why can't you sort a `Map.entries()` iterator directly?

4. If `text = "a a a b b c"`, what does `topNWords(text, 2)` return? What about `topNWords(text, 10)` — does it crash, or return something sensible?

5. How would you modify `wordFrequency` to also accept a `Set` of stop words and exclude them from the count? Describe the change in one sentence without writing code.
