# Newsletter Subscription System

Complete newsletter subscription system for AI UX Patterns. Subscriber list + draft newsletters live in Prisma/Postgres. Welcome emails and newsletter delivery go through **Beehiiv (free tier)** — admin publishes a draft in our admin UI, then copies the HTML into a new Beehiiv post to send. Transactional emails (audit reports, admin alerts) go through **Resend (free tier)** — ~150 emails/month, well under the 3,000/month cap.

## Features

✅ Email subscription via footer form
✅ Welcome email on subscription
✅ Pattern update notifications
✅ One-click unsubscribe
✅ Duplicate subscription handling
✅ Active/inactive subscriber management
✅ SQLite database (easy to migrate to PostgreSQL)

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `prisma` / `@prisma/client` — ORM for subscriber + draft storage
- `resend` — transactional email (audit reports, admin alerts)
- Beehiiv is used via direct `fetch` calls — no SDK required

### 2. Database Setup

**For Production (Vercel):**
- ⚠️ **SQLite doesn't work on Vercel** (read-only filesystem)
- ✅ **Use PostgreSQL** (free tier available)
- 📖 **See [Vercel Postgres Setup Guide](./VERCEL_POSTGRES_SETUP.md)** for complete instructions

**For Local Development:**
The database has been initialized with SQLite. To regenerate or migrate:

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# Resend — transactional email (audit reports, admin alerts)
RESEND_API_KEY=re_your_actual_api_key_here

# Beehiiv — newsletter delivery + subscriber sync + welcome automations
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=pub_xxx

# Admin API key (for /api/newsletter/send-update)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEWSLETTER_API_KEY=your_secure_random_key_here

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Provision Resend (free tier)

1. Sign up at [resend.com](https://resend.com).
2. Verify your sending domain (`aiuxdesign.guide`) — add DKIM CNAMEs to DNS.
3. Generate an API key and add it to `.env.local` + Vercel production env.
4. Free tier caps: **100 emails/day, 3,000/month, 30-day log retention**. At normal volumes (audit reports + admin pings) we use ~5% of that cap.

### 5. Provision Beehiiv (free tier)

1. Create a Beehiiv publication (or use existing) — free plan is fine.
2. Generate an API key under Settings → API.
3. In Subscribers → Custom Fields, add a string field named `signup_source`.
4. Turn on publication-level welcome emails.
5. Create Automations keyed on the `signup_source` custom field for: `direct`, `handbook`, `audit`, `audit-kit`, `news`, `guides`, `agentic-checklist`. Each Automation sends its own welcome email variant.
6. Broadcast delivery: admin publishes a draft in our admin UI, clicks "Copy HTML", and pastes into a new Beehiiv post to send. The Beehiiv Posts API is Enterprise-only, so delivery is intentionally manual on the free tier.

## Usage

### Subscribe to Newsletter

Users can subscribe via the footer form on any page. The form:
- Validates email format
- Shows loading state during submission
- Displays success/error messages
- Sends welcome email automatically

### Send Pattern Update Notifications

When you add new patterns, notify subscribers:

```bash
# Interactive mode (recommended)
npm run send-newsletter

# Specify patterns directly
npm run send-newsletter -- --patterns contextual-assistance
npm run send-newsletter -- --patterns adaptive-interfaces,explainable-ai
```

The script will:
1. Show available patterns
2. Let you select patterns to announce
3. Confirm before sending
4. Send emails to all active subscribers
5. Show success/failure statistics

### Unsubscribe

Users can unsubscribe via:
- Link in email footer
- GET request: `/api/newsletter/unsubscribe?token=TOKEN`
- POST request: `/api/newsletter/unsubscribe` with `{ token: "TOKEN" }`

## API Endpoints

### POST `/api/newsletter/subscribe`

Subscribe a user to the newsletter.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed! Check your email for confirmation.",
  "subscriberId": "clx..."
}
```

### POST/GET `/api/newsletter/unsubscribe`

Unsubscribe a user from the newsletter.

**Request (POST):**
```json
{
  "token": "unsubscribe_token_here"
}
```

**Request (GET):**
```
/api/newsletter/unsubscribe?token=unsubscribe_token_here
```

### POST `/api/newsletter/send-update`

Send pattern update notifications to all active subscribers (requires API key).

**Request:**
```json
{
  "apiKey": "your_newsletter_api_key",
  "patterns": [
    {
      "id": "1",
      "title": "Contextual Assistance",
      "description": "Pattern description...",
      "slug": "contextual-assistance",
      "category": "Performance & Efficiency"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Pattern update emails sent",
  "totalSubscribers": 150,
  "successCount": 148,
  "failureCount": 2
}
```

## Database Schema

```prisma
model Subscriber {
  id                String   @id @default(cuid())
  email             String   @unique
  subscribedAt      DateTime @default(now())
  active            Boolean  @default(true)
  unsubscribeToken  String   @unique @default(cuid())
  updatedAt         DateTime @updatedAt
}
```

### Fields

- `id` - Unique identifier (cuid)
- `email` - Subscriber email (unique)
- `subscribedAt` - Subscription timestamp
- `active` - Subscription status (soft delete)
- `unsubscribeToken` - Token for unsubscribe links
- `updatedAt` - Last update timestamp

## Email Templates

### Welcome Email
- Sent on subscription
- Confirms subscription
- Links to pattern library
- Includes unsubscribe link

### Pattern Update Email
- Sent when new patterns are added
- Lists new patterns with descriptions
- Links to each pattern
- Links to full pattern library
- Includes unsubscribe link

## Email Configuration

Senders:
- **Beehiiv emails** (welcome automations + newsletter broadcasts) — configured in Beehiiv publication settings.
- **Resend transactional** — `from:` is hard-coded per route (e.g. `AI UX Patterns <imran@aiuxdesign.guide>`). Verify the sending domain in Resend before using a new `from` address.

## Testing

### Test Subscription Flow

1. Start dev server: `npm run dev`
2. Navigate to homepage
3. Scroll to footer
4. Enter test email
5. Click subscribe button
6. Check email for welcome message

### Test Pattern Updates

1. Ensure dev server is running
2. Run: `npm run send-newsletter`
3. Select pattern(s) to announce
4. Confirm sending
5. Check subscriber emails

### View Database

```bash
# Open Prisma Studio
npx prisma studio
```

This opens a web interface to view/edit subscribers.

## Production Deployment

### ⚠️ Important: Database for Production

**Vercel requires PostgreSQL** (SQLite doesn't work in serverless):

1. **Setup Vercel Postgres** (5 minutes)
   - See complete guide: [Vercel Postgres Setup](./VERCEL_POSTGRES_SETUP.md)
   - Create database in Vercel dashboard
   - Run migration: `npx prisma migrate deploy`

2. **Environment Variables**

Set in production (Vercel):
```
RESEND_API_KEY=re_your_production_key
BEEHIIV_API_KEY=your_beehiiv_production_key
BEEHIIV_PUBLICATION_ID=pub_xxx
NEWSLETTER_API_KEY=your_secure_production_key
NEXT_PUBLIC_SITE_URL=https://www.aiuxdesign.guide
DATABASE_URL=<Vercel provides this automatically>
```

### Database Migration

Already done! Schema uses PostgreSQL. To apply migration:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migration:
```bash
npx prisma migrate dev --name switch_to_postgresql
```

3. Deploy migration:
```bash
npx prisma migrate deploy
```

## Troubleshooting

### "RESEND_API_KEY is not defined"
- Check `.env.local` (dev) and Vercel env (prod) have `RESEND_API_KEY` set
- Restart dev server after adding

### "NEWSLETTER_API_KEY is not configured"
- Generate secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add to `.env.local`

### Transactional emails not arriving
- Check the [Resend dashboard](https://resend.com/emails) for per-email delivery status + bounce reports
- Confirm the sending domain is verified in Resend → Domains
- Free tier caps: 100/day, 3,000/month. If you're hitting limits, that's visible in the Resend dashboard.

### Welcome email not arriving after signup
- Beehiiv publication-level welcome emails must be enabled (Settings → Emails)
- Check the subscriber appears in Beehiiv with the correct `signup_source` custom field
- Verify the matching Beehiiv Automation is Active and keyed on the right `signup_source` value

### Newsletter published on-site but subscribers didn't receive it
- That's expected. Admin must click "Copy HTML" in `/admin/newsletter` then paste into a new Beehiiv post and send from Beehiiv dashboard.
- Beehiiv free tier has no Posts API, so automatic delivery isn't available.

## Maintenance

### View Subscribers

```bash
npx prisma studio
```

### Export Subscribers

```bash
# Using Prisma Studio's export feature
# Or create a custom script
```

### Clean Inactive Subscribers

```sql
-- Using Prisma Studio
DELETE FROM Subscriber WHERE active = false AND updatedAt < date('now', '-30 days');
```

## Future Enhancements

Potential improvements:
- Admin dashboard for subscriber management
- Subscriber preferences (frequency, topics)
- Email analytics (open rates, click rates)
- Scheduled newsletters
- RSS to email automation
- Subscriber segmentation by interests
- Double opt-in confirmation
- Export subscribers to CSV
- A/B testing for email content
- Email templates customization UI

## Support

For issues or questions:
- Create an issue on GitHub
- Contact: imranrizom@gmail.com
- Documentation: See CLAUDE.md for project details
