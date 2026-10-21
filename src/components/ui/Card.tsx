import React, { HTMLAttributes, forwardRef } from 'react';

export type CardVariant = 'default' | 'raised' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'rounded-xl border border-[var(--cq-border)] transition-all overflow-hidden';
    
    const variantStyles: Record<CardVariant, string> = {
      default: 'bg-[var(--cq-surface)]',
      raised: 'bg-[var(--cq-surface-raised)] shadow-md',
      interactive:
        'bg-[var(--cq-surface)] hover:bg-[var(--cq-surface-hover)] hover:border-[var(--cq-accent)] hover:shadow-lg cursor-pointer active:scale-[0.99]',
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
    <div ref={ref} className={`p-5 pb-3 border-b border-[var(--cq-border)]/60 space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = '', ...props }, ref) => (
    <h3 ref={ref} className={`font-bold text-base text-[var(--cq-text)] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`text-xs text-[var(--cq-text-muted)] leading-relaxed ${className}`} {...props}>
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
    <div ref={ref} className={`p-4 pt-3 border-t border-[var(--cq-border)]/60 bg-[var(--cq-surface-raised)]/40 flex items-center justify-between gap-3 text-xs ${className}`} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
