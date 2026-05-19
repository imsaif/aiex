import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import patterns from '@/data/patterns';
import { classifyNewsItem } from '@/lib/agents/pattern-intel/classifier';
import { proposeExampleFromNews } from '@/lib/agents/pattern-intel/enricher';
import { discoverNewPatterns } from '@/lib/agents/pattern-intel/discoverer';
import { classifyScreenshot } from '@/lib/agents/pattern-intel/visionClassifier';
import { manualInbox } from '@/lib/agents/sources/manualInbox';
import { mobbinSource } from '@/lib/agents/sources/mobbinSource';
import type { NewsItem, PatternRef } from '@/lib/agents/pattern-intel/types';
import type { ScreenshotSource } from '@/lib/agents/sources/screenshotSource';

export const maxDuration = 60;

const LOOKBACK_DAYS_CLASSIFY = 2;
const LOOKBACK_DAYS_DISCOVER = 7;
const ENRICH_FLOOR = 0.75;

const SOURCES: ScreenshotSource[] = [manualInbox, mobbinSource];

function patternRefs(): PatternRef[] {
  return patterns.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    problem: p.content.problem,
    solution: p.content.solution,
  }));
}

async function loadUnclassifiedNews(days: number): Promise<NewsItem[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const drafts = await prisma.newsletterDraft.findMany({
    where: {
      status: 'published',
      publishDate: { gte: since },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      publishDate: true,
      patternMatches: { select: { id: true } },
    },
    orderBy: { publishDate: 'desc' },
  });

  return drafts
    .filter((d) => d.patternMatches.length === 0)
    .map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      publishDate: d.publishDate,
    }));
}

async function runClassifyAndEnrich(
  items: NewsItem[],
  refs: PatternRef[],
  validSlugs: Set<string>,
  refsBySlug: Map<string, PatternRef>,
  dryRun: boolean,
): Promise<{ matchesWritten: number; candidatesWritten: number }> {
  let matchesWritten = 0;
  let candidatesWritten = 0;

  for (const item of items) {
    let matches;
    try {
      matches = await classifyNewsItem(item, refs, validSlugs);
    } catch (err) {
      console.error(`[pattern-intel] classify failed for ${item.id}:`, err);
      continue;
    }

    if (matches.length === 0) continue;

    if (!dryRun) {
      for (const m of matches) {
        try {
          await prisma.newsPatternMatch.create({
            data: {
              newsletterId: item.id,
              patternSlug: m.slug,
              confidence: m.confidence,
              rationale: m.rationale,
              status: 'approved',
            },
          });
          matchesWritten++;
        } catch (err) {
          if (!(err instanceof Error) || !/Unique|duplicate/i.test(err.message)) {
            console.error('[pattern-intel] match write failed:', err);
          }
        }
      }
    } else {
      matchesWritten += matches.length;
    }

    const top = matches[0];
    if (!top || top.confidence < ENRICH_FLOOR) continue;
    const pattern = refsBySlug.get(top.slug);
    if (!pattern) continue;

    try {
      const proposal = await proposeExampleFromNews(item, top, pattern);
      if (!proposal?.shouldEnrich) continue;
      if (!dryRun) {
        await prisma.patternExampleCandidate.create({
          data: {
            patternSlug: top.slug,
            sourceType: 'news',
            sourceUrl: `https://www.aiuxdesign.guide/news/${item.slug}`,
            sourceTitle: item.title,
            title: proposal.exampleTitle!,
            description: proposal.exampleDescription!,
            rationale: proposal.rationale ?? top.rationale,
            newsletterId: item.id,
            status: 'approved',
          },
        });
      }
      candidatesWritten++;
    } catch (err) {
      console.error(`[pattern-intel] enrich failed for ${item.id}:`, err);
    }
  }

  return { matchesWritten, candidatesWritten };
}

async function runScreenshots(
  refs: PatternRef[],
  validSlugs: Set<string>,
  dryRun: boolean,
): Promise<number> {
  let written = 0;
  for (const source of SOURCES) {
    if (!source.enabled()) continue;
    let cands;
    try {
      cands = await source.fetch();
    } catch (err) {
      console.error(`[pattern-intel] ${source.name} fetch failed:`, err);
      continue;
    }
    if (cands.length === 0) continue;
    console.log(`[pattern-intel] ${source.name} returned ${cands.length} screenshots`);

    for (const cand of cands) {
      let matches;
      try {
        matches = await classifyScreenshot(cand, refs, validSlugs);
      } catch (err) {
        console.error(`[pattern-intel] vision failed for ${cand.id}:`, err);
        continue;
      }
      if (matches.length === 0) {
        if (!dryRun) await source.acknowledge(cand.id);
        continue;
      }

      if (!dryRun) {
        for (const m of matches) {
          try {
            await prisma.patternExampleCandidate.create({
              data: {
                patternSlug: m.slug,
                sourceType: cand.sourceType,
                sourceUrl: cand.sourceUrl,
                sourceTitle: cand.productName ?? null,
                imageUrl: cand.sourceType === 'manual' ? `/screenshots/processed/${cand.id}` : null,
                title: m.exampleTitle,
                description: m.exampleDescription,
                rationale: m.rationale,
                status: 'approved',
              },
            });
            written++;
          } catch (err) {
            console.error('[pattern-intel] screenshot candidate write failed:', err);
          }
        }
        await source.acknowledge(cand.id);
      } else {
        written += matches.length;
      }
    }
  }
  return written;
}

async function runDiscoverer(
  refs: PatternRef[],
  dryRun: boolean,
): Promise<number> {
  // Discoverer only operates on items unmatched after classification.
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - LOOKBACK_DAYS_DISCOVER);

  const drafts = await prisma.newsletterDraft.findMany({
    where: {
      status: 'published',
      publishDate: { gte: since },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      publishDate: true,
      patternMatches: { select: { id: true } },
    },
  });

  const unmatched: NewsItem[] = drafts
    .filter((d) => d.patternMatches.length === 0)
    .map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      publishDate: d.publishDate,
    }));

  if (unmatched.length < 3) {
    console.log(`[pattern-intel] discoverer skipped — only ${unmatched.length} unmatched items`);
    return 0;
  }

  const proposals = await discoverNewPatterns(unmatched, refs);
  if (proposals.length === 0) return 0;

  if (dryRun) return proposals.length;

  let written = 0;
  for (const p of proposals) {
    try {
      await prisma.patternCandidate.create({
        data: {
          proposedSlug: p.proposedSlug,
          proposedTitle: p.proposedTitle,
          proposedCategory: p.proposedCategory,
          problem: p.problem,
          solution: p.solution,
          rationale: p.rationale,
          supportingSources: p.supportingSources,
          clusterSize: p.clusterSize,
        },
      });
      written++;
    } catch (err) {
      console.error('[pattern-intel] candidate write failed:', err);
    }
  }
  return written;
}

async function runPatternIntel(dryRun: boolean, force: { discover?: boolean } = {}) {
  const startedAt = Date.now();
  const refs = patternRefs();
  const validSlugs = new Set(refs.map((p) => p.slug));
  const refsBySlug = new Map(refs.map((p) => [p.slug, p]));

  const items = await loadUnclassifiedNews(LOOKBACK_DAYS_CLASSIFY);
  console.log(`[pattern-intel] processing ${items.length} unclassified items`);

  const { matchesWritten, candidatesWritten } = await runClassifyAndEnrich(
    items,
    refs,
    validSlugs,
    refsBySlug,
    dryRun,
  );

  const screenshotsWritten = await runScreenshots(refs, validSlugs, dryRun);

  const isMonday = new Date().getUTCDay() === 1;
  const shouldDiscover = isMonday || force.discover === true;
  const proposalsWritten = shouldDiscover ? await runDiscoverer(refs, dryRun) : 0;

  const elapsedMs = Date.now() - startedAt;
  console.log(
    `[pattern-intel] done in ${elapsedMs}ms — items=${items.length} matches=${matchesWritten} candidates=${candidatesWritten} screenshots=${screenshotsWritten} proposals=${proposalsWritten} discoverRan=${shouldDiscover} dryRun=${dryRun}`,
  );
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dryRun') === 'true';
  const forceDiscover = url.searchParams.get('discover') === 'true';

  after(() =>
    runPatternIntel(dryRun, { discover: forceDiscover }).catch((err) =>
      console.error('[pattern-intel] fatal:', err),
    ),
  );

  return NextResponse.json({ ok: true, dryRun, forceDiscover, kickedOffAt: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
