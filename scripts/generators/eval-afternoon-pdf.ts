/**
 * Builds public/downloads/ai-evals-checklist.pdf from src/data/eval-afternoon.ts,
 * the same data the /ai-evals-checklist page renders, so the PDF and the page
 * cannot drift. Re-run after editing the steps:
 *
 *   npx tsx scripts/generators/eval-afternoon-pdf.ts
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { EVAL_AFTERNOON } from '../../src/data/eval-afternoon';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 14mm 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #162036; margin: 0; font-size: 10.5pt; line-height: 1.4; }
  .brand { font-size: 9pt; color: #5b6478; letter-spacing: .08em; text-transform: uppercase; }
  h1 { font-size: 21pt; margin: 4px 0 4px; letter-spacing: -.01em; }
  .lead { color: #3d4559; margin: 0 0 12px; }
  ol { list-style: none; padding: 0; margin: 0; }
  li { display: flex; gap: 10px; padding: 7px 0; border-top: 1px solid #e2e4ea; }
  .n { font-family: ui-monospace, Menlo, monospace; font-size: 9pt; color: #5b6478; width: 18px; padding-top: 2px; }
  h2 { font-size: 11.5pt; margin: 0 0 2px; }
  p { margin: 0; }
  .ex { margin-top: 4px; font-size: 9pt; color: #5b6478; }
  .ex b { color: #162036; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8.5pt; }
  th, td { border: 1px solid #d7dae2; padding: 0 5px; height: 17px; text-align: left; }
  th { background: #f0f1f5; font-weight: 600; height: 22px; }
  .foot { margin-top: 8px; font-size: 8.5pt; color: #5b6478; display: flex; justify-content: space-between; }
</style></head><body>
  <div class="brand">aiux · aiuxdesign.guide</div>
  <h1>${esc(EVAL_AFTERNOON.title)}</h1>
  <p class="lead">${esc(EVAL_AFTERNOON.lead)}</p>
  <ol>${EVAL_AFTERNOON.steps
    .map(
      (s) => `<li><span class="n">${String(s.number).padStart(2, '0')}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.body)}</p><p class="ex"><b>For example:</b> ${s.examples.map((e) => esc(e.product + ': ' + e.text)).join(' · ')}</p></div></li>`
    )
    .join('')}</ol>
  <table><thead><tr>${EVAL_AFTERNOON.sheetColumns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
  <tbody>${Array.from({ length: 10 }, (_, i) => `<tr><td>${i + 1}</td>${'<td></td>'.repeat(EVAL_AFTERNOON.sheetColumns.length - 1)}</tr>`).join('')}</tbody></table>
  <div class="foot"><span>Full method: aiuxdesign.guide/guides/ai-evals-for-designers</span><span>Review sheet: aiuxdesign.guide/ai-evals-checklist</span></div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const out = path.join(__dirname, '../../public/downloads/ai-evals-checklist.pdf');
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('wrote', out);
})();
