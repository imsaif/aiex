import { prisma } from '@/lib/prisma';

const WEEK = 7 * 86_400_000;

/** When each newsletter went out since a date, for leaving out the scanner window. */
export async function sendTimesSince(since: Date): Promise<Date[]> {
  // An issue can be sent days after it was generated, so look back further.
  const issues = await prisma.newsletterDraft.findMany({
    where: { createdAt: { gte: new Date(since.getTime() - WEEK) } },
    select: { structuredData: true },
  });
  return issues.flatMap((issue) => {
    const iso = (issue.structuredData as { send?: { sentAt?: string } } | null)?.send?.sentAt;
    return iso ? [new Date(iso)] : [];
  });
}
