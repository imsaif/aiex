# Vercel Postgres Setup Guide

Quick guide to set up PostgreSQL for your newsletter system on Vercel.

## Why PostgreSQL?

SQLite doesn't work on Vercel because:
- ❌ Serverless functions have read-only filesystems
- ❌ No persistent storage between function invocations
- ❌ Database writes fail in production

PostgreSQL is the recommended database for Vercel deployments.

## Setup Steps (5-10 minutes)

### 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose database name (e.g., `aiex-newsletter`)
6. Select region (same as your deployment for best performance)
7. Click **Create**

Vercel will automatically:
- Create the database
- Add environment variables (`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.)
- Connect it to your project

### 2. Update Local Environment (Optional)

If you want to test locally with PostgreSQL:

```bash
# Install PostgreSQL locally (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb aiex

# Update .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/aiex"
```

Or keep using SQLite for local development:
```bash
# .env.local
DATABASE_URL="file:./dev.db"
```

### 3. Generate New Migration

The schema has been updated to use PostgreSQL. Now create a migration:

```bash
# Delete old SQLite migrations
rm -rf prisma/migrations

# Create new PostgreSQL migration
npx prisma migrate dev --name init_postgres

# This will:
# - Create migration files
# - Apply migration to your local database
# - Generate Prisma client
```

### 4. Deploy Migration to Production

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables (includes database URL)
vercel env pull

# Run migration
npx prisma migrate deploy

# Push changes
git add .
git commit -m "Migrate to PostgreSQL for Vercel"
git push
```

**Option B: Manual via GitHub**

```bash
# Commit and push changes
git add .
git commit -m "Migrate to PostgreSQL for Vercel"
git push

# SSH into Vercel deployment (after build) and run:
# npx prisma migrate deploy
```

**Option C: Add to Build Script**

Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma migrate deploy && next build"
  }
}
```

### 5. Verify Setup

Test the newsletter on production:

1. Visit https://www.aiuxdesign.guide
2. Scroll to footer
3. Subscribe with your email
4. Should work! ✅

Check database:
```bash
# View database in Prisma Studio
npx prisma studio
```

## Environment Variables

Vercel automatically sets these when you create Postgres:

```bash
# Vercel provides these automatically:
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Prisma uses DATABASE_URL, so add this in Vercel:
DATABASE_URL="postgres://..."
# Or use Vercel's POSTGRES_PRISMA_URL
```

**In Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` exists
3. If not, add it with value from `POSTGRES_PRISMA_URL`

## Migration Checklist

- [x] Updated Prisma schema to PostgreSQL
- [ ] Created Vercel Postgres database
- [ ] Deleted old SQLite migrations
- [ ] Generated new PostgreSQL migration
- [ ] Deployed migration to production
- [ ] Verified `DATABASE_URL` in Vercel
- [ ] Tested subscription on production site
- [ ] Confirmed email delivery works

## Troubleshooting

### "Module not found" error
```bash
# Regenerate Prisma client
npx prisma generate
```

### Migration fails
```bash
# Check database connection
npx prisma db push --skip-generate
```

### Can't connect to database
- Verify `DATABASE_URL` in Vercel environment variables
- Check database is in same region as deployment
- Ensure database is running

### Subscription still fails
- Check Vercel function logs
- Verify all environment variables are set
- Test API route directly: `/api/newsletter/subscribe`

## Switching Between Databases

**Local Development:**
- Use SQLite: `DATABASE_URL="file:./dev.db"`
- Schema provider: `sqlite`

**Production:**
- Use PostgreSQL: Vercel-provided URL
- Schema provider: `postgresql`

You can have different providers for different environments by using multiple schema files, but it's simpler to use PostgreSQL everywhere.

## Database Costs

**Vercel Postgres Pricing:**
- **Free Tier**:
  - 256 MB storage
  - 1 GB bandwidth
  - Perfect for starting out!
- **Paid Tiers**: Scale as you grow

Your newsletter database will be tiny (few KB per subscriber), so free tier is sufficient for thousands of subscribers.

## Next Steps

1. Complete setup steps above
2. Test subscription on production
3. Send your first newsletter: `npm run send-newsletter`
4. Monitor subscriber growth in Prisma Studio

## Additional Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Migration Guide](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)

Your newsletter system will work perfectly once PostgreSQL is set up! 🚀
