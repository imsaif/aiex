import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About aiux | 28 Curated AI UX Patterns from Leading Products',
  description: 'Learn about aiux, a curated collection of 28 AI design patterns mined from ChatGPT, Claude, Midjourney, GitHub Copilot, and more. Build better AI-powered experiences.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
            About aiux
          </h1>
          <p className="text-xl text-text-secondary">
            Your Complete Toolkit for AI UX — Patterns, Prompts, and Tools
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Mission */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">Our Mission</h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                aiux is a curated collection of <strong>28 AI design patterns</strong> designed to help designers, developers,
                and product teams build better AI-powered user experiences. We believe that great AI products require thoughtful
                design patterns that balance innovation with usability, transparency, and ethical considerations.
              </p>
            </div>

            {/* Our Methodology */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-text-primary">Our Methodology</h2>
              <p className="text-text-secondary leading-relaxed text-lg mb-10">
                We document patterns from real AI products already serving millions of users. This is design pattern mining—observing what works and making it actionable.
              </p>

              {/* 3-Column Card Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pattern Discovery Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card">
                  <h3 className="text-lg font-medium mb-4 text-text-primary">Pattern Discovery</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    We analyze how leading AI products—ChatGPT, Claude, Midjourney, GitHub Copilot, Notion AI—solve common UX challenges. When a design decision works across multiple products, we dig deeper.
                  </p>
                </div>

                {/* What Earns a Spot Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card">
                  <h3 className="text-lg font-medium mb-4 text-text-primary">What Earns a Spot</h3>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex gap-2">
                      <span className="text-accent-primary font-bold">✓</span>
                      <span><strong className="text-text-primary">3+ implementations</strong> – Works in multiple real products</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-primary font-bold">✓</span>
                      <span><strong className="text-text-primary">Real problem</strong> – Fundamental AI UX challenge</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-primary font-bold">✓</span>
                      <span><strong className="text-text-primary">Actionable</strong> – Code + clear guidance included</span>
                    </li>
                  </ul>
                </div>

                {/* Standing on Shoulders Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card">
                  <h3 className="text-lg font-medium mb-4 text-text-primary">Standing on Shoulders</h3>
                  <p className="text-text-secondary leading-relaxed text-sm mb-4">
                    Grounded in established frameworks:
                  </p>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li><a href="https://pair.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Google's People + AI</a></li>
                    <li><a href="https://developer.apple.com/design/human-interface-guidelines/machine-learning" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Apple's ML Guidelines</a></li>
                    <li>HCI & AI research</li>
                    <li>Community best practices</li>
                  </ul>
                </div>
              </div>

              {/* Closing statement */}
              <p className="text-text-secondary leading-relaxed text-sm italic">
                This is a living collection. Patterns evolve as new products demonstrate better approaches, techniques improve, and the community shares insights.
              </p>
            </div>

            {/* What We Offer */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">What We Offer</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Our collection covers 8 key categories of AI design patterns:
              </p>
              <ul className="space-y-3 text-text-secondary">
                <li><strong className="text-text-primary">Adaptive & Intelligent Systems (4 patterns)</strong> - Design AI systems that learn from user behavior and adapt in real-time</li>
                <li><strong className="text-text-primary">Human-AI Collaboration (6 patterns)</strong> - Create seamless partnerships between humans and AI for enhanced productivity</li>
                <li><strong className="text-text-primary">Trustworthy & Reliable AI (5 patterns)</strong> - Build AI systems that are transparent, fair, and robust against failures</li>
                <li><strong className="text-text-primary">Natural Interaction (4 patterns)</strong> - Enable intuitive and natural communication between users and AI</li>
                <li><strong className="text-text-primary">Performance & Efficiency (2 patterns)</strong> - Optimize AI interactions for speed, resource usage, and user productivity</li>
                <li><strong className="text-text-primary">Privacy & Control (2 patterns)</strong> - Empower users with data control and transparent privacy practices</li>
                <li><strong className="text-text-primary">Safety & Harm Prevention (4 patterns)</strong> - Protect users from manipulation, crises, and harmful AI behaviors</li>
                <li><strong className="text-text-primary">Accessibility & Inclusion (1 pattern)</strong> - Design AI that works for diverse users and contexts</li>
              </ul>
            </div>

            {/* By The Numbers */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-text-primary">By The Numbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 border border-gray-200 rounded-2xl bg-surface-primary shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="text-4xl font-semibold text-accent-primary mb-2">50+</div>
                  <p className="text-text-secondary">AI products analyzed continuously</p>
                </div>
                <div className="p-8 border border-gray-200 rounded-2xl bg-surface-primary shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="text-4xl font-semibold text-accent-primary mb-2">28</div>
                  <p className="text-text-secondary">Validated patterns documented</p>
                </div>
                <div className="p-8 border border-gray-200 rounded-2xl bg-surface-primary shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="text-4xl font-semibold text-accent-primary mb-2">100+</div>
                  <p className="text-text-secondary">Real-world examples referenced</p>
                </div>
                <div className="p-8 border border-gray-200 rounded-2xl bg-surface-primary shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="text-4xl font-semibold text-accent-primary mb-2">8</div>
                  <p className="text-text-secondary">Strategic categories covering all AI UX challenges</p>
                </div>
              </div>
            </div>

            {/* Tools & Resources */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-text-primary">Tools & Resources</h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Beyond patterns, we offer practical tools to help you implement AI design in your workflow.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Figma Prompts Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent-subtle rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent-primary">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">Figma Make Prompts</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    28 copy-paste ready prompts for Figma Make. Generate AI pattern components directly in your design files.
                  </p>
                  <Link
                    href="/prompts"
                    className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium"
                  >
                    Browse Prompts
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Prompt Builder Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent-subtle rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent-primary">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">Prompt Builder</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    Build custom prompts for AI coding assistants. Works with Claude, Cursor, ChatGPT, and GitHub Copilot.
                  </p>
                  <Link
                    href="/prompt-builder"
                    className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium"
                  >
                    Try Builder
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Guides Card */}
                <div className="p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent-subtle rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent-primary">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">Designer Guides</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    Step-by-step learning paths for AI design tools like Claude Code, Cursor, and GitHub Copilot.
                  </p>
                  <Link
                    href="/guides"
                    className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium"
                  >
                    Start Learning
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Open Source */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">Open Source</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                aiux is an open-source project, and we welcome contributions from the community. Whether you want to suggest
                new patterns, improve existing content, or fix bugs, we'd love your help.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/imsaif/aiex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white text-black rounded-full font-medium hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Contribute
                </a>
              </div>
            </div>

            {/* Creator */}
            <div className="mb-16 p-8 bg-surface-primary border border-gray-200 rounded-2xl shadow-card">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">About the Creator</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                aiux is built with ☕ by <strong className="text-text-primary">Imran Mohammed</strong>, a designer and developer
                passionate about creating better AI user experiences. This project represents a commitment to sharing knowledge
                and helping the community build more thoughtful AI products.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.imranaidesign.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-hover transition-colors"
                >
                  Portfolio →
                </a>
                <a
                  href="https://github.com/imsaif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-hover transition-colors"
                >
                  GitHub →
                </a>
                <a
                  href="https://www.linkedin.com/in/imsaif/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-hover transition-colors"
                >
                  LinkedIn →
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">Ready to Get Started?</h2>
              <p className="text-text-secondary mb-10">
                Explore patterns, grab prompts, build custom tools, or learn with our guides.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/#patterns"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Explore Patterns
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/prompts"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white text-black rounded-full font-medium hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Browse Prompts
                </Link>
                <Link
                  href="/prompt-builder"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white text-black rounded-full font-medium hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Try Builder
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white text-black rounded-full font-medium hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Learn with Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
