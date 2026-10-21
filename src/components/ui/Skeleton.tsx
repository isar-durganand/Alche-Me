import React, { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-[var(--cq-surface-raised)] border border-[var(--cq-border)]/40 ${className}`}
      {...props}
    />
  );
};
