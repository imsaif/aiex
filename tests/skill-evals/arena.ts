import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import patterns from '../../src/data/patterns';
import { composeSkillMd, skillName } from '../../src/lib/skills/composeSkill';
import type { Arm, EvalTask, RunResult } from './types';

/**
 * Runs one designer task through a real `claude -p` session, twice: once in a scratch
 * repo with the skill pack installed, once in an identical repo without it.
 *
 * Why a real CLI session rather than an SDK call with the skill text pasted in: the thing
 * under test is not "does this guidance help if you read it". It is "does Claude Code load
 * the right skill, unprompted, from a sentence a designer typed". Pasting the skill in
 * assumes away the exact step that can fail.
 *
 * ## The isolation problem, and why it decides whether any of this means anything
 *
 * A normal `claude` run inherits `~/.claude/`, which on a working machine carries global
 * skills and plugins. This one carries a whole competing design-skill library. If the
 * control arm loads those, the eval measures our pack against another pack and a null
 * result is unreadable.
 *
 * So both arms get a throwaway CLAUDE_CONFIG_DIR: no user skills, no plugins, no
 * user-level CLAUDE.md. The scratch repos have no project CLAUDE.md either. What remains
 * are the CLI's own built-in skills, which are identical in both arms and therefore
 * cancel out.
 *
 * A fresh config dir has no credentials, so auth is ANTHROPIC_API_KEY. That means this
 * harness spends API credit, not subscription allowance. `estimateRuns()` exists so a
 * caller can print the bill before paying it.
 *
 * `--bare` looked like the obvious isolation switch and is the wrong tool: it downgrades
 * skills to explicit `/skill-name` invocation, which removes the auto-loading this eval
 * exists to measure.
 */

const CLI = process.env.CLAUDE_BIN || path.join(os.homedir(), '.local', 'bin', 'claude');

/** Pinned so both arms are identical and a run months later is comparable. */
export const SUBJECT_MODEL = process.env.EVAL_SUBJECT_MODEL || 'claude-sonnet-4-6';

/** Where scratch repos and the throwaway config live. */
const ARENA_ROOT = process.env.EVAL_ARENA_DIR || path.join(os.tmpdir(), 'aiux-skill-evals');

/**
 * Identical in both arms. Asks for the shape of answer a designer can act on, without
 * hinting that any pattern library exists — naming one would coach the control arm and
 * destroy the comparison.
 */
const TASK_SUFFIX = `

Answer as a senior product designer would in a working session: what is actually going wrong, what you would change, and what that change costs. Be concrete enough that someone could act on it. Do not write or edit any files.`;

function armRepoDir(arm: Arm): string {
  return path.join(ARENA_ROOT, `repo-${arm}`);
}

function configDir(): string {
  return path.join(ARENA_ROOT, 'config');
}

/**
 * Builds both scratch repos from scratch on every run, so a previous run's files can never
 * leak into this one. The two differ in exactly one way: `.claude/skills/`.
 */
export function prepareArena(): { withSkills: string; withoutSkills: string; skillCount: number } {
  fs.rmSync(ARENA_ROOT, { recursive: true, force: true });

  for (const arm of ['with', 'without'] as Arm[]) {
    fs.mkdirSync(path.join(armRepoDir(arm), '.claude', 'skills'), { recursive: true });
  }
  fs.mkdirSync(configDir(), { recursive: true });

  const skillsRoot = path.join(armRepoDir('with'), '.claude', 'skills');
  patterns.forEach((pattern) => {
    const dir = path.join(skillsRoot, skillName(pattern));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), composeSkillMd(pattern), 'utf8');
  });

  return {
    withSkills: armRepoDir('with'),
    withoutSkills: armRepoDir('without'),
    skillCount: patterns.length,
  };
}

/**
 * Pulls the skills a run actually loaded out of the stream-json transcript.
 *
 * This is the harness's own control check, not a score. If the 'with' arm loads nothing,
 * the run measured two identical conditions and any delta is noise — the runner should say
 * so rather than reporting a result.
 */
function parseSkillsLoaded(streamLines: string[]): string[] {
  const loaded = new Set<string>();
  for (const line of streamLines) {
    if (!line.includes('"tool_use"')) continue;
    let event: unknown;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    const content = (event as { message?: { content?: unknown[] } })?.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      const b = block as { type?: string; name?: string; input?: Record<string, unknown> };
      if (b?.type !== 'tool_use') continue;
      if (b.name === 'Skill' && typeof b.input?.skill === 'string') loaded.add(b.input.skill);
      // Skills can also arrive as a plain read of the SKILL.md file.
      const filePath = b.input?.file_path;
      if (typeof filePath === 'string' && filePath.includes('.claude/skills/')) {
        const match = filePath.match(/\.claude\/skills\/([^/]+)\//);
        if (match) loaded.add(match[1]);
      }
    }
  }
  return [...loaded].sort();
}

export function runTask(task: EvalTask, arm: Arm, repeat: number): Promise<RunResult> {
  const started = Date.now();
  const cwd = armRepoDir(arm);

  return new Promise((resolve) => {
    const child = spawn(
      CLI,
      [
        '-p',
        task.prompt + TASK_SUFFIX,
        '--model',
        SUBJECT_MODEL,
        '--output-format',
        'stream-json',
        '--verbose',
      ],
      {
        cwd,
        env: {
          ...process.env,
          CLAUDE_CONFIG_DIR: configDir(),
          // Belt and braces: the scratch repos carry no CLAUDE.md, but make it explicit
          // that nothing from the real project should be discovered.
          CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    const stdout: string[] = [];
    const stderr: string[] = [];
    child.stdout.on('data', (d) => stdout.push(d.toString()));
    child.stderr.on('data', (d) => stderr.push(d.toString()));

    child.on('error', (err) =>
      resolve({
        task: task.slug,
        arm,
        repeat,
        output: '',
        skillsLoaded: [],
        ms: Date.now() - started,
        ok: false,
        error: `spawn failed: ${err.message}`,
      })
    );

    child.on('close', (code) => {
      const lines = stdout.join('').split('\n').filter(Boolean);
      const text = extractFinalText(lines);
      resolve({
        task: task.slug,
        arm,
        repeat,
        output: text,
        skillsLoaded: parseSkillsLoaded(lines),
        ms: Date.now() - started,
        ok: code === 0 && text.trim().length > 0,
        error: code === 0 ? undefined : stderr.join('').slice(0, 500) || `exit ${code}`,
      });
    });
  });
}

/** The assistant's final answer, which is the only part the judge sees. */
function extractFinalText(lines: string[]): string {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    let event: unknown;
    try {
      event = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    const e = event as { type?: string; subtype?: string; result?: string };
    if (e?.type === 'result' && typeof e.result === 'string') return e.result;
  }
  return '';
}

/** So a caller can print what a run will cost before spending it. */
export function estimateRuns(taskCount: number, repeats: number): number {
  return taskCount * 2 * repeats;
}
