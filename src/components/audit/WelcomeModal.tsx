'use client';

import {
  BeakerIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';

interface WelcomeModalProps {
  onStartAudit: () => void;
}

export function WelcomeModal({ onStartAudit }: WelcomeModalProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
      {/* Backdrop - subtle blur, background still visible */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Modal Content - wider with more breathing room */}
      <div className="relative bg-background-primary rounded-3xl shadow-2xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BeakerIcon className="w-7 h-7 text-accent-primary" />
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--text-hero)' }}>AI UX Design Audit</h2>
          </div>
          <p className="text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
            We analyze your design against 28 research-backed AI/UX patterns derived from the world&apos;s best products.
          </p>
        </div>

        {/* Logo Carousel - gentle, subtle with padding on sides */}
        <div className="mb-8 mx-6 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background-primary to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background-primary to-transparent z-10" />
          <CompanyLogoCarousel
            companies={companyLogos}
            size="xs"
            duration={80}
            gap="lg"
            className="py-3"
          />
        </div>

        {/* Value Proposition - 3 Column Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="text-center p-5 rounded-2xl bg-background-secondary/50">
            <ExclamationTriangleIcon className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-2">The Problem</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Most AI products fail because of poor UX, not bad AI.</p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-background-secondary/50">
            <MagnifyingGlassIcon className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-2">The Solution</h3>
            <p className="text-sm text-text-secondary leading-relaxed">We analyze against 28 patterns from world-class AI products.</p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-background-secondary/50">
            <CheckCircleIcon className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-2">The Result</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Get actionable feedback to ship better AI experiences.</p>
          </div>
        </div>

        {/* Start Audit CTA */}
        <button
          type="button"
          onClick={onStartAudit}
          className="w-full px-8 py-4 bg-accent-primary text-white text-lg font-semibold rounded-full hover:bg-accent-hover hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg cursor-pointer"
        >
          Start Audit
        </button>

        {/* Footer note */}
        <p className="text-sm text-text-tertiary text-center mt-5">
          Upload a screenshot and get instant AI-powered feedback
        </p>
      </div>
    </div>
  );
}
