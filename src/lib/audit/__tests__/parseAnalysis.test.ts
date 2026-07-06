import { extractJsonObject, parseAnalysisResponse } from '../parseAnalysis';

const validGap = {
  pattern: 'Confidence Visualization',
  status: 'missing' as const,
  finding: 'AI message has no confidence indicator',
  evidence: 'The message bubble shows only the answer text',
  recommendation: 'Add a confidence chip near the response timestamp',
  resource: 'aiuxdesign.guide/patterns/confidence-visualization',
  screenshotIndex: 1,
};

const minimalClaudeResponse = {
  score: 12,
  maxScore: 24,
  productTypeSummary: 'A chat product.',
  surfaceDescription: 'Mid-conversation chat thread.',
  applicablePatterns: ['Confidence Visualization', 'Error Recovery'],
  topGaps: [validGap],
  quickWins: ['Add a confidence chip'],
  chatContext: 'Two gaps found, one critical.',
};

describe('extractJsonObject', () => {
  it('returns null for empty input', () => {
    expect(extractJsonObject('')).toBeNull();
    // @ts-expect-error — null is a real possibility from upstream
    expect(extractJsonObject(null)).toBeNull();
  });

  it('returns null when no { is present', () => {
    expect(extractJsonObject('Here is your answer: nope')).toBeNull();
  });

  it('extracts a bare JSON object', () => {
    const out = extractJsonObject('{"score":1}');
    expect(out).toBe('{"score":1}');
  });

  it('strips ```json fences', () => {
    const out = extractJsonObject('```json\n{"score":1}\n```');
    expect(out).toBe('{"score":1}');
  });

  it('strips bare ``` fences without language tag', () => {
    const out = extractJsonObject('```\n{"score":2}\n```');
    expect(out).toBe('{"score":2}');
  });

  it('skips prose preamble', () => {
    const out = extractJsonObject('Here is the analysis you requested:\n\n{"score":3}');
    expect(out).toBe('{"score":3}');
  });

  it('respects brace balance — does not greedy-match past the first object', () => {
    const out = extractJsonObject('{"a":1} extra garbage {"b":2}');
    expect(out).toBe('{"a":1}');
  });

  it('handles nested objects', () => {
    const text = '{"outer":{"inner":{"k":"v"}}}';
    expect(extractJsonObject(text)).toBe(text);
  });

  it('does not get confused by braces inside string values', () => {
    const text = '{"finding":"the button says {save}"}';
    expect(extractJsonObject(text)).toBe(text);
  });

  it('handles escaped quotes in strings', () => {
    const text = '{"finding":"label says \\"Send\\""}';
    expect(extractJsonObject(text)).toBe(text);
  });

  it('returns null on truncated JSON (unbalanced braces)', () => {
    expect(extractJsonObject('{"score":1, "topGaps": [')).toBeNull();
  });
});

describe('parseAnalysisResponse', () => {
  it('never throws on garbage input', () => {
    expect(() => parseAnalysisResponse('')).not.toThrow();
    expect(() => parseAnalysisResponse('not json at all')).not.toThrow();
    expect(() => parseAnalysisResponse('{"truncated":')).not.toThrow();
  });

  it('returns ok=true on a clean valid response', () => {
    const result = parseAnalysisResponse(JSON.stringify(minimalClaudeResponse));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.score).toBe(12);
      expect(result.data.topGaps).toHaveLength(1);
      expect(result.data.topGaps[0].pattern).toBe('Confidence Visualization');
    }
  });

  it('returns ok=true when response is wrapped in markdown fences', () => {
    const wrapped = '```json\n' + JSON.stringify(minimalClaudeResponse) + '\n```';
    const result = parseAnalysisResponse(wrapped);
    expect(result.ok).toBe(true);
  });

  it('returns ok=true with prose preamble', () => {
    const wrapped = "Sure, here's the analysis:\n\n" + JSON.stringify(minimalClaudeResponse);
    const result = parseAnalysisResponse(wrapped);
    expect(result.ok).toBe(true);
  });

  it('fills defaults for optional missing fields', () => {
    const result = parseAnalysisResponse(JSON.stringify({ topGaps: [] }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.applicablePatterns).toEqual([]);
      expect(result.data.quickWins).toEqual([]);
      expect(result.data.chatContext).toBe('');
    }
  });

  it('accepts an empty topGaps array (valid grounded "no patterns apply" response)', () => {
    const result = parseAnalysisResponse(
      JSON.stringify({ ...minimalClaudeResponse, topGaps: [] }),
    );
    expect(result.ok).toBe(true);
  });

  it('returns no-json when input has no JSON object', () => {
    const result = parseAnalysisResponse('I cannot analyze this image.');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('no-json');
  });

  it('returns invalid-json on malformed JSON (e.g. trailing comma)', () => {
    const result = parseAnalysisResponse('{"score":1, "topGaps":[],}');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('invalid-json');
  });

  it('returns invalid-json on truncated response', () => {
    const result = parseAnalysisResponse('{"score":1, "topGaps":[');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // truncated is detected as no-json (unbalanced) before parse is attempted
      expect(['no-json', 'invalid-json']).toContain(result.reason);
    }
  });

  it('returns schema-mismatch when topGaps[].status is invalid', () => {
    const bad = {
      ...minimalClaudeResponse,
      topGaps: [{ ...validGap, status: 'critical' }],
    };
    const result = parseAnalysisResponse(JSON.stringify(bad));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('schema-mismatch');
      expect(result.detail).toMatch(/status/);
    }
  });

  it('returns schema-mismatch when a topGap is missing required pattern field', () => {
    const bad = {
      ...minimalClaudeResponse,
      topGaps: [{ status: 'missing', finding: 'something' }],
    };
    const result = parseAnalysisResponse(JSON.stringify(bad));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('schema-mismatch');
  });

  it('allows null score and maxScore (documented "no patterns apply" case)', () => {
    const result = parseAnalysisResponse(
      JSON.stringify({ ...minimalClaudeResponse, score: null, maxScore: null }),
    );
    expect(result.ok).toBe(true);
  });

  it('captures the raw text for diagnostic logging on failure', () => {
    const garbage = 'this is not json';
    const result = parseAnalysisResponse(garbage);
    if (!result.ok) {
      expect(result.raw).toBe(garbage);
    }
  });

  // P0 output rewrite — gaps now carry an impact line and an effort tag.
  it('preserves the new impact + effort fields on a gap', () => {
    const gap = { ...validGap, impact: 'Users stall before their first success.', effort: 'quick' as const };
    const result = parseAnalysisResponse(
      JSON.stringify({ ...minimalClaudeResponse, topGaps: [gap] }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.topGaps[0].impact).toBe('Users stall before their first success.');
      expect(result.data.topGaps[0].effort).toBe('quick');
    }
  });

  it('accepts gaps with no impact/effort (backward compatible with old results)', () => {
    const result = parseAnalysisResponse(JSON.stringify(minimalClaudeResponse));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.topGaps[0].impact).toBeUndefined();
      expect(result.data.topGaps[0].effort).toBeUndefined();
    }
  });

  it('rejects an effort value outside the allowed set', () => {
    const gap = { ...validGap, effort: 'trivial' };
    const result = parseAnalysisResponse(
      JSON.stringify({ ...minimalClaudeResponse, topGaps: [gap] }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('schema-mismatch');
  });
});
