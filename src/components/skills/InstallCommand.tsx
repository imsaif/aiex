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
export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.clarity?.('event', 'install-command-copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied: the command is selectable text, nothing to do.
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-card border border-border-primary bg-surface-secondary py-3 pl-4 pr-3">
      {/* The command scrolls rather than wraps: a wrapped shell command reads
          as two commands, and half-selecting one is worse than scrolling. */}
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-text-primary">
        <span className="mr-2 select-none text-text-secondary" aria-hidden="true">
          $
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="inline-flex shrink-0 items-center justify-center rounded-card border border-border-primary bg-background-primary p-2 text-text-secondary transition-colors hover:border-accent-primary/40 hover:text-text-primary"
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
