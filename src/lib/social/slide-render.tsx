/**
 * Draws one 1080x1350 social slide in the newsletter look. Shared by the aiux newsletter
 * slides (src/app/api/social/slides) and the dwic article slides (src/app/api/social/dwic),
 * so both brands use one design; only the logo, wordmark, edition and band art differ.
 */
import { storyIconPaths } from '@/lib/social/story-icons';
import { SLIDE_COLORS as C, SLIDE_COUNT, SLIDE_HEIGHT, SLIDE_WIDTH, type Slide } from '@/lib/social/slides';

/** What differs between brands. aiux passes exactly what it used to hard-code. */
export type Assets = {
  mark: string;
  band: string;
  thinking: string;
  /** Wordmark beside the logo in the header. */
  name: string;
  /** Band art size on the cover and link slides; the aiux bands are square. */
  band1?: { width: number; height: number };
  band4?: { width: number; height: number };
};

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
        <span>{assets.name}</span>
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

function BandArt({ src, size, box }: { src: string; size: number; box?: { width: number; height: number } }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', padding: '0 40px 40px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={box?.width ?? size} height={box?.height ?? size} alt="" />
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

export function SlideImage({
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
          <BandArt src={assets.band} size={430} box={assets.band1} />
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
          <BandArt src={assets.band} size={400} box={assets.band4} />
        </div>
      )}
    </div>
  );
}
