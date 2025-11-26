'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, CheckBadgeIcon, BoltIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import type { ContextData } from '@/types/audit';

const analysisSteps = [
  { icon: MagnifyingGlassIcon, label: 'Detecting UI components' },
  { icon: CheckBadgeIcon, label: 'Checking pattern implementation' },
  { icon: BoltIcon, label: 'Evaluating user experience' },
  { icon: ChartBarIcon, label: 'Generating recommendations' },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const imageStr = sessionStorage.getItem('auditImage');

    if (!imageStr) {
      router.push('/audit');
      return;
    }

    // Create default context - AI will auto-detect interface type
    const context: ContextData = {
      interfaceType: 'other',
      mainConcern: 'usability',
      userGoal: 'General UX audit',
    };

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 1500);

    analyzePattern(context, imageStr);

    return () => clearInterval(stepInterval);
  }, [router]);

  const analyzePattern = async (context: ContextData, imageBase64: string) => {
    try {
      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          imageBase64: imageBase64.split(',')[1],
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const results = await response.json();
      sessionStorage.setItem('auditResults', JSON.stringify(results));

      setTimeout(() => {
        router.push(`/audit/results/${results.id}`);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">Analysis Failed</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push('/audit')}
            className="px-6 py-3 bg-accent-primary dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:scale-[1.02] transition-transform shadow-card"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-border-primary border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-8" />

        {/* Analyzing Text */}
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">
          Analyzing your interface...
        </h2>
        <p className="text-text-secondary mb-10">
          Checking patterns critical for your use case
        </p>

        {/* Steps */}
        <div className="max-w-sm mx-auto space-y-3">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-2xl transition-all ${
                  index < currentStep
                    ? 'bg-green-50 dark:bg-green-950/20 border-2 border-green-500'
                    : index === currentStep
                    ? 'bg-accent-subtle border-2 border-accent-primary dark:border-white'
                    : 'bg-transparent border-2 border-transparent'
                }`}
              >
                <div className="w-6 h-6 mr-3 text-text-primary">
                  <Icon className="w-full h-full" />
                </div>
                <div className="text-sm text-text-primary">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
