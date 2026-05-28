import type { Metadata } from 'next';
import Link from 'next/link';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';
import { PrimitivesDemo } from './_components/PrimitivesDemo';

export const metadata: Metadata = {
  title: 'Guide Design System — aiux',
  description: 'Tokens, primitives, and conventions used across aiux.',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'color', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radii', label: 'Radii' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'z-index', label: 'Z-index' },
  { id: 'motion', label: 'Motion' },
  { id: 'cards', label: 'Cards' },
  { id: 'logo-strip', label: 'Logo strip' },
  { id: 'news-strip', label: 'News strip' },
  { id: 'email-capture', label: 'Email capture' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'defensive', label: 'Conventions' },
  { id: 'backlog', label: 'Open work' },
];

const COLOR_TOKENS = [
  {
    group: 'Surface',
    swatches: [
      { name: 'background-primary', cls: 'bg-background-primary border border-border-primary' },
      { name: 'background-secondary', cls: 'bg-background-secondary border border-border-primary' },
      { name: 'surface-primary', cls: 'bg-surface-primary border border-border-primary' },
      { name: 'surface-elevated', cls: 'bg-surface-elevated shadow-card' },
    ],
  },
  {
    group: 'Text & accent',
    swatches: [
      { name: 'text-primary', cls: 'bg-text-primary' },
      { name: 'text-secondary', cls: 'bg-text-secondary' },
      { name: 'text-tertiary', cls: 'bg-text-tertiary' },
      { name: 'accent-primary', cls: 'bg-accent-primary' },
    ],
  },
  {
    group: 'Status',
    swatches: [
      { name: 'border-success', cls: 'bg-status-success' },
      { name: 'border-warning', cls: 'bg-status-warning' },
      { name: 'border-error', cls: 'bg-status-error' },
      { name: 'border-info', cls: 'bg-status-info' },
    ],
  },
];

const TYPE_TOKENS = [
  { cls: 'type-display', size: '56', weight: '800', leading: '1.05', tracking: '-0.03em' },
  { cls: 'type-h1', size: '40', weight: '700', leading: '1.15', tracking: '-0.025em' },
  { cls: 'type-h2', size: '32', weight: '700', leading: '1.2', tracking: '-0.02em' },
  { cls: 'type-h3', size: '24', weight: '600', leading: '1.3', tracking: '-0.015em' },
  { cls: 'type-body', size: '16', weight: '400', leading: '1.6', tracking: '-0.005em' },
  { cls: 'type-caption', size: '14', weight: '500', leading: '1.5', tracking: '0' },
  { cls: 'type-eyebrow', size: '12', weight: '600', leading: '1.4', tracking: '0.08em' },
];

const DEFENSIVE_MOVES = [
  {
    title: 'Self-host every visual asset',
    body: 'No CDN dependencies. Fonts and logos served from our domain.',
    incident: 'Hotjar recording · Feb 2026',
  },
  {
    title: 'Explicit width/height on media',
    body: 'Hardcoded dimensions on every img, SVG, and video. Survives a missing stylesheet.',
    incident: 'CLS spike · Apr 2026',
  },
  {
    title: 'adjustFontFallback: "Arial"',
    body: 'Size-adjusted fallback matches Satoshi\'s metrics. No reflow on font swap.',
    incident: 'Font CLS fix · Apr 2026',
  },
  {
    title: 'Three layers on cached pages',
    body: 'Re-throw on DB error, runtime guard against empty renders, live-page watchdog.',
    incident: '/news ISR cache · May 2026',
  },
];

const BACKLOG = [
  { item: '1,169 raw Tailwind color uses', detail: 'Mostly in pattern demo components and SkeletonLoader. New uses are blocked at commit.' },
  { item: '62 raw z-index values', detail: 'z-10 through z-50 scattered across modals and sticky bars. Migrating to z-modal / z-sticky / z-overlay.' },
  { item: '69 arbitrary font sizes', detail: 'text-[14px], text-[18px], etc. Should use the type-* utilities.' },
  { item: '108 light-only colors without dark variants', detail: 'bg-white / text-black without dark: counterparts.' },
  { item: 'Migrate 5 modals to the Dialog primitive', detail: 'Primitive is shipped — PaywallModal, WelcomeModal, EmailReportModal, DownloadPDFModal, SearchModal still inline their own backdrop and focus logic.' },
  { item: 'Migrate 4 search inputs to the Input primitive', detail: 'Primitive is shipped — SearchBar, UnifiedSearchBar, AdvancedSearchBar, SmartSearchChat still diverge on keyboard behavior.' },
  { item: '9 card variants → Card', detail: 'Shared chrome, isolated implementations.' },
  { item: 'No Storybook', detail: 'This page is the reference instead.' },
  { item: 'No automated a11y in CI', detail: 'axe-core in Playwright pending.' },
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {/* Top bar — persistent back-to-product link */}
      <div className="border-b border-border-primary bg-background-primary">
        <div className="max-w-7xl mx-auto px-default md:px-loose lg:px-roomy py-snug flex items-center justify-between">
          <Link
            href="/"
            className="type-caption font-semibold text-text-primary hover:text-accent-primary transition-colors duration-quick ease-out-expo flex items-center gap-tight"
          >
            <span aria-hidden>←</span>
            <span>aiuxdesign.guide</span>
          </Link>
          <Link
            href="/"
            className="type-caption text-text-tertiary hover:text-text-primary transition-colors duration-quick ease-out-expo"
          >
            Open site →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#F0F1F5] dark:bg-[#162036] bg-grain border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-default md:px-loose lg:px-roomy py-[3rem] md:py-[4rem] lg:py-[5rem]">
          <p className="type-eyebrow text-text-tertiary mb-snug">aiux</p>
          <h1 className="type-display text-text-hero max-w-3xl">
            Guide Design System
          </h1>
          <p className="type-body text-text-secondary max-w-2xl mt-default">
            Tokens, primitives, and conventions used across aiux.
          </p>
          <div className="flex items-center gap-default mt-loose type-caption text-text-tertiary">
            <span>Updated 2026-05-27</span>
            <span aria-hidden>·</span>
            <span>6 token scales</span>
            <span aria-hidden>·</span>
            <span>Light + dark</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-default md:px-loose lg:px-roomy py-[3rem] md:py-[4rem] lg:py-[5rem]">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-roomy lg:gap-[clamp(2rem,5vw,5rem)]">
          {/* Sticky TOC */}
          <nav aria-label="Design system sections" className="lg:sticky lg:top-roomy lg:self-start lg:max-h-screen lg:overflow-y-auto">
            <p className="type-eyebrow text-text-tertiary mb-snug">Contents</p>
            <ol className="space-y-tight">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="flex items-baseline gap-snug type-caption">
                  <span className="text-text-tertiary tabular-nums w-5">{String(i + 1).padStart(2, '0')}</span>
                  <a
                    href={`#${s.id}`}
                    className="text-text-secondary hover:text-text-primary transition-colors duration-quick ease-out-expo"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Main column — generous section gap for breathing room */}
          <div className="space-y-[5rem] min-w-0">
            {/* Foundations intro */}
            <section id="foundations" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Foundations" />
              <p className="type-body text-text-secondary max-w-2xl">
                Six token scales plus a z-index stack. Defined in <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">globals.css</code>, exposed as Tailwind utilities.
              </p>
            </section>

            {/* Color */}
            <section id="color" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Color" />
              <p className="type-body text-text-secondary max-w-2xl">
                Semantic CSS variables. Light/dark resolves at runtime. WCAG AA contrast on every paired token.
              </p>

              <div className="space-y-loose">
                {COLOR_TOKENS.map((group) => (
                  <div key={group.group} className="space-y-snug">
                    <h3 className="type-h3 text-text-primary">{group.group}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-default">
                      {group.swatches.map((sw) => (
                        <div key={sw.name} className="space-y-tight">
                          <div className={`h-20 rounded-card ${sw.cls}`} />
                          <p className="type-caption font-mono text-text-secondary">{sw.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Surface treatments — grain + hero-mesh */}
                <div className="space-y-snug">
                  <h3 className="type-h3 text-text-primary">Surface treatments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-default">
                    <div className="space-y-tight">
                      <div className="h-32 rounded-card bg-[#F0F1F5] dark:bg-[#162036] bg-grain border border-border-primary" />
                      <div className="flex items-baseline justify-between gap-default">
                        <p className="type-caption font-mono text-text-secondary">.bg-grain</p>
                        <p className="type-caption text-text-tertiary">Every hero</p>
                      </div>
                    </div>
                    <div className="space-y-tight">
                      <div className="h-32 rounded-card bg-hero-mesh border border-border-primary" />
                      <div className="flex items-baseline justify-between gap-default">
                        <p className="type-caption font-mono text-text-secondary">.bg-hero-mesh</p>
                        <p className="type-caption text-text-tertiary">Homepage only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section id="typography" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Typography" />
              <p className="type-body text-text-secondary max-w-2xl">
                Satoshi, self-hosted. Seven steps. Each token bundles size, weight, leading, and tracking.
              </p>

              {/* Specimen */}
              <article className="rounded-card border border-border-primary bg-surface-primary p-loose space-y-snug">
                <p className="type-eyebrow text-text-tertiary">Specimen</p>
                <h2 className="type-h1 text-text-primary">A measured argument for fewer animations.</h2>
                <p className="type-body text-text-secondary">
                  Motion has a cost. The question is whether it earns its keep.
                </p>
                <p className="type-caption text-text-tertiary">Sample copy.</p>
              </article>

              {/* Reference table */}
              <div className="rounded-card border border-border-primary overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-default px-default py-snug bg-background-secondary type-eyebrow text-text-tertiary border-b border-border-primary">
                  <span>Token</span>
                  <span>Size</span>
                  <span>Weight</span>
                  <span>Leading</span>
                  <span>Tracking</span>
                </div>
                {TYPE_TOKENS.map((t, i) => (
                  <div
                    key={t.cls}
                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-default px-default py-snug type-caption ${
                      i !== TYPE_TOKENS.length - 1 ? 'border-b border-border-primary' : ''
                    }`}
                  >
                    <code className="font-mono text-text-primary">.{t.cls}</code>
                    <span className="text-text-secondary tabular-nums">{t.size}px</span>
                    <span className="text-text-secondary tabular-nums">{t.weight}</span>
                    <span className="text-text-secondary tabular-nums">{t.leading}</span>
                    <span className="text-text-secondary tabular-nums">{t.tracking}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Spacing */}
            <section id="spacing" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Spacing" />
              <p className="type-body text-text-secondary max-w-2xl">
                Five semantic aliases over Tailwind&apos;s scale.
              </p>
              <div className="space-y-snug">
                {[
                  { name: 'tight', val: '8px', cls: 'p-tight' },
                  { name: 'snug', val: '12px', cls: 'p-snug' },
                  { name: 'default', val: '16px', cls: 'p-default' },
                  { name: 'loose', val: '24px', cls: 'p-loose' },
                  { name: 'roomy', val: '32px', cls: 'p-roomy' },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-default rounded-input border border-border-primary bg-surface-primary"
                  >
                    <div className={`bg-accent-primary/10 ${s.cls}`}>
                      <div className="w-16 h-8 bg-accent-primary rounded-input" />
                    </div>
                    <div className="flex-1 flex items-center justify-between pr-default">
                      <code className="font-mono type-caption text-text-primary">{s.name}</code>
                      <span className="type-caption text-text-tertiary tabular-nums">{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Radii */}
            <section id="radii" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Radii" />
              <p className="type-body text-text-secondary max-w-2xl">
                Named by role, not size.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-loose">
                <RadiusSample name="rounded-input" example={<MockInput />} />
                <RadiusSample name="rounded-card" example={<MockCard />} />
                <RadiusSample name="rounded-modal" example={<MockModal />} />
                <RadiusSample name="rounded-pill" example={<MockPill />} />
              </div>
            </section>

            {/* Elevation */}
            <section id="elevation" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Elevation" />
              <p className="type-body text-text-secondary max-w-2xl">
                Six shadows. Light and dark variants.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-loose p-roomy bg-background-secondary rounded-card">
                {[
                  { name: 'shadow-flat', hint: 'Disabled, dense lists' },
                  { name: 'shadow-card', hint: 'Card resting' },
                  { name: 'shadow-card-hover', hint: 'Card hover' },
                  { name: 'shadow-elevated', hint: 'Callouts' },
                  { name: 'shadow-modal', hint: 'Dialogs' },
                  { name: 'shadow-popover', hint: 'Tooltips, menus' },
                ].map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-card bg-surface-primary p-default min-h-20 flex flex-col justify-between ${s.name}`}
                  >
                    <code className="font-mono type-caption text-text-primary">.{s.name}</code>
                    <p className="type-caption text-text-tertiary">{s.hint}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Z-index */}
            <section id="z-index" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Z-index" />
              <p className="type-body text-text-secondary max-w-2xl">
                Seven layers. No raw <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">z-50</code> in new code.
              </p>
              <div className="rounded-card border border-border-primary overflow-hidden">
                {[
                  { name: 'z-base', val: 0, use: 'Default flow' },
                  { name: 'z-dropdown', val: 10, use: 'Menus, comboboxes' },
                  { name: 'z-sticky', val: 20, use: 'Sticky headers and CTAs' },
                  { name: 'z-overlay', val: 30, use: 'Backdrop dimmers' },
                  { name: 'z-modal', val: 40, use: 'Dialog content' },
                  { name: 'z-toast', val: 50, use: 'Transient notifications' },
                  { name: 'z-tooltip', val: 60, use: 'Hover tooltips (always topmost)' },
                ].map((z, i, arr) => (
                  <div
                    key={z.name}
                    className={`grid grid-cols-[1fr_auto_2fr] gap-default px-default py-snug items-center type-caption ${
                      i !== arr.length - 1 ? 'border-b border-border-primary' : ''
                    }`}
                  >
                    <code className="font-mono text-text-primary">.{z.name}</code>
                    <span className="text-text-tertiary tabular-nums">{z.val}</span>
                    <span className="text-text-secondary">{z.use}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Motion */}
            <section id="motion" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Motion" />
              <p className="type-body text-text-secondary max-w-2xl">
                Four durations, three easings. Default: <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">ease-out-expo</code>.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-default">
                {[
                  { name: 'snap', ms: '100ms', dur: 'duration-snap', body: 'Toggles, taps' },
                  { name: 'quick', ms: '180ms', dur: 'duration-quick', body: 'Hover, focus' },
                  { name: 'base', ms: '280ms', dur: 'duration-base', body: 'Modals, accordions' },
                  { name: 'deliberate', ms: '450ms', dur: 'duration-deliberate', body: 'Page transitions' },
                ].map((m) => (
                  <div
                    key={m.name}
                    className={`group rounded-card border border-border-primary bg-surface-primary p-default cursor-pointer transition-all ease-out-expo ${m.dur} hover:bg-accent-primary hover:text-background-primary hover:-translate-y-1 hover:shadow-elevated`}
                  >
                    <div className="flex items-baseline justify-between mb-snug">
                      <code className="font-mono type-caption">{m.name}</code>
                      <span className="type-caption opacity-60 tabular-nums">{m.ms}</span>
                    </div>
                    <p className="type-caption opacity-80">{m.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cards */}
            <section id="cards" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Cards" />
              <p className="type-body text-text-secondary max-w-2xl">
                Most reused composition. Shared chrome: <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">rounded-card</code>, border, <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">bg-surface-primary</code>, padding from the spacing scale.
              </p>

              {/* Canonical example + anatomy side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-loose items-start">
                {/* Lead example */}
                <article className="rounded-card border border-border-primary bg-surface-primary p-roomy shadow-card space-y-default">
                  <p className="type-eyebrow text-text-tertiary">Pattern</p>
                  <h3 className="type-h3 text-text-primary">Confidence visualization</h3>
                  <p className="type-body text-text-secondary">
                    Show users how certain the model is about each output, not just the output itself. Pair a probability with a plain-language qualifier so non-technical readers can act on it.
                  </p>
                  <div className="flex items-center gap-default pt-snug border-t border-border-primary">
                    <span className="type-caption text-text-tertiary">Trustworthy &amp; reliable AI</span>
                    <span className="type-caption text-text-tertiary" aria-hidden>·</span>
                    <span className="type-caption text-text-tertiary">4 min</span>
                  </div>
                </article>

                {/* Anatomy reference */}
                <aside className="rounded-card border border-border-primary overflow-hidden">
                  <div className="px-default py-snug bg-background-secondary border-b border-border-primary">
                    <p className="type-eyebrow text-text-tertiary">Anatomy</p>
                  </div>
                  {[
                    { part: 'Eyebrow', token: 'type-eyebrow · tertiary' },
                    { part: 'Title', token: 'type-h3 · primary' },
                    { part: 'Body', token: 'type-body · secondary' },
                    { part: 'Footer', token: 'Meta or actions' },
                  ].map((row, i, arr) => (
                    <div
                      key={row.part}
                      className={`px-default py-snug ${
                        i !== arr.length - 1 ? 'border-b border-border-primary' : ''
                      }`}
                    >
                      <p className="type-caption font-semibold text-text-primary">{row.part}</p>
                      <code className="type-caption font-mono text-text-tertiary">{row.token}</code>
                    </div>
                  ))}
                </aside>
              </div>

              {/* Variants */}
              <div className="space-y-snug">
                <h3 className="type-eyebrow text-text-tertiary">Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-loose">
                  {/* Inline action */}
                  <CardSample label="Inline action — copy / submit">
                    <article className="rounded-card border border-border-primary bg-surface-primary p-loose">
                      <div className="flex items-start justify-between gap-default">
                        <div className="space-y-tight flex-1 min-w-0">
                          <p className="type-eyebrow text-text-tertiary">Prompt</p>
                          <h4 className="type-body font-semibold text-text-primary">Handoff to Claude Code</h4>
                        </div>
                        <button
                          type="button"
                          className="bg-accent-primary text-background-primary px-default py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo flex-shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    </article>
                  </CardSample>

                  {/* Dense — list cell */}
                  <CardSample label="Dense — list cell">
                    <article className="rounded-card border border-border-primary bg-surface-primary p-default">
                      <div className="flex items-baseline justify-between gap-snug">
                        <p className="type-body font-semibold text-text-primary">Adaptive interfaces</p>
                        <span className="type-caption text-text-tertiary">12</span>
                      </div>
                      <p className="type-caption text-text-secondary mt-tight line-clamp-1">
                        Surfaces that reshape themselves based on user signal.
                      </p>
                    </article>
                  </CardSample>
                </div>
              </div>
            </section>

            {/* Logo strip */}
            <section id="logo-strip" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Logo strip" />
              <p className="type-body text-text-secondary max-w-2xl">
                Self-hosted SVGs. Navy filter. CSS-only marquee at 100s for peripheral motion.
              </p>
              <div className="rounded-card border border-border-primary bg-surface-primary overflow-hidden py-loose">
                <CompanyLogoCarousel companies={companyLogos} size="sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-default type-caption">
                <div className="flex items-baseline gap-snug">
                  <span className="type-eyebrow text-text-tertiary">Data</span>
                  <code className="font-mono px-tight bg-accent-subtle rounded-input text-text-secondary">company-logos.ts</code>
                </div>
                <div className="flex items-baseline gap-snug">
                  <span className="type-eyebrow text-text-tertiary">Component</span>
                  <code className="font-mono px-tight bg-accent-subtle rounded-input text-text-secondary">CompanyLogoCarousel</code>
                </div>
                <div className="flex items-baseline gap-snug">
                  <span className="type-eyebrow text-text-tertiary">Sizes</span>
                  <span className="text-text-secondary">xs · sm · md · lg</span>
                </div>
              </div>
            </section>

            {/* News strip */}
            <section id="news-strip" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="News strip" />
              <p className="type-body text-text-secondary max-w-2xl">
                Timeline of newsletter issues on <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">/news</code>. Today&apos;s row gets a tinted surface and a status pill.
              </p>
              <div className="rounded-card border border-border-primary overflow-hidden bg-surface-primary">
                {[
                  {
                    date: 'May 28',
                    title: 'AI UX Daily: Users reject AI-first search — DuckDuckGo installs spike 30%',
                    summary: 'Three stories about how designers need to rethink interfaces when AI agents have real autonomy, from trading stocks to scheduling.',
                    read: '9 min read',
                    today: true,
                  },
                  {
                    date: 'May 27',
                    title: 'AI UX Daily: Context Wins, Honesty Matters, Design Systems Evolve',
                    summary: 'As AI agents handle longer tasks, design systems need memory, prototypes need authenticity, and designers need a new vocabulary.',
                    read: '9 min read',
                    today: false,
                  },
                  {
                    date: 'May 26',
                    title: "AI UX Daily: Google's Real-Time AI Design, Notion's Workspace Agents",
                    summary: 'Google launches a real-time AI design tool, Notion opens its workspace to native agents, and Replit ships parallel coding.',
                    read: '8 min read',
                    today: false,
                  },
                ].map((row, i, arr) => (
                  <div
                    key={row.date}
                    className={`group flex items-start gap-default px-default py-default cursor-pointer transition-colors duration-quick ease-out-expo hover:bg-surface-secondary/50 ${
                      row.today ? 'bg-accent-subtle/30' : ''
                    } ${i !== arr.length - 1 ? 'border-b border-border-secondary' : ''}`}
                  >
                    {/* Dot */}
                    <span className="mt-2 w-2 h-2 rounded-full bg-text-tertiary flex-shrink-0 group-hover:bg-accent-primary transition-colors duration-quick" aria-hidden />

                    {/* Date */}
                    <span className="type-body text-text-tertiary w-20 flex-shrink-0 tabular-nums mt-0.5">{row.date}</span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-snug flex-wrap">
                        <span className="type-body font-semibold text-text-primary group-hover:text-accent-primary transition-colors duration-quick">
                          {row.title}
                        </span>
                        {row.today && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="type-caption text-text-secondary line-clamp-1 mt-1">{row.summary}</p>
                      <span className="type-caption text-text-secondary mt-1 inline-block">{row.read}</span>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 mt-1.5 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-quick flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </section>

            {/* Email capture */}
            <section id="email-capture" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Email capture" />
              <p className="type-body text-text-secondary max-w-2xl">
                Email + submit pair, used across the audit unlock, newsletter signups, pattern pages, and guides.
                Same primitives, three densities.
              </p>

              {/* Inline — default */}
              <div className="rounded-card border border-border-primary bg-surface-primary p-loose space-y-snug">
                <p className="type-eyebrow text-text-tertiary">Inline · default</p>
                <form className="flex flex-col sm:flex-row gap-snug">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="flex-1 rounded-input border border-border-primary bg-surface-primary px-default py-snug type-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus"
                  />
                  <button
                    type="button"
                    className="bg-accent-primary text-background-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Stacked — paywall */}
              <div className="rounded-card border border-border-primary bg-surface-primary p-loose space-y-default">
                <p className="type-eyebrow text-text-tertiary">Stacked · audit unlock</p>
                <div className="space-y-snug max-w-md">
                  <h4 className="type-h3 text-text-primary">Unlock 3 more audits</h4>
                  <p className="type-body text-text-secondary">
                    Drop your email. We&apos;ll send the report and unlock 3 more runs.
                  </p>
                  <form className="space-y-snug pt-snug">
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="w-full rounded-input border border-border-primary bg-surface-primary px-default py-snug type-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus"
                    />
                    <button
                      type="submit"
                      className="w-full bg-accent-primary text-background-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo"
                    >
                      Unlock 3 more audits
                    </button>
                  </form>
                </div>
              </div>

              {/* Compact — footer */}
              <div className="rounded-card border border-border-primary bg-surface-primary p-loose">
                <p className="type-eyebrow text-text-tertiary mb-snug">Compact · footer / sidebar</p>
                <form className="flex gap-snug">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 min-w-0 rounded-input border border-border-primary bg-surface-primary px-snug py-tight type-caption text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus"
                  />
                  <button
                    type="button"
                    className="bg-accent-primary text-background-primary px-default py-tight rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo"
                  >
                    Join
                  </button>
                </form>
              </div>

              <p className="type-caption text-text-tertiary">
                Shared component: <code className="font-mono px-tight bg-accent-subtle rounded-input">InlineNewsletterSignup</code>.
                Variant <code className="font-mono px-tight bg-accent-subtle rounded-input">hero</code> / <code className="font-mono px-tight bg-accent-subtle rounded-input">inline</code> / <code className="font-mono px-tight bg-accent-subtle rounded-input">stacked</code>, plus <code className="font-mono px-tight bg-accent-subtle rounded-input">darkBackground</code> and <code className="font-mono px-tight bg-accent-subtle rounded-input">secondary</code> flags.
              </p>
            </section>

            {/* Primitives */}
            <section id="primitives" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Primitives" />
              <p className="type-body text-text-secondary max-w-2xl">
                Button, Dialog, and Input live in <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">src/components/ui/</code>.
                Supporting hooks: <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">useScrollLock</code>, <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">useClickOutside</code>, <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">useFocusTrap</code>.
              </p>

              <div className="rounded-card border border-border-primary bg-surface-primary p-loose space-y-loose">
                {/* Button */}
                <div className="space-y-snug">
                  <p className="type-eyebrow text-text-tertiary">Button</p>
                  <div className="flex flex-wrap items-center gap-default">
                    <button className="bg-accent-primary text-background-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-hover transition-colors duration-quick ease-out-expo">
                      Primary
                    </button>
                    <button className="bg-surface-primary text-text-primary border border-border-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-subtle transition-colors duration-quick ease-out-expo">
                      Secondary
                    </button>
                    <button className="text-text-primary px-loose py-snug rounded-input type-caption font-semibold hover:bg-accent-subtle transition-colors duration-quick ease-out-expo">
                      Ghost
                    </button>
                  </div>
                </div>

                <hr className="border-border-primary" />

                {/* Dialog + Input live demo */}
                <PrimitivesDemo />
              </div>
            </section>

            {/* Accessibility */}
            <section id="accessibility" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Accessibility" />
              <ul className="space-y-snug">
                {[
                  'WCAG 2.2 AA contrast on every paired token.',
                  'Keyboard navigation on every interactive surface. No bare focus removal.',
                  'Focus rings via --ring-focus. Dark-mode aware.',
                  'next/font handles swap with adjustFontFallback. No layout reflow.',
                  'Required alt text on images. Empty alt only for decorative.',
                ].map((line, i) => (
                  <li key={i} className="flex gap-snug">
                    <span className="type-caption tabular-nums text-text-tertiary mt-1">{String(i + 1).padStart(2, '0')}</span>
                    <p className="type-body text-text-secondary flex-1">{line}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Defensive moves */}
            <section id="defensive" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Conventions" />
              <p className="type-body text-text-secondary max-w-2xl">
                Each tied to a specific production incident.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-loose">
                {DEFENSIVE_MOVES.map((m) => (
                  <div key={m.title} className="rounded-card border border-border-primary bg-surface-primary p-loose space-y-snug">
                    <div className="flex items-start justify-between gap-default">
                      <h3 className="type-h3 text-text-primary">{m.title}</h3>
                    </div>
                    <p className="type-body text-text-secondary">{m.body}</p>
                    <p className="type-caption text-text-tertiary">{m.incident}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Backlog */}
            <section id="backlog" className="space-y-loose scroll-mt-roomy">
              <SectionHeader title="Open work" />
              <p className="type-body text-text-secondary max-w-2xl">
                Run <code className="font-mono type-caption px-tight bg-accent-subtle rounded-input">npm run design-audit:report</code> for the live counts.
              </p>
              <div className="rounded-card border border-border-primary overflow-hidden">
                {BACKLOG.map((b, i, arr) => (
                  <div
                    key={b.item}
                    className={`grid grid-cols-[auto_1fr] gap-default px-default py-snug items-baseline ${
                      i !== arr.length - 1 ? 'border-b border-border-primary' : ''
                    }`}
                  >
                    <span className="type-caption tabular-nums text-text-tertiary">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-default">
                      <p className="type-body text-text-primary">{b.item}</p>
                      <p className="type-caption text-text-tertiary">{b.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border-primary pt-loose">
              <p className="type-caption text-text-tertiary">
                Guide Design System ·{' '}
                <Link href="/" className="underline hover:text-text-primary transition-colors duration-quick">
                  aiuxdesign.guide
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

// ----- internal helpers -----

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-border-primary pb-snug">
      <h2 className="type-h2 text-text-primary">{title}</h2>
    </div>
  );
}

function CardSample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-tight">
      {children}
      <p className="type-caption text-text-tertiary">{label}</p>
    </div>
  );
}

function RadiusSample({ name, example }: { name: string; example: React.ReactNode }) {
  return (
    <div className="space-y-tight">
      <div className="bg-background-secondary p-loose rounded-card flex items-center justify-center min-h-32">
        {example}
      </div>
      <p className="type-caption font-mono text-text-secondary">.{name}</p>
    </div>
  );
}

function MockInput() {
  return (
    <div className="w-full max-w-xs">
      <div className="rounded-input border border-border-primary bg-surface-primary px-default py-snug type-caption text-text-tertiary">
        Search patterns…
      </div>
    </div>
  );
}

function MockCard() {
  return (
    <div className="w-full max-w-xs rounded-card border border-border-primary bg-surface-primary p-default shadow-card">
      <p className="type-eyebrow text-text-tertiary mb-tight">Pattern</p>
      <p className="type-body font-semibold text-text-primary">Confidence visualization</p>
    </div>
  );
}

function MockModal() {
  return (
    <div className="w-full max-w-sm rounded-modal bg-surface-primary p-loose shadow-modal border border-border-primary">
      <p className="type-h3 text-text-primary mb-snug">Unlock 3 more audits</p>
      <p className="type-caption text-text-secondary">Enter your email to continue.</p>
    </div>
  );
}

function MockPill() {
  return (
    <span className="rounded-pill bg-accent-primary text-background-primary px-default py-tight type-caption font-semibold">
      AI UX pattern
    </span>
  );
}
