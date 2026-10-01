'use client';

import { useEffect, useState } from 'react';

export const sentToKey = (slug: string) => `event-booked-email:${slug}`;
export const SENT_TO_CHANGED = 'event-booked-email-changed';

/**
 * Names the address the confirmation was sent to, so a buyer who mistyped their
 * email at checkout notices on the spot instead of waiting for an email that
 * never comes (the first live test booking did exactly that).
 *
 * The address comes from Dodo's redirect (`?email=`). EventBookedTracker strips
 * it from the address bar and keeps it for this tab only (sessionStorage), so it
 * survives a reload but never lingers in history or a shared link.
 */
export function BookedSentTo({ slug, contactEmail }: { slug: string; contactEmail: string }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const read = () => {
      try {
        setEmail(window.sessionStorage.getItem(sentToKey(slug)) ?? '');
      } catch {
        setEmail('');
      }
    };
    read();
    window.addEventListener(SENT_TO_CHANGED, read);
    return () => window.removeEventListener(SENT_TO_CHANGED, read);
  }, [slug]);

  if (!email) return <>A confirmation with these details is on its way to your inbox.</>;

  return (
    <>
      Your confirmation is on its way to <strong className="font-semibold break-words">{email}</strong>. Wrong
      address?{' '}
      <a
        href={`mailto:${contactEmail}?subject=${encodeURIComponent('Wrong email on my booking')}`}
        className="underline underline-offset-2 hover:text-text-secondary"
      >
        Email {contactEmail}
      </a>{' '}
      with the right one.
    </>
  );
}

export default BookedSentTo;
