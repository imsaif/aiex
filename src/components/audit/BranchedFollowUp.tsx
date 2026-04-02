'use client';

import { useState } from 'react';
import type { ProductType } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const branchedOptions: Record<ProductType, { question: string; choices: string[] }> = {
  'ai-agent': {
    question: 'How does your agent take action?',
    choices: [
      'Fully automatic — no approval needed',
      'Asks before each action',
      'Asks only for high-risk actions',
      'User sets automation level',
    ],
  },
  'chat-interface': {
    question: 'What can users do when AI is wrong?',
    choices: [
      'Can edit or regenerate responses',
      'Can flag incorrect responses',
      'Can escalate to human',
      'No correction mechanism',
    ],
  },
  'recommendation-system': {
    question: 'How does AI explain its suggestions?',
    choices: [
      'Shows reasoning for each suggestion',
      'Scores or ranks visually',
      'User can ask why',
      'No explanation provided',
    ],
  },
  'content-generation': {
    question: 'What does the AI generate?',
    choices: [
      'Text and copy',
      'Images and visuals',
      'Code',
      'Multi-format output',
    ],
  },
  other: {
    question: 'Where does AI make decisions?',
    choices: [
      'Surfaces recommendations',
      'Automates decisions',
      'Filters or sorts content',
      'Generates predictions',
    ],
  },
};

const placeholders: Record<ProductType, string> = {
  'ai-agent': 'e.g. Automates customer onboarding tasks',
  'chat-interface': 'e.g. AI support bot for SaaS products',
  'recommendation-system': 'e.g. Recommends content for marketing teams',
  'content-generation': 'e.g. Generates social copy from a brief',
  other: 'e.g. AI-powered analytics dashboard',
};

interface BranchedFollowUpProps {
  productType: ProductType;
  onBack: () => void;
  onContinue: (description: string, aiRole: string[]) => void;
}

export function BranchedFollowUp({ productType, onBack, onContinue }: BranchedFollowUpProps) {
  const [description, setDescription] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const branch = branchedOptions[productType];

  const toggleRole = (option: string) => {
    setSelectedRoles((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const canContinue = description.trim().length > 0 && selectedRoles.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-base text-text-tertiary mb-8 hover:text-text-primary transition-colors cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-3xl font-semibold mb-3 text-text-primary">Tell us about your product</h2>
      <p className="text-text-secondary mb-10 text-base">This helps us give you specific, actionable feedback</p>

      {/* Product description input */}
      <div className="mb-10 text-left">
        <label className="block text-base font-semibold mb-3 text-text-primary">What does your product do?</label>
        <input
          type="text"
          placeholder={placeholders[productType]}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-2 border-border-primary rounded-xl px-5 py-4 text-base focus:outline-none focus:border-accent-primary bg-background-primary text-text-primary placeholder:text-text-tertiary transition-colors"
        />
      </div>

      {/* Branched multi-select */}
      <div className="mb-10 text-left">
        <label className="block text-base font-semibold mb-4 text-text-primary">{branch.question}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {branch.choices.map((option) => {
            const isSelected = selectedRoles.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleRole(option)}
                className={`relative flex items-center gap-3 p-5 border-2 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent-primary bg-accent-primary/5'
                    : 'border-border-primary bg-background-primary hover:border-accent-primary/50 hover:shadow-md'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-accent-primary border-accent-primary'
                    : 'border-border-primary'
                }`}>
                  {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-base font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          trackAuditEvent('audit_step_completed', { step: 'product-detail', productType });
          onContinue(description.trim(), selectedRoles);
        }}
        disabled={!canContinue}
        className="w-full bg-accent-primary text-white dark:text-gray-900 py-4 rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
