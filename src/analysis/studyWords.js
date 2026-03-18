import { stopWords } from '../data/stopWords';
import { cefrWordList } from '../data/cefrWordList';

export function extractStudyWords(words, topN = 10) {
  const freq = new Map();

  for (const word of words) {
    if (word.length < 3) continue;
    if (stopWords.has(word)) continue;
    if (/^\d+$/.test(word)) continue;
    // cefrWordList에 있는 단어는 제외 — 없는 단어만 대상
    if (cefrWordList.has(word)) continue;

    freq.set(word, (freq.get(word) || 0) + 1);
  }

  // 중요도 = 빈도 × 단어길이 가중치 (긴 단어일수록 학습 가치 높음)
  const scored = [...freq.entries()].map(([word, count]) => ({
    word,
    count,
    score: count * (1 + word.length * 0.2),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN).map(({ word, count }) => ({ word, count }));
}
