import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AuditClient from '@/components/audit/AuditClient';
import { PATTERN_COUNT } from '@/data/pattern-count';

export const revalidate = 86400;

// The tool itself, separated from the marketing page at `/`.
//
// Every entry point that expresses "I want to audit my design" lands here:
// the homepage CTA and both pattern-page InlineAuditCTA placements. Before
// this, all of them pointed at `/`, so a pattern reader who had already
// decided still had to find and click "Audit your design" on a marketing
// page to reach the upload screen they'd asked for.
//
// noindex on purpose: `/` already ranks for "AI UX audit tool" and this page
// is near-identical in intent, so indexing it risks cannibalising the page
// that earns the traffic. This URL exists to serve intent that is already
// on-site, not to win search.
export const metadata: Metadata = {
  title: `Audit your interface against ${PATTERN_COUNT} AI UX patterns`,
  description: `Upload a screenshot and score your AI interface against ${PATTERN_COUNT} patterns. Free, no signup.`,
  // noindex alone, deliberately without a canonical pointing at `/`. Those two
  // are contradictory signals: a canonical says "index the other URL instead",
  // noindex says "index nothing here". noindex is the one we actually want.
  robots: { index: false, follow: true },
};

export default function AuditPage() {
  return (
    <>
      <Navbar />
      {/* initialStep="screenshot" drops straight into upload. The demo step is
          the homepage's marketing view and has no place here. */}
      <AuditClient initialStep="screenshot" showSocialProof={false} />
      <ScrollToTop />
    </>
  );
}
