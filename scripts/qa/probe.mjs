#!/usr/bin/env node
/**
 * Site probe: loads pages in a real browser and reports facts about them.
 *
 * This is the fact-gathering half of the QA impact agent (see
 * `.github/qa/impact-prompt.md`). The agent decides WHICH pages a change could
 * have reached; this script visits them and says what is actually there. Kept
 * deterministic on purpose: the same pages give the same JSON every run, so
 * the agent's judgement is the only variable.
 *
 * Strictly read-only. Every request to `/api/*` is aborted (except
 * `/api/health`), every non-GET request is aborted, and third-party analytics
 * are blocked. A probe must never be able to send a newsletter, fire a cron,
 * write to the database or show up as a visitor in the funnel numbers.
 *
 * Usage:
 *   node scripts/qa/probe.mjs --base https://aiuxdesign.guide --paths /guides,/patterns
 *   node scripts/qa/probe.mjs --base <preview> --compare https://aiuxdesign.guide --paths-file paths.txt
 *   node scripts/qa/probe.mjs --base https://aiuxdesign.guide --sitemap --limit 400
 *
 * Options:
 *   --base <url>        Site to probe (required).
 *   --compare <url>     Second site to probe the same paths on; the output
 *                       then lists what differs (preview vs production).
 *   --paths a,b         Comma-separated paths.
 *   --paths-file <f>    One path per line.
 *   --sitemap           Probe every URL in <base>/sitemap.xml.
 *   --limit <n>         Cap the number of paths (default 400).
 *   --viewports <list>  Comma-separated, from: desktop, phone (default both).
 *   --check-links       Also request every internal link found (GET, no JS).
 *   --out <file>        Write JSON here instead of stdout.
 *
 * Env: VERCEL_AUTOMATION_BYPASS_SECRET and QA_PREVIEW_HOST. The secret is
 * sent only when --base is exactly that host, so a base URL chosen by anyone
 * else (including the agent) can never receive it.
 */

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const USER_AGENT = 'aiux-qa-probe/1.0 (+https://github.com/imsaif/aiex)';
const VIEWPORTS = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  phone: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const BLOCKED_HOSTS = [
  'clarity.ms',
  'googletagmanager.com',
  'google-analytics.com',
  'va.vercel-scripts.com',
  'vitals.vercel-insights.com',
  'plausible.io',
  'posthog.com',
];
const CONCURRENCY = 4;
const NAV_TIMEOUT = 45_000;

function parseArgs(argv) {
  const args = { limit: 400, viewports: ['desktop', 'phone'] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--base') args.base = next();
    else if (a === '--compare') args.compare = next();
    else if (a === '--paths') args.paths = next().split(',').map((p) => p.trim()).filter(Boolean);
    else if (a === '--paths-file')
      args.paths = readFileSync(next(), 'utf8').split('\n').map((p) => p.trim()).filter((p) => p && !p.startsWith('#'));
    else if (a === '--sitemap') args.sitemap = true;
    else if (a === '--limit') args.limit = Number(next());
    else if (a === '--viewports') args.viewports = next().split(',');
    else if (a === '--check-links') args.checkLinks = true;
    else if (a === '--out') args.out = next();
    else throw new Error(`Unknown option ${a}`);
  }
  if (!args.base) throw new Error('--base is required');
  args.base = args.base.replace(/\/$/, '');
  if (args.compare) args.compare = args.compare.replace(/\/$/, '');
  return args;
}

function bypassHeaders(base) {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const host = process.env.QA_PREVIEW_HOST;
  if (!secret || !host || new URL(base).hostname !== host) return {};
  return { 'x-vercel-protection-bypass': secret, 'x-vercel-set-bypass-cookie': 'true' };
}

async function sitemapPaths(base) {
  const seen = new Set();
  async function walk(url) {
    const res = await fetch(url, { headers: { 'user-agent': USER_AGENT, ...bypassHeaders(base) } });
    if (!res.ok) throw new Error(`sitemap ${url} returned ${res.status}`);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    if (/<sitemapindex/i.test(xml)) {
      for (const loc of locs) await walk(loc);
    } else {
      for (const loc of locs) seen.add(new URL(loc).pathname);
    }
  }
  await walk(`${base}/sitemap.xml`);
  return [...seen];
}

/** Everything read-only enforcement needs, applied per browser context. */
async function guardContext(context) {
  const blocked = [];
  const block = (route, why) => {
    const u = new URL(route.request().url());
    blocked.push(`${why} ${route.request().method()} ${u.host}${u.pathname}`);
    return route.abort('blockedbyclient');
  };
  await context.route('**/*', (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() !== 'GET' && req.method() !== 'HEAD') return block(route, 'non-GET');
    if (BLOCKED_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`)))
      return route.abort('blockedbyclient');
    // Any host, not just the base: the apex redirects to www, and a preview
    // can link to production, so an origin check would let /api/ calls
    // through after the first redirect.
    if (url.pathname.startsWith('/api/') && url.pathname !== '/api/health')
      return block(route, 'api');
    return route.continue();
  });
  return blocked;
}

/** Runs inside the page. Returns plain facts, no judgement. */
function collectInPage() {
  // checkVisibility also sees content-visibility:hidden, which is how Chrome
  // hides the body of a closed <details>; a size-and-style check does not.
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && el.checkVisibility({ visibilityProperty: true });
  };
  const accessibleName = (el) =>
    (el.getAttribute('aria-label') ||
      (el.getAttribute('aria-labelledby') &&
        document.getElementById(el.getAttribute('aria-labelledby'))?.textContent) ||
      el.getAttribute('title') ||
      // innerText, not textContent: a label hidden with display:none (the
      // header's icon-only links on phones) is not a name anyone hears.
      el.innerText ||
      [...el.querySelectorAll('img[alt]')].map((i) => i.alt).join(' ') ||
      '').trim();
  const describe = (el) =>
    `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.getAttribute('href') ? `[href=${el.getAttribute('href')}]` : ''}`;

  window.scrollTo(10_000, window.scrollY);
  const canScrollSideways = window.scrollX > 0;
  window.scrollTo(0, 0);

  const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 120));
  const unnamedControls = [...document.querySelectorAll('a[href], button, [role="button"], input:not([type="hidden"]), select, textarea')]
    .filter((el) => visible(el) && !el.closest('[aria-hidden="true"]'))
    .filter((el) => {
      if (el.matches('input, select, textarea'))
        return !(el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('placeholder'));
      return !accessibleName(el);
    })
    .slice(0, 10)
    .map(describe);
  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0 && visible(img) && !img.src.startsWith('data:'))
    .slice(0, 10)
    .map((img) => img.currentSrc || img.src);
  const internalLinks = [...new Set(
    [...document.querySelectorAll('a[href]')]
      .map((a) => a.href)
      .filter((h) => h.startsWith(location.origin) && !h.includes('/api/'))
      .map((h) => new URL(h).pathname),
  )];

  return {
    title: document.title,
    h1s,
    metaDescription: document.querySelector('meta[name="description"]')?.content ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    noindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.content ?? ''),
    hasMain: !!document.querySelector('main'),
    hasNav: !!document.querySelector('nav'),
    canScrollSideways,
    unnamedControls,
    brokenImages,
    internalLinks,
    textLength: document.body.innerText.length,
  };
}

async function probePath(browser, base, path, viewportName) {
  const vp = VIEWPORTS[viewportName];
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    userAgent: USER_AGENT,
    extraHTTPHeaders: bypassHeaders(base),
  });
  const blocked = await guardContext(context);
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const text = m.text();
    // Our own blocking shows up as failed loads; that is not a site fault.
    if (/ERR_BLOCKED_BY_CLIENT|net::ERR_FAILED/.test(text)) return;
    consoleErrors.push(text.slice(0, 300));
  });
  page.on('pageerror', (e) => consoleErrors.push(`Uncaught: ${String(e.message).slice(0, 300)}`));
  page.on('response', (r) => {
    const u = new URL(r.url());
    if (u.origin === new URL(base).origin && r.status() >= 400 && !u.pathname.startsWith('/api/'))
      failedRequests.push(`${r.status()} ${u.pathname}`);
  });

  const started = Date.now();
  const result = { path, viewport: viewportName };
  try {
    const res = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    await page.waitForLoadState('load', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1_000);
    result.status = res?.status() ?? null;
    result.finalPath = new URL(page.url()).pathname;
    result.loadMs = Date.now() - started;
    Object.assign(result, await page.evaluate(collectInPage));
    result.softNotFound =
      result.status === 200 && result.h1s.some((h) => /not found|404/i.test(h));
  } catch (e) {
    result.error = String(e.message).split('\n')[0];
  }
  result.consoleErrors = [...new Set(consoleErrors)].slice(0, 10);
  result.failedRequests = [...new Set(failedRequests)].slice(0, 10);
  // Proof the read-only guard held: what the page tried to call and was refused.
  result.blockedRequests = [...new Set(blocked)].slice(0, 10);
  await context.close();
  return result;
}

async function pool(items, worker) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await worker(items[idx]);
      }
    }),
  );
  return out;
}

async function checkLinks(base, paths) {
  return (
    await pool(paths, async (p) => {
      try {
        const res = await fetch(base + p, {
          redirect: 'follow',
          headers: { 'user-agent': USER_AGENT, ...bypassHeaders(base) },
        });
        return res.status >= 400 ? { path: p, status: res.status } : null;
      } catch (e) {
        return { path: p, error: String(e.message) };
      }
    })
  ).filter(Boolean);
}

/** What changed between two runs of the same page. Facts only. */
function diff(a, b) {
  const changes = [];
  const add = (field, from, to) => changes.push({ field, from, to });
  if (a.status !== b.status) add('status', b.status, a.status);
  if (a.finalPath !== b.finalPath) add('redirectsTo', b.finalPath, a.finalPath);
  if (JSON.stringify(a.h1s) !== JSON.stringify(b.h1s)) add('h1', b.h1s, a.h1s);
  if (a.title !== b.title) add('title', b.title, a.title);
  if (a.canonical !== b.canonical) add('canonical', b.canonical, a.canonical);
  if (a.noindex !== b.noindex) add('noindex', b.noindex, a.noindex);
  if (a.canScrollSideways !== b.canScrollSideways) add('canScrollSideways', b.canScrollSideways, a.canScrollSideways);
  if (a.softNotFound !== b.softNotFound) add('softNotFound', b.softNotFound, a.softNotFound);
  if (a.hasMain !== b.hasMain) add('hasMain', b.hasMain, a.hasMain);
  if (a.hasNav !== b.hasNav) add('hasNav', b.hasNav, a.hasNav);
  const newErrors = (a.consoleErrors ?? []).filter((e) => !(b.consoleErrors ?? []).includes(e));
  if (newErrors.length) add('newConsoleErrors', [], newErrors);
  const newUnnamed = (a.unnamedControls ?? []).filter((e) => !(b.unnamedControls ?? []).includes(e));
  if (newUnnamed.length) add('newUnnamedControls', [], newUnnamed);
  const lostLinks = (b.internalLinks ?? []).filter((l) => !(a.internalLinks ?? []).includes(l));
  if (lostLinks.length) add('linksRemoved', lostLinks.slice(0, 15), []);
  const gainedLinks = (a.internalLinks ?? []).filter((l) => !(b.internalLinks ?? []).includes(l));
  if (gainedLinks.length) add('linksAdded', [], gainedLinks.slice(0, 15));
  if (b.textLength && Math.abs(a.textLength - b.textLength) / b.textLength > 0.3)
    add('textLengthChangedOver30pct', b.textLength, a.textLength);
  return changes;
}

/**
 * Problems that break a page for everyone, as opposed to quality issues that
 * tend to repeat across every page from one shared component.
 */
const SEVERE = /failed to load|HTTP \d|not found|scrolls sideways|console error|failed asset|broken image/;

/**
 * One line per distinct problem with a page count, read before anything else.
 * On a full-sitemap run a shared-component issue (the header, say) shows up on
 * every page; listing it 400 times would bury the one page that is really down.
 */
function rollup(pages) {
  const byKind = new Map();
  const note = (kind, page) => {
    const entry = byKind.get(kind) ?? { problem: kind, pageCount: 0, examples: [] };
    entry.pageCount++;
    if (entry.examples.length < 5) entry.examples.push(`${page.viewport} ${page.path}`);
    byKind.set(kind, entry);
  };
  for (const page of pages) {
    for (const prob of page.problems) {
      if (/control\(s\) with no accessible name/.test(prob)) {
        for (const c of page.unnamedControls) note(`control with no accessible name: ${c}`, page);
      } else {
        note(prob.replace(/^\d+ /, ''), page);
      }
    }
  }
  return [...byKind.values()].sort(
    (a, b) => Number(SEVERE.test(b.problem)) - Number(SEVERE.test(a.problem)) || b.pageCount - a.pageCount,
  );
}

/** A page is worth the agent's attention if any fact here is non-empty. */
function problems(r) {
  const p = [];
  if (r.error) p.push(`failed to load: ${r.error}`);
  if (r.status && r.status >= 400) p.push(`HTTP ${r.status}`);
  if (r.softNotFound) p.push('says "not found" but returns 200');
  if (r.canScrollSideways) p.push('page scrolls sideways');
  if (r.consoleErrors?.length) p.push(`${r.consoleErrors.length} console error(s)`);
  if (r.failedRequests?.length) p.push(`${r.failedRequests.length} failed asset request(s)`);
  if (r.unnamedControls?.length) p.push(`${r.unnamedControls.length} control(s) with no accessible name`);
  if (r.brokenImages?.length) p.push(`${r.brokenImages.length} broken image(s)`);
  if (r.h1s && r.h1s.length !== 1) p.push(`${r.h1s.length} h1 headings`);
  if (r.status === 200 && !r.metaDescription) p.push('no meta description');
  return p;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let paths = args.paths ?? [];
  if (args.sitemap) paths = [...new Set([...paths, ...(await sitemapPaths(args.base))])];
  if (!paths.length) throw new Error('No paths: pass --paths, --paths-file or --sitemap');
  paths = paths.slice(0, args.limit);

  const browser = await chromium.launch();
  const jobs = paths.flatMap((p) => args.viewports.map((v) => [p, v]));
  const runSite = (base) => pool(jobs, ([p, v]) => probePath(browser, base, p, v));

  const results = await runSite(args.base);
  const compared = args.compare ? await runSite(args.compare) : null;
  await browser.close();

  const pages = results.map((r, i) => {
    const entry = { ...r, problems: problems(r) };
    if (compared) entry.changesVsCompare = diff(r, compared[i]);
    // The full link list is only needed for the link check and the diff.
    delete entry.internalLinks;
    return entry;
  });

  let brokenLinks = [];
  if (args.checkLinks) {
    // Remember where each link was seen, so a broken one can be found and fixed.
    const foundOn = new Map();
    for (const r of results) for (const l of r.internalLinks ?? []) if (!foundOn.has(l)) foundOn.set(l, r.path);
    const all = [...foundOn.keys()].filter((p) => !paths.includes(p));
    brokenLinks = (await checkLinks(args.base, all.slice(0, 1500))).map((b) => ({ ...b, foundOn: foundOn.get(b.path) }));
  }

  // Past this size, per-page entries are kept only for severe problems and
  // diffs; everything else is in the rollup.
  const large = pages.length > 100;
  const listed = pages.filter(
    (p) => p.changesVsCompare?.length || (large ? p.problems.some((x) => SEVERE.test(x)) : p.problems.length),
  );

  const report = {
    base: args.base,
    compare: args.compare ?? null,
    probedAt: new Date().toISOString(),
    pathCount: paths.length,
    viewports: args.viewports,
    summary: {
      pagesWithProblems: pages.filter((p) => p.problems.length).length,
      pagesChanged: compared ? pages.filter((p) => p.changesVsCompare.length).length : null,
      brokenLinks: brokenLinks.length,
    },
    problemRollup: rollup(pages),
    brokenLinks,
    // Clean, unchanged pages are listed by path only, to keep the JSON small
    // enough for the agent to read in one go on a full-sitemap run.
    pages: listed,
    cleanPages: large
      ? `${pages.filter((p) => !p.problems.length && !p.changesVsCompare?.length).length} pages (list omitted on large runs)`
      : pages.filter((p) => !p.problems.length && !p.changesVsCompare?.length).map((p) => `${p.viewport} ${p.path}`),
  };

  const json = JSON.stringify(report, null, 2);
  if (args.out) writeFileSync(args.out, json);
  else process.stdout.write(json + '\n');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
