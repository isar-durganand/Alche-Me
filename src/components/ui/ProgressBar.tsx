import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'accent',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillColors = {
    accent: 'bg-[var(--cq-accent)]',
    success: 'bg-[var(--cq-success)]',
    warning: 'bg-[var(--cq-warning)]',
    danger: 'bg-[var(--cq-danger)]',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-medium text-[var(--cq-text)]">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-[11px] text-[var(--cq-text-muted)]">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={`w-full bg-[var(--cq-surface-raised)] border border-[var(--cq-border)]/60 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`${sizeStyles[size]} ${fillColors[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
