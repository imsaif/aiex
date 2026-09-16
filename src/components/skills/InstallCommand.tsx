'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';

/**
 * The one-command install, as a full-width terminal block with a copy button.
 *
 * It used to be a content-width pill floating in the middle of its column,
 * which read as a chip rather than as a thing to run: the command and the copy
 * control had no shared boundary, and the block's width changed with the
 * length of the command. Now it fills its column on a tinted surface, the way
 * a code block does everywhere else, so the eye lands on it as the payload of
 * the section rather than as decoration.
 *
 * Spacing is the caller's business — the block carries none of its own, so it
 * can sit tight under a paragraph or loose in a stack without fighting a
 * baked-in margin.
 */
/**
 * Pass an array for a sequence that only works run in full.
 *
 * The plugin install is three commands, and the third (`/reload-plugins`) is the
 * one people drop — without it the skills are installed and inert, with no error
 * to say so. One copy button covering the whole sequence is the difference
 * between that being easy to get right and easy to get wrong.
 */
export function InstallCommand({
  command,
  /**
   * The prompt character. `$` is a shell, so it is wrong in front of a Claude
   * Code slash command — those are typed at Claude's own prompt, and a `$` would
   * tell the reader to run them in a terminal, where they do nothing. Pass
   * `null` for those.
   */
  prompt = '$',
}: {
  command: string | string[];
  prompt?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const lines = Array.isArray(command) ? command : [command];

  async function copy() {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      window.clarity?.('event', 'install-command-copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied: the command is selectable text, nothing to do.
    }
  }

  return (
    // Width comes from the commands, not the column. Filling the column left the
    // longest line (42 characters) sitting in a 768px box, so the text hugged one
    // edge and the copy button the other, with dead space between them reading as
    // a mis-set block rather than a command you run.
    //
    // max-w-full so it still shrinks on a narrow screen rather than pushing the
    // page sideways; each line keeps its own overflow-x for the rare long one.
    <div className="flex w-fit max-w-full items-start gap-3 rounded-card bg-surface-secondary py-3.5 pl-4 pr-2.5">
      {/* Each command scrolls rather than wraps: a wrapped shell command reads
          as two commands, and half-selecting one is worse than scrolling. */}
      <code className="min-w-0 flex-1 font-mono text-sm text-text-primary">
        {lines.map((line) => (
          <span key={line} className="block overflow-x-auto whitespace-nowrap leading-loose">
            {prompt && (
              <span className="mr-2 select-none text-text-secondary" aria-hidden="true">
                {prompt}
              </span>
            )}
            {line}
          </span>
        ))}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="inline-flex shrink-0 items-center justify-center rounded-card p-2 text-text-secondary transition-colors hover:bg-background-primary hover:text-text-primary"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
        ) : (
          <ClipboardIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? 'Copied' : ''}
        </span>
      </button>
    </div>
  );
}
