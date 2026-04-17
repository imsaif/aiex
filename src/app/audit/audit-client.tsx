'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { AnchorQuestion } from '@/components/audit/AnchorQuestion';
import { ScreenshotUpload } from '@/components/audit/ScreenshotUpload';
import { RemainingAuditsBanner } from '@/components/audit/RemainingAuditsBanner';
import { useAuditCount } from '@/hooks/useAuditCount';
import { FREE_AUDIT_LIMIT } from '@/lib/audit/constants';
import type { AnalysisResults, AuditStep, ProductType } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';

// Lazy load heavy components that aren't needed on initial paint

const FullPageResults = dynamic(
  () => import('@/components/audit/FullPageResults').then(mod => ({ default: mod.FullPageResults })),
  { ssr: false }
);

const UsageLimitModal = dynamic(
  () => import('@/components/audit/UsageLimitModal').then(mod => ({ default: mod.UsageLimitModal })),
  { ssr: false }
);

const PaywallModal = dynamic(
  () => import('@/components/audit/PaywallModal').then(mod => ({ default: mod.PaywallModal })),
  { ssr: false }
);

export default function AuditClient() {
  // Multi-step flow state
  const [step, setStep] = useState<AuditStep>('product-type');
  const [productType, setProductType] = useState<ProductType | null>(null);

  // Existing state
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Paywall state
  const { auditCount, incrementAuditCount, isPaywalled, auditsRemaining } = useAuditCount();
  const [showPaywall, setShowPaywall] = useState(false);
  const hasAutoOpenedPaywallRef = useRef(false);

  // Handle demo mode — lazy-load demo data only when triggered
  const handleStartDemo = useCallback(async () => {
    const { DEMO_ANALYSIS_RESULTS, DEMO_SCREENSHOT_FALLBACK } = await import('@/data/demo-audit');
    setIsDemoMode(true);
    setStep('results');
    setUploadedImages([{
      base64: DEMO_SCREENSHOT_FALLBACK,
      fileName: 'demo-chat-interface.png',
      deviceType: 'desktop',
    }]);
    setAnalysisResults(DEMO_ANALYSIS_RESULTS);
  }, []);

  // Run analysis against the API
  const runAnalysis = useCallback(async (images: UploadedImage[]) => {
    setIsAnalyzing(true);
    setRateLimitError(null);

    try {
      const primaryDeviceType = images[0].deviceType;

      const context = {
        interfaceType: 'other' as const,
        mainConcern: 'usability' as const,
        userGoal: 'exploring-options' as const,
        deviceType: primaryDeviceType,
      };

      const imagesPayload = images.map(img => ({
        base64: img.base64.split(',')[1],
        deviceType: img.deviceType,
      }));

      const response = await fetch('/api/patterns/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          imageBase64: imagesPayload[0].base64,
          images: imagesPayload,
          deviceType: primaryDeviceType,
          productType,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setRateLimitError(data.message || "You've used all your free analyses for today. Come back tomorrow!");
        setUploadedImages([]);
        setStep('screenshot');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResults(data as AnalysisResults);
      incrementAuditCount();
      trackAuditEvent('audit_session_completed', {
        score: data.score,
        productType,
        gapsFound: data.topGaps?.length || 0,
      });

      // Track individual gaps found
      if (data.topGaps) {
        for (const gap of data.topGaps) {
          trackAuditEvent('audit_gap_found', {
            pattern: gap.pattern,
            status: gap.status,
            productType,
          });
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setStep('screenshot');
    } finally {
      setIsAnalyzing(false);
    }
  }, [productType, incrementAuditCount]);

  // Handle analyze from ScreenshotUpload — user clicked "Analyze"
  const handleScreenshotUpload = useCallback(async (images: UploadedImage[]) => {
    // Check paywall before running analysis
    if (isPaywalled) {
      setShowPaywall(true);
      return;
    }

    setUploadedImages(images);
    setStep('results');
    await runAnalysis(images);
  }, [isPaywalled, runAnalysis]);

  // Handle clear/reset — go back to step 1
  const handleClear = useCallback(() => {
    setUploadedImages([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setIsDemoMode(false);
    setStep('product-type');
    setProductType(null);
  }, []);

  // Determine if we're in the intake flow or results view
  const isIntakeFlow = step !== 'results';

  // Hide server-rendered SocialProof during results view
  useEffect(() => {
    const el = document.getElementById('audit-social-proof');
    if (el) el.style.display = isIntakeFlow ? '' : 'none';
  }, [isIntakeFlow]);

  // Hide server-rendered intake hero once user advances past product-type step
  useEffect(() => {
    const el = document.getElementById('audit-intake-hero');
    if (el) el.style.display = step === 'product-type' ? '' : 'none';
  }, [step]);

  // Auto-open the paywall modal once per mount for returning exhausted users
  useEffect(() => {
    if (
      !hasAutoOpenedPaywallRef.current &&
      isPaywalled &&
      step === 'product-type' &&
      !isDemoMode
    ) {
      hasAutoOpenedPaywallRef.current = true;
      setShowPaywall(true);
    }
  }, [isPaywalled, step, isDemoMode]);

  // Keep the server-rendered chip in sync with localStorage-backed count
  useEffect(() => {
    const chipEl = document.getElementById('audit-intake-chip');
    if (!chipEl) return;
    if (auditCount >= FREE_AUDIT_LIMIT) {
      chipEl.style.display = 'none';
      return;
    }
    chipEl.style.display = '';
    if (auditCount === 0) {
      chipEl.textContent =
        FREE_AUDIT_LIMIT === 1
          ? 'Claim your free audit'
          : `Claim your ${FREE_AUDIT_LIMIT} free audits`;
    } else {
      chipEl.textContent = `${auditsRemaining} free audit${auditsRemaining === 1 ? '' : 's'} left`;
    }
  }, [auditCount, auditsRemaining]);

  // Show nudge/banner conditions
  const oneRemaining = FREE_AUDIT_LIMIT > 1 && auditCount === FREE_AUDIT_LIMIT - 1;
  const showIntakeBanner = oneRemaining && isIntakeFlow;

  return (
    <div className={isIntakeFlow ? '' : 'min-h-screen'}>
      {/* Rate Limit Modal */}
      {rateLimitError && (
        <UsageLimitModal
          message={rateLimitError}
          onClose={() => setRateLimitError(null)}
        />
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          auditCountAtTrigger={auditCount}
          onClose={() => setShowPaywall(false)}
        />
      )}

      {isIntakeFlow ? (
        <>
          {/* INTAKE FLOW — cards + dynamic steps. Hero chip/H1/subtitle rendered server-side in page.tsx. */}
          <section
            className={`${
              step === 'product-type'
                ? 'pt-4 sm:pt-6 md:pt-8'
                : 'pt-8 sm:pt-12 md:pt-16'
            } pb-8 sm:pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* "1 remaining" banner in intake flow */}
                {showIntakeBanner && (
                  <div className="mb-6 max-w-lg mx-auto">
                    <RemainingAuditsBanner auditsRemaining={auditsRemaining} />
                  </div>
                )}

                {/* Step 1: Product type selection (hero above is server-rendered) */}
                {step === 'product-type' && (
                  <div className="text-center max-w-5xl mx-auto">
                    <AnchorQuestion
                      onSelect={(type) => {
                        setProductType(type);
                        setStep('screenshot');
                        trackAuditEvent('audit_step_completed', { step: 'product-type', productType: type });
                      }}
                    />

                    {/* Demo link */}
                    <p className="mt-10 text-sm text-text-tertiary">
                      Just exploring?{' '}
                      <button onClick={handleStartDemo} className="underline hover:text-text-secondary transition-colors cursor-pointer">
                        Try the demo
                      </button>
                    </p>
                  </div>
                )}

                {/* Step 2: Screenshot upload with example preview */}
                {step === 'screenshot' && productType && (
                  <ScreenshotUpload
                    productType={productType}
                    onBack={() => setStep('product-type')}
                    onAnalyze={handleScreenshotUpload}
                  />
                )}
            </div>
          </section>
        </>
      ) : (
        /* RESULTS VIEW — Full-page layout */
        <section className="bg-[#F0F1F5] dark:bg-[#162036] bg-grain min-h-[80vh]">
          <FullPageResults
            results={analysisResults}
            onNewAudit={handleClear}
            isAnalyzing={isAnalyzing}
            isDemoMode={isDemoMode}
            screenshotUrl={uploadedImages[0]?.base64}
          />
        </section>
      )}
    </div>
  );
}
