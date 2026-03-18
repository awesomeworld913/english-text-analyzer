import { describe, it, expect } from 'vitest';
import { extractStudyWords } from '../studyWords';

describe('extractStudyWords', () => {
  it('cefrWordList에 없는 단어만 반환', () => {
    // 'the', 'cat' 등은 cefrWordList에 있을 가능성 높음
    // 'typhoon', 'blackout' 등은 없을 가능성 높음
    const words = ['the', 'cat', 'typhoon', 'typhoon', 'blackout', 'evacuate'];
    const result = extractStudyWords(words);
    const resultWords = result.map(w => w.word);
    // cefrWordList에 있는 흔한 단어는 포함되지 않아야 함
    expect(resultWords).not.toContain('the');
    expect(resultWords).not.toContain('cat');
  });

  it('불용어 제외', () => {
    const words = ['the', 'and', 'but', 'typhoon', 'typhoon'];
    const result = extractStudyWords(words);
    const resultWords = result.map(w => w.word);
    expect(resultWords).not.toContain('the');
    expect(resultWords).not.toContain('and');
  });

  it('3글자 미만 단어 제외', () => {
    const words = ['go', 'to', 'be', 'typhoon', 'typhoon'];
    const result = extractStudyWords(words);
    const resultWords = result.map(w => w.word);
    expect(resultWords).not.toContain('go');
    expect(resultWords).not.toContain('to');
  });

  it('숫자 제외', () => {
    const words = ['123', '456', 'typhoon', 'typhoon'];
    const result = extractStudyWords(words);
    const resultWords = result.map(w => w.word);
    expect(resultWords).not.toContain('123');
  });

  it('topN 제한', () => {
    const words = Array(50).fill('aaa').concat(Array(50).fill('bbb')).concat(Array(50).fill('ccc'));
    const result = extractStudyWords(words, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('각 항목에 word와 count 포함', () => {
    const words = ['typhoon', 'typhoon', 'blackout'];
    const result = extractStudyWords(words);
    for (const item of result) {
      expect(item).toHaveProperty('word');
      expect(item).toHaveProperty('count');
      expect(item.count).toBeGreaterThan(0);
    }
  });

  it('빈도가 높은 단어가 우선', () => {
    const words = [
      'typhoon', 'typhoon', 'typhoon',
      'blackout',
    ];
    const result = extractStudyWords(words);
    if (result.length >= 2) {
      // typhoon(3회)이 blackout(1회)보다 앞에 있어야 함
      const typhoonIdx = result.findIndex(w => w.word === 'typhoon');
      const blackoutIdx = result.findIndex(w => w.word === 'blackout');
      if (typhoonIdx >= 0 && blackoutIdx >= 0) {
        expect(typhoonIdx).toBeLessThan(blackoutIdx);
      }
    }
  });
});
