#!/usr/bin/env ts-node
/**
 * Paired A/B eval for the audit verification loop (`AUDIT_VERIFY_LOOP`).
 *
 * Answers one question: does the verify loop make the audit better, and by how
 * much? The single-arm runner (`run.ts`, with `EVAL_WITH_LOOP=1`) cannot answer
 * it, because each arm makes its own analyze call — the two arms start from two
 * different drafts, so any score difference mixes the loop's effect with
 * run-to-run vision variance.
 *
 * This runner analyzes ONCE per fixture and sends that single draft down both
 * arms. The only difference between arm A and arm B is the loop, so the delta
 * is attributable.
 *
 * Per fixture (3 vision calls minimum, 5 when the loop revises):
 *   1. analyze                        -> draft
 *   2. judge(draft)                   -> arm A scores
 *   3. runVerificationLoop(draft)     -> critic (+ revise) -> result
 *   4. judge(result)                  -> arm B scores
 *   Arm B reuses arm A's scores when the loop changed nothing, so a clean
 *   fixture costs 3 calls rather than 4.
 *
 * Usage:
 *   npm run eval:audit:ab              # full corpus
 *   npm run eval:audit:ab -- chat      # only fixtures whose slug contains "chat"
 *
 * Env:
 *   ANTHROPIC_API_KEY     required (loaded via dotenv from .env.local)
 *   EVAL_ANALYZE_MODEL    override the analyze model (default: production's)
 *   AUDIT_CRITIC_MODEL    override the critic model  (read by critic.ts)
 *   AUDIT_REVISE_MODEL    override the revise model  (read by revise.ts)
 *
 * This runner reports; it does not gate. It always exits 0 unless it could not
 * run at all. Flipping AUDIT_VERIFY_LOOP is a judgement call that needs a
 * corpus large enough to support it — see BASELINE.md for current coverage.
 */
import './env';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { runVerificationLoop, LOOP_DEADLINE_MS } from '../../src/lib/audit/verifyLoop';
import type { ClaudeAnalysisResponse } from '../../src/types/audit';
import { judgeAudit } from './judge';
import {
  ANALYZE_MODEL,
  axisMeansOf,
  callAnalyze,
  evaluateHardAsserts,
  formatHardAsserts,
  hardAssertsPassed,
  loadFixtures,
  readFixture,
  type MediaType,
} from './harness';
import {
  JUDGE_AXES,
  type AbFixtureResult,
  type AbRunReport,
  type ArmResult,
  type JudgeAxis,
  type JudgeScores,
  type LoopTelemetry,
} from './types';

const REPORT_PATH = path.join(__dirname, 'last-run-ab.json');
const CRITIC_MODEL = process.env.AUDIT_CRITIC_MODEL || 'claude-sonnet-4-6';
const REVISE_MODEL = process.env.AUDIT_REVISE_MODEL || 'claude-sonnet-4-6';
const JUDGE_MODEL = 'claude-sonnet-4-6';

/** Score one arm: hard assertions plus the LLM judge. */
async function scoreArm(opts: {
  client: Anthropic;
  data: ClaudeAnalysisResponse;
  expected: ReturnType<typeof readFixture>['expected'];
  imageBase64: string;
  mediaType: MediaType;
}): Promise<ArmResult> {
  const hardAsserts = evaluateHardAsserts(opts.data, opts.expected);
  const judge = await judgeAudit({
    client: opts.client,
    imageBase64: opts.imageBase64,
    mediaType: opts.mediaType,
    fixtureDescription: opts.expected.description,
    fixtureNotes: opts.expected.notes,
    productType: opts.expected.productType,
    auditJson: opts.data,
  });
  return {
    auditResponse: opts.data,
    hardAsserts,
    hardAssertsPassed: hardAssertsPassed(hardAsserts),
    judge: judge.ok ? judge.scores : null,
    judgeError: judge.ok ? null : judge.error,
  };
}

function fmtScores(s: JudgeScores | null): string {
  if (!s) return 'unscored';
  return `F=${s.faithfulness} S=${s.specificity} P=${s.patternFit} A=${s.actionability} NF=${s.noFabrication}`;
}

function signed(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}`;
}

async function main() {
  const filter = process.argv.slice(2);
  const fixtures = loadFixtures(filter);

  console.log(`[eval:ab] Paired A/B — baseline vs verification loop`);
  console.log(`[eval:ab] Found ${fixtures.length} fixture(s)`);
  if (fixtures.length === 0) {
    console.log('[eval:ab] No fixtures to run. See tests/audit-evals/README.md to add one.');
    process.exit(0);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[eval:ab] ANTHROPIC_API_KEY not set. Aborting.');
    process.exit(2);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const startedAt = new Date().toISOString();
  const runT0 = Date.now();
  const results: AbFixtureResult[] = [];

  for (const fx of fixtures) {
    console.log(`\n[${fx.slug}]`);
    const { expected, imageBase64, mediaType } = readFixture(fx);

    // Stamp t0 BEFORE analyze. Production computes the loop deadline from the
    // start of the request, so the loop's remaining budget is already reduced
    // by however long analyze took. Starting the clock after analyze returns
    // would hand the loop a full budget it never has in production, and would
    // measure a loop that engages far more often than the real one.
    const requestT0 = Date.now();

    process.stdout.write('  analyze... ');
    const analyze = await callAnalyze({
      client,
      imageBase64,
      mediaType,
      productType: expected.productType,
    });
    if (!analyze.ok) {
      console.log(`FAILED: ${analyze.error}`);
      results.push({
        slug: fx.slug,
        description: expected.description,
        productType: expected.productType,
        baseline: null,
        withLoop: null,
        loop: null,
        error: analyze.error,
      });
      continue;
    }
    const draft = analyze.data;
    console.log(`ok (${(draft.topGaps ?? []).length} findings, ${Date.now() - requestT0}ms)`);

    // --- Arm A: the draft, unmodified ---
    process.stdout.write('  judging baseline... ');
    const baseline = await scoreArm({ client, data: draft, expected, imageBase64, mediaType });
    console.log(
      `${baseline.hardAssertsPassed ? 'PASS' : 'FAIL'}  ${fmtScores(baseline.judge)}${
        baseline.judgeError ? `  (judge error: ${baseline.judgeError})` : ''
      }`,
    );

    // --- The loop, on that exact same draft ---
    process.stdout.write('  verify loop... ');
    const loopT0 = Date.now();
    let loopResult;
    try {
      loopResult = await runVerificationLoop({
        client,
        imageBlocks: [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } }],
        systemPrompt: analyze.systemPrompt,
        draft,
        deadlineMs: requestT0 + LOOP_DEADLINE_MS,
        criticModel: CRITIC_MODEL,
        reviseModel: REVISE_MODEL,
      });
    } catch (err) {
      console.log(`THREW: ${err instanceof Error ? err.message : 'unknown'}`);
      results.push({
        slug: fx.slug,
        description: expected.description,
        productType: expected.productType,
        baseline,
        withLoop: null,
        loop: null,
        error: err instanceof Error ? err.message : 'verify loop threw',
      });
      continue;
    }

    const verdicts = loopResult.verdict?.verdicts ?? [];
    const telemetry: LoopTelemetry = {
      outcome: loopResult.outcome,
      hadVerdict: loopResult.verdict !== null,
      revised: loopResult.revised,
      verdictCounts: {
        keep: verdicts.filter((v) => v.verdict === 'keep').length,
        sharpen: verdicts.filter((v) => v.verdict === 'sharpen').length,
        drop: verdicts.filter((v) => v.verdict === 'drop').length,
      },
      evidenceNotVisible: verdicts.filter((v) => !v.evidenceVisible).length,
      overallNote: loopResult.verdict?.overallNote ?? '',
      loopMs: Date.now() - loopT0,
      gapCountBefore: (draft.topGaps ?? []).length,
      gapCountAfter: (loopResult.result.topGaps ?? []).length,
    };
    console.log(
      `${telemetry.outcome}  keep=${telemetry.verdictCounts.keep} sharpen=${telemetry.verdictCounts.sharpen} ` +
        `drop=${telemetry.verdictCounts.drop} notVisible=${telemetry.evidenceNotVisible} ` +
        `gaps ${telemetry.gapCountBefore}->${telemetry.gapCountAfter} (${telemetry.loopMs}ms)`,
    );
    if (telemetry.overallNote) console.log(`    critic: ${telemetry.overallNote}`);

    // --- Arm B: the post-loop result ---
    // When the loop changed nothing, arm B IS arm A — re-judging would only add
    // judge variance to a delta that is zero by construction, and cost a call.
    let withLoop: ArmResult;
    if (!telemetry.revised) {
      console.log('  judging with-loop... skipped (findings unchanged; reusing baseline scores)');
      withLoop = { ...baseline, auditResponse: loopResult.result };
    } else {
      process.stdout.write('  judging with-loop... ');
      withLoop = await scoreArm({ client, data: loopResult.result, expected, imageBase64, mediaType });
      console.log(
        `${withLoop.hardAssertsPassed ? 'PASS' : 'FAIL'}  ${fmtScores(withLoop.judge)}${
          withLoop.judgeError ? `  (judge error: ${withLoop.judgeError})` : ''
        }`,
      );
      const hardLines = formatHardAsserts(withLoop.hardAsserts);
      if (hardLines) console.log(hardLines);
      if (withLoop.judge?.comments) console.log(`    judge: ${withLoop.judge.comments}`);
    }

    results.push({
      slug: fx.slug,
      description: expected.description,
      productType: expected.productType,
      baseline,
      withLoop,
      loop: telemetry,
      error: null,
    });
  }

  // --- Aggregate ---
  // Only fixtures where BOTH arms scored contribute to the means, so the two
  // means are always over the same fixture set and the delta is a real pairing.
  const paired = results.filter((r) => r.baseline?.judge && r.withLoop?.judge);
  const baselineAxisMeans = axisMeansOf(paired.map((r) => r.baseline!.judge!));
  const withLoopAxisMeans = axisMeansOf(paired.map((r) => r.withLoop!.judge!));
  const axisDeltas =
    baselineAxisMeans && withLoopAxisMeans
      ? (Object.fromEntries(
          JUDGE_AXES.map((axis) => [axis, withLoopAxisMeans[axis] - baselineAxisMeans[axis]]),
        ) as Record<JudgeAxis, number>)
      : null;

  const outcomes: Record<string, number> = {};
  for (const r of results) {
    if (!r.loop) continue;
    outcomes[r.loop.outcome] = (outcomes[r.loop.outcome] ?? 0) + 1;
  }
  const withLoopTelemetry = results.map((r) => r.loop).filter((l): l is LoopTelemetry => l !== null);

  const report: AbRunReport = {
    startedAt,
    durationMs: Date.now() - runT0,
    models: { analyze: ANALYZE_MODEL, critic: CRITIC_MODEL, revise: REVISE_MODEL, judge: JUDGE_MODEL },
    fixtures: results,
    baselineAxisMeans,
    withLoopAxisMeans,
    axisDeltas,
    baselineHardPassed: results.filter((r) => r.baseline?.hardAssertsPassed).length,
    withLoopHardPassed: results.filter((r) => r.withLoop?.hardAssertsPassed).length,
    totalFixtures: results.length,
    loopSummary: {
      reviseAttempted: withLoopTelemetry.filter((l) => l.outcome === 'revise-attempted').length,
      revisedCount: withLoopTelemetry.filter((l) => l.revised).length,
      outcomes,
      totalKeep: withLoopTelemetry.reduce((n, l) => n + l.verdictCounts.keep, 0),
      totalSharpen: withLoopTelemetry.reduce((n, l) => n + l.verdictCounts.sharpen, 0),
      totalDrop: withLoopTelemetry.reduce((n, l) => n + l.verdictCounts.drop, 0),
      totalEvidenceNotVisible: withLoopTelemetry.reduce((n, l) => n + l.evidenceNotVisible, 0),
    },
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // --- Summary ---
  console.log('\n=== A/B Summary — baseline vs verification loop ===');
  console.log(`Fixtures: ${results.length}  (paired & scored: ${paired.length})`);
  console.log(`Models: analyze=${ANALYZE_MODEL} critic=${CRITIC_MODEL} revise=${REVISE_MODEL} judge=${JUDGE_MODEL}`);
  console.log(`Hard-asserts: baseline ${report.baselineHardPassed}/${results.length} → with-loop ${report.withLoopHardPassed}/${results.length}`);

  if (baselineAxisMeans && withLoopAxisMeans && axisDeltas) {
    console.log('\n  axis              baseline   with-loop   delta');
    for (const axis of JUDGE_AXES) {
      console.log(
        `  ${axis.padEnd(16)}  ${baselineAxisMeans[axis].toFixed(2).padStart(6)}     ${withLoopAxisMeans[axis]
          .toFixed(2)
          .padStart(6)}    ${signed(axisDeltas[axis]).padStart(6)}`,
      );
    }
  } else {
    console.log('\n  (no fixture produced scores in both arms — no deltas)');
  }

  const s = report.loopSummary;
  console.log('\n  Loop behaviour');
  console.log(`    revise attempted:    ${s.reviseAttempted}/${results.length}`);
  console.log(`    findings changed:    ${s.revisedCount}/${results.length}`);
  console.log(`    verdicts:            keep=${s.totalKeep} sharpen=${s.totalSharpen} drop=${s.totalDrop}`);
  console.log(`    evidence not visible: ${s.totalEvidenceNotVisible}`);
  console.log(`    outcomes:            ${Object.entries(outcomes).map(([k, v]) => `${k}=${v}`).join(' ') || '(none)'}`);

  console.log(`\nDuration: ${(report.durationMs / 1000).toFixed(1)}s`);
  console.log(`Report: ${REPORT_PATH}`);

  // Deliberately no pass/fail gate. This runner measures a change under
  // consideration; it is not a regression guard. `npm run eval:audit` is the gate.
  if (paired.length < results.length) {
    console.log(`\n[eval:ab] NOTE — ${results.length - paired.length} fixture(s) did not score in both arms; excluded from deltas.`);
  }
  console.log('\n[eval:ab] done. Deltas are only as trustworthy as the corpus is large — check BASELINE.md coverage before acting on them.');
}

main().catch((err) => {
  console.error('[eval:ab] fatal:', err);
  process.exit(2);
});
