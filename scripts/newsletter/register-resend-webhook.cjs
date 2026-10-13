#!/usr/bin/env node
// One-time: point Resend's email events at /api/webhooks/resend so the admin
// Growth page can show newsletter clicks. Prints the signing secret, which goes
// into Vercel as RESEND_WEBHOOK_SECRET (Production), then redeploy.
//
//   node scripts/newsletter/register-resend-webhook.cjs          # dry run: lists existing webhooks
//   node scripts/newsletter/register-resend-webhook.cjs --apply  # creates it (skips if one exists)
require('dotenv').config({ path: '.env.local', quiet: true });
const { Resend } = require('resend');

const ENDPOINT = 'https://www.aiuxdesign.guide/api/webhooks/resend';
const EVENTS = ['email.delivered', 'email.clicked', 'email.bounced', 'email.complained'];

(async () => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data: list, error: listError } = await resend.webhooks.list();
  if (listError) throw new Error(listError.message);
  const existing = (list?.data || []).find((w) => w.endpoint === ENDPOINT);
  console.log('existing webhooks:', (list?.data || []).map((w) => w.endpoint).join(', ') || 'none');
  if (existing) {
    console.log('Already registered for', ENDPOINT, '- nothing to do. Its secret is in the Resend dashboard.');
    return;
  }
  if (!process.argv.includes('--apply')) {
    console.log('Dry run. Re-run with --apply to register', ENDPOINT, 'for', EVENTS.join(', '));
    return;
  }
  const { data, error } = await resend.webhooks.create({ endpoint: ENDPOINT, events: EVENTS });
  if (error) throw new Error(error.message);
  console.log('Registered webhook', data.id);
  console.log('RESEND_WEBHOOK_SECRET=' + data.signing_secret);
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
