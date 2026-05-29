'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostCard, type SocialAccount, type SocialPost } from './PostCard';
import PatternDeepDiveSection from './PatternDeepDiveSection';

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishDate: string;
  createdAt: string;
}

interface SocialAccountsClientProps {
  initialSuccess?: string;
  initialError?: string;
}

export default function SocialAccountsClient({
  initialSuccess,
  initialError,
}: SocialAccountsClientProps) {
  const [mode, setMode] = useState<'deepdive' | 'newsletter'>('deepdive');
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

  const twitterAccount = accounts.find((a) => a.platform === 'twitter');
  const linkedInAccount = accounts.find((a) => a.platform === 'linkedin');
  const activeTwitterAccount = twitterAccount?.isActive ? twitterAccount : undefined;
  const activeLinkedInAccount = linkedInAccount?.isActive ? linkedInAccount : undefined;
  const twitterPost = socialPosts.find((p) => p.platform === 'twitter');
  const linkedInPost = socialPosts.find((p) => p.platform === 'linkedin');
  const redditPost = socialPosts.find((p) => p.platform === 'reddit');

  const startEdit = (postId: string, content: string) => {
    setEditingSocialPost(postId);
    setEditedSocialContent(content);
  };
  const cancelEdit = () => setEditingSocialPost(null);

  const copyToClipboardWithToast = (text: string, successText: string) => {
    navigator.clipboard.writeText(text);
    setSocialMessage({ type: 'success', text: successText });
    setTimeout(() => setSocialMessage(null), 3000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Social Media</h1>
        <p className="text-text-secondary mt-1">
          Pattern deep-dives for LinkedIn + X, and newsletter distribution
        </p>
      </header>

      {/* Mode tabs */}
      <div className="mb-8 inline-flex rounded-lg border border-border-primary bg-surface-primary p-1">
        <button
          onClick={() => setMode('deepdive')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'deepdive'
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Pattern Deep-Dives
        </button>
        <button
          onClick={() => setMode('newsletter')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'newsletter'
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Newsletter Distribution
        </button>
      </div>

      {mode === 'deepdive' ? (
        <PatternDeepDiveSection />
      ) : (
        <>
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
              <PostCard
                platform="twitter"
                post={twitterPost}
                account={activeTwitterAccount}
                editingPostId={editingSocialPost}
                editedContent={editedSocialContent}
                isPublishingPostId={isPublishingSocial}
                isGenerating={isGeneratingSocial}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={updateSocialPost}
                onChangeContent={setEditedSocialContent}
                onRegenerate={() => generateSocialPosts(true, 'twitter')}
                onPublish={publishSocialPost}
              />
              <PostCard
                platform="linkedin"
                post={linkedInPost}
                account={activeLinkedInAccount}
                editingPostId={editingSocialPost}
                editedContent={editedSocialContent}
                isPublishingPostId={isPublishingSocial}
                isGenerating={isGeneratingSocial}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={updateSocialPost}
                onChangeContent={setEditedSocialContent}
                onRegenerate={() => generateSocialPosts(true, 'linkedin')}
                onPublish={publishSocialPost}
              />
              <PostCard
                platform="reddit"
                post={redditPost}
                editingPostId={editingSocialPost}
                editedContent={editedSocialContent}
                isPublishingPostId={isPublishingSocial}
                isGenerating={isGeneratingSocial}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={updateSocialPost}
                onChangeContent={setEditedSocialContent}
                onRegenerate={() => generateSocialPosts(true, 'reddit')}
                onCopyPost={(post, title) => {
                  const fullPost = title ? `${title}\n\n${post.content}` : post.content;
                  copyToClipboardWithToast(fullPost, 'Reddit post copied to clipboard!');
                }}
                onCopyTitle={(title) => copyToClipboardWithToast(title, 'Reddit title copied!')}
              />
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
        </>
      )}
    </div>
  );
}
