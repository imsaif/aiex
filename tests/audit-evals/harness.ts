/**
 * Shared pieces of the audit eval harness.
 *
 * Extracted so `run.ts` (single-arm) and `run-ab.ts` (paired A/B) load
 * fixtures, call analyze, and evaluate hard assertions through exactly the
 * same code. If these drifted, an A/B delta could come from the harness rather
 * than from the loop under test.
 */
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '../../src/lib/audit/prompts';
import { parseAnalysisResponse } from '../../src/lib/audit/parseAnalysis';
import type { ClaudeAnalysisResponse } from '../../src/types/audit';
import { ExpectedFixtureSchema, JUDGE_AXES, type FixtureResult, type JudgeAxis, type JudgeScores } from './types';

export const FIXTURES_DIR = path.join(__dirname, 'fixtures');
export const PASS_THRESHOLD = 4.0;

/** Overridable so a model bump can be measured against the same corpus without
 *  editing the harness. Defaults match the production analyze route. */
export const ANALYZE_MODEL = process.env.EVAL_ANALYZE_MODEL || 'claude-sonnet-4-6';

export type MediaType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
export type Expected = ReturnType<typeof ExpectedFixtureSchema.parse>;

export function detectMediaType(filename: string): MediaType {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

export interface FixtureRef {
  slug: string;
  screenshotPath: string;
  expectedPath: string;
}

export function loadFixtures(filter: string[]): FixtureRef[] {
  if (!fs.existsSync(FIXTURES_DIR)) return [];
  const entries = fs.readdirSync(FIXTURES_DIR, { withFileTypes: true });
  const out: FixtureRef[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('_')) continue; // skip _template
    const dir = path.join(FIXTURES_DIR, entry.name);
    const files = fs.readdirSync(dir);
    const screenshot = files.find((f) => /^screenshot\.(png|jpe?g|webp|gif)$/i.test(f));
    const expected = files.find((f) => f === 'expected.json');
    if (!screenshot || !expected) {
      console.warn(`[skip] ${entry.name}: missing screenshot or expected.json`);
      continue;
    }
    if (filter.length > 0 && !filter.some((f) => entry.name.includes(f))) continue;
    out.push({
      slug: entry.name,
      screenshotPath: path.join(dir, screenshot),
      expectedPath: path.join(dir, expected),
    });
  }
  return out;
}

export function readFixture(ref: FixtureRef): {
  expected: Expected;
  imageBase64: string;
  mediaType: MediaType;
} {
  const expected = ExpectedFixtureSchema.parse(JSON.parse(fs.readFileSync(ref.expectedPath, 'utf-8')));
  const imageBase64 = fs.readFileSync(ref.screenshotPath).toString('base64');
  return { expected, imageBase64, mediaType: detectMediaType(ref.screenshotPath) };
}

export type AnalyzeResult =
  | { ok: true; data: ClaudeAnalysisResponse; systemPrompt: string; rawText: string }
  | { ok: false; error: string; rawText: string };

/**
 * One analyze call using the production prompts and parser. Deliberately does
 * NOT run the verification loop — callers decide whether and when to apply it,
 * which is what lets the A/B runner share one draft across both arms.
 */
export async function callAnalyze(opts: {
  client: Anthropic;
  imageBase64: string;
  mediaType: MediaType;
  productType: Expected['productType'];
  model?: string;
}): Promise<AnalyzeResult> {
  const systemPrompt = buildSystemPrompt(opts.productType);
  const userPrompt =
    buildUserPrompt(opts.productType) +
    '\n\nIMPORTANT: This is a DESKTOP interface screenshot. Consider desktop-specific patterns.';

  let response;
  try {
    response = await opts.client.messages.create({
      model: opts.model || ANALYZE_MODEL,
      max_tokens: 4096,
      temperature: 0,
      // Same rubric as the production analyze route; the harness loops many
      // fixtures per run, so fixtures sharing a productType reuse this cached prefix.
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: opts.mediaType, data: opts.imageBase64 },
            },
            { type: 'text', text: userPrompt },
          ],
        },
      ],
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'analyze call threw', rawText: '' };
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  const rawText = textBlock && textBlock.type === 'text' ? textBlock.text : '';
  const parsed = parseAnalysisResponse(rawText);
  if (!parsed.ok) return { ok: false, error: `${parsed.reason}: ${parsed.detail}`, rawText };
  return { ok: true, data: parsed.data, systemPrompt, rawText };
}

export function evaluateHardAsserts(
  data: ClaudeAnalysisResponse,
  expected: Expected,
): FixtureResult['hardAsserts'] {
  const topGapPatterns = new Set((data.topGaps ?? []).map((g) => g.pattern.toLowerCase()));

  const mustFindHits: string[] = [];
  const mustFindMisses: string[] = [];
  for (const p of expected.mustFindPatterns) {
    if (topGapPatterns.has(p.toLowerCase())) mustFindHits.push(p);
    else mustFindMisses.push(p);
  }

  const mustNotFindViolations: string[] = [];
  for (const p of expected.mustNotFindPatterns) {
    if (topGapPatterns.has(p.toLowerCase())) mustNotFindViolations.push(p);
  }

  const emptyTopGapsRespected = expected.expectEmptyTopGaps ? (data.topGaps ?? []).length === 0 : null;

  const applicablePatternsOverflow = expected.maxApplicablePatterns
    ? Math.max(0, (data.applicablePatterns ?? []).length - expected.maxApplicablePatterns)
    : null;

  return {
    schemaValid: true,
    mustFindHits,
    mustFindMisses,
    mustNotFindViolations,
    emptyTopGapsRespected,
    applicablePatternsOverflow,
  };
}

export function hardAssertsPassed(h: FixtureResult['hardAsserts']): boolean {
  if (!h.schemaValid) return false;
  if (h.mustFindMisses.length > 0) return false;
  if (h.mustNotFindViolations.length > 0) return false;
  if (h.emptyTopGapsRespected === false) return false;
  if ((h.applicablePatternsOverflow ?? 0) > 0) return false;
  return true;
}

export function formatHardAsserts(h: FixtureResult['hardAsserts']): string {
  const lines: string[] = [];
  if (!h.schemaValid) lines.push('  ✗ schema invalid');
  if (h.mustFindHits.length > 0) lines.push(`  ✓ must-find hit: ${h.mustFindHits.join(', ')}`);
  if (h.mustFindMisses.length > 0) lines.push(`  ✗ must-find MISS: ${h.mustFindMisses.join(', ')}`);
  if (h.mustNotFindViolations.length > 0)
    lines.push(`  ✗ must-NOT-find VIOLATED: ${h.mustNotFindViolations.join(', ')}`);
  if (h.emptyTopGapsRespected === false) lines.push('  ✗ expected empty topGaps but findings were returned');
  if (h.emptyTopGapsRespected === true) lines.push('  ✓ empty topGaps respected');
  if ((h.applicablePatternsOverflow ?? 0) > 0)
    lines.push(`  ✗ applicablePatterns over cap by ${h.applicablePatternsOverflow}`);
  return lines.join('\n');
}

/** Mean of each judge axis across the scored fixtures. Null when none scored. */
export function axisMeansOf(scores: JudgeScores[]): Record<JudgeAxis, number> | null {
  if (scores.length === 0) return null;
  return Object.fromEntries(
    JUDGE_AXES.map((axis) => [axis, scores.reduce((sum, s) => sum + (s[axis] as number), 0) / scores.length]),
  ) as Record<JudgeAxis, number>;
}
