'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductType } from '@/types/audit';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ArrowLeftIcon, ArrowUpTrayIcon, PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const productTypeLabels: Record<ProductType, string> = {
  'chat-interface': 'conversational AI',
  'ai-agent': 'agentic products',
  'recommendation-system': 'recommendation systems',
  'content-generation': 'content generation tools',
  other: 'your product type',
};

interface ScreenshotUploadProps {
  productType: ProductType;
  productDescription: string;
  onBack: () => void;
  onAnalyze: (images: UploadedImage[]) => void;
}

function detectDeviceType(width: number, height: number): 'mobile' | 'desktop' {
  const aspectRatio = height / width;
  return aspectRatio > 1.2 ? 'mobile' : 'desktop';
}

export function ScreenshotUpload({ productType, productDescription, onBack, onAnalyze }: ScreenshotUploadProps) {
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

  // Listen for paste events on the document so Cmd+V works anywhere on this step
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

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-base text-text-tertiary mb-8 hover:text-text-primary transition-colors cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-3xl font-semibold mb-3 text-text-primary">Upload your screenshot</h2>
      <p className="text-text-secondary mb-10 text-base">
        We&apos;ll check your <strong className="text-text-primary">{productDescription}</strong> against the
        patterns most critical for {productTypeLabels[productType]}.
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

            {/* Add more button or limit reached */}
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

          {/* Flash message when user tries to add beyond limit */}
          {limitMessage && (
            <p className="text-sm text-amber-600 dark:text-amber-400 animate-fade-in mb-2">
              Maximum 4 screenshots reached. Remove one to add another.
            </p>
          )}
        </>
      )}

      {/* Drop zone — show full size when no images, compact when images staged */}
      {!hasImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-16 cursor-pointer transition-all ${
            isDragOver
              ? 'border-accent-primary bg-accent-primary/5 shadow-md'
              : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-accent-primary text-white' : 'bg-accent-primary/10'
            }`}>
              {isDragOver ? (
                <ArrowUpTrayIcon className="w-8 h-8" />
              ) : (
                <PhotoIcon className="w-8 h-8 text-accent-primary" />
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

      {/* Hidden file input (shared) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          processFiles(e.target.files);
          // Reset so same file can be re-selected
          if (e.target) e.target.value = '';
        }}
      />

      {/* Analyze button — only when images are staged */}
      {hasImages && (
        <button
          onClick={() => onAnalyze(stagedImages)}
          className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-accent-primary text-white rounded-full font-semibold text-base hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer"
        >
          <SparklesIcon className="w-5 h-5" />
          Analyze {stagedImages.length} {stagedImages.length === 1 ? 'Screenshot' : 'Screenshots'}
        </button>
      )}
    </div>
  );
}
