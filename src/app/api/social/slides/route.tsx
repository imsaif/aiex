import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loadFonts } from '@/app/api/og/shared';
import { generateAside, generateReviewQuestion, parseNewsletterStructuredData } from '@/lib/social/content-generator';
import { DEFAULT_BAND_SLUG } from '@/lib/newsletter/band';
import { storyIconPaths } from '@/lib/social/story-icons';
import { resolveStoryLogo } from '@/lib/social/story-logos';
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
  data.title = newsletter.title || data.title;
  data.summary = newsletter.summary || data.summary;
  data.type = newsletter.type === 'weekly' ? 'weekly' : 'daily';

  const dateLabel = new Date(newsletter.publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // Slide 3's review question and aside are written once, on first need, and kept on the issue.
  const format = searchParams.get('format');
  const want = searchParams.get('n');
  const extras: Record<string, string> = {};
  if ((format === 'json' || want === '3') && !data.reviewQuestion) {
    const question = await generateReviewQuestion(data);
    if (question) extras.reviewQuestion = data.reviewQuestion = question;
  }
  if ((format === 'json' || want === '3') && !data.aside) {
    const aside = await generateAside(data);
    if (aside) extras.aside = data.aside = aside;
  }
  if (Object.keys(extras).length) {
    try {
      await prisma.newsletterDraft.update({
        where: { id },
        data: { structuredData: { ...(newsletter.structuredData as Prisma.JsonObject), ...extras } },
      });
    } catch (error) {
      console.error('Failed to store slide extras:', error);
    }
  }

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
    // Noto Emoji 1f914 (Apache-2.0), kept locally so the slide never depends on an emoji CDN.
    thinking: `${origin}/images/social/thinking.svg`,
    band: `${origin}/images/newsletter/band/${data.bandSlug || data.idea?.patternSlug || DEFAULT_BAND_SLUG}.png`,
  };

  const slide = slides[n - 1];
  const logos =
    slide.kind === 'stories' ? await Promise.all(slide.stories.map((s) => resolveStoryLogo(s.product, origin))) : [];

  return new ImageResponse(<SlideImage slide={slide} n={n} assets={assets} edition={data.type} logos={logos} />, {
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

type Assets = { mark: string; band: string; thinking: string };

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

function StoryMark({ logo, patternSlug }: { logo: string | null; patternSlug?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 0,
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: C.tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} width={36} height={36} alt="" />
      ) : (
        <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          {storyIconPaths(patternSlug).map((d, j) => (
            <path key={j} d={d} />
          ))}
        </svg>
      )}
    </div>
  );
}

function SlideImage({
  slide,
  n,
  assets,
  edition,
  logos,
}: {
  slide: Slide;
  n: number;
  assets: Assets;
  edition: string;
  logos: (string | null)[];
}) {
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
            <div style={{ display: 'flex', fontSize: slide.title.length > 70 ? 62 : 72, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1.2 }}>
              {slide.title}
            </div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.6, color: C.onNavy, maxWidth: 880 }}>{slide.summary}</div>
          </div>
          <BandArt src={assets.band} size={430} />
        </div>
      )}

      {slide.kind === 'stories' && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '48px 72px 0', gap: 16 }}>
          <Label text={slide.label} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, letterSpacing: -1.5, marginBottom: 12 }}>{slide.title}</div>
          {slide.stories.map((story, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 28, alignItems: 'center', backgroundColor: C.white, borderRadius: 28, padding: '22px 36px' }}
            >
              <StoryMark logo={logos[i] ?? null} patternSlug={story.patternSlug} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: C.slate }}>{story.product}</div>
                <div style={{ display: 'flex', fontSize: 31, fontWeight: 700, lineHeight: 1.4 }}>{story.headline}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.kind === 'idea' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '64px 72px 64px', gap: 28 }}>
          <Label text={slide.label} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 62, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1.2 }}>{slide.title}</div>
          <div
            style={{
              display: 'flex',
              backgroundColor: C.ideaPanel,
              borderRadius: 28,
              padding: '36px 44px',
              fontSize: 32,
              lineHeight: 1.6,
            }}
          >
            {slide.body}
          </div>
          {slide.question && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                backgroundColor: C.white,
                border: `3px solid ${C.navy}`,
                borderRadius: 28,
                padding: '30px 40px 34px',
              }}
            >
              <Label text="Ask in your next design review" onNavy={false} />
              <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, lineHeight: 1.3, letterSpacing: -0.6 }}>
                {slide.question}
              </div>
            </div>
          )}
          {slide.aside && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 32,
                marginTop: 'auto',
                backgroundColor: C.navy,
                borderRadius: 28,
                padding: '30px 40px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assets.thinking} width={64} height={64} alt="" />
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: C.white,
                    color: C.navy,
                    borderRadius: 999,
                    padding: '4px 16px',
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  Hmm.
                </div>
              </div>
              <div style={{ display: 'flex', flex: 1, fontSize: 30, lineHeight: 1.5, color: C.onNavy }}>{slide.aside}</div>
            </div>
          )}
        </div>
      )}

      {slide.kind === 'link' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34, padding: '80px 72px 0' }}>
            <Label text={slide.label} onNavy />
            <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1.2 }}>{slide.title}</div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.6, color: C.onNavy, maxWidth: 860 }}>{slide.body}</div>
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
