import { wordFrequencyRank } from '../data/commonWords';

function gradeToKorean(lexile) {
  if (lexile < 200) return '초등 1학년 이하';
  if (lexile < 400) return '초등 2~3학년';
  if (lexile < 600) return '초등 4~5학년';
  if (lexile < 800) return '초등 6학년~중1';
  if (lexile < 1000) return '중학교 수준';
  if (lexile < 1200) return '고등학교 수준';
  if (lexile < 1400) return '대학교 수준';
  return '대학원 이상';
}

export function estimateLexileScore(words, sentenceCount) {
  const totalWords = words.length;
  const totalSentences = Math.max(sentenceCount, 1);
  const meanSentenceLength = totalWords / totalSentences;

  // Calculate mean log word frequency
  const maxRank = 10000;
  let totalLogFreq = 0;
  for (const word of words) {
    const rank = wordFrequencyRank.get(word) || maxRank;
    totalLogFreq += Math.log(rank);
  }
  const meanLogWordFreq = totalLogFreq / Math.max(totalWords, 1);

  // Approximation formula combining sentence length and word rarity
  let lexile = Math.round(
    meanSentenceLength * 18 + meanLogWordFreq * 120 - 380
  );

  // Clamp to valid range
  lexile = Math.max(0, Math.min(2000, lexile));

  // Round to nearest 10
  lexile = Math.round(lexile / 10) * 10;

  return {
    score: lexile,
    label: `${lexile}L`,
    gradeEquivalent: gradeToKorean(lexile),
  };
}
