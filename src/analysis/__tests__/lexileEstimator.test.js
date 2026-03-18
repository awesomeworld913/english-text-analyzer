import { describe, it, expect } from 'vitest';
import { estimateLexileScore } from '../lexileEstimator';

describe('estimateLexileScore', () => {
  it('점수는 0~2000 범위', () => {
    const words = 'the cat sat on the mat'.split(' ');
    const result = estimateLexileScore(words, 1);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(2000);
  });

  it('점수는 10 단위로 반올림', () => {
    const words = 'this is a simple sentence for testing purposes'.split(' ');
    const result = estimateLexileScore(words, 1);
    expect(result.score % 10).toBe(0);
  });

  it('label은 숫자L 형식', () => {
    const words = 'hello world'.split(' ');
    const result = estimateLexileScore(words, 1);
    expect(result.label).toMatch(/^\d+L$/);
  });

  it('한국어 학년 등급 포함', () => {
    const words = 'the cat is big'.split(' ');
    const result = estimateLexileScore(words, 1);
    expect(result.gradeEquivalent).toBeTruthy();
  });

  it('긴 복잡한 문장은 더 높은 Lexile 점수', () => {
    const easyWords = 'i am a cat'.split(' ');
    const hardWords = 'the sophisticated philosophical methodology requires comprehensive analytical evaluation of multifaceted phenomena'.split(' ');
    const easy = estimateLexileScore(easyWords, 1);
    const hard = estimateLexileScore(hardWords, 1);
    expect(hard.score).toBeGreaterThan(easy.score);
  });
});
