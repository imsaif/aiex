'use client';

import { useRef, useState } from 'react';
import { InstallCommand } from './InstallCommand';
import { CyclingAgentMark } from './AgentMarks';
import { ClaudeMark } from '@/components/icons/ClaudeMark';

/**
 * One command at a time, with a switch above it.
 *
 * The page previously showed both installs at once, as two sections side by
 * side. That was honest and still wrong: two commands of equal weight make a
 * visitor compare before they can act, and the comparison is not one they have
 * the information to make. A switch turns it into a choice with a default,
 * which is what it always was.
 *
 * The selected option's caveat rides with it. The plugin's third line is the
 * one people drop, and a warning that sits under a command they are not looking
 * at is a warning nobody reads.
 */

/**
 * Named rather than passed as an element, so the options can stay plain data in
 * the server component that defines them. `agents` cycles through the agent
 * logos, which is the point: the label says "any other agent" and the mark
 * shows you which ones without spending a row on a logo strip.
 */
type MarkName = 'claude' | 'agents';

function OptionMark({ name }: { name: MarkName }) {
  if (name === 'claude') {
    return <ClaudeMark className="h-4 w-4 shrink-0 text-brand-claude" />;
  }
  return <CyclingAgentMark />;
}

export interface InstallOption {
  id: string;
  /** Switch label. Short enough to sit in a pill. */
  label: string;
  mark?: MarkName;
  /** One line under the switch, saying what this route actually does. */
  description: string;
  command: string | string[];
  /** `null` for Claude's own prompt; `$` for a shell. */
  prompt?: string | null;
  /** Shown under the command for this option only. */
  note?: string;
}

export function InstallPicker({ options }: { options: InstallOption[] }) {
  const [activeId, setActiveId] = useState(options[0]?.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = options.find((o) => o.id === activeId) ?? options[0];
  if (!active) return null;

  /**
   * Arrow keys move between tabs, which is what a tablist promises. Without it
   * the control is reachable by keyboard but not operable the way its role says
   * it is, which is worse than having no role at all.
   */
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const delta =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = (index + delta + options.length) % options.length;
    setActiveId(options[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="type-footnote shrink-0 uppercase tracking-wide text-text-secondary">
          Install via
        </span>
        <div
          role="tablist"
          aria-label="Installation method"
          className="inline-flex gap-1 rounded-pill bg-surface-secondary p-1"
        >
          {options.map((option, index) => {
            const selected = option.id === active.id;
            return (
              <button
                key={option.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                type="button"
                id={`install-tab-${option.id}`}
                aria-selected={selected}
                aria-controls={`install-panel-${option.id}`}
                // Only the selected tab is in the tab order; arrows move within
                // the group. This is what makes a tablist one stop rather than
                // one stop per option.
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(option.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={`flex items-center gap-2 rounded-pill px-4 py-1.5 type-caption transition-colors ${
                  selected
                    ? 'bg-background-primary font-semibold text-text-primary shadow-card'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {option.mark && <OptionMark name={option.mark} />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* One cluster, not four stacked lines.

          Description, command and caveat were evenly spaced and similarly
          weighted, so the eye had no reason to land on the command — the thing
          the reader came for. They now sit tight together as a single unit, and
          the space goes around the group instead of between its parts. The
          caveat is a step smaller again, because it is a condition on the
          command rather than a fact of equal standing. */}
      <div
        role="tabpanel"
        id={`install-panel-${active.id}`}
        aria-labelledby={`install-tab-${active.id}`}
        className="mt-6"
      >
        <p className="type-caption mb-2.5 text-text-secondary">
          {active.description}
        </p>
        <InstallCommand command={active.command} prompt={active.prompt} />
        {active.note && (
          // Size, not colour. text-text-tertiary would read as the quieter step
          // this wants, but it fails AA in dark mode, and a caveat nobody can
          // read is the one thing this line cannot afford to be.
          <p className="type-footnote mt-2 max-w-xl text-text-secondary">
            {active.note}
          </p>
        )}
      </div>
    </div>
  );
}
