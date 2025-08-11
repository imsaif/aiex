'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CopyCodeButton from './CopyCodeButton';

// Import syntax highlighter directly to avoid dynamic import issues
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Dynamically import the ContextualAssistanceDemo component with a more reliable approach
const ContextualAssistanceDemo = dynamic(
  () => import('@/components/examples/ContextualAssistanceDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the HumanInTheLoopModeration component
const HumanInTheLoopModeration = dynamic(
  () => import('@/components/examples/HumanInTheLoopModeration'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ProgressiveDisclosureEmailDemo component
const ProgressiveDisclosureEmailDemo = dynamic(
  () => import('@/components/examples/ProgressiveDisclosureEmailDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ConversationalUiDemo component
const ConversationalUiDemo = dynamic(
  () => import('@/components/examples/ConversationalUiDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ConfidenceIndicator component with interactive analysis
const ConfidenceIndicatorDemo = dynamic(
  () => import('@/components/examples/TransparentFeedbackDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the AdaptiveDashboardDemo component
const AdaptiveDashboardDemo = dynamic(
  () => import('@/components/examples/AdaptiveDashboardDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the AdaptiveLearningDemo component
const AdaptiveLearningDemo = dynamic(
  () => import('@/components/examples/AdaptiveLearningDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the MultimodalSearchDemo component
const MultimodalSearchDemo = dynamic(
  () => import('@/components/examples/MultimodalSearchDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the GuidedLearningDemo component
const GuidedLearningDemo = dynamic(
  () => import('@/components/examples/GuidedLearningDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the AugmentedCreationDemo component
const AugmentedCreationDemo = dynamic(
  () => import('@/components/examples/AugmentedCreationDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ResponsibleAiDesignDemo component
const ResponsibleAiDesignDemo = dynamic(
  () => import('@/components/examples/ResponsibleAiDesignDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ErrorRecoveryDemo component
const ErrorRecoveryDemo = dynamic(
  () => import('@/components/examples/ErrorRecoveryDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the CollaborativeAiDemo component
const CollaborativeAiDemo = dynamic(
  () => import('@/components/examples/CollaborativeAiDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the AmbientIntelligenceDemo component
const AmbientIntelligenceDemo = dynamic(
  () => import('@/components/examples/AmbientIntelligenceDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the SafeExplorationDemo component
const SafeExplorationDemo = dynamic(
  () => import('@/components/examples/SafeExplorationDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Dynamically import the ExplainableAiDemo component
const ExplainableAiDemo = dynamic(
  () => import('@/components/examples/ExplainableAiDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

interface CodeExampleBlockProps {
  code: string;
  language: string;
  title: string;
  description: string;
  componentId: string;
}

export default function CodeExampleBlock({
  code,
  language,
  title,
  description,
  componentId,
}: CodeExampleBlockProps) {
  const [showCode, setShowCode] = useState(false);
  const [componentLoaded, setComponentLoaded] = useState(false);

  useEffect(() => {
    // Mark components as loaded after initial render
    setComponentLoaded(true);
  }, []);

  // Render the appropriate component based on componentId
  const renderComponent = () => {
    switch (componentId) {
      case 'contextual-assistance-editor':
        return <ContextualAssistanceDemo />;
      case 'human-in-the-loop-moderation':
        return <HumanInTheLoopModeration />;
      case 'progressive-disclosure-email':
      case 'progressive-disclosure-email-demo':
        return <ProgressiveDisclosureEmailDemo />;
      case 'conversational-ui-bot':
        return <ConversationalUiDemo />;
      case 'confidence-indicator':
        return <ConfidenceIndicatorDemo />;
      case 'adaptive-dashboard':
        return <AdaptiveDashboardDemo />;
      case 'adaptive-learning':
        return <AdaptiveLearningDemo />;
      case 'multimodal-search':
        return <MultimodalSearchDemo />;
      case 'guided-learning-tutorial':
        return <GuidedLearningDemo />;
      case 'augmented-creation-demo':
        return <AugmentedCreationDemo />;
      case 'responsible-ai-design-demo':
        return <ResponsibleAiDesignDemo />;
      case 'error-recovery-demo':
        return <ErrorRecoveryDemo />;
      case 'collaborative-ai-demo':
        return <CollaborativeAiDemo />;
      case 'ambient-intelligence-demo':
        return <AmbientIntelligenceDemo />;
      case 'safe-exploration-demo':
        return <SafeExplorationDemo />;
      case 'explainable-ai-demo':
        return <ExplainableAiDemo />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>Preview not available for this example: {componentId}</p>
              <p className="text-sm mt-2">Try another example or switch back to code view</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Example header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Content area with toggle */}
      <div className="relative">
        {/* Header with Toggle */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            {showCode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="font-semibold text-blue-600">Code View</span>
                <span className="text-gray-600 ml-2 text-sm">- Implementation details</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-semibold text-blue-600">Live Preview</span>
                <span className="text-gray-600 ml-2 text-sm">- Interactive implementation</span>
              </>
            )}
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {showCode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">Show Preview</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sm font-medium">Show Code</span>
              </>
            )}
            
            {/* Toggle Indicator */}
            <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out"
                 style={{ backgroundColor: showCode ? '#3B82F6' : '#D1D5DB' }}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                showCode ? 'transform translate-x-5' : ''
              }`} />
            </div>
          </button>
        </div>

        {/* Content Area - Either Preview OR Code */}
        {showCode ? (
          /* Code View */
          <>
            <div className="flex items-center justify-between bg-gray-800 text-gray-300 text-xs px-4 py-2">
              <span className="font-mono">{language}</span>
              <CopyCodeButton 
                code={code}
                variant="standalone"
                size="sm"
                className="text-gray-300 hover:text-white bg-transparent border-none hover:bg-gray-700"
              />
            </div>
            <SyntaxHighlighter
              language={language}
              style={atomDark}
              showLineNumbers={true}
              wrapLongLines={false}
              customStyle={{ margin: 0, borderRadius: 0, maxHeight: '600px' }}
            >
              {code}
            </SyntaxHighlighter>
          </>
        ) : (
          /* Live Preview */
          <div className="p-6 flex justify-center bg-gray-50 min-h-[400px]">
            <div className={`w-full ${componentId === 'human-in-the-loop-moderation' || componentId === 'confidence-indicator' ? 'max-w-4xl' : 'max-w-lg'}`}>
              {componentLoaded ? renderComponent() : (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-600">
          <p>{showCode ? 'Toggle to preview mode to see the interactive demo.' : 'Toggle to code view to see the implementation details.'}</p>
        </div>
      </div>
    </div>
  );
} 