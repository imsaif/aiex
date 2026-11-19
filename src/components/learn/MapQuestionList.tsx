'use client';

import { trackAuditEvent } from '@/lib/audit/analytics';

interface MapQuestion {
  id: string;
  ordinal: string;
  question: string;
}

/**
 * The five questions at the top of /guides, under Guidebot. Two columns of
 * plain text, no boxes and no rules: boxed, they looked like the Guidebot card
 * and read as more of the same; as full-width ruled rows, each line was mostly
 * empty rule and the list read like a table. The label ties them to Guidebot
 * as the other way in. Each click is logged with the section it jumps to.
 */
export default function MapQuestionList({ questions }: { questions: MapQuestion[] }) {
  return (
    <nav aria-labelledby="map-questions-label">
      <p id="map-questions-label" className="type-caption mb-default text-text-secondary">
        Or jump to a question
      </p>
      <ol className="grid grid-cols-1 gap-x-roomy gap-y-snug md:grid-cols-2">
        {questions.map((q) => (
          <li key={q.id}>
            <a
              href={`#${q.id}`}
              onClick={() => trackAuditEvent('map_question_clicked', { section: q.id })}
              className="group block rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-4"
            >
              <span className="type-body font-medium text-text-primary transition-colors group-hover:text-accent-primary">
                {/* The last word and the arrow wrap together, so the arrow
                    never lands on a line of its own on a phone. */}
                {q.question.slice(0, q.question.lastIndexOf(' ') + 1)}
                <span className="whitespace-nowrap">
                {q.question.slice(q.question.lastIndexOf(' ') + 1)}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block text-text-secondary transition-[color,transform] duration-150 ease-out group-hover:translate-y-0.5 group-hover:text-accent-primary motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                >
                  ↓
                </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
