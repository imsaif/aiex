import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Product colors for icon pills
const PRODUCT_COLORS: Record<string, string> = {
  openai: '#10a37f',
  vercel: '#000000',
  figma: '#f24e1e',
  github: '#333333',
  google: '#4285f4',
  microsoft: '#00a4ef',
  supabase: '#3ecf8e',
  replit: '#f26207',
  claude: '#d97706',
  anthropic: '#d97706',
  cursor: '#7c3aed',
  notion: '#000000',
  linear: '#5e6ad2',
  perplexity: '#20808d',
  ubereats: '#06c167',
  posthog: '#1d4aff',
  uber: '#06c167',
};

function getProductColor(name: string): string {
  const lower = name.toLowerCase().replace(/\s+/g, '');
  for (const [key, color] of Object.entries(PRODUCT_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#64748b'; // slate fallback
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing newsletter id', { status: 400 });
  }

  const newsletter = await prisma.newsletterDraft.findUnique({
    where: { id },
    select: {
      title: true,
      type: true,
      publishDate: true,
      structuredData: true,
    },
  });

  if (!newsletter) {
    return new Response('Newsletter not found', { status: 404 });
  }

  // Extract product names from structured data
  const data = newsletter.structuredData as { items?: { product?: string }[] } | null;
  const products = (data?.items || [])
    .map((item) => item.product || '')
    .filter(Boolean)
    .slice(0, 5);

  // Format date
  const date = new Date(newsletter.publishDate);
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isWeekly = newsletter.type === 'weekly';
  const label = isWeekly ? 'Weekly Roundup' : 'Daily';

  // Strip "AI UX Daily: " or "AI UX Weekly: " prefix from title for cleaner display
  const cleanTitle = newsletter.title
    .replace(/^AI UX (Daily|Weekly):\s*/i, '')
    .trim();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f0f0f',
          padding: '60px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 20% 50%, rgba(22, 32, 54, 0.6) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top: Masthead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Heart + sparkle logo */}
            <div
              style={{
                width: '36',
                height: '36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path
                  d="M15.645 26.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C8.688 21.36 6.25 18.174 6.25 14.25 6.25 11.322 8.714 9 11.688 9A5.5 5.5 0 0116 11.052 5.5 5.5 0 0120.313 9c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                  fill="white"
                />
                <path
                  d="M16 16l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"
                  fill="#0f0f0f"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#a3a3a3',
                letterSpacing: '-0.02em',
              }}
            >
              aiuxdesign.guide
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                backgroundColor: isWeekly ? '#7c3aed' : '#162036',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '100px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: cleanTitle.length > 60 ? '44px' : '52px',
              fontWeight: 800,
              color: '#fafafa',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '1000px',
            }}
          >
            {cleanTitle}
          </div>
        </div>

        {/* Bottom: Date + product pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              color: '#737373',
              fontWeight: 500,
            }}
          >
            {dateStr}
          </div>

          {/* Product pills */}
          {products.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {products.map((product) => (
                <div
                  key={product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '100px',
                    padding: '6px 14px',
                  }}
                >
                  <div
                    style={{
                      width: '8',
                      height: '8',
                      borderRadius: '50%',
                      backgroundColor: getProductColor(product),
                    }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#a3a3a3',
                    }}
                  >
                    {product}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom border accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4',
            background: 'linear-gradient(90deg, #162036, #7c3aed, #162036)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
