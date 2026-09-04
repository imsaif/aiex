import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Footer() {
  return (
    // A plain white band, not a card on a tinted ground. The card read as
    // floating once the console pages tinted the canvas behind it.
    <footer className="border-t border-border-primary bg-background-primary">
      {/* Multi-Column Footer Section — card-on-grain treatment lifted from
          the audit-page resources card so the homepage doesn't render two
          adjacent footers. */}
      <div className="mx-auto max-w-[1600px] px-6 py-12 md:py-16 lg:py-20">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Left Section: Branding */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-10 h-10 bg-accent-subtle border border-primary rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="w-5 h-5 text-text-primary">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
                  </svg>
                </span>
                <h3 className="text-2xl font-semibold text-text-primary">aiux</h3>
              </div>
              <p className="text-text-secondary text-base leading-relaxed">
                AI UX patterns from shipped products. Demos, code, and real examples.
              </p>
              <a
                href="https://aiuxdesign.featurebase.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-medium text-text-secondary border border-primary rounded-lg hover:text-accent-primary hover:border-accent-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" width="16" height="16">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Have an idea? Share feedback
              </a>

              {/* Newsletter signup — compact, site-wide */}
              <div id="newsletter" className="mt-6 scroll-mt-24">
                <p className="text-sm font-medium text-text-primary mb-2">
                  Get daily AI UX news
                </p>
                <InlineNewsletterSignup
                  variant="footer"
                  source="footer"
                  stacked
                  customButtonText="Subscribe"
                  customSuccessMessage="You're in! Check your inbox."
                />
              </div>
            </div>

            {/* Right Section: Footer Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* SERVICES Column */}
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-5">
                  Services
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/services"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Audit my product
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#start"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Request an audit
                    </a>
                  </li>
                </ul>
              </div>

              {/* RESOURCES Column */}
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-5">
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#patterns"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      All Patterns
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#patterns"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Browse Categories
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex/blob/master/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Contribute
                    </a>
                  </li>
                  <li>
                    <a
                      href="/skills"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Claude Code Skills
                    </a>
                  </li>
                  <li>
                    <a
                      href="/toolkit"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      AI Interaction Toolkit
                    </a>
                  </li>
                  <li>
                    <a
                      href="/agent-readability-audit-kit"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Agent Readability Audit
                    </a>
                  </li>
                  <li>
                    <a
                      href="#newsletter"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex?tab=readme-ov-file#ai-design-patterns"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="/prompts"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Figma Make Prompts
                    </a>
                  </li>
                  <li>
                    <a
                      href="/guides"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Designer Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="/design-system"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Design System
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources"
                      className="text-base font-medium text-accent-primary hover:text-accent-hover transition-colors"
                    >
                      All Resources →
                    </a>
                  </li>
                </ul>
              </div>

              {/* COMPANY Column */}
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-5">
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/about"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:imranrizom@gmail.com"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* LINKS Column */}
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-5">
                  Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.imranai.design/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/imsaif/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      More Resources
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Email + theme toggle */}
            <div className="flex items-center gap-3">
              <a
                href="mailto:imranrizom@gmail.com"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                aria-label="Contact via email"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7" />
                </svg>
              </a>
              <ThemeToggle />
            </div>

            {/* Copyright */}
            <div className="text-sm text-text-secondary">
              <p>Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
