'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ArrowUpTrayIcon,
  SparklesIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

type TabType = 'select' | 'demo';

interface CenterUploadProps {
  onImageUpload: (base64: string, fileName: string) => void;
  onUrlCapture: (url: string) => void;
  isCapturing?: boolean;
  uploadedFileName?: string;
}

export function CenterUpload({
  onImageUpload,
  onUrlCapture,
  isCapturing = false,
  uploadedFileName = '',
}: CenterUploadProps) {
  const [activeTab, setActiveTab] = useState<TabType>('select');
  const [url, setUrl] = useState('');

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

  const handleCaptureClick = () => {
    if (url.trim()) {
      onUrlCapture(url.trim());
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative bg-background-tertiary">
      {/* Full-width grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Upload Card - Smaller */}
      <div className="relative w-full max-w-sm">
        <div
          {...getRootProps()}
          className="relative bg-background-primary rounded-2xl shadow-card border border-border-primary p-5"
        >
          <input {...getInputProps()} />

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('select');
                open();
              }}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all
                ${activeTab === 'select'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
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
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all
                ${activeTab === 'demo'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
                }
              `}
            >
              <SparklesIcon className="w-4 h-4" />
              Demo
            </button>
          </div>

          {activeTab === 'select' ? (
            <>
              {/* Drop Zone */}
              <div
                onClick={open}
                className={`
                  mb-4 p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all
                  ${isDragActive
                    ? 'border-accent-primary bg-accent-subtle'
                    : 'border-border-primary hover:border-border-secondary hover:bg-background-secondary'
                  }
                `}
              >
                <PhotoIcon className="w-10 h-10 mx-auto mb-3 text-text-tertiary" />
                {uploadedFileName ? (
                  <p className="text-sm font-medium text-text-primary">{uploadedFileName}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-text-primary mb-1">
                      Drop your screenshot here
                    </p>
                    <p className="text-xs text-text-tertiary">or click to browse</p>
                  </>
                )}
              </div>

              {/* URL Input */}
              <div className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg border border-border-primary focus-within:border-accent-primary transition-colors">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="website.com or paste link..."
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleCaptureClick}
                    disabled={!url.trim() || isCapturing}
                    className={`
                      px-3 py-1.5 rounded-md text-xs font-medium transition-all
                      ${url.trim() && !isCapturing
                        ? 'bg-accent-primary text-white hover:bg-accent-hover'
                        : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
                      }
                    `}
                  >
                    {isCapturing ? 'Capturing...' : 'Capture'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Demo Tab Content */
            <div className="mb-4 p-8 border-2 border-dashed rounded-xl text-center border-border-primary">
              <SparklesIcon className="w-10 h-10 mx-auto mb-3 text-accent-primary" />
              <p className="text-sm font-medium text-text-primary mb-1">Demo Mode</p>
              <p className="text-xs text-text-tertiary">Coming soon - try with a sample design</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className="text-xs font-medium">More</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
