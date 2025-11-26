'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PatternCheckingPanel, type PatternStatus } from '@/components/audit/PatternCheckingPanel';
import type { AnalysisResults } from '@/types/audit';

const patternCategories = [
  { name: 'Trustworthy AI', count: 5, icon: ShieldCheckIcon, color: 'text-blue-500' },
  { name: 'Human Collaboration', count: 6, icon: CheckCircleIcon, color: 'text-green-500' },
  { name: 'Natural Interaction', count: 4, icon: SparklesIcon, color: 'text-purple-500' },
  { name: 'Safety & Prevention', count: 4, icon: ExclamationTriangleIcon, color: 'text-yellow-500' },
  { name: 'Adaptive Systems', count: 4, icon: ClockIcon, color: 'text-cyan-500' },
  { name: 'Privacy & Control', count: 2, icon: XCircleIcon, color: 'text-pink-500' },
];

// All pattern IDs for status tracking
const allPatternIds = [
  'confidence-visualization', 'error-recovery', 'explainable-ai', 'responsible-ai', 'safe-exploration',
  'augmented-creation', 'collaborative-ai', 'contextual-assistance', 'feedback-loops', 'graceful-handoff', 'human-in-the-loop',
  'context-switching', 'conversational-ui', 'multimodal-interaction', 'progressive-disclosure',
  'anti-manipulation', 'crisis-detection', 'session-degradation', 'vulnerable-user-protection',
  'adaptive-interfaces', 'ambient-intelligence', 'guided-learning', 'predictive-anticipation',
  'privacy-first', 'selective-memory',
  'intelligent-caching', 'progressive-enhancement',
  'universal-access',
];

// Feature flag for URL screenshot capture
const ENABLE_URL_CAPTURE = process.env.NEXT_PUBLIC_ENABLE_URL_CAPTURE === 'true';

export default function AuditPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkingPatternIndex, setCheckingPatternIndex] = useState(-1);
  const [patternStatuses, setPatternStatuses] = useState<Record<string, PatternStatus>>(() => {
    const initial: Record<string, PatternStatus> = {};
    allPatternIds.forEach(id => {
      initial[id] = 'ready';
    });
    return initial;
  });
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setSelectedFileName(file.name);

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      sessionStorage.setItem('auditImage', base64);

      // Start analysis on same page
      setIsAnalyzing(true);
      // Sequential animation and API call will be handled separately
    };

    reader.readAsDataURL(file);
  }, []);

  // Sequential checking animation
  useEffect(() => {
    if (!isAnalyzing) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < allPatternIds.length) {
        const patternId = allPatternIds[currentIndex];

        // Update current pattern to checking
        setPatternStatuses(prev => ({
          ...prev,
          [patternId]: 'checking',
        }));

        setCheckingPatternIndex(currentIndex);
        currentIndex++;
      } else {
        // All patterns checked, start API call
        clearInterval(interval);
        startAnalysis();
      }
    }, 150); // 150ms delay between each pattern

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Capture screenshot from URL
  const captureScreenshot = async () => {
    if (!url || isCapturing) return;

    setIsCapturing(true);
    setIsAnalyzing(true);

    try {
      // TODO: Call screenshot capture API endpoint
      // For now, this is a placeholder - you'll need to implement the backend
      const response = await fetch('/api/capture-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Screenshot capture failed');
      }

      const { imageBase64 } = await response.json();

      // Store the captured screenshot
      sessionStorage.setItem('auditImage', `data:image/png;base64,${imageBase64}`);

      // Continue with analysis (will be triggered by sequential animation)
    } catch (error) {
      console.error('Screenshot capture error:', error);
      setIsCapturing(false);
      setIsAnalyzing(false);
      alert('Failed to capture screenshot. Please try again or upload an image instead.');
    }
  };

  // Start API analysis
  const startAnalysis = async () => {
    const imageBase64 = sessionStorage.getItem('auditImage');
    if (!imageBase64) return;

    try {
      // Create default context
      const context = {
        interfaceType: 'other' as const,
        mainConcern: 'usability' as const,
        userGoal: 'General UX audit',
      };

      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          imageBase64: imageBase64.split(',')[1], // Remove data:image/png;base64, prefix
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const results: AnalysisResults = await response.json();

      // Update pattern statuses based on results
      const newStatuses: Record<string, PatternStatus> = {};
      Object.entries(results.patterns).forEach(([patternId, patternData]) => {
        if (patternData.status === 'well-implemented') {
          newStatuses[patternId] = 'success';
        } else if (patternData.status === 'weak') {
          newStatuses[patternId] = 'warning';
        } else {
          newStatuses[patternId] = 'error';
        }
      });

      setPatternStatuses(newStatuses);
      setAnalysisResults(results);

      // Save results to sessionStorage
      sessionStorage.setItem('auditResults', JSON.stringify(results));

      // Navigate to results page after a short delay
      setTimeout(() => {
        router.push(`/audit/results/${results.id}`);
      }, 1500);
    } catch (error) {
      console.error('Analysis error:', error);
      // Show error state in patterns
      const errorStatuses: Record<string, PatternStatus> = {};
      allPatternIds.forEach(id => {
        errorStatuses[id] = 'error';
      });
      setPatternStatuses(errorStatuses);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    noClick: true, // Disable default click behavior, we'll handle it manually
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary">
        <div className="max-w-[1600px] mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Main Content Area */}
            <div className="flex flex-col space-y-8">
              {/* Canvas Background */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-12 md:p-20 min-h-[800px] aspect-[16/10] flex flex-col items-center justify-center shadow-2xl">
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl" />

                {/* Content */}
                <div className="relative z-10 w-full max-w-xl">
                  {/* Upload Card - PostSpark Style */}
                  <div
                    {...getRootProps()}
                    className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl p-8"
                  >
                    <input {...getInputProps()} />

                    {/* Pill Tabs */}
                    <div className="flex gap-3 mb-6">
                      <button
                        type="button"
                        onClick={open}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-full font-medium text-base hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Select
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full font-medium text-base hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        Demo
                      </button>
                    </div>

                    {/* URL Input Field */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="website.com or link.."
                          className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                        <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={captureScreenshot}
                      disabled={!url || isCapturing}
                      className="w-full px-6 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white dark:text-slate-900 disabled:text-slate-500 rounded-full font-medium text-base transition-colors mb-6"
                    >
                      {isCapturing ? 'Capturing...' : 'Capture Website Screenshot'}
                    </button>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="font-medium">More</span>
                      </button>
                      <button
                        onClick={() => {
                          setUrl('');
                          setSelectedFileName('');
                        }}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Info - Below Canvas */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* What We Check */}
                <div className="p-3.5 rounded-lg bg-background-secondary border border-border-primary">
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    What We Check
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">28 patterns</span> across 8 categories
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">Priority ranking</span> for your interface
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">AI prompts</span> to fix issues
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Results */}
                <div className="p-3.5 rounded-lg bg-background-secondary border border-border-primary">
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    Your Results
                  </h3>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary dark:bg-white" />
                      UX Score (X/28)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary dark:bg-white" />
                      Top 3 issues
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary dark:bg-white" />
                      Copy-able prompts
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary dark:bg-white" />
                      Pattern guides
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary dark:bg-white" />
                      Full report
                    </div>
                  </div>
                </div>

                {/* Pattern Categories */}
                <div className="p-3.5 rounded-lg bg-background-secondary border border-border-primary">
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    Pattern Categories
                  </h3>
                  <div className="space-y-2">
                    {patternCategories.map((category, index) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Icon className={`w-3.5 h-3.5 ${category.color} flex-shrink-0`} />
                          <div className="flex-1 text-text-secondary truncate">
                            {category.name}
                          </div>
                          <div className="text-text-tertiary font-medium">
                            {category.count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Pattern Checking Panel */}
            <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-hidden">
              <PatternCheckingPanel
                patternStatuses={patternStatuses}
                checkingPatternIndex={checkingPatternIndex}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
