'use client';

import { useState } from 'react';

export function HandbookHero() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const subscribeResponse = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!subscribeResponse.ok) {
        const data = await subscribeResponse.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      const handbookResponse = await fetch('/api/handbook/generate-pdf');
      const handbookHTML = await handbookResponse.text();

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        const element = document.createElement('div');
        element.innerHTML = handbookHTML;

        const opt = {
          margin: 0,
          filename: 'AI-Design-Patterns.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'in', format: 'letter' },
        };

        // @ts-ignore
        window.html2pdf().set(opt).from(element).save();
        setIsDownloaded(true);
        setEmail('');
      };

      script.onerror = () => {
        setError('Failed to generate PDF. Please try again.');
      };

      document.head.appendChild(script);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background-primary">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground-primary mb-4">
          Get 6 Essential AI Design Patterns
        </h1>
        <p className="text-lg text-foreground-secondary mb-2">
          Free handbook with proven patterns from Apple, Google, GitHub, and Figma
        </p>
        <p className="text-sm text-foreground-tertiary mb-8">
          15-minute read • 100% free • No spam
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={isDownloaded}
              className="flex-1 px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition"
              required
            />
            <button
              type="submit"
              disabled={isLoading || isDownloaded}
              className="px-6 py-3 bg-accent-primary text-background-primary font-semibold rounded-lg hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? 'Getting...' : isDownloaded ? '✓ Downloaded!' : 'Download'}
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg max-w-lg mx-auto">
              {error}
            </div>
          )}
        </form>

        {isDownloaded && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-lg mx-auto">
            <p className="text-green-700 font-semibold">Check your email!</p>
            <p className="text-green-600 text-sm">Your handbook is downloading.</p>
          </div>
        )}
      </div>
    </section>
  );
}
