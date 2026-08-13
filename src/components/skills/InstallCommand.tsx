'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';

/**
 * The one-command install, presented as a compact terminal chip with a copy
 * button. Content-width and centered so a short command doesn't float inside
 * an oversized block.
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
    <div className="mt-8 inline-flex items-center gap-3 rounded-pill border border-border-primary bg-surface-primary py-2.5 pl-6 pr-2.5 shadow-card">
      <code className="font-mono text-sm text-text-primary">
        <span className="mr-2 select-none text-text-secondary" aria-hidden="true">
          $
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="inline-flex items-center justify-center rounded-full p-2 text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
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
