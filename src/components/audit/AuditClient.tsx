'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ScreenshotUpload } from '@/components/audit/ScreenshotUpload';
import { SocialProof } from '@/components/audit/SocialProof';
import { DEMO_ANALYSIS_RESULTS, DEMO_SCREENSHOT_FALLBACK } from '@/data/demo-audit';
import { RemainingAuditsBanner } from '@/components/audit/RemainingAuditsBanner';
import { useAuditCount } from '@/hooks/useAuditCount';
import type { AnalysisResults, AuditStep, ProductType } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';

// Lazy load heavy components that aren't needed on initial paint

// FullPageResults SSRs — it owns the H1 + dashboard mockup (LCP element) on the demo landing.
// Per CLAUDE.md Perf Issue #9 + #12: ssr:false on above-fold content empties the hero.
const FullPageResults = dynamic(
  () => import('@/components/audit/FullPageResults').then(mod => ({ default: mod.FullPageResults }))
);

const UsageLimitModal = dynamic(
  () => import('@/components/audit/UsageLimitModal').then(mod => ({ default: mod.UsageLimitModal })),
  { ssr: false }
);

const PaywallModal = dynamic(
  () => import('@/components/audit/PaywallModal').then(mod => ({ default: mod.PaywallModal })),
  { ssr: false }
);

interface AuditClientProps {
  /**
   * Where the flow starts. Default 'demo' (audit page landing). Pass
   * 'screenshot' to skip the demo and drop straight into upload — used by
   * the homepage hero tool-mode.
   */
  initialStep?: AuditStep;
  /** Render the SocialProof block under the demo. Default true. */
  showSocialProof?: boolean;
}

export default function AuditClient({
  initialStep = 'demo',
  showSocialProof = true,
}: AuditClientProps = {}) {
  // Multi-step flow state — landing on the demo result, then upload, then real results
  const [step, setStep] = useState<AuditStep>(initialStep);
  const [productType, setProductType] = useState<ProductType | null>(null);

  const startsOnDemo = initialStep === 'demo';

  // Existing state — preload demo so the landing paints a real result
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    startsOnDemo
      ? [{
          base64: DEMO_SCREENSHOT_FALLBACK,
          fileName: 'demo-chat-interface.png',
          deviceType: 'desktop',
        }]
      : []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(
    startsOnDemo ? DEMO_ANALYSIS_RESULTS : null
  );
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(startsOnDemo);

  // Paywall state
  const {
    auditCount,
    incrementAuditCount,
    isPaywalled,
    auditsRemaining,
    isUnlocked,
    markUnlocked,
    needsUnlock,
    atFinalCap,
  } = useAuditCount();
  const [showPaywall, setShowPaywall] = useState(false);
  const hasAutoOpenedPaywallRef = useRef(false);
  const paywallMode: 'unlock' | 'final' = atFinalCap ? 'final' : 'unlock';

  // User clicked "Start your own audit" on the landing demo — drop into upload
  const handleStartRealAudit = useCallback(() => {
    if (isPaywalled) {
      setShowPaywall(true);
      return;
    }
    setIsDemoMode(false);
    setAnalysisResults(null);
    setUploadedImages([]);
    setProductType(null);
    setStep('screenshot');
  }, [isPaywalled]);

  // Run analysis against the API
  const runAnalysis = useCallback(async (images: UploadedImage[]) => {
    // Sample-screenshot runs are preview-only — they let the user experience
    // the flow without burning a free-audit credit. Detected via the isSample
    // flag set by ScreenshotUpload.loadSample().
    const isSampleRun = images.some((img) => img.isSample);
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

      const role = typeof window !== 'undefined' ? window.localStorage.getItem('aiux:role') : null;

      const response = await fetch('/api/patterns/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          imageBase64: imagesPayload[0].base64,
          images: imagesPayload,
          deviceType: primaryDeviceType,
          productType,
          ...(role ? { role } : {}),
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
      // Only burn a free-audit credit when the run actually surfaced findings.
      // Empty runs (the audit returned no applicable gaps — usually because the
      // screenshot isn't an AI product surface) shouldn't count against the
      // user's free quota; the empty-state UX in FullPageResults nudges them
      // to try a different screenshot, which would otherwise hit the paywall.
      const gapsFound = data.topGaps?.length || 0;
      if (gapsFound > 0 && !isSampleRun) {
        incrementAuditCount();
        // Don't auto-fire the unlock modal here — let the user explore their
        // results first. The paywall will surface naturally when they attempt
        // a re-audit (handleClear / handleScreenshotUpload / handleStartRealAudit
        // all gate on isPaywalled), or on next homepage mount via the
        // returning-exhausted-user effect below.
      }
      trackAuditEvent('audit_session_completed', {
        score: data.score,
        productType,
        gapsFound,
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
    // Sample-screenshot runs bypass the paywall — they're preview-only and
    // don't burn a credit (handled in runAnalysis).
    const isSampleRun = images.some((img) => img.isSample);
    if (isPaywalled && !isSampleRun) {
      setShowPaywall(true);
      return;
    }

    setUploadedImages(images);
    setStep('results');
    await runAnalysis(images);
  }, [isPaywalled, runAnalysis]);

  // Handle clear/reset — "Run Another Audit" returns to upload (not the demo)
  const handleClear = useCallback(() => {
    if (isPaywalled) {
      setShowPaywall(true);
      return;
    }
    setUploadedImages([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setIsDemoMode(false);
    setStep('screenshot');
    setProductType(null);
  }, [isPaywalled]);

  // Determine if we're in the upload-intake step (only the upload screen renders the intake chrome)
  const isIntakeFlow = step === 'screenshot';
  const isResultsView = step === 'demo' || step === 'results';

  // Auto-open the paywall modal once per mount for returning exhausted users
  useEffect(() => {
    if (
      !hasAutoOpenedPaywallRef.current &&
      isPaywalled &&
      step === 'screenshot' &&
      !isDemoMode
    ) {
      hasAutoOpenedPaywallRef.current = true;
      setShowPaywall(true);
    }
  }, [isPaywalled, step, isDemoMode]);

  // Fire demo-viewed analytics once on mount when landing on demo
  useEffect(() => {
    if (step === 'demo') {
      trackAuditEvent('audit_demo_viewed', {
        source:
          typeof window !== 'undefined' && window.location.pathname === '/'
            ? 'homepage'
            : 'audit-page',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show nudge/banner conditions
  const oneRemaining = auditsRemaining === 1 && (isUnlocked ? auditCount >= 1 : false);
  const showIntakeBanner = oneRemaining && isIntakeFlow;

  return (
    <div className={step === 'demo' ? 'min-h-screen' : ''}>
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
          mode={paywallMode}
          auditCountAtTrigger={auditCount}
          onClose={() => setShowPaywall(false)}
          onUnlocked={markUnlocked}
        />
      )}

      {isIntakeFlow && (
        <section className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-dot-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Back to demo — visible whenever the user reached the
                intake from the demo screen (i.e., the canonical / flow). */}
            <div className="mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => {
                  setStep('demo');
                  setUploadedImages([{
                    base64: DEMO_SCREENSHOT_FALLBACK,
                    fileName: 'demo-chat-interface.png',
                    deviceType: 'desktop',
                  }]);
                  setAnalysisResults(DEMO_ANALYSIS_RESULTS);
                  setIsDemoMode(true);
                  setProductType(null);
                }}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>
            </div>

            {showIntakeBanner && (
              <div className="mb-6 max-w-lg mx-auto">
                <RemainingAuditsBanner auditsRemaining={auditsRemaining} />
              </div>
            )}

            <ScreenshotUpload
              productType={productType}
              onProductTypeChange={(type) => {
                setProductType(type);
                trackAuditEvent('audit_step_completed', { step: 'product-type', productType: type });
              }}
              onAnalyze={handleScreenshotUpload}
            />
          </div>
        </section>
      )}

      {isResultsView && (
        <section className="bg-[#F0F1F5] dark:bg-[#162036] bg-dot-pattern">
          <FullPageResults
            results={analysisResults}
            onNewAudit={handleClear}
            isAnalyzing={isAnalyzing}
            isDemoMode={isDemoMode}
            screenshotUrl={uploadedImages[0]?.base64}
            screenshotDeviceType={uploadedImages[0]?.deviceType}
            screenshots={uploadedImages.map((img) => ({ url: img.base64, deviceType: img.deviceType }))}
            onStartRealAudit={step === 'demo' ? handleStartRealAudit : undefined}
            auditsRemaining={auditsRemaining}
            isPaywalled={isPaywalled}
            auditCount={auditCount}
            isUnlocked={isUnlocked}
          />
        </section>
      )}

      {/* SEO content + community block — only on the demo landing */}
      {step === 'demo' && showSocialProof && <SocialProof />}
    </div>
  );
}
