import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { AboutNewsletter } from './about-newsletter';

export const metadata: Metadata = {
  title: 'About | Imran Mohammed – AI/UX Design Pattern Research',
  description: 'I study how the best AI products are designed and document what makes them work. 28 validated AI/UX design patterns from 50+ shipped products.',
};

const CATEGORIES = [
  { name: 'Adaptive & Intelligent Systems', description: 'AI that learns and adjusts in real-time', count: 4 },
  { name: 'Human-AI Collaboration', description: 'Seamless partnerships between humans and AI', count: 6 },
  { name: 'Trustworthy & Reliable AI', description: 'Transparency, fairness, and graceful failure', count: 5 },
  { name: 'Natural Interaction', description: 'Intuitive communication between people and AI', count: 4 },
  { name: 'Performance & Efficiency', description: 'Speed, latency, and instant responsiveness', count: 2 },
  { name: 'Privacy & Control', description: 'Data control and transparent choices', count: 2 },
  { name: 'Safety & Harm Prevention', description: 'Protecting users from manipulation and harm', count: 4 },
  { name: 'Accessibility & Inclusion', description: 'AI that works for diverse users', count: 1 },
];

const CRITERIA = [
  {
    title: '3+ implementations',
    description: 'Works in multiple real products, not just one team\'s experiment',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0 4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
      </svg>
    ),
  },
  {
    title: 'Real AI/UX problem',
    description: 'Addresses a fundamental challenge unique to AI-powered experiences',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    title: 'Actionable guidance',
    description: 'Every pattern includes code examples, demos, and implementation details',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: 'Research-grounded',
    description: 'Built on Google PAIR, Apple ML Guidelines, HCI research, and community practice',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
];

const STATS = [
  { value: '50+', label: 'AI products analyzed' },
  { value: '28', label: 'Validated patterns' },
  { value: '100+', label: 'Real-world examples' },
  { value: '8', label: 'Strategic categories' },
];

const TOOLS = [
  {
    name: 'Gist.design',
    description: 'An AI design thinking partner. Clarify briefs, map user journeys, critique decisions, and prepare for stakeholder reviews all powered by the 28 patterns documented here.',
    href: 'https://gist.design',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    name: 'Figma Make Prompts',
    description: '28 copy-paste prompts for generating AI pattern components directly in your design files.',
    href: '/prompts',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  {
    name: 'Designer Guides',
    description: 'Step-by-step learning paths for AI design tools like Claude Code, Cursor, and GitHub Copilot.',
    href: '/guides',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    name: 'AI UX Audit Tool',
    description: 'Evaluate your AI product against the pattern framework.',
    href: '/audit',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Section 1: Creator Hero */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-white dark:text-gray-900">IM</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Imran Mohammed</h1>
              <p className="text-text-secondary text-sm mt-1">Product Designer · AI/UX Researcher · Builder</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary ml-[84px] mb-12">
            <a href="https://www.linkedin.com/in/imsaif/" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">LinkedIn</a>
            <span className="text-text-tertiary">·</span>
            <a href="https://medium.com/@imsaif" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Medium</a>
            <span className="text-text-tertiary">·</span>
            <a href="https://github.com/imsaif" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">GitHub</a>
            <span className="text-text-tertiary">·</span>
            <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Portfolio</a>
          </div>

          {/* Section 2: Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            I study how the best AI products are designed and document what makes them work.
          </h2>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-20 md:pb-28">

        {/* Section 3: Bio / Story */}
        <section className="mb-20 space-y-6 text-text-secondary text-lg leading-relaxed">
          <p>
            I&apos;m a product designer with 8+ years of experience building digital products across healthcare, education, and enterprise. I&apos;ve led design teams, <strong className="text-text-primary">lead usability research for Google News and Google Maps</strong>, redesigned enterprise platforms at Optum achieving a <strong className="text-text-primary">27x improvement in task completion</strong>, and built AI-powered educational tools used by over 1000+ schools in Africa.
          </p>
          <p>
            I created aiuxdesign.guide because I kept seeing the same problem: <strong className="text-text-primary">designers are building AI products without a shared vocabulary for what works.</strong> Everyone keeps reinventing solutions that other teams have already figured out.
          </p>
          <p>
            So I systematically study how the world&apos;s leading AI products like ChatGPT, Claude, GitHub Copilot, Midjourney, and Google&apos;s AI features handle their most critical UX challenges. When I find a design decision that works across 3 or more products, I document it as a pattern.
          </p>
          <p>
            So far, that&apos;s <strong className="text-text-primary">28 validated AI/UX design patterns across 8 categories</strong>, analyzed from 50+ shipped AI products used by billions of people, and the collection keeps growing.
          </p>
          <p>
            This site is now <strong className="text-text-primary">referenced by ChatGPT, Claude, Perplexity, and Google</strong> when people ask about AI design patterns, and is shared in enterprise design teams at major tech companies. My weekly analysis of AI product design decisions reaches <strong className="text-text-primary">thousands of designers on Medium</strong>.
          </p>
          <p>
            I&apos;m also building <a href="https://gist.design" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors font-semibold">Gist.design</a>, an AI design thinking partner powered by these 28 patterns that helps designers clarify, map, and critique their work before they open Figma.
          </p>
        </section>

        {/* Section 4: The Pattern Framework */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">The Pattern Framework</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            This isn&apos;t a list of tips. It&apos;s a structured framework for making design decisions in AI products, built the same way Christopher Alexander built architectural patterns: by observing what works in the real world and making it systematic and repeatable.
          </p>
          <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card overflow-hidden">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.name} className={`flex items-baseline justify-between px-6 md:px-8 py-5 ${i < CATEGORIES.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                <div className="flex-1 min-w-0 mr-4">
                  <span className="font-medium text-text-primary">{cat.name}</span>
                  <span className="text-text-tertiary text-sm ml-3 hidden sm:inline">{cat.description}</span>
                  <p className="text-text-tertiary text-sm sm:hidden mt-1">{cat.description}</p>
                </div>
                <span className="text-xs font-medium text-text-secondary bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  {cat.count} {cat.count === 1 ? 'pattern' : 'patterns'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: How Patterns Earn Their Spot */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">How Patterns Earn Their Spot</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            I don&apos;t document theoretical patterns. I document <strong className="text-text-primary">what&apos;s already working</strong> in products serving millions of users. This is design pattern mining: observing solutions in the wild and making them actionable.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CRITERIA.map((item) => (
              <div key={item.title} className="p-8 bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 bg-accent-subtle rounded-xl flex items-center justify-center mb-4 text-accent-primary">
                  {item.icon}
                </div>
                <h3 className="font-medium text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-8 italic">
            This is a living collection. Patterns evolve as products improve, new approaches emerge, and the community contributes insights.
          </p>
        </section>

        {/* Section 6: By the Numbers */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">By the Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.value} className="p-8 bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                <div className="text-4xl font-semibold text-accent-primary mb-2">{stat.value}</div>
                <p className="text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Beyond Patterns */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Beyond Patterns</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            I&apos;ve built additional tools to help designers apply these patterns in their daily work:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="p-8 bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-subtle rounded-xl flex items-center justify-center text-accent-primary flex-shrink-0">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">{tool.name}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{tool.description}</p>
                {tool.external ? (
                  <a href={tool.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium text-sm">
                    Visit {tool.name}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                ) : (
                  <Link href={tool.href} className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium text-sm">
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Open Source */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Open Source</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            This project is open source. If you want to suggest patterns, improve existing content, or contribute examples, I&apos;d welcome it.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/imsaif/aiex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-full font-medium hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
            <a
              href="https://github.com/imsaif/aiex/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent-primary bg-white dark:bg-gray-900 text-accent-primary rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Contribute
            </a>
          </div>
        </section>

        {/* Section 9: Newsletter CTA */}
        <section className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Get my weekly AI/UX analysis</h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            Every week I break down one AI product&apos;s design decisions: what patterns they&apos;re using, what&apos;s working, and what I&apos;d do differently. It&apos;s the analysis I wish existed when I started designing AI products.
          </p>
          <AboutNewsletter />
        </section>

      </div>

      <Footer />
    </main>
  );
}
