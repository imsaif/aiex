'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { GuideFilter as GuideFilterType } from '@/types';
import { getAllTools, getAllSkillLevels } from '@/data/guides';

interface GuideFilterProps {
  onFilterChange: (filter: GuideFilterType) => void;
  selectedTool?: string;
  selectedSkillLevel?: string;
}

export default function GuideFilter({
  onFilterChange,
  selectedTool,
  selectedSkillLevel,
}: GuideFilterProps) {
  const tools = useMemo(() => getAllTools(), []);
  const skillLevels = useMemo(() => getAllSkillLevels(), []);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolChange = (tool: string) => {
    onFilterChange({
      tool: tool === 'all' ? undefined : (tool as any),
      skillLevel: selectedSkillLevel as any,
    });
    setOpenDropdown(null);
  };

  const handleSkillLevelChange = (level: string) => {
    onFilterChange({
      tool: selectedTool as any,
      skillLevel: level === 'all' ? undefined : (level as any),
    });
    setOpenDropdown(null);
  };

  return (
    <div ref={dropdownRef} className="space-y-4">
      {/* Tool Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'tool' ? null : 'tool')}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-border-primary
                   bg-gray-100 dark:bg-gray-800 text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700
                   transition-colors text-sm font-medium"
        >
          <span>{selectedTool ? `Tool: ${selectedTool}` : 'All Tools'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform ${openDropdown === 'tool' ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
          </svg>
        </button>

        {openDropdown === 'tool' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-border-primary
                        rounded-lg shadow-lg z-50">
            <button
              onClick={() => handleToolChange('all')}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                         ${selectedTool ? 'text-text-secondary hover:bg-accent-subtle' : 'bg-accent-subtle text-accent-primary font-medium'}`}
            >
              All Tools
            </button>
            {tools.map((tool) => (
              <button
                key={tool}
                onClick={() => handleToolChange(tool)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                           ${selectedTool === tool ? 'bg-accent-subtle text-accent-primary font-medium' : 'text-text-secondary hover:bg-accent-subtle'}`}
              >
                {tool}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skill Level Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-border-primary
                   bg-gray-100 dark:bg-gray-800 text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700
                   transition-colors text-sm font-medium"
        >
          <span>{selectedSkillLevel ? `Level: ${selectedSkillLevel}` : 'All Levels'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
          </svg>
        </button>

        {openDropdown === 'level' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-border-primary
                        rounded-lg shadow-lg z-50">
            <button
              onClick={() => handleSkillLevelChange('all')}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                         ${selectedSkillLevel ? 'text-text-secondary hover:bg-accent-subtle' : 'bg-accent-subtle text-accent-primary font-medium'}`}
            >
              All Levels
            </button>
            {skillLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleSkillLevelChange(level)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                           ${selectedSkillLevel === level ? 'bg-accent-subtle text-accent-primary font-medium' : 'text-text-secondary hover:bg-accent-subtle'}`}
              >
                {level}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
