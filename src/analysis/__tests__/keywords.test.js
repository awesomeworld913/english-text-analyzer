import { describe, it, expect } from 'vitest';
import { extractKeywords } from '../keywords';

describe('extractKeywords', () => {
  const words = [
    'the', 'cat', 'sat', 'on', 'the', 'mat',
    'the', 'cat', 'was', 'happy', 'cat', 'mat',
    'hello', 'world', 'hello', 'hello',
  ];

  it('빈도순으로 키워드 추출', () => {
    const result = extractKeywords(words);
    expect(result.length).toBeGreaterThan(0);
    // cat(3), hello(3)이 상위에 있어야 함
    const topWords = result.map(k => k.word);
    expect(topWords).toContain('cat');
    expect(topWords).toContain('hello');
  });

  it('불용어(the, on, was) 제외', () => {
    const result = extractKeywords(words);
    const topWords = result.map(k => k.word);
    expect(topWords).not.toContain('the');
    expect(topWords).not.toContain('was');
  });

  it('3글자 미만 단어 제외', () => {
    const wordsWithShort = ['go', 'to', 'be', 'cat', 'cat', 'cat'];
    const result = extractKeywords(wordsWithShort);
    const topWords = result.map(k => k.word);
    expect(topWords).not.toContain('go');
    expect(topWords).not.toContain('to');
  });

  it('숫자만 있는 단어 제외', () => {
    const wordsWithNums = ['123', '456', 'cat', 'cat', 'cat'];
    const result = extractKeywords(wordsWithNums);
    const topWords = result.map(k => k.word);
    expect(topWords).not.toContain('123');
  });

  it('topN 제한', () => {
    const result = extractKeywords(words, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('각 키워드에 count와 cefrLevel 포함', () => {
    const result = extractKeywords(words);
    for (const keyword of result) {
      expect(keyword).toHaveProperty('word');
      expect(keyword).toHaveProperty('count');
      expect(keyword).toHaveProperty('cefrLevel');
      expect(keyword.count).toBeGreaterThan(0);
    }
  });
});
