import { DESIGN_REVIEW_PROMPT, FIX_PROMPT } from '@/lib/skills/packSteps';

/**
 * One real run, from the November 2026 tests in Claude Code: a small test app
 * with an email sender and a thread summary. Quotes are shortened, never
 * reworded. The before and after are drawn from the code it read and the code
 * it wrote, so keep them in step with the quotes.
 */
const FOUND = [
  {
    pattern: 'Human-in-the-loop',
    quote: 'One click does both the writing and the sending, so no human looks at the email before it leaves.',
  },
  {
    pattern: 'Error recovery',
    quote: 'Failures are invisible \u2026 the user may believe the email went out.',
  },
  {
    pattern: 'Confidence and trust',
    quote: 'It has no link back to the source messages, so a reader can’t check it.',
  },
];

const label = 'text-sm font-semibold text-text-primary';
const said = 'rounded-card bg-surface-secondary px-default py-snug text-sm font-medium text-text-primary';
const button = 'inline-block rounded-input px-3 py-2 text-sm font-medium';

export function PackExample() {
  return (
    <section aria-labelledby="pack-example" className="space-y-8">
      <div className="space-y-tight">
        <h2 id="pack-example" className="type-h2 text-text-primary">
          What it looks like
        </h2>
        <p className="type-body text-text-secondary">
          From a real run in Claude Code, on a small test app that writes emails and summarises threads.
        </p>
      </div>

      <div className="space-y-tight">
        <p className={label}>We said</p>
        <p className={said}>{DESIGN_REVIEW_PROMPT}</p>
      </div>

      <div className="space-y-snug">
        <p className={label}>It found, among others</p>
        <ul className="space-y-snug">
          {FOUND.map((f) => (
            <li key={f.pattern} className="rounded-card border border-border-primary p-default">
              <p className="text-sm text-text-primary">&ldquo;{f.quote}&rdquo;</p>
              <p className="mt-tight text-sm text-text-secondary">{f.pattern}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-tight">
        <p className={label}>Then we said</p>
        <p className={said}>{FIX_PROMPT}</p>
      </div>

      <div className="grid gap-default sm:grid-cols-2">
        <figure className="flex flex-col gap-tight">
          <figcaption className={label}>Before</figcaption>
          <div className="flex flex-1 items-center rounded-card bg-surface-secondary p-loose">
            <span className={`${button} bg-accent-primary text-text-on-accent`}>AI: write and send the email</span>
          </div>
        </figure>
        <figure className="flex flex-col gap-tight">
          <figcaption className={label}>After</figcaption>
          <div className="flex flex-1 flex-col justify-center gap-snug rounded-card bg-surface-secondary p-loose">
            <p className="rounded-input border border-border-primary bg-surface-primary px-3 py-2 text-sm text-text-primary">
              The exact draft
            </p>
            <p className="text-sm text-text-secondary">Sending can&rsquo;t be undone.</p>
            <div className="flex gap-tight">
              <span className={`${button} border border-border-primary bg-surface-primary text-text-primary`}>
                Cancel
              </span>
              <span className={`${button} bg-accent-primary text-text-on-accent`}>Send</span>
            </div>
          </div>
        </figure>
      </div>

      <p className="text-sm text-text-secondary">
        The pictures are drawn from its code and shortened. It also said what it left undone: it could not show who the
        email goes to, and it had not run the code. Your results will differ, so check them.
      </p>
    </section>
  );
}

export default PackExample;
