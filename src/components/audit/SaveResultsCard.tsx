'use client';

import { useState } from 'react';
import { EnvelopeIcon, DocumentArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { AnalysisResults, PatternResult } from '@/types/audit';

interface SaveResultsCardProps {
  results: AnalysisResults;
  onCopy: () => void;
  copied: boolean;
}

// Generate text content for download
function generateDownloadContent(results: AnalysisResults): string {
  const allPatterns = Object.entries(results.patterns).map(([id, data]) => ({ ...data, id }));
  const missing = allPatterns.filter(p => p.status === 'missing');
  const weak = allPatterns.filter(p => p.status === 'weak');
  const good = allPatterns.filter(p => p.status === 'well-implemented');

  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════',
    '                    AI UX DESIGN AUDIT REPORT',
    '═══════════════════════════════════════════════════════════════',
    '',
    `Date: ${new Date().toLocaleDateString()}`,
    `Score: ${results.score}/${results.maxScore || 36} patterns detected`,
    '',
    results.componentDescription ? `Interface Type: ${results.componentDescription}` : '',
    '',
    '───────────────────────────────────────────────────────────────',
    '                         SUMMARY',
    '───────────────────────────────────────────────────────────────',
    '',
    results.summary || '',
    '',
  ];

  if (missing.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('                    MISSING PATTERNS');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('');
    missing.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.name} [${p.priority.toUpperCase()} PRIORITY]`);
      if (p.evidence) lines.push(`   Evidence: ${p.evidence}`);
      if (p.improvement) lines.push(`   Recommendation: ${p.improvement}`);
      lines.push('');
    });
  }

  if (weak.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('                   NEEDS IMPROVEMENT');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('');
    weak.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.name} [${p.priority.toUpperCase()} PRIORITY]`);
      if (p.evidence) lines.push(`   Evidence: ${p.evidence}`);
      if (p.improvement) lines.push(`   Recommendation: ${p.improvement}`);
      lines.push('');
    });
  }

  if (good.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('                   WELL IMPLEMENTED');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('');
    good.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.name}`);
      if (p.evidence) lines.push(`   Evidence: ${p.evidence}`);
      lines.push('');
    });
  }

  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push('Learn more about AI UX patterns: https://aiuxdesign.guide');
  lines.push('Run another audit: https://aiuxdesign.guide/audit');
  lines.push('');

  return lines.filter(Boolean).join('\n');
}

export function SaveResultsCard({ results, onCopy, copied }: SaveResultsCardProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'audit',
          website_url: '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Also trigger download after successful subscription
        handleDownload();
      } else {
        setStatus('error');
        setErrorMessage(data.error || data.message || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const handleDownload = () => {
    const content = generateDownloadContent(results);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-ux-audit-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-background-secondary to-background-secondary/50 border border-border-primary">
      <div className="flex items-center gap-2 mb-3">
        <DocumentArrowDownIcon className="w-5 h-5 text-text-primary" />
        <h3 className="text-base font-semibold text-text-primary">Save Your Results</h3>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 py-3 px-4 bg-status-success/10 rounded-lg">
          <CheckIcon className="w-5 h-5 text-status-success" />
          <span className="text-sm text-text-primary">Report downloaded! Check your email for AI UX tips.</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary mb-4">
            Get your audit report + daily AI UX insights delivered to your inbox.
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {/* Honeypot - hidden from real users */}
            <input
              type="text"
              name="website_url"
              value=""
              onChange={() => {}}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}
            />

            <div className="flex gap-2">
              <div className="relative flex-1">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={status === 'loading'}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-background-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2.5 text-sm font-medium bg-accent-primary text-white dark:text-gray-900 rounded-lg hover:bg-accent-hover disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {status === 'loading' ? 'Saving...' : 'Save & Download'}
              </button>
            </div>

            {status === 'error' && errorMessage && (
              <p className="text-xs text-status-error">{errorMessage}</p>
            )}
          </form>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-primary">
            <span className="text-xs text-text-tertiary">or</span>
            <button
              type="button"
              onClick={handleDownload}
              className="text-sm text-accent-primary hover:underline"
            >
              Download without email
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="text-sm text-accent-primary hover:underline"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
