import { describe, it, expect } from 'vitest';
import { estimateArLevel } from '../arEstimator';

describe('estimateArLevel', () => {
  it('AR 레벨은 0.1~13.0 범위', () => {
    const result = estimateArLevel(5.0, 200);
    expect(result.level).toBeGreaterThanOrEqual(0.1);
    expect(result.level).toBeLessThanOrEqual(13.0);
  });

  it('낮은 FK 등급이면 낮은 AR 레벨', () => {
    const low = estimateArLevel(1.0, 200);
    const high = estimateArLevel(10.0, 200);
    expect(low.level).toBeLessThan(high.level);
  });

  it('짧은 지문(100단어 미만)은 -0.3 보정', () => {
    const short = estimateArLevel(5.0, 50);
    const normal = estimateArLevel(5.0, 200);
    expect(short.level).toBeLessThan(normal.level);
  });

  it('긴 지문(1000단어 초과)은 +0.2 보정', () => {
    const normal = estimateArLevel(5.0, 500);
    const long = estimateArLevel(5.0, 1500);
    expect(long.level).toBeGreaterThan(normal.level);
  });

  it('한국어 학년 등급 포함', () => {
    const result = estimateArLevel(5.0, 200);
    expect(result.gradeEquivalent).toBeTruthy();
    expect(typeof result.gradeEquivalent).toBe('string');
  });
});
