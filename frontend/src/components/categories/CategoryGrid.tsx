import type { Category } from '../../types/product';
import { CategoryCard } from './CategoryCard';
import { Spinner } from '../ui/Spinner';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export const CategoryGrid = ({ categories, isLoading = false }: CategoryGridProps) => {
  if (isLoading) {
    return (
      <div className="py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No categories found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};
