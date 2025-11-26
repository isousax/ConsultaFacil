import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, className, padding = 'md' }: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
