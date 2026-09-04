import Link from 'next/link';
import LearnItemCard from './LearnItemCard';
import type { ResolvedLearnSection } from '@/lib/learn-map';

/**
 * One question in the Learn Map, with the content that answers it in order.
 *
 * Server component by design — see the header of `src/lib/learn-map.ts`.
 *
 * The heading is a plain <h2> with an anchor id. It is deliberately NOT marked
 * up as FAQPage Q&A: these are navigation labels with no answer text, and the
 * page already carries a real FAQ block that the FAQPage schema mirrors.
 *
 * Items render as an ordered list because the order is the editorial product —
 * a grid would read as a catalogue, which is the thing this page replaces.
 */
export default function LearnSection({
  section,
}: {
  section: ResolvedLearnSection;
}) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-b border-border-primary py-12 last:border-b-0 md:py-16"
    >
      <div className="mb-8 max-w-3xl">
        <div className="mb-2 flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="font-mono text-sm font-semibold text-accent-primary"
          >
            {section.ordinal}
          </span>
          <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
            {section.question}
          </h2>
        </div>
        <p className="text-base leading-relaxed text-text-secondary">
          {section.intro}
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {section.items.map((item) => (
          <LearnItemCard key={item.href} item={item} />
        ))}
      </ol>

      <Link
        href={section.more.href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:underline"
      >
        {section.more.label}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
