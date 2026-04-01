'use client';

import { useState, useEffect } from 'react';

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: string;
  publishDate: string;
  createdAt: string;
}

export default function PublishClient() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [isLoadingNewsletters, setIsLoadingNewsletters] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    setIsLoadingNewsletters(true);
    try {
      const res = await fetch('/api/newsletter/drafts?status=published');
      const data = await res.json();
      if (data.drafts && Array.isArray(data.drafts)) {
        setNewsletters(data.drafts);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setIsLoadingNewsletters(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Publish to Beehiiv</h1>
        <p className="text-text-secondary mt-1">
          Copy newsletter content and paste into Beehiiv editor
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR: Newsletter Selector + Copy Actions */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select Newsletter
            </label>
            <select
              value={selectedNewsletter?.id || ''}
              onChange={async (e) => {
                const nl = newsletters.find((n) => n.id === e.target.value);
                setCopiedField(null);
                if (!nl) {
                  setSelectedNewsletter(null);
                  return;
                }
                setIsLoadingContent(true);
                try {
                  const res = await fetch(`/api/newsletter/drafts?id=${nl.id}`);
                  const full = await res.json();
                  if (full && full.id) {
                    setSelectedNewsletter(full);
                  }
                } catch {
                  setSelectedNewsletter(nl as Newsletter);
                } finally {
                  setIsLoadingContent(false);
                }
              }}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              disabled={isLoadingNewsletters}
            >
              <option value="">
                {isLoadingNewsletters ? 'Loading newsletters...' : 'Choose a published newsletter...'}
              </option>
              {newsletters.map((nl) => (
                <option key={nl.id} value={nl.id}>
                  {nl.title} ({new Date(nl.publishDate || nl.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>

            {selectedNewsletter && (
              <div className="mt-4 pt-4 border-t border-border-secondary space-y-2">
                <button
                  onClick={() => copyToClipboard(selectedNewsletter.title, 'title')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    copiedField === 'title'
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                  }`}
                >
                  <span className="font-medium">1. Title</span>
                  <span className="text-xs">{copiedField === 'title' ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(selectedNewsletter.summary || '', 'subtitle')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    copiedField === 'subtitle'
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                  }`}
                >
                  <span className="font-medium">2. Subtitle</span>
                  <span className="text-xs">{copiedField === 'subtitle' ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => {
                    // Strip the leading summary paragraph since it's already the subtitle
                    const contentWithoutSummary = selectedNewsletter.content.replace(/^\s*<p[^>]*>.*?<\/p>\s*/, '');
                    const wrappedContent = `<div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${contentWithoutSummary}</div>`;
                    copyToClipboard(wrappedContent, 'html');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    copiedField === 'html'
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                  }`}
                >
                  <span className="font-medium">3. Content HTML</span>
                  <span className="text-xs">{copiedField === 'html' ? 'Copied!' : 'Copy'}</span>
                </button>

                <a
                  href="https://app.beehiiv.com/create/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center mt-2 px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-sm font-medium"
                >
                  Open Beehiiv Editor &rarr;
                </a>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN: Newsletter Preview */}
        <div className="md:col-span-8 space-y-6">
          {isLoadingContent ? (
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <div className="text-center py-8">
                <p className="text-text-tertiary">Loading newsletter...</p>
              </div>
            </div>
          ) : !selectedNewsletter ? (
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <div className="text-center py-8">
                <p className="text-text-tertiary">Select a newsletter to preview and copy to Beehiiv</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-primary rounded-lg border border-border-primary overflow-hidden">
              <div className="bg-background-secondary p-4 border-b border-border-primary">
                <h2 className="text-lg font-semibold text-text-primary">{selectedNewsletter.title}</h2>
              </div>
              <div className="p-4">
                <div
                  className="prose prose-sm max-w-none text-text-primary prose-headings:text-text-primary prose-a:text-accent-primary"
                  style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
