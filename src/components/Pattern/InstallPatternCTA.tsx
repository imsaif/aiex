'use client';

import React, { useState, useCallback } from 'react';
import { CommandLineIcon } from '@heroicons/react/24/outline';

// Fire a Clarity custom event without going through trackAuditEvent (audit-namespaced)
// or trackEvent (localStorage). One-off pattern event; direct call keeps the wrappers clean.
declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}
function fireInstallPromptCopied(patternTitle: string) {
  if (typeof window === 'undefined' || !window.clarity) return;
  window.clarity('event', 'install_prompt_copied');
  window.clarity('set', 'pattern_title', patternTitle);
}

interface Props {
  patternTitle: string;
  installPrompt: string;
}

/**
 * Headless install-prompt card. Caller provides the surrounding <section> and
 * (typically) the section H2 so the parent can compose this side-by-side with
 * TakeawaysList under a shared "Take it into your own product" heading.
 */
export default function InstallPatternCTA({ patternTitle, installPrompt }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(installPrompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = installPrompt;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      fireInstallPromptCopied(patternTitle);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy install prompt:', err);
    }
  }, [installPrompt, patternTitle]);

  return (
    <div className="bg-surface-primary border-2 border-accent-primary/30 rounded-2xl overflow-hidden shadow-sm lg:sticky lg:top-24">
      <div className="p-6">
        <div className="text-xs font-semibold text-accent-primary uppercase tracking-wide mb-3">
          Apply with Claude Code
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
          Add {patternTitle} to your product
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          Copy the prompt below into Claude Code or Cursor in your repo. It encodes the four moves
          on the left and asks Claude to find your AI decision surfaces and update them. Claude
          reports what it changed and asks before adding dependencies.
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={copied}
          className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
            copied
              ? 'bg-status-success/10 text-status-success border-status-success/30'
              : 'bg-accent-primary text-white border-accent-primary hover:bg-accent-hover'
          }`}
          aria-label="Copy install prompt for Claude Code or Cursor"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied. Paste into Claude Code.
            </>
          ) : (
            <>
              <CommandLineIcon className="h-4 w-4" />
              Copy prompt for Claude Code
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowPrompt(s => !s)}
          aria-expanded={showPrompt}
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform ${showPrompt ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showPrompt ? 'Hide the prompt' : 'Inspect before you copy'}
        </button>
      </div>

      {showPrompt && (
        <div className="border-t border-primary bg-surface-secondary">
          <pre className="p-5 text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
            {installPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}
