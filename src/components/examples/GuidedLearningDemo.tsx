'use client';

import React, { useState } from 'react';

interface Step {
  id: number;
  title: string;
  instruction: string;
  hint: string;
  example: string;
  minLength: number;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Basic Prompt',
    instruction: 'Start simple - describe what you want to see',
    hint: 'Try something like: "a cat" or "a sunset"',
    example: 'a dog',
    minLength: 3
  },
  {
    id: 2,
    title: 'Add Details',
    instruction: 'Make it more specific with adjectives and setting',
    hint: 'Add describing words and a location. Example: "a fluffy cat on a windowsill"',
    example: 'a happy dog in a park',
    minLength: 15
  },
  {
    id: 3,
    title: 'Advanced Prompt',
    instruction: 'Add style, mood, or additional details',
    hint: 'Include colors, time of day, or artistic style. Example: "a fluffy orange cat sitting on a sunny windowsill, watercolor style"',
    example: 'a happy golden retriever playing in a sunny park',
    minLength: 25
  }
];

export default function GuidedLearningDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isComplete = completedSteps.length === steps.length;

  const handleNext = () => {
    if (userPrompt.length >= step.minLength) {
      setCompletedSteps([...completedSteps, step.id]);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setUserPrompt('');
        setShowHint(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUserPrompt('');
      setShowHint(false);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setUserPrompt('');
    setCompletedSteps([]);
    setShowHint(false);
  };

  const handleRestart = () => {
    handleStart();
  };

  const meetsRequirement = userPrompt.length >= step.minLength;

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Learn AI Prompt Writing</h2>
          <p className="text-gray-600 mb-6">Master the art of writing effective AI prompts in 3 simple steps</p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What you'll learn:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Start with simple, basic prompts
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Add descriptive details to improve results
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Use advanced techniques for professional results
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ~2 minutes
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              3 steps
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Beginner Friendly
            </span>
          </div>

          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
          <p className="text-gray-600 mb-6">You've completed the AI Prompt Writing tutorial</p>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-4">Your Progress:</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {steps.map((s, idx) => (
                <div key={s.id} className="bg-white rounded-lg p-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Complete</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Practice with different subjects and styles
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Experiment with combining multiple techniques
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Try advanced modifiers and parameters
              </li>
            </ul>
          </div>

          <button
            onClick={handleRestart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Restart Tutorial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">{step.id}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
            <p className="text-gray-600">{step.instruction}</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your AI Prompt:
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${meetsRequirement ? 'text-green-600' : 'text-gray-500'}`}>
              {userPrompt.length} / {step.minLength} characters minimum
            </span>
            {meetsRequirement && (
              <span className="flex items-center text-green-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Looks good!
              </span>
            )}
          </div>
        </div>

        {/* Hint Section */}
        <div className="mb-6">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Need a hint?
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">💡 Hint:</p>
                  <p className="text-sm text-yellow-800 mb-2">{step.hint}</p>
                  <button
                    onClick={() => setUserPrompt(step.example)}
                    className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                  >
                    Use example: "{step.example}"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {userPrompt.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">✨ AI Preview:</p>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <p className="text-gray-700 italic">"{userPrompt}"</p>
              {meetsRequirement ? (
                <p className="text-xs text-green-600 mt-2">Great! This prompt has good detail.</p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">Add more details to improve your prompt.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!meetsRequirement}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next Step'}
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
