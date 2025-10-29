'use client';

import { useCallback } from 'react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function ChecklistItem({
  id,
  label,
  checked,
  onChange,
  className = '',
}: ChecklistItemProps) {
  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <label className="flex items-center gap-3 cursor-pointer flex-1 pt-0.5 group">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          className="w-5 h-5 rounded border-2 border-border-primary accent-accent-primary cursor-pointer
                   group-hover:border-border-secondary transition-colors"
        />
        <span
          className={`text-sm leading-relaxed transition-all ${
            checked
              ? 'text-text-secondary line-through opacity-60'
              : 'text-text-primary group-hover:text-accent-primary'
          }`}
        >
          {label}
        </span>
      </label>
    </div>
  );
}
