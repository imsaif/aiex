'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedPrompt, FileType, PromptFormData, AITool, UseCase } from '@/types/promptBuilder';
import { ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, SparklesIcon, CpuChipIcon, ArrowPathIcon, WrenchScrewdriverIcon, CubeIcon, LightBulbIcon, PaintBrushIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { downloadPrompt } from '@/utils/promptGenerator';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useThemeFilter } from '@/hooks/useTheme';

interface PromptPreviewProps {
  prompt: GeneratedPrompt;
  onDownload?: (fileType: FileType) => void;
  onGenerate?: () => void;
  onReset?: () => void;
  isGenerating?: boolean;
  hasGenerated?: boolean;
  formChanged?: boolean;
  formData?: PromptFormData;
}

// Empty State Component
function EmptyState({ formData }: { formData?: PromptFormData }) {
  const hasAITool = formData?.aiTool && formData.aiTool !== '';
  const hasContext = formData?.projectContext && formData.projectContext.trim() !== '';
  const isReadyToGenerate = hasAITool && hasContext;
  const logoFilter = useThemeFilter('none');

  // Get AI tool display name
  const getToolName = () => {
    if (!formData?.aiTool) return '';
    const toolNames: Record<string, string> = {
      'claude': 'Claude',
      'cursor': 'Cursor',
      'chatgpt': 'ChatGPT',
      'copilot': 'Copilot',
      'figma': 'Figma',
      'generic': 'Generic AI Tool'
    };
    return toolNames[formData.aiTool] || formData.aiTool;
  };

  // Get AI tool logo
  const getToolLogo = () => {
    if (!formData?.aiTool || formData.aiTool === '') return null;
    const logoMap: Record<string, string> = {
      'claude': '/images/logos/claude.svg',
      'cursor': '/images/logos/cursor.svg',
      'chatgpt': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/openai.svg',
      'copilot': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/githubcopilot.svg',
      'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/figma.svg',
    };
    return logoMap[formData.aiTool as AITool] || null;
  };

  // Get use case display name
  const getUseCaseName = () => {
    if (!formData?.useCase) return '';
    const useCaseNames: Record<string, string> = {
      'project-setup': 'New Project',
      'component': 'Component',
      'code-help': 'Get Help',
      'custom': 'Custom'
    };
    return useCaseNames[formData.useCase] || formData.useCase;
  };

  // Get use case icon
  const getUseCaseIcon = () => {
    if (!formData?.useCase || formData.useCase === '') return SparklesIcon;
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'project-setup': WrenchScrewdriverIcon,
      'component': CubeIcon,
      'code-help': LightBulbIcon,
      'custom': SparklesIcon,
    };
    return iconMap[formData.useCase as UseCase] || SparklesIcon;
  };

  // Always show summary card that fills in gradually
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-12"
    >
      <div className="w-full max-w-md">
        {/* Summary Card - Always visible */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-center">
              Building Prompt For
            </h3>
          </div>

          <div className="space-y-3">
            {/* AI Tool - Shows logo when selected, sparkle icon when not */}
            <div className="flex items-center gap-3 text-sm">
              {hasAITool && getToolLogo() ? (
                <img
                  src={getToolLogo()!}
                  alt={getToolName()}
                  className="w-5 h-5 object-contain flex-shrink-0"
                  style={{ filter: logoFilter }}
                />
              ) : (
                <SparklesIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              {hasAITool ? (
                <span className="font-semibold text-gray-900 dark:text-white">{getToolName()}</span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">Select an AI tool...</span>
              )}
            </div>

            {/* Project Type - Shows specific icon based on selection */}
            <div className="flex items-center gap-3 text-sm">
              {(() => {
                const UseCaseIconComponent = getUseCaseIcon();
                return <UseCaseIconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" />;
              })()}
              {formData?.useCase && formData.useCase !== '' ? (
                <span className="text-gray-700 dark:text-gray-300">{getUseCaseName()}</span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">What do you need?</span>
              )}
            </div>

            {/* Design Context - Shows placeholder if empty */}
            <div className="flex items-start gap-3 text-sm">
              <PaintBrushIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              {hasContext ? (
                <span className="text-gray-600 dark:text-gray-400 italic line-clamp-2">
                  "{formData.projectContext.substring(0, 60)}{formData.projectContext.length > 60 ? '...' : ''}"
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">Describe your design project...</span>
              )}
            </div>

            {/* Specific Task - Shows when filled */}
            {formData?.specificTask && formData.specificTask.trim() !== '' && (
              <div className="flex items-start gap-3 text-sm">
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 italic line-clamp-2">
                  {formData.specificTask.substring(0, 60)}{formData.specificTask.length > 60 ? '...' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-4">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {isReadyToGenerate ? 'Ready when you are!' : 'Fill in the details to get started'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Generating State Component
function GeneratingState() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <div>
          <p className="font-semibold text-lg text-text-primary">Generating your prompt...</p>
          <p className="text-sm text-text-tertiary mt-1">Crafting the perfect prompt for you</p>
        </div>
      </div>

      {/* Skeleton Shimmer */}
      <div className="space-y-3">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0.3, 0.6, 0.3], x: 0 }}
            transition={{
              opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.1 },
              x: { duration: 0.3, delay: i * 0.05 }
            }}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            style={{ width: `${50 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Generated Prompt Component
function GeneratedPromptContent({ text, isTyping }: { text: string; isTyping: boolean }) {
  return (
    <div className="leading-relaxed">
      <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
        {text}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1 h-4 bg-blue-600 dark:bg-blue-400 ml-1 align-middle"
          />
        )}
      </pre>
    </div>
  );
}

export default function PromptPreview({ prompt, onDownload, onGenerate, onReset, isGenerating = false, hasGenerated = false, formChanged = false, formData }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showFileTypes, setShowFileTypes] = useState(false);
  const isEmpty = !prompt.content || prompt.content.length === 0;

  // Typewriter effect - only enable after generation
  const { displayedText, isTyping } = useTypewriter(prompt.content, {
    speed: 20, // Comfortable pace for designers to read and follow
    enabled: hasGenerated && !isGenerating,
  });

  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (!isEmpty && !isGenerating) {
      setLastUpdated('just now');
      const timer = setTimeout(() => setLastUpdated('a moment ago'), 5000);
      return () => clearTimeout(timer);
    }
  }, [prompt.content, isEmpty, isGenerating]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = (fileType?: FileType) => {
    if (fileType && onDownload) {
      onDownload(fileType);
    } else {
      downloadPrompt(prompt);
    }
    setShowFileTypes(false);
  };

  const canGenerate = formData?.aiTool && formData.aiTool !== '';
  const showGenerateButton = !hasGenerated || formChanged;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
      <AnimatePresence mode="wait">
        {!hasGenerated && !isGenerating && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header with Start Over button */}
            <div className="flex items-center justify-end p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Start Over</span>
                </button>
              )}
            </div>

            <div className="flex-1">
              <EmptyState formData={formData} />
            </div>

            {/* Generate Button - Shows in empty state */}
            <div className="p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                         bg-black dark:bg-white text-white dark:text-black text-sm font-semibold
                         hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Generate Prompt</span>
              </button>
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header with Start Over button */}
            <div className="flex items-center justify-end p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Start Over</span>
                </button>
              )}
            </div>

            <div className="flex-1">
              <GeneratingState />
            </div>
          </motion.div>
        )}

        {hasGenerated && !isGenerating && (
          <motion.div
            key="generated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Your AI Prompt</h3>
                  <p className="text-xs text-text-tertiary flex items-center gap-2 mt-0.5">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Updated {lastUpdated}
                  </p>
                </div>
              </div>

              {/* Stats & Reset */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-medium text-text-tertiary">
                    {prompt.characterCount.toLocaleString()} characters
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {prompt.lineCount} lines
                  </p>
                </div>

                {/* Reset Button */}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Start Over</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 bg-white dark:bg-gray-800">
              <GeneratedPromptContent text={displayedText} isTyping={isTyping} />
            </div>

            {/* Actions */}
            <div className="p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {showGenerateButton ? (
                /* Generate Button */
                <button
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                           bg-black dark:bg-white text-white dark:text-black text-sm font-semibold
                           hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>{formChanged ? 'Regenerate Prompt' : 'Generate Prompt'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    disabled={isTyping}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                             bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
                             text-sm font-semibold text-gray-900 dark:text-white
                             hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="w-5 h-5" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>

                  {/* Download Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFileTypes(!showFileTypes)}
                      disabled={isTyping}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                               bg-black dark:bg-white text-white dark:text-black text-sm font-semibold
                               hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105
                               disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      <span>Download</span>
                    </button>

                    {/* File Type Dropdown */}
                    <AnimatePresence>
                      {showFileTypes && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-gray-800
                                   border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl
                                   overflow-hidden z-10"
                        >
                          <div className="p-2">
                            <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Download as
                            </p>
                            {[
                              { type: 'cursorrules' as FileType, label: '.cursorrules', desc: 'Cursor AI' },
                              { type: 'clinerules' as FileType, label: '.clinerules', desc: 'Cline' },
                              { type: 'claude-md' as FileType, label: 'CLAUDE.md', desc: 'Claude' },
                              { type: 'txt' as FileType, label: '.txt', desc: 'Generic' },
                            ].map((option) => (
                              <button
                                key={option.type}
                                onClick={() => handleDownload(option.type)}
                                className="w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium
                                         text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
                                         transition-colors flex items-center justify-between group"
                              >
                                <span>{option.label}</span>
                                <span className="text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                  {option.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
