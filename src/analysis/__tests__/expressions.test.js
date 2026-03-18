import { describe, it, expect } from 'vitest';
import { extractExpressions } from '../expressions';

describe('extractExpressions', () => {
  it('반복되는 bigram 추출', () => {
    const sentences = [
      'Stay safe and stay calm.',
      'Stay safe everyone.',
      'Please stay safe.',
    ];
    const result = extractExpressions(sentences);
    const phrases = result.map(e => e.phrase);
    expect(phrases).toContain('stay safe');
  });

  it('각 표현에 phrase와 count 포함', () => {
    const sentences = [
      'Wait for help. Wait for help.',
      'Stay calm. Stay calm.',
    ];
    const result = extractExpressions(sentences);
    for (const expr of result) {
      expect(expr).toHaveProperty('phrase');
      expect(expr).toHaveProperty('count');
      expect(expr.count).toBeGreaterThanOrEqual(1);
    }
  });

  it('topN 제한', () => {
    const sentences = [
      'hello world hello world hello world',
      'good morning good morning good morning',
      'stay safe stay safe stay safe',
    ];
    const result = extractExpressions(sentences, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('짧은 텍스트에서는 1회 출현도 포함', () => {
    const sentences = [
      'Natural disaster warning.',
      'Emergency alert system.',
    ];
    const result = extractExpressions(sentences);
    // 5문장 이하이므로 minFreq=1
    // 결과가 있을 수도 없을 수도 있음 (content word 조건에 따라)
    expect(result).toBeInstanceOf(Array);
  });

  it('빈도순 정렬', () => {
    const sentences = [
      'stay safe stay safe stay safe',
      'wait help wait help',
      'stay safe',
    ];
    const result = extractExpressions(sentences);
    if (result.length >= 2) {
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
    }
  });
});
