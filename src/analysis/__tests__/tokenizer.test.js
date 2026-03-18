import { describe, it, expect } from 'vitest';
import { splitSentences, tokenizeWords, splitParagraphs } from '../tokenizer';

describe('splitSentences', () => {
  it('빈 텍스트는 빈 배열 반환', () => {
    expect(splitSentences('')).toEqual([]);
    expect(splitSentences('   ')).toEqual([]);
    expect(splitSentences(null)).toEqual([]);
  });

  it('마침표로 끝나는 문장 분리', () => {
    const result = splitSentences('Hello world. This is a test.');
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('Hello world.');
    expect(result[1]).toBe('This is a test.');
  });

  it('물음표/느낌표로 끝나는 문장 분리', () => {
    const result = splitSentences('Are you okay? Yes! I am fine.');
    expect(result).toHaveLength(3);
  });

  it('약어(Mr., Dr.)에서는 분리하지 않음', () => {
    const result = splitSentences('Mr. Smith went home. He was tired.');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('Mr.');
  });

  it('말줄임표(...)는 별도 문장으로 분리', () => {
    const result = splitSentences('Wait... I think so.');
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('Wait...');
    expect(result[1]).toBe('I think so.');
  });

  it('소수점에서 분리하지 않음', () => {
    const result = splitSentences('The score was 3.5 points. Good job.');
    expect(result).toHaveLength(2);
  });
});

describe('tokenizeWords', () => {
  it('빈 텍스트는 빈 배열 반환', () => {
    expect(tokenizeWords('')).toEqual([]);
    expect(tokenizeWords(null)).toEqual([]);
  });

  it('소문자로 변환하여 단어 추출', () => {
    const result = tokenizeWords('Hello World');
    expect(result).toEqual(['hello', 'world']);
  });

  it('구두점 제거', () => {
    const result = tokenizeWords('Hello, world! How are you?');
    expect(result).toEqual(['hello', 'world', 'how', 'are', 'you']);
  });

  it("아포스트로피 포함 단어 유지 (don't)", () => {
    const result = tokenizeWords("I don't know");
    expect(result).toContain("don't");
  });
});

describe('splitParagraphs', () => {
  it('빈 텍스트는 빈 배열 반환', () => {
    expect(splitParagraphs('')).toEqual([]);
  });

  it('빈 줄로 문단 분리', () => {
    const result = splitParagraphs('First paragraph.\n\nSecond paragraph.');
    expect(result).toHaveLength(2);
  });

  it('한 문단만 있는 경우', () => {
    const result = splitParagraphs('Just one paragraph here.');
    expect(result).toHaveLength(1);
  });
});
