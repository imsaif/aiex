'use client';

import { useEffect, useRef, ReactNode, useId } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional decorative mark shown before the title, e.g. a character icon. */
  titleIcon?: ReactNode;
  description?: string;
  size?: DialogSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** Accessible label when `title` isn't visible. */
  ariaLabel?: string;
  children?: ReactNode;
  /**
   * Drop the panel's outline and inner padding, for content that runs edge to
   * edge (the skill-pack dialog's navy band). The outline otherwise shows as a
   * light rim around a dark band.
   */
  bare?: boolean;
  /** Optional element rendered in a footer row (right-aligned). */
  footer?: ReactNode;
}

const SIZE_CLASSES: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Shared Dialog primitive — used by every modal surface in the app.
 * Handles backdrop dim, body scroll lock, focus trap, return-focus, Escape,
 * and aria-modal semantics. Backed by the design-system tokens: z-overlay
 * for the backdrop, z-modal for the panel, shadow-modal for the lift,
 * rounded-modal for the corners, duration-base for the open transition.
 *
 * Usage:
 *   <Dialog open={open} onClose={close} title="..." size="md">
 *     ...body...
 *   </Dialog>
 */
export function Dialog({
  open,
  onClose,
  title,
  titleIcon,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  ariaLabel,
  bare = false,
  children,
  footer,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useClickOutside(panelRef, () => {
    if (closeOnBackdrop) onClose();
  }, open);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-overlay flex items-center justify-center px-default py-default bg-text-primary/40 backdrop-blur-sm animate-fade-in"
      aria-hidden={false}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`relative z-modal w-full max-h-full overflow-y-auto ${SIZE_CLASSES[size]} rounded-modal bg-surface-primary shadow-modal ${bare ? '' : 'border border-border-primary'} animate-scale-in`}
      >
        {(title || description) && (
          <header className="px-loose pt-loose pb-snug space-y-tight">
            {title && (
              <h2 id={titleId} className="type-h3 flex items-center gap-snug text-text-primary">
                {titleIcon && (
                  <span aria-hidden="true" className="shrink-0">
                    {titleIcon}
                  </span>
                )}
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="type-body text-text-secondary">
                {description}
              </p>
            )}
          </header>
        )}

        <div className={bare ? '' : title || description ? 'px-loose pb-loose' : 'p-loose'}>{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-snug px-loose py-default border-t border-border-primary">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
