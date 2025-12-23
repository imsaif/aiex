'use client';

import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface NewsletterDraft {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishDate: Date;
  status: string;
  sources: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminNewsletterClientProps {
  drafts: NewsletterDraft[];
  selectedId?: string;
  initialAuth?: boolean;
}

export default function AdminNewsletterClient({
  drafts: initialDrafts,
  selectedId,
  initialAuth = false,
}: AdminNewsletterClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [drafts, setDrafts] = useState<NewsletterDraft[]>(initialDrafts);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeDraft, setActiveDraft] = useState<NewsletterDraft | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sanitize HTML content for preview to prevent XSS
  const sanitizedPreviewContent = useMemo(() => {
    if (typeof window === 'undefined') return editedContent;
    return DOMPurify.sanitize(editedContent, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['target', 'rel'],
    });
  }, [editedContent]);

  // Fetch drafts after authentication
  useEffect(() => {
    if (isAuthenticated && drafts.length === 0) {
      setIsLoadingDrafts(true);
      fetch('/api/newsletter/drafts')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDrafts(data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingDrafts(false));
    }
  }, [isAuthenticated, drafts.length]);

  // Set active draft based on selectedId or first pending draft
  useEffect(() => {
    if (selectedId) {
      const draft = drafts.find((d) => d.id === selectedId);
      if (draft) {
        setActiveDraft(draft);
        setEditedContent(draft.content);
        setEditedTitle(draft.title);
        setEditedSummary(draft.summary);
      }
    } else {
      const pendingDraft = drafts.find((d) => d.status === 'pending_review');
      if (pendingDraft) {
        setActiveDraft(pendingDraft);
        setEditedContent(pendingDraft.content);
        setEditedTitle(pendingDraft.title);
        setEditedSummary(pendingDraft.summary);
      }
    }
  }, [drafts, selectedId]);

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

  const selectDraft = (draft: NewsletterDraft) => {
    setActiveDraft(draft);
    setEditedContent(draft.content);
    setEditedTitle(draft.title);
    setEditedSummary(draft.summary);
    setMessage(null);
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

      if (response.ok) {
        setMessage({ type: 'success', text: 'Newsletter published successfully!' });
        // Refresh page to update draft list
        window.location.reload();
      } else {
        throw new Error('Failed to publish');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish newsletter' });
    } finally {
      setIsPublishing(false);
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
      <div className="min-h-screen bg-background-primary dark:bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary dark:bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary dark:border-border-primary">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary mb-6">Newsletter Admin</h1>
          <form onSubmit={handleAuth}>
            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border-primary dark:border-border-primary rounded-md bg-background-secondary dark:bg-background-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              placeholder="Enter admin password"
              autoFocus
            />
            {authError && <p className="mt-2 text-sm text-status-error">{authError}</p>}
            <button
              type="submit"
              className="mt-4 w-full bg-accent-primary text-white dark:text-background-primary py-2 px-4 rounded-md hover:bg-accent-primary/90 transition-colors"
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
    <div className="min-h-screen bg-background-primary dark:bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary">Newsletter Admin</h1>
          <p className="text-text-secondary dark:text-text-secondary mt-1">Review and approve newsletter drafts</p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Draft List Sidebar */}
          <div className="col-span-3">
            <div className="bg-surface-primary dark:bg-surface-primary rounded-lg shadow-sm border border-border-primary dark:border-border-primary">
              <div className="p-4 border-b border-border-primary dark:border-border-primary">
                <h2 className="font-semibold text-text-primary dark:text-text-primary">Drafts</h2>
              </div>
              <div className="divide-y divide-border-secondary dark:divide-border-secondary">
                {isLoadingDrafts ? (
                  <p className="p-4 text-text-tertiary dark:text-text-tertiary text-sm">Loading drafts...</p>
                ) : drafts.length === 0 ? (
                  <p className="p-4 text-text-tertiary dark:text-text-tertiary text-sm">No drafts found</p>
                ) : (
                  drafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => selectDraft(draft)}
                      className={`w-full text-left p-4 hover:bg-background-secondary dark:hover:bg-background-secondary transition-colors ${
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
                      <p className="font-medium text-text-primary dark:text-text-primary text-sm truncate">{draft.title}</p>
                      <p className="text-xs text-text-tertiary dark:text-text-tertiary mt-1">
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            {activeDraft ? (
              <div className="bg-surface-primary dark:bg-surface-primary rounded-lg shadow-sm border border-border-primary dark:border-border-primary">
                {/* Header */}
                <div className="p-6 border-b border-border-primary dark:border-border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-xl font-bold text-text-primary dark:text-text-primary w-full border-0 focus:ring-0 p-0 bg-transparent"
                      />
                      <textarea
                        value={editedSummary}
                        onChange={(e) => setEditedSummary(e.target.value)}
                        className="mt-2 text-text-secondary dark:text-text-secondary w-full border-0 focus:ring-0 p-0 resize-none bg-transparent"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveDraft}
                        disabled={isSaving}
                        className="px-4 py-2 bg-background-secondary dark:bg-background-secondary text-text-primary dark:text-text-primary rounded-md hover:bg-background-tertiary transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={rejectDraft}
                        className="px-4 py-2 bg-status-error/10 text-status-error rounded-md hover:bg-status-error/20 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={publishDraft}
                        disabled={isPublishing}
                        className="px-4 py-2 bg-status-success text-white rounded-md hover:bg-status-success/90 transition-colors disabled:opacity-50"
                      >
                        {isPublishing ? 'Publishing...' : 'Publish'}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        message.type === 'success'
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-status-error/10 text-status-error'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>

                {/* Preview & Edit Tabs */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Content Preview</h3>
                  </div>

                  {/* Newsletter Preview */}
                  <div
                    className="prose max-w-none border border-border-primary dark:border-border-primary rounded-lg p-6 bg-surface-primary dark:bg-surface-primary"
                    dangerouslySetInnerHTML={{ __html: sanitizedPreviewContent }}
                  />

                  {/* Raw HTML Editor */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Edit HTML</h3>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-64 p-4 font-mono text-sm border border-border-primary dark:border-border-primary rounded-lg bg-background-secondary dark:bg-background-secondary text-text-primary dark:text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-primary dark:bg-surface-primary rounded-lg shadow-sm border border-border-primary dark:border-border-primary p-12 text-center">
                <p className="text-text-tertiary dark:text-text-tertiary">Select a draft to preview and edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
