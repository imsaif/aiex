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
  className = 'mt-6 max-w-md',
}: {
  /**
   * Where the signup came from. Typed against NEWSLETTER_SOURCES rather than
   * string: an unlisted value is rejected by the subscribe route as an invalid
   * email, so a typo here would silently capture nothing.
   */
  source: NewsletterSource;
  subheading?: string;
  /**
   * Wrapper classes. The default spaces the capture off the text above it in a
   * plain stacked header; a caller that already gives it a surface of its own
   * (the patterns header boxes it) passes an empty string so the padding is
   * not applied twice.
   */
  className?: string;
}) {
  return (
    <div className={className}>
      <InlineNewsletterSignup
        variant="news"
        source={source}
        customSubheading={subheading}
      />
    </div>
  );
}
