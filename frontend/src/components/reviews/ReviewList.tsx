import type { Review } from '../../types/product';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  limit?: number;
}

export const ReviewList = ({ reviews, limit }: ReviewListProps) => {
  const displayReviews = limit ? reviews.slice(0, limit) : reviews;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {limit && reviews.length > limit && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Showing {limit} of {reviews.length} reviews
        </p>
      )}
    </div>
  );
};
