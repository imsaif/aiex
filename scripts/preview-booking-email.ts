/**
 * Writes the event booking confirmation email to a local HTML file, so it can be
 * reviewed without a real payment. Usage:
 *   npx tsx scripts/preview-booking-email.ts <slug> <out.html>
 */
import { writeFileSync } from 'fs';
import { getEvent, EVENTS } from '../src/data/events';
import { bookingEmail } from '../src/lib/events/booking-email';

const slug = process.argv[2] ?? EVENTS[0].slug;
const out = process.argv[3] ?? 'booking-email-preview.html';
const event = getEvent(slug);
if (!event) throw new Error(`No event with slug ${slug}`);
const mail = bookingEmail(event, 'Priya Sharma', 'file://' + process.cwd() + '/public');
writeFileSync(out, `<!-- ${mail.subject} -->\n${mail.html}`);
console.log(mail.subject);
console.log(`Wrote ${out}`);
