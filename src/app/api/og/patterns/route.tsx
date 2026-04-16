import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { OG, CATEGORY_ICONS, generateGridPaths, loadFonts } from '../shared';

export const runtime = 'nodejs';

function getCategoryIconPaths(categoryTitle: string): string[] {
  const cat = categories.find((c) => c.title === categoryTitle);
  const iconName = cat?.icon || 'Shield';
  return CATEGORY_ICONS[iconName] || CATEGORY_ICONS.Shield;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Missing pattern slug', { status: 400 });
  }

  const pattern = patterns.find((p) => p.slug === slug);
  if (!pattern) {
    return new Response('Pattern not found', { status: 404 });
  }

  const iconPaths = getCategoryIconPaths(pattern.category);

  const desc = pattern.description || '';
  const shortDesc = desc.length > 130 ? desc.slice(0, 127) + '...' : desc;

  const gridPaths = generateGridPaths();
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: OG.bg,
          fontFamily: 'Satoshi, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Right side: Grid mesh + large icon ── */}
        <div
          style={{
            position: 'absolute',
            right: '-20',
            top: 0,
            width: '600',
            height: '630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="600"
            height="630"
            viewBox="0 0 600 630"
            fill="none"
            style={{
              width: '600px',
              height: '630px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {gridPaths.map((p, i) => (
              <path
                key={i}
                d={p.d}
                stroke={OG.white}
                strokeWidth="0.6"
                strokeOpacity={p.opacity}
                fill="none"
              />
            ))}
          </svg>

          {/* Outer ring */}
          <div
            style={{
              position: 'absolute',
              width: '340',
              height: '340',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: 'absolute',
              width: '250',
              height: '250',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
            }}
          />

          {/* Icon container */}
          <div
            style={{
              width: '160',
              height: '160',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke={OG.white}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {iconPaths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
          </div>
        </div>

        {/* ── Left column: Text content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 48px 48px 64px',
            width: '680',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Category kicker */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: OG.tertiary,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            {pattern.category.toUpperCase()}
          </div>

          {/* Pattern title */}
          <div
            style={{
              fontSize: pattern.title.length > 28 ? '64px' : '76px',
              fontWeight: 700,
              color: OG.white,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '28px',
              display: 'flex',
            }}
          >
            {pattern.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: OG.secondary,
              lineHeight: 1.55,
              letterSpacing: '-0.01em',
              marginBottom: '32px',
              maxWidth: '520',
              display: 'flex',
            }}
          >
            {shortDesc}
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Divider */}
          <div
            style={{
              width: '100%',
              height: '1',
              backgroundColor: OG.divider,
              marginBottom: '20px',
              display: 'flex',
            }}
          />

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path
                d="M15.645 26.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C8.688 21.36 6.25 18.174 6.25 14.25 6.25 11.322 8.714 9 11.688 9A5.5 5.5 0 0116 11.052 5.5 5.5 0 0120.313 9c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                fill={OG.tertiary}
              />
              <path
                d="M16 16l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"
                fill={OG.bg}
              />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 400, color: OG.tertiary }}>
              aiuxdesign.guide
            </span>
            <span style={{ fontSize: '14px', color: OG.tertiary }}>|</span>
            <span style={{ fontSize: '14px', fontWeight: 400, color: OG.tertiary }}>
              AI Design Patterns
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
      fonts: [
        { name: 'Satoshi', data: fonts.regular, weight: 400 as const },
        { name: 'Satoshi', data: fonts.bold, weight: 700 as const },
      ],
    },
  );
}
