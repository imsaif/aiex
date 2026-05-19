import { Metadata } from 'next';
import { checkAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import ReviewClient from './review-client';

export const metadata: Metadata = {
  title: 'New Pattern Candidates | Admin',
  description: 'Review AI-detected candidate new patterns from the news pipeline',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function PatternReviewPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <ReviewClient initialAuth={false} candidates={[]} />;
  }

  const candidates = await prisma.patternCandidate.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <ReviewClient
      initialAuth={true}
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
