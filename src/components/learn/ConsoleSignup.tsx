import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import type { NewsletterSource } from '@/types/newsletter';

/**
 * The compact email capture that sits in a console page's header.
 *
 * One component rather than three copies, so the three console pages cannot
 * drift apart — and so the wording, width and variant are changed in one place.
 *
 * Uses the `news` variant deliberately: it is the only one that does not centre
 * itself or scale the type up. In a page header the capture should read as a
 * quiet offer under the title, not as a second call to action competing with
 * the content underneath.
 */
export default function ConsoleSignup({
  source,
  subheading = 'Daily AI UX news and pattern breakdowns, straight to your inbox.',
}: {
  /**
   * Where the signup came from. Typed against NEWSLETTER_SOURCES rather than
   * string: an unlisted value is rejected by the subscribe route as an invalid
   * email, so a typo here would silently capture nothing.
   */
  source: NewsletterSource;
  subheading?: string;
}) {
  return (
    <div className="mt-6 max-w-md">
      <InlineNewsletterSignup
        variant="news"
        source={source}
        customSubheading={subheading}
      />
    </div>
  );
}
