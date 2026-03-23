'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import {
  PhotoIcon,
  MagnifyingGlassCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CenterUpload } from '@/components/audit/CenterUpload';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { FloatingResultsSidebar } from '@/components/audit/FloatingResultsSidebar';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';
import type { AnalysisResults } from '@/types/audit';

// Lazy load heavy components that aren't needed on initial paint
const SocialProof = dynamic(
  () => import('@/components/audit/SocialProof').then(mod => ({ default: mod.SocialProof })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-background-primary" />,
  }
);

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
  // State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [chatTrigger, setSidebarExpandTrigger] = useState(0);

  const hasImages = uploadedImages.length > 0;
  const hasResults = !!(isAnalyzing || analysisResults);

  // Handle demo mode — lazy-load demo data only when triggered
  const handleStartDemo = useCallback(async () => {
    const { DEMO_ANALYSIS_RESULTS, DEMO_SCREENSHOT_FALLBACK } = await import('@/data/demo-audit');
    setIsDemoMode(true);
    setUploadedImages([{
      base64: DEMO_SCREENSHOT_FALLBACK,
      fileName: 'demo-chat-interface.png',
      deviceType: 'desktop',
    }]);
    setAnalysisResults(DEMO_ANALYSIS_RESULTS);
  }, []);

  // Handle images upload — just stage them, no analysis yet
  const handleImagesUpload = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
    setShowDeviceFrame(true);
  }, []);

  // Start analysis — triggered by user clicking "Analyze"
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
  }, [uploadedImages]);

  // Handle clear/reset
  const handleClear = useCallback(() => {
    setUploadedImages([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setIsDemoMode(false);
    setShowDeviceFrame(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Full-Page Canvas */}
      {/* dvh accounts for Chrome's dynamic address bar; vh is the fallback */}
      <div className="relative h-[calc(100vh-64px)] h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-hidden">
        {/* Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

        {/* Rate Limit Modal */}
        {rateLimitError && (
          <UsageLimitModal
            message={rateLimitError}
            onClose={() => setRateLimitError(null)}
          />
        )}

        {/* Canvas Area */}
        <div className="relative z-10 h-full p-4 xl:p-6">
          <div className="h-full bg-background-primary rounded-2xl shadow-2xl overflow-clip relative">
            {/* Grid Pattern on Canvas */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Center Upload / Image Display */}
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
            >
              {/* Marketing pitch — visible only before upload */}
              <div className="mt-6 w-full max-w-3xl space-y-4">
                {/* Trust badge */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary/80">
                    <ShieldCheckIcon className="w-5 h-5 text-text-primary dark:text-white" />
                    <span className="text-base text-text-secondary">
                      <span className="font-semibold text-text-primary dark:text-white">36 patterns</span> from{' '}
                      <span className="font-semibold text-text-primary dark:text-white">50+ products</span>
                    </span>
                  </div>
                </div>

                {/* Logo Carousel — prominent, right after heading */}
                <div className="overflow-hidden">
                  <CompanyLogoCarousel
                    companies={companyLogos}
                    size="sm"
                    duration={80}
                    gap="lg"
                    className="py-2"
                  />
                </div>

                {/* How It Works steps */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 !mt-8">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background-secondary/60">
                    <PhotoIcon className="w-5 h-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">Upload</span>
                  </div>
                  <span className="text-text-tertiary hidden sm:inline">→</span>
                  <span className="text-text-tertiary sm:hidden">↓</span>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background-secondary/60">
                    <MagnifyingGlassCircleIcon className="w-5 h-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">Analyze</span>
                  </div>
                  <span className="text-text-tertiary hidden sm:inline">→</span>
                  <span className="text-text-tertiary sm:hidden">↓</span>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background-secondary/60">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">Get Insights</span>
                  </div>
                </div>
              </div>
            </CenterUpload>

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

      {/* Social Proof & Promotions */}
      <SocialProof />
    </div>
  );
}
