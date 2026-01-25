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
  platform: 'twitter' | 'linkedin';
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
      const res = await fetch('/api/newsletter/drafts');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only show published newsletters
        const published = data.filter((n: Newsletter) => n.status === 'published');
        setNewsletters(published);
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
  const generateSocialPosts = async (regenerate = false, platform?: 'twitter' | 'linkedin') => {
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

  const twitterAccount = accounts.find((a) => a.platform === 'twitter');
  const linkedInAccount = accounts.find((a) => a.platform === 'linkedin');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Social Media</h1>
        <p className="text-text-secondary mt-1">
          Manage accounts and post to X and LinkedIn
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
            {/* Connected Accounts Section */}
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <h2 className="font-semibold text-text-primary mb-4">Connected Accounts</h2>
              <div className="space-y-4">
                {/* Twitter/X Account Card */}
                <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">X (Twitter)</p>
                      {twitterAccount ? (
                        <p className="text-sm text-text-tertiary">
                          {twitterAccount.accountName} •{' '}
                          <span className={twitterAccount.isExpired ? 'text-status-error' : twitterAccount.isActive ? 'text-status-success' : 'text-status-warning'}>
                            {twitterAccount.isExpired ? 'Expired' : twitterAccount.isActive ? 'Active' : 'Paused'}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-text-tertiary">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {twitterAccount ? (
                      <>
                        {twitterAccount.isExpired ? (
                          <a
                            href="/api/social/auth/twitter"
                            className="px-3 py-1.5 bg-accent-primary text-white rounded text-sm hover:bg-accent-primary/90"
                          >
                            Reconnect
                          </a>
                        ) : (
                          <button
                            onClick={() => toggleAccountActive(twitterAccount.id, twitterAccount.isActive)}
                            className="px-3 py-1.5 bg-background-tertiary text-text-primary rounded text-sm hover:bg-border-primary"
                          >
                            {twitterAccount.isActive ? 'Pause' : 'Activate'}
                          </button>
                        )}
                        <button
                          onClick={() => disconnectAccount(twitterAccount.id)}
                          className="px-3 py-1.5 text-status-error hover:bg-status-error/10 rounded text-sm"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a
                        href="/api/social/auth/twitter"
                        className="px-3 py-1.5 bg-[#000] text-white rounded text-sm hover:bg-[#333]"
                      >
                        Connect
                      </a>
                    )}
                  </div>
                </div>

                {/* LinkedIn Account Card */}
                <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0a66c2] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">LinkedIn</p>
                      {linkedInAccount ? (
                        <p className="text-sm text-text-tertiary">
                          {linkedInAccount.accountName} •{' '}
                          <span className={linkedInAccount.isExpired ? 'text-status-error' : linkedInAccount.isActive ? 'text-status-success' : 'text-status-warning'}>
                            {linkedInAccount.isExpired ? 'Expired' : linkedInAccount.isActive ? 'Active' : 'Paused'}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-text-tertiary">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {linkedInAccount ? (
                      <>
                        {linkedInAccount.isExpired ? (
                          <a
                            href="/api/social/auth/linkedin"
                            className="px-3 py-1.5 bg-accent-primary text-white rounded text-sm hover:bg-accent-primary/90"
                          >
                            Reconnect
                          </a>
                        ) : (
                          <button
                            onClick={() => toggleAccountActive(linkedInAccount.id, linkedInAccount.isActive)}
                            className="px-3 py-1.5 bg-background-tertiary text-text-primary rounded text-sm hover:bg-border-primary"
                          >
                            {linkedInAccount.isActive ? 'Pause' : 'Activate'}
                          </button>
                        )}
                        <button
                          onClick={() => disconnectAccount(linkedInAccount.id)}
                          className="px-3 py-1.5 text-status-error hover:bg-status-error/10 rounded text-sm"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a
                        href="/api/social/auth/linkedin"
                        className="px-3 py-1.5 bg-[#0a66c2] text-white rounded text-sm hover:bg-[#004182]"
                      >
                        Connect
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Posts Management Section */}
            <div className="bg-surface-primary rounded-lg border border-border-primary">
              <div className="p-4 border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-text-primary">Social Posts</h2>
                    <p className="text-sm text-text-tertiary mt-1">
                      Manage and publish posts for your newsletters
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-border-secondary bg-background-secondary/50">
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                <>
                  <div className="p-4 border-b border-border-secondary flex items-center justify-between">
                    <p className="text-sm text-text-secondary">
                      Posts for: <span className="font-medium text-text-primary">{selectedNewsletter.title}</span>
                    </p>
                    <div className="flex items-center gap-2">
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
                  </div>
                  {socialMessage && (
                    <div
                      className={`mx-4 mt-4 p-3 rounded-md text-sm ${
                        socialMessage.type === 'success'
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-status-error/10 text-status-error'
                      }`}
                    >
                      {socialMessage.text}
                    </div>
                  )}
                </>
              )}

              <div className="p-6">
                {!selectedNewsletter ? (
                  <div className="text-center py-8">
                    <p className="text-text-tertiary">Select a newsletter above to manage its social posts</p>
                  </div>
                ) : isLoadingSocialPosts ? (
                  <p className="text-center text-text-tertiary py-8">Loading social posts...</p>
                ) : socialPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-tertiary mb-2">No social posts generated yet</p>
                    <p className="text-sm text-text-tertiary">
                      Click &quot;Generate Posts&quot; to create optimized posts for X and LinkedIn
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Twitter/X Post Card */}
                    <div className="border border-border-primary rounded-lg overflow-hidden">
                      <div className="bg-[#000] p-3 flex items-center justify-between">
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
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Connect Account
                          </a>
                        )}
                      </div>
                      <div className="p-4 bg-surface-primary">
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
                            <div>
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
                                    Thread ({twitterPost.threadContent.length} more tweets)
                                  </p>
                                  {twitterPost.threadContent.map((tweet, i) => (
                                    <p key={i} className="text-sm text-text-secondary mb-2 pl-3 border-l-2 border-border-secondary">
                                      {tweet}
                                    </p>
                                  ))}
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
                                            className="px-3 py-1 bg-[#000] text-white rounded text-xs hover:bg-[#333] disabled:opacity-50"
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
                    <div className="border border-border-primary rounded-lg overflow-hidden">
                      <div className="bg-[#0a66c2] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span className="text-white font-medium text-sm">LinkedIn</span>
                        </div>
                        {getLinkedInAccount() ? (
                          <span className="text-xs text-blue-200">{getLinkedInAccount()?.accountName}</span>
                        ) : (
                          <a
                            href="/api/social/auth/linkedin"
                            className="text-xs text-blue-200 hover:text-white"
                          >
                            Connect Account
                          </a>
                        )}
                      </div>
                      <div className="p-4 bg-surface-primary">
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
                            <div>
                              {isEditing ? (
                                <textarea
                                  value={editedSocialContent}
                                  onChange={(e) => setEditedSocialContent(e.target.value)}
                                  className="w-full p-3 border border-border-primary rounded-lg bg-background-secondary text-text-primary text-sm resize-none"
                                  rows={8}
                                  maxLength={3000}
                                />
                              ) : (
                                <p className="text-text-primary text-sm whitespace-pre-wrap line-clamp-6">
                                  {linkedInPost.content}
                                </p>
                              )}

                              {linkedInPost.hashtags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {linkedInPost.hashtags.map((tag) => (
                                    <span key={tag} className="text-xs text-[#0a66c2]">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}

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
                                            className="px-3 py-1 bg-[#0a66c2] text-white rounded text-xs hover:bg-[#004182] disabled:opacity-50"
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
                  </div>
                )}
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
              <h3 className="font-semibold text-text-primary mb-4">API Setup Instructions</h3>

              <div className="space-y-4 text-sm text-text-secondary">
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
            </div>
          </div>
        )}
      </div>
  );
}
