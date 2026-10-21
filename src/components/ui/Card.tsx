import React, { HTMLAttributes, forwardRef } from 'react';

export type CardVariant = 'default' | 'raised' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all overflow-hidden';
    
    const variantStyles: Record<CardVariant, string> = {
      default: 'bg-white border-2 border-slate-200/80 shadow-sm',
      raised: 'bg-white border-2 border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(11,31,42,0.06)]',
      interactive:
        'bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(11,31,42,0.04)] hover:border-[#00C2D1] hover:shadow-[0_10px_28px_rgba(11,31,42,0.09)] cursor-pointer active:scale-[0.99]',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`p-5 pb-3 border-b border-slate-100 space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = '', ...props }, ref) => (
    <h3 ref={ref} className={`font-montserrat font-bold text-base text-[#0B1F2A] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`text-xs text-[#5A6B7C] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`p-4 pt-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs ${className}`} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
