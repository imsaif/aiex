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
 * simple-icons ship as flat black glyphs, so they are filtered the same way
 * the pattern grid and ProductsSection filter product logos: greyscale in
 * light mode, inverted on top of that in dark, which keeps a black mark
 * visible on a dark surface.
 */

/** Order matters: the first is the mark shown before the cycle starts. */
export const AGENTS = [
  { name: 'Claude Code', logo: '/images/logos/simple-icons/anthropic.svg' },
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
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-card border border-border-primary bg-background-primary">
      {AGENTS.map((agent, i) => (
        <Image
          key={agent.name}
          src={agent.logo}
          alt=""
          width={18}
          height={18}
          className={`absolute h-[18px] w-[18px] transition-opacity duration-500 ${
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
          className="type-caption flex items-center gap-2 text-text-secondary"
        >
          <Image
            src={agent.logo}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4"
            style={{ filter: logoFilter }}
          />
          {agent.name}
        </li>
      ))}
    </ul>
  );
}
