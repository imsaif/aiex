import React from 'react';
import {
  KeyIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  BeakerIcon,
  StarIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  FolderIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

/**
 * Icon mapping for lesson types
 * Returns Heroicons outline icon component based on lesson title or iconType
 */

interface IconProps {
  className?: string;
}

/**
 * Get appropriate icon based on lesson title or iconType
 */
export function getLessonIcon(title: string, iconType?: string): React.ReactNode {
  const lowerTitle = title.toLowerCase();

  if (iconType) {
    return getIconByType(iconType);
  }

  // Determine icon based on lesson title keywords (order matters - more specific first)
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('issue') || lowerTitle.includes('problem') || lowerTitle.includes('error')) {
    return <ExclamationCircleIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('folder') || lowerTitle.includes('directory') || lowerTitle.includes('project folder')) {
    return <FolderIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('see') || lowerTitle.includes('view') || lowerTitle.includes('live') || lowerTitle.includes('preview')) {
    return <EyeIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('edit') || lowerTitle.includes('back to editing') || lowerTitle.includes('refactor')) {
    return <PencilIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('share') || lowerTitle.includes('handing off') || lowerTitle.includes('hand off')) {
    return <ShareIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('describe') || lowerTitle.includes('chat') || lowerTitle.includes('prompt')) {
    return <ChatBubbleLeftIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('iterate') || lowerTitle.includes('iteration') || lowerTitle.includes('feedback')) {
    return <ArrowPathIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('api') || lowerTitle.includes('key') || lowerTitle.includes('anthropic')) {
    return <KeyIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('install') || lowerTitle.includes('setup node') || lowerTitle.includes('npm install') || lowerTitle.includes('download')) {
    return <ArrowDownTrayIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('configure') || lowerTitle.includes('config') || lowerTitle.includes('initialize') || lowerTitle.includes('settings')) {
    return <Cog6ToothIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('generate') || lowerTitle.includes('first prototype')) {
    return <LightBulbIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('github') || lowerTitle.includes('repository') || lowerTitle.includes('git') || lowerTitle.includes('branch') || lowerTitle.includes('commit') || lowerTitle.includes('push') || lowerTitle.includes('version') || lowerTitle.includes('connect')) {
    return <CodeBracketSquareIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('test') || lowerTitle.includes('testing') || lowerTitle.includes('debug')) {
    return <BeakerIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('best practice') || lowerTitle.includes('practice') || lowerTitle.includes('pattern') || lowerTitle.includes('strategy') || lowerTitle.includes('workflow')) {
    return <StarIcon className="w-6 h-6" />;
  }
  if (lowerTitle.includes('development') || lowerTitle.includes('dev') || lowerTitle.includes('server') || lowerTitle.includes('code') || lowerTitle.includes('interface') || lowerTitle.includes('navigate')) {
    return <CodeBracketIcon className="w-6 h-6" />;
  }

  // Default icon
  return <CodeBracketIcon className="w-6 h-6" />;
}

/**
 * Get icon by explicit type
 */
function getIconByType(iconType: string): React.ReactNode {
  switch (iconType) {
    case 'key':
      return <KeyIcon className="w-6 h-6" />;
    case 'download':
      return <ArrowDownTrayIcon className="w-6 h-6" />;
    case 'settings':
      return <Cog6ToothIcon className="w-6 h-6" />;
    case 'code':
      return <CodeBracketIcon className="w-6 h-6" />;
    case 'git':
      return <CodeBracketSquareIcon className="w-6 h-6" />;
    case 'test':
      return <BeakerIcon className="w-6 h-6" />;
    case 'star':
      return <StarIcon className="w-6 h-6" />;
    case 'alert':
      return <ExclamationCircleIcon className="w-6 h-6" />;
    case 'lightbulb':
      return <LightBulbIcon className="w-6 h-6" />;
    case 'folder':
      return <FolderIcon className="w-6 h-6" />;
    case 'eye':
      return <EyeIcon className="w-6 h-6" />;
    case 'pencil':
      return <PencilIcon className="w-6 h-6" />;
    case 'share':
      return <ShareIcon className="w-6 h-6" />;
    case 'chat':
      return <ChatBubbleLeftIcon className="w-6 h-6" />;
    case 'refresh':
      return <ArrowPathIcon className="w-6 h-6" />;
    default:
      return <CodeBracketIcon className="w-6 h-6" />;
  }
}
