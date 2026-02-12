import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Product colors for icon dots
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

// OG image colors — hardcoded because Satori (OG renderer) has no access to CSS variables
const OG_COLORS = {
  bg: '#0f0f0f',
  text: '#e5e5e5',
  textMuted: '#737373',
  textDim: '#525252',
  textLabel: '#737373',
  divider: 'rgba(255,255,255,0.08)',
  dividerSubtle: 'rgba(255,255,255,0.06)',
  white: '#ffffff',
  navy: '#162036',
  purple: '#7c3aed',
} as const;

function getProductColor(name: string): string {
  const lower = name.toLowerCase().replace(/\s+/g, '');
  for (const [key, color] of Object.entries(PRODUCT_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#64748b';
}

interface NewsletterItem {
  product?: string;
  headline?: string;
  designerTakeaway?: string;
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

  const data = newsletter.structuredData as { items?: NewsletterItem[] } | null;
  const items = (data?.items || []).slice(0, 5);

  const date = new Date(newsletter.publishDate);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isWeekly = newsletter.type === 'weekly';
  const label = isWeekly ? 'Weekly' : 'Daily';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: OG_COLORS.bg,
          padding: '48px 64px',
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
            background: 'radial-gradient(ellipse at 10% 30%, rgba(22, 32, 54, 0.5) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Top bar: Logo + Type badge + Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M15.645 26.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C8.688 21.36 6.25 18.174 6.25 14.25 6.25 11.322 8.714 9 11.688 9A5.5 5.5 0 0116 11.052 5.5 5.5 0 0120.313 9c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                fill="white"
              />
              <path
                d="M16 16l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"
                fill={OG_COLORS.bg}
              />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: OG_COLORS.textMuted, letterSpacing: '-0.01em' }}>
              AI UX {label}
            </span>
            <div
              style={{
                width: '4',
                height: '4',
                borderRadius: '50%',
                backgroundColor: OG_COLORS.textDim,
                display: 'flex',
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 500, color: OG_COLORS.textDim }}>
              {dateStr}
            </span>
          </div>
          <div
            style={{
              backgroundColor: isWeekly ? OG_COLORS.purple : OG_COLORS.navy,
              color: OG_COLORS.white,
              fontSize: '12px',
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: '100px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            aiuxdesign.guide
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '1',
            backgroundColor: OG_COLORS.divider,
            marginBottom: '28px',
            display: 'flex',
          }}
        />

        {/* News items list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '0px',
            position: 'relative',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 0',
                borderBottom: index < items.length - 1 ? `1px solid ${OG_COLORS.dividerSubtle}` : 'none',
              }}
            >
              {/* Product color dot */}
              <div
                style={{
                  width: '10',
                  height: '10',
                  borderRadius: '50%',
                  backgroundColor: getProductColor(item.product || ''),
                  marginTop: '8px',
                  flexShrink: 0,
                  display: 'flex',
                }}
              />

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: OG_COLORS.textLabel,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.product || ''}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: OG_COLORS.text,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {(item.headline || '').length > 75
                    ? (item.headline || '').slice(0, 72) + '...'
                    : item.headline || ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3',
            background: `linear-gradient(90deg, ${OG_COLORS.navy}, ${OG_COLORS.purple}, ${OG_COLORS.navy})`,
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
