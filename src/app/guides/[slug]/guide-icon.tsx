'use client';

import { Claude, Cursor, Github, Replit, V0, Copilot } from '@lobehub/icons';

interface GuideIconProps {
  tool?: string;
}

export default function GuideIcon({ tool }: GuideIconProps) {
  const iconProps = { size: 24 };

  switch (tool?.toLowerCase()) {
    case 'claude code':
      return <div className="text-category-orange"><Claude {...iconProps} /></div>;
    case 'cursor':
      return <div className="text-gray-900 dark:text-gray-100"><Cursor {...iconProps} /></div>;
    case 'github':
      return <div className="text-gray-900 dark:text-gray-100"><Github {...iconProps} /></div>;
    case 'github copilot':
      return <Copilot.Color {...iconProps} />;
    case 'replit ai':
    case 'replit':
      return <div className="text-category-orange"><Replit {...iconProps} /></div>;
    case 'v0 by vercel':
    case 'v0':
      return <div className="text-gray-900 dark:text-gray-100"><V0 {...iconProps} /></div>;
    default:
      return null;
  }
}
