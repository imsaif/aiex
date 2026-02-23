#!/usr/bin/env node
/**
 * Performance Audit Script
 *
 * Runs Lighthouse against key pages, saves results to a JSON log,
 * and compares against previous runs to show improvements/regressions.
 *
 * Usage:
 *   npm run perf-audit                  # audit production site
 *   npm run perf-audit -- --local       # audit localhost:3000
 *   npm run perf-audit -- --compare     # compare last 2 runs
 *   npm run perf-audit -- --history     # show all past runs
 */

const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'perf-audit-log.json');

const PROD_BASE = 'https://www.aiuxdesign.guide';
const LOCAL_BASE = 'http://localhost:3000';

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Pattern Page', path: '/patterns/conversational-ui' },
];

const THRESHOLDS = {
  lcp: 2500,        // Good: <2.5s
  fcp: 1800,        // Good: <1.8s
  tbt: 200,         // Good: <200ms
  cls: 0.1,         // Good: <0.1
  si: 3400,          // Good: <3.4s
  performance: 90,  // Target score
};

// ── Helpers ──

function loadLog() {
  if (fs.existsSync(LOG_FILE)) {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  }
  return { runs: [] };
}

function saveLog(log) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

function color(text, code) {
  return `\x1b[${code}m${text}\x1b[0m`;
}

function green(t) { return color(t, 32); }
function red(t) { return color(t, 31); }
function yellow(t) { return color(t, 33); }
function bold(t) { return color(t, 1); }
function dim(t) { return color(t, 2); }

function statusIcon(value, threshold, lowerIsBetter = true) {
  if (lowerIsBetter) {
    return value <= threshold ? green('✓') : red('✗');
  }
  return value >= threshold ? green('✓') : red('✗');
}

function delta(current, previous, lowerIsBetter = true) {
  if (previous == null) return '';
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return dim(' (=)');
  const arrow = diff > 0 ? '↑' : '↓';
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const formatted = Math.abs(diff).toFixed(diff > 100 || diff < -100 ? 0 : 1);
  const text = ` ${arrow}${formatted}`;
  return improved ? green(text) : red(text);
}

// ── Lighthouse Runner ──

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance'],
      formFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 1.75,
      },
    });

    const audits = result.lhr.audits;
    const perfScore = Math.round(result.lhr.categories.performance.score * 100);

    return {
      performance: perfScore,
      lcp: Math.round(audits['largest-contentful-paint'].numericValue),
      fcp: Math.round(audits['first-contentful-paint'].numericValue),
      tbt: Math.round(audits['total-blocking-time'].numericValue),
      cls: parseFloat(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
      si: Math.round(audits['speed-index'].numericValue),
      jsExecution: Math.round(audits['bootup-time']?.numericValue || 0),
      totalBytes: Math.round((audits['total-byte-weight']?.numericValue || 0) / 1024),
    };
  } finally {
    await chrome.kill();
  }
}

// ── Commands ──

async function runAudit(baseUrl) {
  console.log(bold('\n🔍 Performance Audit'));
  console.log(dim(`   Target: ${baseUrl}`));
  console.log(dim(`   Date:   ${new Date().toISOString().slice(0, 16)}\n`));

  const log = loadLog();
  const previousRun = log.runs.length > 0 ? log.runs[log.runs.length - 1] : null;

  const run = {
    date: new Date().toISOString(),
    baseUrl,
    pages: {},
  };

  for (const page of PAGES) {
    const url = baseUrl + page.path;
    console.log(bold(`  📄 ${page.name}`) + dim(` (${url})`));

    try {
      const metrics = await runLighthouse(url);
      run.pages[page.name] = metrics;
      const prev = previousRun?.pages?.[page.name];

      console.log(`     Performance: ${metrics.performance >= 90 ? green(metrics.performance) : metrics.performance >= 50 ? yellow(metrics.performance) : red(metrics.performance)}/100${delta(metrics.performance, prev?.performance, false)}`);
      console.log(`     ${statusIcon(metrics.lcp, THRESHOLDS.lcp)} LCP:  ${metrics.lcp}ms${delta(metrics.lcp, prev?.lcp)}  ${dim(`(target: <${THRESHOLDS.lcp}ms)`)}`);
      console.log(`     ${statusIcon(metrics.fcp, THRESHOLDS.fcp)} FCP:  ${metrics.fcp}ms${delta(metrics.fcp, prev?.fcp)}  ${dim(`(target: <${THRESHOLDS.fcp}ms)`)}`);
      console.log(`     ${statusIcon(metrics.tbt, THRESHOLDS.tbt)} TBT:  ${metrics.tbt}ms${delta(metrics.tbt, prev?.tbt)}  ${dim(`(target: <${THRESHOLDS.tbt}ms)`)}`);
      console.log(`     ${statusIcon(metrics.cls, THRESHOLDS.cls)} CLS:  ${metrics.cls}${delta(metrics.cls, prev?.cls)}  ${dim(`(target: <${THRESHOLDS.cls})`)}`);
      console.log(`     ${statusIcon(metrics.si, THRESHOLDS.si)} SI:   ${metrics.si}ms${delta(metrics.si, prev?.si)}  ${dim(`(target: <${THRESHOLDS.si}ms)`)}`);
      console.log(`     JS Exec: ${metrics.jsExecution}ms${delta(metrics.jsExecution, prev?.jsExecution)}`);
      console.log(`     Total:   ${metrics.totalBytes}KB${delta(metrics.totalBytes, prev?.totalBytes)}`);
      console.log('');
    } catch (err) {
      console.log(red(`     ✗ Failed: ${err.message}\n`));
      run.pages[page.name] = { error: err.message };
    }
  }

  log.runs.push(run);
  saveLog(log);
  console.log(dim(`  Results saved to perf-audit-log.json (run #${log.runs.length})\n`));
}

function showCompare() {
  const log = loadLog();
  if (log.runs.length < 2) {
    console.log(yellow('\n  Need at least 2 runs to compare. Run the audit first.\n'));
    return;
  }

  const current = log.runs[log.runs.length - 1];
  const previous = log.runs[log.runs.length - 2];

  console.log(bold('\n📊 Performance Comparison'));
  console.log(dim(`   Previous: ${previous.date.slice(0, 16)} (${previous.baseUrl})`));
  console.log(dim(`   Current:  ${current.date.slice(0, 16)} (${current.baseUrl})\n`));

  for (const page of PAGES) {
    const curr = current.pages[page.name];
    const prev = previous.pages[page.name];
    if (!curr || curr.error || !prev || prev.error) continue;

    console.log(bold(`  📄 ${page.name}`));
    console.log(`     Performance: ${prev.performance} → ${curr.performance}${delta(curr.performance, prev.performance, false)}`);
    console.log(`     LCP:  ${prev.lcp}ms → ${curr.lcp}ms${delta(curr.lcp, prev.lcp)}`);
    console.log(`     FCP:  ${prev.fcp}ms → ${curr.fcp}ms${delta(curr.fcp, prev.fcp)}`);
    console.log(`     TBT:  ${prev.tbt}ms → ${curr.tbt}ms${delta(curr.tbt, prev.tbt)}`);
    console.log(`     CLS:  ${prev.cls} → ${curr.cls}${delta(curr.cls, prev.cls)}`);
    console.log(`     SI:   ${prev.si}ms → ${curr.si}ms${delta(curr.si, prev.si)}`);
    console.log(`     Total: ${prev.totalBytes}KB → ${curr.totalBytes}KB${delta(curr.totalBytes, prev.totalBytes)}`);
    console.log('');
  }
}

function showHistory() {
  const log = loadLog();
  if (log.runs.length === 0) {
    console.log(yellow('\n  No runs yet. Run the audit first.\n'));
    return;
  }

  console.log(bold('\n📈 Performance History\n'));
  console.log(dim('  #   Date              Target                      Page             Perf   LCP      FCP      TBT     CLS'));
  console.log(dim('  ' + '─'.repeat(110)));

  log.runs.forEach((run, i) => {
    for (const page of PAGES) {
      const m = run.pages[page.name];
      if (!m || m.error) {
        console.log(`  ${String(i + 1).padStart(2)}  ${run.date.slice(0, 16)}  ${run.baseUrl.padEnd(28)}  ${page.name.padEnd(15)}  ${red('error')}`);
        continue;
      }
      const perfColor = m.performance >= 90 ? green : m.performance >= 50 ? yellow : red;
      console.log(
        `  ${String(i + 1).padStart(2)}  ${run.date.slice(0, 16)}  ${run.baseUrl.padEnd(28)}  ${page.name.padEnd(15)}  ` +
        `${perfColor(String(m.performance).padStart(3))}    ` +
        `${String(m.lcp).padStart(5)}ms  ${String(m.fcp).padStart(5)}ms  ${String(m.tbt).padStart(4)}ms  ${String(m.cls).padStart(5)}`
      );
    }
  });
  console.log('');
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--compare')) {
    showCompare();
    return;
  }

  if (args.includes('--history')) {
    showHistory();
    return;
  }

  const baseUrl = args.includes('--local') ? LOCAL_BASE : PROD_BASE;
  await runAudit(baseUrl);
}

main().catch((err) => {
  console.error(red(`\nFatal: ${err.message}`));
  process.exit(1);
});
