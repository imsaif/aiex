'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Which tools read the skills, cycling one at a time on the navy band.
 *
 * Worded as a fact about the format, not a promise about results: the skills
 * were tested in Claude Code and the Claude app (Nov 2026), while Cursor and
 * GitHub Copilot and Codex are named because their own docs say they read
 * Agent Skills (Codex: developers.openai.com/codex/skills, from .agents/skills).
 */
const TOOLS = [
  { name: 'Claude Code', logo: '/images/logos/claude.svg' },
  { name: 'the Claude app', logo: '/images/logos/claude.svg' },
  { name: 'Cursor', logo: '/images/logos/simple-icons/cursor.svg' },
  { name: 'GitHub Copilot', logo: '/images/logos/simple-icons/githubcopilot.svg' },
  { name: 'Codex', logo: '/images/logos/simple-icons/openai.svg' },
] as const;

const INTERVAL_MS = 2400;

export function SkillFormatMarks() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // A loop in the corner of the eye is what reduced motion is for: hold still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TOOLS.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex flex-wrap items-center gap-x-tight gap-y-1 text-sm text-text-on-band-muted">
      <span className="sr-only">
        Uses the open skills format, read by Claude Code, the Claude app, Cursor, GitHub Copilot and Codex.
      </span>
      <span aria-hidden="true">Uses the open skills format, read by</span>
      <span aria-hidden="true" className="inline-flex items-center gap-tight rounded-pill border border-band-border px-snug py-1 font-semibold text-text-on-band">
        <span className="relative h-4 w-4 shrink-0">
          {TOOLS.map((tool, i) => (
            <Image
              key={tool.name}
              src={tool.logo}
              alt=""
              width={16}
              height={16}
              // Flat marks, turned white for the navy band.
              className={`absolute inset-0 h-4 w-4 brightness-0 invert transition-opacity duration-500 ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </span>
        <span className="min-w-[7.5rem]">{TOOLS[index].name}</span>
      </span>
    </p>
  );
}

export default SkillFormatMarks;
