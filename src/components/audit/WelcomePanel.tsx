'use client';

import {
  BeakerIcon,
  ArrowLeftIcon,
  PhotoIcon,
  MagnifyingGlassCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';

/**
 * Welcome panel for the audit tool - shows intro content in the right panel
 * before the user uploads a screenshot.
 */
export function WelcomePanel() {
  return (
    <aside className="w-full h-full flex-shrink-0 p-4 xl:p-6 bg-white dark:bg-background-primary rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
      {/* Header Container */}
      <div className="p-6 rounded-2xl bg-background-grain border border-border-primary/50 mb-4">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BeakerIcon className="w-7 h-7 text-text-primary dark:text-white" />
            <h2 className="text-2xl font-extrabold text-text-primary dark:text-white">
              AI UX Design Audit
            </h2>
          </div>
          <p className="text-base text-text-secondary leading-relaxed">
            Get expert feedback on your AI interface in seconds
          </p>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 py-2.5 px-4 rounded-full bg-white/80 dark:bg-white/10">
          <ShieldCheckIcon className="w-4 h-4 text-text-primary dark:text-white" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary dark:text-white">36 patterns</span> from{' '}
            <span className="font-semibold text-text-primary dark:text-white">50+ products</span>
          </p>
        </div>

        {/* Logo Carousel */}
        <div className="overflow-hidden">
          <CompanyLogoCarousel
            companies={companyLogos}
            size="xs"
            duration={80}
            gap="lg"
            className="py-1"
          />
        </div>
      </div>

      {/* How It Works - Contained Box */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto min-h-0">
        <div className="p-6 rounded-2xl bg-background-grain border border-border-primary/50">
          <h3 className="text-base font-semibold text-text-tertiary mb-6 uppercase tracking-wide text-center">How It Works</h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-white/80 dark:bg-white/10">
              <div className="w-16 h-16 rounded-xl bg-accent-primary/10 dark:bg-white/10 flex items-center justify-center mb-3">
                <PhotoIcon className="w-8 h-8 text-text-primary dark:text-white" />
              </div>
              <p className="text-base font-semibold text-text-primary dark:text-white mb-1">Upload</p>
              <p className="text-sm text-text-secondary">Any AI screenshot</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-white/80 dark:bg-white/10">
              <div className="w-16 h-16 rounded-xl bg-accent-primary/10 dark:bg-white/10 flex items-center justify-center mb-3">
                <MagnifyingGlassCircleIcon className="w-8 h-8 text-text-primary dark:text-white" />
              </div>
              <p className="text-base font-semibold text-text-primary dark:text-white mb-1">Auto-Analyze</p>
              <p className="text-sm text-text-secondary">36 UX patterns instantly</p>
            </div>

            {/* Step 3 - spans full width */}
            <div className="col-span-2 flex flex-col items-center text-center p-5 rounded-xl bg-white/80 dark:bg-white/10">
              <div className="w-16 h-16 rounded-xl bg-accent-primary/10 dark:bg-white/10 flex items-center justify-center mb-3">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-text-primary dark:text-white" />
              </div>
              <p className="text-base font-semibold text-text-primary dark:text-white mb-1">Get Insights</p>
              <p className="text-sm text-text-secondary">Pattern-aware AI design agent to guide your design direction</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA at bottom */}
      <div className="pt-6 mt-4 border-t border-border-primary">
        <div className="flex items-center justify-center gap-3 text-text-primary dark:text-white">
          <ArrowLeftIcon className="w-5 h-5" />
          <p className="text-base font-medium">
            Upload a screenshot to get started
          </p>
        </div>
      </div>
    </aside>
  );
}
