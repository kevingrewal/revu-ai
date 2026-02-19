import { useNavigate } from 'react-router-dom';
import type { Category } from '../../types/product';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/categories/${category.slug}`)}>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {category.name}
        </h3>
        <Badge variant="primary">
          {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
        </Badge>
      </div>
    </Card>
  );
};
