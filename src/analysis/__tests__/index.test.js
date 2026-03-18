import { describe, it, expect } from 'vitest';
import { analyze } from '../index';

describe('analyze (통합 테스트)', () => {
  const sampleText = `The cat sat on the mat. The dog ran fast.
The bird flew high in the sky. It was a beautiful day.`;

  it('빈 텍스트는 null 반환', () => {
    expect(analyze('')).toBeNull();
    expect(analyze('   ')).toBeNull();
    expect(analyze(null)).toBeNull();
  });

  it('모든 분석 결과 필드 포함', () => {
    const result = analyze(sampleText);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('passageStats');
    expect(result).toHaveProperty('readability');
    expect(result).toHaveProperty('cefrLevel');
    expect(result).toHaveProperty('lexileScore');
    expect(result).toHaveProperty('arLevel');
    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('expressions');
  });

  it('passageStats에 필수 필드 포함', () => {
    const result = analyze(sampleText);
    const stats = result.passageStats;
    expect(stats.wordCount).toBeGreaterThan(0);
    expect(stats.sentenceCount).toBeGreaterThan(0);
    expect(stats.paragraphCount).toBeGreaterThan(0);
    expect(stats.characterCount).toBeGreaterThan(0);
    expect(stats.avgSentenceLength).toBeGreaterThan(0);
    expect(stats.avgWordLength).toBeGreaterThan(0);
  });

  it('readability에 Flesch 점수 포함', () => {
    const result = analyze(sampleText);
    expect(result.readability.fleschReadingEase).toBeDefined();
    expect(result.readability.fleschKincaidGrade).toBeDefined();
  });

  it('cefrLevel은 유효한 등급', () => {
    const result = analyze(sampleText);
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(result.cefrLevel.level);
  });

  it('lexileScore는 숫자', () => {
    const result = analyze(sampleText);
    expect(typeof result.lexileScore.score).toBe('number');
  });

  it('keywords는 배열', () => {
    const result = analyze(sampleText);
    expect(result.keywords).toBeInstanceOf(Array);
  });

  it('expressions는 배열', () => {
    const result = analyze(sampleText);
    expect(result.expressions).toBeInstanceOf(Array);
  });
});
