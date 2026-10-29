import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loadFonts } from '@/app/api/og/shared';
import { parseNewsletterStructuredData } from '@/lib/social/content-generator';
import { DEFAULT_BAND_SLUG } from '@/lib/newsletter/band';
import { buildSlides, SLIDE_COLORS as C, SLIDE_COUNT, SLIDE_HEIGHT, SLIDE_WIDTH, type Slide } from '@/lib/social/slides';

export const runtime = 'nodejs';

/**
 * One of the four LinkedIn/X images for an issue, in the newsletter's look.
 * GET /api/social/slides?id=<newsletterId>&n=1..4        → the PNG
 * GET /api/social/slides?id=<newsletterId>&format=json   → slide text + alt text
 * Admin only: it can render an issue that has not been published yet.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return new Response('Missing newsletter id', { status: 400 });

  const newsletter = await prisma.newsletterDraft.findUnique({
    where: { id },
    select: { title: true, summary: true, slug: true, type: true, publishDate: true, structuredData: true },
  });
  if (!newsletter) return new Response('Newsletter not found', { status: 404 });

  const data = parseNewsletterStructuredData(newsletter.structuredData);
  if (!data) return new Response('Newsletter has no structured data', { status: 400 });
  data.title = data.title || newsletter.title;
  data.summary = data.summary || newsletter.summary;
  data.type = newsletter.type === 'weekly' ? 'weekly' : 'daily';

  const dateLabel = new Date(newsletter.publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const slides = buildSlides(data, { dateLabel });

  if (searchParams.get('format') === 'json') {
    return Response.json({ slides: slides.map(({ kind, alt }, i) => ({ n: i + 1, kind, alt })) });
  }

  const n = Number(searchParams.get('n') || '1');
  if (!Number.isInteger(n) || n < 1 || n > SLIDE_COUNT) {
    return new Response(`n must be 1 to ${SLIDE_COUNT}`, { status: 400 });
  }

  const { regular, bold } = await loadFonts();
  const assets = {
    mark: `${origin}/images/email/aiux-mark.png`,
    band: `${origin}/images/newsletter/band/${data.bandSlug || data.idea?.patternSlug || DEFAULT_BAND_SLUG}.png`,
  };

  return new ImageResponse(<SlideImage slide={slides[n - 1]} n={n} assets={assets} edition={data.type} />, {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    fonts: [
      { name: 'Satoshi', data: regular, weight: 400, style: 'normal' },
      { name: 'Satoshi', data: bold, weight: 700, style: 'normal' },
    ],
    headers: {
      'Content-Disposition': `inline; filename="${newsletter.slug}-${n}.png"`,
      'Cache-Control': 'private, max-age=300',
    },
  });
}

type Assets = { mark: string; band: string };

function Header({ n, assets, onNavy, edition }: { n: number; assets: Assets; onNavy: boolean; edition: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '56px 72px',
        backgroundColor: C.navy,
        borderBottom: onNavy ? `2px solid ${C.rule}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, color: C.white }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.mark} width={44} height={44} alt="" />
        <span>aiux</span>
        <span style={{ fontWeight: 400, color: C.onNavy }}>{edition}</span>
      </div>
      <span style={{ fontSize: 22, letterSpacing: 2, color: C.onNavyMuted }}>{`${n} / ${SLIDE_COUNT}`}</span>
    </div>
  );
}

function Label({ text, onNavy }: { text: string; onNavy: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: 24,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: onNavy ? C.onNavyMuted : C.slate,
      }}
    >
      {text}
    </div>
  );
}

function BandArt({ src, size }: { src: string; size: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', padding: '0 40px 40px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={size} height={size} alt="" />
    </div>
  );
}

function SlideImage({ slide, n, assets, edition }: { slide: Slide; n: number; assets: Assets; edition: string }) {
  const onNavy = slide.kind === 'cover' || slide.kind === 'link';
  return (
    <div
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: onNavy ? C.navy : C.tint,
        color: onNavy ? C.white : C.navy,
        fontFamily: 'Satoshi',
      }}
    >
      <Header n={n} assets={assets} onNavy={onNavy} edition={edition} />

      {slide.kind === 'cover' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34, padding: '80px 72px 0' }}>
            <Label text={slide.label} onNavy />
            <div style={{ display: 'flex', fontSize: slide.title.length > 70 ? 74 : 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
              {slide.title}
            </div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.4, color: C.onNavy, maxWidth: 880 }}>{slide.summary}</div>
          </div>
          <BandArt src={assets.band} size={430} />
        </div>
      )}

      {slide.kind === 'stories' && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '56px 72px 0', gap: 18 }}>
          <Label text={slide.label} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, letterSpacing: -1.5, marginBottom: 20 }}>{slide.title}</div>
          {slide.stories.map((story, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 28, alignItems: 'flex-start', backgroundColor: C.white, borderRadius: 28, padding: '28px 36px' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexShrink: 0,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: C.navy,
                  color: C.white,
                  fontSize: 28,
                  fontWeight: 700,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {String(i + 1)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: C.slate }}>{story.product}</div>
                <div style={{ display: 'flex', fontSize: 31, fontWeight: 700, lineHeight: 1.25 }}>{story.headline}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.kind === 'idea' && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '72px 72px 0', gap: 30 }}>
          <Label text={slide.label} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{slide.title}</div>
          <div
            style={{
              display: 'flex',
              backgroundColor: C.ideaPanel,
              borderRadius: 28,
              padding: '44px 48px',
              fontSize: 38,
              lineHeight: 1.42,
            }}
          >
            {slide.body}
          </div>
        </div>
      )}

      {slide.kind === 'link' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34, padding: '80px 72px 0' }}>
            <Label text={slide.label} onNavy />
            <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{slide.title}</div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.4, color: C.onNavy, maxWidth: 860 }}>{slide.body}</div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                marginTop: 16,
                backgroundColor: C.white,
                color: C.navy,
                borderRadius: 999,
                padding: '24px 38px',
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {slide.url}
            </div>
          </div>
          <BandArt src={assets.band} size={400} />
        </div>
      )}
    </div>
  );
}
