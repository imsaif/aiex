'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductType } from '@/types/audit';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ArrowLeftIcon, ArrowUpTrayIcon, PhotoIcon, XMarkIcon, PlusIcon, XCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { LetterGrade } from './LetterGrade';

const productTypeLabels: Record<ProductType, string> = {
  'chat-interface': 'conversational AI',
  'ai-agent': 'agentic products',
  'recommendation-system': 'recommendation systems',
  'content-generation': 'content generation tools',
  other: 'your product type',
};

// Sample audit previews per product type — shows what the user will get
const sampleAudits: Record<ProductType, {
  score: number;
  maxScore: number;
  product: string;
  findings: Array<{ pattern: string; status: 'missing' | 'needs-improvement' | 'good'; snippet: string }>;
}> = {
  'chat-interface': {
    score: 19,
    maxScore: 36,
    product: 'AI Chat Assistant',
    findings: [
      { pattern: 'Confidence Visualization', status: 'missing', snippet: 'No confidence indicators on AI responses' },
      { pattern: 'Error Recovery', status: 'needs-improvement', snippet: 'Basic error messages but no retry path' },
      { pattern: 'Conversational UI', status: 'good', snippet: 'Clear chat bubble design with turn-taking' },
    ],
  },
  'ai-agent': {
    score: 14,
    maxScore: 36,
    product: 'AI Task Agent',
    findings: [
      { pattern: 'Intent Preview', status: 'missing', snippet: 'Agent acts without showing planned actions' },
      { pattern: 'Autonomy Spectrum', status: 'needs-improvement', snippet: 'No graduated autonomy levels visible' },
      { pattern: 'Action Audit Trail', status: 'good', snippet: 'Clear log of completed agent actions' },
    ],
  },
  'recommendation-system': {
    score: 22,
    maxScore: 36,
    product: 'AI Recommendation Engine',
    findings: [
      { pattern: 'Explainable AI', status: 'missing', snippet: 'No reasoning shown for recommendations' },
      { pattern: 'Feedback Loops', status: 'needs-improvement', snippet: 'Like/dislike but no refinement controls' },
      { pattern: 'Progressive Disclosure', status: 'good', snippet: 'Complexity revealed gradually' },
    ],
  },
  'content-generation': {
    score: 20,
    maxScore: 36,
    product: 'AI Content Generator',
    findings: [
      { pattern: 'Human-in-the-Loop', status: 'missing', snippet: 'No edit or review controls on output' },
      { pattern: 'Safe Exploration', status: 'needs-improvement', snippet: 'No undo or version history visible' },
      { pattern: 'Augmented Creation', status: 'good', snippet: 'AI assists without replacing the creator' },
    ],
  },
  other: {
    score: 18,
    maxScore: 36,
    product: 'AI-Powered Product',
    findings: [
      { pattern: 'Confidence Visualization', status: 'missing', snippet: 'No uncertainty indicators for AI outputs' },
      { pattern: 'Explainable AI', status: 'needs-improvement', snippet: 'Limited transparency into reasoning' },
      { pattern: 'Contextual Assistance', status: 'good', snippet: 'Help relevant to current task context' },
    ],
  },
};

const statusConfig = {
  missing: { label: 'Critical', icon: XCircleIcon, className: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40' },
  'needs-improvement': { label: 'Warning', icon: ExclamationTriangleIcon, className: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40' },
  good: { label: 'Good', icon: CheckCircleIcon, className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40' },
};

interface ScreenshotUploadProps {
  productType: ProductType;
  onBack: () => void;
  onAnalyze: (images: UploadedImage[]) => void;
}

function detectDeviceType(width: number, height: number): 'mobile' | 'desktop' {
  const aspectRatio = height / width;
  return aspectRatio > 1.2 ? 'mobile' : 'desktop';
}

export function ScreenshotUpload({ productType, onBack, onAnalyze }: ScreenshotUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedImages, setStagedImages] = useState<UploadedImage[]>([]);
  const [limitMessage, setLimitMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showLimitMessage = useCallback(() => {
    setLimitMessage(true);
    setTimeout(() => setLimitMessage(false), 2500);
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const promises = validFiles.map(
      (file) =>
        new Promise<UploadedImage>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const img = new Image();
            img.onload = () => {
              resolve({
                base64,
                fileName: file.name,
                deviceType: detectDeviceType(img.naturalWidth, img.naturalHeight),
              });
            };
            img.src = base64;
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((newImages) => {
      setStagedImages((prev) => {
        const merged = [...prev, ...newImages].slice(0, 4);
        if (prev.length >= 4) showLimitMessage();
        return merged;
      });
    });
  }, [showLimitMessage]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeImage = (index: number) => {
    setStagedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (!files || files.length === 0) return;
      const hasImages = Array.from(files).some(f => f.type.startsWith('image/'));
      if (!hasImages) return;
      e.preventDefault();
      processFiles(files);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const hasImages = stagedImages.length > 0;
  const canAddMore = stagedImages.length < 4;
  const sample = sampleAudits[productType];

  return (
    <div className="w-full max-w-6xl mx-auto text-left">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-base text-text-tertiary mb-6 hover:text-text-primary transition-colors cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

        {/* LEFT — Upload area */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-text-primary">Now let&apos;s audit yours</h2>
          <p className="text-text-secondary mb-8 text-base">
            Upload a screenshot and we&apos;ll check it against the patterns most critical for {productTypeLabels[productType]}.
          </p>

          {/* Staged image previews */}
          {hasImages && (
            <>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {stagedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.base64}
                      alt={img.fileName}
                      className="w-36 h-36 object-cover rounded-xl border-2 border-border-primary"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-status-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded-md capitalize">
                      {img.deviceType}
                    </span>
                  </div>
                ))}

                {canAddMore ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-36 h-36 border-2 border-dashed border-border-primary rounded-xl flex flex-col items-center justify-center gap-1 hover:border-accent-primary hover:bg-accent-primary/5 transition-all cursor-pointer"
                  >
                    <PlusIcon className="w-6 h-6 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary">Add more</span>
                  </button>
                ) : (
                  <div className="w-36 h-36 border-2 border-dashed border-border-primary/50 rounded-xl flex flex-col items-center justify-center gap-1 opacity-50">
                    <span className="text-xs text-text-tertiary">4/4 max</span>
                  </div>
                )}
              </div>

              {limitMessage && (
                <p className="text-sm text-amber-600 dark:text-amber-400 animate-fade-in mb-2">
                  Maximum 4 screenshots reached. Remove one to add another.
                </p>
              )}
            </>
          )}

          {/* Drop zone */}
          {!hasImages && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 cursor-pointer transition-all ${
                isDragOver
                  ? 'border-accent-primary bg-accent-primary/5 shadow-md'
                  : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-accent-primary text-white' : 'bg-accent-primary/10'
                }`}>
                  {isDragOver ? (
                    <ArrowUpTrayIcon className="w-7 h-7" />
                  ) : (
                    <PhotoIcon className="w-7 h-7 text-accent-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-base">
                    {isDragOver ? 'Drop to upload' : 'Drop your screenshot here'}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">or click to browse or paste from clipboard</p>
                </div>
                <p className="text-xs text-text-tertiary">PNG, JPG, or WebP &middot; up to 4 images &middot; Ctrl+V to paste</p>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              processFiles(e.target.files);
              if (e.target) e.target.value = '';
            }}
          />

          {/* Analyze button */}
          {hasImages && (
            <button
              onClick={() => onAnalyze(stagedImages)}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-full font-semibold text-base hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer"
            >
              <SparklesIcon className="w-5 h-5" />
              Analyze {stagedImages.length} {stagedImages.length === 1 ? 'Screenshot' : 'Screenshots'}
            </button>
          )}
        </div>

        {/* RIGHT — Example audit preview */}
        <div className="rounded-2xl border border-border-primary bg-background-primary p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary mb-5">Example audit result</p>

          {/* Mini grade */}
          <div className="flex items-center gap-5 mb-6">
            <LetterGrade score={sample.score} maxScore={sample.maxScore} size="sm" />
            <div>
              <p className="font-semibold text-text-primary">{sample.product}</p>
              <p className="text-sm text-text-secondary mt-0.5">Checked against {sample.maxScore} AI UX patterns</p>
            </div>
          </div>

          {/* Sample findings */}
          <div className="space-y-3">
            {sample.findings.map((f) => {
              const config = statusConfig[f.status];
              const Icon = config.icon;
              return (
                <div key={f.pattern} className="flex items-start gap-3 py-2.5 border-t border-border-primary/50 first:border-0 first:pt-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 mt-0.5 ${config.className}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">{f.pattern}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{f.snippet}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border-primary/50">
            <p className="text-xs text-text-tertiary text-center">
              Plus quick wins, detailed recommendations, and AI chat to help you fix issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
