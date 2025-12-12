'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ArrowUpTrayIcon,
  ComputerDesktopIcon,
  PhotoIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { DeviceFrame } from './DeviceFrame';
import { detectDeviceType, type DeviceType } from '@/utils/imageDetection';

type TabType = 'upload' | 'demo';

interface UsageInfo {
  used: number;
  remaining: number;
  limit: number;
}

interface CenterUploadProps {
  onImageUpload: (base64: string, fileName: string, deviceType: DeviceType) => void;
  onClear?: () => void;
  onStartDemo?: () => void;
  uploadedImage?: string | null;
  uploadedFileName?: string;
  detectedDeviceType?: DeviceType;
  isAnalyzing?: boolean;
  showDeviceFrame?: boolean;
  onToggleFrame?: () => void;
}

export function CenterUpload({
  onImageUpload,
  onClear,
  onStartDemo,
  uploadedImage,
  uploadedFileName = '',
  detectedDeviceType = 'desktop',
  isAnalyzing = false,
  showDeviceFrame = true,
  onToggleFrame,
}: CenterUploadProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [isDetecting, setIsDetecting] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  // Fetch usage on mount
  useEffect(() => {
    fetch('/api/audit/usage')
      .then(res => res.json())
      .then(data => setUsage(data))
      .catch(() => setUsage(null));
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setIsDetecting(true);
      try {
        const result = await detectDeviceType(base64);
        onImageUpload(base64, file.name, result.deviceType);
      } finally {
        setIsDetecting(false);
      }
    };

    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    noClick: true,
  });

  // If image is uploaded, show it on the canvas with optional device frame
  if (uploadedImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4" {...getRootProps()}>
        <input {...getInputProps()} />

        {/* Device frame container */}
        <div className="relative flex flex-col items-center justify-center max-h-full overflow-hidden">
          {/* Image display - with or without device frame */}
          <div className={`relative transition-all duration-500 ${isAnalyzing ? 'blur-[2px] opacity-80' : ''}`}>
            {showDeviceFrame ? (
              <DeviceFrame
                deviceType={detectedDeviceType}
                imageSrc={uploadedImage}
                imageAlt={uploadedFileName || 'Uploaded screenshot'}
              />
            ) : (
              // Raw image without frame
              <div className="relative max-w-full max-h-[70vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt={uploadedFileName || 'Uploaded screenshot'}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Device type indicator - hide during analysis */}
          {!isAnalyzing && (
            <div className="mt-4 px-3 py-1 bg-background-secondary rounded-full text-xs text-text-secondary">
              Detected: {detectedDeviceType === 'mobile' ? 'Mobile' : 'Desktop'}
            </div>
          )}

          {/* Analyzing indicator below device */}
          {isAnalyzing && (
            <div className="mt-4 px-4 py-2 bg-accent-subtle rounded-full text-sm text-accent-primary font-medium animate-pulse">
              Analyzing your design...
            </div>
          )}

          {/* Overlay controls - hide during analysis */}
          {!isAnalyzing && (
            <div className="mt-6 flex flex-col items-center gap-3">
              {/* Primary actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white dark:text-gray-900 rounded-full shadow-lg text-sm font-semibold hover:bg-accent-hover hover:scale-105 transition-all"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Replace Image
                </button>
                {onClear && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-background-primary border-2 border-border-primary rounded-full shadow-lg text-sm font-semibold text-text-primary hover:border-accent-primary/50 hover:scale-105 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Frame toggle - secondary action */}
              {onToggleFrame && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFrame();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  {showDeviceFrame ? 'Hide Frame' : 'Show Frame'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Drag overlay */}
        {isDragActive && !isAnalyzing && (
          <div className="absolute inset-0 bg-accent-primary/10 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-accent-primary">
            <p className="text-lg font-medium text-accent-primary">Drop to replace</p>
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
    <div className="absolute inset-0 flex items-center justify-center p-8">
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
                  {isDragActive ? 'Drop it here!' : 'Drop your screenshot here'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">or click to browse</p>
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
    </div>
  );
}
