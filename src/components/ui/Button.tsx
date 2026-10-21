import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--cq-focus)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
      md: 'text-sm px-3.5 py-2 gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--cq-accent)] text-[#101317] font-semibold hover:bg-[var(--cq-accent-hover)] active:bg-[var(--cq-accent-strong)] shadow-sm',
      secondary:
        'bg-[var(--cq-surface-raised)] text-[var(--cq-text)] hover:bg-[var(--cq-surface-hover)] border border-[var(--cq-border)]',
      outline:
        'bg-transparent text-[var(--cq-text)] border border-[var(--cq-border)] hover:border-[var(--cq-accent)] hover:text-[var(--cq-accent)] hover:bg-[var(--cq-accent-subtle)]',
      ghost:
        'bg-transparent text-[var(--cq-text-muted)] hover:text-[var(--cq-text)] hover:bg-[var(--cq-surface-raised)]',
      danger:
        'bg-[var(--cq-danger)] text-white hover:opacity-90 active:opacity-100 shadow-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
