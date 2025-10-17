# Newsletter Subscription System

Complete newsletter subscription system for AI UX Patterns, built with Prisma, Resend, and Next.js API routes.

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
- `prisma` - ORM for database management
- `@prisma/client` - Prisma client for database queries
- `resend` - Email delivery service

### 2. Database Setup

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
# Get your Resend API key from: https://resend.com/api-keys
RESEND_API_KEY=re_your_actual_api_key_here

# Generate a secure API key for newsletter updates
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEWSLETTER_API_KEY=your_secure_random_key_here

# Site URL (use production URL in production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Generate an API key
4. Add it to `.env.local`

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

Emails are sent from: `AI UX Patterns <noreply@aiux.design>`

To customize:
1. Edit sender in API route files:
   - `src/app/api/newsletter/subscribe/route.ts`
   - `src/app/api/newsletter/send-update/route.ts`
2. Verify your domain in Resend dashboard
3. Update `from` field in email sending functions

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

### Environment Variables

Set in production (Vercel, etc.):
```
RESEND_API_KEY=re_your_production_key
NEWSLETTER_API_KEY=your_secure_production_key
NEXT_PUBLIC_SITE_URL=https://aiux.design
DATABASE_URL=postgresql://... (if using PostgreSQL)
```

### Database Migration

To migrate from SQLite to PostgreSQL:

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
- Check `.env.local` file exists
- Ensure API key is set correctly
- Restart dev server after adding

### "NEWSLETTER_API_KEY is not configured"
- Generate secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add to `.env.local`

### "Make sure your dev server is running"
- Start server: `npm run dev`
- Ensure running on port 3000
- Check for TypeScript errors

### Emails not sending
- Verify Resend API key is valid
- Check Resend dashboard for errors
- Ensure domain is verified (or use test domain)
- Check server logs for errors

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
