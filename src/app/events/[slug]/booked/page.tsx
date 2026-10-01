import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatBubbleLeftEllipsisIcon, MapPinIcon, VideoCameraIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import EventShell from '@/components/events/EventShell';
import EventCover from '@/components/events/EventCover';
import EventBookedTracker from '@/components/events/EventBookedTracker';
import BookedSentTo from '@/components/events/BookedSentTo';
import RoughIcon from '@/components/events/RoughIcon';
import { eventTheme } from '@/components/events/theme';
import { EVENTS, getEvent, formatEventDate, googleCalendarUrl } from '@/data/events';

// The Dodo link's redirect_url points here. Reached after booking, so it stays
// out of the index and the sitemap. It is still public to anyone with the URL,
// which is why the session link is never shown here: it goes out by email.
export const metadata: Metadata = {
  title: 'Your seat is confirmed',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

const linkClass = 'text-text-primary font-medium underline underline-offset-2 hover:text-text-secondary';

export default async function EventBookedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  const { day, timeRange, month, dayNum } = formatEventDate(event);

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
          Ask Claude Code anything, then reply to your confirmation email with a screenshot of its answer. No email
          yet? Send it to{' '}
          <a
            href={`mailto:${event.contactEmail}?subject=${encodeURIComponent(`Setup check: ${event.title}`)}`}
            className={linkClass}
          >
            {event.contactEmail}
          </a>{' '}
          from the email you booked with.
        </>
      ),
    },
  ];

  const hero = (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-2 pb-12 md:pb-16 grid gap-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-x-16 items-center">
      <EventCover event={event} />

      <div className="min-w-0">
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-4" style={{ color: 'var(--text-hero)' }}>
          Your seat is confirmed.
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-text-primary mb-8">
          {event.title}. <BookedSentTo slug={event.slug} contactEmail={event.contactEmail} />
        </p>

        <div className="p-6 rounded-2xl bg-surface-primary flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary flex flex-col items-center justify-center leading-none">
                <span className="text-[10px] font-semibold text-text-secondary">{month}</span>
                <span className="text-lg font-bold text-text-primary">{dayNum}</span>
              </span>
              <div>
                <p className="font-medium text-text-primary">{day}</p>
                <p className="text-sm text-text-secondary">{timeRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary flex items-center justify-center text-text-secondary">
                <RoughIcon icon={event.format === 'online' ? VideoCameraIcon : MapPinIcon} />
              </span>
              <div>
                {event.format === 'online' ? (
                  <>
                    <p className="font-medium text-text-primary">Online{event.platform ? `, on ${event.platform}` : ''}</p>
                    <p className="text-sm text-text-secondary">Link emailed after your setup check</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-text-primary">{event.venue?.name}</p>
                    <p className="text-sm text-text-secondary">{event.venue?.area}. Exact address by email.</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto shrink-0 items-center justify-center px-7 py-3.5 rounded-xl font-medium bg-accent-primary text-text-on-accent hover:bg-accent-hover transition-colors"
          >
            Add to Google Calendar
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <EventShell hero={hero} theme={event.theme}>
      <EventBookedTracker slug={event.slug} />
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <section className="rounded-2xl border border-border-primary bg-surface-primary overflow-hidden">
          <h2 className="px-6 py-4 flex items-center gap-3 text-sm font-medium text-text-primary bg-background-secondary border-b border-border-primary">
            <RoughIcon icon={WrenchScrewdriverIcon} />
            One thing to do before the day
          </h2>
          <div className="p-6 md:p-7">
            <p className="leading-relaxed text-text-primary mb-6">
              Get Claude Code running on your own account, so the session goes on building rather than setup.
            </p>
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className={`w-8 h-8 shrink-0 rounded-full ${eventTheme(event.theme).soft} text-text-primary flex items-center justify-center text-sm font-semibold`}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border-primary bg-surface-primary overflow-hidden">
          <h2 className="px-6 py-4 flex items-center gap-3 text-sm font-medium text-text-primary bg-background-secondary border-b border-border-primary">
            <RoughIcon icon={ChatBubbleLeftEllipsisIcon} />
            Stuck on setup?
          </h2>
          <p className="p-6 md:p-7 leading-relaxed text-text-primary">
            Email the error message to{' '}
            <a href={`mailto:${event.contactEmail}?subject=${encodeURIComponent(`Setup help: ${event.title}`)}`} className={linkClass}>
              {event.contactEmail}
            </a>{' '}
            and I will help you fix it before the session.
          </p>
        </section>
      </div>
    </EventShell>
  );
}
