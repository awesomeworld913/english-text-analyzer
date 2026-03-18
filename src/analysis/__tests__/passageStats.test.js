import { describe, it, expect } from 'vitest';
import { computePassageStats } from '../passageStats';

describe('computePassageStats', () => {
  const text = 'The cat sat on the mat. The dog ran fast.';

  it('단어 수 계산', () => {
    const stats = computePassageStats(text);
    expect(stats.wordCount).toBe(10);
  });

  it('문장 수 계산', () => {
    const stats = computePassageStats(text);
    expect(stats.sentenceCount).toBe(2);
  });

  it('문단 수 계산', () => {
    const stats = computePassageStats(text);
    expect(stats.paragraphCount).toBe(1);
  });

  it('평균 문장 길이 계산', () => {
    const stats = computePassageStats(text);
    expect(stats.avgSentenceLength).toBe(5);
  });

  it('글자 수 계산 (공백 제외)', () => {
    const stats = computePassageStats(text);
    expect(stats.characterCount).toBeGreaterThan(0);
  });

  it('words 배열 반환', () => {
    const stats = computePassageStats(text);
    expect(stats.words).toBeInstanceOf(Array);
    expect(stats.words.length).toBe(10);
  });

  it('여러 문단 텍스트', () => {
    const multiParagraph = 'First paragraph.\n\nSecond paragraph.';
    const stats = computePassageStats(multiParagraph);
    expect(stats.paragraphCount).toBe(2);
    expect(stats.sentenceCount).toBe(2);
  });
});
