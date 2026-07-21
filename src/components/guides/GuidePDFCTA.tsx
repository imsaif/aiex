'use client';

import { useEffect, useState } from 'react';
import DownloadPDFModal from '@/components/ui/DownloadPDFModal';

interface GuidePDFCTAProps {
  guideSlug: string;
  guideTitle: string;
  lessonOrder: number;
}

interface CTAVariant {
  headline: string;
  subhead: string;
  button: string;
}

interface GuideConfig {
  triggers: Record<number, CTAVariant>;
}

// Per-guide trigger lessons + copy. Density ~1 placement per 5-7 lessons,
// with copy tailored to roughly where the reader is in the course.
const GUIDE_CONFIGS: Record<string, GuideConfig> = {
  'claude-code-learning-path': {
    triggers: {
      2: {
        headline: 'Want the full Claude Code guide as a PDF?',
        subhead:
          "Drop your email, and I'll send the latest version + new lessons as they ship.",
        button: 'Get the PDF',
      },
      6: {
        headline: 'Save the full guide for later',
        subhead: 'Get the PDF + new AI UX patterns weekly.',
        button: 'Email me the PDF',
      },
      12: {
        headline: 'Halfway through? Grab the PDF',
        subhead:
          'Finish offline at your own pace. New lessons arrive in your inbox.',
        button: 'Send me the PDF',
      },
    },
  },
  'claude-design-learning-path': {
    triggers: {
      2: {
        headline: 'Want the full Claude Design guide as a PDF?',
        subhead:
          "Drop your email, and I'll send the latest version + new lessons as they ship.",
        button: 'Get the PDF',
      },
      7: {
        headline: 'Save the full guide for later',
        subhead:
          'Get the PDF + new AI UX patterns weekly. Finish offline at your own pace.',
        button: 'Email me the PDF',
      },
    },
  },
};

const submittedKey = (slug: string) => `gist_pdf_submitted:${slug}`;

export default function GuidePDFCTA({
  guideSlug,
  guideTitle,
  lessonOrder,
}: GuidePDFCTAProps) {
  const [hidden, setHidden] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const config = GUIDE_CONFIGS[guideSlug];
  const copy = config?.triggers[lessonOrder];

  useEffect(() => {
    if (!copy) return;
    try {
      const submitted = localStorage.getItem(submittedKey(guideSlug)) === '1';
      if (!submitted) setHidden(false);
    } catch {
      setHidden(false);
    }
  }, [copy, guideSlug]);

  if (hidden || !copy) return null;

  const handleClose = () => {
    setModalOpen(false);
    try {
      const submitted = localStorage.getItem(submittedKey(guideSlug)) === '1';
      if (submitted) setHidden(true);
    } catch {}
  };

  return (
    <>
      <aside className="my-10 rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-6 md:p-7">
        <h3 className="text-lg font-semibold text-text-primary leading-snug">
          {copy.headline}
        </h3>
        <p className="mt-1.5 text-sm text-text-secondary">{copy.subhead}</p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
        >
          {copy.button}
        </button>
      </aside>
      <DownloadPDFModal
        isOpen={modalOpen}
        onClose={handleClose}
        guideTitle={guideTitle}
        guideSlug={guideSlug}
      />
    </>
  );
}
