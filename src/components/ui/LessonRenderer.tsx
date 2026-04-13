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
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
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
import { getPreviewComponent } from '@/components/guides/chat-previews';
import { slugifyHeading } from '@/lib/guides/headings';

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
    return <CodeBracketIcon className={iconClass} />;
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
    case 'tip':
      return <LightBulbIcon className={iconClass} />;
    default:
      return null;
  }
};

/** Default icon for each callout type when section.icon isn't explicitly set.
 *  Keeps the visual rhythm consistent — every callout gets an icon tile. */
const getDefaultCalloutIcon = (
  calloutType: 'info' | 'warning' | 'success' | 'error' | 'tip'
): IconType => {
  switch (calloutType) {
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'tip':
      return 'tip';
    case 'info':
    default:
      return 'info';
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

/**
 * Copy-to-clipboard button used by `code` sections.
 * Owns its own `copied` state so each code block confirms its own click,
 * and falls back to `document.execCommand('copy')` when the async Clipboard
 * API is unavailable (insecure context, permissions, older browsers).
 */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let ok = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        ok = true;
      } else if (typeof document !== 'undefined') {
        // Legacy fallback — works on http:// dev servers without HTTPS
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        ok = document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('[CopyButton] copy failed:', err);
      ok = false;
    }
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all border bg-gray-800/90 dark:bg-gray-700/90 text-white border-gray-700 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700"
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5" aria-hidden="true" />
          Copied
        </>
      ) : (
        'Copy'
      )}
    </button>
  );
}

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

/**
 * Build an index → slug-id map for every heading in the sections list so
 * the lesson page anchor links (right-sidebar TOC) hit the same ids the
 * renderer emits. Disambiguates duplicate headings within a lesson.
 */
function buildHeadingIdMap(sections: LessonSection[]): Map<number, string> {
  const map = new Map<number, string>();
  const seen = new Map<string, number>();
  sections.forEach((section, idx) => {
    if (section.type !== 'heading') return;
    const base = slugifyHeading(section.content);
    if (!base) return;
    const count = seen.get(base) || 0;
    const id = count === 0 ? base : `${base}-${count + 1}`;
    seen.set(base, count + 1);
    map.set(idx, id);
  });
  return map;
}

/**
 * Render a `text` section's raw string into structured paragraphs and lists.
 *
 * Lesson `text` content is authored as a single string with `\n\n` between
 * blocks and `•` / `-` / `*` / `1.` prefixes for list items. Without parsing,
 * those characters appear inline as plain text and the lesson reads as a wall
 * of text. This helper:
 *   - Splits on blank lines into blocks
 *   - Detects bulleted and numbered lists (with optional intro line)
 *   - Coalesces consecutive same-type list blocks into a single list
 *   - Falls back to a paragraph with `whitespace-pre-line` so single newlines
 *     still render as soft breaks for definition-style lines.
 */
const BULLET_RE = /^[•\-*]\s+/;
const NUMBER_RE = /^\d+[.)]\s+/;

type TextBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; intro?: string; items: string[] }
  | { kind: 'ol'; intro?: string; items: string[] };

function classifyTextBlocks(content: string): TextBlock[] {
  const rawBlocks = content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const classified: TextBlock[] = rawBlocks.map((block) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const bulletStart = lines.findIndex((l) => BULLET_RE.test(l));
    if (
      bulletStart >= 0 &&
      lines.slice(bulletStart).every((l) => BULLET_RE.test(l))
    ) {
      return {
        kind: 'ul',
        intro:
          bulletStart > 0
            ? lines.slice(0, bulletStart).join(' ')
            : undefined,
        items: lines.slice(bulletStart).map((l) => l.replace(BULLET_RE, '')),
      };
    }

    const numberStart = lines.findIndex((l) => NUMBER_RE.test(l));
    if (
      numberStart >= 0 &&
      lines.slice(numberStart).every((l) => NUMBER_RE.test(l))
    ) {
      return {
        kind: 'ol',
        intro:
          numberStart > 0
            ? lines.slice(0, numberStart).join(' ')
            : undefined,
        items: lines.slice(numberStart).map((l) => l.replace(NUMBER_RE, '')),
      };
    }

    return { kind: 'p', text: block };
  });

  // Coalesce adjacent same-kind list blocks (only when the next block has no
  // intro of its own — that would imply a fresh logical list).
  const merged: TextBlock[] = [];
  for (const block of classified) {
    const last = merged[merged.length - 1];
    if (
      last &&
      (block.kind === 'ul' || block.kind === 'ol') &&
      last.kind === block.kind &&
      !block.intro
    ) {
      last.items.push(...block.items);
    } else {
      merged.push(block);
    }
  }
  return merged;
}

function renderRichText(content: string, indexKey: number): React.ReactNode {
  const blocks = classifyTextBlocks(content);
  return (
    <React.Fragment key={indexKey}>
      {blocks.map((block, i) => {
        const key = `${indexKey}-${i}`;
        if (block.kind === 'p') {
          return (
            <p
              key={key}
              className="mb-4 text-text-secondary leading-relaxed text-base whitespace-pre-line"
            >
              {block.text}
            </p>
          );
        }
        const ListTag = block.kind === 'ul' ? 'ul' : 'ol';
        const listClass =
          block.kind === 'ul'
            ? 'mb-6 ml-6 text-text-secondary list-disc space-y-2'
            : 'mb-6 ml-6 text-text-secondary list-decimal space-y-2';
        return (
          <div key={key} className="mb-4">
            {block.intro && (
              <p className="mb-3 text-text-secondary leading-relaxed text-base">
                {block.intro}
              </p>
            )}
            <ListTag className={listClass}>
              {block.items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ListTag>
          </div>
        );
      })}
    </React.Fragment>
  );
}

const renderSection = (
  section: LessonSection,
  index: number,
  headingIds: Map<number, string>
) => {
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

    case 'heading': {
      const id = headingIds.get(index);
      if (section.level === 'h2') {
        const icon = getHeadingIcon(section.content);
        return (
          <h2
            key={index}
            id={id}
            className="scroll-mt-24 text-[1.75rem] font-bold text-gray-900 dark:text-gray-100 mt-0 mb-6 flex justify-between items-center gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700"
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
            id={id}
            className="scroll-mt-24 text-[1.375rem] font-bold text-gray-900 dark:text-gray-100 mt-10 mb-5"
          >
            {section.content}
          </h3>
        );
      }
      if (section.level === 'h4') {
        return (
          <h4
            key={index}
            id={id}
            className="scroll-mt-24 text-[1.125rem] font-semibold text-text-secondary mt-8 mb-4"
          >
            {section.content}
          </h4>
        );
      }
      return null;
    }

    case 'text':
      return renderRichText(section.content, index);

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

    case 'callout': {
      // Neutral brand card — same shell across all callout types. A relevant
      // icon (auto-picked from calloutType when not overridden) sits in a
      // tinted tile to give scannable type cues without colored backgrounds.
      const iconType =
        section.icon && section.icon !== 'none'
          ? section.icon
          : getDefaultCalloutIcon(section.calloutType);
      return (
        <div
          key={index}
          className="mb-6 p-5 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-primary"
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background-primary border border-gray-200 dark:border-gray-700 text-text-primary flex-shrink-0">
              {getIcon(iconType)}
            </div>
            <div className="flex-1 min-w-0">
              {section.title && (
                <strong className="block mb-2 text-text-primary text-base">
                  {section.title}
                </strong>
              )}
              <div className="text-text-secondary">
                {renderRichText(section.content, index)}
              </div>
            </div>
          </div>
        </div>
      );
    }

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

    case 'table':
      // Definition-list rendered as a 2-col grid: label on the left,
      // description on the right. Stacks single-column on mobile.
      // Bordered container + row dividers gives the table feel without
      // forcing a real <table> element (better responsive behavior).
      return (
        <dl
          key={index}
          className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700"
        >
          {section.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[minmax(180px,2fr)_minmax(0,3fr)] gap-2 md:gap-6 px-5 py-4"
            >
              <dt className="font-semibold text-text-primary text-base">
                {row.label}
              </dt>
              <dd className="m-0 text-text-secondary leading-relaxed">
                {row.content}
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'further-reading':
      // Bordered container with a header row + clickable resource cards
      // (one per link). External-link affordance and `target="_blank"` so
      // readers don't lose their place in the lesson.
      return (
        <div
          key={index}
          className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-primary overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background-primary border border-gray-200 dark:border-gray-700 text-text-primary flex-shrink-0">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <strong className="text-text-primary text-base">
              {section.title || 'Further reading'}
            </strong>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {section.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 px-5 py-4 hover:bg-background-primary transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm md:text-base font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                        {link.title}
                      </span>
                      {link.source && (
                        <span className="text-xs text-text-secondary">
                          · {link.source}
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="m-0 mt-1 text-sm text-text-secondary leading-relaxed">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <ArrowTopRightOnSquareIcon
                    className="w-4 h-4 mt-1 text-text-secondary group-hover:text-accent-primary flex-shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
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
            <CopyButton code={section.code} />
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
  const headingIds = buildHeadingIdMap(sections);
  return (
    <div className="space-y-6">
      {sections.map((section, index) => renderSection(section, index, headingIds))}
    </div>
  );
}
