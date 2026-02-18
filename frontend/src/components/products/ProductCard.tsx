import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RatingBadge } from './RatingBadge';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/products/${product.id}`)}>
      <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3">
          <RatingBadge rating={product.rating} size="sm" />
          <span className="text-xs text-gray-500">{product.review_count} reviews</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.category && (
            <Badge variant="primary" className="text-xs">
              {product.category.replace('-', ' ')}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
