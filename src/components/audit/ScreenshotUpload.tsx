'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductType } from '@/types/audit';
import type { UploadedImage } from '@/components/audit/CenterUpload';
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, ChartBarIcon, ExclamationTriangleIcon, ListBulletIcon, CheckIcon } from '@heroicons/react/24/outline';
import { productOptions } from './productOptions';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { processImageFile } from '@/lib/audit/image';

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

type StepState = 'done' | 'active' | 'pending';

export function ScreenshotUpload({ productType, onProductTypeChange, onAnalyze }: ScreenshotUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedImages, setStagedImages] = useState<UploadedImage[]>([]);
  const [limitMessage, setLimitMessage] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // reveal manual type tiles (auto-detect is default)
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

    const promises = validFiles.map((file) =>
      // Downscale large screenshots before upload — Anthropic's vision API
      // rejects images over ~5MB / extreme dimensions ("Could not process image").
      processImageFile(file).then(({ base64, width, height }) => ({
        base64,
        fileName: file.name,
        deviceType: detectDeviceType(width, height),
        isSample: opts?.isSample,
      }))
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
  // Auto-detect-first: the type is classified from the screenshot (or falls back
  // to 'general'), so a manual pick is no longer required to analyze.
  const canAnalyze = hasImages;
  const detectedOption = productType ? productOptions.find((o) => o.id === productType) : undefined;

  // Progress-stepper states for the right-rail card.
  const step1State: StepState = hasImages ? 'done' : 'active';
  const step2State: StepState = isClassifying ? 'active' : detectedOption ? 'done' : hasImages ? 'active' : 'pending';
  const step3State: StepState = canAnalyze ? 'active' : 'pending';

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

        {/* RIGHT: floating cards — Progress stepper advances as the user acts. */}
        <aside className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-3 text-left">
          {showPicker ? (
            /* Manual override — reveal the 8 type tiles as its own card. */
            <div className="rounded-card border border-border-primary bg-background-secondary p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Pick your product type</span>
                {detectedOption && (
                  <button onClick={() => setShowPicker(false)} className="text-xs text-accent-primary hover:underline cursor-pointer">Cancel</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {productOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = productType === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        trackAuditEvent('audit_product_type_selected', { productType: option.id });
                        onProductTypeChange(option.id);
                        setShowPicker(false);
                      }}
                      className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-accent-primary bg-accent-primary/5 shadow-sm'
                          : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:bg-background-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-accent-primary' : 'text-text-secondary'}`} />
                        <span className="text-sm font-semibold text-text-primary">{option.label}</span>
                      </div>
                      <span className="text-xs text-text-tertiary leading-snug">{option.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Progress card — the three steps advance as you act. */
            <div className="rounded-card border border-border-primary bg-background-secondary p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">Progress</div>
              <ol className="flex flex-col">
                <StepRow state={step1State} last={false}>
                  <div className="text-sm font-semibold text-text-primary">Add a screenshot</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {hasImages
                      ? `${stagedImages.length} ${stagedImages.length === 1 ? 'image' : 'images'} added`
                      : 'Drop, paste, or try a sample'}
                  </div>
                </StepRow>

                <StepRow state={step2State} last={false}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-text-primary">Product type</div>
                    {detectedOption && !isClassifying && (
                      <button onClick={() => setShowPicker(true)} className="text-xs text-accent-primary hover:underline flex-shrink-0 cursor-pointer">
                        Change
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {isClassifying ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border-2 border-text-tertiary border-t-transparent animate-spin" aria-hidden />
                        Detecting…
                      </span>
                    ) : detectedOption ? (
                      <span><span className="font-medium text-text-primary">{detectedOption.label}</span> · {detectedOption.examplePatterns.slice(0, 2).join(', ')} + more</span>
                    ) : (
                      <button onClick={() => setShowPicker(true)} className="cursor-pointer text-left">
                        Auto-detected from your screenshot · <span className="text-accent-primary hover:underline">pick manually</span>
                      </button>
                    )}
                  </div>
                </StepRow>

                <StepRow state={step3State} last>
                  <div className="text-sm font-semibold text-text-primary">Analyze</div>
                  <div className="text-xs text-text-secondary mt-0.5">Score, top gaps &amp; fixes you can ship</div>
                </StepRow>
              </ol>
            </div>
          )}

          {/* What you'll get — secondary floating card. */}
          <div className="rounded-card border border-border-primary bg-background-primary p-1">
            <p className="px-3 pt-2 pb-1.5 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              What you&apos;ll get
            </p>
            <ul className="divide-y divide-border-primary">
              <li className="flex items-start gap-2.5 px-3 py-2">
                <ChartBarIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                <div className="text-xs leading-snug">
                  <span className="font-semibold text-text-primary">Score</span>
                  <span className="text-text-secondary"> out of applicable patterns</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 px-3 py-2">
                <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                <div className="text-xs leading-snug">
                  <span className="font-semibold text-text-primary">Top gaps</span>
                  <span className="text-text-secondary"> and patterns to add</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 px-3 py-2">
                <ListBulletIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-secondary" />
                <div className="text-xs leading-snug">
                  <span className="font-semibold text-text-primary">Actions</span>
                  <span className="text-text-secondary"> you can ship today</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Analyze CTA (desktop). */}
          <div className="hidden lg:block mt-0.5">
            {!canAnalyze && (
              <p className="mb-2 text-xs text-text-tertiary">Add a screenshot to analyze.</p>
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
          </div>
        </aside>
      </div>

      {/* Mobile sticky Analyze bar — replaces the inline Analyze button on small
          screens so the action is always thumb-reachable. */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background-primary via-background-primary to-background-primary/0">
        {!canAnalyze && (
          <p className="mb-2 text-xs text-text-tertiary text-center">Add a screenshot to analyze.</p>
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

/**
 * A single step in the right-rail Progress card: an indicator dot (done /
 * active / pending) with a connector line, and freeform content.
 */
function StepRow({ state, last, children }: { state: StepState; last?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center pt-0.5">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            state === 'done'
              ? 'bg-accent-primary text-white dark:text-gray-900'
              : state === 'active'
                ? 'border-2 border-accent-primary'
                : 'border-2 border-border-primary'
          }`}
          aria-hidden
        >
          {state === 'done' ? (
            <CheckIcon className="w-3 h-3" strokeWidth={3} />
          ) : state === 'active' ? (
            <span className="w-2 h-2 rounded-full bg-accent-primary" />
          ) : null}
        </span>
        {!last && <span className="w-px flex-1 min-h-[1rem] bg-border-primary my-1" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? '' : 'pb-4'}`}>{children}</div>
    </li>
  );
}
