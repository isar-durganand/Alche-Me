import React, { InputHTMLAttributes, forwardRef } from 'react';
import { X } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      onClear,
      value,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--cq-text)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--cq-text-muted)] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full bg-[var(--cq-surface-raised)] text-[var(--cq-text)] placeholder-[var(--cq-text-muted)] text-sm rounded-lg border transition-colors ${
              error
                ? 'border-[var(--cq-danger)] focus:border-[var(--cq-danger)]'
                : 'border-[var(--cq-border)] focus:border-[var(--cq-accent)]'
            } ${leftIcon ? 'pl-9' : 'pl-3.5'} ${onClear && value ? 'pr-9' : 'pr-3.5'} py-2 focus:outline-none focus:ring-1 focus:ring-[var(--cq-accent)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {onClear && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="absolute right-3 p-1 rounded-md text-[var(--cq-text-muted)] hover:text-[var(--cq-text)] hover:bg-[var(--cq-surface-hover)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-[11px] text-[var(--cq-danger)] font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-[11px] text-[var(--cq-text-muted)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
