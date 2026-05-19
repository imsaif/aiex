import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import patterns from '@/data/patterns';

export default async function RelatedPatternsForNews({ newsletterId }: { newsletterId: string }) {
  let rows;
  try {
    rows = await prisma.newsPatternMatch.findMany({
      where: { newsletterId, status: 'approved' },
      orderBy: { confidence: 'desc' },
      take: 6,
    });
  } catch {
    return null;
  }

  if (rows.length === 0) return null;

  const bySlug = new Map(patterns.map((p) => [p.slug, p]));
  type Item = { slug: string; title: string; category: string; rationale: string };
  const items: Item[] = rows.flatMap((r) => {
    const p = bySlug.get(r.patternSlug);
    return p ? [{ slug: p.slug, title: p.title, category: p.category, rationale: r.rationale }] : [];
  });

  if (items.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 my-12 border-t border-border-primary pt-10">
      <h2 className="text-xl font-semibold text-text-primary mb-1">Related patterns</h2>
      <p className="text-sm text-text-secondary mb-5">Where this news fits in the pattern library.</p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.slug} className="border border-border-primary rounded-lg p-4 bg-surface-primary">
            <Link href={`/patterns/${it.slug}`} className="font-semibold text-text-primary hover:text-accent-primary">
              {it.title}
            </Link>
            <span className="text-xs text-text-tertiary ml-2">{it.category}</span>
            <p className="text-sm text-text-secondary mt-1">{it.rationale}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
