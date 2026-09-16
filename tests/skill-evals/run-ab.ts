#!/usr/bin/env ts-node
/**
 * Does installing the skill pack make Claude Code better for a designer?
 *
 * Usage:
 *   npm run eval:skills                 # whole corpus, 1 repeat per arm
 *   npm run eval:skills -- invoice      # only tasks whose slug contains "invoice"
 *
 * Env:
 *   ANTHROPIC_API_KEY     required. This harness runs isolated CLI sessions, which cannot
 *                         use subscription auth, so a run spends API credit.
 *   EVAL_REPEATS          runs per arm per task (default 1). 2+ buys a noise estimate.
 *   EVAL_SUBJECT_MODEL    model under test  (default claude-sonnet-4-6)
 *   EVAL_JUDGE_MODEL      judging model     (default claude-sonnet-4-6)
 *   EVAL_CONCURRENCY      parallel CLI sessions (default 3)
 *
 * This reports. It never gates a build: a five-point rubric over ten tasks is not a
 * regression test, and treating it as one would invite tuning the corpus until it passes.
 *
 * Read BASELINE.md before running, and update it after a run worth keeping. The
 * per-run JSON this writes to `runs/` is gitignored on purpose — it is one
 * afternoon on one machine, and a folder of transcripts answers no question
 * anyone asks. BASELINE.md is the record that survives, including the nulls: a
 * run that showed no effect is a finding, and losing it means someone re-runs it
 * in six months to learn the same thing.
 */
import './env';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { TASKS } from './tasks';
import { prepareArena, runTask, estimateRuns, SUBJECT_MODEL } from './arena';
import { judgePair } from './judge';
import { JUDGE_AXES, type Arm, type PairResult, type RunResult, type ResponseScores } from './types';

const REPEATS = Number(process.env.EVAL_REPEATS || 1);
const CONCURRENCY = Number(process.env.EVAL_CONCURRENCY || 3);
const OUT_DIR = path.join(__dirname, 'runs');

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = cursor;
      cursor += 1;
      if (i >= items.length) return;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function overall(s: ResponseScores): number {
  return mean(JUDGE_AXES.map((a) => s[a]));
}

function fmt(n: number): string {
  return n.toFixed(2);
}

function signed(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}`;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set (looked in .env.local, then .env).');
    process.exit(1);
  }

  const filter = process.argv.slice(2).find((a) => !a.startsWith('-'));
  const tasks = filter ? TASKS.filter((t) => t.slug.includes(filter)) : TASKS;
  if (tasks.length === 0) {
    console.error(`No tasks match "${filter}".`);
    process.exit(1);
  }

  const { skillCount } = prepareArena();
  const totalRuns = estimateRuns(tasks.length, REPEATS);
  console.log(`Skill-pack A/B eval`);
  console.log(`  tasks        ${tasks.length}  (${tasks.filter((t) => !t.expectedPattern).length} negative)`);
  console.log(`  repeats      ${REPEATS}`);
  console.log(`  arms         with ${skillCount} skills  /  without`);
  console.log(`  model        ${SUBJECT_MODEL}`);
  console.log(`  CLI sessions ${totalRuns}  (billed to ANTHROPIC_API_KEY, not subscription)`);
  console.log('');

  // --- Arm runs -----------------------------------------------------------
  type Job = { task: (typeof TASKS)[number]; arm: Arm; repeat: number };
  const jobs: Job[] = [];
  for (const task of tasks) {
    for (let r = 0; r < REPEATS; r += 1) {
      jobs.push({ task, arm: 'with', repeat: r });
      jobs.push({ task, arm: 'without', repeat: r });
    }
  }

  let done = 0;
  const runs = await pool(jobs, CONCURRENCY, async (job) => {
    const result = await runTask(job.task, job.arm, job.repeat);
    done += 1;
    const mark = result.ok ? 'ok ' : 'FAIL';
    console.log(
      `  [${String(done).padStart(2)}/${jobs.length}] ${mark} ${job.task.slug} (${job.arm})` +
        (result.skillsLoaded.length ? `  loaded: ${result.skillsLoaded.join(', ')}` : '')
    );
    return result;
  });

  const failed = runs.filter((r) => !r.ok);
  if (failed.length) {
    console.log(`\n  ${failed.length} run(s) failed:`);
    failed.forEach((f) => console.log(`    ${f.task} (${f.arm}): ${f.error}`));
  }

  // --- Control check: did the arms actually differ? -----------------------
  const withRuns = runs.filter((r) => r.arm === 'with' && r.ok);
  const withoutRuns = runs.filter((r) => r.arm === 'without' && r.ok);
  const loadedAnywhere = withRuns.filter((r) => r.skillsLoaded.length > 0).length;
  const leakedIntoControl = withoutRuns.filter((r) => r.skillsLoaded.length > 0);

  console.log('\nControl check');
  console.log(`  'with' runs that loaded a skill:    ${loadedAnywhere}/${withRuns.length}`);
  console.log(`  'without' runs that loaded a skill: ${leakedIntoControl.length}/${withoutRuns.length} (must be 0)`);

  if (leakedIntoControl.length > 0) {
    console.log('\n  CONTROL CONTAMINATED. The skill-free arm loaded skills; the comparison is void.');
    process.exit(1);
  }
  if (loadedAnywhere === 0) {
    console.log('\n  NO SKILLS LOADED IN EITHER ARM. Both arms ran the same condition;');
    console.log('  any difference below is noise. Fix routing or the install before reading further.');
  }

  // --- Blind pairwise judging ---------------------------------------------
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const pairJobs: { task: (typeof TASKS)[number]; repeat: number; w: RunResult; wo: RunResult }[] = [];
  for (const task of tasks) {
    for (let r = 0; r < REPEATS; r += 1) {
      const w = runs.find((x) => x.task === task.slug && x.arm === 'with' && x.repeat === r);
      const wo = runs.find((x) => x.task === task.slug && x.arm === 'without' && x.repeat === r);
      if (w?.ok && wo?.ok) pairJobs.push({ task, repeat: r, w, wo });
    }
  }

  console.log(`\nJudging ${pairJobs.length} pairs (blind, order randomised)...`);
  const pairs = await pool(pairJobs, CONCURRENCY, async (job): Promise<PairResult> => {
    const withShownAs: 'one' | 'two' = Math.random() < 0.5 ? 'one' : 'two';
    const one = withShownAs === 'one' ? job.w.output : job.wo.output;
    const two = withShownAs === 'one' ? job.wo.output : job.w.output;
    const verdict = await judgePair(client, job.task, one, two);
    const withScores = withShownAs === 'one' ? verdict.responseOne : verdict.responseTwo;
    const withoutScores = withShownAs === 'one' ? verdict.responseTwo : verdict.responseOne;
    const winner: Arm | 'tie' =
      verdict.preferred === 'tie' ? 'tie' : verdict.preferred === withShownAs ? 'with' : 'without';
    return { task: job.task.slug, repeat: job.repeat, withShownAs, verdict, withScores, withoutScores, winner };
  });

  // --- Report -------------------------------------------------------------
  console.log('\n=== Per task ===');
  console.log('task                  with  without  delta   preferred');
  for (const task of tasks) {
    const ps = pairs.filter((p) => p.task === task.slug);
    if (!ps.length) continue;
    const w = mean(ps.map((p) => overall(p.withScores)));
    const wo = mean(ps.map((p) => overall(p.withoutScores)));
    const wins = ps.filter((p) => p.winner === 'with').length;
    const losses = ps.filter((p) => p.winner === 'without').length;
    const tag = task.expectedPattern ? '' : '  [negative case]';
    console.log(
      `${task.slug.padEnd(21)} ${fmt(w)}  ${fmt(wo)}   ${signed(w - wo)}   ${wins}W-${losses}L${tag}`
    );
  }

  console.log('\n=== Per axis ===');
  for (const axis of JUDGE_AXES) {
    const w = mean(pairs.map((p) => p.withScores[axis]));
    const wo = mean(pairs.map((p) => p.withoutScores[axis]));
    console.log(`${axis.padEnd(15)} ${fmt(w)}  vs  ${fmt(wo)}   ${signed(w - wo)}`);
  }

  const withAll = pairs.map((p) => overall(p.withScores));
  const withoutAll = pairs.map((p) => overall(p.withoutScores));
  const delta = mean(withAll) - mean(withoutAll);
  const wins = pairs.filter((p) => p.winner === 'with').length;
  const losses = pairs.filter((p) => p.winner === 'without').length;
  const ties = pairs.filter((p) => p.winner === 'tie').length;

  console.log('\n=== Overall ===');
  console.log(`  with     ${fmt(mean(withAll))}`);
  console.log(`  without  ${fmt(mean(withoutAll))}`);
  console.log(`  delta    ${signed(delta)}`);
  console.log(`  pairwise ${wins}W - ${losses}L - ${ties}T  (blind forced choice)`);

  // Negative cases reported separately: a pack that helps on-pattern and hurts off-pattern
  // averages out to "no effect", which is the most misleading summary available.
  const negatives = pairs.filter((p) => {
    const t = tasks.find((x) => x.slug === p.task);
    return t && !t.expectedPattern;
  });
  if (negatives.length) {
    const nd = mean(negatives.map((p) => overall(p.withScores))) - mean(negatives.map((p) => overall(p.withoutScores)));
    console.log(`\n  negative cases only: ${signed(nd)}  (below zero means the pack does harm off-pattern)`);
  }

  // --- Noise honesty ------------------------------------------------------
  if (REPEATS > 1) {
    const spreads: number[] = [];
    for (const task of tasks) {
      const ws = pairs.filter((p) => p.task === task.slug).map((p) => overall(p.withScores));
      if (ws.length > 1) spreads.push(Math.max(...ws) - Math.min(...ws));
    }
    const noise = mean(spreads);
    console.log(`\n  run-to-run spread (same arm, same task): ${fmt(noise)}`);
    if (Math.abs(delta) <= noise) {
      console.log('  The delta is within run-to-run noise. This run did NOT demonstrate an effect.');
    }
  } else {
    console.log('\n  REPEATS=1, so there is no noise estimate. A single run cannot separate a');
    console.log('  real effect from judge variance. Re-run with EVAL_REPEATS=2 before quoting the delta.');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outFile = path.join(OUT_DIR, `run-${stamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ model: SUBJECT_MODEL, repeats: REPEATS, runs, pairs }, null, 2));
  console.log(`\nFull transcripts and verdicts: ${path.relative(process.cwd(), outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
