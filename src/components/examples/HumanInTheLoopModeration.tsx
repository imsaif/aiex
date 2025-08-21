import React, { useState, useEffect } from 'react';

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

// Mock data - in a real app, this would come from an API
const mockContent: ModeratedContent[] = [
  {
    id: '1',
    user: 'user123',
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
    content: 'I completely disagree with your point. Your argument makes no sense.',
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
      categories: ['security', 'privacy']
    }
  }
];

// Simulated AI moderation service
const moderateWithAI = async (content: string): Promise<AIModeration> => {
  // In a real app, this would be an API call to an AI service
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  // Simple keyword-based detection (just for demo purposes)
  const suspiciousTerms = ['password', 'click here', 'offer', 'free', 'scam', 'urgent'];
  const hasSuspiciousTerm = suspiciousTerms.some(term => 
    content.toLowerCase().includes(term.toLowerCase())
  );
  
  if (hasSuspiciousTerm) {
    return {
      decision: 'flagged',
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 70-100%
      reason: 'Potentially suspicious content detected',
      categories: ['suspicious']
    };
  }
  
  return {
    decision: 'approved',
    confidence: Math.random() * 0.3 + 0.7
  };
};

export default function HumanInTheLoopModeration() {
  const [queue, setQueue] = useState<ModeratedContent[]>(mockContent);
  const [currentItem, setCurrentItem] = useState<ModeratedContent | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    reviewed: 0,
    approved: 0,
    rejected: 0,
    escalated: 0
  });

  // Set the first item as current when component mounts
  useEffect(() => {
    if (queue.length > 0 && !currentItem) {
      setCurrentItem(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentItem]);

  const handleModeration = (decision: 'approve' | 'reject' | 'escalate') => {
    if (!currentItem) return;
    
    // In a real app, this would update a database
    // const now = new Date().toISOString(); // Used for timestamping in production
    // Note: In a real app, this moderated object would be sent to the backend
    // const moderated = {
    //   ...currentItem,
    //   humanDecision: decision,
    //   moderatedAt: now,
    //   moderatedBy: 'current-moderator'
    // };
    
    // Update stats
    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      approved: decision === 'approve' ? prev.approved + 1 : prev.approved,
      rejected: decision === 'reject' ? prev.rejected + 1 : prev.rejected,
      escalated: decision === 'escalate' ? prev.escalated + 1 : prev.escalated
    }));
    
    // Move to next item in queue
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
      // Process with AI first
      const aiResult = await moderateWithAI(newContent);
      
      const newItem: ModeratedContent = {
        id: `temp-${Date.now()}`,
        user: 'test-user',
        content: newContent,
        timestamp: new Date().toISOString(),
        aiModeration: aiResult
      };
      
      // If AI approves with high confidence, auto-approve
      if (aiResult.decision === 'approved' && aiResult.confidence > 0.95) {
        setStats(prev => ({
          ...prev,
          reviewed: prev.reviewed + 1,
          approved: prev.approved + 1
        }));
      } else {
        // Otherwise, add to human review queue
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

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left panel - Moderation Queue */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Content Moderation Queue</h2>
        
        {currentItem ? (
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex flex-wrap justify-between mb-2">
              <span className="font-medium text-gray-700">{currentItem.user}</span>
              <span className="text-sm text-gray-500">{new Date(currentItem.timestamp).toLocaleString()}</span>
            </div>
            
            <p className="mb-4 p-3 bg-gray-50 rounded border">{currentItem.content}</p>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentItem.aiModeration.decision === 'flagged' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {currentItem.aiModeration.decision === 'flagged' ? 'AI Flagged' : 'AI Approved'}
              </span>
              
              <span className="text-sm text-gray-500">
                {Math.round(currentItem.aiModeration.confidence * 100)}% confidence
              </span>
              
              {currentItem.aiModeration.reason && (
                <span className="text-sm text-gray-700">
                  Reason: {currentItem.aiModeration.reason}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleModeration('approve')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Approve
              </button>
              <button 
                onClick={() => handleModeration('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Reject
              </button>
              <button 
                onClick={() => handleModeration('escalate')}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              >
                Escalate
              </button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6 mb-4 text-center text-gray-500">
            No content waiting for moderation
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Test with your own content</h3>
          <form onSubmit={handleContentSubmit} className="space-y-3">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Type content to test moderation system..."
            ></textarea>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Submit for Moderation'}
              </button>
              <p className="text-xs text-gray-500">
                Try including words like &quot;password&quot; or &quot;click here&quot; to trigger the AI moderation
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right panel - Stats and Info */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-3">Moderation Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-gray-50 rounded border">
              <div className="text-sm text-gray-600">Content Reviewed</div>
              <div className="font-medium text-lg">{stats.reviewed}</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-100">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="font-medium text-lg text-green-600">{stats.approved}</div>
            </div>
            <div className="p-2 bg-red-50 rounded border border-red-100">
              <div className="text-sm text-gray-600">Rejected</div>
              <div className="font-medium text-lg text-red-600">{stats.rejected}</div>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-100">
              <div className="text-sm text-gray-600">Escalated</div>
              <div className="font-medium text-lg text-amber-600">{stats.escalated}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Content is first processed by AI moderation</li>
            <li>High-confidence safe content may be auto-approved</li>
            <li>Flagged or uncertain content goes to human review</li>
            <li>Human moderators have final decision authority</li>
            <li>The system learns from human decisions over time</li>
          </ol>
        </div>
        
        <div className="p-3 bg-amber-50 rounded border border-amber-100">
          <h3 className="font-medium text-amber-800 mb-1">Key Principle</h3>
          <p className="text-sm text-amber-700">
            Human-in-the-loop systems combine AI efficiency with human judgment 
            to create safer, more reliable content moderation.
          </p>
        </div>
      </div>
    </div>
  );
} 