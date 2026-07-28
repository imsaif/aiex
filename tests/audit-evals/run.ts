#!/usr/bin/env ts-node
/**
 * Golden-corpus eval runner for the audit tool.
 *
 * Reads each `tests/audit-evals/fixtures/<slug>/` directory that contains a
 * `screenshot.{png|jpg|jpeg|webp}` + `expected.json`, calls the same prompts
 * production uses (src/lib/audit/prompts.ts) against Claude Sonnet 4 vision,
 * parses the response with the production parser (src/lib/audit/parseAnalysis),
 * runs hard assertions from `expected.json`, then asks a Claude-based judge to
 * score the output across 5 rubric axes.
 *
 * Exits non-zero if any fixture fails hard assertions OR if the axis means
 * fall below the pass threshold. Designed for CI on prompt/model changes.
 *
 * Usage:
 *   npm run eval:audit              # full corpus
 *   npm run eval:audit -- foo bar   # only fixtures whose slug contains "foo" or "bar"
 *
 * Requires ANTHROPIC_API_KEY in env (loaded via dotenv from .env.local).
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '../../src/lib/audit/prompts';
import { parseAnalysisResponse } from '../../src/lib/audit/parseAnalysis';
import type { ClaudeAnalysisResponse } from '../../src/types/audit';
import { ExpectedFixtureSchema, JUDGE_AXES, type EvalRunReport, type FixtureResult, type JudgeAxis } from './types';
import { judgeAudit } from './judge';
import { runVerificationLoop } from '../../src/lib/audit/verifyLoop';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const REPORT_PATH = path.join(__dirname, 'last-run.json');
const PASS_THRESHOLD = 4.0;
const ANALYZE_MODEL = 'claude-sonnet-4-6';

type MediaType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

function detectMediaType(filename: string): MediaType {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

function loadFixtures(filter: string[]): Array<{
  slug: string;
  screenshotPath: string;
  expectedPath: string;
}> {
  if (!fs.existsSync(FIXTURES_DIR)) return [];
  const entries = fs.readdirSync(FIXTURES_DIR, { withFileTypes: true });
  const out: Array<{ slug: string; screenshotPath: string; expectedPath: string }> = [];

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

async function callAnalyze(opts: {
  client: Anthropic;
  imageBase64: string;
  mediaType: MediaType;
  productType: ReturnType<typeof ExpectedFixtureSchema.parse>['productType'];
}): Promise<{ ok: true; data: unknown; rawText: string } | { ok: false; error: string; rawText: string }> {
  const systemPrompt = buildSystemPrompt(opts.productType);
  const userPrompt =
    buildUserPrompt(opts.productType) +
    '\n\nIMPORTANT: This is a DESKTOP interface screenshot. Consider desktop-specific patterns.';

  let response;
  try {
    response = await opts.client.messages.create({
      model: ANALYZE_MODEL,
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
  if (!parsed.ok) {
    return { ok: false, error: `${parsed.reason}: ${parsed.detail}`, rawText };
  }

  let data = parsed.data;
  if (process.env.EVAL_WITH_LOOP === '1') {
    const loop = await runVerificationLoop({
      client: opts.client,
      imageBlocks: [
        { type: 'image', source: { type: 'base64', media_type: opts.mediaType, data: opts.imageBase64 } },
      ],
      draft: parsed.data,
      deadlineMs: Date.now() + 300000, // eval is offline; give it plenty of room
    });
    data = loop.result;
  }
  return { ok: true, data, rawText };
}

function evaluateHardAsserts(
  data: ClaudeAnalysisResponse,
  expected: ReturnType<typeof ExpectedFixtureSchema.parse>,
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

  const emptyTopGapsRespected = expected.expectEmptyTopGaps
    ? (data.topGaps ?? []).length === 0
    : null;

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

function hardAssertsPassed(h: FixtureResult['hardAsserts']): boolean {
  if (!h.schemaValid) return false;
  if (h.mustFindMisses.length > 0) return false;
  if (h.mustNotFindViolations.length > 0) return false;
  if (h.emptyTopGapsRespected === false) return false;
  if ((h.applicablePatternsOverflow ?? 0) > 0) return false;
  return true;
}

function formatHardAsserts(h: FixtureResult['hardAsserts']): string {
  const lines: string[] = [];
  if (!h.schemaValid) lines.push('  ✗ schema invalid');
  if (h.mustFindHits.length > 0) lines.push(`  ✓ must-find hit: ${h.mustFindHits.join(', ')}`);
  if (h.mustFindMisses.length > 0) lines.push(`  ✗ must-find MISS: ${h.mustFindMisses.join(', ')}`);
  if (h.mustNotFindViolations.length > 0) lines.push(`  ✗ must-NOT-find VIOLATED: ${h.mustNotFindViolations.join(', ')}`);
  if (h.emptyTopGapsRespected === false) lines.push('  ✗ expected empty topGaps but findings were returned');
  if (h.emptyTopGapsRespected === true) lines.push('  ✓ empty topGaps respected');
  if ((h.applicablePatternsOverflow ?? 0) > 0)
    lines.push(`  ✗ applicablePatterns over cap by ${h.applicablePatternsOverflow}`);
  return lines.join('\n');
}

async function main() {
  const filter = process.argv.slice(2);
  const fixtures = loadFixtures(filter);

  console.log(`[eval:audit] Found ${fixtures.length} fixture(s) under ${FIXTURES_DIR}`);
  if (fixtures.length === 0) {
    console.log(`[eval:audit] No fixtures to run. See tests/audit-evals/README.md to add one.`);
    process.exit(0);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[eval:audit] ANTHROPIC_API_KEY not set. Aborting.');
    process.exit(2);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const startedAt = new Date().toISOString();
  const t0 = Date.now();
  const results: FixtureResult[] = [];

  for (const fx of fixtures) {
    process.stdout.write(`\n[${fx.slug}] running... `);
    const expected = ExpectedFixtureSchema.parse(JSON.parse(fs.readFileSync(fx.expectedPath, 'utf-8')));
    const imageBuf = fs.readFileSync(fx.screenshotPath);
    const imageBase64 = imageBuf.toString('base64');
    const mediaType = detectMediaType(fx.screenshotPath);

    const analyze = await callAnalyze({ client, imageBase64, mediaType, productType: expected.productType });
    if (!analyze.ok) {
      console.log(`ANALYZE FAILED: ${analyze.error}`);
      results.push({
        slug: fx.slug,
        description: expected.description,
        productType: expected.productType,
        auditResponse: null,
        hardAsserts: {
          schemaValid: false,
          mustFindHits: [],
          mustFindMisses: expected.mustFindPatterns,
          mustNotFindViolations: [],
          emptyTopGapsRespected: null,
          applicablePatternsOverflow: null,
        },
        judge: null,
        judgeError: analyze.error,
        hardAssertsPassed: false,
      });
      continue;
    }

    const hardAsserts = evaluateHardAsserts(analyze.data as ClaudeAnalysisResponse, expected);
    const passed = hardAssertsPassed(hardAsserts);
    process.stdout.write(`hard-asserts: ${passed ? 'PASS' : 'FAIL'} ... judging... `);

    const judge = await judgeAudit({
      client,
      imageBase64,
      mediaType,
      fixtureDescription: expected.description,
      fixtureNotes: expected.notes,
      productType: expected.productType,
      auditJson: analyze.data,
    });

    if (!judge.ok) {
      console.log(`JUDGE FAILED: ${judge.error}`);
      results.push({
        slug: fx.slug,
        description: expected.description,
        productType: expected.productType,
        auditResponse: analyze.data,
        hardAsserts,
        judge: null,
        judgeError: judge.error,
        hardAssertsPassed: passed,
      });
      continue;
    }

    console.log(
      `judged. F=${judge.scores.faithfulness} S=${judge.scores.specificity} P=${judge.scores.patternFit} A=${judge.scores.actionability} NF=${judge.scores.noFabrication}`,
    );
    const hardLines = formatHardAsserts(hardAsserts);
    if (hardLines) console.log(hardLines);
    if (judge.scores.comments) console.log(`  judge: ${judge.scores.comments}`);

    results.push({
      slug: fx.slug,
      description: expected.description,
      productType: expected.productType,
      auditResponse: analyze.data,
      hardAsserts,
      judge: judge.scores,
      judgeError: null,
      hardAssertsPassed: passed,
    });
  }

  // Aggregate
  const judged = results.filter((r) => r.judge !== null);
  const axisMeans: Record<JudgeAxis, number> | null =
    judged.length === 0
      ? null
      : (Object.fromEntries(
          JUDGE_AXES.map((axis) => [
            axis,
            judged.reduce((sum, r) => sum + (r.judge![axis] as number), 0) / judged.length,
          ]),
        ) as Record<JudgeAxis, number>);

  const passedHard = results.filter((r) => r.hardAssertsPassed).length;
  const report: EvalRunReport = {
    startedAt,
    durationMs: Date.now() - t0,
    fixtures: results,
    axisMeans,
    passedHardAsserts: passedHard,
    totalFixtures: results.length,
  };
  const reportPath = process.env.EVAL_WITH_LOOP === '1'
    ? path.join(__dirname, 'last-run-loop.json')
    : REPORT_PATH;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n=== Eval Summary ===');
  console.log(`Fixtures: ${results.length}`);
  console.log(`Hard-asserts passed: ${passedHard}/${results.length}`);
  if (axisMeans) {
    for (const axis of JUDGE_AXES) {
      console.log(`  ${axis.padEnd(16)} ${axisMeans[axis].toFixed(2)}`);
    }
  }
  console.log(`Duration: ${(report.durationMs / 1000).toFixed(1)}s`);
  console.log(`Report: ${reportPath}`);

  // Exit criteria
  const hardFail = passedHard < results.length;
  const meanFail = axisMeans
    ? Object.values(axisMeans).some((v) => v < PASS_THRESHOLD)
    : false;
  if (hardFail || meanFail) {
    console.log(`\n[eval:audit] FAIL — ${hardFail ? `${results.length - passedHard} hard-assert failure(s)` : ''}${hardFail && meanFail ? '; ' : ''}${meanFail ? `axis mean(s) below ${PASS_THRESHOLD}` : ''}`);
    process.exit(1);
  }
  console.log('\n[eval:audit] PASS');
}

main().catch((err) => {
  console.error('[eval:audit] fatal:', err);
  process.exit(2);
});
