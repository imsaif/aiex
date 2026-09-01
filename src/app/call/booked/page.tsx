import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingEmbed from '@/components/call/BookingEmbed';
import { CALL_OFFER, CAL_BOOKING_URL } from '@/lib/call-offer';

// The Dodo Static Payment Link's redirect_url points here. Reached only after
// paying, so it is deliberately kept out of the index and out of the sitemap.
export const metadata: Metadata = {
  title: 'Pick a time for your session',
  robots: { index: false, follow: false },
};

export default function CallBookedPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      <section className="pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Payment received — now pick your time
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Choose any slot below and your {CALL_OFFER.durationLabel} session is
              confirmed. Send your repo, Figma file, or a note about where you are
              stuck when you book, so we start on the problem rather than the setup.
            </p>
          </div>

          <BookingEmbed />

          {/* If someone closes this tab before booking, the receipt email is the
              only way back. Paste the booking link into the Dodo receipt template. */}
          {CAL_BOOKING_URL && (
            <p className="mt-6 text-center text-sm text-text-secondary">
              Calendar not loading?{' '}
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2"
              >
                Open it in a new tab
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
