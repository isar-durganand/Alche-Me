import React, { HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors select-none';

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 leading-none',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-[var(--cq-surface-raised)] text-[var(--cq-text-muted)] border-[var(--cq-border)]',
    accent: 'bg-[var(--cq-accent-subtle)] text-[var(--cq-accent)] border-[var(--cq-accent)]/30',
    success: 'bg-[var(--cq-success-subtle)] text-[var(--cq-success)] border-[var(--cq-success)]/30',
    warning: 'bg-[var(--cq-warning-subtle)] text-[var(--cq-warning)] border-[var(--cq-warning)]/30',
    danger: 'bg-[var(--cq-danger-subtle)] text-[var(--cq-danger)] border-[var(--cq-danger)]/30',
  };

  const dotColors: Record<BadgeVariant, string> = {
    neutral: 'bg-[var(--cq-text-muted)]',
    accent: 'bg-[var(--cq-accent)]',
    success: 'bg-[var(--cq-success)]',
    warning: 'bg-[var(--cq-warning)]',
    danger: 'bg-[var(--cq-danger)]',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
