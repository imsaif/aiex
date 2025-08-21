import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Interactive Tutorial with Step-by-Step Guidance",
    description: "Interactive tutorial system with step-by-step guidance, contextual hints, and progress tracking.",
    language: "tsx",
    componentId: "guided-learning-tutorial",
    code: `import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, HelpCircle, Target } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  content: string;
  action?: 'click' | 'type' | 'select' | 'observe';
  hint?: string;
  completed?: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
}

const sampleTutorial: Tutorial = {
  id: 'dashboard-basics',
  title: 'Dashboard Basics',
  description: 'Learn how to navigate and use your dashboard effectively',
  difficulty: 'beginner',
  estimatedTime: '5 minutes',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Your Dashboard',
      description: 'Let\\'s explore the main features of your dashboard',
      content: 'Your dashboard is your central hub. We\\'ll guide you through each section.',
      action: 'observe'
    },
    {
      id: 'navigation',
      title: 'Navigation Menu',
      description: 'Learn about the main navigation',
      target: '.navigation-menu',
      content: 'The left navigation contains main sections. Click "Analytics" to continue.',
      action: 'click',
      hint: 'Look for the Analytics link in the left sidebar'
    },
    {
      id: 'analytics',
      title: 'Analytics Overview',
      description: 'Understanding your analytics data',
      target: '.analytics-section',
      content: 'This section shows key performance metrics with various chart types and time periods.',
      action: 'observe'
    },
    {
      id: 'filters',
      title: 'Using Filters',
      description: 'Filter your data effectively',
      target: '.filter-dropdown',
      content: 'Use the date filter to change time periods. Select "Last 7 days".',
      action: 'select',
      hint: 'Click on the date filter dropdown and select "Last 7 days"'
    },
    {
      id: 'export',
      title: 'Exporting Data',
      description: 'Learn to export your reports',
      target: '.export-button',
      content: 'Export data as PDF or CSV. Click the export button to see options.',
      action: 'click',
      hint: 'Look for the download icon in the top right of the analytics section'
    }
  ]
};

export default function GuidedLearningTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Last 30 days');

  const tutorial = sampleTutorial;
  const step = tutorial.steps[currentStep];
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  useEffect(() => {
    if (isActive && step?.target) {
      highlightElement(step.target);
    }
    return () => removeHighlighting();
  }, [currentStep, isActive, step]);

  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
    }
  };

  const removeHighlighting = () => {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
  };

  const handleNext = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setCurrentStep(prev => prev + 1);
      setShowHint(false);
    } else {
      // Tutorial completed
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setIsActive(false);
      removeHighlighting();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    removeHighlighting();
  };

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setShowHint(false);
  };

  const isCompleted = completedSteps.size === tutorial.steps.length;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Mock Dashboard Interface */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Menu */}
          <div className="navigation-menu bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Dashboard</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Analytics</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Reports</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
            </ul>
          </div>

          {/* Analytics Section */}
          <div className="md:col-span-3 analytics-section bg-white rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Analytics Overview</h3>
              <div className="flex gap-2">
                <select 
                  className="filter-dropdown border rounded px-2 py-1"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
                <button className="export-button bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Export
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-medium">Total Users</h4>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-medium">Revenue</h4>
                <p className="text-2xl font-bold text-green-600">$12,345</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium">Conversion Rate</h4>
                <p className="text-2xl font-bold text-purple-600">3.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Controls */}
      {!isActive ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-blue-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{tutorial.title}</h2>
              <p className="text-gray-600 mb-4">{tutorial.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <span className={\`px-2 py-1 rounded text-xs \${
                    tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }\`}>
                    {tutorial.difficulty}
                  </span>
                </span>
                <span>⏱️ {tutorial.estimatedTime}</span>
                <span>📋 {tutorial.steps.length} steps</span>
              </div>
              {isCompleted ? (
                <div className="flex items-center text-green-600 mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  Tutorial completed!
                </div>
              ) : null}
              <button
                onClick={startTutorial}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                {isCompleted ? 'Restart Tutorial' : 'Start Tutorial'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Tutorial Overlay */
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            {/* Progress Bar */}
            <div className="p-4 border-b">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {tutorial.steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: \`\${progress}%\` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.content}</p>
              
              {step.action && step.action !== 'observe' && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Action required:</strong> {step.description}
                  </p>
                </div>
              )}

              {showHint && step.hint && (
                <div className="bg-yellow-50 p-3 rounded mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Hint:</strong> {step.hint}
                  </p>
                </div>
              )}
            </div>

            {/* Tutorial Controls */}
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {step.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentStep === tutorial.steps.length - 1 ? 'Complete' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial CSS */}
      <style dangerouslySetInnerHTML={{
        __html: \`
          .tutorial-highlight {
            position: relative;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
            border-radius: 4px;
            z-index: 10;
          }
          
          .tutorial-highlight::after {
            content: '';
            position: absolute;
            top: -8px;
            right: -8px;
            width: 16px;
            height: 16px;
            background: #3B82F6;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        \`
      }} />
    </div>
  );
}`
  }
]; 