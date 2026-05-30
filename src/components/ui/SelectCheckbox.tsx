'use client';

interface SelectCheckboxProps {
  checked: boolean;
  onChange: () => void;
  /** Accessible name, e.g. "Include Error Recovery in handoff". */
  label: string;
  className?: string;
}

/**
 * Minimal token-compliant checkbox for selecting saved items to include in the
 * handoff. Deliberately not based on ChecklistItem.tsx (which uses raw
 * border-gray-* literals the brand validator blocks).
 */
export function SelectCheckbox({ checked, onChange, label, className = '' }: SelectCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className={`h-5 w-5 shrink-0 rounded border border-border-primary accent-accent-primary cursor-pointer ${className}`}
    />
  );
}

export default SelectCheckbox;
