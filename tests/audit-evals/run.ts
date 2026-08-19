#!/usr/bin/env ts-node
/**
 * Golden-corpus eval runner for the audit tool.
 *
 * Reads each `tests/audit-evals/fixtures/<slug>/` directory that contains a
 * `screenshot.{png|jpg|jpeg|webp}` + `expected.json`, calls the same prompts
 * production uses (src/lib/audit/prompts.ts) against Claude vision, parses the
 * response with the production parser (src/lib/audit/parseAnalysis), runs hard
 * assertions from `expected.json`, then asks a Claude-based judge to score the
 * output across 5 rubric axes.
 *
 * Exits non-zero if any fixture fails hard assertions OR if the axis means
 * fall below the pass threshold. This is the REGRESSION GATE — run it in CI on
 * prompt/model changes.
 *
 * To measure whether the verification loop helps, use the paired A/B runner
 * (`npm run eval:audit:ab`) instead. Setting EVAL_WITH_LOOP=1 here runs the
 * loop, but a baseline run and a loop run make separate analyze calls, so the
 * difference between them mixes the loop's effect with vision variance.
 *
 * Usage:
 *   npm run eval:audit              # full corpus
 *   npm run eval:audit -- foo bar   # only fixtures whose slug contains "foo" or "bar"
 *
 * Requires ANTHROPIC_API_KEY in env (loaded via dotenv from .env.local).
 */
import './env';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { ClaudeAnalysisResponse } from '../../src/types/audit';
import { JUDGE_AXES, type EvalRunReport, type FixtureResult, type JudgeAxis } from './types';
import { judgeAudit } from './judge';
import { runVerificationLoop, LOOP_DEADLINE_MS } from '../../src/lib/audit/verifyLoop';
import {
  ANALYZE_MODEL,
  FIXTURES_DIR,
  PASS_THRESHOLD,
  axisMeansOf,
  callAnalyze,
  evaluateHardAsserts,
  formatHardAsserts,
  hardAssertsPassed,
  loadFixtures,
  readFixture,
} from './harness';

const REPORT_PATH = path.join(__dirname, 'last-run.json');

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
    const { expected, imageBase64, mediaType } = readFixture(fx);

    // Stamp before analyze so the loop's deadline matches production, which
    // computes it from the start of the request rather than from analyze's return.
    const requestT0 = Date.now();
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

    let data: ClaudeAnalysisResponse = analyze.data;
    if (process.env.EVAL_WITH_LOOP === '1') {
      const loop = await runVerificationLoop({
        client,
        imageBlocks: [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } }],
        systemPrompt: analyze.systemPrompt,
        draft: analyze.data,
        deadlineMs: requestT0 + LOOP_DEADLINE_MS,
      });
      data = loop.result;
    }

    const hardAsserts = evaluateHardAsserts(data, expected);
    const passed = hardAssertsPassed(hardAsserts);
    process.stdout.write(`hard-asserts: ${passed ? 'PASS' : 'FAIL'} ... judging... `);

    const judge = await judgeAudit({
      client,
      imageBase64,
      mediaType,
      fixtureDescription: expected.description,
      fixtureNotes: expected.notes,
      productType: expected.productType,
      auditJson: data,
    });

    if (!judge.ok) {
      console.log(`JUDGE FAILED: ${judge.error}`);
      results.push({
        slug: fx.slug,
        description: expected.description,
        productType: expected.productType,
        auditResponse: data,
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
      auditResponse: data,
      hardAsserts,
      judge: judge.scores,
      judgeError: null,
      hardAssertsPassed: passed,
    });
  }

  // Aggregate
  const judged = results.filter((r) => r.judge !== null);
  const axisMeans = axisMeansOf(judged.map((r) => r.judge!));

  const passedHard = results.filter((r) => r.hardAssertsPassed).length;
  const report: EvalRunReport = {
    startedAt,
    durationMs: Date.now() - t0,
    fixtures: results,
    axisMeans,
    passedHardAsserts: passedHard,
    totalFixtures: results.length,
  };
  const reportPath =
    process.env.EVAL_WITH_LOOP === '1' ? path.join(__dirname, 'last-run-loop.json') : REPORT_PATH;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n=== Eval Summary ===');
  console.log(`Fixtures: ${results.length}`);
  console.log(`Model: ${ANALYZE_MODEL}`);
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
    ? (Object.values(axisMeans) as number[]).some((v) => v < PASS_THRESHOLD)
    : false;
  if (hardFail || meanFail) {
    console.log(
      `\n[eval:audit] FAIL — ${hardFail ? `${results.length - passedHard} hard-assert failure(s)` : ''}${
        hardFail && meanFail ? '; ' : ''
      }${meanFail ? `axis mean(s) below ${PASS_THRESHOLD}` : ''}`,
    );
    process.exit(1);
  }
  console.log('\n[eval:audit] PASS');
}

main().catch((err) => {
  console.error('[eval:audit] fatal:', err);
  process.exit(2);
});
