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
  LockClosedIcon,
  UserIcon,
  KeyIcon,
  CommandLineIcon,
  CodeBracketIcon,
  DocumentIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  LessonSection,
  IconType,
} from '@/types/lesson';
import { DynamicPreview } from '@/components/guides/DynamicPreview';
import { slugifyHeading } from '@/lib/guides/headings';
import { patterns } from '@/data/patterns';

// Pattern auto-linking. Lessons mention pattern names ("Confidence
// Visualization", "Trust Calibration") in prose; wrap the first mention
// of each pattern per text block in a Link to /patterns/<slug> so lessons
// fund the pattern pages with internal-link equity. Longer titles are
// matched first to avoid e.g. "Confidence" greedily eating "Confidence
// Visualization".
const PATTERN_TITLES = patterns
  .map((p) => ({ slug: p.slug, title: p.title }))
  .sort((a, b) => b.title.length - a.title.length);

const PATTERN_RE = new RegExp(
  `\\b(${PATTERN_TITLES.map((p) =>
    p.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|')})\\b`,
  'g'
);

function linkifyPatterns(
  text: string,
  keyPrefix: string,
  linked?: Set<string>
): React.ReactNode {
  if (!text) return text;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  PATTERN_RE.lastIndex = 0;
  while ((match = PATTERN_RE.exec(text)) !== null) {
    const matched = match[0];
    const found = PATTERN_TITLES.find((p) => p.title === matched);
    if (!found) continue;
    if (linked && linked.has(found.slug)) continue; // skip duplicates
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    parts.push(
      <Link
        key={`${keyPrefix}-pl-${n++}`}
        href={`/patterns/${found.slug}`}
        className="text-accent-primary hover:underline"
      >
        {matched}
      </Link>
    );
    if (linked) linked.add(found.slug);
    lastIdx = match.index + matched.length;
  }
  if (parts.length === 0) return text;
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

interface LessonRendererProps {
  sections: LessonSection[];
}

// Restrained "outline" shell for the few blocks that are genuinely set apart
// from the reading flow (tables, callouts, steps, further-reading). No shadow —
// a soft-but-visible border + card radius. Elevation is reserved, not sprayed
// across the page, so nothing reads as a floating card. Everything else (body
// text, headings) flows on the page; hierarchy comes from type + spacing.
const CARD_SHELL =
  'bg-surface-elevated border border-border-secondary rounded-card';

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
          <DynamicPreview previewId={section.previewId} />
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
  // Track patterns linked across this section so we don't repeat-link the
  // same pattern name in every paragraph.
  const linked = new Set<string>();
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
              {linkifyPatterns(block.text, key, linked)}
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
                {linkifyPatterns(block.intro, `${key}-intro`, linked)}
              </p>
            )}
            <ListTag className={listClass}>
              {block.items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  {linkifyPatterns(item, `${key}-li-${j}`, linked)}
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
          className={`flex gap-4 mb-10 p-5 md:p-6 ${CARD_SHELL}`}
        >
          {section.icon && section.icon !== 'none' && (
            <div className="text-text-secondary flex-shrink-0">{getIcon(section.icon)}</div>
          )}
          <p className="m-0 text-text-secondary">
            {linkifyPatterns(section.content, `intro-${index}`)}
          </p>
        </div>
      );

    case 'heading': {
      const id = headingIds.get(index);
      if (section.level === 'h2') {
        return (
          <h2
            key={index}
            id={id}
            className="scroll-mt-24 text-[1.75rem] font-bold text-text-primary mt-14 mb-5 pb-3 border-b border-border-primary"
          >
            {section.content}
          </h2>
        );
      }
      if (section.level === 'h3') {
        return (
          <h3
            key={index}
            id={id}
            className="scroll-mt-24 text-[1.375rem] font-bold text-text-primary mt-10 mb-4"
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
          className={`mb-6 p-5 md:p-6 ${CARD_SHELL}`}
        >
          <div className="flex items-start gap-4">
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background-secondary border border-border-primary text-text-primary flex-shrink-0"
            >
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
              className={`p-5 ${CARD_SHELL}`}
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
          className={`mb-8 overflow-hidden ${CARD_SHELL} divide-y divide-border-primary`}
        >
          {section.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[minmax(180px,2fr)_minmax(0,3fr)]"
            >
              <dt className="bg-background-secondary px-5 py-4 font-semibold text-text-primary text-base border-b md:border-b-0 md:border-r border-border-primary">
                {row.label}
              </dt>
              <dd className="m-0 px-5 py-4 text-text-secondary leading-relaxed">
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
          className={`mb-8 ${CARD_SHELL} overflow-hidden`}
        >
          <div className="px-5 py-4 border-b border-border-primary bg-background-secondary">
            <strong className="text-text-primary text-base">
              {section.title || 'Further reading'}
            </strong>
          </div>
          <ul className="divide-y divide-border-primary">
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

    case 'image': {
      // Detect video sources by extension so a single `image` section can
      // carry a looped screen recording without introducing a new section type.
      // Keeps the schema additive and preserves the `alt` / `label` contract.
      const isVideo = !!section.src && /\.(mp4|webm|mov)$/i.test(section.src);
      return (
        <div key={index} className="mb-8">
          {section.src ? (
            <figure className="m-0">
              {isVideo ? (
                <video
                  src={section.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={section.alt}
                  className="w-full rounded-card border border-border-secondary"
                />
              ) : (
                <img
                  src={section.src}
                  alt={section.alt}
                  width={800}
                  height={450}
                  className="w-full rounded-card border border-border-secondary"
                />
              )}
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
    }

    case 'completion':
      return (
        <div
          key={index}
          className="mt-14 p-6 bg-background-secondary border border-border-secondary rounded-card"
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
  // No wrapper rhythm — each section carries its own margins (a larger gap
  // before an h2, tighter within a group) so content visually groups under
  // its heading.
  return (
    <div>
      {sections.map((section, index) =>
        renderSection(section, index, headingIds)
      )}
    </div>
  );
}
