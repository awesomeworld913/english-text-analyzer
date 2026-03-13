import { countTotalSyllables } from './syllables';

export function computeReadability(words, sentenceCount) {
  const totalWords = words.length;
  const totalSentences = Math.max(sentenceCount, 1);
  const totalSyllables = countTotalSyllables(words);

  // Flesch Reading Ease: 0-100, higher = easier
  const fleschReadingEase = Math.round(
    (206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)) * 10
  ) / 10;

  // Flesch-Kincaid Grade Level: US grade level
  const fleschKincaidGrade = Math.round(
    (0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59) * 10
  ) / 10;

  const clampedFRE = Math.max(0, Math.min(100, fleschReadingEase));

  let label;
  if (clampedFRE >= 90) label = '매우 쉬움';
  else if (clampedFRE >= 80) label = '쉬움';
  else if (clampedFRE >= 70) label = '비교적 쉬움';
  else if (clampedFRE >= 60) label = '보통';
  else if (clampedFRE >= 50) label = '비교적 어려움';
  else if (clampedFRE >= 30) label = '어려움';
  else label = '매우 어려움';

  return {
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    fleschReadingEaseLabel: label,
    fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
    totalSyllables,
  };
}
