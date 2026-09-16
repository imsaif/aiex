'use client';

import { useRef, useState } from 'react';
import { InstallCommand } from './InstallCommand';

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

export interface InstallOption {
  id: string;
  /** Switch label. Short enough to sit in a pill. */
  label: string;
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
                className={`rounded-pill px-4 py-1.5 type-caption transition-colors ${
                  selected
                    ? 'bg-background-primary font-semibold text-text-primary shadow-card'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`install-panel-${active.id}`}
        aria-labelledby={`install-tab-${active.id}`}
        className="mt-5"
      >
        <p className="type-caption mb-4 leading-loose text-text-secondary">
          {active.description}
        </p>
        <InstallCommand command={active.command} prompt={active.prompt} />
        {active.note && (
          <p className="type-footnote mt-3 leading-loose text-text-secondary">
            {active.note}
          </p>
        )}
      </div>
    </div>
  );
}
