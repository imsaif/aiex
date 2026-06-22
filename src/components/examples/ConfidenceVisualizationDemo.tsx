'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

type Classification = 'spam' | 'legitimate';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  classification: Classification;
  /** The AI's confidence in its own classification (0-1). */
  confidence: number;
  reason: string;
}

// A realistic inbox: mostly legitimate mail, one obvious spam, and one
// genuinely ambiguous message where the AI is unsure. The AI doesn't flag
// everything, it flags what it's confident about and asks for help on the rest.
const emails: Email[] = [
  {
    id: '1',
    sender: 'Sarah Chen',
    subject: 'Meeting tomorrow at 3pm',
    preview: "Hi team, let's sync on the Q4 roadmap before the review...",
    classification: 'legitimate',
    confidence: 0.98,
    reason: 'A known contact, continuing a thread you replied to yesterday.'
  },
  {
    id: '2',
    sender: 'FedEx',
    subject: 'Your package is delayed',
    preview: 'We apologize, but your delivery has been rescheduled to...',
    classification: 'legitimate',
    confidence: 0.9,
    reason: "Sent from the carrier's verified domain and matches a recent shipment on your account."
  },
  {
    id: '3',
    sender: 'rewards-team@winnings-claim.co',
    subject: 'Congratulations! You won $1,000,000!',
    preview: 'Click here to claim your prize immediately before it...',
    classification: 'spam',
    confidence: 0.97,
    reason: 'Unverified sender, an urgent money claim, and a link to a domain seen in known scams.'
  },
  {
    id: '4',
    sender: 'billing@acme-supplies.com',
    subject: 'Invoice #4821 attached',
    preview: 'Please find attached your invoice for this month...',
    classification: 'legitimate',
    confidence: 0.53,
    reason: "New sender domain and no prior invoices from them. Could be a real vendor or a lookalike. The AI isn't sure."
  },
  {
    id: '5',
    sender: 'deals@shopnow.com',
    subject: 'Limited time offer, 50% off everything',
    preview: 'Exclusive deal just for you! Expires in 2 hours...',
    classification: 'spam',
    confidence: 0.74,
    reason: "Marketing urgency cues, but from a store you've opened mail from before."
  }
];

export default function ConfidenceVisualizationDemo() {
  const [expandedId, setExpandedId] = useState<string | null>('4');

  const confidencePct = (c: number) => Math.round(c * 100);

  const levelLabel = (c: number) =>
    c >= 0.8 ? 'High confidence' : c >= 0.6 ? 'Medium confidence' : 'Low confidence';

  // Small status dot only. The level is the signal; the bar stays on-brand.
  const dotClass = (c: number) =>
    c < 0.6 ? 'bg-status-warning' : c >= 0.8 ? 'bg-status-success' : 'bg-status-warning';

  // The AI's at-a-glance read for the collapsed row. Calm by default; the dot
  // carries colour, the text stays neutral.
  const summary = (email: Email) => {
    if (email.confidence < 0.6) return { dot: 'bg-status-warning', label: 'Needs review' };
    if (email.classification === 'spam') return { dot: 'bg-status-error', label: 'Likely spam' };
    return { dot: 'bg-status-success', label: 'Looks safe' };
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-text-primary">Inbox</h2>
        <p className="text-sm text-text-secondary mt-1">
          The AI sorts your mail and shows how sure it is. Tap a message to see the score and why.
        </p>
      </div>

      <div className="space-y-2">
        {emails.map((email) => {
          const isOpen = expandedId === email.id;
          const s = summary(email);
          return (
            <div
              key={email.id}
              className={`rounded-card border bg-surface-primary overflow-hidden transition-colors ${
                isOpen ? 'border-accent-primary' : 'border-border-primary hover:border-border-secondary'
              }`}
            >
              {/* Collapsed row */}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : email.id)}
                aria-expanded={isOpen}
                className="w-full text-left p-4 flex items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary truncate">{email.sender}</p>
                  </div>
                  <p className="text-sm text-text-primary truncate">{email.subject}</p>
                  <p className="text-xs text-text-tertiary truncate mt-0.5">{email.preview}</p>
                </div>

                {/* Subtle AI read */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
                  <span className="text-xs text-text-secondary hidden sm:inline">{s.label}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </div>
              </button>

              {/* Expanded AI analysis */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border-primary">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-primary uppercase tracking-wide mt-4 mb-3">
                        <SparklesIcon className="w-4 h-4" aria-hidden="true" />
                        AI assessment
                      </div>

                      {/* Classification + confidence number */}
                      <div className="flex items-end justify-between mb-2">
                        <div>
                          <p className="text-sm text-text-secondary">Classified as</p>
                          <p className="text-lg font-bold text-text-primary">
                            {email.classification === 'spam' ? 'Spam' : 'Legitimate'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-text-primary leading-none">
                            {confidencePct(email.confidence)}%
                          </p>
                          <div className="flex items-center justify-end gap-1.5 mt-1">
                            <span className={`h-2 w-2 rounded-full ${dotClass(email.confidence)}`} aria-hidden="true" />
                            <span className="text-xs text-text-secondary">{levelLabel(email.confidence)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Confidence bar (brand accent, neutral track) */}
                      <div className="w-full bg-background-secondary rounded-full h-2 overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${email.confidence * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-2 rounded-full bg-accent-primary"
                        />
                      </div>

                      {/* Why */}
                      <p className="text-sm text-text-secondary">
                        <span className="font-semibold text-text-primary">Why: </span>
                        {email.reason}
                      </p>

                      {/* Action tied to the confidence level */}
                      {email.confidence < 0.6 ? (
                        <div className="mt-4 p-3 rounded-card bg-status-warning/10 border border-warning flex flex-col sm:flex-row sm:items-center gap-3">
                          <p className="text-sm text-text-primary flex-1">
                            <span className="font-semibold">Low confidence.</span> Review this one yourself before it&apos;s filed automatically.
                          </p>
                          <Button size="sm" className="flex-shrink-0">Review email</Button>
                        </div>
                      ) : email.classification === 'spam' ? (
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <p className="text-sm text-text-secondary flex-1">Filed to Spam. You can override if this looks wrong.</p>
                          <Button variant="secondary" size="sm" className="flex-shrink-0">Not spam</Button>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-text-secondary">
                          Delivered to your inbox. No action needed.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="mt-6 bg-accent-subtle border border-border-primary rounded-card p-4 space-y-2">
        <p className="text-sm font-semibold text-text-primary">How it works:</p>
        <ul className="text-sm text-text-secondary space-y-1 ml-4 list-disc">
          <li>The AI shows a confidence score for its read on each email, not a yes/no verdict.</li>
          <li>High confidence (80%+) is filed automatically. You can trust it with minimal checking.</li>
          <li>Low confidence (&lt;60%) is surfaced for review instead of being acted on silently.</li>
          <li>The score is tied to an action, so confidence changes what happens, it isn&apos;t just decoration.</li>
        </ul>
      </div>
    </div>
  );
}
