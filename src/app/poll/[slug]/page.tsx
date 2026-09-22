import { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { AUDIT_PATH } from '@/lib/audit/constants';
import { PATTERN_COUNT } from '@/data/pattern-count';
import {
  pollFromStructuredData,
  isValidChoice,
  voterHash,
  isLikelyBot,
  type PollDefinition,
} from '@/lib/newsletter/poll';

// Where a newsletter poll answer lands. Reached only from an email link, so it
// stays out of the index — it would otherwise compete with /news for the issue
// titles it echoes.
export const metadata: Metadata = {
  title: 'Thanks for voting',
  robots: { index: false, follow: false },
};

// Every request writes and reads a vote, so nothing here may be cached.
export const dynamic = 'force-dynamic';

interface PollPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ c?: string }>;
}

/**
 * Records the vote, if it is one worth recording.
 *
 * Failure is deliberately silent. A reader who clicked an answer should see the
 * results either way; losing one anonymous vote to a database hiccup is not
 * worth showing them an error page.
 */
async function recordVote(issueSlug: string, choiceId: string): Promise<void> {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const userAgent = headerList.get('user-agent');

  if (isLikelyBot(userAgent, headerList.get('sec-purpose'))) return;

  const hash = voterHash(issueSlug, ip, userAgent);

  try {
    if (!hash) {
      // No usable fingerprint (no forwarded IP). Record it anyway — an
      // uncountable-but-real vote beats a dropped one — and accept that it
      // cannot be de-duplicated.
      await prisma.pollVote.create({ data: { issueSlug, choiceId } });
      return;
    }

    // Last answer wins. People misclick on a phone and immediately tap the one
    // they meant; treating that as two votes would be worse than overwriting.
    await prisma.pollVote.upsert({
      where: { issueSlug_voterHash: { issueSlug, voterHash: hash } },
      create: { issueSlug, choiceId, voterHash: hash },
      update: { choiceId },
    });
  } catch (error) {
    console.error('[poll] vote not recorded:', error);
  }
}

async function tallyFor(issueSlug: string, poll: PollDefinition) {
  const grouped = await prisma.pollVote.groupBy({
    by: ['choiceId'],
    where: { issueSlug },
    _count: { choiceId: true },
  });

  const counts = new Map(grouped.map((row) => [row.choiceId, row._count.choiceId]));
  const total = grouped.reduce((sum, row) => sum + row._count.choiceId, 0);

  return {
    total,
    rows: poll.choices.map((choice) => {
      const count = counts.get(choice.id) ?? 0;
      return {
        ...choice,
        count,
        share: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    }),
  };
}

export default async function PollPage({ params, searchParams }: PollPageProps) {
  const { slug } = await params;
  const { c } = await searchParams;

  const issue = await prisma.newsletterDraft.findUnique({
    where: { slug },
    select: { title: true, slug: true, structuredData: true, status: true },
  });

  const poll = pollFromStructuredData(issue?.structuredData);

  // An unknown issue or an unknown choice records nothing, but still shows the
  // page. A reader who clicked a link in good faith should never see a 404
  // because an issue was regenerated underneath them.
  const counted = !!issue && isValidChoice(poll, c);
  if (counted) await recordVote(slug, c!);

  const { total, rows } = await tallyFor(slug, poll);
  const chosen = counted ? c : undefined;

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      <section className="pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {counted ? 'Thanks, that is logged.' : 'Here is how the issue landed.'}
          </h1>
          <p className="text-text-secondary mb-10">
            {poll.question}
            {issue?.title ? ` · ${issue.title}` : ''}
          </p>

          <div className="space-y-4 mb-6">
            {rows.map((row) => (
              <div key={row.id}>
                <div className="flex items-baseline justify-between mb-2">
                  <span
                    className={
                      row.id === chosen
                        ? 'font-semibold text-text-primary'
                        : 'text-text-secondary'
                    }
                  >
                    {row.label}
                    {row.id === chosen && (
                      <span className="ml-2 text-xs uppercase tracking-wide text-accent-primary">
                        your answer
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-text-tertiary tabular-nums">
                    {row.share}%
                  </span>
                </div>
                {/* Width is the only thing that varies, so it stays inline —
                    Tailwind cannot generate a class per percentage. */}
                <div className="h-2 w-full rounded-full bg-background-secondary overflow-hidden">
                  <div
                    className={
                      row.id === chosen ? 'h-full bg-accent-primary' : 'h-full bg-border-primary'
                    }
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-text-tertiary mb-12">
            {total === 0
              ? 'No votes on this issue yet. Yours may be the first to land.'
              : `${total} ${total === 1 ? 'reader has' : 'readers have'} answered this issue.`}
          </p>

          {/* A vote is the most engaged moment in the whole issue. Spending it on
              a dead-end "thanks!" wastes the one click we know we have. */}
          <div className="rounded-2xl border border-border-primary p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3">
              While you are here
            </p>
            <h2 className="text-2xl font-bold mb-3">Turn your design into Claude skills</h2>
            <p className="text-text-secondary mb-6">
              Drop a screenshot. See which of the {PATTERN_COUNT} patterns you are
              missing and take them away as Claude Code skills. Free, no signup for
              the first audit.
            </p>
            <Link
              href={`${AUDIT_PATH}?utm_source=newsletter&utm_medium=email&utm_campaign=poll`}
              className="inline-block rounded-full bg-accent-primary px-7 py-3.5 font-semibold text-white hover:bg-accent-hover"
            >
              Get your Claude skills →
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            <Link
              href="/news"
              className="text-accent-primary hover:text-accent-hover underline underline-offset-2"
            >
              Read past issues
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
