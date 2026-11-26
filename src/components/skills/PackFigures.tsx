import type { ReactNode } from 'react';
import { CheckIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import { PATTERN_COUNT } from '@/data/pattern-count';
import { INSTALL_FILE, PACK_FOLDER } from '@/lib/skills/packSteps';

/**
 * What to expect beside each step. The findings and the before and after are
 * one real run, from the November 2026 tests in Claude Code on a small test app
 * with an email sender and a thread summary. Quotes are shortened, never
 * reworded, and the pictures are drawn from the code it read and wrote.
 *
 * Drawn buttons are grey on purpose: in the accent colour they read as real
 * controls and compete with the one the reader should press.
 */
const FOUND = [
  {
    area: 'Human-in-the-loop',
    quote: 'One click does both the writing and the sending, so no human looks at the email before it leaves.',
  },
  { area: 'Error recovery', quote: 'Failures are invisible … the user may believe the email went out.' },
  {
    area: 'Confidence and trust',
    quote: 'It has no link back to the source messages, so a reader can’t check it.',
  },
];

const small = 'text-sm text-text-secondary';
const drawnButton = 'inline-block rounded-input px-3 py-1.5 text-sm font-medium text-text-primary';

function Figure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="space-y-default rounded-card bg-surface-secondary p-loose">
      <figcaption className="text-sm font-semibold text-text-primary">{title}</figcaption>
      {children}
    </figure>
  );
}

export function FolderFigure() {
  const row = 'flex items-center gap-tight text-text-primary';
  const icon = 'h-5 w-5 shrink-0 text-text-secondary';
  return (
    <Figure title="You should see">
      <ul className="space-y-tight">
        <li className={row}>
          <FolderIcon className={icon} aria-hidden="true" />
          Your project
        </li>
        <li className={`${row} pl-7 font-semibold`}>
          <FolderIcon className={icon} aria-hidden="true" />
          {PACK_FOLDER}
        </li>
        <li className={`${row} pl-14`}>
          <DocumentIcon className={icon} aria-hidden="true" />
          {INSTALL_FILE}
        </li>
        <li className={`${row} pl-14`}>
          <FolderIcon className={icon} aria-hidden="true" />
          skills
        </li>
      </ul>
    </Figure>
  );
}

export function InstallFigure() {
  const asks = [
    `Copies the ${PATTERN_COUNT} skills into your project`,
    'Asks before adding one line to your project notes, so it remembers to use them',
    'Asks before removing any older aiux skills installed for all your projects',
  ];
  return (
    <Figure title="What it does, as seen in our test">
      <ul className="space-y-tight">
        {asks.map((ask) => (
          <li key={ask} className="flex gap-tight text-text-primary">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {ask}
          </li>
        ))}
      </ul>
    </Figure>
  );
}

export function ZipFigure() {
  return (
    <Figure title="The zip to use. Keep it closed.">
      <p className="flex items-center gap-tight font-semibold text-text-primary">
        <DocumentIcon className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
        {PACK_FOLDER}.zip
      </p>
    </Figure>
  );
}

export function UploadFigure() {
  return (
    <Figure title="You should see">
      <p className="flex items-center gap-tight rounded-input bg-tint-card px-default py-snug text-text-primary">
        <CheckIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
        Aiux skills is added and ready to use.
      </p>
      <p className="text-sm text-text-secondary">If Claude asks you to turn on code execution, turn it on. Skills need it.</p>
    </Figure>
  );
}

export function FindingsFigure({ title, note }: { title: string; note: string }) {
  return (
    <Figure title={title}>
      <ul className="divide-y divide-border-primary">
        {FOUND.map((f) => (
          <li key={f.area} className="space-y-1 py-snug first:pt-0">
            <p className="text-text-primary">&ldquo;{f.quote}&rdquo;</p>
            <p className={small}>{f.area}</p>
          </li>
        ))}
      </ul>
      <p className={small}>{note}</p>
    </Figure>
  );
}

export function FixFigure({ title, note }: { title: string; note: string }) {
  const screen =
    'flex min-h-36 flex-1 flex-col items-start justify-center gap-tight rounded-card border border-border-primary bg-surface-primary p-default';
  return (
    <Figure title={title}>
      <div className="grid gap-default sm:grid-cols-2">
        <div className="flex flex-col gap-tight">
          <p className={small}>Before</p>
          <div className={screen}>
            <span className={`${drawnButton} bg-border-primary`}>AI: write and send the email</span>
          </div>
        </div>
        <div className="flex flex-col gap-tight">
          <p className={small}>After</p>
          <div className={screen}>
            <span className="w-full rounded-input border border-border-primary px-3 py-1.5 text-sm text-text-primary">
              The exact draft
            </span>
            <span className={small}>Sending can&rsquo;t be undone.</span>
            <span className="flex flex-wrap gap-tight">
              <span className={`${drawnButton} border border-border-primary`}>Cancel</span>
              <span className={`${drawnButton} bg-border-primary`}>Send</span>
            </span>
          </div>
        </div>
      </div>
      <p className={small}>{note}</p>
    </Figure>
  );
}
