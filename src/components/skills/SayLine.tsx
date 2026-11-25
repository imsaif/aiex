'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

/** Words to type to an AI tool, with a copy button. */
export function SayLine({ text }: { text: string }) {
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
    <div className="flex items-start justify-between gap-snug rounded-card bg-surface-secondary px-default py-snug">
      <p className="min-w-0 py-0.5 text-sm font-medium text-text-primary">{text}</p>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : `Copy: ${text}`}
        className="shrink-0 rounded-input p-1 text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default SayLine;
