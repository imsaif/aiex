import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  DESIGN_REVIEW_PROMPT,
  FIX_PROMPT,
  PACK_GUIDES,
  PACK_GUIDE_LIST,
  guidePath,
  type PackStep,
  type PackTarget,
} from '@/lib/skills/packSteps';
import { FindingsFigure, FixFigure, FolderFigure, InstallFigure, UploadFigure, ZipFigure } from './PackFigures';
import { SayLine } from './SayLine';

const linkClass =
  'font-medium text-accent-primary underline underline-offset-4 transition-colors hover:text-accent-hover';

const CHECK = 'Three of its findings, shortened. Yours will differ.';
const DRAWN = 'Drawn from its code and shortened. It said it had not run the code.';

const REVIEW_FIGURE = <FindingsFigure title="What came back on a small email app we tested" note={CHECK} />;
const FIX_FIGURE = <FixFigure title="What changed in that app" note={DRAWN} />;

/** One picture per step, in step order. */
const FIGURES: Record<Exclude<PackTarget, 'unsure'>, ReactNode[]> = {
  code: [<FolderFigure key="1" />, <InstallFigure key="2" />, REVIEW_FIGURE, FIX_FIGURE],
  claude: [
    <ZipFigure key="1" />,
    <UploadFigure key="2" />,
    <FindingsFigure
      key="3"
      title="The kind of thing it points out"
      note="From a test on a small email app, shortened. Yours will differ."
    />,
    <FixFigure
      key="4"
      title="The kind of change it suggests"
      note="Drawn from that test in Claude Code, where it changed the code itself."
    />,
  ],
};

const PARTS: Record<Exclude<PackTarget, 'unsure'>, { title: string; note: string; from: number; to: number }[]> = {
  code: [
    { title: 'Set up', note: 'Once per project', from: 0, to: 2 },
    { title: 'Try it', note: 'On a project you already have', from: 2, to: 4 },
  ],
  claude: [
    { title: 'Set up', note: 'Once', from: 0, to: 2 },
    { title: 'Try it', note: 'On a screenshot of any AI screen', from: 2, to: 4 },
  ],
};

export function Part({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="@container">
      <header className="flex flex-wrap items-baseline gap-x-snug gap-y-1 border-b-2 border-text-primary pb-default">
        <h2 className="type-h2 text-text-primary">{title}</h2>
        <p className="type-body text-text-secondary">{note}</p>
      </header>
      {children}
    </section>
  );
}

/** What you do on the left, what to expect on the right; stacked when narrow. */
function Row({ number, figure, children }: { number?: number; figure: ReactNode; children: ReactNode }) {
  return (
    <div className="grid items-start gap-loose border-b border-border-primary py-10 last:border-b-0 last:pb-0 @3xl:grid-cols-2 @3xl:gap-12">
      <div className="flex gap-default">
        {number && (
          <span aria-hidden="true" className="type-h3 w-5 shrink-0 text-text-secondary">
            {number}
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-snug">{children}</div>
      </div>
      {figure}
    </div>
  );
}

function StepBody({ step }: { step: PackStep }) {
  return (
    <>
      <h3 className="type-h3 text-text-primary">{step.title}</h3>
      <p className="type-body text-text-secondary">{step.text}</p>
      {step.say && <SayLine text={step.say} strong />}
      {step.then && <p className="type-body text-text-secondary">{step.then}</p>}
      {step.help?.map((h) => (
        <details key={h.question} className="text-sm text-text-secondary">
          <summary className="w-fit cursor-pointer rounded-input font-medium text-text-primary underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">
            {h.question}
          </summary>
          <p className="mt-tight">
            {h.answer}
            {h.getZip && (
              <>
                {' '}
                <Link href="/?skills=1" prefetch={false} className={linkClass}>
                  {h.getZip}
                </Link>
                .
              </>
            )}
          </p>
        </details>
      ))}
    </>
  );
}

/** The steps for one choice, in two titled parts. */
export function PackWalkthrough({ target }: { target: Exclude<PackTarget, 'unsure'> }) {
  const { steps } = PACK_GUIDES[target];
  return (
    <>
      {PARTS[target].map(({ title, note, from, to }) => (
        <Part key={title} title={title} note={note}>
          {steps.slice(from, to).map((step, i) => (
            <Row key={step.title} number={from + i + 1} figure={FIGURES[target][from + i]}>
              <StepBody step={step} />
            </Row>
          ))}
        </Part>
      ))}
    </>
  );
}

/** For someone who has not chosen: one example to read, then the two routes. */
export function PackExample() {
  return (
    <>
      <Part title="See an example" note="Nothing to install">
        <Row figure={REVIEW_FIGURE}>
          <h3 className="type-h3 text-text-primary">We asked for a design review</h3>
          <p className="type-body text-text-secondary">In Claude Code, with the skills added, we said:</p>
          <p className="type-body text-text-primary">&ldquo;{DESIGN_REVIEW_PROMPT}&rdquo;</p>
        </Row>
        <Row figure={FIX_FIGURE}>
          <h3 className="type-h3 text-text-primary">Then we asked it to fix one thing</h3>
          <p className="type-body text-text-primary">&ldquo;{FIX_PROMPT}&rdquo;</p>
        </Row>
      </Part>
      <Part title="Choose how to use them" note="Either is free">
        <div className="grid gap-loose pt-loose @2xl:grid-cols-2">
          {PACK_GUIDE_LIST.filter((g) => g.target !== 'unsure').map((g) => (
            <div key={g.slug} className="space-y-tight">
              <h3 className="type-h3 text-text-primary">{g.label}</h3>
              <p className="type-body text-text-secondary">{g.hint}</p>
              <Link href={guidePath(g.target)} prefetch={false} className={`inline-block ${linkClass}`}>
                {`${g.label} steps`}
              </Link>
            </div>
          ))}
        </div>
        <p className="pt-loose text-sm text-text-secondary">
          The zip you were sent is the one for the Claude app. For Claude Code,{' '}
          <Link href="/?skills=1" prefetch={false} className={linkClass}>
            get that version
          </Link>
          .
        </p>
      </Part>
    </>
  );
}
