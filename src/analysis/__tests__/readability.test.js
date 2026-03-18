import { describe, it, expect } from 'vitest';
import { computeReadability } from '../readability';

describe('computeReadability', () => {
  it('쉬운 텍스트는 높은 Flesch Reading Ease 점수', () => {
    const easyWords = 'the cat sat on the mat the dog ran fast'.split(' ');
    const result = computeReadability(easyWords, 2);
    expect(result.fleschReadingEase).toBeGreaterThan(60);
  });

  it('Flesch Reading Ease는 0~100 범위', () => {
    const words = 'hello world this is a simple test sentence here'.split(' ');
    const result = computeReadability(words, 1);
    expect(result.fleschReadingEase).toBeGreaterThanOrEqual(0);
    expect(result.fleschReadingEase).toBeLessThanOrEqual(100);
  });

  it('Flesch-Kincaid Grade는 0 이상', () => {
    const words = 'hello world'.split(' ');
    const result = computeReadability(words, 1);
    expect(result.fleschKincaidGrade).toBeGreaterThanOrEqual(0);
  });

  it('한국어 난이도 라벨 반환', () => {
    const words = 'the cat sat on a mat'.split(' ');
    const result = computeReadability(words, 1);
    expect(result.fleschReadingEaseLabel).toBeTruthy();
    expect(typeof result.fleschReadingEaseLabel).toBe('string');
  });

  it('총 음절 수 반환', () => {
    const words = 'hello world'.split(' ');
    const result = computeReadability(words, 1);
    expect(result.totalSyllables).toBeGreaterThan(0);
  });
});
