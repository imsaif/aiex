'use client';

import {
  ArrowRightIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const PRODUCT_TYPES = [
  { id: 'web-app', label: 'Web Application' },
  { id: 'mobile-app', label: 'Mobile App' },
  { id: 'desktop', label: 'Desktop Software' },
  { id: 'website', label: 'Website' },
  { id: 'extension', label: 'Browser Extension' },
  { id: 'other', label: 'Other' },
];

interface RightWizardProps {
  selectedProductType: string | null;
  onProductTypeChange: (type: string) => void;
  onContinue: () => void;
  canContinue: boolean;
  isAnalyzing?: boolean;
}

export function RightWizard({
  selectedProductType,
  onProductTypeChange,
  onContinue,
  canContinue,
  isAnalyzing = false,
}: RightWizardProps) {
  // Calculate progress
  const hasProductType = !!selectedProductType;
  const progress = hasProductType ? 17 : 0;

  return (
    <aside className="w-[360px] h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CogIcon className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-text-primary">AI Assistant Setup</h2>
        </div>
        <p className="text-base text-text-secondary">Help us understand your design</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-text-tertiary mb-2">
          <span>Step 1 of 6</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        <h3 className="text-base font-medium text-text-primary mb-1">What type of product is this?</h3>
        <p className="text-sm text-text-secondary mb-4">
          Help us understand what <span className="text-accent-primary">you&apos;re building</span>
        </p>

        <div className="space-y-2">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onProductTypeChange(type.id)}
              disabled={isAnalyzing}
              className={`
                w-full px-4 py-3.5 text-left rounded-xl border transition-all
                ${selectedProductType === type.id
                  ? 'border-accent-primary bg-accent-subtle text-text-primary'
                  : 'border-border-primary bg-background-primary hover:border-border-secondary hover:bg-background-secondary text-text-secondary'
                }
                ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-base">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-6 mt-auto">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || isAnalyzing}
          className={`
            w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-base transition-all
            ${canContinue && !isAnalyzing
              ? 'bg-accent-primary text-white hover:bg-accent-hover'
              : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              Continue
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
