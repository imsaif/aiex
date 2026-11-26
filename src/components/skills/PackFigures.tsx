import type { ReactNode } from 'react';
import Image from 'next/image';
import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
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
    <figure className="space-y-default rounded-card bg-tint-surface p-loose">
      <figcaption className="text-sm font-semibold text-text-primary">{title}</figcaption>
      {children}
    </figure>
  );
}

/** One real screenshot from the November 2026 tests, cropped to what matters. */
export interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const SHOT_DIR = '/images/skills/walkthrough/';

export const SHOTS = {
  plugins: { src: `${SHOT_DIR}app-1-plugins.png`, width: 1360, height: 220, alt: 'The Plugins page in Claude, with an Add button at the top right' },
  addMenu: { src: `${SHOT_DIR}app-2-add-menu.png`, width: 1360, height: 250, alt: 'The Add menu open, with Upload plugin at the top' },
  added: { src: `${SHOT_DIR}app-2-added.png`, width: 1360, height: 660, alt: 'The Aiux skills plugin page showing Added' },
  ask: { src: `${SHOT_DIR}app-3-ask.png`, width: 925, height: 350, alt: 'A Claude chat with a screenshot attached and the review prompt typed' },
  answer: { src: `${SHOT_DIR}app-3-findings.png`, width: 520, height: 300, alt: "The start of Claude's answer, listing ranked gaps with the patterns behind each" },
  notesQuestion: { src: `${SHOT_DIR}code-2-notes-question.png`, width: 1782, height: 682, alt: 'Claude Code asking whether to add one line to the project notes, with Yes, add it recommended' },
  installed: { src: `${SHOT_DIR}code-2-summary.png`, width: 1782, height: 160, alt: 'Claude Code saying it installed all 38 skills and created the notes file' },
} satisfies Record<string, Shot>;

/** Screenshots on the tint, each with a hairline so white screens keep an edge. */
export function ShotFigure({ shots, caption }: { shots: Shot[]; caption: string }) {
  return (
    <figure className="space-y-snug">
      <div className="space-y-snug rounded-card bg-tint-surface p-snug">
        {shots.map((shot) => (
          <Image
            key={shot.src}
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full rounded-input border border-border-primary bg-white shadow-card"
          />
        ))}
      </div>
      <figcaption className="text-sm text-text-secondary">{caption}</figcaption>
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
