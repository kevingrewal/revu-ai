import { Star } from 'lucide-react';
import { formatRating, getRatingColor } from '../../utils/formatters';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

const colorStyles = {
  excellent: 'bg-rating-excellent text-white',
  good: 'bg-rating-good text-white',
  mixed: 'bg-rating-mixed text-white',
  poor: 'bg-rating-poor text-white',
};

export const RatingBadge = ({ rating, size = 'md' }: RatingBadgeProps) => {
  const colorClass = getRatingColor(rating);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeStyles[size]} ${colorStyles[colorClass as keyof typeof colorStyles]}`}
    >
      <Star className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      {formatRating(rating)}
    </span>
  );
};
