#!/usr/bin/env node
/**
 * Build the body for the auto-opened [Perf] issue, with the actual failing
 * assertions embedded.
 *
 * Why this exists. The issue used to be `.github/perf-issue-template.md`
 * verbatim: a checklist plus a pointer to the Actions run, and NO measurement.
 * GitHub expires workflow logs at ~90 days and the LHCI report links die after
 * ~7, so once those lapse the issue is unfalsifiable — you cannot tell what
 * breached, by how much, or whether it still matters. Issues #26 and #28
 * (Apr 2026) had to be closed in Aug 2026 as "stale, cause unrecoverable"
 * purely because of this; the only thing that made them safe to close was 139
 * unrelated green runs, not anything the issues themselves recorded.
 *
 * So: read `.lighthouseci/assertion-results.json` (written by `lhci assert`)
 * and put the numbers IN the issue, where they live as long as the issue does.
 *
 * Usage: node scripts/ci/perf-issue-body.mjs <outfile>
 *
 * FAIL-SAFE BY DESIGN: any problem reading or parsing the results still emits
 * the template, so a bad shape degrades the issue's detail rather than losing
 * the notification entirely. Never let this throw.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = process.argv[2] || './perf-issue-body.md';
const RESULTS = '.lighthouseci/assertion-results.json';
const LINKS = '.lighthouseci/links.json';
const TEMPLATE = '.github/perf-issue-template.md';

const runUrl = process.env.RUN_URL || '';
const sha = process.env.GITHUB_SHA || '';

function readJson(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
  } catch {
    return null;
  }
}

/** resource-summary budgets report bytes; timings report ms. Render both readably. */
function fmt(value, auditId, auditProperty) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value ?? '—');
  const isSize = auditId === 'resource-summary' || /size|bytes/i.test(auditProperty || '');
  if (isSize) return `${Math.round(value / 1024)} KB`;
  const isTiming = /timing|paint|interactive|blocking|cumulative/i.test(`${auditId} ${auditProperty}`);
  if (isTiming && value > 10) return `${Math.round(value)} ms`;
  return String(value);
}

function buildSummary() {
  const results = readJson(RESULTS);
  if (!Array.isArray(results) || results.length === 0) return null;

  const failed = results.filter((r) => r && r.passed === false);
  if (failed.length === 0) return null;

  const links = readJson(LINKS) || {};
  const byUrl = new Map();
  for (const r of failed) {
    const url = r.url || '(unknown URL)';
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(r);
  }

  const lines = [];
  lines.push('## What breached');
  lines.push('');
  lines.push(
    `**${failed.length} failing assertion${failed.length === 1 ? '' : 's'} across ${byUrl.size} URL${byUrl.size === 1 ? '' : 's'}.** ` +
      'Recorded here at run time — the Actions log expires at ~90 days and the LHCI report links at ~7, so these numbers are the durable record.'
  );
  lines.push('');

  for (const [url, items] of byUrl) {
    lines.push(`### \`${url}\``);
    lines.push('');
    lines.push('| Assertion | Operator | Budget | Measured | Over by |');
    lines.push('|---|---|---|---|---|');
    for (const r of items) {
      const audit = [r.auditId, r.auditProperty].filter(Boolean).join('.');
      const over =
        typeof r.actual === 'number' && typeof r.expected === 'number'
          ? fmt(r.actual - r.expected, r.auditId, r.auditProperty)
          : '—';
      lines.push(
        `| \`${audit || r.name || '?'}\` | \`${r.operator ?? '?'}\` | ${fmt(r.expected, r.auditId, r.auditProperty)} | **${fmt(r.actual, r.auditId, r.auditProperty)}** | ${over} |`
      );
    }
    const report = links[url];
    if (report) {
      lines.push('');
      lines.push(`[LHCI report](${report}) *(expires ~7 days)*`);
    }
    lines.push('');
  }

  lines.push('> **Before treating this as a regression, check the Performance score on the affected pages.**');
  lines.push('> A small overage on a page still scoring 90+ means the budget is the wrong instrument, not the page —');
  lines.push('> see the Aug 2026 row in `.claude/rules/performance.md`, where a 1.3% overage on pages scoring 94–96');
  lines.push('> reddened CI for a week. Do not trim bytes to fit a budget that was set with no headroom.');
  lines.push('');
  if (runUrl) lines.push(`**Run:** ${runUrl}`);
  if (sha) lines.push(`**Commit:** \`${sha.slice(0, 8)}\``);
  lines.push('');
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

let body = '';
try {
  body = buildSummary() || '';
} catch (err) {
  body = `> Could not parse \`${RESULTS}\` (${err instanceof Error ? err.message : String(err)}). Falling back to the checklist below.\n\n---\n\n`;
}

let template = '';
try {
  template = existsSync(TEMPLATE) ? readFileSync(TEMPLATE, 'utf8') : '';
} catch {
  template = '';
}

writeFileSync(OUT, `${body}${template}` || 'Lighthouse CI failed. See the Actions run.\n');
console.log(`[perf-issue-body] wrote ${OUT} (${body ? 'with' : 'WITHOUT'} embedded measurements)`);
