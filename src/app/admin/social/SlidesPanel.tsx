'use client';

import { useEffect, useState } from 'react';

interface SlideInfo {
  n: number;
  kind: string;
  alt: string;
}

/**
 * The four newsletter-style images for an issue's LinkedIn post and X thread,
 * each with its alt text ready to paste into LinkedIn's or X's alt text box.
 */
export default function SlidesPanel({ newsletterId, onCopied }: { newsletterId: string; onCopied: (text: string) => void }) {
  const [slides, setSlides] = useState<SlideInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSlides(null);
    setError(null);
    fetch(`/api/social/slides?id=${newsletterId}&format=json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => !cancelled && setSlides(data.slides))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Could not load the images'));
    return () => {
      cancelled = true;
    };
  }, [newsletterId]);

  const src = (n: number) => `/api/social/slides?id=${newsletterId}&n=${n}`;

  const downloadAll = async () => {
    if (!slides) return;
    for (const slide of slides) {
      const blob = await fetch(src(slide.n)).then((r) => r.blob());
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `aiux-${slide.n}-${slide.kind}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-text-primary">Images for LinkedIn and X</p>
          <p className="text-sm text-text-secondary">Upload in order 1 to 4. Paste each one&apos;s alt text with it.</p>
        </div>
        <button
          onClick={downloadAll}
          disabled={!slides}
          className="px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Download all 4
        </button>
      </div>

      {error && <p className="text-sm text-status-error">{error}</p>}
      {!slides && !error && <p className="text-sm text-text-secondary">Loading images...</p>}

      {slides && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {slides.map((slide) => (
            <figure key={slide.n} className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(slide.n)}
                alt={slide.alt}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover rounded-md border border-border-primary"
              />
              <figcaption className="text-sm text-text-secondary">{slide.alt}</figcaption>
              <div className="flex gap-2">
                <a
                  href={src(slide.n)}
                  download={`aiux-${slide.n}-${slide.kind}.png`}
                  className="px-2 py-1 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
                >
                  Download
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(slide.alt);
                    onCopied(`Alt text for image ${slide.n} copied`);
                  }}
                  className="px-2 py-1 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
                >
                  Copy alt text
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
