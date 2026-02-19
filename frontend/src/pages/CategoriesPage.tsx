import { useCategories } from '../hooks/useCategories';
import { CategoryGrid } from '../components/categories/CategoryGrid';

export const CategoriesPage = () => {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          Browse by Category
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Explore products organized by category
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
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
