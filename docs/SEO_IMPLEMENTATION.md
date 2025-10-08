# SEO Implementation Guide

This document explains the SEO meta tags implementation for the AI Design Patterns project.

## What Has Been Implemented

### 1. SEO Configuration (`src/config/seo.ts`)
Centralized configuration file containing:
- Site metadata (name, description, URL)
- Default OpenGraph configuration
- Twitter card defaults
- Author and social media links
- SEO keywords

### 2. Metadata Utilities (`src/utils/metadata.ts`)
Helper functions for generating consistent metadata across pages:
- `generateMetadata()` - Generic metadata generator
- `generatePatternMetadata()` - Specialized for pattern pages
- `generateHomeMetadata()` - Homepage metadata
- `generateSearchMetadata()` - Search page metadata

### 3. Enhanced Root Layout (`src/app/layout.tsx`)
Updated with:
- Complete OpenGraph tags
- Twitter card configuration
- Viewport settings
- Theme color for light/dark mode
- metadataBase for absolute URLs

### 4. Page-Specific Metadata

#### Homepage (`src/app/page.tsx`)
- Title: "AI Design Patterns - Discover AI UX Patterns & Best Practices"
- Meta description: 155-160 characters optimized for SEO
- Unique OpenGraph image
- Full Twitter card support

#### Pattern Pages (`src/app/patterns/[slug]/page.tsx`)
- Dynamic titles: "[Pattern Name] | AI Design Patterns"
- Truncated descriptions (150-160 chars)
- Article type OpenGraph metadata
- Pattern-specific thumbnails as OG images
- Category and tag-based keywords

#### Search Page (`src/app/search/page.tsx`)
- Search-specific metadata
- Optimized for search discovery
- Full social media card support

## What You Need to Do

### 1. Create OpenGraph Images

Create the following images in `public/images/og/`:

#### Required Images:
- **og-home.png** (1200x630px)
  - Homepage/default OpenGraph image
  - Should showcase AI Design Patterns brand
  - Include tagline: "Discover 24+ AI UX Patterns"

- **og-pattern-default.png** (1200x630px)
  - Default image for pattern pages
  - Generic AI design pattern visual
  - Used when pattern doesn't have a thumbnail

#### Design Guidelines:
- Dimensions: 1200x630px (Facebook/Twitter requirement)
- Format: PNG or JPG
- File size: Under 1MB
- High contrast for readability
- Brand colors and typography
- Avoid mentioning specific pattern counts

#### Tools You Can Use:
- Figma (recommended)
- Canva
- Adobe Photoshop
- [Social Sizes](https://socialsizes.io/)
- [OG Image](https://og-image.vercel.app/)

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the site URL in `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
   ```

3. For Vercel deployment, add the environment variable in project settings.

### 3. Test SEO Implementation

#### Local Testing:
```bash
npm run dev
```

Then visit:
- http://localhost:3000/ - Check homepage metadata
- http://localhost:3000/patterns/contextual-assistance - Check pattern page
- http://localhost:3000/search - Check search page

Use browser DevTools > Elements tab to inspect `<head>` section.

#### Social Media Testing Tools:
1. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Paste your URL and click "Debug"
   - Shows how your page appears when shared on Facebook

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Enter your URL to preview Twitter card

3. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Validates how posts appear on LinkedIn

4. **Meta Tags Checker**
   - https://metatags.io/
   - Comprehensive preview across all platforms

### 4. Update sitemap.xml (Recommended)

Create `src/app/sitemap.ts` for better SEO:

```typescript
import { MetadataRoute } from 'next';
import patterns from '@/data/patterns';
import { siteConfig } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const patternUrls = patterns.map((pattern) => ({
    url: `${siteConfig.url}/patterns/${pattern.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...patternUrls,
  ];
}
```

### 5. Create robots.txt (Recommended)

Create `src/app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

## SEO Features Summary

✅ **Implemented:**
- [x] Page titles (unique per page)
- [x] Meta descriptions (150-160 characters)
- [x] OpenGraph tags (title, description, type, url, siteName)
- [x] Twitter card meta tags (summary_large_image)
- [x] Canonical URLs
- [x] Viewport and theme color
- [x] Keywords for homepage and patterns
- [x] Article metadata for pattern pages
- [x] Author information
- [x] Social media links

⏳ **Pending (Your Action Required):**
- [ ] Create og-home.png (1200x630px)
- [ ] Create og-pattern-default.png (1200x630px)
- [ ] Set NEXT_PUBLIC_SITE_URL environment variable
- [ ] Test with social media debugging tools
- [ ] Optional: Create sitemap.ts
- [ ] Optional: Create robots.ts

## File Structure

```
src/
├── config/
│   └── seo.ts                      # SEO configuration
├── utils/
│   └── metadata.ts                 # Metadata utilities
├── app/
│   ├── layout.tsx                  # Enhanced with full metadata
│   ├── page.tsx                    # Homepage with metadata
│   ├── home-client.tsx             # Homepage client component
│   ├── patterns/
│   │   └── [slug]/
│   │       └── page.tsx            # Pattern pages with metadata
│   └── search/
│       ├── page.tsx                # Search page with metadata
│       └── search-client.tsx       # Search client component
public/
└── images/
    └── og/
        ├── README.md               # OG images documentation
        ├── og-home.png             # ⚠️ TO BE CREATED
        └── og-pattern-default.png  # ⚠️ TO BE CREATED
```

## Testing Checklist

Before deploying:
- [ ] View page source and verify all meta tags are present
- [ ] Test homepage with Facebook Debugger
- [ ] Test pattern page with Twitter Card Validator
- [ ] Test search page with LinkedIn Post Inspector
- [ ] Verify OpenGraph images display correctly
- [ ] Check mobile viewport rendering
- [ ] Verify canonical URLs are correct
- [ ] Test light/dark theme color switching

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Article](https://schema.org/Article)
- [Google Search Central](https://developers.google.com/search/docs)

## Support

If you encounter any issues:
1. Check the console for TypeScript errors
2. Verify environment variables are set correctly
3. Ensure OpenGraph images exist at specified paths
4. Clear Next.js cache: `rm -rf .next && npm run build`
