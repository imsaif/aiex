'use client';

import { useEffect, useCallback } from 'react';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import type { PatternResult } from '@/types/audit';
import { getPatternUrl } from '@/utils/pattern-links';
import { patterns as allPatternsData } from '@/data/patterns';

interface PatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  pattern: (PatternResult & { id: string }) | null;
}

// Get full pattern data from the patterns data file
function getFullPatternData(patternId: string) {
  return allPatternsData.find(p => p.id === patternId || p.slug === patternId);
}

// Get examples for a pattern
function getPatternExamples(patternId: string) {
  const pattern = getFullPatternData(patternId);
  if (!pattern) return [];
  return (pattern.content?.examples || [])
    .filter(ex => ex.image || ex.imagePath)
    .slice(0, 4)
    .map(ex => ({
      ...ex,
      image: ex.image || ex.imagePath,
    }));
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircleIcon; text: string; className: string }> = {
    'well-implemented': {
      icon: CheckCircleIcon,
      text: 'Well Implemented',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    'weak': {
      icon: ExclamationTriangleIcon,
      text: 'Needs Improvement',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    'missing': {
      icon: XCircleIcon,
      text: 'Missing',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    'not-applicable': {
      icon: XMarkIcon,
      text: 'Not Applicable',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    },
  };

  const { icon: Icon, text, className } = config[status] || config['not-applicable'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      <Icon className="w-4 h-4" />
      {text}
    </span>
  );
}

export function PatternModal({ isOpen, onClose, pattern }: PatternModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !pattern) return null;

  const fullPatternData = getFullPatternData(pattern.id);
  const examples = getPatternExamples(pattern.id);
  const patternUrl = getPatternUrl(pattern.id);
  // Guidelines can be strings or objects with title property
  const guidelines = (fullPatternData?.content?.guidelines || []) as Array<string | { title: string }>;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl bg-background-primary rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border-primary">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  {pattern.name}
                </h2>
                <StatusBadge status={pattern.status} />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-text-tertiary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Description */}
              {fullPatternData?.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-2">
                    About This Pattern
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {fullPatternData.description}
                  </p>
                </div>
              )}

              {/* Evidence from Audit */}
              {pattern.evidence && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-2">
                    What We Found
                  </h3>
                  <p className="text-text-primary leading-relaxed bg-background-secondary p-4 rounded-lg">
                    {pattern.evidence}
                  </p>
                </div>
              )}

              {/* Improvement Suggestion */}
              {pattern.improvement && (pattern.status === 'weak' || pattern.status === 'missing') && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-2">
                    Recommendation
                  </h3>
                  <div className="p-4 bg-accent-subtle rounded-lg border border-accent-primary/20">
                    <p className="text-accent-primary font-medium">{pattern.improvement}</p>
                  </div>
                </div>
              )}

              {/* Real-World Examples */}
              {examples.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                    Real-World Examples
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {examples.map((example, index) => (
                      <div
                        key={index}
                        className="border border-border-primary rounded-lg overflow-hidden bg-background-secondary"
                      >
                        {example.image && (
                          <div className="h-24 overflow-hidden bg-background-tertiary relative">
                            <Image
                              src={example.image}
                              alt={example.altText || example.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="text-sm font-semibold text-text-primary">
                            {example.title}
                          </div>
                          <div className="text-xs text-text-secondary line-clamp-2 mt-1">
                            {example.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidelines Preview */}
              {guidelines.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-2">
                    Key Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {guidelines.slice(0, 3).map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircleIcon className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                        <span>{typeof guideline === 'string' ? guideline : guideline.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border-primary bg-background-secondary rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Close
              </button>
              {patternUrl && (
                <Link
                  href={patternUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  View Full Pattern Guide
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
