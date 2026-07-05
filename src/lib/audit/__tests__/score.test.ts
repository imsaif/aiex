import { clampScore } from '../score';

describe('clampScore', () => {
  it('clamps a score above maxScore down to maxScore (the 157% bug)', () => {
    // 44/28 was ~157% in the sample data — must clamp to the max.
    expect(clampScore(44, 28)).toBe(28);
    expect(clampScore(57, 36)).toBe(36);
  });

  it('leaves an in-range score unchanged', () => {
    expect(clampScore(0, 36)).toBe(0);
    expect(clampScore(20, 36)).toBe(20);
    expect(clampScore(36, 36)).toBe(36);
  });

  it('floors negative or non-finite scores to 0 (garbage in → 0, not a bogus perfect score)', () => {
    expect(clampScore(-5, 36)).toBe(0);
    expect(clampScore(NaN, 36)).toBe(0);
    expect(clampScore(Infinity, 36)).toBe(0);
  });

  it('returns 0 when maxScore is invalid (0, negative, or non-finite)', () => {
    expect(clampScore(10, 0)).toBe(0);
    expect(clampScore(10, -1)).toBe(0);
    expect(clampScore(10, NaN)).toBe(0);
  });
});
