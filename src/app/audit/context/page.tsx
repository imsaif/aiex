'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type {
  InterfaceType,
  UserGoal,
  MainConcern,
  Industry,
  ProductStage,
  ContextData,
} from '@/types/audit';

const interfaceTypes: Array<{ value: InterfaceType; label: string; icon: string; examples: string }> = [
  { value: 'chatbot', label: 'Chatbot/Conversational', icon: '💬', examples: 'ChatGPT, Claude-like' },
  { value: 'content', label: 'Content Generator', icon: '✨', examples: 'Jasper, Copy.ai-like' },
  { value: 'code', label: 'Code Assistant', icon: '👨‍💻', examples: 'Copilot, Codeium-like' },
  { value: 'image', label: 'Image/Creative AI', icon: '🎨', examples: 'Midjourney, DALL-E-like' },
  { value: 'analytics', label: 'Analytics/Insights', icon: '📊', examples: 'Tableau, PowerBI-like' },
  { value: 'other', label: 'Other', icon: '🎯', examples: 'Something different' },
];

const userGoals: Array<{ value: UserGoal; label: string }> = [
  { value: 'creating-content', label: 'Creating content or assets quickly' },
  { value: 'getting-answers', label: 'Getting answers to questions' },
  { value: 'making-decisions', label: 'Making informed decisions with AI help' },
  { value: 'automating-workflows', label: 'Automating repetitive workflows' },
  { value: 'exploring-options', label: 'Exploring and discovering options' },
  { value: 'analyzing-data', label: 'Analyzing patterns in data' },
];

const mainConcerns: Array<{ value: MainConcern; label: string; icon: string }> = [
  { value: 'trust', label: "Users don't trust the AI output", icon: '🤔' },
  { value: 'errors', label: "AI makes errors users don't catch", icon: '⚠️' },
  { value: 'usability', label: "Users don't understand how to use it", icon: '😕' },
  { value: 'blackbox', label: 'AI feels like a black box', icon: '📦' },
  { value: 'consistency', label: 'Results are unpredictable/inconsistent', icon: '🎲' },
];

export default function ContextFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ContextData>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.interfaceType || !formData.userGoal || !formData.mainConcern) {
      alert('Please answer all required questions');
      return;
    }

    sessionStorage.setItem('auditContext', JSON.stringify(formData));
    router.push('/audit/upload');
  };

  const handleSkip = () => {
    sessionStorage.setItem('auditContext', JSON.stringify({ interfaceType: 'other' }));
    router.push('/audit/upload');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center mb-12">
          <div className="flex-1 h-1 bg-accent-primary dark:bg-white rounded-full" />
          <div className="mx-3 text-xs font-semibold text-text-primary">STEP 1</div>
          <div className="flex-1 h-1 bg-border-primary rounded-full" />
          <div className="mx-3 text-xs text-text-tertiary">STEP 2</div>
          <div className="flex-1 h-1 bg-border-primary rounded-full" />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-text-primary tracking-tight">
          Help us understand your AI product
        </h2>
        <p className="text-text-secondary text-lg mb-10">
          Better recommendations in 30 seconds
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question 1: Interface Type */}
          <div>
            <label className="block font-semibold mb-4 text-text-primary">
              1. What type of AI interface is this? <span className="text-text-primary">*</span>
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {interfaceTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.interfaceType === type.value
                      ? 'border-accent-primary dark:border-white bg-accent-subtle'
                      : 'border-border-primary hover:border-border-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="interfaceType"
                    value={type.value}
                    checked={formData.interfaceType === type.value}
                    onChange={(e) => setFormData({ ...formData, interfaceType: e.target.value as InterfaceType })}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold text-text-primary">
                      {type.icon} {type.label}
                    </div>
                    <div className="text-xs text-text-tertiary">{type.examples}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: User Goal */}
          <div>
            <label htmlFor="userGoal" className="block font-semibold mb-4 text-text-primary">
              2. What's the primary user goal? <span className="text-text-primary">*</span>
            </label>
            <select
              id="userGoal"
              value={formData.userGoal || ''}
              onChange={(e) => setFormData({ ...formData, userGoal: e.target.value as UserGoal })}
              className="w-full p-3 border-2 border-border-primary rounded-2xl bg-surface-primary text-text-primary focus:border-accent-primary dark:focus:border-white focus:outline-none"
            >
              <option value="">Select a goal...</option>
              {userGoals.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 3: Main Concern */}
          <div>
            <label className="block font-semibold mb-4 text-text-primary">
              3. What's your biggest concern right now? <span className="text-text-primary">*</span>
            </label>
            <div className="space-y-3">
              {mainConcerns.map((concern) => (
                <label
                  key={concern.value}
                  className={`flex items-center p-3 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.mainConcern === concern.value
                      ? 'border-accent-primary dark:border-white bg-accent-subtle'
                      : 'border-border-primary hover:border-border-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="mainConcern"
                    value={concern.value}
                    checked={formData.mainConcern === concern.value}
                    onChange={(e) => setFormData({ ...formData, mainConcern: e.target.value as MainConcern })}
                    className="mr-3"
                  />
                  <span className="text-text-primary">
                    {concern.icon} {concern.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Advanced Settings */}
          <details open={showAdvanced} onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer font-semibold text-text-secondary mb-4 hover:text-text-primary transition-colors">
              ▼ Optional: Industry-specific requirements
            </summary>
            <div className="mt-4 p-5 bg-background-secondary rounded-2xl space-y-4">
              <div>
                <label htmlFor="industry" className="block font-semibold mb-2 text-text-primary">
                  Industry/Domain
                </label>
                <select
                  id="industry"
                  value={formData.industry || 'not-specified'}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value as Industry })}
                  className="w-full p-3 border-2 border-border-primary rounded-2xl bg-surface-primary text-text-primary focus:border-accent-primary dark:focus:border-white focus:outline-none"
                >
                  <option value="not-specified">Not specified</option>
                  <option value="healthcare">🏥 Healthcare/Medical</option>
                  <option value="finance">💰 Finance/Banking</option>
                  <option value="education">📚 Education</option>
                  <option value="ecommerce">🛍️ E-commerce/Retail</option>
                  <option value="developer-tools">⚙️ Developer Tools</option>
                  <option value="creative">🎨 Creative/Design</option>
                  <option value="legal">⚖️ Legal</option>
                  <option value="enterprise">🏢 Enterprise/B2B</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-text-primary">Product Stage</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['concept', 'beta', 'production', 'scaling'] as ProductStage[]).map((stage) => (
                    <label
                      key={stage}
                      className={`p-3 border-2 rounded-2xl cursor-pointer text-center transition-all ${
                        formData.stage === stage
                          ? 'border-accent-primary dark:border-white bg-accent-subtle'
                          : 'border-border-primary hover:border-border-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="stage"
                        value={stage}
                        checked={formData.stage === stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProductStage })}
                        className="sr-only"
                      />
                      <div className="text-xs text-text-primary capitalize">{stage}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/audit"
              className="flex-1 px-6 py-3 border-2 border-border-primary rounded-2xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-center"
            >
              ← Back
            </Link>
            <button
              type="submit"
              className="flex-[2] px-6 py-3 bg-accent-primary dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:scale-[1.02] transition-transform shadow-card"
            >
              Continue to Upload →
            </button>
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-text-tertiary hover:text-text-secondary underline"
            >
              Skip questions (less accurate results)
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}
