import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function FeaturedInNewsForPattern({ patternSlug }: { patternSlug: string }) {
  let rows;
  try {
    rows = await prisma.newsPatternMatch.findMany({
      where: { patternSlug, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        newsletter: {
          select: { title: true, slug: true, publishDate: true, summary: true },
        },
      },
    });
  } catch {
    return null;
  }

  const items = rows
    .filter((r) => r.newsletter)
    .map((r) => ({
      id: r.id,
      title: r.newsletter!.title,
      slug: r.newsletter!.slug,
      publishDate: r.newsletter!.publishDate,
      summary: r.newsletter!.summary,
      rationale: r.rationale,
    }));

  if (items.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 my-16 border-t border-border-primary pt-12">
      <h2 className="text-2xl font-semibold text-text-primary mb-1">Featured in news</h2>
      <p className="text-sm text-text-secondary mb-6">Recent issues that touched this pattern.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.id} className="border border-border-primary rounded-lg p-4 bg-surface-primary">
            <Link href={`/news/${it.slug}`} className="font-semibold text-text-primary hover:text-accent-primary">
              {it.title}
            </Link>
            <p className="text-xs text-text-tertiary mt-1">
              {it.publishDate.toISOString().split('T')[0]}
            </p>
            <p className="text-sm text-text-secondary mt-2 line-clamp-3">{it.rationale}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
