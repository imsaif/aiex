'use client';

import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';

export function AboutNewsletter() {
  return (
    <InlineNewsletterSignup
      variant="pattern-detail"
      customButtonText="Subscribe"
      customSuccessMessage="You're in! Look out for next week's analysis."
      source="about"
    />
  );
}
