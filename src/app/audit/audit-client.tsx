'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CenterUpload } from '@/components/audit/CenterUpload';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { FloatingResultsSidebar } from '@/components/audit/FloatingResultsSidebar';
import { AnchorQuestion } from '@/components/audit/AnchorQuestion';
import { BranchedFollowUp } from '@/components/audit/BranchedFollowUp';
import { ScreenshotUpload } from '@/components/audit/ScreenshotUpload';
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

  // Handle analyze from ScreenshotUpload — user clicked "Analyze"
  const handleScreenshotUpload = useCallback(async (images: UploadedImage[]) => {
    setUploadedImages(images);
    setShowDeviceFrame(true);
    setStep('results');
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

      const response = await fetch('/api/analyze-pattern', {
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
      trackAuditEvent('audit_session_completed', {
        score: data.score,
        productType,
        gapsFound: data.topGaps?.length || 0,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setStep('screenshot');
    } finally {
      setIsAnalyzing(false);
    }
  }, [productType, productDescription, aiRole]);

  // Handle images upload from CenterUpload (results view — adding more images)
  const handleImagesUpload = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
    setShowDeviceFrame(true);
  }, []);

  // Start analysis — triggered by user clicking "Analyze" in results view
  const handleStartAnalysis = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);
    setRateLimitError(null);

    try {
      const primaryDeviceType = uploadedImages[0].deviceType;

      const context = {
        interfaceType: 'other' as const,
        mainConcern: 'usability' as const,
        userGoal: 'exploring-options' as const,
        deviceType: primaryDeviceType,
      };

      const imagesPayload = uploadedImages.map(img => ({
        base64: img.base64.split(',')[1],
        deviceType: img.deviceType,
      }));

      const response = await fetch('/api/analyze-pattern', {
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
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResults(data as AnalysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImages, productType, productDescription, aiRole]);

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

  return (
    <div className={isIntakeFlow ? '' : 'min-h-screen'}>
      {/* Rate Limit Modal */}
      {rateLimitError && (
        <UsageLimitModal
          message={rateLimitError}
          onClose={() => setRateLimitError(null)}
        />
      )}

      {isIntakeFlow ? (
        <>
          {/* INTAKE FLOW — Standard site hero layout */}
          <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-4xl mx-auto">
                {/* Step 1: Hero with product type selection */}
                {step === 'product-type' && (
                  <>
                    {/* Info chip */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                        Free AI UX Audit
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6" style={{ color: 'var(--text-hero)' }}>
                      Free AI UX Audit Tool
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-12">
                      Score your AI interface against 36 proven design patterns. Select your product type to get started.
                    </p>

                    {/* Product type cards */}
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
          <div className="relative z-10 h-full p-4 xl:p-6">
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
                <ResultsPanel
                  results={analysisResults}
                  onNewAudit={handleClear}
                  isAnalyzing={isAnalyzing}
                  isDemoMode={isDemoMode}
                  chatTrigger={chatTrigger}
                />
              </FloatingResultsSidebar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
