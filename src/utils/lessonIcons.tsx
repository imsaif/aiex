import React from 'react';

/**
 * Icon mapping for lesson types
 * Returns SVG icon component based on lesson title or iconType
 */

interface IconProps {
  className?: string;
}

// Icon components
const KeyIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 2l-2 2m-7.61 7.61a6 6 0 1 1-8.49-8.49 6 6 0 0 1 8.49 8.49z" />
    <line x1="13" y1="16" x2="20" y2="23" />
  </svg>
);

const DownloadIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SettingsIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </svg>
);

const CodeIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitBranchIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const TestTubeIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const StarIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="12 2 15.09 10.26 24 10.27 17.18 16.70 20.27 25 12 19.54 3.73 25 6.82 16.70 0 10.27 8.91 10.26 12 2" />
  </svg>
);

const AlertCircleIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const LightbulbIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 6c0 1.3.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

/**
 * Get appropriate icon based on lesson title or iconType
 */
export function getLessonIcon(title: string, iconType?: string): React.ReactNode {
  const lowerTitle = title.toLowerCase();

  if (iconType) {
    return getIconByType(iconType);
  }

  // Determine icon based on lesson title keywords
  if (lowerTitle.includes('api') || lowerTitle.includes('key') || lowerTitle.includes('anthropic')) {
    return <KeyIcon />;
  }
  if (lowerTitle.includes('install') || lowerTitle.includes('setup node') || lowerTitle.includes('npm install')) {
    return <DownloadIcon />;
  }
  if (lowerTitle.includes('configure') || lowerTitle.includes('config') || lowerTitle.includes('initialize')) {
    return <SettingsIcon />;
  }
  if (lowerTitle.includes('prototype') || lowerTitle.includes('generate') || lowerTitle.includes('create') || lowerTitle.includes('first')) {
    return <LightbulbIcon />;
  }
  if (lowerTitle.includes('github') || lowerTitle.includes('repository') || lowerTitle.includes('git') || lowerTitle.includes('branch') || lowerTitle.includes('commit') || lowerTitle.includes('push')) {
    return <GitBranchIcon />;
  }
  if (lowerTitle.includes('test') || lowerTitle.includes('testing')) {
    return <TestTubeIcon />;
  }
  if (lowerTitle.includes('best practice') || lowerTitle.includes('practice') || lowerTitle.includes('pattern') || lowerTitle.includes('strategy')) {
    return <StarIcon />;
  }
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('issue') || lowerTitle.includes('problem') || lowerTitle.includes('error')) {
    return <AlertCircleIcon />;
  }
  if (lowerTitle.includes('development') || lowerTitle.includes('dev') || lowerTitle.includes('server') || lowerTitle.includes('code')) {
    return <CodeIcon />;
  }

  // Default icon
  return <CodeIcon />;
}

/**
 * Get icon by explicit type
 */
function getIconByType(iconType: string): React.ReactNode {
  switch (iconType) {
    case 'key':
      return <KeyIcon />;
    case 'download':
      return <DownloadIcon />;
    case 'settings':
      return <SettingsIcon />;
    case 'code':
      return <CodeIcon />;
    case 'git':
      return <GitBranchIcon />;
    case 'test':
      return <TestTubeIcon />;
    case 'star':
      return <StarIcon />;
    case 'alert':
      return <AlertCircleIcon />;
    case 'lightbulb':
      return <LightbulbIcon />;
    default:
      return <CodeIcon />;
  }
}
