import { describe, it, expect } from 'vitest';
import { countSyllables, countTotalSyllables } from '../syllables';

describe('countSyllables', () => {
  it('1음절 단어', () => {
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('the')).toBe(1);
    expect(countSyllables('go')).toBe(1);
  });

  it('2음절 단어', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('water')).toBe(2);
  });

  it('3음절 이상 단어', () => {
    expect(countSyllables('beautiful')).toBeGreaterThanOrEqual(3);
    expect(countSyllables('emergency')).toBeGreaterThanOrEqual(3);
  });

  it('짧은 단어(3글자 이하)는 1음절', () => {
    expect(countSyllables('a')).toBe(1);
    expect(countSyllables('an')).toBe(1);
    expect(countSyllables('the')).toBe(1);
  });

  it('최소 1음절 반환', () => {
    expect(countSyllables('x')).toBeGreaterThanOrEqual(1);
  });
});

describe('countTotalSyllables', () => {
  it('단어 배열의 총 음절 수 계산', () => {
    const words = ['hello', 'world'];
    const total = countTotalSyllables(words);
    expect(total).toBeGreaterThanOrEqual(2);
  });

  it('빈 배열은 0 반환', () => {
    expect(countTotalSyllables([])).toBe(0);
  });
});
