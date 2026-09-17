'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useThemeFilter } from '@/hooks/useTheme';

/**
 * The agents these skills work with, as marks rather than a list of names.
 *
 * "Works with any agent" is the claim the page has to make and the one a list
 * of comma-separated words makes least convincingly — a reader skims past
 * four words, but recognises four logos without reading at all. The names stay
 * in the markup for screen readers and for anyone whose images do not load.
 *
 * The names are set at caption rather than the eyebrow size the labels above
 * them use: a label can be 12px because you read it once, but these are
 * content — the answer to "which agents?" — and 12px is below what this
 * project treats as readable for anything that carries meaning.
 *
 * simple-icons ship as flat black glyphs, so they are filtered the same way
 * the pattern grid and ProductsSection filter product logos: greyscale in
 * light mode, inverted on top of that in dark, which keeps a black mark
 * visible on a dark surface.
 */

/** Order matters: the first is the mark shown before the cycle starts. */
export const AGENTS = [
  { name: 'Claude Code', logo: '/images/logos/claude.svg' },
  { name: 'Cursor', logo: '/images/logos/simple-icons/cursor.svg' },
  { name: 'GitHub Copilot', logo: '/images/logos/simple-icons/githubcopilot.svg' },
  { name: 'Codex', logo: '/images/logos/simple-icons/openai.svg' },
] as const;

/** How long each mark holds before the next one fades in. */
const INTERVAL_MS = 2400;

/**
 * A single framed mark that cycles through the agents.
 *
 * It sits at the head of the install block, where a static icon would have to
 * pick one agent and so quietly imply the skills are only for that one. The
 * cycle says "any of these" in the space of one icon.
 *
 * Honours prefers-reduced-motion by holding on the first mark: a small looping
 * animation in the corner of the eye is exactly what that setting is for.
 */
export function CyclingAgentMark() {
  const [index, setIndex] = useState(0);
  const logoFilter = useThemeFilter('grayscale(100%)');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % AGENTS.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      {AGENTS.map((agent, i) => (
        <Image
          key={agent.name}
          src={agent.logo}
          alt=""
          width={18}
          height={18}
          className={`absolute h-4 w-4 transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ filter: logoFilter }}
        />
      ))}
    </span>
  );
}

/**
 * The agent line under "Works with any agent": each mark with its name beside
 * it, wrapping as a row of small chips.
 */
export function AgentLogoRow() {
  const logoFilter = useThemeFilter('grayscale(100%)');

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {AGENTS.map((agent) => (
        <li
          key={agent.name}
          className="type-caption flex items-center gap-1.5 text-text-secondary"
        >
          <Image
            src={agent.logo}
            alt=""
            width={14}
            height={14}
            className="h-3.5 w-3.5"
            style={{ filter: logoFilter }}
          />
          {agent.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Logo for a course's tool, for the rail's Courses group.
 *
 * A tool logo is not decoration here, which is the difference from the rows in
 * every other group: six of the seven courses are ABOUT a tool, and the logo
 * says which one before the title is read. That is the same job the marks do in
 * Explore.
 *
 * Lives beside `AGENTS` because this is the second place that needs to know
 * where a tool's logo file is, and two lists of that would drift.
 */
const COURSE_TOOL_LOGOS: Record<string, string> = {
  'Claude Code': '/images/logos/claude.svg',
  'Claude Design': '/images/logos/simple-icons/claude-design.svg',
  Cursor: '/images/logos/cursor.svg',
  'GitHub Copilot': '/images/logos/simple-icons/githubcopilot.svg',
  GitHub: '/images/logos/simple-icons/github.svg',
};

/**
 * One course has no tool — "Conversational UI" is a subject, not a product —
 * and a single blank slot in a column of logos reads as a missing image rather
 * than as a deliberate absence. It gets a drawn mark instead, which keeps the
 * column even and still says what the course is about.
 */
function SubjectMark() {
  return (
    // Solid, not outlined, because everything it sits beside is a brand logo
    // and those arrive filled. A trademark cannot be redrawn as a stroke to
    // match, so the one mark we do draw matches them instead — otherwise a
    // single hairline icon reads as lighter than the rest of the column and
    // looks like a mistake rather than a choice.
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 3C6.9 3 2.8 6.5 2.8 10.9c0 2.2 1 4.2 2.7 5.6-.1 1.1-.5 2.6-1.7 4 0 0 2.9-.3 4.9-2 1.1.4 2.3.6 3.6.6 5.1 0 9.2-3.6 9.2-8s-4.1-8.1-9.2-8.1z" />
    </svg>
  );
}

/**
 * Docs and Slides are artifact types inside Claude, not products, so neither
 * ships a logo of its own. Reusing the Claude mark for both put three identical
 * marks in one column, which reads as a rendering fault rather than as three
 * courses about three things.
 *
 * Claude gives each artifact type its own glyph in its artifact list: a page
 * for a doc, stacked rectangles for a deck. These redraw those, filled to match
 * the brand logos they sit beside, the same reasoning as `SubjectMark`.
 */
function DocMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M6 2h8l4 4v16H6V2zm7 1.5V7h3.5L13 3.5zM8.5 11h7v1.5h-7V11zm0 3.5h7V16h-7v-1.5zm0 3.5h4.5v1.5H8.5V18z" />
    </svg>
  );
}

function SlidesMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M7 3h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm-3 3v12a1 1 0 0 0 1 1h13v1.5a.5.5 0 0 1-.5.5H3.5a1.5 1.5 0 0 1-1.5-1.5V6.5a.5.5 0 0 1 .5-.5H4z" />
    </svg>
  );
}

const COURSE_TOOL_MARKS: Record<string, () => React.ReactElement> = {
  'Claude Docs': DocMark,
  'Claude Slides': SlidesMark,
};

export function CourseToolMark({ tool }: { tool?: string }) {
  const logoFilter = useThemeFilter('grayscale(100%)');
  const drawn = tool ? COURSE_TOOL_MARKS[tool] : undefined;
  const logo = tool ? COURSE_TOOL_LOGOS[tool] : undefined;

  if (drawn) {
    const Mark = drawn;
    return <Mark />;
  }

  if (!logo) return <SubjectMark />;

  return (
    <Image
      src={logo}
      alt=""
      width={14}
      height={14}
      className="h-3.5 w-3.5 shrink-0"
      style={{ filter: logoFilter }}
    />
  );
}
