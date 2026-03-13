import { stopWords } from '../data/stopWords';
import { cefrWordList } from '../data/cefrWordList';

export function extractKeywords(words, topN = 15) {
  const freq = new Map();

  for (const word of words) {
    if (word.length < 3) continue;
    if (stopWords.has(word)) continue;
    if (/^\d+$/.test(word)) continue;
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  const sorted = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted.map(([word, count]) => ({
    word,
    count,
    cefrLevel: cefrWordList.get(word) || '—',
  }));
}
