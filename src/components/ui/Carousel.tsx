"use client";
import { useState } from "react";
import OptimizedMedia from "./OptimizedMedia";

interface Example {
  image?: string;
  title: string;
  description: string;
  altText?: string;
}

export default function Carousel({ examples }: { examples: Example[] }) {
  const images = examples.filter(e => e.image);
  const [current, setCurrent] = useState(0);
  if (images.length === 0) return null;
  // Clamp in case the examples array shrank since `current` was last set
  // (e.g. data change or HMR), so we never index past the end.
  const safeCurrent = Math.min(current, images.length - 1);
  const prev = () => setCurrent(() => Math.max(safeCurrent - 1, 0));
  const next = () => setCurrent(() => Math.min(safeCurrent + 1, images.length - 1));
  const example = images[safeCurrent];
  return (
    <div className="flex flex-col items-center">
      {/* Side-by-side layout container - 70/30 split */}
      <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-6 bg-surface-primary rounded-lg overflow-hidden">
        {/* Left side: Image with navigation (takes 7/10 width on desktop) */}
        <div className="md:col-span-7 relative">
          {example.image && (
            <div className="w-full h-64 md:h-[30rem] bg-background-tertiary p-2 flex items-center justify-center overflow-hidden">
              <OptimizedMedia
                src={example.image}
                alt={example.title}
                className="w-full h-full object-cover"
                width={800}
                height={600}
              />
            </div>
          )}
          
          {/* Navigation buttons */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-none">
              <button
                onClick={prev}
                disabled={safeCurrent === 0}
                className="p-2 bg-surface-primary hover:bg-background-secondary border border-primary shadow-sm rounded-full disabled:opacity-40 disabled:cursor-not-allowed z-dropdown transition-colors pointer-events-auto"
                aria-label="Previous image"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-text-primary">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={next}
                disabled={safeCurrent === images.length - 1}
                className="p-2 bg-surface-primary hover:bg-background-secondary border border-primary shadow-sm rounded-full disabled:opacity-40 disabled:cursor-not-allowed z-dropdown transition-colors pointer-events-auto"
                aria-label="Next image"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-text-primary">
                  <path d="M9 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Right side: Description content (takes 3/10 width on desktop) */}
        <div className="md:col-span-3 p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-xl mb-4 text-text-primary">{example.title}</h3>
            <p className="text-text-secondary leading-relaxed">{example.description}</p>
          </div>

          {/* Image indicators */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === safeCurrent
                      ? 'bg-category-blue w-8'
                      : 'bg-background-secondary w-3 hover:bg-background-tertiary'
                  }`}
                  aria-label={`View example ${i + 1}`}
                />
              ))}
            </div>
          )}

          {example.altText && (
            <div className="text-right text-xs text-text-tertiary mt-4 italic">{example.altText}</div>
          )}
        </div>
      </div>
    </div>
  );
} 