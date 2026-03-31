'use client';

import { useEffect } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface SaveReportNudgeProps {
  onSaveReport: () => void;
}

export function SaveReportNudge({ onSaveReport }: SaveReportNudgeProps) {
  useEffect(() => {
    trackAuditEvent('audit_save_nudge_shown');
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-accent-subtle border border-accent-primary/20 rounded-xl">
      <EnvelopeIcon className="w-5 h-5 text-accent-primary flex-shrink-0" />
      <p className="text-sm text-text-secondary flex-1">
        Want to keep this report?{' '}
        <button
          onClick={onSaveReport}
          className="font-medium text-accent-primary hover:text-accent-hover transition-colors underline underline-offset-2 cursor-pointer"
        >
          Save it to your email
        </button>
      </p>
    </div>
  );
}
