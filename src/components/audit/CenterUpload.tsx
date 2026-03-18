'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ArrowUpTrayIcon,
  ComputerDesktopIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SparklesIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { DeviceFrame } from './DeviceFrame';
import { detectDeviceType, type DeviceType } from '@/utils/imageDetection';

type TabType = 'upload' | 'demo';

const MAX_IMAGES = 4;

interface UsageInfo {
  used: number;
  remaining: number;
  limit: number;
}

export interface UploadedImage {
  base64: string;
  fileName: string;
  deviceType: DeviceType;
}

interface CenterUploadProps {
  onImagesUpload: (images: UploadedImage[]) => void;
  onStartAnalysis?: () => void;
  onOpenChat?: () => void;
  onClear?: () => void;
  onStartDemo?: () => void;
  uploadedImages?: UploadedImage[];
  isAnalyzing?: boolean;
  hasResults?: boolean;
  showDeviceFrame?: boolean;
  onToggleFrame?: () => void;
  children?: React.ReactNode;
  /** When true, shifts content left to make room for floating sidebar */
  sidebarOpen?: boolean;
}

export function CenterUpload({
  onImagesUpload,
  onStartAnalysis,
  onOpenChat,
  onClear,
  onStartDemo,
  uploadedImages = [],
  isAnalyzing = false,
  hasResults = false,
  showDeviceFrame = true,
  onToggleFrame,
  children,
  sidebarOpen = false,
}: CenterUploadProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [isDetecting, setIsDetecting] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch usage on mount
  useEffect(() => {
    fetch('/api/audit/usage')
      .then(res => res.json())
      .then(data => setUsage(data))
      .catch(() => setUsage(null));
  }, []);

  // Reset carousel index when images change
  useEffect(() => {
    if (uploadedImages.length === 0) setCurrentIndex(0);
  }, [uploadedImages.length]);

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setIsDetecting(true);
    try {
      const newImages: UploadedImage[] = [];

      for (const file of files) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const result = await detectDeviceType(base64);
        newImages.push({
          base64,
          fileName: file.name,
          deviceType: result.deviceType,
        });
      }

      // Merge with existing, cap at MAX_IMAGES
      const merged = [...uploadedImages, ...newImages].slice(0, MAX_IMAGES);
      onImagesUpload(merged);
      // Show the first newly added image
      setCurrentIndex(uploadedImages.length);
    } finally {
      setIsDetecting(false);
    }
  }, [onImagesUpload, uploadedImages]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Cap files to remaining slots
    const remaining = MAX_IMAGES - uploadedImages.length;
    const filesToProcess = acceptedFiles.slice(0, Math.max(remaining, 1));
    await processFiles(filesToProcess);
  }, [processFiles, uploadedImages.length]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    noClick: true,
  });

  const hasImages = uploadedImages.length > 0;
  const currentImage = uploadedImages[currentIndex];
  const isMultiple = uploadedImages.length > 1;

  // Navigation
  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + uploadedImages.length) % uploadedImages.length);
  };
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % uploadedImages.length);
  };

  // If images are uploaded, show carousel/single view
  if (hasImages && currentImage) {
    return (
      <div className="absolute inset-0" {...getRootProps()}>
        <input {...getInputProps()} />

        {/* Image area — shifts left when sidebar is open */}
        {/* brand-audit-ignore: arbitrary padding needed to offset for floating sidebar width */}
        <div className={`absolute inset-0 flex items-center justify-center p-4 transition-[padding] duration-500 ${sidebarOpen ? 'lg:pr-96' : ''}`}>

        {/* Device frame container */}
        <div className="relative flex flex-col items-center justify-center max-h-full overflow-hidden">
          {/* Image display - with or without device frame */}
          <div className={`relative transition-all duration-500 ${isAnalyzing ? 'blur-[2px] opacity-80' : ''}`}>
            {showDeviceFrame ? (
              <DeviceFrame
                deviceType={currentImage.deviceType}
                imageSrc={currentImage.base64}
                imageAlt={currentImage.fileName || 'Uploaded screenshot'}
              />
            ) : (
              <div className="relative max-w-full max-h-[70vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.base64}
                  alt={currentImage.fileName || 'Uploaded screenshot'}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Carousel navigation arrows — only when multiple images */}
            {isMultiple && !isAnalyzing && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background-primary/90 backdrop-blur-sm rounded-full shadow-lg border border-border-primary/50 text-text-secondary hover:text-text-primary hover:bg-background-primary transition-colors z-10 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background-primary/90 backdrop-blur-sm rounded-full shadow-lg border border-border-primary/50 text-text-secondary hover:text-text-primary hover:bg-background-primary transition-colors z-10 cursor-pointer"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Analyzing indicator */}
          {isAnalyzing && (
            <div className="mt-3 px-4 py-2 bg-accent-subtle rounded-full text-sm text-accent-primary font-medium animate-pulse">
              Analyzing {uploadedImages.length > 1 ? `${uploadedImages.length} screenshots` : 'your design'}...
            </div>
          )}

          {/* Page dots for multi-image */}
          {!isAnalyzing && isMultiple && (
            <div className="mt-3 flex items-center gap-2">
              {uploadedImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === currentIndex
                      ? 'bg-accent-primary scale-125'
                      : 'bg-text-tertiary/40 hover:bg-text-tertiary'
                  }`}
                />
              ))}
              <span className="text-xs text-text-tertiary ml-1">
                {currentIndex + 1}/{uploadedImages.length}
              </span>
            </div>
          )}

          {/* Toolbar — flows below the device frame */}
          {!isAnalyzing && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-background-primary/90 backdrop-blur-sm rounded-full shadow-sm border border-border-primary/30">
              {/* Analyze or New Audit — primary CTA */}
              {!hasResults && onStartAnalysis ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onStartAnalysis(); }}
                  className="flex items-center gap-2 px-5 py-2 bg-accent-primary text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-accent-hover transition-all cursor-pointer"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Analyze{uploadedImages.length > 1 ? ` (${uploadedImages.length})` : ''}
                </button>
              ) : hasResults && onClear ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onClear(); }}
                  className="flex items-center gap-2 px-5 py-2 bg-accent-primary text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-accent-hover transition-all cursor-pointer"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  New Audit
                </button>
              ) : null}

              {/* Chat — post-analysis only */}
              {hasResults && onOpenChat && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onOpenChat(); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Chat with Design Mentor
                </button>
              )}

              {/* Add More — always available if under limit */}
              {uploadedImages.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); open(); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add More
                </button>
              )}

              <div className="w-px h-5 bg-border-primary/50" />

              {/* Frame toggle */}
              {onToggleFrame && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleFrame(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-text-tertiary hover:text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  {showDeviceFrame ? 'Hide Frame' : 'Show Frame'}
                </button>
              )}

              {/* Clear — pre-analysis only */}
              {!hasResults && onClear && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onClear(); }}
                  className="px-3 py-2 rounded-full text-sm text-text-tertiary hover:text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close image area div */}
        </div>

        {/* Drag overlay */}
        {isDragActive && !isAnalyzing && (
          <div className="absolute inset-0 bg-accent-primary/10 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-accent-primary">
            <p className="text-lg font-medium text-accent-primary">
              Drop to add {uploadedImages.length < MAX_IMAGES ? `(${MAX_IMAGES - uploadedImages.length} slots left)` : '(max reached)'}
            </p>
          </div>
        )}

      </div>
    );
  }

  // Show loading state during detection
  if (isDetecting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-secondary">Detecting device type...</p>
        </div>
      </div>
    );
  }

  // Default: show upload modal
  return (
    <div className="absolute inset-0 flex flex-col items-center p-8 overflow-y-auto">
      {/* Spacer to vertically center when content fits */}
      <div className="flex-1 min-h-0" />
      {/* Upload Card */}
      <div className="relative w-full max-w-sm z-10">
        <div
          {...getRootProps()}
          className="relative bg-background-primary rounded-3xl shadow-xl p-5"
        >
          <input {...getInputProps()} />

          {/* Minimal Tabs */}
          <div className="flex justify-center gap-1 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeTab === 'upload'
                  ? 'bg-background-secondary text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary'
                }
              `}
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Select
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeTab === 'demo'
                  ? 'bg-background-secondary text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary'
                }
              `}
            >
              <ComputerDesktopIcon className="w-4 h-4" />
              Demo
            </button>
          </div>

          {activeTab === 'upload' && (
            <>
              {/* Drop Zone */}
              <div
                onClick={open}
                className={`
                  p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all
                  ${isDragActive
                    ? 'border-accent-primary bg-accent-subtle'
                    : 'border-border-primary hover:border-accent-primary'
                  }
                `}
              >
                <PhotoIcon className="w-10 h-10 mx-auto mb-2 text-text-tertiary" />
                <p className="text-sm font-medium text-text-primary">
                  {isDragActive ? 'Drop them here!' : 'Drop your screenshots here'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">or click to browse · up to {MAX_IMAGES} images</p>
              </div>

            </>
          )}

          {activeTab === 'demo' && (
            <div className="text-center py-6">
              <ComputerDesktopIcon className="w-10 h-10 mx-auto mb-3 text-accent-primary" />
              <h3 className="text-base font-semibold text-text-primary mb-2">
                See a Sample Analysis
              </h3>
              <p className="text-sm text-text-secondary mb-4 px-4">
                Preview what an AI UX audit looks like with our demo analysis of a chat interface.
              </p>
              <button
                type="button"
                onClick={onStartDemo}
                className="px-6 py-2.5 bg-accent-primary text-white dark:text-gray-900 text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors cursor-pointer"
              >
                View Demo Results
              </button>
            </div>
          )}
        </div>

        {/* Usage indicator */}
        {usage && (
          <div className="mt-4 text-center">
            <p className="text-xs text-text-tertiary">
              {usage.remaining > 0 ? (
                <>
                  <span className="font-medium text-text-secondary">{usage.remaining}</span>
                  {' '}of {usage.limit} free analyses left today
                </>
              ) : (
                <span className="text-status-warning">Daily limit reached</span>
              )}
            </p>
          </div>
        )}

      </div>

      {/* Extra content below upload (e.g. marketing pitch) — outside max-w-sm constraint */}
      {children}

      {/* Bottom spacer for vertical centering */}
      <div className="flex-1 min-h-0" />
    </div>
  );
}
