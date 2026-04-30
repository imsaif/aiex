'use client';

import type { ReactNode } from 'react';

export interface SocialAccount {
  id: string;
  platform: 'twitter' | 'linkedin';
  accountName: string;
  isActive: boolean;
  tokenExpiry: string | null;
  isExpired: boolean;
  createdAt: string;
}

export interface SocialPost {
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

type Platform = 'twitter' | 'linkedin' | 'reddit';

interface PlatformConfig {
  label: string;
  icon: ReactNode;
  headerClass: string;
  headerStyle?: React.CSSProperties;
  accountTextClass: string;
  authHref?: string;
  authLinkClass: string;
  charLimit?: number;
  textareaRows: number;
  textareaExtraClass?: string;
  bodyMaxHeightClass?: string;
  postButtonClass: string;
  postButtonStyle?: React.CSSProperties;
  postLabel: string;
  postingLabel: string;
  hashtagClass?: string;
  showThread?: boolean;
  showHashtags?: boolean;
  showRedditTitle?: boolean;
  publishMode: 'api' | 'clipboard';
}

const TwitterIcon = (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const RedditIcon = (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  twitter: {
    label: 'X (Twitter)',
    icon: TwitterIcon,
    headerClass: 'bg-social-twitter',
    accountTextClass: 'text-gray-400',
    authHref: '/api/social/auth/twitter',
    authLinkClass: 'text-status-info hover:text-status-info/80',
    charLimit: 280,
    textareaRows: 4,
    postButtonClass: 'bg-social-twitter hover:bg-social-twitter-hover',
    postLabel: 'Post to X',
    postingLabel: 'Posting...',
    hashtagClass: 'text-accent-primary',
    showThread: true,
    showHashtags: true,
    publishMode: 'api',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: LinkedInIcon,
    headerClass: 'bg-social-linkedin',
    accountTextClass: 'text-social-linkedin-light',
    authHref: '/api/social/auth/linkedin',
    authLinkClass: 'text-social-linkedin-light hover:text-white',
    charLimit: 3000,
    textareaRows: 8,
    bodyMaxHeightClass: 'max-h-80',
    postButtonClass: 'bg-social-linkedin hover:bg-social-linkedin-hover',
    postLabel: 'Post to LinkedIn',
    postingLabel: 'Posting...',
    hashtagClass: 'text-social-linkedin',
    showHashtags: true,
    publishMode: 'api',
  },
  reddit: {
    label: 'Reddit',
    icon: RedditIcon,
    headerClass: '',
    headerStyle: { backgroundColor: '#FF4500' },
    accountTextClass: 'text-white/70',
    authLinkClass: '',
    textareaRows: 12,
    textareaExtraClass: 'font-mono',
    bodyMaxHeightClass: 'max-h-80',
    postButtonClass: 'hover:opacity-90',
    postButtonStyle: { backgroundColor: '#FF4500' },
    postLabel: 'Copy Post',
    postingLabel: 'Copy Post',
    showRedditTitle: true,
    publishMode: 'clipboard',
  },
};

interface PostCardProps {
  platform: Platform;
  post: SocialPost | undefined;
  account?: SocialAccount;
  editingPostId: string | null;
  editedContent: string;
  isPublishingPostId: string | null;
  isGenerating: boolean;
  onStartEdit: (postId: string, content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (postId: string, content: string) => void;
  onChangeContent: (content: string) => void;
  onRegenerate: () => void;
  onPublish?: (postId: string) => void;
  onCopyPost?: (post: SocialPost, title: string) => void;
  onCopyTitle?: (title: string) => void;
}

export function PostCard({
  platform,
  post,
  account,
  editingPostId,
  editedContent,
  isPublishingPostId,
  isGenerating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onChangeContent,
  onRegenerate,
  onPublish,
  onCopyPost,
  onCopyTitle,
}: PostCardProps) {
  const cfg = PLATFORM_CONFIG[platform];

  return (
    <div className="border border-border-primary rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className={`${cfg.headerClass} p-3 flex items-center justify-between`}
        style={cfg.headerStyle}
      >
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span className="text-white font-medium text-sm">{cfg.label}</span>
        </div>
        {platform === 'reddit' ? (
          <span className={`text-xs ${cfg.accountTextClass}`}>Copy &amp; paste</span>
        ) : account ? (
          <span className={`text-xs ${cfg.accountTextClass}`}>{account.accountName}</span>
        ) : (
          <a href={cfg.authHref} className={`text-xs ${cfg.authLinkClass}`}>
            Connect Account
          </a>
        )}
      </div>

      {/* Body */}
      <div className="p-4 bg-surface-primary flex-1 flex flex-col">
        {!post ? (
          <p className="text-text-tertiary text-sm">No {cfg.label} post generated</p>
        ) : (
          <PostBody
            cfg={cfg}
            platform={platform}
            post={post}
            account={account}
            editingPostId={editingPostId}
            editedContent={editedContent}
            isPublishingPostId={isPublishingPostId}
            isGenerating={isGenerating}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onChangeContent={onChangeContent}
            onRegenerate={onRegenerate}
            onPublish={onPublish}
            onCopyPost={onCopyPost}
            onCopyTitle={onCopyTitle}
          />
        )}
      </div>
    </div>
  );
}

function PostBody({
  cfg,
  platform,
  post,
  account,
  editingPostId,
  editedContent,
  isPublishingPostId,
  isGenerating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onChangeContent,
  onRegenerate,
  onPublish,
  onCopyPost,
  onCopyTitle,
}: {
  cfg: PlatformConfig;
  platform: Platform;
  post: SocialPost;
  account?: SocialAccount;
} & Omit<PostCardProps, 'platform' | 'post' | 'account'>) {
  const isEditing = editingPostId === post.id;
  const redditTitle = cfg.showRedditTitle ? post.threadContent?.[0] || '' : '';
  const charCount = isEditing ? editedContent.length : post.content.length;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        {/* Reddit title (if applicable) */}
        {cfg.showRedditTitle && redditTitle && (
          <div className="mb-3 pb-3 border-b border-border-secondary">
            <p className="text-xs text-text-tertiary mb-1">Post Title</p>
            <p className="text-text-primary text-sm font-medium">{redditTitle}</p>
            <button
              onClick={() => onCopyTitle?.(redditTitle)}
              className="mt-1 text-xs text-accent-primary hover:text-accent-primary/80"
            >
              Copy title
            </button>
          </div>
        )}

        {/* Editor or rendered content */}
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => onChangeContent(e.target.value)}
            className={`w-full p-3 border border-border-primary rounded-lg bg-background-secondary text-text-primary text-sm resize-none ${cfg.textareaExtraClass || ''}`}
            rows={cfg.textareaRows}
            maxLength={cfg.charLimit}
          />
        ) : cfg.bodyMaxHeightClass ? (
          <div className={`${cfg.bodyMaxHeightClass} overflow-y-auto`}>
            <p className="text-text-primary text-sm whitespace-pre-wrap">{post.content}</p>
          </div>
        ) : (
          <p className="text-text-primary text-sm whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Twitter thread */}
        {cfg.showThread && post.threadContent && post.threadContent.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-secondary">
            <p className="text-xs text-text-tertiary mb-2">
              Opinion thread ({post.threadContent.length} more tweets)
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {post.threadContent.map((tweet, i) => (
                <p
                  key={i}
                  className="text-sm text-text-secondary pl-3"
                  style={{ borderLeft: '2px solid var(--border-secondary)' }}
                >
                  {tweet}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {cfg.showHashtags && post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.hashtags.map((tag) => (
              <span key={tag} className={`text-xs ${cfg.hashtagClass}`}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border-secondary flex items-center justify-between">
        {cfg.charLimit ? (
          <span
            className={`text-xs ${charCount > cfg.charLimit ? 'text-status-error' : 'text-text-tertiary'}`}
          >
            {charCount}/{cfg.charLimit}
          </span>
        ) : (
          <span className="text-xs text-text-tertiary">{post.content.length} chars</span>
        )}

        <div className="flex items-center gap-2">
          {cfg.publishMode === 'api' && post.status === 'posted' ? (
            <a
              href={post.platformPostUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-status-success"
            >
              Posted ✓
            </a>
          ) : cfg.publishMode === 'api' && post.status === 'failed' ? (
            <span className="text-xs text-status-error" title={post.errorMessage || ''}>
              Failed
            </span>
          ) : isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => onSaveEdit(post.id, editedContent)}
                className="text-xs text-accent-primary hover:text-accent-primary/80"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(post.id, post.content)}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                Edit
              </button>
              <button
                onClick={onRegenerate}
                disabled={isGenerating}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                Regenerate
              </button>
              {cfg.publishMode === 'api' ? (
                <button
                  onClick={() => onPublish?.(post.id)}
                  disabled={isPublishingPostId !== null || !account}
                  className={`px-3 py-1 text-white rounded text-xs disabled:opacity-50 ${cfg.postButtonClass}`}
                >
                  {isPublishingPostId === post.id ? cfg.postingLabel : cfg.postLabel}
                </button>
              ) : (
                <button
                  onClick={() => onCopyPost?.(post, redditTitle)}
                  className={`px-3 py-1 text-white rounded text-xs ${cfg.postButtonClass}`}
                  style={cfg.postButtonStyle}
                >
                  {cfg.postLabel}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
