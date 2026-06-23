import React, { useState, useEffect, useCallback } from 'react';

// Types for content moderation
interface ContentItem {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface AIModeration {
  decision: 'flagged' | 'approved';
  confidence: number;
  reason?: string;
  categories?: string[];
}

interface ModeratedContent extends ContentItem {
  aiModeration: AIModeration;
  humanDecision?: 'approve' | 'reject' | 'escalate';
  moderatedAt?: string;
  moderatedBy?: string;
}

// Mock data - varied examples for moderation
const mockContent: ModeratedContent[] = [
  {
    id: '1',
    user: 'promo_account',
    content: 'Check out this amazing offer! Click here to get 80% off: bit.ly/notascam',
    timestamp: '2023-06-15T14:23:00Z',
    aiModeration: {
      decision: 'flagged',
      confidence: 0.87,
      reason: 'Potential scam or misleading content',
      categories: ['spam', 'misleading']
    }
  },
  {
    id: '2',
    user: 'jane_doe',
    content: 'I completely disagree with your point. Your argument makes no sense and you should reconsider.',
    timestamp: '2023-06-15T15:10:00Z',
    aiModeration: {
      decision: 'approved',
      confidence: 0.92
    }
  },
  {
    id: '3',
    user: 'support_team',
    content: 'Please provide your account password so we can help troubleshoot your issue.',
    timestamp: '2023-06-15T16:05:00Z',
    aiModeration: {
      decision: 'flagged',
      confidence: 0.94,
      reason: 'Requesting sensitive information',
      categories: ['security', 'phishing']
    }
  },
  {
    id: '4',
    user: 'angry_user99',
    content: 'This product is absolutely terrible. Worst purchase I ever made. Total waste of money!',
    timestamp: '2023-06-15T17:30:00Z',
    aiModeration: {
      decision: 'approved',
      confidence: 0.78,
      reason: 'Negative but legitimate feedback'
    }
  },
  {
    id: '5',
    user: 'crypto_guru',
    content: 'URGENT: Send 0.5 BTC now and receive 5 BTC back! Limited time offer, act fast!',
    timestamp: '2023-06-15T18:45:00Z',
    aiModeration: {
      decision: 'flagged',
      confidence: 0.96,
      reason: 'Cryptocurrency scam pattern detected',
      categories: ['scam', 'fraud']
    }
  },
  {
    id: '6',
    user: 'helpful_member',
    content: 'Here is a tutorial on how to reset your settings: Go to Settings > Privacy > Reset. Let me know if you need more help!',
    timestamp: '2023-06-15T19:20:00Z',
    aiModeration: {
      decision: 'approved',
      confidence: 0.89
    }
  },
  {
    id: '7',
    user: 'unknown_user',
    content: 'I have exclusive photos of celebrities. DM me your email and credit card for access.',
    timestamp: '2023-06-15T20:15:00Z',
    aiModeration: {
      decision: 'flagged',
      confidence: 0.91,
      reason: 'Soliciting personal/financial information',
      categories: ['scam', 'privacy']
    }
  },
  {
    id: '8',
    user: 'tech_enthusiast',
    content: 'The new update is great! Really improved battery life on my device. Highly recommend updating.',
    timestamp: '2023-06-15T21:00:00Z',
    aiModeration: {
      decision: 'approved',
      confidence: 0.95
    }
  }
];

// Simulated AI moderation service
const moderateWithAI = async (content: string): Promise<AIModeration> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const suspiciousTerms = ['password', 'click here', 'offer', 'free', 'scam', 'urgent', 'btc', 'credit card'];
  const hasSuspiciousTerm = suspiciousTerms.some(term =>
    content.toLowerCase().includes(term.toLowerCase())
  );

  if (hasSuspiciousTerm) {
    return {
      decision: 'flagged',
      confidence: Math.random() * 0.3 + 0.7,
      reason: 'Potentially suspicious content detected',
      categories: ['suspicious']
    };
  }

  return {
    decision: 'approved',
    confidence: Math.random() * 0.3 + 0.7
  };
};

const initialStats = {
  reviewed: 0,
  approved: 0,
  rejected: 0,
  escalated: 0
};

export default function HumanInTheLoopModeration() {
  const [queue, setQueue] = useState<ModeratedContent[]>([]);
  const [currentItem, setCurrentItem] = useState<ModeratedContent | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState(initialStats);

  // Reset function
  const handleReset = useCallback(() => {
    setQueue([...mockContent].slice(1));
    setCurrentItem(mockContent[0]);
    setStats(initialStats);
    setNewContent('');
  }, []);

  // Initialize on mount
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  // Move to next item when current is processed
  useEffect(() => {
    if (!currentItem && queue.length > 0) {
      setCurrentItem(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentItem]);

  const handleModeration = (decision: 'approve' | 'reject' | 'escalate') => {
    if (!currentItem) return;

    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      approved: decision === 'approve' ? prev.approved + 1 : prev.approved,
      rejected: decision === 'reject' ? prev.rejected + 1 : prev.rejected,
      escalated: decision === 'escalate' ? prev.escalated + 1 : prev.escalated
    }));

    if (queue.length > 0) {
      setCurrentItem(queue[0]);
      setQueue(prev => prev.slice(1));
    } else {
      setCurrentItem(null);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);

    try {
      const aiResult = await moderateWithAI(newContent);

      const newItem: ModeratedContent = {
        id: `temp-${Date.now()}`,
        user: 'you',
        content: newContent,
        timestamp: new Date().toISOString(),
        aiModeration: aiResult
      };

      if (aiResult.decision === 'approved' && aiResult.confidence > 0.95) {
        setStats(prev => ({
          ...prev,
          reviewed: prev.reviewed + 1,
          approved: prev.approved + 1
        }));
      } else {
        if (currentItem) {
          setQueue(prev => [...prev, newItem]);
        } else {
          setCurrentItem(newItem);
        }
      }

      setNewContent('');
    } catch (error) {
      console.error('Error submitting content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const queueCount = queue.length + (currentItem ? 1 : 0);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left panel - Moderation Queue */}
      <div className="lg:col-span-2 bg-surface-primary border border-primary rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Content Moderation Queue</h2>
            <p className="text-sm text-text-tertiary mt-1">{queueCount} item{queueCount !== 1 ? 's' : ''} pending review</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-secondary rounded-lg hover:border-primary transition-colors cursor-pointer"
          >
            Reset Demo
          </button>
        </div>

        {currentItem ? (
          <div className="border border-primary rounded-xl p-5 mb-6">
            <div className="flex flex-wrap justify-between mb-3">
              <span className="font-medium text-text-primary">@{currentItem.user}</span>
              <span className="text-sm text-text-tertiary">{new Date(currentItem.timestamp).toLocaleString()}</span>
            </div>

            <p className="mb-4 p-4 bg-surface-secondary rounded-lg text-text-primary text-base">{currentItem.content}</p>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-text-primary border ${
                currentItem.aiModeration.decision === 'flagged'
                  ? 'bg-status-error/10 border-error'
                  : 'bg-status-success/10 border-success'
              }`}>
                {currentItem.aiModeration.decision === 'flagged' ? 'AI Flagged' : 'AI Approved'}
              </span>

              <span className="text-sm text-text-secondary">
                {Math.round(currentItem.aiModeration.confidence * 100)}% confidence
              </span>

              {currentItem.aiModeration.reason && (
                <span className="text-sm text-text-tertiary">
                  • {currentItem.aiModeration.reason}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleModeration('approve')}
                className="px-5 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => handleModeration('reject')}
                className="px-5 py-2.5 bg-surface-secondary text-text-primary border border-secondary rounded-lg hover:border-primary transition cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleModeration('escalate')}
                className="px-5 py-2.5 bg-surface-secondary text-text-secondary border border-secondary rounded-lg hover:border-primary transition cursor-pointer"
              >
                Escalate
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-primary rounded-xl p-8 mb-6 text-center">
            <p className="text-text-secondary mb-4">No content waiting for moderation</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition cursor-pointer"
            >
              Load More Examples
            </button>
          </div>
        )}

        <div className="border-t border-primary pt-6">
          <h3 className="font-medium text-text-primary mb-3">Test with your own content</h3>
          <form onSubmit={handleContentSubmit} className="space-y-3">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-4 border border-secondary rounded-xl bg-surface-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition text-base"
              rows={3}
              placeholder="Type content to test moderation system..."
            ></textarea>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Processing...' : 'Submit for Moderation'}
              </button>
              <p className="text-sm text-text-tertiary">
                Try words like &quot;password&quot;, &quot;urgent&quot;, or &quot;click here&quot; to trigger AI flags
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right panel - Stats and Info */}
      <div className="bg-surface-primary border border-primary rounded-xl p-6 space-y-6 h-fit">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-text-primary">Moderation Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="text-sm text-text-tertiary">Reviewed</div>
              <div className="font-semibold text-2xl text-text-primary">{stats.reviewed}</div>
            </div>
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="text-sm text-text-tertiary">Approved</div>
              <div className="font-semibold text-2xl text-status-success">{stats.approved}</div>
            </div>
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="text-sm text-text-tertiary">Rejected</div>
              <div className="font-semibold text-2xl text-status-error">{stats.rejected}</div>
            </div>
            <div className="p-4 bg-surface-secondary rounded-lg">
              <div className="text-sm text-text-tertiary">Escalated</div>
              <div className="font-semibold text-2xl text-status-warning">{stats.escalated}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-text-primary">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
            <li>Content is first processed by AI moderation</li>
            <li>High-confidence safe content may be auto-approved</li>
            <li>Flagged or uncertain content goes to human review</li>
            <li>Human moderators have final decision authority</li>
          </ol>
        </div>

        <div className="p-4 bg-surface-secondary rounded-lg">
          <h3 className="font-medium text-text-primary mb-2">Key Principle</h3>
          <p className="text-sm text-text-secondary">
            Human-in-the-loop combines AI efficiency with human judgment for safer, more reliable moderation.
          </p>
        </div>
      </div>
    </div>
  );
}
