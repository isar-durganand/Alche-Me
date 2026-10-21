import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'gold';
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
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const fillColors = {
    accent: 'bg-gradient-to-r from-[#00C2D1] to-[#00E5F7] shadow-sm',
    gold: 'bg-gradient-to-r from-[#F5B942] to-[#FFD166] shadow-sm',
    success: 'bg-gradient-to-r from-[#10B981] to-[#34D399] shadow-sm',
    warning: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] shadow-sm',
    danger: 'bg-gradient-to-r from-[#EF4444] to-[#F87171] shadow-sm',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-montserrat font-bold text-[#0B1F2A]">{label}</span>}
          {showPercentage && (
            <span className="font-montserrat font-extrabold text-xs text-[#5A6B7C]">
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
        className={`w-full bg-slate-100 border-2 border-slate-200/80 rounded-full overflow-hidden p-[2px] ${sizeStyles[size]}`}
      >
        <div
          className={`h-full ${fillColors[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
