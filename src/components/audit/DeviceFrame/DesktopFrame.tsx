'use client';

import Image from 'next/image';

interface DesktopFrameProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function DesktopFrame({ imageSrc, imageAlt, className = '' }: DesktopFrameProps) {
  return (
    <div className={`relative inline-flex flex-col ${className}`}>
      {/* Browser window */}
      <div className="bg-background-secondary rounded-xl shadow-xl overflow-hidden border border-border-primary">
        {/* Title bar / Chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-background-primary border-b border-border-primary">
          {/* Traffic lights - using semantic colors */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-status-error" />
            <div className="w-3 h-3 rounded-full bg-status-warning" />
            <div className="w-3 h-3 rounded-full bg-status-success" />
          </div>

          {/* URL bar */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-lg border border-border-primary">
              {/* Lock icon */}
              <svg
                className="w-3.5 h-3.5 text-text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs text-text-tertiary truncate">
                app.example.com
              </span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-16" />
        </div>

        {/* Browser content */}
        <div className="relative w-[720px] aspect-video overflow-hidden bg-background-primary">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
