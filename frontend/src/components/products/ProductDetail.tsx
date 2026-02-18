import { ExternalLink } from 'lucide-react';
import type { ProductDetail as ProductDetailType } from '../../types/product';
import { RatingBadge } from './RatingBadge';
import { ProConsList } from '../reviews/ProConsList';
import { ReviewList } from '../reviews/ReviewList';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/formatters';

interface ProductDetailProps {
  product: ProductDetailType;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  // Aggregate pros and cons from all reviews
  const allPros = product.reviews.flatMap((review) => review.pros);
  const allCons = product.reviews.flatMap((review) => review.cons);

  // Get unique pros and cons (take top 5 each)
  const uniquePros = Array.from(new Set(allPros)).slice(0, 5);
  const uniqueCons = Array.from(new Set(allCons)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">No image</div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <RatingBadge rating={product.rating} size="lg" />
                <span className="text-gray-600">
                  Based on {product.review_count} reviews
                </span>
              </div>

              {product.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="text-4xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {product.source_url && (
              <Button
                size="lg"
                onClick={() => window.open(product.source_url!, '_blank')}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  Buy Now
                  <ExternalLink className="h-5 w-5" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Pros and Cons */}
      {(uniquePros.length > 0 || uniqueCons.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pros & Cons
          </h2>
          <ProConsList pros={uniquePros} cons={uniqueCons} />
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        <ReviewList reviews={product.reviews} limit={5} />
      </div>
    </div>
  );
};
