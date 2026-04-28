'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ScreenshotUpload } from '@/components/audit/ScreenshotUpload';
import { SocialProof } from '@/components/audit/SocialProof';
import { DEMO_ANALYSIS_RESULTS, DEMO_SCREENSHOT_FALLBACK } from '@/data/demo-audit';
import { RemainingAuditsBanner } from '@/components/audit/RemainingAuditsBanner';
import { useAuditCount } from '@/hooks/useAuditCount';
import { FREE_AUDIT_LIMIT } from '@/lib/audit/constants';
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

export default function AuditClient() {
  // Multi-step flow state — landing on the demo result, then upload, then real results
  const [step, setStep] = useState<AuditStep>('demo');
  const [productType, setProductType] = useState<ProductType | null>(null);

  // Existing state — preload demo so the landing paints a real result
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([{
    base64: DEMO_SCREENSHOT_FALLBACK,
    fileName: 'demo-chat-interface.png',
    deviceType: 'desktop',
  }]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(DEMO_ANALYSIS_RESULTS);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Paywall state
  const { auditCount, incrementAuditCount, isPaywalled, auditsRemaining } = useAuditCount();
  const [showPaywall, setShowPaywall] = useState(false);
  const hasAutoOpenedPaywallRef = useRef(false);

  // User clicked "Start your own audit" on the landing demo — drop into upload
  const handleStartRealAudit = useCallback(() => {
    setIsDemoMode(false);
    setAnalysisResults(null);
    setUploadedImages([]);
    setProductType(null);
    setStep('screenshot');
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

  // Handle clear/reset — "Run Another Audit" returns to upload (not the demo)
  const handleClear = useCallback(() => {
    setUploadedImages([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setIsDemoMode(false);
    setStep('screenshot');
    setProductType(null);
  }, []);

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
      trackAuditEvent('audit_demo_viewed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {isIntakeFlow && (
        <section className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-canvas-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
        <section className="bg-[#F0F1F5] dark:bg-[#162036] bg-canvas-grid">
          <FullPageResults
            results={analysisResults}
            onNewAudit={handleClear}
            isAnalyzing={isAnalyzing}
            isDemoMode={isDemoMode}
            screenshotUrl={uploadedImages[0]?.base64}
            screenshotDeviceType={uploadedImages[0]?.deviceType}
            screenshots={uploadedImages.map((img) => ({ url: img.base64, deviceType: img.deviceType }))}
            onStartRealAudit={step === 'demo' ? handleStartRealAudit : undefined}
          />
        </section>
      )}

      {/* SEO content + community block — only on the demo landing */}
      {step === 'demo' && <SocialProof />}
    </div>
  );
}
