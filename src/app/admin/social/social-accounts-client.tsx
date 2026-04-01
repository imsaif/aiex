'use client';

import { useState, useEffect, useCallback } from 'react';

interface SocialAccount {
  id: string;
  platform: 'twitter' | 'linkedin';
  accountName: string;
  isActive: boolean;
  tokenExpiry: string | null;
  isExpired: boolean;
  createdAt: string;
}

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishDate: string;
  createdAt: string;
}

interface SocialPost {
  id: string;
  newsletterId: string;
  platform: 'twitter' | 'linkedin' | 'reddit';
  content: string;
  threadContent: string[] | null;
  hashtags: string[];
  status: 'draft' | 'posted' | 'failed';
  platformPostUrl: string | null;
  errorMessage: string | null;
  account: { id: string; accountName: string } | null;
}

interface SocialAccountsClientProps {
  initialSuccess?: string;
  initialError?: string;
}

export default function SocialAccountsClient({
  initialSuccess,
  initialError,
}: SocialAccountsClientProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    initialSuccess
      ? { type: 'success', text: initialSuccess }
      : initialError
        ? { type: 'error', text: initialError }
        : null
  );

  // Newsletter and social posts state
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [isLoadingNewsletters, setIsLoadingNewsletters] = useState(false);
  const [isLoadingSocialPosts, setIsLoadingSocialPosts] = useState(false);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
  const [isPublishingSocial, setIsPublishingSocial] = useState<string | null>(null);
  const [socialMessage, setSocialMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingSocialPost, setEditingSocialPost] = useState<string | null>(null);
  const [editedSocialContent, setEditedSocialContent] = useState('');

  useEffect(() => {
    fetchAccounts();
    fetchNewsletters();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social/accounts');
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setMessage({ type: 'error', text: 'Failed to load accounts' });
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchSocialPosts = useCallback(async (newsletterId: string) => {
    setIsLoadingSocialPosts(true);
    try {
      const res = await fetch(`/api/social/posts?newsletterId=${newsletterId}`);
      const data = await res.json();
      if (data.posts) {
        setSocialPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch social posts:', error);
    } finally {
      setIsLoadingSocialPosts(false);
    }
  }, []);

  useEffect(() => {
    if (selectedNewsletter) {
      fetchSocialPosts(selectedNewsletter.id);
    } else {
      setSocialPosts([]);
    }
  }, [selectedNewsletter, fetchSocialPosts]);

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      const res = await fetch(`/api/social/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Account disconnected' });
        await fetchAccounts();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to disconnect');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to disconnect account',
      });
    }
  };

  const toggleAccountActive = async (accountId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/social/accounts/${accountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        await fetchAccounts();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update account',
      });
    }
  };

  // Social media functions
  const generateSocialPosts = async (regenerate = false, platform?: 'twitter' | 'linkedin' | 'reddit') => {
    if (!selectedNewsletter) return;
    setIsGeneratingSocial(true);
    setSocialMessage(null);

    try {
      const response = await fetch('/api/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletterId: selectedNewsletter.id,
          regenerate,
          platform,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSocialMessage({
          type: 'success',
          text: regenerate ? 'Social posts regenerated!' : 'Social posts generated!',
        });
        await fetchSocialPosts(selectedNewsletter.id);
      } else {
        throw new Error(data.error || 'Failed to generate posts');
      }
    } catch (error) {
      setSocialMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to generate social posts',
      });
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  const publishSocialPost = async (postId: string) => {
    setIsPublishingSocial(postId);
    setSocialMessage(null);

    try {
      const response = await fetch(`/api/social/posts/${postId}/publish`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSocialMessage({
          type: 'success',
          text: `Posted successfully! View: ${data.post.platformPostUrl}`,
        });
        if (selectedNewsletter) {
          await fetchSocialPosts(selectedNewsletter.id);
        }
      } else {
        throw new Error(data.error || 'Failed to publish');
      }
    } catch (error) {
      setSocialMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to publish post',
      });
    } finally {
      setIsPublishingSocial(null);
    }
  };

  const updateSocialPost = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setSocialMessage({ type: 'success', text: 'Post updated!' });
        setEditingSocialPost(null);
        if (selectedNewsletter) {
          await fetchSocialPosts(selectedNewsletter.id);
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      setSocialMessage({ type: 'error', text: 'Failed to update post' });
    }
  };

  const publishAllSocialPosts = async () => {
    if (!selectedNewsletter) return;
    setIsPublishingSocial('all');
    setSocialMessage(null);

    try {
      const response = await fetch('/api/social/posts/bulk-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterId: selectedNewsletter.id }),
      });

      const data = await response.json();

      setSocialMessage({
        type: data.success ? 'success' : 'error',
        text: data.message,
      });

      await fetchSocialPosts(selectedNewsletter.id);
    } catch (error) {
      setSocialMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to publish posts',
      });
    } finally {
      setIsPublishingSocial(null);
    }
  };

  const getTwitterAccount = () => accounts.find((a) => a.platform === 'twitter' && a.isActive);
  const getLinkedInAccount = () => accounts.find((a) => a.platform === 'linkedin' && a.isActive);
  const getTwitterPost = () => socialPosts.find((p) => p.platform === 'twitter');
  const getLinkedInPost = () => socialPosts.find((p) => p.platform === 'linkedin');
  const getRedditPost = () => socialPosts.find((p) => p.platform === 'reddit');

  const twitterAccount = accounts.find((a) => a.platform === 'twitter');
  const linkedInAccount = accounts.find((a) => a.platform === 'linkedin');

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Social Media</h1>
        <p className="text-text-secondary mt-1">
          Manage accounts and post to X, LinkedIn, and Reddit
        </p>
      </header>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-status-success/10 text-status-success border border-status-success/20'
              : 'bg-status-error/10 text-status-error border border-status-error/20'
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-4 text-current opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-text-tertiary">Loading accounts...</div>
      ) : (
        <div className="space-y-6">
          {/* TOP: Newsletter Controls */}
          <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[280px]">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Select Newsletter
                </label>
                <select
                  value={selectedNewsletter?.id || ''}
                  onChange={(e) => {
                    const nl = newsletters.find((n) => n.id === e.target.value);
                    setSelectedNewsletter(nl || null);
                    setSocialMessage(null);
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
              </div>

              {selectedNewsletter && (
                <div className="flex items-center gap-2 pt-5">
                  {socialPosts.length === 0 ? (
                    <button
                      onClick={() => generateSocialPosts(false)}
                      disabled={isGeneratingSocial}
                      className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {isGeneratingSocial ? 'Generating...' : 'Generate Posts'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => generateSocialPosts(true)}
                        disabled={isGeneratingSocial}
                        className="px-3 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors disabled:opacity-50 text-sm"
                      >
                        {isGeneratingSocial ? 'Regenerating...' : 'Regenerate All'}
                      </button>
                      <button
                        onClick={publishAllSocialPosts}
                        disabled={isPublishingSocial !== null || socialPosts.every((p) => p.status === 'posted')}
                        className="px-4 py-2 bg-status-success text-white rounded-md hover:bg-status-success/90 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        {isPublishingSocial === 'all' ? 'Publishing...' : 'Post to All'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {socialMessage && (
              <div
                className={`mt-3 p-3 rounded-md text-sm ${
                  socialMessage.type === 'success'
                    ? 'bg-status-success/10 text-status-success'
                    : 'bg-status-error/10 text-status-error'
                }`}
              >
                {socialMessage.text}
              </div>
            )}
          </div>

          {/* POSTS: 3 columns */}
          {!selectedNewsletter ? (
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <div className="text-center py-8">
                <p className="text-text-tertiary">Select a newsletter to manage its social posts</p>
              </div>
            </div>
          ) : isLoadingSocialPosts ? (
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <p className="text-center text-text-tertiary py-8">Loading social posts...</p>
            </div>
          ) : socialPosts.length === 0 ? (
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <div className="text-center py-8">
                <p className="text-text-tertiary mb-2">No social posts generated yet</p>
                <p className="text-sm text-text-tertiary">
                  Click &quot;Generate Posts&quot; to create optimized posts for X, LinkedIn, and Reddit
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Twitter/X Post Card */}
              <div className="border border-border-primary rounded-lg overflow-hidden flex flex-col">
                <div className="bg-social-twitter p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-white font-medium text-sm">X (Twitter)</span>
                  </div>
                  {getTwitterAccount() ? (
                    <span className="text-xs text-gray-400">{getTwitterAccount()?.accountName}</span>
                  ) : (
                    <a
                      href="/api/social/auth/twitter"
                      className="text-xs text-status-info hover:text-status-info/80"
                    >
                      Connect Account
                    </a>
                  )}
                </div>
                <div className="p-4 bg-surface-primary flex-1 flex flex-col">
                  {(() => {
                    const twitterPost = getTwitterPost();
                    if (!twitterPost) {
                      return (
                        <p className="text-text-tertiary text-sm">No Twitter post generated</p>
                      );
                    }

                    const isEditing = editingSocialPost === twitterPost.id;
                    const charCount = isEditing
                      ? editedSocialContent.length
                      : twitterPost.content.length;

                    return (
                      <div className="flex flex-col flex-1">
                        <div className="flex-1">
                          {isEditing ? (
                            <textarea
                              value={editedSocialContent}
                              onChange={(e) => setEditedSocialContent(e.target.value)}
                              className="w-full p-3 border border-border-primary rounded-lg bg-background-secondary text-text-primary text-sm resize-none"
                              rows={4}
                              maxLength={280}
                            />
                          ) : (
                            <p className="text-text-primary text-sm whitespace-pre-wrap">
                              {twitterPost.content}
                            </p>
                          )}

                          {twitterPost.threadContent && twitterPost.threadContent.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border-secondary">
                              <p className="text-xs text-text-tertiary mb-2">
                                Opinion thread ({twitterPost.threadContent.length} more tweets)
                              </p>
                              <div className="max-h-64 overflow-y-auto space-y-2">
                                {twitterPost.threadContent.map((tweet, i) => (
                                  <p key={i} className="text-sm text-text-secondary pl-3" style={{ borderLeft: '2px solid var(--border-secondary)' }}>
                                    {tweet}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {twitterPost.hashtags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {twitterPost.hashtags.map((tag) => (
                                <span key={tag} className="text-xs text-accent-primary">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border-secondary flex items-center justify-between">
                          <span className={`text-xs ${charCount > 280 ? 'text-status-error' : 'text-text-tertiary'}`}>
                            {charCount}/280
                          </span>
                          <div className="flex items-center gap-2">
                            {twitterPost.status === 'posted' ? (
                              <a
                                href={twitterPost.platformPostUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-status-success"
                              >
                                Posted ✓
                              </a>
                            ) : twitterPost.status === 'failed' ? (
                              <span className="text-xs text-status-error" title={twitterPost.errorMessage || ''}>
                                Failed
                              </span>
                            ) : (
                              <>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => setEditingSocialPost(null)}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => updateSocialPost(twitterPost.id, editedSocialContent)}
                                      className="text-xs text-accent-primary hover:text-accent-primary/80"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingSocialPost(twitterPost.id);
                                        setEditedSocialContent(twitterPost.content);
                                      }}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => generateSocialPosts(true, 'twitter')}
                                      disabled={isGeneratingSocial}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Regenerate
                                    </button>
                                    <button
                                      onClick={() => publishSocialPost(twitterPost.id)}
                                      disabled={isPublishingSocial !== null || !getTwitterAccount()}
                                      className="px-3 py-1 bg-social-twitter text-white rounded text-xs hover:bg-social-twitter-hover disabled:opacity-50"
                                    >
                                      {isPublishingSocial === twitterPost.id ? 'Posting...' : 'Post to X'}
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* LinkedIn Post Card */}
              <div className="border border-border-primary rounded-lg overflow-hidden flex flex-col">
                <div className="bg-social-linkedin p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-white font-medium text-sm">LinkedIn</span>
                  </div>
                  {getLinkedInAccount() ? (
                    <span className="text-xs text-social-linkedin-light">{getLinkedInAccount()?.accountName}</span>
                  ) : (
                    <a
                      href="/api/social/auth/linkedin"
                      className="text-xs text-social-linkedin-light hover:text-white"
                    >
                      Connect Account
                    </a>
                  )}
                </div>
                <div className="p-4 bg-surface-primary flex-1 flex flex-col">
                  {(() => {
                    const linkedInPost = getLinkedInPost();
                    if (!linkedInPost) {
                      return (
                        <p className="text-text-tertiary text-sm">No LinkedIn post generated</p>
                      );
                    }

                    const isEditing = editingSocialPost === linkedInPost.id;
                    const charCount = isEditing
                      ? editedSocialContent.length
                      : linkedInPost.content.length;

                    return (
                      <div className="flex flex-col flex-1">
                        <div className="flex-1">
                          {isEditing ? (
                            <textarea
                              value={editedSocialContent}
                              onChange={(e) => setEditedSocialContent(e.target.value)}
                              className="w-full p-3 border border-border-primary rounded-lg bg-background-secondary text-text-primary text-sm resize-none"
                              rows={8}
                              maxLength={3000}
                            />
                          ) : (
                            <div className="max-h-80 overflow-y-auto">
                              <p className="text-text-primary text-sm whitespace-pre-wrap">
                                {linkedInPost.content}
                              </p>
                            </div>
                          )}

                          {linkedInPost.hashtags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {linkedInPost.hashtags.map((tag) => (
                                <span key={tag} className="text-xs text-social-linkedin">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border-secondary flex items-center justify-between">
                          <span className={`text-xs ${charCount > 3000 ? 'text-status-error' : 'text-text-tertiary'}`}>
                            {charCount}/3000
                          </span>
                          <div className="flex items-center gap-2">
                            {linkedInPost.status === 'posted' ? (
                              <a
                                href={linkedInPost.platformPostUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-status-success"
                              >
                                Posted ✓
                              </a>
                            ) : linkedInPost.status === 'failed' ? (
                              <span className="text-xs text-status-error" title={linkedInPost.errorMessage || ''}>
                                Failed
                              </span>
                            ) : (
                              <>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => setEditingSocialPost(null)}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => updateSocialPost(linkedInPost.id, editedSocialContent)}
                                      className="text-xs text-accent-primary hover:text-accent-primary/80"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingSocialPost(linkedInPost.id);
                                        setEditedSocialContent(linkedInPost.content);
                                      }}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => generateSocialPosts(true, 'linkedin')}
                                      disabled={isGeneratingSocial}
                                      className="text-xs text-text-tertiary hover:text-text-primary"
                                    >
                                      Regenerate
                                    </button>
                                    <button
                                      onClick={() => publishSocialPost(linkedInPost.id)}
                                      disabled={isPublishingSocial !== null || !getLinkedInAccount()}
                                      className="px-3 py-1 bg-social-linkedin text-white rounded text-xs hover:bg-social-linkedin-hover disabled:opacity-50"
                                    >
                                      {isPublishingSocial === linkedInPost.id ? 'Posting...' : 'Post to LinkedIn'}
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Reddit Post Card */}
              <div className="border border-border-primary rounded-lg overflow-hidden flex flex-col">
                <div className="p-3 flex items-center justify-between" style={{ backgroundColor: '#FF4500' }}>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                    <span className="text-white font-medium text-sm">Reddit</span>
                  </div>
                  <span className="text-xs text-white/70">Copy & paste</span>
                </div>
                <div className="p-4 bg-surface-primary flex-1 flex flex-col">
                  {(() => {
                    const redditPost = getRedditPost();
                    if (!redditPost) {
                      return (
                        <p className="text-text-tertiary text-sm">No Reddit post generated</p>
                      );
                    }

                    // Reddit title is stored in threadContent[0]
                    const redditTitle = redditPost.threadContent?.[0] || '';
                    const isEditing = editingSocialPost === redditPost.id;

                    return (
                      <div className="flex flex-col flex-1">
                        <div className="flex-1">
                          {redditTitle && (
                            <div className="mb-3 pb-3 border-b border-border-secondary">
                              <p className="text-xs text-text-tertiary mb-1">Post Title</p>
                              <p className="text-text-primary text-sm font-medium">{redditTitle}</p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(redditTitle);
                                  setSocialMessage({ type: 'success', text: 'Reddit title copied!' });
                                  setTimeout(() => setSocialMessage(null), 3000);
                                }}
                                className="mt-1 text-xs text-accent-primary hover:text-accent-primary/80"
                              >
                                Copy title
                              </button>
                            </div>
                          )}

                          {isEditing ? (
                            <textarea
                              value={editedSocialContent}
                              onChange={(e) => setEditedSocialContent(e.target.value)}
                              className="w-full p-3 border border-border-primary rounded-lg bg-background-secondary text-text-primary text-sm resize-none font-mono"
                              rows={12}
                            />
                          ) : (
                            <div className="max-h-80 overflow-y-auto">
                              <p className="text-text-primary text-sm whitespace-pre-wrap">
                                {redditPost.content}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border-secondary flex items-center justify-between">
                          <span className="text-xs text-text-tertiary">
                            {redditPost.content.length} chars
                          </span>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => setEditingSocialPost(null)}
                                  className="text-xs text-text-tertiary hover:text-text-primary"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => updateSocialPost(redditPost.id, editedSocialContent)}
                                  className="text-xs text-accent-primary hover:text-accent-primary/80"
                                >
                                  Save
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingSocialPost(redditPost.id);
                                    setEditedSocialContent(redditPost.content);
                                  }}
                                  className="text-xs text-text-tertiary hover:text-text-primary"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => generateSocialPosts(true, 'reddit')}
                                  disabled={isGeneratingSocial}
                                  className="text-xs text-text-tertiary hover:text-text-primary"
                                >
                                  Regenerate
                                </button>
                                <button
                                  onClick={() => {
                                    const fullPost = redditTitle ? `${redditTitle}\n\n${redditPost.content}` : redditPost.content;
                                    navigator.clipboard.writeText(fullPost);
                                    setSocialMessage({ type: 'success', text: 'Reddit post copied to clipboard!' });
                                    setTimeout(() => setSocialMessage(null), 3000);
                                  }}
                                  className="px-3 py-1 text-white rounded text-xs hover:opacity-90"
                                  style={{ backgroundColor: '#FF4500' }}
                                >
                                  Copy Post
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM ROW: Share Image + Connected Accounts + Setup */}
          {selectedNewsletter && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Share Image */}
              <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-text-primary">Share Image</p>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/api/newsletter/og?id=${selectedNewsletter.id}`;
                      navigator.clipboard.writeText(url);
                      setSocialMessage({ type: 'success', text: 'Image URL copied to clipboard!' });
                      setTimeout(() => setSocialMessage(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-xs font-medium"
                  >
                    Copy URL
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/newsletter/og?id=${selectedNewsletter.id}`}
                  alt={`Social share image for ${selectedNewsletter.title}`}
                  className="w-full rounded-md border border-border-primary"
                />
              </div>

              {/* Connected Accounts */}
              <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Connected Accounts</h3>
                <div className="space-y-2">
                  {/* Twitter/X Row */}
                  <div className="flex items-center justify-between py-2 px-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-social-twitter rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-primary">X</span>
                      {twitterAccount ? (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          twitterAccount.isExpired
                            ? 'bg-status-error/10 text-status-error'
                            : twitterAccount.isActive
                              ? 'bg-status-success/10 text-status-success'
                              : 'bg-status-warning/10 text-status-warning'
                        }`}>
                          {twitterAccount.isExpired ? 'Expired' : twitterAccount.isActive ? 'Active' : 'Paused'}
                        </span>
                      ) : (
                        <span className="text-xs text-text-tertiary">Not connected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {twitterAccount ? (
                        <>
                          {twitterAccount.isExpired ? (
                            <a
                              href="/api/social/auth/twitter"
                              className="px-2 py-1 bg-accent-primary text-white rounded text-xs hover:bg-accent-primary/90"
                            >
                              Reconnect
                            </a>
                          ) : (
                            <button
                              onClick={() => toggleAccountActive(twitterAccount.id, twitterAccount.isActive)}
                              className="px-2 py-1 bg-background-tertiary text-text-primary rounded text-xs hover:bg-border-primary"
                            >
                              {twitterAccount.isActive ? 'Pause' : 'Activate'}
                            </button>
                          )}
                          <button
                            onClick={() => disconnectAccount(twitterAccount.id)}
                            className="px-2 py-1 text-status-error hover:bg-status-error/10 rounded text-xs"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <a
                          href="/api/social/auth/twitter"
                          className="px-2 py-1 bg-social-twitter text-white rounded text-xs hover:bg-social-twitter-hover"
                        >
                          Connect
                        </a>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn Row */}
                  <div className="flex items-center justify-between py-2 px-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-social-linkedin rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-primary">LinkedIn</span>
                      {linkedInAccount ? (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          linkedInAccount.isExpired
                            ? 'bg-status-error/10 text-status-error'
                            : linkedInAccount.isActive
                              ? 'bg-status-success/10 text-status-success'
                              : 'bg-status-warning/10 text-status-warning'
                        }`}>
                          {linkedInAccount.isExpired ? 'Expired' : linkedInAccount.isActive ? 'Active' : 'Paused'}
                        </span>
                      ) : (
                        <span className="text-xs text-text-tertiary">Not connected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {linkedInAccount ? (
                        <>
                          {linkedInAccount.isExpired ? (
                            <a
                              href="/api/social/auth/linkedin"
                              className="px-2 py-1 bg-accent-primary text-white rounded text-xs hover:bg-accent-primary/90"
                            >
                              Reconnect
                            </a>
                          ) : (
                            <button
                              onClick={() => toggleAccountActive(linkedInAccount.id, linkedInAccount.isActive)}
                              className="px-2 py-1 bg-background-tertiary text-text-primary rounded text-xs hover:bg-border-primary"
                            >
                              {linkedInAccount.isActive ? 'Pause' : 'Activate'}
                            </button>
                          )}
                          <button
                            onClick={() => disconnectAccount(linkedInAccount.id)}
                            className="px-2 py-1 text-status-error hover:bg-status-error/10 rounded text-xs"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <a
                          href="/api/social/auth/linkedin"
                          className="px-2 py-1 bg-social-linkedin text-white rounded text-xs hover:bg-social-linkedin-hover"
                        >
                          Connect
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Setup Instructions */}
              <details className="bg-surface-primary rounded-lg border border-border-primary">
                <summary className="p-4 text-sm font-semibold text-text-primary cursor-pointer hover:text-accent-primary transition-colors">
                  API Setup Instructions
                </summary>

                <div className="px-4 pb-4 space-y-4 text-sm text-text-secondary">
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">X (Twitter) Developer Setup</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">developer.twitter.com</a></li>
                      <li>Create a new Project and App</li>
                      <li>Enable OAuth 2.0 with Web App type</li>
                      <li>Set callback URL to: <code className="bg-background-secondary px-2 py-0.5 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/api/social/callback/twitter</code></li>
                      <li>Required scopes: <code className="bg-background-secondary px-2 py-0.5 rounded">tweet.read tweet.write users.read offline.access</code></li>
                      <li>Copy Client ID and Client Secret to your <code className="bg-background-secondary px-2 py-0.5 rounded">.env</code></li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium text-text-primary mb-2">LinkedIn Developer Setup</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Go to <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">linkedin.com/developers</a></li>
                      <li>Create a new App</li>
                      <li>Request access to &quot;Share on LinkedIn&quot; and &quot;Sign In with LinkedIn using OpenID Connect&quot;</li>
                      <li>Add redirect URL: <code className="bg-background-secondary px-2 py-0.5 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/api/social/callback/linkedin</code></li>
                      <li>Copy Client ID and Client Secret to your <code className="bg-background-secondary px-2 py-0.5 rounded">.env</code></li>
                    </ol>
                  </div>

                  <div className="pt-4 border-t border-border-secondary">
                    <h4 className="font-medium text-text-primary mb-2">Required Environment Variables</h4>
                    <pre className="bg-background-secondary p-4 rounded-lg overflow-x-auto text-xs">
{`# X (Twitter)
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# Encryption key for storing tokens (generate with: openssl rand -hex 32)
SOCIAL_TOKEN_SECRET=your_32_byte_hex_secret`}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
