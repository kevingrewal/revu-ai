import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`${sizeMap[size]} animate-spin text-brand-500 dark:text-brand-400 ${className}`} />
    </div>
  );
};
