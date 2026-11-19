'use client';

import { trackAuditEvent } from '@/lib/audit/analytics';

interface MapQuestion {
  id: string;
  ordinal: string;
  question: string;
}

/**
 * The five questions at the top of /guides, as a plain numbered list rather
 * than boxed cards. Boxed, they looked like the Guidebot card under them, so
 * Guidebot read as a sixth question. Unboxed, they read as one path from 01
 * to 05. Each click is logged with the section it jumps to.
 */
export default function MapQuestionList({ questions }: { questions: MapQuestion[] }) {
  return (
    <ol className="divide-y divide-border-primary border-y border-border-primary">
      {questions.map((q) => (
        <li key={q.id}>
          <a
            href={`#${q.id}`}
            onClick={() => trackAuditEvent('map_question_clicked', { section: q.id })}
            className="group flex items-center gap-3 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary"
          >
            <span aria-hidden="true" className="type-eyebrow font-mono text-text-secondary">
              {q.ordinal}
            </span>
            {/* The arrow follows the question rather than sitting at the far
                right edge, where on a wide column it read as detached. */}
            <span className="type-body font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
              {q.question}
            </span>
            <span
              aria-hidden="true"
              className="type-body text-text-secondary transition-[color,transform] duration-150 ease-out group-hover:translate-y-0.5 group-hover:text-accent-primary motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
            >
              ↓
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
