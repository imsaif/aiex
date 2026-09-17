'use client';

import { useEffect, useState } from 'react';

/**
 * Click a lesson screenshot to see it at full size, without leaving the lesson.
 *
 * The first attempt opened the file in a new tab. That answers the question
 * "can I see this bigger" by taking the reader out of the page they were
 * reading, dumping them on a bare image with no caption and no way back except
 * the tab bar. Clicking a picture inside an article should enlarge it in place;
 * anything else reads as a broken link.
 *
 * Deliberately small: no zoom levels, no panning, no carousel. One image, one
 * way out, closable three ways (Escape, the button, anywhere outside), because
 * an overlay a reader cannot dismiss instantly is worse than no overlay.
 */
export default function LessonImageZoom({
  src,
  alt,
  label,
  children,
}: {
  src: string;
  alt: string;
  label?: string;
  /** The inline image, rendered by the caller so its loading rules stay there. */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Escape closes, and the page behind does not scroll while it is open.
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge: ${alt}`}
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
      >
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-modal flex cursor-zoom-out flex-col items-center justify-center gap-4 bg-text-primary/70 p-6 backdrop-blur-sm animate-fade-in"
        >
          <img
            src={src}
            alt={alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-full cursor-default rounded-card border border-border-secondary object-contain"
          />
          {label && (
            <p className="m-0 max-w-[820px] text-center text-sm text-background-primary">
              {label}
            </p>
          )}
        </div>
      )}
    </>
  );
}
