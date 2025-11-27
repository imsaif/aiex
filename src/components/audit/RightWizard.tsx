'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';

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
  const currentStep = 1;
  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <aside className="w-[350px] flex-shrink-0 p-6 border-l border-border-primary bg-background-primary h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
            <span className="text-white text-lg">✦</span>
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-lg">AI Assistant Setup</h2>
            <p className="text-sm text-text-secondary">Help us understand your design</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-text-tertiary">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1: Product Type */}
      <div className="flex-1">
        <h3 className="font-semibold text-text-primary mb-2">What type of product is this?</h3>
        <p className="text-sm text-text-secondary mb-4">Help us understand what you&apos;re building</p>

        <div className="space-y-2">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onProductTypeChange(type.id)}
              disabled={isAnalyzing}
              className={`
                w-full px-4 py-3 text-left rounded-xl border-2 transition-all
                ${selectedProductType === type.id
                  ? 'border-accent-primary bg-accent-subtle text-text-primary'
                  : 'border-border-primary bg-background-secondary text-text-secondary hover:border-border-secondary hover:bg-background-tertiary'
                }
                ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="font-medium">{type.label}</span>
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
            w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium transition-all
            ${canContinue && !isAnalyzing
              ? 'bg-accent-primary text-white hover:bg-accent-hover'
              : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin">⟳</span>
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
