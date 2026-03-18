import { describe, it, expect } from 'vitest';
import { estimateCefrLevel } from '../cefrEstimator';

describe('estimateCefrLevel', () => {
  it('쉬운 단어로 구성된 텍스트는 낮은 CEFR 등급', () => {
    const words = 'i am a boy the cat is big my name is tom'.split(' ');
    const result = estimateCefrLevel(words, 5, 1.0);
    expect(['A1', 'A2']).toContain(result.level);
  });

  it('유효한 CEFR 등급 반환 (A1~C2)', () => {
    const words = 'hello world this is a test'.split(' ');
    const result = estimateCefrLevel(words, 6, 3.0);
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(result.level);
  });

  it('한국어 라벨 포함', () => {
    const words = 'hello'.split(' ');
    const result = estimateCefrLevel(words, 1, 1.0);
    expect(result.label).toBeTruthy();
  });

  it('vocabularyProfile 포함', () => {
    const words = 'the quick brown fox jumps'.split(' ');
    const result = estimateCefrLevel(words, 5, 3.0);
    expect(result.vocabularyProfile).toBeDefined();
    expect(result.vocabularyProfile.A1).toBeDefined();
  });

  it('confidence (어휘 매칭률) 반환', () => {
    const words = 'the cat sat on a mat'.split(' ');
    const result = estimateCefrLevel(words, 6, 1.0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });

  it('numericLevel은 1~6 사이', () => {
    const words = 'sophisticated philosophical methodology'.split(' ');
    const result = estimateCefrLevel(words, 3, 12.0);
    expect(result.numericLevel).toBeGreaterThanOrEqual(1);
    expect(result.numericLevel).toBeLessThanOrEqual(6);
  });
});
