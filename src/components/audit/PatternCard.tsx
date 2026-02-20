import type { PatternResult, ContextData } from '@/types/audit';
import type { Example } from '@/types';
import { getContextSpecificDescription } from '@/lib/patterns/detection-prompts';

interface PatternCardProps {
  pattern: PatternResult;
  context: ContextData;
  examples?: Example[];
  onImplementationClick?: () => void;
}

const statusColors = {
  'well-implemented': {
    border: 'border-l-4 border-l-green-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-400 border border-green-200 dark:border-green-800',
  },
  weak: {
    border: 'border-l-4 border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  missing: {
    border: 'border-l-4 border-l-red-500',
    bg: 'bg-red-50 dark:bg-red-950/20',
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-400 border border-red-200 dark:border-red-800',
  },
};

const statusIcons = {
  'well-implemented': '✅',
  weak: '⚠️',
  missing: '❌',
};

const statusLabels = {
  'well-implemented': 'Well Implemented',
  weak: 'Needs Improvement',
  missing: 'Missing',
};

const priorityLabels = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export function PatternCard({ pattern, context, examples = [], onImplementationClick }: PatternCardProps) {
  const colors = statusColors[pattern.status];
  const contextDescription = getContextSpecificDescription(pattern.id, context);

  return (
    <div
      className={`bg-surface-primary border-2 border-border-primary rounded-2xl p-6 transition-all hover:shadow-card ${colors.border}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-text-primary">{pattern.name}</h3>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
            {statusIcons[pattern.status]} {statusLabels[pattern.status]}
          </span>
          {pattern.priority === 'high' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background-tertiary border border-border-primary text-text-primary">
              {priorityLabels[pattern.priority]}
            </span>
          )}
        </div>
      </div>

      {/* Context-specific description */}
      {contextDescription && (
        <div className="mb-4 p-3 bg-background-secondary rounded-xl border border-border-primary">
          <div className="text-sm font-semibold text-text-primary mb-1">
            Why this matters for {context.interfaceType} interfaces:
          </div>
          <div className="text-sm text-text-secondary">{contextDescription}</div>
        </div>
      )}

      {/* Evidence */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-text-secondary mb-1">Analysis:</div>
        <p className="text-text-primary">{pattern.evidence}</p>
      </div>

      {/* Improvement suggestion */}
      {pattern.improvement && (
        <div className={`mb-4 p-3 rounded-xl border ${colors.border} ${colors.bg}`}>
          <div className="text-sm font-semibold text-text-primary mb-1">💡 Quick Fix:</div>
          <p className="text-sm text-text-secondary">{pattern.improvement}</p>
        </div>
      )}

      {/* Product Examples */}
      {examples.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-text-secondary mb-3">
            {pattern.status === 'well-implemented'
              ? '✨ You\'re implementing this like:'
              : '📚 See how leading products do this:'}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {examples.map((example, index) => (
              <a
                key={index}
                href={`/patterns/${pattern.id}`}
                className="group block border border-border-primary rounded-xl overflow-hidden bg-background-secondary hover:border-accent-primary transition-all hover:scale-[1.02]"
              >
                {example.image && (
                  <div className="h-24 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={example.image}
                      alt={example.altText || example.title}
                      width={400}
                      height={96}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-2">
                  <div className="text-sm font-semibold text-text-primary truncate">
                    {example.title}
                  </div>
                  <div className="text-xs text-text-secondary line-clamp-1">
                    {example.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {pattern.status !== 'well-implemented' && (
          <button
            onClick={onImplementationClick}
            className="flex-1 px-4 py-2 bg-accent-primary dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:scale-[1.02] transition-transform text-sm shadow-card"
          >
            See Implementation Guide
          </button>
        )}
        <a
          href={`/patterns/${pattern.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 border-2 border-border-primary rounded-xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-center text-sm"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
