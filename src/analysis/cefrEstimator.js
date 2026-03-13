import { cefrWordList } from '../data/cefrWordList';

const LEVEL_NAMES = {
  A1: '입문', A2: '초급', B1: '중급',
  B2: '중상급', C1: '상급', C2: '최상급',
};

const LEVEL_NUMERIC = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
const NUMERIC_LEVEL = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function getVocabularyProfile(words) {
  const profile = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  let matched = 0;
  let unknownCount = 0;

  for (const word of words) {
    const level = cefrWordList.get(word);
    if (level) {
      profile[level]++;
      matched++;
    } else {
      unknownCount++;
    }
  }

  // Unknown words: distribute based on word length as a proxy for complexity
  // Short unknown words (<=5 chars) are likely simpler, longer ones more advanced
  for (const word of words) {
    if (!cefrWordList.get(word)) {
      if (word.length <= 4) { profile.A2++; }
      else if (word.length <= 6) { profile.B1++; }
      else if (word.length <= 8) { profile.B2++; }
      else { profile.C1++; }
    }
  }

  const total = words.length || 1;
  const percentProfile = {};
  for (const level of Object.keys(profile)) {
    percentProfile[level] = Math.round((profile[level] / total) * 1000) / 10;
  }

  return { profile, percentProfile, matchRate: Math.round((matched / total) * 100) };
}

function getVocabLevel(profile, totalWords) {
  // Find the level at which 80% of words are accounted for
  let cumulative = 0;
  const total = totalWords || 1;
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const level of levels) {
    cumulative += profile[level] || 0;
    if (cumulative / total >= 0.8) {
      return LEVEL_NUMERIC[level];
    }
  }
  return 6; // C2
}

function getSentenceComplexityLevel(avgSentenceLength) {
  if (avgSentenceLength < 8) return 1;
  if (avgSentenceLength < 12) return 2;
  if (avgSentenceLength < 17) return 3;
  if (avgSentenceLength < 22) return 4;
  if (avgSentenceLength < 28) return 5;
  return 6;
}

function getFKLevel(fkGrade) {
  if (fkGrade < 2) return 1;
  if (fkGrade < 4) return 2;
  if (fkGrade < 7) return 3;
  if (fkGrade < 10) return 4;
  if (fkGrade < 13) return 5;
  return 6;
}

export function estimateCefrLevel(words, avgSentenceLength, fleschKincaidGrade) {
  const { profile, percentProfile, matchRate } = getVocabularyProfile(words);

  const vocabLevel = getVocabLevel(profile, words.length);
  const sentenceLevel = getSentenceComplexityLevel(avgSentenceLength);
  const fkLevel = getFKLevel(fleschKincaidGrade);

  // Weighted combination: vocab 50%, sentence 25%, FK 25%
  const weighted = vocabLevel * 0.5 + sentenceLevel * 0.25 + fkLevel * 0.25;
  const roundedLevel = Math.max(1, Math.min(6, Math.round(weighted)));

  const level = NUMERIC_LEVEL[roundedLevel];

  return {
    level,
    label: LEVEL_NAMES[level],
    numericLevel: roundedLevel,
    confidence: matchRate,
    vocabularyProfile: percentProfile,
    details: {
      vocabLevel: NUMERIC_LEVEL[vocabLevel],
      sentenceLevel: NUMERIC_LEVEL[sentenceLevel],
      fkLevel: NUMERIC_LEVEL[fkLevel],
    },
  };
}
