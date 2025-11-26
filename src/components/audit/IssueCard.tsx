'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardDocumentIcon, CheckIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface IssueCardProps {
  patternId: string;
  patternName: string;
  status: 'weak' | 'missing';
  improvementPrompt: string;
  priority: 'high' | 'medium' | 'low';
}

export function IssueCard({ patternId, patternName, status, improvementPrompt, priority }: IssueCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvementPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    low: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
  };

  const statusLabel = status === 'missing' ? '✗ Missing' : '⚠ Weak';
  const statusColor = status === 'missing' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';

  return (
    <div className={`border-2 ${priorityColors[priority]} rounded-2xl p-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
            <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-background-primary rounded text-text-tertiary">
              {priority} priority
            </span>
          </div>
          <h3 className="text-xl font-semibold text-text-primary">{patternName}</h3>
        </div>
      </div>

      {/* Improvement Prompt */}
      <div className="mb-4 p-4 bg-background-primary rounded-xl border border-border-primary">
        <div className="text-xs text-text-tertiary mb-2 font-semibold uppercase">AI Prompt to Fix</div>
        <p className="text-sm text-text-secondary leading-relaxed">{improvementPrompt}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:scale-[1.02] transition-transform text-sm"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </button>
        <Link
          href={`/patterns/${patternId}`}
          className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-border-primary rounded-xl font-semibold hover:border-border-secondary transition-colors text-text-primary text-sm"
        >
          Learn More
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
