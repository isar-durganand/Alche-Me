import React, { HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'gold';
export type BadgeSize = 'sm' | 'md' | 'lg';

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
  const baseStyles = 'inline-flex items-center font-montserrat font-bold rounded-full border transition-colors select-none tracking-tight';

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5 leading-tight',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    accent: 'bg-teal-50 text-teal-800 border-teal-200/80',
    gold: 'bg-amber-50 text-amber-900 border-amber-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-orange-50 text-orange-900 border-orange-200/80',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
  };

  const dotColors: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-400',
    accent: 'bg-[#00C2D1]',
    gold: 'bg-[#F5B942]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]} shrink-0`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
