import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border overflow-hidden transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-500'
          : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
