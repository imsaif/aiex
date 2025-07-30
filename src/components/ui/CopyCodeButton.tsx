'use client';

import React, { useState, useCallback } from 'react';
import { trackEvent } from '../../utils/analytics';

interface CopyCodeButtonProps {
  code: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'standalone' | 'floating';
  showCode?: boolean;
}

export default function CopyCodeButton({ 
  code, 
  onClick, 
  className = '',
  size = 'md',
  variant = 'inline',
  showCode = true
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      setError(false);
      
      // Track analytics
      trackEvent('copy_code', { 
        codeLength: code.length,
        timestamp: Date.now()
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
    } catch (err) {
      console.warn('Failed to copy code:', err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    
    // Call external onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  }, [code, onClick]);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
      code: 'text-xs'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      icon: 'h-4 w-4',
      code: 'text-sm'
    },
    lg: {
      button: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
      code: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Button content
  const buttonContent = (
    <>
      {copied ? (
        <svg className={`${currentSize.icon} mr-1 text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : error ? (
        <svg className={`${currentSize.icon} mr-1 text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className={`${currentSize.icon} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
      <span>
        {copied ? 'Copied!' : error ? 'Failed' : 'Copy'}
      </span>
    </>
  );

  // Standalone variant (just button)
  if (variant === 'standalone') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center ${currentSize.button} font-medium rounded-md transition-colors ${
          copied 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : error
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
        } ${className}`}
        title={copied ? 'Copied to clipboard!' : 'Copy code to clipboard'}
        disabled={copied || error}
      >
        {buttonContent}
      </button>
    );
  }

  // Floating variant (positioned absolute)
  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`absolute top-2 right-2 inline-flex items-center ${currentSize.button} font-medium rounded-md transition-all ${
          copied 
            ? 'bg-green-500 text-white shadow-md' 
            : error
            ? 'bg-red-500 text-white shadow-md'
            : 'bg-white/90 text-gray-700 hover:bg-white shadow-sm backdrop-blur-sm border border-gray-200'
        } ${className}`}
        title={copied ? 'Copied to clipboard!' : 'Copy code to clipboard'}
        disabled={copied || error}
      >
        {buttonContent}
      </button>
    );
  }

  // Inline variant (default - shows code with button)
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {showCode && (
        <div className={`text-gray-800 font-mono ${currentSize.code} p-3 whitespace-pre-wrap bg-gray-50 border-b border-gray-200`}>
          {code}
        </div>
      )}
      <div className="p-2 bg-white flex justify-between items-center">
        <span className={`text-gray-500 ${currentSize.code} font-mono`}>
          {code.split('\n').length} line{code.split('\n').length !== 1 ? 's' : ''} • {code.length} chars
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center ${currentSize.button} font-medium rounded transition-colors ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : error
              ? 'bg-red-100 text-red-700'
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
          title={copied ? 'Copied to clipboard!' : 'Copy code to clipboard'}
          disabled={copied || error}
        >
          {buttonContent}
        </button>
      </div>
    </div>
  );
} 