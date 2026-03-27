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

interface NewsletterDraft extends NewsletterDraftSummary {
  content: string;
  sources: unknown;
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
  const [sendToSubscribers, setSendToSubscribers] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showDraftList, setShowDraftList] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Fetch drafts after authentication (paginated)
  const fetchDrafts = async (page: number, append = false) => {
    setIsLoadingDrafts(true);
    try {
      const res = await fetch(`/api/newsletter/drafts?page=${page}&limit=20`);
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
    if (isAuthenticated && drafts.length === 0) {
      fetchDrafts(1);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch subscriber count
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/newsletter/subscribers/count')
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === 'number') {
            setSubscriberCount(data.count);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // Fetch full draft content by ID
  const fetchFullDraft = async (id: string) => {
    setIsLoadingDraft(true);
    try {
      const res = await fetch(`/api/newsletter/drafts?id=${id}`);
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

  // Set active draft based on selectedId or first pending draft
  useEffect(() => {
    if (drafts.length === 0) return;
    const targetId = selectedId || drafts.find((d) => d.status === 'pending_review')?.id || drafts[0]?.id;
    if (targetId && targetId !== activeDraft?.id) {
      fetchFullDraft(targetId);
    }
  }, [drafts, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

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
          sendEmail: sendToSubscribers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let successMsg = 'Newsletter published successfully!';
        let msgType: 'success' | 'error' = 'success';
        let hasFailures = false;

        if (sendToSubscribers && data.emailResult) {
          const { successCount, failureCount, totalSubscribers } = data.emailResult;
          hasFailures = failureCount > 0;
          if (hasFailures) {
            successMsg = `Newsletter published. Sent to ${successCount}/${totalSubscribers} subscribers (${failureCount} failed)`;
            msgType = 'error'; // Show as warning
          } else {
            successMsg = `Newsletter published and sent to ${successCount} subscribers!`;
          }
        }

        setMessage({ type: msgType, text: successMsg });
        // Refresh page to update draft list (longer delay if failures so user can see message)
        setTimeout(() => window.location.reload(), hasFailures ? 3000 : 1500);
      } else {
        throw new Error('Failed to publish');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish newsletter' });
    } finally {
      setIsPublishing(false);
    }
  };

  const sendTestEmail = async () => {
    if (!activeDraft) return;
    setIsSendingTest(true);
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
          sendTest: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        throw new Error(data.message || 'Failed to send test');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to send test email: ${error}` });
    } finally {
      setIsSendingTest(false);
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
              <div className="p-4 border-b border-border-primary">
                <h2 className="font-semibold text-text-primary">Drafts</h2>
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
                    {/* Save / Test / Reject */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                      <button
                        onClick={saveDraft}
                        disabled={isSaving}
                        className="px-3 md:px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors disabled:opacity-50 text-xs md:text-sm font-medium whitespace-nowrap"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={sendTestEmail}
                        disabled={isSendingTest}
                        className="px-3 md:px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors disabled:opacity-50 text-xs md:text-sm font-medium whitespace-nowrap"
                      >
                        {isSendingTest ? 'Sending...' : 'Test'}
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

                    {/* Publish */}
                    <div className="flex items-center justify-between gap-2 md:gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendToSubscribers}
                          onChange={(e) => setSendToSubscribers(e.target.checked)}
                          className="w-4 h-4 rounded border-border-primary text-accent-primary focus:ring-accent-primary"
                        />
                        <span className="text-xs md:text-sm text-text-secondary">
                          <span className="hidden md:inline">Send to </span>{subscriberCount ?? '...'} subs
                        </span>
                      </label>
                      <button
                        onClick={publishDraft}
                        disabled={isPublishing}
                        className="px-4 md:px-5 py-2 bg-status-success text-white rounded-md hover:bg-status-success/90 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        {isPublishing ? 'Publishing...' : sendToSubscribers ? 'Publish & Send' : 'Publish'}
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
