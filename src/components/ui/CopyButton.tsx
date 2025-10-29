'use client';

import { useState, useCallback } from 'react';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {showLabel && <span>Copied!</span>}
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          {showLabel && <span>Copy</span>}
        </>
      )}
    </button>
  );
}
