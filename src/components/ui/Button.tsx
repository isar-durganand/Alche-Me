import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'success';
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
      'inline-flex items-center justify-center font-montserrat font-bold rounded-xl transition-all select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--cq-focus)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none tracking-tight';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px]',
      md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
      lg: 'text-base px-6 py-2.5 gap-2.5 min-h-[50px]',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#00C2D1] text-white border-b-4 border-[#008E9B] hover:bg-[#00D5E5] active:border-b-0 active:translate-y-1 shadow-sm',
      gold:
        'bg-[#F5B942] text-[#0B1F2A] border-b-4 border-[#D99926] hover:bg-[#F8C760] active:border-b-0 active:translate-y-1 shadow-sm font-extrabold',
      success:
        'bg-[#10B981] text-white border-b-4 border-[#059669] hover:bg-[#1ed194] active:border-b-0 active:translate-y-1 shadow-sm',
      secondary:
        'bg-white text-[#0B1F2A] border-2 border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 hover:border-slate-300 active:border-b-2 active:translate-y-0.5 shadow-sm',
      outline:
        'bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-[#00C2D1] hover:text-[#00C2D1] hover:bg-teal-50/50',
      ghost:
        'bg-transparent text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100/80',
      danger:
        'bg-[#EF4444] text-white border-b-4 border-[#DC2626] hover:bg-red-500 active:border-b-0 active:translate-y-1 shadow-sm',
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
