import { useState } from 'react';
import type { Review } from '../../types/product';
import { Badge } from '../ui/Badge';

interface ReviewCardProps {
  review: Review;
}

const sourceColors: Record<Review['source'], 'default' | 'primary' | 'success' | 'warning'> = {
  amazon: 'warning',
  ebay: 'primary',
  tiktok: 'default',
  etsy: 'success',
};

const getSentimentBorderColor = (score: number) => {
  if (score > 0.6) return 'border-l-emerald-500';
  if (score > 0.3) return 'border-l-amber-500';
  return 'border-l-red-500';
};

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;
  const needsTruncation = review.text.length > maxLength;

  return (
    <div
      className={`bg-white dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-xl p-4 border-l-4 ${getSentimentBorderColor(review.sentiment_score)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant={sourceColors[review.source]}>
          {review.source.toUpperCase()}
        </Badge>
        <span
          className={`text-xs font-medium ${
            review.sentiment_score > 0.6
              ? 'text-emerald-600 dark:text-emerald-400'
              : review.sentiment_score > 0.3
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {review.sentiment_score > 0.6
            ? 'Positive'
            : review.sentiment_score > 0.3
            ? 'Mixed'
            : 'Negative'}
        </span>
      </div>

      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {expanded || !needsTruncation
          ? review.text
          : `${review.text.slice(0, maxLength)}...`}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium mt-2 transition-colors"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};
