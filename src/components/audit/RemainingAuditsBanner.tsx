'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface RemainingAuditsBannerProps {
  auditsRemaining: number;
}

export function RemainingAuditsBanner({ auditsRemaining }: RemainingAuditsBannerProps) {
  useEffect(() => {
    trackAuditEvent('audit_remaining_banner_shown');
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-status-warning/10 border border-status-warning/20 rounded-xl">
      <ExclamationTriangleIcon className="w-5 h-5 text-status-warning flex-shrink-0" />
      <p className="text-sm text-text-secondary">
        <span className="font-medium text-text-primary">
          {auditsRemaining} free audit{auditsRemaining !== 1 ? 's' : ''} remaining
        </span>
        {' '}— after that, you&apos;ll need a Pro plan to continue.
      </p>
    </div>
  );
}
