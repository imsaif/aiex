'use client';

import Image from 'next/image';

interface MobileFrameProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function MobileFrame({ imageSrc, imageAlt, className = '' }: MobileFrameProps) {
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Phone body - using inline styles for realistic device colors */}
      <div className="relative rounded-[2.5rem] p-2 shadow-xl" style={{ backgroundColor: '#1e293b' }}>
        {/* Inner bezel */}
        <div className="relative bg-black rounded-[2rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="w-24 h-7 bg-black rounded-full flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1e293b' }} />
            </div>
          </div>

          {/* Screen content */}
          <div className="relative w-[280px] aspect-[9/19.5] overflow-hidden bg-background-primary">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <div className="w-32 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />
          </div>
        </div>

        {/* Side buttons - volume */}
        <div className="absolute left-0 top-24 -translate-x-0.5">
          <div className="w-1 h-6 rounded-l-sm mb-2" style={{ backgroundColor: '#334155' }} />
          <div className="w-1 h-12 rounded-l-sm mb-1" style={{ backgroundColor: '#334155' }} />
          <div className="w-1 h-12 rounded-l-sm" style={{ backgroundColor: '#334155' }} />
        </div>

        {/* Side button - power */}
        <div className="absolute right-0 top-32 translate-x-0.5">
          <div className="w-1 h-16 rounded-r-sm" style={{ backgroundColor: '#334155' }} />
        </div>
      </div>
    </div>
  );
}
