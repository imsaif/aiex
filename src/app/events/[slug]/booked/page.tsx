import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventShell from '@/components/events/EventShell';
import EventBookedTracker from '@/components/events/EventBookedTracker';
import { EVENTS, getEvent, formatEventDate, googleCalendarUrl } from '@/data/events';

// The Dodo link's redirect_url points here. Reached after booking, so it stays
// out of the index and the sitemap. It is still public to anyone with the URL,
// which is why the session link is never shown here: it goes out by email.
export const metadata: Metadata = {
  title: 'You are booked',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

const linkClass = 'text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2';

export default async function EventBookedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  const { day, timeRange } = formatEventDate(event);

  const steps = [
    {
      title: 'Install Claude Code',
      body: (
        <>
          Follow the install lesson in the free{' '}
          <Link href="/guides/claude-code-learning-path" className={linkClass}>
            Claude Code course
          </Link>
          . On Windows, open a new PowerShell window after installing, so the <code>claude</code> command is found.
        </>
      ),
    },
    {
      title: 'Sign in with your own account',
      body: (
        <>
          Run <code>claude</code> in a terminal and sign in with your paid Claude plan, or use your own Anthropic API key.
        </>
      ),
    },
    {
      title: 'Send a screenshot',
      body: (
        <>
          Ask Claude Code anything, then email a screenshot of its reply to{' '}
          <a href={`mailto:${event.contactEmail}?subject=${encodeURIComponent(`Setup check: ${event.title}`)}`} className={linkClass}>
            {event.contactEmail}
          </a>{' '}
          from the email you booked with. The session link comes back to you by email.
        </>
      ),
    },
  ];

  return (
    <EventShell>
      <EventBookedTracker slug={event.slug} />
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
        <div className="text-center mb-10 pt-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">You are booked.</h1>
          <p className="text-lg text-text-primary">{event.title}</p>
          <p className="text-text-secondary mb-5">
            {day}, {timeRange}
          </p>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium border border-border-primary text-text-primary bg-surface-primary hover:bg-background-secondary transition-colors"
          >
            Add to Google Calendar
          </a>
        </div>

        <h2 className="text-xl font-semibold mb-2">One thing to do before the day</h2>
        <p className="text-text-secondary mb-6">
          Get Claude Code running on your own account, so the session goes on building rather than setup.
        </p>

        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={step.title} className="p-6 rounded-2xl border border-border-primary bg-surface-primary">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-subtle text-accent-primary text-sm font-semibold mb-4">
                {i + 1}
              </span>
              <h3 className="font-semibold mb-2 text-text-primary">{step.title}</h3>
              <p className="text-sm text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Stuck on setup? Email the error message to {event.contactEmail} and I will help you fix it before the session.
        </p>
      </div>
    </EventShell>
  );
}
