'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LeftSidebar } from '@/components/audit/LeftSidebar';
import { RightWizard } from '@/components/audit/RightWizard';
import { CenterUpload } from '@/components/audit/CenterUpload';
import type { AnalysisResults } from '@/types/audit';

export default function AuditPage() {
  const router = useRouter();

  // State
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Can continue when both product type is selected AND image is uploaded
  const canContinue = !!selectedProductType && !!uploadedImage;

  // Handle image upload
  const handleImageUpload = useCallback((base64: string, fileName: string) => {
    setUploadedImage(base64);
    setUploadedFileName(fileName);
    sessionStorage.setItem('auditImage', base64);
  }, []);

  // Handle URL capture
  const handleUrlCapture = useCallback(async (url: string) => {
    setIsCapturing(true);

    try {
      // Ensure URL has protocol
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `https://${url}`;
      }

      const response = await fetch('/api/capture-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl }),
      });

      if (!response.ok) {
        throw new Error('Screenshot capture failed');
      }

      const { imageBase64 } = await response.json();
      const base64WithPrefix = `data:image/png;base64,${imageBase64}`;

      setUploadedImage(base64WithPrefix);
      setUploadedFileName(url);
      sessionStorage.setItem('auditImage', base64WithPrefix);
    } catch (error) {
      console.error('Screenshot capture error:', error);
      alert('Failed to capture screenshot. Please try uploading an image instead.');
    } finally {
      setIsCapturing(false);
    }
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
        userGoal: 'General UX audit',
      };

      // Save context to session storage
      sessionStorage.setItem('auditContext', JSON.stringify(context));

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

      // Save results and redirect
      sessionStorage.setItem('auditResults', JSON.stringify(results));
      router.push(`/audit/results/${results.id}`);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  }, [canContinue, uploadedImage, selectedProductType, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary">
        {/* 3-Column Layout */}
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>

          {/* Center Upload Area */}
          <CenterUpload
            onImageUpload={handleImageUpload}
            onUrlCapture={handleUrlCapture}
            isCapturing={isCapturing}
            uploadedFileName={uploadedFileName}
          />

          {/* Right Wizard - Hidden on mobile */}
          <div className="hidden lg:block">
            <RightWizard
              selectedProductType={selectedProductType}
              onProductTypeChange={setSelectedProductType}
              onContinue={handleContinue}
              canContinue={canContinue}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
