'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UndoSnackbarProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  /** Auto-dismiss after this many ms (default 6000). */
  durationMs?: number;
}

/**
 * Gmail-style undo bar for accidental deletes. The removed item isn't truly
 * gone until this auto-dismisses (or the user dismisses it); clicking Undo
 * restores it. Re-keys its timer on `message` so a fresh removal restarts the
 * countdown.
 */
export function UndoSnackbar({ message, onUndo, onDismiss, durationMs = 6000 }: UndoSnackbarProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [message, durationMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-toast flex items-center gap-4 rounded-pill bg-text-primary text-background-primary px-5 py-3 shadow-elevated animate-slide-up"
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default UndoSnackbar;
