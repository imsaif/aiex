'use client';

import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface NewsletterDraftSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: string;
  type: string;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NewsletterQA {
  sourceCounts?: Record<string, number>;
  designNativeCount?: number;
  designLightWarning?: boolean;
  poolSize?: number;
  duplicateSourceClipped?: string[];
  // Set when the selection broke a counted rule (product-news floor, opinion
  // items, per-company cap) and the retry didn't fix it. Before 2026-08-08 this
  // suppressed the draft's real title and summary; the draft now ships intact.
  // Only `opinion_present` and `company_cap` render a banner — see the note at the
  // render site for why `no_product_news` is stored but not shown.
  selectionRuleViolation?: string | null;
  productNewsCount?: number;
  opinionCount?: number;
  retryOutcome?: string;
  elapsedMs?: number;
}

interface NewsletterDraft extends NewsletterDraftSummary {
  content: string;
  sources: unknown;
  structuredData?: { qa?: NewsletterQA } | null;
}

interface AdminNewsletterClientProps {
  drafts: NewsletterDraftSummary[];
  selectedId?: string;
  initialAuth?: boolean;
}

export default function AdminNewsletterClient({
  drafts: initialDrafts,
  selectedId,
  initialAuth = false,
}: AdminNewsletterClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [drafts, setDrafts] = useState<NewsletterDraftSummary[]>(initialDrafts);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeDraft, setActiveDraft] = useState<NewsletterDraft | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showDraftList, setShowDraftList] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  // Sanitize HTML content for preview to prevent XSS and make links open in new tab
  const sanitizedPreviewContent = useMemo(() => {
    if (typeof window === 'undefined') return editedContent;
    const sanitized = DOMPurify.sanitize(editedContent, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['target', 'rel'],
    });
    // Add target="_blank" and rel="noopener noreferrer" to all links
    return sanitized.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  }, [editedContent]);

  // Fetch drafts after authentication (pending_review by default)
  const fetchDrafts = async (page: number, all = false, append = false) => {
    setIsLoadingDrafts(true);
    try {
      const status = all ? 'all' : 'pending_review';
      const res = await fetch(`/api/newsletter/drafts?status=${status}&page=${page}&limit=20`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.drafts) {
        setDrafts(prev => append ? [...prev, ...data.drafts] : data.drafts);
        setHasMore(data.pagination?.hasMore ?? false);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDrafts(1, showAll);
    }
  }, [isAuthenticated, showAll]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch full draft content by ID
  const fetchFullDraft = async (id: string) => {
    setIsLoadingDraft(true);
    // publishedAt is a transient "you just published THIS draft" flag. It is not
    // keyed to a draft id, so leaving it set while switching drafts made the next
    // draft render "Published ✓" and DISABLED its Publish button — you could not
    // publish anything else without a full page reload. Clear it on every load;
    // the button then falls back to the authoritative activeDraft.status.
    setPublishedAt(null);
    try {
      const res = await fetch(`/api/newsletter/drafts?id=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.id) {
        setActiveDraft(data);
        setEditedContent(data.content);
        setEditedTitle(data.title);
        setEditedSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDraft(false);
    }
  };

  // Only auto-load a draft if selectedId is provided via URL (e.g. from admin notification email)
  useEffect(() => {
    if (selectedId && selectedId !== activeDraft?.id) {
      fetchFullDraft(selectedId);
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword(''); // Clear password from memory
      } else {
        setAuthError(data.error || 'Invalid password');
      }
    } catch {
      setAuthError('Login failed. Please try again.');
    }
  };

  const selectDraft = (draft: NewsletterDraftSummary) => {
    setMessage(null);
    setShowDraftList(false);
    fetchFullDraft(draft.id);
  };

  const saveDraft = async () => {
    if (!activeDraft) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeDraft.id,
          title: editedTitle,
          summary: editedSummary,
          content: editedContent,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Draft saved successfully' });
      } else {
        throw new Error('Failed to save draft');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save draft' });
    } finally {
      setIsSaving(false);
    }
  };

  const publishDraft = async () => {
    if (!activeDraft) return;
    setIsPublishing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeDraft.id,
          title: editedTitle,
          summary: editedSummary,
          content: editedContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishedAt(new Date().toISOString());
        // Reflect the new status in both the open draft and the sidebar list, or
        // the list keeps showing "pending review" for an issue that is already
        // live — which reads as "the publish didn't work" and invites a re-click.
        setActiveDraft((prev) => (prev ? { ...prev, status: 'published' } : prev));
        setDrafts((prev) =>
          prev.map((d) => (d.id === activeDraft.id ? { ...d, status: 'published' } : d))
        );
        setMessage({
          type: 'success',
          text: data.message || 'Published to /news. Now copy the HTML and paste into Beehiiv.',
        });
      } else {
        throw new Error('Failed to publish');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish newsletter' });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyHtmlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setMessage({ type: 'error', text: 'Clipboard access denied — select and copy manually from preview' });
    }
  };

  const rejectDraft = async () => {
    if (!activeDraft) return;

    try {
      const response = await fetch('/api/newsletter/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeDraft.id,
          status: 'rejected',
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Draft rejected' });
        window.location.reload();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to reject draft' });
    }
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Newsletter Admin</h1>
          <form onSubmit={handleAuth}>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              placeholder="Enter admin password"
              autoFocus
            />
            {authError && <p className="mt-2 text-sm text-status-error">{authError}</p>}
            <button
              type="submit"
              className="mt-4 w-full bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin interface
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Header with mobile draft selector */}
      <header className="mb-4 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Newsletter</h1>
            <p className="text-text-secondary text-sm md:text-base mt-1 hidden md:block">Review and approve newsletter drafts</p>
          </div>
          {/* Mobile draft selector button */}
          <button
            onClick={() => setShowDraftList(!showDraftList)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-surface-primary border border-border-primary rounded-lg text-sm"
          >
            <span className="text-text-secondary">Drafts</span>
            <span className="bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full text-xs">
              {drafts.filter(d => d.status === 'pending_review').length}
            </span>
            <svg className={`w-4 h-4 text-text-tertiary transition-transform ${showDraftList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Mobile draft list dropdown */}
        {showDraftList && (
          <div className="md:hidden mt-3 bg-surface-primary rounded-lg border border-border-primary shadow-lg max-h-64 overflow-y-auto">
            {isLoadingDrafts ? (
              <p className="p-4 text-text-tertiary text-sm">Loading drafts...</p>
            ) : drafts.length === 0 ? (
              <p className="p-4 text-text-tertiary text-sm">No drafts found</p>
            ) : (
              <div className="divide-y divide-border-secondary">
                {drafts.map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => selectDraft(draft)}
                    className={`w-full text-left p-3 hover:bg-background-secondary transition-colors ${
                      activeDraft?.id === draft.id ? 'bg-accent-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-text-primary text-sm truncate flex-1">{draft.title}</p>
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          draft.status === 'pending_review'
                            ? 'bg-status-warning/20 text-status-warning'
                            : draft.status === 'published'
                              ? 'bg-status-success/20 text-status-success'
                              : 'bg-background-secondary text-text-tertiary'
                        }`}
                      >
                        {draft.status === 'pending_review' ? 'pending' : draft.status}
                      </span>
                    </div>
                  </button>
                ))}
                {hasMore && (
                  <button
                    onClick={() => fetchDrafts(currentPage + 1, true)}
                    disabled={isLoadingDrafts}
                    className="w-full p-3 text-sm text-accent-primary hover:bg-background-secondary transition-colors"
                  >
                    {isLoadingDrafts ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Draft List Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-3">
            <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary">
              <div className="p-4 border-b border-border-primary flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">{showAll ? 'All Drafts' : 'Pending Review'}</h2>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-accent-primary hover:underline"
                >
                  {showAll ? 'Pending only' : 'Show all'}
                </button>
              </div>
              <div className="divide-y divide-border-secondary">
                {isLoadingDrafts ? (
                  <p className="p-4 text-text-tertiary text-sm">Loading drafts...</p>
                ) : drafts.length === 0 ? (
                  <p className="p-4 text-text-tertiary text-sm">No drafts found</p>
                ) : (
                  <>
                    {drafts.map((draft) => (
                      <button
                        key={draft.id}
                        onClick={() => selectDraft(draft)}
                        className={`w-full text-left p-4 hover:bg-background-secondary transition-colors ${
                          activeDraft?.id === draft.id ? 'bg-accent-primary/10 border-l-2 border-accent-primary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              draft.status === 'pending_review'
                                ? 'bg-status-warning/20 text-status-warning'
                                : draft.status === 'published'
                                  ? 'bg-status-success/20 text-status-success'
                                  : 'bg-background-secondary text-text-tertiary'
                            }`}
                          >
                            {draft.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-medium text-text-primary text-sm truncate">{draft.title}</p>
                        <p className="text-xs text-text-tertiary mt-1">
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                    {hasMore && (
                      <button
                        onClick={() => fetchDrafts(currentPage + 1, true)}
                        disabled={isLoadingDrafts}
                        className="w-full p-3 text-sm text-accent-primary hover:bg-background-secondary transition-colors"
                      >
                        {isLoadingDrafts ? 'Loading...' : 'Load more'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-9">
            {isLoadingDraft ? (
              <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary p-8 text-center">
                <p className="text-text-tertiary">Loading draft...</p>
              </div>
            ) : activeDraft ? (
              <div className="space-y-4">
                {/* Action Bar - Mobile optimized */}
                <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Save / Reject */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                      <button
                        onClick={saveDraft}
                        disabled={isSaving}
                        className="px-3 md:px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors disabled:opacity-50 text-xs md:text-sm font-medium whitespace-nowrap"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this draft?')) {
                            rejectDraft();
                          }
                        }}
                        className="px-3 md:px-4 py-2 text-status-error hover:bg-status-error/10 rounded-md transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </div>

                    {/* Publish + post-publish actions */}
                    <div className="flex items-center justify-end gap-2 md:gap-3 flex-wrap">
                      {(publishedAt || activeDraft.status === 'published') && (
                        <>
                          <button
                            onClick={copyHtmlToClipboard}
                            className="px-3 md:px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            {isCopied ? 'Copied ✓' : 'Copy HTML'}
                          </button>
                          <a
                            href="https://app.beehiiv.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 md:px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            Open Beehiiv ↗
                          </a>
                        </>
                      )}
                      <button
                        onClick={publishDraft}
                        disabled={isPublishing || !!publishedAt || activeDraft.status === 'published'}
                        className="px-4 md:px-5 py-2 bg-status-success text-white rounded-md hover:bg-status-success/90 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                      >
                        {isPublishing ? 'Publishing...' : (publishedAt || activeDraft.status === 'published') ? 'Published ✓' : 'Publish'}
                      </button>
                    </div>
                  </div>
                  {message && (
                    <div
                      className={`mt-3 p-3 rounded-md text-sm ${
                        message.type === 'success'
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-status-error/10 text-status-error'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>

                {/* QA Telemetry Strip — surfaced from structuredData.qa, written
                    by the cron generator. Helps the reviewer spot dev-bias or
                    source-clustering before clicking Publish. */}
                {activeDraft?.structuredData?.qa && (() => {
                  const qa = activeDraft.structuredData!.qa!;
                  const sortedSources = Object.entries(qa.sourceCounts || {})
                    .sort(([, a], [, b]) => b - a);
                  const totalSelected = sortedSources.reduce((sum, [, count]) => sum + count, 0);
                  return (
                    <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary p-3 md:p-4">
                      {/* Selection-rule flag, shown ONLY for `opinion_present` and
                          `company_cap`.

                          `no_product_news` is deliberately not surfaced. Measured
                          2026-08-08 over every daily ever generated (~210 drafts): the
                          selection guard fired 10 times and was `no_product_news` all
                          10; `opinion_present` and `company_cap` have never fired. Of
                          those 10, eight were rejected — but each had already been
                          stripped to `content: ''` with its title replaced, so the
                          rejection judged an empty husk, not the issue. The single
                          flagged draft that ever reached the reviewer intact (08-08)
                          was PUBLISHED. So the rule is 0-for-1 on verified accuracy and
                          the banner was pure noise; it says only "no pick came from one
                          of the 21 company-blog feeds," which is silent on quality. The
                          value stays in `structuredData.qa` for debugging a run.

                          The other two are kept because each marks a real defect with a
                          real precedent: an opinion-mill item reaching the daily, and
                          the June "three Figma stories in one issue" complaint that
                          `company_cap` was written for. Both are unproven only because
                          neither has ever fired.

                          If `no_product_news` is ever made story-aware rather than
                          feed-aware, re-evaluate showing it. Styling note: tinted
                          background and border with `text-text-primary`, since
                          status-coloured text fails contrast as body copy, and the
                          "Flagged" label carries the meaning so it never rests on
                          colour alone. */}
                      {/* 2026-08-18: `no_product_news` was renamed
                          `product_news_floor` when the floor went from a flat 1 to
                          "at least half, min 2". Both prefixes stay suppressed — the
                          rule is still FEED-aware (a source-tier proxy), not
                          story-aware, so the condition named above for re-evaluating
                          the banner is still not met. Revisit only if the counter
                          starts reading the story itself. */}
                      {qa.selectionRuleViolation &&
                        !qa.selectionRuleViolation.startsWith('no_product_news') &&
                        !qa.selectionRuleViolation.startsWith('product_news_floor') && (
                        <div className="mb-3 p-2.5 rounded-md bg-status-warning/10 border border-status-warning/40 text-text-primary text-xs md:text-sm">
                          <span className="font-semibold">⚠ Flagged &mdash; selection rule broken:</span>{' '}
                          <span className="font-mono">{qa.selectionRuleViolation}</span>
                          <div className="mt-1 text-text-secondary">
                            {qa.selectionRuleViolation.startsWith('opinion_present')
                              ? 'The selection includes opinion-domain items the daily is not meant to carry. Swap them or re-run.'
                              : 'One company or source exceeded the per-issue cap. Re-run for a more diverse pick.'}
                            {qa.retryOutcome && qa.retryOutcome !== 'not_needed' && (
                              <> Retry: <span className="font-mono">{qa.retryOutcome}</span>
                                {typeof qa.elapsedMs === 'number' && <> &middot; run took {(qa.elapsedMs / 1000).toFixed(1)}s</>}.</>
                            )}
                          </div>
                        </div>
                      )}
                      {qa.designLightWarning && (
                        <div className="mb-3 p-2.5 rounded-md bg-status-warning/10 text-status-warning text-xs md:text-sm font-medium">
                          ⚠ Design-light: 0 design-native items in this selection. Review carefully before publishing.
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          Source mix &middot; {qa.designNativeCount ?? 0}/{totalSelected} design-native &middot; pool of {qa.poolSize ?? '?'}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sortedSources.map(([source, count]) => (
                          <span
                            key={source}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-background-secondary text-text-primary border border-border-primary"
                          >
                            {source}
                            {count > 1 && <span className="font-mono text-text-tertiary">×{count}</span>}
                          </span>
                        ))}
                      </div>
                      {qa.duplicateSourceClipped && qa.duplicateSourceClipped.length > 0 && (
                        <div className="mt-2 text-xs text-text-tertiary">
                          Pool cap clipped extras from: {qa.duplicateSourceClipped.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Content Card */}
                <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary">
                {/* Header - Title & Summary */}
                <div className="p-4 md:p-6 border-b border-border-primary">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-lg md:text-xl font-bold text-text-primary w-full border border-dashed border-border-secondary rounded px-2 py-1 focus:ring-1 focus:ring-accent-primary focus:border-accent-primary bg-transparent"
                  />
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="mt-2 text-sm md:text-base text-text-secondary w-full border border-dashed border-border-secondary rounded px-2 py-1 focus:ring-1 focus:ring-accent-primary focus:border-accent-primary resize-none bg-transparent"
                    rows={2}
                  />
                </div>

                {/* Preview */}
                <div className="p-4 md:p-6">
                  <div className="mb-3 md:mb-4 flex items-center justify-between">
                    <h3 className="text-xs md:text-sm font-medium text-text-secondary">Preview</h3>
                    <span className="text-xs text-text-tertiary hidden md:inline">Shown as it will appear in email</span>
                  </div>

                  {/* Newsletter Preview - Always light mode to match email appearance */}
                  <div className="border border-border-primary rounded-lg p-4 md:p-6 bg-white overflow-x-auto">
                    <div
                      className="prose prose-sm md:prose max-w-none prose-neutral"
                      style={{ colorScheme: 'light' }}
                      dangerouslySetInnerHTML={{ __html: sanitizedPreviewContent }}
                    />
                  </div>

                  {/* Raw HTML Editor - Collapsed by default on mobile for reading focus */}
                  <details className="mt-4 md:mt-6">
                    <summary className="text-xs md:text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary">
                      Edit HTML
                    </summary>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="mt-2 w-full h-48 md:h-64 p-3 md:p-4 font-mono text-xs md:text-sm border border-border-primary rounded-lg bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                    />
                  </details>
                </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary p-8 md:p-12 text-center">
                <p className="text-text-tertiary">
                  <span className="md:hidden">Tap &quot;Drafts&quot; above to select</span>
                  <span className="hidden md:inline">Select a draft to preview and edit</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
