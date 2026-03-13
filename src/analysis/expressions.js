import { stopWords } from '../data/stopWords';

function isContentWord(word) {
  return word.length >= 3 && !stopWords.has(word) && !/^\d+$/.test(word);
}

export function extractExpressions(sentences, topN = 10) {
  const ngramFreq = new Map();

  for (const sentence of sentences) {
    const words = sentence
      .toLowerCase()
      .replace(/[^a-z'\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

    // Extract bigrams
    for (let i = 0; i < words.length - 1; i++) {
      if (isContentWord(words[i]) || isContentWord(words[i + 1])) {
        // At least one content word
        if (isContentWord(words[i]) && isContentWord(words[i + 1])) {
          const bigram = `${words[i]} ${words[i + 1]}`;
          ngramFreq.set(bigram, (ngramFreq.get(bigram) || 0) + 1);
        }
      }
    }

    // Extract trigrams
    for (let i = 0; i < words.length - 2; i++) {
      const contentCount = [words[i], words[i + 1], words[i + 2]].filter(isContentWord).length;
      if (contentCount >= 2) {
        const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        ngramFreq.set(trigram, (ngramFreq.get(trigram) || 0) + 1);
      }
    }
  }

  // Filter n-grams that appear at least 2 times, or if text is short, include 1-occurrence ones
  const minFreq = sentences.length > 5 ? 2 : 1;

  const sorted = [...ngramFreq.entries()]
    .filter(([, count]) => count >= minFreq)
    .sort((a, b) => {
      // Sort by frequency, then by length (longer phrases preferred)
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].split(' ').length - a[0].split(' ').length;
    })
    .slice(0, topN);

  return sorted.map(([phrase, count]) => ({ phrase, count }));
}
