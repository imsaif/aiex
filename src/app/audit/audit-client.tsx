'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CenterUpload } from '@/components/audit/CenterUpload';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { FloatingResultsSidebar } from '@/components/audit/FloatingResultsSidebar';
import { AnchorQuestion } from '@/components/audit/AnchorQuestion';
import { BranchedFollowUp } from '@/components/audit/BranchedFollowUp';
import { ScreenshotUpload } from '@/components/audit/ScreenshotUpload';
import { SaveReportNudge } from '@/components/audit/SaveReportNudge';
import { RemainingAuditsBanner } from '@/components/audit/RemainingAuditsBanner';
import { useAuditCount } from '@/hooks/useAuditCount';
import { FREE_AUDIT_LIMIT } from '@/lib/audit/constants';
import type { AnalysisResults, AuditStep, ProductType } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';

// Lazy load heavy components that aren't needed on initial paint

const ResultsPanel = dynamic(
  () => import('@/components/audit/ResultsPanel').then(mod => ({ default: mod.ResultsPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-background-primary rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    ),
  }
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
  const [productDescription, setProductDescription] = useState('');
  const [aiRole, setAiRole] = useState<string[]>([]);

  // Existing state
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [chatTrigger, setSidebarExpandTrigger] = useState(0);

  // Paywall state
  const { auditCount, incrementAuditCount, isPaywalled, auditsRemaining } = useAuditCount();
  const [showPaywall, setShowPaywall] = useState(false);
  const [emailReportTrigger, setEmailReportTrigger] = useState(0);

  const hasResults = !!(isAnalyzing || analysisResults);

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
          productDescription,
          aiRole,
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
  }, [productType, productDescription, aiRole, incrementAuditCount]);

  // Handle analyze from ScreenshotUpload — user clicked "Analyze"
  const handleScreenshotUpload = useCallback(async (images: UploadedImage[]) => {
    // Check paywall before running analysis
    if (isPaywalled) {
      setShowPaywall(true);
      return;
    }

    setUploadedImages(images);
    setShowDeviceFrame(true);
    setStep('results');
    await runAnalysis(images);
  }, [isPaywalled, runAnalysis]);

  // Handle images upload from CenterUpload (results view — adding more images)
  const handleImagesUpload = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
    setShowDeviceFrame(true);
  }, []);

  // Start analysis — triggered by user clicking "Analyze" in results view
  const handleStartAnalysis = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    // Check paywall before running analysis
    if (isPaywalled) {
      setShowPaywall(true);
      return;
    }

    await runAnalysis(uploadedImages);
  }, [uploadedImages, isPaywalled, runAnalysis]);

  // Handle clear/reset — go back to step 1
  const handleClear = useCallback(() => {
    setUploadedImages([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setIsDemoMode(false);
    setShowDeviceFrame(true);
    setStep('product-type');
    setProductType(null);
    setProductDescription('');
    setAiRole([]);
  }, []);

  // Determine if we're in the intake flow (steps 1-3) or results view
  const isIntakeFlow = step !== 'results';

  // Hide server-rendered SocialProof during results view (full-screen canvas)
  useEffect(() => {
    const el = document.getElementById('audit-social-proof');
    if (el) el.style.display = isIntakeFlow ? '' : 'none';
  }, [isIntakeFlow]);

  // Hide server-rendered intake hero once user advances past product-type step
  useEffect(() => {
    const el = document.getElementById('audit-intake-hero');
    if (el) el.style.display = step === 'product-type' ? '' : 'none';
  }, [step]);

  // Update server-rendered chip text once localStorage-backed count is known
  useEffect(() => {
    const chipEl = document.getElementById('audit-intake-chip');
    if (!chipEl) return;
    const limitLabel = `${FREE_AUDIT_LIMIT} free audit${FREE_AUDIT_LIMIT === 1 ? '' : 's'}`;
    const remainingLabel = `audit${auditsRemaining === 1 ? '' : 's'} remaining`;
    chipEl.textContent =
      auditCount > 0
        ? `${auditsRemaining} of ${FREE_AUDIT_LIMIT} free ${remainingLabel}`
        : `${limitLabel} included`;
  }, [auditCount, auditsRemaining]);

  // Show nudge/banner conditions (only for real audits, not demos)
  // "1 remaining" state only exists when there's more than one free audit; at threshold=1 the paywall is the nudge.
  const oneRemaining = FREE_AUDIT_LIMIT > 1 && auditCount === FREE_AUDIT_LIMIT - 1;
  const showSaveNudge = !isDemoMode && analysisResults && oneRemaining;
  const showRemainingBanner = !isDemoMode && analysisResults && oneRemaining;
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
              <div className="text-center max-w-5xl mx-auto">
                {/* "1 remaining" banner in intake flow */}
                {showIntakeBanner && (
                  <div className="mb-6 max-w-lg mx-auto">
                    <RemainingAuditsBanner auditsRemaining={auditsRemaining} />
                  </div>
                )}

                {/* Step 1: Product type selection (hero above is server-rendered) */}
                {step === 'product-type' && (
                  <>
                    <AnchorQuestion
                      onSelect={(type) => {
                        setProductType(type);
                        setStep('product-detail');
                      }}
                    />

                    {/* Demo link */}
                    <p className="mt-10 text-sm text-text-tertiary">
                      Just exploring?{' '}
                      <button onClick={handleStartDemo} className="underline hover:text-text-secondary transition-colors cursor-pointer">
                        Try the demo
                      </button>
                    </p>
                  </>
                )}

                {/* Step 2: Product details */}
                {step === 'product-detail' && productType && (
                  <BranchedFollowUp
                    productType={productType}
                    onBack={() => setStep('product-type')}
                    onContinue={(desc, roles) => {
                      setProductDescription(desc);
                      setAiRole(roles);
                      setStep('screenshot');
                      trackAuditEvent('audit_step_completed', { step: 'screenshot', productType });
                    }}
                  />
                )}

                {/* Step 3: Screenshot upload */}
                {step === 'screenshot' && productType && (
                  <ScreenshotUpload
                    productType={productType}
                    productDescription={productDescription}
                    onBack={() => setStep('product-detail')}
                    onAnalyze={handleScreenshotUpload}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Social Proof rendered server-side in page.tsx for SEO */}
        </>
      ) : (
        /* RESULTS VIEW — Full-screen canvas with dark gradient */
        <div className="relative h-[calc(100vh-64px)] h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-hidden">
          {/* Dark Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

          {/* Canvas Area */}
          <div className="relative z-10 h-full p-2 sm:p-4 xl:p-6">
            <div className="h-full bg-background-primary rounded-2xl shadow-2xl overflow-clip relative">
              {/* Grid Pattern on Canvas */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

              <CenterUpload
                onImagesUpload={handleImagesUpload}
                onStartAnalysis={handleStartAnalysis}
                onOpenChat={() => setSidebarExpandTrigger(t => t + 1)}
                onClear={handleClear}
                onStartDemo={handleStartDemo}
                uploadedImages={uploadedImages}
                isAnalyzing={isAnalyzing}
                hasResults={hasResults}
                showDeviceFrame={showDeviceFrame}
                onToggleFrame={() => setShowDeviceFrame(!showDeviceFrame)}
                sidebarOpen={hasResults}
              />

              {/* Floating Results Sidebar */}
              <FloatingResultsSidebar isVisible={hasResults} expandTrigger={chatTrigger}>
                {/* Nudge/Banner above results */}
                {(showSaveNudge || showRemainingBanner) && (
                  <div className="px-4 pt-4 space-y-2">
                    {showRemainingBanner && (
                      <RemainingAuditsBanner auditsRemaining={auditsRemaining} />
                    )}
                    {showSaveNudge && (
                      <SaveReportNudge onSaveReport={() => setEmailReportTrigger(t => t + 1)} />
                    )}
                  </div>
                )}
                <ResultsPanel
                  results={analysisResults}
                  onNewAudit={handleClear}
                  isAnalyzing={isAnalyzing}
                  isDemoMode={isDemoMode}
                  chatTrigger={chatTrigger}
                  emailReportTrigger={emailReportTrigger}
                />
              </FloatingResultsSidebar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
