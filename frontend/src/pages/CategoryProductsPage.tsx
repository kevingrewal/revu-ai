import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { ChevronRight } from 'lucide-react';

export const CategoryProductsPage = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useProducts({
    category: slug,
    sort: 'rating_desc',
  });

  const categoryName = slug?.replace('-', ' ') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <Link to="/categories" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-slate-100 capitalize">{categoryName}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2 capitalize">
          {categoryName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {data?.total || 0} products found
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
          Error loading products. Please try again.
        </div>
      )}

      <ProductGrid
        products={data?.products || []}
        isLoading={isLoading}
      />
    </div>
  );
};
