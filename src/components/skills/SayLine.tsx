'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

/**
 * Words to type to an AI tool, with a copy button. `strong` is for the
 * walkthrough pages, where saying this is the step; the dialog keeps it quiet
 * so it does not compete with the button below.
 */
export function SayLine({ text, strong = false }: { text: string; strong?: boolean }) {
  const [copied, setCopied] = useState(false);
  const Icon = copied ? CheckIcon : ClipboardDocumentIcon;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard refused: the words are on screen and selectable. */
    }
  };

  return (
    <div
      className={`flex items-start justify-between gap-snug rounded-card px-default py-snug ${
        strong ? 'bg-accent-primary text-text-on-accent' : 'bg-surface-secondary text-text-primary'
      }`}
    >
      <p className={`min-w-0 py-0.5 font-medium ${strong ? 'type-body' : 'text-sm'}`}>{text}</p>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : `Copy: ${text}`}
        className="shrink-0 rounded-input p-1 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default SayLine;
