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
      <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 dark:text-slate-500 text-sm">No image</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <RatingBadge rating={product.rating} size="sm" />
          <span className="text-xs text-slate-500 dark:text-slate-400">{product.review_count} reviews</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
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
