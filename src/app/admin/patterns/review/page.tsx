import { Metadata } from 'next';
import { checkAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import ReviewClient from './review-client';

export const metadata: Metadata = {
  title: 'Pattern Review Queue | Admin',
  description: 'Review AI-suggested pattern matches, examples, and candidates',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function PatternReviewPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <ReviewClient initialAuth={false} matches={[]} examples={[]} candidates={[]} />;
  }

  const [matches, examples, candidates] = await Promise.all([
    prisma.newsPatternMatch.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        newsletter: {
          select: { id: true, title: true, slug: true, publishDate: true },
        },
      },
    }),
    prisma.patternExampleCandidate.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.patternCandidate.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  return (
    <ReviewClient
      initialAuth={true}
      matches={matches.map((m) => ({
        id: m.id,
        patternSlug: m.patternSlug,
        confidence: m.confidence,
        rationale: m.rationale,
        createdAt: m.createdAt.toISOString(),
        newsletter: m.newsletter
          ? {
              title: m.newsletter.title,
              slug: m.newsletter.slug,
              publishDate: m.newsletter.publishDate.toISOString(),
            }
          : null,
      }))}
      examples={examples.map((e) => ({
        id: e.id,
        patternSlug: e.patternSlug,
        sourceType: e.sourceType,
        sourceUrl: e.sourceUrl,
        sourceTitle: e.sourceTitle,
        title: e.title,
        description: e.description,
        rationale: e.rationale,
        createdAt: e.createdAt.toISOString(),
      }))}
      candidates={candidates.map((c) => ({
        id: c.id,
        proposedSlug: c.proposedSlug,
        proposedTitle: c.proposedTitle,
        proposedCategory: c.proposedCategory,
        problem: c.problem,
        solution: c.solution,
        rationale: c.rationale,
        clusterSize: c.clusterSize,
        supportingSources: c.supportingSources,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
