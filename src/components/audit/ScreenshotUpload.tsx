'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductType } from '@/types/audit';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, ChartBarIcon, ExclamationTriangleIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { productOptions } from './productOptions';
import { trackAuditEvent } from '@/lib/audit/analytics';

const SAMPLE_SCREENSHOTS: Array<{
  label: string;
  fileName: string;
  src: string;
  productType: ProductType;
}> = [
  {
    label: 'Claude',
    fileName: 'claude-sample.png',
    src: '/images/examples/audit-samples/claudeclarifying.png',
    productType: 'chat-interface',
  },
  {
    label: 'ChatGPT',
    fileName: 'chatgpt-sample.png',
    src: '/images/examples/audit-samples/chatgpt-feedback.png',
    productType: 'chat-interface',
  },
  {
    label: 'Copilot',
    fileName: 'copilot-sample.png',
    src: '/images/examples/audit-samples/microsoft-copilot.png',
    productType: 'chat-interface',
  },
];

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

  const processFiles = useCallback((files: FileList | null, opts?: { isSample?: boolean }) => {
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
                isSample: opts?.isSample,
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

  const loadSample = useCallback(
    async (sample: typeof SAMPLE_SCREENSHOTS[number]) => {
      trackAuditEvent('audit_sample_screenshot_clicked', { label: sample.label });
      try {
        const res = await fetch(sample.src);
        if (!res.ok) return;
        const blob = await res.blob();
        const file = new File([blob], sample.fileName, { type: blob.type || 'image/png' });
        const dt = new DataTransfer();
        dt.items.add(file);
        // Skip auto-classification — sample's productType is known.
        hasAutoClassifiedRef.current = true;
        if (!productTypeRef.current) onProductTypeChange(sample.productType);
        processFiles(dt.files, { isSample: true });
      } catch {
        /* silent — user can still upload manually */
      }
    },
    [processFiles, onProductTypeChange]
  );

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
      {/* On mobile we flip the order so the product-type picker (in the aside)
          comes first, then the dropzone — matches the order users actually
          fill these in. Sticky bottom Analyze CTA replaces the inline button. */}
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center gap-4 lg:gap-6 items-stretch pb-24 lg:pb-0">
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
            <div className="flex-1 flex flex-col gap-4">
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
                    {isDragOver ? 'Drop to upload' : 'Drop your screenshots here'}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">or click to browse or paste from clipboard</p>
                </div>
                <p className="text-xs text-text-tertiary">PNG, JPG, or WebP &middot; up to 2 images &middot; Ctrl+V to paste</p>
              </div>
            </div>

            {/* Sample screenshots — one-click try for users without a screenshot ready */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Or try a sample</span>
                <span className="flex-1 h-px bg-border-primary" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_SCREENSHOTS.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => loadSample(sample)}
                    className="group relative aspect-[16/10] rounded-lg overflow-hidden border border-border-primary bg-background-primary hover:border-accent-primary hover:shadow-md transition-all cursor-pointer text-left"
                    aria-label={`Try ${sample.label} sample screenshot`}
                  >
                    <img
                      src={sample.src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                      <span className="text-xs font-semibold text-white">{sample.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            </div>
          )}
        </div>

        {/* RIGHT: Product picker + Analyze */}
        <aside className="w-full lg:w-[360px] lg:h-[660px] flex-shrink-0 flex flex-col gap-4 text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-text-primary">Audit your interface</h2>
            <p className="text-text-secondary text-sm">
              Score your design against 36 AI UX patterns.
            </p>
          </div>

          {isClassifying && (
            <span className="text-xs text-text-tertiary italic">Detecting product type…</span>
          )}

          <div className="grid grid-cols-2 gap-2">
            {productOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = productType === option.id;
              const spanBoth = option.id === 'other';
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    trackAuditEvent('audit_product_type_selected', { productType: option.id });
                    onProductTypeChange(option.id);
                  }}
                  className={`${spanBoth ? 'col-span-2' : ''} flex flex-col gap-1 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent-primary bg-accent-primary/5 shadow-sm'
                      : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:bg-background-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-accent-primary' : 'text-text-secondary'}`} />
                    <span className={`text-sm font-semibold ${isSelected ? 'text-text-primary' : 'text-text-primary'}`}>{option.label}</span>
                  </div>
                  <span className="text-xs text-text-tertiary leading-snug">{option.desc}</span>
                </button>
              );
            })}
          </div>

          {productType && (
            <div className="rounded-lg border border-border-primary bg-background-secondary px-3 py-2.5 text-xs text-text-secondary leading-relaxed">
              <span className="text-text-tertiary">Includes </span>
              <span className="font-medium text-text-primary">
                {productOptions.find((o) => o.id === productType)?.examplePatterns.join(', ')}
              </span>
              <span className="text-text-tertiary"> + more.</span>
            </div>
          )}

          <div className="mt-auto pt-2 hidden lg:block">
            {!canAnalyze && (
              <p className="mb-2 text-xs text-text-tertiary">
                {!hasImages && !productType
                  ? 'Add a screenshot and pick a type.'
                  : !hasImages
                    ? 'Add a screenshot.'
                    : 'Pick a type.'}
              </p>
            )}
            <button
              onClick={() => canAnalyze && onAnalyze(stagedImages)}
              disabled={!canAnalyze}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-full font-semibold text-base hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent-primary"
            >
              {hasImages
                ? `Analyze ${stagedImages.length} ${stagedImages.length === 1 ? 'Screenshot' : 'Screenshots'}`
                : 'Analyze'}
            </button>

            <div className="mt-4 rounded-lg border border-border-primary bg-background-primary">
              <p className="px-3 pt-2.5 pb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                What you&apos;ll get
              </p>
              <ul className="divide-y divide-border-primary">
                <li className="flex items-start gap-2.5 px-3 py-2.5">
                  <ChartBarIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                  <div className="text-xs leading-snug">
                    <span className="font-semibold text-text-primary">Score</span>
                    <span className="text-text-secondary"> out of applicable patterns</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 px-3 py-2.5">
                  <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                  <div className="text-xs leading-snug">
                    <span className="font-semibold text-text-primary">Top gaps</span>
                    <span className="text-text-secondary"> and patterns to add</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 px-3 py-2.5">
                  <ListBulletIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                  <div className="text-xs leading-snug">
                    <span className="font-semibold text-text-primary">Actions</span>
                    <span className="text-text-secondary"> you can ship today</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky Analyze bar — replaces the inline Analyze button on small
          screens so the action is always thumb-reachable. */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background-primary via-background-primary to-background-primary/0">
        {!canAnalyze && (
          <p className="mb-2 text-xs text-text-tertiary text-center">
            {!hasImages && !productType
              ? 'Add a screenshot and pick a type.'
              : !hasImages
                ? 'Add a screenshot.'
                : 'Pick a type.'}
          </p>
        )}
        <button
          onClick={() => canAnalyze && onAnalyze(stagedImages)}
          disabled={!canAnalyze}
          className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-accent-primary text-white dark:text-gray-900 rounded-full font-semibold text-base shadow-lg active:scale-95 transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
        >
          {hasImages
            ? `Analyze ${stagedImages.length} ${stagedImages.length === 1 ? 'Screenshot' : 'Screenshots'}`
            : 'Analyze'}
        </button>
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
