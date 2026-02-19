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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/categories" className="hover:text-blue-600">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 capitalize">{categoryName}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          {categoryName}
        </h1>
        <p className="text-gray-600">
          {data?.total || 0} products found
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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
