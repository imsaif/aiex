'use client';

import React, { useState } from 'react';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  ComputerDesktopIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  UserIcon,
  KeyIcon,
  CommandLineIcon,
  CodeBracketIcon,
  DocumentIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  StarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  LessonSection,
  IconType,
} from '@/types/lesson';
import {
  Github,
} from '@lobehub/icons'; // For GitHub logo icon
import { getPreviewComponent } from '@/components/guides/chat-previews';

interface LessonRendererProps {
  sections: LessonSection[];
}

const getHeadingIcon = (headingText: string) => {
  const iconClass = 'w-7 h-7 text-gray-600 dark:text-gray-400';

  if (headingText.includes('Setup')) {
    return <Cog6ToothIcon className={iconClass} />;
  } else if (headingText.includes('Prototype')) {
    return <LightBulbIcon className={iconClass} />;
  } else if (headingText.includes('GitHub') || headingText.includes('Git')) {
    return <Github size={28} className="text-gray-600 dark:text-gray-400" />;
  } else if (headingText.includes('Best Practices') || headingText.includes('Practices')) {
    return <StarIcon className={iconClass} />;
  }
  return null;
};

const getIcon = (iconType: IconType) => {
  const iconClass = 'w-6 h-6';
  switch (iconType) {
    case 'info':
      return <InformationCircleIcon className={iconClass} />;
    case 'warning':
      return <ExclamationTriangleIcon className={iconClass} />;
    case 'success':
      return <CheckCircleIcon className={iconClass} />;
    case 'error':
      return <XCircleIcon className={iconClass} />;
    case 'check':
      return <CheckIcon className={iconClass} />;
    case 'monitor':
      return <ComputerDesktopIcon className={iconClass} />;
    case 'download':
      return <ArrowDownTrayIcon className={iconClass} />;
    case 'lock':
      return <LockClosedIcon className={iconClass} />;
    case 'user':
      return <UserIcon className={iconClass} />;
    case 'key':
      return <KeyIcon className={iconClass} />;
    case 'terminal':
      return <CommandLineIcon className={iconClass} />;
    case 'code':
      return <CodeBracketIcon className={iconClass} />;
    case 'github':
      return <DocumentIcon className={iconClass} />;
    case 'cog':
      return <Cog6ToothIcon className={iconClass} />;
    default:
      return null;
  }
};

const getCalloutClasses = (calloutType: 'info' | 'warning' | 'success' | 'error' | 'tip') => {
  const baseClasses = 'p-4 rounded-lg border-l-4 mb-6';
  switch (calloutType) {
    case 'info':
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/30 border-l-blue-500 text-text-secondary`;
    case 'warning':
      return `${baseClasses} bg-amber-50 dark:bg-amber-900/30 border-l-amber-500 text-text-secondary`;
    case 'success':
      return `${baseClasses} bg-green-50 dark:bg-green-900/30 border-l-green-500 text-text-secondary`;
    case 'error':
      return `${baseClasses} bg-red-50 dark:bg-red-900/30 border-l-red-500 text-text-secondary`;
    case 'tip':
      return `${baseClasses} bg-purple-50 dark:bg-purple-900/30 border-l-purple-400 text-text-secondary`;
    default:
      return baseClasses;
  }
};

const getCalloutIconColor = (calloutType: 'info' | 'warning' | 'success' | 'error' | 'tip') => {
  switch (calloutType) {
    case 'warning':
      return 'text-amber-500';
    case 'error':
      return 'text-red-500';
    case 'success':
      return 'text-green-500';
    case 'tip':
      return 'text-purple-400';
    default:
      return 'text-blue-500';
  }
};

function CodePreviewBlock({ section }: { section: { code: string; language?: string; label?: string; previewId: string } }) {
  const [showCode, setShowCode] = useState(false);
  const PreviewComponent = getPreviewComponent(section.previewId);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toggle header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {section.label || 'Example'}
        </span>
        <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setShowCode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              !showCode
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <EyeIcon className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              showCode
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CodeBracketIcon className="w-3.5 h-3.5" />
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      {showCode ? (
        <div className="relative">
          <pre className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 m-0 overflow-auto font-mono text-sm max-h-[500px]">
            <code>{section.code}</code>
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(section.code)}
            className="absolute top-3 right-3 bg-gray-800/80 dark:bg-gray-700/80 border border-gray-700 dark:border-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all hover:bg-gray-800 dark:hover:bg-gray-700"
          >
            Copy
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30">
          {PreviewComponent ? (
            <PreviewComponent />
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">Preview not available</div>
          )}
        </div>
      )}
    </div>
  );
}

const renderSection = (section: LessonSection, index: number) => {
  switch (section.type) {
    case 'intro':
      return (
        <div
          key={index}
          className="flex gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-l-gray-500 dark:border-l-gray-400 rounded-lg"
        >
          {section.icon && section.icon !== 'none' && (
            <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">{getIcon(section.icon)}</div>
          )}
          <p className="m-0 text-text-secondary">{section.content}</p>
        </div>
      );

    case 'heading':
      if (section.level === 'h2') {
        const icon = getHeadingIcon(section.content);
        return (
          <h2
            key={index}
            className="text-[1.75rem] font-bold text-gray-900 dark:text-gray-100 mt-0 mb-6 flex justify-between items-center gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700"
          >
            <span>{section.content}</span>
            {icon && <div className="flex-shrink-0 flex items-center">{icon}</div>}
          </h2>
        );
      }
      if (section.level === 'h3') {
        return (
          <h3
            key={index}
            className="text-[1.375rem] font-bold text-gray-900 dark:text-gray-100 mt-10 mb-5"
          >
            {section.content}
          </h3>
        );
      }
      if (section.level === 'h4') {
        return (
          <h4
            key={index}
            className="text-[1.125rem] font-semibold text-text-secondary mt-8 mb-4"
          >
            {section.content}
          </h4>
        );
      }
      return null;

    case 'text':
      return (
        <p key={index} className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed text-base">
          {section.content}
        </p>
      );

    case 'list':
      return (
        <ul
          key={index}
          className="mb-6 ml-6 p-0 text-text-secondary list-disc"
        >
          {section.items.map((item, i) => (
            <li key={i} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div key={index} className="mb-6 flex gap-3">
          {section.icon && section.icon !== 'none' && (
            <div className={`flex-shrink-0 ${getCalloutIconColor(section.calloutType)}`}>
              {getIcon(section.icon)}
            </div>
          )}
          <div className={getCalloutClasses(section.calloutType)}>
            {section.title && <strong className="block mb-2">{section.title}</strong>}
            <div>{section.content}</div>
          </div>
        </div>
      );

    case 'steps':
      return (
        <div key={index} className="grid gap-4 mb-8">
          {section.steps.map((step) => (
            <div
              key={step.number}
              className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm flex-shrink-0">
                  {step.number}
                </div>
                <h4 className="m-0 font-bold text-gray-900 dark:text-gray-100 text-[1.125rem]">
                  {step.title}
                </h4>
              </div>
              {typeof step.content === 'string' ? (
                <p className="m-0 text-text-secondary">{step.content}</p>
              ) : (
                <ul className="m-0 pl-6 text-text-secondary">
                  {step.content.map((item, i) => (
                    <li key={i} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );

    case 'code':
      return (
        <div key={index} className="mb-6">
          <div className="bg-gray-900 dark:bg-gray-950 text-white px-4 py-3 rounded-t-lg">
            <span className="text-sm font-mono">
              {section.label || section.language || 'code'}
            </span>
          </div>
          <div className="relative">
            <pre className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 m-0 rounded-b-lg border border-gray-200 dark:border-gray-700 border-t-0 overflow-auto font-mono text-sm">
              <code>{section.code}</code>
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(section.code);
              }}
              className="absolute top-3 right-3 bg-gray-800/80 dark:bg-gray-700/80 border border-gray-700 dark:border-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all hover:bg-gray-800 dark:hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
        </div>
      );

    case 'code-preview':
      return <CodePreviewBlock key={index} section={section} />;

    case 'image':
      return (
        <div key={index} className="mb-8">
          {section.src ? (
            <figure className="m-0">
              <img
                src={section.src}
                alt={section.alt}
                width={800}
                height={450}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
              {section.label && (
                <figcaption className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                  {section.label}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">{getIcon('github')}</div>
              <p className="m-0 mb-2 text-gray-600 dark:text-gray-400 font-semibold">
                {section.label || 'Image coming soon'}
              </p>
              <p className="m-0 text-gray-400 dark:text-gray-500 text-sm">Add image here</p>
            </div>
          )}
        </div>
      );

    case 'completion':
      return (
        <div
          key={index}
          className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex gap-3 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
            <h3 className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100">
              {section.title}
            </h3>
          </div>
          <ul className="m-0 mb-4 p-0 list-none text-text-secondary">
            {section.items.map((item, i) => (
              <li key={i} className="mb-2 flex gap-2">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="m-0 text-text-secondary font-semibold">{section.message}</p>
        </div>
      );

    default:
      return null;
  }
};

export default function LessonRenderer({ sections }: LessonRendererProps) {
  return <div className="space-y-6">{sections.map((section, index) => renderSection(section, index))}</div>;
}
