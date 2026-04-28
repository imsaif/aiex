'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductType } from '@/types/audit';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { productOptions } from './productOptions';
import { trackAuditEvent } from '@/lib/audit/analytics';

const productTypeLabels: Record<ProductType, string> = {
  'chat-interface': 'conversational AI',
  'ai-agent': 'agentic products',
  'recommendation-system': 'recommendation systems',
  'content-generation': 'content generation tools',
  other: 'your product type',
};

interface ScreenshotUploadProps {
  productType: ProductType | null;
  onProductTypeChange: (productType: ProductType) => void;
  onAnalyze: (images: UploadedImage[]) => void;
}

function detectDeviceType(width: number, height: number): 'mobile' | 'desktop' {
  const aspectRatio = height / width;
  return aspectRatio > 1.2 ? 'mobile' : 'desktop';
}

function DeviceFrame({ src, alt, deviceType }: { src: string; alt: string; deviceType: 'mobile' | 'desktop' }) {
  if (deviceType === 'mobile') {
    return (
      <div className="relative h-full max-h-full flex items-center justify-center">
        <div className="relative h-full max-h-[600px] aspect-[9/19] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-10" />
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
            <img src={src} alt={alt} className="w-full h-full object-cover block" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden border border-border-primary bg-background-primary shadow-lg">
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-border-primary">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28C840' }} />
      </div>
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-900">
        <img src={src} alt={alt} className="w-full h-full object-contain block" />
      </div>
    </div>
  );
}

export function ScreenshotUpload({ productType, onProductTypeChange, onAnalyze }: ScreenshotUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedImages, setStagedImages] = useState<UploadedImage[]>([]);
  const [limitMessage, setLimitMessage] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasAutoClassifiedRef = useRef(false);
  const productTypeRef = useRef(productType);
  productTypeRef.current = productType;
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

      // Auto-classify product type from the first image — once per session,
      // only if user hasn't already picked one.
      if (!hasAutoClassifiedRef.current && !productTypeRef.current && newImages[0]) {
        hasAutoClassifiedRef.current = true;
        setIsClassifying(true);
        fetch('/api/audit/classify-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newImages[0].base64 }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data: { productType?: ProductType } | null) => {
            if (data?.productType && !productTypeRef.current) {
              onProductTypeChange(data.productType);
            }
          })
          .catch(() => { /* silent — user can still pick manually */ })
          .finally(() => setIsClassifying(false));
      }
    });
  }, [showLimitMessage, onProductTypeChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeImage = (index: number) => {
    setStagedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setActiveIndex((curr) => Math.max(0, Math.min(curr, next.length - 1)));
      return next;
    });
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
  const canAnalyze = hasImages && !!productType;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:gap-6 items-stretch">
        {/* LEFT: Dropzone / staged previews — matches demo screenshot canvas (880×660) */}
        <div className="w-full lg:w-[880px] lg:h-[660px] flex-shrink-0 flex flex-col">
          {hasImages ? (
            <div className="flex-1 flex flex-col gap-3">
              {/* Hero carousel — active image fills the canvas inside a device frame */}
              <div className="relative flex-1 min-h-0 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {stagedImages[activeIndex] && (
                    <DeviceFrame
                      src={stagedImages[activeIndex].base64}
                      alt={stagedImages[activeIndex].fileName}
                      deviceType={stagedImages[activeIndex].deviceType}
                    />
                  )}
                </div>

                {/* Carousel arrows — only when more than one image */}
                {stagedImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIndex((i) => (i - 1 + stagedImages.length) % stagedImages.length)}
                      aria-label="Previous screenshot"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveIndex((i) => (i + 1) % stagedImages.length)}
                      aria-label="Next screenshot"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full z-10">
                      {activeIndex + 1} / {stagedImages.length}
                    </div>
                  </>
                )}

                <button
                  onClick={() => removeImage(activeIndex)}
                  aria-label="Remove this screenshot"
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-status-error text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnail navigator + Add more */}
              {(stagedImages.length > 1 || canAddMore) && (
                <div className="flex-shrink-0 flex flex-wrap gap-2 items-center justify-center">
                  {stagedImages.map((img, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show screenshot ${index + 1}`}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isActive
                            ? 'border-accent-primary shadow-md scale-105'
                            : 'border-border-primary opacity-70 hover:opacity-100 hover:border-accent-primary/50'
                        }`}
                      >
                        <img
                          src={img.base64}
                          alt={img.fileName}
                          className="w-full h-full object-cover block"
                        />
                      </button>
                    );
                  })}

                  {canAddMore && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 border-2 border-dashed border-accent-primary/50 bg-background-primary rounded-lg flex flex-col items-center justify-center gap-0.5 text-accent-primary hover:border-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer shadow-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-[10px] font-medium">Add</span>
                    </button>
                  )}
                </div>
              )}

              {limitMessage && (
                <p className="text-sm text-amber-600 dark:text-amber-400 animate-fade-in text-center">
                  Maximum 4 screenshots reached. Remove one to add another.
                </p>
              )}
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[320px] border-2 border-dashed rounded-2xl p-8 sm:p-12 cursor-pointer transition-all flex items-center justify-center ${
                isDragOver
                  ? 'border-accent-primary bg-accent-primary/5 shadow-md'
                  : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-4 text-center">
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
        </div>

        {/* RIGHT: Product picker + Analyze */}
        <aside className="w-full lg:w-[360px] lg:h-[660px] flex-shrink-0 flex flex-col gap-4 text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-text-primary">Audit your interface</h2>
            <p className="text-text-secondary text-sm">
              {productType
                ? <>Upload a screenshot and we&apos;ll check it against the patterns most critical for {productTypeLabels[productType]}.</>
                : <>Pick your product type and upload a screenshot to get started.</>}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Product type</p>
            {isClassifying && (
              <span className="text-xs text-text-tertiary italic">Detecting…</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {productOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = productType === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    trackAuditEvent('audit_product_type_selected', { productType: option.id });
                    onProductTypeChange(option.id);
                  }}
                  className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-accent-primary bg-accent-primary text-white dark:text-gray-900'
                      : 'border-border-primary bg-background-primary text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={() => canAnalyze && onAnalyze(stagedImages)}
              disabled={!canAnalyze}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-full font-semibold text-base hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-primary"
            >
              {hasImages
                ? `Analyze ${stagedImages.length} ${stagedImages.length === 1 ? 'Screenshot' : 'Screenshots'}`
                : 'Analyze'}
            </button>
            {!canAnalyze && (
              <p className="mt-2 text-xs text-text-tertiary text-center">
                {!hasImages && !productType
                  ? 'Add a screenshot and pick a product type'
                  : !hasImages
                    ? 'Add a screenshot to enable analysis'
                    : 'Pick a product type to enable analysis'}
              </p>
            )}
          </div>
        </aside>
      </div>

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
    </div>
  );
}
