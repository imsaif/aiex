'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';

/**
 * A preview/placeholder panel that shows users what the analysis will look like
 * before they upload a screenshot. Helps set expectations and guide the user.
 */
export function AnalysisPreviewPanel() {
  return (
    <aside className="w-full h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
      {/* Header - Placeholder */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-background-secondary animate-pulse" />
        <span className="text-lg font-semibold text-text-tertiary">Analysis Results</span>
      </div>

      {/* Trust Header Preview */}
      <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-background-secondary rounded-full">
        <ShieldCheckIcon className="w-4 h-4 text-text-tertiary" />
        <p className="text-sm text-text-tertiary">
          Checked against <span className="font-semibold">28 AI patterns</span> from{' '}
          <span className="font-semibold">500+ products</span>
        </p>
      </div>

      {/* Score Circle Placeholder */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center">
          <svg width="100" height="100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={40}
              stroke="currentColor"
              strokeWidth={8}
              fill="none"
              className="text-border-primary"
            />
            {/* Dashed preview circle */}
            <circle
              cx="50"
              cy="50"
              r={40}
              stroke="currentColor"
              strokeWidth={8}
              fill="none"
              strokeDasharray="10 5"
              className="text-text-tertiary/30"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold text-text-tertiary">
              ?<span className="text-lg">/28</span>
            </div>
          </div>
        </div>
        <p className="text-base text-text-tertiary mt-4 leading-relaxed">
          Upload a screenshot to see your score
        </p>
      </div>

      {/* Preview Pattern Sections */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {/* Missing Patterns Preview */}
        <div className="rounded-xl overflow-hidden border border-border-primary bg-status-error/5">
          <div className="flex items-center justify-between p-4 opacity-60">
            <div className="flex items-center gap-3">
              <XCircleIcon className="w-6 h-6 text-status-error/50" />
              <span className="text-lg font-semibold text-status-error/50">Missing Patterns</span>
              <span className="text-base text-text-tertiary">(—)</span>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-text-tertiary" />
          </div>
        </div>

        {/* Weak Patterns Preview */}
        <div className="rounded-xl overflow-hidden border border-border-primary bg-status-warning/5">
          <div className="flex items-center justify-between p-4 opacity-60">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-status-warning/50" />
              <span className="text-lg font-semibold text-status-warning/50">Needs Improvement</span>
              <span className="text-base text-text-tertiary">(—)</span>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-text-tertiary" />
          </div>
        </div>

        {/* Good Patterns Preview */}
        <div className="rounded-xl overflow-hidden border border-border-primary bg-status-success/5">
          <div className="flex items-center justify-between p-4 opacity-60">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-status-success/50" />
              <span className="text-lg font-semibold text-status-success/50">Well Implemented</span>
              <span className="text-base text-text-tertiary">(—)</span>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-text-tertiary" />
          </div>
        </div>
      </div>

      {/* Chat CTA Preview */}
      <div className="pt-4 border-t border-border-primary">
        <div className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-background-secondary text-text-tertiary rounded-full text-lg font-medium">
          <SparklesIcon className="w-6 h-6" />
          Chat with Design Mentor
        </div>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-text-tertiary mt-4">
        Your analysis will appear here
      </p>
    </aside>
  );
}
