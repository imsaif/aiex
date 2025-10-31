'use client';

import React from 'react';
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
} from '@heroicons/react/24/outline';
import {
  LessonSection,
  IconType,
} from '@/types/lesson';
import {
  Github,
} from '@lobehub/icons'; // For GitHub logo icon

interface LessonRendererProps {
  sections: LessonSection[];
}

const getHeadingIcon = (headingText: string) => {
  const iconProps = { className: 'w-7 h-7', style: { color: '#3b82f6' } };

  if (headingText.includes('Setup')) {
    return <Cog6ToothIcon {...iconProps} />;
  } else if (headingText.includes('Prototype')) {
    return <LightBulbIcon {...iconProps} />;
  } else if (headingText.includes('GitHub') || headingText.includes('Git')) {
    return <Github size={28} style={{ color: '#3b82f6' }} />;
  } else if (headingText.includes('Best Practices') || headingText.includes('Practices')) {
    return <StarIcon {...iconProps} />;
  }
  return null;
};

const getIcon = (iconType: IconType) => {
  const iconProps = { className: 'w-6 h-6' };
  switch (iconType) {
    case 'info':
      return <InformationCircleIcon {...iconProps} />;
    case 'warning':
      return <ExclamationTriangleIcon {...iconProps} />;
    case 'success':
      return <CheckCircleIcon {...iconProps} />;
    case 'error':
      return <XCircleIcon {...iconProps} />;
    case 'check':
      return <CheckIcon {...iconProps} />;
    case 'monitor':
      return <ComputerDesktopIcon {...iconProps} />;
    case 'download':
      return <ArrowDownTrayIcon {...iconProps} />;
    case 'lock':
      return <LockClosedIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'key':
      return <KeyIcon {...iconProps} />;
    case 'terminal':
      return <CommandLineIcon {...iconProps} />;
    case 'code':
      return <CodeBracketIcon {...iconProps} />;
    case 'github':
      return <DocumentIcon {...iconProps} />;
    case 'image':
      return <DocumentIcon {...iconProps} />;
    case 'cog':
      return <Cog6ToothIcon {...iconProps} />;
    default:
      return null;
  }
};

const getCalloutStyles = (calloutType: 'info' | 'warning' | 'success' | 'error' | 'tip') => {
  const baseStyle = 'p-4 rounded-lg border-l-4 margin-bottom: 1.5rem;';
  switch (calloutType) {
    case 'info':
      return baseStyle + ' background-color: #eff6ff; border-left-color: #3b82f6; color: #374151;';
    case 'warning':
      return baseStyle + ' background-color: #fef3c7; border-left-color: #f59e0b; color: #374151;';
    case 'success':
      return baseStyle + ' background-color: #f0fdf4; border-left-color: #16a34a; color: #374151;';
    case 'error':
      return baseStyle + ' background-color: #fef2f2; border-left-color: #dc2626; color: #374151;';
    case 'tip':
      return baseStyle + ' background-color: #f5f3ff; border-left-color: #a78bfa; color: #374151;';
    default:
      return baseStyle;
  }
};

const renderSection = (section: LessonSection, index: number) => {
  switch (section.type) {
    case 'intro':
      return (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0.5rem',
          }}
        >
          {section.icon && section.icon !== 'none' && (
            <div style={{ color: '#3b82f6', flexShrink: 0 }}>{getIcon(section.icon)}</div>
          )}
          <p style={{ margin: 0, color: '#374151' }}>{section.content}</p>
        </div>
      );

    case 'heading':
      const headingStyles = {
        h2: {
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#111827',
          marginTop: section.level === 'h2' ? 0 : '2.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb',
        },
        h3: {
          fontSize: '1.375rem',
          fontWeight: 700,
          color: '#111827',
          marginTop: '2.5rem',
          marginBottom: '1.25rem',
        },
        h4: {
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#374151',
          marginTop: '2rem',
          marginBottom: '1rem',
        },
      };
      const HeadingTag = section.level as keyof JSX.IntrinsicElements;

      // For h2, add icon on the right
      if (section.level === 'h2') {
        const icon = getHeadingIcon(section.content);
        return (
          <HeadingTag key={index} style={headingStyles[section.level] as React.CSSProperties}>
            <span>{section.content}</span>
            {icon && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</div>}
          </HeadingTag>
        );
      }

      return (
        <HeadingTag key={index} style={headingStyles[section.level] as React.CSSProperties}>
          {section.content}
        </HeadingTag>
      );

    case 'text':
      return (
        <p key={index} style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6', fontSize: '1rem' }}>
          {section.content}
        </p>
      );

    case 'list':
      return (
        <ul
          key={index}
          style={{
            margin: '0 0 1.5rem 1.5rem',
            padding: 0,
            color: '#374151',
          }}
        >
          {section.items.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>
              {item}
            </li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div key={index} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          {section.icon && section.icon !== 'none' && (
            <div
              style={{
                flexShrink: 0,
                color:
                  section.calloutType === 'warning'
                    ? '#f59e0b'
                    : section.calloutType === 'error'
                      ? '#dc2626'
                      : section.calloutType === 'success'
                        ? '#16a34a'
                        : '#3b82f6',
              }}
            >
              {getIcon(section.icon)}
            </div>
          )}
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor:
                section.calloutType === 'warning'
                  ? '#fef3c7'
                  : section.calloutType === 'error'
                    ? '#fef2f2'
                    : section.calloutType === 'success'
                      ? '#f0fdf4'
                      : '#eff6ff',
              borderLeft: `4px solid ${
                section.calloutType === 'warning'
                  ? '#f59e0b'
                  : section.calloutType === 'error'
                    ? '#dc2626'
                    : section.calloutType === 'success'
                      ? '#16a34a'
                      : '#3b82f6'
              }`,
              color: '#374151',
            }}
          >
            {section.title && <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{section.title}</strong>}
            <div>{section.content}</div>
          </div>
        </div>
      );

    case 'steps':
      return (
        <div key={index} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {section.steps.map((step) => (
            <div
              key={step.number}
              style={{
                padding: '1.25rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </div>
                <h4 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>
                  {step.title}
                </h4>
              </div>
              {typeof step.content === 'string' ? (
                <p style={{ margin: 0, color: '#374151' }}>{step.content}</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                  {step.content.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>
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
        <div key={index} style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              backgroundColor: '#111827',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '0',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {section.label || section.language || 'code'}
            </span>
          </div>
          <div
            style={{
              position: 'relative',
              borderRadius: '0 0 0.5rem 0.5rem',
            }}
          >
            <pre
              style={{
                backgroundColor: 'white',
                color: '#111827',
                padding: '1rem',
                margin: 0,
                borderRadius: '0 0 0.5rem 0.5rem',
                border: '1px solid #e5e7eb',
                borderTop: 'none',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              <code>{section.code}</code>
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(section.code);
              }}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(17, 24, 39, 0.5)',
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(17, 24, 39, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(17, 24, 39, 0.8)';
              }}
            >
              Copy
            </button>
          </div>
        </div>
      );

    case 'image':
      return (
        <div key={index} style={{ marginBottom: '2rem' }}>
          {section.src ? (
            <figure style={{ margin: 0 }}>
              <img
                src={section.src}
                alt={section.alt}
                style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
              />
              {section.label && (
                <figcaption style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {section.label}
                </figcaption>
              )}
            </figure>
          ) : (
            <div
              style={{
                borderRadius: '0.5rem',
                border: '2px dashed #d1d5db',
                backgroundColor: '#f9fafb',
                padding: '3rem',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>{getIcon('image')}</div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563', fontWeight: 600 }}>
                {section.label || 'Image coming soon'}
              </p>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>Add image here</p>
            </div>
          )}
        </div>
      );

    case 'completion':
      return (
        <div
          key={index}
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a', flexShrink: 0 }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              {section.title}
            </h3>
          </div>
          <ul style={{ margin: '0 0 1rem 0', padding: 0, listStyle: 'none', color: '#374151' }}>
            {section.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <CheckIcon style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a', flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
          <p style={{ margin: 0, color: '#374151', fontWeight: 600 }}>{section.message}</p>
        </div>
      );

    default:
      return null;
  }
};

export default function LessonRenderer({ sections }: LessonRendererProps) {
  return <div className="space-y-6">{sections.map((section, index) => renderSection(section, index))}</div>;
}
