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
      className="scroll-mt-24 border-b border-border-primary py-16 last:border-b-0 md:py-20"
    >
      {/* Same capped measure as the hero. The rows below stay full width. */}
      <div className="mb-12 max-w-[950px]">
        {/* The ordinal sits outside the text column so the heading and the
            intro share a left edge. Previously the ordinal pushed only the
            heading across, and the intro hung to the left of its own title. */}
        {/* The ordinal hangs into the column's left padding at lg and up, so
            every h2 on the page starts at the same edge — numbered map
            sections and the unnumbered prose sections alike. */}
        <div className="flex items-baseline gap-3 lg:-ml-7">
          <span
            aria-hidden="true"
            className="type-eyebrow shrink-0 font-mono text-accent-primary"
          >
            {section.ordinal}
          </span>
          <div>
            <h2 className="type-h2 mb-2 text-text-primary">
              {section.question}
            </h2>
            <p className="type-body text-text-secondary">{section.intro}</p>
          </div>
        </div>
      </div>

      <ol className="space-y-4">
        {section.items.map((item, i) => (
          <LearnItemCard key={item.href} item={item} ordinal={i + 1} />
        ))}
      </ol>

      <div className="mt-6 flex justify-end">
        <Link
          href={section.more.href}
          className="type-caption inline-flex items-center gap-2 rounded-card border border-border-primary px-4 py-2 font-semibold text-text-primary transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
        >
          {section.more.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
