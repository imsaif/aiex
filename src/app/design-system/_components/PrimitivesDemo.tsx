'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

/**
 * Interactive demo for the Primitives section of /design-system.
 * Renders a Dialog trigger + a few Input states so the page shows real
 * components, not just visual fragments.
 */
export function PrimitivesDemo() {
  const [open, setOpen] = useState(false);
  const error = 'Email must include an @';

  return (
    <div className="space-y-loose">
      {/* Dialog trigger */}
      <div className="space-y-snug">
        <p className="type-eyebrow text-text-tertiary">Dialog</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-accent-primary text-background-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo"
        >
          Open dialog
        </button>
        <p className="type-caption text-text-tertiary">
          Backdrop click, Escape, and the Cancel button all close. Focus is trapped inside and returned to the trigger.
        </p>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Unlock 3 more audits"
          description="Drop your email and we'll send the report plus 3 more runs."
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-primary px-default py-snug rounded-input type-caption font-semibold hover:bg-accent-subtle transition-colors duration-quick ease-out-expo"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-accent-primary text-background-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo"
              >
                Unlock
              </button>
            </>
          }
        >
          <Input
            type="email"
            label="Work email"
            placeholder="you@company.com"
            description="We won't share this."
          />
        </Dialog>
      </div>

      {/* Input variants */}
      <div className="space-y-snug">
        <p className="type-eyebrow text-text-tertiary">Input</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-loose">
          <Input
            label="Default"
            placeholder="Type here"
            description="With a description below."
          />
          <Input
            label="Error state"
            type="email"
            placeholder="you@company.com"
            defaultValue="not-an-email"
            error={error}
          />
          <Input
            label="With leading icon"
            placeholder="Search patterns"
            leadingIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />
          <Input
            label="Small size"
            placeholder="Compact"
            size="sm"
            description="size='sm' for dense surfaces"
          />
        </div>
      </div>
    </div>
  );
}
