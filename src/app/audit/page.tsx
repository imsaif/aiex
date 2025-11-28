'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LeftSidebar } from '@/components/audit/LeftSidebar';
import { RightWizard } from '@/components/audit/RightWizard';
import { ResultsPanel } from '@/components/audit/ResultsPanel';
import { CenterUpload } from '@/components/audit/CenterUpload';
import { SocialProof } from '@/components/audit/SocialProof';
import type { AnalysisResults } from '@/types/audit';

export default function AuditPage() {
  // State
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  // Can continue when both product type is selected AND image is uploaded
  const canContinue = !!selectedProductType && !!uploadedImage;

  // Handle image upload
  const handleImageUpload = useCallback((base64: string, fileName: string) => {
    setUploadedImage(base64);
    setUploadedFileName(fileName);
  }, []);

  // Handle clear/reset
  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setUploadedFileName('');
    setAnalysisResults(null);
    setSelectedProductType(null);
    setIsAnalyzing(false);
  }, []);

  // Handle continue/analyze
  const handleContinue = useCallback(async () => {
    if (!canContinue || !uploadedImage) return;

    setIsAnalyzing(true);

    try {
      // Map product type to interface type
      const interfaceTypeMap: Record<string, string> = {
        'web-app': 'other',
        'mobile-app': 'other',
        'desktop': 'other',
        'website': 'other',
        'extension': 'other',
        'other': 'other',
      };

      const context = {
        interfaceType: interfaceTypeMap[selectedProductType || 'other'] as 'chatbot' | 'content' | 'code' | 'image' | 'analytics' | 'other',
        mainConcern: 'usability' as const,
        userGoal: 'exploring-options' as const,
      };

      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          imageBase64: uploadedImage.split(',')[1], // Remove data:image prefix
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const results: AnalysisResults = await response.json();

      // Set results in state (no navigation)
      setAnalysisResults(results);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  }, [canContinue, uploadedImage, selectedProductType]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Full-Page Canvas with Floating Sidebars */}
        <div className="relative min-h-[600px] lg:h-[calc(100vh-64px)] flex">
          {/* Dark Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

          {/* Left Sidebar */}
          <div className="hidden lg:flex relative z-20 p-6">
            <LeftSidebar />
          </div>

          {/* White Canvas Area - Center */}
          <div className="flex-1 relative z-10 py-6">
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
              />
            </div>
          </div>

          {/* Right Sidebar - Wizard or Results */}
          <div className="hidden lg:flex relative z-20 p-6">
            {analysisResults ? (
              <ResultsPanel
                results={analysisResults}
                onNewAudit={handleClear}
              />
            ) : (
              <RightWizard
                selectedProductType={selectedProductType}
                onProductTypeChange={setSelectedProductType}
                onContinue={handleContinue}
                canContinue={canContinue}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        </div>

        {/* Social Proof & Promotions */}
        <SocialProof />
      </div>
      <Footer />
    </>
  );
}
