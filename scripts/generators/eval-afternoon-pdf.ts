/**
 * Builds public/downloads/ai-evals-checklist.pdf from src/data/eval-afternoon.ts,
 * the same data the /ai-evals-checklist page renders, styled like the page:
 * Satoshi, a navy icon circle per step on a connecting line, the time per step,
 * and the "For example" box with product icons. Page 1 is the steps, page 2 the
 * review table. Re-run after editing the steps:
 *
 *   npx tsx scripts/generators/eval-afternoon-pdf.ts
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { createElement, type ComponentType, type SVGProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ClockIcon,
  InboxStackIcon,
  HandThumbUpIcon,
  RectangleGroupIcon,
  ScaleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { EVAL_AFTERNOON } from '../../src/data/eval-afternoon';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
// Same mapping as src/app/ai-evals-checklist/page.tsx.
const STEP_ICONS: Icon[] = [InboxStackIcon, HandThumbUpIcon, RectangleGroupIcon, ScaleIcon, ArrowPathIcon];
const PRODUCT_ICONS: Record<string, Icon> = {
  'Support bot': ChatBubbleLeftRightIcon,
  'Writing assistant': PencilSquareIcon,
  'Search or summary': MagnifyingGlassIcon,
  'Any product': CubeIcon,
};
const svg = (I: Icon, size: number) => renderToStaticMarkup(createElement(I, { width: size, height: size, strokeWidth: 1.6 }));
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ROOT = path.join(__dirname, '../..');
// Embedded as data URLs: a page built with setContent cannot load file:// fonts.
const font = (w: number, f: string) =>
  `@font-face{font-family:Satoshi;font-weight:${w};src:url(data:font/woff2;base64,${readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')}) format('woff2');}`;

// Light-theme tokens from globals.css, written out because the PDF has no CSS variables.
const C = { ink: '#162036', text: '#3d4559', muted: '#5b6478', line: '#e2e4ea', soft: '#f3f4f7' };

const { title, lead, steps, sheetColumns } = EVAL_AFTERNOON;

const stepsHtml = steps
  .map((s, i) => {
    const examples = s.examples
      .map(
        (e) => `<div class="ex"><span class="pi">${svg(PRODUCT_ICONS[e.product] ?? CubeIcon, 13)}</span><div><div class="pn">${esc(e.product)}</div><div class="pt">${esc(e.text)}</div></div></div>`
      )
      .join('');
    return `<section class="step${i === steps.length - 1 ? ' last' : ''}">
      <div class="dot">${svg(STEP_ICONS[i], 16)}</div>
      <div class="body">
        <div class="eyebrow">Step ${s.number}</div>
        <h2>${esc(s.title)}</h2>
        <p>${esc(s.body)}</p>
        <div class="time">${svg(ClockIcon, 12)} About ${s.minutes} min for 20 answers</div>
      </div>
      <div class="card"><div class="eyebrow">For example</div>${examples}</div>
    </section>`;
  })
  .join('');

const rows = Array.from({ length: 20 }, (_, i) => `<tr><td class="n">${i + 1}</td>${'<td></td>'.repeat(sheetColumns.length - 1)}</tr>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${font(400, 'satoshi-400.woff2')}${font(500, 'satoshi-500.woff2')}${font(700, 'satoshi-700.woff2')}
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Satoshi, -apple-system, Helvetica, Arial, sans-serif; color: ${C.ink}; font-size: 9.5pt; line-height: 1.45; }
  .page { width: 210mm; height: 297mm; padding: 13mm 14mm 11mm; position: relative; page-break-after: always; overflow: hidden; }
  .page:last-child { page-break-after: auto; }
  .brand { display: flex; justify-content: space-between; align-items: center; color: ${C.muted}; font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; font-weight: 500; }
  .brand b { color: ${C.ink}; letter-spacing: 0; text-transform: none; font-size: 10.5pt; font-weight: 700; }
  .kicker { margin-top: 7mm; font-size: 7.5pt; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; color: ${C.muted}; }
  h1 { font-size: 21pt; line-height: 1.12; margin: 2mm 0 2mm; font-weight: 700; letter-spacing: -.01em; }
  .lead { color: ${C.text}; font-size: 10.5pt; margin: 0 0 5.5mm; max-width: 150mm; }
  .step { display: grid; grid-template-columns: 9mm 1fr 66mm; gap: 0 5mm; position: relative; padding-bottom: 3.6mm; }
  .step::before { content: ''; position: absolute; left: 4.5mm; top: 9.5mm; bottom: 0; width: 1px; background: ${C.line}; }
  .step.last::before { display: none; }
  .dot { width: 9mm; height: 9mm; border-radius: 50%; background: ${C.ink}; color: #fff; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
  .eyebrow { font-family: ui-monospace, Menlo, monospace; font-size: 6.8pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; color: ${C.muted}; }
  .body h2 { font-size: 12.5pt; margin: .8mm 0 1.2mm; font-weight: 700; line-height: 1.2; }
  .body p { margin: 0; color: ${C.text}; }
  .time { margin-top: 2mm; display: flex; align-items: center; gap: 1.2mm; color: ${C.muted}; font-size: 8pt; }
  .card { border: 1px solid ${C.line}; border-radius: 3mm; padding: 2.4mm 3mm; align-self: start; }
  .card .eyebrow { font-family: Satoshi, sans-serif; margin-bottom: 1mm; }
  .ex { display: flex; gap: 2mm; margin-top: 1.1mm; }
  .pi { flex: none; width: 5.6mm; height: 5.6mm; border-radius: 1.4mm; background: ${C.soft}; color: ${C.muted}; display: flex; align-items: center; justify-content: center; }
  .pn { font-size: 7pt; font-weight: 700; color: ${C.muted}; }
  .pt { font-size: 8pt; line-height: 1.3; }
  .foot { position: absolute; left: 14mm; right: 14mm; bottom: 9mm; display: flex; justify-content: space-between; color: ${C.muted}; font-size: 7.5pt; border-top: 1px solid ${C.line}; padding-top: 2.5mm; }
  h3 { font-size: 15pt; margin: 9mm 0 1.5mm; font-weight: 700; }
  .sub { color: ${C.text}; margin: 0 0 5mm; }
  table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid ${C.line}; border-radius: 2.5mm; overflow: hidden; font-size: 8pt; }
  th { background: ${C.soft}; text-align: left; font-weight: 700; padding: 2.2mm 2mm; border-bottom: 1px solid ${C.line}; }
  td { height: 9.6mm; border-bottom: 1px solid ${C.line}; border-left: 1px solid ${C.line}; }
  td.n { border-left: 0; text-align: center; color: ${C.muted}; width: 7mm; }
  th + th { border-left: 1px solid ${C.line}; }
  tr:last-child td { border-bottom: 0; }
</style></head><body>
  <div class="page">
    <div class="brand"><b>aiux</b><span>aiuxdesign.guide</span></div>
    <div class="kicker">Free checklist · about 2 hours</div>
    <h1>${esc(title)}</h1>
    <p class="lead">${esc(lead)}</p>
    ${stepsHtml}
    <div class="foot"><span>Full method: aiuxdesign.guide/guides/ai-evals-for-designers</span><span>1 / 2</span></div>
  </div>
  <div class="page">
    <div class="brand"><b>aiux</b><span>aiuxdesign.guide</span></div>
    <h3>Review sheet</h3>
    <p class="sub">One row per answer. Mark pass or fail, write the first thing wrong in one line, then group the notes once all 20 are done.</p>
    <table><thead><tr>${sheetColumns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
    <div class="foot"><span>Spreadsheet version: aiuxdesign.guide/ai-evals-checklist</span><span>2 / 2</span></div>
  </div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, 'public/downloads/ai-evals-checklist.pdf');
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  // Preview images for review (not shipped): PREVIEW_DIR=/some/dir npx tsx ...
  if (process.env.PREVIEW_DIR) {
    await page.setViewportSize({ width: 794, height: 1123 });
    const pages = await page.locator('.page').all();
    for (const [i, el] of pages.entries()) await el.screenshot({ path: path.join(process.env.PREVIEW_DIR, `pdf-page-${i + 1}.png`) });
  }
  await browser.close();
  console.log('wrote', out);
})();
