'use client';

import React, { useState } from 'react';
import CopyButton from './CopyButton';

interface LessonCodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  className?: string;
}

export default function LessonCodeBlock({
  code,
  language = 'bash',
  label,
  className = '',
}: LessonCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs font-mono">
        <span>{label || language}</span>
        <button
          onClick={handleCopy}
          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-white text-xs font-medium"
        >
          {isCopied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-white text-gray-900 p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
