/**
 * Paid events, sold on this site instead of Luma. One entry per event; the page
 * at /events/[slug] and its post-payment page at /events/[slug]/booked are both
 * built from it.
 *
 * Why not Luma: a free ticket with "Require approval" left ~100 people believing
 * they were already in, so nobody paid and nobody came (Sep 2026). Here paying is
 * the only way in, so there is no pending state to misread.
 *
 * Payment happens on a Dodo Static Payment Link, NOT in this repo (same decision
 * as /call, see src/lib/call-offer.ts): no checkout code, no webhook, no payment
 * state in the database. Each event's Dodo link must set its redirect_url to
 * /events/<slug>/booked.
 *
 * The session link (or full venue address, if it is kept private) is never put
 * here. /events/<slug>/booked is noindex but public, so anything on it is free to
 * anyone who guesses the URL. It goes out by email after the setup check.
 */

export type EventFormat = 'online' | 'in-person';

export interface EventHost {
  name: string;
  role: string;
  /** Path under /public. Initials are shown when absent. */
  photo?: string;
  url?: string;
  /** Sites shown under the host, e.g. their products. */
  links?: { label: string; url: string }[];
}

export interface EventVenue {
  name: string;
  /** Shown on the page and used for the map. */
  address: string;
  area: string;
}

export interface EventItem {
  slug: string;
  title: string;
  /** One line under the title. */
  tagline: string;
  /** Path under /public, ideally square (1080x1080). A typographic cover is drawn when absent. */
  coverImage?: string;
  /** Optional animated cover: the same illustration split into an ink layer and a dot layer. */
  coverLayers?: { lines: string; dots: string };
  /**
   * Photos from a past session, shown as proof the session is real. Pick
   * building moments over faces; get attendees' OK for any clear face.
   */
  photos?: { title: string; items: { src: string; alt: string }[] };
  /** Wide (2:1) PNG of the cover for the top of the confirmation email. Email clients need PNG or JPG. */
  emailBanner?: string;
  /** ISO 8601 with offset, e.g. 2026-10-10T10:00:00+05:30. */
  start: string;
  end: string;
  format: EventFormat;
  /** For online events: what the call runs on. */
  platform?: string;
  /** For in-person events. */
  venue?: EventVenue;
  /** Keep in sync with the amount on the Dodo link. */
  priceLabel: string;
  /** Same price as a number and ISO currency, for Google's event listing. */
  price: number;
  currency: string;
  /** Shown as a limit. Dodo links do not cap quantity, so closing early is manual. */
  seats?: number;
  /** Dodo Static Payment Link. Empty keeps registration closed. */
  paymentLink: string;
  /**
   * Dodo product id (pdt_...) behind the payment link. The payment webhook uses
   * it to tell which event was booked. Add `?metadata_event=<slug>` to the link
   * as well, as a second way to match.
   */
  dodoProductId?: string;
  host: EventHost;
  about: string[];
  whyAttend: { title: string; body: string }[];
  whoFor: string[];
  /** Each part of the session. Drawn as a timeline sized by duration, ending at `end`. */
  agenda: { time: string; label: string; item: string }[];
  /** Said before the pay button: costs on top of the ticket belong here. */
  bring: string[];
  finePrint: string[];
  /** Where buyers send their setup screenshot. Already public on the site. */
  contactEmail: string;
}

export const EVENTS: EventItem[] = [
  {
    slug: 'claude-code-hands-on-oct-10',
    title: 'Claude Code, Hands-On: Build a Real Feature',
    tagline: 'Build one working feature on your own project in 90 minutes, with help when you get stuck.',
    start: '2026-10-10T10:00:00+05:30',
    end: '2026-10-10T11:30:00+05:30',
    coverImage: '/images/events/claude-code-hands-on-oct-10/cover.webp',
    coverLayers: {
      lines: '/images/events/claude-code-hands-on-oct-10/lines.webp',
      dots: '/images/events/claude-code-hands-on-oct-10/dots.webp',
    },
    emailBanner: '/images/events/claude-code-hands-on-oct-10/email-banner.png',
    photos: {
      title: 'From the last session, 19 September',
      items: [
        { src: '/images/events/claude-code-hands-on-oct-10/photos/sep-19-teaching.webp', alt: 'The host explaining the plan to the room while attendees work on their laptops' },
        { src: '/images/events/claude-code-hands-on-oct-10/photos/claude-code-terminal.webp', alt: 'Claude Code open in a terminal, ready for a first prompt' },
        { src: '/images/events/claude-code-hands-on-oct-10/photos/sep-19-helping.webp', alt: 'Attendees working side by side on their own laptops' },
        { src: '/images/events/claude-code-hands-on-oct-10/photos/sep-19-building.webp', alt: 'Someone working on a laptop, with attendees building in the background' },
      ],
    },
    format: 'in-person',
    // TODO(Imran): replace with the exact street address once confirmed.
    venue: {
      name: '@Work Gachibowli',
      address: 'Gachibowli, Hyderabad',
      area: 'Gachibowli, Hyderabad',
    },
    priceLabel: '₹599',
    price: 599,
    currency: 'INR',
    seats: 24,
    // Public checkout URL: the event tag lets the webhook match the payment, and
    // redirect_url lands buyers on the setup page after paying.
    paymentLink:
      'https://checkout.dodopayments.com/buy/pdt_0Nomwsk4JuVGedtPxubYL?quantity=1' +
      '&redirect_url=' + encodeURIComponent('https://www.aiuxdesign.guide/events/claude-code-hands-on-oct-10/booked') +
      '&metadata_event=claude-code-hands-on-oct-10',
    dodoProductId: 'pdt_0Nomwsk4JuVGedtPxubYL',
    host: {
      name: 'Imran Mohammed',
      role: 'Founder of aiuxdesign.guide and designwithclaude.com',
      url: 'https://www.imranai.design',
      links: [
        { label: 'aiuxdesign.guide', url: 'https://www.aiuxdesign.guide' },
        { label: 'designwithclaude.com', url: 'https://designwithclaude.com' },
      ],
    },
    // DRAFT copy for Imran to edit. Keep claims to what the session actually does.
    about: [
      'A small, hands-on session where you build with Claude Code instead of watching a demo of it.',
      'You bring a project, or pick one of the starter ideas. We agree what the feature is, plan it with Claude Code, then build it. By the end you have something working and a repeatable way to do it again on your own.',
    ],
    whyAttend: [
      { title: 'Leave with something built', body: 'A working feature on your own project, not notes about one.' },
      { title: 'Setup is solved before the day', body: 'Everyone shows Claude Code running before the session, so the 90 minutes go on building.' },
      { title: 'Help when you get stuck', body: 'A small group, so questions get answered as they come up.' },
    ],
    whoFor: [
      'Designers who want to build, not just prototype in Figma.',
      'Developers new to Claude Code who want a guided first project.',
      'Anyone who installed Claude Code and stalled on what to do next.',
    ],
    agenda: [
      { time: '10:00', label: 'Kick off', item: 'Welcome, and pick the feature each person will build' },
      { time: '10:10', label: 'Plan', item: 'Plan it with Claude Code: brief, plan mode, agreeing the scope' },
      { time: '10:25', label: 'Build', item: 'Build it, with help as you go' },
      { time: '11:15', label: 'Show', item: 'Show what you built, and what to try next on your own' },
    ],
    bring: [
      'Your own paid Claude plan (Pro or higher) or Anthropic API credits. Free Claude accounts cannot run Claude Code.',
      'A laptop running macOS, Windows or Linux, where you can install software.',
      'About 20 minutes before the day to install Claude Code and check it runs.',
    ],
    finePrint: [
      'Your seat is confirmed as soon as you book. There is no waiting list or approval step.',
      'Before the day, show Claude Code running on your own account, so the session goes on building rather than setup.',
      'Booking takes a minute and accepts UPI and cards.',
    ],
    contactEmail: 'imranrizom@gmail.com',
  },
];

export const getEvent = (slug: string): EventItem | undefined =>
  EVENTS.find((e) => e.slug === slug);

/** Registration opens only once there is a link to pay on. */
export const isRegistrationOpen = (event: EventItem): boolean =>
  event.paymentLink.length > 0 && new Date(event.end).getTime() > Date.now();

const TZ = 'Asia/Kolkata';

export const formatEventDate = (event: EventItem) => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const day = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ }).format(start);
  const time = (d: Date) =>
    new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ }).format(d);
  const month = new Intl.DateTimeFormat('en-IN', { month: 'short', timeZone: TZ }).format(start).toUpperCase();
  const dayNum = new Intl.DateTimeFormat('en-IN', { day: 'numeric', timeZone: TZ }).format(start);
  const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: TZ }).format(start);
  return { day, weekday, timeRange: `${time(start)} to ${time(end)} IST`, month, dayNum };
};

/** Google Calendar "add event" link. */
export const googleCalendarUrl = (event: EventItem): string => {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const where = event.format === 'online' ? `Online (${event.platform ?? 'link by email'})` : (event.venue ? `${event.venue.name}, ${event.venue.address}` : '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${fmt(event.start)}/${fmt(event.end)}`,
    details: `${event.tagline}\n\nhttps://www.aiuxdesign.guide/events/${event.slug}`,
    location: where,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/** Minutes since midnight for an "HH:MM" agenda time. */
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Agenda parts with their length in minutes, the last one running to `end`. */
export const agendaSegments = (event: EventItem) => {
  const endLocal = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  }).format(new Date(event.end));
  const endMin = toMinutes(endLocal);
  return event.agenda.map((a, i) => {
    const next = i + 1 < event.agenda.length ? toMinutes(event.agenda[i + 1].time) : endMin;
    return { ...a, minutes: next - toMinutes(a.time) };
  });
};

export const totalMinutes = (event: EventItem) =>
  Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000);

/**
 * Which event a Dodo payment was for: by product id first, then by the
 * `metadata_event` tag on the payment link.
 */
export const findEventForPayment = (payment: {
  product_cart?: { product_id: string }[] | null;
  metadata?: Record<string, unknown> | null;
}): EventItem | undefined => {
  const ids = new Set((payment.product_cart ?? []).map((p) => p.product_id));
  const byProduct = EVENTS.find((e) => e.dodoProductId && ids.has(e.dodoProductId));
  if (byProduct) return byProduct;
  const tag = payment.metadata?.event;
  return typeof tag === 'string' ? getEvent(tag) : undefined;
};
