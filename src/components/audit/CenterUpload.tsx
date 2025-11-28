'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  ArrowUpTrayIcon,
  SparklesIcon,
  PhotoIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type TabType = 'upload' | 'demo';

interface CenterUploadProps {
  onImageUpload: (base64: string, fileName: string) => void;
  onClear?: () => void;
  uploadedImage?: string | null;
  uploadedFileName?: string;
}

export function CenterUpload({
  onImageUpload,
  onClear,
  uploadedImage,
  uploadedFileName = '',
}: CenterUploadProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      onImageUpload(base64, file.name);
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

  // If image is uploaded, show it on the canvas
  if (uploadedImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4" {...getRootProps()}>
        <input {...getInputProps()} />

        {/* Image container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={uploadedImage}
            alt={uploadedFileName || 'Uploaded screenshot'}
            fill
            className="object-contain rounded-lg"
            unoptimized
          />

          {/* Overlay controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-background-primary/90 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium text-text-primary hover:bg-background-primary transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Replace
            </button>
            {onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-background-primary/90 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Drag overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-accent-primary/10 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-accent-primary">
            <p className="text-lg font-medium text-accent-primary">Drop to replace</p>
          </div>
        )}
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
              <SparklesIcon className="w-4 h-4" />
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
                    : 'border-slate-300 dark:border-slate-600 hover:border-accent-primary'
                  }
                `}
              >
                <PhotoIcon className="w-10 h-10 mx-auto mb-2 text-text-tertiary" />
                <p className="text-sm font-medium text-text-primary">
                  {isDragActive ? 'Drop it here!' : 'Drop your screenshot here'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">or click to browse</p>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  onClick={open}
                  className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span className="text-lg">•••</span>
                  More options
                </button>
              </div>
            </>
          )}

          {activeTab === 'demo' && (
            <div className="text-center py-6">
              <SparklesIcon className="w-10 h-10 mx-auto mb-3 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">
                Demo mode coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
