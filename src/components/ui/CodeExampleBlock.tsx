'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CopyCodeButton from './CopyCodeButton';

// Import lightweight syntax highlighter with only needed languages
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);

// Dynamically import the ContextualAssistanceDemo component with a more reliable approach
const ContextualAssistanceDemo = dynamic(
  () => import('@/components/examples/ContextualAssistanceDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the guided chatbot
const ConversationalUIGuidedBot = dynamic(
  () => import('@/components/guides/ConversationalUIBot').then(mod => ({ default: mod.ConversationalUIBot })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div></div> }
);

// Dynamically import the ConfidenceIndicator component with interactive analysis
const ConfidenceIndicatorDemo = dynamic(
  () => import('@/components/examples/TransparentFeedbackDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the PredictiveAnticipationDemo component
const PredictiveAnticipationDemo = dynamic(
  () => import('@/components/examples/PredictiveAnticipationDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the ConfidenceVisualizationDemo component
const ConfidenceVisualizationDemo = dynamic(
  () => import('@/components/examples/ConfidenceVisualizationDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the SelectiveMemoryDemo component
const SelectiveMemoryDemo = dynamic(
  () => import('@/components/examples/SelectiveMemoryDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the FeedbackLoopsDemo component
const FeedbackLoopsDemo = dynamic(
  () => import('@/components/examples/FeedbackLoopsDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the GracefulHandoffDemo component
const GracefulHandoffDemo = dynamic(
  () => import('@/components/examples/GracefulHandoffDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the ContextSwitchingDemo component
const ContextSwitchingDemo = dynamic(
  () => import('@/components/examples/ContextSwitchingDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the IntelligentCachingDemo component
const IntelligentCachingDemo = dynamic(
  () => import('@/components/examples/IntelligentCachingDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the PrivacyFirstDesignDemo component
const PrivacyFirstDesignDemo = dynamic(
  () => import('@/components/examples/PrivacyFirstDesignDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the ProgressiveEnhancementDemo component
const ProgressiveEnhancementDemo = dynamic(
  () => import('@/components/examples/ProgressiveEnhancementDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the UniversalAccessDemo component
const UniversalAccessDemo = dynamic(
  () => import('@/components/examples/UniversalAccessDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the CrisisDetectionDemo component
const CrisisDetectionDemo = dynamic(
  () => import('@/components/examples/CrisisDetectionDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the SessionDegradationDemo component
const SessionDegradationDemo = dynamic(
  () => import('@/components/examples/SessionDegradationDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the AntiManipulationSafeguardsDemo component
const AntiManipulationSafeguardsDemo = dynamic(
  () => import('@/components/examples/AntiManipulationSafeguardsDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the VulnerableUserProtectionDemo component
const VulnerableUserProtectionDemo = dynamic(
  () => import('@/components/examples/VulnerableUserProtectionDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the AutonomySpectrumDemo component
const AutonomySpectrumDemo = dynamic(
  () => import('@/components/examples/AutonomySpectrumDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the IntentPreviewDemo component
const IntentPreviewDemo = dynamic(
  () => import('@/components/examples/IntentPreviewDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the PlanSummaryDemo component
const PlanSummaryDemo = dynamic(
  () => import('@/components/examples/PlanSummaryDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the ActionAuditTrailDemo component
const ActionAuditTrailDemo = dynamic(
  () => import('@/components/examples/ActionAuditTrailDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the EscalationPathwaysDemo component
const EscalationPathwaysDemo = dynamic(
  () => import('@/components/examples/EscalationPathwaysDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the TrustCalibrationDemo component
const TrustCalibrationDemo = dynamic(
  () => import('@/components/examples/TrustCalibrationDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the MixedInitiativeControlDemo component
const MixedInitiativeControlDemo = dynamic(
  () => import('@/components/examples/MixedInitiativeControlDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }
);

// Dynamically import the AgentStatusMonitoringDemo component
const AgentStatusMonitoringDemo = dynamic(
  () => import('@/components/examples/AgentStatusMonitoringDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
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

import { scaffoldedDemos } from '@/components/examples/scaffolded/registry';
import { REGISTERED_DEMOS } from './demo-registry';

export default function CodeExampleBlock({
  code,
  language,
  title,
  description,
  componentId,
}: CodeExampleBlockProps) {
  const ScaffoldedDemo = scaffoldedDemos[componentId];
  const hasLivePreview = REGISTERED_DEMOS.has(componentId) || !!ScaffoldedDemo;
  const [showCode, setShowCode] = useState(!hasLivePreview);

  // Width class for the live preview, shared by the full block and preview-only mode.
  const previewMaxWidth = [
    'human-in-the-loop-moderation', 'confidence-indicator', 'guided-learning-tutorial', 'collaborative-ai-demo', 'ambient-intelligence-demo', 'responsible-ai-design-demo', 'confidence-visualization-demo', 'selective-memory-demo', 'context-switching-demo', 'crisis-detection-escalation-demo', 'multi-layer-crisis-detection', 'action-audit-trail-demo', 'mixed-initiative-control-demo', 'autonomy-spectrum-demo', 'conversational-ui-guided', 'VulnerableUserProtectionDemo',
  ].includes(componentId)
    ? 'max-w-6xl'
    : [
        'augmented-creation-demo', 'adaptive-dashboard', 'multimodal-search', 'error-recovery-demo', 'safe-exploration-demo', 'explainable-ai-demo', 'predictive-anticipation-demo', 'intelligent-caching-demo', 'privacy-first-design-demo', 'progressive-enhancement-demo', 'contextual-assistance-editor', 'progressive-disclosure-email-demo', 'progressive-disclosure-email', 'intent-preview-demo', 'plan-summary-demo', 'escalation-pathways-demo', 'trust-calibration-demo', 'agent-status-monitoring-demo',
      ].includes(componentId)
      ? 'max-w-4xl'
      : ['session-degradation-prevention-example-0', 'anti-manipulation-safeguards-demo'].includes(componentId)
        ? 'max-w-2xl'
        : ScaffoldedDemo
          ? 'max-w-4xl'
          : 'max-w-lg';
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
      case 'conversational-ui-guided':
        return <ConversationalUIGuidedBot />;
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
      case 'predictive-anticipation-demo':
        return <PredictiveAnticipationDemo />;
      case 'confidence-visualization-demo':
        return <ConfidenceVisualizationDemo />;
      case 'selective-memory-demo':
        return <SelectiveMemoryDemo />;
      case 'feedback-loops-demo':
        return <FeedbackLoopsDemo />;
      case 'graceful-handoff-demo':
        return <GracefulHandoffDemo />;
      case 'context-switching-demo':
        return <ContextSwitchingDemo />;
      case 'intelligent-caching-demo':
        return <IntelligentCachingDemo />;
      case 'privacy-first-design-demo':
        return <PrivacyFirstDesignDemo />;
      case 'progressive-enhancement-demo':
        return <ProgressiveEnhancementDemo />;
      case 'universal-access-patterns-demo':
        return <UniversalAccessDemo />;
      case 'crisis-detection-escalation-demo':
      case 'multi-layer-crisis-detection':
        return <CrisisDetectionDemo />;
      case 'session-degradation-prevention-example-0':
        return <SessionDegradationDemo />;
      case 'anti-manipulation-safeguards-demo':
        return <AntiManipulationSafeguardsDemo />;
      case 'VulnerableUserProtectionDemo':
        return <VulnerableUserProtectionDemo />;
      case 'autonomy-spectrum-demo':
        return <AutonomySpectrumDemo />;
      case 'intent-preview-demo':
        return <IntentPreviewDemo />;
      case 'plan-summary-demo':
        return <PlanSummaryDemo />;
      case 'action-audit-trail-demo':
        return <ActionAuditTrailDemo />;
      case 'escalation-pathways-demo':
        return <EscalationPathwaysDemo />;
      case 'trust-calibration-demo':
        return <TrustCalibrationDemo />;
      case 'mixed-initiative-control-demo':
        return <MixedInitiativeControlDemo />;
      case 'agent-status-monitoring-demo':
        return <AgentStatusMonitoringDemo />;
      default:
        if (ScaffoldedDemo) {
          return <ScaffoldedDemo />;
        }
        return (
          <div className="flex items-center justify-center h-64 text-text-tertiary">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      {/* Example header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>

      {/* Content area with toggle */}
      <div className="relative">
        {/* Segmented Control Header */}
        <div className={`${hasLivePreview ? 'flex' : 'hidden'} justify-center p-4 border-b border-gray-200 dark:border-gray-700`}>
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-1">
            {/* Preview Button */}
            <button
              onClick={() => setShowCode(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                !showCode
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </button>

            {/* Code Button */}
            <button
              onClick={() => setShowCode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                showCode
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Code</span>
            </button>
          </div>
        </div>

        {/* Content Area - Either Preview OR Code */}
        {showCode ? (
          /* Code View */
          <>
            <div className="flex items-center justify-between bg-text-primary text-white text-xs px-4 py-2">
              <span className="font-mono">{language}</span>
              <CopyCodeButton
                code={code}
                variant="standalone"
                size="sm"
                className="text-white hover:text-background-primary bg-transparent border-none hover:bg-text-secondary"
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
          <div className={`p-6 flex justify-center ${ScaffoldedDemo ? '' : 'min-h-[400px]'}`}>
            <div className={`w-full ${previewMaxWidth}`}>
              {componentLoaded ? renderComponent() : (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        {hasLivePreview && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-text-secondary">
            <p>{showCode ? 'Toggle to preview mode to see the interactive demo.' : 'Toggle to code view to see the implementation details.'}</p>
          </div>
        )}
      </div>
    </div>
  );
} 