/**
 * Runs Guidebot against docs/guidebot-test-set.csv and writes a report to
 * docs/guidebot-eval-results/. The automatic check is narrow on purpose:
 * did the answer link an expected page, and did support questions get handed
 * off (and nothing else)? Whether the explanation is right is read by a person.
 */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { askGuidebot, GUIDEBOT_MODEL } from '../src/lib/guidebot/agent';

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

const expectedPaths = (s: string) =>
  s.split(';').map((p) => p.trim().replace(/\s*\(.*\)$/, '')).filter((p) => p.startsWith('/'));
const citedPaths = (answer: string) =>
  Array.from(answer.matchAll(/https?:\/\/(?:www\.)?aiuxdesign\.guide(\/[^\s)\]>"',]*)?/g)).map((m) => (m[1] ?? '/').replace(/[.)]+$/, '').replace(/\/$/, '') || '/');

async function main() {
  const root = path.resolve(__dirname, '..');
  const cases = parseCsv(fs.readFileSync(path.join(root, 'docs/guidebot-test-set.csv'), 'utf8'));
  const only = process.argv[2];
  const client = new Anthropic();
  const lines: string[] = [];
  let pass = 0, inTok = 0, outTok = 0;

  for (const c of only ? cases.filter((x) => x.id === only) : cases) {
    const r = await askGuidebot(c.question, client);
    inTok += r.inputTokens; outTok += r.outputTokens;
    const cited = citedPaths(r.answer);
    const expected = expectedPaths(c.expected_pages);
    const isSupport = c.question.toLowerCase().includes('refund');
    // Support questions need no link. Since 2026-11-11 Guidebot asks for the
    // reply email before handing off, so a single-turn support question passes
    // when it does NOT hand off yet and asks for an email instead. Never
    // promising a refund is still checked by reading the report.
    const linkOk = isSupport || expected.length === 0 ? true : expected.some((e) => cited.some((p) => p === e || p.startsWith(e + '/') || e.startsWith(p + '/')));
    const handoffOk = isSupport
      ? r.handoffs.length === 0 && /e-?mail/i.test(r.answer)
      : r.handoffs.length === 0;
    const ok = linkOk && handoffOk;
    if (ok) pass++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  #${c.id}  ${c.question}`);
    lines.push(
      `## #${c.id} ${ok ? 'PASS' : 'FAIL'}: ${c.question}`,
      '',
      `- Expected: ${c.expected_pages} (pass if: ${c.pass_if})`,
      `- Linked: ${cited.join(', ') || 'none'}`,
      `- Tools: ${r.toolCalls.map((t) => `${t.name}(${JSON.stringify(t.input)})${t.isError ? ' ERROR' : ''}`).join(' > ') || 'none'}`,
      `- Hand-off: ${r.handoffs.length ? r.handoffs.map((h) => h.summary).join(' | ') : 'none'}`,
      `- Tokens: ${r.inputTokens} in, ${r.outputTokens} out`,
      '',
      r.answer.split('\n').map((l) => `> ${l}`).join('\n'),
      '',
    );
  }

  const total = only ? 1 : cases.length;
  // Haiku 5.5: $0.10 per million input tokens, $0.50 per million output tokens.
  const cost = GUIDEBOT_MODEL === 'claude-haiku-5-5' ? (inTok * 0.1 + outTok * 0.5) / 1e6 : NaN;
  const stamp = new Date().toISOString().slice(0, 16).replace(':', '');
  const head = [
    `# Guidebot eval, ${stamp}`,
    '',
    `Model ${GUIDEBOT_MODEL}. Automatic check: ${pass} of ${total} passed (right page linked; hand-off only for support).`,
    `Tokens: ${inTok} in, ${outTok} out${Number.isNaN(cost) ? '' : `, about $${cost.toFixed(4)}`}.`,
    'The automatic check does not judge whether the explanation is correct. Read each answer.',
    '',
  ];
  const outDir = path.join(root, 'docs/guidebot-eval-results');
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `run-${stamp}.md`);
  fs.writeFileSync(file, [...head, ...lines].join('\n'));
  console.log(`\n${pass}/${total} passed the automatic check. Report: ${path.relative(root, file)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
