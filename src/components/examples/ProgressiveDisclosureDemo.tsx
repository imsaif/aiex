import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const email = {
  subject: 'Project Update: Q2 Roadmap',
  sender: 'Alex Johnson <alex@company.com>',
  preview: 'Hi team, I wanted to share a quick update on our Q2 roadmap. We have a few key milestones coming up...'
};

const aiSummary = 'AI Summary: The email provides a brief update on the Q2 roadmap and highlights upcoming milestones.';

const aiDetails = `Detailed Summary:\n- The team is on track for the next release.\n- Key milestones include feature X and Y.\n- There will be a planning meeting next week.\n\nAI Actions:\n- [ ] Reply with \"Thanks for the update!\"\n- [ ] Add planning meeting to calendar\n- [ ] Extract tasks for project board`;

function EmailSummarizerDemo() {
  const [showSummary, setShowSummary] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[180px] mb-8">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Email Summarizer</h4>
      <div className="mb-4">
        <div className="mb-1 text-xs text-gray-500">From: {email.sender}</div>
        <div className="font-medium text-gray-900">{email.subject}</div>
        <div className="text-gray-700 mt-2 line-clamp-3">{email.preview}</div>
      </div>
      <AnimatePresence mode="wait">
        {!showSummary && !showDetails && (
          <motion.button
            key="show-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="px-5 py-2 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowSummary(true)}
          >
            Show AI Summary
          </motion.button>
        )}
        {showSummary && !showDetails && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-blue-800 text-sm mb-4 whitespace-pre-line">
              {aiSummary}
            </div>
            <button
              className="px-5 py-2 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowDetails(true)}
            >
              Show More
            </button>
          </motion.div>
        )}
        {showDetails && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-violet-50 border border-violet-100 rounded text-violet-800 text-sm mb-4 whitespace-pre-line">
              {aiDetails}
            </div>
            <button
              className="px-5 py-2 bg-surface-primary border border-accent-primary text-accent-primary rounded-full font-medium hover:bg-accent-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setShowSummary(false);
                setShowDetails(false);
              }}
            >
              Hide Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center mt-6">
        <div className="text-xs text-gray-500 text-center">
          <span className="font-medium">Progressive Disclosure:</span> AI-powered insights and actions are revealed step by step, only when you request them.
        </div>
      </div>
    </div>
  );
}

function ChatbotDemo() {
  const [userQuestion, setUserQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[180px] mb-2">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Chatbot with Expanding Options</h4>
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Ask the AI a question:</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          placeholder="e.g. What are the Q2 milestones?"
          value={userQuestion}
          onChange={e => setUserQuestion(e.target.value)}
          disabled={showAnswer}
        />
      </div>
      <AnimatePresence mode="wait">
        {showAnswer && !showMore && (
          <motion.div
            key="simple-answer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-blue-800 text-sm mb-4">
              <strong>AI:</strong> The Q2 milestones include feature X and Y, with a planning meeting scheduled for next week.
            </div>
            <button
              className="px-5 py-2 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowMore(true)}
            >
              More Options
            </button>
          </motion.div>
        )}
        {showMore && (
          <motion.div
            key="more-options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-violet-50 border border-violet-100 rounded text-violet-800 text-sm mb-4">
              <strong>Deeper Explanation:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Feature X: Improves user onboarding flow.</li>
                <li>Feature Y: Adds advanced analytics dashboard.</li>
                <li>Planning meeting: Next Wednesday at 2pm.</li>
              </ul>
              <div className="mt-3">
                <strong>Related Actions:</strong>
                <ul className="list-disc ml-5 mt-1">
                  <li>Ask for a timeline of all milestones</li>
                  <li>Request a summary of last quarter</li>
                  <li>Get a list of responsible team members</li>
                </ul>
              </div>
            </div>
            <button
              className="px-5 py-2 bg-surface-primary border border-accent-primary text-accent-primary rounded-full font-medium hover:bg-accent-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setShowAnswer(false);
                setShowMore(false);
                setUserQuestion('');
              }}
            >
              Ask Another Question
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {!showAnswer && (
        <button
          className="mt-2 px-5 py-2 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!userQuestion.trim()}
          onClick={() => setShowAnswer(true)}
        >
          Ask AI
        </button>
      )}
      <div className="flex justify-center mt-6">
        <div className="text-xs text-gray-500 text-center">
          <span className="font-medium">Progressive Disclosure:</span> The chatbot reveals more options and explanations only when you request them.
        </div>
      </div>
    </div>
  );
}

export default function ProgressiveDisclosureDemo({ example }: { example: 'email' | 'chatbot' }) {
  if (example === 'email') return <EmailSummarizerDemo />;
  if (example === 'chatbot') return <ChatbotDemo />;
  return null;
} 