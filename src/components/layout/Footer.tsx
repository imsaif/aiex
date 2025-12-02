'use client';

import { useState, FormEvent } from 'react';
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already-subscribed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else if (response.status === 400 && data.error?.includes('already subscribed')) {
        // User is already subscribed - offer handbook download instead
        setStatus('already-subscribed');
        setErrorMessage('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleHandbookDownload = async () => {
    setIsGeneratingPDF(true);

    try {
      const handbookResponse = await fetch('/api/handbook/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!handbookResponse.ok) {
        const data = await handbookResponse.json();
        throw new Error(data.error || 'Failed to generate handbook');
      }

      const { html: handbookHTML } = await handbookResponse.json();

      // Generate PDF using html2pdf
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        const element = document.createElement('div');
        const sanitizedHTML = DOMPurify.sanitize(handbookHTML, {
          ALLOWED_TAGS: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'strong', 'em', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'img', 'a', 'span', 'br'],
          ALLOWED_ATTR: ['class', 'style', 'src', 'alt', 'href', 'id']
        });
        element.innerHTML = sanitizedHTML;

        const opt = {
          margin: 0,
          filename: 'AI-Design-Patterns.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'in', format: 'letter' },
        };

        // @ts-ignore - html2pdf is loaded dynamically
        window.html2pdf().set(opt).from(element).save();

        setStatus('success');
        setEmail('');
        setIsGeneratingPDF(false);
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      };

      script.onerror = () => {
        setErrorMessage('Failed to generate PDF. Please try again.');
        setIsGeneratingPDF(false);
        setStatus('error');
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Handbook download error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setIsGeneratingPDF(false);
      setStatus('error');
    }
  };

  return (
    <footer className="bg-background-secondary border-t border-primary">
      {/* Newsletter Section - with hero background + grain */}
      <section id="newsletter" className="py-24 md:py-32 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
              Get Notified on New Patterns
            </h2>
            <p className="text-text-secondary text-lg mb-10">
              Subscribe to receive updates when new AI design patterns are added
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === 'loading'}
                  aria-label="Email address"
                  className="flex-1 px-4 py-3 rounded-full border border-primary bg-surface-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Subscribe"
                >
                  {status === 'loading' ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRightIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="mt-3 text-sm text-accent-primary">
                  ✓ Thanks for subscribing! Check your email for confirmation.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
              {status === 'already-subscribed' && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-accent-primary font-medium">
                    ✓ You're already subscribed to our newsletter!
                  </p>
                  <p className="text-sm text-text-secondary">
                    Want to download the free AI Design Patterns Handbook?
                  </p>
                  <button
                    onClick={handleHandbookDownload}
                    disabled={isGeneratingPDF}
                    className="w-full px-4 py-2 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isGeneratingPDF ? (
                      <span className="flex items-center justify-center gap-2">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Preparing handbook...
                      </span>
                    ) : (
                      '📖 Download Handbook'
                    )}
                  </button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="w-full px-4 py-2 text-text-secondary hover:text-text-primary transition text-sm"
                  >
                    No thanks, I'm all set
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

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
              <p className="text-text-secondary text-sm leading-relaxed">
                Discover, Compare, and Leverage the Best AI Design Patterns
              </p>
            </div>

            {/* Right Section: Footer Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* RESOURCES Column */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-5">
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#patterns"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      All Patterns
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#patterns"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Browse Categories
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex/blob/master/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Contribute
                    </a>
                  </li>
                  <li>
                    <a
                      href="#newsletter"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex?tab=readme-ov-file#ai-design-patterns"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:imranrizom@gmail.com"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Submit Feedback
                    </a>
                  </li>
                </ul>
              </div>

              {/* COMPANY Column */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-5">
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/about"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:imranrizom@gmail.com"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* LINKS Column */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-5">
                  Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.imranaidesign.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/imsaif/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/imsaif/aiex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
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
