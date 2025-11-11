'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function HandbookFinalCTA() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Subscribe to newsletter
      const subscribeResponse = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!subscribeResponse.ok) {
        const data = await subscribeResponse.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Get handbook HTML
      const handbookResponse = await fetch('/api/handbook/generate-pdf');
      const handbookHTML = await handbookResponse.text();

      // Generate PDF using html2pdf
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

        // @ts-ignore - html2pdf is loaded dynamically
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
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-primary/10 via-background-primary to-background-primary">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground-primary mb-4">
            Ready to Master AI Design?
          </h2>
          <p className="text-lg text-foreground-secondary">
            Get the 6 Essential AI Design Patterns handbook and start designing better AI products today.
          </p>
        </motion.div>

        {/* Form */}
        {!isDownloaded ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-4 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="flex-1 px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-accent-primary text-background-primary font-semibold rounded-lg hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Getting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Get Free Handbook
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg max-w-lg mx-auto"
              >
                {error}
              </motion.div>
            )}

            {/* Trust signals */}
            <p className="text-xs text-foreground-tertiary max-w-lg mx-auto">
              ✓ No spam • ✓ Unsubscribe anytime • ✓ Privacy protected
            </p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-green-50 border border-green-200 rounded-lg max-w-lg mx-auto mb-8"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 font-semibold mb-2">Check your email!</p>
            <p className="text-green-600 text-sm">Your handbook is downloading and we've sent you a welcome email. Check your spam folder if you don't see it.</p>
          </motion.div>
        )}

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-sm text-foreground-tertiary max-w-lg mx-auto"
        >
          P.S. You'll get the handbook immediately. No waiting. The handbook is a beautiful PDF you can read offline and share with your team.
        </motion.p>
      </div>
    </section>
  );
}
