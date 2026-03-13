import { splitSentences, tokenizeWords, splitParagraphs } from './tokenizer';

export function computePassageStats(text) {
  const words = tokenizeWords(text);
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);
  const characterCount = text.replace(/\s/g, '').length;

  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const paragraphCount = Math.max(paragraphs.length, 1);

  const avgSentenceLength = wordCount / sentenceCount;
  const avgWordLength = wordCount > 0
    ? words.reduce((sum, w) => sum + w.length, 0) / wordCount
    : 0;

  return {
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    characterCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    words,
    sentences,
  };
}
