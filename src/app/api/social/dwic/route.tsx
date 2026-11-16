import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loadFonts } from '@/app/api/og/shared';
import {
  altText,
  CARD_HEIGHT,
  CARD_WIDTH,
  decodeOverrides,
  DWIC_COLORS as C,
  DWIC_IMAGES,
  DWIC_SITE,
  DWIC_SLIDE_COUNT,
  findArticle,
  mergeText,
  type DwicImageId,
  type DwicText,
} from '@/lib/social/dwic';
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '@/lib/social/slides';

export const runtime = 'nodejs';

/**
 * Social images for a designwithclaude.com article.
 * GET /api/social/dwic?article=<slug>&n=card|1..4[&t=<edits>]  → the PNG
 * GET /api/social/dwic?article=<slug>&format=json                → default text + alt text
 * `t` carries the admin's edits (see encodeOverrides in lib/social/dwic.ts). Admin only.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const article = findArticle(searchParams.get('article'));
  if (!article) return new Response('Unknown article', { status: 404 });

  if (searchParams.get('format') === 'json') {
    return Response.json({
      slug: article.slug,
      title: article.title,
      url: article.url,
      text: article.text,
      images: DWIC_IMAGES.map((img) => ({ ...img, alt: altText(img.id, article.text) })),
    });
  }

  const n = (searchParams.get('n') || 'card') as DwicImageId;
  if (!DWIC_IMAGES.some((img) => img.id === n)) {
    return new Response('n must be card or 1 to 4', { status: 400 });
  }

  const t = mergeText(article.text, decodeOverrides(searchParams.get('t')));
  const assets: Assets = {
    mark: `${origin}/images/social/dwic-mark.svg`,
    art: `${origin}/images/social/${article.art}.svg`,
    artLight: `${origin}/images/social/${article.art}-light.svg`,
  };

  const { regular, bold } = await loadFonts();
  const isCard = n === 'card';
  return new ImageResponse(isCard ? <LinkCard t={t} assets={assets} /> : <Slide n={Number(n)} t={t} assets={assets} />, {
    width: isCard ? CARD_WIDTH : SLIDE_WIDTH,
    height: isCard ? CARD_HEIGHT : SLIDE_HEIGHT,
    fonts: [
      { name: 'Satoshi', data: regular, weight: 400, style: 'normal' },
      { name: 'Satoshi', data: bold, weight: 700, style: 'normal' },
    ],
    headers: {
      'Content-Disposition': `inline; filename="dwic-${article.slug}-${n}.png"`,
      'Cache-Control': 'private, max-age=60',
    },
  });
}

type Assets = { mark: string; art: string; artLight: string };

function Header({ n, assets, onNavy }: { n: number; assets: Assets; onNavy: boolean }) {
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
        <span>designwithclaude</span>
      </div>
      <span style={{ fontSize: 22, letterSpacing: 2, color: C.onNavyMuted }}>{`${n} / ${DWIC_SLIDE_COUNT}`}</span>
    </div>
  );
}

function Label({ text, onNavy }: { text: string; onNavy: boolean }) {
  return (
    <div style={{ display: 'flex', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: onNavy ? C.onNavyMuted : C.slate }}>
      {text}
    </div>
  );
}

function Art({ src, width }: { src: string; width: number }) {
  // The doodles are 116x160; keep their proportions.
  const height = Math.round((width * 160) / 116);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', padding: '0 72px 64px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={width} height={height} alt="" />
    </div>
  );
}

function LinkCard({ t, assets }: { t: DwicText; assets: Assets }) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: 'flex',
        backgroundColor: C.navy,
        color: C.white,
        fontFamily: 'Satoshi',
        padding: '64px 72px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.mark} width={40} height={40} alt="" />
          <span>designwithclaude</span>
          <span style={{ fontWeight: 400, color: C.onNavyMuted }}>Design Research</span>
        </div>
        <div style={{ display: 'flex', fontSize: t.cardTitle.length > 40 ? 58 : 66, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1.2, maxWidth: 820 }}>
          {t.cardTitle}
        </div>
        <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.5, color: C.onNavy, maxWidth: 780 }}>{t.cardBody}</div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 24, color: C.onNavyMuted }}>{DWIC_SITE}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.artLight} width={200} height={276} alt="" />
      </div>
    </div>
  );
}

function Slide({ n, t, assets }: { n: number; t: DwicText; assets: Assets }) {
  const onNavy = n === 1 || n === 4;
  const points = [
    [t.point1Code, t.point1Claim],
    [t.point2Code, t.point2Claim],
    [t.point3Code, t.point3Claim],
  ];
  const steps: [string, string | null][] = [
    [t.step1Answer, t.step1Question],
    [t.step2Answer, t.step2Question],
    [t.step3Answer, t.step3Question],
    [t.step4Answer, null],
  ];
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
      <Header n={n} assets={assets} onNavy={onNavy} />

      {n === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34, padding: '80px 72px 0' }}>
            <Label text={t.coverLabel} onNavy />
            <div style={{ display: 'flex', fontSize: t.coverTitle.length > 40 ? 72 : 84, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1.5 }}>
              {t.coverTitle}
            </div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.6, color: C.onNavy, maxWidth: 880 }}>{t.coverBody}</div>
          </div>
          <Art src={assets.artLight} width={230} />
        </div>
      )}

      {n === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '64px 72px', gap: 24 }}>
          <Label text={t.pointsLabel} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1.2, marginBottom: 12 }}>{t.pointsTitle}</div>
          {points.map(([code, claim], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, backgroundColor: C.white, borderRadius: 28, padding: '30px 36px' }}>
              <div
                style={{
                  // Only Satoshi is loaded into the renderer, so the code reads as code by its tinted chip, not a mono face.
                  display: 'flex',
                  fontSize: 25,
                  color: C.navy,
                  backgroundColor: C.tint,
                  borderRadius: 12,
                  padding: '12px 18px',
                }}
              >
                {code}
              </div>
              <div style={{ display: 'flex', fontSize: 33, fontWeight: 700, lineHeight: 1.35 }}>{`→ ${claim}`}</div>
            </div>
          ))}
        </div>
      )}

      {n === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '64px 72px', gap: 14 }}>
          <Label text={t.stepsLabel} onNavy={false} />
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1.2, marginBottom: 18 }}>{t.stepsTitle}</div>
          {steps.map(([answer, question], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: `${100 - i * 12}%`,
                  backgroundColor: i === 3 ? C.navy : C.white,
                  color: i === 3 ? C.white : C.navy,
                  borderRadius: 22,
                  padding: '22px 28px',
                  fontSize: 31,
                  fontWeight: i === 3 ? 700 : 400,
                  textAlign: 'center',
                }}
              >
                {answer}
              </div>
              {question && <div style={{ display: 'flex', fontSize: 25, fontWeight: 700, color: C.slate }}>{question}</div>}
            </div>
          ))}
          <div style={{ display: 'flex', marginTop: 'auto', fontSize: 27, lineHeight: 1.5, color: C.slate }}>{t.stepsNote}</div>
        </div>
      )}

      {n === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34, padding: '80px 72px 0' }}>
            <Label text="Read the essay" onNavy />
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1.5 }}>{t.linkTitle}</div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.6, color: C.onNavy, maxWidth: 860 }}>{t.linkBody}</div>
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
              {t.linkUrl}
            </div>
          </div>
          <Art src={assets.artLight} width={200} />
        </div>
      )}
    </div>
  );
}
