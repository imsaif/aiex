'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CourseMetadataBarProps {
  lastUpdated?: string;
  progressPercentage?: number;
  onShare?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function CourseMetadataBar({
  lastUpdated,
  progressPercentage = 0,
  onShare,
  onSave,
  isSaved = false,
}: CourseMetadataBarProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share to clipboard
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4 px-6 bg-surface-secondary/50 rounded-lg border border-border-primary mb-8">
      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-text-secondary"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-sm text-text-secondary">Updated {formatDate(lastUpdated)}</span>
        </div>
      )}

      {/* Progress Percentage */}
      {progressPercentage > 0 && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-accent-primary">{Math.round(progressPercentage)}% complete</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Save Button */}
      <button
        onClick={onSave}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
          isSaved
            ? 'bg-accent-primary/10 text-accent-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary'
        }`}
        title="Save course"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Save
      </button>

      {/* Share Button */}
      <motion.button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-primary transition-all text-sm font-medium"
        whileTap={{ scale: 0.95 }}
        title="Share course"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {showCopied ? 'Copied!' : 'Share'}
      </motion.button>
    </div>
  );
}
