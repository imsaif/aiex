'use client';

import { useState, useCallback } from 'react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface CopyButtonProps {
  text: string;
  className?: string;
  showLabel?: boolean;
}

export default function CopyButton({ text, className = '', showLabel = true }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium
                 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
                 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          {showLabel && <span>Copied!</span>}
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="w-4 h-4" />
          {showLabel && <span>Copy</span>}
        </>
      )}
    </button>
  );
}
