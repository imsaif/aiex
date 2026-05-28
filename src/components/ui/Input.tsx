'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label rendered above the input. */
  label?: string;
  /** Helper text rendered below the input. Replaced by `error` when set. */
  description?: string;
  /** Error message — switches the input into error state. */
  error?: string;
  /** Icon rendered on the left of the input. */
  leadingIcon?: ReactNode;
  /** Icon (or button) rendered on the right. */
  trailingIcon?: ReactNode;
  /** Visual size — `sm` for dense, `md` for default, `lg` for hero forms. */
  size?: InputSize;
}

const SIZE_CLASSES: Record<InputSize, { input: string; pl: string; pr: string }> = {
  sm: { input: 'type-caption py-tight px-snug', pl: 'pl-roomy', pr: 'pr-roomy' },
  md: { input: 'type-body py-snug px-default', pl: 'pl-roomy', pr: 'pr-roomy' },
  lg: { input: 'type-body py-default px-default', pl: 'pl-roomy', pr: 'pr-roomy' },
};

/**
 * Shared Input primitive — uses the design-system tokens: rounded-input
 * for the corner, --ring-focus for the focus ring, --border-error for the
 * error state. Includes accessible label association and an error/description
 * helper-text region that uses aria-describedby.
 *
 * Usage:
 *   <Input
 *     label="Work email"
 *     type="email"
 *     placeholder="you@company.com"
 *     description="We'll send the report here."
 *     error={emailError}
 *   />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    error,
    leadingIcon,
    trailingIcon,
    size = 'md',
    id: idProp,
    className = '',
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const id = idProp || generatedId;
  const helperId = `${id}-helper`;
  const hasHelper = !!error || !!description;
  const sizeCfg = SIZE_CLASSES[size];

  return (
    <div className="space-y-tight">
      {label && (
        <label htmlFor={id} className="type-caption font-semibold text-text-primary block">
          {label}
        </label>
      )}

      <div className="relative">
        {leadingIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-snug text-text-tertiary pointer-events-none">
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasHelper ? helperId : undefined}
          className={`
            w-full rounded-input bg-surface-primary text-text-primary placeholder:text-text-tertiary
            border ${error ? 'border-error' : 'border-border-primary'}
            ${sizeCfg.input}
            ${leadingIcon ? sizeCfg.pl : ''}
            ${trailingIcon ? sizeCfg.pr : ''}
            focus:outline-none focus:ring-2 ${error ? 'focus:ring-focus-error' : 'focus:ring-focus'}
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-quick ease-out-expo
            ${className}
          `}
          {...rest}
        />

        {trailingIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-snug text-text-tertiary">
            {trailingIcon}
          </span>
        )}
      </div>

      {hasHelper && (
        <p
          id={helperId}
          className={`type-caption ${error ? 'text-status-error' : 'text-text-tertiary'}`}
        >
          {error || description}
        </p>
      )}
    </div>
  );
});
