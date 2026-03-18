import { computePassageStats } from './passageStats';
import { computeReadability } from './readability';
import { estimateCefrLevel } from './cefrEstimator';
import { estimateLexileScore } from './lexileEstimator';
import { estimateArLevel } from './arEstimator';
import { extractKeywords } from './keywords';
import { extractExpressions } from './expressions';
import { extractStudyWords } from './studyWords';

export function analyze(text) {
  if (!text || !text.trim()) return null;

  const stats = computePassageStats(text);

  if (stats.wordCount === 0) return null;

  const readability = computeReadability(stats.words, stats.sentenceCount);

  const cefrLevel = estimateCefrLevel(
    stats.words,
    stats.avgSentenceLength,
    readability.fleschKincaidGrade
  );

  const lexileScore = estimateLexileScore(stats.words, stats.sentenceCount);

  const arLevel = estimateArLevel(readability.fleschKincaidGrade, stats.wordCount);

  const keywords = extractKeywords(stats.words);

  const expressions = extractExpressions(stats.sentences);

  const studyWords = extractStudyWords(stats.words);

  return {
    passageStats: {
      wordCount: stats.wordCount,
      sentenceCount: stats.sentenceCount,
      paragraphCount: stats.paragraphCount,
      characterCount: stats.characterCount,
      avgSentenceLength: stats.avgSentenceLength,
      avgWordLength: stats.avgWordLength,
    },
    readability,
    cefrLevel,
    lexileScore,
    arLevel,
    keywords,
    expressions,
    studyWords,
  };
}
