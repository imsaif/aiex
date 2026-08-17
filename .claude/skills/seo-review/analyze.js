#!/usr/bin/env node
/**
 * Standardized GSC CSV diff analysis for aiuxdesign.guide.
 *
 * Usage:
 *   node analyze.js <gsc-export-folder>
 *
 * Expects the folder to contain Google Search Console's exported CSVs.
 * Works with both plain-range exports (single-period CSVs) and
 * comparison-range exports (`Last N days Clicks, Previous N days Clicks, ...`).
 *
 * Output is markdown tables + flag lists meant to be read by Claude + human
 * together. Never makes recommendations — Claude does the reasoning.
 */

const fs = require('fs');
const path = require('path');

// ---------- CSV parsing ----------

function parseCsv(contents) {
  const lines = contents.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map(splitCsvLine).filter((r) => r.length === header.length);
  return { header, rows };
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function tryParseCsv(folder, filename) {
  const full = path.join(folder, filename);
  if (!fs.existsSync(full)) return null;
  return parseCsv(fs.readFileSync(full, 'utf8'));
}

// ---------- comparison detection ----------

// GSC labels the range with whatever unit the picker used: "Last 28 days",
// but also "Last 3 months", "Last 6 months", "Last 12 months". Matching only
// `days` made every 3-month export — the range this project actually reviews
// with — exit as "Could not detect column layout", which reads like a broken
// export rather than a narrow parser.
const RANGE = String.raw`\d+\s+(?:days?|weeks?|months?)`;
const col = (header, prefix, metric) =>
  header.findIndex((h) => new RegExp(`^${prefix}\\s+${RANGE}\\s+${metric}$`, 'i').test(h));

function detectComparison(header) {
  // Comparison exports have columns like "Last 28 days Clicks", "Previous 28 days Clicks"
  const lastClicksIdx = col(header, 'Last', 'Clicks');
  const prevClicksIdx = col(header, 'Previous', 'Clicks');
  if (lastClicksIdx === -1 || prevClicksIdx === -1) return null;
  return {
    lastClicks: lastClicksIdx,
    prevClicks: prevClicksIdx,
    lastImp: col(header, 'Last', 'Impressions'),
    prevImp: col(header, 'Previous', 'Impressions'),
    lastCtr: col(header, 'Last', 'CTR'),
    prevCtr: col(header, 'Previous', 'CTR'),
    lastPos: col(header, 'Last', 'Position'),
    prevPos: col(header, 'Previous', 'Position'),
  };
}

function detectSingle(header) {
  // Plain export: "Top pages, Clicks, Impressions, CTR, Position"
  const clicksIdx = header.findIndex((h) => h === 'Clicks');
  if (clicksIdx === -1) return null;
  return {
    clicks: clicksIdx,
    imp: header.findIndex((h) => h === 'Impressions'),
    ctr: header.findIndex((h) => h === 'CTR'),
    pos: header.findIndex((h) => h === 'Position'),
  };
}

// ---------- pattern flag rules ----------

/**
 * CTR problem: ranks on page 1 (pos < 11) with > 300 impressions but CTR < 1%.
 * Indicates snippet isn't winning clicks despite visibility.
 */
function flagCtrProblem(row) {
  const { lastClicks, lastImp, lastPos } = row;
  if (lastImp < 300) return null;
  if (lastPos >= 11) return null;
  const ctr = lastImp > 0 ? lastClicks / lastImp : 0;
  if (ctr >= 0.01) return null;
  return `CTR problem: pos ${lastPos.toFixed(1)}, ${lastImp} imp, ${(ctr * 100).toFixed(2)}% CTR`;
}

/**
 * Ranking opportunity: > 500 impressions but position 11-25 (page 2, close enough
 * to push to page 1 with content depth / backlinks / internal links).
 */
function flagRankingOpportunity(row) {
  const { lastImp, lastPos } = row;
  if (lastImp < 500) return null;
  if (lastPos < 11 || lastPos > 25) return null;
  return `Near-page-1: pos ${lastPos.toFixed(1)}, ${lastImp} imp`;
}

/**
 * Position regression: lost 3+ positions OR clicks down by 50%+ on pages
 * that previously had meaningful clicks (>= 3).
 */
function flagRegression(row) {
  const { lastClicks, prevClicks, lastPos, prevPos } = row;
  if (prevPos === 0 || lastPos === 0) return null;
  const posDelta = lastPos - prevPos; // positive = worse
  if (posDelta >= 3) {
    return `Position regressed: ${prevPos.toFixed(1)} → ${lastPos.toFixed(1)} (+${posDelta.toFixed(1)})`;
  }
  if (prevClicks >= 3 && lastClicks <= prevClicks * 0.5) {
    return `Click drop: ${prevClicks} → ${lastClicks}`;
  }
  return null;
}

/**
 * Breakout winner: clicks grew by 3x+ and previous > 0.
 */
function flagBreakout(row) {
  const { lastClicks, prevClicks } = row;
  if (prevClicks === 0) return null;
  if (lastClicks < prevClicks * 3) return null;
  if (lastClicks < 5) return null;
  return `Breakout: ${prevClicks} → ${lastClicks} clicks (${(lastClicks / prevClicks).toFixed(1)}x)`;
}

// ---------- main analysis ----------

function analyzeFolder(folder) {
  const pagesParsed = tryParseCsv(folder, 'Pages.csv');
  const queriesParsed = tryParseCsv(folder, 'Queries.csv');
  const devicesParsed = tryParseCsv(folder, 'Devices.csv');
  const filtersParsed = tryParseCsv(folder, 'Filters.csv');

  if (!pagesParsed) {
    console.error(`ERROR: Pages.csv not found in ${folder}`);
    process.exit(1);
  }

  // Echo filters
  const filters = {};
  if (filtersParsed) {
    for (const row of filtersParsed.rows) {
      filters[row[0]] = row[1];
    }
  }

  const cmp = detectComparison(pagesParsed.header);
  const single = !cmp ? detectSingle(pagesParsed.header) : null;

  if (!cmp && !single) {
    console.error('ERROR: Could not detect Pages.csv column layout.');
    console.error('Header:', pagesParsed.header);
    process.exit(1);
  }

  console.log('# SEO Review\n');
  console.log(`**Folder:** \`${folder}\``);
  console.log(`**Mode:** ${cmp ? 'Comparison (last vs previous)' : 'Single-period snapshot'}`);
  for (const [k, v] of Object.entries(filters)) {
    console.log(`**${k}:** ${v}`);
  }
  console.log('');

  // Build row dataset
  const pageRows = [];
  for (const raw of pagesParsed.rows) {
    if (cmp) {
      pageRows.push({
        url: raw[0],
        lastClicks: parseFloat(raw[cmp.lastClicks]) || 0,
        prevClicks: parseFloat(raw[cmp.prevClicks]) || 0,
        lastImp: parseFloat(raw[cmp.lastImp]) || 0,
        prevImp: parseFloat(raw[cmp.prevImp]) || 0,
        lastPos: parseFloat(raw[cmp.lastPos]) || 0,
        prevPos: parseFloat(raw[cmp.prevPos]) || 0,
      });
    } else {
      pageRows.push({
        url: raw[0],
        lastClicks: parseFloat(raw[single.clicks]) || 0,
        prevClicks: 0,
        lastImp: parseFloat(raw[single.imp]) || 0,
        prevImp: 0,
        lastPos: parseFloat(raw[single.pos]) || 0,
        prevPos: 0,
      });
    }
  }

  // Totals
  const total = pageRows.reduce(
    (acc, r) => {
      acc.lastClicks += r.lastClicks;
      acc.prevClicks += r.prevClicks;
      acc.lastImp += r.lastImp;
      acc.prevImp += r.prevImp;
      return acc;
    },
    { lastClicks: 0, prevClicks: 0, lastImp: 0, prevImp: 0 }
  );

  console.log('## Headline totals\n');
  if (cmp) {
    const clickPct = total.prevClicks > 0 ? ((total.lastClicks - total.prevClicks) / total.prevClicks) * 100 : 0;
    const impPct = total.prevImp > 0 ? ((total.lastImp - total.prevImp) / total.prevImp) * 100 : 0;
    const lastCtr = total.lastImp > 0 ? (total.lastClicks / total.lastImp) * 100 : 0;
    const prevCtr = total.prevImp > 0 ? (total.prevClicks / total.prevImp) * 100 : 0;
    console.log('| Metric | Previous | Last | Δ |');
    console.log('|---|---|---|---|');
    console.log(`| Clicks | ${total.prevClicks} | ${total.lastClicks} | ${clickPct >= 0 ? '+' : ''}${clickPct.toFixed(0)}% |`);
    console.log(`| Impressions | ${total.prevImp} | ${total.lastImp} | ${impPct >= 0 ? '+' : ''}${impPct.toFixed(0)}% |`);
    console.log(`| CTR | ${prevCtr.toFixed(2)}% | ${lastCtr.toFixed(2)}% | ${(lastCtr - prevCtr >= 0 ? '+' : '')}${(lastCtr - prevCtr).toFixed(2)}pp |`);
  } else {
    console.log(`Clicks: ${total.lastClicks} | Impressions: ${total.lastImp} | CTR: ${total.lastImp > 0 ? ((total.lastClicks / total.lastImp) * 100).toFixed(2) : 0}%`);
  }
  console.log('');

  // Flags
  const ctrProblems = [];
  const rankingOpps = [];
  const regressions = [];
  const breakouts = [];

  for (const row of pageRows) {
    const f1 = flagCtrProblem(row);
    if (f1) ctrProblems.push({ row, flag: f1 });

    const f2 = flagRankingOpportunity(row);
    if (f2) rankingOpps.push({ row, flag: f2 });

    if (cmp) {
      const f3 = flagRegression(row);
      if (f3) regressions.push({ row, flag: f3 });

      const f4 = flagBreakout(row);
      if (f4) breakouts.push({ row, flag: f4 });
    }
  }

  function shortUrl(u) {
    return u.replace(/^https:\/\/(?:www\.)?aiuxdesign\.guide/, '') || '/';
  }

  if (breakouts.length) {
    console.log('## 🚀 Breakouts — 3x+ click growth\n');
    breakouts.sort((a, b) => b.row.lastClicks - a.row.lastClicks);
    for (const { row, flag } of breakouts) {
      console.log(`- \`${shortUrl(row.url)}\` — ${flag}`);
    }
    console.log('');
  }

  if (ctrProblems.length) {
    console.log('## 🎯 CTR problems — page 1 ranked but <1% CTR\n');
    console.log('Lead candidates for title/description rewrites. Ranked by impression volume (biggest miss first).\n');
    ctrProblems.sort((a, b) => b.row.lastImp - a.row.lastImp);
    for (const { row, flag } of ctrProblems) {
      console.log(`- \`${shortUrl(row.url)}\` — ${flag}`);
    }
    console.log('');
  }

  if (rankingOpps.length) {
    console.log('## 📈 Near-page-1 opportunities — pos 11-25 with >500 imp\n');
    console.log('Candidates for content depth, internal links, or backlink work. Close enough to push to page 1.\n');
    rankingOpps.sort((a, b) => b.row.lastImp - a.row.lastImp);
    for (const { row, flag } of rankingOpps) {
      console.log(`- \`${shortUrl(row.url)}\` — ${flag}`);
    }
    console.log('');
  }

  if (regressions.length) {
    console.log('## ⚠️ Regressions — investigate\n');
    console.log('Positions got worse by 3+ OR clicks dropped by 50%+. Check if competitor ranked, content went stale, or we broke something.\n');
    regressions.sort((a, b) => {
      const ap = (a.row.lastPos - a.row.prevPos);
      const bp = (b.row.lastPos - b.row.prevPos);
      return bp - ap;
    });
    for (const { row, flag } of regressions) {
      console.log(`- \`${shortUrl(row.url)}\` — ${flag}`);
    }
    console.log('');
  }

  // Top pages snapshot
  console.log('## Top 15 pages by impressions\n');
  const topPages = [...pageRows].sort((a, b) => b.lastImp - a.lastImp).slice(0, 15);
  if (cmp) {
    console.log('| URL | Clicks | Impressions | CTR | Position |');
    console.log('|---|---|---|---|---|');
    for (const r of topPages) {
      const ctr = r.lastImp > 0 ? (r.lastClicks / r.lastImp) * 100 : 0;
      const cDelta = r.lastClicks - r.prevClicks;
      const iDelta = r.lastImp - r.prevImp;
      const pDelta = r.lastPos - r.prevPos;
      console.log(`| \`${shortUrl(r.url)}\` | ${r.lastClicks} (${cDelta >= 0 ? '+' : ''}${cDelta}) | ${r.lastImp} (${iDelta >= 0 ? '+' : ''}${iDelta}) | ${ctr.toFixed(2)}% | ${r.lastPos.toFixed(1)} (${pDelta >= 0 ? '+' : ''}${pDelta.toFixed(1)}) |`);
    }
  } else {
    console.log('| URL | Clicks | Impressions | CTR | Position |');
    console.log('|---|---|---|---|---|');
    for (const r of topPages) {
      const ctr = r.lastImp > 0 ? (r.lastClicks / r.lastImp) * 100 : 0;
      console.log(`| \`${shortUrl(r.url)}\` | ${r.lastClicks} | ${r.lastImp} | ${ctr.toFixed(2)}% | ${r.lastPos.toFixed(1)} |`);
    }
  }
  console.log('');

  // Query analysis
  if (queriesParsed) {
    const qcmp = detectComparison(queriesParsed.header);
    const qsingle = !qcmp ? detectSingle(queriesParsed.header) : null;

    if (qcmp) {
      console.log('## Top query movers\n');
      const qrows = queriesParsed.rows.map((raw) => ({
        q: raw[0],
        lastClicks: parseFloat(raw[qcmp.lastClicks]) || 0,
        prevClicks: parseFloat(raw[qcmp.prevClicks]) || 0,
        lastImp: parseFloat(raw[qcmp.lastImp]) || 0,
        prevImp: parseFloat(raw[qcmp.prevImp]) || 0,
        lastPos: parseFloat(raw[qcmp.lastPos]) || 0,
        prevPos: parseFloat(raw[qcmp.prevPos]) || 0,
      }));

      const newQueries = qrows
        .filter((q) => q.prevImp === 0 && q.lastImp >= 20)
        .sort((a, b) => b.lastImp - a.lastImp)
        .slice(0, 10);
      if (newQueries.length) {
        console.log('### New queries (≥20 imp, not in prior period)\n');
        for (const q of newQueries) {
          console.log(`- **${q.q}** — ${q.lastImp} imp, pos ${q.lastPos.toFixed(1)}${q.lastClicks ? `, **${q.lastClicks} clicks**` : ''}`);
        }
        console.log('');
      }

      const fading = qrows
        .filter((q) => q.prevImp >= 50 && q.lastImp <= q.prevImp * 0.5)
        .sort((a, b) => (b.prevImp - b.lastImp) - (a.prevImp - a.lastImp))
        .slice(0, 10);
      if (fading.length) {
        console.log('### Fading queries (prior ≥50 imp, dropped ≥50%)\n');
        for (const q of fading) {
          console.log(`- **${q.q}** — ${q.prevImp} → ${q.lastImp} imp, pos ${q.prevPos.toFixed(1)} → ${q.lastPos.toFixed(1)}`);
        }
        console.log('');
      }
    } else if (qsingle) {
      console.log('## Top 15 queries\n');
      const qrows = queriesParsed.rows.map((raw) => ({
        q: raw[0],
        clicks: parseFloat(raw[qsingle.clicks]) || 0,
        imp: parseFloat(raw[qsingle.imp]) || 0,
        pos: parseFloat(raw[qsingle.pos]) || 0,
      })).sort((a, b) => b.imp - a.imp).slice(0, 15);
      for (const q of qrows) {
        const ctr = q.imp > 0 ? (q.clicks / q.imp) * 100 : 0;
        console.log(`- **${q.q}** — ${q.imp} imp, ${q.clicks} clicks, ${ctr.toFixed(1)}% CTR, pos ${q.pos.toFixed(1)}`);
      }
      console.log('');
    }
  }

  // Device split if available
  if (devicesParsed) {
    const dcmp = detectComparison(devicesParsed.header);
    if (dcmp) {
      console.log('## Device split\n');
      console.log('| Device | Clicks | Impressions | CTR | Position |');
      console.log('|---|---|---|---|---|');
      for (const raw of devicesParsed.rows) {
        const lc = parseFloat(raw[dcmp.lastClicks]) || 0;
        const pc = parseFloat(raw[dcmp.prevClicks]) || 0;
        const li = parseFloat(raw[dcmp.lastImp]) || 0;
        const pi = parseFloat(raw[dcmp.prevImp]) || 0;
        const lp = parseFloat(raw[dcmp.lastPos]) || 0;
        const pp = parseFloat(raw[dcmp.prevPos]) || 0;
        const ctr = li > 0 ? (lc / li) * 100 : 0;
        console.log(`| ${raw[0]} | ${pc} → ${lc} | ${pi} → ${li} | ${ctr.toFixed(2)}% | ${pp.toFixed(1)} → ${lp.toFixed(1)} |`);
      }
      console.log('');
    }
  }

  console.log('---\n');
  console.log('_Analysis run via `.claude/skills/seo-review/analyze.js`. Interpretation + prioritization is Claude\'s job — this script only surfaces patterns._');
}

// ---------- entry ----------

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node analyze.js <gsc-export-folder>');
  console.error('Expects a folder containing Pages.csv, Queries.csv, and optionally Devices.csv + Filters.csv from GSC Performance export.');
  process.exit(1);
}
if (!fs.existsSync(folder)) {
  console.error(`ERROR: folder not found: ${folder}`);
  process.exit(1);
}
analyzeFolder(folder);
