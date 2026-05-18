import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface InlineAuditCTAProps {
  variant: 'hero' | 'pattern-detail';
}

export function InlineAuditCTA({ variant }: InlineAuditCTAProps) {
  if (variant === 'hero') {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-6 py-4 rounded-2xl bg-background-primary/60 border border-border-primary/30">
          <div className="flex items-center gap-2">
            <BeakerIcon className="w-5 h-5 text-accent-primary" />
            <p className="text-text-secondary text-sm sm:text-base">
              <span className="font-semibold text-text-primary">New:</span> Audit your AI interface against 36 patterns
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 bg-accent-primary text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Try the Audit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent-subtle/50 border border-accent-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
      <BeakerIcon className="w-8 h-8 text-accent-primary flex-shrink-0" />
      <div className="flex-1 text-center sm:text-left">
        <p className="font-semibold text-text-primary">Check if your product already has this pattern</p>
        <p className="text-sm text-text-secondary mt-1">
          Upload a screenshot. We&apos;ll tell you which of the 36 patterns your AI interface uses and where the gaps are.
        </p>
      </div>
      <Link
        href="/"
        className="px-5 py-2.5 bg-accent-primary text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap"
      >
        Audit My Design
      </Link>
    </div>
  );
}
