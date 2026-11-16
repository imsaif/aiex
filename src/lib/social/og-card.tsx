/**
 * The 1200x630 share card in the newsletter look, shared by the aiux newsletter
 * (src/app/api/newsletter/og) and dwic articles (src/app/api/social/dwic/og).
 * Colours are literal because Satori cannot read CSS variables.
 */
export const OG = {
  bg: '#0f0f0f',
  text: '#e5e5e5',
  textBright: '#fafafa',
  textMuted: '#737373',
  textDim: '#525252',
  divider: 'rgba(255,255,255,0.08)',
  dividerSubtle: 'rgba(255,255,255,0.06)',
  white: '#ffffff',
  navy: '#162036',
  purple: '#7c3aed',
  pillBg: 'rgba(255,255,255,0.06)',
} as const;

export type OgCardProps = {
  /** Logo image URL; omit for the aiux heart mark. */
  markSrc?: string;
  brandLabel: string;
  date: string;
  /** Pill and button colour. */
  accent: string;
  pill: string;
  title: string;
  /** Up to five rows. icon is an image URL, drawn inverted like the aiux product icons. */
  items: { product?: string; headline?: string; icon: string }[];
  ctaText: string;
  ctaButton: string;
};

export function OgCard(p: OgCardProps) {
  return (
    <div
      style={{
        width: '1200',
        height: '630',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: OG.bg,
        padding: '40px 56px 36px',
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
          background: 'radial-gradient(ellipse at 10% 20%, rgba(22, 32, 54, 0.5) 0%, transparent 60%)',
          display: 'flex',
        }}
      />

      {/* Top bar: Logo + badge + date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {p.markSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.markSrc} width={24} height={24} alt="" />
          ) : (
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path
              d="M15.645 26.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C8.688 21.36 6.25 18.174 6.25 14.25 6.25 11.322 8.714 9 11.688 9A5.5 5.5 0 0116 11.052 5.5 5.5 0 0120.313 9c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
              fill="white"
            />
            <path
              d="M16 16l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"
              fill={OG.bg}
            />
          </svg>
          )}
          <span style={{ fontSize: '16px', fontWeight: 700, color: OG.textMuted, letterSpacing: '-0.01em' }}>
            {p.brandLabel}
          </span>
          <div
            style={{
              width: '3',
              height: '3',
              borderRadius: '50%',
              backgroundColor: OG.textDim,
              display: 'flex',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: OG.textDim }}>
            {p.date}
          </span>
        </div>
        <div
          style={{
            backgroundColor: p.accent,
            color: OG.white,
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '100px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {p.pill}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: p.title.length > 50 ? '28px' : '32px',
          fontWeight: 800,
          color: OG.textBright,
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
          position: 'relative',
          display: 'flex',
        }}
      >
        {p.title}
      </div>

      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: '1',
          backgroundColor: OG.divider,
          marginBottom: '16px',
          display: 'flex',
        }}
      />

      {/* News items list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}
      >
        {p.items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
              borderBottom: index < p.items.length - 1 ? `1px solid ${OG.dividerSubtle}` : 'none',
            }}
          >
            {/* Product icon */}
            <div
              style={{
                width: '36',
                height: '36',
                borderRadius: '8px',
                backgroundColor: OG.pillBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                width="20"
                height="20"
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'invert(1)',
                }}
              />
            </div>

            {/* Product name + headline */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flex: 1, overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: OG.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {item.product || ''}
              </span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: OG.text,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {(item.headline || '').length > 65
                  ? (item.headline || '').slice(0, 62) + '...'
                  : item.headline || ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA — pitch the newsletter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          paddingTop: '20px',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 500, color: OG.textMuted, letterSpacing: '-0.01em' }}>
          {p.ctaText}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: p.accent,
            color: OG.white,
            fontSize: '13px',
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: '100px',
            letterSpacing: '-0.01em',
          }}
        >
          {p.ctaButton}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3',
          background: `linear-gradient(90deg, ${OG.navy}, ${OG.purple}, ${OG.navy})`,
          display: 'flex',
        }}
      />
    </div>
  );
}
