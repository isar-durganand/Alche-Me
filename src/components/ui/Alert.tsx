import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const icons: Record<AlertVariant, React.ReactNode> = {
    info: <Info className="w-5 h-5 text-[var(--cq-accent)] shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-[var(--cq-success)] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[var(--cq-warning)] shrink-0" />,
    danger: <AlertOctagon className="w-5 h-5 text-[var(--cq-danger)] shrink-0" />,
  };

  const variantStyles: Record<AlertVariant, string> = {
    info: 'bg-[var(--cq-accent-subtle)] border-[var(--cq-accent)]/40 text-[var(--cq-text)]',
    success: 'bg-[var(--cq-success-subtle)] border-[var(--cq-success)]/40 text-[var(--cq-text)]',
    warning: 'bg-[var(--cq-warning-subtle)] border-[var(--cq-warning)]/40 text-[var(--cq-text)]',
    danger: 'bg-[var(--cq-danger-subtle)] border-[var(--cq-danger)]/40 text-[var(--cq-text)]',
  };

  return (
    <div
      role="alert"
      className={`relative p-4 rounded-xl border flex items-start gap-3 text-sm ${variantStyles[variant]} ${className}`}
    >
      {icons[variant]}
      <div className="flex-1 space-y-0.5">
        {title && <h4 className="font-semibold text-sm leading-tight">{title}</h4>}
        <div className="text-xs text-[var(--cq-text-muted)] leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="p-1 rounded-md hover:bg-black/20 text-[var(--cq-text-muted)] hover:text-[var(--cq-text)] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
