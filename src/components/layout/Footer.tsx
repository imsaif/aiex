export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-primary">
      {/* Multi-Column Footer Section */}
      <div className="border-t border-primary">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Left Section: Branding */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-10 h-10 bg-accent-subtle border border-primary rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-primary">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
                  </svg>
                </span>
                <h3 className="text-2xl font-semibold text-text-primary">aiux</h3>
              </div>
              <p className="text-text-secondary text-base leading-relaxed">
                Discover, Compare, and Leverage the Best AI Design Patterns
              </p>
              <p className="text-text-secondary text-sm mt-3 flex items-center gap-1.5">
                Built with{' '}
                <a
                  href="https://claude.ai/code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-primary transition-colors"
                >
                  Claude Code
                </a>
                {' '}by Anthropic
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 ml-0.5"
                  aria-label="Anthropic logo"
                >
                  <path fillRule="evenodd" d="M9.218 2h2.402L16 12.987h-2.402zM4.379 2h2.512l4.38 10.987H8.82l-.895-2.308h-4.58l-.896 2.307H0L4.38 2.001zm2.755 6.64L5.635 4.777 4.137 8.64z" />
                </svg>
              </p>
            </div>

            {/* Right Section: Footer Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      href="mailto:imranrizom@gmail.com"
                      className="text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Submit Feedback
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
                      href="https://www.imranaidesign.com/"
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Email */}
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
