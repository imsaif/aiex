'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PromptFormData, AITool, UseCase, PromptTemplate, FileType } from '@/types/promptBuilder';
import { generateCompletePrompt } from '@/utils/promptGenerator';
import AIToolSelector from './AIToolSelector';
import PromptPreview from './PromptPreview';
import PromptTemplates from './PromptTemplates';
import {
  WrenchScrewdriverIcon,
  CubeIcon,
  LightBulbIcon,
  SparklesIcon,
  PaintBrushIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';

export default function PromptBuilderForm() {
  const [formData, setFormData] = useState<PromptFormData>({
    aiTool: '',
    useCase: '',
    designSystem: {},
    projectContext: '',
    specificTask: '',
    techStack: [],
  });

  const [generatedPrompt, setGeneratedPrompt] = useState(
    generateCompletePrompt({ ...formData, aiTool: 'claude' }, 'txt')
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Detect theme for JS-controlled selected styles
  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme');
      const hasClass = html.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(theme === 'dark' || hasClass || (theme === null && prefersDark));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  // Track when form changes after generation
  // Only trigger on formData changes, not on hasGenerated changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (hasGenerated) {
      setFormChanged(true);
    }
  }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps

  // JS-controlled selected chip styles
  const getSelectedChipClasses = () => {
    return isDark
      ? 'border-white bg-white text-black shadow-md'
      : 'border-black bg-black text-white shadow-md';
  };

  const handleAIToolChange = (tool: AITool) => {
    setFormData((prev) => ({ ...prev, aiTool: tool }));
  };

  const handleUseCaseChange = (useCase: UseCase) => {
    setFormData((prev) => ({ ...prev, useCase }));
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    if (template.defaultValues) {
      setFormData((prev) => ({
        ...prev,
        ...template.defaultValues,
        template: template.id,
      }));
    }
  };

  const handleDownload = (fileType: FileType) => {
    const prompt = generateCompletePrompt(formData, fileType);
    setGeneratedPrompt(prompt);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate generation delay for better UX
    setTimeout(() => {
      setGeneratedPrompt(generateCompletePrompt(formData, 'txt'));
      // Keep generating state for minimum 400ms to show animation
      setTimeout(() => {
        setIsGenerating(false);
        setHasGenerated(true);
        setFormChanged(false);
      }, 400);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      aiTool: '',
      useCase: '',
      designSystem: {},
      projectContext: '',
      specificTask: '',
      techStack: [],
    });
    setHasGenerated(false);
    setFormChanged(false);
  };

  const handleTechStackToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Form - 40% width */}
        <div className="lg:w-[40%] space-y-5">

          {/* AI Tool Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <AIToolSelector selected={formData.aiTool} onChange={handleAIToolChange} />
          </motion.div>

          {/* Purpose Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-tertiary mb-4">
              What do you need?
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'project-setup', label: 'New Project', icon: WrenchScrewdriverIcon },
                { id: 'component', label: 'Component', icon: CubeIcon },
                { id: 'code-help', label: 'Get Help', icon: LightBulbIcon },
                { id: 'custom', label: 'Custom', icon: SparklesIcon },
              ].map((useCase) => {
                const IconComponent = useCase.icon;
                return (
                  <button
                    key={useCase.id}
                    type="button"
                    onClick={() => handleUseCaseChange(useCase.id as UseCase)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-semibold cursor-pointer ${
                      formData.useCase === useCase.id
                        ? getSelectedChipClasses()
                        : 'border-gray-200 dark:border-gray-700 bg-surface-primary text-text-primary hover:border-gray-300 dark:hover:border-gray-600 hover:bg-background-secondary'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{useCase.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Project Context Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <label htmlFor="projectContext" className="block text-xs font-bold uppercase tracking-wide text-text-tertiary mb-4">
              Describe Your Project
            </label>
            <textarea
              id="projectContext"
              value={formData.projectContext}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, projectContext: e.target.value }))
              }
              rows={5}
              placeholder="e.g., A finance app for young professionals. Clean, modern design with blue as the primary color. Needs to feel trustworthy but approachable."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-background-secondary
                       text-text-primary placeholder-text-tertiary
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent
                       transition resize-none text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-text-tertiary">
                💡 What kind of product? Who's it for? What should it feel like?
              </span>
              <span className="text-xs font-medium text-text-tertiary">
                {formData.projectContext.length} / 2000
              </span>
            </div>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-tertiary mb-3">
              Tech Stack <span className="font-normal">(Optional)</span>
            </h3>
            <p className="text-xs text-text-tertiary mb-4">
              Select any that apply — helps AI give better code suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'react', label: 'React' },
                { id: 'nextjs', label: 'Next.js' },
                { id: 'vue', label: 'Vue' },
                { id: 'react-native', label: 'React Native' },
                { id: 'tailwind', label: 'Tailwind CSS' },
                { id: 'shadcn', label: 'Shadcn UI' },
                { id: 'material-ui', label: 'Material UI' },
                { id: 'chakra', label: 'Chakra UI' },
                { id: 'figma', label: 'Figma' },
              ].map((tech) => {
                const isSelected = formData.techStack.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechStackToggle(tech.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? getSelectedChipClasses()
                        : 'border-gray-200 dark:border-gray-700 bg-surface-primary text-text-primary hover:border-gray-300 dark:hover:border-gray-600 hover:bg-background-secondary'
                    }`}
                  >
                    {tech.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Specific Task Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <label htmlFor="specificTask" className="block text-xs font-bold uppercase tracking-wide text-text-tertiary mb-4">
              What You're Designing <span className="text-text-tertiary">(Optional)</span>
            </label>
            <textarea
              id="specificTask"
              value={formData.specificTask}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, specificTask: e.target.value }))
              }
              rows={3}
              placeholder="Describe what you're working on right now... e.g., a dashboard, landing page, mobile app interface..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-background-secondary
                       text-text-primary placeholder-text-tertiary
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent
                       transition resize-none text-sm leading-relaxed"
            />
          </motion.div>

          {/* Design System Details (Collapsible) */}
          <motion.details
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
          >
            <summary className="p-6 cursor-pointer font-semibold text-sm text-text-primary hover:text-accent-primary transition-colors list-none flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PaintBrushIcon className="w-5 h-5" />
                <span>Add design system details</span>
              </span>
              <span className="text-text-tertiary group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="px-6 pb-6 space-y-3">
              <input
                type="text"
                value={formData.designSystem.primaryColor || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    designSystem: { ...prev.designSystem, primaryColor: e.target.value },
                  }))
                }
                placeholder="Primary Color (e.g., #3B82F6)"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-background-secondary
                         text-text-primary placeholder-text-tertiary
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent
                         transition text-sm"
              />
              <input
                type="text"
                value={formData.designSystem.fontFamily || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    designSystem: { ...prev.designSystem, fontFamily: e.target.value },
                  }))
                }
                placeholder="Font Family (e.g., Inter, Roboto)"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-background-secondary
                         text-text-primary placeholder-text-tertiary
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent
                         transition text-sm"
              />
              <input
                type="text"
                value={formData.designSystem.componentLibrary || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    designSystem: { ...prev.designSystem, componentLibrary: e.target.value },
                  }))
                }
                placeholder="Component Library (e.g., Tailwind CSS, Material-UI)"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-background-secondary
                         text-text-primary placeholder-text-tertiary
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent
                         transition text-sm"
              />
            </div>
          </motion.details>

          {/* Templates (Collapsible) */}
          <motion.details
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
          >
            <summary className="p-6 cursor-pointer font-semibold text-sm text-text-primary hover:text-accent-primary transition-colors list-none flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RectangleStackIcon className="w-5 h-5" />
                <span>Browse 8 quick-start templates</span>
              </span>
              <span className="text-text-tertiary group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="px-6 pb-6">
              <PromptTemplates onSelectTemplate={handleTemplateSelect} />
            </div>
          </motion.details>
        </div>

        {/* Right Panel: Preview - 60% width */}
        <div className="lg:w-[60%]">
          <div className="lg:sticky lg:top-24 h-[700px]">
            <PromptPreview
              prompt={generatedPrompt}
              onDownload={handleDownload}
              onGenerate={handleGenerate}
              onReset={handleReset}
              isGenerating={isGenerating}
              hasGenerated={hasGenerated}
              formChanged={formChanged}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
