import { useCategories } from '../hooks/useCategories';
import { CategoryGrid } from '../components/categories/CategoryGrid';

export const CategoriesPage = () => {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse by Category
        </h1>
        <p className="text-gray-600">
          Explore products organized by category
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading categories. Please try again.
        </div>
      )}

      <CategoryGrid
        categories={categories || []}
        isLoading={isLoading}
      />
    </div>
  );
};
