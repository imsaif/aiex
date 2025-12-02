'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WelcomeModal } from '@/components/audit/WelcomeModal';
import { ResultsPanel } from '@/components/audit/ResultsPanel';
import { CenterUpload } from '@/components/audit/CenterUpload';
import { SocialProof } from '@/components/audit/SocialProof';
import { ResizablePanels } from '@/components/audit/ResizablePanels';
import { AnalysisPreviewPanel } from '@/components/audit/AnalysisPreviewPanel';
import { UsageLimitModal } from '@/components/audit/UsageLimitModal';
import type { AnalysisResults, DeviceType } from '@/types/audit';

export default function AuditPage() {
  // State
  const [auditStarted, setAuditStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [detectedDeviceType, setDetectedDeviceType] = useState<DeviceType>('desktop');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Handle image upload - immediately start analysis
  const handleImageUpload = useCallback(async (base64: string, fileName: string, deviceType: DeviceType) => {
    setUploadedImage(base64);
    setUploadedFileName(fileName);
    setDetectedDeviceType(deviceType);
    setIsAnalyzing(true);
    setRateLimitError(null); // Clear any previous rate limit error

    try {
      // Use defaults - AI will detect interface type, chat can clarify later
      const context = {
        interfaceType: 'other' as const,
        mainConcern: 'usability' as const,
        userGoal: 'exploring-options' as const,
        deviceType: deviceType,
      };

      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          imageBase64: base64.split(',')[1], // Remove data:image prefix
          deviceType: deviceType,
        }),
      });

      const data = await response.json();

      // Handle rate limit error
      if (response.status === 429) {
        setRateLimitError(data.message || "You've used all your free analyses for today. Come back tomorrow!");
        setUploadedImage(null); // Clear the image since we can't analyze it
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResults(data as AnalysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
      // Don't alert - let chat handle errors gracefully
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Handle clear/reset
  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setUploadedFileName('');
    setDetectedDeviceType('desktop');
    setAnalysisResults(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Full-Page Canvas with Right Sidebar */}
        <div className="relative min-h-[500px] md:min-h-[600px] md:h-[calc(100vh-64px)] flex flex-col md:flex-row">
          {/* Dark Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

          {/* Welcome Modal - overlays above the fold only */}
          {!auditStarted && (
            <WelcomeModal onStartAudit={() => setAuditStarted(true)} />
          )}

          {/* Rate Limit Modal */}
          {rateLimitError && (
            <UsageLimitModal
              message={rateLimitError}
              onClose={() => setRateLimitError(null)}
            />
          )}

          {/* Mobile/Tablet Layout (below lg breakpoint) */}
          <div className="flex-1 relative z-10 p-4 md:p-6 flex flex-col gap-4 lg:hidden">
            {/* Upload Area */}
            <div className="flex-shrink-0 bg-background-primary rounded-2xl shadow-2xl overflow-hidden relative min-h-[300px] md:min-h-[400px]">
              {/* Grid Pattern on Canvas */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />
              <CenterUpload
                onImageUpload={handleImageUpload}
                onClear={handleClear}
                uploadedImage={uploadedImage}
                uploadedFileName={uploadedFileName}
                detectedDeviceType={detectedDeviceType}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Results Panel - Shows below upload on mobile */}
            {(isAnalyzing || analysisResults) && (
              <div className="flex-1 min-h-[400px]">
                <ResultsPanel
                  results={analysisResults}
                  onNewAudit={handleClear}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </div>

          {/* Desktop Layout - Resizable Panels (lg and above) */}
          <div className="flex-1 relative z-10 p-4 xl:p-6 hidden lg:block">
            <ResizablePanels
              leftPanel={
                <div className="h-full bg-background-primary rounded-2xl shadow-2xl overflow-hidden relative">
                  {/* Grid Pattern on Canvas */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Dot Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />

                  {/* Center Upload Area / Image Display */}
                  <CenterUpload
                    onImageUpload={handleImageUpload}
                    onClear={handleClear}
                    uploadedImage={uploadedImage}
                    uploadedFileName={uploadedFileName}
                    detectedDeviceType={detectedDeviceType}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              }
              rightPanel={
                (isAnalyzing || analysisResults) ? (
                  <ResultsPanel
                    results={analysisResults}
                    onNewAudit={handleClear}
                    isAnalyzing={isAnalyzing}
                  />
                ) : (
                  <AnalysisPreviewPanel />
                )
              }
              defaultRightWidth={480}
              minRightWidth={380}
              maxRightWidthPercent={0.6}
              preferWiderPanel={detectedDeviceType === 'mobile'}
            />
          </div>
        </div>

        {/* Social Proof & Promotions */}
        <SocialProof />
      </div>
      <Footer />
    </>
  );
}
