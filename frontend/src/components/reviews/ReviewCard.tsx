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

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;
  const needsTruncation = review.text.length > maxLength;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <Badge variant={sourceColors[review.source]}>
          {review.source.toUpperCase()}
        </Badge>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              review.sentiment_score > 0.6
                ? 'text-green-600'
                : review.sentiment_score > 0.3
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {review.sentiment_score > 0.6
              ? 'Positive'
              : review.sentiment_score > 0.3
              ? 'Mixed'
              : 'Negative'}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">
        {expanded || !needsTruncation
          ? review.text
          : `${review.text.slice(0, maxLength)}...`}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};
